# Tiny Goblin Academy — H5.54 Dungeon Platformer Region Mapping

## Purpose

H5.54 performs source intake and draft region mapping for the Dungeon Platformer mixed asset sheet. This sheet predates the later dedicated top-down and one-room platformer asset lanes, so the pass treats it as a split-aware mixed-parts inventory rather than one approved runtime atlas.

## Source Metadata

- Source: `assets/academy/games/dungeon-platformer/tga-dungeon-platformer-mixed-sheet-concept-v0.1.png`
- Dimensions: `1376x768`
- Mode: `RGBA`
- Alpha range: `255` to `255`
- Transparency finding: RGBA source with fully opaque alpha; checkerboard/fake transparency is baked into the pixels.

## Measured Grid Mapping Method

The source sheet has an irregular baked 8x5 grid. H5.54 sourceRects intentionally follow the measured grid separators instead of ideal math cells or tight visible bounds:

- X edges: `[0, 165, 344, 523, 688, 867, 1046, 1211, 1376]`
- Y edges: `[0, 161, 326, 479, 630, 768]`
- Total regions: 40 measured grid cells.

This keeps the intake evidence aligned to the source sheet's actual structure. Later cleanup or split-lane passes can decide whether to crop tighter derived assets.

## Classification

Operational type: `mixed-dungeon-platformer-split-aware-measured-grid-region-manifest`

The sheet contains a mixed set of top-down terrain, side-view/platformer pieces, shared dungeon props, hazards, pickups, UI/status/control icons, FX candidates, and one enemy/creature candidate. The manifest preserves `classificationLane` per measured grid cell so future passes can split the sheet cleanly instead of treating every region as one game style.

## Region Summary

- Total mapped draft regions: 40
- Status: `draft`
- Review status: `needs-human-review`
- Runtime eligibility: `not-runtime-approved`

## Category Breakdown

- architecture-prop: 1
- banner-prop: 1
- barrier-prop: 1
- chest-prop: 1
- currency-token: 1
- door-prop: 2
- dungeon-tile: 3
- enemy-candidate: 1
- fx: 4
- hazard: 5
- interactive-prop: 2
- key-item: 1
- platform: 3
- prop: 1
- reward-icon: 1
- sign-prop: 1
- terrain-tile: 3
- traversal-prop: 1
- ui-control-icon: 2
- ui-direction-icon: 1
- ui-status-icon: 3
- ui-surface: 1

## Classification Lane Breakdown

- fx-candidate: 4
- shared-dungeon-pickup: 1
- shared-dungeon-prop: 6
- side-view-platformer-hazard: 1
- side-view-platformer-prop: 1
- side-view-platformer-terrain: 5
- side-view-platformer-traversal: 1
- split-candidate-platformer-and-top-down: 1
- top-down-creature-deferred: 1
- top-down-or-platformer-hazard: 4
- top-down-or-platformer-interactive: 2
- top-down-or-platformer-prop: 1
- top-down-or-platformer-terrain: 1
- top-down-terrain: 2
- ui-status-surface: 9

## Cleanup Risk Summary

- high: 3
- medium: 27
- medium-high: 10


## Evidence Created

- `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/dungeon-platformer-bbox-overlay.png`
- `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/dungeon-platformer-numbered-contact-sheet.png`
- `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/dungeon-platformer-region-table-preview.png`
- `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/dungeon-platformer-source-inspection-preview.png`
- `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/dungeon-platformer-split-lane-classification-preview.png`

## Non-Goals

- No source PNG modification.
- No cleanup candidate or derived transparent asset.
- No runtime/game code wiring.
- No animation timing.
- No collision, hitbox, hurtbox, or placement approval.
- No gameplay behavior approval.
- No Top-Down Slime Quest processing.
- No Shared FX processing.
- No Tauri/Rust/Cargo activity.

## Human Review Notes

Human/product review should focus on whether each measured grid cell is labeled correctly and whether the split-aware lane labels match the intended future use. In particular, review the mixed top-down versus side-view classifications before any cleanup or runtime planning pass.

## Recommended Next Lane

H5.55 — Dungeon Platformer Region Human Review
