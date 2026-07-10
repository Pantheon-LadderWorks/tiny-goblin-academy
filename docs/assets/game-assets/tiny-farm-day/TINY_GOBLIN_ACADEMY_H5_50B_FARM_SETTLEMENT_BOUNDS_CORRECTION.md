# Tiny Goblin Academy — H5.50B Farm Settlement Bounds Correction

## 1. Purpose

H5.50B corrects a small set of Farm Settlement sourceRects after human review of the H5.50 bbox overlay.

This is a bounds correction pass only. It does not create cleanup output, modify the source PNG, approve runtime visuals, perform functional slot mapping, define settlement gameplay, or wire Farm Settlement assets into runtime.

## 2. Human Review Finding

Human review initially flagged eight regions:

```text
1, 2, 3, 4, 10, 17, 19, 20
```

The issue was horizontal bounds only:

- regions 1, 2, 3, and 4 touched or clipped the right edge of the plot art;
- region 10 needed right-side padding around the log bundle;
- region 17 needed right-side padding so the tent pin/edge was not clipped;
- region 19 needed right-side padding because the large farmhouse extended into the next cell;
- region 20 had too much left-side padding and was capturing bleed from region 19.

Follow-up review also tuned:

```text
18, 21
```

Region 18 was adjusted because the 17/18 shared boundary needed to move right. Region 21 was adjusted because it was capturing bleed from region 20. No vertical padding changes were requested or applied.

## 3. Correction Method

The existing Farm Settlement manifest was updated in place:

```text
manifests/academy.farm-settlement.regions.json
```

Corrected sourceRects:

```text
1  farm-settlement.soil-plot-empty          x=6,   y=67,  w=182, h=108
2  farm-settlement.soil-plot-seeded         x=194, y=67,  w=170, h=108
3  farm-settlement.soil-plot-sprout         x=370, y=51,  w=170, h=124
4  farm-settlement.soil-plot-watered-sprout x=546, y=36,  w=170, h=139
10 farm-settlement.wood-log-bundle          x=194, y=223, w=170, h=139
17 farm-settlement.tent                     x=6,   y=415, w=178, h=159
18 farm-settlement.small-farmhouse          x=184, y=401, w=168, h=174
19 farm-settlement.large-farmhouse          x=360, y=389, w=188, h=187
20 farm-settlement.wood-shed                x=568, y=397, w=172, h=175
21 farm-settlement.campfire                 x=740, y=400, w=140, h=176
```

Region 20 was shifted right to remove neighboring-house bleed from region 19, then extended right until it meets the region 21 boundary. Region 21 was shifted right to stop capturing bleed from region 20.

## 4. Evidence Regenerated

Regenerated evidence folder:

```text
assets/academy/evidence/h5-50-farm-settlement-region-mapping/
```

Regenerated evidence:

```text
farm-settlement-bbox-overlay.png
farm-settlement-numbered-contact-sheet.png
farm-settlement-region-table-preview.png
```

The source inspection preview remains valid and unchanged.

## 5. Runtime Boundary

The Farm Settlement manifest remains:

```text
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
```

## 6. Non-Goals

H5.50B does not:

- modify the source PNG;
- create cleanup output;
- perform functional slot mapping;
- create settlement gameplay logic;
- wire runtime visuals;
- change unrelated regions;
- run Tauri/Rust/Cargo.

## 7. Recommended Next Lane

Recommended next lane:

```text
H5.51 — Farm Settlement Region Human Review
```

Tiny correction law:

```text
The crops did not need taller boxes.
They needed room to breathe to the right.
The shed stopped stealing the house.
The campfire stopped stealing the shed.
```
