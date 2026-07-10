# Tiny Goblin Academy — H5.67 Run-Log + Manifest Provenance Contract

## Purpose

H5.67 makes the H5.66 asset-pipeline lockdown enforceable.

H5.66 created the canonical CLI, cleanup method registry, run-log helper, and non-stub lane wrappers. H5.67 adds the provenance contract and validator so future agents cannot claim “pipeline processed” unless the artifact records which canonical tool, command, method, source hash, output hash, and run log produced it.

## Why H5.67 Exists

H5.65 proved the gap:

- the manifest/evidence/review workflow was disciplined;
- the cleanup operation used non-canonical inline pixel logic;
- the result looked sloppy;
- the artifact still had enough paperwork that a future agent might mistake it for a normal pipeline product.

H5.66 made the command surface real.

H5.67 makes provenance checkable.

## Implemented Tooling

New files:

- `scripts/asset-pipeline/lib/provenance-contract.mjs`
- `scripts/asset-pipeline/validate-pipeline-provenance.mjs`

Updated files:

- `scripts/asset-pipeline/cli.mjs`
- `scripts/asset-pipeline/lib/run-log.mjs`
- `scripts/asset-pipeline/smoke-check.mjs`

New CLI commands:

```powershell
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --hard
```

## Run-Log Schema

Future evidence folders should contain:

`pipeline-run-log.json`

Required run-log fields:

```json
{
  "schemaVersion": "0.1",
  "contractVersion": "0.1",
  "tool": "scripts/asset-pipeline/cli.mjs",
  "command": "cleanup-candidate",
  "method": "flood-fill-gray-background",
  "methodStatus": "canonical-with-caution",
  "laneId": "h5-xx-example-lane",
  "agent": "codex",
  "gitBaseline": "abc1234 docs: previous lane",
  "startedAt": "2026-07-08T00:00:00.000Z",
  "completedAt": "2026-07-08T00:01:00.000Z",
  "sourcePath": "assets/academy/example/source.png",
  "sourceSha256": "sha256",
  "inputManifests": [
    "manifests/example.regions.json"
  ],
  "outputFiles": [
    {
      "path": "assets/academy/example/derived/example-cleaned.png",
      "sha256": "sha256"
    }
  ],
  "evidenceFiles": [],
  "validationCommands": [],
  "warnings": [],
  "sourcePngModified": false,
  "runtimeFilesModified": false,
  "status": "completed"
}
```

## Manifest `pipelineRun` Schema

Future generated manifests should include:

```json
{
  "pipelineRun": {
    "tool": "scripts/asset-pipeline/cli.mjs",
    "command": "cleanup-candidate",
    "method": "flood-fill-gray-background",
    "methodStatus": "canonical-with-caution",
    "runLog": "assets/academy/evidence/<lane>/pipeline-run-log.json",
    "sourceSha256": "sha256",
    "generatedAt": "2026-07-08T00:01:00.000Z",
    "gitBaseline": "abc1234 docs: previous lane",
    "sourcePngModified": false,
    "runtimeFilesModified": false
  }
}
```

## Legacy Manifest Policy

Do not backfill every old manifest in H5.67.

Old manifests are treated as:

```text
legacy-pre-H5.67
```

This means:

- they remain valid historical pipeline artifacts;
- they are allowed in `--legacy-ok` mode;
- they are expected to fail hard provenance mode until migrated or regenerated;
- future agents must not use their missing provenance as permission to continue missing provenance.

## Hard Enforcement Policy

H5.67+ generated asset outputs must include:

- `pipelineRun` in the manifest;
- `pipeline-run-log.json` in the evidence folder;
- registered command/method names;
- valid method status;
- source and output hashes;
- `sourcePngModified: false`;
- `runtimeFilesModified: false` for asset-only lanes.

The validator must fail if:

- hard mode is used and a manifest lacks `pipelineRun`;
- a manifest claims pipeline use but has invalid `pipelineRun`;
- an experimental method is treated as reviewed/runtime-ready;
- source PNG mutation is recorded;
- runtime file mutation is recorded for asset-only lanes.

## Valid Provenance Example

Valid:

```json
{
  "status": "draft",
  "runtimeEligibility": "not-runtime-approved",
  "pipelineRun": {
    "tool": "scripts/asset-pipeline/cli.mjs",
    "command": "cleanup-candidate",
    "method": "edge-connected-checker-cleanup",
    "methodStatus": "canonical-with-caution",
    "runLog": "assets/academy/evidence/h5-example/pipeline-run-log.json",
    "sourceSha256": "abc",
    "generatedAt": "2026-07-08T00:00:00.000Z",
    "gitBaseline": "abc1234 docs: previous lane",
    "sourcePngModified": false,
    "runtimeFilesModified": false
  }
}
```

Invalid:

```json
{
  "status": "reviewed",
  "runtimeEligibility": "runtime-approved",
  "pipelineRun": {
    "method": "blank-cell-reference-experimental",
    "methodStatus": "experimental-unsafe-default",
    "sourcePngModified": true
  }
}
```

Reasons invalid:

- experimental method treated as reviewed/runtime-ready;
- source mutation recorded;
- missing required provenance fields.

## Validation Results

H5.67 validation ran:

```powershell
node scripts/asset-pipeline/cli.mjs --help
node scripts/asset-pipeline/cli.mjs list-cleanup-methods
node scripts/asset-pipeline/cli.mjs validate
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
node scripts/asset-pipeline/smoke-check.mjs
```

The provenance validator found 43 production manifests and classified them as legacy-pre-H5.67 in legacy-ok mode. No production manifests were modified in H5.67.

## Non-Goals

- No asset sheets processed.
- No cleanup candidates created.
- No source PNGs modified.
- No derived PNGs modified.
- No evidence PNGs modified.
- No production manifests backfilled.
- No game/runtime code changed.
- No package files or lockfiles changed.

## Future Migration Plan

1. H5.68 should reclassify H5.65 under the new doctrine as failed/partial cleanup evidence.
2. Future asset lanes should generate run logs and `pipelineRun` provenance from the start.
3. A later migration lane may index or backfill provenance for selected old artifacts only when useful.
4. Hard mode should become a pre-commit gate for H5.67+ generated manifests once the next generated asset lane proves the contract.

## Final Doctrine

```text
If the pipeline did it, the run log can prove it.
If the run log cannot prove it, the pipeline did not do it.
```

