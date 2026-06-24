# Release Checklist: Level 8 (One-Room Platformer)

## Artifacts & Evidence
- [x] `01-boot.png` exists and shows initial ledger/state.
- [x] `02-jump.png` exists and shows jump action.
- [x] `03-defeat.png` exists and proves the terminal spike check.
- [x] `04-victory.png` exists and proves the terminal goal check.

## Contract Verification
- [x] `PLAYABLE_LOOP_CONTRACT.md` matches implementation.
- [x] `AGENT_TASKS.md` is fully resolved.
- [x] Deterministic simulation doctrine upheld (`tick(state, input, deltaSeconds)`).
- [x] No engine physics used as game truth (pure AABB resolution).
- [x] Fixed timestep implemented (`1/60` seconds).
- [x] Exact geometry (Player `32x48`, Room `800x400`, Spikes `80x24`) maintained.
- [x] Jump physics constants (gravity: `1800`, jump velocity: `-620`) maintained.
- [x] Terminal priority correctly favors Defeat if overlapping both.

## Quality & Tests
- [x] Vitest suite passed.
- [x] Console is free of fatal errors.
- [x] UI Ledger correctly updates newest-first with historical numbering.
- [x] Tiny Goblin Academy shell layout preserved.
- [x] DOM buttons correctly interface with `inputState` alongside keyboard cursors.

## Status Updates
- [x] `README.md` badge updated to `Playtested`.
- [x] `PLAYABLE_LOOP_CONTRACT.md` badge updated to `Playtested`.
