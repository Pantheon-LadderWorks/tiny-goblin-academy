# Tiny Goblin Academy — H5.88A2 Level 8 Sticker Book Editor Prototype Addendum

## Purpose

H5.88A2 adds the missed Level 8 Sticker Book Editor prototype to the H5.88A visual tool prototype intake and maturity comparison.

This is a prototype intake and comparison addendum only. It does not build the unified GlyphForge tool suite, wire runtime, modify games, install dependencies, process images, modify PNGs, or reorganize manifests/docs folders.

## Prototype Source

Requested Downloads prototype:

```text
C:\Users\kryst\Downloads\level_8_sticker_book_editor.html
```

The prototype was found and copied into the repo as a preserved reference prototype:

```text
tools/glyphforge/prototypes/level-8-sticker-book-editor-prototype-v0.1.html
```

It is not canonical runtime tooling.

## Why H5.88A Missed It

H5.88A compared three major prototype/tool families:

```text
Flipbook prototypes = animation preview
Sprite Box Annotator = bbox/region creation and annotation
Particle FX Viewer = procedural effect preview and preset experimentation
```

The Level 8 Sticker Book Editor is a fourth family.

```text
Level 8 Sticker Book Editor = scene/sticker placement and layout JSON export
```

This matters because it bridges the asset pantry and future layout/runtime planning without approving runtime placement.

## Context

The prototype was used for One Room Dungeon Platformer / Level 8 layout design.

Its key value is scene composition: placing stickers/entities onto a fixed board and exporting layout JSON.

This makes it directly relevant to:

- scene composition;
- background anchors;
- platformer room layout;
- prop placement planning;
- runtime layout draft export after later approval;
- future Sticker / Picture Book layout mode.

## Inspection Findings

### Purpose

The prototype is a focused level/sticker layout editor for placing simple gameplay entities on an 800x600 board.

### Input Method

The editor uses hardcoded palette buttons for entity/sticker spawning:

```text
player
platform
hazard
exit
```

It does not load pantry manifests or asset registry records.

### Background / Board Behavior

The prototype uses a fixed 800x600 level board. A general background image loader was not discovered.

### Sticker / Asset Placement Behavior

The prototype supports:

- button-spawned stickers/entities;
- center spawning;
- drag placement;
- board-bound constraints;
- optional 32px snap grid;
- selected entity highlighting;
- Delete/Backspace removal;
- direct DOM update during dragging;
- live JSON refresh while dragging.

### Transform Controls

Discovered controls:

```text
drag/drop: yes
snap: yes
delete: yes
reset/clear: yes
copy JSON: yes
scale: no
rotate: no
layering: no
import: no
```

### Export Format

The prototype exports live JSON into a textarea and provides a Copy button.

The JSON shape is an object grouped for Phaser-style injection:

```json
{
  "player": { "x": 0, "y": 0, "w": 64, "h": 64 },
  "exit": { "x": 0, "y": 0, "w": 64, "h": 96 },
  "platforms": [
    { "x": 0, "y": 0, "w": 128, "h": 32 }
  ],
  "hazards": [
    { "x": 0, "y": 0, "w": 64, "h": 32 }
  ]
}
```

Coordinates are board pixels.

This is not a canonical schema yet.

## Comparison Update

| Tool family | Best current value | Main limitation | Future GlyphForge role |
|---|---|---|---|
| Flipbook evidence prototypes | Animation playback, FPS, frame stepping, loop/one-shot preview | Hardcoded evidence HTML, not registry-fed | Flipbook Viewer playback behavior |
| Sprite Box Annotator | Manual bbox/region creation and annotation | No manifest registry integration yet | Sticker/Picture Book region/asset browser mode |
| Level 8 Sticker Book Editor | Scene composition, sticker/entity placement, layout JSON export | Hardcoded entity types and 800x600 board; no asset/background loader | Sticker/Picture Book scene composition/layout mode |
| Particle FX Viewer | Procedural FX preview and particle recipe experimentation | Separate from sprite cleanup and registry model | Particle FX preset authoring surface |

## Two Sticker / Picture Book Modes

H5.88A2 strengthens the Sticker / Picture Book direction by splitting it into two related modes:

1. **Region / asset browser mode**
   - Informed by Sprite Box Annotator and pantry manifests.
   - Answers: `what is the box around this asset?`

2. **Scene composition / layout editor mode**
   - Informed by the Level 8 Sticker Book Editor and scene-anchor manifests.
   - Answers: `where does this asset/entity go in the scene?`

Both modes should be rebuilt through future GlyphForge lanes.

Neither prototype is promoted to canonical implementation in H5.88A2.

## Useful Pieces to Preserve

- palette-driven placement flow;
- draggable stickers/entities;
- snap-grid placement;
- board-bound constraints;
- selected entity highlighting;
- Delete/Backspace removal;
- clear/reset workflow;
- live JSON export;
- Copy button handoff;
- simple grouped layout output.

## Pieces That Need Rebuilding

- hardcoded entity types should become registry-fed assets or palette groups;
- fixed board size should become background/scene metadata driven;
- layout JSON should get a real schema and manifest linkage;
- prior JSON import should be added;
- scale/rotate/layering controls should be considered;
- runtime/status/review boundary display must be visible;
- scene anchors should feed suggested placement/risk zones;
- export should be planning-only until a runtime lane approves it.

## Runtime and Asset Safety Boundaries

H5.88A2 does not approve:

- runtime placement;
- game wiring;
- scene loading;
- collision;
- platform behavior;
- hazard behavior;
- exit behavior;
- player spawn behavior;
- asset replacement;
- canonical layout schema.

The copied HTML is a preserved reference prototype only.

It does not replace the pantry/manifest registry model.

## Files Intentionally Updated

```text
CHANGELOG.md
docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md
docs/assets/TINY_GOBLIN_ACADEMY_H5_88A2_LEVEL_8_STICKER_BOOK_EDITOR_PROTOTYPE_ADDENDUM.md
manifests/academy.visual-tool-prototype-intake-comparison.json
tools/glyphforge/prototypes/README.md
tools/glyphforge/prototypes/level-8-sticker-book-editor-prototype-v0.1.html
```

## Recommended Next Lane

```text
H5.88B — GlyphForge Unified Viewer Shell Design
```

Tiny rule:

```text
Sprite Box Annotator finds the box. Sticker Book Editor places the thing.
```
