import {describe, expect, it} from 'vitest';
import {createInitialState, movePlayer} from '../src/simulation';
import {
  RUIN_HALL_SCENE,
  assertRuinHallMatchesSimulation,
  buildDungeonPresentation,
  buildMovementTransition,
} from '../src/sceneAuthority';

describe('Ruin Hall production authority', () => {
  it('pins the approved public-source composition without private-review paths', () => {
    expect(RUIN_HALL_SCENE.id).toBe('tga-05.ruin-hall.production.v0.1');
    expect(RUIN_HALL_SCENE.floor.regions.map((region) => region.id)).toEqual([
      'terrain.stone-ruin.01',
      'terrain.stone-ruin.06',
      'terrain.stone-ruin.09',
    ]);
    expect(RUIN_HALL_SCENE.exit.doorLeafPolygon).toEqual([
      [19, 118], [19, 50], [22, 41], [28, 34], [38, 31],
      [48, 34], [54, 41], [57, 50], [57, 118],
    ]);
    expect(JSON.stringify(RUIN_HALL_SCENE)).not.toContain('.private-review');
    expect(JSON.stringify(RUIN_HALL_SCENE)).not.toContain('C:\\Users\\');
  });

  it('matches the frozen simulation topology exactly', () => {
    const state = createInitialState();
    expect(() => assertRuinHallMatchesSimulation(state)).not.toThrow();
    expect(RUIN_HALL_SCENE.grid).toEqual({columns: 10, rows: 10, tileSize: 32});
    expect(RUIN_HALL_SCENE.landmarks).toEqual({
      player: {x: 1, y: 2},
      enemy: {x: 7, y: 4},
      key: {x: 1, y: 7},
      exit: {x: 2, y: 2},
    });
  });

  it('derives locked, collected, victory, and defeat presentation from simulation truth', () => {
    const initial = buildDungeonPresentation(createInitialState());
    expect(initial).toMatchObject({
      keyVisible: true,
      exitState: 'locked',
      outcome: 'playing',
      objective: 'Find the gold key',
    });

    const withKeyState = {...createInitialState(), hasKey: true};
    expect(buildDungeonPresentation(withKeyState)).toMatchObject({
      keyVisible: false,
      exitState: 'open',
      objective: 'Reach the open archway',
    });

    expect(buildDungeonPresentation({...withKeyState, status: 'victory'})).toMatchObject({
      outcome: 'victory',
      banner: 'Ruin Hall Cleared',
    });
    expect(buildDungeonPresentation({...createInitialState(), status: 'defeat'})).toMatchObject({
      outcome: 'defeat',
      banner: 'Caught in the Hall',
    });
  });

  it('moves actors on the approved 660 ms cadence and preserves 1320 ms idle', () => {
    expect(RUIN_HALL_SCENE.actorProfile.idleDurationMs).toBe(1320);
    const before = createInitialState();
    const after = movePlayer(before, 'down');
    expect(buildMovementTransition(before, after, 'down')).toEqual({
      moved: true,
      direction: 'down',
      durationMs: 660,
      playerFrom: {x: 1, y: 2},
      playerTo: {x: 1, y: 3},
      enemyFrom: {x: 7, y: 4},
      enemyTo: {x: 8, y: 4},
    });

    const blockedStart = {...createInitialState(), player: {x: 1, y: 1}};
    const blockedEnd = movePlayer(blockedStart, 'up');
    expect(buildMovementTransition(blockedStart, blockedEnd, 'up')).toMatchObject({
      moved: false,
      durationMs: 0,
      playerFrom: {x: 1, y: 1},
      playerTo: {x: 1, y: 1},
      enemyFrom: {x: 7, y: 4},
      enemyTo: {x: 7, y: 4},
    });
  });
});
