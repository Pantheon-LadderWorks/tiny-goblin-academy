# Tiny Goblin Academy Minimal Hub Scaffold Plan

## Status

Implemented Scaffold / Read-Only Hub Active

* The first read-only Hub scaffold has been implemented under `hub/`.
* The Hub now reads Tier 1 roster data from `manifests/academy.games.json`.
* The Hub remains read-only.
* No game launching, process management, Tauri shell, runtime build orchestration, or asset slicing has been implemented.

## Purpose

This plan narrows the first Hub build to the smallest safe scaffold. It should not launch games, build packages, install dependencies, or integrate assets yet. It exists to prevent the Hub from starting as package/process spaghetti.

## Governing Docs

* **Pantheon Product Boot Experience Standard**: Dictates the required boot/entry flow (no raw dashboard spawn).
* **TGA Hub Contract**: Defines the Hub as a read-only shell that truthfully displays game states and avoids ghost processes.
* **TGA Manifest Strategy**: Defines the manifest structures for games, assets, and runtime state.
* **TGA Asset System Plan**: Defines the asset doctrine and the use of source pantries.
* **Hub Runtime and Packaging Notes**: (If applicable) Contains early structural/runtime packaging notes.

## First Scaffold Scope

The first scaffold should include:
* Hub folder structure proposal
* boot / entry view
* static or draft manifest data loaded by the UI
* game roster dashboard
* game detail panel
* Level 1 restoration-deferred display state
* game status badges
* source/build/playable/devRunnable status display
* credits/licensing placeholder
* no launch behavior yet

## Proposed Hub Location

**Recommend**: `hub/`

The Hub should live at root-level parallel to:
* `games/`
* `docs/`
* `assets/`

Proposed structure:
```
hub/
  README.md
  src/
    data/
    views/
    components/
    styles/
  public/
  docs/
```

*Important: This is a proposal only. Do not create it yet in this task unless explicitly authorized later.*

## Stack Assumption

Recommend a web-first scaffold that can later fit Tauri:
* TypeScript
* Vite
* React or plain TypeScript UI, depending on repo preference
* Tauri later, not first if not needed for read-only proof

The first scaffold should prove UI/data model first. Tauri/process launching comes later after the manifest and dashboard are stable.

## First Manifest Data Strategy

* The first scaffold now uses `manifests/academy.games.json` as the draft repo-level Academy Game Manifest.
* `hub/src/data/tier1Roster.ts` imports the manifest and exports the `games` array for UI consumption.
* This is still not a runtime/build manifest.
* It does not scan the filesystem or launch games.

Recommended first fields:
* id
* tier
* level
* title
* slug
* sourcePath
* status
* historicallyPassed
* sourceAvailable
* devRunnable
* buildAvailable
* playableAvailable
* playableMode
* restorationDeferred
* coreLesson
* shortDescription
* controls
* notes

## Tier 1 Game State Expectations

### Level 1:
* historicallyPassed: true
* sourceAvailable: false
* devRunnable: false
* buildAvailable: false
* playableAvailable: false
* playableMode: none
* restorationDeferred: true
* display: Historical Pass / Restoration Deferred

### Levels 2-10:
* historicallyPassed: true
* sourceAvailable: true
* devRunnable: true if the source can run in dev mode
* buildAvailable: false unless confirmed later
* playableAvailable: true only in dev mode for now if the scaffold chooses to represent dev playability
* playableMode: dev
* restorationDeferred: false

*Note: These are planning expectations. The first implementation should verify actual source folders before treating values as final.*

## Required Views for First Scaffold

### Boot View
Must follow the boot standard:
* product/studio mark
* Tiny Goblin Academy identity
* loading/status message
* transition into dashboard
* no raw dashboard spawn

### Dashboard View
Must show:
* project title
* Tier 1 roster
* status badges
* source/build/playable/devRunnable indicators
* Level 1 deferred state clearly

### Game Detail View
Must show:
* title
* game number
* description
* core lesson
* controls
* status
* notes
* docs/evidence placeholders

### About / Credits Placeholder
Must show:
* Pantheon LadderWorks / Glyphforge Games working identity note if appropriate
* license/credits placeholder
* link/reference to governance docs later

## Component Proposal

* BootScreen
* HubShell
* GameRoster
* GameCard
* GameDetailPanel
* StatusBadge
* ManifestStatusPanel
* CreditsPanel

## Visual Direction

Use existing public branding:
* Tiny Goblin Academy banner
* cozy academy/goblin tone
* dark readable dashboard
* parchment/teal/gold accents
* no raw developer debug screen

*Mention: Do not wire asset sheets into gameplay yet. Hub may use static branding/banner assets only if already available and appropriate.*

## Explicit Non-Goals for First Scaffold

* no game launching
* no dev server spawning
* no Tauri shell yet unless explicitly approved
* no process management
* no asset manifest slicing
* no visual asset swap into games
* no Level 1 rebuild
* no itch packaging
* no updater
* no installer
* no dependency consolidation
* no gameplay upgrades

## Acceptance Checklist

* [x] Plan reviewed and approved before implementation.
* [x] Hub location decided.
* [x] Stack decided.
* [x] First data shape matches Manifest Strategy.
* [x] Boot view included.
* [x] Dashboard view included.
* [x] Level 1 deferred state displayed truthfully.
* [x] No launch/process behavior included in first scaffold.
* [x] No game code modified.
* [x] No asset implementation performed.

## Next Implementation Prompt Outline

1. create hub folder;
2. scaffold minimal web UI;
3. add draft roster data;
4. render boot screen;
5. render dashboard;
6. render game cards and detail panel;
7. no launching;
8. no Tauri yet unless separately approved.
