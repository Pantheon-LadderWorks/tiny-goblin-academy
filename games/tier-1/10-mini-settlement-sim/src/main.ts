import { createInitialState, advanceDay, setPriority, resetGame, GameState, Priority } from './simulation';

// DOM Elements
const uiRunStatus = document.getElementById('ui-run-status')!;
const uiDay = document.getElementById('ui-day')!;
const uiCitizens = document.getElementById('ui-citizens')!;
const uiFood = document.getElementById('ui-food')!;
const uiWood = document.getElementById('ui-wood')!;
const uiShelter = document.getElementById('ui-shelter')!;
const uiPriority = document.getElementById('ui-priority')!;

const btnForage = document.getElementById('btn-forage') as HTMLButtonElement;
const btnChop = document.getElementById('btn-chop') as HTMLButtonElement;
const btnBuild = document.getElementById('btn-build') as HTMLButtonElement;
const btnAdvance = document.getElementById('btn-advance') as HTMLButtonElement;
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;

const visCitizens = document.getElementById('vis-citizens')!;
const visShelters = document.getElementById('vis-shelters')!;
const visStockpile = document.getElementById('vis-stockpile')!;
const stormOverlay = document.getElementById('storm-overlay')!;
const runOverlay = document.getElementById('run-overlay')!;

const ledgerList = document.getElementById('ledger-list')!;

// State
let state: GameState = createInitialState();

function updateUI() {
  // Update HUD
  uiRunStatus.textContent = state.runStatus;
  uiRunStatus.className = 'status-value ' + (state.runStatus === 'Active' ? 'highlight' : (state.runStatus === 'Victory' ? 'highlight' : 'danger'));
  if (state.runStatus === 'Defeat') uiRunStatus.style.color = '#F44336';
  else uiRunStatus.style.color = ''; // reset to default
  
  uiDay.textContent = `${state.day} / 10`;
  uiCitizens.textContent = state.citizens.toString();
  uiFood.textContent = state.food.toString();
  uiWood.textContent = state.wood.toString();
  uiShelter.textContent = state.shelter.toString();
  uiPriority.textContent = state.priority;

  // Update Buttons
  btnForage.classList.toggle('active', state.priority === 'Forage');
  btnChop.classList.toggle('active', state.priority === 'Chop');
  btnBuild.classList.toggle('active', state.priority === 'Build');
  
  const isTerminal = state.runStatus !== 'Active';
  btnForage.disabled = isTerminal;
  btnChop.disabled = isTerminal;
  btnBuild.disabled = isTerminal;
  btnAdvance.disabled = isTerminal;

  // Render Playfield
  visCitizens.innerHTML = '';
  for(let i=0; i<state.citizens; i++) {
    const el = document.createElement('div');
    el.className = 'vis-citizen';
    visCitizens.appendChild(el);
  }

  visShelters.innerHTML = '';
  for(let i=0; i<state.shelter; i++) {
    const el = document.createElement('div');
    el.className = 'vis-shelter';
    visShelters.appendChild(el);
  }

  visStockpile.innerHTML = `
    <div class="vis-resource food">${state.food}</div>
    <div class="vis-resource wood">${state.wood}</div>
  `;

  // Storm visuals
  if (state.day === 5 && state.runStatus === 'Active') {
    stormOverlay.classList.remove('hidden');
  } else {
    stormOverlay.classList.add('hidden');
  }

  // Run Overlay
  if (isTerminal) {
    runOverlay.classList.remove('hidden');
    runOverlay.textContent = state.runStatus;
    runOverlay.style.color = state.runStatus === 'Victory' ? '#4CAF50' : '#F44336';
  } else {
    runOverlay.classList.add('hidden');
  }

  // Update Ledger
  ledgerList.innerHTML = '';
  // Ledger array is unshifted, so index 0 is newest
  state.ledger.forEach((entry, index) => {
    const el = document.createElement('div');
    el.className = 'ledger-item';
    if (entry.includes('Starvation') || entry.includes('destroyed by the storm')) {
      el.classList.add('defeat');
    }
    if (entry.includes('Victory')) {
      el.classList.add('victory');
    }
    // Numbering preserves historical order: oldest is 1, newest is N
    const histNumber = state.ledger.length - index;
    el.textContent = `${histNumber}. ${entry}`;
    ledgerList.appendChild(el);
  });
}

// Event Listeners
function handlePriority(p: Priority) {
  setPriority(state, p);
  updateUI();
}

btnForage.addEventListener('click', () => handlePriority('Forage'));
btnChop.addEventListener('click', () => handlePriority('Chop'));
btnBuild.addEventListener('click', () => handlePriority('Build'));

btnAdvance.addEventListener('click', () => {
  advanceDay(state);
  updateUI();
});

btnReset.addEventListener('click', () => {
  state = resetGame();
  updateUI();
});

// Initial Render
updateUI();
