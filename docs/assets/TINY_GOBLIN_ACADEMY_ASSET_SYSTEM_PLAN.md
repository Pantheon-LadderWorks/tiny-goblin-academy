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

Expanded reusable workflow:

`docs/assets/TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`

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

## H5.3 Shared Core Region Mapping Note

H5.3 performs Shared Core lane region mapping for `assets/academy/shared-core/tga-shared-core-sheet-v0.1.png`. The mapping remains `draft-review`, and no runtime wiring occurred.

H5.3 evidence follows the H5.2B standard:

1. bbox overlay over the source sheet;
2. numbered contact sheet of mapped crops;
3. region table preview showing id, category, sourceRect, usage, and reviewStatus.

The cleaned Shared Core preview remains derived review evidence only and is not runtime truth. Shared FX remains deferred/high-risk and out of scope for this lane.

## Semantic Discovery and Future Capability Matrix

Manifests are semantic discovery records, not final usage plans. Region mapping records what the pantry appears to contain: sourceRects, labels, categories, grouping choices, uncertainty, and review status.

The full asset capability matrix comes after broad mapping coverage across shared sheets, UI/HUD, characters, terrain, FX, and game-specific sheets. Do not use the future matrix as a reason to wire assets early. Unused mapped assets remain pantry ingredients until a later review and runtime promotion gate.

## H5.6 Goblin Expression/Action Mapping Note

H5.6 opens the first goblin expression/action semantic discovery lane for `assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png`.

This is not full animation mapping. It does not create animation sequences, pivots, hitboxes, or runtime character behavior. Evidence includes bbox overlay, numbered contact sheet, and region table preview. No runtime wiring occurred, and Shared FX remains deferred/high-risk.

## H5.7 Platformer Goblin Animation Contract Note

H5.7 opens the first animation-sheet contract lane for `assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png`.

The platformer goblin player sheet is separate from the H5.6 expression/action pantry. H5.7 records metadata, transparency findings, visual layout risks, a draft skeleton animation manifest, and a dedicated animation validator. It does not map full sequences, assign frame order, define pivots/hitboxes/hurtboxes, run cleanup, create runtime animation behavior, or wire the sheet into any game.

Cleanup remains deferred because the source is RGBA but fully opaque with a baked checkerboard. Future sequence mapping requires sequence evidence, frame-order review, pivot/baseline review, and later hitbox/hurtbox gates before runtime use.

## H5.16 Pet Campfire Split-Lane Intake Note

H5.16 opens Pet Campfire split-lane intake for `assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png` and `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`.

Pet Campfire is not a single standard static-prop sheet. Ember Pup is treated as a character/state asset requiring future character/animation review, while care props, mood/status icons, reward tokens, and campfire/environment objects are separate future region lanes. The Pet Campfire background is deferred as a scene-anchor background and must not be processed as a sprite sheet.

H5.16 creates intake metadata, split-lane classification, and cleanup-risk evidence only. No runtime wiring occurred, no source PNGs were modified, and no production cleaned sheet was created.

## H5.17 Pet Campfire Static Props + Icons Mapping Note

H5.17 maps the static prop, environment prop, reward token, and status/mood icon lane from `assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`.

The resulting draft manifest is `manifests/academy.pet-campfire.static-props-icons.regions.json`, with synchronized bbox overlay, numbered contact sheet, and table preview evidence under `assets/academy/evidence/h5-17-pet-campfire-static-props-icons/`.

This pass intentionally excludes Ember Pup character poses and animation/state decisions. It also keeps cleanup deferred: the source is RGB with baked checkerboard, no production cleaned sheet was created, and no runtime wiring occurred.

## H5.18 Pet Campfire Static Props + Icons Cleanup Candidate Note

H5.18 creates a derived transparent cleanup candidate for the 25 Pet Campfire static prop/icon regions mapped in H5.17.

The source sheet remains untouched. The derived candidate is `assets/academy/games/pet-campfire/derived/tga-pet-campfire-static-props-icons-cleaned-v0.1.png`, with cleanup evidence under `assets/academy/evidence/h5-18-pet-campfire-static-props-icons-cleanup/` and cleanup metadata in `manifests/academy.pet-campfire.static-props-icons.cleanup-candidate.json`.

Cleanup remains draft-review. Runtime wiring did not occur, Ember Pup poses were not cleaned, and the background was used only for overlay preview evidence.

## H5.19 Pet Campfire Cleanup Human Review Note

H5.19 records Kryssie's human review acceptance of the H5.18 Pet Campfire static props/icons cleanup candidate.

The cleanup candidate is accepted for draft pipeline use and recorded in `manifests/academy.pet-campfire.static-props-icons.cleanup-candidate.json` as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-pipeline-use`.

This does not mark the asset runtime-approved. Source PNGs remain untouched, runtime wiring did not occur, and Ember Pup poses remain deferred to a future character/state or animation candidate lane.

## H5.20 Ember Pup Pose / Animation Candidate Mapping Note

H5.20 maps 16 Ember Pup pose/state candidates from `assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`.

The draft manifest is `manifests/academy.pet-campfire.ember-pup.pose-candidates.json`, with evidence under `assets/academy/evidence/h5-20-ember-pup-pose-candidates/`.

This is a character/state lane, not a static prop lane. No cleanup occurred, no runtime animation timing was assigned, no pivots or hitboxes were created, and no gameplay/runtime wiring occurred. The human-accepted static props/icons cleanup candidate remains separate.

## H5.21 Ember Pup Pose Human Review Note

H5.21 records Kryssie's human/product review pass for the H5.20 Ember Pup pose candidate mapping.

The pose candidate manifest is now marked `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-pose-cleanup-pipeline-use`. The 16 sourceRects, draft semantic labels, and future sequence grouping notes are accepted as draft cleanup-planning evidence only.

This does not mark any pose runtime-approved. No Ember Pup cleanup occurred, no source PNGs were modified, no runtime animation timing was assigned, no pivots/anchors/hitboxes were created, and no gameplay/runtime wiring occurred. Ambiguous labels such as eating/play-bow, muddy/sick, and sad/tired remain intentionally soft.

## H5.22 Ember Pup Pose Cleanup Candidate Note

H5.22 creates a derived transparent cleanup candidate for the 16 reviewed Ember Pup pose/state candidates.

The derived candidate is `assets/academy/games/pet-campfire/derived/tga-pet-campfire-ember-pup-poses-cleaned-v0.1.png`, with cleanup metadata in `manifests/academy.pet-campfire.ember-pup.pose-cleanup-candidate.json` and evidence under `assets/academy/evidence/h5-22-ember-pup-pose-cleanup/`.

The current product interpretation is that these are pose/state symbols, not enough coherent frames for approved runtime animation cycles. Cleanup remains draft-review; source PNGs remain untouched; the H5.18/H5.19 static props/icons cleanup candidate remains untouched; no animation timing, pivots, anchors, hitboxes, gameplay states, or runtime wiring were approved.

## H5.23 Ember Pup Cleanup Human Review Note

H5.23 records Kryssie's human/product review acceptance of the H5.22 Ember Pup pose/state cleanup candidate.

The cleanup candidate is accepted for draft pose/state-symbol pipeline use and recorded in `manifests/academy.pet-campfire.ember-pup.pose-cleanup-candidate.json` as `status: reviewed`, `reviewStatus: human-review-passed`, `pipelineUse: accepted-for-draft-pose-state-symbol-pipeline-use`, `runtimeEligibility: not-runtime-approved`, and `animationApproval: none`.

This promotion does not make Ember Pup a runtime animation sheet. The cleaned poses may support draft state symbols, portraits, pet moods, or future planning inputs, but animation cycles, timing, pivots, anchors, hitboxes, gameplay states, and runtime wiring remain unapproved.

## H5.24 Pet Campfire Background Scene-Anchor Audit Note

H5.24 audits `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png` as a scene-anchor background.

The draft scene-anchor manifest is `manifests/academy.pet-campfire.background.scene-anchors.json`, with evidence under `assets/academy/evidence/h5-24-pet-campfire-background-scene-anchors/`.

This pass maps 14 visual placement/readability zones for future planning, including the central campfire focal area, pet-safe lower clearings, tent/care cluster, stump/table interaction cluster, UI-safe upper sky, foreground obstruction zones, and lantern/sign readability risks. The background remains source-preserved; no sprite extraction, background prop cutouts, runtime placement data, game-code changes, or Pet Campfire wiring occurred.

## H5.25 Pet Campfire Scene-Anchor Human Review Note

H5.25 records Kryssie's human/product review of the H5.24 Pet Campfire scene-anchor audit.

The scene-anchor manifest is now accepted for draft scene-anchor planning as `status: reviewed`, `reviewStatus: human-review-passed-with-placement-notes`, `pipelineUse: accepted-for-draft-scene-anchor-planning`, `runtimeEligibility: not-runtime-approved`, and `placementApproval: none`.

The key correction is that the H5.24 ghost preview did not approve generic asset placement. Future planning must split Ember Pup state-symbol placement from UI/prop/care-symbol placement. Accepted cleaned assets are not automatically valid scene placements, and the accepted props/icons atlas must not be dumped directly into scene space.

## H5.26 Pet Campfire Dual Placement Grammar Note

H5.26 creates two draft placement grammar manifests:

* `manifests/academy.pet-campfire.ember-pup.state-placement-plan.json`
* `manifests/academy.pet-campfire.ui-prop-care-placement-plan.json`

The first grammar covers Ember Pup state-symbol placement: idle, happy, sad, sick, sleeping, eating, drinking, active, and excited pose-symbols. The second grammar covers UI/prop/care-symbol placement: care props, campfire/environment props, mood/status icons, feedback icons, reward markers, and quest/status markers.

This pass connects accepted cleaned assets to accepted scene anchors as planning rules only. Accepted cleaned assets are not automatic scene placements. The generic atlas-dump pattern remains rejected. No source PNGs changed, no cleaned candidates changed, no exact runtime coordinates were approved, and no Pet Campfire runtime wiring occurred.

## H5.27 Pet Campfire Dual Placement Grammar Human Review Note

H5.27 records Kryssie's human/product review pass for the H5.26 dual placement grammar manifests.

The Ember Pup state-symbol placement grammar and the UI/prop/care-symbol placement grammar are accepted for draft layout composition planning as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-layout-composition-planning`.

The two-lane split remains required. The generic accepted-atlas dump pattern remains rejected. Placement remains draft planning only: no exact runtime coordinates, runtime placement data, gameplay behavior, animation cycles, or Pet Campfire wiring were approved.

## H5.28 Pet Campfire Draft Layout Composition Plan Note

H5.28 creates `manifests/academy.pet-campfire.layout-composition-plan.json` as a draft visual composition plan for nine Pet Campfire scenarios: idle, happy greeting, hungry care, thirsty care, sleepy rest, sad comfort, sick recovery, active play, and quest/status.

The plan connects reviewed scene anchors and reviewed placement grammars using anchor references and named slots only. It does not approve exact runtime coordinates, runtime placement data, gameplay behavior, animation cycles, or Pet Campfire wiring.

## H5.29 Pet Campfire Draft Layout Composition Human Review Note

H5.29 records Kryssie's human/product review pass for the H5.28 draft layout composition plan.

The nine campsite composition scenarios are accepted for future draft visual/layout planning as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-future-draft-layout-planning`. Pet Campfire asset prep is ready to pause/defer runtime integration while the remaining game asset sheets catch up. Runtime wiring remains deferred.

## H5.30 Dice Duel Tavern Region Mapping Note

H5.30 maps `assets/academy/games/dice-duel-tavern/tga-dice-duel-tavern-sheet-concept-v0.1.png` into `manifests/academy.dice-duel-tavern.regions.json` with 64 draft-review regions.

The Dice Duel Tavern source sheet is `1024x1024` RGB with no alpha and baked checkerboard / fake transparency. This pass creates mapping evidence only. The source PNG remains untouched; no derived cleanup asset, runtime wiring, or game-code changes occurred.

## H5.31 Dice Duel Tavern Region Human Review Note

H5.31 records Kryssie's human/product review pass for the H5.30 Dice Duel Tavern region mapping.

The 64 mapped regions are accepted for draft cleanup/planning use as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-cleanup-and-planning-use`. Cleanup remains deferred to a future derived cleanup candidate.

H5.31 also records a future code-driven dice roll illusion candidate using the flat die faces 1-6, rolling/tumbling dice candidates, and sparkle/dust/spiral/burst/smoke FX regions. This is not runtime-approved, not animation-approved, and does not approve probability/gameplay logic or Dice Duel Tavern wiring.

## H5.32 Dice Duel Tavern Cleanup Candidate Note

H5.32 creates `assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png` as a derived transparent cleanup candidate for the 64 reviewed Dice Duel Tavern regions.

The derived sheet preserves the original `1024x1024` / 8x8 layout and keeps `derivedRect` aligned with `sourceRect` for future planning convenience. The source PNG remains untouched. Cleanup remains draft-review; the future roll illusion remains planning-only; no runtime wiring, animation approval, probability logic, or game-code changes occurred.

## H5.33 Dice Duel Tavern Cleanup Human Review Note

H5.33 records Kryssie's human/product review pass for the H5.32 Dice Duel Tavern cleanup candidate.

The cleanup candidate is accepted for draft pipeline use as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-pipeline-use`. High-risk FX notes remain retained for glow, smoke, dust, sparkle, burst, spiral, and motion-line regions. The future roll illusion remains planning-only, and runtime wiring remains deferred.

## H5.34 Card Goblin Duel Card Frames Region Mapping Note

H5.34 maps `assets/academy/games/card-goblin-duel/tga-card-goblin-duel-card-frames-concept-v0.1.png` into `manifests/academy.card-goblin-duel.card-frames.regions.json` with 32 draft-review regions.

The Card Goblin Duel card-frames source sheet is `1024x1024` RGB with no alpha and baked checkerboard / fake transparency. This pass creates mapping evidence only. The source PNG remains untouched; no derived cleanup asset, runtime wiring, game-code change, or Card Goblin Duel UI/tokens processing occurred.

## H5.35 Card Goblin Duel Card Frames Region Human Review Note

H5.35 records Kryssie's human/product review pass for the H5.34 Card Goblin Duel card-frame region mapping.

The 32 mapped card-frame regions are accepted for draft cleanup/planning use as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-cleanup-and-planning-use`. Cleanup remains deferred, open frames and slot interiors need careful fake-checkerboard cleanup later, the UI/tokens sheet remains a separate future lane, and runtime wiring remains deferred.

## H5.36 Card Goblin Duel Card Frames Cleanup Candidate Note

H5.36 creates `assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png` as a derived transparent cleanup candidate for the 32 reviewed Card Goblin Duel card-frame regions.

The cleanup candidate uses per-region neutral checkerboard removal plus a conservative aperture pass for open frames, board slots, card slots, and highlighted empty slots. Cleanup remains `status: draft`, `reviewStatus: needs-human-review`, and `runtimeEligibility: not-runtime-approved`. The source PNG and Card Goblin Duel UI/tokens sheet remain untouched, and runtime wiring remains deferred.

## H5.37 Card Goblin Duel Card Frames Cleanup Human Review Note

H5.37 records Kryssie's human/product review pass for the H5.36 Card Goblin Duel card-frame cleanup candidate.

The 32 cleaned card-frame regions are accepted for draft pipeline use as `status: reviewed`, `reviewStatus: human-review-passed`, and `pipelineUse: accepted-for-draft-pipeline-use`. Risk flags remain retained for disabled gray, glow/highlight frames, chains/locks, ornate open frames, and slot apertures. The card frames are now ready for future functional slot mapping, but runtime assets, card gameplay behavior, visual integration, and Card Goblin Duel wiring remain unapproved.

## H5.38 Functional Surface Slot Mapping + Card Frame Pilot Note

H5.38 introduces functional surface slot mapping as a reusable planning layer. Region mapping identifies an asset, cleanup prepares a visual candidate, and functional slot mapping defines where dynamic content may later belong inside the asset.

The first pilot is `manifests/academy.card-goblin-duel.card-frames.functional-slots.json`, which maps 32 Card Goblin Duel card-frame functional surfaces and 122 draft slots using surface-relative percentages only. It also records a fit/overflow policy: future layout may scale a card or UI surface up within view/playfield budget, but H5.38 approves no runtime scaling, runtime UI, gameplay behavior, or Card Goblin Duel wiring. UI/HUD panels, dialogue panels, speech bubbles, buttons, progress bars, badges, and status panels should receive the same treatment later.

## Asset Pantry Doctrine

* Generated asset sheets are source pantries, not mandatory usage contracts.
* Games should only use sprites that are explicitly mapped in future manifests.
* Unused sprites may remain in sheets as future options.
* Duplicate, imperfect, or unused sprites do not block intake as long as the sheet is clearly marked concept/v0.1.
* Production implementation should rely on named manifest entries, not manual visual guessing.
* Manifests should include `used`, `unused`, or `reserved` notes where helpful.
* **H4.0 Update:** The operational classification for all assets is tracked in the [Operational Asset Cartography](file:///C:/Users/kryst/Workspace/game-development/ai-game-studio-ladder/docs/assets/TINY_GOBLIN_ACADEMY_H4_0_OPERATIONAL_ASSET_CARTOGRAPHY.md).

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

## H5.54 Dungeon Platformer Region Mapping Note

H5.54 created a split-aware draft measured-grid-cell region manifest for `assets/academy/games/dungeon-platformer/tga-dungeon-platformer-mixed-sheet-concept-v0.1.png`. The source is 1376x768 RGBA, but alpha is fully opaque at 255/255, so the checkerboard-style background is baked/fake transparency. Because this sheet already has an irregular baked 8x5 grid, sourceRects follow the measured grid separators rather than ideal math cells or tight visible bounds. The pass mapped 40 draft-review cells across top-down terrain, side-view/platformer terrain, shared dungeon props, hazards, pickups, UI/status/control icons, FX candidates, and one slime enemy candidate. No cleanup candidate, runtime wiring, animation timing, collision/hitbox approval, placement approval, Top-Down Slime Quest processing, or Shared FX processing occurred.

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
  * Status: deferred / reference-only / particle-first replacement path / not-runtime-approved.
  * Notes: H5.57 defers this RGB/no-alpha sheet as reference-only / concept-only. Soft FX, glows, smoke, dust, fire, sparkles, rain, clouds, blooms, rings, streaks, and bursts are high-risk fake-checker cleanup targets. Shared FX should be particle-first where practical; regenerate specific needed sprite FX as true-alpha one-offs and run the normal asset workflow from intake onward.

* **Top-down terrain/floor construction sheet**
  * Path: `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`
  * Intended Use: Shared top-down terrain and floor tile pantry for Dungeon Key Run and Top-Down Slime Quest.
  * Status: concept / v0.1 / H5.58 inventoried / primary processing source / needs region mapping.
  * Notes: Contains center, edge, corner, water, path, slime, and special floor tiles. H5.58 routes this as the first primary topdown processing lane because terrain defines the base map surface language. Future manifests will select only the tiles actually used.

* **Top-down wall/boundary construction sheet**
  * Path: `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png`
  * Intended Use: Shared top-down wall, boundary, gate, doorway, and obstacle pantry for map construction.
  * Status: concept / v0.1 / H5.58 inventoried / primary processing source / needs region mapping.
  * Notes: Intended to support inward-facing room boundaries and collision edges. H5.58 routes this as the second primary topdown processing lane after terrain. Future manifests must verify which wall/corner pieces align cleanly; collision behavior remains unapproved.

* **Top-down environment objects sheet**
  * Path: `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`
  * Intended Use: Shared top-down placed props and interactables for Dungeon Key Run and Top-Down Slime Quest.
  * Status: H5.63 draft mapped / needs human review / not-runtime-approved.
  * Notes: Object pantry only; games should use manifest-approved objects and ignore duplicates or unused extras. H5.58 routes this as the third primary topdown processing lane after terrain and walls so prop placement and interaction semantics stay separate from map construction. H5.63 mapped the 8x8 object sheet as visual inventory only; behavior, placement, collision, interaction, cleanup, and runtime use remain unapproved.

* **Top-Down Slime Quest playfield candidate**
  * Path: `assets/academy/games/top-down-slime-quest/tga-top-down-slime-quest-playfield-pack-concept-v0.1.png`
  * Intended Use: Game 09-specific top-down playfield parts and outdoor/map props.
  * Status: mixed-reference / H5.58 inventoried / cleanup deferred / not-runtime-approved.
  * Notes: H5.58 routes this as a mixed/reference concept sheet, not the main Top-Down Slime Quest source of truth. It may be useful as visual reference or later human-routed salvage, but should not be cleaned, mapped, or approved as one unified runtime atlas.

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

* **Pet Campfire background source**
  * Path: `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`
  * Intended Use: Pet Campfire background / playfield source reference.
  * Status: source / registered / needs intake audit / needs future cleanup-prep plan
  * Notes: This is a full scene background, not a sprite sheet. Treat it as `background-stage`. Do not wire until prep is done.

* **Tiny Goblin Academy icon/favicon source**
  * Path: `assets/academy/branding/icon-source/tga-icon-source-v0.1.png`
  * Intended Use: Full-size Tiny Goblin Academy icon/crest source intended for future favicon/app icon export.
  * Status: source / registered / needs intake audit / needs future cleanup-prep plan
  * Notes: This is not the favicon yet. It is the high-resolution source for a future icon export pipeline. Treat it as `branding-icon-source`. Do not wire yet.

* **Tiny Goblin Academy hub/launcher banner source**
  * Path: `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png`
  * Intended Use: Tiny Goblin Academy hub / launcher banner source.
  * Status: source / registered / needs intake audit / needs future cleanup-prep plan
  * Notes: Preferred banner direction for the Hub / Launcher visual shell. Treat as `hub-banner-source`. Do not wire, crop, or upscale yet.

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

## H5.0 Note (Shared Asset Domains)
* `shared-core`, `shared-fx`, and `ui` domains are the first shared asset manifest targets.
* Fake checkerboard cleanup requires derived outputs and evidence.
* Manifests are draft until human review.
* No runtime wiring occurred in this pass.

## H5.0B Note (Evidence Repair + Cleanup Pilot)
* Human/Codex review rejected the original H5.0 evidence images as insufficient.
* H5.0B repairs the evidence layer with labeled metadata sheets and before/after cleanup evidence.
* Checkerboard cleanup was piloted on derived copies only for static shared-core and UI/HUD sheets.
* `shared-fx` cleanup is deferred because the source is RGB/JPEG-format with no alpha and requires a separate high-risk strategy.
* No runtime wiring occurred in this pass.

## H5.1 Note (Reusable Asset Pipeline Toolkit)
* H5.1 adds reusable script toolkit doctrine and an initial `scripts/asset-pipeline/` scaffold.
* Asset processing is type-specific: static UI/icon sheets, animation sheets, backgrounds, tiles, and FX do not share the same pipeline.
* Cleanup scripts are derived-output only and must produce reviewable evidence.
* Lane scripts are help-only stubs in this pass; no runtime wiring occurred.

## H5.2 Note (UI/HUD Region Mapping)
* H5.2 performs the first real UI/HUD lane region mapping.
* Mapping remains draft-review with `usage: "draft-review"` and `reviewStatus: "needs-human-review"`.
* Evidence includes a bbox overlay, numbered contact sheet, and region table preview.
* No runtime wiring occurred in this pass.

## H5.2B Note (Region Evidence Canonization)
* H5.2B canonizes bbox overlay + numbered contact sheet + region table preview as the required evidence trio for region manifests.
* Index numbers must match across all evidence files.
* SourceRects must not be trusted without overlay review.
* Labels, categories, and descriptions must be semantically checked against the contact sheet.
* Visually distinct assets should be separate regions unless intentionally grouped.
* Draft-review evidence is not runtime approval.
* `scripts/asset-pipeline/make-region-evidence.py` provides the reusable generator.
* Old root-level census scripts were ingested under `scripts/asset-pipeline/legacy/` as reference-only tooling.

## H5.39 Card Frame Functional Slot Correction Note

H5.39 corrected the first card-frame slot pilot. Slots must be surface-type aware: transparent/open frames use mount/window semantics, board/card slots use drop/occupancy semantics, card backs use identity/deck/group semantics, and solid/front card surfaces may use content slots. Runtime UI remains unapproved.

## H5.40 Card Frame Functional Slot Human Review Note

H5.40 accepted the corrected H5.39 Card Goblin Duel card-frame functional slot mapping for draft planning use. The reviewed map covers 32 surfaces and 116 corrected draft slots. Runtime UI, text rendering, card gameplay, and visual integration remain deferred. Future UI/HUD slot mapping should use the H5.39/H5.40 surface-type-aware approach.

## H5.41 Card Goblin Duel UI/Tokens Region Mapping Note

H5.41 created the draft Card Goblin Duel UI/tokens region manifest from `assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`. The pass mapped 32 draft-review regions and marked likely future functional-surface candidates. Cleanup, functional slot mapping, runtime UI, text rendering, and Card Goblin Duel wiring remain deferred.

## H5.42 Card Goblin Duel UI/Tokens Region Correction Note

H5.42 corrected the H5.41 Card Goblin Duel UI/tokens draft region mapping. Broad paired-cell regions were split into individual visible assets, blank/no-asset regions were removed, and the corrected manifest now maps 48 draft-review regions. Cleanup, functional slot mapping, runtime UI, text rendering, and Card Goblin Duel wiring remain deferred.

After visual inspection, H5.42 sourceRects and evidence were repaired again with conservative cell-clamped safety padding so glows, dividers, ornaments, effects, and multi-part icons have cleanup/review breathing room instead of tight crop boxes. A focused follow-up repair widened visual row 2 / regions 9-16 to 128x192 cell-spacer review bounds after human review flagged that row's bottoms as still clipped. This safety padding is not runtime crop approval. The region count remains 48 and the manifest remains draft / needs-human-review / not-runtime-approved.

## H5.43 Card Goblin Duel UI/Tokens Region Human Review Note

H5.43 accepted the repaired H5.42 Card Goblin Duel UI/tokens region mapping for draft cleanup and planning use. The reviewed map contains 48 corrected regions and 18 provisional functional-surface candidates. Cleanup, functional slot mapping, runtime UI, text rendering, and Card Goblin Duel wiring remain deferred.

## H5.44 Card Goblin Duel UI/Tokens Cleanup Candidate Note

H5.44 created a derived transparent cleanup candidate for the 48 H5.43-reviewed Card Goblin Duel UI/tokens regions. The derived sheet preserves the original 1024x1024 layout and H5.42/H5.43 sourceRects, including row 2 128x192 protective review bounds.

The cleanup uses strict-neutral edge-connected checker/grid removal. A first evidence inspection caught an over-cleaned clock/time badge, so the cleanup key was tightened before commit to preserve desaturated UI surfaces. The cleanup candidate remains draft / needs-human-review / not-runtime-approved. Functional-surface candidate flags remain planning metadata only; functional slot mapping, text rendering, runtime UI, gameplay behavior, and Card Goblin Duel wiring remain deferred.

## H5.46 Potion Sorter Region Mapping Note

H5.46 created the Potion Sorter draft region manifest from `assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png`. The source is 1408x768 RGBA, but alpha is fully opaque at 255/255, so the checkerboard-style background is baked/fake transparency.

The pass mapped 32 draft-review regions across potion bottles, vial/flask shapes, cork/spill props, sorter slots, tray/bin/chest props, status icons, reward tokens, and FX-like icons. Six sorter/tray surfaces are marked as possible future functional-surface candidates only. Cleanup, gameplay sorting logic, functional slot mapping, runtime visuals, and game wiring remain deferred.

## H5.48 Potion Sorter Cleanup Candidate Note

H5.48 created a derived transparent cleanup candidate for the 32 H5.47-reviewed Potion Sorter regions. The derived sheet preserves the original 1408x768 layout and reviewed H5.46/H5.47 sourceRects.

The cleanup removes baked checkerboard/fake transparency from derived copies only. Glass/liquid/potion-style regions allow interior checker cleanup, while high-risk glow, smoke, spill, sparkle, fire, and label-bearing regions retain risk flags for human review. The cleanup candidate remains draft / needs-human-review / not-runtime-approved. Functional-surface candidate flags remain planning metadata only; functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring remain deferred.

## H5.48B Potion Sorter Cleanup Transparency Correction Note

H5.48B corrected the Potion Sorter cleanup candidate after human review found that the first H5.48 derived sheet still retained visible baked checkerboard/background contamination. The correction regenerated the derived cleanup candidate and evidence while preserving the source PNG untouched, preserving the original 1408x768 derived layout, and keeping the region count at 32.

The correction also updated the alchemy tray, sorting bin, and round-complete sourceRects to exclude explanatory sheet captions from the asset cleanup output. The cleanup candidate remains draft / needs-human-review / not-runtime-approved. Functional-surface candidate flags remain planning metadata only; functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring remain deferred.

## H5.48C Potion Sorter Regenerated Source Cleanup Candidate Note

H5.48C ingested Mega's regenerated Potion Sorter sheet as `assets/academy/games/potion-sorter/tga-potion-sorter-sheet-regenerated-v0.2.png`. The regenerated source is visually cleaner than the original v0.1 checkerboard source, but it is still RGB/opaque fake transparency rather than true alpha.

The prior 32-region Potion Sorter semantic map was scaled to the 1698x926 v0.2 source, with the alchemy tray, sorting bin, and round-complete caption exclusions preserved. A new derived cleanup candidate was generated at `assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png`. The mapping and cleanup candidate remain draft / needs-human-review / not-runtime-approved. Functional-surface candidate flags remain planning metadata only; functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring remain deferred.

## H5.45 Card Goblin Duel UI/Tokens Cleanup Human Review Note

H5.45 accepted the H5.44 Card Goblin Duel UI/tokens cleanup candidate for draft pipeline use. The reviewed cleanup candidate preserves 48 cleaned UI/token regions and 18 functional-surface candidate metadata flags. Risk flags remain as review history. Functional slot mapping, runtime UI, text rendering, gameplay behavior, and Card Goblin Duel wiring remain deferred.

## H5.47 Potion Sorter Region Human Review Note

H5.47 accepted the H5.46 Potion Sorter region mapping for draft cleanup and planning use. The reviewed map contains 32 visible regions and 6 provisional functional-surface candidates. Baked labels/text-bearing surfaces and glow, smoke, spill, liquid, fire, sparkle, glass, and label edges retain cleanup-risk notes. Cleanup, functional slot mapping, gameplay sorting logic, and Potion Sorter runtime wiring remain deferred.

## H5.49 Potion Sorter Regenerated Cleanup Human Review With Exclusions

H5.49 accepted the H5.48C regenerated Potion Sorter cleanup candidate for draft pipeline use with explicit exclusions. The candidate contains 32 cleanup regions: 30 accepted and 2 denied. Denied indexes 9 and 14 resolve to potion-sorter.glowing-green-potion and potion-sorter.gold-sparkle-potion. Denied regions remain preserved as source/manifest/evidence history only and must not be selected for draft asset use, runtime visuals, functional-slot planning, gameplay sorting logic, or Potion Sorter wiring.

## H5.50 Farm Settlement Region Mapping Note

H5.50 created the Farm Settlement draft region manifest from `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png`. The source is 1408x768 RGBA, but alpha is fully opaque at 255/255, so the checkerboard-style background is baked/fake transparency.

The pass mapped 32 draft-review regions across crop plots, crop states, resource props/icons, tools, buildings, terrain props, worker/animal symbols, and status/weather icons. No cleanup candidate was created. Functional slot mapping, settlement gameplay logic, runtime visuals, and game wiring remain deferred.

## H5.50B Farm Settlement Bounds Correction Note

H5.50B corrected horizontal bounds for Farm Settlement regions 1, 2, 3, 4, 10, 17, 18, 19, 20, and 21 after human review found right-edge clipping and neighboring-asset bleed. No vertical padding changes were made. Region 20 was shifted right to stop capturing part of region 19's farmhouse, region 21 was shifted right to stop capturing region 20 bleed, and the 17/18 shared boundary was nudged right. The manifest remains draft / needs-human-review / not-runtime-approved, and cleanup, functional slot mapping, settlement gameplay logic, runtime visuals, and game wiring remain deferred.

## H5.51 Farm Settlement Region Human Review Note

H5.51 accepted the H5.50B corrected Farm Settlement region mapping for draft cleanup and planning use. The reviewed map contains 32 regions, with final horizontal bound corrections for regions 1, 2, 3, 4, 10, 17, 18, 19, 20, and 21 accepted. Cleanup risk notes and correction history remain preserved. Cleanup, derived assets, functional slot mapping, scene-anchor planning, and Farm Settlement runtime/game wiring remain deferred.

## H5.52 Farm Settlement Cleanup Candidate Note

H5.52 created a derived transparent cleanup candidate for the 32 H5.51-reviewed Farm Settlement regions at `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png`, with cleanup metadata recorded in `manifests/academy.farm-settlement.cleanup-candidate.json`. The source PNG remains untouched, the 1408x768 layout and reviewed sourceRects are preserved, and fragile glow/fire/weather/sun/moon/banner/goblin-edge cleanup risks remain flagged for human review. This is draft cleanup/planning evidence only: no scene-anchor planning, functional slot mapping, gameplay logic, runtime approval, placement approval, or Farm Settlement game wiring occurred.

## H5.52B Farm Settlement Targeted Cleanup Correction Note

H5.52B corrected the H5.52 Farm Settlement cleanup candidate for six human-flagged regions: 4 watered sprout soil plot, 7 withered crop plot, 13 water drop token, 21 campfire, 30 smiling sun, and 31 crescent moon. The pass regenerated only the target cleanup regions, preserved non-target regions from the H5.52 derived sheet, and added correction history while keeping the cleanup candidate draft / needs-human-review / not-runtime-approved. This is still not a promotion pass: no source PNG edits, sourceRect changes, runtime approval, placement approval, scene-anchor planning, functional slot mapping, gameplay logic, or Farm Settlement game wiring occurred.

## H5.53 Farm Settlement Cleanup Human Review With Exclusions

H5.53 accepted the H5.52B Farm Settlement cleanup candidate for draft pipeline use with explicit exclusions. The candidate contains 32 cleanup regions: 26 accepted and 6 denied. Denied indexes 4, 7, 13, 21, 30, and 31 resolve to arm-settlement.soil-plot-watered-sprout, arm-settlement.withered-crop-plot, arm-settlement.water-drop-token, arm-settlement.campfire, arm-settlement.smiling-sun, and arm-settlement.crescent-moon. Denied regions remain preserved as source/manifest/evidence history only and must not be selected for draft pipeline use, runtime visuals, placement, scene-anchor planning, functional-slot planning, gameplay wiring, or Farm Settlement wiring.

## H5.55 Dungeon Platformer Region Human Review Note

H5.55 accepted the H5.54 Dungeon Platformer measured-grid region mapping for draft cleanup and planning use. The reviewed map contains 40 measured-grid regions using the irregular baked grid edges X 0, 165, 344, 523, 688, 867, 1046, 1211, 1376 and Y 0, 161, 326, 479, 630, 768. Split-aware mixed-lane classification is preserved. Runtime, collision, hitbox/hurtbox, animation, placement, and dungeon gameplay behavior remain deferred.

## H5.56 Dungeon Platformer Cleanup Deferred Note

H5.56 records a docs-only cleanup-deferred decision for the Dungeon Platformer mixed sheet. The H5.55 measured-grid mapping remains accepted for draft planning/reference, but no cleaned derived candidate is accepted because baked checkerboard/lattice overlaps gray dungeon art, UI surfaces, and stone/platform regions. Future path should be selective regeneration or true-alpha per-lane replacement rather than bulk cleanup. Runtime, collision, hitbox/hurtbox, animation, placement, and dungeon gameplay behavior remain deferred.

## H5.57 Shared FX / Feedback Deferred Decision Note

H5.57 records a docs-only cleanup-deferred decision for `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png`. The source is `1024x1024` RGB with no alpha, and the sheet is dominated by soft fragile FX such as glows, smoke, dust, fire, sparkles, rain, clouds, light blooms, magic rings, streaks, and bursts. These are high-risk fake-checker cleanup targets because the background is baked into the effect edges.

The sheet remains reference-only / concept-only and is not a runtime atlas. Shared FX should be particle-first where practical. If a concrete game later needs a sprite FX, regenerate or export that specific asset as true-alpha and run the normal asset workflow from intake onward. H5.57 created no mapping, sourceRects, cleanup candidate, derived PNG, evidence PNG, runtime FX, particle implementation, gameplay feedback behavior, or game wiring.

## H5.58 Top-Down Slime Quest Source Inventory + Lane Routing Note

H5.58 inventories the older mixed Top-Down Slime Quest playfield pack and the three main topdown folder sources. The mixed playfield pack is `1024x1024` RGB with no alpha and is routed as a mixed/reference candidate only: not the main source of truth, not a cleanup target, not a unified runtime atlas, and not runtime-approved.

The primary topdown processing lanes are now:

1. `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`
2. `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png`
3. `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`

All four inspected topdown sources are `1024x1024` RGB with no alpha, so later cleanup/mapping lanes must remain human-review gated. H5.58 created `manifests/academy.topdown.source-inventory.json` and lightweight source-inventory evidence only. It did not create cleanup outputs, region rectangles, runtime atlases, placement/collision/interaction rules, animation approval, or game wiring.

## H5.58B Topdown Source Inventory Human Review Note

H5.58B records human review pass for the H5.58 topdown source inventory and lane-routing decision. `manifests/academy.topdown.source-inventory.json` is now `reviewed` / `human-review-passed` / `accepted-for-draft-lane-routing-use`, while `runtimeEligibility` remains `not-runtime-approved`.

Accepted routing:

1. The mixed Top-Down Slime Quest playfield pack remains reference-only / mixed pantry and should not be cleaned or mapped as a unified runtime atlas.
2. `topdown/terrain` is primary lane 1.
3. `topdown/walls` is primary lane 2.
4. `topdown/objects` is primary lane 3.

H5.58B did not create cleanup outputs, region manifests, placement/collision/interaction data, runtime atlases, or game/runtime wiring.

## H5.59 Topdown Terrain Region Mapping Note

H5.59 creates a draft 8x8 measured-grid region manifest for `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`. The source is `1024x1024` RGB with no alpha, so the checker-style background is baked/fake transparency.

The terrain sheet grid measures as 8 columns by 8 rows with 128px cells. H5.59 maps all 64 grid cells as draft-review regions, including four explicit `blank-empty-cell` placeholders. Categories include grass/floor, dirt/path, water, shore/edge, slime/liquid, stone/special, portal/special marker, and flag/status tiles.

This is a semantic terrain inventory only. It does not create cleanup outputs, derived PNGs, runtime tilemaps, collision/pathfinding/placement data, portal/water/slime behavior, topdown wall/object processing, mixed Slime Quest pack processing, or game wiring.

## H5.60 Topdown Terrain Region Human Review Note

H5.60 records human review pass for the H5.59 topdown terrain region mapping. H5.60B supersedes this note for exact blank-cell identities because H5.60 corrected the wrong cell.

`manifests/academy.topdown.terrain.regions.json` is now `reviewed` / `human-review-passed` / `accepted-for-draft-cleanup-and-planning-use`, while `runtimeEligibility` remains `not-runtime-approved`. All 64 regions and all 128x128 sourceRects are retained. See H5.60B for the corrected final blank-cell list.

Special marker/status-like tiles such as goblin crests, magic circles, glowing floors, caution stripes, portal swirls, arrows, and flag markers are accepted as inventory categories only. H5.60 does not approve runtime tilemap use, collision, pathfinding, terrain behavior, portal behavior, slime/hazard behavior, placement, cleanup, derived images, or game/runtime wiring.

## H5.60B Topdown Terrain Blank Cell Correction Note

H5.60B corrects the H5.60 blank-cell identities. Region 30 is blank/checkerboard-only and is now `blank-empty-cell` with terrain role `blank-empty`. Region 39 contains visible grass/terrain edge content and is now `grass-floor-tile` with terrain role `grass-edge-partial`.

Final blank placeholder cells are regions 30, 31, and 64. Partial checkerboard/content cells 25 and 35 remain water/checkerboard terrain candidates, 32 and 36 remain slime/checkerboard terrain candidates, and 37, 38, and 39 remain grass/checkerboard terrain candidates.

H5.60B preserves the H5.60 review status and runtime boundary: `reviewed` / `human-review-passed` / `accepted-for-draft-cleanup-and-planning-use` / `not-runtime-approved`. It does not approve cleanup, runtime tilemap use, collision, pathfinding, terrain behavior, portal behavior, slime/hazard behavior, placement, derived images, or game/runtime wiring.

## H5.63 Topdown Objects Region Mapping Note

H5.63 creates a draft 8x8 grid-cell region manifest for `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`. The source is `1024x1024` RGB with no alpha, so the checker-style background is baked/fake transparency.

The objects sheet grid measures as 8 columns by 8 rows with 128px cells. H5.63 maps all 64 grid cells as draft-review regions, including one `blank-empty-cell` placeholder at region 49. Categories include key/pedestal, chest, portal/seal, fire/light, rubble/rock, statue/monument, banner/sign, shield/crest, foliage, tree/stump, flowers/plants, reeds, fence, bridge/plank, crate, barrel, campfire, marker/plate, hazard/trap, and decorative props.

This is visual object inventory only. Category names do not approve loot, pickup, teleport, light, trap/damage, switch, chest, key, portal, collision, placement, interaction, cleanup, derived assets, terrain/wall changes, mixed playfield-pack salvage, or runtime/game wiring.

## H5.61 Topdown Walls Region Mapping Note

H5.61 mapped the Topdown Walls source sheet at `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png` as a draft 64-region inventory manifest. The source is 1024x1024 RGB with no alpha channel. The mapping is source inventory and semantic classification only; runtime, collision, pathfinding, wall autotiling, door behavior, placement, cleanup, and game wiring remain deferred.

## H5.62 Topdown Walls Region Human Review Note

H5.62 accepted the H5.61 Topdown Walls region mapping for draft cleanup and planning use. The reviewed map contains 64 wall/object regions using the 8x8 128px source grid, with H5.61 category and role assignments retained. Collision, pathfinding, door/gate behavior, wall autotiling, placement, runtime tilemap use, and game wiring remain deferred.

## H5.64 Topdown Objects Region Human Review Note

H5.64 accepted the H5.63 Topdown Objects region mapping for draft cleanup and planning use. The reviewed map contains 64 mapped object cells using the 8x8 128px source grid, with draft labels and semantic categories retained. Runtime-danger/effect-bearing regions remain behavior-deferred. Loot, pickup, chest opening, key behavior, portal teleport, light emission, trap damage, interaction, placement, collision, runtime wiring, cleanup output, and derived runtime atlas use remain deferred.

## H5.65 Topdown Objects Cleanup Candidate Note

H5.65 creates a draft cleanup candidate for `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png` using the H5.64-reviewed 64-region grid as the source of truth. The source is `1024x1024` RGB with no alpha, so H5.65 uses region 49 as a blank-cell checker/background reference and creates a derived cleanup candidate at `assets/academy/topdown/objects/derived/tga-topdown-objects-cleaned-v0.1.png`.

This candidate remains `draft` / `needs-human-review` / `not-runtime-approved`. It preserves the object layout and records high-risk behavior/soft-edge regions 7, 9, 10, 17, 18, 47, 55, 57, 58, 60, 61, and 62 for human review. H5.65 does not approve loot, pickup, chest opening, key behavior, portal teleport, light emission, trap damage, interaction, placement, collision, runtime wiring, terrain/wall changes, mixed playfield-pack salvage, or game/runtime use.

Because the source has baked checkerboard/fake transparency, H5.66 should review the cleanup visually and may accept, exclude, or correct individual regions rather than treating the derived sheet as automatically runtime-ready.

## H5.66 Asset Pipeline CLI Lockdown Note

H5.66 pauses asset processing to close the pipeline governance gap exposed by H5.65. The H5.65 manifest/evidence workflow was disciplined, but the cleanup pixel operation used non-canonical inline blank-cell-reference logic. That method is now classified as `blank-cell-reference-experimental` / unsafe-default / not promotion-ready.

H5.66 introduces `scripts/asset-pipeline/cli.mjs` as the canonical asset-pipeline command surface, adds a cleanup method registry, adds run-log helpers, converts lane scripts from help-only stubs into CLI wrappers, and documents the rule that future asset operations must use canonical scripts or registered methods. Future cleanup/mapping/evidence operations should write `pipeline-run-log.json` and generated manifests should record pipeline provenance.

Asset processing remains paused until the CLI/provenance layer is used for the next sheet. No source PNGs, derived PNGs, evidence PNGs, manifests, game/runtime code, package files, lockfiles, or dependency folders were modified by the H5.66 audit/lockdown lane.

## H5.67 Run-Log + Manifest Provenance Contract Note

H5.67 makes the H5.66 lockdown enforceable. Future H5.67+ generated asset manifests must record a `pipelineRun` block that points back to the canonical pipeline tool, command, registered method, method status, source hash, git baseline, and evidence run log.

The canonical validation surface now includes:

```powershell
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
```

Existing manifests are not backfilled in H5.67. They are classified as `legacy-pre-H5.67` under legacy-ok validation, while hard provenance mode is reserved for future migration or H5.67+ generated manifests.

No source PNGs, derived PNGs, evidence PNGs, production manifests, game/runtime code, package files, or lockfiles were modified by the H5.67 provenance-contract lane.
