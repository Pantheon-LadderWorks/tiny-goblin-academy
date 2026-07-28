import Phaser from 'phaser';
import type { AnchorSnapshot, CanvasLocalRect } from './anchors';
import { CARD_RIG_ANCHOR_IDS } from './card-rig-routes';
import type {
  CardEffectLayer,
  CardEffectTarget,
} from './card-effect-recipes';
import type {
  CardEffectPort,
  CardEffectRunContext,
  EffectResourceCounts,
} from './card-effect-runner';

const DOT_TEXTURE = 'tga-card-effect-dot';
const STAR_TEXTURE = 'tga-card-effect-star';
const PLUS_TEXTURE = 'tga-card-effect-plus';
const SLASH_TEXTURE = 'tga-card-effect-slash';
const BONK_TEXTURE = 'tga-card-effect-bonk';
export const CARD_EFFECT_TOKEN_SHEET_TEXTURE = 'tga-card-effect-token-sheet';

export type PhaserCardEffectPortOptions = Readonly<{
  scene: Phaser.Scene;
  snapshot: () => AnchorSnapshot;
  cardElement?: () => HTMLElement | undefined;
  onLayer?: (layer: CardEffectLayer) => void;
  onCleanup?: (reason: string, counts: EffectResourceCounts) => void;
}>;

type FilterEntry = Readonly<{
  host: Phaser.GameObjects.Rectangle;
  controller: Phaser.Filters.Controller;
}>;

const blendMode = (mode: CardEffectLayer['blendMode']): number => {
  if (mode === 'add') return Phaser.BlendModes.ADD;
  if (mode === 'screen') return Phaser.BlendModes.SCREEN;
  return Phaser.BlendModes.NORMAL;
};

const numberParam = (
  layer: CardEffectLayer,
  key: string,
  fallback: number,
): number => {
  const value = layer.parameters?.[key];
  return typeof value === 'number' ? value : fallback;
};

const boolParam = (
  layer: CardEffectLayer,
  key: string,
  fallback = false,
): boolean => {
  const value = layer.parameters?.[key];
  return typeof value === 'boolean' ? value : fallback;
};

const abortError = (): Error => {
  const error = new Error('Phaser effect layer cancelled');
  error.name = 'AbortError';
  return error;
};

export class PhaserCardEffectPort implements CardEffectPort {
  private readonly scene: Phaser.Scene;
  private readonly snapshotProvider: () => AnchorSnapshot;
  private readonly cardElementProvider?: PhaserCardEffectPortOptions['cardElement'];
  private readonly onLayer?: PhaserCardEffectPortOptions['onLayer'];
  private readonly onCleanup?: PhaserCardEffectPortOptions['onCleanup'];
  private readonly objects = new Set<Phaser.GameObjects.GameObject>();
  private readonly emitters = new Set<Phaser.GameObjects.Particles.ParticleEmitter>();
  private readonly masks = new Set<Phaser.Display.Masks.GeometryMask>();
  private readonly filters = new Set<FilterEntry>();
  private listenerCount = 0;
  private readonly domEffects = new Set<HTMLElement>();

  constructor(options: PhaserCardEffectPortOptions) {
    this.scene = options.scene;
    this.snapshotProvider = options.snapshot;
    this.cardElementProvider = options.cardElement;
    this.onLayer = options.onLayer;
    this.onCleanup = options.onCleanup;
    this.ensureTextures();
  }

  private ensureTextures(): void {
    if (!this.scene.textures.exists(DOT_TEXTURE)) {
      const dot = this.scene.add.graphics();
      dot.fillStyle(0xffffff, 1);
      dot.fillCircle(8, 8, 7);
      dot.generateTexture(DOT_TEXTURE, 16, 16);
      dot.destroy();
    }
    if (!this.scene.textures.exists(STAR_TEXTURE)) {
      const star = this.scene.add.graphics();
      star.fillStyle(0xffffff, 1);
      star.fillPoints(this.starPoints(16, 16, 5, 5, 14), true);
      star.generateTexture(STAR_TEXTURE, 32, 32);
      star.destroy();
    }
    if (!this.scene.textures.exists(PLUS_TEXTURE)) {
      const plus = this.scene.add.graphics();
      plus.fillStyle(0xffffff, 1);
      plus.fillRoundedRect(10, 1, 10, 28, 4);
      plus.fillRoundedRect(1, 10, 28, 10, 4);
      plus.generateTexture(PLUS_TEXTURE, 30, 30);
      plus.destroy();
    }
    if (!this.scene.textures.exists(SLASH_TEXTURE)) {
      const slash = this.scene.add.graphics();
      slash.fillStyle(0xffffff, 1);
      slash.fillTriangle(2, 15, 62, 2, 54, 13);
      slash.fillStyle(0xffffff, 0.46);
      slash.fillTriangle(5, 19, 52, 13, 38, 20);
      slash.generateTexture(SLASH_TEXTURE, 64, 22);
      slash.destroy();
    }
    if (!this.scene.textures.exists(BONK_TEXTURE)) {
      const sheet = this.scene.textures.get(CARD_EFFECT_TOKEN_SHEET_TEXTURE).getSourceImage() as HTMLImageElement;
      const bonk = this.scene.textures.createCanvas(BONK_TEXTURE, 124, 124);
      if (!bonk) throw new Error('Unable to create Heavy Bonk effect texture');
      bonk.context.clearRect(0, 0, 124, 124);
      bonk.context.drawImage(sheet, 514, 2, 124, 124, 0, 0, 124, 124);
      bonk.refresh();
    }
  }

  private starPoints(
    centerX: number,
    centerY: number,
    points: number,
    innerRadius: number,
    outerRadius: number,
  ): Phaser.Math.Vector2[] {
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
  }

  private point(target: CardEffectTarget): CanvasLocalRect {
    if (target === 'card-local' || target === 'travel') {
      const element = this.cardElementProvider?.();
      if (element) {
        const card = element.getBoundingClientRect();
        const canvas = this.scene.game.canvas.getBoundingClientRect();
        const scaleX = this.scene.scale.width / Math.max(1, canvas.width);
        const scaleY = this.scene.scale.height / Math.max(1, canvas.height);
        return {
          x: (card.x - canvas.x) * scaleX,
          y: (card.y - canvas.y) * scaleY,
          width: card.width * scaleX,
          height: card.height * scaleY,
          centerX: (card.x - canvas.x + card.width / 2) * scaleX,
          centerY: (card.y - canvas.y + card.height / 2) * scaleY,
        };
      }
    }
    const snapshot = this.snapshotProvider();
    const candidates: Record<CardEffectTarget, readonly string[]> = {
      'card-local': [CARD_RIG_ANCHOR_IDS.playedCardTarget],
      'draw-pile-local': [CARD_RIG_ANCHOR_IDS.playerDrawOrigin],
      'discard-pile-local': [CARD_RIG_ANCHOR_IDS.playerDiscardTarget],
      'enemy-target': ['enemy-impact', 'enemy-center'],
      'player-target': ['player-impact', 'player-center'],
      travel: [CARD_RIG_ANCHOR_IDS.playedCardTarget],
      'tabletop-local': [CARD_RIG_ANCHOR_IDS.playedCardTarget],
    };
    for (const id of candidates[target]) {
      const anchor = snapshot[id];
      if (anchor) return anchor;
    }
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    return {
      x: width / 2 - 20,
      y: height / 2 - 20,
      width: 40,
      height: 40,
      centerX: width / 2,
      centerY: height / 2,
    };
  }

  private track<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.objects.add(object);
    object.once(Phaser.GameObjects.Events.DESTROY, () => this.objects.delete(object));
    return object;
  }

  private destroyObject(object: Phaser.GameObjects.GameObject): void {
    if (object.active) {
      this.scene.tweens.killTweensOf(object);
      object.destroy();
    }
    this.objects.delete(object);
  }

  private tween(
    target: Phaser.GameObjects.GameObject,
    properties: Record<string, unknown>,
    durationMs: number,
    signal: AbortSignal,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(abortError());
        return;
      }
      let settled = false;
      const settle = (callback: () => void): void => {
        if (settled) return;
        settled = true;
        signal.removeEventListener('abort', abort);
        this.listenerCount = Math.max(0, this.listenerCount - 1);
        callback();
      };
      const abort = (): void => {
        this.scene.tweens.killTweensOf(target);
        settle(() => reject(abortError()));
      };
      this.listenerCount += 1;
      signal.addEventListener('abort', abort, { once: true });
      this.scene.tweens.add({
        ...properties,
        targets: target,
        duration: durationMs,
        ease: 'Sine.easeInOut',
        onComplete: () => settle(resolve),
      } as Phaser.Types.Tweens.TweenBuilderConfig);
    });
  }

  private createEmitter(
    x: number,
    y: number,
    layer: CardEffectLayer,
    texture = DOT_TEXTURE,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    const particleScale = numberParam(layer, 'particleScale', 0.8);
    const emitter = this.scene.add.particles(x, y, texture, {
      emitting: false,
      lifespan: { min: Math.max(160, layer.durationMs * 0.45), max: layer.durationMs },
      speed: {
        min: numberParam(layer, 'minSpeed', 18),
        max: numberParam(layer, 'maxSpeed', 72),
      },
      scale: { start: particleScale, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: layer.owner === 'guard' || layer.owner === 'stun'
        ? [0x7be9e0, 0xffd46b]
        : [0xffffff, 0xffd46b, 0xf09a66],
      blendMode: blendMode(layer.blendMode),
    }).setDepth(720);
    this.emitters.add(emitter);
    emitter.once(Phaser.GameObjects.Events.DESTROY, () => this.emitters.delete(emitter));
    return emitter;
  }

  private destroyEmitter(emitter: Phaser.GameObjects.Particles.ParticleEmitter): void {
    if (!emitter.active) return;
    this.scene.tweens.killTweensOf(emitter);
    emitter.destroy();
    this.emitters.delete(emitter);
  }

  private cardRect(color: number, alpha = 0.12): Phaser.GameObjects.Rectangle {
    const card = this.point('card-local');
    return this.track(
      this.scene.add.rectangle(
        card.centerX,
        card.centerY,
        Math.max(82, card.width * 0.9),
        Math.max(116, card.height * 0.9),
        color,
        alpha,
      ).setStrokeStyle(3, color, 0.9).setDepth(700),
    );
  }

  private async cardPulse(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
    includeGlow: boolean,
  ): Promise<void> {
    const mount = this.cardElementProvider?.()?.querySelector<HTMLElement>('.card-local-fx');
    if (mount) {
      mount.style.setProperty('--card-rig-fx-color', `#${context.recipe.color.toString(16).padStart(6, '0')}`);
      mount.style.setProperty('--card-rig-fx-duration', `${layer.durationMs}ms`);
      mount.classList.add(includeGlow ? 'card-rig-fx-charge' : 'card-rig-fx-surface-prep');
      this.domEffects.add(mount);
      await context.clock.wait(layer.durationMs, context.signal);
      mount.classList.remove('card-rig-fx-charge', 'card-rig-fx-surface-prep');
      mount.style.removeProperty('--card-rig-fx-color');
      mount.style.removeProperty('--card-rig-fx-duration');
      this.domEffects.delete(mount);
      return;
    }
    const shape = this.cardRect(context.recipe.color, layer.kind === 'surface-prep' ? 0.16 : 0.04)
      .setBlendMode(blendMode(layer.blendMode))
      .setAlpha(0.18)
      .setScale(0.96);
    if (includeGlow && shape.filters) {
      const controller = shape.filters.external.addGlow(context.recipe.color, 5, 1, 1, false, 6, 8);
      this.filters.add({ host: shape, controller });
    }
    await this.tween(shape, {
      alpha: { from: 0.18, to: 0.92 },
      scaleX: { from: 0.96, to: numberParam(layer, 'scale', 1.05) },
      scaleY: { from: 0.96, to: numberParam(layer, 'scale', 1.05) },
      yoyo: true,
    }, layer.durationMs / 2, context.signal);
    this.destroyObject(shape);
  }

  private async shineSweep(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const mount = this.cardElementProvider?.()?.querySelector<HTMLElement>('.card-local-fx');
    if (mount) {
      mount.style.setProperty('--card-rig-fx-color', `#${context.recipe.color.toString(16).padStart(6, '0')}`);
      mount.style.setProperty('--card-rig-fx-duration', `${layer.durationMs}ms`);
      mount.classList.add('card-rig-fx-shine');
      this.domEffects.add(mount);
      await context.clock.wait(layer.durationMs, context.signal);
      mount.classList.remove('card-rig-fx-shine');
      mount.style.removeProperty('--card-rig-fx-color');
      mount.style.removeProperty('--card-rig-fx-duration');
      this.domEffects.delete(mount);
      return;
    }
    const card = this.point('card-local');
    const width = Math.max(82, card.width * 0.9);
    const height = Math.max(116, card.height * 0.9);
    const maskShape = this.track(
      this.scene.add.graphics().fillStyle(0xffffff, 1)
        .fillRoundedRect(card.centerX - width / 2, card.centerY - height / 2, width, height, 12)
        .setVisible(false),
    );
    const mask = maskShape.createGeometryMask();
    this.masks.add(mask);
    const flare = this.track(
      this.scene.add.rectangle(card.centerX - width, card.centerY, 11, height * 1.35, context.recipe.color, 0.34)
        .setRotation(-0.35)
        .setBlendMode(blendMode(layer.blendMode))
        .setMask(mask)
        .setDepth(710),
    );
    await this.tween(flare, { x: card.centerX + width }, layer.durationMs, context.signal);
    flare.clearMask();
    mask.destroy();
    this.masks.delete(mask);
    this.destroyObject(maskShape);
    this.destroyObject(flare);
  }

  private async travel(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
    trailing: boolean,
  ): Promise<void> {
    const reverse = boolParam(layer, 'reverse');
    const declaredSource = layer.parameters?.source;
    const sourceTarget = typeof declaredSource === 'string'
      ? declaredSource as CardEffectTarget
      : reverse ? layer.target : 'card-local';
    const source = this.point(sourceTarget);
    const destination = this.point(reverse ? 'card-local' : layer.target);
    const shape = trailing
      ? this.track(this.scene.add.rectangle(source.centerX, source.centerY, 1, 1, context.recipe.color, 0))
      : layer.parameters?.shape === 'star'
        ? this.track(this.scene.add.image(source.centerX, source.centerY, STAR_TEXTURE))
        : this.track(this.scene.add.image(source.centerX, source.centerY, SLASH_TEXTURE));
    if (shape instanceof Phaser.GameObjects.Image) shape.setTint(context.recipe.color);
    const travelAngle = Phaser.Math.Angle.Between(
      source.centerX,
      source.centerY,
      destination.centerX,
      destination.centerY,
    );
    if (shape instanceof Phaser.GameObjects.Image && layer.parameters?.shape !== 'star') {
      shape.setRotation(travelAngle).setScale(0.78);
    }
    shape.setBlendMode(blendMode(layer.blendMode)).setDepth(730);

    let emitter: Phaser.GameObjects.Particles.ParticleEmitter | undefined;
    if (trailing) {
      // A following emitter inherits the followed object's world position. Keep
      // the emitter local or the source coordinate is applied twice.
      emitter = this.createEmitter(0, 0, layer);
      emitter.startFollow(shape);
      emitter.start();
    }

    await this.tween(shape, {
      x: destination.centerX,
      y: destination.centerY,
      rotation: shape.rotation + Math.PI * 0.7,
      scaleX: { from: 0.8, to: 1.18 },
      scaleY: { from: 0.8, to: 1.18 },
    }, layer.durationMs, context.signal);

    if (emitter) {
      emitter.stop();
      await context.clock.wait(Math.min(180, layer.durationMs / 3), context.signal);
      this.destroyEmitter(emitter);
    }
    this.destroyObject(shape);
  }

  private async burst(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
    texture = DOT_TEXTURE,
  ): Promise<void> {
    const target = this.point(layer.target);
    const emitter = this.createEmitter(target.centerX, target.centerY, layer, texture);
    const count = Math.round(numberParam(layer, 'count', 12));
    emitter.explode(count, 0, 0);
    let impact: HTMLElement | undefined;
    if (layer.owner === 'heavy-bonk' && layer.kind === 'dust-burst') {
      const host = this.scene.game.canvas.parentElement;
      if (host) {
        impact = document.createElement('span');
        impact.className = 'card-effect-transient heavy-impact-mark';
        impact.style.left = `${(target.centerX / this.scene.scale.width) * 100}%`;
        impact.style.top = `${((target.centerY + 12) / this.scene.scale.height) * 100}%`;
        impact.style.setProperty('--heavy-impact-color', `#${context.recipe.color.toString(16).padStart(6, '0')}`);
        impact.style.setProperty('--heavy-impact-duration', `${layer.durationMs}ms`);
        host.append(impact);
        this.domEffects.add(impact);
      }
    }
    await context.clock.wait(layer.durationMs, context.signal);
    this.destroyEmitter(emitter);
    if (impact) {
      impact.remove();
      this.domEffects.delete(impact);
    }
  }

  private async ring(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const circle = this.track(
      this.scene.add.circle(target.centerX, target.centerY, 26, context.recipe.color, 0.04)
        .setStrokeStyle(4, context.recipe.color, 0.9)
        .setBlendMode(blendMode(layer.blendMode))
        .setDepth(715)
        .setScale(0.5),
    );
    await this.tween(circle, {
      scale: numberParam(layer, 'maxScale', 1.55),
      alpha: { from: 0.92, to: 0 },
    }, layer.durationMs, context.signal);
    this.destroyObject(circle);
  }

  private async targetPulse(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const shape = this.track(
      this.scene.add.ellipse(
        target.centerX,
        target.centerY,
        Math.max(48, target.width * 0.8),
        Math.max(38, target.height * 0.55),
        context.recipe.color,
        0.16,
      ).setStrokeStyle(3, context.recipe.color, 0.86)
        .setBlendMode(blendMode(layer.blendMode))
        .setDepth(712),
    );
    await this.tween(shape, {
      scale: { from: 0.82, to: numberParam(layer, 'scale', 1.12) },
      alpha: { from: 0.88, to: 0.12 },
      yoyo: true,
    }, layer.durationMs / 2, context.signal);
    this.destroyObject(shape);
  }

  private async shieldPulse(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const shield = this.track(
      this.scene.add.graphics()
        .setPosition(target.centerX, target.centerY + 24)
        .setDepth(725),
    );
    shield.fillStyle(context.recipe.color, 0.18);
    shield.lineStyle(4, context.recipe.color, 0.92);
    shield.beginPath();
    shield.moveTo(0, -44);
    shield.lineTo(38, -24);
    shield.lineTo(28, 30);
    shield.lineTo(0, 52);
    shield.lineTo(-28, 30);
    shield.lineTo(-38, -24);
    shield.closePath();
    shield.fillPath();
    shield.strokePath();
    shield.setBlendMode(blendMode(layer.blendMode)).setScale(0.7).setAlpha(0.25);
    await this.tween(shield, {
      scale: { from: 0.7, to: 1.04 },
      alpha: { from: 0.25, to: 0.96 },
      y: { from: target.centerY + 24, to: target.centerY },
      yoyo: true,
    }, layer.durationMs / 2, context.signal);
    this.destroyObject(shield);
  }

  private async orbit(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const count = Math.round(numberParam(layer, 'count', 7));
    const stars: Phaser.GameObjects.Image[] = [];
    const container = this.track(this.scene.add.container(target.centerX, target.centerY).setDepth(728));
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const star = this.scene.add.image(Math.cos(angle) * 48, Math.sin(angle) * 26, STAR_TEXTURE)
        .setTint(index % 2 === 0 ? context.recipe.color : 0xffd46b)
        .setScale(0.42)
        .setBlendMode(blendMode(layer.blendMode));
      stars.push(star);
      this.objects.add(star);
      container.add(star);
    }
    await this.tween(container, {
      rotation: Math.PI * 2 * numberParam(layer, 'turns', 1),
      alpha: { from: 0.25, to: 1 },
      yoyo: true,
    }, layer.durationMs / 2, context.signal);
    this.destroyObject(container);
    for (const star of stars) this.objects.delete(star);
  }

  private async healingRise(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const displacement = numberParam(layer, 'displacement', 72);
    const count = Math.round(numberParam(layer, 'count', 8));
    const pluses = Array.from({ length: count }, (_, index) => {
      const lane = index - (count - 1) / 2;
      return this.track(
        this.scene.add.image(
          target.centerX + lane * 9,
          target.centerY + 30 + (index % 2) * 7,
          PLUS_TEXTURE,
        )
          .setTint(index % 3 === 0 ? 0xffffff : context.recipe.color)
          .setBlendMode(blendMode(layer.blendMode))
          .setDepth(726)
          .setAlpha(0.16)
          .setScale(0.58 + (index % 3) * 0.08),
      );
    });
    await Promise.all(pluses.map(async (plus, index) => {
      const delay = Math.round((layer.durationMs * 0.32 * index) / Math.max(1, count - 1));
      if (delay > 0) await context.clock.wait(delay, context.signal);
      await this.tween(plus, {
        x: plus.x + ((index % 3) - 1) * 16,
        y: plus.y - displacement * (0.78 + (index % 4) * 0.08),
        alpha: { from: 0.16, to: 0.98 },
        scale: { from: plus.scaleX, to: plus.scaleX * 1.26 },
        yoyo: true,
      }, Math.max(140, layer.durationMs - delay), context.signal);
    }));
    for (const plus of pluses) this.destroyObject(plus);
  }

  private async maskedParticles(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const card = this.point('card-local');
    const width = Math.max(82, card.width * 0.9);
    const height = Math.max(116, card.height * 0.9);
    const maskShape = this.track(this.scene.add.graphics().setVisible(false));
    maskShape.fillStyle(0xffffff, 1);
    maskShape.fillRoundedRect(card.centerX - width / 2, card.centerY - height / 2, width, height, 12);
    const mask = maskShape.createGeometryMask();
    this.masks.add(mask);
    const emitter = this.createEmitter(card.centerX, card.centerY, layer, STAR_TEXTURE);
    emitter.setMask(mask);
    emitter.explode(Math.round(numberParam(layer, 'count', 7)), 0, 0);
    await context.clock.wait(layer.durationMs, context.signal);
    emitter.clearMask();
    this.destroyEmitter(emitter);
    mask.destroy();
    this.masks.delete(mask);
    this.destroyObject(maskShape);
  }

  private async downwardImpact(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const drop = numberParam(layer, 'drop', 88);
    const bonk = this.track(
      this.scene.add.image(target.centerX, target.centerY - drop, BONK_TEXTURE)
        .setBlendMode(blendMode(layer.blendMode))
        .setDepth(735)
        .setRotation(-0.16)
        .setScale(0.72),
    );
    await this.tween(bonk, {
      y: target.centerY,
      rotation: { from: -0.16, to: 0.08 },
      scaleX: { from: 0.72, to: 0.94 },
      scaleY: { from: 0.72, to: 0.62 },
    }, layer.durationMs, context.signal);
    this.destroyObject(bonk);
  }

  private async renderTextureStamp(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const renderTexture = this.track(
      this.scene.add.renderTexture(target.centerX, target.centerY, 96, 96)
        .setOrigin(0.5)
        .setBlendMode(blendMode(layer.blendMode))
        .setDepth(720),
    );
    renderTexture.draw(STAR_TEXTURE, 32, 32, 1, context.recipe.color);
    await this.tween(renderTexture, {
      rotation: Math.PI * 0.5,
      scale: { from: 0.5, to: 1.15 },
      alpha: { from: 0.9, to: 0 },
    }, layer.durationMs, context.signal);
    this.destroyObject(renderTexture);
  }

  private async rimTrace(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const mount = this.cardElementProvider?.()?.querySelector<HTMLElement>('.card-local-fx');
    if (!mount) {
      await this.cardPulse(layer, context, true);
      return;
    }
    mount.style.setProperty('--card-rig-fx-color', `#${context.recipe.color.toString(16).padStart(6, '0')}`);
    mount.style.setProperty('--card-rig-fx-duration', `${layer.durationMs}ms`);
    mount.classList.add('card-rig-fx-rim-trace');
    this.domEffects.add(mount);
    await context.clock.wait(layer.durationMs, context.signal);
    mount.classList.remove('card-rig-fx-rim-trace');
    mount.style.removeProperty('--card-rig-fx-color');
    mount.style.removeProperty('--card-rig-fx-duration');
    this.domEffects.delete(mount);
  }

  private async pileResponse(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point(layer.target);
    const width = Math.max(48, target.width * 0.68);
    const height = Math.max(58, target.height * 0.68);
    const shape = this.track(
      this.scene.add.graphics()
        .setPosition(target.centerX, target.centerY + 4)
        .setBlendMode(blendMode(layer.blendMode))
        .setDepth(716),
    );
    shape.fillStyle(context.recipe.color, 0.08);
    shape.fillCircle(0, 0, Math.max(width, height) * 0.58);
    shape.lineStyle(3, context.recipe.color, 0.82);
    shape.strokeRoundedRect(-width / 2, -height / 2, width, height, 9);
    shape.lineStyle(2, context.recipe.color, 0.5);
    shape.strokeRoundedRect(-width / 2 + 5, -height / 2 - 5, width, height, 9);
    await this.tween(shape, {
      scale: { from: 0.94, to: numberParam(layer, 'scale', 1.1) },
      alpha: { from: 0.76, to: 0 },
      y: { from: target.centerY + 4, to: target.centerY - 5 },
    }, layer.durationMs, context.signal);
    this.destroyObject(shape);
  }

  private async drawSkipCue(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const target = this.point('draw-pile-local');
    const cue = this.track(
      this.scene.add.text(target.centerX, target.centerY, '✕', {
        fontFamily: 'Georgia, serif',
        fontSize: '58px',
        fontStyle: 'bold',
        color: '#ff6f61',
        stroke: '#35131a',
        strokeThickness: 8,
      }).setOrigin(0.5)
        .setDepth(744)
        .setAlpha(0.1)
        .setScale(0.62),
    );
    await this.tween(cue, {
      alpha: { from: 0.1, to: 1 },
      scale: { from: 0.62, to: 1.08 },
      yoyo: true,
    }, layer.durationMs / 2, context.signal);
    this.destroyObject(cue);
  }

  private async terminalAccent(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
    victory: boolean,
  ): Promise<void> {
    if (victory) {
      await this.ring({ ...layer, kind: 'shockwave-ring', parameters: { maxScale: 1.75 } }, context);
      return;
    }
    await this.targetPulse({ ...layer, kind: 'target-pulse', parameters: { scale: 0.96 } }, context);
  }

  private async stageResponse(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    const camera = this.scene.cameras.main;
    if (boolParam(layer, 'flash')) {
      camera.flash(layer.durationMs, 255, 220, 150, false);
    } else if (boolParam(layer, 'dim')) {
      camera.fade(layer.durationMs / 2, 30, 16, 38, false);
    } else {
      camera.shake(layer.durationMs, numberParam(layer, 'intensity', 0.004), false);
    }
    await context.clock.wait(layer.durationMs, context.signal);
    camera.resetFX();
  }

  prepare(_context: CardEffectRunContext): void {
    this.scene.cameras.main.resetFX();
  }

  async runLayer(
    layer: CardEffectLayer,
    context: CardEffectRunContext,
  ): Promise<void> {
    this.onLayer?.(layer);
    switch (layer.kind) {
      case 'surface-prep':
        await this.cardPulse(layer, context, false);
        return;
      case 'rim-glow':
        await this.cardPulse(layer, context, true);
        return;
      case 'rim-trace':
        await this.rimTrace(layer, context);
        return;
      case 'shine-sweep':
        await this.shineSweep(layer, context);
        return;
      case 'projectile':
        await this.travel(layer, context, false);
        return;
      case 'trail-emitter':
        await this.travel(layer, context, true);
        return;
      case 'impact-burst':
        await this.burst(layer, context, STAR_TEXTURE);
        return;
      case 'dust-burst':
        await this.burst(layer, context, DOT_TEXTURE);
        return;
      case 'shockwave-ring':
        await this.ring(layer, context);
        return;
      case 'orbiting-motes':
        await this.orbit(layer, context);
        return;
      case 'masked-card-particles':
        await this.maskedParticles(layer, context);
        return;
      case 'shield-pulse':
        await this.shieldPulse(layer, context);
        return;
      case 'healing-rise':
        await this.healingRise(layer, context);
        return;
      case 'downward-impact':
        await this.downwardImpact(layer, context);
        return;
      case 'target-pulse':
        await this.targetPulse(layer, context);
        return;
      case 'stage-response':
        await this.stageResponse(layer, context);
        return;
      case 'render-texture-stamp':
        await this.renderTextureStamp(layer, context);
        return;
      case 'pile-response':
        await this.pileResponse(layer, context);
        return;
      case 'draw-skip-cue':
        await this.drawSkipCue(layer, context);
        return;
      case 'victory-accent':
        await this.terminalAccent(layer, context, true);
        return;
      case 'defeat-accent':
        await this.terminalAccent(layer, context, false);
        return;
    }
  }

  finish(_context: CardEffectRunContext): void {
    this.scene.cameras.main.resetFX();
  }

  cleanup(reason: string, _context: CardEffectRunContext): void {
    this.scene.cameras.main.resetFX();
    for (const entry of [...this.filters]) {
      entry.host.filters?.external.remove(entry.controller, true);
      this.filters.delete(entry);
    }
    for (const emitter of [...this.emitters]) this.destroyEmitter(emitter);
    for (const mask of [...this.masks]) {
      mask.destroy();
      this.masks.delete(mask);
    }
    for (const object of [...this.objects]) this.destroyObject(object);
    for (const mount of [...this.domEffects]) {
      if (mount.classList.contains('card-effect-transient')) mount.remove();
      mount.classList.remove('card-rig-fx-rim-trace', 'card-rig-fx-charge', 'card-rig-fx-surface-prep', 'card-rig-fx-shine');
      mount.style.removeProperty('--card-rig-fx-color');
      mount.style.removeProperty('--card-rig-fx-duration');
      this.domEffects.delete(mount);
    }
    this.listenerCount = 0;
    this.onCleanup?.(reason, this.counts());
  }

  counts(): EffectResourceCounts {
    return Object.freeze({
      emitters: this.emitters.size,
      temporaryObjects: this.objects.size,
      masks: this.masks.size,
      fx: this.filters.size,
      listeners: this.listenerCount,
    });
  }
}
