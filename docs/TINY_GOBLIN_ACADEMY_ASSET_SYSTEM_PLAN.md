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

* **Dice Duel Tavern sheet**
  * Path: `assets/academy/games/dice-duel-tavern/tga-dice-duel-tavern-sheet-concept-v0.1.png`
  * Intended Use: Game 03 dice faces, roll effects, duel tokens, tavern props, and feedback icons.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Candidate generated through Antigravity image generation and approved for concept intake. Good grid/sliceability and no obvious text labels. Needs manifest before implementation.

* **Card Goblin Duel card frames sheet**
  * Path: `assets/academy/games/card-goblin-duel/tga-card-goblin-duel-card-frames-concept-v0.1.png`
  * Intended Use: Game 04 card shells, card backs, slots, highlighted/disabled card states, and blank overlay-ready card surfaces.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Split-sheet strategy produced stronger reusable blank card frames than the first mixed concept sheet.

* **Card Goblin Duel UI/tokens sheet**
  * Path: `assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`
  * Intended Use: Game 04 action icons, status badges, portrait tokens, feedback effects, and duel UI markers.
  * Status: concept / v0.1 / needs textless cleanup / needs manifest.
  * Notes: Useful concept sheet, but includes baked “ACTIVE TURN” text on one token, so it should not be treated as production-ready until cleaned or regenerated.

* **Pet Campfire Ember Pup sheet**
  * Path: `assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`
  * Intended Use: Game 07 Ember Pup pet poses, care props, campfire props, need/status icons, and pet feedback markers.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Ember Pup is the canonical first Pet Campfire companion. Sheet is cleaner and more slice-friendly than the alternate reference, but future polish should strengthen the ember identity with dim/glow/smoke/fire-tail states.

* **Shared FX / Feedback utility sheet**
  * Path: `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png`
  * Intended Use: Cross-game shared feedback, event-linked, and object-linked utility sprites.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Useful cross-game shared feedback sheet. Includes a mix of pure FX and object-linked effect/event sprites. Accepted for v0.1 because it is highly reusable, but a future v0.2 pass may generate a stricter pure-FX sheet.

## Missing Asset Groups

**High priority:**
1. Dedicated backgrounds/playfields for 05, 08, and 09

**Medium priority:**
6. Potion lab background
7. Farm background
8. Settlement board/background
9. Cleaner top-down dungeon environment sheet
10. Cleaner side-view platformer tile/environment sheet

## Future Pet Candidates

Future optional pet concepts:
* **Lantern Toad** — glowing belly camp companion.
* **Moss Ferret** — sneaky cozy academy pet.
* **Root Pup** — plant-like dog companion with twig/leaf traits.
* **Pebble Boarlet** — stubborn tiny boar with stone-like hide.
* **Ash-Cat** — soot-colored familiar with ember eyes.
* **Button Bat** — tiny cave/academy bat companion.

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

1. Background/playfield pack for 05 / 08 / 09
2. Remaining individual game backgrounds
