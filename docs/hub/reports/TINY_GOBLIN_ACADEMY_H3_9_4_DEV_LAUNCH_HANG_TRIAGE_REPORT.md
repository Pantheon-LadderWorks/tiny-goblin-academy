# Tiny Goblin Academy H3.9.4 — Dev Launch Hang Triage Report

## Context & Issue
In the H3.9.3 commit (`97a4e7f`), clicking "Launch Dev Game" caused the Tauri desktop app to become entirely unresponsive, requiring a forceful manual close. An audit was requested to identify the root cause before introducing new launcher features (static artifacts and production pathways are strictly deferred).

## Root Cause Analysis
During `launch_dev_game`, a `std::sync::MutexGuard` for the global process tracking state (`state.processes.lock().unwrap()`) was acquired at the beginning of the command execution and held until the end. 

The command explicitly spawns the dev server and then polls for readiness over 15 seconds (using `std::thread::sleep` and TCP connect) **while holding the lock**. Concurrently, the frontend UI initiates periodic background checks for process status (via `list_dev_game_processes` / `get_game_status`), which also attempt to acquire the same mutex. This led to a classic lock starvation/deadlock scenario on the backend that manifested as a total freeze in the Tauri IPC layer, halting all frontend activity waiting on `invoke` promises.

## Patches Applied
1. **Mutex Lock Scoping**:
   - Refactored `launch_dev_game` in `hub/src-tauri/src/lib.rs` to tightly scope the mutex acquisition. The lock is now acquired solely to read the pre-existing state (and immediately dropped) and then briefly re-acquired *after* the dev server is confirmed ready to register the tracked process.
2. **Frontend Recovery**:
   - Added a 20-second timeout mechanism to the frontend `invoke` call via `Promise.race` inside `GameDetailPanel.tsx`. If the backend IPC ever stalls for > 20s, the frontend resolves with a safe timeout error instead of freezing the UI.
   - The UI correctly displays "Launching..." during the wait and gracefully reverts back to the standard button layout displaying the error cleanly without orphaned iframes.

## Validation Results
- `cargo check --manifest-path hub/src-tauri/Cargo.toml`: Success
- `pnpm --filter tiny-goblin-academy-hub build`: Success
- `pnpm run hub:tauri:build`: Success

**Manual Desktop Validation Parameters**:
- App does not freeze when launching.
- No visible terminal windows.
- Dev Game loads correctly within the app UI if successful.
- Clicking "Close Game / Return to Academy" cleanly stops the local server.
- No orphan Node/Vite processes remaining on port 5101 upon closure (`netstat -ano | findstr :5101` shows clear).

## Deferred Items
- Confirmed: **Static build artifact command** has been removed/deferred from the active roadmap. The launcher is not behaving as a CI build runner.
- Confirmed: No production behavior or artifact installation logic was added.
- Confirmed: CodeCraft Native was not touched.
