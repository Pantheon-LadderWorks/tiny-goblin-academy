import { describe, expect, it } from 'vitest';
import {
  CARD_EFFECT_FIXTURES,
  CARD_EFFECT_COMPOSITION_GRAMMAR,
  CARD_LIFECYCLE_EFFECT_RECIPES,
  CARD_EFFECT_RECIPE_BY_CARD,
  CARD_EFFECT_RECIPES,
  REQUIRED_EFFECT_PRIMITIVES,
  validateCardEffectRegistry,
} from '../src/card-effect-recipes';

const cardNames = [
  'Strike',
  'Guard',
  'Mend',
  'Spark',
  'Stun',
  'Heavy Bonk',
] as const;

const fixtureIds = [
  'primitive-sampler',
  'strike',
  'guard',
  'mend',
  'spark',
  'stun',
  'heavy-bonk',
  'enemy-attack',
  'victory',
  'defeat',
  'reduced-comparison',
  'cancellation-layered',
  'resize-active',
  'repeat-no-residue',
] as const;

describe('CardEffectRecipe registry', () => {
  it('registers the bounded fixture set', () => {
    expect(Object.keys(CARD_EFFECT_FIXTURES)).toEqual(fixtureIds);
  });

  it('maps every approved card to exactly one recipe', () => {
    expect(Object.keys(CARD_EFFECT_RECIPE_BY_CARD)).toEqual(cardNames);
    expect(new Set(Object.values(CARD_EFFECT_RECIPE_BY_CARD)).size).toBe(6);
    for (const card of cardNames) {
      const recipeId = CARD_EFFECT_RECIPE_BY_CARD[card];
      expect(CARD_EFFECT_RECIPES[recipeId].card).toBe(card);
    }
  });

  it('owns every layer centrally with unique stable identities', () => {
    expect(validateCardEffectRegistry()).toEqual([]);
    for (const recipe of Object.values(CARD_EFFECT_RECIPES)) {
      for (const mode of ['full', 'reduced'] as const) {
        const layerIds = recipe[mode].layers.map((layer) => layer.id);
        expect(new Set(layerIds).size).toBe(layerIds.length);
        expect(recipe[mode].layers.every((layer) => layer.owner === recipe.id)).toBe(true);
        expect([...recipe[mode].layers].sort((a, b) => a.group - b.group || a.order - b.order))
          .toEqual(recipe[mode].layers);
      }
    }
  });

  it('proves every required primitive in the sampler', () => {
    const kinds = new Set(
      CARD_EFFECT_RECIPES['primitive-sampler'].full.layers.map((layer) => layer.kind),
    );
    for (const primitive of REQUIRED_EFFECT_PRIMITIVES) {
      expect(kinds.has(primitive)).toBe(true);
    }
  });

  it('gives full and reduced plans equivalent stable states', () => {
    for (const recipe of Object.values(CARD_EFFECT_RECIPES)) {
      expect(recipe.reduced.stableState).toEqual(recipe.full.stableState);
      expect(recipe.reduced.layers.length).toBeGreaterThan(0);
      expect(Math.max(...recipe.reduced.layers.map((layer) => layer.durationMs)))
        .toBeLessThanOrEqual(Math.max(...recipe.full.layers.map((layer) => layer.durationMs)));
    }
  });

  it('keeps the six card languages semantically distinct', () => {
    expect(CARD_EFFECT_RECIPES.strike.full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['rim-glow', 'projectile', 'trail-emitter', 'impact-burst']));
    expect(CARD_EFFECT_RECIPES.guard.full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['shield-pulse', 'shockwave-ring', 'orbiting-motes']));
    expect(CARD_EFFECT_RECIPES.mend.full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['healing-rise', 'masked-card-particles']));
    expect(CARD_EFFECT_RECIPES.spark.full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['shine-sweep', 'projectile', 'trail-emitter', 'impact-burst']));
    expect(CARD_EFFECT_RECIPES.stun.full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['orbiting-motes', 'target-pulse']));
    expect(CARD_EFFECT_RECIPES['heavy-bonk'].full.layers.map((layer) => layer.kind))
      .toEqual(expect.arrayContaining(['downward-impact', 'dust-burst', 'stage-response']));
  });

  it('governs composition grammar, material identity, lifecycle effects, and motion safety', () => {
    const materials = cardNames.map((card) => CARD_EFFECT_RECIPES[CARD_EFFECT_RECIPE_BY_CARD[card]].material);
    expect(new Set(materials).size).toBe(6);
    for (const card of cardNames) {
      expect(CARD_EFFECT_RECIPES[CARD_EFFECT_RECIPE_BY_CARD[card]].grammar)
        .toEqual(CARD_EFFECT_COMPOSITION_GRAMMAR);
    }

    expect(CARD_LIFECYCLE_EFFECT_RECIPES).toMatchObject({
      drawPilePrepare: 'draw-pile-prepare',
      discardPileReceive: 'discard-pile-receive',
      replacementDiscard: 'discard-pile-receive',
      replacementDraw: 'draw-pile-prepare',
    });
    expect(CARD_EFFECT_RECIPES['draw-pile-prepare'].full.layers[0].target).toBe('draw-pile-local');
    expect(CARD_EFFECT_RECIPES['discard-pile-receive'].full.layers[0].target).toBe('discard-pile-local');

    const fullViewportFlashes = Object.values(CARD_EFFECT_RECIPES).flatMap((recipe) => recipe.full.layers)
      .filter((layer) => layer.kind === 'stage-response' && layer.parameters?.flash === true);
    expect(fullViewportFlashes).toEqual([]);
    expect(CARD_EFFECT_RECIPES['heavy-bonk'].full.layers.find((layer) => layer.kind === 'stage-response'))
      .toMatchObject({ durationMs: 120, parameters: { intensity: 0.0015 } });
    expect(CARD_EFFECT_RECIPES.spark.full.layers.map((layer) => layer.kind)).toContain('rim-trace');
  });

  it('keeps control fixtures presentation-only', () => {
    expect(CARD_EFFECT_FIXTURES['cancellation-layered'].control).toBe('cancel');
    expect(CARD_EFFECT_FIXTURES['resize-active'].control).toBe('resize');
    expect(CARD_EFFECT_FIXTURES['repeat-no-residue'].repeatCount).toBe(3);
    expect(CARD_EFFECT_FIXTURES['reduced-comparison'].comparison).toEqual(['full', 'reduced']);
  });
});
