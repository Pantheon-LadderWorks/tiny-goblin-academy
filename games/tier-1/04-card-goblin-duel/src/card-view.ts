import { handSlotAnchorId } from './anchors';
import type { Card, Phase } from './simulation';

export const CARD_DESCRIPTIONS: Readonly<Record<Card, string>> = Object.freeze({
  Strike: 'Deal 2 damage.',
  Guard: 'Reduce next enemy damage by 2.',
  Mend: 'Heal 2 HP.',
  Spark: 'Deal 1 damage and replace one card.',
  Stun: 'Prevent the next enemy attack once.',
  'Heavy Bonk': 'Deal 4 damage; skip next draw.',
});

const actionLabel = (card: Card, phase: Phase): string => {
  const verb = phase === 'SparkChoice' ? 'Replace' : 'Play';
  return `${verb} ${card}. ${CARD_DESCRIPTIONS[card]}`;
};

export const renderHandCard = (
  card: Card,
  index: number,
  phase: Phase,
): string => {
  const disabled = phase === 'Terminal';
  const stateClass = phase === 'SparkChoice'
    ? 'card-choice'
    : disabled
      ? 'card-disabled'
      : 'card-playable';
  const disabledAttribute = disabled ? ' disabled' : '';

  return `
    <button
      class="card-btn ${stateClass}"
      type="button"
      data-i="${index}"
      data-card-name="${card}"
      data-stage-anchor="${handSlotAnchorId(index)}"
      aria-label="${actionLabel(card, phase)}"${disabledAttribute}
    >
      <span class="card-title">${card}</span>
      <span class="card-desc">${CARD_DESCRIPTIONS[card]}</span>
      <span class="card-state" aria-hidden="true">
        ${phase === 'SparkChoice' ? 'Replace' : disabled ? 'Locked' : 'Play'}
      </span>
    </button>
  `;
};

export const renderNextCard = (card: Card | undefined): string => {
  if (!card) {
    return '<p class="queue-empty" data-stage-anchor="deck">Queue empty</p>';
  }

  return `
    <article class="next-card" data-stage-anchor="deck" aria-label="Next card: ${card}">
      <span class="card-title">${card}</span>
      <span class="card-desc">${CARD_DESCRIPTIONS[card]}</span>
    </article>
  `;
};

export type PhasePresentation = Readonly<{
  banner: string;
  instruction: string;
  bodyClass: string;
}>;

export const phasePresentation = (
  phase: Phase,
  playerHp: number,
): PhasePresentation => {
  if (phase === 'SparkChoice') {
    return Object.freeze({
      banner: 'Spark Choice',
      instruction: 'Choose one card to replace before the goblin responds.',
      bodyClass: 'phase-spark',
    });
  }

  if (phase === 'Terminal') {
    return Object.freeze({
      banner: playerHp <= 0 ? 'DEFEAT' : 'VICTORY',
      instruction: 'The duel is complete.',
      bodyClass: 'phase-terminal',
    });
  }

  return Object.freeze({
    banner: 'Your Turn',
    instruction: 'Choose one card to play.',
    bodyClass: 'phase-player',
  });
};
