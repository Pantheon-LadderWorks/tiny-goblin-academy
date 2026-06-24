# Card Goblin Duel

> **Status:** Human Review Passed / Level 4 Complete
 
 Draw a tiny hand, play one card against one goblin, read the enemy response, and reach win/loss.
 
 **Lesson:** Game 3 proved causal turn clarity. Level 4 tests hand state, deterministic card effects, redraw/replace behavior, enemy response, and a visible ledger without becoming a TCG or Six Souls system.
 
 ## Final Correction Notes
 The final correction to achieve First Playable included:
 * Tiny Goblin Academy visual shell restored;
 * real card UI with effect text;
 * visible next-card preview;
 * visible action ledger;
 * Spark replacement-choice phase;
 * Guard/Stun/Heavy Bonk behavior;
 * victory/defeat lock;
 * displayed HP clamped at 0 in UI while simulation/ledger preserves true damage;
 * tests/build/playtest completed.

## Next approval

Approve `PLAYABLE_LOOP_CONTRACT.md` and explicitly authorize bounded v0.1 implementation before any code, package, source, asset, or build file is created.
