# H3 Runtime Docs Reconciliation and Control-Surface Gap Audit

## Overview
This document summarizes the audit and reconciliation pass (Phase H3.0) performed to update the runtime and packaging doctrine of the Tiny Goblin Academy. The purpose of this audit was to reconcile existing runtime plans with the current project state (specifically the restoration of all Tier 1 games, the pnpm workspace migration, and the completion of the H2 Hub Visual Pass). 

It confirms the direction for the Hub's control-surface architecture without implementing new logic.

## Docs Read and Audited
* `docs/TINY_GOBLIN_ACADEMY_HUB_RUNTIME_AND_PACKAGING_NOTES.md`
* `docs/TINY_GOBLIN_ACADEMY_LAUNCHER_RUNTIME_PLAN.md`
* `docs/TINY_GOBLIN_ACADEMY_HUB_CONTRACT.md`
* `docs/TINY_GOBLIN_ACADEMY_PHASE_1_5_STATUS.md`

## Stale Statements Found and Resolved
During the audit, the following stale concepts were identified and updated across the doctrine:
1. **Level 1 Deferred Status**: Several docs referenced Level 1 as missing source, deferred, or blocked. **Updated** to reflect that Level 1 is fully restored (Restored v0.1) and passed Human Review.
2. **Package Management Problem**: Docs referenced repeated dependency folders and node bloat. **Updated** to reflect the successful migration to a root pnpm workspace with a single lockfile.
3. **Workspace/Install Architecture Blockers**: Docs listed the install architecture and dependency audit as active blockers. **Updated** to mark these milestones as completed.
4. **Hub Launch Strategy**: Docs had ambiguous direction regarding managed dev servers and Tauri. **Updated** to explicitly declare Tauri as the necessary native command boundary foundation for any real install/launch/quit control surface.

## Tauri / Control-Surface Decision
**Should Tauri be started now or integrated later?**
Tauri should be started as the next foundation spike before building real launch buttons. Install/launch/quit workflows require a native command boundary. We must not build fake browser-only launch buttons or rely on a React-only frontend spawning unmanaged background processes. 

## Proposed Next Phases (H3 Implementation Ladder)

* **H3.0 — Runtime Docs Reconciliation** (Current phase. Docs only. Completed.)
* **H3.1 — Tauri Shell Spike** (Future explicit approval required. Minimal shell only. Prove Hub frontend can call one safe backend diagnostic command, such as `pnpm --version`. No game launch yet.)
* **H3.2 — Workspace Dependency Status** (Future explicit approval required. Check, but do not silently install. Show dependency state. Approved command allowlist only.)
* **H3.3 — Launch One Game in Dev Mode** (Future explicit approval required. Launch exactly one selected game through Tauri-managed process handling. Track port, PID/process handle, status, logs. No ghost Vite servers.)
* **H3.4 — Quit Game / Return to Dashboard** (Future explicit approval required. Stop process cleanly. Verify port cleanup. Return to dashboard.)
* **H3.5 — Generalize All 10** (Future explicit approval required. Use manifest/package metadata. Prevent concurrent unmanaged sessions.)
* **H3.6 — Static Build / Production Launch Planning** (Future explicit approval required. Revisit static builds, Butler/itch, installed artifacts, and player mode. No raw pnpm for players.)

## Remaining Open Decisions
* Build all games every release, or allow installed subset?
* Bundle all Tier 1 games into hub, or allow optional install state?
* Use embedded WebView vs external browser for game launch?
* Where should built static game artifacts live for player mode?
