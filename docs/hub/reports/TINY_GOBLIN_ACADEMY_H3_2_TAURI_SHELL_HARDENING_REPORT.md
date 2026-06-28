# Tiny Goblin Academy H3.2 - Tauri Shell Hardening & Runtime Hygiene Report

## H3.1 Commit Reference
`82d3a5c feat: add Tauri shell spike for academy hub`

## Commands Run
```powershell
# Preflight checks
cd C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder
git status --short
git log --oneline -n 5
node --version
pnpm --version
cargo --version
rustc --version

# Dependency updates
cd hub
pnpm remove @tauri-apps/api
pnpm add @tauri-apps/api
cd ..

# Validation build
pnpm install --ignore-scripts
pnpm run hub:tauri:build
```

## Dependency Changes
* Moved `@tauri-apps/api` from `devDependencies` to `dependencies` in `hub/package.json` since the frontend bundle consumes it at runtime.
* Left `@tauri-apps/cli` in `devDependencies`.

## Script Changes
* Added `tauri`, `tauri:dev`, and `tauri:build` to `hub/package.json`.
* Added `hub:tauri:dev` and `hub:tauri:build` to the workspace root `package.json` for easy top-level invocation.

## Tauri Capability/Security Review
* Checked `hub/src-tauri/capabilities/default.json`. It only grants `"core:default"`, which provides safe, standard window manipulation features.
* The frontend relies only on the single whitelisted `get_diagnostic_info` command.
* ✅ No shell execution permissions.
* ✅ No arbitrary filesystem permissions.
* ✅ No process spawning permissions.

## Diagnostic UI Changes
* Polished the diagnostic output in `hub/src/components/HubShell.tsx`.
* It now displays as a small, discreet `✓ Tauri bridge online. Platform: windows, Timestamp: [time]` chip. 
* The button explicitly says "Diagnostic: Ping Tauri Bridge" when not yet pinged.
* The UI retains the Hub's aesthetics without looking like a broken or active game launch button.

## Validation Result
The `pnpm run hub:tauri:build` script executed perfectly via the root workspace. It triggered the `beforeBuildCommand` (`pnpm run build`), completed the Vite frontend build, and subsequently compiled the Rust Tauri shell.
The executable `app.exe` and `.msi` / `.exe` bundles were generated successfully in `target/release/`.

## Strict Requirements Confirmation
* ✅ No game launch/install/quit behavior was added.
* ✅ No game-launch boot screen was added.
* ✅ CodeCraft Native was completely untouched and remains isolated.

## Next Steps
The Tauri shell foundation is verified, securely scoped, and well-documented. **H3.3 (Launcher/Runtime Bridge Contract) is fully unblocked and ready to proceed.**
