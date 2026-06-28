# Tiny Goblin Academy — H3.4 Read-Only Runtime Status Report

## Overview
Phase H3.4 of the Tiny Goblin Academy Hub focused on implementing a robust, read-only runtime status model. The Hub now possesses the capability to query the underlying filesystem via Tauri's Rust bridge to determine the precise development and build state of each game in the academy's roster.

## Key Accomplishments
1. **Rust Backend Commands (`hub/src-tauri/src/lib.rs` & `manifest.rs`)**
   - Implemented `get_runtime_status` to report the global hub mode (e.g., "developer").
   - Implemented `list_game_statuses` and `get_game_status(game_id)` to dynamically compute game states without requiring broad filesystem permissions on the frontend.
   - Rust now parses `manifests/academy.games.json` directly to map paths and check for `package.json`, `node_modules`, `dist` directories, and `dev` scripts.
   
2. **TypeScript Models (`hub/src/types/RuntimeStatus.ts` & `tier1Roster.ts`)**
   - Mapped Tauri's JSON payload securely into TypeScript interfaces.
   - Adjusted `tier1Roster` type signatures to allow static metadata to safely merge with dynamic runtime status metadata.

3. **React UI Integration (`HubShell.tsx`, `GameCard.tsx`, `GameDetailPanel.tsx`)**
   - `HubShell` performs a read-only query against the Tauri bridge on mount and merges the dynamic response with the static `tier1Roster`.
   - `GameCard` displays clear visual badges (chips) such as `Listed`, `Workspace Member`, `Source Available`, `Static Build Available`, `Not Built`, and `Production Install: Future`.
   - `GameDetailPanel` provides a detailed diagnostic breakdown of the game's state (Dependencies Installed, Playable Mode, etc).

## Compliance with Doctrine
- **No Cursed Goblin Buttons:** The implementation is strictly read-only. We did not introduce any hidden commands to `npm install` or `npm run build`. 
- **Filesystem Security:** The Tauri UI side requires no elevated file capabilities because the Rust process manages the specific manifest paths internally.
- **Strict Separation:** Dev Mode (source availability and runnable state) and Production Mode (Cave-installed artifacts) are clearly distinct fields in the data model.

## Next Steps (H3.5+)
With the read-only contract implemented and validated, the foundation is set to begin building the Launcher/Runtime Bridge execution behaviors in H3.5. We will now have safe, typed inputs indicating whether a game can actually be launched.
