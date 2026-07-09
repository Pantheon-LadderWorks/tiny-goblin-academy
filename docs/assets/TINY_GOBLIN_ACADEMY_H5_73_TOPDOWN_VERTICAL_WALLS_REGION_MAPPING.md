# Tiny Goblin Academy — H5.73 Topdown Vertical Walls Region Mapping

## Purpose

H5.73 maps the regenerated vertical topdown wall supplement as a draft visual inventory source. This pass creates sourceRects and evidence only.

The source is intended as a cleanup-source candidate after human review, not as a runtime atlas.

## Source

```text
assets/academy/topdown/walls/tga-topdown-walls-vertical-cleanup-source-regenerated-v0.2.png
```

Source metadata:

- Dimensions: `1448x1086`
- Format / mode: PNG / RGB
- Alpha finding: no alpha channel; treated as fully opaque
- Transparency finding: white/checker-style fake transparency is baked into the source

## Mapping Method

H5.73 uses contour-assisted variable-region mapping because this sheet is not a regular 8x8 grid. The foreground mask was used only to identify likely visible asset bounds and generate evidence.

This pass does not perform transparency cleanup and does not approve the foreground mask as a cleanup result.

## Manifest Created

```text
manifests/academy.topdown.walls.vertical.regions.json
```

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-region-mapping`
- `runtimeEligibility`: `not-runtime-approved`
- `cleanupEligibility`: `cleanup-candidate-after-review`

The manifest records `pipelineRun` provenance and links to the H5.73 run log.

## Region Summary

H5.73 maps 72 draft regions.

Category breakdown:

| Category | Count |
| --- | ---: |
| wall-corner | 27 |
| wall-ruin | 15 |
| wall-vertical | 11 |
| wall-column | 7 |
| door | 5 |
| rubble | 5 |
| wall-arch | 2 |

Category labels are visual inventory labels only. A door is not door behavior. A wall is not collision. Rubble is not placement or blocking logic.

## Evidence Created

```text
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-source-inspection-preview.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-background-mask-preview.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-bbox-overlay.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-category-preview.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-numbered-contact-sheet.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/topdown-vertical-walls-region-table-preview.png
assets/academy/evidence/h5-73-topdown-vertical-walls-region-mapping/pipeline-run-log.json
```

Evidence labels state that this is draft mapping only, with no cleanup and no runtime, collision, placement, or pathfinding approval.

## Cleanup Readiness Notes

This source is a better cleanup candidate than glow/fire/smoke FX sheets because the assets are mostly hard-edged stone, moss, doors, columns, and rubble. It still requires human review before cleanup because the source is RGB/fake-background, not true alpha.

H5.73 does not create a derived cleaned sheet.

## Non-Goals

H5.73 does not:

- modify the source PNG;
- create cleanup candidates;
- create derived transparent PNGs;
- approve runtime wall assets;
- approve collision, pathfinding, wall autotiling, tilemap use, placement, or door/gate behavior;
- change Top-Down Slime Quest or Dungeon Key Run code;
- wire any game/runtime visuals.

## Recommended Next Step

Recommended next lane:

```text
H5.74 — Topdown Vertical Walls Cleanup Candidate
```

Human review should confirm the 72 region bounds before cleanup school starts.
