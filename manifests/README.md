# Manifests

This folder contains draft and future source-of-truth manifests for Tiny Goblin Academy.

H5.91 reorganized the manifest shelf from a flat root pile into categorized folders. H5.91A refined those shelves by maturity/authority so current manifests do not sit beside lineage, planning, deferred, or execution records as equal-looking peers.

The root should contain this `README.md` plus category folders only.

## Authority / Maturity Rule

Active/current manifests stay visible at the category root.

Examples:

```text
manifests/academy/games/pet-campfire/
  academy.pet-campfire.background.scene-anchors.json
  academy.pet-campfire.ember-pup.pose-cleanup-candidate.json
  academy.pet-campfire.static-props-icons.cleanup-candidate.json
  lineage/
  planning/
```

Nested maturity folders mean:

- `lineage/` — earlier intake, region mapping, pose candidates, source inventory, or superseded cleanup candidates kept for provenance.
- `planning/` — plans, selections, designs, placement grammars, layout compositions, font plans, organization plans, and tool plans.
- `generated/` — generated registry or derived machine-readable outputs.
- `execution/` — move-pass, audit, or migration execution records.
- `deferred/` — explicit reference-only or deferred manifests.
- `denied/` — do-not-use guardrail records, if split at manifest level.

Do not treat all manifests in a category folder as equal authority. Root-level files inside a category are the current shelf references. Nested files are still preserved, but their folder name tells future goblins why they are not the first thing to grab.

## Current Shelf Map

```text
manifests/
  README.md
  academy/
    core/
    hub/
    shared/
    creatures/
    games/
    topdown/
    visual-pantry/
    fonts/
    runtime/
    tooling/
  boot/
```

## Key Active Manifests

- Academy game roster: `manifests/academy/core/academy.games.json`
- Hub icon manifest: `manifests/academy/hub/hub.icons.json`
- Hub icon source regions: `manifests/academy/hub/hub.icon-regions.json`
- Visual asset pantry index: `manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json`
- Font direction selection: `manifests/academy/fonts/academy.font-pantry-core-selection.json`
- Manifest maturity index: `manifests/academy/tooling/organization/academy.manifest-maturity-index.json`
- H6 runtime shell planning: `manifests/academy/runtime/planning/academy.shell-refactor-and-ingame-hud-plan.json`
- H6 minimal runtime shell contract: `manifests/academy/runtime/planning/academy.minimal-runtime-shell-contract.json`
- GlyphForge/tooling plans: `manifests/academy/tooling/glyphforge/planning/`
- Latest organization execution records: `manifests/academy/tooling/organization/execution/`

## Active Counts By Category

As of H5.91A:

```text
academy/core                                      1
academy/creatures                                 7
academy/fonts                                     1
academy/games/button-goblin-clicker               1
academy/games/card-goblin-duel                    2
academy/games/dice-duel-tavern                    1
academy/games/dungeon-platformer                  1
academy/games/one-room-platformer                 1
academy/games/pet-campfire                        3
academy/games/potion-sorter                       1
academy/games/tiny-farm-day                       1
academy/hub                                       4
academy/shared                                    2
academy/tooling/organization                      1
academy/topdown/future-floor-tilesheets           1
academy/topdown/objects                           1
academy/topdown/terrain                           1
academy/topdown/walls                             2
academy/visual-pantry                             1
boot                                              1
```

## Rules

- Paths must be repo-relative.
- No local absolute paths.
- No generated temp paths.
- No secrets.
- No launch/process behavior is implemented by these manifests.
- Runtime approval is never inferred from manifest presence.
- Active/current does not mean runtime-approved.
- Reviewed does not mean runtime-approved.
- Lineage does not mean delete.
- Planning does not mean current runtime behavior.
- Historical lane reports may mention old flat paths; active machine-readable references should use the nested manifest paths.

## Validation

Use the standard validation path:

```text
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/smoke-check.mjs
node scripts/asset-pipeline/cli.mjs validate
```
