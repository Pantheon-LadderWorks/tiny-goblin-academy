import Phaser from 'phaser';
import floorSheetUrl from '../../../../assets/academy/topdown/terrain/future-floor-tilesheets/sources/fantasy_dungeon_floor_tilesheet_textures.png?url';
import horizontalWallUrl from '../../../../assets/academy/topdown/walls/tga-topdown-walls-horizontal-true-alpha-regenerated-v0.2.png?url';
import verticalWallUrl from '../../../../assets/academy/topdown/walls/derived/tga-topdown-vertical-walls-cleaned-v0.1.png?url';
import objectSheetUrl from '../../../../assets/academy/topdown/objects/derived/tga-topdown-nonfx-objects-cleaned-v0.1.png?url';
import keySheetUrl from '../../../../assets/academy/derived-cleaned/shared-core/tga-shared-core-sheet-cleaned-preview-v0.1.png?url';
import type {OverlayResolution, RuntimeActor} from './privateActorOverlay';
import {RUIN_HALL_SCENE, buildMovementTransition} from './sceneAuthority';
import type {Direction, GameState, Position} from './simulation';

const TEXTURES = Object.freeze({
  floor: 'ruin-hall-floor-sheet',
  horizontalWall: 'ruin-hall-horizontal-wall-sheet',
  verticalWall: 'ruin-hall-vertical-wall-sheet',
  objects: 'ruin-hall-object-sheet',
  key: 'ruin-hall-key-sheet',
  exitOpen: 'ruin-hall-exit-open',
  exitLocked: 'ruin-hall-exit-locked',
});

const TILE = RUIN_HALL_SCENE.grid.tileSize;
const groundPoint = ({x, y}: Position): Phaser.Math.Vector2 => new Phaser.Math.Vector2(
  (x + .5) * TILE,
  (y + 1) * TILE,
);

type ActorObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text;
interface ActorView {
  object: ActorObject;
  shadow: Phaser.GameObjects.Ellipse;
  actorId: 'female-goblin' | 'thug';
  direction: Direction;
  privateActor?: RuntimeActor;
}

class RuinHallScene extends Phaser.Scene {
  readonly ready: Promise<void>;
  private resolveReady!: () => void;
  private state: GameState;
  private readonly overlay: OverlayResolution;
  private player!: ActorView;
  private enemy!: ActorView;
  private keyObject!: Phaser.GameObjects.Image;
  private keyGlow!: Phaser.GameObjects.Ellipse;
  private openExit!: Phaser.GameObjects.Image;
  private lockedExit!: Phaser.GameObjects.Image;

  constructor(state: GameState, overlay: OverlayResolution) {
    super({key: 'RuinHallScene'});
    this.state = state;
    this.overlay = overlay;
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
  }

  preload(): void {
    this.load.image(TEXTURES.floor, floorSheetUrl);
    this.load.image(TEXTURES.horizontalWall, horizontalWallUrl);
    this.load.image(TEXTURES.verticalWall, verticalWallUrl);
    this.load.image(TEXTURES.objects, objectSheetUrl);
    this.load.image(TEXTURES.key, keySheetUrl);
    for (const actor of this.overlay.manifest?.actors ?? []) {
      for (const animation of actor.animations) {
        if (!animation.strip.url) continue;
        this.load.spritesheet(this.animationTextureKey(animation.name), animation.strip.url, {
          frameWidth: animation.strip.frame_dimensions[0],
          frameHeight: animation.strip.frame_dimensions[1],
        });
      }
    }
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#15121b');
    this.registerPublicFrames();
    this.ensureExitTextures();
    this.registerPrivateAnimations();
    this.buildRoom();
    this.buildObjectives();
    this.buildActors();
    this.syncState(this.state);
    this.resolveReady();
  }

  private animationTextureKey(name: string): string {
    return `overlay-strip:${name}`;
  }

  private addFrame(textureKey: string, frameName: string, rect: Readonly<{x: number; y: number; w: number; h: number}>): void {
    const texture = this.textures.get(textureKey);
    if (!texture.has(frameName)) texture.add(frameName, 0, rect.x, rect.y, rect.w, rect.h);
  }

  private registerPublicFrames(): void {
    for (const region of RUIN_HALL_SCENE.floor.regions) {
      this.addFrame(TEXTURES.floor, region.id, region.sourceRect);
    }
    this.addFrame(TEXTURES.horizontalWall, RUIN_HALL_SCENE.walls.horizontal.id, RUIN_HALL_SCENE.walls.horizontal.sourceRect);
    this.addFrame(TEXTURES.verticalWall, RUIN_HALL_SCENE.walls.vertical.id, RUIN_HALL_SCENE.walls.vertical.sourceRect);
    this.addFrame(TEXTURES.key, RUIN_HALL_SCENE.key.id, RUIN_HALL_SCENE.key.sourceRect);
    for (const region of RUIN_HALL_SCENE.objects.regions) {
      this.addFrame(TEXTURES.objects, region.id, region.sourceRect);
    }
  }

  private ensureExitTextures(): void {
    const source = this.textures.get(TEXTURES.verticalWall).getSourceImage() as HTMLImageElement;
    const open = RUIN_HALL_SCENE.exit.openArch.sourceRect;
    const leaf = RUIN_HALL_SCENE.exit.doorLeafSource.sourceRect;
    this.createExitTexture(TEXTURES.exitOpen, source, open, undefined);
    this.createExitTexture(TEXTURES.exitLocked, source, open, {sourceRect: leaf});
  }

  private createExitTexture(
    textureKey: string,
    source: HTMLImageElement,
    openRect: Readonly<{x: number; y: number; w: number; h: number}>,
    locked?: Readonly<{sourceRect: Readonly<{x: number; y: number; w: number; h: number}>}>,
  ): void {
    if (this.textures.exists(textureKey)) return;
    const texture = this.textures.createCanvas(textureKey, openRect.w, openRect.h);
    if (!texture) throw new Error(`Unable to create ${textureKey}`);
    const context = texture.context;
    context.clearRect(0, 0, openRect.w, openRect.h);
    context.drawImage(source, openRect.x, openRect.y, openRect.w, openRect.h, 0, 0, openRect.w, openRect.h);
    if (locked) {
      context.save();
      context.beginPath();
      RUIN_HALL_SCENE.exit.doorLeafPolygon.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.clip();
      const rect = locked.sourceRect;
      context.drawImage(source, rect.x, rect.y, rect.w, rect.h, 0, 3, rect.w, rect.h);
      context.restore();
    }
    texture.refresh();
  }

  private registerPrivateAnimations(): void {
    for (const actor of this.overlay.manifest?.actors ?? []) {
      for (const animation of actor.animations) {
        if (this.anims.exists(animation.name)) continue;
        this.anims.create({
          key: animation.name,
          frames: this.anims.generateFrameNumbers(this.animationTextureKey(animation.name), {
            start: 0,
            end: animation.frame_count - 1,
          }),
          frameRate: animation.frame_count / (animation.duration_ms / 1000),
          repeat: -1,
        });
      }
    }
  }

  private buildRoom(): void {
    const walls = new Set(this.state.walls.map(({x, y}) => `${x},${y}`));
    const floorRegions = RUIN_HALL_SCENE.floor.regions;
    for (let y = 0; y < RUIN_HALL_SCENE.grid.rows; y += 1) {
      for (let x = 0; x < RUIN_HALL_SCENE.grid.columns; x += 1) {
        const centerX = (x + .5) * TILE;
        const centerY = (y + .5) * TILE;
        if (!walls.has(`${x},${y}`)) {
          const region = floorRegions[(x * 3 + y * 5) % floorRegions.length];
          this.add.image(centerX, centerY, TEXTURES.floor, region.id)
            .setDisplaySize(TILE, TILE)
            .setDepth(1);
          continue;
        }
        const horizontal = y === 0 || y === 9 || ((y === 4 || y === 5) && x >= 1 && x <= 6);
        this.add.rectangle(centerX, centerY, TILE, TILE, horizontal ? 0x18121d : 0x17121a, 1).setDepth(2);
        const wall = this.add.image(
          centerX,
          centerY,
          horizontal ? TEXTURES.horizontalWall : TEXTURES.verticalWall,
          horizontal ? RUIN_HALL_SCENE.walls.horizontal.id : RUIN_HALL_SCENE.walls.vertical.id,
        ).setDepth(y === 0 || y === 9 ? 8 : 6);
        wall.setDisplaySize(horizontal ? TILE * 1.26 : TILE * .54, horizontal ? TILE * .85 : TILE * 1.32);
        if (x === 6 && (y === 4 || y === 5)) {
          this.add.rectangle((x + 1) * TILE - 2, centerY, 5, TILE * .74, 0x08060a, .68).setDepth(9);
        }
      }
    }
    this.add.rectangle(160, 160, 320, 320).setStrokeStyle(2, 0x7c5a58, 1).setDepth(10);
    this.buildPatrolRead();
    this.buildDecor();
  }

  private buildPatrolRead(): void {
    const graphics = this.add.graphics().setDepth(7);
    graphics.lineStyle(2, 0xd55d6d, .42);
    graphics.strokeRoundedRect(7 * TILE + 4, 4 * TILE + 4, 2 * TILE - 8, 2 * TILE - 8, 10);
  }

  private buildDecor(): void {
    for (const region of RUIN_HALL_SCENE.objects.regions) {
      const point = groundPoint(region.tile);
      this.add.image(point.x, point.y, TEXTURES.objects, region.id)
        .setOrigin(.5, 1)
        .setDisplaySize(TILE * .85, TILE * .85)
        .setAlpha(.72)
        .setDepth(8);
    }
  }

  private buildObjectives(): void {
    const exitPoint = groundPoint(RUIN_HALL_SCENE.landmarks.exit);
    const exitWidth = TILE * .94;
    const exitHeight = TILE * 1.58;
    this.openExit = this.add.image(exitPoint.x, exitPoint.y, TEXTURES.exitOpen)
      .setOrigin(.5, 1)
      .setDisplaySize(exitWidth, exitHeight)
      .setDepth(9);
    this.lockedExit = this.add.image(exitPoint.x, exitPoint.y, TEXTURES.exitLocked)
      .setOrigin(.5, 1)
      .setDisplaySize(exitWidth, exitHeight)
      .setDepth(9);

    const keyPoint = groundPoint(RUIN_HALL_SCENE.landmarks.key);
    this.keyGlow = this.add.ellipse(keyPoint.x, keyPoint.y - 8, TILE, TILE * .72, 0xedbd4a, .16).setDepth(5);
    this.keyObject = this.add.image(keyPoint.x, keyPoint.y, TEXTURES.key, RUIN_HALL_SCENE.key.id)
      .setOrigin(.5, 1)
      .setDisplaySize(TILE * .62, TILE * .62)
      .setDepth(11);
  }

  private buildActors(): void {
    this.player = this.createActor('female-goblin', '🧙', this.state.player, 'down');
    this.enemy = this.createActor('thug', '👺', this.state.enemy, 'left');
  }

  private createActor(
    actorId: ActorView['actorId'],
    fallbackGlyph: string,
    position: Position,
    direction: Direction,
  ): ActorView {
    const point = groundPoint(position);
    const shadow = this.add.ellipse(point.x, point.y - 2, TILE * .72, TILE * .18, 0x050307, .58).setDepth(11);
    const privateActor = this.overlay.manifest?.actors.find((actor) => actor.actor_id === actorId);
    let object: ActorObject;
    if (privateActor) {
      object = this.add.sprite(
        point.x,
        point.y,
        this.animationTextureKey(`actor.${actorId}.idle.${direction}`),
        0,
      )
        .setOrigin(privateActor.phaser_origin[0], privateActor.phaser_origin[1])
        .setScale(RUIN_HALL_SCENE.actorProfile.displayHeightPx / privateActor.visible_content_height_px)
        .setDepth(12);
    } else {
      object = this.add.text(point.x, point.y, fallbackGlyph, {
        fontFamily: 'Segoe UI Emoji, sans-serif',
        fontSize: '34px',
      }).setOrigin(.5, 1).setDepth(12);
    }
    const view: ActorView = {object, shadow, actorId, direction, privateActor};
    this.playActorAnimation(view, 'idle', direction);
    return view;
  }

  private playActorAnimation(view: ActorView, action: 'idle' | 'walk', direction: Direction): void {
    view.direction = direction;
    if (!view.privateActor || !(view.object instanceof Phaser.GameObjects.Sprite)) return;
    view.object.play(`actor.${view.actorId}.${action}.${direction}`, true);
  }

  syncState(state: GameState): void {
    this.state = state;
    this.setActorPosition(this.player, state.player);
    this.setActorPosition(this.enemy, state.enemy);
    const keyVisible = !state.hasKey;
    this.keyObject.setVisible(keyVisible);
    this.keyGlow.setVisible(keyVisible);
    this.lockedExit.setVisible(!state.hasKey);
    this.openExit.setVisible(state.hasKey);
    this.enemy.object.setVisible(state.status !== 'defeat');
    this.enemy.shadow.setVisible(state.status !== 'defeat');
  }

  async playTransition(before: GameState, after: GameState, direction: Direction): Promise<void> {
    const transition = buildMovementTransition(before, after, direction);
    if (!transition.moved) {
      this.syncState(after);
      return;
    }
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : transition.durationMs;
    const enemyDirection = this.directionBetween(transition.enemyFrom, transition.enemyTo, this.enemy.direction);
    await Promise.all([
      this.tweenActor(this.player, transition.playerTo, direction, duration),
      this.tweenActor(this.enemy, transition.enemyTo, enemyDirection, duration),
    ]);
    this.syncState(after);
  }

  private directionBetween(from: Position, to: Position, fallback: Direction): Direction {
    if (to.x > from.x) return 'right';
    if (to.x < from.x) return 'left';
    if (to.y > from.y) return 'down';
    if (to.y < from.y) return 'up';
    return fallback;
  }

  private setActorPosition(view: ActorView, position: Position): void {
    const point = groundPoint(position);
    view.object.setPosition(point.x, point.y).setDepth(12 + point.y / 1000);
    view.shadow.setPosition(point.x, point.y - 2).setDepth(11 + point.y / 1000);
  }

  private tweenActor(
    view: ActorView,
    position: Position,
    direction: Direction,
    duration: number,
  ): Promise<void> {
    const point = groundPoint(position);
    if (view.object.x === point.x && view.object.y === point.y) {
      this.playActorAnimation(view, 'idle', direction);
      return Promise.resolve();
    }
    this.playActorAnimation(view, 'walk', direction);
    if (duration === 0) {
      this.setActorPosition(view, position);
      this.playActorAnimation(view, 'idle', direction);
      return Promise.resolve();
    }
    this.tweens.add({
      targets: view.shadow,
      x: point.x,
      y: point.y - 2,
      duration,
      ease: 'Linear',
    });
    return new Promise((resolve) => {
      this.tweens.add({
        targets: view.object,
        x: point.x,
        y: point.y,
        duration,
        ease: 'Linear',
        onComplete: () => {
          view.object.setDepth(12 + point.y / 1000);
          view.shadow.setDepth(11 + point.y / 1000);
          this.playActorAnimation(view, 'idle', direction);
          resolve();
        },
      });
    });
  }
}

export interface DungeonGameController {
  ready: Promise<void>;
  playTransition(before: GameState, after: GameState, direction: Direction): Promise<void>;
  syncState(state: GameState): void;
  destroy(): void;
}

export function createDungeonGame(
  parent: string,
  state: GameState,
  overlay: OverlayResolution,
): DungeonGameController {
  const scene = new RuinHallScene(state, overlay);
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: RUIN_HALL_SCENE.grid.columns * TILE,
    height: RUIN_HALL_SCENE.grid.rows * TILE,
    backgroundColor: '#15121b',
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene,
  });
  return {
    ready: scene.ready,
    playTransition: (before, after, direction) => scene.playTransition(before, after, direction),
    syncState: (nextState) => scene.syncState(nextState),
    destroy: () => game.destroy(true),
  };
}
