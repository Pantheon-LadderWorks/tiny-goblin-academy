# Tiny Goblin Academy — H5.66 Asset Pipeline CLI Lockdown Audit

## Purpose

H5.66 pauses the asset pass and turns the asset pipeline from a prompt ritual into an executable command surface.

The immediate trigger was H5.65. The manifest, evidence, validation, and commit workflow stayed disciplined, but the Topdown Objects cleanup operation used custom inline blank-cell-reference pixel logic instead of a canonical reusable asset-pipeline command. The result was valid paperwork around a weak cleanup method. That is exactly the failure mode this lane locks down.

## Baseline

Baseline commit before H5.66:

`5b100d2 docs: add topdown objects cleanup candidate`

No new asset sheets were processed in H5.66. No source PNGs, derived PNGs, evidence PNGs, manifests, game files, runtime files, package files, lockfiles, or dependency folders were modified.

## Current Script Inventory

| Path | Classification | Notes |
| --- | --- | --- |
| `scripts/asset-pipeline/cli.mjs` | canonical CLI | New H5.66 command surface for inspection, evidence, cleanup method dispatch, validation, and run-log writing. |
| `scripts/asset-pipeline/lib/cleanup-method-registry.mjs` | canonical helper | Registers allowed cleanup methods and blocks silent one-off pixel methods. |
| `scripts/asset-pipeline/lib/run-log.mjs` | canonical helper | Builds and writes machine-readable pipeline run logs. |
| `scripts/asset-pipeline/lib/file-hash.mjs` | canonical helper | Computes SHA256 provenance for sources and outputs. |
| `scripts/asset-pipeline/lib/asset-taxonomy.mjs` | canonical helper | Defines lane profiles, asset types, readiness states, risk levels, and workflow vocabulary. |
| `scripts/asset-pipeline/lib/image-metadata.mjs` | canonical helper | Reads lightweight image metadata for source inspection. |
| `scripts/asset-pipeline/lib/manifest-utils.mjs` | canonical helper | Reads/writes and validates asset manifests. |
| `scripts/asset-pipeline/lib/rect-utils.mjs` | canonical helper | Validates rectangle shape and bounds. |
| `scripts/asset-pipeline/lib/evidence-utils.mjs` | canonical helper | Defines evidence folder/file naming helpers. |
| `scripts/asset-pipeline/make-region-evidence.py` | canonical evidence generator | Generates synchronized bbox overlay, contact sheet, and table evidence. |
| `scripts/asset-pipeline/make-animation-evidence.py` | candidate CLI component | Useful animation evidence generator; should later be wrapped by `cli.mjs`. |
| `scripts/asset-pipeline/pipeline-index.mjs` | compatibility wrapper | Now delegates lane profile lookup to `cli.mjs`. |
| `scripts/asset-pipeline/smoke-check.mjs` | canonical validator | Now verifies CLI, run-log helper, method registry, lane wrappers, and evidence generator. |
| `scripts/asset-pipeline/lanes/*.mjs` | canonical lane wrappers | Converted from help-only stubs into wrappers over `cli.mjs profile`. |
| `scripts/clean-fake-transparent-sheet.py` | canonical-with-caution cleanup implementation | Existing edge-connected gray/checker flood-fill cleaner, now wrapped by the cleanup method registry as `flood-fill-gray-background`. |
| `scripts/asset-pipeline/pilot-color-key-cleanup.py` | pilot/prototype | Hardcoded old pilot; not production cleanup. |
| `scripts/asset-pipeline/pilot-crop-and-flood.py` | pilot/prototype | Hardcoded old pilot; not production cleanup. |
| `scripts/asset-pipeline/rewrite-manifest.js` | pilot/prototype | Historical manifest rewrite utility; not a general lane command. |
| `scripts/asset-pipeline/legacy/` | legacy/read-only reference | Birthday-build and H4 archaeology scripts. Do not treat as production commands. |
| `scripts/validate-academy-asset-manifests.mjs` | canonical validator | Asset manifest validation. |
| `scripts/validate-academy-animation-manifests.mjs` | canonical validator | Animation manifest validation. |
| `scripts/validate-academy-manifest.mjs` | canonical validator | Academy game manifest validation. |
| `scripts/validate-hub-icon-regions.mjs` | canonical validator | Hub icon source-region validation. |
| `scripts/validate-hub-icons.mjs` | canonical validator | Hub icon manifest validation. |

## What Was Already Useful

- The H5 workflow docs correctly separated source truth, evidence truth, and runtime truth.
- The prompt templates correctly required clean baselines, exact staging, human review, and no runtime smuggling.
- The region evidence generator was already reusable and valuable.
- The taxonomy/lane profile library already captured many of the right safety distinctions.
- The H5.9 CLI plan already identified the core risk: fragmented one-off scripts become technical debt.

## What Was Missing

- A single canonical command surface.
- A cleanup method registry.
- Machine-readable run logs.
- Manifest provenance fields for future generated outputs.
- A rule that unregistered pixel methods are forbidden by default.
- A way to distinguish canonical, caution, pilot-only, experimental, and deprecated cleanup methods.
- Smoke-check enforcement for the CLI organs.

## H5.65 Failure Analysis

H5.65 should be treated as a proof case, not a successful precedent.

What worked:

- Source PNG remained untouched.
- The cleanup manifest was draft / needs-human-review / not-runtime-approved.
- Evidence was created.
- Validators passed.
- Runtime and game code stayed untouched.

What failed:

- The cleanup pixel method was inline custom logic.
- The method was not registered in the asset pipeline.
- No pipeline run log existed.
- The resulting cleanup was visually sloppy and not promotion-ready.
- The H5.65 method could have been mistaken for normal pipeline behavior by a future agent.
- H5.66 source inspection also identified the Topdown Objects source path as extension `.png` but actual detected format `JPEG`; that means fake checkerboard pixels are likely compressed into the art and should be treated as high cleanup risk.

H5.66 classifies the H5.65 blank-cell-reference approach as:

`experimental / unsafe-default / not promotion-ready`

## Immediate Lockdown Rules

1. Future asset operations must use `scripts/asset-pipeline/cli.mjs` or a documented canonical helper invoked through the lane prompt.
2. Inline cleanup scripts are forbidden by default.
3. No unregistered pixel method may create a normal cleanup candidate.
4. Weird edge cases must become registered experimental methods or be deferred.
5. Every cleanup/evidence/mapping run should write `pipeline-run-log.json`.
6. Every future generated manifest should reference tool provenance.
7. Source PNGs remain untouchable.
8. Runtime approval remains separate from asset cleanup.
9. Asset processing remains paused until the CLI/provenance layer is used for the next sheet.

## CLI Architecture Landed In H5.66

Canonical command surface:

`scripts/asset-pipeline/cli.mjs`

Implemented commands:

- `list-lanes`
- `profile --type <lane-type>`
- `list-cleanup-methods`
- `inspect-source --source <path>`
- `make-evidence --manifest <path> --out <folder>`
- `cleanup-candidate --method <method> --source <path> ...`
- `validate`
- `write-run-log`

The old `pipeline-index.mjs` now remains only as a compatibility wrapper.

## Registered Cleanup Methods

| Method | Status | CLI behavior |
| --- | --- | --- |
| `alpha-pass-through` | canonical | Implemented. Copies true-alpha source into derived review space with provenance. |
| `no-cleanup-reference-only` | canonical | Implemented. Records a no-cleanup/reference-only run. |
| `flood-fill-gray-background` | canonical-with-caution | Implemented through `scripts/clean-fake-transparent-sheet.py`. |
| `edge-connected-checker-cleanup` | canonical-with-caution | Implemented as alias of `flood-fill-gray-background`. |
| `color-key-cleanup` | pilot-only | Registered but blocked for production CLI use. |
| `grid-slice-only` | mapping-only | Registered as not-a-cleanup method. |
| `blank-cell-reference-experimental` | experimental-unsafe-default | Registered to prevent silent use; not promotion-ready. |
| `true-alpha-regenerated-source` | canonical | Implemented as provenance-preserving copy into derived review space. |

## Required Future Run Log Shape

Future evidence folders should include:

`pipeline-run-log.json`

Required fields:

- tool path
- command
- method
- method status
- agent/session
- git baseline
- source path
- source sha256
- manifest path
- output paths
- output sha256 values
- generated evidence files
- validation commands
- warnings
- whether source PNG was modified
- whether runtime files were modified

## Evidence Vault Recommendation

Current evidence under `assets/academy/evidence/` is useful but increasingly hard to index because it mixes asset-phase evidence, runtime screenshots, cleanup previews, debug artifacts, and historical lane outputs in one asset-adjacent tree.

H5.66 proposes a future root evidence vault:

`evidence/`

Do not move existing evidence yet. First create an index/migration plan so old report links remain valid or are explicitly mapped.

## Recommended Next Implementation Lanes

1. H5.67 — Asset Pipeline CLI Run-Log Integration + Manifest Provenance Contract
2. H5.68 — Re-run / reclassify H5.65 as cleanup rejected or partial using the canonical CLI language
3. H5.69 — Topdown true-alpha regeneration strategy for non-effect objects
4. H5.70 — Resume asset processing only after the canonical CLI is used in prompts and run logs

## Final H5.66 Decision

Asset processing is paused.

The pipeline law is now:

```text
No registered method, no cleanup.
No run log, no trust.
No source mutation, ever.
No runtime approval hiding inside asset prep.
```
