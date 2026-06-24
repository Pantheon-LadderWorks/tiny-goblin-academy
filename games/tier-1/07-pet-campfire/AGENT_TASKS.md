# Level 7 Agent Tasks: Pet Campfire

## Primary Goal
Implement the Pet Campfire v0.1 simulation and renderer according to the PLAYABLE_LOOP_CONTRACT.md.

## Required Workflow Skills
* `test-driven-development`
* `systematic-debugging`
* `verification-before-completion`

## TDD Requirements (Tests must pass before UI implementation)
Write unit tests proving the deterministic simulation logic:
- [ ] initial state bounds are correct.
- [ ] `tick(1)` decays meters (Hunger -4, Happiness -3) and increments survival time (+1).
- [ ] meters clamp at exactly 0.
- [ ] Feed restores Hunger by 25 and caps at 100.
- [ ] Play restores Happiness by 25 and caps at 100.
- [ ] Defeat is correctly triggered at Hunger <= 0.
- [ ] Defeat is correctly triggered at Happiness <= 0.
- [ ] Victory is correctly triggered at SurvivalTime >= 60.
- [ ] Feed sets Pet Status to Eating.
- [ ] Play sets Pet Status to Playing.
- [ ] tick after Eating/Playing returns Pet Status to Idle unless terminal.
- [ ] Victory sets Pet Status to Sleeping.
- [ ] Defeat sets Pet Status to RanAway.
- [ ] Reset restores initial state perfectly (including Pet Status to Idle).
- [ ] Terminal lock prevents Feed/Play/tick mutation after Victory/Defeat.
- [ ] Ledger numbering/rendering rule is verified (if tested at UI layer or in simulation ledger push).

## Implementation Checklist
- [ ] Copy or adapt boilerplate stack (Vite + TypeScript + Vitest + Phaser + Playwright).
- [ ] Build pure deterministic simulation core (`src/simulation.ts`).
- [ ] Write and pass all required tests.
- [ ] Implement Tiny Goblin Academy visual shell (HTML/CSS/Phaser).
- [ ] Wire the UI to call `tick(1)` on a `setInterval` or equivalent browser loop.
- [ ] Capture playtest screenshot evidence (Boot, Degraded, Recovered, Defeat, Victory).
