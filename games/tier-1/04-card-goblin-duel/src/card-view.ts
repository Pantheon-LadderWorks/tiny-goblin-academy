import { handSlotAnchorId } from './anchors';
import {
  CARD_RIG_ENVIRONMENTAL_SLOTS,
  CARD_RIG_OUTER_FRAMES,
  createCardRigComposition,
  spriteVariables,
  type CardRigEnvironmentalSlotId,
  type CardRigOuterFrameId,
} from './card-rig-composition';
import { HAND_CAPACITY, type Card, type Phase } from './simulation';

export const CARD_DESCRIPTIONS: Readonly<Record<Card, string>> = Object.freeze({
  Strike: 'Deal 2 damage.',
  Guard: 'Reduce next enemy damage by 2.',
  Mend: 'Heal 2 HP.',
  Spark: 'Deal 1 damage and replace one card.',
  Stun: 'Prevent the next enemy attack once.',
  'Heavy Bonk': 'Deal 4 damage; skip next draw.',
});

export type CardFramePresentationId =
  | 'blank-parchment'
  | 'green-banner'
  | 'teal-banner'
  | 'tan-banner'
  | 'teal-edged-tan';

export type CardSurfaceStrategy = 'clean' | 'tokens';

export type CardRigPresentationOptions = Readonly<{
  rigId?: string;
  outerFrame?: CardRigOuterFrameId;
}>;

export type CardSlotPresentationOptions = CardRigPresentationOptions & Readonly<{
  environmentalSlot?: CardRigEnvironmentalSlotId;
  slotState?: CardSlotVisualState;
  strategy?: CardSurfaceStrategy;
  registerGameplayAnchor?: boolean;
}>;

export type CardSlotVisualState =
  | 'occupied'
  | 'focused'
  | 'selected'
  | 'replacement'
  | 'locked'
  | 'vacant'
  | 'incoming';

export const CARD_SLOT_SURFACE_BY_STATE = Object.freeze({
  occupied: 'green-slot',
  focused: 'green-slot',
  selected: 'gold-glow',
  replacement: 'red-corners',
  locked: 'gray-gold',
  vacant: 'green-slot',
  incoming: 'gold-glow',
} satisfies Readonly<Record<CardSlotVisualState, CardRigEnvironmentalSlotId>>);

type NormalizedRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type SourceRect = Readonly<{
  x: number;
  y: number;
  w: number;
  h: number;
}>;

type CardSlots = Readonly<{
  art: NormalizedRect;
  title: NormalizedRect;
  body: NormalizedRect;
}>;

type CardTokenPresentation = Readonly<{
  id:
    | 'sword-icon'
    | 'shield-icon'
    | 'heart-plus-icon'
    | 'projectile-star-effect'
    | 'star-cluster-effect'
    | 'club-weapon-icon';
  sourceRect: SourceRect;
}>;

export type CardFramePresentation = Readonly<{
  frame: CardFramePresentationId;
  frameSourceRect: SourceRect;
  nativeWidth: 123 | 124;
  nativeHeight: 170;
  semanticRole:
    | 'basic-direct-action'
    | 'defense-control'
    | 'recovery-support'
    | 'hybrid-trick-action'
    | 'heavy-physical-force';
  token: CardTokenPresentation;
  slots: CardSlots;
  accessibleActionLabel: string;
}>;

export type CardTypographyTemplate = Readonly<{
  titleOffsetY: number;
  bodyOffsetY: number;
}>;

export const CARD_TYPOGRAPHY_TEMPLATES = Object.freeze({
  banner: Object.freeze({ titleOffsetY: 0, bodyOffsetY: 0 }),
  'blank-parchment': Object.freeze({ titleOffsetY: 0.008, bodyOffsetY: -0.004 }),
}) satisfies Readonly<Record<'banner' | 'blank-parchment', CardTypographyTemplate>>;

type PixelCardSlots = Readonly<{
  art: SourceRect;
  title: SourceRect;
  body: SourceRect;
}>;

const slotsFromSourcePixels = (
  nativeWidth: number,
  nativeHeight: number,
  slots: PixelCardSlots,
): CardSlots => Object.freeze({
  art: Object.freeze({
    x: slots.art.x / nativeWidth,
    y: slots.art.y / nativeHeight,
    width: slots.art.w / nativeWidth,
    height: slots.art.h / nativeHeight,
  }),
  title: Object.freeze({
    x: slots.title.x / nativeWidth,
    y: slots.title.y / nativeHeight,
    width: slots.title.w / nativeWidth,
    height: slots.title.h / nativeHeight,
  }),
  body: Object.freeze({
    x: slots.body.x / nativeWidth,
    y: slots.body.y / nativeHeight,
    width: slots.body.w / nativeWidth,
    height: slots.body.h / nativeHeight,
  }),
});

const GREEN_BANNER_SLOTS = slotsFromSourcePixels(123, 170, {
  art: { x: 20, y: 14, w: 82, h: 74 },
  title: { x: 14, y: 87, w: 95, h: 17 },
  body: { x: 16, y: 104, w: 90, h: 50 },
});

const TEAL_BANNER_SLOTS = slotsFromSourcePixels(123, 170, {
  art: { x: 21, y: 14, w: 81, h: 74 },
  title: { x: 15, y: 87, w: 93, h: 17 },
  body: { x: 17, y: 104, w: 90, h: 50 },
});

const TAN_BANNER_SLOTS = slotsFromSourcePixels(124, 170, {
  art: { x: 21, y: 14, w: 82, h: 74 },
  title: { x: 16, y: 87, w: 93, h: 17 },
  body: { x: 17, y: 104, w: 90, h: 50 },
});

const TEAL_EDGED_TAN_SLOTS = slotsFromSourcePixels(123, 170, {
  art: { x: 21, y: 14, w: 82, h: 74 },
  title: { x: 15, y: 87, w: 93, h: 17 },
  body: { x: 17, y: 104, w: 90, h: 50 },
});

const BLANK_PARCHMENT_SLOTS: CardSlots = Object.freeze({
  art: Object.freeze({ x: 0.18, y: 0.21, width: 0.64, height: 0.32 }),
  title: Object.freeze({ x: 0.20, y: 0.075, width: 0.60, height: 0.105 }),
  body: Object.freeze({ x: 0.13, y: 0.60, width: 0.74, height: 0.27 }),
});

const token = (
  id: CardTokenPresentation['id'],
  x: number,
  y: number,
  w: number,
  h: number,
): CardTokenPresentation => Object.freeze({
  id,
  sourceRect: Object.freeze({ x, y, w, h }),
});

const presentation = (
  frame: CardFramePresentationId,
  frameSourceRect: SourceRect,
  semanticRole: CardFramePresentation['semanticRole'],
  cardToken: CardTokenPresentation,
  slots: CardSlots,
  accessibleActionLabel: string,
): CardFramePresentation => Object.freeze({
  frame,
  frameSourceRect: Object.freeze(frameSourceRect),
  nativeWidth: frameSourceRect.w as 123 | 124,
  nativeHeight: 170,
  semanticRole,
  token: cardToken,
  slots,
  accessibleActionLabel,
});

export const CARD_FRAME_PRESENTATIONS: Readonly<Record<Card, CardFramePresentation>> = Object.freeze({
  Strike: presentation(
    'blank-parchment',
    { x: 4, y: 27, w: 123, h: 170 },
    'basic-direct-action',
    token('sword-icon', 2, 2, 120, 124),
    BLANK_PARCHMENT_SLOTS,
    `Strike. ${CARD_DESCRIPTIONS.Strike}`,
  ),
  Guard: presentation(
    'teal-banner',
    { x: 259, y: 27, w: 123, h: 170 },
    'defense-control',
    token('shield-icon', 130, 2, 124, 124),
    TEAL_BANNER_SLOTS,
    `Guard. ${CARD_DESCRIPTIONS.Guard}`,
  ),
  Mend: presentation(
    'green-banner',
    { x: 132, y: 27, w: 123, h: 170 },
    'recovery-support',
    token('heart-plus-icon', 258, 2, 124, 124),
    GREEN_BANNER_SLOTS,
    `Mend. ${CARD_DESCRIPTIONS.Mend}`,
  ),
  Spark: presentation(
    'teal-edged-tan',
    { x: 514, y: 27, w: 123, h: 170 },
    'hybrid-trick-action',
    token('projectile-star-effect', 386, 2, 124, 124),
    TEAL_EDGED_TAN_SLOTS,
    `Spark. ${CARD_DESCRIPTIONS.Spark}`,
  ),
  Stun: presentation(
    'teal-banner',
    { x: 259, y: 27, w: 123, h: 170 },
    'defense-control',
    token('star-cluster-effect', 642, 2, 124, 124),
    TEAL_BANNER_SLOTS,
    `Stun. ${CARD_DESCRIPTIONS.Stun}`,
  ),
  'Heavy Bonk': presentation(
    'tan-banner',
    { x: 386, y: 27, w: 124, h: 170 },
    'heavy-physical-force',
    token('club-weapon-icon', 514, 2, 124, 124),
    TAN_BANNER_SLOTS,
    `Heavy Bonk. ${CARD_DESCRIPTIONS['Heavy Bonk']}`,
  ),
});

export const CARD_LAB_CARDS: readonly Card[] = Object.freeze([
  'Strike',
  'Guard',
  'Mend',
  'Spark',
  'Stun',
  'Heavy Bonk',
]);

const actionLabel = (card: Card, phase: Phase): string => {
  const verb = phase === 'SparkChoice'
    ? 'Replace'
    : phase === 'Terminal'
      ? 'Locked'
      : 'Play';
  return `${verb} ${CARD_FRAME_PRESENTATIONS[card].accessibleActionLabel}`;
};

const cssPercent = (value: number): string => `${value * 100}%`;

const slotVariables = (
  slots: CardSlots,
  typography: CardTypographyTemplate,
): string => [
  `--art-x: ${cssPercent(slots.art.x)}`,
  `--art-y: ${cssPercent(slots.art.y)}`,
  `--art-width: ${cssPercent(slots.art.width)}`,
  `--art-height: ${cssPercent(slots.art.height)}`,
  `--title-x: ${cssPercent(slots.title.x)}`,
  `--title-y: ${cssPercent(slots.title.y)}`,
  `--title-width: ${cssPercent(slots.title.width)}`,
  `--title-height: ${cssPercent(slots.title.height)}`,
  `--body-x: ${cssPercent(slots.body.x)}`,
  `--body-y: ${cssPercent(slots.body.y)}`,
  `--body-width: ${cssPercent(slots.body.width)}`,
  `--body-height: ${cssPercent(slots.body.height)}`,
  `--title-optical-y: ${cssPercent(typography.titleOffsetY)}`,
  `--body-optical-y: ${cssPercent(typography.bodyOffsetY)}`,
].join('; ');

const tokenMarkup = (
  cardToken: CardTokenPresentation,
  strategy: CardSurfaceStrategy,
): string => {
  if (strategy === 'clean') return '';

  const { x, y, w, h } = cardToken.sourceRect;
  const backgroundSizeX = (1024 / w) * 100;
  const backgroundSizeY = (1024 / h) * 100;
  const backgroundPositionX = (x / (1024 - w)) * 100;
  const backgroundPositionY = (y / (1024 - h)) * 100;
  const tokenStyle = [
    `--token-aspect: ${w} / ${h}`,
    `--token-bg-size-x: ${backgroundSizeX.toFixed(4)}%`,
    `--token-bg-size-y: ${backgroundSizeY.toFixed(4)}%`,
    `--token-bg-position-x: ${backgroundPositionX.toFixed(4)}%`,
    `--token-bg-position-y: ${backgroundPositionY.toFixed(4)}%`,
  ].join('; ');

  return `<span
          class="card-token"
          data-card-token="${cardToken.id}"
          data-token-source-x="${x}"
          data-token-source-y="${y}"
          data-token-source-width="${w}"
          data-token-source-height="${h}"
          style="${tokenStyle}"
          aria-hidden="true"
        ></span>`;
};

export const renderHandCard = (
  card: Card,
  index: number,
  phase: Phase,
  strategy: CardSurfaceStrategy = 'tokens',
  registerGameplayAnchor: boolean = true,
  rigOptions: CardRigPresentationOptions = {},
): string => {
  const disabled = phase === 'Terminal';
  const stateClass = phase === 'SparkChoice'
    ? 'card-choice'
    : disabled
      ? 'card-disabled'
      : 'card-playable';
  const disabledAttribute = disabled ? ' disabled' : '';
  const cardPresentation = CARD_FRAME_PRESENTATIONS[card];
  const typography = cardPresentation.frame === 'blank-parchment'
    ? CARD_TYPOGRAPHY_TEMPLATES['blank-parchment']
    : CARD_TYPOGRAPHY_TEMPLATES.banner;
  const frameRect = cardPresentation.frameSourceRect;
  const stateLabel = phase === 'SparkChoice' ? 'Replace' : disabled ? 'Locked' : 'Play';
  const stageAnchorAttribute = registerGameplayAnchor
    ? `data-stage-anchor="${handSlotAnchorId(index)}"`
    : '';
  const composition = createCardRigComposition(card, index, rigOptions.outerFrame);
  const rigId = rigOptions.rigId ?? composition.rigId;
  const outerFrame = CARD_RIG_OUTER_FRAMES[composition.outerFrame];
  const outerFrameStyle = spriteVariables(outerFrame.sourceRect);

  return `
    <button
      class="card-btn ${stateClass}"
      type="button"
      data-i="${index}"
      data-card-name="${card}"
      data-card-rig-id="${rigId}"
      data-card-rig-motion-root="${composition.movementOwnerRigId}"
      data-card-rig-cleanup-owner="${composition.cleanupOwnerRigId}"
      data-card-rig-frame-class="${composition.frameClass}"
      data-card-frame="${cardPresentation.frame}"
      data-card-strategy="${strategy}"
      data-semantic-role="${cardPresentation.semanticRole}"
      data-frame-source-rect="${frameRect.x},${frameRect.y},${frameRect.w},${frameRect.h}"
      data-native-width="${cardPresentation.nativeWidth}"
      data-native-height="${cardPresentation.nativeHeight}"
      ${stageAnchorAttribute}
      style="${slotVariables(cardPresentation.slots, typography)}"
      aria-label="${actionLabel(card, phase)}"${disabledAttribute}
    >
      <span class="card-shadow" data-card-rig-layer="shadow" aria-hidden="true"></span>
      <span class="card-frame-art" data-card-rig-layer="base-face" aria-hidden="true"></span>
      <span class="card-content-layer" data-card-rig-layer="content">
        <span class="card-art-slot" aria-hidden="true">
          ${tokenMarkup(cardPresentation.token, strategy)}
        </span>
        <span class="card-content">
          <span class="card-title">${card}</span>
          <span class="card-desc">${CARD_DESCRIPTIONS[card]}</span>
        </span>
      </span>
      <span
        class="card-outer-frame"
        data-card-rig-layer="outer-frame"
        data-outer-frame="${composition.outerFrame}"
        data-outer-frame-manifest-id="${outerFrame.manifestId ?? ''}"
        aria-hidden="true"
      >
        <span class="card-outer-frame-asset" style="${outerFrameStyle}"></span>
      </span>
      <span class="card-state" data-card-rig-layer="state" aria-hidden="true">${stateLabel}</span>
      <span
        class="card-local-fx"
        data-card-rig-layer="card-local-fx"
        data-card-rig-attachment="card-local"
        data-card-rig-attachment-id="card-rig:${rigId}"
        aria-hidden="true"
      ></span>
      <span
        class="card-activation-source"
        data-card-rig-layer="activation-source"
        data-card-rig-attachment="travel"
        data-card-rig-attachment-id="card-rig-travel:${composition.activationSourceOwnerRigId}"
        aria-hidden="true"
      ></span>
    </button>
  `;
};

export const renderCardSlot = (
  card: Card | undefined,
  index: number,
  phase: Phase,
  options: CardSlotPresentationOptions = {},
): string => {
  const slotState = options.slotState
    ?? (card === undefined
      ? 'vacant'
      : phase === 'SparkChoice'
        ? 'replacement'
        : phase === 'Terminal'
          ? 'locked'
          : 'occupied');
  const environmentalSlot = options.environmentalSlot ?? CARD_SLOT_SURFACE_BY_STATE[slotState];
  const slot = CARD_RIG_ENVIRONMENTAL_SLOTS[environmentalSlot];
  const slotStyle = spriteVariables(slot.sourceRect);
  const registerGameplayAnchor = options.registerGameplayAnchor ?? true;
  const stageAnchorAttribute = registerGameplayAnchor
    ? `data-stage-anchor="${handSlotAnchorId(index)}"`
    : '';
  const content = card === undefined
    ? '<span class="card-slot-vacancy" aria-hidden="true"></span>'
    : renderHandCard(
      card,
      index,
      phase,
      options.strategy ?? 'tokens',
      false,
      { rigId: options.rigId, outerFrame: options.outerFrame },
    );
  const accessibleLabel = card === undefined
    ? `Empty hand slot ${index + 1} of ${HAND_CAPACITY}`
    : `Hand slot ${index + 1} of ${HAND_CAPACITY}`;

  return `
    <span
      class="card-slot-shell"
      role="group"
      aria-label="${accessibleLabel}"
      data-hand-slot-index="${index}"
      data-card-slot-state="${slotState}"
      data-card-slot-surface="${environmentalSlot}"
      data-card-slot-manifest-id="${slot.manifestId ?? ''}"
      ${stageAnchorAttribute}
    >
      <span class="card-slot-art" style="${slotStyle}" aria-hidden="true"></span>
      ${content}
    </span>
  `;
};

export const renderHandDock = (
  cards: readonly Card[],
  phase: Phase,
): string => {
  if (cards.length > HAND_CAPACITY) {
    throw new Error(`Hand contains ${cards.length} cards but capacity is ${HAND_CAPACITY}`);
  }

  return Array.from({ length: HAND_CAPACITY }, (_, index) => renderCardSlot(
    cards[index],
    index,
    phase,
    { strategy: 'tokens' },
  )).join('');
};

export const renderNextCard = (card: Card | undefined): string => {
  if (!card) {
    return '<p class="queue-empty">Queue empty</p>';
  }

  return `
    <article class="next-card" aria-label="Next card: ${card}">
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
