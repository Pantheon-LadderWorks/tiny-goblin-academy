# Agent Tasks: Level 9 (Top-Down Slime Quest)

## Status: Contract Approved
Awaiting final review for implementation.

## Scaffold & Core Setup
- [ ] Initialize `simulation.ts` with top-down specific types (Slime, Enemy, Essence).
- [ ] Define fixed timestep (`1/60`) and pure AABB functions.
- [ ] Stub out `tick()` method.

## Simulation Implementation (TDD)
- [ ] Explicit test: initial state exact positions/facing/status.
- [ ] Explicit test: four-direction movement updates facing.
- [ ] Explicit test: pounce starts from Normal using current facing.
- [ ] Explicit test: pounce cannot steer.
- [ ] Explicit test: pounce duration returns to Normal.
- [ ] Explicit test: pounce into wall stops at boundary and returns to Normal.
- [ ] Explicit test: normal enemy contact triggers Defeat.
- [ ] Explicit test: pounce enemy contact defeats enemy and spawns essence.
- [ ] Explicit test: essence starts inactive.
- [ ] Explicit test: essence collection sets collected/unlocks exit.
- [ ] Explicit test: exit before essence does not win.
- [ ] Explicit test: exit after essence triggers Victory.
- [ ] Explicit test: terminal lock prevents mutation after Victory/Defeat.
- [ ] Explicit test: reset restores initial state.
- [ ] Explicit test: ledger logs only discrete events.
- [ ] Implement `tick()` to pass all tests.

## UI Implementation
- [ ] Adapt `index.html` to Top-Down Slime Quest (remove platformer ghosts).
- [ ] Map keyboard cursors and DOM buttons.
- [ ] Update `main.ts` to render the slime (e.g. green square/sprite), enemy (red), essence (blue), and exit (yellow).
- [ ] Visually indicate Pounce state (e.g. elongation or color shift).

## Playtesting & Release
- [ ] Write Playwright script (`capture.cjs`) to produce `01-boot`, `02-pounce`, `03-defeat`, and `04-victory`.
- [ ] Review captures and update placeholder `PLAYTEST_REPORT.md` and `RELEASE_CHECKLIST.md`.
- [ ] Request Human Review Pass.
