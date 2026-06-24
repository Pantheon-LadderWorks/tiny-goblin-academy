export type Rect = { x: number; y: number; w: number; h: number };

export type PlayerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  jumpHeld: boolean;
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
  PLAYER_W: 32,
  PLAYER_H: 48
};

export const GEOMETRY = {
  ROOM_W: 800,
  ROOM_H: 450,
  FLOOR: { x: 0, y: 400, w: 800, h: 50 },
  PLATFORM_1: { x: 230, y: 310, w: 150, h: 24 },
  PLATFORM_2: { x: 470, y: 235, w: 150, h: 24 },
  SPIKES: { x: 395, y: 376, w: 80, h: 24 },
  GOAL: { x: 700, y: 336, w: 48, h: 64 }
};

export function createInitialState(): GameState {
  return {
    player: {
      x: 60,
      y: 352,
      vx: 0,
      vy: 0,
      isGrounded: true,
      jumpHeld: false
    },
    runStatus: 'Active',
    events: ['Run started.']
  };
}

export function checkAABB(r1: Rect, r2: Rect): boolean {
  return (
    r1.x < r2.x + r2.w &&
    r1.x + r1.w > r2.x &&
    r1.y < r2.y + r2.h &&
    r1.y + r1.h > r2.y
  );
}

export function tick(state: GameState, input: Input, deltaSeconds: number): void {
  if (state.runStatus !== 'Active') {
    return;
  }

  const { player } = state;
  const solids: Rect[] = [GEOMETRY.FLOOR, GEOMETRY.PLATFORM_1, GEOMETRY.PLATFORM_2];

  // Horizontal Movement
  if (input.left && !input.right) {
    player.vx = -CONSTANTS.RUN_SPEED;
  } else if (input.right && !input.left) {
    player.vx = CONSTANTS.RUN_SPEED;
  } else {
    player.vx = 0;
  }

  player.x += player.vx * deltaSeconds;

  // Horizontal Collision
  let pRect: Rect = { x: player.x, y: player.y, w: CONSTANTS.PLAYER_W, h: CONSTANTS.PLAYER_H };
  for (const solid of solids) {
    if (checkAABB(pRect, solid)) {
      if (player.vx > 0) {
        player.x = solid.x - CONSTANTS.PLAYER_W;
      } else if (player.vx < 0) {
        player.x = solid.x + solid.w;
      }
      player.vx = 0;
      pRect.x = player.x;
    }
  }

  // Room Bounds (Horizontal)
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
    pRect.x = 0;
  } else if (player.x > GEOMETRY.ROOM_W - CONSTANTS.PLAYER_W) {
    player.x = GEOMETRY.ROOM_W - CONSTANTS.PLAYER_W;
    player.vx = 0;
    pRect.x = player.x;
  }

  // Vertical Movement
  player.vy += CONSTANTS.GRAVITY * deltaSeconds;
  if (player.vy > CONSTANTS.MAX_FALL_SPEED) {
    player.vy = CONSTANTS.MAX_FALL_SPEED;
  }

  // Jump logic (edge detection to prevent holding space from jumping instantly on land without a new press)
  const jumpJustPressed = input.jump && !player.jumpHeld;
  player.jumpHeld = input.jump;

  if (jumpJustPressed && player.isGrounded) {
    player.vy = CONSTANTS.JUMP_VELOCITY;
    player.isGrounded = false;
    state.events.unshift('Jumped.');
  }

  player.y += player.vy * deltaSeconds;
  player.isGrounded = false; // assume airborne until collision

  // Vertical Collision
  pRect.y = player.y;
  for (const solid of solids) {
    if (checkAABB(pRect, solid)) {
      if (player.vy > 0) {
        // Landing
        player.y = solid.y - CONSTANTS.PLAYER_H;
        player.isGrounded = true;
      } else if (player.vy < 0) {
        // Hitting ceiling
        player.y = solid.y + solid.h;
      }
      player.vy = 0;
      pRect.y = player.y;
    }
  }

  // Terminal checks
  const touchingSpikes = checkAABB(pRect, GEOMETRY.SPIKES);
  const touchingGoal = checkAABB(pRect, GEOMETRY.GOAL);

  // Defeat takes priority
  if (touchingSpikes) {
    state.runStatus = 'Defeat';
    state.events.unshift('Hit spikes.');
  } else if (touchingGoal) {
    state.runStatus = 'Victory';
    state.events.unshift('Reached goal.');
  }
}
