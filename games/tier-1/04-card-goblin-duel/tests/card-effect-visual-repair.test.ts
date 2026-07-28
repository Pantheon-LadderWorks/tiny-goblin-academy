import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildCombatFeedbackPlan } from '../src/combat-feedback';
import { createGame, playCard } from '../src/simulation';

const phaserSource = readFileSync(
  new URL('../src/card-effect-phaser.ts', import.meta.url),
  'utf8',
);

describe('Card Goblin production VFX repair contracts', () => {
  it('keeps particle explosions local to their positioned emitter', () => {
    expect(phaserSource).toContain('emitter.explode(count, 0, 0)');
    expect(phaserSource).not.toContain('emitter.explode(count, target.centerX, target.centerY)');
  });

  it('keeps projectile trails local while following a world-positioned projectile', () => {
    expect(phaserSource).toContain('emitter = this.createEmitter(0, 0, layer)');
    expect(phaserSource).not.toContain('emitter = this.createEmitter(source.centerX, source.centerY, layer)');
  });

  it('builds target geometry locally before positioning it in world space', () => {
    expect(phaserSource).toContain('shield.moveTo(0, -44)');
    expect(phaserSource).toContain('.setPosition(target.centerX, target.centerY + 24)');
  });

  it('uses readable icon textures instead of a falling Heavy Bonk rectangle', () => {
    expect(phaserSource).toContain('PLUS_TEXTURE');
    expect(phaserSource).toContain('BONK_TEXTURE');
    expect(phaserSource).toContain("layer.owner === 'heavy-bonk' && layer.kind === 'dust-burst'");
    expect(phaserSource).toContain("impact.className = 'card-effect-transient heavy-impact-mark'");
    expect(phaserSource).not.toContain('target.centerY - drop,\n        44,\n        58,');
  });

  it('plans Strike damage and enemy retaliation as separate readable events', () => {
    const before = createGame();
    const after = playCard(before, 0);
    const plan = buildCombatFeedbackPlan(before, after, 'Strike');

    expect(plan.activation).toEqual([
      { kind: 'damage', target: 'enemy', amount: 2, hpAfter: 10 },
    ]);
    expect(plan.retaliation).toEqual([
      { kind: 'damage', target: 'player', amount: 2, hpAfter: 8 },
    ]);
  });

  it('preserves Mend healing even when retaliation makes the net HP delta zero', () => {
    const before = createGame();
    const mendIndex = before.hand.indexOf('Mend');
    const after = playCard(before, mendIndex);
    const plan = buildCombatFeedbackPlan(before, after, 'Mend');

    expect(plan.activation).toEqual([
      { kind: 'heal', target: 'player', amount: 0, hpAfter: 10 },
    ]);
    expect(plan.retaliation).toEqual([
      { kind: 'damage', target: 'player', amount: 2, hpAfter: 8 },
    ]);
  });

  it('plans Guard bracing and Heavy Bonk skipped-draw punctuation', () => {
    const guardBefore = createGame();
    const guardAfter = playCard(guardBefore, guardBefore.hand.indexOf('Guard'));
    expect(buildCombatFeedbackPlan(guardBefore, guardAfter, 'Guard').activation)
      .toEqual([{ kind: 'guard', target: 'player', amount: 2 }]);

    const bonkBefore = { ...createGame(), hand: ['Strike', 'Guard', 'Heavy Bonk'] as const };
    const bonkAfter = playCard(bonkBefore, 2);
    expect(buildCombatFeedbackPlan(bonkBefore, bonkAfter, 'Heavy Bonk').activation)
      .toEqual([
        { kind: 'damage', target: 'enemy', amount: 4, hpAfter: 8 },
        { kind: 'skip-draw', target: 'draw-pile' },
      ]);
  });
});
