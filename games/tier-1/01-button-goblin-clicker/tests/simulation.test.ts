import { describe, it, expect, beforeEach } from 'vitest';
import { createSimulation, bonk, buyBonkStick, advanceGoblin, GameState } from '../src/simulation';

describe('Button Goblin Clicker Simulation', () => {
  let state: GameState;

  beforeEach(() => {
    state = createSimulation();
  });

  it('starts at goblin 1 with correct initial state', () => {
    expect(state.goblinIndex).toBe(1);
    expect(state.coins).toBe(0);
    expect(state.damage).toBe(1);
    expect(state.bonkStickPurchased).toBe(false);
    expect(state.victory).toBe(false);
    expect(state.currentGoblinHp).toBeGreaterThan(0);
  });

  it('reduces HP when bonked', () => {
    const initialHp = state.currentGoblinHp;
    state = bonk(state);
    expect(state.currentGoblinHp).toBe(initialHp - 1);
  });

  it('defeats a goblin, awards a coin, and sets state to 0 HP', () => {
    // Bonk until HP is 0
    while (state.currentGoblinHp > 0) {
      state = bonk(state);
    }
    expect(state.currentGoblinHp).toBe(0);
    expect(state.coins).toBe(1);
    
    // Additional bonks when dead shouldn't change anything
    const stateAfterDead = bonk(state);
    expect(stateAfterDead.currentGoblinHp).toBe(0);
    expect(stateAfterDead.coins).toBe(1);
  });

  it('advances to next goblin, restoring HP and increasing index', () => {
    // Kill first goblin
    while (state.currentGoblinHp > 0) {
      state = bonk(state);
    }
    
    state = advanceGoblin(state);
    expect(state.goblinIndex).toBe(2);
    expect(state.currentGoblinHp).toBeGreaterThan(0);
  });

  it('cannot purchase Bonk Stick without 3 coins', () => {
    const newState = buyBonkStick(state);
    expect(newState.bonkStickPurchased).toBe(false);
    expect(newState.damage).toBe(1);
  });

  it('purchases Bonk Stick for 3 coins and increases damage', () => {
    // Cheat in 3 coins
    state.coins = 3;
    const newState = buyBonkStick(state);
    
    expect(newState.bonkStickPurchased).toBe(true);
    expect(newState.coins).toBe(0);
    expect(newState.damage).toBe(2);
  });

  it('reaches victory after 10 goblins', () => {
    // Simulate killing 10 goblins
    for (let i = 0; i < 10; i++) {
      while (state.currentGoblinHp > 0) {
        state = bonk(state);
      }
      state = advanceGoblin(state);
    }
    
    expect(state.victory).toBe(true);
    
    // Post-victory corruption check
    const postVictoryState = bonk(state);
    expect(postVictoryState.victory).toBe(true);
  });
});
