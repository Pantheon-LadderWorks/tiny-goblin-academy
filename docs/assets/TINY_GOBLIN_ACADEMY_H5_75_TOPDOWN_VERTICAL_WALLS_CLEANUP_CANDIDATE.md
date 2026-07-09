# Tiny Goblin Academy — H5.75 Topdown Vertical Walls Cleanup Candidate

## Purpose

H5.75 creates a draft cleanup candidate for the reviewed Topdown Vertical Walls source sheet.

This is cleanup candidate generation only. It is not human approval, runtime approval, gameplay approval, collision approval, placement approval, or tilemap approval.

## Baseline

H5.74 remains the accepted mapping baseline:

```text
f36e2e4 docs: review topdown vertical wall regions
```

Reviewed source-region manifest:

```text
manifests/academy.topdown.walls.vertical.regions.json
```

H5.74 accepted 72 contour-assisted variable-size regions for draft cleanup and planning use.

## Source

```text
assets/academy/topdown/walls/tga-topdown-walls-vertical-cleanup-source-regenerated-v0.2.png
```

Source finding:

- PNG / RGB
- Dimensions: `1448x1086`
- No alpha channel
- RGB/fake-background cleanup source, not true alpha

The source PNG was not modified.

## Canonical Pipeline Method

H5.75 used the canonical asset pipeline CLI:

```text
scripts/asset-pipeline/cli.mjs cleanup-candidate
```

Registered cleanup method:

```text
edge-connected-checker-cleanup
```

Method status:

```text
canonical-with-caution
```

This lane also matured the canonical method with lane-neutral threshold flags so bright low-saturation fake backgrounds can be tuned through the CLI instead of one-off scripts. The run log records the H5.75 parameter set.

Effective H5.75 parameters:

```json
{
  "gray_sat_max": 0.12,
  "gray_min": 0.84,
  "gray_max": 1.01,
  "channel_delta_max": 0.06,
  "edge_alpha": 160
}
```

The cleanup worked per reviewed sourceRect and removed only edge-connected background-like pixels. It did not perform global color replacement.

## Derived Output

```text
assets/academy/topdown/walls/derived/tga-topdown-vertical-walls-cleaned-v0.1.png
```

Output SHA-256 is recorded in the cleanup manifest.

## Cleanup Manifest

```text
manifests/academy.topdown.walls.vertical.cleanup-candidate.json
```

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-cleanup-candidate`
- `runtimeEligibility`: `not-runtime-approved`

Region summary:

- Cleanup regions: 72
- Excluded regions: 0
- Behavior-deferred / runtime-danger risk regions: 72

All sourceRects and derivedRects remain tied to the H5.74-reviewed source-region manifest.

## Evidence Created

```text
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-cleaned-derived-sheet-preview.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-cleaned-on-dark-preview.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-before-after-contact-sheet.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-mask-preview.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-mask-overlay.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-cleanup-table-preview.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/topdown-vertical-walls-risk-preview.png
assets/academy/evidence/h5-75-topdown-vertical-walls-cleanup-candidate/pipeline-run-log.json
```

The on-dark preview is the primary human-review surface for residue and edge damage. The mask preview and mask overlay prove this pass used an edge/background mask rather than global color chewing.

## Risk Notes

All categories remain visual-only and behavior-deferred:

- door
- wall-arch
- wall-corner
- wall-column
- wall-vertical
- wall-ruin
- rubble

These category names do not approve runtime use, collision, placement, pathfinding, tilemap use, wall autotiling, door behavior, gate behavior, lock behavior, interaction, obstacle behavior, or game wiring.

## Non-Goals

H5.75 does not:

- modify the source PNG;
- modify game/runtime files;
- modify package or lock files;
- modify H5.73A future floor tilesheet files;
- approve runtime asset use;
- approve collision, placement, pathfinding, tilemap use, or wall autotiling;
- approve door, gate, lock, interaction, obstacle, or gameplay behavior;
- wire Top-Down Slime Quest or Dungeon Key Run visuals.

## Human/Product Review Boundary

The cleanup candidate requires future human/product review before any draft use. Risky regions should be flagged for H5.76 review or exclusion rather than silently accepted.

## Recommended Next Step

```text
H5.76 — Topdown Vertical Walls Cleanup Human Review
```
