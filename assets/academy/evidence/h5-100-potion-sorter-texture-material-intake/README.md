# H5.100 Potion Sorter Texture Material Intake Evidence

## Status

Reviewed / Reusable Pantry Accepted / Not Runtime Approved

## Purpose

This evidence records a small reusable source-material vocabulary for a future code-authored medieval alchemy production room. It does not implement the room, SceneRig, runtime texture wiring, shaders, PBR, particles, or a flattened background.

## Human Review Verdict

The provenance-clean ambientCG and Kenney source families are approved for the reusable GlyphForge texture/material pantry. Pantry acceptance does not require Potion Sorter usage. The active Potion Sorter palette remains provisional until H5.101 neutral-specimen audition, and `research-previews/` remains evidence-only.

## Provisional Shortlist

- Structural wood: `WoodSiding008`
- Rough stone: `Bricks089`
- Dark iron: `Metal046B`
- Aged brass/bronze: `Metal008`
- Parchment: `Paper006`
- Grime/wear: `SurfaceImperfections015`
- FX helpers: `smoke_06.png`, `dirt_02.png`, `spark_01.png`, `light_01.png`
- Glass: no external texture promoted; code-authored transparency is deferred to H5.101.
- Potion liquid: no external texture promoted; code-authored color/alpha plus the glow helper is deferred to H5.101.

## Evidence Index

- `source-inventory-overview.jpg`
- `family-structural-wood-contact-sheet.jpg`
- `family-rough-stone-contact-sheet.jpg`
- `family-dark-iron-contact-sheet.jpg`
- `family-aged-brass-bronze-contact-sheet.jpg`
- `family-parchment-paper-contact-sheet.jpg`
- `family-grime-wear-contact-sheet.jpg`
- `family-fx-helpers-contact-sheet.jpg`
- `core-material-palette-overview.jpg`
- `support-material-overview.jpg`
- `candidate-defer-reject-table.jpg`
- `provenance-status-table.jpg`
- `material-to-future-scenerig-mapping-table.jpg`
- `source-image-and-hash-audit.json`
- `pipeline-run-log.json`
- `research-previews/` contains official preview-based research evidence only.

## Evidence Rules

All source aspect ratios are preserved. No source color correction, seam repair, relighting, crop, recolor, or runtime derivative was created. Contact sheets and tables are evidence-only and must never be registered as runtime assets.

## Next Boundary

H5.101 may apply the shortlist to neutral code-authored specimens: timber beam, stone arch, conveyor slat, iron rail, brass gear, parchment label, glass bottle, and potion liquid/glow treatment. Room composition and runtime wiring remain later work.
