# Tiny Goblin Academy — H5.81 Existing Topdown Terrain Cleanup Candidate

## Purpose

H5.81 creates a cleanup candidate for the existing reviewed Topdown Terrain sheet.

This is cleanup candidate generation only. It is not human approval, runtime approval, placement approval, collision approval, pathfinding approval, tilemap approval, autotiling approval, or game wiring.

## Relationship To H5.60B

H5.60B remains the accepted mapping baseline for terrain blank-cell truth.

Blank cells are exactly:

```text
30, 31, 64
```

Partial content cells are not blank:

```text
25, 35, 32, 36, 37, 38, 39
```

H5.81 preserves all 64 reviewed source regions and does not change sourceRects.

## Source

```text
assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png
```

Source metadata:

- Format / mode: PNG / RGB
- Dimensions: `1024x1024`
- Layout: `8x8` grid of `128x128` cells
- Alpha finding: no alpha channel
- Cleanup classification: RGB/fake-background terrain source

The source is not true alpha.

## Cleanup Method

H5.81 uses the canonical asset pipeline CLI and registered cleanup method:

```text
node scripts/asset-pipeline/cli.mjs cleanup-candidate
method: edge-connected-checker-cleanup
methodStatus: canonical-with-caution
```

The method operated per reviewed `128x128` source cell and removed background-like pixels connected to the cell boundary. It did not use an inline cleanup script or an unregistered pixel method.

Pipeline maturation note: H5.81 required a lane-neutral improvement to the canonical cleanup method so it accepts both `sourceRect.w/h` and `sourceRect.width/height` schemas. The method also now exposes `edge_seed_inset`, defaulting to previous edge-only behavior, so grid-bordered sheets can explicitly seed a small edge band with provenance.

H5.81 used:

```text
edge_seed_inset: 4
gray_min: 0.75
```

These parameters are recorded in:

```text
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/pipeline-run-log.json
```

## Outputs

Derived cleanup sheet:

```text
assets/academy/topdown/terrain/derived/tga-topdown-terrain-cleaned-v0.1.png
```

Cleanup manifest:

```text
manifests/academy.topdown.terrain.cleanup-candidate.json
```

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-cleanup-candidate`
- `runtimeEligibility`: `not-runtime-approved`
- cleanup manifest regions retained: `64`
- cleanup candidate regions: `59`
- deferred cells: `25`, `35`
- blank transparent candidates: `30`, `31`, `64`

## Blank / Partial Cell Handling

Blank cells:

- `30` — blank-empty-cell
- `31` — blank-empty-cell
- `64` — blank-empty-cell

These remain traceable region records and may become transparent in the derived sheet.

Deferred water/checker partial cells:

- `25` — water corner southeast
- `35` — small water puddle

These are content-bearing partial cells, not blank cells. They are excluded from the usable cleanup candidate set because cleanup left unacceptable checker remnants. Future replacement or targeted correction is required if either is needed.

Retained partial content cleanup candidates:

- `32` — slime stone corner top-right
- `36` — slime edge southwest
- `37` — grass edge south
- `38` — grass strip vertical
- `39` — partial grass edge vertical tile

These remain cleanup candidates for H5.82 human/product review.

## Risk / Review Notes

All 64 cleanup regions remain `needs-human-review`.

Risk metadata stays behavior-deferred for water, slime, special terrain, blank cells, partial terrain/checker cells, portal-like or marker-like terrain, and any hazard-looking visual category.

No region approves:

- runtime use
- placement
- collision
- pathfinding
- walkability
- blocked terrain
- slow terrain
- hazard behavior
- water behavior
- slime behavior
- portal behavior
- trigger behavior
- tilemap use
- autotiling
- game wiring

## Evidence Created

```text
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-cleaned-derived-sheet-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-cleaned-on-dark-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-before-after-contact-sheet.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-mask-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-mask-overlay.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-cleanup-table-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-risk-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-blank-and-partial-cell-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-excluded-preview.png
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/pipeline-run-log.json
```

The canonical CLI also generated:

```text
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate/topdown-terrain-candidate-preview.png
```

## Non-Goals

H5.81 does not:

- modify the source PNG;
- process H5.73A future floor tilesheets;
- modify object or wall assets;
- approve runtime terrain use;
- approve collision;
- approve pathfinding;
- approve walkability;
- approve water/slime/hazard/portal behavior;
- approve tilemap use;
- approve autotiling;
- wire any Top-Down Slime Quest runtime/game code.

## Recommended Next Step

```text
H5.82 — Existing Topdown Terrain Cleanup Human Review
```

H5.82 should review the on-dark preview, blank/partial/deferred preview, before/after contact sheet, mask evidence, risk preview, and table evidence before any terrain cleanup candidate is promoted.
