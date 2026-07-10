# Tiny Goblin Academy — H5.82 Existing Topdown Terrain Cleanup Human Review

## Purpose

H5.82 records human/product review for the H5.81 Existing Topdown Terrain cleanup candidate.

This lane passes H5.81 with exclusions/deferred cells. It does not rerun cleanup, regenerate evidence, modify PNGs, alter sourceRects, or approve runtime terrain behavior.

## Review Input

```text
Cleanup candidate:
manifests/academy.topdown.terrain.cleanup-candidate.json

Derived sheet:
assets/academy/topdown/terrain/derived/tga-topdown-terrain-cleaned-v0.1.png

Evidence:
assets/academy/evidence/h5-81-topdown-terrain-cleanup-candidate

Reviewed commit:
08c9708 tools: add topdown terrain cleanup candidate
```

## Human/Product Review Decision

H5.81 passed with exclusions/deferred cells.

Accepted for draft cleanup/planning use only:

```text
59 terrain cleanup candidates
```

Blank transparent/reference cells accepted:

```text
30
31
64
```

Retained partial content candidates accepted for draft review/planning:

```text
32
36
37
38
39
```

Deferred / excluded from the usable cleanup set:

```text
25
35
```

Review decision:

```text
passed-with-deferred-water-checker-cells
```

## Deferred Cell Reason

Cells 25 and 35 are water/checker partial cells with unacceptable checker remnants.

They are content-bearing partial cells, not blank cells.

Future targeted correction or regeneration is allowed only if those exact cells are needed.

These cells should not be used from the H5.81 cleanup candidate set.

## H5.60B Truth Doctrine

Preserve H5.60B truth.

```text
Blank cells are exactly 30, 31, and 64.
Region 39 is not blank.
Region 39 lives.
Region 39 remains retained partial grass-edge content.
```

## Accepted Scope

Approval means:

- 59 cleanup candidates are accepted for draft cleanup/planning use only;
- blank/reference cells 30, 31, and 64 remain traceable as blank transparent candidates;
- retained partial content cells 32, 36, 37, 38, and 39 remain available for draft review/planning;
- deferred water/checker cells 25 and 35 remain excluded from the usable cleanup set.

## Review Lane Boundaries

H5.82 did not:

- rerun cleanup;
- edit source PNGs;
- edit derived PNGs;
- edit evidence PNGs;
- regenerate evidence;
- alter sourceRects;
- modify game/runtime files;
- modify package or lock files.

## Runtime Boundary

This review does not approve:

- runtime terrain use;
- tilemap use;
- collision;
- pathfinding;
- walkability;
- blocked behavior;
- slow behavior;
- hazard behavior;
- water behavior;
- slime behavior;
- portal behavior;
- trigger behavior;
- autotiling;
- game wiring.

Every region remains:

```text
runtimeEligibility: not-runtime-approved
```

## Files Intentionally Updated

```text
CHANGELOG.md
docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md
docs/assets/TINY_GOBLIN_ACADEMY_H5_82_TOPDOWN_TERRAIN_CLEANUP_HUMAN_REVIEW.md
manifests/academy.topdown.terrain.cleanup-candidate.json
```

## Recommended Next Lane

```text
H5.83 — Terrain Cleanup Follow-up / Runtime Selection Planning
```

Tiny rule:

```text
39 lives. Two water goblins go to the museum.
```
