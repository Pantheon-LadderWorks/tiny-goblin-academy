# Tiny Goblin Academy - H5.56 Dungeon Platformer Cleanup Deferred

## 1. Purpose

H5.56 records a docs-only cleanup-deferred decision for the Dungeon Platformer mixed sheet.

The H5.55 measured-grid region mapping remains accepted for draft planning and reference. The attempted cleanup lane is not accepted for draft pipeline use.

## 2. Baseline

Baseline commit:

`88dfda3 docs: review dungeon platformer regions`

Reviewed source sheet:

`assets/academy/games/dungeon-platformer/tga-dungeon-platformer-mixed-sheet-concept-v0.1.png`

Reviewed region manifest:

`manifests/academy.dungeon-platformer.regions.json`

H5.55 accepted 40 measured-grid regions using the irregular baked grid as the sourceRect truth.

## 3. Cleanup Decision

Cleanup decision: cleanup-deferred.

A Dungeon Platformer cleanup candidate was attempted but not committed. The cleanup failed visual/product review because the baked checkerboard/lattice pattern is entangled with gray dungeon tile art, UI surfaces, and stone/platform regions.

No derived cleanup candidate is accepted.

## 4. Why Cleanup Was Deferred

Cleanup was deferred because:

- broad cleanup damages gray and stone assets;
- conservative cleanup leaves visible grid/checker artifacts;
- lattice-aware cleanup still leaves artifacts and risks asset damage;
- the source is a mixed-perspective parts bin, not a clean runtime atlas;
- FX, slime, water, fire, sparkle, UI, and gray dungeon cells are especially high-risk.

The map is useful. The cleanup is cursed.

## 5. Current Valid Use

The mixed measured-grid manifest remains useful for:

- inventory;
- cartography;
- planning;
- split-lane analysis;
- identifying future regeneration targets.

It should not be treated as cleanup-approved runtime art.

## 6. Future Path

Future path should be selective regeneration or true-alpha per-lane replacement, not bulk cleanup.

Recommended future approaches:

- regenerate true-alpha side-view platformer terrain/props separately;
- regenerate top-down/shared dungeon props separately;
- regenerate FX/slime/water/fire/sparkle pieces separately;
- avoid using the current sheet as a cleaned runtime atlas.

## 7. Runtime / Collision / Animation Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- no runtime/game wiring approval;
- no collision approval;
- no hitbox or hurtbox approval;
- no animation approval;
- no placement approval;
- no dungeon gameplay behavior approval.

## 8. Non-Goals

H5.56 did not:

- create a cleaned derived sheet;
- regenerate evidence images;
- modify source PNGs;
- modify game/runtime code;
- create runtime assets;
- approve collision;
- approve hitboxes or hurtboxes;
- approve animation;
- approve placement;
- approve dungeon gameplay behavior.

## 9. Recommended Next Lane

Recommended next lane:

`Continue Remaining Standard Game Asset Sheets`

The Dungeon Platformer sheet remains a reference/catalog sheet unless it returns as true alpha or as smaller lane-specific regenerated pieces.
