import Phaser from 'phaser';
import tabletopSceneUrl from '../../../../assets/academy/games/card-goblin-duel/backgrounds/tga-card-goblin-duel-tabletop-scene-v0.1.png?url';
import cardFrameSheetUrl from '../../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png?url';
import cardTokenSheetUrl from '../../../../assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png?url';
import './style.css';
import { createAnchorBridge, type AnchorBridge } from './anchor-bridge';
import { isAnchorDebugEnabled, type AnchorSnapshot } from './anchors';
import { effectSummary, enemySummary, resolutionCopy } from './app/game-copy';
import { resolveRuntimeConfig } from './app/runtime-config';
import { PhaserCardEffectPort } from './card-effect-phaser';
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
} from './card-rig-routes';
import {
  CARD_LAB_CARDS,
  phasePresentation,
  renderCardSlot,
  renderHandDock,
  renderHandCard,
  renderNextCard,
} from './card-view';
import { CARD_EFFECT_TOKEN_SHEET_TEXTURE } from './effects/phaser-effect-textures';
import {
  createCardGoblinLedger,
  publishCardGoblinTransition,
} from './ledger-bridge';
import {
  createGame,
  playCard,
  resolveSparkChoice,
  type Card,
  type Phase,
} from './simulation';
import { PhaserStageRenderer } from './stage/phaser-stage-renderer';

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

const {
  cardLabStrategy,
  cardSlotDebug,
  cardTypographyGuides,
  cardRigCompositionFixtureId,
  compositionFrameStyle,
  cardRigFixtureId,
  cardEffectFixtureId,
  cardRigMode,
  cardEffectMode,
  productionPresentationEnabled,
} = resolveRuntimeConfig(window.location.search, import.meta.env.MODE === 'development');
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
const stageRenderer = new PhaserStageRenderer({ tabletopScene, debugAnchors });

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

const receiveAnchorSnapshot = (scene: Phaser.Scene, snapshot: AnchorSnapshot): void => {
  anchorSnapshot = snapshot;
  stageRenderer.draw(scene, snapshot);
  stageRenderer.drawAnchorDebug(scene, snapshot);
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
      stageRenderer.initialize(scene);
      stageRenderer.layoutSourceAnchors();
      stageRenderer.draw(scene);

      scene.scale.on('resize', () => {
        stageRenderer.layoutSourceAnchors();
        stageRenderer.draw(scene, anchorSnapshot);
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
    stageRenderer.layoutSourceAnchors();
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
  stageRenderer.layoutSourceAnchors();
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
