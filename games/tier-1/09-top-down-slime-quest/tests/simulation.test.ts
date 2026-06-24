import { describe, it, expect, beforeEach } from 'vitest';
import { tick, INITIAL_STATE, GameState, InputState } from '../src/simulation';

function getEmptyInput(): InputState {
  return { up: false, down: false, left: false, right: false, pounce: false, reset: false };
}

describe('Level 9 Simulation', () => {
  let state: GameState;
  
  beforeEach(() => {
    state = JSON.parse(JSON.stringify(INITIAL_STATE));
  });

  it('initial state exact positions/facing/status', () => {
    expect(state.player.rect).toEqual({ x: 80, y: 300, w: 32, h: 32 });
    expect(state.player.facing).toBe('right');
    expect(state.player.state).toBe('Normal');
    expect(state.enemy.status).toBe('Active');
    expect(state.essence.status).toBe('Inactive');
    expect(state.runStatus).toBe('Active');
    expect(state.ledger).toEqual(['Slime awakened.']);
  });

  it('four-direction movement updates facing', () => {
    let input = getEmptyInput();
    input.up = true;
    state = tick(state, input, 1/60);
    expect(state.player.facing).toBe('up');
    expect(state.player.rect.y).toBeLessThan(300);

    state = JSON.parse(JSON.stringify(INITIAL_STATE));
    input = getEmptyInput(); input.left = true;
    state = tick(state, input, 1/60);
    expect(state.player.facing).toBe('left');
    expect(state.player.rect.x).toBeLessThan(80);
  });

  it('pounce starts from Normal using current facing', () => {
    let input = getEmptyInput(); input.pounce = true;
    state = tick(state, input, 1/60);
    expect(state.player.state).toBe('Pouncing');
    expect(state.player.pounceTimer).toBeGreaterThan(0);
    expect(state.player.rect.x).toBeGreaterThan(80); // moving right
  });

  it('pounce cannot steer', () => {
    let input = getEmptyInput(); input.pounce = true;
    state = tick(state, input, 1/60);
    
    // Now try to steer up
    input = getEmptyInput(); input.up = true;
    state = tick(state, input, 1/60);
    
    expect(state.player.facing).toBe('right'); // still moving right from pounce
    expect(state.player.rect.y).toBe(300); // Y shouldn't change
  });

  it('pounce duration returns to Normal', () => {
    let input = getEmptyInput(); input.pounce = true;
    state = tick(state, input, 1/60);
    
    input.pounce = false;
    state = tick(state, input, 0.3); // Exceed duration
    expect(state.player.state).toBe('Normal');
    expect(state.player.pounceTimer).toBe(0);
  });

  it('pounce into wall stops at boundary and returns to Normal', () => {
    // Face left and pounce into left wall (x=80, moving 400px/s will hit wall quickly)
    state.player.facing = 'left';
    let input = getEmptyInput(); input.pounce = true;
    state = tick(state, input, 1/60);
    input.pounce = false;
    
    // Tick 30 times (0.5s)
    for (let i = 0; i < 30; i++) {
      state = tick(state, input, 1/60);
    }
    
    expect(state.player.rect.x).toBe(0);
    expect(state.player.state).toBe('Normal');
    expect(state.ledger[state.ledger.length - 1]).toBe('Bonked wall.');
  });

  it('normal enemy contact triggers Defeat', () => {
    state.player.rect.x = state.enemy.rect.x - 10;
    let input = getEmptyInput(); input.right = true; // normal move into enemy
    
    for (let i = 0; i < 60; i++) {
      state = tick(state, input, 1/60);
      if (state.runStatus === 'Defeat') break;
    }
    
    expect(state.runStatus).toBe('Defeat');
    expect(state.ledger[state.ledger.length - 1]).toBe('Defeated.');
  });

  it('pounce enemy contact defeats enemy and spawns essence', () => {
    state.player.rect.x = state.enemy.rect.x - 20;
    let input = getEmptyInput(); input.pounce = true;
    state = tick(state, input, 1/60); // Starts pounce and overlaps
    
    expect(state.runStatus).toBe('Active');
    expect(state.enemy.status).toBe('Defeated');
    // Because it spawns where we pounced, it is collected instantly in the same tick!
    expect(state.essence.status).toBe('Collected');
    expect(state.ledger).toContain('Enemy defeated.');
  });

  it('essence collection sets collected/unlocks exit', () => {
    state.essence.status = 'Active';
    state.essence.rect.x = state.player.rect.x;
    state.essence.rect.y = state.player.rect.y;
    
    state = tick(state, getEmptyInput(), 1/60);
    expect(state.essence.status).toBe('Collected');
    expect(state.ledger).toContain('Essence absorbed.');
    expect(state.ledger).toContain('Exit unlocked.');
  });

  it('exit before essence does not win', () => {
    state.player.rect.x = state.exit.x;
    state.player.rect.y = state.exit.y;
    state = tick(state, getEmptyInput(), 1/60);
    
    expect(state.runStatus).toBe('Active');
  });

  it('exit after essence triggers Victory', () => {
    state.essence.status = 'Collected';
    state.player.rect.x = state.exit.x + 10;
    state.player.rect.y = state.exit.y + 10;
    state = tick(state, getEmptyInput(), 1/60);
    
    expect(state.runStatus).toBe('Victory');
    expect(state.ledger).toContain('Escaped.');
  });

  it('terminal lock prevents mutation after Victory/Defeat', () => {
    state.runStatus = 'Defeat';
    let input = getEmptyInput(); input.right = true;
    let oldX = state.player.rect.x;
    state = tick(state, input, 1/60);
    
    expect(state.player.rect.x).toBe(oldX); // Should not move
  });

  it('reset restores initial state', () => {
    state.player.rect.x = 500;
    let input = getEmptyInput(); input.reset = true;
    state = tick(state, input, 1/60);
    
    expect(state.player.rect.x).toBe(80);
    expect(state.runStatus).toBe('Active');
  });
});
