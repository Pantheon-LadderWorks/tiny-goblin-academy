# Tiny Goblin Academy H3.9.5E: Embedded Runtime Viewport Report

## Objective
Fix the embedded dev game runtime viewport so the loaded game iframe fills the Tauri app cleanly beneath the runtime top bar, without awkward outer scrollbars or clipping.

## Root Cause of Viewport Issue
The `HubShell` and `html, body, #root` structure did not have strict `height: 100%` constraints. `.hub-container` had `min-height: 100vh` and `.hub-shell` had `height: 100vh`. When the `DevGameRuntimeView` tried to expand to fill the available space, the lack of a strict parent container height limit caused the outer Tauri app layout to scroll vertically, preventing the inner iframe from scaling to fit the remaining space cleanly.

Additionally, the `<main className="runtime-content">` wrapper containing the iframe needed `overflow: hidden` and `min-height: 0` to properly contain the iframe inside the flex column without stretching past the viewport.

## Files Changed
* `hub/src/styles/hub.css`:
  * Added `html, body, #root { height: 100%; margin: 0; overflow: hidden; }`
  * Changed `.hub-container { min-height: 100vh; }` to `height: 100%`
  * Changed `.hub-shell { height: 100vh; }` to `height: 100%`
* `hub/src/components/DevGameRuntimeView.tsx`:
  * Added `overflow: 'hidden'` and `minHeight: 0` to the `<main>` wrapper of the iframe.

## Packaged App Validation Result
* **Build**: Successfully rebuilt `app.exe` via `pnpm run hub:tauri:build`.
* **Game Launch**: `Launch Dev Game` correctly opened the Game Launch Boot screen.
* **Game Load**: The game successfully loaded inside the Tauri iframe at `http://127.0.0.1:5101`.
* **Viewport Fix**: The runtime viewport now cleanly fills the app beneath the top bar without outer app scrollbars, and the playable game area is visible and usable.
* **Close/Return**: `Close Game / Return to Academy` works correctly.
* **Orphan Check**: `netstat -ano | findstr :5101` and process checks confirm the server cleans up when closed.
* **Constraints Followed**:
  * No `tauri dev` was used.
  * Static build artifact commands remain retired.
  * Production behavior was not added.
  * CodeCraft was untouched.
