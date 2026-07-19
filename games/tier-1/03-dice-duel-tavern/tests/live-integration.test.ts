import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readRepoFile = (relativePath: string) =>
  readFileSync(new URL(`../../../../${relativePath}`, import.meta.url), 'utf8');

describe('H6.11 live DieRig integration contract', () => {
  it('wires one persistent DieRig through a thin production presentation adapter', () => {
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');
    const adapter = readRepoFile('games/tier-1/03-dice-duel-tavern/src/live-dierig-presentation.ts');
    expect(source).toContain('new LiveDieRigPresentation');
    expect(source).toContain('new LiveDuelController');
    expect(adapter.match(/new DieRig\(/g)).toHaveLength(1);
    expect(adapter).toContain('dierig-h6-10-actor-001');
    expect(adapter).toContain('returnToReady');
    expect(adapter).toContain('computeProductionDieScale');
    expect(adapter).not.toMatch(/Math\.random|particle|emitter|Matter/i);
  });

  it('keeps production randomness outside simulation and DieRig presentation', () => {
    const simulation = readRepoFile('games/tier-1/03-dice-duel-tavern/src/simulation.ts');
    const rig = readRepoFile('games/tier-1/03-dice-duel-tavern/src/dierig/dierig.ts');
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/roll-source.ts');
    expect(simulation).not.toMatch(/random|getRandomValues/);
    expect(rig).not.toMatch(/random|getRandomValues/);
    expect(source).toContain('getRandomValues');
    expect(source).toContain('D6_REJECTION_LIMIT');
    expect(source).not.toContain('Math.random');
  });

  it('adds no replay, second die, particle, physics, or dependency', () => {
    const main = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');
    const packageJson = readRepoFile('games/tier-1/03-dice-duel-tavern/package.json');
    expect(main).not.toMatch(/reset|replay|opponentDie|secondDie|particle|emitter|Matter/i);
    expect(JSON.parse(packageJson).dependencies).toEqual({ phaser: '^4.2.0' });
  });
});
