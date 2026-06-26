# Tiny Goblin Academy Launcher / Runtime Plan

## Status

**Planning / No Runtime Implementation Yet**

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
* **`playableAvailable`**: The game can be launched and played by an end-user from the Hub without dev tools.
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
**Future final state.**
Requires app packaging policy, runtime manifests, process lifecycle rules, and release planning. Not part of current implementation.

## Recommended Path

1. Keep current Hub read-only.
2. Add runtime/build planning docs (this document).
3. Rebuild Level 1 as the first restored game.
4. Create static build expectations for Level 1.
5. Define build artifact location policy.
6. Add a draft runtime/build manifest.
7. Validate runtime/build manifest.
8. Only then consider Hub static-build launch behavior.
9. Delay managed dev server launching until much later, if ever.

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

## Level 1 Rebuild Relationship

* Level 1 rebuild should happen *after* this planning phase.
* Level 1 should become the first clean test case for:
  * restored source;
  * new asset doctrine;
  * manifest truth;
  * eventual build/playable state.
* Level 1 should not require launcher implementation to be rebuilt.
* Its rebuilt state should later update `academy.games.json`.

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

## Proposed Next Step

1. review/approve runtime plan;
2. create Level 1 rebuild plan;
3. rebuild Level 1;
4. update `academy.games.json`;
5. only then approach runtime/build manifest design.
