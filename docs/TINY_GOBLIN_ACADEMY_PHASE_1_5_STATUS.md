# Phase 1.5 Status

## Overview
The goal of Phase 1.5 was to establish a functional, structurally sound, read-only Hub scaffold and generate the required initial visual assets (the pantry) before integrating them into actual game runtimes.

* Asset pantry generation is virtually complete.
* Read-only Hub foundation is virtually complete.
* Phase 1.5 achieved its foundational goals. The dependency/storage architecture (pnpm workspace) was resolved.
* Level 1 rebuild is complete and has passed Human Review.

## Completed Milestones

### 1. Asset Pantry Creation
The asset generation phase is effectively complete. The repository now holds enough shared core assets, UI elements, FX, and game-specific art to stop focusing on asset creation and begin focusing on asset consumption.
- **Intake Pipeline Proven**: Phases H2.1–H2.5b proved the first full intake path for one hub sheet, establishing inspection, mapping, cleanup, validation, and visual review protocols.
- **Quarantine Required**: Future asset work must strictly follow the intake pipeline. Asset pantry stocked does not mean assets are ready for runtime use.

### 2. Hub Foundation
- **Hub Scaffold**: Built and verified as a read-only React/Vite shell.
- **Manifest Architecture**: 
  - `academy.games.json` acts as the roster truth.
  - `hub.icons.json` acts as the asset mapping truth.
- **Validation Guards**: 
  - Zero-dependency node scripts continuously validate the integrity of both manifests to prevent silent drift.
- **Visual Polish**: 
  - Applied subtle background textures, game card hover states, and dynamic CSS-based icon loading.
  - **H2 Visual Pass Complete**: The hub now utilizes a 2x5 grid, reads icons from a true-transparent derived asset via source rectangles, and formalized the intake pipeline. The hub remains strictly read-only.

### 3. Safety Guardrails
- **No Launching**: The Hub does not yet manage processes, invoke dev servers, or use Tauri.
- **Truthful Tracking**: Level 1 remains correctly categorized as `restorationDeferred`, recognizing its lack of original source without pretending it doesn't exist.

## Next Steps

With the read-only foundation locked in and the asset pantry stocked and structured via the H2 intake pipeline, the following sequential steps are recommended:

1. ~~**Dependency / Storage / Installer / Butler Audit**~~ (Completed)
2. ~~**Level 1 Restoration Contract / Plan**~~ (Completed)
3. ~~**Workspace / Install Architecture Plan**~~ (Completed)
4. ~~**Level 1 Rebuild**~~ (Completed - Restored v0.1)
5. **Launcher / Runtime Control-Surface Reconciliation**: (Active - H3.0) Reconciling docs to establish the Tauri shell as the next foundation spike.
6. **Levels 2-10 Asset Upgrades**: Systematically update the surviving games to consume their respective assets from the pantry. (Asset integration has not started).
7. **Packaging / Playable Builds**: Package the upgraded games into final playable builds and manage release structures.
8. **Tier 2 Planning**: Begin planning the next educational tier based on what Tier 1 has taught us and what the hub supports.

*(Note: The active next blocker is the Hub runtime/control-surface architecture. A minimal Tauri spike (H3.1) is required before implementing any launch capabilities.)*
