# Tiny Goblin Academy — H5.87 Manifest and Asset Docs Organization Plan

## 1. Current problem

H5.85 and H5.86 made the visual pantry useful enough that the shelves now matter. The project currently has a strong asset-processing record, but the storage shape is still mostly flat:

```text
manifests/      55 root files
docs/assets/   116 root files
```

That flat layout was fine while H5 was still discovering the asset machine. It is now becoming a recall problem for agents and future tools. A manifest can be a game asset, a shared asset, a topdown lane, a cleanup candidate, a scene-anchor plan, a functional slot map, a provenance/tooling plan, or a global pantry index, but the folder shape does not show those differences yet.

H5.87 does not move files. It records the organization plan so the next shelf-building lanes can happen deliberately.

## 2. Current manifest inventory summary

Current manifest inventory:

```text
manifests root files: 55
```

Observed groups:

| Group | Examples | Notes |
| --- | --- | --- |
| Academy core | `academy.games.json`, `academy.visual-asset-pantry-index.json` | Cross-game registry and pantry planning. |
| Hub / boot / identity | `hub.icons.json`, `hub.icon-regions.json`, `hub.identity-assets.json`, `boot.identity-assets.json`, `favicon.exports.json` | Launcher, hub visuals, icon exports, and boot identity surfaces. |
| Shared assets | `academy.shared-core.regions.json`, `academy.shared-fx.regions.json`, `academy.ui-hud.regions.json` | Shared/common-domain sheets and deferred FX status. |
| Creatures / animation | Goblin, platformer player, training dummy, topdown slimes, soldier manifests | Some are true animation manifests; some are state/pose or future candidates. |
| Game-specific assets | Pet Campfire, Dice Duel Tavern, Card Goblin Duel, Potion Sorter, Farm Settlement, Dungeon Platformer, Button Goblin Clicker | Mixed region, cleanup, functional-slot, scene-anchor, grammar, and composition records. |
| Topdown pantry | source inventory, terrain, walls, objects, regenerated sources, future floor tilesheets | This has become a large sub-domain and should not stay as scattered root files forever. |
| Tooling / planning | H5.87 organization plan, future migration plans, provenance-linked outputs | These are not runtime assets and should live in a tooling/planning shelf. |

## 3. Current docs inventory summary

Current docs inventory:

```text
docs/assets root files: 116
docs/hub files:        34
docs/manifests files:  2
docs/roadmap files:    3
docs/evidence files:   1
```

`docs/assets/` currently breaks down roughly as:

| Class | Count |
| --- | ---: |
| H5 reports | 88 |
| H4 reports | 14 |
| doctrine / pipeline / pantry docs | 13 |
| other | 1 |

The content is valuable, but it is arranged like a chronological scroll instead of a navigable asset operating system.

## 4. Proposed manifest structure

Recommended structure:

```text
manifests/
  README.md
  academy/
    core/
    hub/
    shared/
    creatures/
    games/
      button-goblin-clicker/
      potion-sorter/
      dice-duel-tavern/
      card-goblin-duel/
      tiny-farm-day/
      pet-campfire/
      one-room-platformer/
      dungeon-platformer/
      top-down-slime-quest/
    topdown/
      terrain/
      walls/
      objects/
      future-floor-tilesheets/
    visual-pantry/
    tooling/
  boot/
  legacy/
```

This shape keeps game-specific assets, topdown shared pantry assets, shared academy assets, creature/animation assets, and tooling/planning records from blending together.

## 5. Proposed docs/assets structure

Recommended structure:

```text
docs/assets/
  README.md
  doctrine/
  pipeline/
  pantry/
  game-assets/
    button-goblin-clicker/
    potion-sorter/
    dice-duel-tavern/
    card-goblin-duel/
    tiny-farm-day/
    pet-campfire/
    one-room-platformer/
    dungeon-platformer/
    top-down-slime-quest/
  topdown/
    terrain/
    walls/
    objects/
    future-floor-tilesheets/
  hub-visuals/
  evidence-architecture/
  archive/
```

Possible docs outside `docs/assets/` should stay in their more specific homes when they are not asset-lane docs:

```text
docs/manifests/
docs/hub/
docs/roadmap/
docs/evidence/
docs/workspace/
docs/architecture/
```

## 6. Move-map strategy

Do not move anything until a dry-run move map exists.

Representative move strategy:

| Current flat source | Proposed destination |
| --- | --- |
| `manifests/academy.games.json` | `manifests/academy/core/academy.games.json` |
| `manifests/hub.*.json` | `manifests/academy/hub/` |
| `manifests/boot.identity-assets.json` | `manifests/boot/` |
| `manifests/academy.shared-*.json` | `manifests/academy/shared/` |
| creature / animation manifests | `manifests/academy/creatures/` |
| `manifests/academy.pet-campfire.*.json` | `manifests/academy/games/pet-campfire/` |
| `manifests/academy.card-goblin-duel.*.json` | `manifests/academy/games/card-goblin-duel/` |
| `manifests/academy.topdown.terrain*.json` | `manifests/academy/topdown/terrain/` |
| `manifests/academy.topdown.walls*.json` | `manifests/academy/topdown/walls/` |
| `manifests/academy.topdown.objects*.json` | `manifests/academy/topdown/objects/` |
| `manifests/academy.topdown.floor-tilesheets.future.regions.json` | `manifests/academy/topdown/future-floor-tilesheets/` |
| `docs/assets/TINY_GOBLIN_ACADEMY_H4_*.md` | `docs/assets/hub-visuals/` |
| `docs/assets/*WORKFLOW*`, `*TUTORIAL*`, `*PROMPT*`, `*PIPELINE*` | `docs/assets/pipeline/` |
| `docs/assets/*DOCTRINE*`, `*SCENE_ANCHORS*`, `*FUNCTIONAL*` | `docs/assets/doctrine/` |
| H5 game-specific reports | `docs/assets/game-assets/<game>/` |
| H5 topdown reports | `docs/assets/topdown/<lane>/` |
| H5 pantry reports | `docs/assets/pantry/` |

Move-map law:

```text
plan first
update validators second
dry-run references third
move files fourth
validate fifth
```

## 7. Reference/update risk

The main risk is not the move itself. The risk is path references.

Likely affected surfaces:

- validators under `scripts/validate-*.mjs`;
- asset pipeline provenance validation under `scripts/asset-pipeline/`;
- docs that reference flat manifest paths;
- changelog entries that cite flat paths;
- reports that should remain historically truthful but may need current-path notes;
- future visual tools that should discover by registry, not hardcoded flat paths.

The safest migration pattern is recursive discovery plus a compatibility window:

```text
flat legacy paths accepted
new categorized paths accepted
then flat paths retired after review
```

## 8. Validators and scripts likely affected

Observed path-assumption candidates:

```text
scripts/validate-academy-asset-manifests.mjs
scripts/validate-academy-animation-manifests.mjs
scripts/validate-academy-shared-asset-regions.mjs
scripts/validate-hub-icon-regions.mjs
scripts/validate-hub-icons.mjs
scripts/asset-pipeline/validate-pipeline-provenance.mjs
scripts/asset-pipeline/smoke-check.mjs
scripts/asset-pipeline/cli.mjs
```

These should be reviewed before any physical manifest move. The preferred outcome is recursive manifest discovery with explicit category validation, not a larger pile of hardcoded paths.

## 9. Stale-doc candidates

Current stale or historically-bound notes found during H5.87:

| Path | Finding | Recommended treatment |
| --- | --- | --- |
| `README.md` | Button Goblin Clicker still labeled Historical / Restoration Deferred. | Update in a stale-doc correction lane. |
| `meta/progress-tracker.md` | Level 1 still says Source Missing / restoration deferred. | Update or mark as historical after current manifest truth is confirmed. |
| `CONTRIBUTING.md` | Level 1 described as deferred until hub/runtime architecture supports it. | Review before runtime visual integration. |
| `docs/hub/TINY_GOBLIN_ACADEMY_MINIMAL_HUB_SCAFFOLD_PLAN.md` | Includes Historical Pass / Restoration Deferred UI language. | Preserve as historical plan or add superseded-by note. |
| `docs/manifests/TINY_GOBLIN_ACADEMY_MANIFEST_STRATEGY.md` | Includes sample Level 1 missing/restoration-deferred JSON. | Update example or annotate as historical. |
| `docs/hub/reports/TINY_GOBLIN_ACADEMY_H1_HUB_COMPLETION_REPORT.md` | Says Level 1 correctly shows Restoration Deferred. | Preserve as historical evidence. |
| `docs/hub/reports/TINY_GOBLIN_ACADEMY_H1_6_HUB_SCREENSHOT_EVIDENCE.md` | Describes Button Goblin Clicker as historically passed without source. | Preserve as historical evidence. |
| `docs/hub/reports/TINY_GOBLIN_ACADEMY_H2_HUB_GRID_REDESIGN_REPORT.md` | Contains Restoration Deferred detail-view language. | Preserve as historical evidence. |
| `docs/incidents/STRUCTURAL_REFACTOR_INCIDENT_LEVEL_1_LOSS.md` | Historical incident record. | Preserve; do not rewrite away the incident. |

Important distinction:

```text
Current overview docs should become current.
Historical evidence reports should remain historical.
```

## 10. Safe migration phases

Recommended follow-up phases:

1. **H5.88 — Visual Tool Suite Registry Plan**  
   Plan how Flipbook, Sticker/Picture Book, Particle FX Viewer, and later audio tools should discover assets from the pantry.

2. **H5.89 — Font Pantry Intake Plan / Font Intake**  
   If fonts are needed before runtime polish, treat them as a separate visual-adjacent pantry lane.

3. **H5.90 — Manifest Folder Reorganization Dry Run**  
   Generate exact move map, update validators for recursive discovery, and validate both old and proposed paths.

4. **H5.91 — Asset Docs Reorganization Dry Run**  
   Generate exact docs/assets move map and link/reference update list before moving any reports.

5. **H5.92 — Stale Overview Docs Correction**  
   Update README/progress docs while preserving historical reports.

6. **H6.0 — Button Goblin Clicker Runtime Visual Integration Plan**  
   Plan the first runtime visual integration after shelves and tool discovery are stable.

7. **H6.1 — Button Goblin Clicker Background Runtime Wiring**  
   Wire the accepted Button Goblin Clicker background only after planning/review.

## 11. Recommended next lanes

Recommended immediate next lane:

```text
H5.88 — Visual Tool Suite Registry Plan
```

Reason: the pantry is now broad enough that tools should discover assets through a normalized registry instead of human memory or flat folders.

Then:

```text
H5.90 — Manifest Folder Reorganization Dry Run
H5.91 — Asset Docs Reorganization Dry Run
H5.92 — Stale Overview Docs Correction
```

Non-goals preserved:

- no manifests moved;
- no docs moved;
- no validators changed;
- no stale docs corrected yet;
- no runtime/game code changed;
- no PNGs or evidence images changed;
- no package/lock files changed.

Tiny shelf law:

```text
The pantry is real now.
Do not rearrange it by vibes.
Map the shelves before moving the jars.
```
