import Phaser from 'phaser';
import './style.css';
import { createAnchorBridge, type AnchorBridge } from './anchor-bridge';
import { isAnchorDebugEnabled, type AnchorSnapshot } from './anchors';
import {
  phasePresentation,
  renderHandCard,
  renderNextCard,
} from './card-view';
import {
  createCardGoblinLedger,
  publishCardGoblinTransition,
} from './ledger-bridge';
import {
  createGame,
  playCard,
  resolveSparkChoice,
  type GameState,
} from './simulation';

let state = createGame();
let anchorBridge: AnchorBridge | undefined;
let anchorSnapshot: AnchorSnapshot = Object.freeze({});

const debugAnchors = isAnchorDebugEnabled(window.location.search);
const ledger = createCardGoblinLedger({
  parent: window.parent === window ? null : window.parent,
});
const onHubLedgerMessage = (event: MessageEvent<unknown>): void => {
  if (event.source !== window.parent) return;
  ledger.handleHubMessage(event.data);
};
window.addEventListener('message', onHubLedgerMessage);

const duelTable = document.querySelector<HTMLElement>('#duel-table')!;
const hand = document.querySelector<HTMLElement>('#hand')!;
const next = document.querySelector<HTMLElement>('#next')!;
const banner = document.querySelector<HTMLElement>('#banner')!;
const phaseInstruction = document.querySelector<HTMLElement>('#phase-instruction')!;
const playerHp = document.querySelector<HTMLElement>('#player-hp')!;
const enemyHp = document.querySelector<HTMLElement>('#enemy-hp')!;
const playerEffects = document.querySelector<HTMLElement>('#player-effects')!;
const enemyEffects = document.querySelector<HTMLElement>('#enemy-effects')!;
const resolutionTitle = document.querySelector<HTMLElement>('#resolution-title')!;
const resolutionDetail = document.querySelector<HTMLElement>('#resolution-detail')!;
const terminalOutcome = document.querySelector<HTMLElement>('#terminal-outcome')!;
const terminalMessage = document.querySelector<HTMLElement>('#terminal-message')!;
const resetDuel = document.querySelector<HTMLButtonElement>('#reset-duel')!;
const handCount = document.querySelector<HTMLElement>('#hand-count')!;
const anchorStatus = document.querySelector<HTMLElement>('#anchor-status')!;

let stageGraphics: Phaser.GameObjects.Graphics;
let debugGraphics: Phaser.GameObjects.Graphics;
let debugLabels: Phaser.GameObjects.Text[] = [];

const clearDebugLabels = (): void => {
  for (const label of debugLabels) label.destroy();
  debugLabels = [];
};

const drawStage = (
  scene: Phaser.Scene,
  snapshot: AnchorSnapshot = anchorSnapshot,
): void => {
  const width = scene.scale.width;
  const height = scene.scale.height;
  const safeWidth = Math.max(0, width - 8);
  const safeHeight = Math.max(0, height - 8);

  stageGraphics.clear();
  stageGraphics.fillStyle(0x17101f, 1);
  stageGraphics.fillRoundedRect(4, 4, safeWidth, safeHeight, 28);
  stageGraphics.lineStyle(2, 0xb7834e, 0.82);
  stageGraphics.strokeRoundedRect(5, 5, Math.max(0, width - 10), Math.max(0, height - 10), 28);
  stageGraphics.lineStyle(1, 0xe7bd6b, 0.22);
  stageGraphics.strokeRoundedRect(11, 11, Math.max(0, width - 22), Math.max(0, height - 22), 22);

  const enemy = snapshot['enemy-center'];
  const enemyImpact = snapshot['enemy-impact'];
  const resolution = snapshot['resolution-center'];
  const played = snapshot['played-card'];
  const player = snapshot['player-center'];
  const deck = snapshot.deck;
  const discard = snapshot.discard;

  if (enemy && player) {
    const tableTop = Math.max(24, enemy.y - 56);
    const tableBottom = Math.min(height - 24, player.y + player.height + 58);
    stageGraphics.fillStyle(0x21152c, 0.94);
    stageGraphics.fillRoundedRect(24, tableTop, Math.max(0, width - 48), Math.max(0, tableBottom - tableTop), 22);
    stageGraphics.lineStyle(2, 0x75444b, 0.72);
    stageGraphics.strokeRoundedRect(24, tableTop, Math.max(0, width - 48), Math.max(0, tableBottom - tableTop), 22);

    stageGraphics.lineStyle(1, 0xe7bd6b, 0.18);
    stageGraphics.lineBetween(42, enemy.centerY + 42, width - 42, enemy.centerY + 42);
    stageGraphics.lineBetween(42, player.centerY - 42, width - 42, player.centerY - 42);
  }

  if (resolution) {
    const radius = Math.max(62, Math.min(112, Math.min(width, height) * 0.105));
    stageGraphics.lineStyle(2, 0xe7bd6b, 0.38);
    stageGraphics.strokeCircle(resolution.centerX, resolution.centerY, radius);
    stageGraphics.lineStyle(1, 0xb7834e, 0.48);
    stageGraphics.strokeCircle(resolution.centerX, resolution.centerY, radius * 0.72);
    stageGraphics.beginPath();
    stageGraphics.moveTo(resolution.centerX, resolution.centerY - radius * 0.88);
    stageGraphics.lineTo(resolution.centerX + radius * 0.88, resolution.centerY);
    stageGraphics.lineTo(resolution.centerX, resolution.centerY + radius * 0.88);
    stageGraphics.lineTo(resolution.centerX - radius * 0.88, resolution.centerY);
    stageGraphics.closePath();
    stageGraphics.strokePath();

    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      const inner = radius * 0.82;
      const outer = radius * 0.96;
      stageGraphics.lineBetween(
        resolution.centerX + Math.cos(angle) * inner,
        resolution.centerY + Math.sin(angle) * inner,
        resolution.centerX + Math.cos(angle) * outer,
        resolution.centerY + Math.sin(angle) * outer,
      );
    }
  }

  stageGraphics.lineStyle(2, 0xe7bd6b, 0.16);
  if (played) {
    for (let index = 0; index < 3; index += 1) {
      const slot = snapshot[`hand-slot-${index}`];
      if (!slot) continue;
      const shoulderY = played.centerY + Math.max(42, played.height * 0.42);
      stageGraphics.beginPath();
      stageGraphics.moveTo(slot.centerX, slot.y);
      stageGraphics.lineTo(slot.centerX, shoulderY);
      stageGraphics.lineTo(played.centerX, played.centerY);
      stageGraphics.strokePath();
    }
  }

  if (played && enemyImpact) {
    const midpointY = (played.centerY + enemyImpact.centerY) / 2;
    stageGraphics.beginPath();
    stageGraphics.moveTo(played.centerX, played.centerY);
    stageGraphics.lineTo(played.centerX, midpointY);
    stageGraphics.lineTo(enemyImpact.centerX, enemyImpact.centerY);
    stageGraphics.strokePath();
  }

  for (const well of [deck, discard]) {
    if (!well) continue;
    stageGraphics.lineStyle(1, 0xe7bd6b, 0.26);
    stageGraphics.strokeRoundedRect(well.x - 6, well.y - 6, well.width + 12, well.height + 12, 12);
  }
};

const drawAnchorDebug = (scene: Phaser.Scene, snapshot: AnchorSnapshot): void => {
  debugGraphics.clear();
  clearDebugLabels();
  if (!debugAnchors) return;

  debugGraphics.lineStyle(2, 0x65d9ff, 0.9);
  debugGraphics.fillStyle(0x10131a, 0.82);
  for (const [id, anchor] of Object.entries(snapshot)) {
    debugGraphics.fillCircle(anchor.centerX, anchor.centerY, 5);
    debugGraphics.strokeRect(anchor.x, anchor.y, anchor.width, anchor.height);
    const label = scene.add.text(anchor.centerX + 8, anchor.centerY - 8, id, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#65d9ff',
      backgroundColor: '#10131acc',
      padding: { x: 3, y: 2 },
    }).setDepth(1000);
    debugLabels.push(label);
  }
};

const receiveAnchorSnapshot = (scene: Phaser.Scene, snapshot: AnchorSnapshot): void => {
  anchorSnapshot = snapshot;
  drawStage(scene, snapshot);
  drawAnchorDebug(scene, snapshot);
  anchorStatus.textContent = `${Object.keys(snapshot).length} presentation anchors resolved${debugAnchors ? ' · markers visible' : ''}.`;
};

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage-canvas',
  width: 1200,
  height: 760,
  transparent: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  scene: {
    create() {
      const scene = this as Phaser.Scene;
      stageGraphics = scene.add.graphics().setDepth(0);
      debugGraphics = scene.add.graphics().setDepth(999);
      drawStage(scene);

      scene.scale.on('resize', () => {
        drawStage(scene, anchorSnapshot);
        anchorBridge?.refresh();
      });

      anchorBridge = createAnchorBridge({
        root: duelTable,
        canvas: game.canvas,
        onSnapshot: (snapshot) => receiveAnchorSnapshot(scene, snapshot),
        onError: (error) => {
          anchorStatus.textContent = `Anchor bridge unavailable: ${error.message}`;
          anchorStatus.classList.add('anchor-error');
        },
      });
    },
  },
});

const effectSummary = (current: GameState): string => {
  const effects: string[] = [];
  if (current.guard > 0) effects.push(`Guard ${current.guard}`);
  if (current.stun) effects.push('Stun armed');
  return effects.length > 0 ? effects.join(' · ') : 'No active guard or stun.';
};

const enemySummary = (current: GameState): string => {
  if (current.phase === 'Terminal') {
    return current.enemyHp <= 0 ? 'Defeated.' : 'Duel complete.';
  }
  if (current.phase === 'SparkChoice') return 'Waiting for your replacement choice.';
  return 'Ready to answer your play.';
};

const resolutionCopy = (current: GameState): Readonly<{ title: string; detail: string }> => {
  const latest = current.log.at(-1) ?? 'The table is waiting.';
  if (current.phase === 'SparkChoice') {
    return { title: 'Spark is suspended over the table.', detail: latest };
  }
  if (current.phase === 'Terminal') {
    return { title: current.enemyHp <= 0 ? 'The Card Goblin falls.' : 'Your hand goes still.', detail: latest };
  }
  return { title: current.log.length === 1 ? 'The table is waiting.' : 'The exchange resolves.', detail: latest };
};

const bindCardActions = (): void => {
  document.querySelectorAll<HTMLButtonElement>('#hand .card-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.i);
      if (!Number.isInteger(index)) return;

      const before = state;
      const selectedCard = before.hand[index];
      if (!selectedCard) return;

      state = before.phase === 'SparkChoice'
        ? resolveSparkChoice(before, index)
        : playCard(before, index);
      publishCardGoblinTransition(ledger, {
        before,
        after: state,
        action: before.phase === 'SparkChoice'
          ? { type: 'spark-replacement', card: selectedCard, handIndex: index }
          : { type: 'play-card', card: selectedCard, handIndex: index },
      });
      render(Math.min(index, Math.max(0, state.hand.length - 1)));
    });
  });
};

const restoreCardFocus = (index: number | undefined): void => {
  if (index === undefined || state.phase === 'Terminal') return;
  queueMicrotask(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('#hand .card-btn:not([disabled])');
    buttons[Math.min(index, buttons.length - 1)]?.focus();
  });
};

const render = (focusIndex?: number): void => {
  const phase = phasePresentation(state.phase, state.playerHp);
  document.body.className = `${phase.bodyClass}${debugAnchors ? ' anchor-debug' : ''}`;
  banner.textContent = phase.banner;
  phaseInstruction.textContent = phase.instruction;

  playerHp.textContent = `${Math.max(0, state.playerHp)} / 10 HP`;
  enemyHp.textContent = `${Math.max(0, state.enemyHp)} / 12 HP`;
  playerEffects.textContent = effectSummary(state);
  enemyEffects.textContent = enemySummary(state);

  const resolution = resolutionCopy(state);
  resolutionTitle.textContent = resolution.title;
  resolutionDetail.textContent = resolution.detail;

  hand.innerHTML = state.hand
    .map((card, index) => renderHandCard(card, index, state.phase))
    .join('');
  handCount.textContent = `${state.hand.length} card${state.hand.length === 1 ? '' : 's'}`;
  next.innerHTML = renderNextCard(state.queue[0]);

  const terminal = state.phase === 'Terminal';
  terminalOutcome.hidden = !terminal;
  terminalMessage.textContent = terminal
    ? state.enemyHp <= 0
      ? 'Victory — the Card Goblin is defeated.'
      : 'Defeat — the Card Goblin wins this duel.'
    : '';

  bindCardActions();
  restoreCardFocus(focusIndex);
  anchorBridge?.refresh();
};

resetDuel.addEventListener('click', () => {
  state = createGame();
  ledger.reset();
  render(0);
});

render();

window.addEventListener('beforeunload', () => {
  window.removeEventListener('message', onHubLedgerMessage);
  anchorBridge?.destroy();
  game.destroy(true);
});
