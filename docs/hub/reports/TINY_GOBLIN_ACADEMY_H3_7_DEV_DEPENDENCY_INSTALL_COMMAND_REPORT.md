# Tiny Goblin Academy H3.7 - Dev Dependency Install Command Report

## Base Context
* **Current H3.6 Commit SHA**: `9550f30 feat: add dev mode launcher control skeleton`

## H3.7 Scope
H3.7 implemented the first true dev-mode mutation for the Hub: installing dev dependencies using `pnpm --filter <game> install`. The command was implemented safely by extracting package names securely from `package.json` and constraining execution to the workspace root.

## Result Type
Added `InstallDevDependenciesResult` to Rust and TypeScript to pass structured stdout/stderr and exit codes back up to the UI.

## Backend Changes
* Added `install_dev_dependencies` handler in `lib.rs`.
* Removed unused `build_status` mut assignment warning.

## UI Changes
* `GameDetailPanel.tsx` now calls `handleInstallDeps` on button click and renders an explicit log block displaying the process stdout/stderr in real-time or upon completion.
* UI refreshes `GameStatus` dynamically via `onGameUpdate` up to `HubShell`, updating dependent buttons (e.g., Launch Dev Server).

## Validation
* Passes `cargo check`.
* Passes `pnpm --filter tiny-goblin-academy-hub build`.
* Passes `tauri build`.

## Security & Capability Notes
* Backend spawns a new process for `pnpm install` but restricts arguments to known constants and manifest paths. No arbitrary paths can be executed.

## Next Steps
Proceeding to H3.8 for Dev Dependency Uninstall.
