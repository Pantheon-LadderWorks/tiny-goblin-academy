# GlyphForge Prototype References

This folder preserves visual tool prototypes for Tiny Goblin Academy GlyphForge planning.

These files are prototype/reference tools only.

The Level 8 Sticker Book Editor prototype is a scene-composition / sticker-placement / layout-export reference that was used for One Room Dungeon Platformer / Level 8 layout planning.

They are not canonical runtime tools. They are not wired into games. They are preserved for comparison and maturation so future lanes can rebuild the useful pieces into a unified GlyphForge Visual Tool Suite.

## Preserved prototypes

```text
sprite-box-annotator-prototype-v0.1.html
particle-fx-viewer-prototype-v0.1.html
level-8-sticker-book-editor-prototype-v0.1.html
```

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
