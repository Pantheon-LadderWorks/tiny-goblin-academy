import Phaser from 'phaser';

import { act, createDuel, roll, type Action } from './simulation';
import './styles.css';

let state = createDuel();
const $ = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <header class="masthead">
      <div class="eyebrow">TINY GOBLIN ACADEMY · LEVEL 03</div>
      <h1>Dice Duel Tavern</h1>
      <p class="objective">One die. One brawler. Settle the argument across the tavern table.</p>
    </header>

    <main class="duel-stage" aria-label="Dice Duel Tavern game stage">
      <div class="tavern-backdrop" aria-hidden="true">
        <div class="backdrop-beam backdrop-beam-left"></div>
        <div class="backdrop-beam backdrop-beam-right"></div>
        <div class="tavern-sign">
          <span>THE CROOKED SIX</span>
          <small>ALE · DICE · BAD ADVICE</small>
        </div>
        <div class="tavern-shelf tavern-shelf-left"><span></span><span></span><span></span></div>
        <div class="peg-rack"><i></i><i></i><i></i></div>
        <div class="barrel-stack"><i></i><i></i><i></i></div>
        <div class="lantern-glow lantern-glow-left"></div>
        <div class="lantern-glow lantern-glow-right"></div>
      </div>
      <div class="table-surface" aria-hidden="true"></div>
      <div class="table-station player-station" aria-hidden="true">
        <div class="dice-cup"></div>
        <div class="wager-stack"><i></i><i></i><i></i></div>
        <span>YOUR WAGER</span>
      </div>
      <div class="table-station opponent-station" aria-hidden="true">
        <div class="tankard"><i></i></div>
        <div class="wager-stack"><i></i><i></i><i></i></div>
        <span>BRAWLER'S CORNER</span>
      </div>
      <div class="throw-zone" aria-hidden="true">
        <span class="tray-title">HOUSE ROLL</span>
        <div class="tray-landing-mark"><i></i><i></i><i></i><i></i></div>
        <small>ONE DIE SETTLES IT</small>
      </div>

      <div id="game-canvas" class="play-surface" aria-hidden="true"></div>

      <section class="duel-hud" aria-label="Current duel status">
        <div class="duelist-card player-card">
          <span class="duelist-kicker">PLAYER</span>
          <strong>YOU</strong>
          <div class="hp-line"><span>HP</span><b id="php">10/10</b></div>
        </div>

        <div class="turn-card" aria-live="polite">
          <strong id="turn">YOUR TURN — ROLL</strong>
          <span id="roll">Roll pending</span>
        </div>

        <div class="duelist-card enemy-card">
          <span class="duelist-kicker">OPPONENT</span>
          <strong>GOBLIN BRAWLER</strong>
          <div class="hp-line"><span>HP</span><b id="ehp">10/10</b></div>
        </div>
      </section>

      <section class="causal-feed-panel" aria-label="Latest combat events">
        <div class="causal-feed-heading">
          <span>LAST EXCHANGE</span>
          <button id="history-toggle" class="history-toggle" type="button" aria-controls="history-panel" aria-expanded="false">History</button>
        </div>
        <ol id="causal-feed" class="causal-feed"></ol>
      </section>

      <div id="result" class="result-banner" role="status" aria-live="assertive"></div>

      <section class="action-dock" aria-label="Duel actions">
        <button id="rollbtn" class="roll-action" type="button">Roll d6</button>
        <button data-a="attack" type="button">Attack</button>
        <button data-a="heal" type="button">Heal</button>
        <button data-a="block" type="button">Block</button>
      </section>

      <section id="history-panel" class="history-panel" role="dialog" aria-label="Complete combat history" hidden>
        <div class="history-heading">
          <div>
            <span>DUEL RECORD</span>
            <strong>Combat History</strong>
          </div>
          <button id="history-close" type="button" aria-label="Close combat history">Close</button>
        </div>
        <ol id="history-log" class="history-log"></ol>
      </section>
    </main>
  </div>
`;

class DuelMotionSurface extends Phaser.Scene {}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas',
  width: 1200,
  height: 650,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [DuelMotionSurface],
});

const setHistoryOpen = (open: boolean) => {
  $('history-panel').hidden = !open;
  $('history-toggle').setAttribute('aria-expanded', String(open));
};

const render = () => {
  $('turn').textContent = state.phase === 'roll'
    ? 'YOUR TURN — ROLL'
    : state.phase === 'action'
      ? 'YOUR TURN — CHOOSE AN ACTION'
      : state.phase === 'won'
        ? 'VICTORY'
        : 'DEFEAT';
  $('php').textContent = `${state.playerHp}/10`;
  $('ehp').textContent = `${state.enemyHp}/10`;
  $('roll').textContent = state.roll ? `Rolled: ${state.roll}` : 'Roll pending';

  $('causal-feed').innerHTML = state.log.slice(-2).map((entry) => `<li>${entry}</li>`).join('');
  $('history-log').innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join('');
  $('result').textContent = state.phase === 'won'
    ? 'Goblin Brawler defeated! Victory!'
    : state.phase === 'lost'
      ? 'You were defeated.'
      : '';

  $('rollbtn').toggleAttribute('disabled', state.phase !== 'roll');
  document.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((button) => {
    button.disabled = state.phase !== 'action';
  });
};

$('rollbtn').onclick = () => {
  state = roll(state);
  render();
};

document.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((button) => {
  button.onclick = () => {
    state = act(state, button.dataset.a as Action);
    render();
  };
});

$('history-toggle').onclick = () => setHistoryOpen($('history-panel').hidden);
$('history-close').onclick = () => setHistoryOpen(false);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setHistoryOpen(false);
});

render();
