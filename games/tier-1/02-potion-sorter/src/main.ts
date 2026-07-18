import Phaser from 'phaser';

import '../../../../assets/academy/fonts/runtime/academy-typography.css';
import '../../../../assets/academy/ui/runtime/academy-shared-host-surfaces.css';
import { waitForAcademyFonts } from '../../../../assets/academy/fonts/runtime/academy-typography';
import {
  academyCssVariablesToString,
  bindAcademyHostSurfaceFallbacks,
  getAcademyHostSurface,
  getAcademyHostSurfaceCssVariables,
  getAcademyHostSurfaceSlotCssVariables
} from '../../../../assets/academy/ui/runtime/academy-shared-host-surfaces';
import { createRoundController } from './controller';
import { PotionScene } from './potion-scene';
import type { RoundState } from './simulation';
import './styles.css';

const controller = createRoundController();
const resultSurface = getAcademyHostSurface('ui-hud.frame-large.teal')!;
const resultSurfaceStyle = academyCssVariablesToString(getAcademyHostSurfaceCssVariables(resultSurface));
const resultSlotStyle = (name: string) => {
  const slot = resultSurface.slots.find((candidate) => candidate.name === name);
  if (!slot) throw new Error(`Missing Academy host-surface slot: ${resultSurface.id}.${name}`);
  return academyCssVariablesToString(getAcademyHostSurfaceSlotCssVariables(slot));
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <div class="masthead">
      <div class="eyebrow" data-typography-role="compact-label">TINY GOBLIN ACADEMY · LEVEL 02</div>
      <h1 data-typography-role="game-title">Potion Sorter</h1>
      <p class="objective" data-typography-role="body-instruction">Select each potion, then send it to the matching destination before time runs out.</p>
    </div>

    <div class="game-stage" aria-label="Potion Sorter game stage">
      <div class="hud-layer" aria-label="Current round status">
        <div class="stat-card">
          <span data-typography-role="compact-label">Time</span>
          <strong id="timer" data-typography-role="data-value">30s</strong>
        </div>
        <div class="stat-card">
          <span data-typography-role="compact-label">Score</span>
          <strong id="score" data-typography-role="data-value">0</strong>
        </div>
        <div class="stat-card">
          <span data-typography-role="compact-label">Combo</span>
          <strong id="combo" data-typography-role="data-value">×1</strong>
        </div>
      </div>

      <div class="play-surface">
        <div id="game-canvas"></div>
      </div>

      <div class="feedback-layer" aria-live="polite">
        <p id="instruction" class="instruction" data-typography-role="optional-game-accent">Sort the potions!</p>
        <div id="round-result" class="round-result academy-host-surface" data-academy-host-surface="${resultSurface.id}" data-region-index="20" data-asset-state="loaded" style="${resultSurfaceStyle}" hidden>
          <img class="academy-host-surface__asset" data-academy-host-asset src="${resultSurface.assetUrl}" alt="" aria-hidden="true">
          <div class="academy-host-surface__slot" data-slot="title" style="${resultSlotStyle('title')}">
            <h2 id="round-result-title" class="round-result-title" data-typography-role="result-state" data-typography-recipe="result-on-teal-frame">Alchemy Complete!</h2>
          </div>
          <div class="academy-host-surface__slot" data-slot="body" style="${resultSlotStyle('body')}">
            <p id="round-result-score" class="round-result-score" data-typography-role="body-instruction" data-typography-recipe="body-on-parchment">Final score · 0 points</p>
          </div>
          <div class="academy-host-surface__slot" data-slot="footer" style="${resultSlotStyle('footer')}">
            <p id="round-result-footer" class="round-result-footer" data-typography-role="compact-label">ALCHEMY SHIFT COMPLETE</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const timer = document.querySelector<HTMLElement>('#timer');
const score = document.querySelector<HTMLElement>('#score');
const combo = document.querySelector<HTMLElement>('#combo');
const instruction = document.querySelector<HTMLElement>('#instruction');
const roundResult = document.querySelector<HTMLElement>('#round-result');
const roundResultTitle = document.querySelector<HTMLElement>('#round-result-title');
const roundResultScore = document.querySelector<HTMLElement>('#round-result-score');
const roundResultFooter = document.querySelector<HTMLElement>('#round-result-footer');

if (!timer || !score || !combo || !instruction || !roundResult || !roundResultTitle || !roundResultScore || !roundResultFooter) {
  throw new Error('Potion Sorter DOM shell is incomplete.');
}

const updateHud = (state: RoundState) => {
  timer.textContent = `${state.timeRemaining}s`;
  score.textContent = String(state.score);
  combo.textContent = `×${state.combo}`;
  instruction.textContent = state.feedback;
  instruction.hidden = state.roundComplete;
  roundResult.hidden = !state.roundComplete;
  roundResultTitle.textContent = state.timeRemaining > 0 ? 'Alchemy Complete!' : 'Shift Ended!';
  roundResultScore.textContent = `Final score · ${state.score} points`;
  roundResultFooter.textContent = state.timeRemaining > 0 ? 'ALL POTIONS PROCESSED · SHIFT COMPLETE' : 'TIMER EXPIRED · POTIONS REMAIN';
};

controller.subscribe(updateHud);
bindAcademyHostSurfaceFallbacks();

async function bootGame() {
  const fontLoadResults = await waitForAcademyFonts();
  (window as typeof window & { __TGA_FONT_LOAD_RESULTS__?: typeof fontLoadResults }).__TGA_FONT_LOAD_RESULTS__ = fontLoadResults;

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
}

void bootGame();

window.setInterval(() => {
  if (!controller.getState().roundComplete) controller.advanceTime(1);
}, 1000);
