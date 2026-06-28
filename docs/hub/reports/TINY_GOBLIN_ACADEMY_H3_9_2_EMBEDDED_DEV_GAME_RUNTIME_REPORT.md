# Tiny Goblin Academy — H3.9.2 Embedded Dev Game Runtime Report

## Overview
This pass solves the "random terminal goblin" problem by fully embedding the dev server execution and the game preview inside the Tauri application. When a developer launches a game, it now seamlessly loads the dev server's localhost URL inside a dedicated webview rather than isolating the experience in external terminals.

**Current H3.9.1 SHA:** `cd97351`

## Problem Solved
Prior to this pass, clicking "Launch Dev Server" simply spawned the Vite server through standard process execution. On Windows, this meant a visible `cmd.exe` or `node.exe` window was popping up, and the user had to manually open a browser to see the game. This broke the intended launcher immersion and did not actually let the user "launch the game" inside the Hub.

## Implementation Details

### Terminal Popup Fix (`lib.rs`)
- On Windows, the process execution now uses `std::os::windows::process::CommandExt`.
- The `CREATE_NO_WINDOW` flag (`0x08000000`) is injected into the command creation.
- The `std::process::Command` remains securely handled by the backend with no arbitrary shell exposure to the frontend, but now operates completely silently.

### Runtime View (`DevGameRuntimeView.tsx` & `HubShell.tsx`)
- Added a new React component `DevGameRuntimeView` that acts as an overlay/replacement for the Hub dashboard.
- The state `ActiveDevGameRuntime` captures the `url`, `pid`, `port`, and `gameId` returned from the successful launch payload.
- This view contains a top bar with the game title, connection info, and a prominent red `Close Game / Return to Academy` button.
- The center of the view is an `iframe` pointing at the localhost `url` returned by the backend.

### Launch / Return Flow (`GameDetailPanel.tsx`)
- Renamed the launch button to `Launch Dev Game` to emphasize it's starting the actual game view, not just a raw background server.
- Upon a successful `launch_dev_game` call, `GameDetailPanel` triggers an `onLaunchSuccess` callback.
- `HubShell` catches this callback, sets the `activeRuntime`, and transitions away from the roster into the full-screen iframe view.
- Clicking `Close Game` triggers `stop_dev_game(gameId)`, cleans up the active process, nullifies the frontend state, and immediately drops the user back to the Hub Dashboard exactly where they left off.

## Validation
```powershell
cargo check --manifest-path hub/src-tauri/Cargo.toml
pnpm --filter tiny-goblin-academy-hub build
pnpm run hub:tauri:build
```
- All builds succeeded.
- The `app.exe` was fully re-packaged.

## Security & Scoping
- **CodeCraft Untouched:** No native modules or production dependencies were affected.
- **Production Ignored:** Production actions remain explicitly mocked/disabled and no artifact building was added.
- **Untracked Files:** Untouched. No target bloat generated or committed.

## Live Status
*Pending graphical UI verification.* Kryssie is cleared to execute the live launch manually to confirm the `iframe` correctly hooks the silent dev server. Assuming the test passes and the orphan check (`netstat -ano | findstr :<trusted-port>`) clears, the Dev Mode Launcher is officially end-to-end complete!
