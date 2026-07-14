# Tiny Goblin Academy — Visual-Pass Lessons and Synthesis Template

## Purpose

This template governs the second curriculum record for each of the ten Tier 1 games: the post-playable visual integration pass.

The mechanical `LESSONS_LEARNED.md` answers:

> How did this game's playable loop become correct and reviewable?

The visual-pass ledger answers:

> How did that mechanically complete game become a coherent Academy and GlyphForge visual artifact without breaking its loop?

The two histories remain separate. Later passes—audio, accessibility/input, optimization, advanced rendering/shaders, and release—should receive their own pass-specific ledgers rather than continually enlarging or rewriting the first document.

## File naming and authority

Per-game visual ledger:

```text
games/tier-1/<level-game>/LESSONS_LEARNED_VISUAL_INTEGRATION.md
```

End-of-pass synthesis, created only after all ten game ledgers close:

```text
docs/methodology/TINY_GOBLIN_ACADEMY_VISUAL_INTEGRATION_LESSONS_SYNTHESIS.md
```

Later pass examples:

```text
LESSONS_LEARNED_AUDIO_INTEGRATION.md
LESSONS_LEARNED_ACCESSIBILITY_INPUT.md
LESSONS_LEARNED_PERFORMANCE_OPTIMIZATION.md
LESSONS_LEARNED_ADVANCED_RENDERING.md
LESSONS_LEARNED_RELEASE_DISTRIBUTION.md
```

Each matching ten-game pass receives its own synthesis document. Do not retrofit later understanding into an earlier ledger or synthesis.

## Historical rules

1. **Append by curriculum pass, not by hindsight.** Preserve what was known at the start of each pass.
2. **Do not rewrite the mechanical lesson.** Refer to it as inherited authority.
3. **Label reconstruction honestly.** If an older ledger was lost, recover it from surviving contracts, reviews, synthesis, evidence, and commits; never claim reconstructed wording is verbatim.
4. **Separate discovery from doctrine.** The game ledger records how the lesson was discovered. The eventual pass synthesis retains the generalized rule.
5. **Preserve rejected paths.** A rejected asset, composition, runtime assumption, or architecture is curriculum evidence when it explains the accepted rule.
6. **Use explicit epistemic status.** Distinguish implemented, validated, human-approved, deferred, rejected, proposed, and inherited.
7. **Do not synthesize an incomplete pass.** A cross-game conclusion waits until every game has a reviewed ledger or an explicit not-taught/deferred record.

## Per-game visual ledger template

Copy the following structure into each game's `LESSONS_LEARNED_VISUAL_INTEGRATION.md`.

```markdown
# <Game Name> — Visual Integration Lessons Learned

## Record identity

**Curriculum pass:** Post-playable visual and runtime integration<br>
**Level:** <level number and game name><br>
**Closure lane:** <lane id><br>
**Mechanical baseline:** <status and mechanical lesson reference><br>
**Visual/runtime closure commit:** <hash and subject, or pending>

This is the game's visual-pass learning record. It does not replace or rewrite the mechanical `LESSONS_LEARNED.md`.

## Inherited mechanical baseline

- <simulation/state authority inherited>
- <input/loop contract inherited>
- <testing/evidence/human-review doctrine inherited>

## Phase <N> — <phase name>

### Starting understanding
<What Kryssie and the Academy understood before this phase.>

### Intended lesson
<The capability this phase was meant to teach.>

### Approaches attempted or rejected
- <accepted candidate, rejected candidate, or deferred alternative>

### Failures and surprises
- <runtime defect, visual mismatch, evidence failure, authority drift, or unexpected constraint>

### What worked and why
<Explain the accepted mechanism and why it fit this game.>

### Invariants preserved
- <simulation, controller, input, source asset, package, or host boundary that did not change>

### Reusable doctrine
- <general rule learned from this phase>

### GlyphForge graduates
- <asset, rig, tool, validator, recipe, primitive, or doctrine promoted for reuse>

### Evidence and commits
- `<repository path>`
- `<commit hash>` — <subject or role>

### Inheritance passed to the next game
<Name what the next game begins already knowing.>

## Deferred teaching territory

| Curriculum phase | Status in this game | Intended future lane |
|---|---|---|
| Asset intake and provenance | <taught / inherited / deferred> | <lane> |
| Visual integration | <taught / inherited / deferred> | <lane> |
| Actor or scene rigging | <taught / inherited / deferred> | <lane> |
| UI, typography, material grammar | <taught / inherited / deferred> | <lane> |
| Animation and feedback | <taught / inherited / deferred> | <lane> |
| Audio | <taught / inherited / deferred> | <lane> |
| Accessibility and input | <taught / inherited / deferred> | <lane> |
| Performance and optimization | <taught / inherited / deferred> | <lane> |
| Advanced rendering and shaders | <taught / inherited / deferred> | <lane> |
| Release and distribution | <taught / inherited / deferred> | <lane> |

## Doctrine promoted from this game

- <bounded generalized lesson>

## Final inheritance passed to <next game>

- <available shared capability>
- <new teaching territory>
- <explicit later-lane deferral>

## Visual-pass closure record

- Runtime validation: <passed / not applicable / pending>
- Evidence validation: <passed / not applicable / pending>
- Human visual review: <passed / pending>
- Game-specific ledger review: <passed / pending>
- Reusable doctrine: <promoted / deferred with reason>
- Next-game inheritance: <recorded / pending>
```

## Required visual-pass phase vocabulary

Use only the phases actually taught by the game. Mark the rest explicitly deferred rather than adding empty narrative sections.

- packaging and host integration;
- asset intake and provenance;
- visual asset integration;
- actor or scene rigging;
- UI, typography, and material grammar;
- animation and feedback;
- audio integration;
- accessibility and input evolution;
- performance and optimization;
- advanced rendering and shaders;
- release and distribution;
- GlyphForge graduation;
- next-game inheritance.

## Game-level closure gate

A game's visual pass is not closed until all applicable items are recorded:

1. Runtime validation passed, or documentation-only status is explicit.
2. Evidence exists at the correct game-owned path and resolves.
3. Human visual review passed.
4. The pass-specific game ledger was written and reviewed.
5. Reusable knowledge was marked for GlyphForge/Academy promotion or explicitly deferred.
6. The next game's inherited capabilities and new teaching territory were named.

Passing tests alone does not close a visual lesson. Human review alone does not replace evidence or curriculum extraction.

## Ten-game visual-pass readiness matrix

Maintain this table in the eventual synthesis working copy. Do not declare synthesis-ready until every row is resolved.

| Level | Game | Visual ledger | Runtime/evidence | Human review | Doctrine disposition | Ready for synthesis |
|---:|---|---|---|---|---|---|
| 1 | Button Goblin Clicker | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 2 | Potion Sorter | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 3 | Dice Duel Tavern | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 4 | Card Goblin Duel | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 5 | Dungeon Key Run | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 6 | Tiny Farm Day | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 7 | Pet Campfire | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 8 | One-Room Platformer | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 9 | Top-Down Slime Quest | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |
| 10 | Mini Settlement Sim | <path/status> | <status> | <status> | <promoted/deferred> | <yes/no> |

## End-of-pass synthesis template

Create the visual synthesis only when the readiness matrix resolves all ten games.

```markdown
# Tiny Goblin Academy — Visual Integration Lessons Synthesis

## Authority and pass boundary
<Define the ten source ledgers, closure range, and what this synthesis does not approve.>

## Executive synthesis
<State the small number of durable cross-game discoveries.>

## Capability progression across the ladder
| Level | Inherited capability | New visual lesson | GlyphForge graduate | Passed forward |
|---:|---|---|---|---|

## Cross-game doctrine
### Host and runtime composition
### Scene and actor rigging
### Asset and material use
### UI and typography
### Animation and feedback
### Evidence and human review
<Include only rules supported by multiple ledgers or clearly label a single-game pioneer.>

## Rejected patterns and why
<Promote repeated failure modes without copying every game's narrative.>

## GlyphForge graduation register
| Graduate | Origin game | Evidence | Reuse status | Limits |
|---|---|---|---|---|

## Deferred curriculum
<Audio, accessibility/input, optimization, shaders, distribution, or other phases not yet taught.>

## Next-pass inheritance
<State what the following full-ladder pass begins already knowing.>

## Source ledger index
<List all ten exact repository paths and closure commits.>
```

## Synthesis discipline

The final synthesis should not concatenate ten ledgers. It should:

- retain the chronological capability chain;
- identify which game pioneered each reusable rule;
- distinguish a repeated doctrine from a one-game observation;
- preserve meaningful rejected patterns;
- record reusable graduates with their limits;
- carry unresolved teaching territory forward explicitly;
- keep full discovery narratives in their game-owned ledgers.

The game ledger says how the Academy learned. The pass synthesis says what the studio now knows.

## Durable planning doctrine

Tiny Goblin Academy supports two legitimate execution rhythms:

- **Bounded relay work:** a focused prompt defines one small lane, implementation returns for review, and an approved result closes in the same turn or short relay.
- **Durable plan work:** an approved project plan governs multiple implementation turns, checkpoints, corrections, and reviews without being reconstructed from prompts each time.

Apply these rules to durable plans:

1. An approved implementation plan is a project artifact, not temporary agent scratchwork.
2. Durable plans belong under a project-owned planning shelf. A skill or agent's default output folder is not automatically canonical repository structure.
3. Use an established domain-specific planning shelf when one exists. Otherwise use `docs/planning/implementation/` for cross-domain implementation plans.
4. A plan may remain active across multiple sessions and human-review checkpoints.
5. Completed plans remain useful historical evidence of intended sequence, authority boundaries, and corrections unless the project deliberately retires or archives them.
6. Temporary exploration, command transcripts, and disposable agent scratchwork do not become durable plans merely because an agent generated them.
