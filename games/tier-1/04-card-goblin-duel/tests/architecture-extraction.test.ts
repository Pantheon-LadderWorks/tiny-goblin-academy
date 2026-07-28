import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resolveRuntimeConfig } from '../src/app/runtime-config';
import { effectSummary, enemySummary, resolutionCopy } from '../src/app/game-copy';
import { createGame } from '../src/simulation';

const entryStyles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const textureSource = readFileSync(
  new URL('../src/effects/phaser-effect-textures.ts', import.meta.url),
  'utf8',
);
const stageRendererSource = readFileSync(
  new URL('../src/stage/phaser-stage-renderer.ts', import.meta.url),
  'utf8',
);

describe('Card Goblin bounded architecture extraction', () => {
  it('resolves production and development modes through one query authority', () => {
    const production = resolveRuntimeConfig('', false);
    expect(production.productionPresentationEnabled).toBe(true);
    expect(production.cardRigFixtureId).toBeUndefined();
    expect(production.cardEffectFixtureId).toBeUndefined();

    const development = resolveRuntimeConfig(
      '?cardComp=frame-matrix&frameStyle=wood&motion=reduced',
      true,
    );
    expect(development.cardRigCompositionFixtureId).toBe('frame-matrix');
    expect(development.cardRigFixtureId).toBe('r1-frame-wood');
    expect(development.compositionFrameStyle).toBe('wood');
    expect(development.cardRigMode).toBe('reduced');
    expect(development.productionPresentationEnabled).toBe(false);
  });

  it('keeps ordinary game copy pure and derived from simulation state', () => {
    const game = createGame();
    expect(effectSummary(game)).toBe('No active guard or stun.');
    expect(enemySummary(game)).toBe('Ready to answer your play.');
    expect(resolutionCopy(game)).toEqual({
      title: 'The table is waiting.',
      detail: 'Duel Start. Your turn. Play a card.',
    });
  });

  it('centralizes generated Phaser effect texture identities', () => {
    expect(textureSource).toContain("CARD_EFFECT_TOKEN_SHEET_TEXTURE = 'tga-card-effect-token-sheet'");
    for (const texture of ['dot', 'star', 'plus', 'slash', 'bonk']) {
      expect(textureSource).toMatch(new RegExp(`${texture}: 'tga-card-effect-${texture}'`));
    }
    expect(textureSource).toContain('ensureCardEffectTextures');
  });

  it('owns Phaser tabletop and anchor-debug drawing outside the composition root', () => {
    expect(stageRendererSource).toContain('export class PhaserStageRenderer');
    expect(stageRendererSource).toContain('layoutSourceAnchors(): void');
    expect(stageRendererSource).toContain('drawAnchorDebug(scene: Phaser.Scene');
  });

  it('preserves one explicit CSS cascade entrypoint', () => {
    expect(entryStyles).toBe([
      "@import './styles/base.css';",
      "@import './styles/tabletop.css';",
      "@import './styles/cards.css';",
      "@import './styles/diagnostics-responsive.css';",
      '',
    ].join('\n'));
  });
});
