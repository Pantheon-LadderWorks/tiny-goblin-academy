import Phaser from 'phaser';
import type { AnchorSnapshot } from '../anchors';
import {
  CARD_RIG_ANCHOR_IDS,
  CARD_RIG_SOURCE_ANCHORS,
  CARD_RIG_SOURCE_SIZE,
  resolveCoverPoint,
} from '../card-rig-routes';

export type PhaserStageRendererOptions = Readonly<{
  tabletopScene: HTMLElement;
  debugAnchors: boolean;
}>;

export class PhaserStageRenderer {
  private stageGraphics?: Phaser.GameObjects.Graphics;
  private debugGraphics?: Phaser.GameObjects.Graphics;
  private debugLabels: Phaser.GameObjects.Text[] = [];

  constructor(private readonly options: PhaserStageRendererOptions) {}

  initialize(scene: Phaser.Scene): void {
    this.stageGraphics = scene.add.graphics().setDepth(0).setVisible(false);
    this.debugGraphics = scene.add.graphics().setDepth(999);
  }

  layoutSourceAnchors(): void {
    const viewport = {
      width: this.options.tabletopScene.clientWidth,
      height: this.options.tabletopScene.clientHeight,
    };
    for (const key of Object.keys(CARD_RIG_SOURCE_ANCHORS) as Array<keyof typeof CARD_RIG_SOURCE_ANCHORS>) {
      const anchor = document.querySelector<HTMLElement>(
        `[data-stage-anchor="${CARD_RIG_ANCHOR_IDS[key]}"]`,
      );
      if (!anchor) continue;
      const resolved = resolveCoverPoint(
        viewport,
        CARD_RIG_SOURCE_SIZE,
        CARD_RIG_SOURCE_ANCHORS[key].point,
      );
      anchor.style.left = `${resolved.x}px`;
      anchor.style.top = `${resolved.y}px`;
    }
  }

  draw(scene: Phaser.Scene, snapshot: AnchorSnapshot = Object.freeze({})): void {
    if (!this.stageGraphics) return;
    const width = scene.scale.width;
    const height = scene.scale.height;
    const safeWidth = Math.max(0, width - 8);
    const safeHeight = Math.max(0, height - 8);

    this.stageGraphics.clear();
    this.stageGraphics.fillStyle(0x17101f, 1);
    this.stageGraphics.fillRoundedRect(4, 4, safeWidth, safeHeight, 28);
    this.stageGraphics.lineStyle(2, 0xb7834e, 0.82);
    this.stageGraphics.strokeRoundedRect(5, 5, Math.max(0, width - 10), Math.max(0, height - 10), 28);
    this.stageGraphics.lineStyle(1, 0xe7bd6b, 0.22);
    this.stageGraphics.strokeRoundedRect(11, 11, Math.max(0, width - 22), Math.max(0, height - 22), 22);

    const enemy = snapshot['enemy-center'];
    const enemyImpact = snapshot['enemy-impact'];
    const resolution = snapshot['resolution-center'];
    const played = snapshot[CARD_RIG_ANCHOR_IDS.playedCardTarget];
    const player = snapshot['player-center'];
    const deck = snapshot[CARD_RIG_ANCHOR_IDS.playerDrawOrigin];
    const discard = snapshot[CARD_RIG_ANCHOR_IDS.playerDiscardTarget];

    if (enemy && player) {
      const tableTop = Math.max(24, enemy.y - 56);
      const tableBottom = Math.min(height - 24, player.y + player.height + 58);
      this.stageGraphics.fillStyle(0x21152c, 0.94);
      this.stageGraphics.fillRoundedRect(24, tableTop, Math.max(0, width - 48), Math.max(0, tableBottom - tableTop), 22);
      this.stageGraphics.lineStyle(2, 0x75444b, 0.72);
      this.stageGraphics.strokeRoundedRect(24, tableTop, Math.max(0, width - 48), Math.max(0, tableBottom - tableTop), 22);
      this.stageGraphics.lineStyle(1, 0xe7bd6b, 0.18);
      this.stageGraphics.lineBetween(42, enemy.centerY + 42, width - 42, enemy.centerY + 42);
      this.stageGraphics.lineBetween(42, player.centerY - 42, width - 42, player.centerY - 42);
    }

    if (resolution) {
      const radius = Math.max(62, Math.min(112, Math.min(width, height) * 0.105));
      this.stageGraphics.lineStyle(2, 0xe7bd6b, 0.38);
      this.stageGraphics.strokeCircle(resolution.centerX, resolution.centerY, radius);
      this.stageGraphics.lineStyle(1, 0xb7834e, 0.48);
      this.stageGraphics.strokeCircle(resolution.centerX, resolution.centerY, radius * 0.72);
      this.stageGraphics.beginPath();
      this.stageGraphics.moveTo(resolution.centerX, resolution.centerY - radius * 0.88);
      this.stageGraphics.lineTo(resolution.centerX + radius * 0.88, resolution.centerY);
      this.stageGraphics.lineTo(resolution.centerX, resolution.centerY + radius * 0.88);
      this.stageGraphics.lineTo(resolution.centerX - radius * 0.88, resolution.centerY);
      this.stageGraphics.closePath();
      this.stageGraphics.strokePath();

      for (let index = 0; index < 8; index += 1) {
        const angle = (Math.PI * 2 * index) / 8;
        const inner = radius * 0.82;
        const outer = radius * 0.96;
        this.stageGraphics.lineBetween(
          resolution.centerX + Math.cos(angle) * inner,
          resolution.centerY + Math.sin(angle) * inner,
          resolution.centerX + Math.cos(angle) * outer,
          resolution.centerY + Math.sin(angle) * outer,
        );
      }
    }

    this.stageGraphics.lineStyle(2, 0xe7bd6b, 0.16);
    if (played) {
      for (let index = 0; index < 3; index += 1) {
        const slot = snapshot[`hand-slot-${index}`];
        if (!slot) continue;
        const shoulderY = played.centerY + Math.max(42, played.height * 0.42);
        this.stageGraphics.beginPath();
        this.stageGraphics.moveTo(slot.centerX, slot.y);
        this.stageGraphics.lineTo(slot.centerX, shoulderY);
        this.stageGraphics.lineTo(played.centerX, played.centerY);
        this.stageGraphics.strokePath();
      }
    }

    if (played && enemyImpact) {
      const midpointY = (played.centerY + enemyImpact.centerY) / 2;
      this.stageGraphics.beginPath();
      this.stageGraphics.moveTo(played.centerX, played.centerY);
      this.stageGraphics.lineTo(played.centerX, midpointY);
      this.stageGraphics.lineTo(enemyImpact.centerX, enemyImpact.centerY);
      this.stageGraphics.strokePath();
    }

    for (const well of [deck, discard]) {
      if (!well) continue;
      this.stageGraphics.lineStyle(1, 0xe7bd6b, 0.26);
      this.stageGraphics.strokeRoundedRect(well.x - 6, well.y - 6, well.width + 12, well.height + 12, 12);
    }
  }

  drawAnchorDebug(scene: Phaser.Scene, snapshot: AnchorSnapshot): void {
    if (!this.debugGraphics) return;
    this.debugGraphics.clear();
    this.clearDebugLabels();
    if (!this.options.debugAnchors) return;

    this.debugGraphics.lineStyle(2, 0x65d9ff, 0.9);
    this.debugGraphics.fillStyle(0x10131a, 0.82);
    for (const [id, anchor] of Object.entries(snapshot)) {
      this.debugGraphics.fillCircle(anchor.centerX, anchor.centerY, 5);
      this.debugGraphics.strokeRect(anchor.x, anchor.y, anchor.width, anchor.height);
      const label = scene.add.text(anchor.centerX + 8, anchor.centerY - 8, id, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#65d9ff',
        backgroundColor: '#10131acc',
        padding: { x: 3, y: 2 },
      }).setDepth(1000);
      this.debugLabels.push(label);
    }
  }

  private clearDebugLabels(): void {
    for (const label of this.debugLabels) label.destroy();
    this.debugLabels = [];
  }
}
