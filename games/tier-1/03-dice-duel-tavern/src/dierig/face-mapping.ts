import diceSheetUrl from '../../../../../assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png?url';

export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

export interface DieFaceMapping {
  face: DieFace;
  id: string;
  rect: { x: number; y: number; w: number; h: number };
}

const ids = [
  'dice-duel-tavern.dice-face.flat-one',
  'dice-duel-tavern.dice-face.flat-two',
  'dice-duel-tavern.dice-face.flat-three',
  'dice-duel-tavern.dice-face.flat-four',
  'dice-duel-tavern.dice-face.flat-five',
  'dice-duel-tavern.dice-face.flat-six',
] as const;

export const DIE_SHEET_URL = diceSheetUrl;
export const DIE_SHEET_KEY = 'h6-10-dice-duel-cleaned-sheet';
export const DIE_SHEET_SIZE = 1024;

export const DIE_FACE_MAPPINGS: readonly DieFaceMapping[] = ids.map((id, index) => ({
  face: (index + 1) as DieFace,
  id,
  rect: { x: 1 + (index * 128), y: 1, w: 126, h: 126 },
}));
