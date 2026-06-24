# Playable Loop Contract — 10x10 Dungeon Key Run

## Status

Badge: Contract Approved

Scale:
Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded

Current meaning:
Level 5 contract is approved for implementation. No First Playable, Playtested, Released, Retired, Expanded, v0.2, or human-review pass is implied.

## Player fantasy
Traverse a compact grid, get a key, outmaneuver a patrolling enemy, and open the exit.

## Primary player verb
Move tile by tile (Up, Down, Left, Right).

## First playable loop
Input (Move) → Valid move check → Update player position → Key/Exit resolution → Enemy advances → Collision check → Ledger records turn → Next choice or Terminal state

## Start state
- A 10x10 grid is visible, framed within the Tiny Goblin Academy shell.
- Player is at their start position.
- Enemy is at its start position.
- One key and one locked exit are visible.
- Left status panel shows rules/status; right ledger shows "Dungeon entered."

## Turn Order
1. Player chooses a direction.
2. If move is valid (no wall, within bounds), player position updates. (If invalid, turn ends with no enemy movement, and ledger notes "Blocked").
3. Key pickup / exit check resolves based on new player position.
4. Enemy patrol advances one step (unless game is already terminal).
5. Collision check resolves (Player/Enemy overlap).
6. Ledger records the turn events.

## Success and failure
- **Success:** Player reaches unlocked exit with key. Show VICTORY and lock controls.
- **Failure:** Enemy catches player (overlap). Show DEFEAT and lock controls.
- **Locked Exit:** If player reaches exit without key, do not win; ledger notes "Exit is locked."
- **Reset:** Include a Reset button to restart the fixed map. Do not auto-reset immediately after defeat.

## Bounded content
- Hardcoded 10x10 grid with deterministic layout.
- Walls/bounds block movement.
- One key, one exit, one enemy, one player start.
- Fixed deterministic enemy patrol route (moves one tile after each valid player move).

## Explicit exclusions
- No procedural generation.
- No combat, weapons, or inventory.
- No multiple keys, multiple enemy types, or fog of war.
- No diagonal movement, animation system, or pathfinding (A*, line-of-sight, chase AI).
- No save system, meta progression, or release/v0.2.

## Architecture boundaries
- Simulation owns: 10x10 grid data, entity positions, turn order, collisions, and win/loss state.
- Renderer owns: Visual representation of the simulation grid (CSS/emoji/shapes). Must never own game truth.
- DOM UI owns: Tiny Goblin Academy shell (Header, left status, right ledger).
- Input actions: Up, Down, Left, Right, Reset.

## Default skill lane
`game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`

## Definition of done
A player can boot the game, navigate the grid using keyboard controls, understand walls, collect the key, observe the patrolling enemy moving deterministically, reach the exit to win (or get caught and lose), and reset the state.

## Required playtest evidence
Screenshots showing:
- Boot state.
- Blocked movement or wall collision.
- Key acquired.
- Locked exit interaction (if possible).
- Enemy danger/defeat.
- Victory terminal state.

## Tests
Vitest suite must include:
- Initial map state.
- Blocked walls and out-of-bounds movement.
- Valid movement.
- Key pickup.
- Locked exit without key.
- Unlocked exit with key.
- Enemy patrol advancing after valid player moves.
- Enemy does not advance after invalid moves (unless intentionally documented otherwise).
- Collision/defeat.
- Victory lock and Defeat lock.
- Reset restores initial state.
- Proof renderer never owns simulation truth.

## Stop conditions specific to this game
- Enemy behavior drifts into chase logic instead of fixed patrol.
- Grid visuals look like a debug spreadsheet instead of distinct readable entities.
- Grid does not fit within the Tiny Goblin Academy shell.
- Turn order becomes asynchronous or non-deterministic.
