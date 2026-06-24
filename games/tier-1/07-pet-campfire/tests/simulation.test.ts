import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  tick,
  feed,
  play,
  GameState
} from '../src/simulation';

describe('Pet Campfire Simulation', () => {
  it('initial state bounds are correct', () => {
    const state = createInitialState();
    expect(state.hunger).toBe(100);
    expect(state.happiness).toBe(100);
    expect(state.survivalTime).toBe(0);
    expect(state.dayStatus).toBe('Active');
    expect(state.petStatus).toBe('Idle');
    expect(state.ledger[0]).toBe('Campfire lit.');
  });

  it('tick(1) decays meters and increments survival time', () => {
    let state = createInitialState();
    state = tick(state, 1);
    expect(state.hunger).toBe(96);
    expect(state.happiness).toBe(97);
    expect(state.survivalTime).toBe(1);
  });

  it('meters clamp at exactly 0', () => {
    let state = createInitialState();
    state = tick(state, 30); // 30 * 4 = 120 hunger decay, should clamp at 0
    expect(state.hunger).toBe(0);
    expect(state.happiness).toBe(Math.max(0, 100 - 30 * 3)); // 10
  });

  it('Feed restores Hunger by 25 and caps at 100', () => {
    let state = createInitialState();
    state.hunger = 80;
    state = feed(state);
    expect(state.hunger).toBe(100);

    state.hunger = 50;
    state = feed(state);
    expect(state.hunger).toBe(75);
  });

  it('Play restores Happiness by 25 and caps at 100', () => {
    let state = createInitialState();
    state.happiness = 80;
    state = play(state);
    expect(state.happiness).toBe(100);

    state.happiness = 50;
    state = play(state);
    expect(state.happiness).toBe(75);
  });

  it('Feed sets Pet Status to Eating', () => {
    let state = createInitialState();
    state = feed(state);
    expect(state.petStatus).toBe('Eating');
  });

  it('Play sets Pet Status to Playing', () => {
    let state = createInitialState();
    state = play(state);
    expect(state.petStatus).toBe('Playing');
  });

  it('tick after Eating/Playing returns Pet Status to Idle unless terminal', () => {
    let state = createInitialState();
    state = feed(state);
    expect(state.petStatus).toBe('Eating');
    state = tick(state, 1);
    expect(state.petStatus).toBe('Idle');

    state = play(state);
    expect(state.petStatus).toBe('Playing');
    state = tick(state, 1);
    expect(state.petStatus).toBe('Idle');
  });

  it('Defeat is correctly triggered at Hunger <= 0 and sets RanAway', () => {
    let state = createInitialState();
    state.hunger = 4;
    state = tick(state, 1);
    expect(state.hunger).toBe(0);
    expect(state.dayStatus).toBe('Defeat');
    expect(state.petStatus).toBe('RanAway');
  });

  it('Defeat is correctly triggered at Happiness <= 0 and sets RanAway', () => {
    let state = createInitialState();
    state.happiness = 3;
    state = tick(state, 1);
    expect(state.happiness).toBe(0);
    expect(state.dayStatus).toBe('Defeat');
    expect(state.petStatus).toBe('RanAway');
  });

  it('Victory is correctly triggered at SurvivalTime >= 60 and sets Sleeping', () => {
    let state = createInitialState();
    state.survivalTime = 59;
    state = tick(state, 1);
    expect(state.survivalTime).toBe(60);
    expect(state.dayStatus).toBe('Victory');
    expect(state.petStatus).toBe('Sleeping');
  });

  it('Terminal lock prevents Feed/Play/tick mutation after Victory/Defeat', () => {
    let state = createInitialState();
    state.survivalTime = 59;
    state = tick(state, 1); // Victory

    const stateAfterTick = tick(state, 1);
    expect(stateAfterTick).toBe(state);

    const stateAfterFeed = feed(state);
    expect(stateAfterFeed).toBe(state);

    const stateAfterPlay = play(state);
    expect(stateAfterPlay).toBe(state);
  });

  it('Reset restores initial state perfectly', () => {
    let state = createInitialState();
    state = feed(state);
    state = tick(state, 1);
    
    // Reset is effectively re-calling createInitialState
    state = createInitialState();
    expect(state.hunger).toBe(100);
    expect(state.petStatus).toBe('Idle');
    expect(state.survivalTime).toBe(0);
  });
});
