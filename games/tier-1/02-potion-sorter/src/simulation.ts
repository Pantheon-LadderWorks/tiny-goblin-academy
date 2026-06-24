export type PotionType = 'sun' | 'moon' | 'star';

export interface RoundState {
  activePotion: PotionType | null;
  shelves: PotionType[];
  selectedPotion: boolean;
  score: number;
  combo: number;
  timeRemaining: number;
  roundComplete: boolean;
  feedback: string;
  potionIndex: number;
}

const ROUND_POTIONS: PotionType[] = ['sun', 'moon', 'star', 'sun', 'moon', 'star'];
const ROUND_SECONDS = 30;

function nextPotionState(state: RoundState, score: number, combo: number, feedback: string): RoundState {
  const potionIndex = state.potionIndex + 1;
  if (potionIndex === ROUND_POTIONS.length) {
    return {
      ...state,
      activePotion: null,
      selectedPotion: false,
      score,
      combo,
      potionIndex,
      roundComplete: true,
      feedback: `Round complete! Score: ${score}`
    };
  }

  return {
    ...state,
    activePotion: ROUND_POTIONS[potionIndex],
    selectedPotion: false,
    score,
    combo,
    potionIndex,
    feedback
  };
}

export function createRoundState(): RoundState {
  return {
    activePotion: ROUND_POTIONS[0],
    shelves: ['sun', 'moon', 'star'],
    selectedPotion: false,
    score: 0,
    combo: 0,
    timeRemaining: ROUND_SECONDS,
    roundComplete: false,
    feedback: 'Select the potion, then choose its shelf.',
    potionIndex: 0
  };
}

export function selectPotion(state: RoundState): RoundState {
  if (state.roundComplete || state.activePotion === null) return state;
  return { ...state, selectedPotion: true, feedback: 'Potion selected — choose a shelf.' };
}

export function placePotion(state: RoundState, shelf: PotionType): RoundState {
  if (state.roundComplete || state.activePotion === null) return state;
  if (!state.selectedPotion) return { ...state, feedback: 'Select the potion first.' };

  if (shelf === state.activePotion) {
    return nextPotionState(state, state.score + 10, state.combo + 1, 'Correct! +10 points');
  }

  return nextPotionState(state, state.score, 0, 'Wrong shelf — try the next potion.');
}

export function tick(state: RoundState, seconds: number): RoundState {
  if (state.roundComplete || seconds <= 0) return state;
  const timeRemaining = Math.max(0, state.timeRemaining - seconds);
  if (timeRemaining > 0) return { ...state, timeRemaining };

  return {
    ...state,
    activePotion: null,
    selectedPotion: false,
    timeRemaining: 0,
    roundComplete: true,
    feedback: 'Time! Round complete.'
  };
}
