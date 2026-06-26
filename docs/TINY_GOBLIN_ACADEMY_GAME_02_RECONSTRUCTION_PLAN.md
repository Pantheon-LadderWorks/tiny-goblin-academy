# Tiny Goblin Academy Game 02 Reconstruction Plan

## Status

Investigation / No Reconstruction Applied

State:

* no package.json was created;
* no dependencies were installed;
* no source files were changed;
* no lockfiles/node_modules were deleted;
* Game 02 remains excluded from `pnpm-workspace.yaml`.

## Purpose

Explain:

* Game 02 has source/test evidence but no package/config skeleton;
* it currently has `node_modules`, which suggests prior dependency installation;
* this must be understood before W3 controlled root install;
* the goal is to avoid “works on my machine” ghost state.

## Current Game 02 Findings

* **Top-level files/folders**: `src/`, `tests/`, `node_modules/`
* **src files**: `controller.ts`, `main.ts`, `potion-scene.ts`, `simulation.ts` (implied by imports)
* **test files**: `simulation.test.ts`
* **Imports**:
  * `import Phaser from 'phaser'` (in `main.ts`, `potion-scene.ts`)
  * `import { describe, expect, it } from 'vitest'` (in `simulation.test.ts`)
* **Missing package/config files**: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
* **node_modules presence**: Yes
* **Lockfile presence/absence**: No lockfiles present
* **Build output presence/absence**: No `dist/` or other build output present

## Likely Technology Stack

* **Phaser**: Imported by source files (`main.ts`, `potion-scene.ts`).
* **TypeScript**: Source and test files use `.ts` extension.
* **Vite**: The standard bundler for other Tier 1 games; highly likely required to run the browser game.
* **Vitest**: Imported directly in `tests/simulation.test.ts`.
* **Playwright**: No playwright tests or `capture.cjs` script found, so likely *not* needed.

## Neighbor Package Comparison

**Game 03 & 04 similarities/differences:**
* **Dependencies**: Both have `phaser`.
* **devDependencies**: Both have `typescript`, `vite`, `vitest`. Game 04 also has `playwright`.
* **Scripts**: `dev`, `build`, `test`.
* **Config files**: Both have `tsconfig.json`, `index.html`, and `package.json`.
* **Missing in Game 02**: Game 02 lacks all of the above configuration and entry point files (e.g., `index.html`, `tsconfig.json`, `package.json`).

## Reconstruction Options

### Option A — Reconstruct minimal package/config skeleton before W3

Pros:

* lets Game 02 join workspace before controlled root install;
* reduces orphan state;
* makes package membership cleaner.

Cons:

* requires careful source/config reconstruction;
* could introduce assumptions if imports/config are incomplete.

### Option B — Keep Game 02 excluded through W3

Pros:

* reduces risk before first root install;
* allows root workspace validation for known packages first.

Cons:

* leaves Game 02 as an orphan with node_modules;
* later integration may require a second install/lockfile adjustment.

### Option C — Defer Game 02 until asset upgrade/rebuild phase

Pros:

* avoids blocking workspace migration.

Cons:

* leaves a known gap in Tier 1 package consistency;
* may preserve ghost dependency state too long.

## Recommended Path

Recommendation:

* create a W2.7 Game 02 package/config reconstruction patch before W3;
* include only the minimal files needed to make Game 02 a workspace package;
* do not install dependencies in W2.7;
* add Game 02 to `pnpm-workspace.yaml` only after its package skeleton exists;
* then review before W3 controlled root install.

## Proposed W2.7 Patch Scope

Proposed files to create/update:

* `games/tier-1/02-potion-sorter/package.json`
* `games/tier-1/02-potion-sorter/tsconfig.json`
* `games/tier-1/02-potion-sorter/index.html`
* `pnpm-workspace.yaml` (add Game 02)

*(Note: Neighbor packages don't necessarily have `vite.config.ts` depending on default usage, but if required it can be added. We will mirror Game 03's setup).*

Proposed package metadata:

* `name`: `tga-02-potion-sorter`
* `version`: `0.1.0`
* `private`: `true`
* `type`: `module`

Proposed scripts:

* `dev`: `vite`
* `build`: `tsc --noEmit && vite build`
* `test`: `vitest run`

Proposed dependencies/devDependencies (based on neighbor packages & imports):
* `dependencies`: `phaser`
* `devDependencies`: `typescript`, `vite`, `vitest`

## Risks

* guessing missing config incorrectly;
* adding Game 02 too early;
* preserving ghost `node_modules`;
* running install too soon;
* changing source behavior accidentally;
* assuming test/build health before validation.

## Open Questions

* Does Game 02 have enough files to reconstruct a Vite entry?
* Does it need Playwright? *(Probably not based on current files).*
* Does it need an `index.html` matching neighbor games? *(Yes, to serve the game via Vite).*
* Should package versions match Game 03/04 exactly? *(Yes, for workspace consistency).*
* Should Game 02 join workspace before W3? *(Recommended yes).*
* Should its current node_modules be deleted only in W5 cleanup? *(Yes, to preserve any potential clues until we confirm it works).*

## Proposed Next Step

1. Review Game 02 reconstruction plan.
2. If approved, create W2.7 surgical Game 02 package/config skeleton patch.
3. Do not run install yet.
4. Add Game 02 to workspace only as part of W2.7 if package skeleton is created.
5. Review W2.7.
6. Then proceed to W3 controlled root install.
