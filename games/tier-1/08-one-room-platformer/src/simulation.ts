export type Rect = { x: number; y: number; w: number; h: number };

export type PlayerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  jumpHeld: boolean;
  animState: 'idle' | 'walk' | 'jump' | 'hurt';
  facing: 'left' | 'right';
};

export type GameState = {
  player: PlayerState;
  runStatus: 'Active' | 'Victory' | 'Defeat';
  events: string[];
};

export type Input = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

export const CONSTANTS = {
  GRAVITY: 1800,
  RUN_SPEED: 180,
  JUMP_VELOCITY: -620,
  MAX_FALL_SPEED: 900,
  PLAYER_W: 32, // The physics bounding box width
  PLAYER_H: 48, // The physics bounding box height
};

export function createInitialState(): GameState {
  return {
    player: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      isGrounded: false,
      jumpHeld: false,
      animState: 'idle',
      facing: 'right'
    },
    runStatus: 'Active',
    events: ['Run started.']
  };
}

/**
 * Phaser is the muscle (physics). Simulation is the brain (game rules).
 * Phaser calls this every frame to update the Simulation with the true physical state.
 */
export function syncPhysicsState(state: GameState, x: number, y: number, vx: number, vy: number, grounded: boolean) {
  state.player.x = x;
  state.player.y = y;
  state.player.vx = vx;
  state.player.vy = vy;
  
  if (state.runStatus !== 'Active') return;
  state.player.isGrounded = grounded;
  
  // Determine animation intent based on physics state
  if (!grounded) {
    state.player.animState = 'jump';
  } else if (Math.abs(vx) > 10) {
    state.player.animState = 'walk';
  } else {
    state.player.animState = 'idle';
  }

  if (vx > 10) state.player.facing = 'right';
  if (vx < -10) state.player.facing = 'left';
}

/**
 * Simulation processes input and decides what the character intends to do.
 * It returns the desired horizontal velocity and whether a jump should occur.
 * Phaser will apply these back to the physics body.
 */
export function processInput(state: GameState, input: Input): { vx: number, doJump: boolean } {
  if (state.runStatus !== 'Active') return { vx: 0, doJump: false };

  let targetVx = 0;
  if (input.left && !input.right) {
    targetVx = -CONSTANTS.RUN_SPEED;
  } else if (input.right && !input.left) {
    targetVx = CONSTANTS.RUN_SPEED;
  }

  const jumpJustPressed = input.jump && !state.player.jumpHeld;
  state.player.jumpHeld = input.jump;

  let doJump = false;
  if (jumpJustPressed && state.player.isGrounded) {
    doJump = true;
    state.events.unshift('Jumped.');
  }

  return { vx: targetVx, doJump };
}

// Collision Callbacks triggered by Phaser overlaps
export function onHazardCollision(state: GameState) {
  if (state.runStatus === 'Active') {
    state.runStatus = 'Defeat';
    state.player.animState = 'hurt';
    state.events.unshift('Hit spikes.');
  }
}

export function onGoalCollision(state: GameState) {
  if (state.runStatus === 'Active') {
    state.runStatus = 'Victory';
    state.player.animState = 'idle';
    state.events.unshift('Reached goal.');
  }
}
