# Tiny Goblin Academy Hub Asset Plan

This document defines the strategy for assets specific to the Academy Hub (launcher UI), distinguishing between mandatory requirements and optional polish, and governing how assets are consumed by the Hub.

## Purpose of Hub Assets
Hub assets serve to build the visual identity of the Academy launcher and visually represent the contained game roster. They are distinct from the in-game assets (which build the games themselves).

## Hub Assets Required Now
To support a v0.1 Hub, we need a minimal, functional asset footprint:
- **Studio Boot/Splash Identity**: Branding for the initial boot sequence (e.g. Pantheon / Glyphforge standard).
- **Game Icon/Button Sheet**: A sprite sheet containing recognizable icons or framed art for each game on the roster.
- **Optional Placeholder Icon**: A generic "Academy" tile to use as a fallback when a game's specific icon is missing or deferred.

## Reusable Non-Dedicated Assets
We do not need to generate new art for everything. The Hub can and should reuse available assets from existing shared sheets:
- **UI / HUD**: Panels, borders, and general interface pieces.
- **Shared FX / Feedback**: Glints, highlights, or selection effects.
- **Status Markers / Badges**: Small icons indicating playable, missing, or dev-only states.

## Optional Later Hub Assets
We will skip these for now to avoid scope bloat. These are future-state polish items:
- **Hub Background**: A subtle parchment/stone texture or vignette for the main shell background.
- **Section Icons**: Icons for nav sections like All Games, Playable, Assets, Credits, Settings.
- **App/Package Icon**: The actual OS-level `.ico` / `.icns` file for Tauri builds.

## Hub Asset Doctrine
1. **Hub Assets Are Also a Pantry**: The new game icon sheet (e.g. `tga-hub-game-icons-sheet-concept-v0.1.png`) is a pantry, just like in-game asset sheets.
2. **Selective Usage**: Not every sprite or icon on a generated sheet must be used.
3. **Manifest Slicing Strategy**: The UI will not hardcode pixel coordinates. Later slicing should be driven by a manifest mapping. The Hub UI should not care if the source is one giant sheet or many files.

### Hub Icon Manifest Implementation

* `manifests/hub.icons.json` now exists as the draft Hub Icon Manifest.
* It maps game IDs to row/column cells in the hub icon sheet.
* It does not crop images.
* It does not create a full asset pipeline.
* It is currently for read-only Hub game card display.

## Hub Icon Validation

`scripts/validate-hub-icons.mjs` validates the Hub Icon Manifest.
* It checks the icon sheet path, grid bounds, duplicate cells, and gameId/slug alignment with `academy.games.json`.
* It does not crop or export icons.
* It does not create a full asset pipeline.
