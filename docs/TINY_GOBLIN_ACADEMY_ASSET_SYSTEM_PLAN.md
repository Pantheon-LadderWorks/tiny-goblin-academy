# Tiny Goblin Academy Asset System Plan

## Purpose

Tiny Goblin Academy now has a modular asset-sheet system for future visual passes and hub/game polish.

## Core Doctrine

* No one giant mega-sheet.
* Use modular sheets by purpose.
* Sheets are sliceable tools, not art collages.
* One sheet + one manifest = no manual cutting.
* Use source rectangles / manifest data to pull sprites from sheets.
* Do not wire assets into games until manifests and implementation plans exist.

## Asset Categories

1. Shared Academy Core
2. UI / HUD
3. Creature Expression Sheets
4. Creature Movement / Animation Sheets
5. Game-Specific Sheets
6. Backgrounds / Playfields
7. FX / Feedback Sheets
8. Studio / Boot Assets

## Current Ingested TGA Sheets

* **Shared core sheet**
  * Path: `assets/academy/shared-core/tga-shared-core-sheet-v0.1.png`
  * Intended Use: Common items, generic props, universal pickups.
  * Status: v0.1 / concept / needs manifest.

* **UI/HUD sheet**
  * Path: `assets/academy/ui/tga-ui-hud-sheet-v0.1.png`
  * Intended Use: Buttons, panels, frames, icons, typography blocks.
  * Status: v0.1 / concept / needs manifest.

* **Goblin expression/action sheet**
  * Path: `assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png`
  * Intended Use: Mascot reactions, UI hints, clicker feedback. Not for directional movement.
  * Status: v0.1 / concept / needs manifest.

* **Platformer goblin player sheet**
  * Path: `assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png`
  * Intended Use: Side-view platformer physics entity (run, jump, idle). Platformer goblin can use engine horizontal flipping for left movement.
  * Status: v0.1 / concept / needs manifest.

* **Top-down slime player sheet**
  * Path: `assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png`
  * Intended Use: Top-down continuous movement. Top-down sprites need true directional rows.
  * Status: v0.1 / concept / needs manifest.

* **Top-down soldier enemy sheet**
  * Path: `assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png`
  * Intended Use: Top-down patrolling/chasing enemy logic.
  * Status: v0.1 / concept / needs manifest.

* **Platformer training dummy enemy concept sheet**
  * Path: `assets/academy/creatures/training-dummy/tga-platformer-training-dummy-enemy-concept-v0.1.png`
  * Intended Use: Stationary or simple side-view hazards. Training dummy sheet includes row labels and should eventually get a clean production export if used directly.
  * Status: concept / needs textless cleanup / needs manifest.

* **Potion sorter concept sheet**
  * Path: `assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png`
  * Intended Use: Game 02 specific potions, vials, shelves. Potion sorter concept sheet includes some baked-in labels/text and should eventually get a textless production version.
  * Status: concept / needs textless cleanup / needs manifest.

* **Farm/settlement sheet**
  * Path: `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png`
  * Intended Use: Game 06 and 10 agriculture and building props.
  * Status: v0.1 / concept / needs manifest.

* **Dungeon/platformer mixed concept sheet**
  * Path: `assets/academy/games/dungeon-platformer/tga-dungeon-platformer-mixed-sheet-concept-v0.1.png`
  * Intended Use: Mixed parts bin for Game 05 and Game 08 environments. Dungeon/platformer sheet is a mixed-perspective parts bin, useful for v0.1 planning but may later split into dedicated top-down dungeon and side-view platformer sheets.
  * Status: concept / needs textless cleanup / needs manifest.

## Missing Asset Groups

**High priority:**
1. Dice Duel Tavern dedicated asset sheet
2. Card Goblin Duel dedicated asset sheet
3. Pet Campfire dedicated asset sheet
4. Dedicated backgrounds/playfields for 05, 08, and 09
5. Shared FX / feedback sheet

**Medium priority:**
6. Potion lab background
7. Farm background
8. Settlement board/background
9. Cleaner top-down dungeon environment sheet
10. Cleaner side-view platformer tile/environment sheet

## Background Needs

Games with moveable characters need visual playfields:
* 05 Dungeon Key Run needs a top-down dungeon/chamber background or tile set.
* 08 One-Room Platformer needs a side-view academy training room / platformer backdrop.
* 09 Top-Down Slime Quest needs a top-down slime arena / dungeon floor / room backdrop.

Also note:
* 02 Potion Sorter needs an alchemy table/shelf background.
* 03 Dice Duel Tavern needs tavern tabletop/room background.
* 04 Card Goblin Duel needs card-table/duel-board background.
* 07 Pet Campfire needs forest clearing/night camp background.
* 10 Mini Settlement Sim needs settlement board/village background.

## Suggested Repo Asset Structure

Current folder structure uses `/assets/academy/` categorizations.

**Suggested manifest convention:**
Every production sheet should eventually have:
* `.png`
* `.manifest.json`
* `.notes.md`

Example:
`assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png`
`assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.manifest.json`
`assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.notes.md`

## Manifest Strategy

Manifests should define:
* sheet image path
* cell width/height
* row/column frame ranges
* animation names
* anchor/baseline notes
* whether engine flipping is allowed
* usage notes
* cleanup status

## Non-Goals

* Do not implement game visual swaps yet.
* Do not rebuild Level 1.
* Do not create the hub.
* Do not regenerate assets automatically.
* Do not treat concept assets as final production art without review.

## Next Recommended Asset Generation

1. Dice Duel Tavern sheet
2. Card Goblin Duel sheet
3. Pet Campfire sheet
4. Shared FX sheet
5. Background/playfield pack for 05 / 08 / 09
