import Phaser from 'phaser';
import { createInitialState, movePlayer, GameState, Direction } from './simulation';
import './style.css';

// DOM elements
const btnUp = document.getElementById('btn-up') as HTMLButtonElement;
const btnDown = document.getElementById('btn-down') as HTMLButtonElement;
const btnLeft = document.getElementById('btn-left') as HTMLButtonElement;
const btnRight = document.getElementById('btn-right') as HTMLButtonElement;
const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;
const banner = document.getElementById('banner') as HTMLDivElement;
const log = document.getElementById('log') as HTMLOListElement;
const keyStatus = document.getElementById('key-status') as HTMLDivElement;

let state: GameState = createInitialState();

// UI Update
function updateDOM() {
  // Update Ledger
  log.innerHTML = '';
  state.ledger.slice().reverse().forEach((entry, index) => {
    const li = document.createElement('li');
    li.value = state.ledger.length - index;
    li.textContent = entry;
    log.appendChild(li);
  });

  // Update Status panel
  keyStatus.textContent = state.hasKey ? '🔑 (Found)' : '🔑 (Not Found)';

  // Update Controls
  const isTerminal = state.status !== 'playing';
  btnUp.disabled = isTerminal;
  btnDown.disabled = isTerminal;
  btnLeft.disabled = isTerminal;
  btnRight.disabled = isTerminal;

  // Update Banner
  if (state.status === 'victory') {
    banner.textContent = 'VICTORY!';
    banner.style.color = '#73d88b';
  } else if (state.status === 'defeat') {
    banner.textContent = 'DEFEAT!';
    banner.style.color = '#d84b4b';
  } else {
    banner.textContent = '';
  }
}

// Actions
function doAction(dir: Direction) {
  state = movePlayer(state, dir);
  updateDOM();
}

btnUp.addEventListener('click', () => doAction('up'));
btnDown.addEventListener('click', () => doAction('down'));
btnLeft.addEventListener('click', () => doAction('left'));
btnRight.addEventListener('click', () => doAction('right'));

btnReset.addEventListener('click', () => {
  state = createInitialState();
  updateDOM();
});

// Phaser setup
const TILE_SIZE = 32; // To make it fit perfectly in a 320x320 area

class DungeonScene extends Phaser.Scene {
  private playerGraphic!: Phaser.GameObjects.Text;
  private enemyGraphic!: Phaser.GameObjects.Text;
  private keyGraphic!: Phaser.GameObjects.Text;
  private exitGraphic!: Phaser.GameObjects.Text;
  private wallsGroup!: Phaser.GameObjects.Group;

  constructor() {
    super('DungeonScene');
  }

  create() {
    // Draw background grid lines (optional, looks nice)
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a3b5c, 0.5);
    for (let i = 0; i <= 10; i++) {
      graphics.moveTo(i * TILE_SIZE, 0);
      graphics.lineTo(i * TILE_SIZE, 10 * TILE_SIZE);
      graphics.moveTo(0, i * TILE_SIZE);
      graphics.lineTo(10 * TILE_SIZE, i * TILE_SIZE);
    }
    graphics.strokePath();

    this.wallsGroup = this.add.group();
    
    // Create initial entities
    this.keyGraphic = this.add.text(0, 0, '🔑', { fontSize: '20px' }).setOrigin(0.5);
    this.exitGraphic = this.add.text(0, 0, '🚪', { fontSize: '20px' }).setOrigin(0.5);
    this.playerGraphic = this.add.text(0, 0, '🧙', { fontSize: '20px' }).setOrigin(0.5);
    this.enemyGraphic = this.add.text(0, 0, '👺', { fontSize: '20px' }).setOrigin(0.5);

    // Initial draw
    this.syncWithState();
  }

  update() {
    this.syncWithState();
  }

  syncWithState() {
    // Draw Walls once
    if (this.wallsGroup.getChildren().length === 0) {
      state.walls.forEach(w => {
        const wall = this.add.rectangle(
          w.x * TILE_SIZE + TILE_SIZE/2, 
          w.y * TILE_SIZE + TILE_SIZE/2, 
          TILE_SIZE - 2, 
          TILE_SIZE - 2, 
          0x75444b
        );
        this.wallsGroup.add(wall);
      });
    }

    // Sync Positions
    this.playerGraphic.setPosition(
      state.player.x * TILE_SIZE + TILE_SIZE/2,
      state.player.y * TILE_SIZE + TILE_SIZE/2
    );
    this.enemyGraphic.setPosition(
      state.enemy.x * TILE_SIZE + TILE_SIZE/2,
      state.enemy.y * TILE_SIZE + TILE_SIZE/2
    );

    this.keyGraphic.setPosition(
      state.keyPos.x * TILE_SIZE + TILE_SIZE/2,
      state.keyPos.y * TILE_SIZE + TILE_SIZE/2
    );
    this.keyGraphic.setVisible(!state.hasKey);

    this.exitGraphic.setPosition(
      state.exitPos.x * TILE_SIZE + TILE_SIZE/2,
      state.exitPos.y * TILE_SIZE + TILE_SIZE/2
    );
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  parent: 'canvas',
  backgroundColor: '#24192f',
  scene: DungeonScene
};

new Phaser.Game(config);

// Initial UI
updateDOM();

// Keyboard support
window.addEventListener('keydown', (e) => {
  // Prevent scrolling for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  
  if (state.status !== 'playing') return;
  switch(e.key) {
    case 'ArrowUp': doAction('up'); break;
    case 'ArrowDown': doAction('down'); break;
    case 'ArrowLeft': doAction('left'); break;
    case 'ArrowRight': doAction('right'); break;
  }
});
