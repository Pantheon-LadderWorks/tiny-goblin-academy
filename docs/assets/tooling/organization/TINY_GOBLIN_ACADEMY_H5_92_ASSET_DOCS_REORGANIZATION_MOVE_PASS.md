# Tiny Goblin Academy — H5.92 Asset Docs Reorganization Move Pass

## Purpose

H5.92 reorganized the loose `docs/assets/` asset documentation shelf into category folders so future agents can find current plans, historical reports, pipeline doctrine, game-specific lanes, topdown lanes, and tooling records without treating 100+ root files as one flat pile.

## Baseline

- Baseline commit: `ae65a62f36ba3c57c9e08a9400edd2a9ff99844a`
- Prior lane: H5.91A manifest authority shelf refinement
- Move method: `git mv` for tracked documentation files

## Fresh inventory

- Tracked files under `docs/assets/` before H5.92: 143
- Loose tracked root files before H5.92: 128
- Already nested tracked files before H5.92: 15
- Files moved in H5.92: 128
- Unclassified loose tracked files: 0

H5.87 was treated as organization strategy, not as the current move list. H5.92 used a fresh inventory and included files added after H5.87, including H5.88 tooling reports, H5.89/H5.90 font pantry reports, H5.91/H5.91A organization reports, and late topdown lane reports.

## Shelf result

- `docs/assets/doctrine/`: 5 moved files
- `docs/assets/game-assets/`: 46 moved files
- `docs/assets/hub-visuals/`: 16 moved files
- `docs/assets/pantry/`: 6 moved files
- `docs/assets/pipeline/`: 9 moved files
- `docs/assets/shared-assets/`: 8 moved files
- `docs/assets/tooling/`: 10 moved files
- `docs/assets/topdown/`: 28 moved files

## Folder hygiene

The reorganization used semantic shelves rather than only chronological numbering. Folders were split by doctrine, hub visuals, shared assets, game asset lanes, topdown lanes, pipeline material, pantry records, and tooling records.

Leaf-folder move counts over the ten-file guideline: none.

The root `docs/assets/` folder is intentionally kept small and now has a README explaining the shelf map. Existing `archive/` and `evidence/` support folders were not reorganized in this pass.

## Active/current visibility

The active current asset system plan was moved to:

- `docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

This keeps the current visual pantry and active planning surface easy to find at first glance. Historical reports are nested by lane so they do not masquerade as equal current authority.

## H5.73A correction

During the move pass, `TINY_GOBLIN_ACADEMY_H5_73A_TOPDOWN_FLOOR_TILESHEET_FUTURE_INTAKE.md` was corrected into the future floor tilesheet shelf instead of the wall shelf:

- `docs/assets/topdown/future-floor-tilesheets/TINY_GOBLIN_ACADEMY_H5_73A_TOPDOWN_FLOOR_TILESHEET_FUTURE_INTAKE.md`

## Non-goals

- No runtime or game code was changed.
- No PNGs/images/source assets were changed.
- No package or lock files were changed.
- No manifests were reorganized in this pass.
- No evidence image folders were reorganized.
- Historical lane reports were not broadly rewritten.
- Runtime approval was not inferred or upgraded.

## Execution record

Machine-readable execution record:

- `manifests/academy/tooling/organization/execution/academy.asset-docs-reorganization-execution.json`

## Recommended next lane

H5.93 — stale overview/reference update pass, limited to active docs and discovery surfaces that still point at old flat `docs/assets/` paths.
