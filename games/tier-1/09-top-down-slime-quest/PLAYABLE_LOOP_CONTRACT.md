# Level 9: Top-Down Slime Quest - Playable Loop Contract

## Status
**Badge:** Human Review Passed
**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(Current meaning: Playtested / Human Review Passed. No Released, Retired, Expanded, v0.2, or release authorization is implied.)*

## 1. Canonical Fixed Timestep
* Simulation function: `tick(state, input, deltaSeconds)`
* Timestep: Fixed `1/60` seconds. Browser timers (`requestAnimationFrame`) call this repeatedly.
* Engine Physics: None. All resolution is deterministic AABB handled inside `simulation.ts`.

## 2. Playable Elements & Scale
* **Room:** 800 x 600 top-down boundary. No internal walls for v0.1.
* **Player (Slime):**
  * Dimensions: 32 x 32 AABB.
  * Spawn: x=80, y=300.
  * Initial State: `Normal`, `pounceTimer = 0`.
  * Initial Facing: `right`.
  * Movement: 4-directional continuous movement (Speed: 150px/s).
* **Enemy (Adventurer/Boot):**
  * Dimensions: 32 x 32 AABB.
  * Spawn: x=360, y=300.
  * Behavior: Horizontal patrol between x=360 and x=520 at y=300, speed 90 px/s.
  * State: `Active` or `Defeated`.
* **Essence Drop:**
  * Dimensions: 16 x 16 AABB.
  * Inactive until enemy defeated, then spawns centered on defeated enemy.
* **Exit:**
  * Location: x=720, y=268, w=64, h=64 AABB.
  * Locked until Essence is collected.

## 3. Pounce Mechanics
* **Trigger:** Input action ('space' or 'button').
* **Rules:**
  * Starts only from `Normal` state.
  * Uses the current facing direction (updated from last movement input).
  * Fixed Speed: 400px/s.
  * Fixed Duration: 0.25 seconds.
  * Cannot be steered.
  * Wall Collision: Stops the pounce immediately (logs bonk event), returns to `Normal`.
  * Enemy Collision: Overlap during pounce defeats the enemy and spawns essence.
  * Prevents spamming while already pouncing.

## 4. Combat, Collision & Progression
* **Defeat:** `Slime` touches `Enemy` while in `Normal` state.
* **Victory:** `Slime` touches `Exit` AFTER collecting `Essence`.
* **Priority:**
  * Pouncing enemy contact has priority over normal-contact defeat.
  * If Defeat and Victory are both detected in the same tick, Defeat has priority.
  * Terminal states (Victory/Defeat) lock movement, pounce, enemy patrol mutation, and collection except Reset.
* **Flow:** Move -> Align -> Pounce -> Enemy Defeated -> Essence Drops -> Collect Essence -> Exit Unlocks -> Touch Exit -> Victory.
* **Ledger:** Starts with "Slime awakened." or equivalent. Logs only discrete events.

## 5. Exclusions
* No HP, no XP, no leveling, no evolution tree, no multiple attacks, no tendril, no inventory, no dialogue.

## 6. Verification
* Automated playtest via `capture.cjs`.
* Evidence required:
  * `01-boot.png` (Weak slime, enemy patrolling).
  * `02-pounce.png` (Slime pouncing).
  * `03-defeat.png` (Touch enemy normally).
  * `04-victory.png` (Enemy defeated, essence absorbed, exit reached).
