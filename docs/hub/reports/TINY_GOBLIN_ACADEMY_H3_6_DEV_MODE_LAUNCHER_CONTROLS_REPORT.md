# Tiny Goblin Academy H3.6 - Dev Mode Launcher Controls Report

## Base Context
* **Current H3.5 Commit SHA**: `1f0883f feat: harden dev-mode build status detection`

## Corrected H3.6 Scope
H3.6 refines the Hub's action vocabulary by explicitly separating Developer Mode actions (source-driven dependency installation and dev server launches) from Production Mode actions (playable artifacts, Butler caves, and built game launches). H3.6 establishes the UI skeleton and control contract for these buttons but implements zero executable behaviors.

## Dev Mode Button State Rules
Developer mode actions assume the existence of source code.
* **Install Deps**: Enabled if `sourceDirectoryExists` is true and `nodeModulesExists` is false.
* **Uninstall Deps**: Enabled if `nodeModulesExists` is true.
* **Launch Dev Server**: Enabled if `nodeModulesExists` is true and `hasDevScript` is true.
* **Launch Blocked Reason**: Dynamically updates to explain why the dev server cannot be launched (e.g., "Source code missing", "Dependencies not installed", "No dev script found in package.json").

## Production Mode Button State Rules
Production mode actions assume the presence of pre-compiled playable artifacts, completely ignoring developer tools.
* **Install**: Disabled (Future).
* **Update**: Disabled (Future).
* **Launch**: Disabled (Future).
* **Action Blocked Reason**: "Production mode not implemented" for all production-related interactions at this stage.

## Fields Added/Refined
The `GameStatus` Rust struct and `RuntimeStatus.ts` TypeScript models were updated to include these explicit fields:
```json
// Dev Action Model
"devLaunchAvailable": boolean,
"devInstallDepsAvailable": boolean,
"devUninstallDepsAvailable": boolean,
"devLaunchBlockedReason": string | null,

// Prod Action Model
"productionInstallAvailable": boolean,
"productionUninstallAvailable": boolean,
"productionLaunchAvailable": boolean,
"productionUpdateAvailable": boolean,
"productionActionBlockedReason": string | null
```

## UI Changes
`GameDetailPanel.tsx` now separates buttons into two groups: `Developer Actions` and `Production Actions`.
* The Dev button group lists `Install Deps`, `Uninstall Deps`, and `Launch Dev Server` — with placeholders `(Coming H3.7)` in their labels to signal their future implementation.
* The Prod button group lists `Install`, `Update`, and `Launch` — with placeholders `(Future)` in their labels.
* Blocked reasons dynamically render below the buttons if conditions aren't met, explaining explicitly why a button is disabled.

## Future H3.7 Command Candidates
The following Tauri commands are intended for the H3.7 implementation phase:
```rust
install_dev_dependencies(gameId)
uninstall_dev_dependencies(gameId)
launch_dev_game(gameId)
```
**Constraints for H3.7**:
* Operates strictly on a known `gameId` matched against the `tier1Roster.ts` manifest.
* No arbitrary command strings or directory paths.
* Must require explicit UI confirmation before mutating the disk (e.g., executing `pnpm install` or `rimraf node_modules`).

## Validation
```powershell
cargo check --manifest-path hub/src-tauri/Cargo.toml
pnpm --filter tiny-goblin-academy-hub build
pnpm run hub:tauri:build
```
* **Status**: Passed. UI compiles cleanly. Tauri builds without errors (excluding the known `build_status` unused assignment warning from H3.5).

## Security & Capability Notes
* **Zero mutations**: No code for spawning processes or deleting folders exists in the Hub.
* **No `pnpm install`**: The Hub cannot install dependencies.
* **No `rimraf`**: The Hub cannot delete `node_modules`.
* **No production assumptions**: The production buttons exist strictly as disabled skeletons.

## Confirmations
* I confirm that no install, uninstall, launch, update, or build behavior was added to the application.
* I confirm that no untracked files were deleted, moved, or staged. The repository root hygiene remains pristine.
* I confirm that CodeCraft Native was not touched.

## Next Steps
H3.6 is complete. The Hub is now structurally prepared to accept explicit dev-mode actions. 
H3.7 may proceed.
