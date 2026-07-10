# Tiny Goblin Academy Asset Docs

H5.92 reorganized the loose `docs/assets/` report shelf into category shelves. The root of this folder should stay small: this README, long-lived category folders, and the existing `archive/` / `evidence/` support folders.

Current primary planning document:

- [Tiny Goblin Academy Asset System Plan](pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md)

## Shelf map

- `doctrine/` — reusable asset, tooling, evidence, functional-surface, and scene-anchor doctrine.
- `hub-visuals/` — hub identity, icons, boot/runtime evidence, and H4 visual work.
- `shared-assets/` — shared UI, shared core, creatures, FX, and cross-game capability notes.
- `game-assets/` — per-game H5 reports for One-Room Platformer, Pet Campfire, Dice Duel Tavern, Card Goblin Duel, Potion Sorter, Tiny Farm Day, and Dungeon Platformer.
- `topdown/` — topdown source routing, terrain, walls, objects, and future floor tilesheets.
- `pipeline/` — asset pipeline CLI, workflows, intake, prompts, and tutorial material.
- `pantry/` — global visual asset pantry, fonts, and cross-game availability records.
- `tooling/` — GlyphForge tool planning and organization reports.

## Authority rules

- Do not treat chronological H4/H5 reports as equally current just because they share a folder.
- Prefer current plan/index documents for active discovery.
- Historical lane reports remain useful provenance, but they are not automatic runtime approval.
- Runtime approval is never inferred from a document move.
- If a folder grows past roughly ten loose working files, split it by game, lane, asset type, or authority level before it becomes a junk drawer.

## H5.92 note

H5.92 moved tracked asset documentation with `git mv`; it did not reorganize evidence images, source assets, manifests, runtime code, package files, or build outputs.
