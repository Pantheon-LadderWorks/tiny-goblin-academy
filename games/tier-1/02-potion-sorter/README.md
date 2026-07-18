# Potion Sorter

## Purpose

A bounded potion-matching game demonstrating explicit input mapping, discrete
state transitions, immediate success/failure feedback, combo scoring, and a
timed round. Its visual pass teaches layered material composition and a
code-authored `SceneRig` without transferring gameplay authority into the
renderer.

## Play

From the repository root:

```powershell
pnpm --filter tga-02-potion-sorter dev
```

Or launch Level 02 through the current Tiny Goblin Academy Tauri development
hub:

```powershell
pnpm hub:tauri:dev
```

The active potion supports both interaction paths:

- click/tap a potion, then click/tap its matching receiver;
- drag the active potion from the inspection aperture to its receiver.

## Verify

```powershell
pnpm --filter tga-02-potion-sorter test
pnpm --filter tga-02-potion-sorter build
```

## Status

- Tier 1 mechanical loop: Playtested / Human Review Passed
- Tier 1.5 visual integration: Human Review Passed
- Current runtime composition: Composition C hybrid alchemy `SceneRig`
- Supported desktop contracts: `1920 x 1080` primary and `1024 x 640` minimum
- Distribution status: not released

The simulation/controller remains authoritative for potion order, matching,
score, combo, timer, and round completion. Phaser and DOM surfaces present that
truth; they do not own it.
