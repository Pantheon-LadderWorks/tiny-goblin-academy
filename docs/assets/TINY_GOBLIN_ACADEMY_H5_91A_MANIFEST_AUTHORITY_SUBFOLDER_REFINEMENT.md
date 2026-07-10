# Tiny Goblin Academy — H5.91A Manifest Authority Subfolder Refinement

## Purpose

H5.91A refines the H5.91 manifest reorganization.

H5.91 sorted manifests by subject. H5.91A sorts the crowded subject shelves by authority and maturity.

The motivating example was Pet Campfire. After H5.91, `manifests/academy/games/pet-campfire/` had 9 files, which was technically under the loose-folder limit but semantically misleading. Intake classification, early region maps, cleanup candidates, pose candidates, scene anchors, placement plans, and layout composition plans should not all look like equal current law.

## Active Root Policy

H5.91A keeps current/active manifests visible at the category root.

Non-current records move into maturity subfolders:

- `lineage/`
- `planning/`
- `generated/`
- `execution/`
- `deferred/`
- `denied/`

This means a future agent can open a category folder and immediately see how many current manifests exist without digging through historical process files.

Important doctrine:

```text
active/current does not mean runtime-approved
reviewed does not mean runtime-approved
lineage does not mean delete
planning does not mean runtime behavior
generated does not automatically mean source of truth
```

## Move Method

All tracked manifest moves were executed with `git mv`.

H5.91A did not copy/delete tracked manifests and did not delete manifests.

## Result

```text
total manifests after H5.91A index: 63
moved manifests: 29
active/current manifests: 34
lineage manifests: 15
planning manifests: 12
execution manifests: 1
deferred manifests: 1
generated manifests: 0
denied manifests: 0
unknown manifests: 0
```

The new maturity index is:

```text
manifests/academy/tooling/organization/academy.manifest-maturity-index.json
```

## Pet Campfire Before / After

Before H5.91A, Pet Campfire had 9 equal-looking files in one category folder.

After H5.91A:

```text
manifests/academy/games/pet-campfire/
  academy.pet-campfire.background.scene-anchors.json
  academy.pet-campfire.ember-pup.pose-cleanup-candidate.json
  academy.pet-campfire.static-props-icons.cleanup-candidate.json
  lineage/
    academy.pet-campfire.ember-pup.pose-candidates.json
    academy.pet-campfire.intake-classification.json
    academy.pet-campfire.static-props-icons.regions.json
  planning/
    academy.pet-campfire.ember-pup.state-placement-plan.json
    academy.pet-campfire.layout-composition-plan.json
    academy.pet-campfire.ui-prop-care-placement-plan.json
```

The current Pet Campfire shelf now shows 3 active/current manifests at first glance.

## Active Counts By Category

```text
manifests/academy/core: 1
manifests/academy/creatures: 7
manifests/academy/fonts: 1
manifests/academy/games/button-goblin-clicker: 1
manifests/academy/games/card-goblin-duel: 2
manifests/academy/games/dice-duel-tavern: 1
manifests/academy/games/dungeon-platformer: 1
manifests/academy/games/one-room-platformer: 1
manifests/academy/games/pet-campfire: 3
manifests/academy/games/potion-sorter: 1
manifests/academy/games/tiny-farm-day: 1
manifests/academy/hub: 4
manifests/academy/shared: 2
manifests/academy/tooling/organization: 1
manifests/academy/topdown/future-floor-tilesheets: 1
manifests/academy/topdown/objects: 1
manifests/academy/topdown/terrain: 1
manifests/academy/topdown/walls: 2
manifests/academy/visual-pantry: 1
manifests/boot: 1
```

## Reference Updates

H5.91A updated active machine-readable references after the moves, including:

- manifest-internal source manifest paths;
- active validator/script manifest paths;
- GlyphForge visual registry paths;
- manifest shelf README guidance.

Historical H4/H5 reports were not broadly rewritten. Old paths in historical reports remain historical record unless a later docs correction lane updates them deliberately.

## Non-Goals

H5.91A did not:

- reorganize `docs/assets/`;
- rewrite historical reports broadly;
- change runtime/game files;
- change PNGs/images;
- change package/lock files;
- install dependencies;
- approve runtime usage for any manifest.

## Validation

Required validation passed:

```text
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/smoke-check.mjs
node scripts/asset-pipeline/cli.mjs validate
```

Additional checks:

- all JSON under `manifests/` parses recursively;
- maturity index JSON parses;
- every JSON manifest is represented in the maturity index;
- unknown manifest count is 0;
- GlyphForge registry JSON parses;
- GlyphForge registry manifest paths resolve;
- no PNG/image files changed;
- no package/lock files changed;
- no runtime/game files changed;
- no `docs/assets` folder reorganization occurred;
- this report contains no bell/control characters.

## Recommended Next Step

```text
H5.92 — Asset Docs Reorganization Move Pass
```

Tiny manifest law:

```text
H5.91 sorted by subject.
H5.91A sorted by authority.
```
