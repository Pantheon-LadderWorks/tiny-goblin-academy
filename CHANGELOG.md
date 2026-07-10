# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

* **H5.85 Academy Visual Asset Pantry Index + Button Goblin Clicker Background Intake**: Ingested the first Button Goblin Clicker-specific visual asset, `tga-button-goblin-clicker-cavern-stage-background-v0.1.png`, as a draft scene-anchor background with 9 planning anchors and evidence. Created `manifests/academy.button-goblin-clicker.background.scene-anchors.json` and `manifests/academy.visual-asset-pantry-index.json` to consolidate current visual pantry paths, cleaned/derived outputs, accepted/deferred/denied counts, tool targets, and Tier 1.5 runtime-planning order. Recorded that topdown being pantry-complete does not make Top-Down Slime Quest the first runtime wiring target; Button Goblin Clicker remains the easiest first visual integration candidate. No runtime/game code, source PNG cleanup, derived cleanup, sprite animation, tool-suite implementation, docs-folder reorganization, package/lock change, or runtime approval occurred.

* **H5.84 Future Topdown Floor Tilesheets Batch Region Human Review**: Recorded batch human/product review pass for the H5.83 future topdown floor tilesheet region mapping. Accepted 6 future pantry floor/ground sheets and 384 regions for future-pantry region planning use only, accepted the proportional actual-dimension sourceRect strategy, preserved semantic 128-grid labels as vocabulary only, and kept runtimeBehavior `none-approved` plus walkabilityApproval `none` for emitted regions. No cleanup, derived PNG creation, source PNG edit, evidence regeneration, tilemap/collision/pathfinding/walkability/hazard-water-slime-portal-trigger/autotiling/game-wiring approval, package/lock change, or existing terrain/object/wall manifest change occurred. The road/path overlay sheet remains excluded and the H5.81/H5.82 terrain cleanup lane remains separate and unchanged.

* **H5.83 Future Topdown Floor Tilesheets Batch Region Mapping**: Batch-mapped the six H5.73A future topdown floor/ground tilesheets as future-pantry region inventory. Added the canonical `map-grid-batch` asset-pipeline command and provenance support for like-shaped 8x8 tilesheet batches, preserving semantic `128x128` manifest rectangles separately from proportional real-image `1254x1254` sourceRects. Created `manifests/academy.topdown.floor-tilesheets.future.regions.json` with 6 sheets / 384 draft regions and generated batch/per-sheet evidence plus a pipeline run log. No cleanup, derived cleaned PNGs, source PNG edits, runtime tilemap, collision, pathfinding, walkability, hazard/water/slime/portal/trigger behavior, autotiling, game/runtime wiring, package/lock changes, or existing terrain/object/wall manifest changes occurred.

* **H5.82 Existing Topdown Terrain Cleanup Human Review**: Recorded human/product review pass for H5.81 with exclusions/deferred cells. Accepted 59 terrain cleanup candidates for draft cleanup/planning use only, accepted blank transparent/reference cells 30, 31, and 64, retained partial content cells 32, 36, 37, 38, and 39 for draft review/planning, and deferred/excluded water/checker partial cells 25 and 35 because they retained unacceptable checker remnants. Preserved H5.60B truth that blank cells are exactly 30/31/64 and region 39 is not blank. No cleanup rerun, source PNG edit, derived PNG edit, evidence PNG edit, sourceRect change, game/runtime change, package/lock change, or runtime/tilemap/collision/pathfinding/walkability/water/slime/portal/hazard approval occurred.

* **H5.81 Existing Topdown Terrain Cleanup Candidate**: Created a draft cleanup candidate for the H5.60B-reviewed terrain grid using the canonical `edge-connected-checker-cleanup` CLI/provenance path. Added lane-neutral cleanup-script support for both `w/h` and `width/height` sourceRects plus an explicit `edge_seed_inset` parameter for grid-bordered sheets. Retained all 64 terrain region records, produced 59 cleanup candidates, preserved blank cells 30, 31, and 64 as transparent blank-cell candidates, deferred water/checker partial cells 25 and 35, and retained partial content cleanup candidates 32, 36, 37, 38, and 39 for review. Generated derived sheet, cleanup manifest, on-dark preview, before/after contact sheet, mask preview/overlay, blank/partial/deferred preview, excluded preview, risk/table previews, candidate preview, and pipeline run log. No source PNGs, game/runtime files, package/lock files, object/wall/future-floor files, or source region manifests were changed.

* **H5.80 Topdown Non-FX Objects Regenerated Cleanup Human Review**: Recorded human/product review pass for the H5.79 regenerated non-FX object cleanup candidate. Accepted all 64 `edge-connected-checker-cleanup` regions for draft cleanup/planning use, excluded no regions, and documented minor fence-bar interior white gaps plus small light edge residue/slivers as non-blocking polish notes for future targeted fixes only if specific pieces are selected for draft runtime planning. The no-glow/non-FX regenerated source is substantially cleaner than the old mixed effect-bearing object source; the old H5.68/H5.69 object cleanup remains historical/usable for its accepted set, while H5.79/H5.80 is the regenerated non-FX cleanup lane. Runtime/placement/collision/interaction/pickup/loot/chest-key/trap/portal-teleport/pressure-plate/fire-light-glow/obstacle/game-wiring boundaries remain unapproved. No PNGs were modified, cleanup was not rerun, evidence was not regenerated, and no terrain/wall/future-floor, game/runtime, package/lock, or old object cleanup manifest files were changed.

* **H5.79 Topdown Non-FX Objects Regenerated Cleanup Candidate**: Created a draft cleanup candidate for the H5.78-reviewed regenerated non-FX object source using the canonical `edge-connected-checker-cleanup` CLI/provenance path. Generated the derived cleaned sheet, cleanup manifest, on-dark preview, before/after contact sheet, mask preview/overlay, risk/table previews, candidate preview, and pipeline run log for all 64 regions. Retained `needs-human-review` / `not-runtime-approved` status, flagged interactive-looking props as behavior-deferred, and recorded that small edge residue should be reviewed in H5.80 rather than overcut. No source PNGs, game/runtime files, package/lock files, terrain/wall/future-floor files, or old object cleanup manifests were changed.

* **H5.78 Topdown Non-FX Objects Regenerated Region Human Review**: Recorded human/product review pass for the H5.77 regenerated non-FX object region mapping. Accepted all 64 contour-assisted variable-size regions for draft cleanup/planning use, confirmed no sourceRect correction pass is needed, promoted the regenerated RGB/fake-background source lane toward future H5.79 cleanup, and preserved runtime/placement/collision/interaction/pickup/loot/chest-key/trap/portal-teleport/light-fire-glow/game-wiring boundaries. The old H5.68/H5.69 object cleanup remains historical/usable for its accepted set, but H5.77/H5.78 is the regenerated non-FX object source lane. No cleanup, derived cleanup output, source PNG edit, evidence regeneration, terrain/wall/future-floor changes, game/runtime changes, or package/lock changes occurred.

* **H5.77 Topdown Non-FX Objects Regenerated Region Mapping**: Mapped the H5.70 regenerated non-FX object source as 64 draft visual-inventory regions. The `1254x1254` PNG/RGB source is visually arranged as an 8x8 pantry, but equal grid cells clipped/overlapped several objects, so H5.77 uses contour-assisted variable sourceRects instead of forced grid slices. Created source inspection, background/alpha, bbox overlay, numbered contact sheet, region table, category preview, and pipeline run-log evidence. No cleanup, derived cleanup image, source PNG edit, runtime approval, placement/collision/interaction behavior, chest/key/loot/trap/light/fire/glow/portal behavior, or game wiring occurred.

* **H5.76 Topdown Vertical Walls Cleanup Human Review**: Recorded human/product review pass for the H5.75 vertical wall cleanup candidate. Accepted all 72 `edge-connected-checker-cleanup` regions for draft cleanup/planning use, excluded no regions, retained runtime/collision/placement/pathfinding/tilemap/wall-autotiling/obstacle/door-gate-lock/game-wiring boundaries, and documented one minor interior white-pocket/window artifact as a future targeted polish note only if that exact piece is selected for runtime draft use. No PNGs were modified, cleanup was not rerun, and evidence was not regenerated.

* **H5.75 Topdown Vertical Walls Cleanup Candidate**: Created a draft cleanup candidate for the H5.74-reviewed regenerated vertical wall source using the canonical `edge-connected-checker-cleanup` pipeline method. Added lane-neutral cleanup threshold flags to the canonical CLI/script so bright low-saturation fake backgrounds can be tuned with provenance instead of one-off scripts. Generated the derived cleaned sheet, cleanup manifest, on-dark preview, before/after contact sheet, mask preview/overlay, risk/table previews, and pipeline run log; retained all 72 regions as needs-human-review / not-runtime-approved and behavior-deferred. No source PNGs, game/runtime files, package/lock files, or H5.73A future floor tilesheet files were changed.

* **H5.74 Topdown Vertical Walls Region Human Review**: Recorded human/product review pass for the H5.73 regenerated vertical wall region mapping. Accepted all 72 contour-assisted variable-size RGB/fake-background regions for draft cleanup/planning use only, confirmed no sourceRect correction pass is needed, corrected the H5.73 provenance method label from `grid-slice-only` to `contour-assisted-variable-region-mapping` without regenerating outputs, and preserved all no-runtime/no-collision/no-placement/no-pathfinding/no-tilemap/no-wall-autotiling/no-door-gate-lock-behavior/no-game-wiring boundaries. H5.73A future floor tilesheet intake remains unrelated and untouched.

* **H5.73A Topdown Floor Tilesheet Future Intake**: Ingested six newly generated topdown floor/terrain tilesheet PNGs plus paired planning manifest/spec Markdown and JSON files into `assets/academy/topdown/terrain/future-floor-tilesheets/` as future pantry sources only. Recorded dimensions, hashes, alpha findings, and future-only status in an intake index; noted that the copied PNGs are `1254x1254` RGB/no-alpha sources and are not production-mapped 1024x1024 tile manifests. No tile mapping, cleanup, runtime manifests, existing terrain/wall/object manifest changes, or game wiring occurred.

* **H5.73 Topdown Vertical Walls Region Mapping**: Mapped the regenerated RGB/fake-background vertical wall supplement as 72 contour-assisted variable-size draft regions. Created source inspection, background mask, bbox overlay, category preview, numbered contact sheet, region table, and pipeline run-log evidence. No cleanup, derived PNG, source PNG edit, runtime approval, collision/pathfinding/placement approval, wall autotiling/tilemap approval, door/gate behavior, or game wiring occurred.

* **H5.72 Topdown Walls True-Alpha Region Human Review**: Recorded human/product review pass for the H5.71 regenerated true-alpha wall mapping. Accepted all 58 variable-size alpha-assisted regions for draft region planning use, confirmed no sourceRect correction pass or cleanup is needed, retained region 31 as an uncertain / lock-marker candidate, and preserved all no-runtime/no-collision/no-placement/no-pathfinding/no-tilemap/no-game-wiring boundaries.

* **H5.71 Topdown Walls True-Alpha Region Mapping**: Mapped the regenerated true-alpha topdown wall source as 58 variable-size alpha-assisted draft regions. Created source inspection, alpha mask, bbox overlay, numbered contact sheet, region table, and category preview evidence; confirmed no cleanup, derived cleanup image, source PNG edit, runtime approval, collision/pathfinding/placement approval, tilemap approval, or game wiring occurred.

* **H5.70 Topdown Regenerated Source Intake**: Ingested three regenerated topdown source candidates: a true-alpha horizontal/mixed wall source, an RGB vertical wall supplement, and an RGB no-FX object source. Routed the true-alpha wall sheet for careful mapping without cleanup, routed the hard-edged vertical wall and no-FX object sheets for map-then-clean processing, and recorded the FX doctrine that flame/glow/smoke/portal effects should be layered or regenerated separately instead of scraped from fake transparency. No mapping, cleanup, derived PNGs, runtime approval, or game wiring occurred.

* **H5.69 Topdown Objects Non-FX Cleanup Human Review**: Recorded human/product review pass for the H5.68 Topdown Objects selective non-FX cleanup retry. Accepted 51 non-effect regions for draft cleanup/planning use, excluded region 1 by product choice / not-selected-for-use, retained effect/glow/fire/portal/smoke/slime/shadow exclusions 7, 9, 10, 17, 18, 47, 55, 57, 60, 61, and 62, and preserved all no-runtime/no-behavior/no-placement/no-collision boundaries. No cleanup was rerun.

* **H5.68 Topdown Objects Selective Non-FX Cleanup Retry**: Retried Topdown Objects cleanup through the canonical H5.67 CLI/provenance contract using the registered `edge-connected-checker-cleanup` method. Created a draft non-FX cleanup candidate, cleanup manifest with `pipelineRun`, and evidence/run-log set; recorded that the `.png` source has JPEG-formatted bytes; excluded effect/glow/fire/portal/smoke/slime/shadow regions 7, 9, 10, 17, 18, 47, 55, 57, 60, 61, and 62 for future regeneration/particle layering; kept 52 ordinary non-effect regions as needs-human-review cleanup candidates; and preserved all no-runtime/no-behavior/no-placement boundaries.

* **H5.67 Asset Pipeline Run-Log + Manifest Provenance Contract**: Added an enforceable provenance contract for future asset-pipeline outputs. Introduced `scripts/asset-pipeline/lib/provenance-contract.mjs`, `scripts/asset-pipeline/validate-pipeline-provenance.mjs`, new CLI commands for `validate-provenance` and `explain-provenance-contract`, and smoke-check coverage for provenance validation. Future H5.67+ generated manifests must record `pipelineRun` provenance and matching `pipeline-run-log.json` evidence; existing manifests remain `legacy-pre-H5.67` under legacy-ok validation. No source PNGs, derived PNGs, evidence PNGs, production manifests, runtime/game files, package files, or lockfiles were changed.

* **H5.66 Asset Pipeline CLI Lockdown Audit**: Paused asset processing after H5.65 exposed a cleanup governance gap. Added a canonical `scripts/asset-pipeline/cli.mjs` command surface, cleanup method registry, run-log helper, file hashing helper, and non-stub lane wrappers; updated smoke-check to require the CLI/provenance organs; documented the CLI lockdown doctrine and evidence vault architecture; classified H5.65 blank-cell-reference cleanup as experimental / unsafe-default / not promotion-ready; and updated prompt/tutorial/system-plan docs so future asset operations must use canonical scripts or registered methods with run logs.

* **H5.65 Topdown Objects Cleanup Candidate**: Created a draft cleanup candidate for the H5.64-reviewed Topdown Objects 8x8 grid using region 49 as a blank-cell reference background. Generated the derived cleaned sheet, cleanup manifest, and cleanup evidence for all 64 regions; retained high-risk behavior/soft-edge flags for regions 7, 9, 10, 17, 18, 47, 55, 57, 58, 60, 61, and 62; preserved the no-runtime / no-behavior / no-placement / no-collision boundary; and did not modify source PNGs, terrain/wall manifests, mixed playfield-pack assets, or game/runtime files.

* **H5.63 Topdown Objects Region Mapping**: Created a draft 8x8 grid-cell object region manifest for `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`. Mapped 64 draft-review cells, including one blank placeholder, across key/pedestal, chest, portal/seal, fire/light, rubble/rock, statue, banner/sign, shield/crest, foliage, tree/stump, flowers/plants, reeds, fence, bridge/plank, crate, barrel, campfire, marker/plate, hazard/trap, and decorative prop categories. Generated object mapping evidence and did not create cleanup outputs, derived assets, runtime placement/collision/interaction data, chest/key/portal/trap/light behavior, terrain/wall changes, mixed playfield-pack salvage, or game wiring.

* **H5.60B Topdown Terrain Blank Cell Correction**: Corrected the H5.60 blank-cell identities for the Topdown Terrain manifest. Region 30 is now `blank-empty-cell` / `blank-empty`, region 39 is now `grass-floor-tile` / `grass-edge-partial`, and the final blank placeholders are regions 30, 31, and 64. Documented partial checkerboard/content cells 25, 32, 35, 36, 37, 38, and 39 as content-bearing terrain candidates, generated H5.60B correction evidence, and preserved the no-cleanup / no-runtime / no-collision / no-pathfinding boundary.

* **H5.60 Topdown Terrain Region Human Review**: Recorded human review pass for the H5.59 Topdown Terrain region mapping. This entry was superseded by H5.60B for the exact blank-cell identities; H5.60B is the current correction source. H5.60 did not create cleanup outputs, derived PNGs, runtime tilemaps, collision/pathfinding/placement data, terrain behavior, portal/slime/hazard behavior, or game wiring.

* **H5.59 Topdown Terrain Region Mapping**: Created a draft 8x8 measured-grid terrain region manifest for `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`. Mapped 64 draft-review cells, including explicit blank/empty placeholders, across grass, dirt/path, water, shore, slime/liquid, stone/special, portal/special marker, and flag/status tile categories. Generated terrain mapping evidence and did not create cleanup outputs, derived PNGs, runtime tilemaps, collision/pathfinding/placement data, wall/object processing, mixed Slime Quest pack processing, or game wiring.

* **H5.58B Topdown Source Inventory Human Review**: Recorded human review pass for the H5.58 topdown source inventory and lane-routing decision. Promoted `manifests/academy.topdown.source-inventory.json` to reviewed / human-review-passed / accepted-for-draft-lane-routing-use, preserved the mixed Top-Down Slime Quest playfield pack as reference-only / mixed pantry, and confirmed terrain → walls → objects as the primary topdown processing order with no cleanup, region mapping, placement/collision/interaction data, runtime atlases, or game wiring.

* **H5.58 Top-Down Slime Quest Source Inventory + Lane Routing**: Inventoried the mixed Top-Down Slime Quest playfield pack plus the `topdown/terrain`, `topdown/walls`, and `topdown/objects` source folders. Recorded the mixed playfield pack as reference-only / human-routed salvage candidate, identified the folder sheets as the primary processing lanes, created a draft topdown source-inventory manifest and lightweight evidence previews, and did not create cleanup outputs, region rectangles, runtime atlases, collision/placement/interaction rules, animation approval, or game wiring.

* **H5.57 Shared FX / Feedback Deferred Decision**: Deferred the RGB/no-alpha Shared FX / Feedback concept sheet as reference-only / concept-only. Recorded particle-first replacement policy and true-alpha one-off regeneration fallback; no mapping, sourceRects, cleanup candidate, derived PNG, evidence PNG, runtime FX, particle implementation, gameplay feedback behavior, or game wiring occurred.

* **H5.54 Dungeon Platformer Region Mapping**: Created a split-aware draft measured-grid-cell region manifest and evidence set for the mixed Dungeon Platformer source sheet. Mapped 40 irregular baked-grid cells across top-down terrain, side-view/platformer terrain, shared dungeon props, hazards, pickups, UI/status/control icons, FX candidates, and one slime enemy candidate; confirmed the RGBA source is fully opaque fake transparency; no cleanup, runtime wiring, animation timing, hitbox/collision approval, placement approval, Top-Down Slime Quest processing, or Shared FX processing occurred.

* **H5.52B Farm Settlement Targeted Cleanup Correction**: Corrected the H5.52 Farm Settlement cleanup candidate for six human-flagged regions: 4 watered sprout soil plot, 7 withered crop plot, 13 water drop token, 21 campfire, 30 smiling sun, and 31 crescent moon. Regenerated targeted evidence, preserved non-target regions from the H5.52 derived sheet, kept the lane draft / needs-human-review / not-runtime-approved, and did not change source PNGs, sourceRects, gameplay logic, placement approval, functional slot mapping, scene anchors, or game wiring.

* **H5.52 Farm Settlement Cleanup Candidate**: Created a derived transparent cleanup candidate for the 32 H5.51-reviewed Farm Settlement regions. Preserved the 1408x768 layout, kept the source PNG untouched, generated cleanup evidence, and retained fragile glow/fire/weather/sun/moon/banner/goblin edge risks for human review; no sourceRect remapping, scene-anchor planning, functional slot mapping, gameplay logic, runtime approval, or game wiring occurred.

* **H5.50B Farm Settlement Bounds Correction**: Corrected horizontal sourceRect bounds for Farm Settlement regions 1, 2, 3, 4, 10, 17, 18, 19, 20, and 21 after human review flagged right-edge clipping and neighboring-asset bleed. Regenerated bbox/contact/table evidence; no vertical padding changes, cleanup, source PNG edits, gameplay logic, functional slot mapping, or runtime wiring occurred.

* **H5.50 Farm Settlement Region Mapping**: Created a draft region manifest and evidence set for the Farm Settlement source sheet. Mapped 32 draft-review regions across crop states, resource props/icons, tools, buildings, terrain props, worker/animal symbols, and status/weather icons; confirmed the RGBA source is fully opaque fake transparency; no cleanup, functional slot mapping, gameplay logic, or runtime wiring occurred.

* **H5.48C Potion Sorter Regenerated Source Cleanup Candidate**: Ingested Mega's regenerated Potion Sorter sheet as a new v0.2 source artifact, confirmed it is visually cleaner but still RGB/opaque fake transparency, remapped the 32 Potion Sorter regions to the 1698x926 source, regenerated the derived cleanup candidate and evidence, preserved caption exclusions, and kept the lane draft / needs-human-review / not-runtime-approved with no functional slot mapping or runtime wiring.

* **H5.48B Potion Sorter Cleanup Transparency Correction**: Regenerated the Potion Sorter cleanup candidate after human review found visible baked checkerboard/background contamination in H5.48. Corrected the alchemy tray, sorting bin, and round-complete regions to exclude explanatory captions, preserved the 32-region count and 1408x768 derived layout, regenerated cleanup evidence, and kept the candidate draft / needs-human-review / not-runtime-approved with no functional slot mapping or runtime wiring.

* **H5.48 Potion Sorter Cleanup Candidate**: Created a derived transparent cleanup candidate for the 32 H5.47-reviewed Potion Sorter regions. Preserved the original 1408x768 layout, retained 6 functional-surface candidate flags as planning metadata only, generated cleanup evidence, and kept functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring deferred.

* **H5.46 Potion Sorter Region Mapping**: Created a draft region manifest and evidence set for the Potion Sorter source sheet. Mapped 32 draft-review regions across potion bottles, sorter slots, props, and status/reward icons; marked 6 sorter/tray surfaces as possible future functional-surface candidates; confirmed the RGBA source is fully opaque fake transparency; no cleanup or runtime wiring occurred.

* **H5.44 Card Goblin Duel UI/Tokens Cleanup Candidate**: Created a derived transparent cleanup candidate for the 48 H5.43-reviewed Card Goblin Duel UI/tokens regions. Preserved the original 1024x1024 layout, retained 18 functional-surface candidate flags as planning metadata only, generated cleanup evidence, and kept runtime UI, functional slot mapping, text rendering, gameplay, and Card Goblin Duel wiring deferred.

* **H5.38 Functional Surface Slot Mapping + Card Frame Pilot**: Introduced functional surface slot mapping as the layer between cleaned assets and future runtime UI. Added a Card Goblin Duel card-frame pilot manifest with relative slots, evidence, and fit/overflow notes; UI/HUD surfaces are registered as future targets, and no runtime UI/game wiring occurred.

* **H5.37 Card Goblin Duel Card Frames Cleanup Human Review**: Recorded human review pass for the H5.36 Card Goblin Duel card-frame cleanup candidate and accepted the 32 cleaned regions for draft pipeline use. Risk flags remain retained for disabled gray, glow/highlight, chains/locks, ornate open frames, and slot apertures; runtime wiring remains deferred.

* **H5.36 Card Goblin Duel Card Frames Cleanup Candidate**: Created a derived transparent cleanup candidate for the 32 reviewed Card Goblin Duel card-frame regions. Open frames, slots, highlighted states, and disabled gray remain review-risk areas; the source PNG and UI/tokens sheet remain untouched, and no runtime wiring occurred.

* **Asset Processing Workflow**: Added a generalized asset-processing workflow for Tiny Goblin Academy covering intake, transparency audit, lane classification, mapping evidence, human review, cleanup candidates, promotion vocabulary, validation, and asset-type-specific directions.

* **H5.35 Card Goblin Duel Card Frames Region Human Review**: Recorded human review pass for the H5.34 Card Goblin Duel card-frame region mapping and accepted the 32 regions for draft cleanup/planning use. Cleanup remains deferred, the UI/tokens sheet remains separate, and no runtime wiring occurred.

* **H5.34 Card Goblin Duel Card Frames Region Mapping**: Added draft intake/region mapping for the Card Goblin Duel card-frames concept sheet, with 32 draft-review regions and evidence. The source PNG remains untouched, the UI/tokens sheet remains out of scope, and no cleanup or runtime wiring occurred.

* **H5.33 Dice Duel Tavern Cleanup Human Review**: Recorded human review pass for the H5.32 Dice Duel Tavern cleanup candidate and accepted it for draft pipeline use. High-risk FX notes remain retained, the future roll illusion remains planning-only, and runtime wiring remains deferred.

* **H5.32 Dice Duel Tavern Cleanup Candidate**: Created a derived transparent cleanup candidate for the 64 reviewed Dice Duel Tavern regions while preserving the original 1024x1024 / 8x8 layout. The source PNG remains untouched, cleanup remains draft-review, the future roll illusion remains planning-only, and no runtime wiring occurred.

* **H5.31 Dice Duel Tavern Region Human Review**: Recorded human review pass for the H5.30 Dice Duel Tavern region mapping and accepted the 64 regions for draft cleanup/planning use. Added a future code-driven roll illusion candidate note using flat die faces, tumbling dice, and FX regions; no cleanup or runtime wiring occurred.

* **H5.30 Dice Duel Tavern Region Mapping**: Added draft intake/region mapping for the Dice Duel Tavern concept sheet, with 64 draft-review regions and evidence. The source PNG remains untouched; no cleanup or runtime wiring occurred.

* **H5.29 Pet Campfire Layout Composition Human Review**: Recorded human review pass for the H5.28 draft layout composition plan. Pet Campfire asset prep is ready to pause/defer runtime integration while the remaining game asset sheets catch up; no runtime wiring occurred.

* **H5.28 Pet Campfire Draft Layout Composition Plan**: Added a draft layout composition manifest and evidence for nine Pet Campfire scenarios. The plan connects reviewed scene anchors and reviewed placement grammars using anchor references and named slots only; no exact runtime coordinates or gameplay wiring occurred.

* **H5.27 Pet Campfire Placement Grammar Human Review**: Recorded human review pass for the dual placement grammar manifests. The Ember Pup state-symbol and UI/prop/care-symbol placement split is accepted for draft layout composition planning, the generic atlas-dump pattern remains rejected, and no runtime wiring occurred.

* **H5.26 Pet Campfire Dual Placement Grammars**: Added draft planning manifests and evidence that split Ember Pup state-symbol placement from UI/prop/care-symbol placement. Accepted cleaned assets are not treated as automatic scene placements, and no runtime wiring occurred.

* **Engine and Tooling Ladder Doctrine**: Added a future-facing doctrine note covering Phaser as training yard, third-party asset intake, CLI-first micro-UIs, Sticker Book as scene assembly, engine ladder thinking, and the canonical pose gate for future 3D assets.

* **Scene Anchor Doctrine**: Added a future-facing note for scene anchors as background intelligence, including how future One-Room Platformer v0.2 work should combine background anchors, movement contracts, and Sticker Book authoring instead of tuning physics around every manual platform placement.

* **H5.25 Pet Campfire Scene-Anchor Human Review**: Recorded human review of the H5.24 scene-anchor audit. The 14 anchors are accepted for draft planning, while generic ghost placement is explicitly rejected; future planning splits Ember Pup state-symbol placement from UI/prop/care-symbol placement.

* **H5.24 Pet Campfire Background Scene-Anchor Audit**: Added a draft scene-anchor manifest and evidence for 14 Pet Campfire background placement/readability zones. The background remains source-preserved; no sprite extraction, runtime placement, or game wiring occurred.

* **H5.23 Ember Pup Cleanup Human Review**: Recorded Kryssie's human/product review acceptance of the H5.22 Ember Pup pose/state cleanup candidate for draft pose/state-symbol pipeline use. The candidate is now reviewed/human-review-passed while source PNGs remain untouched, `animationApproval` remains `none`, and runtime animation/gameplay wiring remains deferred.

* **H5.22 Ember Pup Pose Cleanup Candidate**: Created a derived transparent cleanup candidate and review evidence for 16 Ember Pup pose/state symbols. Source PNGs and the accepted static props/icons cleanup candidate remain untouched; cleanup remains draft-review, with no animation, timing, pivot/hitbox, gameplay-state, or runtime approval.

* **H5.21 Ember Pup Pose Human Review**: Recorded Kryssie's human/product review pass for the H5.20 Ember Pup pose candidates. SourceRects, draft semantic labels, and future sequence grouping notes are accepted for draft pose cleanup pipeline use only; no cleanup, runtime animation approval, or gameplay wiring occurred.

* **H5.20 Ember Pup Pose Candidate Mapping**: Added a draft pose/state candidate manifest and synchronized bbox/contact/table/sequence-note evidence for 16 Ember Pup pose candidates. Ember Pup remains a character/state lane; no cleanup, runtime animation, or gameplay wiring occurred.

* **H5.19 Pet Campfire Cleanup Human Review**: Recorded Kryssie's human review acceptance of the H5.18 Pet Campfire static props/icons cleanup candidate for draft pipeline use. The cleanup candidate is now marked reviewed/human-review-passed, while source PNGs remain untouched and runtime wiring remains deferred.

* **H5.18 Pet Campfire Static Props + Icons Cleanup Candidate**: Created a derived transparent cleanup candidate and cleanup evidence for the 25 H5.17 Pet Campfire static prop/icon regions. Source PNGs remain untouched, cleanup remains draft-review, and runtime wiring did not occur.

* **H5.17 Pet Campfire Static Props + Icons Mapping**: Added a draft region manifest and synchronized bbox/contact/table evidence for 25 Pet Campfire static prop, environment prop, reward token, and status/mood icon regions. Ember Pup poses, background scene-anchor work, cleanup production sheets, and runtime wiring remain deferred.

* **H5.16 Pet Campfire Split-Lane Intake**: Opened Pet Campfire intake as a split-lane asset family. Ember Pup is treated as a character/state asset; care props, mood/status icons, and environment objects are separate future region lanes; the background is deferred as a scene-anchor background. No runtime wiring occurred.

* **Level 8 Spawn Baseline Adjustment**: Moved the Birthday Build player spawn slightly upward so the enlarged readable goblin no longer starts embedded in the floor.

* **Level 8 Player Scale + Required Path Reachability**: Centralized v0.1 player tuning, increased goblin visual scale, raised the single-jump envelope for the required first platform / hazard-crossing route, and documented that Sticker Book placement is authoring input rather than automatic gameplay approval.

* **Level 8 Control Layout + WASD**: Moved Level 8 DOM controls out of the playable stage by aligning the game container with the 800x600 Birthday Build canvas, and added WASD keyboard support alongside arrows/space. Jump/platform reach tuning remains a separate follow-up.

* **Level 8 Terminal State Lock**: Fixed the Birthday Build terminal defeat/victory physics bug by parking the Phaser player body after simulation enters a terminal state. The action ledger remains simulation-owned and idempotent; jump/platform tuning remains a separate follow-up.

* **Level 8 Birthday Build**: Preserved the playable One-Room Platformer birthday build, including Phaser-backed runtime wiring, sticker-book level layout, construction-piece assets, animation manifest usage, evidence/editor artifacts, and archived one-off spike scripts/debug outputs without deletion. Known follow-ups: terminal defeat fall loop and jump/platform scale tuning.

* **H5.7 Platformer Goblin Animation Contract**: Added platformer goblin player animation-sheet inspection and draft animation manifest contract planning. The platformer goblin player sheet remains separate from the H5.6 expression/action pantry; cleanup, sequence/pivot/hitbox review, and runtime wiring are deferred.

* **H5.6 Goblin Expression/Action Mapping**: Added Goblin Expression/Action region mapping evidence as the first creature expression/action semantic discovery lane, without creating animation sequences or runtime wiring.

* **H5.5B Hub Icon Drift Guard**: Added validator coverage to catch drift between `manifests/hub.icon-regions.json` and the runtime TypeScript hub icon region mirror.

* **H5.5 Hub Icon Manifest QA**: Reviewed the already-integrated hub icon source-region lane, regenerated H5-style bbox/contact/table evidence, and added generator compatibility for the hub icon manifest shape.

* **H5.4 Semantic Discovery Doctrine**: Documented asset region mapping as semantic discovery, deferred the full capability matrix until broader sheet coverage exists, and added a next-lane mapping queue for future H5 asset passes.

* **H5.3 Shared Core Region Mapping**: Added H5.3 Shared Core region mapping evidence, including draft-review sourceRect regions, numbered contact sheet, bbox overlay, and region table preview.

* **H5.2B Region Evidence Canonization**: Canonized the H5.2 region evidence method as a reusable asset-pipeline standard, added semantic verification rules, created a Python/Pillow region evidence generator, and formally ingested legacy asset census scripts.

* **H5.2 UI/HUD Region Mapping**: Added H5.2 UI/HUD region mapping evidence, including draft-review sourceRect regions, numbered contact sheet, bbox overlay, and region table preview. No runtime wiring occurred.

* **H5.1 Asset Pipeline Toolkit**: Added H5.1 reusable asset-pipeline script toolkit scaffold, including taxonomy constants, manifest validation helpers, lane-script stubs, and pipeline command index for asset-type-specific handling.

* **H5.0B Shared Asset Evidence Repair**: Repaired H5.0 shared asset evidence with labeled metadata sheets, cleanup pilot previews, and derived-output transparency documentation. Human/Codex review rejected the original H5.0 evidence images as insufficient. H5.0B repairs the evidence layer and pilots checkerboard cleanup on derived copies only.

* **H5.0 Shared Asset Domain Mapping**: Mapped shared-core, shared-fx, and ui domains as first shared asset manifest targets. Fake checkerboard cleanup requires derived outputs and evidence. Manifests are draft until human review. No runtime wiring occurred in this pass.

* **H4.8 Hub Compression**: Compressed the current Tiny Goblin Academy hub header and game cards while preserving the existing grid layout. Reduced header footprint (banner 340px→200px, padding halved). Removed repeated audit metadata from card faces — each card now shows only icon art, level, and one compact readiness signal (Dev Ready / Source Ready / Restoration Deferred / Needs Setup). All verbose metadata remains in the details modal. Grid gap tightened (1.5rem→0.75rem). Hub main padding reduced (2rem→1rem). Added compact Glyphforge Games studio identity to header right.

* **Dev Launcher Runtime**: Successfully orchestrated non-blocking dev servers and embedded games inside the Tauri app with a dedicated boot screen and graceful process termination.
* **Dev Mode Launcher Controls**: Added UI skeleton and robust backend status detection for developer launcher buttons.
* **Dev Dependency Management**: Implemented explicit backend commands and UI wiring for installing and safely uninstalling package-local dev dependencies within the trusted sandbox.
* **Read-Only Runtime Status Model**: Implemented Tauri shell and Rust backend for real-time, read-only inspection of game build and dev states.
* **Tauri Shell Foundation**: Scaffolded and hardened the desktop Tauri shell for the Academy Hub.
* **Level 1 Restoration**: Restored Button Goblin Clicker v0.1 game loop.
* **Desktop Game Grid**: Redesigned the Hub as a desktop game grid with polished icon rendering, checkerboard cleanup, and transparent tile presentation.
* **Workspace Cleanup & Validation**: Executed a full dependency cleanup, implemented a pnpm workspace skeleton, and normalized package metadata.
* **Architecture & Contracts**: Documented and reconciled boot doctrine, launcher runtime semantics, workspace validation, and H3.3 runtime contracts.
* **Asset Ingestion**: Formalized asset sheet intake and ingested core concept sheets across multiple games.
* **Manifest Validation**: Reconciled the academy manifest validator to recognize the restored state of Level 1.
* **Asset Operations**: Completed H4.0 Operational Asset Cartography Census, classifying all academy assets by taxonomy and pipeline readiness.
* **Asset Operations**: Corrected swapped A0 source asset file contents — `tga-icon-source-v0.1.png` and `tga-pet-campfire-background-source-v0.1.png` were swapped at intake; file paths are now correct.
* **Asset Planning**: Added H4.1 Hub Visual Identity + Main Boot Asset Plan — contracts for all five hub-facing identity surfaces (boot splash, hub banner, hub icon sheet, app icon/favicon, per-game loading), proposed manifest strategy, evidence stack, and H4.2–H4.9 sequence.
* **Asset Operations**: Completed H4.2 Favicon / App Icon Export Pipeline — generated candidate PNG sizes (16-512px) from source icon, produced visual preview evidence sheets, and created a draft favicon exports manifest.
* **Asset Operations**: Completed H4.2B Tauri App Icon Integration — approved H4.2 PNG candidate exports and copied them into the Tauri target icon paths, leaving the `.ico` file untouched as a fallback.
* **Asset Operations**: Completed H4.2C Web / ICO / SVG Icon Surface Audit — generated a multi-size `.ico` candidate using Python/Pillow, replaced Tauri's `icon.ico`, and replaced the basic web placeholder `favicon.svg` with a base64 wrapper.
* **Asset Operations**: Completed H4.3 Main Hub Banner Placement Evidence — created responsive header placement mockups and standalone previews of the main scroll banner, logged under the new hub identity draft manifest.
* **Asset Operations**: Completed H4.4 Main Glyphforge Boot Surface Modernization Evidence — rendered responsive full-screen hero mockups and overlay variation sheets for the boot splash concept, prepping for combined H4.5 runtime integration.
* **Asset Operations**: Completed H4.5 Hub Banner & Main Boot Runtime Integration — wired the H4.3 Hub Banner with a custom plaque/frame treatment and the H4.4 Boot Screen (Layout C) into a single Tauri build verification pass, fully modernizing the primary app entry surfaces.
* **Asset Operations**: Completed H4.5B Visual Smoke Polish — refined header density, banner zoom, boot Layout C responsiveness, and Tauri window defaults.
* **Planning**: Added H4.6 hub surface contract and future layer scaling plan, documenting the pivot from fixed dashboard layout to full-screen launcher surface with tier-aware horizontal shelf planning, dev/prod runtime distinctions, future options, Butler/update, account, and cross-game ledger layers.
* Public repo preparation, branding assets added, and legacy private concepts scrubbed.


## H5.39 - Card Frame Functional Slot Correction Pass

- Corrected the first card-frame slot pilot.
- Functional slots must be surface-type aware.
- Transparent/open frames now use mount/window semantics instead of title/body/art card-face slots.
- Runtime UI remains unapproved.

## H5.40 - Card Frame Functional Slot Human Review

- Accepted the corrected H5.39 card-frame functional slot mapping for draft planning use.
- Human review passed for 32 surfaces and 116 corrected draft slots.
- Surface-type-aware semantics are now the reference pattern for future UI/HUD slot mapping.
- Runtime UI, card gameplay, and visual integration remain deferred and not runtime-approved.

## H5.41 - Card Goblin Duel UI/Tokens Region Mapping

- Created draft Card Goblin Duel UI/tokens region manifest.
- Mapped 32 draft-review regions from the UI/tokens source sheet.
- Marked likely future functional-surface candidates for later review.
- Created H5.41 region mapping evidence.
- Cleanup, runtime UI, text rendering, slot mapping, and gameplay wiring remain deferred.

## H5.42 - Card Goblin Duel UI/Tokens Region Correction Pass

- Corrected the H5.41 Card Goblin Duel UI/tokens draft region mapping.
- Split broad paired-cell regions into individual visible assets.
- Removed blank/no-asset regions from the UI/tokens manifest.
- Corrected manifest now maps 48 draft-review regions.
- Repaired sourceRects/evidence again with conservative cell-clamped safety padding so glows, dividers, ornaments, effects, and multi-part icons have cleanup/review breathing room instead of tight crop boxes.
- Applied a focused follow-up repair to visual row 2 / regions 9-16, widening those review bounds to 128x192 cell-spacer boxes after human review flagged that row's bottoms as still clipped.
- Cleanup, functional slot mapping, runtime UI, text rendering, and gameplay wiring remain deferred.

## H5.43 - Card Goblin Duel UI/Tokens Region Human Review

- Accepted the repaired H5.42 Card Goblin Duel UI/tokens region mapping for draft cleanup/planning use.
- Human review passed for 48 corrected regions and 18 provisional functional-surface candidates.
- Row 2 128x192 protective review bounds accepted.
- Cleanup, functional slot mapping, runtime UI, and gameplay wiring remain deferred.

## H5.44 - Card Goblin Duel UI/Tokens Cleanup Candidate

- Created a derived transparent cleanup candidate for the 48 H5.43-reviewed Card Goblin Duel UI/tokens regions.
- Preserved the original 1024x1024 sheet layout and H5.42/H5.43 sourceRects, including row 2 128x192 protective review bounds.
- Used strict-neutral edge-connected checker/grid removal after visual inspection caught and corrected an over-cleaned clock/time badge.
- Preserved 18 functional-surface candidate flags as planning metadata only.
- Generated cleanup evidence and kept functional slot mapping, text rendering, runtime UI, gameplay behavior, and Card Goblin Duel wiring deferred.

## H5.46 - Potion Sorter Region Mapping

- Created the Potion Sorter draft region manifest from `assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png`.
- Confirmed the source is `1408x768` RGBA with fully opaque alpha, meaning the checkerboard is baked/fake transparency.
- Mapped 32 draft-review regions and marked 6 sorter/tray surfaces as possible future functional-surface candidates.
- Generated bbox overlay, numbered contact sheet, region table preview, and source inspection evidence.
- Cleanup, gameplay sorting logic, functional slot mapping, runtime visuals, and game wiring remain deferred.

## H5.48 - Potion Sorter Cleanup Candidate

- Created a derived transparent cleanup candidate for the 32 H5.47-reviewed Potion Sorter regions.
- Preserved the original 1408x768 sheet layout and reviewed H5.46/H5.47 sourceRects.
- Removed baked checkerboard/fake transparency from derived copies only, with extra caution for glass, liquid, glow, smoke, spill, fire, sparkle, and baked label edges.
- Preserved 6 functional-surface candidate flags as planning metadata only.
- Generated cleanup evidence and kept functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring deferred.
- Human review later found visible baked checkerboard/background contamination and three explanatory captions included in asset regions; H5.48B supersedes this candidate before promotion.

## H5.48B - Potion Sorter Cleanup Transparency Correction

- Regenerated the Potion Sorter cleanup candidate after human review rejected the first H5.48 candidate as too rough.
- Corrected the alchemy tray, sorting bin, and round-complete sourceRects to exclude explanatory sheet captions.
- Preserved the source PNG untouched, the original 1408x768 derived layout, and the 32-region count.
- Regenerated the H5.48 cleanup evidence and kept the candidate draft / needs-human-review / not-runtime-approved.
- Functional slot mapping, gameplay sorting logic, runtime placement, and Potion Sorter wiring remain deferred.

## H5.48C - Potion Sorter Regenerated Source Cleanup Candidate

- Ingested Mega's regenerated Potion Sorter image as `tga-potion-sorter-sheet-regenerated-v0.2.png`.
- Confirmed the regenerated source is visually cleaner but still RGB/opaque with fake checkerboard, not true alpha.
- Remapped the prior 32-region Potion Sorter semantic map to the 1698x926 v0.2 source and preserved the caption exclusions.
- Regenerated the derived cleanup candidate and H5.48C evidence.
- Kept the mapping and cleanup candidate draft / needs-human-review / not-runtime-approved; no functional slot mapping, gameplay sorting logic, or runtime wiring occurred.

## H5.45 - Card Goblin Duel UI/Tokens Cleanup Human Review

- Accepted the H5.44 Card Goblin Duel UI/tokens cleanup candidate for draft pipeline use.
- Human review passed for 48 cleaned UI/token regions and 18 functional-surface candidate metadata flags.
- Risk flags remain as review history, including strict-neutral cleanup and clock/time badge over-clean correction notes.
- Functional slot mapping, runtime UI, text rendering, gameplay behavior, and Card Goblin Duel wiring remain deferred.

## H5.47 - Potion Sorter Region Human Review

- Accepted the H5.46 Potion Sorter region mapping for draft cleanup/planning use.
- Human review passed for 32 visible regions and 6 provisional functional-surface candidates.
- Baked label/text-bearing regions and glow/smoke/spill/liquid/fire/sparkle/glass/label edges retain cleanup-risk notes.
- Cleanup, functional slot mapping, gameplay sorting logic, and runtime wiring remain deferred.

## H5.49 - Potion Sorter Regenerated Cleanup Human Review With Exclusions

- Accepted the H5.48C regenerated Potion Sorter cleanup candidate for draft pipeline use with explicit region exclusions.
- Accepted cleaned regions: 30.
- Denied cleaned regions: 2.
- Denied region indexes: 9 and 14.
- Denied regions: potion-sorter.glowing-green-potion and potion-sorter.gold-sparkle-potion.
- Denied regions remain preserved as source/manifest/evidence history only and must not be selected for draft asset use, runtime visuals, functional-slot planning, gameplay sorting logic, or Potion Sorter wiring.

## H5.50 - Farm Settlement Region Mapping

- Created a draft region manifest for `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png`.
- Confirmed the source is `1408x768` RGBA with fully opaque alpha, meaning the checkerboard-style background is baked/fake transparency.
- Mapped 32 draft-review regions across crop states, resources, tools, buildings, terrain props, worker/animal symbols, and status/weather icons.
- Generated bbox overlay, numbered contact sheet, region table preview, and source inspection evidence.
- Cleanup, functional slot mapping, settlement gameplay logic, runtime visuals, and game wiring remain deferred.

## H5.50B - Farm Settlement Bounds Correction

- Corrected horizontal sourceRect bounds for regions 1, 2, 3, 4, 10, 17, 18, 19, 20, and 21.
- Added right-side breathing room where assets touched or clipped the bbox edge.
- Shifted region 20 right to remove neighboring-house bleed from region 19.
- Shifted region 21 right to stop capturing region 20 bleed, and nudged the 17/18 shared boundary right.
- Regenerated bbox overlay, numbered contact sheet, and region table preview.
- No vertical padding changes, cleanup output, source PNG edits, gameplay logic, functional slot mapping, or runtime wiring occurred.

## H5.51 - Farm Settlement Region Human Review

- Accepted the H5.50B corrected Farm Settlement region mapping for draft cleanup/planning use.
- Human review passed for 32 mapped regions.
- Final horizontal bound corrections for regions 1, 2, 3, 4, 10, 17, 18, 19, 20, and 21 were accepted.
- Cleanup risk notes and correction history remain preserved.
- Cleanup, derived assets, functional slot mapping, scene-anchor planning, and runtime/game wiring remain deferred.

## H5.52 - Farm Settlement Cleanup Candidate

- Created `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png` as a derived transparent cleanup candidate.
- Added `manifests/academy.farm-settlement.cleanup-candidate.json` with all 32 reviewed regions preserved as draft / needs-human-review / not-runtime-approved.
- Generated cleanup evidence under `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/`.
- Preserved the source PNG, reviewed sourceRects, ids, labels, categories, and functional-surface candidate metadata.
- Kept glow, fire, storm, sun, moon, banner, goblin outline, crop glow, water droplet glow, and thin-shape cleanup risks flagged for human review.
- No scene-anchor planning, functional slot mapping, gameplay logic, placement approval, runtime approval, or Farm Settlement game wiring occurred.

## H5.52B - Farm Settlement Targeted Cleanup Correction

- Corrected the H5.52 cleanup candidate for six human-flagged regions: 4, 7, 13, 21, 30, and 31.
- Added targeted correction history to `manifests/academy.farm-settlement.cleanup-candidate.json`.
- Regenerated `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png` with non-target regions preserved from the H5.52 derived sheet.
- Created targeted evidence under `assets/academy/evidence/h5-52b-farm-settlement-targeted-cleanup-correction/`.
- Kept the cleanup candidate draft / needs-human-review / not-runtime-approved; H5.52B is not a human-review promotion.
- No source PNG edits, sourceRect changes, game code changes, runtime approval, placement approval, scene-anchor work, functional slot mapping, or Farm Settlement gameplay wiring occurred.

## H5.53 - Farm Settlement Cleanup Human Review With Exclusions

- Accepted the H5.52B Farm Settlement cleanup candidate for draft pipeline use with explicit exclusions.
- Accepted cleaned regions: 26.
- Denied cleaned regions: 6.
- Denied region indexes: 4, 7, 13, 21, 30, and 31.
- Denied regions: arm-settlement.soil-plot-watered-sprout, arm-settlement.withered-crop-plot, arm-settlement.water-drop-token, arm-settlement.campfire, arm-settlement.smiling-sun, and arm-settlement.crescent-moon.
- Denied regions remain preserved as source/manifest/evidence history only and must not be selected for draft pipeline use, runtime visuals, placement, scene-anchor planning, functional-slot planning, gameplay wiring, or Farm Settlement wiring.

## H5.55 - Dungeon Platformer Region Human Review

- Accepted the H5.54 Dungeon Platformer measured-grid region mapping for draft cleanup/planning use.
- Human review passed for 40 measured-grid regions.
- Accepted measured grid edges: X 0, 165, 344, 523, 688, 867, 1046, 1211, 1376; Y 0, 161, 326, 479, 630, 768.
- Split-aware mixed-lane classification is preserved for future cleanup and planning.
- Runtime, collision, hitbox/hurtbox, animation, placement, and dungeon gameplay behavior remain deferred.

## H5.56 - Dungeon Platformer Cleanup Deferred Decision

- Recorded docs-only cleanup-deferred decision for the Dungeon Platformer mixed sheet.
- H5.55 measured-grid mapping remains accepted for draft planning/reference.
- Cleanup candidate is not accepted because baked checkerboard/lattice overlaps gray dungeon art, UI surfaces, and stone/platform regions.
- No derived cleanup candidate is accepted; future path is selective regeneration or true-alpha per-lane replacement.
- Runtime, collision, hitbox/hurtbox, animation, placement, and dungeon gameplay behavior remain deferred.

## H5.61 - Topdown Walls Region Mapping

- Mapped the Topdown Walls source sheet as a draft 64-region inventory manifest.
- Source path: assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png.
- Source metadata: 1024x1024 RGB with no alpha channel.
- Created H5.61 evidence for bbox overlay, contact sheet, region table, source inspection, and category preview.
- Runtime, collision, pathfinding, wall autotiling, door behavior, placement, cleanup, and game wiring remain deferred.

## H5.62 - Topdown Walls Region Human Review

- Accepted the H5.61 Topdown Walls region mapping for draft cleanup/planning use.
- Human review passed for 64 wall/object regions.
- 8x8 128px grid sourceRects and H5.61 category/role assignments were retained.
- Collision, pathfinding, door/gate behavior, wall autotiling, placement, runtime tilemap use, and game wiring remain deferred.

## H5.64 - Topdown Objects Region Human Review

- Accepted the H5.63 Topdown Objects region mapping for draft cleanup/planning use.
- Human review passed for 64 mapped object cells.
- 8x8 128px grid sourceRects, draft labels, and semantic categories were retained.
- Runtime-danger/effect-bearing regions remain behavior-deferred.
- Loot, pickup, chest opening, key behavior, portal teleport, light emission, trap damage, interaction, placement, collision, runtime wiring, cleanup output, and derived runtime atlas use remain deferred.
