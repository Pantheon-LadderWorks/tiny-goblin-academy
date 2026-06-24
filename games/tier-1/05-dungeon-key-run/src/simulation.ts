export type Position = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  status: 'playing' | 'victory' | 'defeat';
  player: Position;
  enemy: Position;
  hasKey: boolean;
  keyPos: Position;
  exitPos: Position;
  walls: Position[];
  patrolPath: Position[];
  patrolIndex: number;
  ledger: string[];
}

export const isSamePosition = (p1: Position, p2: Position) => p1.x === p2.x && p1.y === p2.y;

export function createInitialState(): GameState {
  const walls: Position[] = [];
  // 10x10 outer boundaries
  for (let i = 0; i < 10; i++) {
    walls.push({ x: i, y: 0 });
    walls.push({ x: i, y: 9 });
    if (i > 0 && i < 9) {
      walls.push({ x: 0, y: i });
      walls.push({ x: 9, y: i });
    }
  }
  // Bisecting wall to create a chokepoint
  for (let i = 1; i <= 6; i++) {
    walls.push({ x: i, y: 4 });
    walls.push({ x: i, y: 5 });
  }

  return {
    status: 'playing',
    player: { x: 1, y: 2 },
    keyPos: { x: 1, y: 7 },
    exitPos: { x: 2, y: 2 },
    hasKey: false,
    enemy: { x: 7, y: 4 },
    patrolPath: [
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      { x: 8, y: 5 },
      { x: 7, y: 5 }
    ],
    patrolIndex: 0,
    walls,
    ledger: ['Dungeon entered.']
  };
}

export function movePlayer(state: GameState, dir: Direction): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const newState = { ...state, ledger: [...state.ledger] };
  let newX = state.player.x;
  let newY = state.player.y;

  switch (dir) {
    case 'up': newY -= 1; break;
    case 'down': newY += 1; break;
    case 'left': newX -= 1; break;
    case 'right': newX += 1; break;
  }

  const newPos = { x: newX, y: newY };

  // Check bounds
  if (newX < 0 || newX > 9 || newY < 0 || newY > 9) {
    newState.ledger.push('Blocked by bounds.');
    return newState;
  }

  // Check walls
  if (state.walls.some(w => isSamePosition(w, newPos))) {
    newState.ledger.push('Blocked by a wall.');
    return newState;
  }

  // Valid move
  newState.player = newPos;
  let turnLog = `Moved ${dir}.`;

  // Key pickup
  if (!newState.hasKey && isSamePosition(newState.player, newState.keyPos)) {
    newState.hasKey = true;
    turnLog += ' Collected Key. Reach the exit.';
  }

  // Exit check
  if (isSamePosition(newState.player, newState.exitPos)) {
    if (newState.hasKey) {
      newState.status = 'victory';
      newState.ledger.push(turnLog);
      newState.ledger.push('Exit unlocked. Escape!');
      newState.ledger.push('Victory! You escaped the dungeon.');
      return newState;
    } else {
      turnLog += ' Exit is locked.';
    }
  }

  // Enemy patrol advances
  newState.patrolIndex = (newState.patrolIndex + 1) % newState.patrolPath.length;
  newState.enemy = newState.patrolPath[newState.patrolIndex];

  // Collision check
  if (isSamePosition(newState.player, newState.enemy)) {
    newState.status = 'defeat';
    turnLog += ' Caught by the enemy!';
    newState.ledger.push(turnLog);
    newState.ledger.push('Defeat! The dungeon claims another soul.');
    return newState;
  }

  newState.ledger.push(turnLog);
  return newState;
}
