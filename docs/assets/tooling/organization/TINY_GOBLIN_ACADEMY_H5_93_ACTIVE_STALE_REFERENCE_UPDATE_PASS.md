# Tiny Goblin Academy — H5.93 Active/Stale Reference Update Pass

## Purpose

H5.93 updates active/current overview and discovery docs after the H5.91, H5.91A, and H5.92 shelf reorganizations. This pass corrects living signs, not fossil records.

## Baseline

- Baseline commit: `35da51e chore: reorganize asset docs folders`
- Prior lane: H5.92 asset docs reorganization move pass

## Scope

Updated current-facing overview docs, strategy docs, README surfaces, and active planning references. Historical H reports and incident reports were intentionally not broadly rewritten.

## Inspected files

- `README.md`
- `docs/README.md`
- `CONTRIBUTING.md`
- `meta/progress-tracker.md`
- `manifests/README.md`
- `docs/assets/README.md`
- `docs/manifests/TINY_GOBLIN_ACADEMY_MANIFEST_STRATEGY.md`
- `docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
- `manifests/academy/core/academy.games.json`
- `scripts/validate-academy-manifest.mjs`
- `tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json`

## Updated files

- `README.md`
- `CONTRIBUTING.md`
- `meta/progress-tracker.md`
- `docs/README.md`
- `docs/manifests/TINY_GOBLIN_ACADEMY_MANIFEST_STRATEGY.md`
- `docs/assets/README.md`
- `manifests/README.md`
- `docs/assets/pantry/visual-assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

## Stale themes corrected

- Button Goblin Clicker / Level 1 corrected to source-available/restored in active README, CONTRIBUTING, and progress tracker
- Academy game roster path corrected to manifests/academy/core/academy.games.json
- Visual pantry, font pantry, and GlyphForge planning manifest paths corrected to nested H5.91/H5.91A shelves
- docs/assets and manifests README surfaces now point readers to categorized shelves and current execution records
- Runtime visual integration remains future work; Button Goblin Clicker remains first planned candidate; Top-Down Slime Quest remains last or near-last
- GlyphForge remains paused after H5.88E with H5.88F as the return point; font binary intake remains future work

## Historical files intentionally preserved

- Historical H1/H2/H3/H4/H5 lane reports
- Old incident/source-loss reports
- Historical asset evidence reports that mention old flat paths
- GlyphForge generated registry JSON, because its checked paths already matched active manifests/assets

## Button Goblin Clicker / Level 1 correction

Active docs now reflect the current manifest/validator truth: Button Goblin Clicker / Level 1 is source-available and restored under `games/tier-1/01-button-goblin-clicker`. Older source-loss and restoration-deferred language remains historical record only.

## Manifest/docs shelf correction

Active docs now point to the nested manifest shelf created by H5.91/H5.91A and the categorized `docs/assets/` shelf created by H5.92. Current docs should not imply that manifests or asset reports still live in one flat root pile.

## Runtime/tool/font boundaries

- Runtime visual integration has not started.
- Button Goblin Clicker remains the first planned runtime visual integration candidate.
- Top-Down Slime Quest remains last or near-last for runtime visual integration.
- GlyphForge tool work remains paused after H5.88E; the next planned return point is H5.88F — GlyphForge Region Browser Image Preview Plan.
- Font binary intake remains future work after H5.89/H5.90.

## Non-goals

- No files were moved.
- No folders were reorganized.
- No runtime/game code changed.
- No PNGs/images changed.
- No package/lock files changed.
- No dependency installs occurred.
- Historical reports were not broadly rewritten.

## Execution manifest

- `manifests/academy/tooling/organization/execution/academy.active-stale-reference-update-execution.json`

## Recommended next lane

H5.94 — return to either runtime visual integration planning for Button Goblin Clicker or a narrowly scoped docs/start-here polish pass if another stale active surface appears.
