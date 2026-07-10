# Tiny Goblin Academy — H5.91 Manifest Folder Reorganization Move Pass

## Purpose

H5.91 reorganizes the crowded root `manifests/` folder into categorized manifest shelves.

This pass used a fresh inventory, not stale H5.87 counts. H5.87 remains the shelf strategy; H5.91 is the current move execution.

## Fresh Inventory

Fresh root manifest inventory before moving:

```text
tracked root JSON manifests: 61
root README files retained: manifests/README.md
baseline commit: 389c2b8 docs: select academy fantasy font direction
```

The fresh inventory included files added after H5.87, including H5.88/H5.89/H5.90 tool and font pantry manifests.

## Move Method

H5.91 generated and safety-checked a move map before moving files.

Safety checks:

- source exists;
- source is tracked by Git;
- destination is unique;
- destination does not already exist;
- destination path remains under `manifests/`;
- no unclassified root JSON manifests remain;
- no duplicate destinations;
- no copy/delete flow for tracked manifests.

All tracked manifest moves were executed with:

```text
git mv
```

H5.91 did not copy/delete tracked manifests.

## Result

Post-move result:

```text
moved manifest JSON files: 61
root manifests/*.json remaining: 0
recursive manifest JSON count: 62
```

The recursive count includes the new H5.91 execution record:

```text
manifests/academy/tooling/organization/academy.manifest-folder-reorganization-execution.json
```

No destination folder has more than 10 loose JSON files. The largest destination folder is:

```text
manifests/academy/games/pet-campfire/ — 9 JSON files
```

## New Shelf Shape

```text
manifests/
  README.md
  academy/
    core/
    hub/
    shared/
    creatures/
    games/
      button-goblin-clicker/
      potion-sorter/
      dice-duel-tavern/
      card-goblin-duel/
      tiny-farm-day/
      pet-campfire/
      one-room-platformer/
      dungeon-platformer/
    topdown/
      source/
      terrain/
      walls/
      objects/
      future-floor-tilesheets/
    visual-pantry/
    fonts/
    tooling/
      glyphforge/
      organization/
  boot/
```

## Active Reference Updates

H5.91 updated active machine-readable references and current validators/scripts needed for the nested structure.

Updated active references include:

- manifest-internal references inside active JSON manifests;
- `tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs`;
- `tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json`;
- `tools/glyphforge/viewer-shell-static/README.md`;
- `manifests/README.md`;
- active validators/scripts that assumed flat manifest paths.

Historical H4/H5 lane reports were not broadly rewritten. Their old paths remain historical record unless a future docs reorganization/correction lane changes them deliberately.

## Validator / Script Updates

Updated validation/tooling surfaces:

- `scripts/validate-academy-manifest.mjs`
- `scripts/validate-hub-icons.mjs`
- `scripts/validate-hub-icon-regions.mjs`
- `scripts/validate-academy-asset-manifests.mjs`
- `scripts/validate-academy-animation-manifests.mjs`
- `scripts/validate-academy-shared-asset-regions.mjs`
- `scripts/asset-pipeline/smoke-check.mjs`
- `tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs`

The provenance validator already used recursive manifest discovery and did not need a recursive-discovery rewrite.

## GlyphForge Registry

The GlyphForge visual registry was regenerated after the pantry index moved.

Result:

```text
entry count: 24
source of truth: manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json
bad manifest paths: 0
runtime approvals upgraded: none
```

## Validation

Validation passed:

```text
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/smoke-check.mjs
node scripts/asset-pipeline/cli.mjs validate
```

Additional checks passed:

- all JSON under `manifests/` parses recursively;
- root `manifests/*.json` count is `0`;
- destination paths exist;
- source root JSON paths no longer exist;
- Git status shows manifest moves as renames;
- no unpaired deleted manifest files were found;
- GlyphForge registry JSON parses and points at nested manifest paths.

## Non-Goals

H5.91 does not:

- reorganize `docs/assets/`;
- correct stale overview docs;
- continue GlyphForge tool implementation;
- wire runtime or game behavior;
- modify PNGs/images;
- modify package or lock files;
- install dependencies;
- perform font binary intake.

`docs/assets` reorganization remains future H5.92.

Stale overview docs correction remains future H5.93.

GlyphForge tool lane remains parked at:

```text
H5.88F — GlyphForge Region Browser Image Preview Plan
```

## Recommended Next Step

Recommended next lane:

```text
H5.92 — Asset Docs Reorganization Move Pass
```
