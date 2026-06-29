# Tiny Goblin Academy H4.0 Operational Asset Cartography

* **Task Name:** H4.0 - Operational Asset Cartography Census
* **Baseline Commit SHA:** 4e53441 fix: reconcile academy manifest validation
* **Validator Baseline:** Passed (`academy.games.json`, `hub.icon-regions.json`)

## Asset Doctrine Summary
* Source art must never be overwritten.
* Source/concept assets are pantry inputs, not runtime truth.
* No sheet goes directly into a game or hub without manifest/planning/evidence.
* Background-stage assets are not sprite-detected.
* Animation sheets are dangerous cleanup candidates and need pilot review.
* Hub icon regions currently have the strongest implemented manifest/crop pattern.
* This census classifies and plans future tasks; no assets were modified.

## Census Scope
Inspected `assets/` including `academy`, `studio`, and `academy_review` directories. Checked 34 images via read-only metadata inspection (width, height, mode, alpha presence/range, size, fake transparency risk).

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
* UI / HUD: 1
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
* ui-icon-sheet: 3
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

## Metadata Summary
| Asset | Dimensions | Mode | Alpha State | File Size (est.) |
| --- | --- | --- | --- | --- |
| itch-cover.png | 1536x2752 | RGBA | all-opaque | ~8.4 MB |
| readme-banner.png | 3584x1184 | RGBA | all-opaque | ~7.2 MB |
| tga-icon-source-v0.1.png | 2816x1536 | RGBA | all-opaque | ~6.9 MB |
| tga-goblin-expression-action-sheet | 2816x1536 | RGBA | all-opaque | ~7.4 MB |
| tga-platformer-goblin-player | 2816x1536 | RGBA | all-opaque | ~7.2 MB |
| tga-topdown-slime-player | 2752x1536 | RGBA | all-opaque | ~6.8 MB |
| tga-topdown-soldier-enemy | 2816x1536 | RGBA | all-opaque | ~7.6 MB |
| tga-platformer-training-dummy-enemy | 2752x1536 | RGBA | all-opaque | ~6.8 MB |
| tga-card-goblin-duel-card-frames | 1024x1024 | RGB | no alpha | ~679 KB |
| tga-card-goblin-duel-ui-tokens | 1024x1024 | RGB | no alpha | ~746 KB |
| tga-dice-duel-tavern-sheet | 1024x1024 | RGB | no alpha | ~900 KB |
| tga-dungeon-platformer-mixed-sheet | 1376x768 | RGBA | all-opaque | ~2.5 MB |
| tga-farm-settlement-sheet | 1408x768 | RGBA | all-opaque | ~2.5 MB |
| tga-one-room-platformer-background | 1024x1024 | RGB | no alpha | ~716 KB |
| tga-one-room-platformer-sideview-pieces | 1024x1024 | RGB | no alpha | ~712 KB |
| tga-pet-campfire-ember-pup-sheet | 1024x1024 | RGB | no alpha | ~742 KB |
| tga-pet-campfire-background-source | 2048x2048 | RGBA | all-opaque | ~5.8 MB |
| tga-potion-sorter-sheet | 1408x768 | RGBA | all-opaque | ~2.4 MB |
| tga-top-down-slime-quest-playfield | 1024x1024 | RGB | no alpha | ~942 KB |
| tga-hub-game-icons-sheet-concept | 768x1376 | RGBA | all-opaque | ~2.0 MB |
| tga-hub-game-icons-transparent | 768x1376 | RGBA | real-alpha (min=0) | ~1.4 MB |
| tga-hub-banner-source | 555x257 | RGBA | all-opaque | ~251 KB |
| tga-hub-game-icons-cleaned | 768x1376 | RGBA | real-alpha (min=0) | ~1.3 MB |
| tga-hub-game-icons-transparent-v0.1 | 768x1376 | RGBA | real-alpha (min=0) | ~1.4 MB |
| tga-shared-core-sheet | 2816x1536 | RGBA | all-opaque | ~7.2 MB |
| tga-shared-fx-feedback-sheet | 1024x1024 | RGB | no alpha | ~718 KB |
| tga-topdown-environment-objects | 1024x1024 | RGB | no alpha | ~913 KB |
| tga-topdown-terrain-floor-construction | 1024x1024 | RGB | no alpha | ~791 KB |
| tga-topdown-wall-boundary-construction | 1024x1024 | RGB | no alpha | ~829 KB |
| tga-ui-hud-sheet | 2816x1536 | RGBA | all-opaque | ~6.6 MB |
| card-goblin-duel-candidate (review) | 1024x1024 | RGB | no alpha | ~685 KB |
| dungeon-key-run-candidate (review) | 1024x1024 | RGB | no alpha | ~850 KB |
| one-room-platformer-candidate (review) | 1024x1024 | RGB | no alpha | ~694 KB |
| glyphforge-games-boot-splash | 2752x1536 | RGBA | all-opaque | ~7.2 MB |

## Alpha / Fake-Transparency Risk Summary
* **23 assets** report `alpha-channel-all-opaque` (RGBA mode, but every pixel is 255). These carry fake-transparency risk if they visually show checkerboard patterns.
* **3 hub-derived assets** have real alpha (min=0, max=255): `tga-hub-game-icons-transparent.png`, `tga-hub-game-icons-cleaned-v0.1.png`, `tga-hub-game-icons-transparent-v0.1.png`. These are legitimate derived transparent sheets.
* **8 assets** are pure RGB with no alpha channel at all. These are opaque-illustration-background assets; CSS cannot make them transparent without explicit cleanup.
* **High cleanup risk assets** (animation/pet sheets): All creature and pet sheets are high-risk cleanup candidates due to potential transparent kneecaps, limb shadows, and motion details. Do not run bulk flood-fill on these.
* **Safe static-sheet cleanup candidates**: Card frames, dice tavern sheet, potion sorter, shared core, farm settlement may be lower-risk for border-connected flood-fill, but each requires a pilot review first.

## Manifest Coverage Summary
| Contract Type | Count | Assets |
| --- | --- | --- |
| `hub-icon-source-region-manifest` | 4 | Hub icon sheets (source + derived) |
| `animation-manifest` | 7 | Goblin, slime, soldier, dummy, ember pup |
| `regions-manifest` | 7 | Shared core, card duel, dice tavern, potion sorter, FX, topdown objects |
| `scene-anchor-manifest` | 2 | Pet campfire bg, one-room platformer bg |
| `tile-terrain-manifest` | 3 | Farm settlement, top-down slime quest, topdown terrain |
| `boot-asset-manifest` | 2 | Hub banner, glyphforge boot splash |
| `platform-construction-manifest` | 1 | One-room platformer construction pieces |
| `wall-boundary-manifest` | 1 | Topdown wall boundary |
| `favicon-export-manifest` | 1 | TGA icon source |
| `none-yet` | 2 | Readme/itch branding art (no manifest needed) |
| `uncertain` | 3 | Academy review candidates (pending human review) |

## Newly Registered A0 Assets Summary
Three assets were registered in commit `65185b2` (Asset Intake A0):

| Asset | Path | Op Type | Contract | Next Action |
| --- | --- | --- | --- | --- |
| Pet Campfire Background | `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png` | `background-stage` | `scene-anchor-manifest` | background prep + anchor manifest planning |
| TGA Icon Source | `assets/academy/branding/icon-source/tga-icon-source-v0.1.png` | `branding-icon-source` | `favicon-export-manifest` | favicon/app icon export pipeline plan |
| Hub Banner Source | `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png` | `hub-banner-source` | `boot-asset-manifest` | hub banner cleanup + responsive integration plan |

All three are `registered`, `source-only`, not eligible for runtime, and must not be wired until manifest/evidence/human review is complete.

## Readiness Matrix
| Readiness State | Asset Count | Notes |
| --- | --- | --- |
| `runtime-ready` | 3 | Hub icon transparent sheets + readme art |
| `mapped-only` | 2 | Hub icon source + transparent (region-mapped but not semantic-approved) |
| `source-only` | 3 | A0 registered assets (banner, bg, icon source) |
| `needs-human-review` | 4 | Derived hub sheets + academy review candidates |
| `needs-manifest` + `needs-semantic-labeling` | 14 | All creature, game, terrain, and shared sheets |
| `needs-animation-arrays` + `needs-pivots` | 7 | All animation/character/pet sheets |
| `needs-anchors` | 3 | Background stages + construction pieces |

## Risk Matrix
| Risk Level | Asset Count | Families |
| --- | --- | --- |
| High | 7 | Goblin (x2), Slime, Soldier, Training Dummy, Ember Pup, Pet (future sheets) |
| Medium | 10 | Dungeon/Platformer mixed, Farm, One-Room pieces, Top-Down Slime Quest playfield, FX sheet, Terrain, Walls, UI/HUD |
| Low | 17 | All hub assets, A0 registered assets, card/dice/potion static sheets, shared core, review candidates, readme art, boot art |

> [!CAUTION]
> Do not run batch transparency cleanup on any High-risk animation sheet. Each requires a contact sheet pilot pass and human review of at least one animation row before any pixels are touched.

## Temporary Script Audit

> [!WARNING]
> The H4.0 census was partially generated by path-matching Python scripts. This created two confirmed defects in the committed output:

**Scripts retained (untracked, not committed, not deleted per Kryssie's explicit instruction):**
* `analyze_assets.py` — read-only metadata helper (width, height, mode, alpha extrema, file size). Acceptable use: mechanical metadata only.
* `generate_report.py` — semantic classifier and Markdown/JSON generator. This was the risky shortcut. It encoded asset meaning via path-matching `elif` chains. One missing branch (`academy/ui`) caused `tga-ui-hud-sheet-v0.1.png` to fall through to `Unknown / uncertain-operational-type`.
* `metadata_dump.json` — intermediate output from `analyze_assets.py`. Not canonical truth.

**Defects caused by generator:**
1. Bell/control characters (`\a` = 0x07) baked into template string literals in `generate_report.py`, producing corrupted text in the Markdown report (`cademy.games.json`, `ssets/`, etc.).
2. Missing `elif "academy/ui"` branch caused the UI/HUD sheet to classify as Unknown.

**Doctrine going forward:**
* Metadata scripts (width, height, mode, alpha extrema) are acceptable as mechanical helpers when explicitly requested.
* Semantic classification (asset family, op type, lifecycle, manifest contract) must be done manually or from an explicitly reviewed table — never from freshly invented path-matching scripts.
* When Kryssie declines an action in the approval UI or comments "No," that is binding. The scripts above were retained at her explicit request and must not be deleted or staged without her approval.

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
| assets\academy\ui\tga-ui-hud-sheet-v0.1.png | UI / HUD | ui-icon-sheet | concept | metadata-inspected, alpha-inspected, needs-cleanup, needs-manifest, needs-evidence, needs-human-review, needs-semantic-labeling | 2816x1536 | alpha-channel-all-opaque | medium | regions-manifest | source-metadata-json, alpha-preview, dark-background-preview, bbox-overlay, numbered-contact-sheet, candidate-regions-json | visual-quality-review, transparency-cleanup-review, semantic-label-review | not eligible | cleanup and region detection pilot | medium | UI/HUD pantry: buttons, panels, frames, icons, typography blocks |
| assets\academy_review\card-goblin-duel-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\academy_review\dungeon-key-run-playfield-pack-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\academy_review\one-room-platformer-playfield-pack-candidate-v0.1.png | Academy Review Candidates | review-candidate | review-candidate | needs-human-review | 1024x1024 | opaque-illustration-background | low | uncertain | none-yet | visual-quality-review | not eligible | human review | low |  |
| assets\studio\glyphforge-games\glyphforge-games-boot-splash-concept.png | Studio / Boot Assets | boot-studio-art | concept | metadata-inspected, needs-evidence, needs-human-review | 2752x1536 | alpha-channel-all-opaque | low | boot-asset-manifest | runtime-integration-screenshot | visual-quality-review, runtime-integration-review | not eligible | integration planning | low |  |
