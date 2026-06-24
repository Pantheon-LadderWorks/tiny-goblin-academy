import Phaser from 'phaser';
import { createInitialState, tick, Input, GEOMETRY, CONSTANTS } from './simulation';

let state = createInitialState();
const inputState: Input = { left: false, right: false, jump: false };

let totalEventsLogged = 1;

function updateDOM() {
  document.getElementById('pos-display')!.textContent = `${Math.round(state.player.x)}, ${Math.round(state.player.y)}`;
  document.getElementById('vel-display')!.textContent = `${Math.round(state.player.vx)}, ${Math.round(state.player.vy)}`;
  document.getElementById('grounded-display')!.textContent = state.player.isGrounded ? 'true' : 'false';
  
  const statusBadge = document.getElementById('run-status-display')!;
  statusBadge.textContent = state.runStatus;
  statusBadge.className = `badge ${state.runStatus.toLowerCase()}`;

  const ledgerList = document.getElementById('ledger-list')!;
  
  const numNewEvents = state.events.length - totalEventsLogged;
  
  for (let i = numNewEvents - 1; i >= 0; i--) {
    const li = document.createElement('li');
    // Numbering newest first
    const historicalNumber = state.events.length - i;
    li.innerHTML = `<span class="number">${historicalNumber}.</span> ${state.events[i]}`;
    ledgerList.insertBefore(li, ledgerList.firstChild);
  }
  
  totalEventsLogged = state.events.length;
}

class MainScene extends Phaser.Scene {
  playerRect!: Phaser.GameObjects.Rectangle;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('MainScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#2b2b2b');

    // Draw floor
    this.add.rectangle(
      GEOMETRY.FLOOR.x + GEOMETRY.FLOOR.w/2,
      GEOMETRY.FLOOR.y + GEOMETRY.FLOOR.h/2,
      GEOMETRY.FLOOR.w,
      GEOMETRY.FLOOR.h,
      0x555555
    );

    // Draw platform 1
    this.add.rectangle(
      GEOMETRY.PLATFORM_1.x + GEOMETRY.PLATFORM_1.w/2,
      GEOMETRY.PLATFORM_1.y + GEOMETRY.PLATFORM_1.h/2,
      GEOMETRY.PLATFORM_1.w,
      GEOMETRY.PLATFORM_1.h,
      0x777777
    );

    // Draw platform 2
    this.add.rectangle(
      GEOMETRY.PLATFORM_2.x + GEOMETRY.PLATFORM_2.w/2,
      GEOMETRY.PLATFORM_2.y + GEOMETRY.PLATFORM_2.h/2,
      GEOMETRY.PLATFORM_2.w,
      GEOMETRY.PLATFORM_2.h,
      0x777777
    );

    // Draw Spikes
    this.add.rectangle(
      GEOMETRY.SPIKES.x + GEOMETRY.SPIKES.w/2,
      GEOMETRY.SPIKES.y + GEOMETRY.SPIKES.h/2,
      GEOMETRY.SPIKES.w,
      GEOMETRY.SPIKES.h,
      0xff3333
    );

    // Draw Goal
    this.add.rectangle(
      GEOMETRY.GOAL.x + GEOMETRY.GOAL.w/2,
      GEOMETRY.GOAL.y + GEOMETRY.GOAL.h/2,
      GEOMETRY.GOAL.w,
      GEOMETRY.GOAL.h,
      0x33ff33
    );

    // Draw Player
    this.playerRect = this.add.rectangle(
      state.player.x + CONSTANTS.PLAYER_W/2,
      state.player.y + CONSTANTS.PLAYER_H/2,
      CONSTANTS.PLAYER_W,
      CONSTANTS.PLAYER_H,
      0x33aaff
    );

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Initial DOM setup
    const ledgerList = document.getElementById('ledger-list')!;
    ledgerList.innerHTML = `<li><span class="number">1.</span> Run started.</li>`;
    updateDOM();
  }

  update() {
    // Process keyboard input
    if (this.cursors && state.runStatus === 'Active') {
      inputState.left = this.cursors.left.isDown || btnLeftDown;
      inputState.right = this.cursors.right.isDown || btnRightDown;
      inputState.jump = this.cursors.up.isDown || this.cursors.space.isDown || btnJumpDown;
    } else if (state.runStatus !== 'Active') {
      inputState.left = false;
      inputState.right = false;
      inputState.jump = false;
    }

    // Sync rendering
    this.playerRect.setPosition(
      state.player.x + CONSTANTS.PLAYER_W/2,
      state.player.y + CONSTANTS.PLAYER_H/2
    );
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game-container',
  scene: MainScene
};

new Phaser.Game(config);

// Fixed Timestep Loop
const TICK_RATE = 1 / 60;
let accumulator = 0;
let lastTime = performance.now();

function gameLoop(time: number) {
  const frameTime = (time - lastTime) / 1000;
  lastTime = time;

  accumulator += Math.min(frameTime, 0.25);

  while (accumulator >= TICK_RATE) {
    tick(state, inputState, TICK_RATE);
    accumulator -= TICK_RATE;
  }

  updateDOM();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

let btnLeftDown = false;
let btnRightDown = false;
let btnJumpDown = false;

// DOM Bindings
const bindButton = (id: string, action: (down: boolean) => void) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('mousedown', () => action(true));
  btn.addEventListener('mouseup', () => action(false));
  btn.addEventListener('mouseleave', () => action(false));
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); action(true); });
  btn.addEventListener('touchend', (e) => { e.preventDefault(); action(false); });
};

bindButton('btn-left', (d) => btnLeftDown = d);
bindButton('btn-right', (d) => btnRightDown = d);
bindButton('btn-jump', (d) => btnJumpDown = d);

document.getElementById('btn-reset')?.addEventListener('click', () => {
  state = createInitialState();
  totalEventsLogged = 1;
  const ledgerList = document.getElementById('ledger-list')!;
  ledgerList.innerHTML = `<li><span class="number">1.</span> Run started.</li>`;
  state.events.unshift('Reset.');
  updateDOM();
});
