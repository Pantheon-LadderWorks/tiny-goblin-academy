# Tiny Goblin Academy H6.16A Disposable LFS Rewrite Validation

Date: 2026-07-20
Human technical review: PASS

## Result

The first H6.16 rehearsal stopped after batch 1 because a preservation-ref topology allowed additional refs to move. That failed attempt remains preserved. H6.16A corrected the rehearsal to one writable migration branch plus one immutable published-boundary ref, with no remotes or upload destination.

All eight exact-path batches passed. The published boundary remained `a05f22ba0276ea82a2f924dcda66d78f0a224b9e`. The disposable rewrite mapped 210 unpublished commits from `cf706a7c2d5e34c29510d94d55f2ede5634e4c88` to `9e08eff33f96d35f56cea789a3c426364e454e53`.

## Verified totals

- 723 current evidence paths migrated
- 759 historical evidence occurrences migrated
- 728 unique LFS objects
- 524,015,975 unique LFS bytes
- zero selected extras or missed candidates
- zero source assets or published paths selected

Semantic tree equivalence passed after offline materialization. Git object verification, LFS pointer and payload integrity, generated path-governed attributes, and worktree cleanliness passed.

## Recovery proof

The rewritten history is preserved in a verified 314,552,999-byte Git bundle with SHA-256 `e9617224c5649c7032c2ef15c87c084e3b65844d605a3c6397917b4f34fce516`. Its paired LFS backup contains 728 verified objects totaling 524,015,975 bytes. An independent clone with no remote reconstructed and hash-verified all 723 current evidence files using only those two artifacts.

## Publication authority

Only C may publish Git refs. A future guarded D evidence checkout may upload exact reviewed LFS OIDs for an active sealed evidence commit, but may never create, update, delete, or push Git refs. C may remain LFS-cold, fast-forward to the complete commit and pointer tree, verify remote object availability, and alone push the Git ref.

## Stop boundary

Canonical history was not rewritten. The rewritten branch was not promoted. No object was uploaded, no ref was pushed, no final C or D checkout was created, and no Card Goblin Duel work began. The next lane is a separately approved remote publication-handoff rehearsal using disposable clones and a temporary ref.
