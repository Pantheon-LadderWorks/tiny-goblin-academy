# Level 8 Agent Tasks: One-Room Platformer

## Primary Goal
Implement the One-Room Platformer v0.1 simulation and renderer strictly according to the PLAYABLE_LOOP_CONTRACT.md.

## Required Workflow Skills
* `test-driven-development`
* `systematic-debugging`
* `verification-before-completion`

## TDD Requirements (Tests must pass before UI implementation)
Write unit tests proving the deterministic `tick(input, 1/60)` simulation logic:
- [ ] initial state correctly parses the spawn position, starting grounded at floor spawn with vx=0 and vy=0.
- [ ] gravity increases downward velocity over fixed ticks.
- [ ] left/right input changes horizontal movement.
- [ ] no input stops horizontal movement.
- [ ] jump applies only when grounded.
- [ ] jump does not apply while airborne.
- [ ] floor collision prevents falling through.
- [ ] landing sets `isGrounded` true and `vy` 0.
- [ ] platform collision works correctly.
- [ ] spike collision triggers Defeat.
- [ ] goal collision triggers Victory.
- [ ] terminal lock prevents movement/tick mutation after Victory/Defeat.
- [ ] reset restores initial state.

## Implementation Checklist
- [ ] Copy or adapt boilerplate stack (Vite + TypeScript + Vitest + Phaser + Playwright).
- [ ] Build pure deterministic AABB physics simulation core (`src/simulation.ts`).
- [ ] Write and pass all required Vitest unit tests.
- [ ] Implement Tiny Goblin Academy visual shell (HTML/CSS/Phaser).
- [ ] Wire the UI to drive fixed ticks (accumulating delta time) passing input down to the simulation.
- [ ] Capture playtest screenshot evidence for:
  - [ ] Boot state with player grounded.
  - [ ] Mid-air jump state.
  - [ ] Landing on a platform (Optional, if easy).
  - [ ] Spike Defeat state.
  - [ ] Goal Victory state.
