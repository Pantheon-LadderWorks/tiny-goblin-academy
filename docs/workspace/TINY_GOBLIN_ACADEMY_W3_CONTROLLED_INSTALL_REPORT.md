# Tiny Goblin Academy W3 Controlled Root Install Report

## Status

Controlled Root Install Completed / No Cleanup Applied

## Purpose

* W3 tested the root pnpm workspace install;
* no cleanup was performed;
* old node_modules and lockfiles are intentionally preserved until W5;
* this step exists to verify install behavior before cleanup.

## Pre-Install Baseline

* **pnpm version**: 10.20.0
* **pnpm store path**: `C:\Users\kryst\AppData\Local\pnpm\store\v10`
* **root lockfile**: missing (`pnpm-lock.yaml` did not exist)
* **root node_modules**: missing
* **node_modules folder count**: 576 directories inside `node_modules` folders across the workspace
* **approximate dependency storage size**: Not measured precisely, but 576 subdirectories
* **git status before install**: Clean (no changes)

## Install Command

Exact command run:

```powershell
pnpm install --ignore-scripts
```

Result:

* **success/failure**: Success. Completed in 28.4s.
* **warnings**: Several warnings for Game 08 about moving packages installed by a different package manager to `node_modules/.ignored` (expected due to Game 08's old `package-lock.json`).
* **workspace package count**: Scope included all 11 workspace projects.
* **ignored scripts notice**: No postinstall scripts were run since `--ignore-scripts` was passed.

## Post-Install Results

* **root lockfile created/updated**: Created (`pnpm-lock.yaml` is now present).
* **root node_modules created/updated**: Created.
* **node_modules folder count after install**: 782 directories (up from 576).
* **git status after install**: Untracked `pnpm-lock.yaml`. No other files modified.
* **any unexpected file changes**: None.
* **whether package.json files changed**: No package.json files were modified.
* **whether per-game lockfiles changed**: No per-game lockfiles were modified.
* **whether package-lock files changed**: No package-lock files were modified.

## Validation Results

* **academy manifest validator result**: ✅ Passed (Games count: 10, Verified source folders: 9)
* **hub icons validator result**: ✅ Passed (10 icons validated)
* **any additional safe checks run**: Ran `pnpm -r exec tsc --noEmit`. It surfaced preexisting type errors in source code (e.g., TS2882 style.css imports, and TS2322 strict typing in Game 10). It also failed for Game 05 because `tsc` was not found (likely Game 05 is missing typescript as a devDependency).
* **any checks intentionally deferred to W4**: Full build validation is deferred to W4, where dev servers and builds can be run safely.

## Disk / Dependency Notes

* pnpm workspace install created/used shared store behavior;
* old per-game node_modules are still present and are not cleaned yet;
* observed disk impact: approximately 200 new subdirectories were created, mostly in the root `node_modules` and linking overhead;
* W5 cleanup will be needed later to reclaim duplicated dependency folders after validation.

## Risks / Follow-Up

* existing per-game node_modules still remain;
* old lockfile drift remains until cleanup;
* W4 must validate builds/tests and address any `tsc` errors surfaced during W3;
* W5 must clean redundant node_modules/lockfiles only after W4 passes.

## Proposed Next Step

1. Review W3 install report.
2. Proceed to W4 validation.
3. Only after W4 passes, plan W5 cleanup.
