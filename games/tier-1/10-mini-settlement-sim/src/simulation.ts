export type Priority = 'Forage' | 'Chop' | 'Build';
export type RunStatus = 'Active' | 'Defeat' | 'Victory';

export interface GameState {
  day: number;
  citizens: number;
  food: number;
  wood: number;
  shelter: number;
  priority: Priority;
  runStatus: RunStatus;
  ledger: string[];
}

export function createInitialState(): GameState {
  return {
    day: 1,
    citizens: 3,
    food: 6,
    wood: 3,
    shelter: 1,
    priority: 'Forage',
    runStatus: 'Active',
    ledger: ['Settlement founded.']
  };
}

export function setPriority(state: GameState, priority: Priority): void {
  if (state.runStatus !== 'Active') return;
  state.priority = priority;
}

export function advanceDay(state: GameState): void {
  if (state.runStatus !== 'Active') return;

  // 1. Consume food
  state.food -= state.citizens;

  // 2. Starvation Defeat
  if (state.food < 0) {
    state.runStatus = 'Defeat';
    state.ledger.unshift(`Day ${state.day}: Starvation! Food ran out.`);
    return; // Short-circuit
  }

  // 3. Apply selected priority
  if (state.priority === 'Forage') {
    state.food += 4;
    state.ledger.unshift(`Day ${state.day}: Foraged 4 food.`);
  } else if (state.priority === 'Chop') {
    state.wood += 3;
    state.ledger.unshift(`Day ${state.day}: Chopped 3 wood.`);
  } else if (state.priority === 'Build') {
    if (state.wood >= 3) {
      state.wood -= 3;
      state.shelter += 1;
      state.ledger.unshift(`Day ${state.day}: Built 1 shelter.`);
    } else {
      state.ledger.unshift(`Day ${state.day}: Insufficient wood to build.`);
    }
  }

  // 4. Resolve scripted event
  if (state.day === 5) {
    if (state.shelter < 2) {
      state.runStatus = 'Defeat';
      state.ledger.unshift(`Day ${state.day}: Settlement destroyed by the storm!`);
      return; // Short-circuit
    } else {
      state.ledger.unshift(`Day ${state.day}: Survived the storm!`);
    }
  }

  // 5. Check Victory
  if (state.day === 10) {
    state.runStatus = 'Victory';
    state.ledger.unshift(`Day ${state.day}: Survived 10 days. Victory!`);
    return; // Short-circuit
  }

  // 6. Advance day
  state.day += 1;
}

export function resetGame(): GameState {
  return createInitialState();
}
