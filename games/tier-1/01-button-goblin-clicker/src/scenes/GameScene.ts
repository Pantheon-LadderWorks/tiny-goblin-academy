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

    // Background - Dark Academy floor or slate
    this.add.rectangle(0, 0, width, height, 0x1f1b24).setOrigin(0);

    // Goblin Container
    this.goblinContainer = this.add.container(width / 2, height / 2 + 20);

    // Goblin Visual (Placeholder)
    this.goblinGraphic = this.add.graphics();
    this.drawGoblin(0x4a6a41); // Slate-green goblin

    // Make interactive area
    const hitArea = new Phaser.Geom.Circle(0, 0, 90);
    this.goblinGraphic.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    
    // Interaction events
    this.goblinGraphic.on('pointerdown', () => this.handleBonk());
    this.goblinGraphic.on('pointerover', () => this.goblinContainer.setScale(1.05));
    this.goblinGraphic.on('pointerout', () => this.goblinContainer.setScale(1));

    // Name tag
    this.nameText = this.add.text(0, -140, 'Goblin #1', {
      fontSize: '28px',
      color: '#e8dfc7', // parchment
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      shadow: { color: '#000', fill: true, offsetY: 2, blur: 4 }
    }).setOrigin(0.5);

    // HP Text
    this.hpText = this.add.text(0, 130, 'HP: 5/5', {
      fontSize: '24px',
      color: '#d94a4a', // damage color
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      shadow: { color: '#000', fill: true, offsetY: 2, blur: 4 }
    }).setOrigin(0.5);

    this.goblinContainer.add([this.goblinGraphic, this.nameText, this.hpText]);

    // Subscribe to state changes
    this.controller.subscribe((state: GameState) => this.updateState(state));
  }

  private drawGoblin(color: number, isHit: boolean = false) {
    this.goblinGraphic.clear();
    
    // Ears
    this.goblinGraphic.fillStyle(color, 1);
    this.goblinGraphic.fillTriangle(-70, -20, -120, -50, -60, 20); // Left ear
    this.goblinGraphic.fillTriangle(70, -20, 120, -50, 60, 20);   // Right ear
    
    // Body (Circle)
    this.goblinGraphic.fillCircle(0, 0, 80); 
    
    // Eyes
    this.goblinGraphic.fillStyle(0xe8dfc7, 1); // sclera
    this.goblinGraphic.fillCircle(-30, -20, 18);
    this.goblinGraphic.fillCircle(30, -20, 18);
    
    // Pupils
    this.goblinGraphic.fillStyle(0x121015, 1);
    if (isHit) {
      // "X" eyes for hit/hurt
      this.goblinGraphic.lineStyle(4, 0x121015, 1);
      this.goblinGraphic.strokeLineShape(new Phaser.Geom.Line(-38, -28, -22, -12));
      this.goblinGraphic.strokeLineShape(new Phaser.Geom.Line(-22, -28, -38, -12));
      this.goblinGraphic.strokeLineShape(new Phaser.Geom.Line(22, -28, 38, -12));
      this.goblinGraphic.strokeLineShape(new Phaser.Geom.Line(38, -28, 22, -12));
    } else {
      this.goblinGraphic.fillCircle(-30, -20, 8);
      this.goblinGraphic.fillCircle(30, -20, 8);
    }
    
    // Mouth
    this.goblinGraphic.fillStyle(0x221111, 1);
    if (isHit) {
      this.goblinGraphic.fillEllipse(0, 30, 30, 40); // "O" shape for hit
    } else {
      this.goblinGraphic.fillRoundedRect(-25, 20, 50, 15, 4); // Grin
      // Tooth
      this.goblinGraphic.fillStyle(0xe8dfc7, 1);
      this.goblinGraphic.fillTriangle(-10, 20, -5, 30, 0, 20);
    }
  }

  private handleBonk() {
    const state = this.controller.getState();
    if (state.victory || state.currentGoblinHp <= 0) return;

    this.controller.bonk();

    // Visual feedback
    this.drawGoblin(0x608055, true); // Flash lighter color and hit face
    
    // Camera Shake
    this.cameras.main.shake(100, 0.01);

    this.tweens.add({
      targets: this.goblinContainer,
      y: this.goblinContainer.y + 15,
      scaleX: 1.15,
      scaleY: 0.85,
      duration: 50,
      yoyo: true,
      onComplete: () => {
        if (this.controller.getState().currentGoblinHp > 0) {
          this.drawGoblin(0x4a6a41, false);
        }
      }
    });
    
    // Damage text popup
    const stateAfterBonk = this.controller.getState();
    const damageText = this.add.text(
      this.goblinContainer.x + Phaser.Math.Between(-50, 50),
      this.goblinContainer.y - Phaser.Math.Between(50, 90),
      `-${state.damage} BONK!`,
      { fontSize: '36px', color: '#d94a4a', fontFamily: 'Georgia', fontStyle: 'bold', stroke: '#121015', strokeThickness: 4 }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 60,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
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
      this.drawGoblin(0x2a2a2a, true); // Defeated state
      
      // Auto-advance after delay
      this.time.delayedCall(800, () => {
        this.controller.advanceGoblin();
        this.drawGoblin(0x4a6a41, false);
      });
    }
  }
}
