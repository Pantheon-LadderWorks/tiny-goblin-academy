import { describe, it, expect } from 'vitest';
import { createInitialState, movePlayer, isSamePosition } from '../src/simulation';

describe('Level 5 Dungeon Simulation', () => {
  it('Initial map state', () => {
    const state = createInitialState();
    expect(state.status).toBe('playing');
    expect(state.player).toEqual({ x: 1, y: 2 });
    expect(state.hasKey).toBe(false);
    expect(state.enemy).toEqual({ x: 7, y: 4 });
  });

  it('Blocked walls and out-of-bounds movement', () => {
    let state = createInitialState();
    // Move up into outer boundary wall (x: 1, y: 0) from 1,2? No, 1,1 is open, 1,0 is wall.
    state = movePlayer(state, 'up'); // Moves to 1,1
    state = movePlayer(state, 'up'); // Blocked at 1,0
    expect(state.player).toEqual({ x: 1, y: 1 }); 
    expect(state.ledger[state.ledger.length - 1]).toContain('Blocked');
  });

  it('Valid movement', () => {
    let state = createInitialState(); // P: 1,2
    state = movePlayer(state, 'down'); // P: 1,3
    expect(state.player).toEqual({ x: 1, y: 3 });
    // Enemy patrols from 7,4 to 8,4
    expect(state.enemy).toEqual({ x: 8, y: 4 }); 
  });

  it('Key pickup', () => {
    let state = createInitialState();
    // Teleport player near key for test
    state.player = { x: 1, y: 6 };
    state = movePlayer(state, 'down'); // moves to 1,7
    expect(state.player).toEqual({ x: 1, y: 7 });
    expect(state.hasKey).toBe(true);
    expect(state.ledger[state.ledger.length - 1]).toContain('Collected Key');
  });

  it('Locked exit without key', () => {
    let state = createInitialState();
    // Player is at 1,2, exit is at 2,2. Move right.
    state = movePlayer(state, 'right'); // moves to 2,2
    expect(state.player).toEqual({ x: 2, y: 2 });
    expect(state.hasKey).toBe(false);
    expect(state.status).toBe('playing');
    expect(state.ledger[state.ledger.length - 1]).toContain('Exit is locked');
  });

  it('Unlocked exit with key', () => {
    let state = createInitialState();
    state.player = { x: 1, y: 2 };
    state.hasKey = true;
    state = movePlayer(state, 'right'); // moves to 2,2
    expect(state.status).toBe('victory');
    expect(state.ledger[state.ledger.length - 1]).toContain('Victory');
  });

  it('Enemy patrol advancing after valid player moves', () => {
    let state = createInitialState();
    expect(state.enemy).toEqual({ x: 7, y: 4 });
    state = movePlayer(state, 'down'); // Valid move to 1,3
    expect(state.enemy).toEqual({ x: 8, y: 4 });
    state = movePlayer(state, 'up'); // Valid move to 1,2
    expect(state.enemy).toEqual({ x: 8, y: 5 });
  });

  it('Enemy does not advance after invalid moves', () => {
    let state = createInitialState();
    expect(state.enemy).toEqual({ x: 7, y: 4 });
    state.player = { x: 1, y: 1 };
    state = movePlayer(state, 'up'); // Blocked move
    expect(state.enemy).toEqual({ x: 7, y: 4 }); // Still same
  });

  it('Collision/defeat', () => {
    let state = createInitialState();
    // Enemy is at 7,4. Next move it goes to 8,4.
    // Put player at 8,3. Player moves down to 8,4.
    // Enemy will move from 7,4 to 8,4. Wait, if player moves to 8,4, enemy steps to 8,4 -> collision.
    state.player = { x: 8, y: 3 };
    state = movePlayer(state, 'down'); // Player moves to 8,4. Enemy moves 7,4 -> 8,4. Collision!
    expect(isSamePosition(state.player, state.enemy)).toBe(true);
    expect(state.status).toBe('defeat');
    expect(state.ledger[state.ledger.length - 1]).toContain('Defeat');
  });

  it('Victory lock and Defeat lock', () => {
    let state = createInitialState();
    state.status = 'victory';
    const postVictoryState = movePlayer(state, 'right');
    // Should return same state reference or unchanged
    expect(postVictoryState.player).toEqual(state.player);

    let state2 = createInitialState();
    state2.status = 'defeat';
    const postDefeatState = movePlayer(state2, 'right');
    expect(postDefeatState.player).toEqual(state2.player);
  });
});
