import {RUIN_HALL_SCENE} from './sceneAuthority';
import type {GameState, Position} from './simulation';

export type TreatmentDebugLayer = 'grid' | 'collision' | 'patrol' | 'anchors';

export interface TreatmentRuntimeOptions {
  enabled: boolean;
  debug: TreatmentDebugLayer[];
}

export interface TreatmentLightState {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  visible: boolean;
}

export interface TreatmentMaskCutout {
  id: string;
  x: number;
  y: number;
  radius: number;
  strength: number;
}

const TILE = RUIN_HALL_SCENE.grid.tileSize;
const STAGE_SIZE = TILE * RUIN_HALL_SCENE.grid.columns;
const lightPoint = ({x, y}: Position): Readonly<{x: number; y: number}> => ({
  x: (x + .5) * TILE,
  y: (y + .62) * TILE,
});

export const PATROL_TENSION_TREATMENT = Object.freeze({
  id: 'patrol-tension-adjusted-b',
  name: 'Patrol Tension',
  reviewBase: 'B',
  enabledByDefault: true,
  stageOnly: true,
  simulationMutation: false,
  ledgerMutation: false,
  externalAssetDependencies: [] as readonly string[],
  ambient: {color: '#070d17', alpha: .18},
  lights: {
    player: {id: 'player-cool', color: '#9fd8ff', radius: 50, alpha: .23},
    key: {id: 'key-gold', color: '#ffd058', radius: 42, alpha: .32},
    exit: {id: 'exit-amber', color: '#ffb35f', radius: 54, alphaLocked: .16, alphaOpen: .34},
    enemy: {id: 'enemy-danger', color: '#ff6a75', radius: 48, alpha: .22},
  },
  patrolWear: {
    language: 'worn-footprints-and-boot-abrasion',
    color: '#8f7654',
    secondaryColor: '#695f50',
    alpha: .18,
    cells: [[7, 4], [8, 4], [8, 5], [7, 5]] as const,
    unbrokenRouteLine: false,
    impliesCollision: false,
  },
  foreground: {
    topLintelShadow: {rect: [32, 32, 256, 9] as const, alpha: .22},
    eastWallShadow: {rect: [286, 48, 4, 224] as const, alpha: .2},
  },
} as const);

const makeLight = (
  id: string,
  position: Position,
  radius: number,
  color: string,
  alpha: number,
  visible = true,
): TreatmentLightState => ({
  id,
  ...lightPoint(position),
  radius,
  color,
  alpha,
  visible,
});

const toCutout = (light: TreatmentLightState): TreatmentMaskCutout => ({
  id: light.id,
  x: Math.max(light.radius, Math.min(STAGE_SIZE - light.radius, light.x)),
  y: Math.max(light.radius, Math.min(STAGE_SIZE - light.radius, light.y)),
  radius: light.radius,
  strength: light.alpha,
});

export function buildTreatmentState(state: GameState) {
  const recipe = PATROL_TENSION_TREATMENT;
  const playerLight = makeLight(recipe.lights.player.id, state.player,
    recipe.lights.player.radius, recipe.lights.player.color, recipe.lights.player.alpha);
  const enemyLight = makeLight(recipe.lights.enemy.id, state.enemy,
    recipe.lights.enemy.radius, recipe.lights.enemy.color, recipe.lights.enemy.alpha,
    state.status !== 'defeat');
  const keyLight = makeLight(recipe.lights.key.id, state.keyPos,
    recipe.lights.key.radius, recipe.lights.key.color, recipe.lights.key.alpha,
    !state.hasKey);
  const exitLight = makeLight(recipe.lights.exit.id, state.exitPos,
    recipe.lights.exit.radius, recipe.lights.exit.color,
    state.hasKey ? recipe.lights.exit.alphaOpen : recipe.lights.exit.alphaLocked);
  const visibleLights = [playerLight, enemyLight, keyLight, exitLight]
    .filter((light) => light.visible);

  return {
    treatmentId: recipe.id,
    stageBounds: {x: 0, y: 0, width: STAGE_SIZE, height: STAGE_SIZE},
    ambient: recipe.ambient,
    playerLight,
    enemyLight,
    keyLight,
    exitLight,
    maskCutouts: visibleLights.map(toCutout),
    patrolWear: recipe.patrolWear,
    foreground: recipe.foreground,
    outcome: state.status,
  } as const;
}

const DEBUG_LAYERS: readonly TreatmentDebugLayer[] = ['grid', 'collision', 'patrol', 'anchors'];

export function resolveTreatmentRuntimeOptions(search: string): TreatmentRuntimeOptions {
  const params = new URLSearchParams(search);
  const enabled = params.get('treatment') !== 'off';
  const requested = (params.get('debug') ?? '').split(',').filter(Boolean);
  const debug = DEBUG_LAYERS.filter((layer) => requested.includes(layer));
  return {enabled, debug};
}
