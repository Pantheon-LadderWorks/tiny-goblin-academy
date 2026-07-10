# Tiny Goblin Academy — H4.5 Hub Banner & Main Boot Runtime Integration

## Task Name
H4.5 — Hub Banner + Main Boot Runtime Integration

## Baseline
* **Baseline Commit SHA:** `0cffd8b docs: add glyphforge boot surface evidence`

## Review Decisions
* **H4.3 Banner Review Decision:** VIABLE FOR FUTURE INTEGRATION. Runtime integration approved for H4.5 ONLY with plaque/frame treatment to contrast against the app header. Preferred target: ~340px max-width.
* **H4.4 Boot Review Decision:** APPROVED FOR RUNTIME INTEGRATION. Preferred layout: C — Centered Title + Lower Status.

## Note on Combined Execution
> H4.5 intentionally combines banner + boot runtime integration to avoid repeated Tauri rebuilds for tiny visual surfaces.
> Per-game loading screens remain deferred and untouched.

## Files Changed
* `hub/src/components/HubShell.tsx`
* `hub/src/components/BootScreen.tsx`
* `hub/src/styles/hub.css`
* `manifests/hub.identity-assets.json`
* `manifests/boot.identity-assets.json`
* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_HUB_ASSET_PLAN.md`
* (And documentation)

## Implementation Summary
### Hub Banner
Integrated `tga-hub-banner-source-v0.1.png` into `HubShell.tsx`, replacing the raw `<h1>` text title. Framed the banner in a new `.hub-title-banner-frame` using Mega's recommended CSS treatment (a dark gradient, thin gold border, and soft glowing shadow). The banner correctly scales to a `340px` maximum width.

### Boot Screen
Modernized `BootScreen.tsx` to display `glyphforge-games-boot-splash-concept.png` as a full-screen hero image using Layout C (Centered Title, Lower Status + Skip button). Applied text shadows to ensure title readability against the background.

## Manifest Updates
Updated `hub.identity-assets.json` and `boot.identity-assets.json` assets:
*   `reviewStatus` to `approved-for-runtime-integration`
*   `runtimeEligibility` to `integrated-in-h4.5`
*   Added `human-reviewed` and `runtime-integrated` to `readinessState`
*   Added specific integration layout/frame notes

## Validation & Build Results
* **Frontend Build:** Successfully verified via `pnpm build`.
* **Packaged Tauri Build:** Verified.

## Runtime Verification Notes
*   Main app boot screen displays full-screen. No inset image, no white flash. Title is readable, skip button is visible and works.
*   Hub header cleanly mounts the banner as a plaque/frame. Subtitle remains readable below the frame. Game grid is not pushed downwards awkwardly.
*   Per-game launch remains functional.

## Explicit Non-Goals
*   No source image pixels were modified.
*   No per-game loading screens or game code changed.
*   No raw Python scripts or retained audit artifacts were modified or staged.
*   No CodeCraft Native files touched.

## Known Follow-Up Items
*   Future optional micro-favicon polish
*   Future per-game loading screen asset pass
*   Future hub visual shell modular component plan