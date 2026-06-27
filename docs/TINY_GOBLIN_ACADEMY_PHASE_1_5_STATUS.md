# Phase 1.5 Status

## Overview
The goal of Phase 1.5 was to establish a functional, structurally sound, read-only Hub scaffold and generate the required initial visual assets (the pantry) before integrating them into actual game runtimes.

* Asset pantry generation is virtually complete.
* Read-only Hub foundation is virtually complete.
* Phase 1.5 overall remains active because dependency/storage/installer/Butler architecture must be resolved before Level 1 rebuild.
* Level 1 rebuild is intentionally blocked until that architecture is reviewed.

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
2. **Level 1 Restoration Contract / Plan** (Active Blocker)
3. **Workspace / Install Architecture Plan**
4. **Launcher / Runtime Plan** update if needed
5. **Level 1 Rebuild**: Rebuild Level 1 from scratch using the new asset doctrine as the primary integration test case. (Waiting on restoration plan).
6. **Levels 2-10 Asset Upgrades**: Systematically update the surviving games to consume their respective assets from the pantry. (Asset integration has not started).
7. **Packaging / Playable Builds**: Package the upgraded games into final playable builds and manage release structures.
8. **Tier 2 Planning**: Begin planning the next educational tier based on what Tier 1 has taught us and what the hub supports.

*(Note: Level 1 Restoration Contract is now the active next blocker. Workspace / Install Architecture Plan is also pending. Hub/launcher eventually includes installer/update concerns. Launcher/runtime behavior does not yet exist. Packaging/playable builds are not complete, and Tier 2 planning has not yet begun.)*
