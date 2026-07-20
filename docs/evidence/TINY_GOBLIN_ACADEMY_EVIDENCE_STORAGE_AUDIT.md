# Tiny Goblin Academy Evidence Storage Audit

**Lane:** H6.13/H6.13A — Evidence Footprint, Publication Boundary, and Dual-Checkout Architecture
**Audit date:** 2026-07-19
**Repository baseline:** `73c257dd885dbbadaa5f7a95748e976efe8ff625`
**Branch:** `main`
**Human review:** Passed — H6.13/H6.16 engineering preserved; LFS/dual-checkout adoption superseded by H6.17B

> **Active-policy notice:** The dual-checkout and Git LFS material below remains a truthful historical audit and validation record. H6.17 proved that GitHub LFS publication is billing-blocked, so the architecture is not being adopted. The active replacement policy is recorded at the end of this document and in `AGENTS.md`.

## Executive verdict

The repository currently contains **1,026 evidence-related files totaling 530,111,129 bytes (505.55 MiB)**. Every discovered evidence-related file is Git-tracked. No ignored or untracked durable evidence exists in the repository working tree, so the loose-file dry-run move map is intentionally empty.

The audit motivated a single-repository dual-checkout and Git LFS design that was later validated offline in H6.16A. H6.17 then proved the required GitHub LFS publication path is billing-blocked even for a 792-byte synthetic object. That design is preserved as historical engineering but is not being adopted. Existing evidence remains grandfathered in ordinary Git, while future heavy generated evidence defaults to durable external D storage with lightweight tracked authority.

The provisional evidence-checkout path is:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence-Checkout
```

This follows D-drive authority: `D:\Projects\Active` is the active-project shelf, while `D:\DevCache` contains disposable tool caches and is unsuitable for durable review evidence. The clone was not created during this audit.

## Scope and classification

The audit inspected the repository, including:

- `assets`, including Academy, Hub, studio, and H5 evidence shelves;
- every game under `games`, including game-local H6 evidence;
- `hub`, including its committed evidence screenshots;
- `docs/evidence`;
- repository capture and image-generation tooling.

Dependencies and generated build/cache paths were excluded from evidence totals: `.git`, `node_modules`, `dist`, `target`, `coverage`, `.vite`, `playwright-report`, and `test-results`.

Evidence classification includes files beneath an `evidence` directory, `docs/evidence`, named capture scripts, and the standard `PLAYTEST_REPORT.md`, `HUMAN_REVIEW.md`, and `RELEASE_CHECKLIST.md` records. Source art, fonts, production textures, source archives, dependencies, and build output are not evidence merely because they are large.

The complete per-file inventory, SHA-256 values, groups, history diagnostics, and capture-tool records are in `TINY_GOBLIN_ACADEMY_EVIDENCE_SIZE_INVENTORY.json`.

## Current evidence footprint

| Category | Files | Exact bytes | Human size |
| --- | ---: | ---: | ---: |
| All evidence-related files | 1,026 | 530,111,129 | 505.55 MiB |
| Binary evidence | 795 | 528,581,511 | 504.09 MiB |
| Git-tracked evidence | 1,026 | 530,111,129 | 505.55 MiB |
| Untracked evidence | 0 | 0 | 0 MiB |
| Ignored evidence | 0 | 0 | 0 MiB |
| Still images | 778 | 512,939,920 | 489.18 MiB |
| Videos | 17 | 15,641,591 | 14.92 MiB |
| Migration eligible | 0 | 0 | 0 MiB |

The remaining 1.46 MiB is lightweight telemetry, reports, scripts, logs, HTML, and other evidence-support material.

### By game or shared owner

| Owner | Files | Exact bytes | Human size |
| --- | ---: | ---: | ---: |
| Button Goblin Clicker | 112 | 54,632,294 | 52.10 MiB |
| Potion Sorter | 257 | 95,901,338 | 91.46 MiB |
| Dice Duel Tavern | 149 | 80,048,288 | 76.34 MiB |
| Card Goblin Duel | 36 | 19,956,746 | 19.03 MiB |
| Dungeon Key Run | 9 | 780,757 | 0.74 MiB |
| Tiny Farm Day | 17 | 1,256,411 | 1.20 MiB |
| Pet Campfire | 11 | 782,569 | 0.75 MiB |
| One Room Platformer | 17 | 233,765 | 0.22 MiB |
| Top-Down Slime Quest | 9 | 133,375 | 0.13 MiB |
| Mini Settlement Sim | 12 | 324,589 | 0.31 MiB |
| Shared Academy/Hub | 57 | 31,472,696 | 30.01 MiB |
| Uncategorized or legacy asset evidence | 340 | 244,588,301 | 233.26 MiB |

The uncategorized/legacy group is principally shared H5 asset-pipeline evidence whose paths do not encode one game owner. It is not unknown filesystem material.

## Ten largest current evidence files

| Rank | Path | Exact bytes | MiB |
| ---: | --- | ---: | ---: |
| 1 | `games/tier-1/02-potion-sorter/evidence/h6-6-live-composition-c-scenerig/motion/h6-6a-tap-drag-gearbox-motion.webm` | 5,101,322 | 4.865 |
| 2 | `assets/academy/evidence/birthday-build-debug/tga-topdown-slime-v2-action-cleaned.png-debug.png` | 4,092,908 | 3.903 |
| 3 | `assets/academy/evidence/birthday-build-debug/tga-topdown-slime-v2-idle-move-cleaned.png-debug.png` | 3,978,597 | 3.794 |
| 4 | `assets/academy/evidence/slime-clean-preview.png` | 3,903,632 | 3.723 |
| 5 | `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/terrain-grass-dirt/terrain-grass-dirt-bbox-overlay.png` | 3,535,388 | 3.372 |
| 6 | `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/terrain-swamp-slime/terrain-swamp-slime-bbox-overlay.png` | 3,476,688 | 3.316 |
| 7 | `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/terrain-arcane-metal/terrain-arcane-metal-bbox-overlay.png` | 3,448,029 | 3.288 |
| 8 | `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/terrain-stone-ruin/terrain-stone-ruin-bbox-overlay.png` | 3,277,424 | 3.126 |
| 9 | `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-hero-1920x1080.png` | 3,274,635 | 3.123 |
| 10 | `assets/academy/evidence/h5-83-topdown-future-floor-tilesheets-batch-region-mapping/terrain-wood-indoor/terrain-wood-indoor-bbox-overlay.png` | 3,212,360 | 3.064 |

The repository contains 249 non-cache files at least 1 MiB, 22 at least 5 MiB, 2 at least 10 MiB, and none at least 25 or 50 MiB. The two files above 10 MiB are production/source material, not evidence.

## Git storage findings

`git count-objects -vH` reported:

```text
count: 0
size: 0 bytes
in-pack: 5488
packs: 2
size-pack: 787.96 MiB
prune-packable: 0
garbage: 0
size-garbage: 0 bytes
```

The `.git` directory contains 826,893,530 bytes (788.59 MiB). Its dominant packfile is 825,942,800 bytes (787.68 MiB).

Current evidence is a substantial part of repository content, but evidence is not the only weight. The largest history blobs are source material: the 15,001,764-byte Kenney particle archive, the 11,905,272-byte parchment source, large source sheets, texture archives, and branding artwork. The largest evidence blob is the 5,101,322-byte Potion Sorter H6.6A WebM.

No evidence path deleted from the current tracked tree was found among historical evidence blobs. Therefore deleted historical evidence does not currently make a material additional contribution under the path-based audit. No history cleanup, repack, prune, reflog expiration, or Git LFS operation was performed.

## Publication boundary and LFS state

A normal read-only fetch refreshed `origin/main` before comparison:

| Authority | Commit |
| --- | --- |
| Published `origin/main` | `a05f22ba0276ea82a2f924dcda66d78f0a224b9e` |
| Local `main` / HEAD | `73c257dd885dbbadaa5f7a95748e976efe8ff625` |

Local `main` is 208 commits ahead and 0 behind. `origin/main` is the merge base and an ancestor of HEAD. No remote branch contains local HEAD.

### Current evidence publication partition

| Category | Files | Exact bytes |
| --- | ---: | ---: |
| A. Current content published under another path | 0 | 0 |
| B. Introduced only in local unpublished history | 902 | 516,114,748 |
| C. Existing published path modified only locally | 3 | 7,169 |
| D. Identical content at the same published path | 121 | 13,989,212 |

The published tip contains 124 evidence-related paths totaling 13,995,308 bytes. Current unique evidence content contains 105 published blobs / 13,580,507 bytes and 880 unpublished blobs / 502,899,810 bytes.

Git LFS 3.7.1 is installed, but the repository has no `.gitattributes`, tracking rules, LFS-backed files, or local LFS objects. Read-only inspection of all reviewed evidence binary extensions in `origin/main..HEAD`, with no size threshold, reported 781 PNG blob occurrences / 536 MB, 17 WebM occurrences / 16 MB, and 33 JPG occurrences / 4.0 MB. These history counts include superseded versions across the 208 unpublished commits.

The exact current-tree LFS review set is **723 unpublished evidence binaries totaling 514,640,871 bytes (490.80 MiB)**:

| Extension | Files | Exact bytes |
| --- | ---: | ---: |
| `.png` | 673 | 494,987,226 |
| `.jpg` | 33 | 4,012,054 |
| `.webm` | 17 | 15,641,591 |

The published baseline contributes **72 evidence binaries / 13,940,640 bytes** that remain ordinary historical Git. The other **231 lightweight evidence records / 1,529,618 bytes** also remain ordinary Git. Therefore the current-tree ordinary-Git evidence payload after a future local-only migration is expected to be **303 files / 15,470,258 bytes**, excluding the small LFS pointer text that will be calculated only when pointers exist.

The approved existing-history strategy is mixed:

- preserve published ordinary Git history;
- convert every reviewed evidence-path binary within `origin/main..HEAD`, regardless of size;
- use LFS for future generated evidence binaries under reviewed evidence-authority paths;
- keep non-evidence source assets and texture archives outside the evidence LFS rules;
- create backup refs and a verified rollback bundle before any migration.

The rewrite must occur in a disposable migration clone, never in canonical C. No migration was performed.

## Exact duplicate findings

SHA-256 analysis found **24 exact duplicate groups** with **13,597,748 bytes (12.97 MiB)** of theoretical duplicate-copy savings. Examples include repeated Dice Duel settled states, repeated H5 bounding-box overlays, and Potion Sorter before/after captures that are byte-identical.

All duplicate members are tracked repository authority. Accordingly:

- eligible external duplicate savings: 0 bytes;
- tracked theoretical savings: 13,597,748 bytes;
- files deleted or deduplicated: 0;
- near-duplicate visual judgments: not attempted.

Duplicate cleanup would require a separate governance decision about historical evidence meaning. It is not part of warehouse migration.

## Migration eligibility and dry-run map

| Class | Result |
| --- | --- |
| A. Tracked repository authority | 1,026 files; keep in place |
| B. Eligible external durable evidence | 0 files |
| C. Disposable generated material | 0 current files in the audited evidence set |
| D. Non-evidence large files | Inventoried separately; remain outside warehouse |

The exact dry-run move map contains zero entries. This is a valid and important result: there are no current ignored/untracked durable files to copy, verify, and remove.

The later migration lane must still use this transfer protocol if eligible files appear:

1. Create the destination directory.
2. Copy to a temporary destination filename.
3. Verify destination size.
4. Verify SHA-256.
5. Rename the temporary file to its final destination.
6. Verify the final destination.
7. Remove the source only after verification.
8. Append the completed operation to a local machine-readable migration ledger.

## D-drive taxonomy and checkout decision

D: is the healthy exFAT volume labeled `The Void`, with serial `F60EFF6E`, volume identity `\\?\Volume{71642791-4554-406a-b5d9-4d733cbbda39}\`, and 1,481,130,377,216 bytes free at human-review closure. The drive manifest defines an Origin → Type archive taxonomy and separately identifies `D:\Projects\Active` for active projects.

Recommended evidence-checkout structure:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence-Checkout\
  assets\...\evidence\
  games\tier-1\...\evidence\
  hub\evidence\
  docs\evidence\
```

This is an ordinary second clone of the same repository, sparsely materialized around evidence authority. It preserves the repository's existing game/lane paths rather than inventing a second storage taxonomy inside the checkout. Temporary capture intermediates remain distinct from final reviewed evidence.

No symlink, junction, or hardlink design is permitted on the exFAT warehouse. The design uses ordinary paths and verified file transfers. Ignored local configuration must record the expected label, serial or stable identity, checkout path, filesystem, writable requirement, and a free-space floor of the greater of 10 GiB or twice the projected lane payload. A matching `D:` letter alone is insufficient; any mismatch causes a hard stop without mutation.

## Ignore behavior

Current evidence paths under `assets`, `games`, and `hub` are not ignored. Root and Hub rules ignore dependencies, build output, logs, and Tauri target output.

The root `.gitignore` also contains a malformed NUL-separated rendering of an attempted `hub/src-tauri/.dev-runtime-logs/` rule. The practical `.log` rule in `hub/.gitignore` still ignores a probe log at that location. H6.13 records this existing condition but does not repair `.gitignore`, because ignore changes are outside the approved audit boundary.

## Capture-tool audit

Twenty-eight scripts can create screenshots, videos, or generated image evidence. The JSON inventory records each exact path, current output root, binary/metadata behavior, and later action.

The active sets are:

- 2 Potion Sorter H5 capture scripts under `assets/academy/evidence`;
- Button Goblin's game-local evidence capture script;
- 7 Potion Sorter H6 capture scripts;
- 4 Dice Duel H6 capture scripts;
- 8 legacy/current game `capture.cjs` or debug scripts for Levels 4–10;
- 6 shared/legacy asset-pipeline or Hub image-generation scripts.

All 28 currently resolve output through repository-relative or script-specific paths. None implements an external evidence-root boundary. Scripts that write both binaries and JSON must be split logically: heavy binary output follows the external root, while lightweight telemetry and indexes may remain in the repository.

## Superseded dual-checkout/LFS capture architecture (historical)

The later implementation should introduce `TGA_EVIDENCE_ROOT` and clone-role paths through ignored local configuration, not as committed absolute paths.

Rules:

- C is the sole source-development authority.
- D is a restricted evidence appliance and cannot push Git refs; a future guarded helper may upload only exact reviewed LFS object OIDs for a sealed evidence commit.
- Both checkouts share the same repository history and branch.
- Capture runs source/runtime from C and writes evidence into repository-relative paths in D.
- Evidence lanes create an external lock that blocks C commits and all pushes until the evidence commit returns to C.
- Synchronization uses local remotes and fast-forward-only updates.
- Divergence produces a hard refusal and preserves both histories.
- Every generated evidence PNG/JPEG/WebP/GIF/WebM/MP4/MOV/AVI/MKV under reviewed evidence-authority paths defaults to LFS, regardless of size.
- A machine without `TGA_EVIDENCE_ROOT` remains able to build, test, and run the public repository.
- Heavy capture commands fail closed with a clear configuration message when no external root is configured.
- An explicit one-shot override may permit a selected repository review proof; silent repository fallback is forbidden.
- Lightweight JSON telemetry, SHA-256 indexes, reports, and capture/validation scripts remain in Git. A rare regular-Git review plate requires an explicit reviewed allowlist exemption.
- Each external record identifies repository, game, lane, relative warehouse path, filename, exact bytes, SHA-256, creation time, and availability.
- Public metadata stores a portable repository-relative evidence key, never `D:\...`.
- Missing external evidence is reported as unavailable; it is not silently regenerated or represented as committed.
- Source assets and material packages never share the evidence output root.

The C checkout requires a fresh `--filter=blob:none` clone for real disk reduction. Non-cone sparse patterns retain lightweight evidence metadata while excluding current evidence binaries; simulated coverage excludes 795 evidence binaries and retains 231 lightweight evidence records. C also disables automatic LFS smudge/materialization, forbids broad `git lfs pull`, and audits `.git/lfs/objects` for unexpected evidence payloads. Sparse checkout on the current clone would not reclaim its already-downloaded `.git` objects.

The D sparse model covers evidence authority under `assets`, `games`, `hub`, and `docs/evidence`, plus game-level review reports. Simulated coverage includes 1,015 authority records. D enables scoped evidence LFS materialization and verifies required objects before staging, sealing, or return; a pointer without its object blocks the lane. Eleven source-side capture scripts/templates remain intentionally C-only because capture executes from C.

## Superseded Git LFS evidence policy (historical)

- All generated evidence binaries introduced in unpublished history are reviewed for LFS conversion by evidence path, regardless of size.
- Default LFS extensions are PNG, JPG, JPEG, WebP, GIF, WebM, MP4, MOV, AVI, and MKV.
- Rules apply only to reviewed evidence-authority paths; repository-wide extension rules are forbidden.
- Markdown, JSON, CSV, hashes, reports, indexes, capture/validation scripts, and lightweight text logs remain ordinary Git.
- A rare intentionally selected review plate may remain ordinary Git only through an explicit reviewed allowlist exemption.
- Per-shelf lightweight authority uses `README.md` plus a JSON index containing filenames, sizes, hashes, role, regular-Git/LFS status, and availability.
- Published evidence remains ordinary historical Git. The exact 723-file unpublished review set is eligible for a separately approved mixed-history LFS migration.

## Disposable migration and recovery validation record (historical)

The canonical C workspace may not run `git lfs migrate`. A later approved migration must create a named backup ref and verified external bundle, perform migration-info and the exact unpublished rewrite in a disposable clone, validate the rewritten commits, pointers, objects, and full repository, then use the proven rewritten branch to seed replacement C and D clones. Original C and rollback artifacts remain until post-cutover approval.

The planned recovery surface is:

- `pnpm evidence:doctor`: read-only clone, volume, ancestry, sparse, LFS, lock, remote, and recovery diagnosis;
- `pnpm evidence:abort`: bounded pre-commit abort that never deletes, preserves uncommitted evidence, and records the aborted lane;
- `pnpm evidence:recover`: read-only by default, identifies source/evidence commits and divergence, and never resets, rebases, merges, force-updates, or deletes.

Rehearsal must cover C changing while locked, independent D changes, D disconnection during capture and after commit, stale locks, missing LFS objects, the wrong physical volume at `D:`, generated-but-unsealed evidence, and sealed-but-not-returned evidence.

## Stop-boundary confirmation

- No evidence file was moved, copied, deleted, renamed, compressed, or reclassified.
- No evidence clone or D directory was created.
- No capture script was changed.
- No `.gitattributes`, LFS rule, LFS object, sparse checkout, local remote, hook, helper, lock, backup ref, history rewrite, or push was created or performed.
- No `.gitignore`, package, lockfile, runtime, source asset, manifest, Hub/Tauri source, or other-game source was changed.
- Card Goblin Duel did not begin.
- Human architecture review passed. LFS migration, clones, evidence movement, canonical cutover, and Card Goblin Duel remain unstarted.

## H6.16A disposable LFS rewrite validation

Human technical review passed on 2026-07-20. A disposable, no-remote rewrite preserved the published boundary at `a05f22ba0276ea82a2f924dcda66d78f0a224b9e` while mapping 210 unpublished commits from original tip `cf706a7c2d5e34c29510d94d55f2ede5634e4c88` to rewritten tip `9e08eff33f96d35f56cea789a3c426364e454e53`.

All eight exact-path batches passed. The rewrite migrated 723 current evidence paths and 759 historical occurrences into 728 unique LFS objects totaling 524,015,975 bytes, with zero extras, missed candidates, source assets, or published paths. Semantic tree equivalence, Git object verification, pointer/payload integrity, path-governed attributes, and offline materialization all passed.

Recovery requires the verified 314,552,999-byte rewritten Git bundle with SHA-256 `e9617224c5649c7032c2ef15c87c084e3b65844d605a3c6397917b4f34fce516` together with the separate verified 728-object LFS backup. An independent clone with no remote reconstructed and hash-verified all 723 current evidence files from only those paired artifacts.

Canonical migration remains unexecuted. Canonical C remains at the original history, has no canonical `.gitattributes`, and remains LFS-cold. The failed H6.16 preservation-ref attempt remains preserved. Nothing was uploaded, pushed, promoted, or cut over.

## H6.17 remote LFS blocker

The separately approved H6.17 remote handoff rehearsal stopped safely at its first real network mutation. GitHub rejected the exact 792-byte synthetic PNG object `0d3437c2514d5380cdab905036abcbf92f6169fd8499c8e72504f4d392e54b54` with the message that the repository exceeded its LFS budget.

- Synthetic payload accepted: no
- Real evidence payloads uploaded: 0
- Temporary Git refs created: none
- Remote main changed: no
- Canonical C modified: no
- Retry or workaround attempted: no

The blockage is operationally indefinite because paid capacity is not available. No additional LFS attempt is authorized. The H6.16A rewrite bundle, paired payload backup, and H6.17 disposable failure record remain preserved on D as historical recovery and engineering evidence; none is promoted.

## Active replacement evidence policy

Existing evidence remains grandfathered in ordinary Git at its current paths. This lane does not rewrite, remove, deduplicate, compress, or relocate it.

Future WebM, MP4, MOV, AVI, MKV, full-resolution capture sequences, raw comparison originals, and other heavy generated review media default to durable external D storage and are not committed to the source repository by default. Git retains portable lightweight authority:

- Markdown review reports and JSON telemetry/manifests;
- SHA-256 hashes, exact bytes, and original filenames;
- game, lane, source commit, and capture configuration;
- human-review and external-availability status;
- capture and validation scripts;
- intentionally selected compact review stills or contact sheets under a provisional 2 MiB ceiling.

Any larger tracked review image requires explicit human approval. No second Git repository, dual clone, LFS pointer, junction, symlink, or synchronization workflow is part of the replacement. Capture redirection remains unimplemented and requires a later bounded tooling lane.

The immediate preservation priority is pushing the complete canonical ordinary-Git backlog to a collision-free remote safety branch and then fast-forwarding remote main. Card Goblin Duel remains unstarted.
