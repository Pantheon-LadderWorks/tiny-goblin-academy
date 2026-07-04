# Level 8: One-Room Platformer - Playable Loop Contract

## Status
**Badge:** Playtested
**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(Current meaning: The game has passed automated playtesting.)*

## 1. Canonical Fixed Timestep & Physics Graduation
* **Architecture Evolution:** During earlier lessons, collision mathematics were implemented manually to expose the underlying concepts. Having completed that objective, the runtime now delegates collision resolution to Phaser Arcade Physics while preserving the simulation layer as the authoritative source of gameplay state, victory/defeat logic, animation intent, and event ledgers.
* Phaser is the collision solver (the muscle). `simulation.ts` is the game brain.
* The renderer reads the simulation state to determine what animations to play.

## 2. Exact Coordinate System and Room
* Explicitly, all rectangles use a **top-left origin** with `x` and `y` marking the top-left corner.
* **Birthday Build Canvas:** 800 width x 600 height.
* **Original Contract Room:** 800 width x 450 height. This remains useful historical contract context, but the Birthday Build uses the larger sticker-book room layout in `src/level8.json`.
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
* **Jump Velocity:** -720 px/s
* **Max Fall Speed:** 900 px/s
* Left/Right arrow or A/D input sets `vx` to `-runSpeed` / `+runSpeed`.
* No Left/Right input sets `vx` to 0.
* Jump via Spacebar, Up, or W only applies when `isGrounded` is true.
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
* **Birthday Build Fix 1:** Terminal states now park the player physics body by zeroing velocity, disabling gravity, and stopping active body movement so a defeated or victorious goblin does not keep falling after the run ends.
* Reset restores the initial state.

## 6. Required Loop
* **Move → Jump → Avoid Spikes → Touch Goal.**
* The room guarantees at least one intentional jump, one avoidable spike hazard, and one reachable goal. The player can win safely, and a careless route loses.

## 6.1 Required Path Reachability Doctrine
* **Birthday Build Fix 3:** Level 8 v0.1 validates only the required win path: start left, cross/clear the spike hazard through the intended route, and reach the door/goal.
* Manual Sticker Book placement is an authoring input, not automatic gameplay approval. Required-route placements must be checked against the current player movement contract.
* Optional or future-route platforms may remain unreachable until a future mechanic, key route, double jump, moving platform, or room progression contract requires them.
* The v0.1 movement contract remains single-jump only: no double jump, no wall jump, no dash, no coyote time, and no moving platforms.

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
  * Controls: Left, Right, Jump, Reset buttons in a page/HUD control row below the canvas, mapped to keyboard arrows/space and WASD.
  * **Birthday Build Fix 2:** Page controls must not obstruct the 800x600 playable stage. Level controls belong in page/HUD layout unless intentionally designed as in-world UI.
  * Visible player, floor/platforms, spikes, and goal.
  * No debug-page collapse.

## 9. Hard Exclusions (To prevent physics goblin chaos)
* No procedural generation.
* No scrolling camera.
* No enemies or combat.
* No health system or collectibles.
* No multiple rooms.
* No advanced platforming (coyote time, input buffering, wall jumps, double jumps).
* No particle systems or sound/music.
* No v0.2 or release work.

## 10. Birthday Build Follow-Up Issues
* **Resolved — Terminal fall loop:** Fixed in Birthday Build Fix 1. Defeat/Victory now apply a terminal physics lock so the player stops simulating as an active falling actor.
* **Resolved — Control bar overlap:** Fixed in Birthday Build Fix 2. The game container now matches the 800x600 Phaser canvas so DOM controls render below the full playfield instead of over the lower room.
* **Resolved — Required path jump/readability tuning:** Fixed in Birthday Build Fix 3. Player scale and single-jump velocity now support the required first platform / hazard-crossing route without adding double jump or validating optional upper platforms.
* **Contract/runtime alignment:** `src/level8.json` is now the current Birthday Build layout source. This contract should be reconciled with the JSON before final release-style approval.
