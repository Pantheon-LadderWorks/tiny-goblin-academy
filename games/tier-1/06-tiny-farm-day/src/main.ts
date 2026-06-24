import Phaser from 'phaser';
import { createInitialState, plant, water, harvest, sell, buyUpgrade, endDay, GameState } from './simulation';
import './style.css';

const btnLeft = document.getElementById('btn-left') as HTMLButtonElement;
const btnRight = document.getElementById('btn-right') as HTMLButtonElement;
const btnInteract = document.getElementById('btn-interact') as HTMLButtonElement;
const btnSell = document.getElementById('btn-sell') as HTMLButtonElement;
const btnUpgrade = document.getElementById('btn-upgrade') as HTMLButtonElement;
const btnEnd = document.getElementById('btn-end') as HTMLButtonElement;
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;

const banner = document.getElementById('banner') as HTMLDivElement;
const log = document.getElementById('log') as HTMLOListElement;

const hudTick = document.getElementById('hud-tick') as HTMLDivElement;
const hudDay = document.getElementById('hud-day') as HTMLDivElement;
const hudSeeds = document.getElementById('hud-seeds') as HTMLDivElement;
const hudCrops = document.getElementById('hud-crops') as HTMLDivElement;
const hudCoins = document.getElementById('hud-coins') as HTMLDivElement;
const hudUpgrade = document.getElementById('hud-upgrade') as HTMLDivElement;

let state: GameState = createInitialState();
let selectedPlot = 0;

function updateDOM() {
  hudTick.textContent = `Tick ${state.tick}`;
  hudDay.textContent = state.dayStatus;
  hudSeeds.textContent = state.seeds.toString();
  hudCrops.textContent = state.crops.toString();
  hudCoins.textContent = state.coins.toString();
  hudUpgrade.textContent = state.upgradePurchased ? 'Purchased' : 'Not Purchased (5 Coins)';

  log.innerHTML = '';
  state.ledger.slice().reverse().forEach((entry, index) => {
    const li = document.createElement('li');
    li.value = state.ledger.length - index;
    li.textContent = entry;
    log.appendChild(li);
  });

  if (state.dayStatus === 'Victory') {
    banner.textContent = 'VICTORY! Upgrade secured.';
    banner.style.color = '#73d88b';
  } else if (state.dayStatus === 'Defeat') {
    banner.textContent = 'DEFEAT! Day ended without upgrade.';
    banner.style.color = '#d84b4b';
  } else {
    banner.textContent = '';
  }

  const active = state.dayStatus === 'Active';
  btnLeft.disabled = !active;
  btnRight.disabled = !active;
  btnInteract.disabled = !active;
  btnSell.disabled = !active;
  btnUpgrade.disabled = !active;
  btnEnd.disabled = !active;
}

function doInteract() {
  if (state.dayStatus !== 'Active') return;
  const plot = state.plots[selectedPlot];
  if (plot.state === 'Empty') state = plant(state, selectedPlot);
  else if (plot.state === 'PlantedDry') state = water(state, selectedPlot);
  else if (plot.state === 'Grown') state = harvest(state, selectedPlot);
  updateDOM();
}

function doSell() { state = sell(state); updateDOM(); }
function doUpgrade() { state = buyUpgrade(state); updateDOM(); }
function doEndDay() { state = endDay(state); updateDOM(); }

btnLeft.addEventListener('click', () => { if (selectedPlot > 0) selectedPlot--; updateDOM(); });
btnRight.addEventListener('click', () => { if (selectedPlot < 2) selectedPlot++; updateDOM(); });
btnInteract.addEventListener('click', doInteract);
btnSell.addEventListener('click', doSell);
btnUpgrade.addEventListener('click', doUpgrade);
btnEnd.addEventListener('click', doEndDay);
btnReset.addEventListener('click', () => {
  state = createInitialState();
  selectedPlot = 0;
  updateDOM();
});

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
  if (state.dayStatus !== 'Active') return;
  switch (e.key) {
    case 'ArrowLeft': if (selectedPlot > 0) selectedPlot--; updateDOM(); break;
    case 'ArrowRight': if (selectedPlot < 2) selectedPlot++; updateDOM(); break;
    case ' ': doInteract(); break;
  }
});

class FarmScene extends Phaser.Scene {
  plotGraphics: Phaser.GameObjects.Rectangle[] = [];
  plotTexts: Phaser.GameObjects.Text[] = [];
  selectorGraphic!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('FarmScene');
  }

  create() {
    const PLOT_SIZE = 80;
    const SPACING = 20;
    const startX = (this.cameras.main.width - (3 * PLOT_SIZE + 2 * SPACING)) / 2;
    const startY = (this.cameras.main.height - PLOT_SIZE) / 2;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * (PLOT_SIZE + SPACING) + PLOT_SIZE / 2;
      const y = startY + PLOT_SIZE / 2;
      
      const rect = this.add.rectangle(x, y, PLOT_SIZE, PLOT_SIZE, 0x3d2817);
      rect.setStrokeStyle(2, 0x75444b);
      this.plotGraphics.push(rect);

      const text = this.add.text(x, y, '', { fontSize: '40px' }).setOrigin(0.5);
      this.plotTexts.push(text);
    }

    this.selectorGraphic = this.add.rectangle(0, 0, PLOT_SIZE + 8, PLOT_SIZE + 8, 0x000000, 0);
    this.selectorGraphic.setStrokeStyle(4, 0xe7bd6b);

    this.syncWithState();
  }

  update() {
    this.syncWithState();
  }

  syncWithState() {
    for (let i = 0; i < 3; i++) {
      const plot = state.plots[i];
      let emoji = '';
      if (plot.state === 'PlantedDry') emoji = '🌱';
      else if (plot.state === 'PlantedWatered') emoji = '🌿';
      else if (plot.state === 'Grown') emoji = '🌾';

      this.plotTexts[i].setText(emoji);
    }

    const PLOT_SIZE = 80;
    const SPACING = 20;
    const startX = (this.cameras.main.width - (3 * PLOT_SIZE + 2 * SPACING)) / 2;
    const startY = (this.cameras.main.height - PLOT_SIZE) / 2;
    
    const x = startX + selectedPlot * (PLOT_SIZE + SPACING) + PLOT_SIZE / 2;
    const y = startY + PLOT_SIZE / 2;
    this.selectorGraphic.setPosition(x, y);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 200,
  parent: 'canvas',
  backgroundColor: '#24192f',
  scene: FarmScene
};

new Phaser.Game(config);
updateDOM();
