import type { Card } from './simulation';

export type CardEffectMode = 'full' | 'reduced';
export type CardEffectBlendMode = 'normal' | 'add' | 'screen';
export type CardEffectTarget =
  | 'card-local'
  | 'draw-pile-local'
  | 'discard-pile-local'
  | 'enemy-target'
  | 'player-target'
  | 'travel'
  | 'tabletop-local';

export type CardEffectLayerKind =
  | 'surface-prep'
  | 'rim-glow'
  | 'rim-trace'
  | 'shine-sweep'
  | 'projectile'
  | 'trail-emitter'
  | 'impact-burst'
  | 'shockwave-ring'
  | 'orbiting-motes'
  | 'masked-card-particles'
  | 'shield-pulse'
  | 'healing-rise'
  | 'downward-impact'
  | 'dust-burst'
  | 'target-pulse'
  | 'stage-response'
  | 'render-texture-stamp'
  | 'pile-response'
  | 'draw-skip-cue'
  | 'victory-accent'
  | 'defeat-accent';

export const REQUIRED_EFFECT_PRIMITIVES = Object.freeze([
  'rim-glow',
  'rim-trace',
  'shine-sweep',
  'projectile',
  'trail-emitter',
  'impact-burst',
  'shockwave-ring',
  'orbiting-motes',
  'masked-card-particles',
  'shield-pulse',
  'healing-rise',
  'downward-impact',
  'dust-burst',
  'pile-response',
  'draw-skip-cue',
  'victory-accent',
  'defeat-accent',
] as const satisfies readonly CardEffectLayerKind[]);

export const CARD_EFFECT_COMPOSITION_GRAMMAR = Object.freeze([
  'preparation',
  'action',
  'impact-or-state',
  'hold',
  'decay',
  'cleanup',
] as const);

export type CardEffectMaterial =
  | 'capability-neutral'
  | 'physical-slash'
  | 'protection'
  | 'healing'
  | 'electricity'
  | 'control'
  | 'weight-impact'
  | 'enemy-impact'
  | 'victory'
  | 'defeat'
  | 'lifecycle';

export type CardEffectLayer = Readonly<{
  id: string;
  owner: CardEffectRecipeId;
  group: number;
  order: number;
  kind: CardEffectLayerKind;
  target: CardEffectTarget;
  durationMs: number;
  blendMode: CardEffectBlendMode;
  semantic: string;
  parameters?: Readonly<Record<string, string | number | boolean>>;
}>;

export type CardEffectStableState = Readonly<{
  temporaryObjects: 0;
  emitters: 0;
  masks: 0;
  fx: 0;
  listeners: 0;
  transform: 'identity';
}>;

export type CardEffectPlan = Readonly<{
  layers: readonly CardEffectLayer[];
  stableState: CardEffectStableState;
}>;

export type CardEffectRecipe = Readonly<{
  id: CardEffectRecipeId;
  label: string;
  card?: Card;
  color: number;
  full: CardEffectPlan;
  reduced: CardEffectPlan;
  customShaderSeam: 'future-optional';
  material: CardEffectMaterial;
  grammar: typeof CARD_EFFECT_COMPOSITION_GRAMMAR;
}>;

export type LayerSpec = Omit<CardEffectLayer, 'owner'>;

export const CARD_EFFECT_STABLE_STATE: CardEffectStableState = Object.freeze({
  temporaryObjects: 0,
  emitters: 0,
  masks: 0,
  fx: 0,
  listeners: 0,
  transform: 'identity',
});

const layer = (
  id: string,
  group: number,
  order: number,
  kind: CardEffectLayerKind,
  target: CardEffectTarget,
  durationMs: number,
  blendMode: CardEffectBlendMode,
  semantic: string,
  parameters?: LayerSpec['parameters'],
): LayerSpec => ({
  id,
  group,
  order,
  kind,
  target,
  durationMs,
  blendMode,
  semantic,
  parameters,
});

const plan = (
  owner: CardEffectRecipeId,
  specs: readonly LayerSpec[],
): CardEffectPlan => Object.freeze({
  layers: Object.freeze(specs.map((spec) => Object.freeze({ ...spec, owner }))),
  stableState: CARD_EFFECT_STABLE_STATE,
});

const recipe = (
  id: CardEffectRecipeId,
  label: string,
  color: number,
  full: readonly LayerSpec[],
  reduced: readonly LayerSpec[],
  card?: Card,
): CardEffectRecipe => Object.freeze({
  id,
  label,
  card,
  color,
  full: plan(id, full),
  reduced: plan(id, reduced),
  customShaderSeam: 'future-optional',
  material: CARD_EFFECT_MATERIAL_BY_RECIPE[id],
  grammar: CARD_EFFECT_COMPOSITION_GRAMMAR,
});

export type CardEffectRecipeId =
  | 'primitive-sampler'
  | 'strike'
  | 'guard'
  | 'mend'
  | 'spark'
  | 'stun'
  | 'heavy-bonk'
  | 'enemy-attack'
  | 'victory'
  | 'defeat'
  | 'draw-pile-prepare'
  | 'discard-pile-receive'
  | 'hand-settle';

const CARD_EFFECT_MATERIAL_BY_RECIPE: Readonly<Record<CardEffectRecipeId, CardEffectMaterial>> = Object.freeze({
  'primitive-sampler': 'capability-neutral',
  strike: 'physical-slash',
  guard: 'protection',
  mend: 'healing',
  spark: 'electricity',
  stun: 'control',
  'heavy-bonk': 'weight-impact',
  'enemy-attack': 'enemy-impact',
  victory: 'victory',
  defeat: 'defeat',
  'draw-pile-prepare': 'lifecycle',
  'discard-pile-receive': 'lifecycle',
  'hand-settle': 'lifecycle',
});

const compactPulse = (
  owner: string,
  color: number,
  target: CardEffectTarget = 'tabletop-local',
): LayerSpec[] => [
  layer(`${owner}-reduced-rim`, 0, 0, 'rim-glow', 'card-local', 140, 'screen', 'card-emphasis', { color, scale: 1.02 }),
  layer(`${owner}-reduced-impact`, 1, 0, 'target-pulse', target, 160, 'screen', 'resolved-impact', { color, scale: 1.08 }),
];

export const CARD_EFFECT_RECIPES = {
  'primitive-sampler': recipe(
    'primitive-sampler',
    'Primitive capability sampler',
    0xe7bd6b,
    [
      layer('primitive-g0-surface', 0, 0, 'surface-prep', 'card-local', 180, 'normal', 'surface-preparation'),
      layer('primitive-g0-rim', 0, 1, 'rim-glow', 'card-local', 360, 'screen', 'rim-emphasis'),
      layer('primitive-g0-trace', 0, 2, 'rim-trace', 'card-local', 420, 'screen', 'perimeter-trace'),
      layer('primitive-g1-shine', 1, 0, 'shine-sweep', 'card-local', 420, 'add', 'shine-sweep'),
      layer('primitive-g2-projectile', 2, 0, 'projectile', 'enemy-target', 520, 'add', 'travel'),
      layer('primitive-g2-trail', 2, 1, 'trail-emitter', 'enemy-target', 520, 'add', 'travel-trail'),
      layer('primitive-g3-impact', 3, 0, 'impact-burst', 'enemy-target', 300, 'add', 'impact'),
      layer('primitive-g3-ring', 3, 1, 'shockwave-ring', 'enemy-target', 360, 'screen', 'impact-ring'),
      layer('primitive-g4-orbit', 4, 0, 'orbiting-motes', 'enemy-target', 620, 'add', 'control-orbit'),
      layer('primitive-g4-mask', 4, 1, 'masked-card-particles', 'card-local', 620, 'screen', 'card-local-particles'),
      layer('primitive-g5-shield', 5, 0, 'shield-pulse', 'player-target', 420, 'screen', 'shield-pulse'),
      layer('primitive-g5-heal', 5, 1, 'healing-rise', 'player-target', 520, 'add', 'healing-rise'),
      layer('primitive-g6-down', 6, 0, 'downward-impact', 'enemy-target', 520, 'normal', 'weighty-impact'),
      layer('primitive-g6-dust', 6, 1, 'dust-burst', 'enemy-target', 420, 'screen', 'dust-response'),
      layer('primitive-g7-rt', 7, 0, 'render-texture-stamp', 'tabletop-local', 320, 'screen', 'render-texture-feasibility'),
      layer('primitive-g8-pile', 8, 0, 'pile-response', 'discard-pile-local', 240, 'screen', 'pile-response'),
      layer('primitive-g9-victory', 9, 0, 'victory-accent', 'tabletop-local', 260, 'screen', 'victory-accent'),
      layer('primitive-g10-defeat', 10, 0, 'defeat-accent', 'player-target', 260, 'normal', 'defeat-accent'),
      layer('primitive-g11-skip', 11, 0, 'draw-skip-cue', 'draw-pile-local', 360, 'normal', 'draw-skip-cue'),
    ],
    [
      layer('primitive-reduced-rim', 0, 0, 'rim-glow', 'card-local', 130, 'screen', 'rim-emphasis'),
      layer('primitive-reduced-impact', 1, 0, 'target-pulse', 'tabletop-local', 150, 'screen', 'compact-impact'),
      layer('primitive-reduced-shield', 2, 0, 'shield-pulse', 'player-target', 150, 'screen', 'compact-shield'),
      layer('primitive-reduced-heal', 3, 0, 'healing-rise', 'player-target', 160, 'screen', 'compact-heal', { displacement: 6 }),
    ],
  ),
  strike: recipe(
    'strike',
    'Strike — direct slash',
    0xf0a55a,
    [
      layer('strike-g0-rim', 0, 0, 'rim-glow', 'card-local', 220, 'screen', 'warm-rim'),
      layer('strike-g0-trace', 0, 1, 'rim-trace', 'card-local', 260, 'screen', 'fast-perimeter-trace'),
      layer('strike-g1-projectile', 1, 0, 'projectile', 'enemy-target', 360, 'add', 'slash-travel', { shape: 'slash' }),
      layer('strike-g1-trail', 1, 1, 'trail-emitter', 'enemy-target', 360, 'add', 'narrow-trail', { spread: 5 }),
      layer('strike-g2-impact', 2, 0, 'impact-burst', 'enemy-target', 220, 'add', 'sharp-impact', { count: 10 }),
      layer('strike-g2-pulse', 2, 1, 'target-pulse', 'enemy-target', 180, 'screen', 'target-response', { scale: 1.06 }),
    ],
    compactPulse('strike', 0xf0a55a, 'enemy-target'),
    'Strike',
  ),
  guard: recipe(
    'guard',
    'Guard — protective teal ward',
    0x5ed5d1,
    [
      layer('guard-g0-surface', 0, 0, 'surface-prep', 'card-local', 260, 'normal', 'guarded-surface'),
      layer('guard-g0-trace', 0, 1, 'rim-trace', 'card-local', 360, 'screen', 'teal-perimeter-forms'),
      layer('guard-g1-shield', 1, 0, 'shield-pulse', 'player-target', 460, 'screen', 'shield-rises-and-braces'),
      layer('guard-g2-ring', 2, 0, 'shockwave-ring', 'player-target', 420, 'screen', 'protective-ring', { maxScale: 1.45 }),
      layer('guard-g2-motes', 2, 1, 'orbiting-motes', 'player-target', 420, 'add', 'restrained-shield-motes', { count: 3, turns: 0.45 }),
      layer('guard-g3-pulse', 3, 0, 'target-pulse', 'player-target', 260, 'screen', 'guard-state-emphasis', { scale: 1.04 }),
    ],
    [
      layer('guard-reduced-rim', 0, 0, 'rim-glow', 'card-local', 140, 'screen', 'guard-card-emphasis'),
      layer('guard-reduced-shield', 1, 0, 'shield-pulse', 'player-target', 180, 'screen', 'compact-shield', { displacement: 0 }),
    ],
    'Guard',
  ),
  mend: recipe(
    'mend',
    'Mend — restorative rise',
    0x77d27a,
    [
      layer('mend-g0-rim', 0, 0, 'rim-glow', 'card-local', 300, 'screen', 'healing-card-emphasis'),
      layer('mend-g0-trace', 0, 1, 'rim-trace', 'card-local', 360, 'screen', 'gentle-life-trace'),
      layer('mend-g1-rise', 1, 0, 'healing-rise', 'player-target', 720, 'add', 'upward-green-plus-motes', { count: 10, displacement: 84 }),
      layer('mend-g1-mask', 1, 1, 'masked-card-particles', 'card-local', 560, 'screen', 'card-local-life-motes', { count: 7 }),
      layer('mend-g2-ring', 2, 0, 'shockwave-ring', 'player-target', 460, 'screen', 'soft-restorative-glow', { maxScale: 1.45 }),
    ],
    [
      layer('mend-reduced-rim', 0, 0, 'rim-glow', 'card-local', 150, 'screen', 'healing-card-emphasis'),
      layer('mend-reduced-rise', 1, 0, 'healing-rise', 'player-target', 180, 'screen', 'compact-heal', { count: 3, displacement: 6 }),
    ],
    'Mend',
  ),
  spark: recipe(
    'spark',
    'Spark — gold star ignition',
    0xffd45a,
    [
      layer('spark-g0-rim', 0, 0, 'rim-glow', 'card-local', 300, 'screen', 'gold-card-charge'),
      layer('spark-g0-trace', 0, 1, 'rim-trace', 'card-local', 380, 'screen', 'gold-perimeter-charge'),
      layer('spark-g0-shine', 0, 2, 'shine-sweep', 'card-local', 340, 'add', 'card-bound-shine'),
      layer('spark-g1-projectile', 1, 0, 'projectile', 'enemy-target', 520, 'add', 'visible-star-travel', { shape: 'star' }),
      layer('spark-g1-trail', 1, 1, 'trail-emitter', 'enemy-target', 520, 'add', 'short-additive-star-trail', { spread: 9 }),
      layer('spark-g2-impact', 2, 0, 'impact-burst', 'enemy-target', 320, 'add', 'compact-starburst', { count: 16 }),
      layer('spark-g2-ring', 2, 1, 'shockwave-ring', 'enemy-target', 380, 'screen', 'spark-impact-ring', { maxScale: 1.4 }),
    ],
    compactPulse('spark', 0xffd45a, 'enemy-target'),
    'Spark',
  ),
  stun: recipe(
    'stun',
    'Stun — suspended star control',
    0x77dce0,
    [
      layer('stun-g0-trace', 0, 0, 'rim-trace', 'card-local', 300, 'screen', 'control-perimeter-lock'),
      layer('stun-g1-orbit', 1, 0, 'orbiting-motes', 'enemy-target', 760, 'add', 'star-cluster-orbit', { count: 7, turns: 1.25 }),
      layer('stun-g1-pulse', 1, 1, 'target-pulse', 'enemy-target', 520, 'screen', 'suspended-target-pulse', { scale: 1.05 }),
      layer('stun-g2-ring', 2, 0, 'shockwave-ring', 'enemy-target', 360, 'screen', 'control-lock-ring', { maxScale: 1.25 }),
    ],
    [
      layer('stun-reduced-rim', 0, 0, 'rim-glow', 'card-local', 140, 'screen', 'control-card-emphasis'),
      layer('stun-reduced-pulse', 1, 0, 'target-pulse', 'enemy-target', 180, 'screen', 'compact-control-pulse', { scale: 1.04 }),
    ],
    'Stun',
  ),
  'heavy-bonk': recipe(
    'heavy-bonk',
    'Heavy Bonk — weighty downward impact',
    0xd49555,
    [
      layer('heavy-g0-rim', 0, 0, 'rim-glow', 'card-local', 300, 'screen', 'heavy-card-charge'),
      layer('heavy-g0-trace', 0, 1, 'rim-trace', 'card-local', 360, 'normal', 'weighty-perimeter-crawl'),
      layer('heavy-g1-down', 1, 0, 'downward-impact', 'enemy-target', 680, 'normal', 'deliberate-downward-hit', { drop: 62 }),
      layer('heavy-g2-dust', 2, 0, 'dust-burst', 'enemy-target', 520, 'screen', 'broad-dust-response', { count: 26, particleScale: 1.15, minSpeed: 34, maxSpeed: 96 }),
      layer('heavy-g2-ring', 2, 1, 'shockwave-ring', 'enemy-target', 460, 'screen', 'low-impact-ring', { maxScale: 2 }),
      layer('heavy-g2-stage', 2, 2, 'stage-response', 'tabletop-local', 120, 'normal', 'restrained-stage-shake', { intensity: 0.0015 }),
      layer('heavy-g3-skip', 3, 0, 'draw-skip-cue', 'draw-pile-local', 720, 'normal', 'skip-next-draw'),
    ],
    [
      layer('heavy-reduced-rim', 0, 0, 'rim-glow', 'card-local', 160, 'screen', 'heavy-card-emphasis'),
      layer('heavy-reduced-impact', 1, 0, 'target-pulse', 'enemy-target', 200, 'screen', 'compact-heavy-impact', { scale: 1.1 }),
      layer('heavy-reduced-skip', 2, 0, 'draw-skip-cue', 'draw-pile-local', 360, 'normal', 'skip-next-draw'),
    ],
    'Heavy Bonk',
  ),
  'enemy-attack': recipe(
    'enemy-attack',
    'Enemy attack impact sample',
    0xff7a65,
    [
      layer('enemy-g0-projectile', 0, 0, 'projectile', 'player-target', 440, 'add', 'enemy-travel', { source: 'enemy-target', shape: 'claw' }),
      layer('enemy-g0-trail', 0, 1, 'trail-emitter', 'player-target', 440, 'add', 'enemy-trail', { source: 'enemy-target' }),
      layer('enemy-g1-impact', 1, 0, 'impact-burst', 'player-target', 300, 'add', 'player-impact'),
      layer('enemy-g1-pulse', 1, 1, 'target-pulse', 'player-target', 240, 'screen', 'player-hit-pulse'),
    ],
    [layer('enemy-reduced-impact', 0, 0, 'target-pulse', 'player-target', 180, 'screen', 'compact-enemy-impact', { scale: 1.08 })],
  ),
  victory: recipe(
    'victory',
    'Victory accent sample',
    0xffdc72,
    [
      layer('victory-g0-ring', 0, 0, 'shockwave-ring', 'tabletop-local', 620, 'screen', 'victory-ring', { maxScale: 2.1 }),
      layer('victory-g0-motes', 0, 1, 'orbiting-motes', 'tabletop-local', 900, 'add', 'victory-motes', { count: 12, turns: 1.4 }),
      layer('victory-g1-accent', 1, 0, 'victory-accent', 'tabletop-local', 420, 'screen', 'victory-stage-accent'),
    ],
    [
      layer('victory-reduced-pulse', 0, 0, 'target-pulse', 'tabletop-local', 200, 'screen', 'compact-victory-accent', { scale: 1.08 }),
    ],
  ),
  defeat: recipe(
    'defeat',
    'Defeat accent sample',
    0x9c718f,
    [
      layer('defeat-g0-pulse', 0, 0, 'target-pulse', 'player-target', 460, 'screen', 'defeat-pulse', { scale: 0.94 }),
      layer('defeat-g0-dust', 0, 1, 'dust-burst', 'player-target', 520, 'normal', 'falling-dust', { count: 10 }),
      layer('defeat-g1-accent', 1, 0, 'defeat-accent', 'player-target', 420, 'normal', 'defeat-stage-dim'),
    ],
    [
      layer('defeat-reduced-pulse', 0, 0, 'target-pulse', 'player-target', 190, 'normal', 'compact-defeat-accent', { scale: 0.97 }),
    ],
  ),
  'draw-pile-prepare': recipe(
    'draw-pile-prepare',
    'Shared draw-pile preparation',
    0x8fd59b,
    [
      layer('draw-pile-pulse', 0, 0, 'pile-response', 'draw-pile-local', 220, 'screen', 'draw-pile-prepare'),
    ],
    [
      layer('draw-pile-reduced', 0, 0, 'pile-response', 'draw-pile-local', 120, 'screen', 'draw-pile-prepare', { scale: 1.04 }),
    ],
  ),
  'discard-pile-receive': recipe(
    'discard-pile-receive',
    'Shared discard-pile reception',
    0xc78665,
    [
      layer('discard-pile-pulse', 0, 0, 'pile-response', 'discard-pile-local', 220, 'screen', 'discard-pile-receive'),
      layer('discard-pile-dust', 0, 1, 'dust-burst', 'discard-pile-local', 260, 'normal', 'discard-pile-dust', { count: 6 }),
    ],
    [
      layer('discard-pile-reduced', 0, 0, 'pile-response', 'discard-pile-local', 120, 'screen', 'discard-pile-receive', { scale: 1.04 }),
    ],
  ),
  'hand-settle': recipe(
    'hand-settle',
    'Shared hand-settle accent',
    0xe7bd6b,
    [
      layer('hand-settle-rim', 0, 0, 'rim-glow', 'card-local', 150, 'screen', 'hand-settle'),
    ],
    [
      layer('hand-settle-reduced', 0, 0, 'rim-glow', 'card-local', 90, 'screen', 'hand-settle'),
    ],
  ),
} satisfies Record<CardEffectRecipeId, CardEffectRecipe>;

export const CARD_LIFECYCLE_EFFECT_RECIPES = Object.freeze({
  drawPilePrepare: 'draw-pile-prepare',
  cardDraw: 'draw-pile-prepare',
  handSettle: 'hand-settle',
  playPrepare: 'hand-settle',
  discardPileReceive: 'discard-pile-receive',
  replacementDiscard: 'discard-pile-receive',
  replacementDraw: 'draw-pile-prepare',
  victory: 'victory',
  defeat: 'defeat',
} as const satisfies Record<string, CardEffectRecipeId>);

export const CARD_EFFECT_RECIPE_BY_CARD = Object.freeze({
  Strike: 'strike',
  Guard: 'guard',
  Mend: 'mend',
  Spark: 'spark',
  Stun: 'stun',
  'Heavy Bonk': 'heavy-bonk',
} as const satisfies Record<Card, CardEffectRecipeId>);

export type CardEffectFixtureControl = 'cancel' | 'resize';
export type CardEffectFixture = Readonly<{
  id: string;
  label: string;
  recipeId: CardEffectRecipeId;
  control?: CardEffectFixtureControl;
  repeatCount?: number;
  comparison?: readonly CardEffectMode[];
}>;

const fixture = (
  id: string,
  label: string,
  recipeId: CardEffectRecipeId,
  options: Pick<CardEffectFixture, 'control' | 'repeatCount' | 'comparison'> = {},
): CardEffectFixture => Object.freeze({ id, label, recipeId, ...options });

export const CARD_EFFECT_FIXTURES = {
  'primitive-sampler': fixture('primitive-sampler', 'Primitive capability sampler', 'primitive-sampler'),
  strike: fixture('strike', 'Strike recipe', 'strike'),
  guard: fixture('guard', 'Guard recipe', 'guard'),
  mend: fixture('mend', 'Mend recipe', 'mend'),
  spark: fixture('spark', 'Spark recipe', 'spark'),
  stun: fixture('stun', 'Stun recipe', 'stun'),
  'heavy-bonk': fixture('heavy-bonk', 'Heavy Bonk recipe', 'heavy-bonk'),
  'enemy-attack': fixture('enemy-attack', 'Enemy attack sample', 'enemy-attack'),
  victory: fixture('victory', 'Victory accent sample', 'victory'),
  defeat: fixture('defeat', 'Defeat accent sample', 'defeat'),
  'reduced-comparison': fixture('reduced-comparison', 'Full and reduced comparison', 'spark', { comparison: ['full', 'reduced'] }),
  'cancellation-layered': fixture('cancellation-layered', 'Cancellation during layered effect', 'spark', { control: 'cancel' }),
  'resize-active': fixture('resize-active', 'Resize during effect', 'guard', { control: 'resize' }),
  'repeat-no-residue': fixture('repeat-no-residue', 'Repeated execution leak check', 'heavy-bonk', { repeatCount: 3 }),
} as const satisfies Record<string, CardEffectFixture>;

export type CardEffectFixtureId = keyof typeof CARD_EFFECT_FIXTURES;

export const validateCardEffectRegistry = (): string[] => {
  const errors: string[] = [];
  for (const recipeValue of Object.values(CARD_EFFECT_RECIPES)) {
    for (const mode of ['full', 'reduced'] as const) {
      const seen = new Set<string>();
      let previousGroup = -1;
      let previousOrder = -1;
      for (const effectLayer of recipeValue[mode].layers) {
        if (effectLayer.owner !== recipeValue.id) errors.push(`${recipeValue.id}:${mode}:${effectLayer.id}:owner`);
        if (seen.has(effectLayer.id)) errors.push(`${recipeValue.id}:${mode}:${effectLayer.id}:duplicate`);
        seen.add(effectLayer.id);
        if (effectLayer.durationMs <= 0) errors.push(`${recipeValue.id}:${mode}:${effectLayer.id}:duration`);
        if (
          effectLayer.group < previousGroup
          || (effectLayer.group === previousGroup && effectLayer.order < previousOrder)
        ) {
          errors.push(`${recipeValue.id}:${mode}:${effectLayer.id}:order`);
        }
        previousGroup = effectLayer.group;
        previousOrder = effectLayer.order;
      }
    }
  }

  for (const [card, recipeId] of Object.entries(CARD_EFFECT_RECIPE_BY_CARD)) {
    if (CARD_EFFECT_RECIPES[recipeId].card !== card) errors.push(`${card}:mapping`);
  }
  return errors;
};
