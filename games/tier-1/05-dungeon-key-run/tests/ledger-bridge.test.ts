import { describe, expect, it, vi } from 'vitest';
import {
  ACADEMY_LEDGER_EVENT_MESSAGE,
  ACADEMY_LEDGER_REQUEST_MESSAGE,
  ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
} from '../../../../contracts/academy-ledger';
import {
  applyAcademyLedgerMessage,
  createEmptyLedgerProjection,
  parseAcademyLedgerMessage,
} from '../../../../hub/src/runtimeLedger';
import {
  createDungeonKeyLedger,
  publishDungeonKeyTransition,
} from '../src/ledger-bridge';
import { createInitialState, movePlayer } from '../src/simulation';

const fixedRunIds = (...ids: string[]) => {
  let index = 0;
  return () => ids[index++] ?? `unexpected-run-${index}`;
};

describe('tga-05 Academy Ledger adapter', () => {
  it('starts one immutable ordered Ruin Hall run', () => {
    const ledger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('ruin-run-a'),
      parent: null,
    });

    expect(ledger.snapshot()).toEqual({
      type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
      gameId: 'tga-05',
      runId: 'ruin-run-a',
      events: [{
        gameId: 'tga-05',
        runId: 'ruin-run-a',
        sequence: 1,
        eventId: 'ruin-run-a:1:run.started',
        kind: 'run.started',
        title: 'Ruin Hall Entered',
        summary: 'A new Dungeon Key Run began in Ruin Hall.',
        phase: 'playing',
        details: { reason: 'initial' },
      }],
    });
    expect(Object.isFrozen(ledger.snapshot().events[0])).toBe(true);
  });

  it('authors blocked movement without inventing an enemy patrol', () => {
    const ledger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('blocked-run'),
      parent: null,
    });
    const first = movePlayer(createInitialState(), 'up');
    const blocked = movePlayer(first, 'up');

    publishDungeonKeyTransition(ledger, {
      before: first,
      after: blocked,
      direction: 'up',
    });

    expect(ledger.events().map((event) => event.kind)).toEqual([
      'run.started',
      'movement.blocked',
    ]);
    expect(ledger.events()[1]).toMatchObject({
      title: 'Path Blocked',
      summary: 'Blocked by a wall.',
      details: {
        direction: 'up',
        reason: 'wall',
        player: { x: 1, y: 1 },
      },
    });
  });

  it('records one committed movement followed by the simulation-owned patrol consequence', () => {
    const ledger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('move-run'),
      parent: null,
    });
    const before = createInitialState();
    const after = movePlayer(before, 'down');

    publishDungeonKeyTransition(ledger, { before, after, direction: 'down' });

    expect(ledger.events().map(({ sequence, kind }) => ({ sequence, kind }))).toEqual([
      { sequence: 1, kind: 'run.started' },
      { sequence: 2, kind: 'movement.committed' },
      { sequence: 3, kind: 'enemy.patrolled' },
    ]);
    expect(ledger.events()[1].details).toEqual({
      direction: 'down',
      from: { x: 1, y: 2 },
      to: { x: 1, y: 3 },
    });
    expect(ledger.events()[2].details).toEqual({
      from: { x: 7, y: 4 },
      to: { x: 8, y: 4 },
      patrolIndex: 1,
    });
  });

  it('authors key collection and locked-exit receipts from committed transitions', () => {
    const keyLedger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('key-run'),
      parent: null,
    });
    const keyBefore = { ...createInitialState(), player: { x: 1, y: 6 } };
    const keyAfter = movePlayer(keyBefore, 'down');
    publishDungeonKeyTransition(keyLedger, {
      before: keyBefore,
      after: keyAfter,
      direction: 'down',
    });

    expect(keyLedger.events().map((event) => event.kind)).toEqual([
      'run.started',
      'movement.committed',
      'key.collected',
      'enemy.patrolled',
    ]);
    expect(keyLedger.events()[2]).toMatchObject({
      title: 'Gold Key Collected',
      details: { keyPosition: { x: 1, y: 7 } },
    });

    const exitLedger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('locked-exit-run'),
      parent: null,
    });
    const exitBefore = createInitialState();
    const exitAfter = movePlayer(exitBefore, 'right');
    publishDungeonKeyTransition(exitLedger, {
      before: exitBefore,
      after: exitAfter,
      direction: 'right',
    });

    expect(exitLedger.events().map((event) => event.kind)).toEqual([
      'run.started',
      'movement.committed',
      'exit.locked',
      'enemy.patrolled',
    ]);
    expect(exitLedger.events()[2].summary).toBe('The Ruin Hall exit is still locked.');
  });

  it('authors terminal victory and defeat without changing simulation truth', () => {
    const victoryLedger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('victory-run'),
      parent: null,
    });
    const victoryBefore = {
      ...createInitialState(),
      player: { x: 3, y: 2 },
      hasKey: true,
    };
    const victoryAfter = movePlayer(victoryBefore, 'left');
    publishDungeonKeyTransition(victoryLedger, {
      before: victoryBefore,
      after: victoryAfter,
      direction: 'left',
    });

    expect(victoryAfter.status).toBe('victory');
    expect(victoryLedger.events().map((event) => event.kind)).toEqual([
      'run.started',
      'movement.committed',
      'exit.unlocked',
      'run.victory',
    ]);

    const defeatLedger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('defeat-run'),
      parent: null,
    });
    const defeatBefore = { ...createInitialState(), player: { x: 7, y: 4 } };
    const defeatAfter = movePlayer(defeatBefore, 'right');
    publishDungeonKeyTransition(defeatLedger, {
      before: defeatBefore,
      after: defeatAfter,
      direction: 'right',
    });

    expect(defeatAfter.status).toBe('defeat');
    expect(defeatLedger.events().map((event) => event.kind)).toEqual([
      'run.started',
      'movement.committed',
      'enemy.patrolled',
      'run.defeat',
    ]);
    expect(defeatLedger.events().at(-1)).toMatchObject({
      title: 'Caught in Ruin Hall',
      details: {
        player: { x: 8, y: 4 },
        enemy: { x: 8, y: 4 },
      },
    });
  });

  it('publishes incremental events, replaces the run on reset, and answers Hub snapshot requests', () => {
    const postMessage = vi.fn();
    const ledger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('before-reset', 'after-reset'),
      parent: { postMessage },
    });
    const before = createInitialState();
    const after = movePlayer(before, 'down');
    publishDungeonKeyTransition(ledger, { before, after, direction: 'down' });

    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: ACADEMY_LEDGER_EVENT_MESSAGE }),
      '*',
    );

    ledger.reset();
    expect(ledger.snapshot().runId).toBe('after-reset');
    expect(ledger.events()).toHaveLength(1);
    expect(ledger.events()[0]).toMatchObject({
      sequence: 1,
      kind: 'run.started',
      details: { reason: 'reset' },
    });
    expect(postMessage).toHaveBeenLastCalledWith(ledger.snapshot(), '*');

    expect(ledger.handleHubMessage({
      type: ACADEMY_LEDGER_REQUEST_MESSAGE,
      gameId: 'tga-05',
    })).toBe(true);
    expect(postMessage).toHaveBeenLastCalledWith(ledger.snapshot(), '*');
    expect(ledger.handleHubMessage({
      type: ACADEMY_LEDGER_REQUEST_MESSAGE,
      gameId: 'tga-04',
    })).toBe(false);
  });

  it('round-trips through the existing Hub parser and projection without Hub changes', () => {
    const ledger = createDungeonKeyLedger({
      runIdFactory: fixedRunIds('hub-run'),
      parent: null,
    });
    const before = createInitialState();
    const after = movePlayer(before, 'down');
    publishDungeonKeyTransition(ledger, { before, after, direction: 'down' });

    const parsed = parseAcademyLedgerMessage(ledger.snapshot(), 'tga-05');
    expect(parsed).not.toBeNull();
    const projection = applyAcademyLedgerMessage(
      createEmptyLedgerProjection('tga-05'),
      parsed!,
    );
    expect(projection.runId).toBe('hub-run');
    expect(projection.events.map((event) => event.kind)).toEqual([
      'run.started',
      'movement.committed',
      'enemy.patrolled',
    ]);
    expect(parseAcademyLedgerMessage(ledger.snapshot(), 'tga-04')).toBeNull();
  });
});
