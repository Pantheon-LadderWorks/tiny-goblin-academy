# Tiny Goblin Academy — H5.63 Topdown Objects Region Mapping

## Purpose

H5.63 creates a draft region mapping for the Topdown Objects source sheet.

This pass is source intake, grid-cell inventory, semantic object classification, manifest creation, and evidence generation only.

## Source

`assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`

Source metadata:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha finding: no alpha channel
- Transparency finding: checker-style background is baked/fake transparency

## Relationship To H5.58-H5.62

H5.58 routed the topdown pantry as:

1. terrain
2. walls
3. objects

H5.58B human-review-passed that routing. H5.59-H5.60B mapped and reviewed terrain. H5.61-H5.62 mapped and reviewed walls.

H5.63 starts the third primary topdown source lane: objects.

This pass is separate from:

- the mixed Top-Down Slime Quest playfield pack
- topdown terrain
- topdown walls

## Grid Finding

The objects sheet uses a regular visible 8x8 grid.

Measured grid:

- Columns: 8
- Rows: 8
- Cell size: `128x128`
- X edges: `0, 128, 256, 384, 512, 640, 768, 896, 1024`
- Y edges: `0, 128, 256, 384, 512, 640, 768, 896, 1024`

SourceRects follow full grid cells. This is a grid-cell inventory, not a tight visible-bounds crop pass.

## Manifest Created

Created:

`manifests/academy.topdown.objects.regions.json`

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-region-mapping`
- `runtimeEligibility`: `not-runtime-approved`
- region count: `64`

## Category Breakdown

| Category | Count |
| --- | ---: |
| `barrel` | 2 |
| `banner-or-sign` | 5 |
| `blank-empty-cell` | 1 |
| `bridge-or-plank` | 3 |
| `bush-or-foliage` | 4 |
| `campfire` | 2 |
| `chest` | 2 |
| `crate` | 2 |
| `decorative-prop` | 1 |
| `fence` | 4 |
| `fire-or-light` | 4 |
| `flower-or-plant` | 2 |
| `hazard-or-trap` | 3 |
| `key-item` | 1 |
| `pedestal-or-switch` | 2 |
| `plate-or-marker` | 5 |
| `portal-or-seal` | 3 |
| `reed-or-water-plant` | 2 |
| `rubble-or-rock` | 8 |
| `shield-or-crest` | 2 |
| `statue-or-monument` | 2 |
| `tree-or-stump` | 4 |

## Blank Cell Policy

Region 49 is mapped as `blank-empty-cell`.

It is a checkerboard-only placeholder cell and is not a runtime object candidate.

## Behavior Boundary

Category names are visual inventory labels only.

- A chest is not loot behavior.
- A key is not pickup behavior.
- A portal is not teleport behavior.
- A torch or campfire is not light behavior.
- A trap is not damage behavior.
- A switch or plate is not interaction behavior.
- A fence or bridge is not collision or traversal behavior.

Everything in H5.63 remains draft visual inventory.

## Evidence Created

Evidence folder:

`assets/academy/evidence/h5-63-topdown-objects-region-mapping/`

Evidence files:

- `topdown-objects-bbox-overlay.png`
- `topdown-objects-numbered-contact-sheet.png`
- `topdown-objects-region-table-preview.png`
- `topdown-objects-source-inspection-preview.png`
- `topdown-objects-category-preview.png`

## Runtime Boundary

H5.63 does not approve:

- cleanup
- derived assets
- runtime placement
- collision
- interaction behavior
- chest behavior
- key/pickup behavior
- portal behavior
- light behavior
- trap/damage behavior
- terrain changes
- wall changes
- mixed playfield-pack salvage
- game/runtime code

## Non-Goals

- No source PNG modification.
- No cleanup candidate.
- No derived PNGs.
- No topdown terrain processing.
- No topdown wall processing.
- No mixed Top-Down Slime Quest playfield pack processing.
- No Phaser placement, collision, interaction, or runtime data.

## Human/Product Review Notes

Human review should check:

- whether all 64 grid cells are intentionally represented;
- whether region 49 should remain blank;
- whether categories are clear enough for draft cleanup/planning use;
- whether any object category should be renamed before human review promotion.

## Recommended Next Lane

H5.64 — Topdown Objects Region Human Review
