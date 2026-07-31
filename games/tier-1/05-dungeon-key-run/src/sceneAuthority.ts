import type {Direction, GameState, Position} from './simulation';

type SourceRect = Readonly<{x: number; y: number; w: number; h: number}>;
type RegionAuthority = Readonly<{id: string; sourceRect: SourceRect}>;

export const RUIN_HALL_SCENE = Object.freeze({
  id: 'tga-05.ruin-hall.production.v0.1',
  reviewAuthority: 'dungeon-key-run.architecture-revision.v0.2',
  grid: {columns: 10, rows: 10, tileSize: 32},
  floor: {
    source: 'assets/academy/topdown/terrain/future-floor-tilesheets/sources/fantasy_dungeon_floor_tilesheet_textures.png',
    regions: [
      {id: 'terrain.stone-ruin.01', sourceRect: {x: 0, y: 0, w: 157, h: 157}},
      {id: 'terrain.stone-ruin.06', sourceRect: {x: 784, y: 0, w: 156, h: 157}},
      {id: 'terrain.stone-ruin.09', sourceRect: {x: 0, y: 157, w: 157, h: 157}},
    ] satisfies readonly RegionAuthority[],
  },
  walls: {
    horizontal: {
      id: 'topdown.walls.true-alpha.stone-brick-wall-short',
      source: 'assets/academy/topdown/walls/tga-topdown-walls-horizontal-true-alpha-regenerated-v0.2.png',
      sourceRect: {x: 43, y: 42, w: 220, h: 100},
    },
    vertical: {
      id: 'topdown.walls.vertical.tall-straight-stone-wall-column-01',
      source: 'assets/academy/topdown/walls/derived/tga-topdown-vertical-walls-cleaned-v0.1.png',
      sourceRect: {x: 15, y: 15, w: 61, h: 295},
    },
  },
  exit: {
    source: 'assets/academy/topdown/walls/derived/tga-topdown-vertical-walls-cleaned-v0.1.png',
    openArch: {
      id: 'topdown.walls.vertical.open-stone-archway-43',
      sourceRect: {x: 813, y: 612, w: 76, h: 128},
    },
    doorLeafSource: {
      id: 'topdown.walls.vertical.stone-doorway-with-wooden-door-42',
      sourceRect: {x: 701, y: 615, w: 76, h: 125},
      destinationOffset: {x: 0, y: 3},
    },
    doorLeafPolygon: [
      [19, 118], [19, 50], [22, 41], [28, 34], [38, 31],
      [48, 34], [54, 41], [57, 50], [57, 118],
    ] as const,
  },
  key: {
    id: 'shared-core.key.gold',
    source: 'assets/academy/derived-cleaned/shared-core/tga-shared-core-sheet-cleaned-preview-v0.1.png',
    sourceRect: {x: 1113, y: 446, w: 242, h: 270},
  },
  objects: {
    source: 'assets/academy/topdown/objects/derived/tga-topdown-nonfx-objects-cleaned-v0.1.png',
    regions: [
      {id: 'ruin-hall.object.12', sourceRect: {x: 504, y: 210, w: 95, h: 91}, tile: {x: 7, y: 7}},
      {id: 'ruin-hall.object.18', sourceRect: {x: 206, y: 333, w: 68, h: 132}, tile: {x: 8, y: 2}},
    ],
  },
  landmarks: {
    player: {x: 1, y: 2},
    enemy: {x: 7, y: 4},
    key: {x: 1, y: 7},
    exit: {x: 2, y: 2},
  },
  actorProfile: {
    displayHeightPx: 48,
    walkDurationMs: 660,
    idleDurationMs: 1320,
    logicalOrigin: 'bottom-center',
    rendering: 'uniform-smooth',
  },
} as const);

const positionKey = ({x, y}: Position): string => `${x},${y}`;

function expectedWallKeys(): string[] {
  const keys: string[] = [];
  for (let index = 0; index < 10; index += 1) {
    keys.push(`${index},0`, `${index},9`);
    if (index > 0 && index < 9) keys.push(`0,${index}`, `9,${index}`);
  }
  for (let x = 1; x <= 6; x += 1) keys.push(`${x},4`, `${x},5`);
  return keys.sort();
}

export function assertRuinHallMatchesSimulation(state: GameState): void {
  const actualWalls = state.walls.map(positionKey).sort();
  const expectedWalls = expectedWallKeys();
  if (JSON.stringify(actualWalls) !== JSON.stringify(expectedWalls)) {
    throw new Error('Ruin Hall wall topology does not match the frozen simulation.');
  }
  const expected = RUIN_HALL_SCENE.landmarks;
  const mismatches = [
    ['player', state.player, expected.player],
    ['enemy', state.enemy, expected.enemy],
    ['key', state.keyPos, expected.key],
    ['exit', state.exitPos, expected.exit],
  ].filter(([, actual, target]) => positionKey(actual as Position) !== positionKey(target as Position));
  if (mismatches.length > 0) {
    throw new Error(`Ruin Hall landmarks do not match: ${mismatches.map(([name]) => name).join(', ')}`);
  }
}

export interface DungeonPresentation {
  keyVisible: boolean;
  exitState: 'locked' | 'open';
  outcome: GameState['status'];
  objective: string;
  banner: string;
}

export function buildDungeonPresentation(state: GameState): DungeonPresentation {
  const outcomeBanner = state.status === 'victory'
    ? 'Ruin Hall Cleared'
    : state.status === 'defeat'
      ? 'Caught in the Hall'
      : '';
  return {
    keyVisible: !state.hasKey,
    exitState: state.hasKey ? 'open' : 'locked',
    outcome: state.status,
    objective: state.hasKey ? 'Reach the open archway' : 'Find the gold key',
    banner: outcomeBanner,
  };
}
export interface MovementTransition {
  moved: boolean;
  direction: Direction;
  durationMs: number;
  playerFrom: Position;
  playerTo: Position;
  enemyFrom: Position;
  enemyTo: Position;
}

export function buildMovementTransition(
  before: GameState,
  after: GameState,
  direction: Direction,
): MovementTransition {
  const moved = positionKey(before.player) !== positionKey(after.player);
  return {
    moved,
    direction,
    durationMs: moved ? RUIN_HALL_SCENE.actorProfile.walkDurationMs : 0,
    playerFrom: {...before.player},
    playerTo: {...after.player},
    enemyFrom: {...before.enemy},
    enemyTo: {...after.enemy},
  };
}
