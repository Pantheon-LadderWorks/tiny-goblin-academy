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

## Asset Sheet Intake Pipeline

Required sequence before any sheet is wired into hub/game code:

1. **Register Sheet**: Place original asset in appropriate `assets/academy/` location.
2. **Inspect Sheet**: Check dimensions, content, and visual artifacts.
3. **Transparency / Background Audit**: Check if checkerboard is true alpha or baked.
4. **Layout Classification**: Note if it is a uniform grid or irregular pantry.
5. **Region or Frame Mapping**: Map all required sprites in a JSON manifest.
6. **Derived Cleanup Decision**: Apply cleanup tool (e.g., full-sheet flood fill) if fake transparency is found, generating a derived sheet.
7. **Validator Creation**: Add bounds and sanity checking to `scripts/validate-*`.
8. **Wiring**: Update frontend or game code to pull from the mapped/derived asset.
9. **Screenshot / Contact Sheet Evidence**: Capture visual evidence of the integration.
10. **Human Review**: Visually review the evidence to catch artifacts that bypass tests.
11. **Promotion Status**: Mark the asset as wired/passed in the intake checklist.

**Explicit Reminders:**
* Asset pantry generation is not the same as asset readiness.
* No direct sheet-to-game wiring.
* No direct sheet-to-hub wiring.
* Screenshots are required because visual artifacts (like baked backgrounds) can pass build/tests.
* Human review decides whether the pixels are acceptable.

## Asset Pantry Doctrine

* Generated asset sheets are source pantries, not mandatory usage contracts.
* Games should only use sprites that are explicitly mapped in future manifests.
* Unused sprites may remain in sheets as future options.
* Duplicate, imperfect, or unused sprites do not block intake as long as the sheet is clearly marked concept/v0.1.
* Production implementation should rely on named manifest entries, not manual visual guessing.
* Manifests should include `used`, `unused`, or `reserved` notes where helpful.

## Fake Transparency Cleanup Doctrine

* Some generated images visually show a checkerboard background but do not contain real alpha.
* RGBA mode alone does not prove transparency. Alpha distribution must be inspected.
* If alpha is 255 for every pixel, the checkerboard is baked. CSS cannot remove opaque baked checkerboard pixels.
* The preferred static-sheet cleanup shape is **full-sheet border-connected low-saturation gray flood fill to alpha**.
* Keep the original source sheet untouched.
* Write cleaned output as a derived sheet.
* Do not manually cut individual PNGs.
* Do not globally remove all gray pixels.
* **H2.5b Example**: The hub icon source sheet was preserved, a transparent derived sheet was generated and accepted, manifest/source-rectangle rendering was preserved, and no manual icon cutouts were made.

## Static Sheet vs Animation Sheet Warning

* Static icon/UI sheets are safer candidates for full-sheet fake-transparency cleanup.
* Animation sheets are more dangerous. Do not run the same cleanup blindly on sprite animation sheets.
* Animation sheets require:
  * A frame manifest
  * Contact sheet evidence
  * Baseline/anchor review
  * One pilot row/animation cleanup
  * Human review before bulk processing
* The failure mode for animation sheets is corrupted limbs, shadows, outlines, motion smear, or "transparent kneecaps."

## Platformer Background / Anchor Doctrine

* Side-view platformer backgrounds should not be treated like top-down tilemaps.
* A one-room platformer background should provide negative space for gameplay.
* Foreground platforms should have visual justification: shelves, ledges, brackets, beams, stone lips, training apparatus, or other anchor points.
* Background detail must not fight gameplay readability.
* Platformer construction pieces and background stage plates are separate asset families.
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

* **Top-down terrain/floor construction sheet**
  * Path: `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`
  * Intended Use: Shared top-down terrain and floor tile pantry for Dungeon Key Run and Top-Down Slime Quest.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Contains center, edge, corner, water, path, slime, and special floor tiles. Future manifests will select only the tiles actually used.

* **Top-down wall/boundary construction sheet**
  * Path: `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png`
  * Intended Use: Shared top-down wall, boundary, gate, doorway, and obstacle pantry for map construction.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Intended to support inward-facing room boundaries and collision edges. Future manifests must verify which wall/corner pieces align cleanly.

* **Top-down environment objects sheet**
  * Path: `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`
  * Intended Use: Shared top-down placed props and interactables for Dungeon Key Run and Top-Down Slime Quest.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Object pantry only; games should use manifest-approved objects and ignore duplicates or unused extras.

* **Top-Down Slime Quest playfield candidate**
  * Path: `assets/academy/games/top-down-slime-quest/tga-top-down-slime-quest-playfield-pack-concept-v0.1.png`
  * Intended Use: Game 09-specific top-down playfield parts and outdoor/map props.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Useful as a game-specific pantry alongside shared top-down terrain/walls/objects.

* **One-Room Platformer side-view construction pieces**
  * Path: `assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png`
  * Intended Use: Level 08 side-view construction pantry: platforms, ledges, supports, lava, hazards, traversal props, exit/goal objects, and background-compatible props.
  * Status: concept / v0.1 / needs manifest.
  * Notes: Primary side-view construction sheet for One-Room Platformer. Distinct from top-down sheets. Includes platform anchor/support pieces so foreground platforms can visually make sense.

* **One-Room Platformer background/stage plate**
  * Path: `assets/academy/games/one-room-platformer/tga-one-room-platformer-background-stage-concept-v0.1.png`
  * Intended Use: Level 08 fixed-screen side-view academy training room backdrop.
  * Status: concept / v0.1 / needs layout integration plan.
  * Notes: Designed with central negative space and platform anchor logic so floating platforms do not look like random stickers. Not a tile sheet. Not top-down. Not parallax yet.

## Missing Asset Groups

**Future Work:**
* Full implementation/layout integration of concept assets

**Medium/Optional priority:**
* Individual full backgrounds/backdrops (Potion Sorter, Dice Duel Tavern, Card Goblin Duel, Pet Campfire, Farm/Settlement)

**Concept-ingested:**
* Top-down shared terrain/wall/object construction
* Side-view platformer construction kit
* Side-view platformer background/stage plate

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

* Optional individual backgrounds/backdrops for Potion Sorter, Dice Duel Tavern, Card Goblin Duel, Pet Campfire, Farm/Settlement
* Next architecture task: Hub Contract / manifest strategy
