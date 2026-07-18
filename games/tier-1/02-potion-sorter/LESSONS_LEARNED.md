# Potion Sorter — Mechanical Lessons Learned

## Record status

This is an honest reconstruction created after ladder completion. The deleted
or missing original wording is not recoverable. This record is grounded in the
surviving Academy lessons synthesis, current simulation/controller contracts,
tests, runtime reports, evidence, and human-review status.

## Original lesson

Interactive matching and discrete state transitions.

## Verified lesson

A simple 2D spatial matching loop requires explicit input mapping and equally
explicit success and failure definitions. Correct simulation state is not
enough if the player cannot see which potion is active, which destination is
valid, what the placement resolved to, or whether the combo and timer changed.

## Notable drift and correction

- Correct visual output had to be enforced for each correct state rather than
  inferred from the matching rule.
- Tap-select became a valid parallel input contract instead of treating drag
  and drop as the only acceptable implementation.
- The renderer remained a subscriber: potion order, match resolution, score,
  combo, timer, and completion stayed in simulation/controller authority.
- Historical formal playtest files remain incomplete, but current tests,
  runtime evidence, and repeated human play establish the active loop.

## Reusable doctrine

- Verify selection, destination, resolution, and feedback as separate states.
- A matching game needs readable failure truth as much as readable success.
- Alternative pointer gestures may share one controller command path; they
  must not become separate rule systems.
- UI and scene objects display state but do not own it.
- Automated rule tests, runtime evidence, and human review prove different
  kinds of correctness.

## Surviving authority

- `docs/methodology/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md`
- `meta/progress-tracker.md`
- `games/tier-1/02-potion-sorter/src/simulation.ts`
- `games/tier-1/02-potion-sorter/src/controller.ts`
- `games/tier-1/02-potion-sorter/tests/`
