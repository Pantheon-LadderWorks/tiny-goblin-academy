export type PetStatus = 'Idle' | 'Eating' | 'Playing' | 'Sleeping' | 'RanAway';
export type DayStatus = 'Active' | 'Victory' | 'Defeat';

export interface GameState {
  hunger: number;
  happiness: number;
  survivalTime: number;
  petStatus: PetStatus;
  dayStatus: DayStatus;
  ledger: string[];
}

export function createInitialState(): GameState {
  return {
    hunger: 100,
    happiness: 100,
    survivalTime: 0,
    petStatus: 'Idle',
    dayStatus: 'Active',
    ledger: ['Campfire lit.']
  };
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    ledger: [...state.ledger]
  };
}

export function tick(state: GameState, deltaSeconds: number): GameState {
  if (state.dayStatus !== 'Active') return state;

  const newState = cloneState(state);
  newState.survivalTime += deltaSeconds;
  
  newState.hunger = Math.max(0, newState.hunger - (4 * deltaSeconds));
  newState.happiness = Math.max(0, newState.happiness - (3 * deltaSeconds));

  if (newState.petStatus === 'Eating' || newState.petStatus === 'Playing') {
    newState.petStatus = 'Idle';
  }

  if (newState.hunger <= 0 || newState.happiness <= 0) {
    newState.dayStatus = 'Defeat';
    newState.petStatus = 'RanAway';
    newState.ledger.push('Pet ran away! DEFEAT.');
  } else if (newState.survivalTime >= 60) {
    newState.dayStatus = 'Victory';
    newState.petStatus = 'Sleeping';
    newState.ledger.push('Survived 60 seconds! VICTORY.');
  }

  return newState;
}

export function feed(state: GameState): GameState {
  if (state.dayStatus !== 'Active') return state;

  const newState = cloneState(state);
  newState.hunger = Math.min(100, newState.hunger + 25);
  newState.petStatus = 'Eating';
  newState.ledger.push('Fed the pet.');

  return newState;
}

export function play(state: GameState): GameState {
  if (state.dayStatus !== 'Active') return state;

  const newState = cloneState(state);
  newState.happiness = Math.min(100, newState.happiness + 25);
  newState.petStatus = 'Playing';
  newState.ledger.push('Played with the pet.');

  return newState;
}
