import './style.css';
import Phaser from 'phaser';
import { GameController } from './controller';
import { GameScene } from './scenes/GameScene';
import { setupUI } from './ui';

// 1. Initialize Controller
const controller = new GameController();

// 2. Inject DOM UI
const app = document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <div class="masthead">
      <div class="eyebrow">TINY GOBLIN ACADEMY · LEVEL 01</div>
      <h1>Button Goblin Clicker</h1>
      <p class="objective">Bonk 10 goblins. Buy one upgrade. Earn your extremely small legend.</p>
    </div>
    
    <div class="game-layout">
      <!-- Left Stats Column -->
      <div class="stat-stack">
        <div class="stat-card">
          <span>Goblin</span>
          <strong id="goblin-display">1 / 10</strong>
        </div>
        <div class="stat-card">
          <span>Goblin HP</span>
          <strong id="hp-display">4 / 4</strong>
        </div>
        <div class="stat-card">
          <span>Coins</span>
          <strong id="coins-display" class="coins">0</strong>
        </div>
      </div>
      
      <!-- Central Playfield -->
      <div class="playfield-wrap">
        <div id="game-canvas"></div>
        <p class="instruction">Bonk the goblin!</p>
        
        <div id="victory-overlay" class="victory-overlay">
          <div class="victory-panel">
            <h1 class="victory-title">Academy Graduate!</h1>
            <div class="victory-text">You survived 10 overly enthusiastic goblins.</div>
          </div>
        </div>
      </div>
      
      <!-- Right Upgrade Column -->
      <div class="upgrade-card">
        <span class="upgrade-kicker">ONE UPGRADE ONLY</span>
        <h2>Bonk Stick</h2>
        <p class="upgrade-desc">Costs 3 coins ·<br/>Damage: <span id="damage-display">1</span></p>
        <button id="shop-btn" disabled>Need 3 more coins</button>
        <p class="hint">Tap the goblin. It knows what it did.</p>
      </div>
    </div>
  </div>
`;

  // 3. Initialize UI binding
  setupUI(controller);

  // 4. Initialize Phaser Game
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-canvas',
    width: 800,
    height: 600,
    backgroundColor: 'transparent',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [GameScene]
  };

  const game = new Phaser.Game(config);

  // Pass controller to scene
  game.scene.start('GameScene', { controller });
