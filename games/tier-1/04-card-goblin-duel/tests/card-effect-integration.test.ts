import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(
  new URL('../src/main.ts', import.meta.url),
  'utf8',
);

describe('H6.22A preview-only CardEffectRecipe integration', () => {
  it('loads fixtures only through the development-only cardFx query seam', () => {
    expect(mainSource).toContain("searchParams.get('cardFx')");
    expect(mainSource).toContain("import.meta.env.MODE === 'development'");
    expect(mainSource).toContain('requestedCardEffect in CARD_EFFECT_FIXTURES');
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
    const fixtureEnd = mainSource.indexOf('const bindCardActions');
    const fixtureSource = mainSource.slice(fixtureStart, fixtureEnd);
    expect(fixtureStart).toBeGreaterThan(-1);
    expect(fixtureSource).not.toContain('playCard(');
    expect(fixtureSource).not.toContain('resolveSparkChoice(');
    expect(fixtureSource).not.toContain('publishCardGoblinTransition(');
  });
});
