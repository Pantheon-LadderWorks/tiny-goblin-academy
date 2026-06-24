import { describe, it, expect } from 'vitest';
import { createInitialState, tick, Input, CONSTANTS, GEOMETRY } from '../src/simulation';

describe('Simulation', () => {
  it('initial state correctly parses the spawn position, starting grounded at floor spawn with vx=0 and vy=0', () => {
    const state = createInitialState();
    expect(state.player.x).toBe(60);
    expect(state.player.y).toBe(352);
    expect(state.player.vx).toBe(0);
    expect(state.player.vy).toBe(0);
    expect(state.player.isGrounded).toBe(true);
    expect(state.runStatus).toBe('Active');
  });

  it('gravity increases downward velocity over fixed ticks', () => {
    const state = createInitialState();
    const input: Input = { left: false, right: false, jump: false };
    
    // Float the player to observe gravity
    state.player.y = 100;
    state.player.isGrounded = false;
    
    tick(state, input, 1/60);
    expect(state.player.vy).toBeGreaterThan(0);
    expect(state.player.vy).toBeCloseTo(CONSTANTS.GRAVITY * (1/60));
  });

  it('left/right input changes horizontal movement', () => {
    const state = createInitialState();
    let input: Input = { left: false, right: true, jump: false };
    
    tick(state, input, 1/60);
    expect(state.player.vx).toBe(CONSTANTS.RUN_SPEED);
    expect(state.player.x).toBeGreaterThan(60);
    
    const xAfterRight = state.player.x;
    input = { left: true, right: false, jump: false };
    tick(state, input, 1/60);
    expect(state.player.vx).toBe(-CONSTANTS.RUN_SPEED);
    expect(state.player.x).toBeLessThan(xAfterRight);
  });

  it('no input stops horizontal movement', () => {
    const state = createInitialState();
    state.player.vx = CONSTANTS.RUN_SPEED; // Force some velocity
    const input: Input = { left: false, right: false, jump: false };
    
    tick(state, input, 1/60);
    expect(state.player.vx).toBe(0);
  });

  it('jump applies only when grounded', () => {
    const state = createInitialState();
    const input: Input = { left: false, right: false, jump: true };
    
    tick(state, input, 1/60);
    expect(state.player.vy).toBe(CONSTANTS.JUMP_VELOCITY);
    expect(state.player.isGrounded).toBe(false);
    expect(state.events[0]).toBe('Jumped.');
  });

  it('jump does not apply while airborne', () => {
    const state = createInitialState();
    state.player.y = 100; // airborne
    state.player.isGrounded = false;
    state.player.vy = 50; // falling slightly
    const input: Input = { left: false, right: false, jump: true };
    
    tick(state, input, 1/60);
    // Should only have gravity applied to the initial 50
    expect(state.player.vy).toBeGreaterThan(0);
  });

  it('floor collision prevents falling through', () => {
    const state = createInitialState();
    // Position player just above floor
    state.player.y = GEOMETRY.FLOOR.y - CONSTANTS.PLAYER_H - 1;
    state.player.isGrounded = false;
    state.player.vy = 100; // falling fast
    
    const input: Input = { left: false, right: false, jump: false };
    tick(state, input, 1/60);
    
    // Should have landed exactly on top of floor
    expect(state.player.y).toBe(GEOMETRY.FLOOR.y - CONSTANTS.PLAYER_H);
  });

  it('landing sets isGrounded true and vy 0', () => {
    const state = createInitialState();
    state.player.y = GEOMETRY.FLOOR.y - CONSTANTS.PLAYER_H - 1;
    state.player.isGrounded = false;
    state.player.vy = 100;
    
    const input: Input = { left: false, right: false, jump: false };
    tick(state, input, 1/60);
    
    expect(state.player.isGrounded).toBe(true);
    expect(state.player.vy).toBe(0);
  });

  it('platform collision works', () => {
    const state = createInitialState();
    // Position player just above platform 1
    state.player.x = GEOMETRY.PLATFORM_1.x + 10;
    state.player.y = GEOMETRY.PLATFORM_1.y - CONSTANTS.PLAYER_H - 1;
    state.player.isGrounded = false;
    state.player.vy = 50;
    
    const input: Input = { left: false, right: false, jump: false };
    tick(state, input, 1/60);
    
    expect(state.player.y).toBe(GEOMETRY.PLATFORM_1.y - CONSTANTS.PLAYER_H);
    expect(state.player.isGrounded).toBe(true);
    expect(state.player.vy).toBe(0);
  });

  it('spike collision triggers Defeat', () => {
    const state = createInitialState();
    // Teleport player directly onto spikes
    state.player.x = GEOMETRY.SPIKES.x;
    state.player.y = GEOMETRY.SPIKES.y - CONSTANTS.PLAYER_H;
    
    const input: Input = { left: false, right: false, jump: false };
    tick(state, input, 1/60);
    // Gravity pulled them into spikes
    expect(state.runStatus).toBe('Defeat');
    expect(state.events[0]).toBe('Hit spikes.');
  });

  it('goal collision triggers Victory', () => {
    const state = createInitialState();
    // Teleport player directly onto goal
    state.player.x = GEOMETRY.GOAL.x;
    state.player.y = GEOMETRY.GOAL.y - CONSTANTS.PLAYER_H;
    
    const input: Input = { left: false, right: false, jump: false };
    tick(state, input, 1/60);
    // Gravity pulled them into goal
    expect(state.runStatus).toBe('Victory');
    expect(state.events[0]).toBe('Reached goal.');
  });

  it('terminal lock prevents movement/tick mutation after Victory/Defeat', () => {
    const state = createInitialState();
    state.runStatus = 'Defeat';
    state.player.x = 100;
    const initialX = state.player.x;
    
    const input: Input = { left: false, right: true, jump: false };
    tick(state, input, 1/60);
    
    expect(state.player.x).toBe(initialX); // Should not move
  });

  it('reset restores initial state', () => {
    // Reset isn't a tick parameter, it's typically just re-calling createInitialState
    // We'll test that createInitialState works properly without shared references
    const state1 = createInitialState();
    state1.player.x = 999;
    
    const state2 = createInitialState();
    expect(state2.player.x).toBe(60); // Independent
  });
});
