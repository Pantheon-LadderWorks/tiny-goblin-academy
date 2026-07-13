import Phaser from 'phaser';
import { GoblinRig } from '../actors/GoblinRig';
import { GameController } from '../controller';
import { GameState } from '../simulation';

const CAVERN_BACKGROUND_KEY = 'button-goblin-cavern-background';
const CAVERN_BACKGROUND_URL = new URL(
  '../../../../../assets/academy/games/button-goblin-clicker/backgrounds/tga-button-goblin-clicker-cavern-stage-background-v0.1.png',
  import.meta.url
).href;

const BASE_SCENE_WIDTH = 800;
const BASE_SCENE_HEIGHT = 600;
const PREVIEW_FEET_BASELINE_Y = 500;
const ACTOR_SCALE = 1;
const HIT_AREA_DEBUG_QUERY = 'debugHitArea';

export class GameScene extends Phaser.Scene {
  private controller!: GameController;
  private backgroundFallback!: Phaser.GameObjects.Rectangle;
  private backgroundImage?: Phaser.GameObjects.Image;
  private backgroundScrim!: Phaser.GameObjects.Rectangle;
  private goblinRig?: GoblinRig;
  private hpText!: Phaser.GameObjects.Text;
  private nameText!: Phaser.GameObjects.Text;
  private hitAreaDebug?: Phaser.GameObjects.Graphics;
  private unsubscribeState?: () => void;
  private advanceTimer?: Phaser.Time.TimerEvent;
  private lastGoblinIndex = 1;
  private actorX = BASE_SCENE_WIDTH / 2;
  private actorFeetY = PREVIEW_FEET_BASELINE_Y;
  private pointerHoverActive = false;
  private defeatedPresentationActive = false;
  private cleanupComplete = false;
  private debugHitArea = false;

  constructor() {
    super('GameScene');
  }

  init(data: { controller: GameController }) {
    this.controller = data.controller;
  }

  preload() {
    this.load.image(CAVERN_BACKGROUND_KEY, CAVERN_BACKGROUND_URL);

    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      if (file.key === CAVERN_BACKGROUND_KEY) {
        console.error(
          '[Button Goblin Clicker] Failed to load cavern stage background. Falling back to flat Academy stage.',
          CAVERN_BACKGROUND_URL
        );
      }
    });
  }

  create() {
    this.cleanupComplete = false;
    this.debugHitArea = this.shouldShowHitAreaDebug();
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createGoblinActor(width, height);

    this.unsubscribeState = this.controller.subscribe((state: GameState) => this.updateState(state));

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanup, this);
  }

  private createBackground(width: number, height: number) {
    this.backgroundFallback = this.add
      .rectangle(0, 0, width, height, 0x1f1b24)
      .setOrigin(0)
      .setDepth(0);

    if (this.textures.exists(CAVERN_BACKGROUND_KEY)) {
      this.backgroundImage = this.add
        .image(width / 2, height / 2, CAVERN_BACKGROUND_KEY)
        .setDepth(1)
        .setOrigin(0.5);
      this.resizeBackground(width, height);
    } else {
      console.warn(
        '[Button Goblin Clicker] Cavern stage background texture was unavailable. Gameplay remains active on fallback stage.'
      );
    }

    // A conservative contrast layer keeps the goblin actor, HP label,
    // BONK feedback, and HUD surfaces readable without mutating the art.
    this.backgroundScrim = this.add
      .rectangle(0, 0, width, height, 0x130f20, 0.2)
      .setOrigin(0)
      .setDepth(2);
  }

  private createGoblinActor(width: number, height: number) {
    const placement = this.getActorPlacement(width, height);
    this.actorX = placement.x;
    this.actorFeetY = placement.feetY;

    this.goblinRig = new GoblinRig(this, this.actorX, this.actorFeetY, { scale: ACTOR_SCALE });
    this.goblinRig.root.setDepth(12);
    this.goblinRig.root.setInteractive(this.goblinRig.hitArea, Phaser.Geom.Ellipse.Contains);
    this.goblinRig.root.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.handleBonk());
    this.goblinRig.root.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => this.handlePointerOver());
    this.goblinRig.root.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this.handlePointerOut());

    this.nameText = this.add.text(this.actorX, this.actorFeetY - 348, 'Goblin #1', {
      fontSize: '28px',
      color: '#e8dfc7',
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      shadow: { color: '#000', fill: true, offsetY: 2, blur: 4 }
    }).setOrigin(0.5).setDepth(30);

    this.hpText = this.add.text(this.actorX, this.actorFeetY + 54, 'HP: 5/5', {
      fontSize: '24px',
      color: '#d94a4a',
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      shadow: { color: '#000', fill: true, offsetY: 2, blur: 4 }
    }).setOrigin(0.5).setDepth(30);

    if (this.debugHitArea) {
      this.hitAreaDebug = this.add.graphics().setDepth(35);
      this.drawHitAreaDebug();
    }
  }

  private getActorPlacement(width: number, height: number) {
    return {
      x: width / 2,
      feetY: Phaser.Math.Clamp(
        height * (PREVIEW_FEET_BASELINE_Y / BASE_SCENE_HEIGHT),
        Math.min(420, height - 95),
        height - 68
      ),
    };
  }

  private resizeBackground(width: number, height: number) {
    this.backgroundFallback?.setSize(width, height);
    this.backgroundScrim?.setSize(width, height);

    if (!this.backgroundImage) return;

    const texture = this.textures.get(CAVERN_BACKGROUND_KEY);
    const sourceImage = texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const scale = Math.max(width / sourceImage.width, height / sourceImage.height);

    this.backgroundImage
      .setPosition(width / 2, height / 2)
      .setScale(scale);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    this.resizeBackground(width, height);

    const placement = this.getActorPlacement(width, height);
    this.actorX = placement.x;
    this.actorFeetY = placement.feetY;
    this.placeActorForCurrentState(this.controller.getState());
    this.placeLabels();
    this.drawHitAreaDebug();
  }

  private placeActorForCurrentState(state: GameState) {
    if (!this.goblinRig) return;

    if (state.victory || state.currentGoblinHp <= 0) {
      this.goblinRig.setBaseline(this.actorX, this.actorFeetY);
      return;
    }

    this.goblinRig.reset(this.actorX, this.actorFeetY);
    if (this.pointerHoverActive) {
      this.goblinRig.setHover(true);
    }
  }

  private placeLabels() {
    this.nameText.setPosition(this.actorX, this.actorFeetY - 348);
    this.hpText.setPosition(this.actorX, this.actorFeetY + 54);
  }

  private handlePointerOver() {
    const state = this.controller.getState();
    if (state.victory || state.currentGoblinHp <= 0) return;
    this.pointerHoverActive = true;
    this.goblinRig?.setHover(true);
  }

  private handlePointerOut() {
    this.pointerHoverActive = false;
    this.goblinRig?.setHover(false);
  }

  private handleBonk() {
    const stateBefore = this.controller.getState();
    if (stateBefore.victory || stateBefore.currentGoblinHp <= 0 || this.advanceTimer) return;

    const damage = stateBefore.damage >= 2 ? 2 : 1;
    this.pointerHoverActive = false;
    this.goblinRig?.setHover(false);

    this.controller.bonk();
    const stateAfter = this.controller.getState();
    const defeatedByBonk = stateAfter.currentGoblinHp <= 0;

    this.goblinRig?.playBonkReaction(damage, !defeatedByBonk);
    this.cameras.main.shake(100, 0.01);
    this.showDamageText(damage);

    if (defeatedByBonk) {
      this.queueDefeatAndAdvance();
    }
  }

  private showDamageText(damage: number) {
    const damageText = this.add.text(
      this.actorX + Phaser.Math.Between(112, 148),
      this.actorFeetY - Phaser.Math.Between(228, 260),
      `-${damage} BONK!`,
      {
        fontSize: '34px',
        color: '#d94a4a',
        fontFamily: 'Georgia',
        fontStyle: 'bold',
        stroke: '#121015',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(32);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 48,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });
  }

  private queueDefeatAndAdvance() {
    this.defeatedPresentationActive = true;
    this.advanceTimer?.remove(false);

    this.time.delayedCall(170, () => {
      if (!this.scene.isActive() || !this.goblinRig) return;
      this.goblinRig.playDefeat();
      this.drawHitAreaDebug();
    });

    this.advanceTimer = this.time.delayedCall(800, () => {
      this.advanceTimer = undefined;
      if (!this.scene.isActive()) return;
      this.controller.advanceGoblin();
    });
  }

  private updateState(state: GameState) {
    if (state.victory) {
      this.nameText.setText(`Goblin #${state.goblinIndex}`);
      this.hpText.setText(`HP: ${state.currentGoblinHp}/${state.maxGoblinHp}`);
      this.goblinRig?.root.disableInteractive();
      if (!this.defeatedPresentationActive) {
        this.goblinRig?.playDefeat();
        this.defeatedPresentationActive = true;
      }
      this.drawHitAreaDebug();
      return;
    }

    if (state.goblinIndex !== this.lastGoblinIndex) {
      this.lastGoblinIndex = state.goblinIndex;
      this.defeatedPresentationActive = false;
      this.pointerHoverActive = false;
      this.goblinRig?.root.setInteractive(this.goblinRig.hitArea, Phaser.Geom.Ellipse.Contains);
      this.goblinRig?.reset(this.actorX, this.actorFeetY);
    }

    this.nameText.setText(`Goblin #${state.goblinIndex}`);
    this.hpText.setText(`HP: ${state.currentGoblinHp}/${state.maxGoblinHp}`);

    if (state.currentGoblinHp <= 0 && !this.defeatedPresentationActive) {
      this.defeatedPresentationActive = true;
      this.goblinRig?.playDefeat();
    }

    this.drawHitAreaDebug();
  }

  private shouldShowHitAreaDebug() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has(HIT_AREA_DEBUG_QUERY) || window.location.hash.includes(HIT_AREA_DEBUG_QUERY);
    } catch {
      return false;
    }
  }

  private drawHitAreaDebug() {
    if (!this.hitAreaDebug || !this.goblinRig) return;
    this.hitAreaDebug.clear();
    this.hitAreaDebug.lineStyle(2, 0x6df5b8, 0.95);
    this.hitAreaDebug.strokeEllipse(
      this.actorX,
      this.actorFeetY - 155,
      250 * ACTOR_SCALE,
      305 * ACTOR_SCALE
    );
    this.hitAreaDebug.lineStyle(2, 0xfff1c6, 0.9);
    const bounds = this.goblinRig.getHitBounds();
    this.hitAreaDebug.strokeRect(
      this.actorX + bounds.x * ACTOR_SCALE,
      this.actorFeetY + bounds.y * ACTOR_SCALE,
      bounds.width * ACTOR_SCALE,
      bounds.height * ACTOR_SCALE
    );
    this.hitAreaDebug.lineStyle(3, 0xffd166, 0.9);
    this.hitAreaDebug.lineBetween(this.actorX - 150, this.actorFeetY, this.actorX + 150, this.actorFeetY);
  }

  private cleanup() {
    if (this.cleanupComplete) return;
    this.cleanupComplete = true;

    this.unsubscribeState?.();
    this.unsubscribeState = undefined;
    this.advanceTimer?.remove(false);
    this.advanceTimer = undefined;
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.goblinRig?.destroy();
    this.goblinRig = undefined;
  }
}
