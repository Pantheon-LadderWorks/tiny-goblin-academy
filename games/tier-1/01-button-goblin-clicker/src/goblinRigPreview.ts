import './goblinRigPreview.css';
import Phaser from 'phaser';
import { ALT_SKIN, GoblinRig } from './actors/GoblinRig';

const CAVERN_BACKGROUND_KEY = 'button-goblin-cavern-background';
const CAVERN_BACKGROUND_URL = new URL(
  '../../../../assets/academy/games/button-goblin-clicker/backgrounds/tga-button-goblin-clicker-cavern-stage-background-v0.1.png',
  import.meta.url
).href;

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;
const ACTOR_X = 400;
const ACTOR_BASELINE_Y = 500;

const anchors = [
  { id: '1', label: 'central click stage', category: 'safe', rect: { x: 502, y: 188, w: 669, h: 518 }, color: 0x4fd8ff },
  { id: '2', label: 'floor grounding zone', category: 'baseline', rect: { x: 468, y: 659, w: 736, h: 188 }, color: 0xf7c948 },
  { id: '6', label: 'left torch risk', category: 'risk', rect: { x: 0, y: 320, w: 301, h: 207 }, color: 0xff5b6e },
  { id: '7', label: 'right torch risk', category: 'risk', rect: { x: 1371, y: 151, w: 301, h: 235 }, color: 0xff5b6e },
  { id: '8', label: 'foreground obstruction', category: 'avoid', rect: { x: 0, y: 734, w: 1672, h: 207 }, color: 0xff9f1c },
  { id: '9', label: 'top HUD caution', category: 'caution', rect: { x: 468, y: 38, w: 736, h: 113 }, color: 0xb370ff },
];

type PreviewState = 'idle' | 'hover' | 'bonk-1' | 'bonk-2' | 'defeated' | 'reset' | 'variant';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="preview-shell">
    <section class="preview-header">
      <div>
        <p class="eyebrow">Tiny Goblin Academy · H6.3B Preview</p>
        <h1>Button Goblin Vector Actor Rig</h1>
        <p class="summary">Preview-only Phaser vector puppet. The live runtime goblin is not replaced in this lane.</p>
      </div>
      <div class="status-card">
        <span>Current state</span>
        <strong id="state-label">Idle</strong>
      </div>
    </section>

    <section class="preview-layout">
      <div class="preview-stage-card">
        <div id="preview-canvas" aria-label="Goblin rig preview canvas"></div>
      </div>
      <aside class="preview-panel">
        <h2>Controls</h2>
        <div class="button-grid">
          <button data-action="idle">Idle</button>
          <button data-action="hover">Hover On / Off</button>
          <button data-action="bonk-1">Bonk -1</button>
          <button data-action="bonk-2">Bonk -2</button>
          <button data-action="defeated">Defeat</button>
          <button data-action="reset">Reset</button>
          <button data-action="variant">Next Goblin / Variant</button>
        </div>
        <label><input id="anchors-toggle" type="checkbox" checked /> Show anchor overlay</label>
        <label><input id="bounds-toggle" type="checkbox" checked /> Show actor bounds / baseline</label>
        <div class="measurements">
          <h3>Placement</h3>
          <dl>
            <dt>Scene</dt><dd>800×600</dd>
            <dt>Center X</dt><dd>400</dd>
            <dt>Feet baseline</dt><dd>500</dd>
            <dt>Actor height</dt><dd>≈300</dd>
            <dt>Hit area</dt><dd>250×305 ellipse</dd>
          </dl>
        </div>
      </aside>
    </section>
  </main>
`;

class GoblinRigPreviewScene extends Phaser.Scene {
  private rig!: GoblinRig;
  private anchorGraphics!: Phaser.GameObjects.Graphics;
  private boundsGraphics!: Phaser.GameObjects.Graphics;
  private anchorLabels: Phaser.GameObjects.Text[] = [];
  private hoverActive = false;
  private variantActive = false;

  constructor() {
    super('GoblinRigPreviewScene');
  }

  preload() {
    this.load.image(CAVERN_BACKGROUND_KEY, CAVERN_BACKGROUND_URL);
  }

  create() {
    this.createBackground();
    this.anchorGraphics = this.add.graphics().setDepth(8);
    this.boundsGraphics = this.add.graphics().setDepth(30);
    this.rig = new GoblinRig(this, ACTOR_X, ACTOR_BASELINE_Y);
    this.rig.root.setDepth(20);
    this.drawOverlays();
    this.bindControls();
  }

  private createBackground() {
    this.add.rectangle(0, 0, SCENE_WIDTH, SCENE_HEIGHT, 0x1f1b24).setOrigin(0).setDepth(0);
    const bg = this.add.image(SCENE_WIDTH / 2, SCENE_HEIGHT / 2, CAVERN_BACKGROUND_KEY).setDepth(1);
    const sourceImage = this.textures.get(CAVERN_BACKGROUND_KEY).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const scale = Math.max(SCENE_WIDTH / sourceImage.width, SCENE_HEIGHT / sourceImage.height);
    bg.setScale(scale);
    this.add.rectangle(0, 0, SCENE_WIDTH, SCENE_HEIGHT, 0x130f20, 0.16).setOrigin(0).setDepth(2);
  }

  private bindControls() {
    document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        this.runAction(button.dataset.action as PreviewState);
      });
    });

    document.getElementById('anchors-toggle')?.addEventListener('change', () => this.drawOverlays());
    document.getElementById('bounds-toggle')?.addEventListener('change', () => this.drawOverlays());
  }

  private runAction(action: PreviewState) {
    const label = document.getElementById('state-label');
    if (label) label.textContent = action;

    switch (action) {
      case 'idle':
        this.rig.reset();
        break;
      case 'hover':
        this.hoverActive = !this.hoverActive;
        this.rig.setHover(this.hoverActive);
        break;
      case 'bonk-1':
        this.rig.playBonkReaction(1);
        this.flashDamage('-1 BONK!');
        break;
      case 'bonk-2':
        this.rig.playBonkReaction(2);
        this.flashDamage('-2 BONK!');
        break;
      case 'defeated':
        this.rig.playDefeat();
        break;
      case 'reset':
        this.hoverActive = false;
        this.rig.reset();
        break;
      case 'variant':
        this.variantActive = !this.variantActive;
        this.rig.setSkin(this.variantActive ? ALT_SKIN : {});
        this.rig.reset();
        break;
    }

    this.drawOverlays();
  }

  private flashDamage(text: string) {
    const popup = this.add.text(ACTOR_X + 118, ACTOR_BASELINE_Y - 220, text, {
      fontFamily: 'Georgia, serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#d94a4a',
      stroke: '#121015',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(35);

    this.tweens.add({
      targets: popup,
      y: popup.y - 54,
      alpha: 0,
      duration: 900,
      ease: 'Power2',
      onComplete: () => popup.destroy(),
    });
  }

  private drawOverlays() {
    const showAnchors = (document.getElementById('anchors-toggle') as HTMLInputElement | null)?.checked ?? true;
    const showBounds = (document.getElementById('bounds-toggle') as HTMLInputElement | null)?.checked ?? true;
    this.anchorGraphics.clear();
    this.boundsGraphics.clear();
    for (const label of this.anchorLabels) {
      label.destroy();
    }
    this.anchorLabels = [];

    if (showAnchors) {
      const scale = Math.max(SCENE_WIDTH / 1672, SCENE_HEIGHT / 941);
      const drawWidth = 1672 * scale;
      const offsetX = (SCENE_WIDTH - drawWidth) / 2;
      const offsetY = 0;

      for (const anchor of anchors) {
        const x = offsetX + anchor.rect.x * scale;
        const y = offsetY + anchor.rect.y * scale;
        const w = anchor.rect.w * scale;
        const h = anchor.rect.h * scale;
        this.anchorGraphics.lineStyle(2, anchor.color, 0.9);
        this.anchorGraphics.strokeRect(x, y, w, h);
        this.anchorGraphics.fillStyle(0x000000, 0.72);
        this.anchorGraphics.fillRect(x, y, 28, 20);
        this.anchorGraphics.fillStyle(anchor.color, 1);
        this.anchorGraphics.fillCircle(x + 8, y + 10, 4);
        const label = this.add.text(x + 14, y + 2, anchor.id, {
          fontSize: '12px',
          color: '#fff1c6',
          fontFamily: 'ui-monospace, monospace',
        }).setDepth(9).setName(`anchor-label-${anchor.id}`);
        this.anchorLabels.push(label);
      }
    }

    if (showBounds) {
      const bounds = this.rig.getHitBounds();
      this.boundsGraphics.lineStyle(2, 0xfff1c6, 1);
      this.boundsGraphics.strokeRect(ACTOR_X + bounds.x, ACTOR_BASELINE_Y + bounds.y, bounds.width, bounds.height);
      this.boundsGraphics.lineStyle(2, 0x6df5b8, 1);
      this.boundsGraphics.strokeEllipse(ACTOR_X, ACTOR_BASELINE_Y - 155, 250, 305);
      this.boundsGraphics.lineStyle(3, 0xffd166, 1);
      this.boundsGraphics.lineBetween(250, ACTOR_BASELINE_Y, 550, ACTOR_BASELINE_Y);
      this.boundsGraphics.fillStyle(0xffd166, 1);
      this.boundsGraphics.fillCircle(ACTOR_X, ACTOR_BASELINE_Y, 5);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'preview-canvas',
  width: SCENE_WIDTH,
  height: SCENE_HEIGHT,
  backgroundColor: 'transparent',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GoblinRigPreviewScene],
};

new Phaser.Game(config);
