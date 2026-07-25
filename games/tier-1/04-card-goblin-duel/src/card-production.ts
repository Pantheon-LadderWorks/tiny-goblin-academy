import type { CardRigCue, CardRigFixture } from './card-rig';
import type { Card, GameState } from './simulation';

const cue = (type: CardRigCue['type'], card?: Card, slot?: number): CardRigCue => ({
  type,
  card,
  slot,
});

const finalState = (state: GameState): CardRigFixture['finalState'] => ({
  phase: state.phase,
  hand: [...state.hand],
  vacantSlots: state.hand.length < 3
    ? Array.from({ length: 3 - state.hand.length }, (_, index) => state.hand.length + index)
    : undefined,
  lockedCards: state.phase === 'Terminal' ? [...state.hand] : undefined,
  actionableCards: state.phase === 'Terminal' ? [] : [...state.hand],
  resetAvailable: true,
});

const addedCards = (
  before: readonly Card[],
  after: readonly Card[],
  selectedIndex: number,
): Array<{ card: Card; slot: number }> => {
  const remaining = [...before];
  remaining.splice(selectedIndex, 1);
  const available = new Map<Card, number>();
  for (const card of remaining) available.set(card, (available.get(card) ?? 0) + 1);

  const additions: Array<{ card: Card; slot: number }> = [];
  after.forEach((card, slot) => {
    const count = available.get(card) ?? 0;
    if (count > 0) {
      available.set(card, count - 1);
    } else {
      additions.push({ card, slot });
    }
  });
  return additions;
};

export const buildOpeningDealPlan = (
  state: GameState,
  id: string,
): CardRigFixture => ({
  id,
  label: 'Production opening deal',
  initialHand: [...state.hand],
  cues: [
    ...state.hand.map((card, slot) => cue('deal', card, slot)),
    cue('settle'),
    ...(state.hand[0] ? [cue('focus', state.hand[0], 0)] : []),
  ],
  finalState: finalState(state),
  measurementRequired: false,
});

export const buildProductionTransitionPlan = (
  before: GameState,
  after: GameState,
  selectedCard: Card,
  selectedIndex: number,
  id: string,
): CardRigFixture => {
  const cues: CardRigCue[] = [];

  if (before.phase === 'SparkChoice') {
    cues.push(cue('replace-discard', selectedCard, selectedIndex));
  } else {
    cues.push(
      cue('commit', selectedCard, selectedIndex),
      cue('effect-hold', selectedCard),
      cue('discard', selectedCard),
    );
  }

  if (after.phase === 'SparkChoice') {
    cues.push(cue('spark-choice'));
  } else {
    const additions = addedCards(before.hand, after.hand, selectedIndex);
    for (const addition of additions) cues.push(cue('refill', addition.card, addition.slot));
    if (additions.length === 0 && after.hand.length < 3) {
      cues.push(cue('vacancy', undefined, after.hand.length));
    }
    if (selectedCard === 'Stun') cues.push(cue('enemy-hold'));
    cues.push(cue('settle'));
    if (after.phase === 'Terminal') {
      cues.push(cue('terminal-lock'));
    } else if (after.hand[0]) {
      cues.push(cue('focus', after.hand[0], 0));
    }
  }

  return {
    id,
    label: `Production ${selectedCard} transition`,
    initialHand: [...before.hand],
    cues,
    finalState: finalState(after),
    measurementRequired: false,
  };
};
