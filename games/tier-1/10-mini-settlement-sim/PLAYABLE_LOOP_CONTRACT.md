# Level 10: Mini Settlement Sim - Playable Loop Contract

## Status
**Badge:** Playtested / Human Review Passed
**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(Current meaning: Level 10 has been successfully playtested and passed human review.)*

## 1. Exact Starting State
* **Day**: 1 / 10
* **Citizens**: 3
* **Food**: 6
* **Wood**: 3
* **Shelter**: 1
* **Selected Priority**: Forage (by default)
* **Run Status**: Active
* **Ledger**: Starts with "Settlement founded."

## 2. Priority Behavior
* The player can select `Forage`, `Chop`, or `Build` before pressing `Advance Day`.
* The selected priority persists and remains selected until changed.
* Priority selection itself does not advance the day or mutate resources.
* Only `Advance Day` mutates resources and increments the day.

## 3. Exact Daily Resolution Order
`advanceDay()` must resolve exactly in this order:
1. **Consume food**: `Food -= Citizens`.
2. If `Food < 0`, **Defeat** from starvation.
   * *If starvation Defeat occurs after food consumption, resolution stops immediately. Do not apply priority. Do not resolve Day 5 Storm. Do not check Victory. Do not increment Day.*
3. **Apply selected priority**:
   * `Forage`: +4 Food.
   * `Chop`: +3 Wood.
   * `Build`: if Wood >= 3, spend 3 Wood and +1 Shelter; otherwise no build and ledger says insufficient wood.
4. **Resolve scripted event for current day**:
   * Day 5 Storm: if Shelter < 2, **Defeat**. *(Building on Day 5 satisfies this requirement because Priority resolves before the scripted event).*
   * *If Day 5 Storm causes Defeat, resolution stops immediately. Do not check Victory. Do not increment Day.*
5. If current day is Day 10 and no defeat occurred, **Victory**.
   * *If Victory occurs at the end of Day 10, resolution stops immediately. Do not increment to Day 11.*
6. Otherwise, advance to next day (`Day += 1`).

## 4. Exact Win/Loss Rules
**Defeat**:
* Food < 0 after consumption.
* Day 5 Storm resolves while Shelter < 2.

**Victory**:
* End Day 10 without defeat.

**Terminal states**:
* Lock priority changes and `Advance Day` after Victory/Defeat.
* `Reset` remains available.

## 5. Architecture Boundaries
**Simulation owns**:
* day
* citizens
* food
* wood
* shelter
* selected priority
* run status
* event flags
* ledger
* win/loss resolution

**Renderer owns**:
* visual adaptation of citizens, shelter, resources, storm state, and day state only.

**DOM/UI owns**:
* text-heavy HUD
* priority buttons
* Advance Day button
* Reset button
* action ledger display

**Input actions**:
* Select Forage
* Select Chop
* Select Build
* Advance Day
* Reset

*Renderer objects, DOM labels, CSS classes, and canvas sprites must never become the source of game truth.*

## 6. Visual Shell
Tiny Goblin Academy shell required:
* **Top label**: TINY GOBLIN ACADEMY • LEVEL 10
* **Title**: Mini Settlement Sim
* **Subtitle**: Survive 10 Days
* **Left panel**: Settlement Status
  * Run Status
  * Day
  * Citizens
  * Food
  * Wood
  * Shelter
  * Selected Priority
* **Center playfield**: one-screen settlement visualization
  * three citizens
  * shelter count
  * visible resource state or simple icons/meters
  * Day 5 storm visual/state when active
* **Right panel**: Action Ledger
  * newest-first allowed
  * numbering preserves historical order
* **Controls**:
  * Forage
  * Chop
  * Build
  * Advance Day
  * Reset

*(No debug-page collapse.)*

## 7. Skill Lane
Use: `game-studio` → `web-game-foundations` → `phaser-2d-game` → `game-ui-frontend` → `game-playtest`

Also require:
* `test-driven-development`
* `systematic-debugging` when behavior is wrong
* `verification-before-completion`

*(Do not use `sprite-pipeline` unless Kryssie explicitly approves resident sprite/animation work.)*

## 8. Hard Exclusions
* No Aether architecture.
* No LLM agents.
* No procedural generation.
* No pathfinding.
* No ECS/world-engine scaffolding.
* No infinite simulation.
* No save/load.
* No tech trees.
* No diplomacy.
* No combat/enemies.
* No complex AI.
* No more than three citizens.
* No more than three resources.
* No more than one settlement screen.
* No more than one scripted event unless explicitly approved.
* No multiple building types beyond Shelter.
* No v0.2/release work.
