import { describe, expect, it } from 'vitest';

import { createRoundController } from '../src/controller';
import { createRoundState, placePotion, selectPotion, tick } from '../src/simulation';

describe('Potion Sorter simulation', () => {
  it('starts a single short round with an active potion and three shelf types', () => {
    const state = createRoundState();

    expect(state).toMatchObject({
      activePotion: 'sun',
      selectedPotion: false,
      score: 0,
      combo: 0,
      timeRemaining: 30,
      roundComplete: false,
      feedback: 'Select the potion, then choose its shelf.'
    });
    expect(state.shelves).toEqual(['sun', 'moon', 'star']);
  });

  it('requires potion selection before a shelf placement can resolve', () => {
    const state = placePotion(createRoundState(), 'sun');

    expect(state).toMatchObject({
      activePotion: 'sun',
      selectedPotion: false,
      score: 0,
      feedback: 'Select the potion first.'
    });
  });

  it('shows selected state before the player chooses a shelf', () => {
    const state = selectPotion(createRoundState());

    expect(state).toMatchObject({ selectedPotion: true, feedback: 'Potion selected — choose a shelf.' });
  });

  it('rewards a correct selected placement with score and combo', () => {
    const selected = selectPotion(createRoundState());
    const state = placePotion(selected, 'sun');

    expect(state).toMatchObject({
      activePotion: 'moon',
      selectedPotion: false,
      score: 10,
      combo: 1,
      feedback: 'Correct! +10 points'
    });
  });

  it('resets combo and gives immediate feedback for an incorrect placement', () => {
    const selected = selectPotion(createRoundState());
    const state = placePotion(selected, 'moon');

    expect(state).toMatchObject({
      activePotion: 'moon',
      selectedPotion: false,
      score: 0,
      combo: 0,
      feedback: 'Wrong shelf — try the next potion.'
    });
  });

  it('ends the round when its short timer reaches zero', () => {
    const state = tick(createRoundState(), 30);

    expect(state).toMatchObject({ timeRemaining: 0, roundComplete: true, feedback: 'Time! Round complete.' });
  });
});

describe('round controller', () => {
  it('publishes tap-select actions while keeping round state outside render subscribers', () => {
    const controller = createRoundController();
    const observedSelections: boolean[] = [];
    controller.subscribe((state) => observedSelections.push(state.selectedPotion));

    controller.selectPotion();
    controller.placePotion('sun');

    expect(controller.getState()).toMatchObject({ activePotion: 'moon', score: 10, combo: 1, selectedPotion: false });
    expect(observedSelections).toEqual([false, true, false]);
  });
});
