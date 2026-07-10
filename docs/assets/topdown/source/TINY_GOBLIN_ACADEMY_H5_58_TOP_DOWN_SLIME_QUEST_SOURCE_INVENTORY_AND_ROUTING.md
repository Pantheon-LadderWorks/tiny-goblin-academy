# Tiny Goblin Academy — H5.58 Top-Down Slime Quest Source Inventory + Lane Routing

## Purpose

H5.58 starts the Top-Down Slime Quest / shared topdown asset lane with source inventory and lane routing only.

This pass prevents the older mixed Top-Down Slime Quest playfield pack from being treated as one giant runtime atlas. It identifies the actual next processing lanes: terrain, walls, and objects.

## Context

H5.57 deferred the Shared FX / Feedback sheet as reference-only / concept-only with a particle-first replacement policy.

Top-Down Slime Quest now needs the same discipline: route the sources before cleanup, mapping, runtime integration, collision, placement, or gameplay behavior.

## Inputs Inspected

| Source | Dimensions | Mode | Alpha finding | Routing decision |
| --- | ---: | --- | --- | --- |
| `assets/academy/games/top-down-slime-quest/tga-top-down-slime-quest-playfield-pack-concept-v0.1.png` | 1024x1024 | RGB | no alpha channel | mixed/reference candidate |
| `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png` | 1024x1024 | RGB | no alpha channel | primary terrain source |
| `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png` | 1024x1024 | RGB | no alpha channel | primary wall/boundary source |
| `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png` | 1024x1024 | RGB | no alpha channel | primary object/prop source |

All four sources are RGB with no alpha channel. Any later cleanup pass must treat the checker-style background as baked/fake transparency and remain human-review gated.

## Mixed Playfield Pack Routing Decision

The Top-Down Slime Quest playfield pack is not the main source of truth.

It is a mixed/reference concept sheet, similar in risk shape to the Dungeon Platformer mixed sheet. It contains terrain, props, signs, walls, keys, portals, effects, footprints, and map fragments, but it should not be cleaned, mapped, or approved as one unified runtime atlas.

Current decision:

- source role: `secondary-reference-mixed-split-lane-source`
- cleanup eligibility: deferred
- runtime eligibility: not-runtime-approved
- use: reference-only / human-routed salvage candidate

If a future pass wants something from this sheet, it should explicitly route that item into the correct lane rather than bulk-processing the whole sheet.

## Folder Source Findings

### Topdown Terrain

Source:

`assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png`

This is the primary terrain/floor construction pantry. It includes floor tiles, cracked/mossy variants, grass, dirt, path segments, water/shore shapes, slime surfaces, special floor markers, and ground surfaces.

Recommended lane:

H5.59 — Topdown Terrain Source Intake + Region Mapping

### Topdown Walls

Source:

`assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png`

This is the primary wall/boundary construction pantry. It includes wall edges, corners, doors, gates, archways, fences, barriers, pillars, torches, banners, and boundary props.

Recommended lane:

H5.60 — Topdown Walls Source Intake + Region Mapping

### Topdown Objects

Source:

`assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`

This is the primary prop/interactable/decor pantry. It includes chests, switches, portals, signs, ruins, foliage, rocks, crates, barrels, fences, campfires, hazards, pads, and decorative objects.

Recommended lane:

H5.61 — Topdown Objects Source Intake + Region Mapping

## Source Inventory Manifest

Created:

`manifests/academy.topdown.source-inventory.json`

The manifest records source paths, dimensions, image mode, alpha findings, source role, recommended lane, runtime boundary, and non-goals.

## Recommended Processing Order

1. H5.59 — Topdown Terrain Source Intake + Region Mapping
2. H5.60 — Topdown Walls Source Intake + Region Mapping
3. H5.61 — Topdown Objects Source Intake + Region Mapping

Terrain should go first because it defines the base map surface language. Walls should follow because they depend on room boundary and edge semantics. Objects should follow after terrain and walls so placement and interaction semantics can stay separate from pure map construction.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-58-topdown-source-inventory/`

Evidence files:

- `mixed-pack-source-inspection-preview.png`
- `topdown-source-inventory-table-preview.png`
- `topdown-lane-routing-preview.png`
- `topdown-terrain-source-preview.png`
- `topdown-walls-source-preview.png`
- `topdown-objects-source-preview.png`

Evidence is source inventory / lane routing only. It is not cleanup evidence and does not approve runtime use.

## Runtime Boundary

H5.58 does not approve:

- runtime atlases
- cleanup candidates
- sourceRect region mapping
- derived PNGs
- Phaser placement data
- tilemap behavior
- collision / hitbox / blocking rules
- interaction rules
- animation behavior
- Top-Down Slime Quest game wiring

## Non-Goals

- No source PNG modification.
- No cleanup.
- No derived assets.
- No region rectangles.
- No runtime/game code changes.
- No placement, collision, interaction, or animation approval.
- No Shared FX changes.

## Human/Product Review Notes

The key human/product decision is that the mixed playfield pack remains a reference source. The topdown folder sources are the actual next processing lanes.

Tiny routing law:

The mixed sheet is a map of possibilities.

The folders are the pantry.

Do not cook the map.

## Recommended Next Lane

H5.59 — Topdown Terrain Source Intake + Region Mapping
