# Tiny Goblin Academy - H5.55 Dungeon Platformer Region Human Review

## 1. Purpose

H5.55 records Kryssie's human/product review decision for the H5.54 Dungeon Platformer measured-grid region mapping.

This is a metadata and review promotion pass only. It accepts the measured-grid region map for draft cleanup and planning use.

## 2. Review Input

Review input:

- H5.54 region mapping commit: `9b8ee77 docs: map dungeon platformer regions`
- Region manifest: `manifests/academy.dungeon-platformer.regions.json`
- Evidence folder: `assets/academy/evidence/h5-54-dungeon-platformer-region-mapping/`
- Source dimensions: 1376x768
- Regions represented: 40

## 3. Human Review Decision

H5.54 Human Review Passed.

The Dungeon Platformer region mapping is accepted because it follows the measured irregular baked grid, not ideal equal cells and not tight visual bounds.

No sourceRect correction pass is needed.

## 4. Accepted Measured Grid

Accepted measured grid edges:

- X: 0, 165, 344, 523, 688, 867, 1046, 1211, 1376
- Y: 0, 161, 326, 479, 630, 768

The measured irregular baked grid is the sourceRect truth for this sheet.

This sheet is not a clean runtime atlas. It is a mixed-perspective parts bin with measured grid-cell regions.

## 5. Accepted Region Count

Accepted mapping summary:

- Regions accepted: 40
- Status: reviewed
- Review status: human-review-passed
- Pipeline use: accepted-for-draft-cleanup-and-planning-use
- Runtime eligibility: not-runtime-approved

## 6. Split-Lane Summary

H5.55 accepts mixed split-aware classification for future planning.

Preserved split lanes include:

- side-view platformer terrain, props, hazards, and traversal candidates;
- top-down/shared dungeon props, terrain, and interactives;
- UI/status surfaces;
- FX candidates;
- green slime enemy candidate deferred.

The green slime enemy remains a candidate only. It is not animation-approved, hitbox-approved, hurtbox-approved, runtime-approved, or gameplay-approved.

## 7. Category / Risk Summary

Category summary:

- dungeon-tile: 3
- terrain-tile: 3
- platform: 3
- ui-surface: 1
- ui-status-icon: 3
- barrier-prop: 1
- prop: 1
- interactive-prop: 2
- traversal-prop: 1
- architecture-prop: 1
- hazard: 5
- enemy-candidate: 1
- sign-prop: 1
- ui-control-icon: 2
- key-item: 1
- door-prop: 2
- banner-prop: 1
- reward-icon: 1
- currency-token: 1
- chest-prop: 1
- fx: 4
- ui-direction-icon: 1

Cleanup risk summary:

- medium: 27
- medium-high: 10
- high: 3

Future cleanup should preserve split-lane risk notes, especially around FX, slime, water, fire, and sparkle candidates.

## 8. Runtime / Collision / Animation Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- no runtime/game wiring approval;
- no collision approval;
- no hitbox or hurtbox approval;
- no animation approval;
- no placement approval;
- no dungeon gameplay behavior approval.

The manifest may support draft cleanup and planning only.

## 9. Non-Goals

H5.55 did not:

- modify source PNGs;
- regenerate evidence;
- create cleanup candidates;
- create derived assets;
- wire runtime or game code;
- approve collision;
- approve hitboxes or hurtboxes;
- approve animation;
- approve placement;
- approve dungeon gameplay behavior;
- touch Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## 10. Recommended Next Lane

Recommended next lane:

`H5.56 - Dungeon Platformer Cleanup Candidate`

H5.56 should carry the split-lane warnings forward. The sheet has clean hard props, but FX, slime, water, fire, and sparkle regions are checkerboard goblin traps.
