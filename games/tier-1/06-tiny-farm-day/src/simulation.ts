export type PlotState = 'Empty' | 'PlantedDry' | 'PlantedWatered' | 'Grown';
export type DayStatus = 'Active' | 'Victory' | 'Defeat';

export interface Plot {
  state: PlotState;
  growth: number;
}

export interface GameState {
  plots: Plot[];
  seeds: number;
  crops: number;
  coins: number;
  tick: number;
  upgradePurchased: boolean;
  dayStatus: DayStatus;
  ledger: string[];
}

export function createInitialState(): GameState {
  return {
    plots: [
      { state: 'Empty', growth: 0 },
      { state: 'Empty', growth: 0 },
      { state: 'Empty', growth: 0 }
    ],
    seeds: 3,
    crops: 0,
    coins: 0,
    tick: 0,
    upgradePurchased: false,
    dayStatus: 'Active',
    ledger: ['Day started.']
  };
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    plots: state.plots.map(p => ({ ...p })),
    ledger: [...state.ledger]
  };
}

function advanceTime(state: GameState, actionLog: string): GameState {
  state.tick += 1;
  state.ledger.push(actionLog);

  // Grow watered crops
  for (let i = 0; i < state.plots.length; i++) {
    const p = state.plots[i];
    if (p.state === 'PlantedWatered') {
      p.growth += 1;
      if (p.growth >= 2) {
        p.state = 'Grown';
        state.ledger.push(`Plot ${i} is fully grown!`);
      }
    }
  }
  return state;
}

export function plant(state: GameState, plotIndex: number): GameState {
  if (state.dayStatus !== 'Active') return state;
  if (state.seeds <= 0) return state;
  if (plotIndex < 0 || plotIndex >= state.plots.length) return state;
  
  const plot = state.plots[plotIndex];
  if (plot.state !== 'Empty') return state;

  const newState = cloneState(state);
  newState.seeds -= 1;
  newState.plots[plotIndex].state = 'PlantedDry';
  newState.plots[plotIndex].growth = 0;
  
  return advanceTime(newState, `Planted seed in plot ${plotIndex}.`);
}

export function water(state: GameState, plotIndex: number): GameState {
  if (state.dayStatus !== 'Active') return state;
  if (plotIndex < 0 || plotIndex >= state.plots.length) return state;
  
  const plot = state.plots[plotIndex];
  if (plot.state !== 'PlantedDry') return state;

  const newState = cloneState(state);
  const advanced = advanceTime(newState, `Watered plot ${plotIndex}.`);
  advanced.plots[plotIndex].state = 'PlantedWatered';
  advanced.plots[plotIndex].growth = 0;
  
  return advanced;
}

export function harvest(state: GameState, plotIndex: number): GameState {
  if (state.dayStatus !== 'Active') return state;
  if (plotIndex < 0 || plotIndex >= state.plots.length) return state;
  
  const plot = state.plots[plotIndex];
  if (plot.state !== 'Grown') return state;

  const newState = cloneState(state);
  newState.plots[plotIndex].state = 'Empty';
  newState.plots[plotIndex].growth = 0;
  newState.crops += 1;
  
  return advanceTime(newState, `Harvested crop from plot ${plotIndex}.`);
}

export function sell(state: GameState): GameState {
  if (state.dayStatus !== 'Active') return state;
  if (state.crops <= 0) return state;

  const newState = cloneState(state);
  const earned = newState.crops * 2;
  newState.coins += earned;
  const count = newState.crops;
  newState.crops = 0;

  return advanceTime(newState, `Sold ${count} crop(s) for ${earned} coins.`);
}

export function buyUpgrade(state: GameState): GameState {
  if (state.dayStatus !== 'Active') return state;
  if (state.upgradePurchased) return state;
  if (state.coins < 5) return state;

  const newState = cloneState(state);
  newState.coins -= 5;
  newState.upgradePurchased = true;

  return advanceTime(newState, `Bought plot upgrade for 5 coins.`);
}

export function endDay(state: GameState): GameState {
  if (state.dayStatus !== 'Active') return state;

  const newState = cloneState(state);
  if (newState.upgradePurchased) {
    newState.dayStatus = 'Victory';
    newState.ledger.push('Ended day. VICTORY! Upgrade secured.');
  } else {
    newState.dayStatus = 'Defeat';
    newState.ledger.push('Ended day without upgrade. DEFEAT.');
  }
  return newState;
}
