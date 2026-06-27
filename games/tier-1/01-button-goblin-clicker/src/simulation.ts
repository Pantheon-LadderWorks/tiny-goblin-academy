export interface GameState {
  goblinIndex: number;
  currentGoblinHp: number;
  maxGoblinHp: number;
  coins: number;
  damage: number;
  bonkStickPurchased: boolean;
  victory: boolean;
}

const calculateGoblinHp = (index: number): number => {
  return 5 + (index - 1) * 2;
};

export const createSimulation = (): GameState => {
  return {
    goblinIndex: 1,
    currentGoblinHp: calculateGoblinHp(1),
    maxGoblinHp: calculateGoblinHp(1),
    coins: 0,
    damage: 1,
    bonkStickPurchased: false,
    victory: false,
  };
};

export const bonk = (state: GameState): GameState => {
  if (state.victory || state.currentGoblinHp <= 0) {
    return state;
  }

  const newState = { ...state };
  newState.currentGoblinHp -= newState.damage;
  
  if (newState.currentGoblinHp <= 0) {
    newState.currentGoblinHp = 0;
    newState.coins += 1;
  }
  
  return newState;
};

export const advanceGoblin = (state: GameState): GameState => {
  if (state.victory || state.currentGoblinHp > 0) {
    return state;
  }

  const newState = { ...state };
  newState.goblinIndex += 1;
  
  if (newState.goblinIndex > 10) {
    newState.victory = true;
    newState.goblinIndex = 10; // clamp it
    return newState;
  }
  
  newState.maxGoblinHp = calculateGoblinHp(newState.goblinIndex);
  newState.currentGoblinHp = newState.maxGoblinHp;
  
  return newState;
};

export const buyBonkStick = (state: GameState): GameState => {
  if (state.victory || state.bonkStickPurchased || state.coins < 3) {
    return state;
  }

  return {
    ...state,
    bonkStickPurchased: true,
    coins: state.coins - 3,
    damage: 2
  };
};
