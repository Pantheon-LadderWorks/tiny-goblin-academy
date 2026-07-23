import { describe, expect, it } from 'vitest';
import {
  CARD_DESCRIPTIONS,
  CARD_FRAME_PRESENTATIONS,
  CARD_LAB_CARDS,
  phasePresentation,
  renderHandCard,
  renderNextCard,
} from '../src/card-view';
import { createGame, playCard, resolveSparkChoice } from '../src/simulation';

describe('accessible Card Goblin DOM card views', () => {
  it('renders a playable semantic button with a stable hand anchor', () => {
    const html = renderHandCard('Strike', 0, 'PlayerAction');

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('data-stage-anchor="hand-slot-0"');
    expect(html).toContain('data-card-name="Strike"');
    expect(html).toContain('aria-label="Play Strike. Deal 2 damage."');
    expect(html).not.toContain('disabled');
  });

  it('renders SparkChoice cards as replacement choices', () => {
    const html = renderHandCard('Guard', 1, 'SparkChoice');
    expect(html).toContain('card-choice');
    expect(html).toContain('aria-label="Replace Guard. Reduce next enemy damage by 2."');
    expect(html).not.toContain('disabled');
  });

  it('keeps the deterministic capture fixture in SparkChoice with two complete Replace badges', () => {
    let state = createGame();
    state = playCard(state, 1);
    state = playCard(state, state.hand.indexOf('Spark'));
    const html = state.hand
      .map((card, index) => renderHandCard(card, index, state.phase))
      .join('');

    expect(state.phase).toBe('SparkChoice');
    expect(state.hand).toHaveLength(2);
    expect(html.match(/>Replace</g)).toHaveLength(2);
    expect(html.match(/aria-label="Replace /g)).toHaveLength(2);
  });

  it('locks exactly two rendered cards in the deterministic terminal capture fixture', () => {
    let state = createGame();
    for (const name of ['Guard', 'Spark', 'Mend', 'Heavy Bonk', 'Stun', 'Strike', 'Spark', 'Mend', 'Stun', 'Heavy Bonk'] as const) {
      const index = state.hand.indexOf(name);
      expect(index).toBeGreaterThanOrEqual(0);
      state = state.phase === 'SparkChoice'
        ? resolveSparkChoice(state, index)
        : playCard(state, index);
    }
    const html = state.hand
      .map((card, index) => renderHandCard(card, index, state.phase))
      .join('');

    expect(state.phase).toBe('Terminal');
    expect(state.hand).toHaveLength(2);
    expect(html.match(/class="card-btn[^\"]*card-disabled/g)).toHaveLength(2);
    expect(html.match(/ disabled/g)).toHaveLength(2);
    expect(html.match(/>Locked</g)).toHaveLength(2);
    expect(html.match(/data-stage-anchor="hand-slot-/g)).toHaveLength(2);
    expect(playCard(state, 0)).toBe(state);
  });

  it('renders the next card as a non-interactive preview', () => {
    const html = renderNextCard('Spark');
    expect(html).toContain('<article');
    expect(html).toContain('data-stage-anchor="deck"');
    expect(html).toContain(CARD_DESCRIPTIONS.Spark);
    expect(html).not.toContain('<button');
  });

  it('keeps the deck anchor available when the queue is empty', () => {
    expect(renderNextCard(undefined)).toContain('data-stage-anchor="deck"');
  });

  it('maps all six actions onto the approved five-face card language', () => {
    expect(CARD_FRAME_PRESENTATIONS).toMatchObject({
      Strike: { frame: 'blank-parchment', semanticRole: 'basic-direct-action' },
      Guard: { frame: 'teal-banner', semanticRole: 'defense-control' },
      Mend: { frame: 'green-banner', semanticRole: 'recovery-support' },
      Spark: { frame: 'teal-edged-tan', semanticRole: 'hybrid-trick-action' },
      Stun: { frame: 'teal-banner', semanticRole: 'defense-control' },
      'Heavy Bonk': { frame: 'tan-banner', semanticRole: 'heavy-physical-force' },
    });
    expect(new Set(Object.values(CARD_FRAME_PRESENTATIONS).map(({ frame }) => frame))).toEqual(
      new Set(['blank-parchment', 'green-banner', 'teal-banner', 'tan-banner', 'teal-edged-tan']),
    );
  });

  it('centralizes two measured slot templates and governed token identities', () => {
    expect(CARD_FRAME_PRESENTATIONS.Strike).toMatchObject({
      nativeWidth: 123,
      nativeHeight: 170,
      token: { id: 'sword-icon', sourceRect: { x: 2, y: 2, w: 120, h: 124 } },
      slots: {
        title: { x: 0.20, y: 0.075, width: 0.60, height: 0.105 },
        art: { x: 0.18, y: 0.21, width: 0.64, height: 0.32 },
        body: { x: 0.13, y: 0.60, width: 0.74, height: 0.27 },
      },
    });
    expect(CARD_FRAME_PRESENTATIONS['Heavy Bonk']).toMatchObject({
      token: { id: 'club-weapon-icon', sourceRect: { x: 514, y: 2, w: 124, h: 124 } },
      slots: {
        art: { x: 0.22, y: 0.14, width: 0.56, height: 0.34 },
        title: { x: 0.15, y: 0.555, width: 0.70, height: 0.105 },
        body: { x: 0.13, y: 0.695, width: 0.74, height: 0.205 },
      },
    });
  });

  it('keeps six-card laboratory fixtures out of the production three-anchor contract', () => {
    const labHtml = CARD_LAB_CARDS
      .map((card, index) => renderHandCard(card, index % 3, 'PlayerAction', 'tokens', false))
      .join('');
    const ordinaryHtml = (['Strike', 'Guard', 'Mend'] as const)
      .map((card, index) => renderHandCard(card, index, 'PlayerAction'))
      .join('');

    expect(labHtml.match(/class="card-btn/g)).toHaveLength(6);
    expect(labHtml).not.toContain('data-stage-anchor="hand-slot-');
    expect(ordinaryHtml.match(/data-stage-anchor="hand-slot-/g)).toHaveLength(3);
    expect(ordinaryHtml).toContain('data-stage-anchor="hand-slot-0"');
    expect(ordinaryHtml).toContain('data-stage-anchor="hand-slot-1"');
    expect(ordinaryHtml).toContain('data-stage-anchor="hand-slot-2"');
  });

  it('renders mapped token surfaces without placeholder punctuation or a cost slot', () => {
    const html = Object.keys(CARD_FRAME_PRESENTATIONS)
      .map((card, index) => renderHandCard(card as keyof typeof CARD_FRAME_PRESENTATIONS, index % 3, 'PlayerAction'))
      .join('');

    expect(html).toContain('data-card-frame="blank-parchment"');
    expect(html).toContain('data-card-frame="teal-edged-tan"');
    expect(html).toContain('class="card-art-slot"');
    expect(html).toContain('class="card-token"');
    expect(html).toContain('data-card-token="projectile-star-effect"');
    expect(html).not.toContain('class="card-icon"');
    expect(html).not.toMatch(/>[*#+^~!]</);
    expect(html).not.toContain('card-cost');
  });

  it('keeps complete action and state labels in the semantic card buttons', () => {
    const replace = renderHandCard('Spark', 1, 'SparkChoice');
    const locked = renderHandCard('Heavy Bonk', 2, 'Terminal');

    expect(replace).toContain('aria-label="Replace Spark. Deal 1 damage and replace one card."');
    expect(replace).toContain('>Replace<');
    expect(locked).toContain('aria-label="Play Heavy Bonk. Deal 4 damage; skip next draw."');
    expect(locked).toContain('>Locked<');
  });

  it('returns compact phase presentation without gameplay decisions', () => {
    expect(phasePresentation('PlayerAction', 10)).toEqual({
      banner: 'Your Turn',
      instruction: 'Choose one card to play.',
      bodyClass: 'phase-player',
    });
    expect(phasePresentation('SparkChoice', 10).banner).toContain('Spark');
    expect(phasePresentation('Terminal', 0).banner).toBe('DEFEAT');
    expect(phasePresentation('Terminal', 4).banner).toBe('VICTORY');
  });
});
