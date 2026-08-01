import Phaser from 'phaser';
import {
  PATROL_TENSION_TREATMENT,
  buildTreatmentState,
  type TreatmentLightState,
  type TreatmentRuntimeOptions,
} from './readabilityTreatment';
import type {GameState, Position} from './simulation';

const MASK_TEXTURE = 'ruin-hall-patrol-tension-mask';
const TILE = 32;
const STAGE_SIZE = 320;
const colorNumber = (hex: string): number => Number.parseInt(hex.slice(1), 16);
const groundPoint = ({x, y}: Position): Readonly<{x: number; y: number}> => ({
  x: (x + .5) * TILE,
  y: (y + .62) * TILE,
});

interface LightView {
  object: Phaser.GameObjects.Image;
  state: TreatmentLightState;
}

export class PatrolTensionRenderer {
  private readonly scene: Phaser.Scene;
  private readonly options: TreatmentRuntimeOptions;
  private readonly ambientTexture: Phaser.Textures.CanvasTexture;
  private readonly ambientImage: Phaser.GameObjects.Image;
  private readonly lights: Record<'player' | 'enemy' | 'key' | 'exit', LightView>;
  private readonly debugGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, state: GameState, options: TreatmentRuntimeOptions) {
    this.scene = scene;
    this.options = options;
    this.buildPatrolWear();
    this.buildForegroundDepth();
    this.ambientTexture = this.createAmbientTexture();
    this.ambientImage = scene.add.image(STAGE_SIZE / 2, STAGE_SIZE / 2, MASK_TEXTURE)
      .setDepth(10.2)
      .setVisible(options.enabled);
    const treatment = buildTreatmentState(state);
    this.lights = {
      player: this.createLight(treatment.playerLight),
      enemy: this.createLight(treatment.enemyLight),
      key: this.createLight(treatment.keyLight),
      exit: this.createLight(treatment.exitLight),
    };
    this.debugGraphics = scene.add.graphics().setDepth(30);
    this.syncState(state);
  }

  private createAmbientTexture(): Phaser.Textures.CanvasTexture {
    if (this.scene.textures.exists(MASK_TEXTURE)) this.scene.textures.remove(MASK_TEXTURE);
    const texture = this.scene.textures.createCanvas(MASK_TEXTURE, STAGE_SIZE, STAGE_SIZE);
    if (!texture) throw new Error('Unable to create Patrol Tension ambient texture.');
    return texture;
  }

  private createLight(state: TreatmentLightState): LightView {
    const textureKey = `ruin-hall-light:${state.id}`;
    if (this.scene.textures.exists(textureKey)) this.scene.textures.remove(textureKey);
    const size = state.radius * 2;
    const texture = this.scene.textures.createCanvas(textureKey, size, size);
    if (!texture) throw new Error(`Unable to create ${state.id} light texture.`);
    const context = texture.context;
    const red = Number.parseInt(state.color.slice(1, 3), 16);
    const green = Number.parseInt(state.color.slice(3, 5), 16);
    const blue = Number.parseInt(state.color.slice(5, 7), 16);
    const gradient = context.createRadialGradient(state.radius, state.radius, 0, state.radius, state.radius, state.radius);
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 1)`);
    gradient.addColorStop(.34, `rgba(${red}, ${green}, ${blue}, .56)`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    texture.refresh();
    const object = this.scene.add.image(state.x, state.y, textureKey)
      .setDepth(10.3)
      .setAlpha(state.alpha)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setVisible(this.options.enabled && state.visible);
    return {object, state};
  }

  private buildPatrolWear(): void {
    const recipe = PATROL_TENSION_TREATMENT.patrolWear;
    const graphics = this.scene.add.graphics().setDepth(3.5).setVisible(this.options.enabled);
    graphics.fillStyle(colorNumber(recipe.color), recipe.alpha);
    graphics.lineStyle(2, colorNumber(recipe.secondaryColor), recipe.alpha * .72);
    recipe.cells.forEach(([cellX, cellY], index) => {
      const x = (cellX + .5) * TILE;
      const y = (cellY + .58) * TILE;
      const turn = index % 2 === 0 ? -1 : 1;
      graphics.fillEllipse(x - 4, y - 2, 5, 9);
      graphics.fillEllipse(x + 4, y + 3, 5, 9);
      graphics.beginPath();
      graphics.moveTo(x - 10, y + turn * 7);
      graphics.lineTo(x + 8, y + turn * 4);
      graphics.strokePath();
    });
  }

  private buildForegroundDepth(): void {
    const recipe = PATROL_TENSION_TREATMENT.foreground;
    const top = recipe.topLintelShadow;
    const east = recipe.eastWallShadow;
    this.scene.add.rectangle(
      top.rect[0] + top.rect[2] / 2,
      top.rect[1] + top.rect[3] / 2,
      top.rect[2],
      top.rect[3],
      0x06080d,
      top.alpha,
    ).setDepth(10.4).setVisible(this.options.enabled);
    this.scene.add.rectangle(
      east.rect[0] + east.rect[2] / 2,
      east.rect[1] + east.rect[3] / 2,
      east.rect[2],
      east.rect[3],
      0x05070b,
      east.alpha,
    ).setDepth(10.4).setVisible(this.options.enabled);
  }

  private renderAmbient(state: GameState): void {
    const treatment = buildTreatmentState(state);
    const context = this.ambientTexture.context;
    context.save();
    context.clearRect(0, 0, STAGE_SIZE, STAGE_SIZE);
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = treatment.ambient.alpha;
    context.fillStyle = treatment.ambient.color;
    context.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'destination-out';
    for (const cutout of treatment.maskCutouts) {
      const gradient = context.createRadialGradient(
        cutout.x, cutout.y, 0,
        cutout.x, cutout.y, cutout.radius,
      );
      const strength = Math.min(.92, .48 + cutout.strength * 1.35);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      gradient.addColorStop(.62, `rgba(0, 0, 0, ${strength * .42})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(
        cutout.x - cutout.radius,
        cutout.y - cutout.radius,
        cutout.radius * 2,
        cutout.radius * 2,
      );
    }
    context.restore();
    this.ambientTexture.refresh();
  }

  private syncLight(view: LightView, next: TreatmentLightState): void {
    view.state = next;
    view.object
      .setPosition(next.x, next.y)
      .setDisplaySize(next.radius * 2, next.radius * 2)
      .setAlpha(next.alpha)
      .setVisible(this.options.enabled && next.visible);
  }

  syncState(state: GameState): void {
    const treatment = buildTreatmentState(state);
    this.renderAmbient(state);
    this.syncLight(this.lights.player, treatment.playerLight);
    this.syncLight(this.lights.enemy, treatment.enemyLight);
    this.syncLight(this.lights.key, treatment.keyLight);
    this.syncLight(this.lights.exit, treatment.exitLight);
    this.drawDebug(state);
  }

  async playTransition(after: GameState, duration: number): Promise<void> {
    if (!this.options.enabled || duration === 0) {
      this.syncState(after);
      return;
    }
    const next = buildTreatmentState(after);
    await Promise.all([
      this.tweenLight(this.lights.player.object, next.playerLight, duration),
      this.tweenLight(this.lights.enemy.object, next.enemyLight, duration),
    ]);
    this.syncState(after);
  }

  private tweenLight(
    object: Phaser.GameObjects.Image,
    next: TreatmentLightState,
    duration: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: object,
        x: next.x,
        y: next.y,
        duration,
        ease: 'Linear',
        onComplete: () => resolve(),
      });
    });
  }

  private drawDebug(state: GameState): void {
    const graphics = this.debugGraphics;
    graphics.clear();
    if (this.options.debug.includes('grid')) {
      graphics.lineStyle(1, 0x8ed8ff, .42);
      for (let i = 0; i <= 10; i += 1) {
        graphics.lineBetween(i * TILE, 0, i * TILE, STAGE_SIZE);
        graphics.lineBetween(0, i * TILE, STAGE_SIZE, i * TILE);
      }
    }
    if (this.options.debug.includes('collision')) {
      graphics.fillStyle(0xff4d6d, .18);
      for (const wall of state.walls) graphics.fillRect(wall.x * TILE, wall.y * TILE, TILE, TILE);
    }
    if (this.options.debug.includes('patrol')) {
      graphics.lineStyle(2, 0xffd166, .82);
      graphics.strokeRoundedRect(7 * TILE + 3, 4 * TILE + 3, 2 * TILE - 6, 2 * TILE - 6, 8);
    }
    if (this.options.debug.includes('anchors')) {
      graphics.lineStyle(2, 0x74f0a7, .9);
      const anchors = [state.player, state.enemy, state.keyPos, state.exitPos];
      for (const anchor of anchors) {
        const point = groundPoint(anchor);
        graphics.lineBetween(point.x - 5, point.y, point.x + 5, point.y);
        graphics.lineBetween(point.x, point.y - 5, point.x, point.y + 5);
      }
    }
  }
}
