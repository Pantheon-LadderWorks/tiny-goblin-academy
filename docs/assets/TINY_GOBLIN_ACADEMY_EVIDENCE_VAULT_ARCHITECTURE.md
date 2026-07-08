# Tiny Goblin Academy — Evidence Vault Architecture

## Purpose

Tiny Goblin Academy now has enough evidence that the evidence itself needs architecture.

The current `assets/academy/evidence/` folder has been useful, but it mixes asset-processing evidence with debug images, runtime screenshots, review previews, cleanup experiments, and historical outputs. That was fine while the pipeline was small. It is becoming hard to index.

## Current Problem

The current evidence tree is asset-adjacent:

`assets/academy/evidence/`

This made sense when evidence mostly proved source sheet mapping and cleanup. It becomes weaker when evidence expands into:

- asset intake;
- cleanup previews;
- scene anchors;
- placement grammar;
- layout composition;
- runtime screenshots;
- build smoke evidence;
- loop testing;
- release evidence;
- debug artifacts;
- failed/experimental method evidence.

## Proposed Root Evidence Vault

Future structure:

```text
evidence/
  academy/
    asset-phase/
      h5/
        hub/
        shared/
        games/
        topdown/
        ui/
        studio/
    initial-dev/
    loop-testing/
    runtime-smoke/
    build-release/
    experiments/
```

This separates evidence by purpose instead of hiding every proof artifact under asset folders.

## Do Not Move Files Yet

Existing reports and manifests reference current evidence paths.

Migration must be planned, not rushed.

Before moving evidence:

1. inventory existing evidence folders;
2. identify report references;
3. identify manifest references;
4. create an evidence index;
5. decide whether old paths remain stable or receive redirect/index entries;
6. migrate one small lane first;
7. validate links and references.

## Evidence Index Shape

Suggested future index:

```json
{
  "schemaVersion": "0.1",
  "evidenceRoot": "evidence/academy",
  "entries": [
    {
      "id": "h5-65-topdown-objects-cleanup-candidate",
      "phase": "h5",
      "domain": "topdown-objects",
      "lane": "cleanup-candidate",
      "currentPath": "assets/academy/evidence/h5-65-topdown-objects-cleanup-candidate",
      "vaultPath": "evidence/academy/asset-phase/h5/topdown/h5-65-topdown-objects-cleanup-candidate",
      "report": "docs/assets/TINY_GOBLIN_ACADEMY_H5_65_TOPDOWN_OBJECTS_CLEANUP_CANDIDATE.md",
      "manifest": "manifests/academy.topdown.objects.cleanup-candidate.json",
      "runLog": "pipeline-run-log.json",
      "status": "current-location-preserved"
    }
  ]
}
```

## Run Log Placement

Every future evidence folder should include:

`pipeline-run-log.json`

When the evidence vault is introduced, the run log becomes the bridge between:

- source file;
- command;
- method;
- generated output;
- visual evidence;
- validation;
- commit.

## Migration Lane

Recommended future lane:

`H5.67B — Evidence Vault Index Pilot`

Scope:

- create index only;
- do not move image files yet;
- register current evidence roots;
- choose one small old lane as a pilot reference;
- preserve old paths.

## Doctrine

```text
Evidence is project memory.
Do not scatter it.
Do not move it casually.
Index before migration.
```

