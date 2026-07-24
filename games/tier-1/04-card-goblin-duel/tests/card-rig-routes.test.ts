import { describe, expect, it } from 'vitest';
import { CARD_RIG_FIXTURES, type CardRigCue } from '../src/card-rig';
import {
  CARD_RIG_ANCHOR_IDS,
  CARD_RIG_SOURCE_ANCHORS,
  CARD_RIG_SOURCE_SIZE,
  CARD_RIG_TABLETOP_REGION_IDS,
  planCardRigRoute,
  resolveCoverPoint,
} from '../src/card-rig-routes';

const route = (cue: CardRigCue) => planCardRigRoute(cue);

describe('CardRig governed tabletop authority', () => {
  it('binds semantic anchors to the approved mapped regions', () => {
    expect(CARD_RIG_TABLETOP_REGION_IDS).toEqual({
      playerDrawOrigin: 'card-goblin-duel.tabletop.deck-zone.left-green-deck-well',
      playedCardTarget: 'card-goblin-duel.tabletop.anchor.played-card-landing-center',
      playerDiscardTarget: 'card-goblin-duel.tabletop.discard-zone.right-locked-well',
      enemyCardOrigin: 'card-goblin-duel.tabletop.card-well.top-opponent-well',
    });
    expect(CARD_RIG_ANCHOR_IDS).toEqual({
      playerDrawOrigin: 'player-draw-origin',
      playedCardTarget: 'played-card-target',
      playerDiscardTarget: 'player-discard-target',
      enemyCardOrigin: 'enemy-card-origin',
    });
  });

  it('keeps every governed anchor inside its mapped source rectangle', () => {
    for (const anchor of Object.values(CARD_RIG_SOURCE_ANCHORS)) {
      const { point, sourceRect } = anchor;
      expect(point.x).toBeGreaterThanOrEqual(sourceRect.x);
      expect(point.x).toBeLessThanOrEqual(sourceRect.x + sourceRect.w);
      expect(point.y).toBeGreaterThanOrEqual(sourceRect.y);
      expect(point.y).toBeLessThanOrEqual(sourceRect.y + sourceRect.h);
    }
  });

  it('keeps player draw, played, discard, and enemy anchors distinct', () => {
    const points = Object.values(CARD_RIG_SOURCE_ANCHORS)
      .map(({ point }) => `${point.x},${point.y}`);
    expect(new Set(points).size).toBe(points.length);
  });

  it.each([
    { width: 1280, height: 660 },
    { width: 1024, height: 580 },
  ])('resolves physical left/center/right geography at $width by $height', (viewport) => {
    const draw = resolveCoverPoint(viewport, CARD_RIG_SOURCE_SIZE,
      CARD_RIG_SOURCE_ANCHORS.playerDrawOrigin.point);
    const played = resolveCoverPoint(viewport, CARD_RIG_SOURCE_SIZE,
      CARD_RIG_SOURCE_ANCHORS.playedCardTarget.point);
    const discard = resolveCoverPoint(viewport, CARD_RIG_SOURCE_SIZE,
      CARD_RIG_SOURCE_ANCHORS.playerDiscardTarget.point);
    const enemy = resolveCoverPoint(viewport, CARD_RIG_SOURCE_SIZE,
      CARD_RIG_SOURCE_ANCHORS.enemyCardOrigin.point);

    expect(draw.x).toBeLessThan(played.x);
    expect(played.x).toBeLessThan(discard.x);
    expect(enemy.y).toBeLessThan(played.y);
  });
});

describe('CardRig semantic route plans', () => {
  it('routes every opening deal from the physical player draw origin', () => {
    const plans = CARD_RIG_FIXTURES['initial-deal'].cues
      .filter((cue) => cue.type === 'deal')
      .map(route);
    expect(plans).toEqual([
      { kind: 'draw', card: 'Strike', from: 'player-draw-origin', to: 'hand-slot-0' },
      { kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1' },
      { kind: 'draw', card: 'Mend', from: 'player-draw-origin', to: 'hand-slot-2' },
    ]);
  });

  it('routes an ordinary play through center, discard, then a physical refill', () => {
    const plans = CARD_RIG_FIXTURES['strike-commitment'].cues
      .map(route)
      .filter(Boolean);
    expect(plans).toEqual([
      { kind: 'play', card: 'Strike', from: 'hand-slot-0', to: 'played-card-target' },
      { kind: 'played-discard', card: 'Strike', from: 'played-card-target', to: 'player-discard-target' },
      { kind: 'draw', card: 'Spark', from: 'player-draw-origin', to: 'hand-slot-2' },
    ]);
  });

  it('keeps Heavy Bonk free from any refill route', () => {
    const plans = CARD_RIG_FIXTURES['heavy-bonk-vacancy'].cues
      .map(route)
      .filter(Boolean);
    expect(plans.some((plan) => plan?.kind === 'draw')).toBe(false);
  });

  it('runs Spark through played discard before direct replacement discard', () => {
    const fixture = CARD_RIG_FIXTURES['spark-sequence'];
    expect(fixture.cues.map(({ type }) => type)).toEqual([
      'commit',
      'effect-hold',
      'discard',
      'spark-choice',
      'replace-discard',
      'refill',
      'refill',
      'settle',
      'focus',
    ]);
    expect(fixture.cues.map(route).filter(Boolean)).toEqual([
      { kind: 'play', card: 'Spark', from: 'hand-slot-1', to: 'played-card-target' },
      { kind: 'played-discard', card: 'Spark', from: 'played-card-target', to: 'player-discard-target' },
      { kind: 'replacement-discard', card: 'Mend', from: 'hand-slot-2', to: 'player-discard-target' },
      { kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1' },
      { kind: 'draw', card: 'Stun', from: 'player-draw-origin', to: 'hand-slot-2' },
    ]);
  });

  it('never routes a player card through the top rail or enemy origin', () => {
    const forbidden = new Set(['deck', 'discard', 'enemy-card-origin', 'phase-banner']);
    for (const fixture of Object.values(CARD_RIG_FIXTURES)) {
      for (const cue of fixture.cues) {
        const plan = route(cue);
        if (!plan) continue;
        expect(forbidden.has(plan.from)).toBe(false);
        expect(forbidden.has(plan.to)).toBe(false);
      }
    }
  });
});
