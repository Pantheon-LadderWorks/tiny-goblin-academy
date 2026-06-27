import {
  GameState,
  createSimulation,
  bonk,
  buyBonkStick,
  advanceGoblin
} from './simulation';

export type StateListener = (state: GameState) => void;

export class GameController {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = createSimulation();
  }

  public getState(): GameState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public bonk() {
    this.state = bonk(this.state);
    this.notify();
  }

  public advanceGoblin() {
    this.state = advanceGoblin(this.state);
    this.notify();
  }

  public buyBonkStick() {
    this.state = buyBonkStick(this.state);
    this.notify();
  }
}
