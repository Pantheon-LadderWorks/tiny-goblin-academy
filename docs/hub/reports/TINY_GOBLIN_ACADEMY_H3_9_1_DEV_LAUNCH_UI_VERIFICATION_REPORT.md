# Tiny Goblin Academy — H3.9.1 Dev Launch UI Verification Report

## Overview
A verification and fix pass was executed to resolve issues encountered in the desktop `app.exe` regarding missing UI for developer actions and improper resolution of workspace roots. The static build and production pathways were explicitly untouched in accordance with the workspace doctrine.

## Stale `app.exe`
The initial check of `app.exe` confirmed that it was over 2 hours old, meaning the desktop app Kryssie originally opened did not include the H3.9 commits. The missing UI for launch controls was partially due to the stale executable.

## Root Resolution Fix
The backend logic (`get_workspace_root` in `hub/src-tauri/src/lib.rs`) originally crawled upwards from `std::env::current_dir()`. However, when `app.exe` is packaged and launched, `current_dir` resolves differently (sometimes to `target/release`), breaking the 2-level upward traversal and failing to find the root manifest. 

**Fix:**
- Updated the path resolution logic to walk upwards dynamically up to 6 levels looking for `manifests/academy.games.json`.
- Added a fallback path checking upward from `std::env::current_exe()` if `current_dir()` resolution fails.
- This ensures `sourceDirectoryExists` reliably returns true in Developer Mode regardless of where the app is invoked.

## UI Changes Made
- Modified `GameCard.tsx` to change the static "Production Install: Future" badge text to a neutral "View Runtime Status". This prevents users from misinterpreting the card-level badge as implying only production actions are available.
- Developer Actions remain grouped together, and if `devLaunchAvailable` is false, the `devLaunchBlockedReason` is clearly displayed.
- Production Actions remain locked to `disabled` future placeholders.

## Validation Commands Run
```powershell
cargo check --manifest-path hub/src-tauri/Cargo.toml
pnpm --filter tiny-goblin-academy-hub build
pnpm run hub:tauri:build
```
- The backend compile was successful and UI properly bundled into the executable.

## Live Test Status
*Pending graphical UI verification.* Since the launch action must originate from the desktop UI to validate properly and avoid unauthorized command execution, Kryssie is cleared to execute the live launch and stop commands manually to confirm.

## Constraints Verified
- **No production logic added**: No install, static artifact build, or R2 behavior was implemented.
- **Untracked files protected**: No random files or artifacts were deleted or staged.
- **CodeCraft untouched**: No native modules were modified.

## Next Steps
The fresh desktop app is available at:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\hub\src-tauri\target\release\app.exe`

Once visual verification confirms Developer Actions correctly appear and Dev Server launch/stop operates correctly on `level-01`, we are clear to proceed to **H3.10 — Static Build Artifact Command**.
