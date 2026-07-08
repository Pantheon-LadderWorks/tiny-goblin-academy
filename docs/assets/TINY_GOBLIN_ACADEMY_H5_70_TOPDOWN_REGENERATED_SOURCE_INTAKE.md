# Tiny Goblin Academy — H5.70 Topdown Regenerated Source Intake

## Purpose

H5.70 records three newly regenerated topdown source sheets and routes them into the asset pipeline before any mapping or cleanup work continues.

This pass exists because the prior topdown wall/object sources were serviceable but awkward: the wall sheet was incomplete for vertical wall coverage, and the object sheet included FX-bearing sprites that made cleanup fragile.

## Sources Ingested

| Source | Path | Dimensions | Alpha finding | Routing |
|---|---|---:|---|---|
| Horizontal / mixed wall source | `assets/academy/topdown/walls/tga-topdown-walls-horizontal-true-alpha-regenerated-v0.2.png` | `1536x1024` | True alpha present | Map carefully; no transparency cleanup needed |
| Vertical wall supplement | `assets/academy/topdown/walls/tga-topdown-walls-vertical-cleanup-source-regenerated-v0.2.png` | `1448x1086` | RGB / no alpha | Map carefully, then cleanup candidate |
| No-FX object source | `assets/academy/topdown/objects/tga-topdown-environment-objects-nonfx-regenerated-v0.2.png` | `1254x1254` | RGB / no alpha | Map carefully, then cleanup candidate |

## Key Finding

Fake transparency is not automatically fatal. The problem is fake transparency combined with glow, fire, smoke, translucent magic, soft halos, or other FX that contaminate the background.

The vertical wall supplement and regenerated no-FX object sheet are still RGB/opaque sources, but they are much better cleanup candidates because they are mostly hard-edged stone, wood, foliage, props, and non-FX surfaces.

## Routing Decision

The topdown pantry now has this corrected route:

1. Existing terrain remains H5.60B-reviewed and mapped, still pending cleanup planning.
2. New true-alpha wall sheet should become the next wall mapping source.
3. New vertical wall sheet should be mapped as a supplemental wall source, then cleaned through the canonical fake-background cleanup pipeline.
4. New no-FX object sheet should become the preferred object remapping / cleanup source.
5. H5.69's old object cleanup result remains useful draft history, but it should not prevent the cleaner regenerated no-FX object path.

## FX Doctrine

Fire, glow, smoke, magic swirls, portal light, sparkles, and similar soft effects should not be treated like ordinary object sprites when baked into fake transparency.

Preferred future pattern:

```text
torch stick / brazier bowl / campfire logs / portal base / stone seal
+ particle or FX layer
= cleaner runtime effect
```

This avoids permanent orange checkerboard ghosts and lets runtime control flicker, intensity, animation, and state.

## Non-Goals

H5.70 does not:

- map sourceRects;
- create cleanup candidates;
- create derived PNGs;
- approve runtime atlases;
- approve collision, pathfinding, placement, interaction, pickup, loot, trap, door, wall, tilemap, light, flame, portal, particle, or gameplay behavior;
- change Top-Down Slime Quest runtime/game code.

## Recommended Next Lane

H5.71 — Topdown Walls True-Alpha Region Mapping.

After that:

```text
H5.72 — Topdown Vertical Walls Region Mapping
H5.73 — Topdown Vertical Walls Cleanup Candidate
H5.74 — Topdown No-FX Objects Region Mapping
H5.75 — Topdown No-FX Objects Cleanup Candidate
```

Tiny law:

```text
Hard stone can survive cleanup school.
Fire should arrive as a layer, not a checkerboard hostage.
```
