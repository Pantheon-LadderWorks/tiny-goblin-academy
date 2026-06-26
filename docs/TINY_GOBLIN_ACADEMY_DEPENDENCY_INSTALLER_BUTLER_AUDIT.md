# Tiny Goblin Academy Dependency / Installer / Butler Audit

## Status

**Audit / No Changes Applied**

## Purpose

This document defines the storage and dependency architecture for the Academy.

* the repo must avoid repeated dependency installs;
* the user has limited disk space;
* repeated per-game `node_modules` folders are unacceptable if avoidable;
* dependency strategy must be decided before Level 1 rebuild and before broader asset upgrades;
* Butler/itch distribution strategy must be understood before public packaging.

## Current Dependency Findings

| Location | package.json | pnpm-lock.yaml | package-lock.json | node_modules | dist / build |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Root** | No | No | No | No | No |
| **Hub** | Yes | Yes | No | Yes | Yes |
| **02 Potion Sorter** | No | No | No | Yes | No |
| **03 Dice Duel Tavern** | Yes | Yes | No | Yes | Yes |
| **04 Card Goblin Duel** | Yes | Yes | No | Yes | Yes |
| **05 Dungeon Key Run** | Yes | Yes | No | Yes | No |
| **06 Tiny Farm Day** | Yes | Yes | No | Yes | No |
| **07 Pet Campfire** | Yes | Yes | No | Yes | No |
| **08 One Room Platformer**| Yes | No | Yes | Yes | No |
| **09 Top Down Slime Quest**| Yes | Yes | Yes | Yes | No |
| **10 Mini Settlement Sim** | Yes | Yes | No | Yes | No |

* **Root workspace**: Neither `package.json` nor `pnpm-workspace.yaml` exist.
* **Shared dependencies**: `typescript`, `vite`, `vitest`, `playwright`, `phaser`.
* **Unique dependencies**: Hub uses `react`, `react-dom` and related vite plugins.
* **Redundancy**: There are currently 10 separate `node_modules` folders causing significant disk bloat.
* **Inconsistency**: Some games use npm (`package-lock.json`), others use pnpm (`pnpm-lock.yaml`).

## Dependency / Storage Risks

* **Installing every game independently**: Destroys disk space (10x Vite, 10x TypeScript).
* **Duplicate node_modules**: Wasted storage and slow install times.
* **Multiple lockfiles**: Hard to upgrade shared dependencies or ensure stable reproducible builds.
* **Inconsistent package managers**: Using both npm and pnpm leads to confusion.
* **Bloated builds**: Pushing development-only files into public builds.
* **Ghost dependency folders**: Such as `02-potion-sorter` having `node_modules` but no `package.json`.

## Recommended Development Dependency Strategy

* **Root-level pnpm workspace**: Yes.
* **One root install workflow**: Yes.
* **Shared pnpm store**: Yes (deduplicates packages automatically across the repo).
* **Workspace scripts**: For validating/building games centrally.
* **No per-game npm install**: Unless explicitly needed.
* **No package-lock files**: Since pnpm is the chosen package manager, npm lockfiles should be eradicated.
* **Careful handling of existing lockfiles**: Existing per-game lockfiles must be cleaned up carefully when setting up the workspace.

*(Note: Do not implement this yet. This is planning only.)*

## Hub as Catalog + Installer + Launcher

The Hub is not only a launcher. It is expected to become:
* catalog
* installer surface
* launcher
* status dashboard

### Future States Definitions

* **listed**: appears in Hub catalog
* **sourceAvailable**: source exists in repo
* **installed**: local playable/build artifact exists or Butler cave exists
* **installable**: can be installed/built/downloaded later
* **playableAvailable**: can be played according to playableMode
* **playableMode**: none / dev / static / bundled / itch-cave
* **buildAvailable**: static build exists
* **runtimeManaged**: Hub manages runtime process
* **distributionReady**: packaged/release-ready
* **updateAvailable**: an installed unit has an update available

**Important Distinctions:**
* All games can be listed even if not installed.
* `installed` is separate from `sourceAvailable`.
* `installed` is separate from `distributionReady`.
* `devRunnable` is not `installed`.
* `playableMode: dev` is not public install state.

## Desired Hub Behavior

* Hub should show all 10 games.
* Installed games should show playable/open/update/uninstall status.
* Uninstalled games should show install/build unavailable status.
* Future installer should be explicit, not automatic.
* Hub must not silently install dependencies.
* Hub must not silently spawn dev servers.
* Hub must show install/update size before committing if possible.

## Butler / itch Distribution Questions

Known from official Butler docs:
* `butler push` uploads a build to a project/channel.
* Pushing to the same channel updates that file/build.
* Butler/Wharf uses patching/diffing so updates usually transfer changed data instead of the full build.
* Direct web downloads do not auto-update.
* The itch app and Butlerd can use Butler/Wharf update behavior.
* Butlerd represents installed games as “caves.”
* Butlerd can check updates for specific cave IDs.
* Butlerd update flow uses install queue/perform with `reason: update`.
* Butlerd is the supported path for custom launchers that install, update, and launch itch games.

### Distribution Design Options

#### Option A — One Academy itch project/package
* one itch page
* simple public product
* Butler patches changed files
* but install unit is likely the whole Academy package
* does not naturally support “3 of 10 installed” unless the custom launcher manages sub-installs internally

#### Option B — Hub plus separate itch projects per lesson/game
* per-game install/update model is cleaner
* each game can have its own cave/update state
* supports 3 installed / 7 uninstalled more naturally
* more itch metadata/project management

#### Option C — One itch project with multiple channels/uploads
* possible candidate for one-page publishing with separate game uploads
* needs further research/testing before relying on it
* must verify how itch app and Butlerd expose/install/update individual uploads/channels

### Conclusion

* Do not decide final itch packaging yet.
* Do not rebuild Level 1 until dependency/workspace policy is reviewed.
* Do not implement Butlerd until much later.
* Treat Butlerd as future installer/update layer, not current implementation.
