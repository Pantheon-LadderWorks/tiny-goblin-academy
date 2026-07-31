import {
  ACADEMY_LEDGER_EVENT_MESSAGE,
  ACADEMY_LEDGER_REQUEST_MESSAGE,
  ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
  type AcademyLedgerEvent,
  type AcademyLedgerEventMessage,
  type AcademyLedgerSnapshotMessage,
} from '../../../../contracts/academy-ledger';
import type { Direction, GameState, Position } from './simulation';

const DUNGEON_KEY_GAME_ID = 'tga-05';

type ParentMessenger = Readonly<{
  postMessage: (message: unknown, targetOrigin: string) => void;
}>;

type LedgerEntryInput = Readonly<{
  kind: string;
  title: string;
  summary: string;
  phase?: string;
  details?: Readonly<Record<string, unknown>>;
}>;

export type DungeonKeyLedger = Readonly<{
  append: (entry: LedgerEntryInput) => AcademyLedgerEvent;
  events: () => readonly AcademyLedgerEvent[];
  snapshot: () => AcademyLedgerSnapshotMessage;
  reset: () => void;
  handleHubMessage: (message: unknown) => boolean;
}>;

export type DungeonKeyTransition = Readonly<{
  before: GameState;
  after: GameState;
  direction: Direction;
}>;

const freezeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return Object.freeze(value.map(freezeValue));
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
  return `dungeon-key-${Math.random().toString(36).slice(2)}`;
};

export const createDungeonKeyLedger = (options: Readonly<{
  runIdFactory?: () => string;
  parent: ParentMessenger | null;
}>): DungeonKeyLedger => {
  const runIdFactory = options.runIdFactory ?? defaultRunIdFactory;
  let runId = '';
  let receipts: readonly AcademyLedgerEvent[] = Object.freeze([]);

  const snapshot = (): AcademyLedgerSnapshotMessage => Object.freeze({
    type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
    gameId: DUNGEON_KEY_GAME_ID,
    runId,
    events: receipts,
  });

  const publishSnapshot = (): void => {
    options.parent?.postMessage(snapshot(), '*');
  };

  const append = (entry: LedgerEntryInput): AcademyLedgerEvent => {
    const sequence = receipts.length + 1;
    const event = freezeEvent({
      gameId: DUNGEON_KEY_GAME_ID,
      runId,
      sequence,
      eventId: `${runId}:${sequence}:${entry.kind}`,
      kind: entry.kind,
      title: entry.title,
      summary: entry.summary,
      phase: entry.phase,
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
      gameId: DUNGEON_KEY_GAME_ID,
      runId,
      sequence: 1,
      eventId: `${runId}:1:run.started`,
      kind: 'run.started',
      title: 'Ruin Hall Entered',
      summary: 'A new Dungeon Key Run began in Ruin Hall.',
      phase: 'playing',
      details: { reason },
    });
    receipts = Object.freeze([event]);
    publishSnapshot();
  };

  const handleHubMessage = (message: unknown): boolean => {
    if (!message || typeof message !== 'object') return false;
    const candidate = message as { type?: unknown; gameId?: unknown };
    if (candidate.type !== ACADEMY_LEDGER_REQUEST_MESSAGE) return false;
    if (candidate.gameId !== DUNGEON_KEY_GAME_ID) return false;
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

const samePosition = (left: Position, right: Position): boolean => (
  left.x === right.x && left.y === right.y
);

const copyPosition = ({ x, y }: Position): Position => ({ x, y });

const newSimulationEntries = (transition: DungeonKeyTransition): readonly string[] => (
  transition.after.ledger.slice(transition.before.ledger.length)
);

export const publishDungeonKeyTransition = (
  ledger: DungeonKeyLedger,
  transition: DungeonKeyTransition,
): void => {
  const { before, after, direction } = transition;
  const simulationEntries = newSimulationEntries(transition);
  const playerMoved = !samePosition(before.player, after.player);

  if (!playerMoved) {
    const summary = simulationEntries.at(-1) ?? 'Movement was blocked.';
    ledger.append({
      kind: 'movement.blocked',
      title: 'Path Blocked',
      summary,
      phase: after.status,
      details: {
        direction,
        reason: summary.toLowerCase().includes('wall') ? 'wall' : 'bounds',
        player: copyPosition(after.player),
      },
    });
    return;
  }

  ledger.append({
    kind: 'movement.committed',
    title: `Moved ${direction[0].toUpperCase()}${direction.slice(1)}`,
    summary: `Moved ${direction} to tile (${after.player.x}, ${after.player.y}).`,
    phase: after.status,
    details: {
      direction,
      from: copyPosition(before.player),
      to: copyPosition(after.player),
    },
  });

  if (!before.hasKey && after.hasKey) {
    ledger.append({
      kind: 'key.collected',
      title: 'Gold Key Collected',
      summary: 'The gold key was collected. The Ruin Hall exit can now open.',
      phase: after.status,
      details: { keyPosition: copyPosition(after.keyPos) },
    });
  }

  const lockedExitAttempt = (
    !after.hasKey
    && samePosition(after.player, after.exitPos)
    && simulationEntries.some((entry) => entry.includes('Exit is locked.'))
  );
  if (lockedExitAttempt) {
    ledger.append({
      kind: 'exit.locked',
      title: 'Exit Locked',
      summary: 'The Ruin Hall exit is still locked.',
      phase: after.status,
      details: { exitPosition: copyPosition(after.exitPos) },
    });
  }

  if (before.status !== 'victory' && after.status === 'victory') {
    ledger.append({
      kind: 'exit.unlocked',
      title: 'Exit Unlocked',
      summary: simulationEntries.find((entry) => entry.includes('Exit unlocked.'))
        ?? 'The Ruin Hall exit opened.',
      phase: 'victory',
      details: { exitPosition: copyPosition(after.exitPos) },
    });
    ledger.append({
      kind: 'run.victory',
      title: 'Ruin Hall Cleared',
      summary: simulationEntries.at(-1) ?? 'Victory! You escaped the dungeon.',
      phase: 'victory',
      details: {
        player: copyPosition(after.player),
        hasKey: after.hasKey,
      },
    });
    return;
  }

  if (!samePosition(before.enemy, after.enemy)) {
    ledger.append({
      kind: 'enemy.patrolled',
      title: 'Thug Patrolled',
      summary: `The Thug patrolled to tile (${after.enemy.x}, ${after.enemy.y}).`,
      phase: after.status,
      details: {
        from: copyPosition(before.enemy),
        to: copyPosition(after.enemy),
        patrolIndex: after.patrolIndex,
      },
    });
  }

  if (before.status !== 'defeat' && after.status === 'defeat') {
    ledger.append({
      kind: 'run.defeat',
      title: 'Caught in Ruin Hall',
      summary: simulationEntries.at(-1) ?? 'Defeat! The dungeon claims another soul.',
      phase: 'defeat',
      details: {
        player: copyPosition(after.player),
        enemy: copyPosition(after.enemy),
      },
    });
  }
};
