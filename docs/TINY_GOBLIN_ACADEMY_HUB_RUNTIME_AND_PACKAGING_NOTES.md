# Tiny Goblin Academy — Hub Runtime and Packaging Notes

## Purpose

Capture the runtime/package architecture questions that must be answered before building the Tauri hub or restoring Level 1.

## Core Distinction

Source game folders are development artifacts.
Built/installed game bundles are playable runtime artifacts.
The hub should know the difference between “source exists,” “built,” “installed/playable,” and “missing/pending restoration.”

## Current Incident Context

* Level 1 source folder was lost during tier normalization.
* Docs and historical Human Review status survived.
* Level 1 should be restored only after the hub/package architecture is defined.

## Package Management Problem

* Tier 1 currently contains repeated per-game dependency folders and package files.
* That was acceptable for rapid v0.1 prototyping.
* It is not ideal for a hub/distribution product.
* Node dependency bloat should be reduced before adding more games.

## Candidate Architecture

Possible future layout:

```text
ai-game-studio-ladder/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── games/tier-1/
├── hub/
├── packages/academy-shared/
├── scripts/
├── builds/ or dist/ ignored by git
└── installed-games/ ignored by git if generated
```

## Dev Mode vs Player Mode

**Dev mode:**
* can run source games with pnpm/Vite;
* can use capture scripts;
* can use local dev servers.

**Player/distribution mode:**
* should use built static game artifacts;
* should not require Node, pnpm, Vite, or per-game `node_modules`;
* should avoid ghost ports and dev-server assumptions.

## Hub Manifest Needs

Define a future manifest concept:

* `id`
* `title`
* `tier`
* `sourcePath`
* `buildPath`
* `installedPath`
* `version`
* `status`
* `sourceAvailable`
* `built`
* `installed`
* `launchMode`
* `coreLesson`
* `evidencePath`

Level 1 serves as the example of a game with:
* `historicalStatus`: Human Review Passed
* `sourceAvailable`: false
* `restorationStatus`: Deferred until package architecture

## Works-On-My-Machine Prevention

* no absolute user paths in runtime manifests;
* pin Node/pnpm versions for development;
* one root lockfile if workspace is adopted;
* static builds for distributed play;
* strict ports only in dev mode;
* capture scripts are development tools, not product launchers;
* build pipeline must produce a reproducible artifact.

## Tauri / Butler Fit

* Tauri remains a good candidate for the desktop hub.
* Butler remains a good candidate for itch deployment.
* Butler should push the built hub/package artifact, not raw dev folders.
* Tauri hub should launch built games in player mode and only use dev servers in dev mode.

## Open Decisions

* Adopt pnpm workspace now or later?
* Build all games every release, or allow installed subset?
* Bundle all Tier 1 games into hub, or allow optional install state?
* Restore Level 1 before or after hub MVP?
* Use embedded WebView vs external browser for game launch?
* Where should built game artifacts live?
