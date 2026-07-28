import { CARD_EFFECT_FIXTURES, type CardEffectFixtureId, type CardEffectMode } from '../card-effect-recipes';
import { CARD_RIG_FIXTURES, type CardRigFixtureId, type CardRigMode } from '../card-rig';
import {
  CARD_RIG_COMPOSITION_FIXTURES,
  type CardRigCompositionFixtureId,
  type CardRigOuterFrameId,
} from '../card-rig-composition';
import type { CardSurfaceStrategy } from '../card-view';

export type CardGoblinRuntimeConfig = Readonly<{
  cardLabStrategy?: CardSurfaceStrategy;
  cardSlotDebug: boolean;
  cardTypographyGuides: boolean;
  cardRigCompositionFixtureId?: CardRigCompositionFixtureId;
  compositionFrameStyle: CardRigOuterFrameId;
  cardRigFixtureId?: CardRigFixtureId;
  cardEffectFixtureId?: CardEffectFixtureId;
  cardRigMode: CardRigMode;
  cardEffectMode: CardEffectMode;
  productionPresentationEnabled: boolean;
}>;

const compositionRigFixtureId = (
  fixtureId: CardRigCompositionFixtureId | undefined,
  frameStyle: CardRigOuterFrameId,
): CardRigFixtureId | undefined => {
  if (!fixtureId) return undefined;
  if (fixtureId === 'frame-matrix') {
    if (frameStyle === 'gold-ornate') return 'r1-frame-gold';
    if (frameStyle === 'wood') return 'r1-frame-wood';
    if (frameStyle === 'corner-ornate') return 'r1-frame-corner';
    return 'r1-frame-gold';
  }
  const fixtures: Partial<Record<CardRigCompositionFixtureId, CardRigFixtureId>> = {
    'layer-stack': 'optical-default',
    'slot-vs-frame': 'optical-default',
    'card-local-follow': 'guard-commitment',
    'draw-pile-local': 'initial-deal',
    'discard-pile-local': 'strike-commitment',
    'player-target': 'guard-commitment',
    'enemy-target': 'strike-commitment',
    travel: 'spark-sequence',
    'tabletop-local': 'guard-commitment',
    'resize-active': 'resize-active',
    'cancel-cleanup': 'reset-during-commitment',
    'reduced-motion': 'initial-deal',
  };
  return fixtures[fixtureId];
};

export const resolveRuntimeConfig = (
  search: string,
  development: boolean,
): CardGoblinRuntimeConfig => {
  const params = new URLSearchParams(search);
  const requestedLab = params.get('cardLab');
  const cardLabStrategy = requestedLab === 'clean' || requestedLab === 'tokens'
    ? requestedLab
    : undefined;
  const requestedComposition = params.get('cardComp');
  const cardRigCompositionFixtureId = development
    && requestedComposition
    && requestedComposition in CARD_RIG_COMPOSITION_FIXTURES
    ? requestedComposition as CardRigCompositionFixtureId
    : undefined;
  const requestedFrameStyle = params.get('frameStyle');
  const compositionFrameStyle: CardRigOuterFrameId = requestedFrameStyle === 'gold-ornate'
    || requestedFrameStyle === 'wood'
    || requestedFrameStyle === 'corner-ornate'
    ? requestedFrameStyle
    : 'none';
  const requestedRig = params.get('cardRig');
  const cardRigFixtureId = development
    && requestedRig
    && requestedRig in CARD_RIG_FIXTURES
    ? requestedRig as CardRigFixtureId
    : compositionRigFixtureId(cardRigCompositionFixtureId, compositionFrameStyle);
  const requestedEffect = params.get('cardFx');
  const cardEffectFixtureId = development
    && requestedEffect
    && requestedEffect in CARD_EFFECT_FIXTURES
    ? requestedEffect as CardEffectFixtureId
    : undefined;
  const reduced = params.get('motion') === 'reduced';
  const cardRigMode: CardRigMode = reduced || cardRigCompositionFixtureId === 'reduced-motion'
    ? 'reduced'
    : 'full';
  const cardEffectMode: CardEffectMode = reduced ? 'reduced' : 'full';

  return Object.freeze({
    cardLabStrategy,
    cardSlotDebug: params.get('cardSlots') === '1',
    cardTypographyGuides: params.get('cardGuides') === '1',
    cardRigCompositionFixtureId,
    compositionFrameStyle,
    cardRigFixtureId,
    cardEffectFixtureId,
    cardRigMode,
    cardEffectMode,
    productionPresentationEnabled: !cardRigFixtureId && !cardEffectFixtureId && !cardLabStrategy,
  });
};
