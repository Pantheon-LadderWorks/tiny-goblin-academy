import Phaser from 'phaser';

export const CARD_EFFECT_TEXTURES = Object.freeze({
  dot: 'tga-card-effect-dot',
  star: 'tga-card-effect-star',
  plus: 'tga-card-effect-plus',
  slash: 'tga-card-effect-slash',
  bonk: 'tga-card-effect-bonk',
});

export const CARD_EFFECT_TOKEN_SHEET_TEXTURE = 'tga-card-effect-token-sheet';

const starPoints = (
  centerX: number,
  centerY: number,
  points: number,
  innerRadius: number,
  outerRadius: number,
): Phaser.Math.Vector2[] => {
  const result: Phaser.Math.Vector2[] = [];
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (Math.PI * index) / points;
    result.push(new Phaser.Math.Vector2(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
    ));
  }
  return result;
};

export const ensureCardEffectTextures = (scene: Phaser.Scene): void => {
  if (!scene.textures.exists(CARD_EFFECT_TEXTURES.dot)) {
    const dot = scene.add.graphics();
    dot.fillStyle(0xffffff, 1);
    dot.fillCircle(8, 8, 7);
    dot.generateTexture(CARD_EFFECT_TEXTURES.dot, 16, 16);
    dot.destroy();
  }
  if (!scene.textures.exists(CARD_EFFECT_TEXTURES.star)) {
    const star = scene.add.graphics();
    star.fillStyle(0xffffff, 1);
    star.fillPoints(starPoints(16, 16, 5, 5, 14), true);
    star.generateTexture(CARD_EFFECT_TEXTURES.star, 32, 32);
    star.destroy();
  }
  if (!scene.textures.exists(CARD_EFFECT_TEXTURES.plus)) {
    const plus = scene.add.graphics();
    plus.fillStyle(0xffffff, 1);
    plus.fillRoundedRect(10, 1, 10, 28, 4);
    plus.fillRoundedRect(1, 10, 28, 10, 4);
    plus.generateTexture(CARD_EFFECT_TEXTURES.plus, 30, 30);
    plus.destroy();
  }
  if (!scene.textures.exists(CARD_EFFECT_TEXTURES.slash)) {
    const slash = scene.add.graphics();
    slash.fillStyle(0xffffff, 1);
    slash.fillTriangle(2, 15, 62, 2, 54, 13);
    slash.fillStyle(0xffffff, 0.46);
    slash.fillTriangle(5, 19, 52, 13, 38, 20);
    slash.generateTexture(CARD_EFFECT_TEXTURES.slash, 64, 22);
    slash.destroy();
  }
  if (!scene.textures.exists(CARD_EFFECT_TEXTURES.bonk)) {
    const sheet = scene.textures.get(CARD_EFFECT_TOKEN_SHEET_TEXTURE).getSourceImage() as HTMLImageElement;
    const bonk = scene.textures.createCanvas(CARD_EFFECT_TEXTURES.bonk, 124, 124);
    if (!bonk) throw new Error('Unable to create Heavy Bonk effect texture');
    bonk.context.clearRect(0, 0, 124, 124);
    bonk.context.drawImage(sheet, 514, 2, 124, 124, 0, 0, 124, 124);
    bonk.refresh();
  }
};
