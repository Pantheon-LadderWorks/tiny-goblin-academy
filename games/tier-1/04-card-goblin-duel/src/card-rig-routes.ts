import { handSlotAnchorId } from './anchors';
import type { CardRigCue } from './card-rig';
import type { Card } from './simulation';

export const CARD_RIG_ANCHOR_IDS = Object.freeze({
  playerDrawOrigin: 'player-draw-origin',
  playedCardTarget: 'played-card-target',
  playerDiscardTarget: 'player-discard-target',
  enemyCardOrigin: 'enemy-card-origin',
} as const);

export const CARD_RIG_TABLETOP_REGION_IDS = Object.freeze({
  playerDrawOrigin: 'card-goblin-duel.tabletop.deck-zone.left-green-deck-well',
  playedCardTarget: 'card-goblin-duel.tabletop.anchor.played-card-landing-center',
  playerDiscardTarget: 'card-goblin-duel.tabletop.discard-zone.right-locked-well',
  enemyCardOrigin: 'card-goblin-duel.tabletop.card-well.top-opponent-well',
} as const);

export const CARD_RIG_SOURCE_SIZE = Object.freeze({ width: 2172, height: 724 });

type SourcePoint = Readonly<{ x: number; y: number }>;
type SourceRect = Readonly<{ x: number; y: number; w: number; h: number }>;
type SourceAnchor = Readonly<{
  regionId: string;
  point: SourcePoint;
  sourceRect: SourceRect;
}>;

export const CARD_RIG_SOURCE_ANCHORS = Object.freeze({
  playerDrawOrigin: Object.freeze({
    regionId: CARD_RIG_TABLETOP_REGION_IDS.playerDrawOrigin,
    // Presentation origin is the left interior of the approved deck region so
    // every draw visibly begins left of all stable hand slots.
    point: Object.freeze({ x: 250, y: 411 }),
    sourceRect: Object.freeze({ x: 214, y: 244, w: 365, h: 333 }),
  }),
  playedCardTarget: Object.freeze({
    regionId: CARD_RIG_TABLETOP_REGION_IDS.playedCardTarget,
    point: Object.freeze({ x: 1086, y: 361 }),
    sourceRect: Object.freeze({ x: 990, y: 248, w: 192, h: 226 }),
  }),
  playerDiscardTarget: Object.freeze({
    regionId: CARD_RIG_TABLETOP_REGION_IDS.playerDiscardTarget,
    // Presentation target is the right interior of the approved discard region
    // so every discard visibly finishes right of all stable hand slots.
    point: Object.freeze({ x: 1974, y: 411 }),
    sourceRect: Object.freeze({ x: 1637, y: 241, w: 373, h: 339 }),
  }),
  enemyCardOrigin: Object.freeze({
    regionId: CARD_RIG_TABLETOP_REGION_IDS.enemyCardOrigin,
    point: Object.freeze({ x: 1101, y: 94 }),
    sourceRect: Object.freeze({ x: 925, y: 0, w: 351, h: 187 }),
  }),
}) satisfies Readonly<Record<keyof typeof CARD_RIG_ANCHOR_IDS, SourceAnchor>>;

export type CardRigAnchorId =
  | (typeof CARD_RIG_ANCHOR_IDS)[keyof typeof CARD_RIG_ANCHOR_IDS]
  | `hand-slot-${0 | 1 | 2}`;

export type CardRigRouteKind =
  | 'draw'
  | 'play'
  | 'played-discard'
  | 'replacement-discard';

export type CardRigRoutePlan = Readonly<{
  kind: CardRigRouteKind;
  card: Card;
  from: CardRigAnchorId;
  to: CardRigAnchorId;
}>;

const requiredCard = (cue: CardRigCue): Card => {
  if (!cue.card) throw new Error(`CardRig ${cue.type} cue requires a card`);
  return cue.card;
};

const requiredHandSlot = (cue: CardRigCue): `hand-slot-${0 | 1 | 2}` => {
  if (cue.slot === undefined) {
    throw new Error(`CardRig ${cue.type} cue requires a semantic hand slot`);
  }
  return handSlotAnchorId(cue.slot) as `hand-slot-${0 | 1 | 2}`;
};

export const planCardRigRoute = (
  cue: CardRigCue,
): CardRigRoutePlan | undefined => {
  const card = cue.card ? requiredCard(cue) : undefined;

  switch (cue.type) {
    case 'deal':
    case 'refill':
      return Object.freeze({
        kind: 'draw',
        card: requiredCard(cue),
        from: CARD_RIG_ANCHOR_IDS.playerDrawOrigin,
        to: requiredHandSlot(cue),
      });
    case 'commit':
      return Object.freeze({
        kind: 'play',
        card: requiredCard(cue),
        from: requiredHandSlot(cue),
        to: CARD_RIG_ANCHOR_IDS.playedCardTarget,
      });
    case 'discard':
      return Object.freeze({
        kind: 'played-discard',
        card: requiredCard(cue),
        from: CARD_RIG_ANCHOR_IDS.playedCardTarget,
        to: CARD_RIG_ANCHOR_IDS.playerDiscardTarget,
      });
    case 'replace-discard':
      return Object.freeze({
        kind: 'replacement-discard',
        card: requiredCard(cue),
        from: requiredHandSlot(cue),
        to: CARD_RIG_ANCHOR_IDS.playerDiscardTarget,
      });
    default:
      void card;
      return undefined;
  }
};

export type CardRigViewportSize = Readonly<{ width: number; height: number }>;
export type CardRigResolvedPoint = Readonly<{ x: number; y: number; scale: number }>;

export const resolveCoverPoint = (
  viewport: CardRigViewportSize,
  source: CardRigViewportSize,
  point: SourcePoint,
): CardRigResolvedPoint => {
  if (viewport.width <= 0 || viewport.height <= 0) {
    throw new Error('CardRig viewport dimensions must be positive');
  }
  if (source.width <= 0 || source.height <= 0) {
    throw new Error('CardRig source dimensions must be positive');
  }

  const scale = Math.max(
    viewport.width / source.width,
    viewport.height / source.height,
  );
  const renderedWidth = source.width * scale;
  const renderedHeight = source.height * scale;
  const offsetX = (viewport.width - renderedWidth) / 2;
  const offsetY = (viewport.height - renderedHeight) / 2;

  return Object.freeze({
    x: offsetX + point.x * scale,
    y: offsetY + point.y * scale,
    scale,
  });
};
