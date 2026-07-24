# GlyphForge Prototype References

This folder preserves visual tool prototypes for Tiny Goblin Academy GlyphForge planning.

These files are prototype/reference tools only.

The Level 8 Sticker Book Editor prototype is a scene-composition / sticker-placement / layout-export reference that was used for One Room Dungeon Platformer / Level 8 layout planning.

The Manifest Region Mapper prototype is a schema-preserving rectangle calibrator. It loads an image plus an existing manifest, optionally resolves surface crops through a companion source-region manifest, edits source-pixel or surface-relative rectangles, and downloads the corrected primary manifest without inventing a replacement schema.

They are not canonical runtime tools. They are not wired into games. They are preserved for comparison and maturation so future lanes can rebuild the useful pieces into a unified GlyphForge Visual Tool Suite.

## Preserved prototypes

```text
sprite-box-annotator-prototype-v0.1.html
particle-fx-viewer-prototype-v0.1.html
level-8-sticker-book-editor-prototype-v0.1.html
manifest-region-mapper-prototype-v0.1.html
manifest-region-mapper-core.js
tests/manifest-region-mapper-core.test.cjs
```

## Manifest Region Mapper v0.1

Open `manifest-region-mapper-prototype-v0.1.html` directly in a browser. Load the source image and primary JSON manifest. When editing a functional-slot manifest whose surfaces reference a separate source-region map, also load that source-region manifest so the page can isolate each surface crop.

The editor supports drag/resize handles, numeric pixel fields, normalized readouts, fit/100% zoom, panning, visibility and lock toggles, keyboard nudging, crop preview, and out-of-bounds warnings. **Save corrected manifest** downloads a copy of the primary manifest with only edited rectangle fields changed.

## Boundaries

- Do not treat these prototypes as production tools.
- Do not wire them into runtime/game code from this folder.
- Do not assume their schemas are canonical.
- Do not treat any visual-only, marker, particle, bbox, or gameplay-looking vocabulary as runtime approval.
- Future lanes may rebuild these ideas into registry-fed GlyphForge surfaces.
- The Level 8 Sticker Book Editor is preserved for comparison only; it is not canonical runtime tooling and is not wired into games.

## Intended future direction

The useful parts of these prototypes should be compared with the repo-local flipbook evidence prototypes and then folded into a deliberate GlyphForge architecture:

```text
tools/glyphforge/
  registry/
  viewer-shell/
  flipbook-viewer/
  sticker-picture-book-viewer/
    region-asset-browser-mode/
    scene-composition-layout-mode/
  particle-fx-viewer/
  shared/
```
