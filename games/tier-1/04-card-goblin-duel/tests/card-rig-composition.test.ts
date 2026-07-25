import { describe, expect, it } from 'vitest';
import {
  CARD_RIG_ATTACHMENT_AUTHORITIES,
  CARD_RIG_ATTACHMENT_CLEANUP,
  CARD_RIG_COMPOSITION_FIXTURES,
  CARD_RIG_ENVIRONMENTAL_SLOTS,
  CARD_RIG_LAYER_ORDER,
  CARD_RIG_OUTER_FRAMES,
  attachmentAnchorId,
  createCardRigComposition,
  planCardRigAttachment,
} from '../src/card-rig-composition';
import { renderCardSlot, renderHandCard } from '../src/card-view';
import { CARD_EFFECT_RECIPES } from '../src/card-effect-recipes';

describe('H6.22R1 CardRig visual composition authority', () => {
  it('governs one ordered visual stack under one CardRig identity', () => {
    expect(CARD_RIG_LAYER_ORDER).toEqual([
      'shadow',
      'base-face',
      'content',
      'outer-frame',
      'state',
      'card-local-fx',
    ]);

    const composition = createCardRigComposition('Spark', 1, 'gold-ornate');
    expect(composition.rigId).toBe('spark-1');
    expect(composition.layers.map(({ kind }) => kind)).toEqual(CARD_RIG_LAYER_ORDER);
    expect(new Set(composition.layers.map(({ ownerRigId }) => ownerRigId))).toEqual(
      new Set(['spark-1']),
    );
  });

  it('keeps true outer frames separate from environmental slot surfaces', () => {
    expect(CARD_RIG_OUTER_FRAMES).toMatchObject({
      none: { classification: 'valid-null-baseline', sourceRect: null },
      'gold-ornate': {
        classification: 'true-card-frame',
        manifestId: 'card-goblin-duel.card-frames.card-front-frame.gold-ornate-open-frame',
        sourceRect: { x: 641, y: 824, w: 125, h: 189 },
      },
      wood: {
        classification: 'true-card-frame',
        manifestId: 'card-goblin-duel.card-frames.card-front-frame.wood-open-card-frame',
        sourceRect: { x: 770, y: 825, w: 123, h: 187 },
      },
      'corner-ornate': {
        classification: 'true-card-frame',
        manifestId: 'card-goblin-duel.card-frames.card-front-frame.corner-ornate-open-frame',
        sourceRect: { x: 898, y: 825, w: 123, h: 187 },
      },
    });
    expect(Object.values(CARD_RIG_ENVIRONMENTAL_SLOTS).every(
      ({ classification }) => classification !== ('true-card-frame' as string),
    )).toBe(true);
    expect(Object.keys(CARD_RIG_OUTER_FRAMES)).not.toContain('green-slot');
    expect(Object.keys(CARD_RIG_OUTER_FRAMES)).not.toContain('teal-slot');
  });

  it('renders every CardRig layer inside one semantic button', () => {
    const html = renderHandCard(
      'Spark',
      1,
      'PlayerAction',
      'tokens',
      false,
      { rigId: 'spark-1', outerFrame: 'gold-ornate' },
    );

    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain('data-card-rig-id="spark-1"');
    for (const layer of CARD_RIG_LAYER_ORDER) {
      expect(html).toContain(`data-card-rig-layer="${layer}"`);
    }
    expect(html).toContain('data-outer-frame="gold-ornate"');
    expect(html).not.toContain('data-card-slot-surface');
  });

  it('renders environmental slot identity outside the moving semantic CardRig', () => {
    const html = renderCardSlot('Guard', 0, 'PlayerAction', {
      environmentalSlot: 'green-slot',
      outerFrame: 'wood',
    });
    const slotStart = html.indexOf('data-card-slot-surface="green-slot"');
    const buttonStart = html.indexOf('<button');
    const buttonEnd = html.indexOf('</button>');

    expect(slotStart).toBeGreaterThanOrEqual(0);
    expect(buttonStart).toBeGreaterThan(slotStart);
    expect(buttonEnd).toBeGreaterThan(buttonStart);
    expect(html.indexOf('data-card-slot-surface', buttonStart)).toBe(-1);
    expect(html.match(/data-stage-anchor="hand-slot-0"/g)).toHaveLength(1);
  });

  it('defines every Rung 1 attachment authority without viewport-center', () => {
    expect(CARD_RIG_ATTACHMENT_AUTHORITIES).toEqual([
      'card-local',
      'draw-pile-local',
      'discard-pile-local',
      'player-target',
      'enemy-target',
      'travel',
      'tabletop-local',
    ]);
    expect(CARD_RIG_ATTACHMENT_AUTHORITIES).not.toContain('viewport-center');
    expect(attachmentAnchorId({ kind: 'card-local', rigId: 'spark-1' }))
      .toBe('card-rig:spark-1');
    expect(attachmentAnchorId({ kind: 'draw-pile-local' }))
      .toBe('player-draw-origin');
    expect(attachmentAnchorId({ kind: 'discard-pile-local' }))
      .toBe('player-discard-target');
    expect(attachmentAnchorId({ kind: 'player-target' })).toBe('player-impact');
    expect(attachmentAnchorId({ kind: 'enemy-target' })).toBe('enemy-impact');
    expect(attachmentAnchorId({ kind: 'travel', rigId: 'spark-1' }))
      .toBe('card-rig-travel:spark-1');
    expect(attachmentAnchorId({ kind: 'tabletop-local', anchorId: 'played-card-target' }))
      .toBe('played-card-target');
  });

  it('adapts retained H6.22A layers to explicit semantic attachment targets', () => {
    const targets = Object.values(CARD_EFFECT_RECIPES).flatMap((recipe) => [
      ...recipe.full.layers.map(({ target }) => target),
      ...recipe.reduced.layers.map(({ target }) => target),
    ]);
    expect(new Set(targets)).toEqual(new Set([
      'card-local',
      'player-target',
      'enemy-target',
      'tabletop-local',
    ]));
    expect(targets).not.toContain('card');
    expect(targets).not.toContain('resolution');
    expect(targets).not.toContain('stage');
  });

  it('plans moving ownership, stable anchors, and zero-residue cleanup explicitly', () => {
    expect(planCardRigAttachment({ kind: 'card-local', rigId: 'guard-0' })).toEqual({
      authority: 'card-local',
      anchorId: 'card-rig:guard-0',
      ownerRigId: 'guard-0',
      follow: 'owner-transform',
      mountSelector: '[data-card-rig-id="guard-0"] [data-card-rig-layer="card-local-fx"]',
    });
    expect(planCardRigAttachment({ kind: 'draw-pile-local' }).follow).toBe('stable-anchor');
    expect(planCardRigAttachment({ kind: 'travel', rigId: 'spark-1' }).follow).toBe('animation-frame');
    expect(planCardRigAttachment({
      kind: 'tabletop-local',
      anchorId: 'played-card-target',
    }).follow).toBe('stable-anchor');
    expect(CARD_RIG_ATTACHMENT_CLEANUP).toEqual({
      cancelAnimationFrames: true,
      removeTemporaryNodes: true,
      clearOwnerClasses: true,
      resetTransforms: true,
      requireZeroResidue: true,
    });
  });

  it('covers the complete Rung 1 fixture authority without card-specific polish', () => {
    expect(Object.keys(CARD_RIG_COMPOSITION_FIXTURES)).toEqual([
      'layer-stack',
      'frame-matrix',
      'slot-vs-frame',
      'card-local-follow',
      'draw-pile-local',
      'discard-pile-local',
      'player-target',
      'enemy-target',
      'travel',
      'tabletop-local',
      'resize-active',
      'cancel-cleanup',
      'reduced-motion',
    ]);
    expect(Object.values(CARD_RIG_COMPOSITION_FIXTURES).every(({ diagnosticOnly }) => diagnosticOnly))
      .toBe(true);
  });
});
