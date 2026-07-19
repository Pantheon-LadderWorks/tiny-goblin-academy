import { describe, expect, it } from 'vitest';
import { act, beginRoll, completeRoll, createDuel } from '../src/simulation';

const settledRoll = (face: 1 | 2 | 3 | 4 | 5 | 6) => completeRoll(beginRoll(createDuel(), face));

describe('Dice Duel Tavern', () => {
  it('stores an injected face in rolling before enabling actions or announcing it', () => {
    const state = beginRoll(createDuel(), 4);
    expect(state).toMatchObject({ phase: 'rolling', roll: 4, playerHp: 10, enemyHp: 10 });
    expect(state.log).toEqual(['Your turn. Roll the d6.']);
    expect(act(state, 'attack')).toBe(state);
  });

  it('completes the stored roll once and records its causal entry exactly once', () => {
    const rolling = beginRoll(createDuel(), 6);
    const settled = completeRoll(rolling);
    expect(settled).toMatchObject({ phase: 'action', roll: 6 });
    expect(settled.log.at(-1)).toBe('You rolled 6.');
    expect(completeRoll(settled)).toBe(settled);
    expect(settled.log.filter((entry) => entry === 'You rolled 6.')).toHaveLength(1);
  });
  it('attack deals the roll value then logs deterministic enemy damage', () => {
    const state = act(settledRoll(4), 'attack');
    expect(state).toMatchObject({ phase: 'roll', enemyHp: 6, playerHp: 7, roll: null });
    expect(state.log.slice(-2)).toEqual(['You chose Attack for 4 damage.', 'Goblin Brawler attacks for 3.']);
  });
  it('block reduces next enemy attack to zero and explains why', () => {
    const state = act(settledRoll(4), 'block');
    expect(state).toMatchObject({ playerHp: 10, phase: 'roll' });
    expect(state.log.slice(-2)).toEqual(['You chose Block for 4.', 'Goblin Brawler attacks for 3. Block reduced it to 0.']);
  });

  it('preserves attack, heal, HP caps, victory, defeat, and enemy damage', () => {
    expect(act(settledRoll(3), 'heal')).toMatchObject({ playerHp: 7, phase: 'roll' });
    expect(act({ ...settledRoll(6), enemyHp: 6 }, 'attack')).toMatchObject({ enemyHp: 0, phase: 'won' });
    expect(act({ ...settledRoll(1), playerHp: 3 }, 'attack')).toMatchObject({ playerHp: 0, phase: 'lost' });
    expect(act({ ...settledRoll(6), playerHp: 9 }, 'heal')).toMatchObject({ playerHp: 7, phase: 'roll' });
  });
});
