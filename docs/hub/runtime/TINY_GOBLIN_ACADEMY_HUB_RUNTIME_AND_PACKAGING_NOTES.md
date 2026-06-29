# Tiny Goblin Academy — Hub Runtime and Packaging Notes

## Purpose

Capture the runtime/package architecture questions that must be answered before building the Tauri hub or restoring Level 1.

## Core Distinction

Source game folders are development artifacts.
Built/installed game bundles are playable runtime artifacts.
The hub should know the difference between “source exists,” “built,” “installed/playable,” and “missing/pending restoration.”

## Current Status

* All 10 Tier 1 games are fully restored and present in the source folder.
* Level 1 has been restored and passed Human Review.
* The Hub Visual Pass (H2) is complete.
* The pnpm workspace migration is complete, with all games utilizing the root lockfile.

## Package Management (Resolved)

* The previous dependency bloat issue was resolved by adopting a root pnpm workspace.
* All Tier 1 games now share dependencies efficiently.
* The Hub must now mature into a control surface capable of managing these workspace dependencies.

## Current Architecture

The established layout:

```text
ai-game-studio-ladder/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── games/tier-1/
├── hub/
├── scripts/
├── evidence/
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

Level 1 previously served as the example of a deferred game. It has now been restored:
* `historicalStatus`: Human Review Passed
* `sourceAvailable`: true
* `restorationStatus`: Restored v0.1

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

## H3 Control-Surface Direction

The Hub should become the control surface, not merely a tracker. 
Install/launch/quit workflows require a native command boundary. Fake browser-only launch buttons should not be built.
Tauri should be started as the next foundation spike (H3.1) before attempting managed dev server launching.

## Remaining Open Decisions

* Build all games every release, or allow installed subset?
* Bundle all Tier 1 games into hub, or allow optional install state?
* Use embedded WebView vs external browser for game launch?
* Where should built game artifacts live?

> [!NOTE]
> **H4.6 Hub Surface Contract Update:** The initial assumption that the hub must not spawn dev servers has been corrected. The hub now acts as a dev-mode launcher capable of explicitly starting trusted local dev servers when a dev game is launched. Additionally, the hub UI is migrating from a fixed web dashboard to a full-screen launcher surface with layered identity, tier-aware horizontal shelves, and future provisions for production/installed mode, Butler integration, account context, and a cross-game ledger (defined in docs/assets/TINY_GOBLIN_ACADEMY_H4_6_HUB_SURFACE_CONTRACT_AND_SCALING_PLAN.md).
