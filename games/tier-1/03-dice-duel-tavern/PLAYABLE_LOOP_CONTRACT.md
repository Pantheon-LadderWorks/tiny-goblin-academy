# Playable Loop Contract — Dice Duel Tavern v0.1

## Status

Playtested / Human Review Passed — Kryssie manually verified the v0.1 duel and accepted it as a playable game. No release or v0.2 authorization is implied.

## Player fantasy

I win a small, readable tavern duel by making one good choice after each dice roll.

## Primary player verb

Choose Attack, Heal, or Block after rolling dice.

## First playable loop

`Start player turn → roll dice → choose Attack, Heal, or Block → resolve state visibly → enemy responds visibly → next turn → win or loss`

## Start state

One screen shows player HP, one named opponent’s HP, whose turn it is, a Roll button, disabled action controls until a roll, and an empty visible combat log/turn banner.

## Success and failure

- **Success:** Reduce the one opponent’s HP to zero and show an unambiguous victory state.
- **Failure:** Player HP reaches zero and shows an unambiguous defeat state; no retry flow is required unless separately approved.

## Bounded content

- One opponent only: **Goblin Brawler**.
- Three player actions only: Attack, Heal, Block.
- One duel only.
- One screen only.
- One dice roll per player turn.
- Simple shapes, emoji, or placeholders only.

## Explicit exclusions

- No tavern hub, party system, factions, deckbuilder, equipment, leveling, procedural encounters, or story campaign.
- No backend, accounts, save system, release work, multiplayer, multiple opponents, inventory, quests, or expanded RPG systems.
- No v0.2 polish or expansion until this v0.1 loop is visibly playable, playtested, and accepted by Kryssie.

## Architecture boundaries

- **Simulation owns:** player/enemy HP, current phase, roll value, available action state, block value, combat log entries, win/loss state, and deterministic enemy response.
- **Renderer owns:** dice, character placeholders, hit/block/heal presentation, and visual turn adaptation.
- **DOM UI owns:** turn banner, HP labels, action controls, combat log, and win/loss text.
- **Input actions:** `roll`, `attack`, `heal`, `block`.

## v0.1 dice/action rule

- Roll one d6 once per player turn.
- Attack deals the roll value as damage.
- Heal restores the roll value, capped at maximum HP.
- Block reduces the next Goblin Brawler attack by the roll value, to a minimum of 0.
- Goblin Brawler response is deterministic and visibly logged.
- No crits, stamina, elemental dice, dice upgrades, randomness tables, equipment, or enemy abilities.

## Turn clarity law

Every state change must be narrated visibly. At minimum, the game must show:

```text
You rolled 4.
You chose Block.
Goblin Brawler attacks for 3.
Block reduced it to 1.
```

The player must never need to infer whether a roll happened, whose turn it is, whether Block applied, why damage changed, or whether they are winning.

## Default skill lane for later implementation

`game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`

## Definition of done

A player can begin a turn, roll, choose every action, read the resulting player/enemy state and enemy response, then reach a clear win and loss state without ambiguity about cause and effect.

## Required playtest evidence

- `evidence/screenshots/` — actionable boot state, rolled state, Attack result, Heal result, Block reduction, victory, and defeat.
- `evidence/videos/` — one continuous duel demonstrating turn alternation and combat log clarity.
- `evidence/playtest-notes/` — turn clarity observations and any cause/effect ambiguity.

## Game-specific stop conditions

- Stop if the current turn, roll result, or action availability is unclear.
- Stop if enemy damage or Block reduction is not visibly explained.
- Stop if a player cannot understand why a win/loss or HP change occurred from the on-screen state/log.
