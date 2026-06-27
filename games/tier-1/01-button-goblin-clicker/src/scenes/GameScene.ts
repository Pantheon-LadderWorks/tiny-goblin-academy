import Phaser from 'phaser';
import { GameController } from '../controller';
import { GameState } from '../simulation';

export class GameScene extends Phaser.Scene {
  private controller!: GameController;
  private goblinContainer!: Phaser.GameObjects.Container;
  private goblinGraphic!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;
  private nameText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  init(data: { controller: GameController }) {
    this.controller = data.controller;
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(0, 0, width, height, 0x223322).setOrigin(0);

    // Goblin Container
    this.goblinContainer = this.add.container(width / 2, height / 2);

    // Goblin Visual (Placeholder)
    this.goblinGraphic = this.add.graphics();
    this.drawGoblin(0x55aa55); // Green goblin

    // Make interactive area
    const hitArea = new Phaser.Geom.Circle(0, 0, 80);
    this.goblinGraphic.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    
    // Interaction events
    this.goblinGraphic.on('pointerdown', () => this.handleBonk());
    this.goblinGraphic.on('pointerover', () => this.goblinContainer.setScale(1.05));
    this.goblinGraphic.on('pointerout', () => this.goblinContainer.setScale(1));

    // Name tag
    this.nameText = this.add.text(0, -110, 'Goblin #1', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // HP Text
    this.hpText = this.add.text(0, 110, 'HP: 5/5', {
      fontSize: '20px',
      color: '#ff5555',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.goblinContainer.add([this.goblinGraphic, this.nameText, this.hpText]);

    // Subscribe to state changes
    this.controller.subscribe((state: GameState) => this.updateState(state));
  }

  private drawGoblin(color: number) {
    this.goblinGraphic.clear();
    this.goblinGraphic.fillStyle(color, 1);
    this.goblinGraphic.fillCircle(0, 0, 80); // Body
    this.goblinGraphic.fillStyle(0x000000, 1);
    this.goblinGraphic.fillCircle(-30, -20, 10); // Eye
    this.goblinGraphic.fillCircle(30, -20, 10); // Eye
    this.goblinGraphic.fillStyle(0x222222, 1);
    this.goblinGraphic.fillRoundedRect(-20, 20, 40, 10, 4); // Mouth
  }

  private handleBonk() {
    const state = this.controller.getState();
    if (state.victory || state.currentGoblinHp <= 0) return;

    this.controller.bonk();

    // Visual feedback
    this.tweens.add({
      targets: this.goblinContainer,
      y: this.goblinContainer.y + 10,
      scaleX: 1.1,
      scaleY: 0.9,
      duration: 50,
      yoyo: true
    });
    
    // Damage text popup
    const damageText = this.add.text(
      this.goblinContainer.x + Phaser.Math.Between(-40, 40),
      this.goblinContainer.y - Phaser.Math.Between(40, 80),
      `-${state.damage}`,
      { fontSize: '32px', color: '#ff0000', fontStyle: 'bold' }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy()
    });
  }

  private updateState(state: GameState) {
    if (state.victory) {
      this.goblinContainer.setVisible(false);
      return;
    }

    this.nameText.setText(`Goblin #${state.goblinIndex}`);
    this.hpText.setText(`HP: ${state.currentGoblinHp}/${state.maxGoblinHp}`);

    if (state.currentGoblinHp <= 0) {
      this.drawGoblin(0x555555);
      
      // Auto-advance after delay
      this.time.delayedCall(800, () => {
        this.controller.advanceGoblin();
        this.drawGoblin(0x55aa55);
      });
    }
  }
}
