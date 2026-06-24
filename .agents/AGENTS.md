# Antigravity Guardrails and Knowledge

## Structural Refactor Guardrail — Never Delete Destination Before Source Verification

During a folder normalization pass for Tiny Goblin Academy, `01-button-goblin-clicker` was lost because:
1. `robocopy /MOVE` successfully copied Level 1 into `games\tier-1\` and deleted the original source.
2. A later cleanup script deleted the partial/target folder under `games\tier-1\`.
3. The script then attempted to move the original source, but the source had already been deleted by the earlier `/MOVE`.

### Rules for Structural Refactors
- Before any destructive cleanup, verify both source and destination state.
- Never delete a destination folder unless the source still exists or a verified backup exists.
- Avoid `robocopy /MOVE` for staged refactors unless the move is complete and logged.
- Prefer copy → verify → then delete source, not move/delete in one pass.
- Never run `Remove-Item -Recurse -Force` inside a structural refactor without an explicit confirmed target list.
- For bulk refactors, initialize git or create a backup snapshot first.
- If a move partially succeeds, freeze destructive operations and inspect state before cleanup.
- If `node_modules` or locked files make moves slow, stop and plan; do not brute-force with destructive cleanup.

### Doctrine
Structural cleanup must be transactional:
Plan → copy/move one unit → verify → patch references → only then remove old path.
If verification fails, stop.
