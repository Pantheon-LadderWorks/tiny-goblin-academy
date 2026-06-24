# Level 7: Pet Campfire - Playable Loop Contract

## Fantasy
Sit by a campfire with a tiny goblin pet. Watch its needs, feed it, and keep it happy so it doesn't run off into the woods. 

## Expected Mechanical Lesson
Transitioning from discrete action-driven ticks to **continuous variables (meters) and real-time state decay** (the Tamagotchi mechanic). The simulation must expose a deterministic `tick(deltaSeconds: number)` function, avoiding internal reliance on `Date.now()`, `setInterval`, browser timers, or Phaser frame time. The renderer/browser may call the tick on an interval, but the simulation itself remains pure and testable.

## Status
**Badge:** Contract Approved

**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded

*(Current meaning: Level 7 contract is approved for implementation after this clarification patch. No First Playable, Playtested, Released, Retired, Expanded, v0.2, or human-review pass is implied.)*

## 1. Exact Starting State
* **Hunger**: 100
* **Happiness**: 100
* **SurvivalTime**: 0
* **Day Status**: Active
* **Pet Status**: Idle
* **Ledger**: Starts with "Campfire lit."

## 2. Exact Decay Rules
* For v0.1, the canonical tick is `tick(1)`. The browser/UI may call `tick(1)` once per second.
* Decay rules are evaluated per one-second tick:
  * `Hunger` -4
  * `Happiness` -3
  * `SurvivalTime` +1
* Meters clamp strictly between 0 and 100.
* `deltaSeconds` values other than `1` are not required for v0.1 unless explicitly implemented and tested.

## 3. Exact Interaction Rules
* **Feed**: Restores `Hunger` by 25, capped at 100. Sets Pet Status to `Eating`.
* **Play**: Restores `Happiness` by 25, capped at 100. Sets Pet Status to `Playing`.
* **Pet Status Reversion**: The next valid tick returns `Eating`/`Playing` to `Idle` unless that tick causes Victory or Defeat.
* **Infinite Resources**: Feed and Play do not consume inventory; food and play are infinite.
* **Terminal Lock**: Feed, Play, and ticking mutations are disabled after a terminal Victory or Defeat. Reset is the only valid action.

## 4. Terminal Rules
* **Defeat**: Triggered when `Hunger` <= 0 or `Happiness` <= 0. Sets Pet Status to `RanAway`.
* **Victory**: Triggered when `SurvivalTime` >= 60. Sets Pet Status to `Sleeping`.

## 5. UI Requirements
* **Visual Shell**: Tiny Goblin Academy shell.
* **Left Panel**: Shows `Hunger`, `Happiness`, `SurvivalTime`, `Pet Status`, `Day Status`.
* **Center Canvas**: Shows the pet and campfire with visible pet mood/state.
* **Right Ledger**: Uses newest-first display with historically correct numbering.
* **Controls**: Feed, Play, Reset.
* **No debug-page collapse**.

## 6. Hard Exclusions (To prevent scope creep)
* No multiple pets.
* No inventory or food count.
* No minigames (playing is just a button press).
* No pet pathfinding or complex wandering AI.
* No weather or day/night cycle.
* No persistent save.
* No affection levels or unlocks.
* No v0.2 or external release work.
