import type { PotionType } from '../simulation';

export const STAGE = Object.freeze({ width: 1600, height: 900, centerX: 800, centerY: 480 });

export const PERSPECTIVE = Object.freeze({
  queue: [
    { role: 'rear', x: 800, y: 310, scale: 0.34, depth: 27 },
    { role: 'middle', x: 800, y: 430, scale: 0.5, depth: 30 }
  ],
  aperture: { x: 800, y: 570, scale: 0.88, depth: 32 },
  branch: { x: 800, y: 680, scale: 0.88, depth: 46 }
});

export const ASSET_KEYS = Object.freeze({
  potionSheet: 'potion-sheet',
  timber: 'timber',
  masonry: 'masonry',
  iron: 'iron',
  brass: 'brass',
  parchment: 'parchment'
});

export const ASSET_URLS = Object.freeze({
  potionSheet: new URL('../../../../../assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png', import.meta.url).href,
  timber: new URL('../../../../../assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png', import.meta.url).href,
  masonry: new URL('../../../../../assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_stone.png', import.meta.url).href,
  iron: new URL('../../../../../assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png', import.meta.url).href,
  brass: new URL('../../../../../assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg', import.meta.url).href,
  parchment: new URL('../../../../../assets/academy/materials/source/h5-100c/opengameart/luke-rustltd-parchment/originals/parchment.png', import.meta.url).href
});

export interface FrameSpec {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tint?: number;
}

export const POTION_FRAMES: Record<PotionType, FrameSpec> = {
  sun: { index: 1, x: 45, y: 29, width: 146, height: 191, tint: 0xef625b },
  moon: { index: 2, x: 271, y: 29, width: 115, height: 191, tint: 0x5ab7ef },
  star: { index: 3, x: 466, y: 29, width: 142, height: 191, tint: 0x75ca78 }
};

export const RECEIVER_FRAMES: Record<PotionType, FrameSpec> = {
  sun: { index: 17, x: 24, y: 482, width: 187, height: 181 },
  moon: { index: 18, x: 234, y: 482, width: 187, height: 181 },
  star: { index: 19, x: 443, y: 482, width: 187, height: 181 }
};

export const DESTINATIONS = Object.freeze([
  { type: 'sun' as const, label: 'EMBER', x: 340, y: 755, color: 0xb8443e },
  { type: 'moon' as const, label: 'MOON', x: 800, y: 755, color: 0x397da8 },
  { type: 'star' as const, label: 'MOSS', x: 1260, y: 755, color: 0x51874c }
]);
