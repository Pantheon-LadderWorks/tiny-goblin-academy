# H5.70 Tiny Goblin Academy Topdown Mixed Terrain Transition Generation Spec

**Status:** pre-generation design spec

**Purpose:** Define intended 8x8 mixed-terrain transition sheets before image generation. This is not a final manifest.

This is a **pre-generation design spec**, not the final runtime manifest. The final manifest should be created only after generated sheets are inspected cell-by-cell.

## Global constraints

- 8 columns x 8 rows.
- 64 full-cell square terrain tiles per sheet.
- Opaque full-cell terrain only; no partial-alpha floor overlays required.
- No objects.
- No walls.
- No props.
- No labels.
- No UI symbols.
- No glowing FX.
- No collision, movement, hazard, trigger, portal, or pathfinding behavior is approved by this spec.

## Shared 8x8 column grammar

Every row in each mixed terrain sheet should reuse this same column grammar.

| Column | Intended role | Description |
|---:|---|---|
| 1 | horizontal transition | Terrain A and B meet across a horizontal band/edge. |
| 2 | vertical transition | Terrain A and B meet across a vertical band/edge. |
| 3 | outer corner | One terrain wraps around the outside of the other. |
| 4 | inner corner | One terrain cuts into the other as an inside corner. |
| 5 | T-junction | One terrain branches into or through the other in a T shape. |
| 6 | cross / four-way blend | Both terrains meet in a cross or multi-direction blend. |
| 7 | end cap / terminal edge | A path or patch of one terrain ends inside the other. |
| 8 | patch / island / irregular blob | Small irregular patch of Terrain B inside Terrain A, or vice versa. |

## mixed-natural-transitions-v0.1

**Proposed file:** `tga-topdown-mixed-terrain-natural-transitions-8x8-v0.1.png`

**Purpose:** Common outdoor/natural biome blending for procedural stages.

| Row | Intended terrain pair | Runtime note |
|---:|---|---|
| 1 | grass ↔ dirt | walkable normal |
| 2 | grass ↔ stone | walkable normal |
| 3 | dirt ↔ stone | walkable normal |
| 4 | grass ↔ mud | candidate slow terrain; behavior deferred |
| 5 | dirt ↔ mud | candidate slow terrain; behavior deferred |
| 6 | grass ↔ shallow water / shore | candidate slow or blocked; behavior deferred |
| 7 | dirt ↔ shallow water / shore | candidate slow or blocked; behavior deferred |
| 8 | grass ↔ swamp / slime edge | candidate slow or hazard; behavior deferred |

### Generation prompt

```text
Create an 8x8 top-down fantasy RPG mixed natural terrain transition tilesheet. Each tile is a complete opaque square ground tile, no transparency needed, no objects, no walls, no props, no labels, no UI symbols, no glowing effects. Use full-cell baked terrain blends only. Columns 1-8 repeat the same shape grammar in every row: horizontal transition, vertical transition, outer corner, inner corner, T-junction, cross/four-way blend, end cap, patch/island/blob. Rows 1-8 are: grass to dirt, grass to stone, dirt to stone, grass to mud, dirt to mud, grass to shallow water/shore, dirt to shallow water/shore, grass to swamp/slime edge. Keep a consistent hand-painted top-down game tile style. Make the grid a clean 8 columns by 8 rows.
```
## mixed-structural-special-transitions-v0.1

**Proposed file:** `tga-topdown-mixed-terrain-structural-special-transitions-8x8-v0.1.png`

**Purpose:** Indoor, ruin, cave, slime, and arcane/metal transition language for procedural stages.

| Row | Intended terrain pair | Runtime note |
|---:|---|---|
| 1 | wood ↔ stone | walkable normal |
| 2 | wood ↔ dirt | walkable normal |
| 3 | cave rock ↔ dirt | walkable normal |
| 4 | cave rock ↔ mud | candidate slow terrain; behavior deferred |
| 5 | ruined stone ↔ moss / overgrowth | walkable normal or candidate slow; behavior deferred |
| 6 | stone ↔ slime | candidate slow or hazard; behavior deferred |
| 7 | stone ↔ arcane metal | walkable normal |
| 8 | dirt ↔ arcane metal | walkable normal |

### Generation prompt

```text
Create an 8x8 top-down fantasy RPG mixed structural and special terrain transition tilesheet. Each tile is a complete opaque square ground tile, no transparency needed, no objects, no walls, no props, no labels, no UI symbols, no glowing effects. Use full-cell baked terrain blends only. Columns 1-8 repeat the same shape grammar in every row: horizontal transition, vertical transition, outer corner, inner corner, T-junction, cross/four-way blend, end cap, patch/island/blob. Rows 1-8 are: wood to stone, wood to dirt, cave rock to dirt, cave rock to mud, ruined stone to moss/overgrowth, stone to slime, stone to arcane metal, dirt to arcane metal. Keep a consistent hand-painted top-down game tile style. Make the grid a clean 8 columns by 8 rows.
```

## Post-generation inspection rules

- Do not assume generated cells match the intended spec.
- Inspect the generated sheet as an 8x8 grid.
- Create a final manifest from observed content, not desired content.
- Mark cells accepted, review-candidate, duplicate, mismatch, rejected, or placeholder.
- Do not approve collision, pathfinding, slow, hazard, portal, trigger, or runtime behavior from visual labels alone.
- If a row or column grammar drifts but the tile is still useful, name its actual use honestly.

## Runtime doctrine

- Art does not approve behavior.
- Collision, pathfinding, slow movement, hazard, trigger, portal, or special interaction rules must be assigned through metadata after inspection.
- The generated image may be beautiful and still fail individual cells.
- The final manifest should describe what exists, not what this spec hoped would exist.

## Recommended post-inspection status values

```text
accepted-visual
review-candidate
duplicate
mismatch
rejected
placeholder
```

## Recommended runtime metadata fields after inspection

```text
walkable
movement
collision
hazard
slippery
slow
visualOnly
notes
```
