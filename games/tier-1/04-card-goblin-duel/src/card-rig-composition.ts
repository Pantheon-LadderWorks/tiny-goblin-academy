import { CARD_RIG_ANCHOR_IDS } from './card-rig-routes';
import type { Card } from './simulation';

export type SourceRect = Readonly<{ x: number; y: number; w: number; h: number }>;

export const CARD_RIG_LAYER_ORDER = Object.freeze([
  'shadow',
  'base-face',
  'content',
  'outer-frame',
  'state',
  'card-local-fx',
] as const);

export type CardRigLayerKind = (typeof CARD_RIG_LAYER_ORDER)[number];

export type CardRigOuterFrameId = 'none' | 'gold-ornate' | 'wood' | 'corner-ornate';
export type CardRigEnvironmentalSlotId =
  | 'none'
  | 'green-slot'
  | 'teal-slot'
  | 'gold-glow'
  | 'red-corners'
  | 'gray-gold';

type OuterFrameDefinition = Readonly<{
  label: string;
  classification: 'valid-null-baseline' | 'true-card-frame';
  manifestId: string | null;
  sourceRect: SourceRect | null;
}>;

type EnvironmentalSlotDefinition = Readonly<{
  label: string;
  classification: 'no-environmental-slot' | 'board-slot-surface' | 'highlighted-slot-state' | 'card-slot-surface';
  manifestId: string | null;
  sourceRect: SourceRect | null;
}>;

export const CARD_RIG_OUTER_FRAMES = Object.freeze({
  none: Object.freeze({
    label: 'None',
    classification: 'valid-null-baseline',
    manifestId: null,
    sourceRect: null,
  }),
  'gold-ornate': Object.freeze({
    label: 'Gold ornate open frame',
    classification: 'true-card-frame',
    manifestId: 'card-goblin-duel.card-frames.card-front-frame.gold-ornate-open-frame',
    sourceRect: Object.freeze({ x: 641, y: 824, w: 125, h: 189 }),
  }),
  wood: Object.freeze({
    label: 'Wood open frame',
    classification: 'true-card-frame',
    manifestId: 'card-goblin-duel.card-frames.card-front-frame.wood-open-card-frame',
    sourceRect: Object.freeze({ x: 770, y: 825, w: 123, h: 187 }),
  }),
  'corner-ornate': Object.freeze({
    label: 'Corner ornate open frame',
    classification: 'true-card-frame',
    manifestId: 'card-goblin-duel.card-frames.card-front-frame.corner-ornate-open-frame',
    sourceRect: Object.freeze({ x: 898, y: 825, w: 123, h: 187 }),
  }),
} satisfies Record<CardRigOuterFrameId, OuterFrameDefinition>);

export const CARD_RIG_ENVIRONMENTAL_SLOTS = Object.freeze({
  none: Object.freeze({
    label: 'No environmental slot',
    classification: 'no-environmental-slot',
    manifestId: null,
    sourceRect: null,
  }),
  'green-slot': Object.freeze({
    label: 'Green board slot',
    classification: 'board-slot-surface',
    manifestId: 'card-goblin-duel.card-frames.board-slot.green-board-card-slot',
    sourceRect: Object.freeze({ x: 4, y: 558, w: 123, h: 160 }),
  }),
  'teal-slot': Object.freeze({
    label: 'Teal board slot',
    classification: 'board-slot-surface',
    manifestId: 'card-goblin-duel.card-frames.board-slot.teal-board-card-slot',
    sourceRect: Object.freeze({ x: 386, y: 558, w: 124, h: 160 }),
  }),
  'gold-glow': Object.freeze({
    label: 'Gold glowing empty slot',
    classification: 'highlighted-slot-state',
    manifestId: 'card-goblin-duel.card-frames.highlighted-card-state.gold-glowing-empty-card-slot',
    sourceRect: Object.freeze({ x: 641, y: 555, w: 126, h: 167 }),
  }),
  'red-corners': Object.freeze({
    label: 'Red corner card slot',
    classification: 'card-slot-surface',
    manifestId: 'card-goblin-duel.card-frames.card-slot.red-corner-card-slot',
    sourceRect: Object.freeze({ x: 769, y: 558, w: 125, h: 160 }),
  }),
  'gray-gold': Object.freeze({
    label: 'Gray/gold corner card slot',
    classification: 'card-slot-surface',
    manifestId: 'card-goblin-duel.card-frames.card-slot.gray-gold-corner-card-slot',
    sourceRect: Object.freeze({ x: 898, y: 559, w: 122, h: 159 }),
  }),
} satisfies Record<CardRigEnvironmentalSlotId, EnvironmentalSlotDefinition>);

export type CardRigLayer = Readonly<{
  kind: CardRigLayerKind;
  ownerRigId: string;
}>;

export type CardRigComposition = Readonly<{
  rigId: string;
  card: Card;
  outerFrame: CardRigOuterFrameId;
  layers: readonly CardRigLayer[];
}>;

const slug = (card: Card): string => card.toLowerCase().replaceAll(' ', '-');

export const createCardRigComposition = (
  card: Card,
  slot: number,
  outerFrame: CardRigOuterFrameId = 'none',
): CardRigComposition => {
  const rigId = `${slug(card)}-${slot}`;
  return Object.freeze({
    rigId,
    card,
    outerFrame,
    layers: Object.freeze(CARD_RIG_LAYER_ORDER.map((kind) => Object.freeze({
      kind,
      ownerRigId: rigId,
    }))),
  });
};

export const CARD_RIG_ATTACHMENT_AUTHORITIES = Object.freeze([
  'card-local',
  'draw-pile-local',
  'discard-pile-local',
  'player-target',
  'enemy-target',
  'travel',
  'tabletop-local',
] as const);

export type CardRigAttachmentAuthority =
  | Readonly<{ kind: 'card-local'; rigId: string }>
  | Readonly<{ kind: 'draw-pile-local' }>
  | Readonly<{ kind: 'discard-pile-local' }>
  | Readonly<{ kind: 'player-target' }>
  | Readonly<{ kind: 'enemy-target' }>
  | Readonly<{ kind: 'travel'; rigId: string }>
  | Readonly<{ kind: 'tabletop-local'; anchorId: string }>;

export const attachmentAnchorId = (authority: CardRigAttachmentAuthority): string => {
  switch (authority.kind) {
    case 'card-local':
      return `card-rig:${authority.rigId}`;
    case 'draw-pile-local':
      return CARD_RIG_ANCHOR_IDS.playerDrawOrigin;
    case 'discard-pile-local':
      return CARD_RIG_ANCHOR_IDS.playerDiscardTarget;
    case 'player-target':
      return 'player-impact';
    case 'enemy-target':
      return 'enemy-impact';
    case 'travel':
      return `card-rig-travel:${authority.rigId}`;
    case 'tabletop-local':
      if (!authority.anchorId || authority.anchorId === 'viewport-center') {
        throw new Error('Tabletop-local effects require an explicit semantic anchor');
      }
      return authority.anchorId;
  }
};

export type CardRigAttachmentPlan = Readonly<{
  authority: CardRigAttachmentAuthority['kind'];
  anchorId: string;
  ownerRigId?: string;
  follow: 'owner-transform' | 'stable-anchor' | 'animation-frame';
  mountSelector?: string;
}>;

export const planCardRigAttachment = (
  authority: CardRigAttachmentAuthority,
): CardRigAttachmentPlan => {
  const anchorId = attachmentAnchorId(authority);
  switch (authority.kind) {
    case 'card-local':
      return Object.freeze({
        authority: authority.kind,
        anchorId,
        ownerRigId: authority.rigId,
        follow: 'owner-transform',
        mountSelector: `[data-card-rig-id="${authority.rigId}"] [data-card-rig-layer="card-local-fx"]`,
      });
    case 'travel':
      return Object.freeze({
        authority: authority.kind,
        anchorId,
        ownerRigId: authority.rigId,
        follow: 'animation-frame',
      });
    default:
      return Object.freeze({
        authority: authority.kind,
        anchorId,
        follow: 'stable-anchor',
      });
  }
};

export const CARD_RIG_ATTACHMENT_CLEANUP = Object.freeze({
  cancelAnimationFrames: true,
  removeTemporaryNodes: true,
  clearOwnerClasses: true,
  resetTransforms: true,
  requireZeroResidue: true,
});

type CardRigCompositionFixture = Readonly<{
  label: string;
  diagnosticOnly: true;
  attachment?: (typeof CARD_RIG_ATTACHMENT_AUTHORITIES)[number];
}>;

const diagnostic = (
  label: string,
  attachment?: CardRigCompositionFixture['attachment'],
): CardRigCompositionFixture => Object.freeze({ label, diagnosticOnly: true, attachment });

export const CARD_RIG_COMPOSITION_FIXTURES = Object.freeze({
  'layer-stack': diagnostic('Complete CardRig layer stack'),
  'frame-matrix': diagnostic('Three true frame styles through one lifecycle'),
  'slot-vs-frame': diagnostic('Environmental slots remain separate from moving frames'),
  'card-local-follow': diagnostic('Card-local ring follows the moving CardRig', 'card-local'),
  'draw-pile-local': diagnostic('Draw pile local pulse', 'draw-pile-local'),
  'discard-pile-local': diagnostic('Discard pile local pulse', 'discard-pile-local'),
  'player-target': diagnostic('Player target pulse', 'player-target'),
  'enemy-target': diagnostic('Enemy target pulse', 'enemy-target'),
  travel: diagnostic('Travel diagnostic between explicit anchors', 'travel'),
  'tabletop-local': diagnostic('Tabletop local diagnostic', 'tabletop-local'),
  'resize-active': diagnostic('Resize while attachment is active', 'card-local'),
  'cancel-cleanup': diagnostic('Cancellation and zero-residue cleanup', 'card-local'),
  'reduced-motion': diagnostic('Reduced-motion semantic comparison', 'card-local'),
} satisfies Record<string, CardRigCompositionFixture>);

export type CardRigCompositionFixtureId = keyof typeof CARD_RIG_COMPOSITION_FIXTURES;

export const spriteVariables = (rect: SourceRect | null): string => {
  if (!rect) return '';
  const backgroundSizeX = (1024 / rect.w) * 100;
  const backgroundSizeY = (1024 / rect.h) * 100;
  const backgroundPositionX = (rect.x / (1024 - rect.w)) * 100;
  const backgroundPositionY = (rect.y / (1024 - rect.h)) * 100;
  return [
    `--sprite-aspect: ${rect.w} / ${rect.h}`,
    `--sprite-bg-size-x: ${backgroundSizeX.toFixed(4)}%`,
    `--sprite-bg-size-y: ${backgroundSizeY.toFixed(4)}%`,
    `--sprite-bg-position-x: ${backgroundPositionX.toFixed(4)}%`,
    `--sprite-bg-position-y: ${backgroundPositionY.toFixed(4)}%`,
  ].join('; ');
};
