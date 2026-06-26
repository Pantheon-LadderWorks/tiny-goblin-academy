# Tiny Goblin Academy Workspace / Install Architecture Plan

## Status

Planning / No Workspace Changes Applied

* no root workspace has been created yet;
* no dependencies were installed;
* no node_modules folders were deleted;
* no lockfiles were deleted;
* this doc defines the migration plan only.

## Purpose

* the project currently has dependency duplication across Hub + games;
* the user has limited disk space;
* Level 1 rebuild is blocked until dependency/install architecture is approved;
* future Hub installer behavior needs a clean distinction between source, installed, built, playable, and updateable states.

## Current Problem Summary

* no root `package.json`;
* no root `pnpm-workspace.yaml`;
* Hub has its own package/dependencies;
* games 03-10 have package.json files;
* game 02 has node_modules but no package.json;
* games 08 and 09 have package-lock.json files;
* there are 10 node_modules folders;
* mixed package-manager evidence exists.

## Recommended Target Architecture

Recommend a root-level pnpm workspace.

Proposed future files:

* `package.json`
* `pnpm-workspace.yaml`

Proposed workspace packages:

* `hub`
* `games/tier-1/03-dice-duel-tavern`
* `games/tier-1/04-card-goblin-duel`
* `games/tier-1/05-dungeon-key-run`
* `games/tier-1/06-tiny-farm-day`
* `games/tier-1/07-pet-campfire`
* `games/tier-1/08-one-room-platformer`
* `games/tier-1/09-top-down-slime-quest`
* `games/tier-1/10-mini-settlement-sim`

Special cases:

* `games/tier-1/02-potion-sorter` must be investigated before adding to workspace because it currently lacks package.json despite having node_modules.
* Level 1 does not exist yet and should be added later when rebuilt.

## Package Manager Policy

* pnpm is the canonical package manager;
* no npm install in repo unless explicitly approved;
* package-lock.json files should not be deleted during planning;
* package-lock.json files should be removed only during an approved migration commit after confirming they are obsolete;
* existing per-game pnpm-lock.yaml files should be reviewed before consolidation;
* future ideal is one root lockfile, but migration must be careful.

## Dependency Deduplication Strategy

* root pnpm workspace can centralize installation workflow;
* pnpm store deduplicates package content;
* workspace packages can keep their own package.json while sharing installed dependency content;
* avoid per-game install rituals;
* avoid committing node_modules or dist;
* future cleanup should remove redundant node_modules only after workspace install/build validation.

## Build Artifact Policy Preview

Possible build artifact locations:
Option A:

* each game keeps its own `dist/`

Option B:
* central repo-level `builds/tier-1/<game-slug>/`

Option C:
* both: per-game dist during dev, central build export for Hub/install packaging

Recommend a likely direction:

* per-game dist may be acceptable during build;
* central build export is likely better for Hub installer/static launcher state;
* final decision should happen after workspace migration and Level 1 rebuild plan.

## Developer Mode vs Production Mode

### Developer Mode

Developer mode assumes source files are present in the repo.

In developer mode, “installing” a game usually means:

* dependencies are installed or linked through the workspace;
* the game can be built or run in a dev environment;
* the game may become `devRunnable`.

Developer mode install state should use terms like:

* `workspaceMember`
* `dependenciesInstalled`
* `devRunnable`
* `sourceAvailable`

Important:

* Developer dependency installation is not the same as a player-facing game install.
* `dependenciesInstalled: true` does not mean `installed: true`.
* `playableMode: dev` does not mean production-ready or distribution-ready.
* The Hub must not silently run `pnpm install`.
* The Hub must not silently spawn dev servers.

### Production Mode

Production mode assumes players should not need source dependencies, Node, pnpm, Vite, TypeScript, or dev servers.

In production mode, “installing” a game means:

* a prebuilt playable artifact exists locally;
* or later, a Butler/itch cave exists locally;
* the game can be launched without developer tools.

Production mode install state should use terms like:

* `installed`
* `buildAvailable`
* `playableAvailable`
* `playableMode: static | bundled | itch-cave`
* `updateAvailable`
* `distributionReady`

Important:

* Production install is about playable artifacts, not source dependencies.
* Butler/butlerd belongs to future production install/update behavior.
* Static builds are the preferred first real production launch target.

| Concept       | Developer Mode                | Production Mode                  |
| ------------- | ----------------------------- | -------------------------------- |
| Source files  | Present                       | Usually hidden or bundled away   |
| Dependencies  | Workspace/dev dependencies    | Not user-facing                  |
| Install means | Dependencies linked/available | Playable artifact/cave installed |
| Play mode     | dev                           | static/bundled/itch-cave         |
| User type     | developer/maintainer          | player/end-user                  |

## Hub Install State Model

* all 10 games listed;
* some games installed;
* some uninstalled;
* dev source available separately from installed playable build;
* future Butler caves as installed units.

States:

* listed
* sourceAvailable
* workspaceMember
* dependenciesInstalled
* buildAvailable
* installed
* installable
* playableAvailable
* playableMode
* updateAvailable
* distributionReady

* `workspaceMember` is a developer/source state.
* `dependenciesInstalled` is explicitly developer-mode.
* `installed` is explicitly production/player-mode.
* The Hub may display both while developing, but must not conflate them.
* Butler cave install state is future-only.

## Proposed Migration Phases

### Phase W0 — Documentation / Approval

Current phase.
No changes.

### Phase W1 — Workspace Skeleton

* W1 workspace skeleton has been created.
* Root package.json and pnpm-workspace.yaml exist.
* No install has been run.
* No dependencies were added.
* No node_modules or lockfiles were deleted.
* Game 02 remains excluded pending investigation.

### Phase W2 — Package Census / Normalize Metadata

* W2 package census has been created at `docs/TINY_GOBLIN_ACADEMY_PACKAGE_CENSUS_W2.md`.
* W2.5 Package metadata normalization plan created.
* W2.6 package metadata normalization is complete.
* Game 02 reconstruction plan exists.
* No installs were run.
* No node_modules or lockfiles were deleted.
* W3 controlled root install is blocked until Game 02 is either:
  1. reconstructed and added to workspace in W2.7, or
  2. explicitly deferred with approval.

### Phase W2.7 — Game 02 Package / Config Skeleton

* Game 02 package/config skeleton created;
* Game 02 added to workspace membership;
* W3 controlled root install is now unblocked pending review;
* node_modules and lockfiles cleanup still deferred.

### Phase W3 — Controlled Root Install

* controlled root install completed;
* no cleanup applied;
* W4 validation is next;
* W5 cleanup remains blocked until validation passes.

### Phase W4 — Validation

* workspace validation report created;
* W4.1 validation fix patch applied;
* TypeScript version drift addressed;
* CSS import declarations addressed;
* Game 09 typing issue addressed;
* W5 cleanup remains blocked until W4.1 validation passes.

### Phase W5 — Cleanup

**State: COMPLETED** (Completed in W5.0 / W5.1)

* **Goal:** Enforce single source of truth for dependencies.
* **Problem:** Leftover `package-lock.json` files and old non-hoisted `.ignored` folders cause duplicate lockfile drift.
* **Resolution (W5.1):** 
  * Removed all 11 package-level `node_modules` folders (including `.ignored` quarantines).
  * Removed obsolete `pnpm-lock.yaml` files from package directories.
  * Removed `package-lock.json` drift from Games 08 and 09.
  * Removed generated `dist/` outputs.
  * Executed a canonical `pnpm install --ignore-scripts` from root.
  * Restored the workspace strictly through the root `pnpm-lock.yaml` and verified with a full recursive build, test, and typecheck suite.

### Phase W6 — Level 1 Rebuild

Only after workspace/install architecture is working and approved.

## Game 02 Special Investigation

* Game 02 reconstruction plan has been created.
* W3 controlled root install remains blocked until Game 02 decision is reviewed.
* Game 02 is still excluded unless/until W2.7 creates a package skeleton and updates workspace membership.

## Butler / itch Relationship

* workspace solves developer disk bloat;
* Butler solves distribution/update/install behavior later;
* these are related but not the same;
* workspace does not decide itch packaging by itself;
* Butlerd/caves remain future;
* install state in Hub should be designed so Butler cave state can plug in later.

## Risks

* breaking existing games by normalizing too quickly;
* losing package-lock/package state clues;
* accidentally installing more dependencies;
* deleting node_modules before build validation;
* mixing developer install state with player install state;
* assuming Butler behavior before testing.

## Open Questions

* Should every game remain its own package?
* Should Tier 1 games share a common template/package?
* Should 02 get a reconstructed package.json before workspace creation?
* Should Hub be in the same workspace as games?
* Should static builds export to central `builds/`?
* Should per-game pnpm-lock.yaml files be removed eventually?
* How should disk usage be measured before/after migration?
* Should workspace install happen before or after Level 1 package skeleton exists?

## Proposed Next Step

1. Review/approve workspace install architecture.
2. Create a surgical workspace skeleton prompt.
3. Add root package.json and pnpm-workspace.yaml only.
4. Review before running install.
5. Only then decide controlled root install.
