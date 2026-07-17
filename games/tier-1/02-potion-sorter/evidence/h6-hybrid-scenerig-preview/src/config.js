export const STAGE = Object.freeze({ width: 1600, height: 900, centerX: 800, centerY: 450 });

export const PERSPECTIVE = Object.freeze({
  vanishingPoint: { x: 800, y: 225 },
  conveyor: {
    farLeft: { x: 700, y: 245 },
    farRight: { x: 900, y: 245 },
    nearLeft: { x: 215, y: 900 },
    nearRight: { x: 1385, y: 900 },
    farWidth: 200,
    nearWidth: 1170,
  },
  queue: [
    { role: 'rear', x: 800, y: 310, scale: 0.34, depth: 27 },
    { role: 'middle', x: 800, y: 430, scale: 0.50, depth: 30 },
  ],
  approach: { x: 800, y: 550, scale: 0.68, depth: 31 },
  aperture: { x: 800, y: 570 },
  branch: { x: 800, y: 680, scale: 0.88 },
});

export const ASSETS = Object.freeze({
  potionSheet: '/assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png',
  timber: '/assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png',
  masonry: '/assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_stone.png',
  iron: '/assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png',
  brass: '/assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg',
  parchment: '/assets/academy/materials/source/h5-100c/opengameart/luke-rustltd-parchment/originals/parchment.png',
});

export const POTION_FRAMES = Object.freeze({
  red: { region: 1, x: 45, y: 29, width: 146, height: 191, tint: 0xef625b },
  blue: { region: 2, x: 271, y: 29, width: 115, height: 191, tint: 0x5ab7ef },
  green: { region: 3, x: 466, y: 29, width: 142, height: 191, tint: 0x75ca78 },
  redSlot: { region: 17, x: 24, y: 482, width: 187, height: 181 },
  blueSlot: { region: 18, x: 234, y: 482, width: 187, height: 181 },
  greenSlot: { region: 19, x: 443, y: 482, width: 187, height: 181 },
});

export const DESTINATIONS = Object.freeze([
  { id: 'red', label: 'EMBER', x: 340, y: 755, color: 0xb8443e, frame: 'redSlot' },
  { id: 'blue', label: 'MOON', x: 800, y: 755, color: 0x397da8, frame: 'blueSlot' },
  { id: 'green', label: 'MOSS', x: 1260, y: 755, color: 0x51874c, frame: 'greenSlot' },
]);

export function queryOptions() {
  const params = new URLSearchParams(location.search);
  const systemReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    state: params.get('state') || 'initial',
    debug: params.get('debug') === '1',
    capture: params.get('capture') === '1',
    autoplay: params.get('autoplay') === '1',
    evidencePacing: params.get('pacing') === 'evidence',
    silhouette: params.get('silhouette') === '1',
    perspective: params.get('perspective') === '1',
    reducedMotion: params.get('motion') === 'reduce' || systemReduced,
  };
}
