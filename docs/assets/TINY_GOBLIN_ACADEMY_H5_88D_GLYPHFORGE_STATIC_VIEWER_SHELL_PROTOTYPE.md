# Tiny Goblin Academy — H5.88D GlyphForge Static Viewer Shell Prototype

## Purpose

H5.88D builds the first static/offline GlyphForge Visual Workbench prototype from the H5.88C cut list.

This is a local visual asset review and planning tool only. It is not runtime wiring.

## Created tool files

Static viewer:

```text
tools/glyphforge/viewer-shell-static/index.html
tools/glyphforge/viewer-shell-static/styles.css
tools/glyphforge/viewer-shell-static/app.js
tools/glyphforge/viewer-shell-static/README.md
```

Registry:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs
```

Evidence:

```text
assets/academy/evidence/h5-88d-glyphforge-static-viewer-shell-prototype/glyphforge-static-viewer-shell-evidence.md
```

## Registry source

The generated registry is derived from:

```text
manifests/academy.visual-asset-pantry-index.json
```

The generator uses only built-in Node modules and does not install dependencies.

Generated registry:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

Registry entry count:

```text
24
```

Tool mode routing summary:

```text
region-asset-browser: 16
scene-composition-editor: 2
particle-fx-viewer: 3
flipbook-viewer: 3
```

## Implemented viewer behavior

The static shell supports:

- loading the generated registry JSON;
- file-picker fallback for `file://` browser restrictions;
- listing asset entries;
- filtering by game/domain;
- filtering by tool mode;
- filtering by review status;
- filtering by runtime eligibility;
- text search;
- opening a selected entry;
- showing manifest/source/derived/evidence paths;
- showing warnings/exclusions;
- showing denied/deferred regions;
- showing status/runtime boundary strip;
- showing raw selected registry entry JSON.

## Implemented mode

The first useful implemented mode is:

```text
Region / Asset Browser summary mode
```

It shows:

- display name;
- asset family;
- game/domain;
- manifest path;
- source path;
- derived path;
- region/count metadata;
- accepted/denied/deferred count fields when present;
- warnings/exclusions;
- denied and deferred region lists;
- runtime eligibility.

## Placeholder modes

The following modes route correctly and show metadata/status summaries, but remain placeholders in H5.88D:

- Dashboard / Launcher;
- Flipbook Viewer;
- Scene Composition / Layout Editor;
- Particle FX Viewer;
- Future Audio Viewer placeholder.

Full playback, drag placement, bbox editing, particle authoring, and audio preview are not implemented in this lane.

## Runtime boundary

Every selected entry visibly displays:

```text
pipelineUse
reviewStatus
runtimeEligibility
Runtime approval is never inferred.
```

The viewer displays pantry and manifest state. It does not promote assets.

## Non-goals

H5.88D does not:

- wire runtime;
- modify game code;
- modify package/lock files;
- install dependencies;
- process images;
- modify PNGs;
- modify source/derived/evidence images;
- reorganize manifests/docs folders;
- modify preserved prototype files;
- write back to manifests from the viewer;
- approve runtime placement;
- approve collision/pathfinding/tilemap behavior;
- approve animation cycles;
- approve particle behavior;
- approve audio triggers.

## Evidence created

Written evidence was created instead of screenshots:

```text
assets/academy/evidence/h5-88d-glyphforge-static-viewer-shell-prototype/glyphforge-static-viewer-shell-evidence.md
```

Screenshot generation was intentionally skipped because it would require browser automation or manual capture outside this lane. The evidence documents the registry load path, Region Browser summary behavior, scene-anchor route, animation route, and runtime-boundary strip.

## Relationship to runtime order

Button Goblin Clicker remains the first later runtime visual integration candidate.

Top-Down Slime Quest remains last or near-last for runtime visual integration because animation, tile behavior, placement, collision, pathfinding, and map rules remain deferred.

Audio remains future Tier 2.5.

## Recommended next lane

Recommended:

```text
H5.88E — GlyphForge Static Viewer Shell Human Review
```

Possible follow-up after review:

```text
H5.89 — Font Pantry Intake Plan
H5.90 — Manifest Folder Reorganization Dry Run
H6.0 — Button Goblin Clicker Runtime Visual Integration Plan
```

Tiny workbench law:

```text
The workbench can now list the jars.
It still cannot feed them to runtime goblins.
```
