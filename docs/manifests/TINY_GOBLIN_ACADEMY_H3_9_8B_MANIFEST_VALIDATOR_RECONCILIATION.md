# Tiny Goblin Academy H3.9.8B Manifest Validator Reconciliation

* **Task:** H3.9.8B — Reconcile Academy Manifest Validator After Level 1 Restoration
* **Baseline Commit:** 65185b2 docs: register new academy source assets

## Reason for Task
During Asset Intake A0, the `validate-academy-manifest.mjs` script failed. The failure was caused by the validator continuing to expect `tga-01` (Button Goblin Clicker) to be in a `restorationDeferred` state, with `sourceAvailable` and `buildAvailable` set to `false`.

## Current Level 1 Truth
Level 1 (Button Goblin Clicker) was fully restored during the H3.x milestone. The H3.9 Dev Launcher successfully runs the game. The `manifests/academy.games.json` correctly reflects this active state. The drift was entirely within the hardcoded assertions of the validation script.

## Pre-Patch Validator Failure
```text
Validation failed with 7 errors:
 - tga-01 sourceAvailable must be false
 - tga-01 devRunnable must be false
 - tga-01 buildAvailable must be false
 - tga-01 playableAvailable must be false
 - tga-01 playableMode must be none
 - tga-01 restorationDeferred must be true
 - tga-01 sourcePath must be null
```

## Files Changed
* `scripts/validate-academy-manifest.mjs`

## Verifications
* **Asset Image Modification:** None.
* **Hub/Game Runtime Behavior:** None.

## Post-Patch Validator Results
```text
✅ Manifest validation passed
 - Path: C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\manifests\academy.games.json
 - Games count: 10
 - Verified source folders: 10
 - Level 1 restored invariant verified
✅ Hub Icon Regions validation passed
 - Sheet: assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png
 - Dimensions: 768x1376
 - Mapped Regions: 10
```

## Recommended Next Task
**H4.0 Asset Pantry Census + Intake Plan**
