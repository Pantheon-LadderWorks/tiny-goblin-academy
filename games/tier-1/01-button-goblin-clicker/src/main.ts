import './style.css';
import '../../../../assets/academy/fonts/runtime/academy-typography.css';
import Phaser from 'phaser';
import { GameController } from './controller';
import { GameScene } from './scenes/GameScene';
import { setupUI } from './ui';
import { waitForAcademyFonts } from '../../../../assets/academy/fonts/runtime/academy-typography';

// 1. Initialize Controller
const controller = new GameController();

// 2. Inject DOM UI
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <div class="masthead">
      <div class="eyebrow" data-typography-role="compact-label">TINY GOBLIN ACADEMY · LEVEL 01</div>
      <h1 data-typography-role="game-title">Button Goblin Clicker</h1>
      <p class="objective" data-typography-role="body-instruction">Bonk 10 goblins. Buy one upgrade. Earn your extremely small legend.</p>
    </div>
    
    <div class="game-stage" aria-label="Button Goblin Clicker game stage">
      <div class="hud-layer" aria-label="Current game status">
        <div class="stat-card">
          <span data-typography-role="compact-label">Goblin</span>
          <strong id="goblin-display" data-typography-role="data-value">1 / 10</strong>
        </div>
        <div class="stat-card">
          <span data-typography-role="compact-label">Goblin HP</span>
          <strong id="hp-display" data-typography-role="data-value">5 / 5</strong>
        </div>
        <div class="stat-card">
          <span data-typography-role="compact-label">Coins</span>
          <strong id="coins-display" class="coins" data-typography-role="data-value">0</strong>
        </div>
        <div class="stat-card">
          <span data-typography-role="compact-label">Bonk Power</span>
          <strong id="damage-display" data-typography-role="data-value">1</strong>
        </div>
      </div>
      
      <div class="play-surface">
        <div id="game-canvas"></div>
        
        <div id="victory-overlay" class="victory-overlay">
          <div class="victory-panel">
            <h1 class="victory-title" data-typography-role="result-state">Academy Graduate!</h1>
            <div class="victory-text" data-typography-role="body-instruction">You survived 10 overly enthusiastic goblins.</div>
          </div>
        </div>
      </div>
      
      <div class="feedback-layer" aria-live="polite">
        <p class="instruction" data-typography-role="optional-game-accent">Bonk the goblin!</p>
      </div>

      <div class="action-layer" aria-label="Upgrade actions">
        <div class="upgrade-card">
          <span class="upgrade-kicker" data-typography-role="compact-label">ONE UPGRADE ONLY</span>
          <h2 data-typography-role="panel-heading">Bonk Stick</h2>
          <p class="upgrade-desc" data-typography-role="body-instruction">Costs 3 coins · doubles your bonk power.</p>
          <button id="shop-btn" data-typography-role="compact-label" disabled>Need 3 more coins</button>
          <p class="hint" data-typography-role="body-instruction">Tap the goblin. It knows what it did.</p>
        </div>
      </div>
    </div>
  </div>
`;

async function bootGame() {
  // 3. Initialize UI binding
  setupUI(controller);

  // 4. Resolve canonical local faces before Phaser rasterizes text.
  const fontLoadResults = await waitForAcademyFonts();
  (window as typeof window & { __TGA_FONT_LOAD_RESULTS__?: typeof fontLoadResults }).__TGA_FONT_LOAD_RESULTS__ = fontLoadResults;

  // 5. Initialize Phaser Game
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
}

void bootGame();
