import { describe, expect, it, vi } from 'vitest';
import {
  ACADEMY_RUNTIME_FONT_FACES,
  createAcademyPhaserTextStyle,
  getAcademyTypographyRecipe,
  waitForAcademyFonts,
} from '../../../../assets/academy/fonts/runtime/academy-typography';

describe('Academy runtime typography contract', () => {
  it('preserves the H5.98 canonical role defaults', () => {
    expect(getAcademyTypographyRecipe('academy-title')).toMatchObject({
      recipeId: 'academy-title-on-shell',
      family: 'Cinzel Decorative',
      weight: 700,
    });
    expect(getAcademyTypographyRecipe('body-instruction')).toMatchObject({
      recipeId: 'body-on-parchment',
      family: 'Caudex',
      weight: 700,
    });
    expect(getAcademyTypographyRecipe('data-value')).toMatchObject({
      recipeId: 'data-on-metal',
      family: 'Atkinson Hyperlegible',
      weight: 700,
    });
    expect(getAcademyTypographyRecipe('game-title')).toMatchObject({
      recipeId: 'game-title-on-dark',
      family: 'Cinzel',
      weight: 800,
      sizeRangePx: [30, 50],
    });
    expect(getAcademyTypographyRecipe('result-state')).toMatchObject({
      recipeId: 'result-on-teal-frame',
      family: 'Cinzel',
      weight: 800,
      sizeRangePx: [24, 39],
      letterSpacing: '.005em',
    });
    expect(getAcademyTypographyRecipe('debug-information')).toMatchObject({
      recipeId: 'debug-on-dev-overlay',
      family: 'Fira Code',
      weight: 400,
    });
  });

  it('creates Phaser styles from the same semantic recipes and fallback stacks', () => {
    const title = createAcademyPhaserTextStyle('panel-heading', { fontSize: '28px' });
    const hp = createAcademyPhaserTextStyle('data-value', { color: '#d94a4a' });

    expect(title).toMatchObject({
      fontFamily: '"Cinzel", Georgia, serif',
      fontStyle: '600',
      fontSize: '28px',
    });
    expect(hp).toMatchObject({
      fontFamily: '"Atkinson Hyperlegible", Arial, sans-serif',
      fontStyle: '700',
      color: '#d94a4a',
    });
  });

  it('loads and verifies every canonical runtime face before Phaser text creation', async () => {
    const load = vi.fn(async () => [{}]);
    const check = vi.fn(() => true);

    const results = await waitForAcademyFonts({ load, check, ready: Promise.resolve() });

    expect(results).toHaveLength(ACADEMY_RUNTIME_FONT_FACES.length);
    expect(results.every((result) => result.loaded)).toBe(true);
    expect(load).toHaveBeenCalledTimes(ACADEMY_RUNTIME_FONT_FACES.length);
    expect(check).toHaveBeenCalledTimes(ACADEMY_RUNTIME_FONT_FACES.length);
  });

  it('registers repository-local font sources only', () => {
    expect(ACADEMY_RUNTIME_FONT_FACES.every((face) => face.sourcePath.startsWith('../source/google-fonts/'))).toBe(true);
    expect(ACADEMY_RUNTIME_FONT_FACES.some((face) => /https?:\/\//i.test(face.sourcePath))).toBe(false);
  });
});
