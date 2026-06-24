import { createRoundState, placePotion, selectPotion, tick, type PotionType, type RoundState } from './simulation';

type StateListener = (state: RoundState) => void;

export interface RoundController {
  getState(): RoundState;
  subscribe(listener: StateListener): () => void;
  selectPotion(): void;
  placePotion(shelf: PotionType): void;
  advanceTime(seconds: number): void;
}

export function createRoundController(): RoundController {
  let state = createRoundState();
  const listeners = new Set<StateListener>();

  const publish = () => listeners.forEach((listener) => listener(state));

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    selectPotion: () => {
      state = selectPotion(state);
      publish();
    },
    placePotion: (shelf) => {
      state = placePotion(state, shelf);
      publish();
    },
    advanceTime: (seconds) => {
      state = tick(state, seconds);
      publish();
    }
  };
}
