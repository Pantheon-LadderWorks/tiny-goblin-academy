import './style.css';
import '../../../../assets/academy/fonts/runtime/academy-typography.css';
import '../../../../assets/academy/ui/runtime/academy-shared-host-surfaces.css';
import Phaser from 'phaser';
import { GameController } from './controller';
import { GameScene } from './scenes/GameScene';
import { setupUI } from './ui';
import { waitForAcademyFonts } from '../../../../assets/academy/fonts/runtime/academy-typography';
import {
  academyCssVariablesToString,
  bindAcademyHostSurfaceFallbacks,
  getAcademyHostSurface,
  getAcademyHostSurfaceCssVariables,
  getAcademyHostSurfaceSlotCssVariables,
} from '../../../../assets/academy/ui/runtime/academy-shared-host-surfaces';

// 1. Initialize Controller
const controller = new GameController();

const victorySurface = getAcademyHostSurface('ui-hud.frame-large.teal')!;
const upgradeLabelSurface = getAcademyHostSurface('ui-hud.paper-label.small')!;
const surfaceStyle = (surface: typeof victorySurface) => academyCssVariablesToString(getAcademyHostSurfaceCssVariables(surface));
const slotStyle = (surface: typeof victorySurface, name: string) => {
  const slot = surface.slots.find((candidate) => candidate.name === name);
  if (!slot) throw new Error(`Missing Academy host-surface slot: ${surface.id}.${name}`);
  return academyCssVariablesToString(getAcademyHostSurfaceSlotCssVariables(slot));
};

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
          <div class="victory-panel academy-host-surface" data-academy-host-surface="${victorySurface.id}" data-region-index="20" data-asset-state="loaded" style="${surfaceStyle(victorySurface)}">
            <img class="academy-host-surface__asset" data-academy-host-asset src="${victorySurface.assetUrl}" alt="" aria-hidden="true">
            <div class="academy-host-surface__slot victory-title-slot" data-slot="title" style="${slotStyle(victorySurface, 'title')}">
              <h1 class="victory-title" data-typography-role="result-state" data-typography-recipe="result-on-teal-frame">Academy Graduate!</h1>
            </div>
            <div class="academy-host-surface__slot victory-body-slot" data-slot="body" style="${slotStyle(victorySurface, 'body')}">
              <div class="victory-text" data-typography-role="body-instruction" data-typography-recipe="body-on-parchment">You survived 10 overly enthusiastic goblins.</div>
            </div>
            <div class="academy-host-surface__slot victory-footer-slot" data-slot="footer" style="${slotStyle(victorySurface, 'footer')}">
              <div class="victory-footer" data-typography-role="compact-label" data-typography-recipe="badge-label-on-paper">10 / 10 GOBLINS · COURSE COMPLETE</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="feedback-layer" aria-live="polite">
        <p class="instruction" data-typography-role="optional-game-accent">Bonk the goblin!</p>
      </div>

      <div class="action-layer" aria-label="Upgrade actions">
        <div class="upgrade-card">
          <div class="upgrade-label-surface academy-host-surface" data-academy-host-surface="${upgradeLabelSurface.id}" data-region-index="30" data-asset-state="loaded" style="${surfaceStyle(upgradeLabelSurface)}">
            <img class="academy-host-surface__asset" data-academy-host-asset src="${upgradeLabelSurface.assetUrl}" alt="" aria-hidden="true">
            <div class="academy-host-surface__slot" data-slot="label" style="${slotStyle(upgradeLabelSurface, 'label')}">
              <span class="upgrade-kicker" data-typography-role="compact-label" data-typography-recipe="badge-label-on-paper">ONE UPGRADE</span>
            </div>
          </div>
          <h2 data-typography-role="panel-heading">Bonk Stick</h2>
          <p class="upgrade-desc" data-typography-role="body-instruction">Costs 3 coins · doubles your bonk power.</p>
          <button id="shop-btn" data-typography-role="compact-label" disabled>Need 3 more coins</button>
          <p class="hint" data-typography-role="body-instruction">Tap the goblin. It knows what it did.</p>
        </div>
      </div>
    </div>
  </div>
`;

bindAcademyHostSurfaceFallbacks();

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
