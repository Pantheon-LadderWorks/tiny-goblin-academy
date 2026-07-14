# Level 1 Lessons Learned — Button Goblin Clicker

## Recovery note

This file reconstructs the missing Level 1 mechanical-era learning record. It is not presented as the verbatim deleted document. The recovery is bounded to surviving authority:

- `docs/methodology/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md`;
- `PLAYABLE_LOOP_CONTRACT.md`;
- `PLAYTEST_REPORT.md`;
- `HUMAN_REVIEW.md`;
- `README.md`;
- restoration commits `ca01588`, `ab6f2f8`, `f70bae2`, and `e3f9440`.

Later H6 visual/runtime knowledge is intentionally excluded. It belongs in `LESSONS_LEARNED_VISUAL_INTEGRATION.md`.

## Recovered lesson

* **Original lesson:** Basic state-to-UI reactivity.
* **Verified lesson:** The first playable loop requires state and UI to be bound together cleanly from the start.
* **Notable drift/correction:** The first visual attempts read as a cropped widget or debug surface rather than a complete Tiny Goblin Academy game. Package-manager discipline and explicit scope bounds were also necessary to keep restoration narrow.
* **Reusable doctrine:** Keep the loop simple, keep simulation authoritative, and verify the boot state and every state transition visually.

## What the playable loop proved

The authorized loop was deliberately small:

`click goblin → reduce HP → defeat goblin → earn coin → buy one damage upgrade → face stronger goblin → win after ten goblins`

That loop was enough to teach several durable lessons:

- The simulation must own HP, coins, damage, progression, and victory truth.
- Phaser and DOM surfaces may render the same state through different presentation layers without becoming competing authorities.
- A clicker does not need idle income, multiple shops, inventory, enemy classes, lore systems, persistence, accounts, or procedural content to become a complete first playable.
- State changes must be visible. A correct number hidden from the player is not sufficient feedback.
- The upgrade must change an observable rule—damage from one to two—not merely change button text.
- Later goblins need visibly higher HP so progression is mechanically legible.
- Victory after ten goblins is an explicit terminal condition, not an indefinite loop.

## Failures and corrections

The first restoration attempts exposed a distinction that remained important throughout the Academy:

- A mechanically correct widget was not automatically a coherent game face.
- The rejected cropped presentation needed the complete Academy page shell restored.
- The final review composition used visible statistics, a central playfield, and an upgrade surface while retaining one-screen play.
- Hit reaction, floating damage, defeat expression, rewards, upgrade availability, and victory required browser or human observation in addition to unit tests.
- `pnpm` discipline prevented package and lockfile churn from becoming part of a tiny gameplay lesson.

The correction did not expand the game. It made the authorized loop readable.

## What remained intentionally out of scope

The first playable did not teach or approve:

- additional upgrades or idle economy;
- inventory, enemy variety, or lore systems;
- save data, accounts, backend services, or procedural content;
- launcher, installation, distribution, or release behavior;
- the later Academy shell migration, cavern stage, GoblinRig, typography, shared UI surfaces, audio, textures, or shaders.

Those exclusions were part of the lesson: v0.1 means a bounded complete loop, not a compressed version of every future system.

## Evidence of the lesson

- `PLAYABLE_LOOP_CONTRACT.md` defines the loop and its non-goals.
- `PLAYTEST_REPORT.md` records the restored shell, hit feedback, reward state, and victory evidence.
- `HUMAN_REVIEW.md` records the accepted interaction and presentation checklist.
- `ca01588` restored the Level 1 loop.
- `ab6f2f8` improved the game face after visual review.
- `f70bae2` restored the full Academy page shell.
- `e3f9440` recorded the human-review pass.

## Inheritance passed forward

The next Academy lessons inherited these foundations:

- simulation is the source of truth;
- presentation subscribes to state;
- contracts constrain scope;
- deterministic tests prove rules;
- browser evidence proves visible state;
- human review decides whether the result counts as a coherent game.

The later visual-integration pass builds on this foundation without rewriting it.
