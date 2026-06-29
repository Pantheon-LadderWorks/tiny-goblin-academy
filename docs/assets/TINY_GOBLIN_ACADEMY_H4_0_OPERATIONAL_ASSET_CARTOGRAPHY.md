# Tiny Goblin Academy H4.0 Operational Asset Cartography

* **Task Name:** H4.0 - Operational Asset Cartography Census
* **Baseline Commit SHA:** 4e53441 fix: reconcile academy manifest validation
* **Validator Baseline:** Passed (cademy.games.json, hub.icon-regions.json)

## Asset Doctrine Summary
* Source art must never be overwritten.
* Source/concept assets are pantry inputs, not runtime truth.
* No sheet goes directly into a game or hub without manifest/planning/evidence.
* Background-stage assets are not sprite-detected.
* Animation sheets are dangerous cleanup candidates and need pilot review.
* Hub icon regions currently have the strongest implemented manifest/crop pattern.
* This census classifies and plans future tasks; no assets were modified.

## Census Scope
Inspected ssets/ including cademy, studio, and cademy_review directories. Checked 34 images via metadata script (width, height, mode, alpha presence/range, size, fake transparency risk).

## Operational Taxonomy Legend
* **Asset Families:** Shared Academy Core, UI / HUD, Hub Icons, Hub Banner, Branding / Icon Source, Studio / Boot Assets, Goblin Creature Sheets, Slime Creature Sheets, Soldier / Enemy Sheets, Training Dummy Sheets, Game 02 Potion Sorter, Game 03 Dice Duel Tavern, Game 04 Card Goblin Duel, Game 05 Dungeon / Platformer Mixed, Game 06 / Game 10 Farm Settlement, Game 07 Pet Campfire, Game 08 One-Room Platformer, Game 09 Top-Down Slime Quest, Shared FX / Feedback, Top-down Terrain / Walls / Objects, Academy Review Candidates, Readme / Public Branding Art.
* **Operational Asset Types:** background-stage, scene-anchor-background, ui-icon-sheet, hub-icon-sheet, hub-banner-source, branding-icon-source, static-prop-sheet, tile-sheet, terrain-sheet, wall-boundary-sheet, platform-construction-sheet, character-animation-sheet, enemy-animation-sheet, pet-animation-sheet, fx-sheet, mixed-sheet, review-candidate, derived-cleaned-sheet, runtime-approved-sheet, boot-studio-art, readme-branding-art.
* **Manifest Contract:** none-yet, regions-manifest, animation-manifest, scene-anchor-manifest, tile-terrain-manifest, wall-boundary-manifest, platform-construction-manifest, runtime-asset-registry, candidate-regions-manifest, reviewed-regions-manifest, hub-icon-source-region-manifest, favicon-export-manifest, boot-asset-manifest, uncertain.
* **Lifecycle State:** source, concept, registered, review-candidate, derived-candidate, mapped-candidate, reviewed, runtime-approved, integrated, deprecated-archive, unknown.
* **Readiness State:** source-only, concept-only, registered-only, metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-semantic-labeling, needs-animation-arrays, needs-anchors, needs-pivots, needs-hitboxes, needs-evidence, needs-human-review, mapped-only, runtime-ready, integrated, blocked, unknown.
* **Evidence Type:** source-metadata-json, alpha-preview, dark-background-preview, cleaned-candidate-preview, cleaned-alpha-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json, human-reviewed-regions-json, animation-contact-sheet, animation-sequence-preview, scene-anchor-overlay, tile-alignment-preview, runtime-integration-screenshot, favicon-size-preview-sheet, banner-responsive-preview, none-yet, uncertain.
* **Human Review Type:** visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review, scene-anchor-placement-review, tile-alignment-review, runtime-integration-review, favicon-legibility-review, banner-responsive-review, none-yet, uncertain.

## Summary Counts by Asset Family
* Readme / Public Branding Art: 2
* Branding / Icon Source: 1
* Goblin Creature Sheets: 2
* Slime Creature Sheets: 1
* Soldier / Enemy Sheets: 1
* Training Dummy Sheets: 1
* Game 04 Card Goblin Duel: 2
* Game 03 Dice Duel Tavern: 1
* Game 05 Dungeon / Platformer Mixed: 1
* Game 06 / Game 10 Farm Settlement: 1
* Game 08 One-Room Platformer: 2
* Game 07 Pet Campfire: 2
* Game 02 Potion Sorter: 1
* Game 09 Top-Down Slime Quest: 1
* Hub Icons: 4
* Hub Banner: 1
* Shared Academy Core: 1
* Shared FX / Feedback: 1
* Top-down Terrain / Walls / Objects: 3
* Unknown: 1
* Academy Review Candidates: 3
* Studio / Boot Assets: 1

## Summary Counts by Operational Asset Type
* readme-branding-art: 2
* branding-icon-source: 1
* character-animation-sheet: 3
* enemy-animation-sheet: 2
* ui-icon-sheet: 2
* static-prop-sheet: 4
* mixed-sheet: 1
* tile-sheet: 2
* scene-anchor-background: 1
* platform-construction-sheet: 1
* pet-animation-sheet: 1
* background-stage: 1
* hub-icon-sheet: 2
* hub-banner-source: 1
* derived-cleaned-sheet: 2
* fx-sheet: 1
* terrain-sheet: 1
* wall-boundary-sheet: 1
* uncertain-operational-type: 1
* review-candidate: 3
* boot-studio-art: 1

## Recommended Next Prompt Sequence
1. H4.1 Hub Banner Cleanup + Responsive Integration Plan
2. H4.2 App Icon / Favicon Export Pipeline Plan
3. H4.3 Pet Campfire Background Prep + Scene Anchor Manifest Plan
4. H4.4 Hub Visual Shell Modular Component Plan
5. H4.5 First Static Sheet Pilot: choose one low-risk static sheet
6. H4.6 Evidence Tooling: metadata, alpha preview, dark-bg preview, bbox overlay, numbered contact sheet
7. H4.7 Character Animation Sheet Pilot: only after evidence tooling exists

## Explicit Confirmation (Not Done)
* No image pixels modified.
* No images cropped/resized/compressed.
* No derived assets created.
* No favicon exports created.
* No hub/game wiring added.
* No runtime behavior changed.
* No CodeCraft Native changes.

## Asset Table
| Repo Path | Family | Op Type | Lifecycle | Readiness | Dimensions | Alpha State | Fake Trans. Risk | Manifest Contract | Evidence | Review | Runtime Elig. | Next Action | Risk | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| assets\itch-cover.png | Readme / Public Branding Art | readme-branding-art | integrated | runtime-ready | 1536x2752 | alpha-channel-all-opaque | low | none-yet | none-yet | none-yet | eligible | none | low |  |
| assets\readme-banner.png | Readme / Public Branding Art | readme-branding-art | integrated | runtime-ready | 3584x1184 | alpha-channel-all-opaque | low | none-yet | none-yet | none-yet | eligible | none | low |  |
| assets\academy\branding\icon-source\tga-icon-source-v0.1.png | Branding / Icon Source | branding-icon-source | registered | source-only | 2816x1536 | alpha-channel-all-opaque | low | favicon-export-manifest | favicon-size-preview-sheet | favicon-legibility-review | not eligible | favicon/app icon export pipeline plan | low | No favicon outputs yet |
| assets\academy\creatures\goblin\tga-goblin-expression-action-sheet-v0.1.png | Goblin Creature Sheets | character-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 2816x1536 | alpha-channel-all-opaque | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\creatures\goblin\tga-platformer-goblin-player-v0.1.png | Goblin Creature Sheets | character-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 2816x1536 | alpha-channel-all-opaque | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\creatures\slime\tga-topdown-slime-player-v0.1.png | Slime Creature Sheets | character-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 2752x1536 | alpha-channel-all-opaque | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\creatures\soldier\tga-topdown-soldier-enemy-v0.1.png | Soldier / Enemy Sheets | enemy-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 2816x1536 | alpha-channel-all-opaque | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\creatures\training-dummy\tga-platformer-training-dummy-enemy-concept-v0.1.png | Training Dummy Sheets | enemy-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 2752x1536 | alpha-channel-all-opaque | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\games\card-goblin-duel\tga-card-goblin-duel-card-frames-concept-v0.1.png | Game 04 Card Goblin Duel | ui-icon-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\games\card-goblin-duel\tga-card-goblin-duel-ui-tokens-concept-v0.1.png | Game 04 Card Goblin Duel | ui-icon-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\games\dice-duel-tavern\tga-dice-duel-tavern-sheet-concept-v0.1.png | Game 03 Dice Duel Tavern | static-prop-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\games\dungeon-platformer\tga-dungeon-platformer-mixed-sheet-concept-v0.1.png | Game 05 Dungeon / Platformer Mixed | mixed-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1376x768 | alpha-channel-all-opaque | medium | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\games\farm-settlement\tga-farm-settlement-sheet-v0.1.png | Game 06 / Game 10 Farm Settlement | tile-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1408x768 | alpha-channel-all-opaque | medium | tile-terrain-manifest | source-metadata-json, alpha-preview, dark-background-preview, tile-alignment-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, tile-alignment-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\games\one-room-platformer\tga-one-room-platformer-background-stage-concept-v0.1.png | Game 08 One-Room Platformer | scene-anchor-background | registered | source-only, needs-anchors, needs-evidence, needs-human-review | 1024x1024 | opaque-illustration-background | low | scene-anchor-manifest | source-metadata-json, scene-anchor-overlay, runtime-integration-screenshot | scene-anchor-placement-review, visual-quality-review | not eligible | background prep + anchor manifest planning | low | No sprite detection |
| assets\academy\games\one-room-platformer\tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png | Game 08 One-Room Platformer | platform-construction-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-anchors | 1024x1024 | opaque-illustration-background | medium | platform-construction-manifest | source-metadata-json, alpha-preview, dark-background-preview, tile-alignment-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, tile-alignment-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\games\pet-campfire\tga-pet-campfire-ember-pup-sheet-concept-v0.1.png | Game 07 Pet Campfire | pet-animation-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays, needs-pivots, needs-hitboxes | 1024x1024 | opaque-illustration-background | high | animation-manifest | source-metadata-json, alpha-preview, dark-background-preview, animation-contact-sheet, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review, pivot-hitbox-review | not eligible | animation cleanup pilot | high |  |
| assets\academy\games\pet-campfire\backgrounds\tga-pet-campfire-background-source-v0.1.png | Game 07 Pet Campfire | background-stage | registered | source-only, needs-anchors, needs-evidence, needs-human-review | 2048x2048 | alpha-channel-all-opaque | low | scene-anchor-manifest | source-metadata-json, scene-anchor-overlay, runtime-integration-screenshot | scene-anchor-placement-review, visual-quality-review | not eligible | background prep + anchor manifest planning | low | No sprite detection |
| assets\academy\games\potion-sorter\tga-potion-sorter-sheet-concept-v0.1.png | Game 02 Potion Sorter | static-prop-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1408x768 | alpha-channel-all-opaque | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\games\top-down-slime-quest\tga-top-down-slime-quest-playfield-pack-concept-v0.1.png | Game 09 Top-Down Slime Quest | tile-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | medium | tile-terrain-manifest | source-metadata-json, alpha-preview, dark-background-preview, tile-alignment-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, tile-alignment-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\hub\tga-hub-game-icons-sheet-concept-v0.1.png | Hub Icons | hub-icon-sheet | reviewed | mapped-only | 768x1376 | alpha-channel-all-opaque | low | hub-icon-source-region-manifest | candidate-regions-json | visual-quality-review | not eligible | none | low |  |
| assets\academy\hub\tga-hub-game-icons-transparent.png | Hub Icons | hub-icon-sheet | reviewed | mapped-only | 768x1376 | real-alpha-needs-review | low | hub-icon-source-region-manifest | candidate-regions-json | visual-quality-review | not eligible | none | low |  |
| assets\academy\hub\banner\tga-hub-banner-source-v0.1.png | Hub Banner | hub-banner-source | registered | source-only | 555x257 | alpha-channel-all-opaque | low | boot-asset-manifest | banner-responsive-preview | banner-responsive-review, visual-quality-review | not eligible | hub banner cleanup + responsive integration plan | low | no hub wiring yet |
| assets\academy\hub\derived\tga-hub-game-icons-cleaned-v0.1.png | Hub Icons | derived-cleaned-sheet | derived-candidate | needs-human-review | 768x1376 | real-alpha-needs-review | low | hub-icon-source-region-manifest | cleaned-candidate-preview | transparency-cleanup-review | not eligible | human review | low |  |
| assets\academy\hub\derived\tga-hub-game-icons-transparent-v0.1.png | Hub Icons | derived-cleaned-sheet | integrated | runtime-ready | 768x1376 | real-alpha-needs-review | low | hub-icon-source-region-manifest | none-yet | none-yet | eligible | none | low |  |
| assets\academy\shared-core\tga-shared-core-sheet-v0.1.png | Shared Academy Core | static-prop-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 2816x1536 | alpha-channel-all-opaque | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\shared-fx\tga-shared-fx-feedback-sheet-concept-v0.1.png | Shared FX / Feedback | fx-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-animation-arrays | 1024x1024 | opaque-illustration-background | medium | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json, animation-sequence-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, animation-sequence-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\topdown\objects\tga-topdown-environment-objects-concept-v0.1.png | Top-down Terrain / Walls / Objects | static-prop-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling, needs-pivots, needs-hitboxes | 1024x1024 | opaque-illustration-background | low | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review, pivot-hitbox-review | not eligible | cleanup and region detection pilot | low |  |
| assets\academy\topdown\terrain\tga-topdown-terrain-floor-construction-concept-v0.1.png | Top-down Terrain / Walls / Objects | terrain-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | medium | tile-terrain-manifest | source-metadata-json, alpha-preview, dark-background-preview, tile-alignment-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, tile-alignment-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\topdown\walls\tga-topdown-wall-boundary-construction-concept-v0.1.png | Top-down Terrain / Walls / Objects | wall-boundary-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 1024x1024 | opaque-illustration-background | medium | wall-boundary-manifest | source-metadata-json, alpha-preview, dark-background-preview, tile-alignment-preview | visual-quality-review, transparency-cleanup-review, semantic-label-review, tile-alignment-review | not eligible | cleanup and region detection pilot | medium |  |
| assets\academy\ui\tga-ui-hud-sheet-v0.1.png | Unknown | uncertain-operational-type | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review | 2816x1536 | alpha-channel-all-opaque | medium | uncertain | source-metadata-json, alpha-preview, dark-background-preview | visual-quality-review, transparency-cleanup-review | not eligible | planning | medium |  |
| assets\academy_review\card-goblin-duel-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\academy_review\dungeon-key-run-playfield-pack-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\academy_review\one-room-platformer-playfield-pack-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\studio\glyphforge-games\glyphforge-games-boot-splash-concept.png | Studio / Boot Assets | boot-studio-art | concept | metadata-inspected, needs-evidence, needs-human-review | 2752x1536 | alpha-channel-all-opaque | low | boot-asset-manifest | runtime-integration-screenshot | visual-quality-review, runtime-integration-review | not eligible | integration planning | low |  |
