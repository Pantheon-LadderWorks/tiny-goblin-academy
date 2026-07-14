export type AcademyTypographyRole =
  | 'academy-title'
  | 'game-title'
  | 'panel-heading'
  | 'body-instruction'
  | 'compact-label'
  | 'data-value'
  | 'result-state'
  | 'dialogue-title'
  | 'dialogue-speech'
  | 'debug-information'
  | 'optional-game-accent';

export interface AcademyTypographyRecipe {
  recipeId: string;
  family: string;
  weight: number;
  fallbackStack: string;
  sizeRangePx: readonly [number, number];
  lineHeight: number;
  letterSpacing: string;
  color: string;
  stroke: string;
  strokeThickness: number;
  shadow?: { color: string; offsetX: number; offsetY: number; blur: number; fill: boolean };
  align: 'left' | 'center' | 'right';
}

export interface AcademyPhaserTextStyle {
  fontFamily: string;
  fontStyle: string;
  fontSize: string;
  color: string;
  stroke: string;
  strokeThickness: number;
  shadow?: AcademyTypographyRecipe['shadow'];
  align: AcademyTypographyRecipe['align'];
  lineSpacing: number;
  [key: string]: unknown;
}

export interface AcademyFontFaceDefinition {
  family: string;
  weight: number;
  descriptor: string;
  sourcePath: string;
}

export interface AcademyFontLoadResult extends AcademyFontFaceDefinition {
  loaded: boolean;
}

interface FontFaceSetLike {
  load(font: string, text?: string): Promise<unknown>;
  check(font: string, text?: string): boolean;
  ready?: Promise<unknown>;
}

export interface AcademyTypographyAuditEntry {
  role: AcademyTypographyRole;
  recipeId: string;
  renderer: 'phaser';
  family: string;
  weight: number;
  fallbackStack: string;
  style: AcademyPhaserTextStyle;
}

const SERIF_FALLBACK = 'Georgia, serif';
const SANS_FALLBACK = 'Arial, sans-serif';
const MONO_FALLBACK = 'Consolas, monospace';

export const ACADEMY_TYPOGRAPHY_RECIPES: Readonly<Record<AcademyTypographyRole, AcademyTypographyRecipe>> = {
  'academy-title': {
    recipeId: 'academy-title-on-shell', family: 'Cinzel Decorative', weight: 700,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [36, 68], lineHeight: 1.05,
    letterSpacing: '0.04em', color: '#ead19a', stroke: '#4a2d1d', strokeThickness: 2,
    shadow: { color: '#2d1b13', offsetX: 0, offsetY: 2, blur: 0, fill: true }, align: 'center',
  },
  'game-title': {
    recipeId: 'game-title-on-dark', family: 'Cinzel', weight: 700,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [28, 46], lineHeight: 1.1,
    letterSpacing: '0.025em', color: '#f1dfae', stroke: '#39231a', strokeThickness: 1,
    shadow: { color: 'rgba(0,0,0,0.8)', offsetX: 0, offsetY: 3, blur: 4, fill: true }, align: 'center',
  },
  'panel-heading': {
    recipeId: 'panel-heading-on-parchment', family: 'Cinzel', weight: 600,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [18, 28], lineHeight: 1.15,
    letterSpacing: '0.015em', color: '#3d291d', stroke: 'transparent', strokeThickness: 0,
    shadow: { color: 'rgba(255,244,214,0.65)', offsetX: 0, offsetY: -1, blur: 0, fill: true }, align: 'left',
  },
  'body-instruction': {
    recipeId: 'body-on-parchment', family: 'Caudex', weight: 700,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [17, 24], lineHeight: 1.4,
    letterSpacing: '0', color: '#3d291d', stroke: 'transparent', strokeThickness: 0,
    shadow: { color: 'rgba(55,31,18,0.14)', offsetX: 0, offsetY: 1, blur: 2, fill: true }, align: 'left',
  },
  'compact-label': {
    recipeId: 'compact-label-on-metal', family: 'Outfit', weight: 600,
    fallbackStack: SANS_FALLBACK, sizeRangePx: [12, 18], lineHeight: 1.15,
    letterSpacing: '0.055em', color: '#d2ad57', stroke: 'rgba(35,23,20,0.45)', strokeThickness: 1,
    shadow: { color: 'rgba(0,0,0,0.65)', offsetX: 0, offsetY: 2, blur: 2, fill: true }, align: 'left',
  },
  'data-value': {
    recipeId: 'data-on-metal', family: 'Atkinson Hyperlegible', weight: 700,
    fallbackStack: SANS_FALLBACK, sizeRangePx: [18, 32], lineHeight: 1.05,
    letterSpacing: '0.01em', color: '#f1dfae', stroke: 'rgba(35,23,20,0.7)', strokeThickness: 1,
    shadow: { color: 'rgba(0,0,0,0.8)', offsetX: 0, offsetY: 2, blur: 3, fill: true }, align: 'right',
  },
  'result-state': {
    recipeId: 'result-on-teal-frame', family: 'Cinzel', weight: 700,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [22, 38], lineHeight: 1.1,
    letterSpacing: '0.02em', color: '#5b361f', stroke: '#f7e2b0', strokeThickness: 1,
    shadow: { color: 'rgba(77,44,26,0.3)', offsetX: 0, offsetY: 3, blur: 3, fill: true }, align: 'center',
  },
  'dialogue-title': {
    recipeId: 'dialogue-title-on-scroll', family: 'Cinzel', weight: 600,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [17, 24], lineHeight: 1.15,
    letterSpacing: '0.015em', color: '#3d291d', stroke: 'transparent', strokeThickness: 0,
    shadow: { color: 'rgba(55,31,18,0.16)', offsetX: 0, offsetY: 1, blur: 1, fill: true }, align: 'left',
  },
  'dialogue-speech': {
    recipeId: 'dialogue-body-on-scroll', family: 'Caudex', weight: 700,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [17, 22], lineHeight: 1.38,
    letterSpacing: '0', color: '#3d291d', stroke: 'transparent', strokeThickness: 0,
    shadow: { color: 'rgba(55,31,18,0.12)', offsetX: 0, offsetY: 1, blur: 2, fill: true }, align: 'left',
  },
  'debug-information': {
    recipeId: 'debug-on-dev-overlay', family: 'Fira Code', weight: 400,
    fallbackStack: MONO_FALLBACK, sizeRangePx: [12, 16], lineHeight: 1.3,
    letterSpacing: '0', color: '#e8e1d1', stroke: 'transparent', strokeThickness: 0, align: 'left',
  },
  'optional-game-accent': {
    recipeId: 'accent-on-parchment', family: 'Macondo', weight: 400,
    fallbackStack: SERIF_FALLBACK, sizeRangePx: [18, 26], lineHeight: 1.2,
    letterSpacing: '0.01em', color: '#3d291d', stroke: 'transparent', strokeThickness: 0,
    shadow: { color: 'rgba(55,31,18,0.14)', offsetX: 0, offsetY: 1, blur: 2, fill: true }, align: 'left',
  },
};

export const ACADEMY_RUNTIME_FONT_FACES: readonly AcademyFontFaceDefinition[] = [
  { family: 'Cinzel Decorative', weight: 700, descriptor: '700 16px "Cinzel Decorative"', sourcePath: '../source/google-fonts/cinzeldecorative/CinzelDecorative-Bold.ttf' },
  { family: 'Cinzel', weight: 600, descriptor: '600 16px "Cinzel"', sourcePath: '../source/google-fonts/cinzel/Cinzel[wght].ttf' },
  { family: 'Cinzel', weight: 700, descriptor: '700 16px "Cinzel"', sourcePath: '../source/google-fonts/cinzel/Cinzel[wght].ttf' },
  { family: 'Caudex', weight: 700, descriptor: '700 16px "Caudex"', sourcePath: '../source/google-fonts/caudex/Caudex-Bold.ttf' },
  { family: 'Outfit', weight: 600, descriptor: '600 16px "Outfit"', sourcePath: '../source/google-fonts/outfit/Outfit[wght].ttf' },
  { family: 'Atkinson Hyperlegible', weight: 700, descriptor: '700 16px "Atkinson Hyperlegible"', sourcePath: '../source/google-fonts/atkinsonhyperlegible/AtkinsonHyperlegible-Bold.ttf' },
  { family: 'Fira Code', weight: 400, descriptor: '400 16px "Fira Code"', sourcePath: '../source/google-fonts/firacode/FiraCode[wght].ttf' },
  { family: 'Macondo', weight: 400, descriptor: '400 16px "Macondo"', sourcePath: '../source/google-fonts/macondo/Macondo-Regular.ttf' },
] as const;

export function getAcademyTypographyRecipe(role: AcademyTypographyRole): AcademyTypographyRecipe {
  return ACADEMY_TYPOGRAPHY_RECIPES[role];
}

function auditStore(): AcademyTypographyAuditEntry[] | undefined {
  if (typeof window === 'undefined') return undefined;
  const runtimeWindow = window as typeof window & { __TGA_TYPOGRAPHY_AUDIT__?: AcademyTypographyAuditEntry[] };
  runtimeWindow.__TGA_TYPOGRAPHY_AUDIT__ ??= [];
  return runtimeWindow.__TGA_TYPOGRAPHY_AUDIT__;
}

export function createAcademyPhaserTextStyle(
  role: AcademyTypographyRole,
  overrides: Partial<AcademyPhaserTextStyle> = {},
): AcademyPhaserTextStyle {
  const recipe = getAcademyTypographyRecipe(role);
  const style: AcademyPhaserTextStyle = {
    fontFamily: `"${recipe.family}", ${recipe.fallbackStack}`,
    fontStyle: String(recipe.weight),
    fontSize: `${recipe.sizeRangePx[0]}px`,
    color: recipe.color,
    stroke: recipe.stroke,
    strokeThickness: recipe.strokeThickness,
    shadow: recipe.shadow,
    align: recipe.align,
    lineSpacing: Math.round(recipe.sizeRangePx[0] * (recipe.lineHeight - 1)),
    ...overrides,
  };

  const store = auditStore();
  if (store && !store.some((entry) => entry.role === role && entry.renderer === 'phaser')) {
    store.push({
      role,
      recipeId: recipe.recipeId,
      renderer: 'phaser',
      family: recipe.family,
      weight: recipe.weight,
      fallbackStack: recipe.fallbackStack,
      style: { ...style },
    });
  }

  return style;
}

export async function waitForAcademyFonts(fonts?: FontFaceSetLike): Promise<AcademyFontLoadResult[]> {
  const fontSet = fonts ?? (typeof document !== 'undefined' ? document.fonts : undefined);
  if (!fontSet) {
    return ACADEMY_RUNTIME_FONT_FACES.map((face) => ({ ...face, loaded: false }));
  }

  await Promise.all(ACADEMY_RUNTIME_FONT_FACES.map((face) => fontSet.load(face.descriptor, 'Academy 0123456789')));
  await fontSet.ready;
  return ACADEMY_RUNTIME_FONT_FACES.map((face) => ({
    ...face,
    loaded: fontSet.check(face.descriptor, 'Academy 0123456789'),
  }));
}
