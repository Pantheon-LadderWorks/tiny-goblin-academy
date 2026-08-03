import '../../../../assets/academy/fonts/runtime/academy-typography.css';
import './style.css';
import {waitForAcademyFonts} from '../../../../assets/academy/fonts/runtime/academy-typography';
import {createDungeonGame} from './dungeonScene';
import {resolvePrivateActorOverlay, type OverlayStatus} from './privateActorOverlay';
import {createDungeonKeyLedger, publishDungeonKeyTransition} from './ledger-bridge';
import {PATROL_TENSION_TREATMENT, resolveTreatmentRuntimeOptions} from './readabilityTreatment';
import {assertRuinHallMatchesSimulation, buildDungeonPresentation} from './sceneAuthority';
import {createInitialState, movePlayer, type Direction, type GameState} from './simulation';
import {
  DUNGEON_KEY_TYPOGRAPHY_ROLES,
  DUNGEON_KEY_UI_AUTHORITY,
  type DungeonKeyDrawerId,
} from './uiAuthority';

declare global {
  interface Window {
    __dungeonKeyRunStatus?: {
      ready: boolean;
      overlay: OverlayStatus;
      overlayReason?: string;
      inputLocked: boolean;
      treatment: {
        id: string;
        enabled: boolean;
        debug: string[];
      };
      typography: {
        authorityId: string;
        loaded: boolean;
        missing: string[];
      };
      activeDrawer: DungeonKeyDrawerId | null;
      state: GameState;
    };
  }
}

const required = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing Dungeon Key Run element: ${selector}`);
  return element;
};

const objectiveCopy = required<HTMLElement>('#objective-copy');
const keyStatus = required<HTMLElement>('#key-status');
const exitStatus = required<HTMLElement>('#exit-status');
const feedback = required<HTMLElement>('#feedback');
const banner = required<HTMLElement>('#banner');
const log = required<HTMLOListElement>('#log');
const resetButton = required<HTMLButtonElement>('#btn-reset');
const moveButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#controls button'));

const fontResults = await waitForAcademyFonts(document.fonts);
const missingFonts = fontResults
  .filter((font) => !font.loaded)
  .map((font) => `${font.family} ${font.weight}`);
const typographyLoaded = missingFonts.length === 0;
document.body.dataset.typographyAuthority = DUNGEON_KEY_UI_AUTHORITY.id;
document.body.dataset.typographyReady = String(typographyLoaded);

let state = createInitialState();
assertRuinHallMatchesSimulation(state);
let inputLocked = true;
let activeDrawer: DungeonKeyDrawerId | null = null;
let restoreFocus: HTMLElement | null = null;

const academyLedger = createDungeonKeyLedger({
  parent: window.parent === window ? null : window.parent,
});
const onHubLedgerMessage = (event: MessageEvent<unknown>): void => {
  if (event.source !== window.parent) return;
  academyLedger.handleHubMessage(event.data);
};
window.addEventListener('message', onHubLedgerMessage);

const treatmentOptions = resolveTreatmentRuntimeOptions(window.location.search);
document.body.dataset.readabilityTreatment = treatmentOptions.enabled
  ? PATROL_TENSION_TREATMENT.id
  : 'disabled';
document.body.dataset.readabilityDebug = treatmentOptions.debug.join(',');

const overlay = await resolvePrivateActorOverlay();
document.body.dataset.actorOverlay = overlay.status;
if (overlay.reason) document.body.dataset.actorOverlayReason = overlay.reason;
const dungeon = createDungeonGame('canvas', state, overlay, treatmentOptions);

window.__dungeonKeyRunStatus = {
  ready: false,
  overlay: overlay.status,
  overlayReason: overlay.reason,
  inputLocked,
  treatment: {
    id: PATROL_TENSION_TREATMENT.id,
    enabled: treatmentOptions.enabled,
    debug: treatmentOptions.debug,
  },
  typography: {
    authorityId: DUNGEON_KEY_UI_AUTHORITY.id,
    loaded: typographyLoaded,
    missing: missingFonts,
  },
  activeDrawer,
  state,
};

const setInputLocked = (locked: boolean): void => {
  inputLocked = locked;
  const terminal = state.status !== 'playing';
  for (const button of moveButtons) {
    button.disabled = locked || terminal;
    button.dataset.uiState = button.disabled ? 'disabled' : 'rest';
  }
  resetButton.disabled = locked;
  resetButton.dataset.uiState = resetButton.disabled ? 'disabled' : 'rest';
  if (window.__dungeonKeyRunStatus) window.__dungeonKeyRunStatus.inputLocked = locked;
};

const renderLedger = (): void => {
  log.replaceChildren(...state.ledger.map((entry) => {
    const item = document.createElement('li');
    item.setAttribute('data-typography-role', DUNGEON_KEY_TYPOGRAPHY_ROLES.ledgerEntry);
    item.textContent = entry;
    return item;
  }));
};

const render = (): void => {
  const presentation = buildDungeonPresentation(state);
  objectiveCopy.textContent = `${presentation.objective}.`;
  keyStatus.innerHTML = `<strong>Key</strong> ${state.hasKey ? 'Collected' : 'Missing'}`;
  exitStatus.innerHTML = `<strong>Exit</strong> ${presentation.exitState === 'open' ? 'Open' : 'Locked'}`;
  feedback.textContent = state.ledger.at(-1) ?? 'Dungeon entered.';
  banner.hidden = presentation.outcome === 'playing';
  banner.textContent = presentation.banner;
  banner.dataset.outcome = presentation.outcome;
  renderLedger();
  setInputLocked(inputLocked);
  if (window.__dungeonKeyRunStatus) window.__dungeonKeyRunStatus.state = state;
};

const performMove = async (direction: Direction): Promise<void> => {
  if (activeDrawer) return;
  if (inputLocked || state.status !== 'playing') return;
  const before = state;
  const after = movePlayer(before, direction);
  state = after;
  publishDungeonKeyTransition(academyLedger, {before, after, direction});
  setInputLocked(true);
  try {
    await dungeon.playTransition(before, after, direction);
  } finally {
    setInputLocked(false);
    render();
  }
};

const directionButtons: ReadonlyArray<readonly [string, Direction]> = [
  ['#btn-up', 'up'],
  ['#btn-down', 'down'],
  ['#btn-left', 'left'],
  ['#btn-right', 'right'],
];
for (const [selector, direction] of directionButtons) {
  required<HTMLButtonElement>(selector).addEventListener('click', () => void performMove(direction));
}

resetButton.addEventListener('click', () => {
  if (inputLocked) return;
  state = createInitialState();
  assertRuinHallMatchesSimulation(state);
  academyLedger.reset();
  dungeon.syncState(state);
  render();
});

const drawerButtons: Record<DungeonKeyDrawerId, HTMLButtonElement> = {
  'ledger-drawer': required<HTMLButtonElement>('#btn-ledger'),
  'help-drawer': required<HTMLButtonElement>('#btn-help'),
};
const drawers: Record<DungeonKeyDrawerId, HTMLElement> = {
  'ledger-drawer': required<HTMLElement>('#ledger-drawer'),
  'help-drawer': required<HTMLElement>('#help-drawer'),
};

const focusableElements = (drawer: HTMLElement): HTMLElement[] => Array.from(
  drawer.querySelectorAll<HTMLElement>('button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'),
);

const updateDrawerStatus = (): void => {
  document.body.dataset.drawerOpen = String(activeDrawer !== null);
  if (window.__dungeonKeyRunStatus) window.__dungeonKeyRunStatus.activeDrawer = activeDrawer;
};

const closeDrawer = (drawerId: DungeonKeyDrawerId, shouldRestore = true): void => {
  drawers[drawerId].hidden = true;
  drawerButtons[drawerId].setAttribute('aria-expanded', 'false');
  drawerButtons[drawerId].dataset.uiState = 'rest';
  if (activeDrawer === drawerId) activeDrawer = null;
  updateDrawerStatus();
  if (shouldRestore && restoreFocus) {
    const target = restoreFocus;
    restoreFocus = null;
    target.focus();
  }
};

const focusDrawer = (drawerId: DungeonKeyDrawerId): void => {
  if (activeDrawer && activeDrawer !== drawerId) closeDrawer(activeDrawer, false);
  restoreFocus = drawerButtons[drawerId];
  activeDrawer = drawerId;
  drawers[drawerId].hidden = false;
  drawerButtons[drawerId].setAttribute('aria-expanded', 'true');
  drawerButtons[drawerId].dataset.uiState = 'open';
  updateDrawerStatus();
  requestAnimationFrame(() => focusableElements(drawers[drawerId])[0]?.focus());
};

const toggleDrawer = (drawerId: DungeonKeyDrawerId): void => {
  if (activeDrawer === drawerId) closeDrawer(drawerId);
  else focusDrawer(drawerId);
};

drawerButtons['ledger-drawer'].addEventListener('click', () => toggleDrawer('ledger-drawer'));
drawerButtons['help-drawer'].addEventListener('click', () => toggleDrawer('help-drawer'));
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-close-drawer]')) {
  button.addEventListener('click', () => {
    const drawerId = button.dataset.closeDrawer as DungeonKeyDrawerId | undefined;
    if (drawerId && drawerId in drawers) closeDrawer(drawerId);
  });
}

const keyDirections: Partial<Record<string, Direction>> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
};
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'l') {
    event.preventDefault();
    toggleDrawer('ledger-drawer');
    return;
  }
  if (activeDrawer) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer(activeDrawer);
      return;
    }
    if (event.key === 'Tab') {
      const focusables = focusableElements(drawers[activeDrawer]);
      const first = focusables[0];
      const last = focusables.at(-1);
      if (first && last && event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (first && last && !event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
      return;
    }
    if (keyDirections[event.key]) event.preventDefault();
    return;
  }
  const direction = keyDirections[event.key];
  if (!direction) return;
  event.preventDefault();
  void performMove(direction);
});

await dungeon.ready;
inputLocked = false;
if (window.__dungeonKeyRunStatus) window.__dungeonKeyRunStatus.ready = true;
render();

window.addEventListener('beforeunload', () => {
  window.removeEventListener('message', onHubLedgerMessage);
  dungeon.destroy();
});
