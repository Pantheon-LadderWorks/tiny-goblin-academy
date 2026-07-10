# Tiny Goblin Academy — Asset Pipeline CLI Lockdown Doctrine

## Purpose

This doctrine prevents asset processing from drifting back into one-off scripts, inline pixel logic, and “someone will finish this later” technical debt.

## Core Law

```text
The asset pipeline must be executable, logged, reviewable, and reusable.
```

The canonical command surface is:

`scripts/asset-pipeline/cli.mjs`

## No Inline Cleanup By Default

Future agents must not create normal cleanup candidates from inline Python, Node, PowerShell, notebook, or temporary scripts.

If a cleanup operation is needed, it must use a registered cleanup method.

If no registered method fits, the agent must choose one of:

1. register an explicit experimental method;
2. defer cleanup;
3. regenerate/export the asset as true alpha;
4. ask Kryssie for a new pipeline lane.

## No Unregistered Pixel Methods

Pixel methods include any operation that changes transparency, alpha, crop bounds, color keying, masks, halos, flood fills, edge cleanup, erosion, dilation, matting, or derived sheet pixels.

Unregistered pixel methods may not produce ordinary cleanup manifests.

## Registered Cleanup Method Statuses

Use these statuses consistently:

- `canonical`: allowed default method when lane rules permit it.
- `canonical-with-caution`: allowed only with evidence and human review.
- `pilot-only`: historical/probe method; not production cleanup.
- `experimental-unsafe-default`: recorded edge-case method; blocked unless explicitly approved for an experimental lane.
- `mapping-only`: not a cleanup method.
- `deprecated`: retained for archaeology only.

## H5.65 Method Classification

The H5.65 blank-cell-reference cleanup method is:

`experimental-unsafe-default`

It may be used as evidence of why the pipeline needs stricter controls. It must not be treated as a successful standard cleanup method.

## Run Log Requirement

Every future cleanup, mapping, and evidence operation should write:

`pipeline-run-log.json`

Recommended location:

`assets/academy/evidence/<lane>/pipeline-run-log.json`

The log must record:

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

## Manifest Provenance Requirement

Future generated manifests should include a provenance block such as:

```json
{
  "pipelineRun": {
    "tool": "scripts/asset-pipeline/cli.mjs",
    "command": "cleanup-candidate",
    "method": "flood-fill-gray-background",
    "methodStatus": "canonical-with-caution",
    "runLog": "assets/academy/evidence/<lane>/pipeline-run-log.json"
  }
}
```

Older manifests are not retroactively invalid, but new manifests should follow this contract.

## H5.67 Provenance Enforcement

H5.67 promotes the provenance requirement from doctrine to executable validation.

The contract lives in:

`scripts/asset-pipeline/lib/provenance-contract.mjs`

The validator lives in:

`scripts/asset-pipeline/validate-pipeline-provenance.mjs`

Agents should use:

```powershell
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
```

`--legacy-ok` allows pre-H5.67 manifests without `pipelineRun` while still validating any manifest or run log that does provide provenance. `--hard` is the future enforcement mode for H5.67+ generated manifests and selected migration lanes.

For future generated assets, missing provenance is not a warning. It is evidence that the output did not pass through the canonical pipeline contract.

## Evidence Folder Requirement

Evidence is not only screenshots. Evidence must contain:

- human-readable previews;
- machine-readable run log;
- report path;
- manifest path;
- source path;
- validation result summary.

## Source PNG Rule

Source PNGs are source truth.

They are not cleanup targets.

All cleanup, normalization, copying, regeneration, and alpha repair must write derived outputs.

## Runtime Separation

Cleanup acceptance is not runtime approval.

Runtime approval requires its own lane with explicit implementation scope, rollback surface, and evidence.

## Edge Case Rule

Edge cases are allowed.

Silent one-offs are not.

If a weird sheet requires special handling, the method becomes:

```text
registered experimental method
→ run log
→ evidence
→ human review
→ either promote method later or retire it
```

## No Stub Policy

Pipeline scripts must not pretend to be future implementation.

A script must be one of:

- executable command;
- wrapper over canonical command;
- library module used by executable command;
- validator;
- documented pilot/prototype;
- documented legacy/read-only reference.

Anything else is technical debt and should be corrected or removed.
