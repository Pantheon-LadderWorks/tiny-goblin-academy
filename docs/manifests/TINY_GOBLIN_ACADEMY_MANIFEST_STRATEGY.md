# Tiny Goblin Academy Manifest Strategy

## Status

Planning / Draft Manifests Implemented For Current Roster And Asset Pantry

## Purpose

Manifests will become the source of truth for the Hub and future visual integration. They prevent hardcoded assumptions, local path leaks, and ambiguous asset use.

## Manifest Families

1. **Academy Game Manifest**: Defines the game properties, metadata, and status for the Hub roster.
2. **Asset Sheet Manifest**: Maps selected sprites and animations from source pantries.
3. **Runtime/Build Manifest**: Tracks source vs build vs playable state and tracks processes/ports for launching.
4. **Release/Itch Manifest**: Manages packaging, itch slugs, and versioning for distribution.

## Academy Game Manifest

*Implementation Note:*
* `manifests/academy/core/academy.games.json` exists.
* It powers the read-only Hub roster.
* It is draft source-of-truth for roster/status only.
* It does not define launch behavior, runtime process behavior, build availability verification, asset slicing, or release packaging.
* Runtime/build/release manifests remain future work.

## Validation

* `scripts/validate-academy-manifest.mjs` validates `manifests/academy/core/academy.games.json`;
* it is zero-dependency;
* it checks roster shape, path hygiene, the Level 1 restored invariant, and source folder existence for all 10 levels;
* it does not launch games or validate runtime/build readiness.

Fields:
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
* docs
* evidence
* assetRefs
* notes

State Definitions:
* `sourceAvailable`: source folder exists in the repo.
* `devRunnable`: source can be launched in development mode once dependencies/runtime are available.
* `buildAvailable`: a static/distribution build exists.
* `playableAvailable`: the Hub can launch the game in the currently expected runtime mode.
* `playableMode`: optional field such as `none`, `dev`, `static`, or `bundled`.

Sample JSON object for Level 1 showing current restored source availability:
```json
{
  "id": "tga-01",
  "tier": 1,
  "level": 1,
  "title": "Button Goblin Clicker",
  "slug": "button-goblin-clicker",
  "sourcePath": "games/tier-1/01-button-goblin-clicker",
  "status": "pass",
  "historicallyPassed": true,
  "sourceAvailable": true,
  "devRunnable": true,
  "buildAvailable": true,
  "playableAvailable": true,
  "playableMode": "dev",
  "restorationDeferred": false,
  "coreLesson": "State management and basic interactivity.",
  "shortDescription": "A simple clicker game about an overly enthusiastic goblin.",
  "controls": "Mouse click",
  "docs": ["docs/games/level-01-clicker.md"],
  "evidence": ["evidence/level-01-review.md"],
  "assetRefs": ["manifests/academy/games/button-goblin-clicker/academy.button-goblin-clicker.background.scene-anchors.json"],
  "notes": "Source restored. Current visual integration remains future work; Button Goblin Clicker is the first planned runtime visual integration candidate."
}
```

Sample JSON object for a normal source-available game:
```json
{
  "id": "tga-09",
  "tier": 1,
  "level": 9,
  "title": "Top-Down Slime Quest",
  "slug": "top-down-slime-quest",
  "sourcePath": "games/tier-1/09-top-down-slime-quest",
  "status": "pass",
  "historicallyPassed": true,
  "sourceAvailable": true,
  "devRunnable": true,
  "buildAvailable": false,
  "playableAvailable": true,
  "playableMode": "dev",
  "restorationDeferred": false,
  "coreLesson": "Top-down movement and collision.",
  "shortDescription": "Navigate a slime through a top-down outdoor environment.",
  "controls": "WASD or Arrows to move.",
  "docs": ["docs/games/level-09-slime-quest.md"],
  "evidence": ["evidence/level-09-review.md"],
  "assetRefs": ["assets/academy/games/top-down-slime-quest/tga-top-down-slime-quest-playfield-pack-concept-v0.1.png"],
  "notes": "Ready for future asset integration. Note: playableAvailable true here means dev-mode playable, not packaged distribution-ready."
}
```

*Note: Sample docs/evidence paths are illustrative unless verified against the repository. Runtime manifests must use repo-relative paths that actually exist.*

## Asset Sheet Manifest

Asset sheets are pantries. A manifest maps only selected sprites. Unused sprites may remain unused.

Fields:
* sheetId
* imagePath
* cellWidth
* cellHeight
* columns
* rows
* status
* usage
* sprites
* animations
* notes

Sprite entries should include:
* name
* row
* col
* widthCells
* heightCells
* used
* reserved
* notes

Animation entries should include:
* name
* frames
* frameDurationMs
* loop
* flipXAllowed
* notes

Examples:
* platformer goblin `runRight` animation, `flipXAllowed: true`
* top-down slime `moveDown` animation, `flipXAllowed: false` for up/down logic
* shared UI icon example
* unused/reserved sprite example

## Runtime / Build Manifest

The Hub must distinguish source from build from playable installed state.

Fields:
* gameId
* mode
* sourceAvailable
* buildAvailable
* buildPath
* launchType
* devCommand
* port
* strictPort
* processManagedByHub
* lastVerified
* notes

Dev mode vs Distribution mode:
* Dev mode may use pnpm/Vite with strict port and process tracking.
* Distribution mode should prefer bundled static builds.
* No absolute local user paths in runtime manifests.

## Release / Itch Manifest

Later, release metadata may track:
* itch project slug
* version
* build channel
* platform targets
* asset/icon/cover references
* changelog path
* release checklist path

Do not implement release yet.

## Path Rules

* repo-relative paths only
* no `C:\Users\kryst`
* no `file:///`
* no `.gemini` / Antigravity brain paths
* no generated temp paths
* no secrets
* no node_modules/dist/.vite tracked assumptions

## Manifest Location Proposal

* `manifests/academy/core/academy.games.json`
* `manifests/academy/visual-pantry/`
* `manifests/academy/games/`
* `manifests/academy/topdown/`
* `manifests/academy/tooling/`
* `manifests/runtime/` *(future)*
* `manifests/release/` *(future)*

H5.91 created categorized manifest shelves, and H5.91A refined those shelves by authority/maturity. Active/current manifests remain visible at category roots; lineage, planning, deferred, generated, and execution records live in nested maturity folders.

## Integration Order

1. Write/approve manifest schemas.
2. Create draft game manifest.
3. Create draft asset manifest for one sheet only.
4. Scaffold Hub shell.
5. Read game manifest into Hub.
6. Display game cards.
7. Implement source/build/playable status display.
8. Implement launch flow.
9. Add asset previews later.
10. Package/distribution work later.

## Non-Goals

* This doc does not create the Hub.
* This doc does not implement manifests.
* This doc does not wire assets into games.
* This doc does not wire Level 1 visual runtime integration.
* This doc does not publish to itch.
* This doc does not install dependencies.

## Open Questions

* Should manifests be JSON, YAML, or TypeScript data modules?
* Should asset manifests be hand-authored first or generated by a slicing tool later?
* Should the Hub use static bundled builds first or dev server launching first?
* Which H6 lane should perform the first Button Goblin Clicker runtime visual integration?
* Should public releases include source-only, playable builds, or both?
