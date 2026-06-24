import { describe, it, expect } from 'vitest';
import { createGame, playCard, resolveSparkChoice, GameState } from '../src/simulation';

describe('Card Goblin Duel Simulation', () => {
    
    it('initializes with correct hand and queue order', () => {
        const state = createGame();
        expect(state.phase).toBe('PlayerAction');
        expect(state.hand).toEqual(['Strike', 'Guard', 'Mend']);
        expect(state.queue).toEqual(['Spark', 'Stun', 'Heavy Bonk']);
        expect(state.playerHp).toBe(10);
        expect(state.enemyHp).toBe(12);
    });

    it('Strike deals 2 damage and enemy responds', () => {
        let state = createGame();
        state = playCard(state, 0); // Play Strike
        
        expect(state.enemyHp).toBe(10); // 12 - 2
        // Enemy responds
        expect(state.playerHp).toBe(8); // 10 - 2
        expect(state.hand).toHaveLength(3); // Refilled
        expect(state.queue.at(-1)).toBe('Strike'); // Strike went to back of queue
    });

    it('Guard reduces next enemy damage', () => {
        let state = createGame();
        // Move Guard to first position for testing easily, or just play index 1
        state = playCard(state, 1); // Play Guard
        
        // Enemy responds but damage is reduced by 2
        expect(state.playerHp).toBe(10); // 10 - 0 damage
        expect(state.hand).toHaveLength(3);
    });

    it('Mend heals player', () => {
        let state = createGame();
        state.playerHp = 6; // Simulate damage
        state = playCard(state, 2); // Play Mend
        
        // Mend heals 2 (8), enemy deals 2 (6)
        expect(state.playerHp).toBe(6); 
    });

    it('Stun prevents next attack', () => {
        let state = createGame();
        // Setup hand to have Stun
        state.hand = ['Stun', 'Strike', 'Mend'];
        state = playCard(state, 0); // Play Stun
        
        // Enemy is stunned, deals 0 damage
        expect(state.playerHp).toBe(10);
    });

    it('Heavy Bonk deals 4 and skips draw', () => {
        let state = createGame();
        state.hand = ['Heavy Bonk', 'Strike', 'Mend'];
        state = playCard(state, 0); // Play Heavy Bonk
        
        expect(state.enemyHp).toBe(8); // 12 - 4
        expect(state.hand).toHaveLength(2); // Skip draw applied
        expect(state.skip).toBe(false); // Flag resets
    });

    it('Spark sequence works correctly (Play -> Choice -> Resolve)', () => {
        let state = createGame();
        state.hand = ['Strike', 'Guard', 'Spark'];
        
        // 1. Play Spark
        state = playCard(state, 2); 
        expect(state.enemyHp).toBe(11); // Spark deals 1
        expect(state.phase).toBe('SparkChoice');
        expect(state.hand).toEqual(['Strike', 'Guard']); // Spark is gone
        expect(state.playerHp).toBe(10); // Enemy hasn't responded yet!

        // 2. Resolve Spark choice (Discard Guard)
        state = resolveSparkChoice(state, 1); // Discard Guard
        expect(state.phase).toBe('PlayerAction');
        expect(state.hand.length).toBe(3); // Refilled (Spark draw + Replace draw)
        expect(state.playerHp).toBe(8); // Enemy finally responded
    });

    it('Victory lock works', () => {
        let state = createGame();
        state.enemyHp = 2; // Setup near death
        state = playCard(state, 0); // Play Strike
        
        expect(state.enemyHp).toBe(0);
        expect(state.phase).toBe('Terminal');
        
        // Try playing another card, should be locked
        const nextState = playCard(state, 0);
        expect(nextState).toEqual(state); // No change
    });

    it('Defeat lock works', () => {
        let state = createGame();
        state.playerHp = 2; // Setup near death
        // Play something that doesn't prevent damage or kill enemy
        state = playCard(state, 2); // Play Mend (+2 hp)
        // Wait, mend gives 2 hp, so 2+2=4. Enemy hits for 2, hp=2. Not dead.
        
        // Let's force death
        state.playerHp = 2;
        state.enemyHp = 12;
        state.hand = ['Strike', 'Strike', 'Strike'];
        state = playCard(state, 0); // Enemy hits for 2 -> 0 hp
        
        expect(state.playerHp).toBe(0);
        expect(state.phase).toBe('Terminal');
        
        // Try playing another card, should be locked
        const nextState = playCard(state, 0);
        expect(nextState).toEqual(state); // No change
    });
    
});
