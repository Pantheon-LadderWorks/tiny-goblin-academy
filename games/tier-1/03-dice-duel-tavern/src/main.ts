import Phaser from 'phaser';

import { DIE_SHEET_KEY, DIE_SHEET_URL } from './dierig/face-mapping';
import type { DieMotionMode } from './dierig/motion-plan';
import { LiveDieRigPresentation, type LiveDieRigSnapshot } from './live-dierig-presentation';
import { LiveDuelController } from './live-duel-controller';
import { createRuntimeRollSource } from './roll-source';
import type { Action } from './simulation';
import './styles.css';

const $ = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;
const parameters = new URLSearchParams(location.search);
const sourceSelection = createRuntimeRollSource({
  crypto: globalThis.crypto,
  isDevelopment: import.meta.env.DEV,
  search: location.search,
});
const requestedMode = parameters.get('motion');
const motionMode: DieMotionMode = import.meta.env.DEV && (requestedMode === 'full' || requestedMode === 'reduced')
  ? requestedMode
  : matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
const showDiagnostics = import.meta.env.DEV && parameters.get('dev') === '1';

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
          <span id="roll">Die ready</span>
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
        <button id="rollbtn" class="roll-action" type="button" disabled>Roll d6</button>
        <button data-a="attack" type="button" disabled>Attack</button>
        <button data-a="heal" type="button" disabled>Heal</button>
        <button data-a="block" type="button" disabled>Block</button>
      </section>

      <pre id="dev-diagnostics" class="dev-diagnostics" hidden></pre>

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

let controller: LiveDuelController | null = null;
let presentation: LiveDieRigPresentation | null = null;

const diagnostics = () => ({
  ready: Boolean(controller && presentation),
  source: sourceSelection.kind,
  controller: controller?.diagnostics ?? null,
  presentation: presentation?.snapshot() ?? null,
  state: controller?.state ?? null,
});

const renderDiagnostics = () => {
  if (!showDiagnostics) return;
  const panel = $('dev-diagnostics');
  panel.hidden = false;
  panel.textContent = JSON.stringify(diagnostics(), null, 2);
};

const render = () => {
  const state = controller?.state;
  if (!state) {
    $('rollbtn').toggleAttribute('disabled', true);
    renderDiagnostics();
    return;
  }
  $('turn').textContent = state.phase === 'roll'
    ? controller?.canRequestRoll ? 'YOUR TURN — ROLL' : 'DIE RETURNING'
    : state.phase === 'rolling'
      ? 'DICE IN MOTION'
      : state.phase === 'action'
        ? 'YOUR TURN — CHOOSE AN ACTION'
        : state.phase === 'won' ? 'VICTORY' : 'DEFEAT';
  $('php').textContent = `${state.playerHp}/10`;
  $('ehp').textContent = `${state.enemyHp}/10`;
  $('roll').textContent = state.phase === 'rolling'
    ? 'Result settling…'
    : state.phase === 'action' || state.phase === 'won' || state.phase === 'lost'
      ? state.roll ? `Rolled: ${state.roll}` : 'Final roll settled'
      : controller?.canRequestRoll ? 'Die ready' : 'Returning to cup';
  $('causal-feed').innerHTML = state.log.slice(-2).map((entry) => `<li>${entry}</li>`).join('');
  $('history-log').innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join('');
  $('result').textContent = state.phase === 'won'
    ? 'Goblin Brawler defeated! Victory!'
    : state.phase === 'lost' ? 'You were defeated.' : '';
  $('rollbtn').toggleAttribute('disabled', !controller?.canRequestRoll);
  document.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((button) => {
    button.disabled = !controller?.canChooseAction;
  });
  renderDiagnostics();
};

class DuelMotionSurface extends Phaser.Scene {
  constructor() { super('h6-11-live-dierig'); }
  preload() { this.load.image(DIE_SHEET_KEY, DIE_SHEET_URL); }
  create() {
    presentation = new LiveDieRigPresentation(
      this,
      DIE_SHEET_KEY,
      document.querySelector<HTMLElement>('.duel-stage')!,
      document.querySelector<HTMLElement>('.throw-zone')!,
      document.querySelector<HTMLElement>('.player-station')!,
    );
    controller = new LiveDuelController(sourceSelection.source, presentation, { motionMode, onChange: render });
    render();
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas',
  width: 1200,
  height: 650,
  transparent: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [DuelMotionSurface],
});

const setHistoryOpen = (open: boolean) => {
  $('history-panel').hidden = !open;
  $('history-toggle').setAttribute('aria-expanded', String(open));
};

$('rollbtn').onclick = () => controller?.requestRoll();
document.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((button) => {
  button.onclick = () => controller?.chooseAction(button.dataset.a as Action);
});
$('history-toggle').onclick = () => setHistoryOpen($('history-panel').hidden);
$('history-close').onclick = () => setHistoryOpen(false);
const handleKeydown = (event: KeyboardEvent) => { if (event.key === 'Escape') setHistoryOpen(false); };
window.addEventListener('keydown', handleKeydown);
window.addEventListener('beforeunload', () => {
  window.removeEventListener('keydown', handleKeydown);
  controller?.destroy();
  game.destroy(true);
}, { once: true });

declare global {
  interface Window {
    __TGA_DICE_DUEL_H6_11__?: {
      getDiagnostics: () => ReturnType<typeof diagnostics>;
      requestRoll: () => boolean;
      chooseAction: (action: Action) => boolean;
      freezeAtPhase: (phase: string) => void;
      resumePresentation: () => void;
    };
  }
}

window.__TGA_DICE_DUEL_H6_11__ = {
  getDiagnostics: diagnostics,
  requestRoll: () => controller?.requestRoll() ?? false,
  chooseAction: (action) => controller?.chooseAction(action) ?? false,
  freezeAtPhase: (phase) => {
    if (import.meta.env.DEV) presentation?.freezeAtPhase(phase as Parameters<LiveDieRigPresentation['freezeAtPhase']>[0]);
  },
  resumePresentation: () => { if (import.meta.env.DEV) presentation?.resumePresentation(); },
};

render();
