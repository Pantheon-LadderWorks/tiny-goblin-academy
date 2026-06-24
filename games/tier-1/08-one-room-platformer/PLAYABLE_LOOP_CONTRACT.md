# Level 8: One-Room Platformer - Playable Loop Contract

## Status
**Badge:** Playtested
**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(Current meaning: The game has passed automated playtesting.)*

## 1. Canonical Fixed Timestep
* Simulation function: `tick(state, input, deltaSeconds)`
* Canonical v0.1 step: `deltaSeconds = 1 / 60`
* Tests should use fixed-step simulation, not browser time.
* Renderer may use browser time only to schedule/accumulate fixed ticks.
* Simulation must not call `Date.now()`, `setInterval`, `requestAnimationFrame`, Phaser frame time, or engine physics internally.

## 2. Exact Coordinate System and Room
* Explicitly, all rectangles use a **top-left origin** with `x` and `y` marking the top-left corner.
* **Room Dimensions:** 800 width x 450 height.
* **Player Dimensions:** 32x48.
* **Spawn Position:** `x=60, y=352` (This places the bottom of the player perfectly on the floor at `y=400`).
* **Floor Rectangle:** x=0, y=400, w=800, h=50.
* **Platform 1:** x=230, y=310, w=150, h=24.
* **Platform 2:** x=470, y=235, w=150, h=24.
* **Spikes Rectangle:** x=395, y=376, w=80, h=24.
* **Goal Rectangle:** x=700, y=336, w=48, h=64.

## 3. Initial State
* Player starts exactly at the Spawn Position (`x=60, y=352`).
* `vx = 0`
* `vy = 0`
* `isGrounded = true`
* `runStatus = 'Active'`
* Ledger starts with `"Run started."`

## 4. Exact Movement Constants
* **Gravity:** 1800 px/s²
* **Run Speed:** 180 px/s
* **Jump Velocity:** -620 px/s
* **Max Fall Speed:** 900 px/s
* Left/Right input sets `vx` to `-runSpeed` / `+runSpeed`.
* No Left/Right input sets `vx` to 0.
* Jump only applies when `isGrounded` is true.
* No coyote time, no input buffering, no double jump.

## 5. Collision Rules
* Solids use strict AABB collision.
* Resolution order: horizontal movement resolved first, then vertical movement.
* Landing on a solid sets `vy = 0` and `isGrounded = true`.
* Hitting the underside or side of a solid prevents overlap (stops movement in that direction).
* Touching spikes causes Defeat.
* Touching the goal causes Victory.
* **Terminal Priority:** If spike and goal overlaps are somehow both detected in the same tick, Defeat takes priority over Victory.
* Terminal states lock movement/tick mutation except Reset.
* Reset restores the initial state.

## 6. Required Loop
* **Move → Jump → Avoid Spikes → Touch Goal.**
* The room guarantees at least one intentional jump, one avoidable spike hazard, and one reachable goal. The player can win safely, and a careless route loses.

## 7. Ledger Rule
* Logs discrete events only:
  - Run started.
  - Jumped.
  - Hit spikes.
  - Reached goal.
  - Reset.
* Do NOT log every movement tick.
* Newest-first numbering preserves historical order:
  `N. newest action`
  `...`
  `1. first action`

## 8. Visual Requirements
* **Tiny Goblin Academy shell:**
  * Top academy label and title.
  * Left status panel showing position (x,y), velocity (vx,vy), grounded state, run status.
  * Center framed one-room platformer scene.
  * Right action ledger.
  * Controls: Left, Right, Jump, Reset buttons mapped to keyboard arrows/space.
  * Visible player, floor/platforms, spikes, and goal.
  * No debug-page collapse.

## 9. Hard Exclusions (To prevent physics goblin chaos)
* No engine physics as game truth.
* No procedural generation.
* No scrolling camera.
* No enemies or combat.
* No health system or collectibles.
* No multiple rooms.
* No advanced platforming (coyote time, input buffering, wall jumps, double jumps).
* No particle systems, sound/music, or sprite animation system.
* No v0.2 or release work.
