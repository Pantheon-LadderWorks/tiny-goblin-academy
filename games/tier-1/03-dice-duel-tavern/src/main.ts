import Phaser from 'phaser';

import '../../../../assets/academy/fonts/runtime/academy-typography.css';
import { waitForAcademyFonts } from '../../../../assets/academy/fonts/runtime/academy-typography';
import { DIE_SHEET_KEY, DIE_SHEET_URL } from './dierig/face-mapping';
import type { DieMotionMode } from './dierig/motion-plan';
import { LiveDieRigPresentation, type LiveDieRigSnapshot } from './live-dierig-presentation';
import { LiveDuelController } from './live-duel-controller';
import { createRuntimeRollSource } from './roll-source';
import type { Action } from './simulation';
import {
  bindTavernMaterialVariables,
  PROMOTED_REGION_IDS,
  PROMOTED_REGIONS,
  REJECTED_PROP_DECISIONS,
  REJECTED_REGION_IDS,
  renderMappedRegion,
  TAVERN_MATERIAL_URLS,
} from './tavern-visual-authority';
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

bindTavernMaterialVariables();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <header class="masthead">
      <div class="eyebrow" data-typography-role="compact-label">TINY GOBLIN ACADEMY · LEVEL 03</div>
      <h1 data-typography-role="game-title">Dice Duel Tavern</h1>
      <p class="objective" data-typography-role="body-instruction">One die. One brawler. Settle the argument across the tavern table.</p>
    </header>

    <main class="duel-stage" aria-label="Dice Duel Tavern game stage">
      <div class="tavern-backdrop" aria-hidden="true">
        <div class="backdrop-beam backdrop-beam-left"></div>
        <div class="backdrop-beam backdrop-beam-right"></div>
        <div class="tavern-sign">
          <span data-typography-role="panel-heading">THE CROOKED SIX</span>
          <small data-typography-role="compact-label">ALE · DICE · BAD ADVICE</small>
        </div>
        <div class="tavern-shelf tavern-shelf-left"><span></span><span></span><span></span>${renderMappedRegion(PROMOTED_REGIONS.candle, 'wall-candle')}</div>
        <div class="peg-rack"><i></i><i></i><i></i></div>
        <div class="barrel-stack"><i></i><i></i><i></i></div>
        <div class="lantern-glow lantern-glow-left"></div>
        <div class="lantern-glow lantern-glow-right"></div>
      </div>
      <div class="table-surface" aria-hidden="true"></div>
      <div class="table-station player-station" aria-hidden="true">
        <div class="dice-cup">${renderMappedRegion(PROMOTED_REGIONS.playerCup, 'station-cup')}</div>
        <div class="wager-stack">${renderMappedRegion(PROMOTED_REGIONS.wagerCoins, 'station-coins')}</div>
        <span data-typography-role="compact-label">YOUR WAGER</span>
      </div>
      <div class="table-station opponent-station" aria-hidden="true">
        <div class="tankard">${renderMappedRegion(PROMOTED_REGIONS.opponentMug, 'station-mug')}</div>
        <div class="wager-stack">${renderMappedRegion(PROMOTED_REGIONS.wagerCoins, 'station-coins')}</div>
        <span data-typography-role="compact-label">BRAWLER'S CORNER</span>
      </div>
      <div class="throw-zone" aria-hidden="true">
        <span class="tray-title" data-typography-role="compact-label">HOUSE ROLL</span>
        <div class="tray-landing-mark"><i></i><i></i><i></i><i></i></div>
        <small data-typography-role="compact-label">ONE DIE SETTLES IT</small>
      </div>

      <div id="game-canvas" class="play-surface" aria-hidden="true"></div>

      <section class="duel-hud" aria-label="Current duel status">
        <div class="duelist-card player-card">
          <span class="duelist-kicker" data-typography-role="compact-label">PLAYER</span>
          <strong data-typography-role="dialogue-title">YOU</strong>
          <div class="hp-line"><span data-typography-role="compact-label">HP</span><b id="php" data-typography-role="data-value">10/10</b></div>
        </div>

        <div class="turn-card" aria-live="polite">
          <strong id="turn" data-typography-role="panel-heading">YOUR TURN — ROLL</strong>
          <span id="roll" data-typography-role="compact-label">Die ready</span>
        </div>

        <div class="duelist-card enemy-card">
          <span class="duelist-kicker" data-typography-role="compact-label">OPPONENT</span>
          <strong data-typography-role="dialogue-title">GOBLIN BRAWLER</strong>
          <div class="hp-line"><span data-typography-role="compact-label">HP</span><b id="ehp" data-typography-role="data-value">10/10</b></div>
        </div>
      </section>

      <section class="causal-feed-panel" aria-label="Latest combat events">
        <div class="causal-feed-heading">
          <span data-typography-role="compact-label">LAST EXCHANGE</span>
          <button id="history-toggle" class="history-toggle" type="button" aria-controls="history-panel" aria-expanded="false" data-typography-role="compact-label">History</button>
        </div>
        <ol id="causal-feed" class="causal-feed" data-typography-role="dialogue-speech"></ol>
      </section>

      <div id="result" class="result-banner" role="status" aria-live="assertive" hidden>
        <strong id="result-heading" data-typography-role="result-state"></strong>
        <span id="result-copy" data-typography-role="body-instruction"></span>
      </div>

      <section class="action-dock" aria-label="Duel actions">
        <button id="rollbtn" class="roll-action" type="button" disabled data-typography-role="compact-label"><span>Roll d6</span></button>
        <button data-a="attack" type="button" disabled data-typography-role="compact-label">${renderMappedRegion(PROMOTED_REGIONS.attack, 'action-token')}<span>Attack</span></button>
        <button data-a="heal" type="button" disabled data-typography-role="compact-label">${renderMappedRegion(PROMOTED_REGIONS.heal, 'action-token')}<span>Heal</span></button>
        <button data-a="block" type="button" disabled data-typography-role="compact-label">${renderMappedRegion(PROMOTED_REGIONS.block, 'action-token')}<span>Block</span></button>
      </section>

      <pre id="dev-diagnostics" class="dev-diagnostics" data-typography-role="debug-information" hidden></pre>

      <section id="history-panel" class="history-panel" role="dialog" aria-label="Complete combat history" hidden>
        <div class="history-heading">
          <div>
            <span data-typography-role="compact-label">DUEL RECORD</span>
            <strong data-typography-role="dialogue-title">Combat History</strong>
          </div>
          <button id="history-close" type="button" aria-label="Close combat history" data-typography-role="compact-label">Close</button>
        </div>
        <ol id="history-log" class="history-log" data-typography-role="dialogue-speech"></ol>
      </section>
    </main>
  </div>
`;

let controller: LiveDuelController | null = null;
let presentation: LiveDieRigPresentation | null = null;

const diagnostics = () => ({
  ready: Boolean(controller && presentation),
  source: sourceSelection.kind,
  visualAuthority: {
    promotedRegionIds: PROMOTED_REGION_IDS,
    rejectedRegionIds: REJECTED_REGION_IDS,
    rejectedPropDecisions: REJECTED_PROP_DECISIONS,
    materialUrls: TAVERN_MATERIAL_URLS,
  },
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
  const result = $('result');
  const isTerminal = state.phase === 'won' || state.phase === 'lost';
  result.hidden = !isTerminal;
  if (isTerminal) {
    result.dataset.outcome = state.phase;
    $('result-heading').textContent = state.phase === 'won' ? 'TAVERN VICTORY!' : 'DUEL DEFEAT';
    $('result-copy').textContent = state.phase === 'won'
      ? 'Goblin Brawler defeated. The Crooked Six honors the roll.'
      : 'The Goblin Brawler takes this round.';
  } else {
    delete result.dataset.outcome;
    $('result-heading').textContent = '';
    $('result-copy').textContent = '';
  }
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

let game: Phaser.Game | null = null;

const boot = async () => {
  await waitForAcademyFonts();
  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-canvas',
    width: 1200,
    height: 650,
    transparent: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [DuelMotionSurface],
  });
};

void boot();

const setHistoryOpen = (open: boolean) => {
  $('history-panel').hidden = !open;
  $('history-toggle').setAttribute('aria-expanded', String(open));
  if (open) $('history-close').focus();
  else $('history-toggle').focus();
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
  game?.destroy(true);
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
