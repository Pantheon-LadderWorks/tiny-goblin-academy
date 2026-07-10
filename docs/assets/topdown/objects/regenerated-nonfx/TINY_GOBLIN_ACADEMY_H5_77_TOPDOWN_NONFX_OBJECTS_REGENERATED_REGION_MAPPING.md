# Tiny Goblin Academy — H5.77 Topdown Non-FX Objects Regenerated Region Mapping

## Purpose

H5.77 maps the regenerated Topdown Non-FX Objects source sheet as a draft visual inventory.

This is a region mapping lane only. No cleanup was performed and no derived cleanup image was created.

## Selected Source

```text
assets/academy/topdown/objects/tga-topdown-environment-objects-nonfx-regenerated-v0.2.png
```

Source metadata:

- Format / mode: PNG / RGB
- Dimensions: `1254x1254`
- Alpha finding: no alpha channel
- Background finding: fake white/checker-style background, not true alpha

The selected source was ingested during H5.70 and is the regenerated non-FX object lane. The old H5.68/H5.69 object cleanup remains historical/usable for its accepted set, but H5.77 starts the new regenerated non-FX object source lane.

## Mapping Method

The sheet is visually arranged as an 8x8 object pantry, but equal grid cells clipped or overlapped several generated objects. H5.77 therefore uses:

```text
contour-assisted-variable-region-mapping
```

This preserves the actual visible object bounds for review instead of forcing a misleading grid.

## Manifest Created

```text
manifests/academy.topdown.objects.nonfx-regenerated.regions.json
```

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-region-mapping`
- `runtimeEligibility`: `not-runtime-approved`
- `cleanupEligibility`: `cleanup-candidate-after-review`

The manifest records pipeline provenance and links to the H5.77 evidence run log.

## Region Summary

H5.77 maps 64 draft regions.

Category breakdown:

| Category | Count |
| --- | ---: |
| plate-or-marker | 11 |
| decorative-prop | 8 |
| rubble-or-rock | 7 |
| banner-or-sign | 6 |
| tree-or-stump | 4 |
| chest | 3 |
| fence | 3 |
| stone-platform | 3 |
| barrel | 2 |
| bush-or-foliage | 2 |
| crate | 2 |
| flower-or-plant | 2 |
| shield-or-plaque | 2 |
| statue | 2 |
| torch-base | 2 |
| brazier-base | 1 |
| bridge-or-plank | 1 |
| campfire-base | 1 |
| reed-or-water-plant | 1 |
| trap-visual | 1 |

Category names are semantic inventory labels only.

## Evidence Created

```text
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-source-inspection-preview.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-bbox-overlay.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-numbered-contact-sheet.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-region-table-preview.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-category-preview.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/topdown-nonfx-objects-background-or-alpha-preview.png
assets/academy/evidence/h5-77-topdown-nonfx-objects-region-mapping/pipeline-run-log.json
```

## Runtime Boundary

H5.77 does not approve:

- runtime use;
- placement;
- collision;
- interaction;
- pickup, loot, chest, or key behavior;
- trap or damage behavior;
- light, fire, glow, torch, brazier, or campfire behavior;
- portal or teleport behavior;
- game/runtime wiring.

A chest label is not loot/opening behavior. A trap label is not damage behavior. A torch or brazier base is not light behavior. A portal-looking marker is not teleport behavior.

## Non-Goals

H5.77 does not:

- clean the sheet;
- create derived cleanup output;
- modify the source PNG;
- process old H5.63/H5.68 object sources;
- process terrain, walls, or future-floor tilesheets;
- modify game/runtime files.

## Recommended Next Step

```text
H5.78 — Topdown Non-FX Objects Regenerated Region Human Review
```

Cleanup remains a future lane after human review.
