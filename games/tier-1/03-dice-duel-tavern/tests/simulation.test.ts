import { describe, expect, it } from 'vitest';
import { act, createDuel, roll } from '../src/simulation';

describe('Dice Duel Tavern', () => {
  it('rolls once then enables actions with a visible log entry', () => {
    const state = roll(createDuel());
    expect(state).toMatchObject({ phase: 'action', roll: 4, playerHp: 10, enemyHp: 10 });
    expect(state.log.at(-1)).toBe('You rolled 4.');
  });
  it('attack deals the roll value then logs deterministic enemy damage', () => {
    const state = act(roll(createDuel()), 'attack');
    expect(state).toMatchObject({ phase: 'roll', enemyHp: 6, playerHp: 7, roll: null });
    expect(state.log.slice(-2)).toEqual(['You chose Attack for 4 damage.', 'Goblin Brawler attacks for 3.']);
  });
  it('block reduces next enemy attack to zero and explains why', () => {
    const state = act(roll(createDuel()), 'block');
    expect(state).toMatchObject({ playerHp: 10, phase: 'roll' });
    expect(state.log.slice(-2)).toEqual(['You chose Block for 4.', 'Goblin Brawler attacks for 3. Block reduced it to 0.']);
  });
});
