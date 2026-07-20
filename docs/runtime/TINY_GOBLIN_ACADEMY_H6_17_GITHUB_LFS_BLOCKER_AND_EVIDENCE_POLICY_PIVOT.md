# Tiny Goblin Academy H6.17 GitHub LFS Blocker and Evidence Policy Pivot

**Lane:** H6.17/H6.17B
**Date:** 2026-07-20
**Canonical baseline:** `0beb388b99e937641ecef9f43f8a0165a3395827`
**Published baseline:** `a05f22ba0276ea82a2f924dcda66d78f0a224b9e`
**Status before remote backup:** Policy pivot validated; ordinary-Git backlog backup pending

## GitHub LFS outcome

H6.17 reached its first and only synthetic LFS upload. GitHub rejected the 792-byte valid PNG because LFS access is billing-blocked.

- Run: `remote-lfs-handoff-0beb388-20260720T163943Z`
- Synthetic OID: `0d3437c2514d5380cdab905036abcbf92f6169fd8499c8e72504f4d392e54b54`
- Sealed disposable commit: `25f6da977022fdc95fb3e5982eb11718adf84071`
- Synthetic payload accepted: no
- Real evidence payloads uploaded: 0
- Temporary Git refs created: none
- Remote main changed: no
- Canonical C modified: no
- Retry or workaround attempted: no

No additional LFS attempt is authorized. Paid capacity is not available, so the blockage is operationally indefinite.

## Superseded architecture

H6.16A successfully validated the exact-path disposable rewrite, semantic tree equivalence, 728-object paired recovery set, and independent offline restoration. Those results remain truthful and preserved. The rewritten branch was never promoted and canonical history was never rewritten.

The GitHub-LFS-dependent split-publication and dual-checkout architecture is not being adopted. H6.15 through H6.17 remain historical engineering records; they are not active implementation authority.

## Active replacement policy

Existing tracked evidence remains grandfathered in ordinary Git at its current paths. It will not be rewritten, removed, deduplicated, compressed, or relocated by this pivot.

Future WebM, MP4, MOV, AVI, MKV, full-resolution capture sequences, raw comparison originals, and other heavy generated review media default to durable external D storage. Git tracks lightweight authority: reports, telemetry, manifests, SHA-256 hashes, exact sizes, original filenames, game/lane identity, source commit, capture configuration, human-review and external-availability state, scripts, and intentionally selected compact stills or contact sheets.

The provisional tracked-review-image ceiling is 2 MiB. Exceptions require explicit human approval. No second Git repository, dual clone, LFS pointer workflow, junction, symlink, or synchronization workflow is part of the replacement. Capture redirection remains unimplemented and requires a later bounded tooling lane.

## Ordinary-Git eligibility audit

- Unpublished commits at baseline: 211
- Unpublished objects: 4475
- Reachable unpublished object bytes: 783272358
- Largest unpublished blob: `assets/academy/materials/source/h5-100/kenney/archives/kenney_particle-pack.zip`
- Largest unpublished blob bytes: 15001764
- Introducing commit: `728e9f0579933d109ef93bfa0ba2ae74613d2eff`
- Blobs at least 50 MiB: 0
- Blobs over 100 MiB: 0
- Canonical LFS pointer blobs: 0
- Canonical LFS object bytes: 0
- Canonical `.gitattributes`: absent

The ordinary-Git object gate passed. Actual remote pack acceptance is recorded only after the safety-branch push succeeds.

## Pending remote preservation

`githubBacklogBackupPending: true`
`githubBacklogBackupPassed: false`
`futureHeavyEvidenceRedirectionImplemented: false`
`cardGoblinDuelStarted: false`

The next mutation is narrowly authorized: commit this documentation pivot, push the exact pivot tip to a collision-free safety branch, verify it, then fast-forward remote main. No force, broad refspec, tag push, LFS upload, or history rewrite is permitted.
