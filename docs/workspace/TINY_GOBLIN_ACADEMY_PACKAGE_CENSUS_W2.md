# Tiny Goblin Academy Package Census — W2

## Status

Audit / No Package Changes Applied

State clearly:
* no dependencies were installed;
* no package files were modified;
* no node_modules folders were deleted;
* no lockfiles were deleted;
* this is a census and normalization plan only.

## Purpose

* W1 created the workspace skeleton;
* W2 inventories existing package metadata before installs;
* the goal is to prevent disk bloat, package-manager drift, and accidental breakage.

## Workspace Package Table

| Package Path | Package Name | Version | Scripts Summary | Dependencies Summary | DevDependencies Summary | pnpm lock? | npm lock? | node_modules? | dist/build? | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hub` | `tiny-goblin-academy-hub` | `0.0.0` | `dev`, `build`, `preview` | `react`, `react-dom` | `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `typescript`, `vite` | Yes | No | Yes | Yes | |
| `games/tier-1/02-potion-sorter` | *Missing* | *Missing* | *Missing* | *Missing* | *Missing* | No | No | Yes | No | Needs special investigation. Missing package.json entirely. |
| `games/tier-1/03-dice-duel-tavern` | `dice-duel-tavern` | `0.1.0` | `dev`, `build`, `test` | `phaser` | `typescript`, `vite`, `vitest` | Yes | No | Yes | Yes | |
| `games/tier-1/04-card-goblin-duel` | *undefined* | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | Yes | No | Yes | Yes | Copy-paste error: missing name/version. |
| `games/tier-1/05-dungeon-key-run` | `05-dungeon-key-run` | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | Yes | No | Yes | No | Missing version. |
| `games/tier-1/06-tiny-farm-day` | `06-tiny-farm-day` | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | Yes | No | Yes | No | Missing version. |
| `games/tier-1/07-pet-campfire` | `07-pet-campfire` | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | Yes | No | Yes | No | Missing version. |
| `games/tier-1/08-one-room-platformer` | `07-pet-campfire` | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | No | Yes | Yes | No | Copy-paste error: name is 07-pet-campfire. |
| `games/tier-1/09-top-down-slime-quest` | `07-pet-campfire` | *undefined* | `dev`, `test`, `build` | `phaser` | `playwright`, `typescript`, `vite`, `vitest` | Yes | Yes | Yes | No | Copy-paste error: name is 07-pet-campfire. |
| `games/tier-1/10-mini-settlement-sim` | `10-mini-settlement-sim` | `0.1.0` | `dev`, `build`, `preview`, `test` | *(none)* | `playwright`, `typescript`, `vite`, `vitest` | Yes | No | Yes | No | Missing `phaser` in dependencies (or perhaps uses CDN?). |

## Shared Dependency Analysis

Repeated dependencies across packages are extremely uniform. The vast majority of games depend on:
* **`phaser`** (dependencies)
* **`typescript`**, **`vite`**, **`vitest`**, **`playwright`** (devDependencies)

Exceptions:
* `hub` uniquely uses `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`.
* `10-mini-settlement-sim` is missing `phaser` in its dependencies object (could be an oversight).
* Game `03` doesn't have `playwright`.

This high uniformity confirms that moving to a pnpm workspace with centralized dependencies will save a massive amount of disk space.

## Package Manager Drift

* **pnpm-lock.yaml users**: `hub`, `03`, `04`, `05`, `06`, `07`, `09`, `10`.
* **package-lock.json users**: `08`, `09`.
* **Mixed lockfile risks**: Game `09` has both `pnpm-lock.yaml` and `package-lock.json`, which indicates mixed tool usage and drift. Game `08` only has `package-lock.json`. 
* Package-lock files are not to be deleted until an approved migration commit.

## Script Census

Common scripts found:
* `dev`: Present in all existing package.json files.
* `build`: Present in all.
* `test`: Present in all games except `hub`.
* `preview`: Present in `hub` and `10`.

The scripts are relatively well-normalized, though the ordering and presence of `preview` is slightly inconsistent. No custom capture/playtest scripts were detected in the basic `scripts` object.

## Game 02 Special Investigation

* **Source files found**: `src/controller.ts`, `src/main.ts`, `src/potion-scene.ts`, `src/simulation.ts`, `src/styles.css`, `src/vite-env.d.ts`, `tests/simulation.test.ts`.
* **Imports found**: `phaser` is explicitly imported in `src/main.ts` and `src/potion-scene.ts`.
* **Configs/tests found**: `tests/simulation.test.ts` is present, suggesting `vitest` is expected. `vite-env.d.ts` is present, suggesting `vite` is used. However, `tsconfig.json`, `vite.config.ts`, and `index.html` are all entirely missing from the directory.
* **package.json missing**: Confirmed. No `package.json` exists in `02-potion-sorter`.
* **node_modules present**: Confirmed. The directory is populated despite having no package definition file.
* **Likely future options**:
  1. reconstruct minimal package.json from source and common Tier 1 pattern;
  2. fold into shared/common package later;
  3. defer until asset upgrade phase.

(Do not choose a final option yet unless the evidence is overwhelming.)

## Normalization Recommendations

Future W2.5/W3-prep actions (do not apply yet):
* Standardize package names (fix `07-pet-campfire` duplicate names, fill in undefined names).
* Standardize private flags (set all to `true` or false consistently).
* Standardize script names where useful (e.g. decide if all should have `preview`).
* Decide lockfile consolidation policy.
* Decide whether per-game pnpm-lock.yaml files remain temporarily.
* Create a package plan for game 02.
* Only then run controlled root install.

## Open Questions

* Should all game package names follow `tga-<slug>` or just `<slug>`?
* Should all game packages be `private: true`?
* Should all games expose the same script names (e.g. should they all have `preview`)?
* Should capture/playtest scripts be standardized or left per-game?
* Should 02 be added before or after first controlled root install?
* Should package-lock files be removed before or after successful root install validation?

## Proposed Next Step

1. Review W2 census.
2. Patch docs if needed.
3. Create W2.5 package metadata normalization plan.
4. Only after approval, modify package metadata.
5. Then run controlled root install in W3.
