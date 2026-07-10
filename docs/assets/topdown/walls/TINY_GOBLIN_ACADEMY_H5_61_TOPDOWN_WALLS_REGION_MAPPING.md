# Tiny Goblin Academy - H5.61 Topdown Walls Region Mapping

## 1. Purpose

H5.61 maps the Topdown Walls source sheet as a draft region manifest with evidence.

This is source inventory and semantic classification only. It does not clean assets, create derived assets, approve collision/pathfinding, or wire runtime/game behavior.

## 2. Source Path And Metadata

Source path:

`assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png`

Source metadata:

- Dimensions: 1024x1024
- Pixel format: Format24bppRgb
- Alpha channel: none
- Source lane: topdown-walls

## 3. Alpha / Transparency Finding

The source is RGB with no alpha channel.

No true transparency is present. Cleanup is deferred.

## 4. Grid / Layout Decision

H5.61 uses the visible regular 8x8 wall/boundary construction sheet structure.

Each draft region is a 128x128 source cell. This is a source inventory grid, not a runtime tilemap approval and not wall autotiling approval.

## 5. Region Count

Draft manifest created:

`manifests/academy.topdown.walls.regions.json`

Summary:

- Regions mapped: 64
- Status: draft
- Review status: needs-human-review
- Pipeline use: draft-region-mapping
- Runtime eligibility: not-runtime-approved

## 6. Category Breakdown

Category breakdown:

- wall-segment: 8
- wall-corner: 5
- wall-interior-corner: 2
- doorway: 2
- door: 3
- gate: 3
- arch: 3
- ruin-wall: 3
- pillar: 5
- torch: 3
- banner: 3
- fence: 4
- crate: 2
- barrel: 2
- rock: 3
- bush: 2
- decorative-prop: 4
- magic-door-or-seal: 2
- lock-door: 2
- uncertain: 3

## 7. Notable Ambiguity

Categories are provisional until H5.62 human review.

The sheet appears to contain mixed wall/boundary construction pieces, passage candidates, structural props, and decorative props. H5.61 does not claim that every cell is one runtime wall tile.

Door, gate, arch, magic seal, and lock-door regions are passage or blocker candidates only. Behavior is not approved.

## 8. Cleanup Risks

Cleanup risk remains untested and deferred.

Potential cleanup risks include:

- no true alpha source;
- fine wall edges and cracks;
- torch glow or flame detail;
- banner/flag edges;
- door/gate/arch outlines;
- small props such as crates, barrels, rocks, and bushes.

## 9. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-61-topdown-walls-region-mapping/`

Evidence files:

- `topdown-walls-bbox-overlay.png`
- `topdown-walls-numbered-contact-sheet.png`
- `topdown-walls-region-table-preview.png`
- `topdown-walls-source-inspection-preview.png`
- `topdown-walls-category-preview.png`

## 10. Runtime / Collision / Pathfinding Boundary

Runtime boundary retained:

- no collision approval;
- no pathfinding approval;
- no door behavior approval;
- no gate behavior approval;
- no wall autotiling approval;
- no placement approval;
- no runtime tilemap use approval;
- no runtime/game wiring approval.

## 11. Non-Goals

H5.61 did not:

- modify source PNGs;
- run cleanup;
- create derived assets;
- change terrain sheet data;
- change topdown objects sheet data;
- process mixed playfield packs;
- wire runtime or game code;
- approve collision/pathfinding/placement.

## 12. Recommended Next Lane

Recommended next lane:

`H5.62 - Topdown Walls Region Human Review`

H5.62 should review the 64 draft regions and correct categories/bounds before cleanup planning begins.
