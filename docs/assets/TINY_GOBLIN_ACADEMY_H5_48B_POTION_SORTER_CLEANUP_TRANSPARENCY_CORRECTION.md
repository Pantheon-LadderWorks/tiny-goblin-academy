# Tiny Goblin Academy — H5.48B Potion Sorter Cleanup Transparency Correction

## 1. Purpose

H5.48B corrects the Potion Sorter cleanup candidate because the first H5.48 derived sheet retained visible baked checkerboard/background contamination.

H5.48B corrects the Potion Sorter cleanup candidate because the first H5.48 derived sheet retained visible baked checkerboard/background contamination. This pass regenerates the draft cleanup candidate and excludes explanatory sheet captions from asset regions. It does not approve runtime visuals, gameplay sorting logic, functional slot mapping, or Potion Sorter wiring.

## 2. Human Review Finding

Human review rejected the first H5.48 cleanup candidate as a promotion candidate.

Correction reasons:

- visible baked checkerboard/background chunks remained around and inside multiple cleaned assets;
- the explanatory captions under `alchemy tray`, `sorting bin`, and `round-complete` were included in cleanup regions even though they are sheet labels, not asset content.

The correct H5.48 status is therefore:

```text
H5.48 Human Review: Correction Required
H5.48B status: regenerated draft cleanup candidate for review
```

## 3. Correction Method

H5.48B regenerated the derived cleanup sheet with asset-type-specific cleanup instead of a single aggressive rule.

Correction method:

- preserve the source PNG untouched;
- preserve the original 1408x768 derived layout;
- use conservative strict edge cleanup for solid surfaces, labels, badges, and functional-surface candidates;
- use broadened neutral checker cleanup only for glow, smoke, spill, sparkle, and fire-style problem regions;
- use strict interior cleanup only for empty glass and hourglass-style transparent-looking regions;
- retain risk flags for human review rather than silently promoting fragile edges.

This avoided the over-cleaning failure mode where sorter surfaces, trays, and labels can be damaged by a broad checkerboard key.

## 4. Caption Exclusion Correction

Three corrected sourceRects now exclude explanatory sheet captions:

```text
potion-sorter.alchemy-tray-labeled
  sourceRect: x=880, y=400, w=175, h=140

potion-sorter.sorting-bin-labeled
  sourceRect: x=1055, y=405, w=175, h=130

potion-sorter.round-complete-chest-labeled
  sourceRect: x=1230, y=400, w=170, h=150
```

The words `alchemy tray`, `sorting bin`, and `round-complete` are excluded from the corrected cleanup output.

Important retained text:

- the mystery bottle question mark remains part of the icon;
- the `x3` on the star reward remains part of the icon;
- active text or iconography baked inside an asset remains part of that asset unless a later review separates it.

## 5. Regenerated Derived Sheet

Regenerated derived cleanup candidate:

```text
assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-v0.1.png
```

Cleanup manifest:

```text
manifests/academy.potion-sorter.cleanup-candidate.json
```

Current cleanup candidate status:

```text
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
regions: 32
```

The region count remains 32. This correction changes cleanup quality and the three caption-exclusion sourceRects; it does not add or remove Potion Sorter assets.

## 6. Remaining Cleanup Risk Notes

The regenerated candidate is still a draft cleanup candidate and still needs human review.

Remaining risk areas:

- glow halos;
- smoke edges;
- spill and liquid edges;
- transparent glass interiors;
- fire and sparkle edges;
- tiny badge details;
- baked label/readability edges;
- functional-surface candidates such as sorter slots, alchemy tray, and sorting bin.

These are review risks, not runtime approval.

## 7. Evidence Regenerated

Evidence folder:

```text
assets/academy/evidence/h5-48-potion-sorter-cleanup/
```

Regenerated evidence files:

```text
potion-sorter-cleaned-derived-sheet-preview.png
potion-sorter-cleanup-before-after-contact-sheet.png
potion-sorter-cleanup-edge-risk-preview.png
potion-sorter-cleanup-table-preview.png
potion-sorter-functional-surface-cleanup-preview.png
```

Evidence labels record:

- H5.48B transparency correction;
- draft cleanup candidate;
- visible checkerboard cleanup correction;
- explanatory captions excluded;
- source PNG untouched;
- not runtime-approved;
- no gameplay sorting logic;
- no functional slot mapping.

## 8. Runtime Boundary

H5.48B does not approve runtime Potion Sorter visuals.

The cleanup candidate remains a draft pipeline artifact for human review.

## 9. Non-Goals

This pass does not:

- modify the source PNG;
- promote the cleanup candidate;
- approve runtime visuals;
- perform functional slot mapping;
- create gameplay sorting logic;
- wire Potion Sorter runtime;
- process unrelated games/assets;
- touch Shared FX;
- process Top-Down Slime Quest;
- run Tauri/Rust/Cargo.

## 10. Recommended Next Step

Recommended next lane:

```text
H5.49 — Potion Sorter Cleanup Human Review + Promotion
```

Tiny correction law:

```text
The subtitle crime is fixed.
The checkerboard swamp is mostly drained.
Runtime still waits outside the potion shop.
```
