import Phaser from 'phaser';
import { createInitialState, processInput, syncPhysicsState, onHazardCollision, onGoalCollision, Input, CONSTANTS } from './simulation';
import { applyTerminalPlayerLock } from './terminalPhysics';
import { readKeyboardInput, type KeyboardInputKeys } from './inputControls';
import { PLAYER_FRAME_HEIGHT, PLAYER_FRAME_WIDTH, PLAYER_VISUAL_SCALE } from './playerTuning';
import levelData from './level8.json';

import regionsManifest from '../../../../manifests/academy.platformer-construction-pieces.regions.json';
import goblinManifest from '../../../../manifests/academy.platformer-goblin-player.animations.json';

import bgImageUrl from '../../../../assets/academy/games/one-room-platformer/tga-one-room-platformer-background-stage-concept-v0.1.png';
import propsImageUrl from '../../../../assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.2.png';
import goblinImageUrl from '../../../../assets/academy/derived-cleaned/goblin/tga-platformer-goblin-player-cleaned-v0.1.png';

let state = createInitialState();
const inputState: Input = { left: false, right: false, jump: false };

let totalEventsLogged = 1;
let terminalPhysicsLocked = false;

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
  playerSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasdKeys?: Pick<KeyboardInputKeys, 'a' | 'd' | 'w'>;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('bg', bgImageUrl);
    this.load.image('props', propsImageUrl);
    this.load.image('goblin', goblinImageUrl);
  }

  create() {
    // 1. Draw Background
    this.add.image(400, 300, 'bg'); // 800x600 canvas, centered at 400, 300

    // 2. Map Regions to the Props Texture
    const propsTexture = this.textures.get('props');
    for (const r of regionsManifest.regions) {
      propsTexture.add(r.id, 0, r.sourceRect.x, r.sourceRect.y, r.sourceRect.w, r.sourceRect.h);
    }
    
    // 3. Map Regions to the Goblin Texture & Create Animations
    const goblinTexture = this.textures.get('goblin');
    for (const anim of goblinManifest.animations) {
      for (const frame of anim.frames) {
        goblinTexture.add(`${anim.id}_${frame.index}`, 0, frame.sourceRect.x, frame.sourceRect.y, frame.sourceRect.w, frame.sourceRect.h);
      }
      this.anims.create({
        key: anim.id,
        frames: anim.frames.map((f: any) => ({ key: 'goblin', frame: `${anim.id}_${f.index}` })),
        frameRate: 10,
        repeat: anim.loop ? -1 : 0
      });
    }

    // 4. Build Level Geometry from Sticker Book JSON
    const platforms = this.physics.add.staticGroup();
    const hazards = this.physics.add.staticGroup();
    let goalSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody | null = null;
    
    for (const prop of levelData.props) {
      const region = regionsManifest.regions.find((r: any) => r.id === prop.id);
      if (!region) continue;
      
      const x = prop.x + region.sourceRect.w / 2;
      const y = prop.y + region.sourceRect.h / 2;
      const sprite = this.physics.add.staticSprite(x, y, 'props', prop.id);
      
      if (prop.id.includes('hazard')) {
        hazards.add(sprite);
      } else if (prop.id.includes('goal')) {
        goalSprite = sprite;
      } else {
        platforms.add(sprite);
      }
    }

    // 5. Spawn Player (The Engine Muscle)
    this.playerSprite = this.physics.add.sprite(
      levelData.player.x + levelData.player.w / 2, 
      levelData.player.y + levelData.player.h / 2, 
      'goblin', 
      'platformer-goblin.idle_0'
    );
    
    // The physics AABB is 32x48 per the contract.
    // The visual goblin frames are roughly 280x256.
    // PLAYER_VISUAL_SCALE keeps the goblin readable in the 800x600 Birthday Build room.
    const visualScale = PLAYER_VISUAL_SCALE;
    this.playerSprite.setScale(visualScale);
    
    const unscaledW = CONSTANTS.PLAYER_W / visualScale;
    const unscaledH = CONSTANTS.PLAYER_H / visualScale;
    this.playerSprite.body.setSize(unscaledW, unscaledH);
    this.playerSprite.body.setOffset((PLAYER_FRAME_WIDTH - unscaledW) / 2, PLAYER_FRAME_HEIGHT - unscaledH);
    
    this.playerSprite.setMaxVelocity(CONSTANTS.RUN_SPEED, CONSTANTS.MAX_FALL_SPEED);

    // 6. Setup Collisions (Physics Engine delegates consequences back to Simulation Brain)
    this.physics.add.collider(this.playerSprite, platforms);
    
    this.physics.add.overlap(this.playerSprite, hazards, () => {
      onHazardCollision(state);
    });
    
    if (goalSprite) {
      this.physics.add.overlap(this.playerSprite, goalSprite, () => {
        onGoalCollision(state);
      });
    }

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys({
        a: Phaser.Input.Keyboard.KeyCodes.A,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        w: Phaser.Input.Keyboard.KeyCodes.W
      }) as Pick<KeyboardInputKeys, 'a' | 'd' | 'w'>;
    }
    
    // Initial DOM setup
    const ledgerList = document.getElementById('ledger-list')!;
    ledgerList.innerHTML = `<li><span class="number">1.</span> Run started.</li>`;
    updateDOM();
  }

  update() {
    // 1. Phaser Physics syncs state to the Simulation Brain
    const isGrounded = this.playerSprite.body.touching.down || this.playerSprite.body.blocked.down;
    syncPhysicsState(
      state, 
      this.playerSprite.x, 
      this.playerSprite.y, 
      this.playerSprite.body.velocity.x, 
      this.playerSprite.body.velocity.y, 
      isGrounded
    );

    // 2. Read Keyboard Input
    if (this.cursors && state.runStatus === 'Active') {
      const keyboardInput = readKeyboardInput({
        left: this.cursors.left,
        right: this.cursors.right,
        up: this.cursors.up,
        space: this.cursors.space,
        a: this.wasdKeys?.a,
        d: this.wasdKeys?.d,
        w: this.wasdKeys?.w
      });
      inputState.left = keyboardInput.left || btnLeftDown;
      inputState.right = keyboardInput.right || btnRightDown;
      inputState.jump = keyboardInput.jump || btnJumpDown;
    } else if (state.runStatus !== 'Active') {
      inputState.left = false;
      inputState.right = false;
      inputState.jump = false;
    }

    // 3. Simulation Brain decides player's intent
    const intent = processInput(state, inputState);

    // 4. Phaser Physics applies the intent
    if (state.runStatus === 'Active') {
      this.playerSprite.setVelocityX(intent.vx);
      if (intent.doJump) {
        this.playerSprite.setVelocityY(CONSTANTS.JUMP_VELOCITY);
      }
    } else if (!terminalPhysicsLocked) {
      applyTerminalPlayerLock(this.playerSprite);
      terminalPhysicsLocked = true;
    }

    // 5. Renderer displays the Simulation Brain's intended animation
    const animKey = `platformer-goblin.${state.player.animState}`;
    if (this.playerSprite.anims.currentAnim?.key !== animKey) {
      this.playerSprite.play(animKey);
    }
    this.playerSprite.setFlipX(state.player.facing === 'left');

    updateDOM();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600, // Updated to 600 for the Sticker Book canvas
  parent: 'game-container',
  scene: MainScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: CONSTANTS.GRAVITY },
      debug: false
    }
  }
};

new Phaser.Game(config);

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
  window.location.reload();
});
