import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  plant,
  water,
  harvest,
  sell,
  buyUpgrade,
  endDay,
  GameState
} from '../src/simulation';

describe('Tiny Farm Day Simulation', () => {
  it('initial state is correct', () => {
    const state = createInitialState();
    expect(state.plots.length).toBe(3);
    expect(state.plots.every(p => p.state === 'Empty')).toBe(true);
    expect(state.seeds).toBe(3);
    expect(state.crops).toBe(0);
    expect(state.coins).toBe(0);
    expect(state.tick).toBe(0);
    expect(state.upgradePurchased).toBe(false);
    expect(state.dayStatus).toBe('Active');
  });

  it('plant consumes seed and sets plot to PlantedDry', () => {
    let state = createInitialState();
    state = plant(state, 0);
    expect(state.seeds).toBe(2);
    expect(state.plots[0].state).toBe('PlantedDry');
    expect(state.tick).toBe(1);
  });

  it('cannot plant without seeds', () => {
    let state = createInitialState();
    state.seeds = 0;
    const newState = plant(state, 0);
    expect(newState).toBe(state); // No state mutation
    expect(newState.tick).toBe(0);
  });

  it('cannot plant on non-empty plot', () => {
    let state = createInitialState();
    state = plant(state, 0);
    const newState = plant(state, 0);
    expect(newState).toBe(state);
    expect(newState.seeds).toBe(2);
  });

  it('water changes dry planted plot to watered', () => {
    let state = createInitialState();
    state = plant(state, 0);
    state = water(state, 0);
    expect(state.plots[0].state).toBe('PlantedWatered');
    expect(state.tick).toBe(2);
  });

  it('invalid water does not advance time', () => {
    let state = createInitialState();
    const newState = water(state, 0); // Plot 0 is Empty
    expect(newState).toBe(state);
    expect(newState.tick).toBe(0);
  });

  it('watered crop grows after required ticks', () => {
    let state = createInitialState();
    state = plant(state, 0);
    state = water(state, 0);
    expect(state.plots[0].state).toBe('PlantedWatered');
    
    // Tick 3: Valid action (plant plot 1)
    state = plant(state, 1);
    expect(state.plots[0].state).toBe('PlantedWatered'); // 1 growth tick
    
    // Tick 4: Valid action (water plot 1)
    state = water(state, 1);
    expect(state.plots[0].state).toBe('Grown'); // 2 growth ticks -> Grown
  });

  it('dry planted crop does not grow', () => {
    let state = createInitialState();
    state = plant(state, 0); // Tick 1
    state = plant(state, 1); // Tick 2
    state = plant(state, 2); // Tick 3
    expect(state.plots[0].state).toBe('PlantedDry');
  });

  it('harvest adds crop and resets plot', () => {
    let state = createInitialState();
    state = plant(state, 0);
    state = water(state, 0);
    state = plant(state, 1);
    state = water(state, 1);
    // Plot 0 should be Grown now (watered at tick 2, tick 3 + 4 advanced growth)
    expect(state.plots[0].state).toBe('Grown');
    
    state = harvest(state, 0);
    expect(state.crops).toBe(1);
    expect(state.plots[0].state).toBe('Empty');
  });

  it('sell converts crops to coins', () => {
    let state = createInitialState();
    state.crops = 2; // Forcing crops for test
    state = sell(state);
    expect(state.crops).toBe(0);
    expect(state.coins).toBe(4); // 2 coins each
    expect(state.tick).toBe(1);
  });

  it('upgrade requires enough coins', () => {
    let state = createInitialState();
    state.coins = 4;
    const newState = buyUpgrade(state);
    expect(newState).toBe(state);
    expect(newState.upgradePurchased).toBe(false);
  });

  it('end day before upgrade produces Defeat', () => {
    let state = createInitialState();
    state = endDay(state);
    expect(state.dayStatus).toBe('Defeat');
  });

  it('end day after upgrade produces Victory', () => {
    let state = createInitialState();
    state.coins = 5;
    state = buyUpgrade(state);
    state = endDay(state);
    expect(state.dayStatus).toBe('Victory');
  });

  it('reset restores initial state', () => {
    let state = createInitialState();
    state = plant(state, 0);
    state = createInitialState(); // Reset is just calling createInitialState
    expect(state.tick).toBe(0);
    expect(state.plots[0].state).toBe('Empty');
  });

  it('terminal lock prevents state mutation after victory/defeat', () => {
    let state = createInitialState();
    state = endDay(state); // Defeat
    const newState = plant(state, 0);
    expect(newState).toBe(state);
  });
});
