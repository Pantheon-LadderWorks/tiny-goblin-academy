import Phaser from 'phaser';
import { createInitialState, tick, feed, play, GameState } from './simulation';
import './style.css';

const btnFeed = document.getElementById('btn-feed') as HTMLButtonElement;
const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;

const banner = document.getElementById('banner') as HTMLDivElement;
const log = document.getElementById('log') as HTMLOListElement;

const hudDay = document.getElementById('hud-day') as HTMLDivElement;
const hudTime = document.getElementById('hud-time') as HTMLDivElement;
const hudPetStatus = document.getElementById('hud-pet-status') as HTMLDivElement;
const hudHunger = document.getElementById('hud-hunger') as HTMLSpanElement;
const hudHappiness = document.getElementById('hud-happiness') as HTMLSpanElement;

let state: GameState = createInitialState();
let timerId: number | null = null;

function startTimer() {
  if (timerId !== null) clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (state.dayStatus === 'Active') {
      state = tick(state, 1);
      updateDOM();
    }
  }, 1000);
}

function updateDOM() {
  hudDay.textContent = state.dayStatus;
  hudTime.textContent = `${state.survivalTime}s / 60s`;
  hudPetStatus.textContent = state.petStatus;
  hudHunger.textContent = state.hunger.toString();
  hudHappiness.textContent = state.happiness.toString();

  log.innerHTML = '';
  state.ledger.slice().reverse().forEach((entry, index) => {
    const li = document.createElement('li');
    li.value = state.ledger.length - index;
    li.textContent = entry;
    log.appendChild(li);
  });

  if (state.dayStatus === 'Victory') {
    banner.textContent = 'VICTORY! Pet safely fell asleep.';
    banner.style.color = '#73d88b';
  } else if (state.dayStatus === 'Defeat') {
    banner.textContent = 'DEFEAT! Pet ran away into the woods.';
    banner.style.color = '#d84b4b';
  } else {
    banner.textContent = '';
  }

  const active = state.dayStatus === 'Active';
  btnFeed.disabled = !active;
  btnPlay.disabled = !active;
}

btnFeed.addEventListener('click', () => { 
  if (state.dayStatus === 'Active') {
    state = feed(state); 
    updateDOM(); 
  }
});
btnPlay.addEventListener('click', () => { 
  if (state.dayStatus === 'Active') {
    state = play(state); 
    updateDOM(); 
  }
});
btnReset.addEventListener('click', () => {
  state = createInitialState();
  updateDOM();
  startTimer();
});

class CampfireScene extends Phaser.Scene {
  campfireText!: Phaser.GameObjects.Text;
  petText!: Phaser.GameObjects.Text;

  constructor() {
    super('CampfireScene');
  }

  create() {
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;

    this.campfireText = this.add.text(cx + 40, cy, '🔥', { fontSize: '64px' }).setOrigin(0.5);
    this.petText = this.add.text(cx - 40, cy, '👺', { fontSize: '64px' }).setOrigin(0.5);

    this.syncWithState();
  }

  update() {
    this.syncWithState();
  }

  syncWithState() {
    let emoji = '👺';
    if (state.petStatus === 'Eating') emoji = '👺🍖';
    else if (state.petStatus === 'Playing') emoji = '👺🪀';
    else if (state.petStatus === 'Sleeping') emoji = '👺💤';
    else if (state.petStatus === 'RanAway') emoji = '💨';

    this.petText.setText(emoji);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 200,
  parent: 'canvas',
  backgroundColor: '#24192f',
  scene: CampfireScene
};

new Phaser.Game(config);
updateDOM();
startTimer();
