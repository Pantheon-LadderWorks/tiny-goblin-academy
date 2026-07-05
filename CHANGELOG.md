# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

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

