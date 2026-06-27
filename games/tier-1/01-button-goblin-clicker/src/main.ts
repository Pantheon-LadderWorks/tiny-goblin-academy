import './style.css';
import Phaser from 'phaser';
import { GameController } from './controller';
import { GameScene } from './scenes/GameScene';
import { setupUI } from './ui';

// 1. Initialize Controller
const controller = new GameController();

// 2. Inject DOM UI
const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div id="game-container"></div>
    <div id="ui-layer">
      <div class="hud-panel hud-top">
        <div class="stats">Treasury: <span id="coins-display" class="coins">0</span></div>
        <div class="stats">Bonk Power: <span id="damage-display">1</span></div>
      </div>
      <div class="hud-panel hud-bottom">
        <button id="shop-btn" disabled>Equip Bonk Stick (3 Coins)</button>
      </div>
    </div>
    <div id="victory-overlay" class="victory-overlay">
      <div class="victory-panel">
        <h1 class="victory-title">Academy Graduate!</h1>
        <div class="victory-text">You survived 10 overly enthusiastic goblins.</div>
      </div>
    </div>
  `;

  // 3. Initialize UI binding
  setupUI(controller);

  // 4. Initialize Phaser Game
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: [GameScene]
  };

  const game = new Phaser.Game(config);

  // Pass controller to scene
  game.scene.start('GameScene', { controller });
}
