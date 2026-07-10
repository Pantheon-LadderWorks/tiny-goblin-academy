# Tiny Goblin Academy — H5.88A Visual Tool Prototype Intake and Maturity Comparison

## 1. Purpose

H5.88A brings the existing visual tool prototypes together for comparison and maturity analysis.

This lane is not runtime wiring and not the full GlyphForge implementation. It is prototype intake, preservation, comparison, and consolidation planning.

H5.88 answered what tools should exist. H5.88A asks which existing tool goblins are worth stealing parts from before H5.88B designs the unified shell.

## 2. Prototype Sources Inspected

Repo-local flipbook evidence prototypes were discovered under:

```text
assets/academy/evidence/**/**flipbook*.html
```

Found repo-local flipbook evidence prototypes: 8

- assets/academy/evidence/h5-14b-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
- assets/academy/evidence/h5-14c-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
- assets/academy/evidence/h5-14d-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
- assets/academy/evidence/h5-15-goblin-flipbook/platformer-goblin-player-flipbook.html
- assets/academy/evidence/topdown-slime-flipbook/topdown-slime-player-flipbook.html
- assets/academy/evidence/topdown-slime-v2-action/topdown-slime-v2-action-flipbook.html
- assets/academy/evidence/topdown-slime-v2-idle-move/topdown-slime-v2-idle-move-flipbook.html
- assets/academy/evidence/topdown-soldier-flipbook/topdown-soldier-enemy-flipbook.html

Downloads prototypes inspected:

```text
C:/Users/kryst/Downloads/sprite-box-annotator.html
C:/Users/kryst/Downloads/particle_fx_viewer (1).html
```

Both Downloads prototypes existed at inspection time.

## 3. What Was Copied Into Repo

The two user-held Downloads prototypes were copied into the repo as preserved reference prototypes:

```text
tools/glyphforge/prototypes/sprite-box-annotator-prototype-v0.1.html
tools/glyphforge/prototypes/particle-fx-viewer-prototype-v0.1.html
tools/glyphforge/prototypes/README.md
```

These are not canonical runtime tools. They are preserved for comparison and maturation only.

## 4. What Was Not Copied And Why

Repo-local flipbook evidence prototypes were not copied or moved because they already live in evidence folders and remain evidence artifacts. H5.88A inspects them and records findings without changing them.

No evidence HTML files were edited. No evidence images were edited. No runtime/game files were changed.

## 5. Flipbook Prototype Findings

The repo-local flipbook prototypes are the most mature existing surface for animation preview behavior. They use canvas playback, play/pause controls, FPS sliders, action/animation buttons, and frame rectangles from embedded manifest-like data.

Strengths worth preserving:

- canvas frame playback;
- FPS slider;
- play/pause controls;
- animation/action buttons;
- loop and one-shot playback ideas;
- frame-rect driven canvas sizing.

Weaknesses to rebuild:

- hardcoded embedded manifests;
- hardcoded image paths;
- no registry or pantry discovery;
- no external manifest loader;
- review/runtime boundary metadata is not prominent enough in the UI.

Conclusion: preserve playback behavior and rebuild as a registry-fed GlyphForge flipbook viewer.

## 6. Sprite Box Annotator Findings

The Sprite Box Annotator prototype is the strongest manual bbox/region creation and editing seed. It supports local image loading, drag boxes, coordinate fields, add/duplicate/delete actions, snap controls, zoom/fit, labels, status, notes, JSON copy/import, and keyboard interactions.

Strengths worth preserving:

- manual bbox drawing and editing;
- source-image pixel coordinates;
- snap and zoom controls;
- labels and status field;
- notes field;
- JSON copy/import loop;
- simple offline single-file operation.

Weaknesses to rebuild:

- no asset pantry discovery;
- no manifest schema binding;
- no provenance/run-log export;
- no shared runtime boundary banner;
- prototype-local status values are not yet the canonical asset pipeline contract.

Conclusion: preserve as the strongest seed for the future Sticker/Picture Book / region annotator surface.

## 7. Particle FX Viewer Findings

The Particle FX Viewer prototype is the strongest procedural FX preview seed. It provides a canvas surface, effect selector, click/touch casting, active effect/particle counters, recipe-like effect definitions, specialized lightning/rainbow implementations, and a generic emitter pattern.

Strengths worth preserving:

- procedural recipe objects;
- canvas-based FX preview;
- effect selector;
- mouse/touch target casting;
- active effect and particle counters;
- generic emitter architecture;
- specialized lightning/rainbow behaviors.

Weaknesses to rebuild:

- no registry or manifest integration;
- parameter editing is mostly code/recipe-driven rather than a full authoring UI;
- no canonical particle preset export;
- no status/risk/runtime boundary display;
- particle semantics could accidentally imply runtime behavior unless the future UI makes preview-only status obvious.

Conclusion: preserve recipe/emitter ideas and rebuild as a separate Particle FX Viewer / future preset authoring surface.

## 8. Maturity Comparison Table

| Tool family | Maturity | Best current use | Preserve | Rebuild |
| --- | --- | --- | --- | --- |
| Flipbook evidence prototypes | Medium | Animation preview evidence | Playback controls, FPS, action buttons, frame stepping | Registry-fed flipbook viewer with manifest loading and boundary display |
| Sprite Box Annotator | Medium-high standalone / medium-low integrated | Manual bbox and region authoring | Drag boxes, snap, zoom, labels, status, notes, JSON copy/import | Sticker/Picture Book region annotator with pantry and manifest integration |
| Particle FX Viewer | Medium-high preview / low canonical pipeline | Procedural FX experimentation | Recipe objects, effect selector, canvas casting, emitters, counters | Particle preset authoring surface with export and preview-only boundary display |

## 9. Features Worth Preserving

- Flipbook playback loop, FPS slider, action buttons, one-shot/loop distinction, frame-rect canvas sizing.
- Sprite Box Annotator drag/resize boxes, coordinate fields, snap, zoom, labels, status, notes, JSON copy/import.
- Particle FX recipe objects, effect selector, canvas click/touch casting, counters, generic emitter pattern, specialized lightning/rainbow behaviors.
- Offline/local single-file ergonomics as a development and review convenience.

## 10. Features Worth Rebuilding

- Registry and pantry loading.
- Manifest selection and schema-aware display.
- Runtime/review boundary banners.
- Evidence/export output contracts.
- Shared navigation and launcher shell.
- Tool-specific export formats that map back to manifests instead of ad hoc JSON blobs.

## 11. Features That Should Not Be Carried Forward

- Hardcoded evidence paths as canonical app architecture.
- Dependence on Downloads paths.
- Runtime-looking labels without explicit not-runtime-approved boundaries.
- Prototype-local status strings without shared manifest contract.
- Treating copied prototype HTML as production implementation.

## 12. Recommended Unified GlyphForge Visual Tool Suite Architecture

Recommended future structure:

```text
tools/glyphforge/
  README.md
  prototypes/
  registry/
  viewer-shell/
  flipbook-viewer/
  sticker-picture-book-viewer/
  particle-fx-viewer/
  shared/
```

The shared shell should handle registry loading, pantry records, asset selection, review/runtime boundary display, navigation, and export actions. Individual viewers should stay specialized.

Suggested responsibilities:

- Flipbook Viewer: animation playback, frame stepping, FPS control, animation/state display.
- Sticker/Picture Book Viewer: sprite/region display, manual bbox editing, region JSON export/import, cleanup/review status display.
- Particle FX Viewer: procedural FX recipe preview, parameter/preset authoring, preview-only boundary display.

## 13. Recommended First Implementation Lane

Recommended next lane:

```text
H5.88B — GlyphForge Unified Viewer Shell Design
```

Recommended first practical implementation candidate after shell design:

```text
GlyphForge Sticker/Picture Book Region Annotator
```

Reason: the Sprite Box Annotator has the strongest direct value for current asset pipeline lanes because manual bbox creation/review is repeatedly useful across mapping and cleanup review.

## 14. Runtime And Asset Safety Boundaries

H5.88A does not wire tools into runtime, modify games, install dependencies, process images, modify PNGs, create cleanup outputs, reorganize manifests/docs, move evidence flipbooks, edit evidence flipbooks, or turn prototype HTML into canonical tools.

All prototype references remain:

```text
runtimeEligibility: not-runtime-approved
```

Tiny rule:

```text
Steal the good gears. Do not crown the prototype goblins king.
```
