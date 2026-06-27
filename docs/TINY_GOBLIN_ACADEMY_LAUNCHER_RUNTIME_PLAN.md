# Tiny Goblin Academy Launcher / Runtime Plan

## Status

**Planning / No Runtime Implementation Yet**

* The Hub is also expected to act as an installer/catalog surface, not merely a launcher.
* Installation state is separate from roster visibility.
* Games may be visible in the Hub while not installed locally.
* Butler/itch distribution strategy affects launcher/runtime planning.
* Dependency/storage policy (pnpm workspace) is now established.
* Level 1 has been restored.

* The Hub is currently read-only.
* No game launching exists yet.
* No process management exists yet.
* No Tauri shell exists yet.
* No runtime/build/release manifests exist yet.

## Purpose

This document defines the safe path from a read-only Hub to playable access. 

It acts as a doctrine to prevent:
* ghost Vite servers;
* hardcoded local paths;
* accidental process spawning;
* confusing source availability with playable builds;
* pretending dev-mode playability equals distribution readiness.

## Current Hub State

* `manifests/academy.games.json` powers the game roster.
* `manifests/hub.icons.json` powers game card icons.
* validators exist:
  * `scripts/validate-academy-manifest.mjs`
  * `scripts/validate-hub-icons.mjs`
* Hub displays cards/details/icons/status only.
* Launch button remains disabled / not implemented.

## Core State Definitions

* **`sourceAvailable`**: The raw source code exists in the repository. This does *not* mean a playable build exists.
* **`devRunnable`**: The source can be run in a dev environment (e.g., via a Vite dev server), but is not necessarily packaged.
* **`buildAvailable`**: A compiled, static artifact of the game exists.
* **`playableAvailable`**: The game has a known playable access mode according to `playableMode`. In the current manifest, `playableMode: dev` means developer/dev-mode playability only. It does not mean Hub-launchable, packaged, static-build-ready, or distribution-ready. True end-user Hub launchability requires later runtime/build manifest work.
* **`playableMode`**: The context in which the game is running (e.g., Dev, Static Build, Packaged App). Note that playable in dev mode is *not* the same as shipped/distribution-ready.
* **`runtimeManaged`**: A process (like a dev server or Tauri backend) is actively being managed, tracked, and cleaned up by the Hub.
* **`distributionReady`**: The game and its assets are finalized, verified, packaged, and ready for public release.

## Launcher Modes

### Mode 0 — Read-Only Dashboard
**Current state.** 
No launch behavior. Safe.

### Mode 1 — Instructional / Manual Dev Mode
**Future intermediate state.**
Hub may show instructions for how to run a game manually. Hub does not spawn processes. Good for early testing.

### Mode 2 — Static Build Launcher
**Future target state.**
Hub opens/embeds/links to prebuilt static builds. This is the preferred first real launcher mode. Requires verified build artifacts and a runtime/build manifest.

### Mode 3 — Managed Dev Server Launcher
**High risk state.**
Hub starts/stops dev servers. Requires strict port assignment, process tracking, cleanup, timeout handling, and ghost-process prevention. Not allowed until explicitly approved.

### Mode 4 — Packaged App / Tauri Launcher
**Next foundation spike.**
Tauri is the correct foundation for a real install/launch/quit control surface because it provides a native command boundary. The initial Tauri spike (H3.1) should only prove basic backend diagnostic capabilities. Full app packaging policy, runtime manifests, process lifecycle rules, and release planning will follow in later stages.

## Recommended Path

1. Keep current Hub read-only (H2 complete).
2. Complete dependency/storage audit and adopt pnpm workspace (Completed).
3. Rebuild Level 1 and update `academy.games.json` (Completed).
4. Reconcile runtime docs (H3.0 - Current).
5. Initiate Tauri shell spike (H3.1) to establish native command boundary.
6. Verify workspace dependency status from Hub (H3.2).
7. Implement single-game dev launch (H3.3) and clean quit (H3.4).
8. Generalize launch/quit to all games using manifest truth (H3.5).
9. Design runtime/build manifest and static build policies for player mode (H3.6).
10. Delay unmanaged dev server launching permanently. Only managed dev servers behind Tauri are permitted.

## Ghost Process Prevention Rules

For any future process-launching mode, the following rules strictly apply:
* no untracked child processes;
* no loose Vite servers;
* no reused ambiguous ports;
* no launch without manifest entry;
* strict port ownership;
* process PID tracking;
* cleanup on exit;
* visible runtime state in UI;
* failed launch must fail closed;
* no silent background servers.

*(Note: This is future planning only.)*

## Runtime / Build Manifest Preview

*(Note: This is a preview only. Do not implement yet.)*

Possible future path:
`manifests/runtime/academy.runtime.json`

Possible fields:
* `gameId`
* `sourcePath`
* `buildPath`
* `launchMode`
* `devCommand`
* `port`
* `strictPort`
* `processManagedByHub`
* `buildVerified`
* `lastVerified`
* `notes`

## Level 1 Rebuild Relationship (Resolved)

* Level 1 has been successfully rebuilt and acts as the clean test case for restored source and manifest truth.
* Its rebuilt state correctly updates `academy.games.json` (Restored v0.1).

## Levels 2-10 Asset Upgrade Relationship

* Levels 2-10 asset upgrades happen *after* the Level 1 rebuild.
* Each game should get asset integration one at a time.
* Do not bulk-update all games blindly.
* Each upgrade should preserve playable loop behavior.

## Non-Goals

The following are strictly out of scope for this phase:
* no implementation in this phase;
* no Tauri;
* no process spawning;
* no runtime manifest creation;
* no packaging;
* no itch publishing;
* no game code changes;
* no asset integration.

## Open Questions

* Should first launchable mode be static builds only?
* Should the Hub ever manage dev servers?
* Should Tauri wait until all Tier 1 games have upgraded assets?
* Where should static builds live?
* How should builds be validated?
* Should Level 1 rebuild define the first build artifact policy?

## Proposed Next Steps (H3 Ladder)

### H3.0 — Runtime Docs Reconciliation
Current phase. Docs only.

### H3.1 — Tauri Shell Spike
Future explicit approval required. Minimal shell only. Prove Hub frontend can call one safe backend diagnostic command, such as `pnpm --version`. No game launch yet. *No game launch boot screen.*

### H3.2 — Workspace Dependency Status
Future explicit approval required. Check, but do not silently install. Show dependency state. Approved command allowlist only.

### H3.3 — Launch One Game in Dev Mode
Future explicit approval required. Launch exactly one selected game through Tauri-managed process handling. Track port, PID/process handle, status, logs. No ghost Vite servers. *Launching a game may later introduce a game-launch boot screen (trust handshake), but do not implement it before process launch exists.*

### H3.4 — Quit Game / Return to Dashboard
Future explicit approval required. Stop process cleanly. Verify port cleanup. Return to dashboard. *Returning to the dashboard must transition cleanly and avoid a raw dashboard spawn if a game is closing.*

### H3.5 — Generalize All 10
Future explicit approval required. Use manifest/package metadata. Prevent concurrent unmanaged sessions.

### H3.6 — Static Build / Production Launch Planning
Future explicit approval required. Revisit static builds, Butler/itch, installed artifacts, and player mode. No raw pnpm for players.
