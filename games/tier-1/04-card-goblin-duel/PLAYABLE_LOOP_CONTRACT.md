# Playable Loop Contract — Card Goblin Duel v0.1

## Status

Contract Draft / Planned — not approved for implementation.

## Loop

Draw → inspect hand → play one card → resolve visible deterministic effect → enemy responds → redraw/continue → win or loss.

## Scope

- One enemy only: Card Goblin.
- One screen and one duel.
- Six cards maximum; simple placeholders only.
- Visible combat/action ledger required.
- Default future lane: `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.

## v0.1 cards

| Card | Effect |
| --- | --- |
| Strike | Deal 2 damage. |
| Guard | Reduce next enemy damage by 2. |
| Mend | Heal 2 HP. |
| Spark | Deal 1 damage and replace one card. |
| Stun | Prevent the next enemy attack once. |
| Heavy Bonk | Deal 4 damage; skip next draw. |

Rules are deterministic and testable. No random card effects.

## Deterministic hand and duel rules

- Player HP 10; Card Goblin HP 12; win/loss at 0 HP.
- Hand size 3. The pool is exactly these six cards; start with its first three.
- Played cards go to the back of the draw queue. When draw is allowed, refill to three from the queue front.
- Spark deals 1 and replaces one chosen hand card with the next queued card.
- Heavy Bonk deals 4 and applies Skip Draw: no refill that turn.
- Card Goblin deterministically deals 2 after each player card unless modified.
- Guard reduces that next damage by 2, minimum 0; Stun prevents it once.
- Ledger explains every play, draw/replace, flag, HP change, enemy response, win, and loss.

## Explicit exclusions

No persistent party, XP, rarity, UUIDs, scars/injuries, revives, support repertoire, orbit/lane momentum, deckbuilder, collection, campaign, equipment, backend/accounts/save, release work, or future tactical RPG mechanics. No mana economy unless separately approved as one tiny resource.

## State law

Simulation owns hand, draw/replace state, player/enemy HP, card effects, Guard/Stun/Heavy Bonk flags, enemy response, win/loss, and ledger. Renderer shows it; DOM owns hand UI, log, and text state.

## Done

Player can inspect/play each card, understand its ledger entry and enemy response, and reach readable win/loss.
