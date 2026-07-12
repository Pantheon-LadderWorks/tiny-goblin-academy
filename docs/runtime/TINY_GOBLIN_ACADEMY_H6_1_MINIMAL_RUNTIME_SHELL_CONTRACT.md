# Tiny Goblin Academy — H6.1 Minimal Runtime Shell Contract + Stale Manifest Path Cleanup

## Purpose

H6.1 is the first runtime/code bridge after the H6.0 planning pass.

It does not migrate Button Goblin Clicker yet. It establishes the shared Academy runtime shell contract, adds the first top-bar overlay controls, and fixes stale active manifest imports so future visual integration starts from current shelves instead of pre-H5 flat paths.

## Relationship To H6.0

H6.0 decided:

- Academy identity stays.
- Permanent side rails leave later.
- Ledger becomes button + `L`.
- Help becomes modal.
- Debug becomes Dev overlay.
- Player-facing data becomes in-stage HUD.
- Controls are input surfaces, not debris.
- UI can be asset-backed, code-native, or hybrid.

H6.1 implements the shell-level part of that decision without changing individual game interiors.

## Runtime Files Changed

Changed runtime/source files:

- `hub/src/components/DevGameRuntimeView.tsx`
- `hub/src/styles/hub.css`
- `hub/src/data/tier1Roster.ts`
- `hub/src/data/hubIcons.ts`
- `games/tier-1/08-one-room-platformer/src/main.ts`

## Minimal Top Bar Contract

The dev runtime view now exposes a compact top-bar action set:

```text
Tiny Goblin Academy / Current Game / Dev Mode / URL    [Ledger L] [Help] [Dev] [Close]
```

This is a contract layer, not the final polished UI.

## Overlay Contract

The shell now owns three overlay surfaces:

1. `Ledger`
2. `Help`
3. `Dev`

The overlays are intentionally lightweight.

### Ledger

The Ledger opens from:

- the top-bar `Ledger` button;
- the `L` keyboard shortcut.

Current boundary:

- The shell can open the Ledger surface.
- Per-game internal ledgers are not migrated yet.
- Games may still render their existing internal ledger until their H6 migration lane.

### Ledger Hydration Contract

The Academy shell owns the shared Ledger surface, but individual games own the events that fill it.

Future game migrations should use an explicit game-to-shell event bridge:

```text
game runtime
  emits action/session events
    ↓
Academy shell
  receives current active-game ledger events
    ↓
Ledger modal
  renders the active game session log
```

Boundary:

- the shell must not invent game ledger entries;
- the active loaded game determines what appears in the current Ledger session;
- a future global/session-history view must be a separate explicit feature;
- raw session events may feed Ledger and Dev surfaces without automatically becoming persistent progression.

Examples:

```text
Button Goblin Clicker:
  Bonked goblin.
  Earned coin.
  Bought Bonk Stick.

One-Room Platformer:
  Run started.
  Jumped.
  Hit spikes.
  Reached goal.
```

Tiny rule:

```text
Shell owns the Ledger surface.
Games own the Ledger events.
The Academy decides later what, if anything, becomes saved progression.
```

### Help

The Help surface is the future home for:

- objectives;
- controls;
- rules;
- accessibility hints.

It does not yet pull structured help data from individual games.

### Dev

The Dev surface is the future home for:

- position;
- velocity;
- grounded flags;
- runtime flags;
- manifest/source IDs;
- process/runtime metadata.

H6.1 only proves the shell surface and shows existing runtime metadata.

## Stale Manifest Path Cleanup

H6.1 fixes active imports that still pointed at pre-H5 flat manifest paths.

Fixed:

```text
hub/src/data/tier1Roster.ts
  ../../../manifests/academy.games.json
  → ../../../manifests/academy/core/academy.games.json

hub/src/data/hubIcons.ts
  ../../../manifests/hub.icons.json
  → ../../../manifests/academy/hub/hub.icons.json

games/tier-1/08-one-room-platformer/src/main.ts
  ../../../../manifests/academy.platformer-construction-pieces.regions.json
  → ../../../../manifests/academy/games/one-room-platformer/academy.platformer-construction-pieces.regions.json

games/tier-1/08-one-room-platformer/src/main.ts
  ../../../../manifests/academy.platformer-goblin-player.animations.json
  → ../../../../manifests/academy/creatures/academy.platformer-goblin-player.animations.json
```


## H6.1A Tauri Backend Manifest Path Correction

The H6.1A diagnostic found a second stale path in the Tauri backend.

The frontend roster imports were corrected in H6.1, but the Rust backend still used the old flat roster path for workspace-root discovery and manifest loading. That meant a freshly rebuilt app would still fail to rediscover the repo after the H5.91 manifest shelf move.

Corrected file:

```text
hub/src-tauri/src/lib.rs
```

Old path:

```text
manifests/academy.games.json
```

New authoritative path:

```text
manifests/academy/core/academy.games.json
```

Implementation:

```rust
const ACADEMY_GAMES_MANIFEST_PATH: &str = "manifests/academy/core/academy.games.json";
```

The shared constant is now used by:

- `get_workspace_root()` current-directory ancestor discovery;
- `get_workspace_root()` executable-relative ancestor discovery;
- `load_manifest()`.

Verification:

- Active source search for the old path under `hub/src`, `hub/src-tauri`, and `games/tier-1` returned zero hits.
- The new authoritative manifest exists.
- All ten game `sourcePath` folders resolve from the repo root.
- All ten game `package.json` files resolve from the repo root.

The existing release `app.exe` is still stale and must be rebuilt after human-operated root workspace repair and development testing.

## H6.1B Academy-Owned Dev Server Lifecycle Fix

H6.1B addresses the orphaned dev-server failure found during dependency repair.

Observed root cause:

```text
app.exe launched One-Room Platformer
→ backend spawned cmd / pnpm / cmd / node-vite process tree
→ user closed app.exe with the red X instead of Close Game / Return to Academy
→ backend process registry disappeared with app.exe
→ One-Room Platformer Vite descendants remained alive on port 5108
→ stale processes held workspace files and blocked root pnpm install
```

One-time recovery was performed only against proven TGA-owned processes:

```text
cmd.exe PID 1916
  pnpm --filter tga-08-one-room-platformer exec vite --host 127.0.0.1 --port 5108 --strictPort

node.exe PID 20828
cmd.exe PID 20804
node.exe PID 6564
node.exe PID 24024
app.exe PID 17940
```

No unrelated `node.exe` processes were intentionally terminated.

Permanent behavior added in `hub/src-tauri/src/lib.rs`:

- each launched game receives an Academy-owned process group;
- on Windows, the process group is backed by a Job Object configured with `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`;
- the spawned game launcher process is assigned to that job;
- normal Close Game cleanup terminates the owned group and reaps the tracked child;
- red-X window close now prevents immediate close when games are active, runs backend `stop_all_dev_games`, then exits;
- application-level `ExitRequested` uses the same cleanup path as a fallback;
- `RunEvent::Exit` performs a final idempotent cleanup pass;
- process cleanup remains scoped to Academy-tracked game processes and does not kill unrelated Node processes by executable name.

Dependency repair after orphan cleanup:

```text
pnpm install --ignore-scripts
```

Result:

```text
root workspace install completed successfully
hub/node_modules/.bin/vite.cmd exists
hub/node_modules/.bin/tauri.cmd exists
all ten games/tier-1/*/node_modules/.bin/vite.cmd links exist
package.json / pnpm-workspace.yaml / pnpm-lock.yaml / hub/package.json diffs remain empty
```

Rust validation:

```text
cargo check
```

Result: passed from `hub/src-tauri`, using the project-local Rust toolchain and D-drive target cache. Cargo emitted only hard-link fallback warnings for the D-drive incremental cache.

Human review still required:

- run the Tauri dev Academy;
- launch One-Room Platformer;
- close via Close Game / Return to Academy and verify port 5108 releases;
- relaunch One-Room Platformer;
- close the main Academy window with the red X while a game is running;
- verify `app.exe` exits and no Academy-owned pnpm/node/Vite descendants remain;
- verify unrelated Node processes are not killed.

H6.1B is not committed until red-X human testing passes.

## H6.1C Runtime Status Loading Guard

H6.1C addresses a UI confusion found during the first Tauri dev review.

Observed behavior:

```text
The detail modal showed static manifest identity for Button Goblin Clicker,
but backend-derived fields displayed as missing:

Source Directory: Missing
Workspace Member: No
Package.json: Missing
Dev Script: No
Developer Actions: Source missing
```

At the same time, static compatibility fields still showed:

```text
Playable Available: Yes
Playable Mode: dev
```

Root cause:

The frontend merged static roster data with backend runtime status when available, but the detail modal did not distinguish between:

- backend has confirmed source is missing; and
- backend status has not loaded yet for this selected game.

H6.1C adds a frontend `runtimeStatusLoaded` marker during roster/status merge. The detail modal now shows `Checking...` / `Checking runtime backend status before enabling dev actions` until live backend status is present, instead of presenting static fallback fields as confirmed source-missing truth.

H6.1C also fixes the `.launch-btn` CSS so enabled dev-launch buttons look enabled and disabled future-production buttons look disabled.

Mode visibility contract:

```text
Development mode:
  show source/dependency/dev-server controls
  hide Production Actions entirely

Production mode:
  hide source/dependency/dev-server controls
  show only production install/update/launch surfaces appropriate to packaged distribution
```

H6.1C applies the development-mode half of this contract now: because the current runtime mode is `developer`, the detail modal no longer renders future Production Actions beside Developer Actions. The production implementation remains future work.

Clarification:

When `pnpm run hub:tauri:dev` logs a path like:

```text
D:/DevCache/Rust/targets/tiny-goblin-academy/debug/app.exe
```

that is the normal Tauri development executable produced by `tauri dev`, not a production release build.

## H6.1D exFAT-Compatible Rust Incremental Policy

H6.1D applies the approved TGA-specific Rust storage policy after the Omega audit follow-up.

Storage findings:

```text
C: NTFS, approximately 9.87 GB free during audit
D: exFAT, approximately 1.38 TB free during audit
D:\DevCache\Rust\targets\tiny-goblin-academy: approximately 4.98 GB
D:\DevCache\Rust\targets\tiny-goblin-academy\debug\deps: approximately 2.79 GB
D:\DevCache\Rust\targets\tiny-goblin-academy\debug\incremental: approximately 0.63 GB
D:\DevCache\Rust\targets\tiny-goblin-academy\debug\build: approximately 0.47 GB
C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\hub\src-tauri\target: approximately 2.31 GB old ignored target cache
```

Doctrine:

```text
source code and images remain on C
heavy Rust target/build artifacts remain on D when exFAT safely supports them
do not move the complete Cargo target tree back to C
disable only the incremental compilation behavior that expects unsupported hard-link semantics
do not globally alter Rust
do not delete existing caches yet
```

Applied project-local config:

```toml
[build]
target-dir = "D:/DevCache/Rust/targets/tiny-goblin-academy"
incremental = false
```

Changed file:

```text
hub/src-tauri/.cargo/config.toml
```

Scope:

- global `CARGO_HOME` was not changed;
- global `RUSTUP_HOME` was not changed;
- global `CARGO_TARGET_DIR` was not changed;
- `Cargo.toml` and `Cargo.lock` were not changed;
- package files and lockfiles were not changed;
- no Rust cache folders were moved or deleted.

Verification:

```text
cargo metadata target_directory:
D:/DevCache/Rust/targets/tiny-goblin-academy

cargo check:
passed

cargo check duration:
115.17 seconds

second warm cargo check duration:
39.82 seconds

hard-link fallback warning:
absent
```

The existing `debug/incremental` directory remains physically present at approximately 643.6 MB. It is cleanup-pending after human review, not deleted in H6.1D.

Browser/Tauri boundary:

```text
localhost:5173 in a normal browser is the Vite frontend preview and cannot call the Tauri backend.
The Tauri debug app.exe is the backend-connected development host.
Clicking a card in the browser does not trigger Cargo compilation.
```

Human review still required:

- first and second Tauri development launch timing;
- confirmation that the debug `app.exe` launches automatically without card interaction;
- confirmation that Developer Actions appear only when backend status exists;
- confirmation that Production Actions remain hidden in development mode;
- red-X lifecycle test while One-Room Platformer is running;
- confirmation that port 5108 is released;
- confirmation that unrelated Node processes remain alive.

Review result:

```text
Human Tauri review passed.
```

## Future Stateful Academy Progression Note

H6.1 preserves the current launcher/runtime boundary, but it records one future architecture recovery note from Kryssie and Ace:

```text
stateless launcher shell
≠
stateful Academy progression layer
```

The Academy may later evolve beyond a stateless launcher into a validated meta-progression system where some games generate resources/progression and other games consume them.

Recovered doctrine:

```text
Games report what happened.
The Academy decides what it means.
The save file records what survived.
```

Generator/sink concept:

```text
generator games
  create approved resources, tokens, badges, unlock signals, ingredients, or lesson progress

sink games
  consume approved resources for upgrades, crafting, decoration, unlocks, or meta-progression
```

Critical boundary:

- game session events are not automatically persistent save mutations;
- games should not receive unrestricted write access to global Academy save state;
- a future Academy progression service should validate allowed events and convert them into rewards/unlocks;
- persistent save/profile state should be written only after that validation layer approves it.

This note is planning doctrine only. H6.1 does not implement a save system, progression service, generator/sink economy, profile store, or cross-game rewards.

## H6.1 Final Human Review

Human review passed for the H6.1 development runtime shell hardening lane.

Accepted:

- Tauri debug `app.exe` launches automatically during `pnpm run hub:tauri:dev`.
- Ordinary browser preview remains frontend-only / backend-offline as expected.
- Tauri WebView reports backend-connected behavior.
- Developer Actions appear in development mode.
- Production Actions remain hidden in development mode.
- Launch controls no longer visually pretend to be disabled while clickable.
- Help and Ledger are acceptable in the current top-bar utility group.
- Dev remains development-mode-only.
- One-Room Platformer launches successfully.
- Closing the Academy with the red X while a game is running stops the Academy-owned dev-server process tree.
- Port `5108` releases after red-X shutdown.
- No TGA-owned Vite/pnpm orphan remained after review.
- Unrelated Node processes were not terminated.
- TGA Cargo target remains on D.
- Project-local incremental compilation is disabled.
- Cargo hard-link fallback warning is absent.

Design contract result:

```text
H6.1 may keep Ledger, Help, Dev, and Close in the development top bar for now.
Ledger and Help are approved as shared utility affordances.
Dev is development-only.
Future H6 lanes may compact or relocate these controls if the top bar becomes crowded.
```

H6.1 remains a shell-hardening and contract lane. It does not migrate Button Goblin Clicker, implement cross-game progression, approve runtime assets, or begin production distribution.

## What H6.1 Does Not Do

H6.1 does not:

- migrate Button Goblin Clicker into the new shell pattern;
- remove current per-game side panels;
- move One-Room Platformer controls into the stage;
- wire the Button Goblin Clicker background;
- integrate asset-backed HUD frames;
- build the final shared HUD data bridge;
- approve any runtime asset use;
- change package or lock files;
- change PNGs/images.

## Validation Notes

Completed:

- Asset-pipeline provenance validation passed.
- Asset-pipeline smoke check passed.
- Asset-pipeline manifest validation passed.
- H6.1 planning manifest parses.
- Known stale flat manifest import strings no longer appear in `hub/src` or `games/tier-1`.
- H6.1A backend manifest path correction removed the old flat roster path from active `hub/src`, `hub/src-tauri`, and `games/tier-1` source.
- All ten game source paths and package manifests resolve from the authoritative nested roster.
- No package/lock files changed.
- No PNG/image files changed.
- H6.1B `cargo check` passed from `hub/src-tauri`.
- H6.1B root-only `pnpm install --ignore-scripts` completed after orphan process cleanup.
- H6.1D project-local Cargo incremental policy was applied.
- H6.1D `cargo check` passed from `hub/src-tauri`.
- H6.1D `cargo metadata` confirmed the target directory remains on `D:/DevCache/Rust/targets/tiny-goblin-academy`.
- H6.1D hard-link fallback warning was absent.

Build caveat superseded by H6.1B:

Earlier H6.1 diagnostics found the normal pnpm build path blocked before TypeScript/Vite execution because the local workspace dependency install was incomplete/locked. The initial Codex-runtime `pnpm` wrapper attempted an install and aborted without TTY. A system `pnpm install` then failed on Windows with:

```text
EPERM: operation not permitted, unlink '...@rolldown+binding-win32-x64-msvc...\rolldown-binding.win32-x64-msvc.node'
```

H6.1B traced this to orphaned TGA-owned dev-server processes left after closing `app.exe` with the red X. After targeted orphan cleanup, root-only `pnpm install --ignore-scripts` completed successfully. H6.1 did not alter package files or lockfiles.


## Dependency-State Audit After Unauthorized Install Attempt

H6.1 is paused before commit because an unauthorized `pnpm install` was run during validation.

Audit result:

- Tracked dependency definitions are unchanged: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `hub/package.json`, and `games/tier-1/*/package.json` have an empty dependency-file diff.
- The documented architecture remains root/workspace-managed dependencies. W5.1 states that the root lockfile is canonical and that package-level dependency structures are pnpm-managed after root install.
- No package or lockfile mutation was found.
- No dependency cleanup was performed in this audit.
- No dependency hydration command was rerun.
- No dev process was killed.

### Node Modules Topology

Inventory found 13 `node_modules` directories:

| Path | Status | Last write | Created | Notes |
| --- | --- | --- | --- | --- |
| `node_modules` | allowed root workspace dependency structure | 2026-07-10 22:24:26 | 2026-06-26 10:58:54 | contains `.pnpm` and `.pnpm-workspace-state-v1.json` |
| `hub/node_modules` | package-level pnpm/cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` and `.vite-temp` only |
| `games/tier-1/01-button-goblin-clicker/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-27 08:31:44 | contains `.vite` only |
| `games/tier-1/02-potion-sorter/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/03-dice-duel-tavern/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/04-card-goblin-duel/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/05-dungeon-key-run/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/06-tiny-farm-day/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/07-pet-campfire/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/08-one-room-platformer/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/09-top-down-slime-quest/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `games/tier-1/10-mini-settlement-sim/node_modules` | package-level cache structure, not independent dependency ownership | 2026-07-10 22:24:27 | 2026-06-26 10:59:06 | contains `.vite` only |
| `node_modules/.pnpm/@rolldown+binding-win32-x64-msvc@1.1.3/node_modules` | allowed root `.pnpm` internal structure | 2026-06-26 10:58:55 | 2026-06-26 10:58:55 | internal pnpm package layout |

No inspected `node_modules` directory was a junction or symlink/reparse point.

The package-level `node_modules` directories were not newly created by H6.1; their creation timestamps predate this attempt. Their last-write timestamps were touched during the unauthorized install attempt. Because they contain only Vite cache folders and no independent package dependency payload, the audit did not remove them.

Unexpected newly-created per-game dependency caves: **0**.

Unexpected independent per-game dependency payloads found: **0**.

Pre-existing package-level cache/pnpm structures touched during the attempt: **11** (`hub` plus 10 Tier 1 games).

### Rolldown Native Binding Finding

The prior failed install reported an EPERM unlink failure against:

```text
node_modules/.pnpm/@rolldown+binding-win32-x64-msvc@1.1.3/node_modules/@rolldown/binding-win32-x64-msvc/rolldown-binding.win32-x64-msvc.node
```

Audit finding: the file exists and was readable with exclusive read access during the audit. No active lock was proven during this pass. Several `node.exe` processes were observed, but none were killed or modified.

### Build Validation Status

Build validation is **not claimed** for H6.1 in this pass.

Because the validation environment was touched by an unauthorized install attempt, build validation remains blocked pending review or an explicitly approved dependency recovery/build command. The non-mutating asset-pipeline validations are the only validations rerun in this audit.

## Human/Product Review Notes

Review should focus on:

- whether the top-bar button grouping is the right first shell contract;
- whether `Ledger + L` feels like the right default;
- whether Help and Dev placeholder copy is acceptable for the bridge lane;
- whether the overlay style is good enough to proceed to Button Goblin migration;
- whether build validation should be rerun after local dev processes release the locked dependency file.

## Recommended Next Step

**H6.2 — Button Goblin Clicker Shell Migration**

H6.2 should migrate Button Goblin Clicker out of its permanent side-panel layout and into the new shell pattern while preserving the working click loop.

Tiny bridge law:

```text
H6.0 wrote the shell law.
H6.1 installs the hinges.
H6.2 moves the first goblin through the door.
```


## Tauri Launcher Source Availability Diagnostic

A follow-up diagnostic was run before commit after the existing Tauri `app.exe` reported that game source files were unavailable.

### Error-condition trace

The exact user-facing lowercase text `source files not available` was not found as a literal source string in active repository files. The active launcher code uses adjacent status language:

```text
GameDetailPanel.tsx
  Source missing. Dev actions unavailable.

hub/src-tauri/src/lib.rs
  Source code missing
  Source directory does not exist
  Failed to load manifest
```

The runtime data flow is:

```text
hub/src/data/tier1Roster.ts
  imports manifests/academy/core/academy.games.json into the frontend bundle

HubShell.tsx
  calls get_runtime_status and list_game_statuses through Tauri
  merges backend GameStatus records into the static roster

hub/src-tauri/src/lib.rs
  get_workspace_root() searches for manifests/academy.games.json
  load_manifest() reads manifests/academy.games.json
  compute_game_status() joins workspace root + game source_path
  list_game_statuses() returns sourceDirectoryExists/sourceAvailable/devLaunchAvailable

GameCard/GameDetailPanel
  display Source Ready / Source missing / Launch Blocked based on those fields
```

### Root-cause classification

Result: **multiple-causes**.

1. **stale-app-build**: the running executable was identified as:

```text
C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\hub\src-tauri\target\release\app.exe
```

The file was created on 2026-06-27 and last written on 2026-06-29. It predates the H5.91/H5.93/H6.1 manifest path and hub import changes.

2. **packaged-path-resolution-bug / stale backend manifest path**: H6.1A corrected the live Rust backend source so it no longer searches for or loads the old flat manifest path:

```text
manifests/academy.games.json
```

That file no longer exists. H6.1A now uses the current authoritative file:

```text
manifests/academy/core/academy.games.json
```

The backend root-discovery/load bug is now corrected in the working tree, but the stale June 29 executable still requires a rebuild after root workspace readiness is restored.

3. **incomplete-workspace-toolchain**: root workspace dependency state is incomplete. Checked `.bin` links for `vite`, `tsc`, and `tauri` were absent. Root `node_modules/.pnpm` contained only the Rolldown native binding package during this audit. This explains the direct game-folder failure:

```text
'vite' is not recognized as an internal or external command
```

This is not authorization for a game-local install. Any repair must be root/workspace-only and explicitly approved.

### Authoritative path checks

The current authoritative manifest source paths resolve from repository root for all ten games:

```text
manifests/academy/core/academy.games.json exists: yes
all ten games/tier-1/* source directories exist: yes
all ten package.json files exist: yes
all ten package.json files expose a dev script: vite
```

The H6.1 TypeScript import fixes point to existing files:

```text
manifests/academy/core/academy.games.json
manifests/academy/hub/hub.icons.json
manifests/academy/games/one-room-platformer/academy.platformer-construction-pieces.regions.json
manifests/academy/creatures/academy.platformer-goblin-player.animations.json
```

The old flat paths are absent:

```text
manifests/academy.games.json: missing
manifests/hub.icons.json: missing
```

### Rebuild decision

A rebuild is required, and now depends on the corrected backend path plus root workspace readiness.

Required order:

1. keep the H6.1A Tauri backend workspace-root / manifest-load path correction in `hub/src-tauri/src/lib.rs`;
2. receive explicit approval for a root-only workspace dependency repair if build tools remain missing;
3. run Tauri dev review from repository root;
4. only after dev review passes, rebuild/package the Tauri app.

### Direct game command explanation

The command was run from an individual game folder:

```text
games/tier-1/01-button-goblin-clicker
pnpm run dev
```

The failure means the current workspace toolchain cannot resolve Vite from that package context. It does not mean Button Goblin Clicker needs an independent install. The architecture remains root/workspace-managed dependencies only.

### H6.1 status after diagnostic

H6.1 should remain uncommitted. The small Tauri backend path fix is present in the working tree. Runtime code review is now blocked pending explicit root workspace dependency repair and human Tauri launcher testing before build/dev validation can be claimed.
