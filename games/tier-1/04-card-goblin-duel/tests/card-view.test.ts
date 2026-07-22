import { describe, expect, it } from 'vitest';
import {
  CARD_DESCRIPTIONS,
  phasePresentation,
  renderHandCard,
  renderNextCard,
} from '../src/card-view';

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

  it('disables terminal cards without changing their semantic identity', () => {
    const html = renderHandCard('Mend', 2, 'Terminal');
    expect(html).toContain('card-disabled');
    expect(html).toContain('disabled');
    expect(html).toContain('data-stage-anchor="hand-slot-2"');
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
