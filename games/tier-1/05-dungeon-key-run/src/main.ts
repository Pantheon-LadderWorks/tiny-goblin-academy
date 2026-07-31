import './style.css';
import {createDungeonGame} from './dungeonScene';
import {resolvePrivateActorOverlay, type OverlayStatus} from './privateActorOverlay';
import {assertRuinHallMatchesSimulation, buildDungeonPresentation} from './sceneAuthority';
import {createInitialState, movePlayer, type Direction, type GameState} from './simulation';

declare global {
  interface Window {
    __dungeonKeyRunStatus?: {
      ready: boolean;
      overlay: OverlayStatus;
      overlayReason?: string;
      inputLocked: boolean;
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

let state = createInitialState();
assertRuinHallMatchesSimulation(state);
let inputLocked = true;

const overlay = await resolvePrivateActorOverlay();
document.body.dataset.actorOverlay = overlay.status;
if (overlay.reason) document.body.dataset.actorOverlayReason = overlay.reason;
const dungeon = createDungeonGame('canvas', state, overlay);

window.__dungeonKeyRunStatus = {
  ready: false,
  overlay: overlay.status,
  overlayReason: overlay.reason,
  inputLocked,
  state,
};

const setInputLocked = (locked: boolean): void => {
  inputLocked = locked;
  const terminal = state.status !== 'playing';
  for (const button of moveButtons) button.disabled = locked || terminal;
  resetButton.disabled = locked;
  if (window.__dungeonKeyRunStatus) window.__dungeonKeyRunStatus.inputLocked = locked;
};

const renderLedger = (): void => {
  log.replaceChildren(...state.ledger.map((entry) => {
    const item = document.createElement('li');
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
  if (inputLocked || state.status !== 'playing') return;
  const before = state;
  const after = movePlayer(before, direction);
  state = after;
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
  dungeon.syncState(state);
  render();
});

const drawerButtons = {
  'ledger-drawer': required<HTMLButtonElement>('#btn-ledger'),
  'help-drawer': required<HTMLButtonElement>('#btn-help'),
} as const;

const closeDrawer = (drawerId: keyof typeof drawerButtons): void => {
  required<HTMLElement>(`#${drawerId}`).hidden = true;
  drawerButtons[drawerId].setAttribute('aria-expanded', 'false');
};

const toggleDrawer = (drawerId: keyof typeof drawerButtons): void => {
  const drawer = required<HTMLElement>(`#${drawerId}`);
  const open = drawer.hidden;
  for (const id of Object.keys(drawerButtons) as Array<keyof typeof drawerButtons>) closeDrawer(id);
  drawer.hidden = !open;
  drawerButtons[drawerId].setAttribute('aria-expanded', String(open));
};

drawerButtons['ledger-drawer'].addEventListener('click', () => toggleDrawer('ledger-drawer'));
drawerButtons['help-drawer'].addEventListener('click', () => toggleDrawer('help-drawer'));
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-close-drawer]')) {
  button.addEventListener('click', () => {
    const drawerId = button.dataset.closeDrawer as keyof typeof drawerButtons | undefined;
    if (drawerId && drawerId in drawerButtons) closeDrawer(drawerId);
  });
}

const keyDirections: Partial<Record<string, Direction>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    for (const id of Object.keys(drawerButtons) as Array<keyof typeof drawerButtons>) closeDrawer(id);
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

window.addEventListener('beforeunload', () => dungeon.destroy());
