import {
  ACADEMY_LEDGER_EVENT_MESSAGE,
  ACADEMY_LEDGER_REQUEST_MESSAGE,
  ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
  type AcademyLedgerEvent,
  type AcademyLedgerEventMessage,
  type AcademyLedgerSnapshotMessage,
} from '../../../../contracts/academy-ledger';
import type { Card, GameState } from './simulation';

const CARD_GOBLIN_GAME_ID = 'tga-04';

type ParentMessenger = Readonly<{
  postMessage: (message: unknown, targetOrigin: string) => void;
}>;

type LedgerEntryInput = Readonly<{
  kind: string;
  title: string;
  summary: string;
  phase?: string;
  turn?: number;
  details?: Readonly<Record<string, unknown>>;
}>;

export type CardGoblinLedger = Readonly<{
  append: (entry: LedgerEntryInput) => AcademyLedgerEvent;
  events: () => readonly AcademyLedgerEvent[];
  snapshot: () => AcademyLedgerSnapshotMessage;
  reset: () => void;
  handleHubMessage: (message: unknown) => boolean;
}>;

type CardGoblinAction =
  | Readonly<{ type: 'play-card'; card: Card; handIndex: number }>
  | Readonly<{ type: 'spark-replacement'; card: Card; handIndex: number }>;

export type CardGoblinTransition = Readonly<{
  before: GameState;
  after: GameState;
  action: CardGoblinAction;
}>;

const freezeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return Object.freeze(value.map(freezeValue));
  }
  if (value && typeof value === 'object') {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, freezeValue(nested)]),
    ));
  }
  return value;
};

const freezeEvent = (event: AcademyLedgerEvent): AcademyLedgerEvent => Object.freeze({
  ...event,
  details: event.details
    ? freezeValue(event.details) as Readonly<Record<string, unknown>>
    : undefined,
});

const defaultRunIdFactory = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `card-goblin-${Math.random().toString(36).slice(2)}`;
};

export const createCardGoblinLedger = (options: Readonly<{
  runIdFactory?: () => string;
  parent: ParentMessenger | null;
}>): CardGoblinLedger => {
  const runIdFactory = options.runIdFactory ?? defaultRunIdFactory;
  let runId = '';
  let receipts: readonly AcademyLedgerEvent[] = Object.freeze([]);

  const snapshot = (): AcademyLedgerSnapshotMessage => Object.freeze({
    type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
    gameId: CARD_GOBLIN_GAME_ID,
    runId,
    events: receipts,
  });

  const publishSnapshot = (): void => {
    options.parent?.postMessage(snapshot(), '*');
  };

  const append = (entry: LedgerEntryInput): AcademyLedgerEvent => {
    const sequence = receipts.length + 1;
    const event = freezeEvent({
      gameId: CARD_GOBLIN_GAME_ID,
      runId,
      sequence,
      eventId: `${runId}:${sequence}:${entry.kind}`,
      kind: entry.kind,
      title: entry.title,
      summary: entry.summary,
      phase: entry.phase,
      turn: entry.turn,
      details: entry.details,
    });
    receipts = Object.freeze([...receipts, event]);
    const message: AcademyLedgerEventMessage = Object.freeze({
      type: ACADEMY_LEDGER_EVENT_MESSAGE,
      event,
    });
    options.parent?.postMessage(message, '*');
    return event;
  };

  const startRun = (reason: 'initial' | 'reset'): void => {
    runId = runIdFactory();
    receipts = Object.freeze([]);
    const event = freezeEvent({
      gameId: CARD_GOBLIN_GAME_ID,
      runId,
      sequence: 1,
      eventId: `${runId}:1:run.started`,
      kind: 'run.started',
      title: 'New Duel',
      summary: 'A new Card Goblin duel began.',
      phase: 'PlayerAction',
      details: { reason },
    });
    receipts = Object.freeze([event]);
    publishSnapshot();
  };

  const handleHubMessage = (message: unknown): boolean => {
    if (!message || typeof message !== 'object') return false;
    const candidate = message as { type?: unknown; gameId?: unknown };
    if (candidate.type !== ACADEMY_LEDGER_REQUEST_MESSAGE) return false;
    if (candidate.gameId !== CARD_GOBLIN_GAME_ID) return false;
    publishSnapshot();
    return true;
  };

  startRun('initial');

  return Object.freeze({
    append,
    events: () => receipts,
    snapshot,
    reset: () => startRun('reset'),
    handleHubMessage,
  });
};

const newestLog = (transition: CardGoblinTransition, startsWith: string): string | undefined => (
  transition.after.log
    .slice(transition.before.log.length)
    .find((entry) => entry.startsWith(startsWith))
);

const appendEnemyResponse = (
  journal: CardGoblinLedger,
  transition: CardGoblinTransition,
): void => {
  const newEntries = transition.after.log.slice(transition.before.log.length);
  const response = newEntries.find((entry) => entry.startsWith('Card Goblin'));
  if (!response) return;

  const reducedDamage = response.match(/reduced it to (\d+)/)?.[1];
  const damage = reducedDamage ? Number(reducedDamage) : 0;
  journal.append({
    kind: 'enemy.response',
    title: 'Card Goblin Responded',
    summary: response,
    phase: transition.after.phase,
    details: damage > 0
      ? { hpChanges: [{ target: 'player', delta: -damage }] }
      : { hpChanges: [] },
  });
};

const appendTerminal = (
  journal: CardGoblinLedger,
  transition: CardGoblinTransition,
): void => {
  if (transition.before.phase === 'Terminal' || transition.after.phase !== 'Terminal') return;
  const victory = transition.after.enemyHp <= 0;
  journal.append({
    kind: victory ? 'duel.victory' : 'duel.defeat',
    title: victory ? 'Victory' : 'Defeat',
    summary: transition.after.log.at(-1) ?? (victory
      ? 'The Card Goblin was defeated.'
      : 'The player was defeated.'),
    phase: 'Terminal',
    details: {
      playerHp: Math.max(0, transition.after.playerHp),
      enemyHp: Math.max(0, transition.after.enemyHp),
    },
  });
};

const cardEffectDetails = (
  card: Card,
  before: GameState,
): Readonly<Record<string, unknown>> => {
  switch (card) {
    case 'Strike':
      return { card, hpChanges: [{ target: 'enemy', delta: -2 }] };
    case 'Heavy Bonk':
      return { card, hpChanges: [{ target: 'enemy', delta: -4 }] };
    case 'Spark':
      return { card, hpChanges: [{ target: 'enemy', delta: -1 }] };
    case 'Mend': {
      const healed = Math.min(10, before.playerHp + 2) - before.playerHp;
      return { card, hpChanges: healed > 0 ? [{ target: 'player', delta: healed }] : [] };
    }
    default:
      return { card, hpChanges: [] };
  }
};

export const publishCardGoblinTransition = (
  journal: CardGoblinLedger,
  transition: CardGoblinTransition,
): void => {
  if (transition.action.type === 'spark-replacement') {
    journal.append({
      kind: 'spark.replacement-selected',
      title: 'Spark Replacement Chosen',
      summary: newestLog(transition, 'Replaced ')
        ?? `Replaced ${transition.action.card}.`,
      phase: transition.after.phase,
      details: {
        card: transition.action.card,
        handIndex: transition.action.handIndex,
      },
    });
    appendEnemyResponse(journal, transition);
    appendTerminal(journal, transition);
    return;
  }

  const { card, handIndex } = transition.action;
  journal.append({
    kind: 'card.selected',
    title: `${card} Selected`,
    summary: `The player selected ${card}.`,
    phase: transition.before.phase,
    details: { card, handIndex },
  });

  const effectSummary = transition.after.log[transition.before.log.length]
    ?? `${card} resolved.`;
  journal.append({
    kind: 'card.effect',
    title: `${card} Resolved`,
    summary: effectSummary,
    phase: transition.after.phase,
    details: cardEffectDetails(card, transition.before),
  });

  if (card === 'Guard' || card === 'Stun') {
    journal.append({
      kind: 'status.applied',
      title: `${card} Applied`,
      summary: card === 'Guard'
        ? 'Guard was applied to the next enemy attack.'
        : 'Stun was applied to the next enemy attack.',
      phase: transition.after.phase,
      details: { status: card.toLowerCase() },
    });
  }

  if (card === 'Spark' && transition.after.phase === 'SparkChoice') {
    journal.append({
      kind: 'spark.replacement-requested',
      title: 'Spark Replacement Requested',
      summary: 'Choose one card in hand to replace.',
      phase: 'SparkChoice',
      details: { availableCards: [...transition.after.hand] },
    });
  }

  if (card === 'Heavy Bonk') {
    journal.append({
      kind: 'draw.skipped',
      title: 'Draw Skipped',
      summary: newestLog(transition, 'Skip Draw:') ?? 'No cards were drawn this turn.',
      phase: transition.after.phase,
      details: { source: card },
    });
  }

  appendEnemyResponse(journal, transition);
  appendTerminal(journal, transition);
};
