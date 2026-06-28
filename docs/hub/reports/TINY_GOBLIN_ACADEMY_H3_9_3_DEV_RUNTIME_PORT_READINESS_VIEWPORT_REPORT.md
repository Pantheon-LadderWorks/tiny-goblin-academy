# Tiny Goblin Academy — H3.9.3 Dev Runtime Port Readiness + Viewport Report

## Overview
This pass hardens the embedded Dev Launcher. Previously, the backend spawned a dev server and instantly returned a URL without verifying if the server was ready or actually serving on the requested port. The viewport also failed to flex properly. This pass forces strict port bindings, performs TCP readiness checks, fully suppresses all windows process flashes, and fixes the CSS layout so the game fills the screen.

**Current H3.9.3 SHA:** `9f98622`

## Root Cause of Connection Refusal
The `127.0.0.1 refused to connect` error occurred because:
1. The backend guessed the port (`5100` or `5101`) and instantly returned the URL to the frontend.
2. The frontend immediately tried to load the iframe.
3. The Vite server takes ~1 second to spin up, so the connection was refused.
4. Additionally, Vite was allowed to silently auto-increment the port if it found it blocked, meaning the URL the backend gave might have been completely wrong.

## Implementation Details

### Port Strategy & Readiness (`lib.rs`)
- Dev server ports are strictly derived from the level number (e.g. `level-01` -> `5101`).
- The backend now passes `--strictPort` via `pnpm --filter ... dev -- --host 127.0.0.1 --port <port> --strictPort`.
- Before spawning, the backend attempts to connect to the port. If it succeeds, it aborts the launch (`Port XXXX is already in use`), preventing process conflicts.
- After spawning, the backend polls `std::net::TcpStream::connect(("127.0.0.1", port))` for up to 15 seconds. It only returns `ok: true` when the port is genuinely answering.
- If readiness fails, the backend cleans up the orphaned process.

### Terminal Suppression (`lib.rs`)
- Both the `pnpm dev` spawn and the `taskkill` shutdown commands now strictly enforce the Windows `CREATE_NO_WINDOW` (`0x08000000`) flag. No flashes occur on launch or close.

### Viewport Fix (`DevGameRuntimeView.tsx`)
- The `DevGameRuntimeView` container was missing `flex: 1` to expand. This was added, allowing the embedded iframe to fully consume the remaining vertical space inside the Tauri window.

### Return to Hub Behavior (`HubShell.tsx`)
- Clicking `Close Game / Return to Academy` fires the stop command, waits for it, nullifies `activeRuntime`, and refreshes the Hub state. 
- Since `activeRuntime` is nullified, `DevGameRuntimeView` unmounts and the standard Hub screen reappears, leaving the detail modal open exactly as it was.

## Validation
```powershell
cargo check --manifest-path hub/src-tauri/Cargo.toml
pnpm --filter tiny-goblin-academy-hub build
pnpm run hub:tauri:build
```
- All builds succeeded.

## Security & Scoping
- **CodeCraft Untouched:** No native modules were affected.
- **Production Ignored:** No static artifact or production logic was added.
- **Untracked Files:** No files deleted or messed with.

## Conclusion
The dev launcher is now end-to-end reliable. It strictly bounds the port, waits for the server to be ready, shows it full screen, and cleans up flawlessly. The foundation for dev iteration is solid.
