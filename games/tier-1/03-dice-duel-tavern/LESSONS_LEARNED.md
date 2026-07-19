# Level 3 Lessons Learned — Dice Duel Tavern

## Reconstruction note

This file reconstructs the original mechanical-era lesson from surviving v0.1 authority: `PLAYABLE_LOOP_CONTRACT.md`, `PLAYTEST_REPORT.md`, `HUMAN_REVIEW.md`, the Academy lessons synthesis, and the accepted runtime behavior. It is not presented as a verbatim lost original. Later Web Crypto, DieRig, tavern, material, typography, and reduced-motion work belongs in `LESSONS_LEARNED_VISUAL_INTEGRATION.md`.

## Original lesson

Dice Duel tested whether a tiny turn-based fight could remain understandable while several pieces of state changed in sequence. The primary player verb was deliberately narrow: roll once, then choose exactly one of Attack, Heal, or Block.

The first playable loop was:

`player turn → roll → choose one action → resolve visibly → deterministic enemy response → repeat → victory or defeat`

That was enough to count as a game because it provided an actionable start, meaningful choice, visible consequences, a repeatable loop, and terminal outcomes without expanding into an RPG.

## Explicit phases prevent accidental actions

Even the primitive version needed discrete authority phases. Roll could not remain available after a value was produced, actions could not be legal before a roll, and terminal states had to close every gameplay input.

The durable lesson was not the exact phase names. It was that turn-based games should encode legality in state rather than infer it from whichever buttons happen to look disabled.

## Simulation owns truth

The simulation owned:

- player and opponent HP;
- the current phase and roll value;
- which actions were legal;
- Block’s pending reduction;
- every causal log entry;
- deterministic Goblin Brawler damage;
- victory and defeat.

DOM and Phaser presentation could expose that state, but neither was allowed to invent damage, healing, action availability, or outcomes. This separation made the rules testable before the game looked convincing.

## One roll, one choice

The mathematics stayed intentionally small:

- Attack deals the roll value.
- Heal restores the roll value but never exceeds 10 HP.
- Block reduces the immediate three-damage response, to a minimum of zero.
- The Goblin Brawler responds deterministically after a nonterminal player action.

Because one number fed three different decisions, the player could understand the tradeoff without inventory, equipment, skills, critical hits, status effects, or multiple enemies.

## Visible causality is part of correctness

The combat log was not decoration. Every state change needed narration:

```text
You rolled 4.
You chose Block for 4.
Goblin Brawler attacks for 3. Block reduced it to 0.
```

HP changing correctly in memory was insufficient if the player could not explain why it changed. The same rule applied to healing caps, defeated opponents, terminal input locks, and recovery from low HP.

## The fixed sequence was a bounded convenience

The v0.1 prototype used a fixed roll sequence. That made early tests and manual review repeatable and kept the lesson focused on turn authority and causality. It was not production randomness and should not be remembered as such.

The later visual/runtime pass replaced the production source with Web Crypto behind an injectable boundary. That correction strengthened the finished game without changing what the first playable originally proved.

## Why the primitive version still counted

The first presentation was a three-column dashboard with placeholder combatants and an extremely constrained playfield. It was visually weak, but the loop still counted as First Playable because a reviewer could:

- begin from a clear player turn;
- roll and see actions become available;
- exercise Attack, Heal, and Block;
- observe the enemy response and causal log;
- reach readable victory and defeat;
- verify that renderer timing did not own simulation truth.

First Playable certifies a coherent loop, not final art direction.

## Mechanically reusable doctrine

Later turn-based games may inherit:

- explicit, testable phases;
- one authoritative simulation state;
- action legality derived from phase;
- deterministic injected sequences for tests;
- complete causal narration;
- one visible latest exchange plus preserved full history;
- terminal input gating;
- small rulesets whose choices remain meaningfully distinct.

They should not inherit the fixed production sequence, primitive dashboard, or assumption that presentation may choose results.

## Closure

`mechanicalLessonClosed: true`

The v0.1 lesson remains historical authority. The separate visual ledger records how Dice Duel later learned stage geometry, persistent actor motion, production randomness, material presentation, and Academy visual grammar.
