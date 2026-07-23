import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const contractPath = new URL('../capture-contracts.cjs', import.meta.url);
const expectedContracts = [
  ['01', 'PlayerAction', 6, 6, 'Play', '01-strategy-a-clean-interior', true],
  ['02', 'PlayerAction', 6, 6, 'Play', '02-strategy-b-mapped-tokens', true],
  ['03', 'PlayerAction', 3, 3, 'Play', '03-ordinary-hand-default', true],
  ['04', 'PlayerAction', 3, 3, 'Play', '04-ordinary-hand-minimum', true],
  ['05', 'PlayerAction', 6, 6, 'Play', '05-keyboard-focus-heavy-bonk', true],
  ['06', 'SparkChoice', 2, 2, 'Replace', '06-spark-choice-complete-replace-badges', true],
  ['07', 'Terminal', 2, 2, 'Locked', '07-terminal-locked-treatment', true],
  ['08', 'PlayerAction', 6, 6, 'Play', '08-slot-debug-overlay', true],
] as const;

describe('H6.21A capture fixture contracts', () => {
  it('defines and validates all eight fixture assumptions before browser capture', () => {
    expect(existsSync(contractPath)).toBe(true);
    if (!existsSync(contractPath)) return;

    const require = createRequire(import.meta.url);
    const { FIXTURE_CONTRACTS, validateFixtureContracts } = require(fileURLToPath(contractPath));
    expect(validateFixtureContracts()).toEqual(FIXTURE_CONTRACTS);
    expect(FIXTURE_CONTRACTS).toHaveLength(8);
    expect(FIXTURE_CONTRACTS.map((fixture: any) => [
      fixture.id,
      fixture.phase,
      fixture.cardCount,
      fixture.stateLabelCount,
      fixture.stateLabel,
      fixture.screenshotName,
      fixture.measurementRequired,
    ])).toEqual(expectedContracts);
  });

  it('keeps lab, ordinary, SparkChoice, terminal, and slot-debug anchor paths explicit', () => {
    expect(existsSync(contractPath)).toBe(true);
    if (!existsSync(contractPath)) return;

    const require = createRequire(import.meta.url);
    const { FIXTURE_CONTRACTS } = require(fileURLToPath(contractPath));
    expect(FIXTURE_CONTRACTS.map((fixture: any) => fixture.gameplayAnchorCount)).toEqual([
      0, 0, 3, 3, 0, 2, 2, 0,
    ]);
    expect(FIXTURE_CONTRACTS.find((fixture: any) => fixture.id === '08')).toMatchObject({
      query: '?cardLab=tokens&cardSlots=1',
      slotDebug: true,
      cardCount: 6,
      gameplayAnchorCount: 0,
    });
    expect(FIXTURE_CONTRACTS.filter((fixture: any) => fixture.slotDebug)).toHaveLength(1);
  });
});
