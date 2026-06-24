import Phaser from 'phaser';

import type { RoundController } from './controller';
import type { PotionType, RoundState } from './simulation';

const POTION_COLORS: Record<PotionType, number> = {
  sun: 0xf5b942,
  moon: 0x9e9bff,
  star: 0x57d8c1
};

export class PotionScene extends Phaser.Scene {
  private readonly controller: RoundController;
  private art!: Phaser.GameObjects.Graphics;
  private potionHitbox!: Phaser.GameObjects.Arc;
  private shelfHitboxes: Array<{ type: PotionType; hitbox: Phaser.GameObjects.Rectangle }> = [];
  private selectionLabel!: Phaser.GameObjects.Text;

  constructor(controller: RoundController) {
    super('PotionScene');
    this.controller = controller;
  }

  create(): void {
    this.art = this.add.graphics();
    this.potionHitbox = this.add.circle(0, 0, 62, 0x000000, 0).setInteractive({ useHandCursor: true });
    this.potionHitbox.on('pointerdown', () => this.controller.selectPotion());

    (['sun', 'moon', 'star'] as PotionType[]).forEach((type) => {
      const hitbox = this.add.rectangle(0, 0, 160, 108, 0x000000, 0).setInteractive({ useHandCursor: true });
      hitbox.on('pointerdown', () => this.controller.placePotion(type));
      this.shelfHitboxes.push({ type, hitbox });
    });

    this.selectionLabel = this.add.text(0, 0, 'TAP ME', {
      color: '#fff4cd',
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.controller.subscribe((state) => this.render(state));
    this.scale.on('resize', () => this.render(this.controller.getState()));
  }

  private render(state: RoundState): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const potionX = width / 2;
    const potionY = height * 0.34;
    const shelfY = height * 0.72;
    const shelfWidth = Math.min(190, width * 0.25);
    const shelfHeight = 112;

    this.art.clear();
    this.art.fillStyle(0x1a1527, 1).fillRect(0, 0, width, height);
    this.art.fillStyle(0x2b2240, 1).fillRect(0, height * 0.58, width, height * 0.42);
    this.art.fillStyle(0x453354, 1).fillRect(0, height * 0.58, width, 10);
    this.art.fillStyle(0xf4d394, 0.18).fillCircle(width * 0.16, height * 0.16, 3).fillCircle(width * 0.8, height * 0.25, 2).fillCircle(width * 0.68, height * 0.1, 2);

    if (state.activePotion) {
      const color = POTION_COLORS[state.activePotion];
      if (state.selectedPotion) this.art.fillStyle(color, 0.18).fillCircle(potionX, potionY, 96);
      this.art.fillStyle(0xd7c3ad, 1).fillRoundedRect(potionX - 34, potionY - 58, 68, 94, 18);
      this.art.fillStyle(color, 1).fillRoundedRect(potionX - 28, potionY - 20, 56, 52, 14);
      this.art.fillStyle(0xf4dfac, 1).fillRect(potionX - 17, potionY - 70, 34, 16);
      this.art.fillStyle(0x241d33, 1).fillCircle(potionX - 11, potionY + 7, 4).fillCircle(potionX + 11, potionY + 7, 4);
      this.potionHitbox.setPosition(potionX, potionY).setInteractive({ useHandCursor: true });
      this.potionHitbox.input!.enabled = !state.roundComplete;
      this.selectionLabel.setPosition(potionX, potionY + 58).setText(state.selectedPotion ? 'NOW PICK A SHELF' : 'TAP THE POTION').setAlpha(1);
    } else {
      this.potionHitbox.input!.enabled = false;
      this.selectionLabel.setAlpha(0);
    }

    const shelfPositions = [width * 0.2, width * 0.5, width * 0.8];
    this.shelfHitboxes.forEach(({ type, hitbox }, index) => {
      const x = shelfPositions[index];
      const color = POTION_COLORS[type];
      this.art.fillStyle(0x36263c, 1).fillRoundedRect(x - shelfWidth / 2, shelfY - shelfHeight / 2, shelfWidth, shelfHeight, 14);
      this.art.lineStyle(3, color, 1).strokeRoundedRect(x - shelfWidth / 2, shelfY - shelfHeight / 2, shelfWidth, shelfHeight, 14);
      this.art.fillStyle(color, 0.75).fillCircle(x, shelfY - 12, 20);
      this.art.fillStyle(0xf4dfac, 1).fillRect(x - 24, shelfY + 24, 48, 8);
      hitbox.setPosition(x, shelfY).setSize(shelfWidth, shelfHeight).setInteractive({ useHandCursor: !state.roundComplete });
      hitbox.input!.enabled = !state.roundComplete;
    });
  }
}
