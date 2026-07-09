# Tiny Goblin Academy — H5.73A Topdown Floor Tilesheet Future Intake

## Purpose

H5.73A preserves newly generated topdown floor/terrain tilesheet sources and their planning documents as future pantry assets.

This is an intake/staging pass only. It does not process, map, clean, approve, or wire these sheets.

## Intake Decision

The six generated floor tilesheet PNGs are worth keeping as future terrain pantry shelves, but they are not active production terrain sources yet.

Important finding:

- The planning manifest describes six 8x8 / 128px vocabulary sheets.
- The copied generated PNGs are `1254x1254` RGB files with no alpha channel.
- Therefore, they are not treated as ready 1024x1024 production tile manifests.
- Later processing must inspect observed content and actual grid geometry before creating tile region manifests.

## Files Copied

Source PNGs were copied into:

```text
assets/academy/topdown/terrain/future-floor-tilesheets/sources/
```

Copied source files:

```text
fantasy_rpg_tilemap_for_terrain_design.png
fantasy_dungeon_floor_tilesheet_textures.png
wood_and_stone_floor_tile_grid.png
dungeon_floor_tileset_grid.png
swamp_terrain_tile_set.png
sci_fi_steampunk_floor_tiles_sheet.png
```

Planning files were copied into:

```text
assets/academy/topdown/terrain/future-floor-tilesheets/manifests/
assets/academy/topdown/terrain/future-floor-tilesheets/specs/
```

Copied planning files:

```text
tga-topdown-floor-tilesheets-manifest-v0.1.json
tga-topdown-floor-tilesheets-manifest-v0.1.md
tga-topdown-mixed-terrain-transition-generation-spec-h5.70.json
tga-topdown-mixed-terrain-transition-generation-spec-h5.70.md
```

## Intake Index

```text
assets/academy/topdown/terrain/future-floor-tilesheets/intake/tga-topdown-floor-tilesheets-future-intake-v0.1.json
```

The index records:

- copied source paths;
- original Downloads paths;
- file sizes;
- SHA-256 hashes;
- dimensions;
- format/mode;
- alpha findings;
- declared planning grid;
- future-only / not-runtime-approved status.

## Evidence Created

```text
assets/academy/evidence/h5-73a-topdown-floor-tilesheet-future-intake/topdown-floor-tilesheets-future-intake-contact-sheet.png
assets/academy/evidence/h5-73a-topdown-floor-tilesheet-future-intake/topdown-floor-tilesheets-future-intake-table-preview.png
```

These previews are intake evidence only, not tile mapping evidence.

## Doctrine

These six sheets are future terrain/floor pantry sources. They do not replace the already-mapped terrain sheet yet.

Tile labels from the uploaded manifest are draft semantic vocabulary only. The mixed-terrain spec is pre-generation design guidance only, not final manifest truth.

No collision, pathfinding, slow terrain, hazard, water, slime, portal, trigger, speed, loot, or runtime behavior is approved.

The road/path overlay sheet remains excluded.

## Non-Goals

H5.73A does not:

- map individual tiles;
- create production terrain manifests;
- create cleanup candidates;
- create derived transparent PNGs;
- modify existing terrain, wall, or object manifests;
- replace the active topdown terrain sheet;
- wire any runtime/game code;
- approve collision, pathfinding, terrain behavior, hazards, portals, triggers, or tilemap use.

## Current Priority After Intake

The current topdown asset pass should continue with:

1. vertical walls cleanup/review after H5.73 region review;
2. regenerated non-FX object sheet intake/mapping/cleanup;
3. existing mapped floor sheet cleanup/review.

These future floor sheets should be processed later only after the current topdown asset pass closes.

## Recommended Next Active Lane

```text
H5.74 — Topdown Vertical Walls Cleanup Candidate
```
