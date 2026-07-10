# Tiny Goblin Academy — H5.71 Topdown Walls True-Alpha Region Mapping

## Purpose

H5.71 maps the regenerated true-alpha topdown wall source:

```text
assets/academy/topdown/walls/tga-topdown-walls-horizontal-true-alpha-regenerated-v0.2.png
```

This is a region mapping lane only. The source already has real alpha, so no fake-background cleanup was performed.

## Source Metadata

```text
Dimensions: 1536x1024
Format: PNG
Mode: RGBA
Alpha range: 0-255
Transparent pixels: 892779
Non-opaque pixels: 1255659
```

## Mapping Method

The sheet is not an 8x8 grid sheet. H5.71 uses alpha-assisted variable-region mapping:

```text
alpha-visible pixels
→ controlled component grouping
→ variable-size sourceRect candidates
→ draft semantic labels/categories
→ human-review evidence
```

This pass mapped 58 draft wall/pantry regions. SourceRects are drawn around visible alpha content with small review padding.

## Category Breakdown

```text
wall-horizontal: 11
wall-ruin: 12
rubble: 8
wall-corner: 4
wall-arch: 4
fence: 4
wall-vertical: 3
pillar: 3
column: 2
rock: 2
bush: 2
door: 2
uncertain: 1
```

Categories are draft planning labels only. A door label is not door behavior. A wall label is not collision behavior. A gate/wall/door/pillar/rubble label does not approve placement, blocking, pathfinding, interaction, or runtime use.

## Evidence Created

```text
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-source-inspection-preview.png
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-bbox-overlay.png
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-numbered-contact-sheet.png
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-region-table-preview.png
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-category-preview.png
assets/academy/evidence/h5-71-topdown-walls-true-alpha-region-mapping/topdown-walls-true-alpha-alpha-mask-preview.png
```

The alpha mask preview proves this is true-alpha mapping, not fake-background cleanup.

## Relationship To Prior Wall Work

H5.71 supersedes the old wall cleanup direction for this regenerated true-alpha source. It does not delete, rewrite, or invalidate the prior H5.61/H5.62 reviewed old-wall mapping history.

The white-background vertical wall supplement remains a separate later lane:

```text
map first
then cleanup candidate
```

## Non-Goals

H5.71 does not:

- clean this sheet;
- create a derived cleanup image;
- modify the source PNG;
- approve runtime assets;
- approve collision;
- approve wall placement;
- approve door behavior;
- approve gate behavior;
- approve lock behavior;
- approve wall autotiling;
- approve pathfinding;
- approve tilemap use;
- modify game/runtime files.

## Human/Product Review Notes

The evidence should be reviewed for:

- missing wall pieces;
- accidentally merged neighboring pieces;
- over-tight or over-loose sourceRects;
- draft label/category corrections;
- whether the uncertain lock marker should remain in this source or be routed elsewhere.

## Recommended Next Lane

H5.72 — Topdown Walls True-Alpha Region Human Review.

After that:

```text
H5.73 — Topdown Vertical Walls Cleanup Source Region Mapping
H5.74 — Topdown Vertical Walls Cleanup Candidate
H5.75 — New Non-FX Object Sheet Region Mapping
```

Tiny rule:

```text
The true-alpha sheet gets mapped, not scrubbed.
```
