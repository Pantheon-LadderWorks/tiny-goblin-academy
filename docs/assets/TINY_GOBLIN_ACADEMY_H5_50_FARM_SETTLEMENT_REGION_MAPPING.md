# Tiny Goblin Academy — H5.50 Farm Settlement Region Mapping

## 1. Purpose

H5.50 begins the Farm Settlement game-specific asset lane with draft region mapping and review evidence.

This is a mapping pass only. It does not create cleanup output, approve runtime visuals, perform functional slot mapping, define settlement gameplay, or wire Farm Settlement assets into runtime.

## 2. Source Inspection

Source sheet:

```text
assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png
```

Source metadata:

```text
dimensions: 1408x768
mode: RGBA
alpha extrema: 255/255
finding: RGBA but fully opaque; checkerboard-style background is baked/fake transparency
```

Lane classification:

```text
standard static prop/icon sheet
4 rows x 8 visual layout
32 visible regions
```

The sheet contains crop states, farm resources, tools, buildings, terrain props, weather/status icons, and worker/animal symbols.

## 3. Mapping Method

Regions were mapped from visible asset bounds inside the apparent 4x8 layout.

Mapping rules:

- preserve the source PNG untouched;
- map each visible asset separately;
- do not create cleanup output;
- do not assign runtime approval;
- mark the fake-transparency condition for later cleanup review;
- preserve baked symbols such as the map marks, red X, green check, shield, and banner iconography as part of their assets;
- treat the smiling sun and crescent moon as separate icons, not a grouped region.

## 4. Region / Category Breakdown

Manifest:

```text
manifests/academy.farm-settlement.regions.json
```

Region count:

```text
32
```

Category breakdown:

```text
animal-or-creature: 3
building: 6
crop: 5
crop-plot: 2
fx-icon: 1
resource-icon: 2
resource-prop: 4
status-icon: 5
terrain-prop: 1
tool: 1
ui-token: 2
```

## 5. Cleanup-Risk Notes

Risk breakdown:

```text
high: 8
medium-high: 9
medium: 15
```

Higher-risk regions include watered crop states, water/glow icons, campfire, storm/weather icons, small worker symbols, and thin tool/status overlays.

Cleanup should be careful around glow, water, flame, lightning, thin tool edges, small worker limbs, weather icon rays/crescents, and tightly cropped building edges.

## 6. Functional-Surface Notes

No regions are promoted as functional-surface candidates in this pass.

Some future runtime features may use buildings, slots, or status markers as interactive concepts, but H5.50 does not define slots, drop zones, UI surfaces, or gameplay behavior.

## 7. Evidence Files

Evidence folder:

```text
assets/academy/evidence/h5-50-farm-settlement-region-mapping/
```

Evidence created:

```text
farm-settlement-bbox-overlay.png
farm-settlement-numbered-contact-sheet.png
farm-settlement-region-table-preview.png
farm-settlement-source-inspection-preview.png
```

Evidence labels state draft region mapping, fake transparency source, source PNG untouched, no cleanup, and no runtime/game wiring.

## 8. Non-Goals

H5.50 does not:

- modify the source PNG;
- create a derived cleanup candidate;
- perform functional slot mapping;
- create settlement gameplay logic;
- wire Farm Settlement runtime visuals;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri/Rust/Cargo.

## 9. Validation

Validation expectations:

- manifest JSON parses;
- status is `draft`;
- reviewStatus is `needs-human-review`;
- runtimeEligibility is `not-runtime-approved`;
- all 32 regions have sourceRects;
- all sourceRects are inside the 1408x768 source dimensions;
- no cleanup output is created;
- no game code is changed.

## 10. Recommended Next Lane

## H5.50B Correction Status

Human review found that regions 1, 2, 3, 4, 10, 17, 19, and 20 needed horizontal bounds correction. H5.50B updated those sourceRects, regenerated the bbox/contact/table evidence, and left the manifest draft / needs-human-review / not-runtime-approved.

Correction report:

```text
docs/assets/TINY_GOBLIN_ACADEMY_H5_50B_FARM_SETTLEMENT_BOUNDS_CORRECTION.md
```

Recommended next lane:

```text
H5.51 — Farm Settlement Region Human Review
```

Tiny farm law:

```text
The crops are mapped.
The buildings are named.
The fake checkerboard is documented.
Runtime still waits by the fence.
```
