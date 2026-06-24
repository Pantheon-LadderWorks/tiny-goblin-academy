# Dice Duel Tavern

> **Status:** Playtested — Kryssie manually reviewed and accepted the v0.1 loop. It is not Released and no v0.2 work is authorized.

## v0.1 premise

Win one compact tavern duel against the Goblin Brawler: roll dice, choose Attack, Heal, or Block, then survive its deterministic response.

## Primary player verb

Choose one turn action after a roll.

## Planned loop

Start turn → roll dice → choose Attack, Heal, or Block → resolve player/enemy state → enemy responds → repeat until win or loss.

## Cross-game lesson

Game 1 proved one-click progression. Game 2 proved bounded alternate input and feedback. Level 3 tests whether an AI can manage a readable turn loop, enemy response, and win/loss state without expanding into a larger RPG.

## Planning documents

- `PLAYABLE_LOOP_CONTRACT.md` — v0.1 scope, turn clarity, and evidence boundary.
- `AGENT_TASKS.md` — future implementation prompt; not current authorization.
- `PLAYTEST_REPORT.md` — future browser evidence record.
- `RELEASE_CHECKLIST.md` — decision gate after v0.1 is playtested.
- `HUMAN_REVIEW.md` — future manual acceptance guide.

## Next approval required

Kryssie must approve the Dice Duel Tavern Playable Loop Contract and explicitly authorize bounded v0.1 implementation before any runtime, package, source, asset, or build file is created.
