import Phaser from 'phaser';

import { createRoundController } from './controller';
import { PotionScene } from './potion-scene';
import type { RoundState } from './simulation';
import './styles.css';

const controller = createRoundController();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <div class="masthead">
      <div class="eyebrow">TINY GOBLIN ACADEMY · LEVEL 02</div>
      <h1>Potion Sorter</h1>
      <p class="objective">Sort the correctly colored potions into the cauldron. You have 30 seconds.</p>
    </div>
    
    <div class="game-layout">
      <div class="stat-stack">
        <div class="stat-card">
          <span>Time</span>
          <strong id="timer">30s</strong>
        </div>
        <div class="stat-card">
          <span>Score</span>
          <strong id="score">0</strong>
        </div>
        <div class="stat-card">
          <span>Combo</span>
          <strong id="combo">×1</strong>
        </div>
      </div>
      
      <div class="playfield-wrap">
        <div id="game-canvas"></div>
        <p id="instruction" class="instruction">Sort the potions!</p>
        <div id="round-result" class="round-result" hidden></div>
      </div>
      
      <div class="how-to">
        <span class="how-to-kicker">HOW TO PLAY</span>
        <ol>
            <li>Check the cauldron color</li>
            <li>Find matching potions</li>
            <li>Drag them in before time runs out</li>
        </ol>
        <p class="hint">Wrong color breaks your combo.</p>
      </div>
    </div>
  </div>
`;

const timer = document.querySelector<HTMLElement>('#timer');
const score = document.querySelector<HTMLElement>('#score');
const combo = document.querySelector<HTMLElement>('#combo');
const instruction = document.querySelector<HTMLElement>('#instruction');
const roundResult = document.querySelector<HTMLElement>('#round-result');

if (!timer || !score || !combo || !instruction || !roundResult) {
  throw new Error('Potion Sorter DOM shell is incomplete.');
}

const updateHud = (state: RoundState) => {
  timer.textContent = `${state.timeRemaining}s`;
  score.textContent = String(state.score);
  combo.textContent = `×${state.combo}`;
  instruction.textContent = state.feedback;
  roundResult.hidden = !state.roundComplete;
  roundResult.textContent = state.roundComplete ? `Round complete · ${state.score} points` : '';
};

controller.subscribe(updateHud);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas',
  backgroundColor: '#1a1527',
  scene: [new PotionScene(controller)],
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
  }
});

window.setInterval(() => {
  if (!controller.getState().roundComplete) controller.advanceTime(1);
}, 1000);
