import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  STILL_FIXTURES,
  MOTION_FIXTURES,
  verifyEvidenceContracts,
} = require('../h622r1-evidence-contracts.cjs') as {
  STILL_FIXTURES: Array<{ id: string; file: string }>;
  MOTION_FIXTURES: Array<{ id: string; file: string; frameStyle?: string }>;
  verifyEvidenceContracts(): number;
};

describe('H6.22R1 evidence contracts', () => {
  it('owns one bounded fifteen-fixture review packet', () => {
    expect(verifyEvidenceContracts()).toBe(15);
    expect(STILL_FIXTURES.map(({ id }) => id)).toEqual(['layer-stack', 'slot-vs-frame']);
    expect(MOTION_FIXTURES.filter(({ id }) => id === 'frame-matrix').map(({ frameStyle }) => frameStyle))
      .toEqual(['gold-ornate', 'wood', 'corner-ornate']);
  });

  it('covers all seven attachment authorities and both lifecycle controls', () => {
    const ids = MOTION_FIXTURES.map(({ id }) => id);
    expect(ids).toEqual(expect.arrayContaining([
      'card-local-follow',
      'draw-pile-local',
      'discard-pile-local',
      'player-target',
      'enemy-target',
      'travel',
      'tabletop-local',
      'resize-active',
      'cancel-cleanup',
      'reduced-motion',
    ]));
  });
});
