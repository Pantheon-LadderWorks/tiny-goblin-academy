# GlyphForge Visual Workbench â€” Static Prototype v0.1

This folder contains the first static/offline GlyphForge Visual Workbench prototype for Tiny Goblin Academy.

It is a local visual asset review and planning tool only.

## What it does

- Loads the generated GlyphForge visual registry.
- Lists visual asset entries.
- Filters by game/domain, tool mode, review status, runtime eligibility, and text search.
- Opens an entry and shows manifest/source/derived/evidence paths.
- Displays `pipelineUse`, `reviewStatus`, and `runtimeEligibility`.
- Shows warnings, exclusions, denied regions, and deferred regions.
- Provides placeholder route panels for:
  - Dashboard / Launcher
  - Flipbook Viewer
  - Region / Asset Browser
  - Scene Composition / Layout Editor
  - Particle FX Viewer
  - Future Audio Viewer placeholder
- Implements the first useful Region / Asset Browser summary mode.

## What it does not do

- No runtime wiring.
- No source asset mutation.
- No manifest writeback.
- No runtime approval.
- No game code changes.
- No image processing.
- No PNG/source/derived/evidence image changes.
- No dependency installs.
- No package or lock file changes.

## Registry source

The viewer consumes:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

That registry is generated from:

```text
manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json
```

Generator:

```text
node tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs
```

The generator uses only built-in Node modules.

## How to open

Open:

```text
tools/glyphforge/viewer-shell-static/index.html
```

If the browser blocks the bundled registry fetch under `file://`, use the "Load registry file" button and select:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

Alternatively, serve the repository with any already available local static server and open the HTML through HTTP. Do not install dependencies just for this prototype.

## Runtime boundary

Runtime approval is never inferred.

The viewer displays pantry and manifest state. It does not promote assets, approve placement, approve animation cycles, approve particle behavior, approve audio triggers, approve collision/pathfinding/tilemaps, or wire any game.
## H5.88E review status

H5.88E passed this static/offline shell as a local visual review and planning prototype with polish notes.

Accepted v0.1 scope:

- registry loading;
- entry listing and filters;
- dashboard summary;
- status/runtime boundary display;
- metadata, paths, warnings, and raw JSON preview;
- first useful Region / Asset Browser summary mode;
- placeholder route panels for Flipbook, Scene Composition, Particle FX, and Audio Later.

Known polish note: mode tabs can display non-native selected entries in placeholder views. A future maturity lane should add auto-routing, mismatch warnings, or explicit placeholder-only labels.

Runtime approval is still never inferred from this shell.
