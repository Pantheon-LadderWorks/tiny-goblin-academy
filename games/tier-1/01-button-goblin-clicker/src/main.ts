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
      <div class="hud-bar">
        <div class="stats">Coins: <span id="coins-display" class="coins">0</span></div>
        <div class="stats">Damage: <span id="damage-display">1</span></div>
      </div>
      <div class="shop-panel">
        <button id="shop-btn" disabled>Buy Bonk Stick (3 Coins)</button>
      </div>
    </div>
    <div id="victory-overlay" class="victory-overlay">
      <div>VICTORY!</div>
      <div style="font-size: 1.5rem; color: #fff; margin-top: 20px;">You defeated 10 goblins.</div>
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
