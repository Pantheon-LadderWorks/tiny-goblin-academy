import Phaser from 'phaser';
import tabletopSceneUrl from '../../../../assets/academy/games/card-goblin-duel/backgrounds/tga-card-goblin-duel-tabletop-scene-v0.1.png?url';
import cardFrameSheetUrl from '../../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png?url';
import cardTokenSheetUrl from '../../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png?url';
import './style.css';
import { createAnchorBridge, type AnchorBridge } from './anchor-bridge';
import { isAnchorDebugEnabled, type AnchorSnapshot } from './anchors';
import { CARD_EFFECT_TOKEN_SHEET_TEXTURE, PhaserCardEffectPort } from './card-effect-phaser';
import { buildCombatFeedbackPlan, type CombatFeedbackPlan } from './combat-feedback';
import { DomCombatFeedbackController } from './combat-feedback-dom';
import {
  CARD_LIFECYCLE_EFFECT_RECIPES,
  CARD_EFFECT_FIXTURES,
  CARD_EFFECT_RECIPE_BY_CARD,
  CARD_EFFECT_RECIPES,
  REQUIRED_EFFECT_PRIMITIVES,
  type CardEffectFixtureId,
  type CardEffectMode,
  type CardEffectRecipeId,
} from './card-effect-recipes';
import {
  CardEffectRunner,
  type CardEffectRunResult,
  type EffectResourceCounts,
} from './card-effect-runner';
import {
  CARD_RIG_FIXTURES,
  CardRig,
  type CardRigFixtureId,
  type CardRigMode,
} from './card-rig';
import { DomCardRigPort, type CardRigRouteTelemetry } from './card-rig-dom';
import { buildOpeningDealPlan, buildProductionTransitionPlan } from './card-production';
import {
  DomCardRigAttachmentController,
  type CardRigAttachmentSample,
} from './card-rig-attachment-dom';
import {
  CARD_RIG_COMPOSITION_FIXTURES,
  type CardRigAttachmentAuthority,
  type CardRigCompositionFixtureId,
  type CardRigEnvironmentalSlotId,
  type CardRigOuterFrameId,
} from './card-rig-composition';
import {
  CARD_RIG_ANCHOR_IDS,
  CARD_RIG_SOURCE_ANCHORS,
  CARD_RIG_SOURCE_SIZE,
  resolveCoverPoint,
} from './card-rig-routes';
import {
  CARD_LAB_CARDS,
  phasePresentation,
  renderCardSlot,
  renderHandDock,
  renderHandCard,
  renderNextCard,
  type CardSurfaceStrategy,
} from './card-view';
import {
  createCardGoblinLedger,
  publishCardGoblinTransition,
} from './ledger-bridge';
import {
  createGame,
  playCard,
  resolveSparkChoice,
  type Card,
  type GameState,
  type Phase,
} from './simulation';

declare global {
  interface Window {
    __cardRigLabStatus?: {
      fixtureId: CardRigFixtureId;
      mode: CardRigMode;
      status: 'ready' | 'running' | 'complete' | 'cancelled';
      cues: string[];
      events: string[];
      routes: CardRigRouteTelemetry[];
      cleanup: string[];
      reason?: string;
    };
    __cardEffectLabStatus?: {
      fixtureId: CardEffectFixtureId;
      recipeId: CardEffectRunResult['recipeId'];
      mode: CardEffectMode;
      status: 'ready' | 'running' | 'completed' | 'cancelled' | 'error';
      beforeCounts: EffectResourceCounts;
      afterCounts: EffectResourceCounts;
      layers: string[];
      cleanup: Array<{ reason: string; counts: EffectResourceCounts }>;
      runs: Array<{
        mode: CardEffectMode;
        status: CardEffectRunResult['status'];
        counts: EffectResourceCounts;
        reason?: string;
      }>;
      error?: string;
    };
    __cardEffectRecipeRegistry?: {
      requiredPrimitives: typeof REQUIRED_EFFECT_PRIMITIVES;
      cardMappings: typeof CARD_EFFECT_RECIPE_BY_CARD;
      fixtures: typeof CARD_EFFECT_FIXTURES;
      recipes: typeof CARD_EFFECT_RECIPES;
    };
    __cardRigCompositionStatus?: {
      fixtureId: CardRigCompositionFixtureId;
      frameStyle: CardRigOuterFrameId;
      status: 'ready' | 'running' | 'complete' | 'cancelled' | 'error';
      attachment?: CardRigAttachmentAuthority['kind'];
      samples: CardRigAttachmentSample[];
      activeCounts: { temporaryNodes: number; ownerClasses: number; animationFrames: number };
      finalCounts: { temporaryNodes: number; ownerClasses: number; animationFrames: number };
      cleanup: string[];
      error?: string;
    };
    __cardGoblinPresentationStatus?: {
      status: 'booting' | 'ready' | 'running' | 'cancelled' | 'error';
      mode: CardRigMode;
      planId?: string;
      card?: Card;
      cues: string[];
      effects: string[];
      inputLocked: boolean;
      cleanupCounts: EffectResourceCounts;
      error?: string;
    };
  }
}

document.documentElement.style.setProperty('--tabletop-scene-url', `url("${tabletopSceneUrl}")`);
document.documentElement.style.setProperty('--card-frame-sheet-url', `url("${cardFrameSheetUrl}")`);
document.documentElement.style.setProperty('--card-token-sheet-url', `url("${cardTokenSheetUrl}")`);

let state = createGame();
let anchorBridge: AnchorBridge | undefined;
let anchorSnapshot: AnchorSnapshot = Object.freeze({});

const searchParams = new URLSearchParams(window.location.search);
const requestedCardLab = searchParams.get('cardLab');
const cardLabStrategy: CardSurfaceStrategy | undefined = requestedCardLab === 'clean' || requestedCardLab === 'tokens'
  ? requestedCardLab
  : undefined;
const cardSlotDebug = searchParams.get('cardSlots') === '1';
const cardTypographyGuides = searchParams.get('cardGuides') === '1';
const requestedCardRig = searchParams.get('cardRig');
const requestedCardComposition = searchParams.get('cardComp');
const cardRigCompositionFixtureId: CardRigCompositionFixtureId | undefined = import.meta.env.MODE === 'development'
  && requestedCardComposition
  && requestedCardComposition in CARD_RIG_COMPOSITION_FIXTURES
  ? requestedCardComposition as CardRigCompositionFixtureId
  : undefined;
const requestedFrameStyle = searchParams.get('frameStyle');
const compositionFrameStyle: CardRigOuterFrameId = requestedFrameStyle === 'gold-ornate'
  || requestedFrameStyle === 'wood'
  || requestedFrameStyle === 'corner-ornate'
  ? requestedFrameStyle
  : 'none';
const compositionRigFixtureId = (): CardRigFixtureId | undefined => {
  if (!cardRigCompositionFixtureId) return undefined;
  if (cardRigCompositionFixtureId === 'frame-matrix') {
    if (compositionFrameStyle === 'gold-ornate') return 'r1-frame-gold';
    if (compositionFrameStyle === 'wood') return 'r1-frame-wood';
    if (compositionFrameStyle === 'corner-ornate') return 'r1-frame-corner';
    return 'r1-frame-gold';
  }
  const fixtures: Partial<Record<CardRigCompositionFixtureId, CardRigFixtureId>> = {
    'layer-stack': 'optical-default',
    'slot-vs-frame': 'optical-default',
    'card-local-follow': 'guard-commitment',
    'draw-pile-local': 'initial-deal',
    'discard-pile-local': 'strike-commitment',
    'player-target': 'guard-commitment',
    'enemy-target': 'strike-commitment',
    travel: 'spark-sequence',
    'tabletop-local': 'guard-commitment',
    'resize-active': 'resize-active',
    'cancel-cleanup': 'reset-during-commitment',
    'reduced-motion': 'initial-deal',
  };
  return fixtures[cardRigCompositionFixtureId];
};
const cardRigFixtureId: CardRigFixtureId | undefined = import.meta.env.MODE === 'development'
  && requestedCardRig
  && requestedCardRig in CARD_RIG_FIXTURES
  ? requestedCardRig as CardRigFixtureId
  : compositionRigFixtureId();
const requestedCardEffect = searchParams.get('cardFx');
const cardEffectFixtureId: CardEffectFixtureId | undefined = import.meta.env.MODE === 'development'
  && requestedCardEffect
  && requestedCardEffect in CARD_EFFECT_FIXTURES
  ? requestedCardEffect as CardEffectFixtureId
  : undefined;
const requestedMotion = searchParams.get('motion');
const cardRigMode: CardRigMode = requestedMotion === 'reduced'
  || cardRigCompositionFixtureId === 'reduced-motion'
  ? 'reduced'
  : 'full';
const cardEffectMode: CardEffectMode = requestedMotion === 'reduced' ? 'reduced' : 'full';
const productionPresentationEnabled = !cardRigFixtureId
  && !cardEffectFixtureId
  && !cardLabStrategy;
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
const tabletopScene = document.querySelector<HTMLElement>('.tabletop-scene')!;
const playerDrawAnchor = document.querySelector<HTMLElement>(
  `[data-stage-anchor="${CARD_RIG_ANCHOR_IDS.playerDrawOrigin}"]`,
)!;
const playedCardAnchor = document.querySelector<HTMLElement>(
  `[data-stage-anchor="${CARD_RIG_ANCHOR_IDS.playedCardTarget}"]`,
)!;
const discardAnchor = document.querySelector<HTMLElement>(
  `[data-stage-anchor="${CARD_RIG_ANCHOR_IDS.playerDiscardTarget}"]`,
)!;
const enemyStatus = document.querySelector<HTMLElement>('.enemy-status')!;
const playerStatus = document.querySelector<HTMLElement>('.player-status-rail')!;
const combatFeedback = new DomCombatFeedbackController({
  playerPanel: playerStatus,
  enemyPanel: enemyStatus,
  playerHp,
  enemyHp,
});

const EMPTY_EFFECT_COUNTS: EffectResourceCounts = Object.freeze({
  emitters: 0,
  temporaryObjects: 0,
  masks: 0,
  fx: 0,
  listeners: 0,
});

let cardRig: CardRig | undefined;
let cardRigStarted = false;
let cardRigGeneration = 0;
let cardRigAttachmentController: DomCardRigAttachmentController | undefined;
let cardEffectPort: PhaserCardEffectPort | undefined;
let cardEffectRunner: CardEffectRunner | undefined;
let cardEffectStarted = false;
let cardEffectGeneration = 0;
let productionCardRig: CardRig | undefined;
let productionPresentationGeneration = 0;
let productionInputLocked = false;
let productionOpeningStarted = false;
let activeEffectCard: Card | undefined;
let activeEffectRecipe: CardEffectRecipeId | undefined;
let activeCombatPlan: CombatFeedbackPlan | undefined;
let activationFeedbackShown = false;
let retaliationFeedbackShown = false;
let stageGraphics: Phaser.GameObjects.Graphics;
let debugGraphics: Phaser.GameObjects.Graphics;
let debugLabels: Phaser.GameObjects.Text[] = [];

if (cardEffectFixtureId && !cardRigFixtureId) {
  const fixture = CARD_EFFECT_FIXTURES[cardEffectFixtureId];
  window.__cardEffectLabStatus = {
    fixtureId: cardEffectFixtureId,
    recipeId: fixture.recipeId,
    mode: cardEffectMode,
    status: 'ready',
    beforeCounts: EMPTY_EFFECT_COUNTS,
    afterCounts: EMPTY_EFFECT_COUNTS,
    layers: [],
    cleanup: [],
    runs: [],
  };
  window.__cardEffectRecipeRegistry = {
    requiredPrimitives: REQUIRED_EFFECT_PRIMITIVES,
    cardMappings: CARD_EFFECT_RECIPE_BY_CARD,
    fixtures: CARD_EFFECT_FIXTURES,
    recipes: CARD_EFFECT_RECIPES,
  };
}

const clearDebugLabels = (): void => {
  for (const label of debugLabels) label.destroy();
  debugLabels = [];
};

const layoutTabletopSourceAnchors = (): void => {
  const viewport = {
    width: tabletopScene.clientWidth,
    height: tabletopScene.clientHeight,
  };
  for (const key of Object.keys(CARD_RIG_SOURCE_ANCHORS) as Array<keyof typeof CARD_RIG_SOURCE_ANCHORS>) {
    const anchor = document.querySelector<HTMLElement>(
      `[data-stage-anchor="${CARD_RIG_ANCHOR_IDS[key]}"]`,
    );
    if (!anchor) continue;
    const resolved = resolveCoverPoint(
      viewport,
      CARD_RIG_SOURCE_SIZE,
      CARD_RIG_SOURCE_ANCHORS[key].point,
    );
    anchor.style.left = `${resolved.x}px`;
    anchor.style.top = `${resolved.y}px`;
  }
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
  const played = snapshot[CARD_RIG_ANCHOR_IDS.playedCardTarget];
  const player = snapshot['player-center'];
  const deck = snapshot[CARD_RIG_ANCHOR_IDS.playerDrawOrigin];
  const discard = snapshot[CARD_RIG_ANCHOR_IDS.playerDiscardTarget];

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
  if (cardEffectFixtureId && !cardRigFixtureId && cardEffectRunner && !cardEffectStarted) {
    queueMicrotask(() => void startCardEffectFixture());
  }
  if (productionPresentationEnabled
    && productionCardRig
    && cardEffectRunner
    && !productionOpeningStarted) {
    queueMicrotask(() => void startProductionOpening());
  }
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
    preload() {
      (this as Phaser.Scene).load.image(CARD_EFFECT_TOKEN_SHEET_TEXTURE, cardTokenSheetUrl);
    },
    create() {
      const scene = this as Phaser.Scene;
      stageGraphics = scene.add.graphics().setDepth(0).setVisible(false);
      debugGraphics = scene.add.graphics().setDepth(999);
      layoutTabletopSourceAnchors();
      drawStage(scene);

      scene.scale.on('resize', () => {
        layoutTabletopSourceAnchors();
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

      if (!cardRigFixtureId && (cardEffectFixtureId || productionPresentationEnabled)) {
        cardEffectPort = new PhaserCardEffectPort({
          scene,
          snapshot: () => anchorSnapshot,
          cardElement: () => visibleCardElement(activeEffectCard),
          onLayer: (layer) => {
            window.__cardEffectLabStatus?.layers.push(layer.id);
            presentProductionCombatFeedback(layer.kind);
          },
          onCleanup: (reason, counts) => window.__cardEffectLabStatus?.cleanup.push({ reason, counts }),
        });
        cardEffectRunner = new CardEffectRunner(cardEffectPort);
        if (productionPresentationEnabled) {
          queueMicrotask(() => {
            initializeProductionCardRig();
            anchorBridge?.refresh();
          });
        }
        anchorBridge.refresh();
      }
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

const renderCardRigHand = (
  cards: readonly Card[],
  phase: Phase,
): void => {
  const frameCard: Partial<Record<CardRigOuterFrameId, Card>> = {
    'gold-ornate': 'Strike',
    wood: 'Guard',
    'corner-ornate': 'Mend',
  };
  const slotStyles: readonly CardRigEnvironmentalSlotId[] = [
    'green-slot',
    'teal-slot',
    'gold-glow',
  ];
  hand.innerHTML = cards
    .map((card, index) => renderCardSlot(card, index, phase, {
      strategy: 'tokens',
      registerGameplayAnchor: cards.length <= 3,
      outerFrame: cardRigCompositionFixtureId === 'frame-matrix'
        && frameCard[compositionFrameStyle] === card
        ? compositionFrameStyle
        : cardRigCompositionFixtureId === 'layer-stack' && card === 'Spark'
          ? 'gold-ornate'
          : 'none',
      environmentalSlot: cardRigCompositionFixtureId === 'slot-vs-frame'
        ? slotStyles[index % slotStyles.length]
        : 'none',
    }))
    .join('');
  handCount.textContent = `${cards.length} rig card${cards.length === 1 ? '' : 's'}`;
  const terminal = phase === 'Terminal';
  terminalOutcome.hidden = !terminal;
  terminalMessage.textContent = terminal
    ? 'Victory — the Card Goblin is defeated.'
    : '';
  anchorBridge?.refresh();
};

const compositionAuthorityForCue = (
  cue: Readonly<{ type: string; card?: Card }>,
): CardRigAttachmentAuthority | undefined => {
  if (!cardRigCompositionFixtureId) return undefined;
  const rigId = cue.card
    ? hand.querySelector<HTMLElement>(`[data-card-name="${cue.card}"]`)?.dataset.cardRigId
    : undefined;

  switch (cardRigCompositionFixtureId) {
    case 'card-local-follow':
    case 'resize-active':
    case 'cancel-cleanup':
      return cue.type === 'commit' && rigId ? { kind: 'card-local', rigId } : undefined;
    case 'draw-pile-local':
      return cue.type === 'deal' ? { kind: 'draw-pile-local' } : undefined;
    case 'discard-pile-local':
      return cue.type === 'discard' ? { kind: 'discard-pile-local' } : undefined;
    case 'player-target':
      return cue.type === 'effect-hold' ? { kind: 'player-target' } : undefined;
    case 'enemy-target':
      return cue.type === 'effect-hold' ? { kind: 'enemy-target' } : undefined;
    case 'travel':
      return cue.type === 'commit' && rigId ? { kind: 'travel', rigId } : undefined;
    case 'tabletop-local':
      return cue.type === 'effect-hold'
        ? { kind: 'tabletop-local', anchorId: CARD_RIG_ANCHOR_IDS.playedCardTarget }
        : undefined;
    default:
      return undefined;
  }
};

const activateCompositionDiagnostic = (
  cue: Readonly<{ type: string; card?: Card }>,
): void => {
  const authority = compositionAuthorityForCue(cue);
  if (!authority || !cardRigAttachmentController) return;
  try {
    cardRigAttachmentController.activate(authority);
    if (window.__cardRigCompositionStatus) {
      window.__cardRigCompositionStatus.attachment = authority.kind;
      window.__cardRigCompositionStatus.activeCounts = cardRigAttachmentController.counts();
    }
  } catch (error) {
    if (window.__cardRigCompositionStatus) {
      window.__cardRigCompositionStatus.status = 'error';
      window.__cardRigCompositionStatus.error = error instanceof Error ? error.message : String(error);
    }
  }
};

if (cardRigFixtureId) {
  if (cardRigCompositionFixtureId) {
    cardRigAttachmentController = new DomCardRigAttachmentController({
      root: duelTable,
      resolveAnchor: (anchorId) => duelTable.querySelector<HTMLElement>(
        `[data-stage-anchor="${anchorId}"]`,
      ) ?? undefined,
      onSample: (sample) => window.__cardRigCompositionStatus?.samples.push(sample),
    });
    window.__cardRigCompositionStatus = {
      fixtureId: cardRigCompositionFixtureId,
      frameStyle: compositionFrameStyle,
      status: 'ready',
      samples: [],
      activeCounts: { temporaryNodes: 0, ownerClasses: 0, animationFrames: 0 },
      finalCounts: { temporaryNodes: 0, ownerClasses: 0, animationFrames: 0 },
      cleanup: [],
    };
  }
  const port = new DomCardRigPort({
    hand,
    anchors: {
      playerDrawOrigin: playerDrawAnchor,
      playedCardTarget: playedCardAnchor,
      playerDiscardTarget: discardAnchor,
    },
    enemy: enemyStatus,
    renderHand: renderCardRigHand,
    onCue: (cue) => {
      window.__cardRigLabStatus?.cues.push(cue.type);
      resolutionDetail.textContent = `CardRig cue · ${cue.type}`;
      activateCompositionDiagnostic(cue);
    },
    onRoute: (route) => window.__cardRigLabStatus?.routes.push(route),
    onCleanup: (reason) => {
      window.__cardRigLabStatus?.cleanup.push(reason);
      cardRigAttachmentController?.cleanup();
      window.__cardRigCompositionStatus?.cleanup.push(reason);
    },
  });
  cardRig = new CardRig(port);
  window.__cardRigLabStatus = {
    fixtureId: cardRigFixtureId,
    mode: cardRigMode,
    status: 'ready',
    cues: [],
    events: ['ready'],
    routes: [],
    cleanup: [],
  };
}

const productionMode = (): CardRigMode => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ? 'reduced'
  : 'full';

const setProductionInputLocked = (locked: boolean): void => {
  productionInputLocked = locked;
  duelTable.classList.toggle('presentation-locked', locked);
  duelTable.setAttribute('aria-busy', String(locked));
  if (window.__cardGoblinPresentationStatus) {
    window.__cardGoblinPresentationStatus.inputLocked = locked;
  }
};

const visibleCardElement = (card?: Card): HTMLElement | undefined => {
  const buttons = Array.from(hand.querySelectorAll<HTMLElement>('.card-btn'));
  return (card ? buttons.find((button) => button.dataset.cardName === card) : undefined)
    ?? buttons.find((button) => button.classList.contains('card-rig-committed'))
    ?? buttons[0];
};

const presentProductionCombatFeedback = (kind: string): void => {
  if (!activeCombatPlan || !activeEffectRecipe) return;
  const activationTrigger = (
    (activeEffectRecipe === 'strike' || activeEffectRecipe === 'spark') && kind === 'impact-burst'
  ) || (activeEffectRecipe === 'guard' && kind === 'shield-pulse')
    || (activeEffectRecipe === 'mend' && kind === 'healing-rise')
    || (activeEffectRecipe === 'stun' && kind === 'orbiting-motes')
    || (activeEffectRecipe === 'heavy-bonk' && kind === 'dust-burst');
  if (activationTrigger && !activationFeedbackShown) {
    activationFeedbackShown = true;
    for (const event of activeCombatPlan.activation) combatFeedback.show(event);
  }
  if (activeEffectRecipe === 'enemy-attack' && kind === 'impact-burst' && !retaliationFeedbackShown) {
    retaliationFeedbackShown = true;
    for (const event of activeCombatPlan.retaliation) combatFeedback.show(event);
  }
};

const playProductionEffect = async (
  recipeId: CardEffectRecipeId,
  card?: Card,
): Promise<void> => {
  if (!cardEffectRunner) return;
  activeEffectCard = card;
  activeEffectRecipe = recipeId;
  window.__cardGoblinPresentationStatus?.effects.push(recipeId);
  const result = await cardEffectRunner.play(recipeId, productionMode());
  if (result.status === 'cancelled') return;
  if (Object.values(result.counts).some((count) => count !== 0)) {
    throw new Error(`${recipeId} left presentation residue`);
  }
};

const initializeProductionCardRig = (): void => {
  if (!productionPresentationEnabled || productionCardRig) return;
  const port = new DomCardRigPort({
    hand,
    anchors: {
      playerDrawOrigin: playerDrawAnchor,
      playedCardTarget: playedCardAnchor,
      playerDiscardTarget: discardAnchor,
    },
    enemy: enemyStatus,
    renderHand: (cards, phase) => {
      hand.innerHTML = renderHandDock(cards, phase);
      handCount.textContent = `${cards.length} of 3 cards`;
      anchorBridge?.refresh();
    },
    onCue: async (cue) => {
      window.__cardGoblinPresentationStatus?.cues.push(cue.type);
      if (cue.type === 'deal' || cue.type === 'refill') {
        await playProductionEffect(CARD_LIFECYCLE_EFFECT_RECIPES.drawPilePrepare, cue.card);
      } else if (cue.type === 'effect-hold' && cue.card) {
        await playProductionEffect(CARD_EFFECT_RECIPE_BY_CARD[cue.card], cue.card);
      }
    },
    onCueComplete: async (cue) => {
      if (cue.type === 'discard' || cue.type === 'replace-discard') {
        await playProductionEffect(CARD_LIFECYCLE_EFFECT_RECIPES.discardPileReceive, cue.card);
      } else if (cue.type === 'settle') {
        const settled = hand.querySelector<HTMLElement>('.card-btn')?.dataset.cardName as Card | undefined;
        await playProductionEffect(CARD_LIFECYCLE_EFFECT_RECIPES.handSettle, settled);
      }
    },
    onCleanup: () => {
      activeEffectCard = undefined;
    },
  });
  productionCardRig = new CardRig(port);
  window.__cardGoblinPresentationStatus = {
    status: 'booting',
    mode: productionMode(),
    cues: [],
    effects: [],
    inputLocked: false,
    cleanupCounts: EMPTY_EFFECT_COUNTS,
  };
};

const startProductionOpening = async (): Promise<void> => {
  if (!productionPresentationEnabled || !productionCardRig || productionOpeningStarted) return;
  productionOpeningStarted = true;
  const generation = ++productionPresentationGeneration;
  const status = window.__cardGoblinPresentationStatus;
  if (status) {
    status.status = 'running';
    status.planId = 'live-opening-deal';
    status.cues = [];
    status.effects = [];
  }
  setProductionInputLocked(true);
  try {
    const result = await productionCardRig.playPlan(
      buildOpeningDealPlan(state, 'live-opening-deal'),
      productionMode(),
    );
    if (generation !== productionPresentationGeneration) return;
    if (status) status.status = result.status === 'completed' ? 'ready' : 'cancelled';
    render(0);
  } catch (error) {
    if (status) {
      status.status = 'error';
      status.error = error instanceof Error ? error.message : String(error);
    }
  } finally {
    if (generation === productionPresentationGeneration) setProductionInputLocked(false);
  }
};

const startCardRigFixture = async (): Promise<void> => {
  if (!cardRig || !cardRigFixtureId || cardRigStarted) return;
  cardRigStarted = true;
  const generation = ++cardRigGeneration;
  const status = window.__cardRigLabStatus;
  if (status) {
    status.status = 'running';
    status.cues = [];
    status.events.push(`run:${generation}`);
    delete status.reason;
  }
  const compositionStatus = window.__cardRigCompositionStatus;
  if (compositionStatus) {
    compositionStatus.status = 'running';
    compositionStatus.samples = [];
    compositionStatus.cleanup = [];
    delete compositionStatus.error;
  }
  let compositionCancelTimer: number | undefined;
  if (cardRigCompositionFixtureId === 'cancel-cleanup') {
    compositionCancelTimer = window.setTimeout(() => cardRig?.cancel('reset'), 180);
  }
  const result = await cardRig.play(cardRigFixtureId, cardRigMode);
  if (compositionCancelTimer !== undefined) window.clearTimeout(compositionCancelTimer);
  if (generation !== cardRigGeneration) return;
  status?.events.push(result.status);
  if (status) {
    status.status = result.status === 'completed' ? 'complete' : 'cancelled';
    status.reason = result.status === 'cancelled' ? result.reason : undefined;
  }
  if (compositionStatus) {
    compositionStatus.status = result.status === 'completed' ? 'complete' : 'cancelled';
    compositionStatus.activeCounts = cardRigAttachmentController?.counts()
      ?? { temporaryNodes: 0, ownerClasses: 0, animationFrames: 0 };
    cardRigAttachmentController?.cleanup();
    compositionStatus.finalCounts = cardRigAttachmentController?.counts()
      ?? { temporaryNodes: 0, ownerClasses: 0, animationFrames: 0 };
    compositionStatus.cleanup.push(result.status === 'completed' ? 'fixture-complete' : result.reason);
  }
  resolutionDetail.textContent = result.status === 'completed'
    ? `${CARD_RIG_FIXTURES[cardRigFixtureId].label} · complete`
    : `CardRig cancelled · ${result.reason}`;
};

const startCardEffectFixture = async (): Promise<void> => {
  if (!cardEffectRunner || !cardEffectPort || !cardEffectFixtureId || cardEffectStarted) return;
  cardEffectStarted = true;
  const generation = ++cardEffectGeneration;
  const fixture = CARD_EFFECT_FIXTURES[cardEffectFixtureId];
  const status = window.__cardEffectLabStatus;
  if (!status) return;

  status.status = 'running';
  status.beforeCounts = cardEffectPort.counts();
  status.afterCounts = EMPTY_EFFECT_COUNTS;
  status.layers = [];
  status.cleanup = [];
  status.runs = [];
  delete status.error;

  const runMode = async (mode: CardEffectMode): Promise<CardEffectRunResult> => {
    let cancelTimer: number | undefined;
    const pending = cardEffectRunner!.play(fixture.recipeId, mode);
    if (fixture.control === 'cancel') {
      cancelTimer = window.setTimeout(
        () => cardEffectRunner?.cancel('fixture-cancel'),
        180,
      );
    }
    try {
      return await pending;
    } finally {
      if (cancelTimer !== undefined) window.clearTimeout(cancelTimer);
    }
  };

  try {
    const modes = fixture.comparison ?? [cardEffectMode];
    const repeatCount = fixture.repeatCount ?? 1;
    let finalResult: CardEffectRunResult | undefined;
    for (let repeat = 0; repeat < repeatCount; repeat += 1) {
      for (const mode of modes) {
        const result = await runMode(mode);
        if (generation !== cardEffectGeneration) return;
        finalResult = result;
        status.runs.push({
          mode,
          status: result.status,
          counts: result.counts,
          reason: result.reason,
        });
      }
    }

    status.afterCounts = cardEffectPort.counts();
    const residue = Object.values(status.afterCounts).some((count) => count !== 0);
    if (residue) {
      status.status = 'error';
      status.error = 'Presentation resources remained after cleanup.';
      resolutionDetail.textContent = status.error;
      return;
    }

    status.status = finalResult?.status === 'cancelled' ? 'cancelled' : 'completed';
    resolutionDetail.textContent = finalResult?.status === 'cancelled'
      ? `${fixture.label} · cancelled (${finalResult.reason})`
      : `${fixture.label} · complete with zero residue`;
  } catch (error) {
    if (generation !== cardEffectGeneration) return;
    status.afterCounts = cardEffectPort.counts();
    status.status = 'error';
    status.error = error instanceof Error ? error.message : String(error);
    resolutionDetail.textContent = `Card effect fixture error · ${status.error}`;
  }
};

const performProductionAction = async (index: number): Promise<void> => {
  if (productionInputLocked || !productionCardRig) return;

  const before = state;
  const selectedCard = before.hand[index];
  if (!selectedCard) return;
  const after = before.phase === 'SparkChoice'
    ? resolveSparkChoice(before, index)
    : playCard(before, index);
  if (after === before) return;

  activeCombatPlan = before.phase === 'SparkChoice'
    ? undefined
    : buildCombatFeedbackPlan(before, after, selectedCard);
  activationFeedbackShown = false;
  retaliationFeedbackShown = false;

  state = after;
  publishCardGoblinTransition(ledger, {
    before,
    after,
    action: before.phase === 'SparkChoice'
      ? { type: 'spark-replacement', card: selectedCard, handIndex: index }
      : { type: 'play-card', card: selectedCard, handIndex: index },
  });

  const generation = ++productionPresentationGeneration;
  const status = window.__cardGoblinPresentationStatus;
  const planId = `live-${before.phase === 'SparkChoice' ? 'replacement' : 'play'}-${generation}`;
  if (status) {
    status.status = 'running';
    status.mode = productionMode();
    status.planId = planId;
    status.card = selectedCard;
    status.cues = [];
    status.effects = [];
    delete status.error;
  }
  setProductionInputLocked(true);

  try {
    const result = await productionCardRig.playPlan(
      buildProductionTransitionPlan(before, after, selectedCard, index, planId),
      productionMode(),
    );
    if (generation !== productionPresentationGeneration) return;
    if (result.status === 'cancelled') {
      if (status) status.status = 'cancelled';
      return;
    }

    const newLog = after.log.slice(before.log.length);
    if (newLog.some((entry) => entry.startsWith('Card Goblin attacks'))) {
      await playProductionEffect('enemy-attack');
    }
    if (after.phase === 'Terminal') {
      await playProductionEffect(after.enemyHp <= 0 ? 'victory' : 'defeat');
    }
    if (generation !== productionPresentationGeneration) return;

    render(Math.min(index, Math.max(0, after.hand.length - 1)));
    const counts = cardEffectPort?.counts() ?? EMPTY_EFFECT_COUNTS;
    if (status) {
      status.cleanupCounts = counts;
      status.status = Object.values(counts).some((count) => count !== 0) ? 'error' : 'ready';
      if (status.status === 'error') status.error = 'Production presentation left effect residue.';
    }
  } catch (error) {
    if (generation !== productionPresentationGeneration) return;
    render(Math.min(index, Math.max(0, state.hand.length - 1)));
    if (status) {
      status.status = 'error';
      status.error = error instanceof Error ? error.message : String(error);
      status.cleanupCounts = cardEffectPort?.counts() ?? EMPTY_EFFECT_COUNTS;
    }
  } finally {
    activeEffectCard = undefined;
    activeEffectRecipe = undefined;
    activeCombatPlan = undefined;
    if (generation === productionPresentationGeneration) setProductionInputLocked(false);
  }
};

const bindCardActions = (): void => {
  document.querySelectorAll<HTMLButtonElement>('#hand .card-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.i);
      if (!Number.isInteger(index)) return;
      void performProductionAction(index);
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
  const bodyClasses = [
    phase.bodyClass,
    debugAnchors ? 'anchor-debug' : '',
    cardRigFixtureId
      ? `card-lab card-lab-tokens card-rig-lab${cardRigCompositionFixtureId ? ' card-rig-composition-lab' : ''}`
      : cardEffectFixtureId
        ? 'card-lab card-lab-tokens card-effect-lab'
        : cardLabStrategy ? `card-lab card-lab-${cardLabStrategy}` : '',
    cardSlotDebug ? 'card-slot-debug' : '',
    cardTypographyGuides ? 'card-typography-guides' : '',
  ].filter(Boolean);
  document.body.className = bodyClasses.join(' ');
  banner.textContent = phase.banner;
  phaseInstruction.textContent = phase.instruction;

  playerHp.textContent = `${Math.max(0, state.playerHp)} / 10 HP`;
  enemyHp.textContent = `${Math.max(0, state.enemyHp)} / 12 HP`;
  playerEffects.textContent = effectSummary(state);
  enemyEffects.textContent = enemySummary(state);

  const resolution = resolutionCopy(state);
  resolutionTitle.textContent = resolution.title;
  resolutionDetail.textContent = resolution.detail;

  if (cardRigFixtureId) {
    const fixture = CARD_RIG_FIXTURES[cardRigFixtureId];
    banner.textContent = cardRigCompositionFixtureId ? 'CardRig Composition Lab' : 'CardRig Motion Lab';
    phaseInstruction.textContent = cardRigCompositionFixtureId
      ? `${CARD_RIG_COMPOSITION_FIXTURES[cardRigCompositionFixtureId].label} · ${cardRigMode} motion`
      : `${fixture.label} · ${cardRigMode} motion`;
    resolutionTitle.textContent = cardRigCompositionFixtureId
      ? 'Face · content · true frame · state · local FX'
      : 'Fixture-driven presentation sequence';
    resolutionDetail.textContent = 'Simulation and ordinary gameplay remain untouched.';
    playerHp.textContent = '10 / 10 HP';
    enemyHp.textContent = '12 / 12 HP';
    playerEffects.textContent = 'Deterministic fixture state.';
    enemyEffects.textContent = 'Presentation adapter only.';
    next.innerHTML = renderNextCard('Spark');
    renderCardRigHand(fixture.initialHand, 'PlayerAction');
    layoutTabletopSourceAnchors();
    anchorBridge?.refresh();
    queueMicrotask(() => void startCardRigFixture());
    return;
  }

  if (cardEffectFixtureId && !cardRigFixtureId) {
    const fixture = CARD_EFFECT_FIXTURES[cardEffectFixtureId];
    const recipe = CARD_EFFECT_RECIPES[fixture.recipeId];
    const previewCard = recipe.card ?? 'Spark';
    banner.textContent = 'CardEffectRecipe Lab';
    phaseInstruction.textContent = `${fixture.label} · ${cardEffectMode} motion`;
    resolutionTitle.textContent = recipe.label;
    resolutionDetail.textContent = `${recipe[cardEffectMode].layers.length} governed layers · presentation only`;
    playerHp.textContent = '10 / 10 HP';
    enemyHp.textContent = '12 / 12 HP';
    playerEffects.textContent = 'Disposable visual state.';
    enemyEffects.textContent = 'Simulation and Ledger untouched.';
    hand.innerHTML = renderHandCard(previewCard, 0, 'PlayerAction', 'tokens', false);
    handCount.textContent = `1 ${previewCard} preview card`;
    next.innerHTML = renderNextCard(undefined);
    terminalOutcome.hidden = true;
    terminalMessage.textContent = '';
    anchorBridge?.refresh();
    return;
  }

  if (cardLabStrategy) {
    banner.textContent = 'Card Surface Lab';
    phaseInstruction.textContent = cardLabStrategy === 'clean'
      ? 'Strategy A — clean interiors'
      : 'Strategy B — mapped tokens';
    resolutionTitle.textContent = 'Five faces · six actions · two slot templates';
    resolutionDetail.textContent = 'Development-only presentation fixture. Gameplay authority is unchanged.';
    hand.innerHTML = CARD_LAB_CARDS
      .map((card, index) => renderHandCard(card, index % 3, 'PlayerAction', cardLabStrategy, false))
      .join('');
    handCount.textContent = '6 surface cards';
    next.innerHTML = renderNextCard(undefined);
    terminalOutcome.hidden = true;
    terminalMessage.textContent = '';
    anchorBridge?.refresh();
    return;
  }

  hand.innerHTML = renderHandDock(state.hand, state.phase);
  handCount.textContent = `${state.hand.length} of 3 cards`;
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
  if (cardRigFixtureId) {
    cardRigGeneration += 1;
    window.__cardRigLabStatus?.events.push('cancel:reset');
    cardRig?.cancel('reset');
    cardRigAttachmentController?.cleanup();
    cardRigStarted = false;
    if (window.__cardRigLabStatus) {
      window.__cardRigLabStatus.status = 'ready';
      window.__cardRigLabStatus.cues = [];
    }
    if (window.__cardRigCompositionStatus) {
      window.__cardRigCompositionStatus.status = 'ready';
      window.__cardRigCompositionStatus.samples = [];
      window.__cardRigCompositionStatus.finalCounts = cardRigAttachmentController?.counts()
        ?? { temporaryNodes: 0, ownerClasses: 0, animationFrames: 0 };
    }
    render();
    return;
  }
  if (cardEffectFixtureId && !cardRigFixtureId) {
    cardEffectGeneration += 1;
    cardEffectRunner?.cancel('reset');
    cardEffectStarted = false;
    if (window.__cardEffectLabStatus) {
      window.__cardEffectLabStatus.status = 'ready';
      window.__cardEffectLabStatus.beforeCounts = EMPTY_EFFECT_COUNTS;
      window.__cardEffectLabStatus.afterCounts = EMPTY_EFFECT_COUNTS;
      window.__cardEffectLabStatus.layers = [];
      window.__cardEffectLabStatus.cleanup = [];
      window.__cardEffectLabStatus.runs = [];
      delete window.__cardEffectLabStatus.error;
    }
    render();
    return;
  }
  productionPresentationGeneration += 1;
  productionCardRig?.cancel('reset');
  cardEffectRunner?.cancel('reset');
  combatFeedback.cleanup();
  activeEffectCard = undefined;
  setProductionInputLocked(false);
  state = createGame();
  ledger.reset();
  productionOpeningStarted = false;
  render(0);
  anchorBridge?.refresh();
});

const onViewportResize = (): void => {
  if (window.__cardRigLabStatus?.status === 'running') {
    window.__cardRigLabStatus.events.push('cancel:resize');
    cardRig?.cancel('resize');
    cardRigAttachmentController?.cleanup();
  }
  if (window.__cardEffectLabStatus?.status === 'running') {
    cardEffectRunner?.cancel('resize');
    combatFeedback.cleanup();
  }
  if (productionPresentationEnabled && productionInputLocked) {
    productionPresentationGeneration += 1;
    productionCardRig?.cancel('resize');
    cardEffectRunner?.cancel('resize');
    activeEffectCard = undefined;
    setProductionInputLocked(false);
    render();
    if (window.__cardGoblinPresentationStatus) {
      window.__cardGoblinPresentationStatus.status = 'cancelled';
      window.__cardGoblinPresentationStatus.cleanupCounts = cardEffectPort?.counts() ?? EMPTY_EFFECT_COUNTS;
    }
  }
  layoutTabletopSourceAnchors();
  anchorBridge?.refresh();
};
window.addEventListener('resize', onViewportResize);

render();

window.addEventListener('beforeunload', () => {
  cardRig?.cancel('reset');
  productionCardRig?.cancel('reset');
  cardRigAttachmentController?.cleanup();
  cardEffectRunner?.cancel('reset');
  combatFeedback.cleanup();
  window.removeEventListener('resize', onViewportResize);
  window.removeEventListener('message', onHubLedgerMessage);
  anchorBridge?.destroy();
  game.destroy(true);
});
