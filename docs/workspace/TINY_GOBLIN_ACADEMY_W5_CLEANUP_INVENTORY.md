# Tiny Goblin Academy W5 Cleanup Inventory

## Status

Cleanup Inventory / No Deletions Applied

State:

* W4.1 validation passed;
* W5.0 inventories cleanup candidates;
* no files or folders were deleted;
* no cleanup has been applied yet.

## Purpose

* W5 cleanup is intended to reclaim disk space and remove package-manager drift;
* cleanup must not break the validated pnpm workspace;
* pnpm workspace node_modules may include valid link structures, so deletion must be deliberate.

## Validation Baseline

* **Manifest Validator:** ✅ Passed (10 games, 9 verified source folders).
* **Hub Icons Validator:** ✅ Passed.
* **Recursive Tests (`pnpm -r run test`):** ✅ Passed for all games.
* **Recursive Typecheck (`pnpm -r --no-bail exec tsc --noEmit`):** ✅ Passed.
* **Recursive Build (`pnpm -r --no-bail run build`):** ✅ Passed.

## Node Modules Inventory

| Path | Approx Size | `.pnpm` present? | `.ignored` present? | Likely Type / Status | Cleanup Recommendation |
|------|-------------|------------------|---------------------|----------------------|------------------------|
| `.\node_modules` | 251.2 MB | Yes | No | root pnpm workspace dependency structure | **keep** |
| `hub\node_modules` | 61.3 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\02-potion-sorter\node_modules` | 102.4 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\03-dice-duel-tavern\node_modules` | 186.2 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\04-card-goblin-duel\node_modules` | 203.0 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\05-dungeon-key-run\node_modules` | 203.0 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\06-tiny-farm-day\node_modules` | 203.0 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\07-pet-campfire\node_modules` | 203.0 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |
| `games\tier-1\08-one-room-platformer\node_modules` | 202.4 MB | No | Yes (139 MB) | old isolated dependency cave / quarantine | **`.ignored` quarantine cleanup candidate** |
| `games\tier-1\09-top-down-slime-quest\node_modules` | 387.6 MB | Yes | Yes (139 MB) | old isolated dependency cave / quarantine | **`.ignored` quarantine cleanup candidate** |
| `games\tier-1\10-mini-settlement-sim\node_modules` | 65.6 MB | Yes | No | pnpm-managed package link structure | **do not delete blindly** |

## Lockfile Inventory

| Path | Likely Purpose | Cleanup Recommendation |
|------|----------------|------------------------|
| `pnpm-lock.yaml` | canonical root lockfile | **keep** |
| `hub\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\03-dice-duel-tavern\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\04-card-goblin-duel\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\05-dungeon-key-run\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\06-tiny-farm-day\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\07-pet-campfire\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\08-one-room-platformer\package-lock.json` | npm drift lockfile | remove in W5.1 |
| `games\tier-1\09-top-down-slime-quest\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |
| `games\tier-1\09-top-down-slime-quest\package-lock.json` | npm drift lockfile | remove in W5.1 |
| `games\tier-1\10-mini-settlement-sim\pnpm-lock.yaml` | obsolete per-package lockfile | remove in W5.1 |

*(Note: Internal `pnpm-lock.yaml` files located deep inside `node_modules/.pnpm/` are managed by pnpm and excluded from this list.)*

## Generated Output Inventory

| Path | Approx Size | Ignored/Tracked | Cleanup Recommendation |
|------|-------------|-----------------|------------------------|
| `hub\dist` | 2.1 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\02-potion-sorter\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\03-dice-duel-tavern\dist` | 1.3 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\04-card-goblin-duel\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\05-dungeon-key-run\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\06-tiny-farm-day\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\07-pet-campfire\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\08-one-room-platformer\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\09-top-down-slime-quest\dist` | 1.4 MB | Ignored | Can be cleaned if reproducible |
| `games\tier-1\10-mini-settlement-sim\dist` | < 0.1 MB | Ignored | Can be cleaned if reproducible |

## Recommended W5.1 Cleanup Scope

* remove package-lock.json files from games 08 and 09 if confirmed obsolete;
* remove per-game pnpm-lock.yaml files if root lockfile is now canonical;
* remove `node_modules/.ignored` quarantine folders if present;
* optionally remove generated dist/build outputs;
* do not delete pnpm-managed package node_modules unless the inventory proves they are old isolated caves or unless the plan includes removing all node_modules and immediately running one root `pnpm install --ignore-scripts` to recreate a clean workspace.

## Caution on node_modules

Do not blindly delete all per-package `node_modules` folders in a pnpm workspace. Some may be valid pnpm link structures required for local package commands. Cleanup should target confirmed stale artifacts, `.ignored` quarantine folders, and obsolete lockfiles first.

## W5.1 Options

### Option A — Conservative Cleanup

* remove obsolete lockfiles;
* remove `.ignored` quarantine folders;
* remove generated outputs;
* keep pnpm-managed node_modules structures.

### Option B — Full Dependency Rebuild

* delete all root/package node_modules;
* run one root `pnpm install --ignore-scripts`;
* re-run full validation.
* Higher risk, but potentially cleanest dependency state.

**Recommendation:** **Option B** is recommended. Since `pnpm install --ignore-scripts` from the root has proven fast and completely reliable in validation (W3/W4), Option B gives us maximum certainty that there are no hidden/stale dependency residues (e.g. game 09's massive 387MB `node_modules` which contains old `.ignored` data and pre-workspace linkage).

## Proposed Next Step

1. Review W5.0 inventory.
2. Choose W5.1 cleanup strategy.
3. Apply cleanup.
4. Re-run full validation.
5. Only after cleanup validation passes, mark workspace migration complete.
