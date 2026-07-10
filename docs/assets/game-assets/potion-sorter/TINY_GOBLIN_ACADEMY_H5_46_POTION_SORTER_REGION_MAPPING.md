# Tiny Goblin Academy — H5.46 Potion Sorter Region Mapping

## 1. Purpose

H5.46 maps the Potion Sorter source sheet into draft-review regions.

H5.46 maps Potion Sorter source-sheet regions for draft review only. Mapped regions are not runtime-approved assets. This pass does not perform cleanup, create derived assets, define gameplay sorting logic, approve functional UI slots, or wire Potion Sorter visuals into runtime.

## 2. Source Sheet

Actual source path:

```text
assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png
```

This was the only source sheet found in:

```text
assets/academy/games/potion-sorter/
```

## 3. Source Inspection

Source metadata:

```text
dimensions: 1408x768
mode: RGBA
alpha: present but fully opaque
alpha extrema: 255/255
```

Transparency finding:

```text
The sheet is RGBA, but all alpha values are opaque. The checkerboard-style background is baked/fake transparency and must not be treated as real alpha.
```

The sheet contains:

- potion bottles / vials / flasks;
- cork and spill props;
- sorter slots and tray/bin surfaces;
- status/reward icons;
- baked text labels on some tray/bin/reward assets;
- glow, smoke, sparkle, liquid, glass, and fire edges that need cleanup caution later.

## 4. Mapping Method

Regions were mapped by visible semantic asset, not by raw grid cell.

Mapping rules used:

- split distinct visible potion bottles/items individually;
- group only when visually inseparable;
- include attached baked text labels when they are visually part of the source asset;
- mark sorter slots as possible future functional-surface candidates;
- mark fragile effects, liquid edges, glass edges, and baked text as cleanup-risk notes;
- do not approve runtime use.

## 5. Region Results

Draft manifest:

```text
manifests/academy.potion-sorter.regions.json
```

Region count:

```text
32
```

Category breakdown:

```text
potion-bottle: 10
status-icon: 7
sorter-slot: 6
ui-token: 2
background-prop: 1
cork: 1
flask: 1
fx-icon: 1
potion-liquid: 1
sorter-token: 1
vial: 1
```

Functional-surface candidates:

```text
6
```

These are planning notes only. No functional slot mapping was performed.

## 6. Cleanup / Transparency Findings

Cleanup was not performed in H5.46.

Future cleanup should treat this sheet as fake-transparent despite its RGBA mode. The source alpha is fully opaque, so a later cleanup candidate should remove the baked checkerboard from derived copies only.

High-risk cleanup areas:

- glowing green potion aura;
- bubbling smoke potion;
- broken/spilled potion and spill puddle;
- gold sparkle potion;
- cracked/shaking purple potion;
- success/failure icons with sparkles or smoke;
- fire icon;
- star x3 reward with baked multiplier text;
- badge/ribbon edges.

## 7. Functional Surface Candidate Notes

The four colored sorter slots plus the labeled alchemy tray and sorting bin are marked as possible future functional-surface candidates.

These candidates may later need internal slot mapping for:

- accepted/rejected potion placement;
- item drop zones;
- sorting bins;
- tray contents;
- label/text strategy.

H5.46 does not define those slots.

## 8. Evidence Created

Evidence folder:

```text
assets/academy/evidence/h5-46-potion-sorter-region-mapping/
```

Evidence files:

```text
potion-sorter-bbox-overlay.png
potion-sorter-numbered-contact-sheet.png
potion-sorter-region-table-preview.png
potion-sorter-source-inspection-preview.png
```

Evidence labels state:

```text
draft region mapping
source PNG untouched
no cleanup
not runtime-approved
no game wiring
```

## 9. Non-Goals

This pass does not:

- modify source PNGs;
- run cleanup;
- create derived cleaned assets;
- create runtime Potion Sorter code;
- wire visuals into the game;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri/Rust/Cargo.

## 10. Human/Product Review Notes

Human review should check:

- whether all visually distinct potion/items are mapped separately;
- whether any labels should be split from their associated prop before cleanup;
- whether sorter-slot regions have enough padding;
- whether high-risk glow/smoke/sparkle/liquid/fire edges are correctly flagged;
- whether any category labels should be corrected before cleanup.

## 11. Recommended Next Step

Recommended next lane:

```text
H5.47 — Potion Sorter Region Human Review
```

Tiny routing law:

```text
Potion goblins are now on the conveyor belt.
No cleanup cauldron yet.
```
