import type { DieFace } from './dierig/face-mapping';

export type Action = 'attack' | 'heal' | 'block';
export type Phase = 'roll' | 'rolling' | 'action' | 'won' | 'lost';

export interface Duel {
  playerHp: number;
  enemyHp: number;
  phase: Phase;
  roll: DieFace | null;
  log: string[];
}

const MAX_HP = 10;

export const createDuel = (): Duel => ({
  playerHp: MAX_HP,
  enemyHp: MAX_HP,
  phase: 'roll',
  roll: null,
  log: ['Your turn. Roll the d6.'],
});

export const beginRoll = (state: Duel, face: DieFace): Duel => {
  if (state.phase !== 'roll') return state;
  return { ...state, roll: face, phase: 'rolling' };
};

export const completeRoll = (state: Duel): Duel => {
  if (state.phase !== 'rolling' || state.roll === null) return state;
  return { ...state, phase: 'action', log: [...state.log, `You rolled ${state.roll}.`] };
};

const enemyResponse = (state: Duel, block = 0): Duel => {
  const dealt = Math.max(0, 3 - block);
  const hp = state.playerHp - dealt;
  const entry = block
    ? `Goblin Brawler attacks for 3. Block reduced it to ${dealt}.`
    : 'Goblin Brawler attacks for 3.';
  return {
    ...state,
    playerHp: Math.max(0, hp),
    phase: hp <= 0 ? 'lost' : 'roll',
    roll: null,
    log: [...state.log, entry],
  };
};

export const act = (state: Duel, action: Action): Duel => {
  if (state.phase !== 'action' || state.roll === null) return state;
  const face = state.roll;
  if (action === 'attack') {
    const enemyHp = Math.max(0, state.enemyHp - face);
    const next = { ...state, enemyHp, log: [...state.log, `You chose Attack for ${face} damage.`] };
    return enemyHp === 0
      ? { ...next, phase: 'won', roll: null, log: [...next.log, 'Goblin Brawler is defeated! Victory!'] }
      : enemyResponse(next);
  }
  if (action === 'heal') {
    return enemyResponse({
      ...state,
      playerHp: Math.min(MAX_HP, state.playerHp + face),
      log: [...state.log, `You chose Heal for ${face}.`],
    });
  }
  return enemyResponse({ ...state, log: [...state.log, `You chose Block for ${face}.`] }, face);
};
