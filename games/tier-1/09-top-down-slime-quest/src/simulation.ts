export type Rect = { x: number; y: number; w: number; h: number };

export type Direction = 'up' | 'down' | 'left' | 'right';

export type PlayerState = {
  rect: Rect;
  facing: Direction;
  state: 'Normal' | 'Pouncing';
  pounceTimer: number;
};

export type EnemyState = {
  rect: Rect;
  status: 'Active' | 'Defeated';
  patrolTimer: number;
};

export type EssenceState = {
  rect: Rect;
  status: 'Inactive' | 'Active' | 'Collected';
};

export type GameState = {
  player: PlayerState;
  enemy: EnemyState;
  essence: EssenceState;
  exit: Rect;
  runStatus: 'Active' | 'Victory' | 'Defeat';
  ledger: string[];
};

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  pounce: boolean;
  reset: boolean;
};

export const INITIAL_STATE: GameState = {
  player: {
    rect: { x: 80, y: 300, w: 32, h: 32 },
    facing: 'right',
    state: 'Normal',
    pounceTimer: 0
  },
  enemy: {
    rect: { x: 360, y: 300, w: 32, h: 32 },
    status: 'Active',
    patrolTimer: 0 // Used for horizontal patrol math if needed
  },
  essence: {
    rect: { x: 0, y: 0, w: 16, h: 16 },
    status: 'Inactive'
  },
  exit: { x: 720, y: 268, w: 64, h: 64 },
  runStatus: 'Active',
  ledger: ['Slime awakened.']
};

export function checkOverlap(r1: Rect, r2: Rect): boolean {
  return (
    r1.x < r2.x + r2.w &&
    r1.x + r1.w > r2.x &&
    r1.y < r2.y + r2.h &&
    r1.y + r1.h > r2.y
  );
}

export function logEvent(state: GameState, msg: string) {
  if (state.ledger.length === 0 || state.ledger[state.ledger.length - 1] !== msg) {
    state.ledger.push(msg);
  }
}

export function tick(state: GameState, input: InputState, deltaSeconds: number): GameState {
  if (input.reset) {
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  if (state.runStatus !== 'Active') {
    return state;
  }

  // 1. Process Pounce
  const POUNCE_DURATION = 0.25;
  const POUNCE_SPEED = 400;
  const NORMAL_SPEED = 150;

  if (state.player.state === 'Normal' && input.pounce) {
    state.player.state = 'Pouncing';
    state.player.pounceTimer = POUNCE_DURATION;
    logEvent(state, 'Pounced.');
  }

  let vx = 0;
  let vy = 0;

  if (state.player.state === 'Pouncing') {
    state.player.pounceTimer -= deltaSeconds;
    if (state.player.pounceTimer <= 0) {
      state.player.state = 'Normal';
      state.player.pounceTimer = 0;
    } else {
      if (state.player.facing === 'up') vy = -POUNCE_SPEED;
      if (state.player.facing === 'down') vy = POUNCE_SPEED;
      if (state.player.facing === 'left') vx = -POUNCE_SPEED;
      if (state.player.facing === 'right') vx = POUNCE_SPEED;
    }
  } else {
    // Normal Movement
    if (input.up) { vy = -NORMAL_SPEED; state.player.facing = 'up'; }
    else if (input.down) { vy = NORMAL_SPEED; state.player.facing = 'down'; }
    else if (input.left) { vx = -NORMAL_SPEED; state.player.facing = 'left'; }
    else if (input.right) { vx = NORMAL_SPEED; state.player.facing = 'right'; }
  }

  // Move Player X
  let oldX = state.player.rect.x;
  state.player.rect.x += vx * deltaSeconds;
  
  // X bounds (Room: 800x600)
  let hitWallX = false;
  if (state.player.rect.x < 0) { state.player.rect.x = 0; hitWallX = true; }
  if (state.player.rect.x + state.player.rect.w > 800) { state.player.rect.x = 800 - state.player.rect.w; hitWallX = true; }

  // Move Player Y
  let oldY = state.player.rect.y;
  state.player.rect.y += vy * deltaSeconds;
  
  // Y bounds
  let hitWallY = false;
  if (state.player.rect.y < 0) { state.player.rect.y = 0; hitWallY = true; }
  if (state.player.rect.y + state.player.rect.h > 600) { state.player.rect.y = 600 - state.player.rect.h; hitWallY = true; }

  // Bonk logic
  if (state.player.state === 'Pouncing' && (hitWallX || hitWallY)) {
    state.player.state = 'Normal';
    state.player.pounceTimer = 0;
    logEvent(state, 'Bonked wall.');
  }

  // 2. Enemy Patrol
  if (state.enemy.status === 'Active') {
    state.enemy.patrolTimer += deltaSeconds;
    // Horizontal patrol between 360 and 520, speed 90. distance = 160.
    // 160 / 90 = ~1.77s one way.
    // We can just bounce it using a simple formula:
    const patrolDist = 160;
    const patrolSpeed = 90;
    const cycleTime = patrolDist / patrolSpeed; // time to go one way
    const period = cycleTime * 2;
    const t = state.enemy.patrolTimer % period;
    
    if (t < cycleTime) {
      state.enemy.rect.x = 360 + (t * patrolSpeed);
    } else {
      state.enemy.rect.x = 360 + patrolDist - ((t - cycleTime) * patrolSpeed);
    }
  }

  // 3. Enemy Collision
  if (state.enemy.status === 'Active' && checkOverlap(state.player.rect, state.enemy.rect)) {
    if (state.player.state === 'Pouncing') {
      state.enemy.status = 'Defeated';
      logEvent(state, 'Enemy defeated.');
      
      // Spawn essence centered on enemy
      state.essence.status = 'Active';
      state.essence.rect.x = state.enemy.rect.x + (state.enemy.rect.w / 2) - (state.essence.rect.w / 2);
      state.essence.rect.y = state.enemy.rect.y + (state.enemy.rect.h / 2) - (state.essence.rect.h / 2);
    } else {
      state.runStatus = 'Defeat';
      logEvent(state, 'Defeated.');
      return state; // Terminal lock (Defeat priority)
    }
  }

  // 4. Essence Collection
  if (state.essence.status === 'Active' && checkOverlap(state.player.rect, state.essence.rect)) {
    state.essence.status = 'Collected';
    logEvent(state, 'Essence absorbed.');
    logEvent(state, 'Exit unlocked.');
  }

  // 5. Victory Check
  if (state.essence.status === 'Collected' && checkOverlap(state.player.rect, state.exit)) {
    state.runStatus = 'Victory';
    logEvent(state, 'Escaped.');
    return state;
  }

  return state;
}
