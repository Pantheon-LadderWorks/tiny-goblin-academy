import { describe, it, expect } from 'vitest';
import { createInitialState, advanceDay, setPriority, resetGame } from '../src/simulation';

describe('Level 10 Simulation Tests', () => {
  it('initial state', () => {
    const state = createInitialState();
    expect(state.day).toBe(1);
    expect(state.citizens).toBe(3);
    expect(state.food).toBe(6);
    expect(state.wood).toBe(3);
    expect(state.shelter).toBe(1);
    expect(state.priority).toBe('Forage');
    expect(state.runStatus).toBe('Active');
  });

  it('selecting priority does not advance day', () => {
    const state = createInitialState();
    setPriority(state, 'Chop');
    expect(state.priority).toBe('Chop');
    expect(state.day).toBe(1);
    expect(state.wood).toBe(3);
  });

  it('Forage adds food after consumption', () => {
    const state = createInitialState();
    state.food = 3;
    setPriority(state, 'Forage');
    advanceDay(state);
    expect(state.food).toBe(4); // 3 - 3 + 4
  });

  it('Chop adds wood after consumption', () => {
    const state = createInitialState();
    setPriority(state, 'Chop');
    advanceDay(state);
    expect(state.wood).toBe(6); // 3 + 3
    expect(state.food).toBe(3); // 6 - 3
  });

  it('Build spends 3 wood and adds 1 shelter', () => {
    const state = createInitialState();
    setPriority(state, 'Build');
    advanceDay(state);
    expect(state.wood).toBe(0);
    expect(state.shelter).toBe(2);
  });

  it('Build with insufficient wood logs/does nothing except daily consumption', () => {
    const state = createInitialState();
    state.wood = 2;
    setPriority(state, 'Build');
    advanceDay(state);
    expect(state.wood).toBe(2);
    expect(state.shelter).toBe(1);
    expect(state.food).toBe(3);
    expect(state.ledger[0]).toContain('Insufficient wood');
  });

  it('each day consumes 3 food', () => {
    const state = createInitialState();
    setPriority(state, 'Chop');
    advanceDay(state);
    expect(state.food).toBe(3);
  });

  it('starvation defeat when Food < 0 after consumption', () => {
    const state = createInitialState();
    state.food = 2;
    advanceDay(state);
    expect(state.food).toBe(-1);
    expect(state.runStatus).toBe('Defeat');
  });

  it('starvation defeat short-circuits before priority production can rescue the settlement', () => {
    const state = createInitialState();
    state.food = 2;
    setPriority(state, 'Forage'); // Would produce 4 food
    advanceDay(state);
    expect(state.food).toBe(-1); // Did not add 4 food
    expect(state.runStatus).toBe('Defeat');
  });

  it('Day 5 storm defeat if Shelter < 2', () => {
    const state = createInitialState();
    state.day = 5;
    state.shelter = 1;
    setPriority(state, 'Forage');
    advanceDay(state);
    expect(state.runStatus).toBe('Defeat');
    expect(state.day).toBe(5); // Should short circuit
  });

  it('Day 5 Build can prevent storm defeat if priority resolves before event', () => {
    const state = createInitialState();
    state.day = 5;
    state.shelter = 1;
    state.wood = 3;
    setPriority(state, 'Build'); // Priority resolves before event
    advanceDay(state);
    expect(state.shelter).toBe(2);
    expect(state.runStatus).toBe('Active');
    expect(state.day).toBe(6);
  });

  it('victory at end of Day 10 without defeat', () => {
    const state = createInitialState();
    state.day = 10;
    state.food = 10;
    advanceDay(state);
    expect(state.runStatus).toBe('Victory');
  });

  it('Day 10 victory does not increment to Day 11', () => {
    const state = createInitialState();
    state.day = 10;
    state.food = 10;
    advanceDay(state);
    expect(state.day).toBe(10);
  });

  it('terminal lock prevents priority/advance mutation after Victory/Defeat', () => {
    const state = createInitialState();
    state.runStatus = 'Victory';
    state.food = 10;
    state.day = 10;
    
    setPriority(state, 'Chop');
    expect(state.priority).toBe('Forage'); // unchanged

    advanceDay(state);
    expect(state.food).toBe(10); // unchanged
  });

  it('reset restores initial state', () => {
    const state = resetGame();
    expect(state.day).toBe(1);
    expect(state.runStatus).toBe('Active');
  });

  it('ledger logs discrete daily events', () => {
    const state = createInitialState();
    advanceDay(state);
    expect(state.ledger.length).toBeGreaterThan(1);
    expect(state.ledger[0]).toContain('Day 1:');
  });
});
