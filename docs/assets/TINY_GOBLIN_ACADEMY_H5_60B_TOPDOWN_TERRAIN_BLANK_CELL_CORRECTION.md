# Tiny Goblin Academy — H5.60B Topdown Terrain Blank Cell Correction

## Purpose

H5.60B corrects the H5.60 blank-cell review note for the Topdown Terrain region manifest.

H5.60 promoted the mapping correctly in broad shape, but the human-review correction targeted the wrong blank cell. H5.60B fixes the exact cell identities while preserving the same review boundary.

## Correction Summary

H5.60 said region 30 was a partial grass edge and region 39 was blank.

Human review corrected this:

- Region 30 is blank/checkerboard-only.
- Region 39 contains visible grass/terrain edge content.

Corrected manifest state:

- Region 30: `blank-empty-cell` / `blank-empty`
- Region 39: `grass-floor-tile` / `grass-edge-partial`

Final blank placeholder cells:

- 30
- 31
- 64

## Partial Content Policy

The following checkerboard/content cells are not blank and remain content-bearing terrain candidates:

- 25 — water/checkerboard
- 32 — slime/checkerboard
- 35 — water/checkerboard
- 36 — slime/checkerboard
- 37 — grass/checkerboard
- 38 — grass/checkerboard
- 39 — grass/checkerboard

These remain draft terrain inventory entries only. They are not runtime-approved.

## Manifest Updated

Updated:

`manifests/academy.topdown.terrain.regions.json`

Top-level manifest status remains:

- `status`: `reviewed`
- `reviewStatus`: `human-review-passed`
- `pipelineUse`: `accepted-for-draft-cleanup-and-planning-use`
- `runtimeEligibility`: `not-runtime-approved`

Retained:

- 64 regions
- 8x8 measured grid
- 128x128 sourceRects
- all sourceRects inside `1024x1024`

## Corrected Category Counts

| Category | Count |
| --- | ---: |
| `blank-empty-cell` | 3 |
| `dirt-path-tile` | 9 |
| `flag-status-tile` | 4 |
| `grass-floor-tile` | 8 |
| `portal-special-marker` | 6 |
| `shore-edge-tile` | 13 |
| `slime-liquid-tile` | 5 |
| `stone-special-tile` | 12 |
| `water-tile` | 4 |

The category counts remain the same as H5.60, but the identities of the blank and grass-edge cells are corrected.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-60b-topdown-terrain-blank-cell-correction/`

Evidence files:

- `topdown-terrain-h5-60b-corrected-overlay.png`
- `topdown-terrain-h5-60b-correction-summary.png`
- `topdown-terrain-h5-60b-corrected-table-excerpt.png`

## Runtime / Collision / Pathfinding Boundary

H5.60B does not approve:

- runtime tilemap use
- collision
- pathfinding
- terrain behavior
- portal behavior
- slime / hazard behavior
- water behavior
- placement
- cleanup
- derived images
- game/runtime code

## Non-Goals

- No source PNG modification.
- No cleanup output.
- No derived cleanup candidate.
- No topdown/walls processing.
- No topdown/objects processing.
- No mixed Slime Quest playfield pack processing.
- No game/runtime code changes.

## Recommended Next Lane

H5.61 — Topdown Walls Region Mapping

Terrain correction is now clean enough to move forward.
