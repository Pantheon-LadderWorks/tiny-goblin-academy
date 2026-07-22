import { describe, expect, it, vi } from 'vitest';
import {
  ACADEMY_LEDGER_EVENT_MESSAGE,
  ACADEMY_LEDGER_REQUEST_MESSAGE,
  ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
  type AcademyLedgerEvent,
} from '../../../../contracts/academy-ledger';
import {
  createCardGoblinLedger,
  publishCardGoblinTransition,
} from '../src/ledger-bridge';
import {
  applyAcademyLedgerMessage,
  createEmptyLedgerProjection,
  parseAcademyLedgerMessage,
} from '../../../../hub/src/runtimeLedger';
import { createGame, playCard, resolveSparkChoice } from '../src/simulation';

const fixedRunIds = (...ids: string[]) => {
  let index = 0;
  return () => ids[index++] ?? `unexpected-run-${index}`;
};

describe('H6.20C shared Academy Ledger contract', () => {
  it('starts an immutable Card Goblin run with deterministic sequence and event identity', () => {
    const journal = createCardGoblinLedger({
      runIdFactory: fixedRunIds('card-run-a'),
      parent: null,
    });

    expect(journal.snapshot()).toEqual({
      type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
      gameId: 'tga-04',
      runId: 'card-run-a',
      events: [{
        gameId: 'tga-04',
        runId: 'card-run-a',
        sequence: 1,
        eventId: 'card-run-a:1:run.started',
        kind: 'run.started',
        title: 'New Duel',
        summary: 'A new Card Goblin duel began.',
        phase: 'PlayerAction',
        details: { reason: 'initial' },
      }],
    });
    expect(Object.isFrozen(journal.snapshot().events[0])).toBe(true);
  });

  it('publishes one ordered immutable receipt stream for a committed Strike exchange', () => {
    const postMessage = vi.fn();
    const journal = createCardGoblinLedger({
      runIdFactory: fixedRunIds('card-run-a'),
      parent: { postMessage },
    });
    const before = createGame();
    const after = playCard(before, 0);

    publishCardGoblinTransition(journal, {
      before,
      after,
      action: { type: 'play-card', card: 'Strike', handIndex: 0 },
    });

    expect(journal.events().map(({ sequence, kind, title }) => ({ sequence, kind, title }))).toEqual([
      { sequence: 1, kind: 'run.started', title: 'New Duel' },
      { sequence: 2, kind: 'card.selected', title: 'Strike Selected' },
      { sequence: 3, kind: 'card.effect', title: 'Strike Resolved' },
      { sequence: 4, kind: 'enemy.response', title: 'Card Goblin Responded' },
    ]);
    expect(journal.events()[2].details).toMatchObject({
      card: 'Strike',
      hpChanges: [{ target: 'enemy', delta: -2 }],
    });
    expect(journal.events()[3].details).toMatchObject({
      hpChanges: [{ target: 'player', delta: -2 }],
    });
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: ACADEMY_LEDGER_EVENT_MESSAGE, event: journal.events()[3] }),
      '*',
    );
  });

  it('authors the two-step Spark sequence without treating replacement choice as another played card', () => {
    const journal = createCardGoblinLedger({
      runIdFactory: fixedRunIds('spark-run'),
      parent: null,
    });
    const start = createGame();
    start.hand = ['Strike', 'Guard', 'Spark'];
    const awaiting = playCard(start, 2);

    publishCardGoblinTransition(journal, {
      before: start,
      after: awaiting,
      action: { type: 'play-card', card: 'Spark', handIndex: 2 },
    });

    const resolved = resolveSparkChoice(awaiting, 1);
    publishCardGoblinTransition(journal, {
      before: awaiting,
      after: resolved,
      action: { type: 'spark-replacement', card: 'Guard', handIndex: 1 },
    });

    expect(journal.events().map((event) => event.kind)).toEqual([
      'run.started',
      'card.selected',
      'card.effect',
      'spark.replacement-requested',
      'spark.replacement-selected',
      'enemy.response',
    ]);
    expect(journal.events().filter((event) => event.kind === 'card.selected')).toHaveLength(1);
  });

  it('starts a new run on reset and publishes a replacing snapshot', () => {
    const postMessage = vi.fn();
    const journal = createCardGoblinLedger({
      runIdFactory: fixedRunIds('run-before-reset', 'run-after-reset'),
      parent: { postMessage },
    });

    journal.reset();

    expect(journal.snapshot().runId).toBe('run-after-reset');
    expect(journal.events()).toHaveLength(1);
    expect(journal.events()[0]).toMatchObject({
      sequence: 1,
      kind: 'run.started',
      details: { reason: 'reset' },
    });
    expect(postMessage).toHaveBeenLastCalledWith(journal.snapshot(), '*');
  });

  it('responds to a Hub snapshot request after reload or reconnection', () => {
    const postMessage = vi.fn();
    const journal = createCardGoblinLedger({
      runIdFactory: fixedRunIds('reconnect-run'),
      parent: { postMessage },
    });

    expect(journal.handleHubMessage({
      type: ACADEMY_LEDGER_REQUEST_MESSAGE,
      gameId: 'tga-04',
    })).toBe(true);
    expect(postMessage).toHaveBeenLastCalledWith(journal.snapshot(), '*');
    expect(journal.handleHubMessage({
      type: ACADEMY_LEDGER_REQUEST_MESSAGE,
      gameId: 'tga-03',
    })).toBe(false);
  });
});

describe('Hub Academy Ledger projection', () => {
  const event = (overrides: Partial<AcademyLedgerEvent> = {}): AcademyLedgerEvent => ({
    gameId: 'tga-04',
    runId: 'run-a',
    sequence: 1,
    eventId: 'run-a:1:run.started',
    kind: 'run.started',
    title: 'New Duel',
    summary: 'A new duel began.',
    ...overrides,
  });

  it('validates only messages for the active game', () => {
    const message = { type: ACADEMY_LEDGER_EVENT_MESSAGE, event: event() };
    expect(parseAcademyLedgerMessage(message, 'tga-04')).toEqual(message);
    expect(parseAcademyLedgerMessage(message, 'tga-03')).toBeNull();
    expect(parseAcademyLedgerMessage({ ...message, event: { ...event(), sequence: 0 } }, 'tga-04')).toBeNull();
  });

  it('deduplicates re-rendered events and orders receipts by sequence', () => {
    let projection = createEmptyLedgerProjection('tga-04');
    const second = event({
      sequence: 2,
      eventId: 'run-a:2:card.selected',
      kind: 'card.selected',
      title: 'Strike Selected',
    });
    const first = event();

    projection = applyAcademyLedgerMessage(projection, {
      type: ACADEMY_LEDGER_EVENT_MESSAGE,
      event: second,
    });
    projection = applyAcademyLedgerMessage(projection, {
      type: ACADEMY_LEDGER_EVENT_MESSAGE,
      event: first,
    });
    projection = applyAcademyLedgerMessage(projection, {
      type: ACADEMY_LEDGER_EVENT_MESSAGE,
      event: second,
    });

    expect(projection.events.map((entry) => entry.sequence)).toEqual([1, 2]);
  });

  it('replaces the projection when a snapshot announces a new run', () => {
    const oldProjection = {
      gameId: 'tga-04',
      runId: 'old-run',
      events: [event({ runId: 'old-run', eventId: 'old-run:1:run.started' })],
    } as const;
    const newRunEvent = event({ runId: 'new-run', eventId: 'new-run:1:run.started' });

    const projection = applyAcademyLedgerMessage(oldProjection, {
      type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
      gameId: 'tga-04',
      runId: 'new-run',
      events: [newRunEvent],
    });

    expect(projection).toEqual({
      gameId: 'tga-04',
      runId: 'new-run',
      events: [newRunEvent],
    });
  });
});
