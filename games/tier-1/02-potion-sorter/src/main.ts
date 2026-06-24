import Phaser from 'phaser';

import { createRoundController } from './controller';
import { PotionScene } from './potion-scene';
import type { RoundState } from './simulation';
import './styles.css';

const controller = createRoundController();
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
