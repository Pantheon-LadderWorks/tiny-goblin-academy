# Button Goblin Visual Learning Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct Button Goblin's missing mechanical lesson from surviving authority, preserve its post-playable visual/runtime lessons in a second pass-specific ledger, and establish the reusable visual-pass ledger/synthesis template for all ten Academy games.

**Architecture:** Restore the missing mechanical ledger as an explicitly labeled reconstruction sourced only from the surviving synthesis and primary loop/review records. Keep that recovered mechanical history separate from a new visual-pass ledger, which records H6.1-H6.4A chronologically. A shared methodology template standardizes per-game visual ledgers now and defers cross-game synthesis until all ten visual passes close.

**Tech Stack:** Markdown, Git history, existing Academy runtime/evidence documentation.

## Global Constraints

- Documentation and curriculum architecture only.
- Recreate the missing mechanical `LESSONS_LEARNED.md` only as an explicitly labeled historical reconstruction from surviving authority; do not invent a verbatim original.
- Do not modify the current mechanical lessons synthesis during this game-only closure.
- Do not modify runtime code, Hub/Tauri code, packages, locks, manifests, source assets, font binaries, or evidence images.
- Do not begin Potion Sorter implementation, texture ingestion, audio, optimization, or shaders.
- Return before staging or committing.

---

### Task 1: Button Goblin mechanical lesson reconstruction

**Files:**
- Create: `games/tier-1/01-button-goblin-clicker/LESSONS_LEARNED.md`

**Interfaces:**
- Consumes: the Level 1 section of `docs/methodology/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md`, `PLAYABLE_LOOP_CONTRACT.md`, `PLAYTEST_REPORT.md`, `HUMAN_REVIEW.md`, `README.md`, and commits `ca01588` through `e3f9440`.
- Produces: the missing canonical Level 1 mechanical-era learning record, clearly marked as reconstructed.

- [ ] **Step 1:** Preserve the synthesis fields: original lesson, verified lesson, notable correction/drift, and reusable doctrine.
- [ ] **Step 2:** Add only mechanically contemporary supporting detail from the loop and review records.
- [ ] **Step 3:** State that the document is reconstructed rather than the deleted original wording.

### Task 2: Button Goblin visual-pass learning ledger

**Files:**
- Create: `games/tier-1/01-button-goblin-clicker/LESSONS_LEARNED_VISUAL_INTEGRATION.md`

**Interfaces:**
- Consumes: `docs/methodology/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md`, Button Goblin loop/review records, H6 runtime reports, evidence shelves, and commits `ca01588` through `ef903b1`.
- Produces: the Level 1 visual-pass source record that the eventual ten-game visual synthesis will consume.

- [ ] **Step 1:** Record the surviving mechanical baseline from the synthesis without claiming to restore the deleted original file.
- [ ] **Step 2:** Record shell/stage, background, actor-rig, typography, shared-surface, evidence, and responsive-desktop phases using the approved learning fields.
- [ ] **Step 3:** Record rejected/deferred paths, invariants, GlyphForge graduates, evidence/commits, and Potion Sorter inheritance.
- [ ] **Step 4:** Mark untouched audio, accessibility expansion, optimization, shaders, and distribution phases as explicitly deferred.

### Task 3: Reusable visual-pass ledger and synthesis template

**Files:**
- Create: `docs/methodology/templates/TINY_GOBLIN_ACADEMY_VISUAL_PASS_LESSONS_AND_SYNTHESIS_TEMPLATE.md`

**Interfaces:**
- Consumes: the approved append-only, pass-specific curriculum model.
- Produces: one standard for Levels 1-10 visual ledgers and the synthesis created only after all ten ledgers close.

- [ ] **Step 1:** Define naming, authority, append-only, and non-retroactive-history rules.
- [ ] **Step 2:** Define mandatory per-phase fields and explicit not-taught/deferred states.
- [ ] **Step 3:** Define the closure gate: validation, human review, game ledger, doctrine promotion/deferral, and next-game inheritance.
- [ ] **Step 4:** Define the end-of-pass synthesis structure and readiness checklist without pre-writing conclusions from incomplete games.

### Task 4: Documentation-only validation and handoff

**Files:**
- Validate: the four new Markdown files from this plan.

**Interfaces:**
- Consumes: Tasks 1-3 outputs and current clean repository baseline `ef903b1`.
- Produces: an unstaged H6.4B diff inventory and exact future staging/commit recommendation.

- [ ] **Step 1:** Verify every referenced repository path and commit resolves.
- [ ] **Step 2:** Scan added Markdown for control characters, mojibake, placeholders, contradictions, and ambiguous authority claims.
- [ ] **Step 3:** Confirm no runtime, manifest, package/lock, source-asset, evidence-image, or Potion Sorter file changed.
- [ ] **Step 4:** Run `git diff --check` and report exact changed files without staging or committing.
