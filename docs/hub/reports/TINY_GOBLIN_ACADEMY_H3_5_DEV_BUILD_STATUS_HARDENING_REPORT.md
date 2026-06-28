# Tiny Goblin Academy — H3.5 Dev-Mode Build Status Hardening Report

## Overview
Phase H3.5 successfully hardened the Hub's read-only runtime status model by diving deeper into the developer-mode build status of the game packages. The Hub now explicitly detects whether a game has its source code available, a valid `package.json`, development scripts, and most importantly, whether a static playable artifact exists.

**Base H3.4 Commit SHA:** `131ad8e feat: add read-only runtime status model`

## New & Refined Status Fields
The `GameStatus` Rust struct and TypeScript interface were updated to provide fine-grained, robust detection of build states:
- `slug`: String
- `sourceDirectoryExists`: Boolean
- `packageJsonExists`: Boolean
- `nodeModulesExists`: Boolean
- `hasDevScript`: Boolean
- `hasBuildScript`: Boolean
- `hasPreviewScript`: Boolean
- `distExists`: Boolean
- `distHasIndexHtml`: Boolean
- `distAssetCount`: Integer
- `buildStatus`: Enum (`not-applicable` | `not-built` | `built` | `incomplete` | `unknown`)

*Note: Existing H3.4 fields (`sourceAvailable`, `dependenciesInstalled`, `devRunnable`, `buildAvailable`) were retained for compatibility.*

## Build Status Determination
The backend determines a game's `buildStatus` purely based on safe file and path existence checks:
1. Validates that `package.json` exists.
2. Checks if the `dist/` directory exists.
3. Checks if `dist/index.html` exists inside the `dist/` directory.

### Missing or Incomplete `dist` Handling
- If `dist/index.html` is found, `buildStatus` = `"built"`.
- If `dist/` is found but has no `index.html`, `buildStatus` = `"incomplete"`.
- If `dist/` is not found (but package exists), `buildStatus` = `"not-built"`.
- If no package is found, `buildStatus` = `"not-applicable"`.

## UI Changes
The React UI was lightly refined to expose this enhanced status transparency without adding operational logic.
- **GameCard**:
  - Displays `"Build: Built"`, `"Build: Incomplete"`, or `"Build: Not Built"` depending on `buildStatus`.
  - Added a chip for `"Dev Script"` if available.
  - Added a chip for `"Static Entry Found"` if `dist/index.html` exists.
  - Retained `"Production Install: Future"` as a clear doctrinal boundary.
- **GameDetailPanel**:
  - Exposed the full spectrum of the read-only data, including `dist` asset count, specific script existence (`dev`, `build`), and the `buildStatus` enum.

## Security & Capability Notes
- The Rust backend uses strict, read-only API calls (`fs::exists`, `fs::read_dir`, `fs::read_to_string`).
- **No execution:** No shell commands, process spawning, or package manager scripts were used to determine status.
- Paths remain rigidly derived from the trusted JSON manifest; arbitrary path access is not possible.

## Pre-Flight Confirmations
- **No mutations:** No launch, install, uninstall, update, or build commands were added.
- **No accidental deletions:** No untracked files were deleted, modified, or staged (including `game_studio_tree.md` and the PNG assets).
- **No CodeCraft contact:** CodeCraft Native was completely untouched.

## Validation Commands
```powershell
cargo check --manifest-path hub/src-tauri/Cargo.toml
pnpm --filter tiny-goblin-academy-hub build
pnpm run hub:tauri:build
```
Validation passed cleanly. The UI compiles with the new types, and the Rust bridge successfully queries the workspace paths without failing.

## Readiness
**H3.6 can proceed.** We have a hardened, fully read-only view of our dev-mode static builds, unlocking the ability to implement a targeted static build execution command.
