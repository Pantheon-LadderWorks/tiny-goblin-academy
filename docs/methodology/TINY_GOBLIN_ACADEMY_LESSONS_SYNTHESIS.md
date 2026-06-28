# Tiny Goblin Academy — Lessons Synthesis

## Purpose
This document synthesizes the cross-level lessons from all ten completed v0.1 ladder games in the AI Game Studio curriculum. It distills the verified operating model, the specific mechanical lessons, and the recovered drift patterns into reusable doctrine for future agentic development.

## Executive Summary
The completion of the ten-level ladder proved several critical theories of agentic development:
* **Small playable loops test agent usefulness better than abstract coding prompts.** A game cannot fake being finished; it either boots, plays, and enforces rules, or it fails visibly.
* **Contracts prevent scope drift.** Explicit Playable Loop Contracts successfully defended against the agent tendency to build sprawling, headless simulation engines or irrelevant features.
* **Tests catch logic mistakes** before they reach the browser.
* **Browser evidence catches playable/visual mistakes** that pass unit tests but fail to render a coherent human experience.
* **Human Review catches what agents still miss**, particularly visual coherence and subjective "fun" or pressure.
* **Visual coherence is part of playable truth.** An ugly, debug-style UI is a regression, not just a cosmetic flaw.
* **Simulation must own game state.** The DOM, UI, and rendering pipelines may display truth, but must never own it.

## Outcome Summary
* All ten v0.1 ladder games reached Playtested / Human Review Passed.
* This synthesis does not imply Released, Retired, Expanded, v0.2, or future implementation approval.
* The ladder proved a repeatable workflow: Contract → Skill Lane → Implementation → Tests → Browser Evidence → Human Review → Lessons Learned.

## Source Notes
* `LESSONS_LEARNED.md` was originally missing for Levels 1, 2, 3, and 8 during synthesis creation.
* Those four files have now been backfilled after ladder completion.
* The synthesis remains valid.
* Some evidence uncertainty remains:
  * Level 1 and Level 2 lack formal `PLAYTEST_REPORT.md` files.
  * Level 3 `PLAYTEST_REPORT.md` exists but previously listed run/evidence as “Not run.”
  * Level 8 `PLAYTEST_REPORT.md` exists but previously listed evidence screenshots as “Pending.”
* Human Review status remains Playtested / Human Review Passed for all ten levels.
* Evidence uncertainty is archival completeness debt, not a reversal of Human Review.

## Level-by-Level Lesson Map

### 1. Button Goblin Clicker
* **Original mechanical lesson:** Basic state-to-UI reactivity.
* **Actual verified lesson:** The first playable loop requires state and UI bound together cleanly from the start.
* **Notable correction/drift:** Establishing package manager discipline and early strict bounds.
* **Reusable doctrine:** Keep the loop simple; verify the boot state visually.

### 2. Potion Sorter
* **Original mechanical lesson:** Interactive matching and discrete state transitions.
* **Actual verified lesson:** Simple 2D spatial matching loop requires clear failure/success definitions.
* **Notable correction/drift:** Enforcing correct visual output for correct states.
* **Reusable doctrine:** Verify UI input and match resolution explicitly.

### 3. Dice Duel Tavern
* **Original mechanical lesson:** Simple turn-based dice math and causal feedback.
* **Actual verified lesson:** A simple, readable duel relies on discrete turns and a clear causal log.
* **Notable correction/drift:** Clarifying the bounds of a "duel" without expanding into an RPG engine.
* **Reusable doctrine:** A causal log makes the underlying rules visible and verifiable.

### 4. Card Goblin Duel
* **Original mechanical lesson:** State-machine phases.
* **Actual verified lesson:** Deterministic balance creates a "heart of the cards" feel without relying on true randomness.
* **Notable correction/drift:** A failed spike initially rendered a debug-page UI, collapsing the fantasy into raw buttons.
* **Reusable doctrine:** Visual coherence is part of First Playable. Human Review failure is an executable correction task, not a blocker.

### 5. 10x10 Dungeon Key Run
* **Original mechanical lesson:** Spatial navigation and hazards.
* **Actual verified lesson:** Hazard relevance matters. The Goblin was a decorative hazard until the map was rebuilt into a chokepoint.
* **Notable correction/drift:** The hazard was easily bypassed initially.
* **Reusable doctrine:** A hazard must intersect the critical path. Ledger numbering preserves historical order.

### 6. Tiny Farm Day
* **Original mechanical lesson:** Simulation over time.
* **Actual verified lesson:** Action-driven ticks work perfectly for deterministic loops. Time does not need to flow continuously.
* **Notable correction/drift:** "Wait" was deemed an unnecessary verb; valid productive actions cleanly advance time.
* **Reusable doctrine:** Keep the simulation as a discrete state machine. Constrain the economy to prevent scope creep.

### 7. Pet Campfire
* **Original mechanical lesson:** Real-time simulation and continuous meters.
* **Actual verified lesson:** Real-time-feeling games should still use deterministic simulation ticks.
* **Notable correction/drift:** The browser timers tried to own game truth.
* **Reusable doctrine:** Browser timers may drive the UI pulse, but must not own game truth. Meter decay creates pressure without requiring enemies.

### 8. One-Room Platformer
* **Original mechanical lesson:** Fixed-step physics simulation and collisions.
* **Actual verified lesson:** Pure deterministic simulation core must be isolated from browser timers entirely.
* **Notable correction/drift:** Math and collision ambiguity required exact top-left coordinate contracts.
* **Reusable doctrine:** Deterministic tests prove collision; fixed-step physics is superior to browser time for reliability.

### 9. Top-Down Slime Quest
* **Original mechanical lesson:** 2D movement, states, and attack hitbox truth.
* **Actual verified lesson:** A pounce attack is an excellent v0.1 mechanic because it combines movement, risk, and hitbox truth.
* **Notable correction/drift:** Platformer ghosts were inappropriately copied from Level 8. Visual shell regression occurred.
* **Reusable doctrine:** Capture scripts verify the loop but don't own truth. Visual shell preservation is mandatory for Human Review.

### 10. Mini Settlement Sim
* **Original mechanical lesson:** Multi-day survival simulation and decision loops.
* **Actual verified lesson:** Daily resolution order is a gameplay rule, not an implementation detail.
* **Notable correction/drift:** Overly broad planning and "zombie economics" (foraging after starving).
* **Reusable doctrine:** Failure before production creates meaningful planning pressure. A tiny scripted event creates strategy without a full sim engine. Short-circuit rules prevent zombie states.

## Cross-Level Patterns
The ten levels continuously reaffirmed these operating patterns:
* **Loop-first design:** Define the smallest actionable loop before writing any renderer code.
* **Visual shell preservation:** The "Tiny Goblin Academy" aesthetic is a requirement, not a polish pass.
* **Simulation/UI/render boundary:** Strict decoupling was necessary to survive complex states.
* **Deterministic tests:** Math and rules must be proven before browser testing.
* **Human review:** Agents cannot judge "fun", readability, or subjective pressure perfectly.
* **Capture evidence:** Automated Playwright scripts are the gold standard for proving UI state to an LLM without hallucination.
* **Action ledger / causal trace:** Essential for reviewing "why" something happened without diving into console logs.
* **Package/tool discipline:** Forcing `pnpm` over `npm` prevented lockfile churn.
* **Shell/platform assumptions:** Cross-platform script behaviors (like `spawn` inside capture scripts) require strict handling.
* **Scope creep kill switches:** Hard exclusions in contracts are the only way to stop agents from building Factorio in v0.1.
* **Correction required as executable state:** Failure is just a task, not a breakdown.

## Drift and Recovery Patterns
The ladder did not succeed by avoiding mistakes; it succeeded by catching and recovering from them smoothly:
* **Visual regression:** Levels 4 and 9 drifted into "debug boxes." The workflow successfully flagged and fixed this.
* **Platformer ghosts:** Level 9 inherited irrelevant code from Level 8. Contracts acted as a firewall to scrub this drift.
* **Package manager mistakes:** Errant `npm install` runs were successfully recovered by disciplined `pnpm` resets.
* **Hazard irrelevance:** Level 5 proved the system can detect when a feature works mechanically but fails functionally.
* **Overly broad planning:** Level 10 initially drifted away from the original brief; Human Review corrected the trajectory before implementation.
* **Capture-script fragility:** Issues with ports, timeouts, and hidden overlays were resolved iteratively.
* **Math/collision ambiguity:** Level 8 forced exact coordinate specification to resolve collision edge cases.
* **Level 10 "zombie economics" risk:** Detected in planning and explicitly locked in the contract to short-circuit logic upon defeat.

## Agent Workflow Doctrine
The ladder refined a repeatable, highly resilient operating model:
`Contract → Skill Lane → Implementation → Tests → Browser Evidence → Human Review → Lessons Learned`

* **AI proposes:** The agent authors the implementation and the structural files.
* **System approves:** Tests and capture scripts act as automated gating mechanisms.
* **Ledger remembers:** Causal logs ensure the logic history is legible.
* **Kryssie/Human Review decides:** The human sovereign determines whether it actually counts as playable and meaningful.

## Game Development as Model Benchmark
Tiny games are arguably the strongest benchmark for coding agents because they leave nowhere to hide:
* **Boot failure is obvious:** White screens can't be masked.
* **Control mistakes are obvious:** If a button doesn't work, the loop breaks instantly.
* **Collision mistakes are obvious:** Phasing through walls invalidates the game state visibly.
* **Missing stakes are obvious:** If you can't lose, it's not a game.
* **Visual/debug UI regression is obvious:** Missing the visual shell stands out immediately.
* A game forces the precise integration of **state, input, UI, rendering, feedback, and completion/failure** in a way that standard CRUD apps often don't test.

## Final Doctrine Extracts
* **A hazard is not valid just because it exists; it must shape the critical path.**
* **Functional correctness and visual coherence are both required for First Playable.**
* **The renderer may display truth but must not own truth.**
* **A visible ledger turns simulation into reviewable play.**
* **Daily resolution order is gameplay, not an implementation detail.**
* **Capture scripts prove the loop but must not become the source of truth.**
* **v0.1 means small, not ugly.**
* **Correction Required is not a blocker; it is an executable implementation state.**

## Open Follow-Up Recommendations
To crystallize the success of the Academy ladder, the following non-code follow-ups are suggested:
* Create a progress tracker to maintain velocity on future ladders.
* Create a reusable contract template refined from the ten levels.
* Create a model/agent benchmark rubric based on the ladder's challenges.
* Create a visual shell checklist for standardized v0.1 UI components.
* Create a capture-script standard for reliable automated browser testing.
* Create a formal postmortem/case study on the AI Game Studio experiment.
