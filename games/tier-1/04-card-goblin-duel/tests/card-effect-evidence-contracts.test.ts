import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  CARD_FIXTURES,
  DEFAULT_VIEWPORT,
  FIXTURE_IDS,
  MINIMUM_VIEWPORT,
  MOTION_CONTRACTS,
  verifyEvidenceContracts,
} = require('../h622a-evidence-contracts.cjs');

describe('H6.22A evidence contracts', () => {
  it('locks the bounded fixture, card, viewport, and recording inventory', () => {
    expect(verifyEvidenceContracts()).toBe(true);
    expect(FIXTURE_IDS).toHaveLength(14);
    expect(CARD_FIXTURES).toHaveLength(6);
    expect(MOTION_CONTRACTS).toHaveLength(9);
    expect(DEFAULT_VIEWPORT).toEqual({ width: 1280, height: 660 });
    expect(MINIMUM_VIEWPORT).toEqual({ width: 1024, height: 580 });
  });

  it('records every approved card exactly once', () => {
    const recorded = MOTION_CONTRACTS
      .map(({ fixture }: { fixture: string }) => fixture)
      .filter((fixture: string) => CARD_FIXTURES.includes(fixture));
    expect(recorded).toEqual(CARD_FIXTURES);
  });
});
