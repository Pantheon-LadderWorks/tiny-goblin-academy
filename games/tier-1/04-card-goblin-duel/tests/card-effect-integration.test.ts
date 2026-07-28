import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(
  new URL('../src/main.ts', import.meta.url),
  'utf8',
);
const runtimeConfigSource = readFileSync(
  new URL('../src/app/runtime-config.ts', import.meta.url),
  'utf8',
);

describe('CardEffectRecipe lab and production integration', () => {
  it('loads fixtures only through the development-only cardFx query seam', () => {
    expect(runtimeConfigSource).toContain("params.get('cardFx')");
    expect(mainSource).toContain("resolveRuntimeConfig(window.location.search, import.meta.env.MODE === 'development')");
    expect(runtimeConfigSource).toContain('requestedEffect in CARD_EFFECT_FIXTURES');
    expect(mainSource).toContain('cardEffectFixtureId');
  });

  it('routes presentation through the single runner and Phaser port', () => {
    expect(mainSource).toContain("from './card-effect-runner'");
    expect(mainSource).toContain("from './card-effect-phaser'");
    expect(mainSource).toContain('new PhaserCardEffectPort');
    expect(mainSource).toContain('new CardEffectRunner');
  });

  it('exposes deterministic resource telemetry for browser evidence', () => {
    expect(mainSource).toContain('__cardEffectLabStatus');
    expect(mainSource).toContain('__cardEffectRecipeRegistry');
    expect(mainSource).toContain('requiredPrimitives: REQUIRED_EFFECT_PRIMITIVES');
    expect(mainSource).toContain('beforeCounts');
    expect(mainSource).toContain('afterCounts');
    expect(mainSource).toContain('layers');
    expect(mainSource).toContain('cleanup');
  });

  it('cancels on resize and does not coexist with CardRig fixture mode', () => {
    expect(mainSource).toContain("cardEffectRunner?.cancel('resize')");
    expect(mainSource).toContain('cardEffectFixtureId && !cardRigFixtureId');
  });

  it('keeps the effect fixture outside simulation actions and Ledger publication', () => {
    const fixtureStart = mainSource.indexOf('const startCardEffectFixture');
    const fixtureEnd = mainSource.indexOf('const performProductionAction');
    const fixtureSource = mainSource.slice(fixtureStart, fixtureEnd);
    expect(fixtureStart).toBeGreaterThan(-1);
    expect(fixtureSource).not.toContain('playCard(');
    expect(fixtureSource).not.toContain('resolveSparkChoice(');
    expect(fixtureSource).not.toContain('publishCardGoblinTransition(');
  });

  it('coordinates production simulation through CardRig plans and one effect runner', () => {
    expect(mainSource).toContain('buildOpeningDealPlan');
    expect(mainSource).toContain('buildProductionTransitionPlan');
    expect(mainSource).toContain('productionCardRig.playPlan');
    expect(mainSource).toContain('CARD_EFFECT_RECIPE_BY_CARD[cue.card]');
    expect(mainSource).toContain('CARD_LIFECYCLE_EFFECT_RECIPES.drawPilePrepare');
    expect(mainSource).toContain('CARD_LIFECYCLE_EFFECT_RECIPES.discardPileReceive');
    expect(mainSource).toContain("playProductionEffect('enemy-attack')");
  });

  it('locks input and cancels both moving cards and effects on reset or resize', () => {
    expect(mainSource).toContain('presentation-locked');
    expect(mainSource).toContain("productionCardRig?.cancel('reset')");
    expect(mainSource).toContain("productionCardRig?.cancel('resize')");
    expect(mainSource).toContain("cardEffectRunner?.cancel('reset')");
    expect(mainSource).toContain('__cardGoblinPresentationStatus');
  });
});
