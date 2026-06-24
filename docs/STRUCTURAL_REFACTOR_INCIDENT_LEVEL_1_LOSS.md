# Structural Refactor Incident: Level 1 Loss

**Date:** June 24, 2026
**Context:** Folder normalization pass to move Tier 1 games (`games/01-button-goblin-clicker`, etc.) into `games/tier-1/`.

## What Happened
During the move from `games/01-button-goblin-clicker` to `games/tier-1/01-button-goblin-clicker`, the original folder was permanently lost with no git backup available.

1. Initial `Move-Item` failed due to `node_modules` file locks from an active Vite server.
2. `robocopy /MOVE` was executed to force the move. It successfully copied Level 1 to `games/tier-1/01-button-goblin-clicker` and deleted the source.
3. `robocopy` became painfully slow on Level 2's `node_modules` and was manually aborted.
4. A cleanup script was run to delete partial copies from `games/tier-1/` before trying `Move-Item` again.
5. The cleanup script deleted the successfully copied Level 1 from `games/tier-1/`.
6. `Move-Item` then attempted to move the source `games/01-button-goblin-clicker`, but failed because `robocopy` had already deleted it.

## Why It Happened
The core issue was combining a cleanup script (`Remove-Item -Recurse -Force`) with an unverified state assumption. The destination was deleted without confirming the source still existed, breaking the transactional nature of a safe structural refactor. The absence of a git repository meant there was no fallback snapshot.

## What Survived
* `AI_GAME_STUDIO_PLAN.md` Level 1 definitions.
* `README.md` and `meta/progress-tracker.md` references.
* `docs/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md` and `docs/TINY_GOBLIN_ACADEMY_EVIDENCE_INDEX.md` context.
* Transcripts containing the contract and workflow.
* The remaining 9 games (Levels 2-10) were successfully moved to `tier-1` without data loss.

## What Was Lost
The entirety of the implementation code for `01-button-goblin-clicker`, including its Vite configuration, Phaser setup, and specific UI styling.

## Why This is Not a Human Review Reversal
This is an incident report covering a tooling and orchestration failure, not a product or design reversal. The original scope and intention of Level 1 remains valid; the code was simply deleted by an unsafe scripting operation.

## Recovery Plan
1. Capture the event in an Antigravity knowledge item (`.agents/AGENTS.md`) to prevent recurrence.
2. **Level 1 will not be immediately rebuilt. Restoration is deferred until the Tiny Goblin Academy Hub/runtime packaging architecture is defined, so the rebuilt game conforms to the new monorepo/package/install model.**
3. Once the package architecture is defined, rebuild Level 1 identically to its original v0.1 spec based on preserved documentation.
4. Immediately run `git init` and commit the normalized archive before proceeding with any other tasks.

## Prevention Rules
* Never delete a destination before verifying the source exists.
* Never combine move/copy cleanup with destructive deletion in the same pass.
* Never perform large structural moves without git or a backup snapshot.
* Refactors must be transactional: Plan → Copy → Verify → Patch → Delete Source.
