# Level 6: Tiny Farm Day

**Fantasy**: Plant a seed, water it, watch it grow into a crop, sell it for profit, and upgrade your farm before the day ends.
**Core Lesson**: Deterministic action-driven time advancement, state machine validation, and a tight economic loop.

## Status
Playtested / Human Review Passed / Level 6 Complete

*(Six-badge scale: Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded)*
*(Note: No Released, Retired, Expanded, v0.2, or release authorization is implied)*

## Design Lock
* **Visual Shell**: Tiny Goblin Academy shell preserved.
* **Layout**: Three plots.
* **Crops**: One crop type.
* **Scope**: One compact day.
* **Starting State**: 3 empty plots, 3 seeds, 0 crops, 0 coins, tick 0.
* **Plot States**: Empty, PlantedDry, PlantedWatered, Grown.
* **Time**: Valid farm actions advance discrete ticks.
* **Growth**: Watered crops mature through action-driven ticks.
* **Harvest**: Adds crops and returns plots to empty.
* **Economy**: Sell converts 3 crops into 6 coins. Upgrade costs 5 coins.
* **End Day**: Without upgrade produces defeat/incomplete day; with upgrade produces victory.
* **Reset**: Restores initial state.
* **Lock**: Terminal controls lock except Reset.
* **Architecture**: Simulation owns all game truth. Renderer only displays state.
* **Ledger**: Displays newest-first with historically correct numbering.

## Stack
* Vite / TypeScript / Phaser (for visual rendering) / HTML DOM (for UI)
* Vitest (15/15 tests passed)
