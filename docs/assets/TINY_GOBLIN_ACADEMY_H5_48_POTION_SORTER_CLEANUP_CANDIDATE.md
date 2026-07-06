# Tiny Goblin Academy — H5.48 Potion Sorter Cleanup Candidate

## 1. Purpose

H5.48 creates a derived transparent cleanup candidate for the reviewed Potion Sorter regions.

H5.48 creates a derived transparent cleanup candidate for the reviewed Potion Sorter regions. The cleaned candidate remains draft-review only and is not runtime-approved. Functional-surface candidate flags remain planning metadata only; H5.48 does not perform functional slot mapping, define gameplay sorting logic, approve runtime placement, or wire Potion Sorter visuals into runtime.

## 2. Source Inputs

Source sheet:

```text
assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png
```

Reviewed region manifest:

```text
manifests/academy.potion-sorter.regions.json
```

Source metadata:

```text
dimensions: 1408x768
mode: RGBA
alpha: present but fully opaque
alpha extrema: 255/255
finding: baked checkerboard/fake transparency
```

## 3. Relationship To H5.46-H5.47

H5.46 created the Potion Sorter draft region mapping.

H5.47 accepted the 32 mapped Potion Sorter regions for draft cleanup and planning use. H5.48 uses that reviewed mapping as its source of truth.

## 4. Cleanup Method

H5.48 preserves the original 1408x768 sheet layout in a derived RGBA PNG.

Cleanup method:

- source PNG remains untouched;
- each reviewed sourceRect is cleaned into a derived copy;
- edge-connected strict-neutral checker/grid pixels are removed for all regions;
- strict-neutral interior checker pixels are also removed for glass, liquid, potion, vial, flask, and hourglass-style regions;
- high-risk glow/smoke/spill/sparkle regions receive a broadened neutral checker cleanup to reduce obvious gray checker contamination;
- labels, sorter surfaces, and baked text are preserved as source content;
- all risk flags remain review metadata.

## 5. Derived Outputs

Derived cleaned sheet:

```text
assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-v0.1.png
```

Cleanup manifest:

```text
manifests/academy.potion-sorter.cleanup-candidate.json
```

## 6. Cleanup Results

```text
regions processed: 32
functional-surface candidates preserved as metadata: 6
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
```

Risk summary:

```text
high: 11
medium-high: 10
medium: 11
```

## 7. Edge Risk Findings

High-risk regions remain human-review targets:

- broken/spilled purple potion;
- glowing green potion;
- bubbling smoke potion;
- spilled green flask;
- gold sparkle potion;
- cracked purple potion;
- success check sparkle;
- failure X smoke;
- blue fire icon;
- star x3 reward;
- cracked potion fail badge.

Review should focus on glow, smoke, spill, liquid, fire, sparkle, glass, baked label, and badge edges. Slight cleanup uncertainty in those areas is recorded as risk metadata rather than silently promoted.

## 8. Functional Surface Candidate Boundary

The 6 functional-surface candidates are preserved as planning metadata only.

H5.48 does not:

- define functional slots;
- approve sorter/drop behavior;
- approve runtime placement;
- create gameplay sorting logic;
- wire Potion Sorter visuals into runtime.

## 9. Evidence Created

Evidence folder:

```text
assets/academy/evidence/h5-48-potion-sorter-cleanup/
```

Evidence files:

```text
potion-sorter-cleanup-before-after-contact-sheet.png
potion-sorter-cleaned-derived-sheet-preview.png
potion-sorter-cleanup-edge-risk-preview.png
potion-sorter-cleanup-table-preview.png
potion-sorter-functional-surface-cleanup-preview.png
```

Evidence labels state:

```text
draft cleanup candidate
source PNG untouched
not runtime-approved
no functional slot mapping
no gameplay sorting logic
no game wiring
```

## 10. Non-Goals

This pass does not:

- modify the source PNG;
- alter H5.46 evidence;
- perform functional slot mapping;
- create gameplay sorting logic;
- approve runtime Potion Sorter visuals;
- wire Potion Sorter runtime;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri/Rust/Cargo.

## 11. Human/Product Review Notes

Human review should check:

- whether transparent glass interiors are acceptable;
- whether glow/smoke/sparkle edges look acceptable after conservative cleanup;
- whether baked labels remain readable;
- whether sorter-slot surfaces preserved borders, fills, and shadows;
- whether any high-risk FX region needs correction, regeneration, or deferred status.

## 12. Recommended Next Step

Recommended next lane:

```text
H5.49 — Potion Sorter Cleanup Human Review + Promotion
```

Tiny cleanup law:

```text
Potion regions passed review.
The fake checkerboard swamp is now removed from a copy.
Runtime still waits.
```
