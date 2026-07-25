import { describe, expect, it } from 'vitest';
import { buildOpeningDealPlan, buildProductionTransitionPlan } from '../src/card-production';
import { createGame, playCard, resolveSparkChoice } from '../src/simulation';

describe('production CardRig transition planning', () => {
  it('plans the opening hand from the draw pile', () => {
    const state = createGame();
    const plan = buildOpeningDealPlan(state, 'live-opening');
    expect(plan.cues.map(({ type, card, slot }) => ({ type, card, slot }))).toEqual([
      { type: 'deal', card: 'Strike', slot: 0 },
      { type: 'deal', card: 'Guard', slot: 1 },
      { type: 'deal', card: 'Mend', slot: 2 },
      { type: 'settle', card: undefined, slot: undefined },
      { type: 'focus', card: 'Strike', slot: 0 },
    ]);
  });

  it('plans ordinary play through center, effect, discard, refill, and settle', () => {
    const before = createGame();
    const after = playCard(before, 0);
    const plan = buildProductionTransitionPlan(before, after, 'Strike', 0, 'live-strike');
    expect(plan.cues.map(({ type, card, slot }) => [type, card, slot])).toEqual([
      ['commit', 'Strike', 0],
      ['effect-hold', 'Strike', undefined],
      ['discard', 'Strike', undefined],
      ['refill', 'Spark', 2],
      ['settle', undefined, undefined],
      ['focus', 'Guard', 0],
    ]);
  });

  it('plans Spark replacement directly to discard and refills exact vacated positions', () => {
    const opening = createGame();
    opening.hand = ['Strike', 'Spark', 'Mend'];
    opening.queue = ['Guard', 'Stun', 'Heavy Bonk'];
    const awaiting = playCard(opening, 1);
    expect(awaiting.phase).toBe('SparkChoice');
    const selected = awaiting.hand[1];
    const after = resolveSparkChoice(awaiting, 1);
    const plan = buildProductionTransitionPlan(awaiting, after, selected, 1, 'live-replace');
    expect(plan.cues.map(({ type, card, slot }) => [type, card, slot])).toEqual([
      ['replace-discard', selected, 1],
      ['refill', after.hand[1], 1],
      ['refill', after.hand[2], 2],
      ['settle', undefined, undefined],
      ['focus', after.hand[0], 0],
    ]);
  });

  it('keeps Heavy Bonk vacant without a refill cue', () => {
    const before = createGame();
    before.hand = ['Strike', 'Guard', 'Heavy Bonk'];
    const after = playCard(before, 2);
    const plan = buildProductionTransitionPlan(before, after, 'Heavy Bonk', 2, 'live-bonk');
    expect(plan.cues.map(({ type }) => type)).toEqual([
      'commit', 'effect-hold', 'discard', 'vacancy', 'settle', 'focus',
    ]);
    expect(plan.cues.some(({ type }) => type === 'refill')).toBe(false);
  });
});
