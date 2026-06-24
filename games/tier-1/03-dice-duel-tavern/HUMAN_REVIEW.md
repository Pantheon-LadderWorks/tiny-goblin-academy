# Human Review — Dice Duel Tavern v0.1

> **Current status:** Playtested / Human Review Passed on 2026-06-23. This does not authorize v0.2 or release work.

## Future review focus

When implementation is approved, verify that:

1. The player always knows whose turn it is and what action is currently available.
2. Dice roll results and their effect on action resolution are visible.
3. Attack, Heal, and Block each explain their result.
4. Enemy response is understandable, including how Block changes damage.
5. Victory and defeat are clear, not merely a number reaching zero.
6. The duel feels like a compact tavern fight, not an RPG dashboard.

## Future evidence locations

- Screenshots: `evidence/screenshots/`
- Video: `evidence/videos/`
- Notes: `evidence/playtest-notes/`

## Future Human Review Gate

**Recorded result:** Accepted. Kryssie manually verified Attack, Heal, Block, enemy response, victory, combat-log clarity, and recovery from 1 HP to victory. Sasha QA captured defeat-state evidence, satisfying the readable loss-state requirement without requiring Kryssie to lose.

Accept only if the duel loop is visible, coherent, and causally legible enough to count as a game. Otherwise document the exact turn-clarity blocker in `PLAYTEST_REPORT.md` and return to the approved v0.1 scope.
