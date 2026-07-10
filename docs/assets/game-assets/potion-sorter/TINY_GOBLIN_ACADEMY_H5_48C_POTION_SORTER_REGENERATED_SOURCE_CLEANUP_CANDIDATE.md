# Tiny Goblin Academy — H5.48C Potion Sorter Regenerated Source Cleanup Candidate

## 1. Purpose

H5.48C ingests a Mega-regenerated Potion Sorter source image as a new v0.2 source artifact and regenerates the draft cleanup candidate from that cleaner source.

This pass exists because the original Potion Sorter source used a strong baked checkerboard/fake-transparent background that made cleanup fragile. The regenerated source is visually cleaner and easier to process, but it is still RGB/opaque with a pale baked checkerboard. H5.48C therefore keeps the same derived-cleanup boundary: source preserved, derived transparency candidate generated, runtime still unapproved.

## 2. Source Intake Finding

New source artifact:

```text
assets/academy/games/potion-sorter/tga-potion-sorter-sheet-regenerated-v0.2.png
```

Original external intake path:

```text
C:\Users\kryst\Downloads\ChatGPT Image Jul 6, 2026, 04_07_45 PM.png
```

Source metadata:

```text
dimensions: 1698x926
mode: RGB
alpha: none detected
finding: visually cleaner regenerated sheet, but still fake-checkerboard / not true transparency
```

The prior v0.1 source remains preserved. H5.48C adds v0.2 as a new source artifact instead of overwriting the old source PNG.

## 3. Relationship To H5.46-H5.48B

H5.46 mapped the Potion Sorter source sheet.

H5.47 accepted the original 32-region semantic map for draft cleanup/planning use.

H5.48 created the first cleanup candidate, which failed human review due to visible baked checkerboard contamination.

H5.48B corrected the v0.1 cleanup candidate and excluded the three explanatory captions.

H5.48C moves the active draft cleanup candidate to the regenerated v0.2 source. It scales the prior 32-region semantic map to the new source dimensions and keeps caption exclusions for:

- alchemy tray;
- sorting bin;
- round-complete chest.

Because the source image changed, the v0.2 mapping and cleanup remain draft / needs-human-review.

## 4. Region Mapping Method

The v0.2 source keeps the same 8x4 visual layout and the same 32 visible asset concepts.

H5.48C remapped the prior 32 Potion Sorter region ids by scaling the H5.48B sourceRects from 1408x768 to 1698x926, then manually tightened the `round-complete` chest sourceRect to remove remaining caption debris.

Current manifest:

```text
manifests/academy.potion-sorter.regions.json
```

Current mapping status:

```text
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
regions: 32
```

## 5. Cleanup Method

Derived cleanup output:

```text
assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png
```

Cleanup manifest:

```text
manifests/academy.potion-sorter.cleanup-candidate.json
```

Cleanup method:

- preserve the regenerated v0.2 source untouched;
- preserve the 1698x926 v0.2 layout in the derived sheet;
- remove pale fake-checkerboard pixels connected to each crop edge;
- remove stricter pale checker flecks only in high-risk glow/smoke/spill/fire/star regions and transparent glass/hourglass-style regions;
- preserve functional-surface candidates as metadata only;
- do not perform functional slot mapping;
- do not introduce gameplay sorting logic or runtime wiring.

## 6. Caption Exclusion Correction

The three explanatory sheet captions are still excluded from the v0.2 cleanup candidate:

```text
potion-sorter.alchemy-tray-labeled
potion-sorter.sorting-bin-labeled
potion-sorter.round-complete-chest-labeled
```

The question mark on the mystery bottle and the `x3` on the star reward remain part of their icons.

## 7. Evidence Created

Evidence folder:

```text
assets/academy/evidence/h5-48c-potion-sorter-regenerated-source-cleanup/
```

Evidence files:

```text
potion-sorter-regenerated-source-inspection-preview.png
potion-sorter-regenerated-cleaned-derived-sheet-preview.png
potion-sorter-regenerated-cleanup-before-after-contact-sheet.png
potion-sorter-regenerated-cleanup-edge-risk-preview.png
potion-sorter-regenerated-cleanup-table-preview.png
potion-sorter-regenerated-functional-surface-cleanup-preview.png
```

Evidence labels record:

- regenerated RGB source;
- fake checker still present in source;
- derived cleanup candidate;
- captions excluded;
- source PNGs preserved;
- not runtime-approved;
- no gameplay sorting logic;
- no functional slot mapping.

## 8. Remaining Cleanup Risk Notes

H5.48C is cleaner than the original checkerboard source lane, but it is still not runtime approval.

Remaining risk areas:

- glow/aura edges;
- sparkles and stars;
- smoke puffs;
- transparent glass interiors;
- spill/liquid edges;
- badge and ribbon edges;
- functional-surface candidates such as sorter slots, alchemy tray, and sorting bin.

These areas should be reviewed visually before promotion.

## 9. Runtime Boundary

H5.48C does not approve runtime Potion Sorter visuals.

The current cleanup candidate remains:

```text
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
```

## 10. Non-Goals

This pass does not:

- overwrite the original v0.1 source;
- approve runtime visuals;
- perform functional slot mapping;
- create gameplay sorting logic;
- wire Potion Sorter runtime;
- process unrelated games/assets;
- run Tauri/Rust/Cargo.

## 11. Recommended Next Step

Recommended next lane:

```text
H5.49 — Potion Sorter Regenerated Cleanup Human Review + Promotion
```

Tiny cleanup law:

```text
The source got prettier.
The source is still not alpha.
The cleaned copy gets reviewed before runtime touches the cauldron.
```
