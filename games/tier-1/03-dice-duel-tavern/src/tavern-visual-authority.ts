export interface MappedDiceDuelRegion {
  id: string;
  x: number;
  y: number;
  width: 126;
  height: 126;
}

export const DICE_DUEL_SHEET_URL = new URL(
  '../../../../assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png',
  import.meta.url,
).href;

export const TAVERN_MATERIAL_URLS = Object.freeze({
  structuralTimber: new URL(
    '../../../../assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png',
    import.meta.url,
  ).href,
  heroTableWood: new URL(
    '../../../../assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/wooden.png',
    import.meta.url,
  ).href,
  paintedIron: new URL(
    '../../../../assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png',
    import.meta.url,
  ).href,
  focalBrass: new URL(
    '../../../../assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg',
    import.meta.url,
  ).href,
});

export const PROMOTED_REGIONS = Object.freeze({
  attack: { id: 'dice-duel-tavern.duel-token.sword-token-red', x: 129, y: 385, width: 126, height: 126 },
  heal: { id: 'dice-duel-tavern.duel-token.heal-token-green', x: 513, y: 385, width: 126, height: 126 },
  block: { id: 'dice-duel-tavern.duel-token.shield-token-teal-gold', x: 1, y: 385, width: 126, height: 126 },
  playerCup: { id: 'dice-duel-tavern.tavern-prop.dice-cup-a', x: 257, y: 129, width: 126, height: 126 },
  opponentMug: { id: 'dice-duel-tavern.tavern-prop.tavern-mug', x: 1, y: 641, width: 126, height: 126 },
  wagerCoins: { id: 'dice-duel-tavern.reward-token.coin-stacks', x: 257, y: 641, width: 126, height: 126 },
  candle: { id: 'dice-duel-tavern.tavern-prop.candle-lit', x: 129, y: 641, width: 126, height: 126 },
} satisfies Record<string, MappedDiceDuelRegion>);

export const PROMOTED_REGION_IDS = Object.freeze(
  Object.values(PROMOTED_REGIONS).map((region) => region.id),
);

export const REJECTED_REGION_IDS = Object.freeze([
  'dice-duel-tavern.dice-token.glowing-die',
  'dice-duel-tavern.dice-token.paired-dice',
  'dice-duel-tavern.roll-effect.rolling-die-left',
  'dice-duel-tavern.roll-effect.tumbling-die-shadow',
  'dice-duel-tavern.roll-effect.tilted-die-glow',
  'dice-duel-tavern.roll-effect.rolling-die-small',
  'dice-duel-tavern.dice-token.dice-cluster',
  'dice-duel-tavern.feedback-icon.sparkle-large-a',
  'dice-duel-tavern.feedback-icon.sparkle-large-b',
  'dice-duel-tavern.feedback-icon.sparkle-small-a',
  'dice-duel-tavern.feedback-icon.sparkle-small-b',
  'dice-duel-tavern.roll-effect.dust-puff-a',
  'dice-duel-tavern.roll-effect.dust-puff-b',
  'dice-duel-tavern.roll-effect.dust-puff-c',
  'dice-duel-tavern.roll-effect.spiral-effect-a',
  'dice-duel-tavern.roll-effect.spiral-effect-b',
  'dice-duel-tavern.feedback-icon.burst-effect-a',
  'dice-duel-tavern.feedback-icon.burst-effect-b',
  'dice-duel-tavern.roll-effect.smoke-wisps',
]);

export const REJECTED_PROP_DECISIONS = Object.freeze([
  { id: 'dice-duel-tavern.background-prop.hanging-sign', reason: 'Too small for the existing hero tavern sign and redundant with its readable live lettering.' },
  { id: 'dice-duel-tavern.background-prop.wood-table-corner', reason: 'Would compete with the approved perspective table geometry.' },
  { id: 'dice-duel-tavern.tavern-prop.food-plate', reason: 'Adds clutter beside the protected die path without clarifying either station.' },
  { id: 'dice-duel-tavern.reward-token.coin-pouch', reason: 'Duplicates the clearer coin-stack wager identity.' },
]);

export function renderMappedRegion(region: MappedDiceDuelRegion, className: string): string {
  return `<svg class="mapped-region ${className}" viewBox="${region.x} ${region.y} ${region.width} ${region.height}" aria-hidden="true" focusable="false" data-region-id="${region.id}"><image href="${DICE_DUEL_SHEET_URL}" x="0" y="0" width="1024" height="1024"></image></svg>`;
}

export function bindTavernMaterialVariables(root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--tavern-material-timber', `url("${TAVERN_MATERIAL_URLS.structuralTimber}")`);
  root.style.setProperty('--tavern-material-table', `url("${TAVERN_MATERIAL_URLS.heroTableWood}")`);
  root.style.setProperty('--tavern-material-iron', `url("${TAVERN_MATERIAL_URLS.paintedIron}")`);
  root.style.setProperty('--tavern-material-brass', `url("${TAVERN_MATERIAL_URLS.focalBrass}")`);
}
