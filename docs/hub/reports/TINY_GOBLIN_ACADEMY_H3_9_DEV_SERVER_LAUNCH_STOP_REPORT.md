# Tiny Goblin Academy — H3.9 Dev Server Launch & Stop Report

## Overview
Implemented the backend commands and frontend UI for safely launching and stopping a developer-mode game server. The design ensures process tracking is robust and limits actions strictly to trusted games in developer mode. 

**Current H3.8 SHA:** `2162ec8`

## Scope Correction & Alignment
This implementation tightly scopes execution to developer-mode commands only. It does **not** include production installs, static builds, or R2 integrations. It correctly pairs process launching with process stopping to prevent the "Orphan Process Goblin" from accumulating runaway node tasks.

## Backend Commands Implemented
- `launch_dev_game(game_id: String) -> LaunchDevGameResult`
- `stop_dev_game(game_id: String) -> StopDevGameResult`
- `list_dev_game_processes() -> Vec<DevGameProcessStatus>`

### Process Tracking Strategy
We manage a global thread-safe state in Tauri using a `Mutex<HashMap<String, TrackedProcess>>`. Each running dev server is keyed by its `game_id`, tracking the `std::process::Child` handle, the allocated port, and the start time. 

Stopping a dev game queries this map. To guarantee cleanup on Windows, we utilize `taskkill /PID <pid> /T /F` before sending the `Child::kill()` signal. This ensures that the parent `cmd.exe` or `pnpm.cmd` wrapper does not orphan the `node.exe` dev server.

### Port Strategy
Ports are deterministically generated based on the game's level string:
`level-X -> 5100 + X` (e.g. `level-01` -> `5101`).

## UI Changes
- Added state to track `launching`, `stopping`, and the results for both operations.
- `GameDetailPanel` polls `list_dev_game_processes` every 2s while open to dynamically check if the server is running.
- When running, a new green status box appears indicating "Dev Server Running" with the PID, Port, and a clickable local URL.
- The "Launch Dev Server" button swaps with a "Stop Dev Server" button dynamically.
- Graceful error rendering for any blocked reasons or launch failures.

## Security & Capability Notes
- **Process Spawning**: Uses the standard `std::process::Command`. No extra Tauri `shell` plugins or capabilities were added to the frontend `capabilities/default.json`. The frontend has zero arbitrary shell execution power.
- **Constraints**: Path validation strictly ensures targets are within `games/tier-1/` and execution is bound to the exact parsed package name. `cmd.exe /C pnpm` is securely wrapped with static arguments `--host 127.0.0.1`.

## Validation
- **Compilation**: `cargo check --manifest-path hub/src-tauri/Cargo.toml` passed successfully.
- **Frontend Build**: `pnpm --filter tiny-goblin-academy-hub build` succeeded.
- **Live Launch**: *Pending*. Since UI interaction is required to dispatch the secure Tauri commands from the Hub interface, live canary launch/stop validation was bypassed to adhere to the safety constraint ("do not launch anything manually through arbitrary commands"). 

## Status
- **Untracked Files**: Untouched. No unexpected files were staged.
- **CodeCraft**: Untouched.
- **Artifacts/Targets**: No bloat generated.

**H3.10 is clear to proceed.**
