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

type CardFramePresentation = Readonly<{
  frame: 'green-banner' | 'teal-banner' | 'tan-banner';
  nativeWidth: 123 | 124;
  nativeHeight: 170;
  icon: string;
}>;

export const CARD_FRAME_PRESENTATIONS: Readonly<Record<Card, CardFramePresentation>> = Object.freeze({
  Strike: Object.freeze({ frame: 'tan-banner', nativeWidth: 124, nativeHeight: 170, icon: '*' }),
  Guard: Object.freeze({ frame: 'teal-banner', nativeWidth: 123, nativeHeight: 170, icon: '#' }),
  Mend: Object.freeze({ frame: 'green-banner', nativeWidth: 123, nativeHeight: 170, icon: '+' }),
  Spark: Object.freeze({ frame: 'green-banner', nativeWidth: 123, nativeHeight: 170, icon: '^' }),
  Stun: Object.freeze({ frame: 'teal-banner', nativeWidth: 123, nativeHeight: 170, icon: '~' }),
  'Heavy Bonk': Object.freeze({ frame: 'tan-banner', nativeWidth: 124, nativeHeight: 170, icon: '!' }),
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
  const presentation = CARD_FRAME_PRESENTATIONS[card];

  return `
    <button
      class="card-btn ${stateClass}"
      type="button"
      data-i="${index}"
      data-card-name="${card}"
      data-card-frame="${presentation.frame}"
      data-native-width="${presentation.nativeWidth}"
      data-native-height="${presentation.nativeHeight}"
      data-stage-anchor="${handSlotAnchorId(index)}"
      aria-label="${actionLabel(card, phase)}"${disabledAttribute}
    >
      <span class="card-frame-art" aria-hidden="true"></span>
      <span class="card-icon" aria-hidden="true">${presentation.icon}</span>
      <span class="card-content">
        <span class="card-title">${card}</span>
        <span class="card-desc">${CARD_DESCRIPTIONS[card]}</span>
      </span>
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
