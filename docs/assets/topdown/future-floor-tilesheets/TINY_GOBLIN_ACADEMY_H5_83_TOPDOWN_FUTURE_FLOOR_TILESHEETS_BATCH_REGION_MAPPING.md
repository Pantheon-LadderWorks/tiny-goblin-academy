# Tiny Goblin Academy — H5.83 Topdown Future Floor Tilesheets Batch Region Mapping

## Purpose

H5.83 batch-maps the six future Topdown floor / ground tilesheets that were ingested in H5.73A. This is a future-pantry region mapping pass only: it creates sourceRect inventory and review evidence so the sheets can be human-reviewed before any future cleanup, tilemap planning, or runtime use.

## Relationship To H5.73A And H5.81/H5.82

H5.73A copied the six generated floor tilesheets and paired semantic manifest/spec files into the future-floor-tilesheets pantry. H5.81/H5.82 handled the existing current Topdown Terrain cleanup lane. H5.83 does not modify or replace that current terrain lane.

This pass uses:

* Semantic manifest: `assets/academy/topdown/terrain/future-floor-tilesheets/manifests/tga-topdown-floor-tilesheets-manifest-v0.1.json`
* Source folder: `assets/academy/topdown/terrain/future-floor-tilesheets/sources/`

## Batch-Mapped Sheets

The batch manifest contains six sheets:

1. `terrain.grass-dirt.v0.1`
2. `terrain.stone-ruin.v0.1`
3. `terrain.wood-indoor.v0.1`
4. `terrain.cave-rock.v0.1`
5. `terrain.swamp-slime.v0.1`
6. `terrain.arcane-metal.v0.1`

Each sheet has 64 mapped grid regions, for 384 total draft regions.

The road/path overlay source remains intentionally excluded from this pass.

## SourceRect Strategy

The semantic manifest uses 8x8 `128x128` tile vocabulary, but the actual source PNGs are `1254x1254`. H5.83 therefore does not blindly emit `128x128` sourceRects.

Instead, the canonical batch mapper uses proportional real-image boundaries:

```text
x0 = round(col * width / 8)
x1 = round((col + 1) * width / 8)
y0 = round(row * height / 8)
y1 = round((row + 1) * height / 8)
```

The original semantic manifest rectangle is preserved separately as `semanticRect`. The real sampled image rectangle is recorded as `sourceRect`.

## Canonical Pipeline Maturation

H5.83 adds a reusable canonical batch-grid mapper:

* `scripts/asset-pipeline/map-grid-batch.py`
* `node scripts/asset-pipeline/cli.mjs map-grid-batch`

The command writes provenance through the normal asset-pipeline run-log contract. This avoids one-off batch scripts for like-shaped sheet groups.

## Outputs

Batch region manifest:

* `manifests/academy.topdown.floor-tilesheets.future.regions.json`

Evidence folder:

* `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/`

Pipeline run log:

* `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/pipeline-run-log.json`

## Evidence Created

Batch-level evidence:

* `batch-source-contact-sheet.png`
* `batch-summary-table-preview.png`

Per-sheet evidence was created for all six sheets:

* bbox overlay
* numbered contact sheet
* region table preview

## Non-Goals

H5.83 does not approve or create:

* cleanup candidates;
* derived cleaned PNGs;
* source PNG edits;
* runtime tilemaps;
* collision;
* pathfinding;
* walkability;
* hazard behavior;
* water behavior;
* slime behavior;
* portal or trigger behavior;
* autotiling;
* game/runtime wiring.

## Review Notes

All output remains `draft`, `needs-human-review`, `future-pantry-region-mapping`, and `not-runtime-approved`.

The source sheets are RGB/no-alpha future pantry sheets. H5.83 maps their current visual cells only; it does not decide whether they should be cleaned, used as-is, regenerated, tiled, or runtime wired.

## Recommended Next Step

H5.84 — Future Topdown Floor Tilesheets Batch Region Human Review.
