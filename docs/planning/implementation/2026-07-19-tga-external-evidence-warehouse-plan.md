# Tiny Goblin Academy Dual-Checkout Evidence Architecture Plan — Superseded Historical Record

**Status:** H6.13B/H6.16 validated historical architecture; superseded after H6.17 GitHub LFS billing blocker
**Repository baseline:** `73c257dd885dbbadaa5f7a95748e976efe8ff625`
**Published baseline:** `origin/main` at `a05f22ba0276ea82a2f924dcda66d78f0a224b9e`
**Implementation boundary:** Not authorized; retained for historical engineering continuity

> **Supersession notice:** This document preserves the validated dual-checkout/LFS design and its reasoning. H6.17 proved the required GitHub LFS publication path is billing-blocked, so no phase below is active. The replacement policy is recorded at the end and in `AGENTS.md`.

## Historical design outcome

Keep one canonical GitHub repository and one linear branch while physically separating daily source work from heavyweight evidence materialization:

```text
C source checkout                     D evidence checkout
sole source-development authority     restricted evidence appliance
          \                           /
           \----- same Git history ---/
                         |
                  origin/main on GitHub
```

Target paths after a separately approved cutover:

```text
C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder
D:\Projects\Active\Tiny-Goblin-Academy\Evidence-Checkout
```

This is not a second evidence repository. It uses two clones of the same repository. Git LFS controls future binary-history growth; blobless partial clone plus sparse checkout controls which tracked content occupies each working tree.

No committed configuration may hardcode Kryssie's D path. Local ignored configuration resolves both checkout roots and the evidence-lane lock.

## Historical approval state

```yaml
humanArchitectureReviewPassed: true
dualCheckoutArchitectureApproved: true
mixedHistoryStrategyApproved: true
disposableMigrationCloneRequired: true
canonicalCRewriteAllowed: false
sourceAuthority: C
evidenceAuthority: D
onlyCPushes: true
fastForwardOnly: true
volumeIdentityGuardRequired: true
recoveryCommandsRequired: true
canonicalLfsMigrationExecuted: false
clonesCreated: false
evidenceMoved: false
canonicalCutoverComplete: false
cardGoblinDuelStarted: false
```

## Publication boundary

After a normal `git fetch origin`:

```text
origin/main: a05f22ba0276ea82a2f924dcda66d78f0a224b9e
local HEAD:  cf706a7c2d5e34c29510d94d55f2ede5634e4c88
ahead:       210 commits
behind:      0 commits
range:       origin/main..HEAD
```

`origin/main` is the merge base and ancestor of local HEAD. No remote branch contains local HEAD.

Current evidence partitions exactly as follows:

| Category | Files | Exact bytes |
| --- | ---: | ---: |
| A. Published content under another path | 0 | 0 |
| B. Introduced only in unpublished commits | 902 | 516,114,748 |
| C. Modified only in unpublished commits | 3 | 7,169 |
| D. Identical at the same published path | 121 | 13,989,212 |

The `origin/main` tip contains 124 evidence-related paths totaling 13,995,308 bytes. Current unique evidence blobs divide into 105 published blobs / 13,580,507 bytes and 880 unpublished blobs / 502,899,810 bytes.

## Current Git LFS state

- Git LFS is installed: `git-lfs/3.7.1`.
- No `.gitattributes` file exists.
- No LFS tracking rule exists.
- No file is LFS-backed.
- The local LFS object store contains zero objects and zero bytes.
- The GitHub LFS endpoint is discoverable, but upload/download authorization was not exercised.

Read-only unpublished-history inspection of every approved evidence binary extension, with no size threshold, found:

- 781 PNG blob occurrences, reported at 536 MB;
- 17 WebM blob occurrences, reported at 16 MB;
- 33 JPG blob occurrences, reported at 4.0 MB;
- no existing LFS objects.

History occurrences include superseded versions across the 210 unpublished commits. The exact current-tree review set is **723 unpublished evidence binaries / 514,640,871 bytes**: 673 PNGs, 33 JPGs, and 17 WebMs. The 72 published evidence binaries / 13,940,640 bytes remain ordinary historical Git. Together with 231 lightweight records / 1,529,618 bytes, the expected remaining current-tree ordinary-Git evidence payload is 303 files / 15,470,258 bytes, excluding future LFS pointer text.

## Historical existing-history strategy: mixed

Preserve ordinary Git blobs already reachable from `origin/main`. Do not rewrite published history.

Convert every reviewed evidence-path binary in `origin/main..HEAD` before the first push of those 210 commits. The rewrite must run in a disposable migration clone, never in canonical C. The execution lane must:

1. refresh `origin/main` and reconfirm the exact range;
2. create a named backup ref at the pre-migration HEAD;
3. create an external Git bundle or equivalent verified rollback artifact on approved durable storage;
4. create a disposable migration clone at a separately approved temporary path;
5. generate the exact unpublished evidence include list in that clone;
6. exclude source assets, texture archives, fonts, and other non-evidence binaries;
7. run `git lfs migrate info` again and record expected object counts/bytes;
8. migrate only the reviewed unpublished refs and paths inside the disposable clone;
9. verify the published ancestor remains unchanged and reachable;
10. verify every rewritten commit, LFS pointer, and required object;
11. run the full repository validation suite before any push;
12. use the proven rewritten branch to seed the future C and D clones;
13. keep original C and rollback artifacts until post-cutover approval.

Do not infer the final migration command from this document alone. It must be generated from the reviewed path inventory. Broad repository-wide `*.png`, `*.jpg`, or video rules would incorrectly capture source assets.

## Historical LFS selection policy

Every generated evidence binary introduced in unpublished history is reviewed for LFS conversion by evidence path, regardless of individual size. Default extensions are `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.webm`, `.mp4`, `.mov`, `.avi`, and `.mkv`.

These rules apply only within reviewed evidence-authority paths under `assets`, `games`, `hub`, and `docs/evidence`. Repository-wide extension rules are forbidden.

Ordinary Git retains Markdown, JSON, CSV, hashes, reports, indexes, capture/validation scripts, and lightweight text logs. A rare intentionally selected regular-Git review plate requires an explicit reviewed exemption/allowlist; there is no silent or size-based exemption.

The helper must reject a qualifying binary that is not represented by an LFS pointer. It must also reject non-evidence source assets accidentally selected by an evidence rule.

## Historical C source checkout design

C remains the only source-development authority. The canonical-path cutover eventually replaces the current clone with a freshly proven clone created using `--filter=blob:none`.

The initial C sparse model uses non-cone patterns because it must retain lightweight files inside distributed evidence directories while excluding binary files in those same directories. Sparse index is enabled only if the installed Git version supports it with the required pattern mode; correctness takes precedence over sparse-index performance.

Retain:

- game, Hub, and Tauri source;
- production assets required by builds;
- manifests, documentation, tests, and tools;
- capture scripts;
- evidence Markdown, JSON, CSV, logs, hashes, and indexes;
- approved regular-Git review plates.

Exclude from materialization by default:

- evidence PNG/JPEG/WebP/GIF binaries not approved as regular review proofs;
- evidence WebM/MP4/MOV/AVI/MKV files;
- full-resolution comparison originals and sequences;
- temporary capture artifacts.

The simulated current policy excludes 795 evidence binaries while retaining 231 lightweight evidence records. Sparse checkout alone does not remove already-downloaded objects from the present 788.59 MiB `.git` store. Real C-drive reduction requires the fresh blobless clone and later canonical-path cutover.

C also enforces source-role LFS behavior:

- automatic LFS smudge/materialization is disabled locally;
- LFS pointers remain available in Git history;
- broad `git lfs pull` is forbidden;
- the helper verifies heavy evidence does not materialize and audits `.git/lfs/objects` for unexpected evidence objects;
- selected objects may be fetched only through an explicit reviewed diagnostic operation.

## Historical D evidence checkout design

D is a restricted evidence appliance, never an equal development workspace.

Its sparse model includes:

- `assets/**/evidence/**`;
- `games/**/evidence/**`;
- `hub/evidence/**`;
- `docs/evidence/**`;
- game-level `PLAYTEST_REPORT.md`, `RELEASE_CHECKLIST.md`, and `HUMAN_REVIEW.md` records;
- `.gitattributes`;
- evidence helper and guard scripts.

Capture executes against source/runtime on C and writes reviewed outputs directly into repository-relative evidence paths in the D checkout. `TGA_EVIDENCE_ROOT` resolves the D checkout root or a guarded lane path beneath it; it does not point to a separate untracked warehouse.

D-side guards enforce:

- no staged path outside the evidence allowlist;
- no direct push from D;
- no commit without an active matching lane lock;
- no automatic deletion;
- no broad staging command;
- required LFS pointer/object verification.

D uses normal LFS materialization only for reviewed evidence scopes. Every required object must exist before staging, sealing, or return; a pointer without its object blocks the lane. This does not grant D a source-development role.

Ignored local configuration and every mutating helper must verify the physical volume, not merely the `D:` drive letter:

- label `The Void`;
- serial `F60EFF6E` or equivalent stable volume identity `\\?\Volume{71642791-4554-406a-b5d9-4d733cbbda39}\`;
- checkout path `D:\Projects\Active\Tiny-Goblin-Academy\Evidence-Checkout`;
- writable state and exFAT filesystem;
- minimum free space equal to the greater of 10 GiB or twice the projected lane payload.

Missing or mismatched identity causes a hard stop with no mutation.

The simulated D sparse coverage includes 1,015 current evidence-authority records. Eleven capture scripts/templates remain C-only because source-side capture runs from C; the JSON inventory names every omitted path.

## Historical clone synchronization and lane lock

Local remotes:

```text
D clone: source-local   -> C source checkout
C clone: evidence-local -> D evidence checkout
```

Only fetch and fast-forward-only updates are permitted. The helper must never run ordinary `git pull`, merge, rebase, reset, force push, or automatic conflict resolution.

Canonical lane order:

1. Implement and commit source on C.
2. `prepare-lane` verifies both trees are clean and fast-forwards D from C.
3. Create an external lock containing lane ID, source commit, evidence checkout commit, state, and timestamp.
4. While locked, C's guard refuses commits and both clones refuse pushes.
5. Run capture from C with heavy output directed into the D checkout.
6. Validate and explicitly stage evidence paths on D.
7. Commit the companion evidence commit on D.
8. `return-to-source` verifies C is still at the locked source commit.
9. Fast-forward C from D.
10. Verify C sparse exclusions and LFS state.
11. Remove the lock and push the complete linear history from C only.

If C or D advances independently, neither side is a fast-forward of the expected lock state. The helper stops and preserves both histories for human review.

## Historical helper command design

Proposed surface:

```text
pnpm evidence:status
pnpm evidence:prepare --lane <lane-id>
pnpm evidence:capture --game <game-id> --lane <lane-id>
pnpm evidence:validate
pnpm evidence:seal
pnpm evidence:return
pnpm evidence:doctor
pnpm evidence:abort
pnpm evidence:recover
```

Required behavior:

### `status`

- locate both clones through ignored local configuration;
- report branches, HEADs, dirty/staged state, lock state, D availability, sparse state, and LFS state;
- make no mutation.

### `prepare`

- require clean C and D trees and no existing lock;
- require C to be the configured source authority;
- fetch `source-local` from D and fast-forward only;
- verify exact HEAD agreement;
- create the lane lock.

### `capture`

- require the active lock and matching lane;
- launch source/runtime from C;
- resolve only the approved D evidence lane;
- never stage or delete evidence automatically;
- record sizes and SHA-256 values.

### `validate`

- verify allowlisted paths, hashes, telemetry, LFS pointers/objects, and clone ancestry;
- show every proposed staged path;
- refuse on ambiguity.

### `seal`

- require human-approved explicit paths;
- never use `git add .`;
- stage and commit only evidence-authority paths on D;
- verify the resulting commit is a descendant of the locked source commit.

### `return`

- require C to remain exactly at the locked source commit;
- fetch `evidence-local` and fast-forward C only;
- verify sparse/LFS materialization rules;
- clear the lock only after successful return.

### `doctor`

- remain read-only;
- report clone roles/paths, physical volume identity, HEADs/ancestry, staged/dirty state, sparse configuration, LFS status/missing objects, lane lock, local remotes, and recoverable next actions.

### `abort`

- operate only before an evidence commit or within an explicitly bounded approval;
- never delete automatically and preserve generated files for manual review;
- refuse to clear the lock while uncommitted evidence exists unless the operator explicitly preserves it;
- record an aborted-lane ledger state.

### `recover`

- remain read-only by default for stale locks, interruption, missing drive, or divergence;
- never reset, rebase, merge, force-update, or delete;
- identify the source commit, evidence commit, and divergence point;
- propose manual actions and require separate approval for any mutation.

## Historical guard implementation

Use tracked hook scripts with locally configured `core.hooksPath`, plus the helper's own preflight checks.

- C pre-commit: refuse while an evidence lock is active.
- C pre-push: refuse while locked or when D's sealed evidence commit has not returned.
- D pre-commit: require lock and evidence-only staged paths.
- D pre-push: always refuse.

Hooks can be bypassed with `--no-verify`, so helper validation and branch ancestry checks remain authoritative. No safety claim may rely on hooks alone.

## Historical implementation phases

### A. LFS/publication boundary decision

Approve the mixed strategy, exact unpublished evidence-path binary include list without a size threshold, disposable migration clone, backup refs, rollback bundle, and validation requirements. Do not migrate yet.

### B. Local configuration and helper tooling

Implement ignored clone-role/root configuration, lane-lock state, read-only status, ancestry checks, allowlists, explicit staging, and hooks. Test without real evidence migration.

### C. Create and validate D evidence clone

Create the D clone at the approved path, configure evidence sparse rules, local `source-local`, role guards, and push refusal. Do not cut over C.

### D. Create and validate temporary C source partial clone

Create a fresh blobless partial clone at a temporary C path. Apply and simulate source sparse rules. Build/test all active games and Hub/Tauri there before canonical cutover.

### E. Capture-output redirection

Parameterize active H5/H6 and Hub/game capture scripts through the guarded resolver. Split heavy outputs from lightweight repository metadata. Do not route production assets into evidence.

### F. Local two-clone sync rehearsal

Use disposable test commits to exercise prepare, lock, capture, validation, evidence-only commit, return, divergence refusal, missing-D refusal, and rollback. Include C changing while locked, D changing independently, D disconnection during capture, D disconnection after commit but before return, stale lock after process crash, LFS pointer without local object, wrong volume mounted as D, evidence generated but not sealed, and evidence commit sealed but not returned.

### G. Canonical C path cutover

Only after approval, preserve the old C clone, place the proven source partial clone at the canonical path, and revalidate. Cutover and deletion are separate decisions.

### H. Post-cutover validation

Run active game tests/builds, Hub TypeScript/build, Tauri check, LFS integrity, sparse coverage, local sync rehearsal, repository status, and packaged-Hub developer workflow.

### I. Optional old-clone removal

Remove or archive the old clone only after explicit approval and verified rollback coverage. Never automate this phase.

## Historical design safety law

- One repository and one history.
- C is the sole source authority.
- D is evidence-only.
- Only C pushes.
- Evidence lanes lock C commits temporarily.
- Synchronization is fast-forward-only.
- No force, reset, automatic merge/rebase, broad staging, or automatic deletion.
- No junction, symlink, hardlink, submodule, worktree, or separate evidence repository.
- Existing canonical C remains untouched until rehearsal clones pass.
- Any history rewrite runs only in a disposable migration clone; canonical C rewrite is forbidden.
- Old-clone removal is independently approved.

## H6.17 result and supersession boundary

H6.16A proved the disposable path-bounded rewrite, semantic tree equivalence, paired Git/LFS recovery artifacts, and independent offline restoration. H6.17 then attempted the first and only synthetic remote object upload. GitHub rejected the 792-byte object because LFS access is billing-blocked. No synthetic object was accepted, no real evidence object was uploaded, no temporary Git ref was created, and canonical C remained unchanged.

The dual-checkout/LFS architecture is not being adopted. No additional LFS work, rewritten-branch promotion, helper implementation, final C/D checkout creation, partial-clone cutover, or LFS-backed capture workflow is authorized. H6.15-H6.17 remain preserved as truthful historical engineering records.

## Active replacement architecture

Existing evidence:

- remains grandfathered in ordinary Git at its current paths;
- is not rewritten, removed, deduplicated, compressed, or relocated by this pivot;
- is preserved through the normal repository history.

Future heavy generated evidence:

- writes directly beneath the durable external D evidence taxonomy by default;
- includes WebM, MP4, MOV, AVI, MKV, full-resolution capture sequences, raw comparison originals, and other heavy generated review media;
- is represented in Git by portable lightweight manifests and review records rather than LFS pointers.

Tracked lightweight authority includes Markdown reports, JSON telemetry and manifests, SHA-256 hashes, exact byte sizes, original filenames, game/lane identity, source commit, capture configuration, human-review status, external-availability status, capture/validation scripts, and intentionally selected compact review stills or contact sheets. The provisional tracked-review-image ceiling is 2 MiB; exceptions require explicit human approval.

No second Git repository, dual clone, LFS pointer, junction, symlink, or synchronization workflow is part of the replacement architecture. Future capture redirection is still unimplemented and requires a later bounded tooling lane.

## Immediate preservation order

1. Commit this policy pivot in canonical ordinary Git.
2. Push the complete backlog to a collision-free remote safety branch.
3. Verify the safety ref resolves to the exact pivot commit while remote main remains unchanged.
4. Fast-forward remote main without force.
5. Record the successful backup in a small closure commit and push it normally.
6. Leave the safety branch intact until separately reviewed.

Card Goblin Duel remains unstarted until this preservation lane closes.
