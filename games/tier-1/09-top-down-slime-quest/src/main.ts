import Phaser from 'phaser';
import { tick, INITIAL_STATE, GameState, InputState } from './simulation';

class Level9Scene extends Phaser.Scene {
  private gameState: GameState;
  
  // Phaser Graphics/Sprites
  private slimeGraphics!: Phaser.GameObjects.Graphics;
  private enemyGraphics!: Phaser.GameObjects.Graphics;
  private essenceGraphics!: Phaser.GameObjects.Graphics;
  private exitGraphics!: Phaser.GameObjects.Graphics;
  
  // DOM Elements
  private uiSlimePos!: HTMLElement;
  private uiSlimeFacing!: HTMLElement;
  private uiSlimeState!: HTMLElement;
  private uiEssence!: HTMLElement;
  private uiExit!: HTMLElement;
  private uiRunStatus!: HTMLElement;
  private uiLedger!: HTMLElement;

  // Inputs
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  private btnUp = false;
  private btnDown = false;
  private btnLeft = false;
  private btnRight = false;
  private btnPounce = false;
  private btnReset = false;

  private accumulator = 0;
  private readonly FIXED_TIMESTEP = 1 / 60;
  private lastLedgerCount = 0;

  constructor() {
    super('Level9Scene');
    this.gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  create() {
    this.setupUI();
    this.setupInput();
    this.createGraphics();
  }

  private setupUI() {
    this.uiSlimePos = document.getElementById('ui-slime-pos')!;
    this.uiSlimeFacing = document.getElementById('ui-slime-facing')!;
    this.uiSlimeState = document.getElementById('ui-slime-state')!;
    this.uiEssence = document.getElementById('ui-essence')!;
    this.uiExit = document.getElementById('ui-exit')!;
    this.uiRunStatus = document.getElementById('ui-run-status')!;
    this.uiLedger = document.getElementById('ledger-list')!;

    const bindButton = (id: string, setter: (val: boolean) => void) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('mousedown', () => setter(true));
      el.addEventListener('mouseup', () => setter(false));
      el.addEventListener('mouseleave', () => setter(false));
      el.addEventListener('touchstart', (e) => { e.preventDefault(); setter(true); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); setter(false); });
    };

    bindButton('btn-up', v => this.btnUp = v);
    bindButton('btn-down', v => this.btnDown = v);
    bindButton('btn-left', v => this.btnLeft = v);
    bindButton('btn-right', v => this.btnRight = v);
    bindButton('btn-pounce', v => this.btnPounce = v);
    
    const resetBtn = document.getElementById('btn-reset');
    resetBtn?.addEventListener('click', () => {
      this.btnReset = true;
    });
  }

  private setupInput() {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private createGraphics() {
    this.exitGraphics = this.add.graphics();
    this.essenceGraphics = this.add.graphics();
    this.enemyGraphics = this.add.graphics();
    this.slimeGraphics = this.add.graphics();
  }

  update(time: number, delta: number) {
    this.accumulator += delta / 1000;

    // Build input state
    const currentInput: InputState = {
      up: this.btnUp || this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.btnDown || this.cursors.down.isDown || this.wasd.S.isDown,
      left: this.btnLeft || this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.btnRight || this.cursors.right.isDown || this.wasd.D.isDown,
      pounce: this.btnPounce || Phaser.Input.Keyboard.JustDown(this.spaceKey),
      reset: this.btnReset
    };

    this.btnReset = false; // Consume reset

    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.gameState = tick(this.gameState, currentInput, this.FIXED_TIMESTEP);
      
      // Consume pounce input immediately after processing tick
      if (currentInput.pounce) {
        currentInput.pounce = false;
        this.btnPounce = false;
      }
      
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    this.updateRender();
  }

  private updateRender() {
    // 1. Exit
    this.exitGraphics.clear();
    const e = this.gameState.exit;
    this.exitGraphics.fillStyle(0x555500, 1);
    if (this.gameState.essence.status === 'Collected') {
      this.exitGraphics.fillStyle(0xddaa00, 1); // Yellow when unlocked
    }
    this.exitGraphics.fillRect(e.x, e.y, e.w, e.h);
    // Draw lock/unlock visual
    if (this.gameState.essence.status !== 'Collected') {
      this.exitGraphics.fillStyle(0xFF0000, 1);
      this.exitGraphics.fillRect(e.x + e.w/2 - 4, e.y + e.h/2 - 4, 8, 8);
    } else {
      this.exitGraphics.fillStyle(0x111111, 1);
      this.exitGraphics.fillRect(e.x + 8, e.y + 8, e.w - 16, e.h - 16);
    }

    // 2. Essence
    this.essenceGraphics.clear();
    if (this.gameState.essence.status === 'Active') {
      const ess = this.gameState.essence.rect;
      this.essenceGraphics.fillStyle(0x00FFFF, 1);
      const pulse = Math.sin(this.time.now / 150) * 2;
      this.essenceGraphics.fillCircle(ess.x + ess.w/2, ess.y + ess.h/2, (ess.w/2) + pulse);
    }

    // 3. Enemy
    this.enemyGraphics.clear();
    if (this.gameState.enemy.status === 'Active') {
      const en = this.gameState.enemy.rect;
      this.enemyGraphics.fillStyle(0xFF0000, 1);
      this.enemyGraphics.fillRect(en.x, en.y, en.w, en.h);
      
      // Face indicator
      this.enemyGraphics.fillStyle(0x000000, 1);
      this.enemyGraphics.fillRect(en.x + 8, en.y + 8, 16, 8);
      // Angry eyebrows
      this.enemyGraphics.lineStyle(2, 0x000000);
      this.enemyGraphics.beginPath();
      this.enemyGraphics.moveTo(en.x + 4, en.y + 4);
      this.enemyGraphics.lineTo(en.x + 14, en.y + 8);
      this.enemyGraphics.moveTo(en.x + 28, en.y + 4);
      this.enemyGraphics.lineTo(en.x + 18, en.y + 8);
      this.enemyGraphics.strokePath();
    }

    // 4. Slime
    this.slimeGraphics.clear();
    const p = this.gameState.player.rect;
    
    // Color: Green if normal, brighter green if pouncing
    const isPounce = this.gameState.player.state === 'Pouncing';
    const slimeColor = isPounce ? 0x00FF00 : 0x00AA00;
    this.slimeGraphics.fillStyle(slimeColor, 1);
    
    let drawW = p.w;
    let drawH = p.h;
    let drawX = p.x;
    let drawY = p.y;
    
    if (isPounce) {
      if (this.gameState.player.facing === 'left' || this.gameState.player.facing === 'right') {
        drawW = p.w + 8;
        drawH = p.h - 8;
        drawY += 4;
        if (this.gameState.player.facing === 'right') drawX -= 4;
      } else {
        drawH = p.h + 8;
        drawW = p.w - 8;
        drawX += 4;
        if (this.gameState.player.facing === 'down') drawY -= 4;
      }
    }
    
    this.slimeGraphics.fillRoundedRect(drawX, drawY, drawW, drawH, 8);

    // Facing indicator (eyes)
    this.slimeGraphics.fillStyle(0x000000, 1);
    const eyeSize = 4;
    let ex = p.x + p.w / 2;
    let ey = p.y + p.h / 2;
    const offset = 10;
    
    if (this.gameState.player.facing === 'up') ey -= offset;
    if (this.gameState.player.facing === 'down') ey += offset;
    if (this.gameState.player.facing === 'left') ex -= offset;
    if (this.gameState.player.facing === 'right') ex += offset;
    
    this.slimeGraphics.fillCircle(ex - 4, ey - 2, eyeSize);
    this.slimeGraphics.fillCircle(ex + 4, ey - 2, eyeSize);

    // Update DOM UI
    this.uiSlimePos.innerText = `X: ${Math.round(p.x)}, Y: ${Math.round(p.y)}`;
    this.uiSlimeFacing.innerText = this.gameState.player.facing;
    this.uiSlimeState.innerText = this.gameState.player.state;
    this.uiEssence.innerText = this.gameState.essence.status;
    this.uiExit.innerText = this.gameState.essence.status === 'Collected' ? 'Unlocked' : 'Locked';
    
    let runStr: string = this.gameState.runStatus;
    if (runStr === 'Defeat') runStr = 'Defeat (Red)';
    if (runStr === 'Victory') runStr = 'Victory (Green)';
    this.uiRunStatus.innerText = runStr;

    // Update Ledger (only append new)
    if (this.gameState.ledger.length < this.lastLedgerCount) {
      this.uiLedger.innerHTML = ''; // Clear on reset
      this.lastLedgerCount = 0;
    }

    if (this.gameState.ledger.length > this.lastLedgerCount) {
      for (let i = this.lastLedgerCount; i < this.gameState.ledger.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="number">${i + 1}.</span> ${this.gameState.ledger[i]}`;
        this.uiLedger.prepend(li); // Newest first
      }
      this.lastLedgerCount = this.gameState.ledger.length;
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#111',
  scene: Level9Scene,
  physics: {
    default: 'arcade', // Not used for logic, only Phaser required it in our older boilerplates
    arcade: { debug: false }
  }
};

new Phaser.Game(config);
