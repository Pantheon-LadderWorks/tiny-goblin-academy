# Tiny Goblin Academy — H5.59 Topdown Terrain Source Intake + Region Mapping

## Purpose

H5.59 creates a draft region/tile mapping for the topdown terrain source only.

This is source intake, semantic tile classification, manifest creation, and evidence generation. It does not clean the source, create runtime tilemaps, approve collision/pathfinding, or wire any game code.

## Source

`assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`

Source metadata:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha finding: no alpha channel
- Transparency finding: checker-style background is baked/fake transparency

## Relationship To H5.58 / H5.58B

H5.58 inventoried the topdown source set and routed the lanes:

1. terrain
2. walls
3. objects

H5.58B human-review-passed that routing. H5.59 starts the first accepted topdown processing lane: terrain.

The mixed Top-Down Slime Quest playfield pack remains reference-only / mixed pantry and was not processed.

## Measured Grid Finding

The terrain sheet uses a regular visible 8x8 grid.

Measured grid:

- Columns: 8
- Rows: 8
- Cell size: `128x128`
- X edges: `0, 128, 256, 384, 512, 640, 768, 896, 1024`
- Y edges: `0, 128, 256, 384, 512, 640, 768, 896, 1024`

SourceRects follow full grid cells, including explicit blank/empty placeholder cells. This is a region/tile inventory, not a tight visible-bounds crop pass.

## Manifest Created

Created:

`manifests/academy.topdown.terrain.regions.json`

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `runtimeEligibility`: `not-runtime-approved`
- region count: `64`

## Category Breakdown

| Category | Count |
| --- | ---: |
| `blank-empty-cell` | 4 |
| `dirt-path-tile` | 9 |
| `flag-status-tile` | 4 |
| `grass-floor-tile` | 7 |
| `portal-special-marker` | 6 |
| `shore-edge-tile` | 13 |
| `slime-liquid-tile` | 5 |
| `stone-special-tile` | 12 |
| `water-tile` | 4 |

## Terrain Role Notes

The mapping identifies draft terrain roles such as:

- grass floor / grass edge
- dirt floor / dirt path
- water open / water floor / puddle
- shore edge / diagonal shore / river edge
- slime liquid / slime edge / slime pad
- stone floor / mossy stone / dark stone
- portal / magic / glowing floor markers
- direction and flag/status markers
- blank/empty placeholder cells

These are semantic discovery labels only. They do not approve runtime tile behavior.

## Evidence Created

Evidence folder:

`assets/academy/evidence/h5-59-topdown-terrain-region-mapping/`

Evidence files:

- `topdown-terrain-bbox-overlay.png`
- `topdown-terrain-numbered-contact-sheet.png`
- `topdown-terrain-region-table-preview.png`
- `topdown-terrain-source-inspection-preview.png`
- `topdown-terrain-category-preview.png`

## Runtime Boundary

H5.59 does not approve:

- cleanup
- derived PNGs
- runtime tilemaps
- collision rules
- pathfinding rules
- water/slime behavior
- portal behavior
- flag/status behavior
- placement data
- Top-Down Slime Quest game wiring

## Non-Goals

- No source PNG modification.
- No cleanup candidate.
- No topdown/walls processing.
- No topdown/objects processing.
- No mixed playfield pack processing.
- No Phaser placement/collision/pathfinding data.
- No runtime/game code changes.

## Human/Product Review Notes

Human review should check:

- whether all 64 grid cells are intentionally represented;
- whether the four blank/empty cells should remain mapped as placeholders;
- whether category names are clear enough for later cleanup and capability-matrix work;
- whether special marker tiles should remain in the terrain lane or later split into a special/status lane.

## Recommended Next Lane

H5.60 — Topdown Terrain Region Human Review

After human review, continue with either terrain cleanup or proceed to walls depending on whether the terrain mapping needs correction.
