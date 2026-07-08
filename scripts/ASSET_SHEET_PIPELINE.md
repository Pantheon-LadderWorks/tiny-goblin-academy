# Tiny Goblin Academy Asset Sheet Pipeline

Companion document for the asset cleanup and sprite-region scripting tools.

This document exists because a sheet filename is not enough for runtime use. A sheet must be cleaned, inspected, mapped, reviewed, and promoted before game code should depend on it.

## Current Related Assets / Docs

Known related scripts:

- `scripts/asset-pipeline/cli.mjs`
- `scripts/asset-pipeline/lib/cleanup-method-registry.mjs`
- `scripts/asset-pipeline/lib/run-log.mjs`
- `scripts/clean-fake-transparent-sheet.py`
- `scripts/clean-hub-icon-checkerboard.py`
- `scripts/validate-hub-icon-regions.mjs`
- `scripts/validate-hub-icons.mjs`
- `scripts/validate-academy-manifest.mjs`

Known related manifests:

- `manifests/hub.icons.json`
- `manifests/hub.icon-regions.json`
- `manifests/academy.games.json`

Known related planning/report docs from the repository tree:

- `TINY_GOBLIN_ACADEMY_ASSET_SHEET_INTAKE_CHECKLIST.md`
- `TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
- `TINY_GOBLIN_ACADEMY_HUB_ASSET_PLAN.md`
- `TINY_GOBLIN_ACADEMY_VISUAL_ASSET_PASS_PLAN.md`

Note: this companion does not replace those documents. It gathers the script-facing pipeline in one place so Anti-Gravity, Desktop Commander, and humans have the same operating model.

## Non-Negotiable Rules

1. Never overwrite source art.
2. Scripts may write only to `derived/`, `evidence/`, `candidate/`, or explicitly named output paths.
3. Candidate manifests are not runtime truth.
4. Runtime manifests require human/assistant review.
5. Animation sheets must not be blindly processed by the fake-transparency cleaner.
6. Every automated pass must produce visual evidence.
7. Every region must be bounds-validated before use.
8. Every promoted sprite must have a semantic name.
9. Every future cleanup/mapping/evidence run must use the canonical CLI or a documented canonical helper.
10. Every future cleanup method must be registered before use.
11. Every future run should write `pipeline-run-log.json`.

## Sheet Categories

Each source image should be classified before any cleanup or detection:

- `background-stage`: full scene background; no sprite detection.
- `ui-icon-sheet`: static icons or card art.
- `static-prop-sheet`: props, items, pickups, signs, bowls, keys.
- `tile-sheet`: tiles, platforms, terrain pieces, walls.
- `character-animation-sheet`: player, pet, enemy, or NPC animation frames.
- `fx-sheet`: sparkles, impact effects, smoke, fire, feedback icons.

The category determines which pipeline stages are safe.

## Pipeline Overview

### 1. Intake

For each sheet, record:

- source path
- intended game or shared domain
- image width and height
- file size
- image mode
- alpha channel status
- category
- notes about fake transparency, grid layout, or irregular layout

Output:

- `evidence/<sheet-id>/01-source-metadata.json`

### 2. Transparency Diagnostic

Determine whether the sheet has:

- real alpha
- fake checkerboard transparency
- opaque illustration background
- mixed/uncertain background

Output:

- `evidence/<sheet-id>/02-alpha-preview.png`
- `evidence/<sheet-id>/03-dark-bg-preview.png`

If the sheet is a background-stage asset, stop here and create an anchor manifest instead of sprite regions.

### 3. Fake Transparency Cleanup

Use `clean-fake-transparent-sheet.py` only when the fake transparent checkerboard is connected to the image borders and the target pixels are low-saturation gray-like background.

Safe/default candidates:

- hub icon sheets
- simple UI sheets
- static prop sheets with clean border-connected checkerboard

Danger candidates:

- character animation sheets
- sheets with gray character details
- sheets with shadows, smoke, metal, outlines, or gray props

For danger candidates, run a pilot on one copy and inspect evidence before accepting.

Output:

- `assets/.../derived/<sheet-id>-transparent-v0.1.png`
- `evidence/<sheet-id>/04-cleaned-dark-bg-preview.png`
- `evidence/<sheet-id>/05-cleaned-alpha-preview.png`

The cleaned file is still a candidate, not runtime truth.

### 4. Candidate Sprite Detection

After a sheet has usable alpha, run connected-component detection over non-transparent pixels.

The detector should:

- find non-transparent pixel clusters
- compute bounding boxes
- filter dust and tiny fragments
- optionally merge nearby components
- sort regions top-to-bottom, left-to-right
- write candidate JSON
- generate visual evidence

Output:

- `manifests/candidate/<sheet-id>.regions.candidate.json`
- `evidence/<sheet-id>/06-bbox-overlay.png`
- `evidence/<sheet-id>/07-numbered-contact-sheet.png`

The detector finds rectangles. It does not know what the rectangles mean.

### 5. Human / Assistant Labeling

Candidate regions must be labeled into semantic names before runtime use.

Examples:

- `idle_right_01`
- `walk_right_02`
- `sleep_right_01`
- `food_bowl`
- `water_bowl`
- `happy_fx_01`

### 6. Animation Arrays

Character and pet sheets need animation arrays in addition to sprite rectangles.

Example shape:

```json
{
  "animations": {
    "idleRight": ["idle_right_01", "idle_right_02"],
    "walkRight": ["walk_right_01", "walk_right_02"],
    "eatRight": ["eat_right_01"],
    "sleepRight": ["sleep_right_01", "sleep_right_02"]
  }
}
```

For MVP, prefer right-facing frames plus engine-side horizontal flip unless the art is asymmetrical enough to require dedicated left-facing arrays.

### 7. Anchors and Pivots

Runtime regions should include placement metadata where useful:

- `pivot`: character foot point or draw origin
- `hitbox`: collision body
- `hurtbox`: damage receiving region
- `anchor`: prop placement or scene attachment point
- `tags`: search/group metadata

### 8. Promotion Gates

Promotion stages:

1. `candidate`: generated by script, not trusted.
2. `reviewed`: visually inspected and semantically labeled.
3. `runtime`: validated and safe for game code.

Only runtime manifests should be imported by the hub/game code.

Promotion checklist:

- all regions are inside image bounds
- no source art overwritten
- alpha preview inspected
- bbox overlay inspected
- numbered contact sheet inspected
- semantic labels assigned
- animation arrays checked in order
- manifest validates against schema

## Recommended Output Layout

```text
assets/.../derived/
evidence/<sheet-id>/
manifests/candidate/
manifests/reviewed/
manifests/runtime/
```

## Pet Campfire Specific Pipeline

Pet Campfire has two different asset needs:

### Background Stage

The campfire background should not be sprite-detected. It needs a scene anchor manifest.

Suggested anchors:

- `petLaneMinX`
- `petLaneMaxX`
- `petGroundY`
- `foodBowl`
- `waterBowl`
- `toy`
- `sleepSpot`
- `statusFx`
- `victoryBadge`

### Ember Pup Sheet

The ember pup sheet should be treated as a `character-animation-sheet` plus possible prop/status regions.

Start with a pilot pass only:

- inspect metadata
- diagnose transparency
- generate candidate cleanup
- generate bbox overlay
- generate numbered contact sheet
- do not batch promote

Initial animation targets:

- `idleRight[]`
- `sitRight[]`
- `walkRight[]`
- `eatRight[]`
- `drinkRight[]`
- `playRight[]`
- `sleepRight[]`
- `happyRight[]`
- `sadRight[]`
- `distressedRight[]`

Left-facing behavior can be engine-flipped until explicit left frames are needed.

## Anti-Gravity Operating Mode

Until the Anti-Gravity backend is trusted, it should run as an evidence generator only.

Allowed:

- read source files
- write candidate outputs
- write evidence images
- write reports

Not allowed:

- overwrite source images
- overwrite runtime manifests
- batch-process every sheet without a pilot
- promote candidates without review

The first trusted command should process one sheet, write evidence, write a candidate manifest, and stop.

## Script Roadmap

H5.66 establishes `scripts/asset-pipeline/cli.mjs` as the canonical command surface and converts lane scripts into wrappers over it. The CLI now covers:

- source inspection;
- lane profile lookup;
- cleanup method registry lookup;
- evidence generation;
- cleanup candidate dispatch through registered methods;
- validation;
- run-log writing.

The remaining roadmap is to deepen the CLI, not to create more one-off scripts:

- add first-class grid mapping commands;
- add manifest promotion commands;
- add evidence index/vault support;
- add manifest provenance validation;
- wrap animation evidence through the CLI;
- retire or register any useful legacy/pilot method explicitly.

The pipeline should remain boring and auditable. The goal is not magic. The goal is safe asset cartography.

## H5.67 Run-Log + Manifest Provenance Contract

H5.67 adds executable provenance validation so future asset outputs can prove how they were created.

Canonical commands:

```powershell
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
```

Future H5.67+ generated manifests must include `pipelineRun` metadata that links to an evidence-folder `pipeline-run-log.json`. The run log must identify the canonical tool, command, registered method, method status, source hash, output hashes, git baseline, and source/runtime mutation flags.

Pre-H5.67 manifests remain valid as `legacy-pre-H5.67` under legacy-ok validation. Missing provenance is not acceptable for new generated asset outputs.

## Final Runtime Principle

Game code should not know about messy concept sheets.

Game code should know only:

- approved sheet path
- semantic sprite IDs
- animation arrays
- pivots / anchors / hitboxes
- validation status

Everything else belongs to intake, evidence, and review.
