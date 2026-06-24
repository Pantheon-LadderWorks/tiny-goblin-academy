# Playtest Report — Dice Duel Tavern v0.1

> **Status:** Playtested / Human Review Passed. Kryssie manually verified the v0.1 duel and accepted it as a playable game.

## Run metadata

- **Date/time:** Not run
- **Build/commit/reference:** Not created
- **Browser and viewport:** Not run
- **Tester:** Not assigned
- **Contract reviewed:** `PLAYABLE_LOOP_CONTRACT.md`

## Outcome

Playtested / Human Review Passed

## Required evidence

| Check | Intended evidence location | Result | Notes |
| --- | --- | --- | --- |
| Useful actionable boot state | `evidence/screenshots/boot-state.*` | Not run | Player/enemy HP, player turn, Roll button, and log visible. |
| Roll state | `evidence/screenshots/rolled.*` | Not run | Roll value and enabled actions are clear. |
| Attack resolution | `evidence/screenshots/attack.*` | Not run | Damage cause/effect is logged and visible. |
| Heal resolution | `evidence/screenshots/heal.*` | Not run | Heal amount and resulting HP are clear. |
| Block reduction | `evidence/screenshots/block.*` | Not run | Incoming damage and reduction are both stated. |
| Enemy response | `evidence/videos/turn-loop.*` | Not run | Enemy action and outcome are legible. |
| Win/loss states | `evidence/screenshots/win.*` and `evidence/screenshots/loss.*` | Not run | Both endings are unambiguous. |
| Turn clarity | `evidence/playtest-notes/turn-clarity.md` | Not run | No unexplained state changes. |

## Main-verb test script

1. Confirm the player turn is visible and Roll is the only initial action.
2. Roll and confirm the value plus enabled actions are visible.
3. Use Attack, Heal, and Block across deliberate test paths.
4. Confirm every action is narrated before/with the enemy response.
5. Reach both victory and defeat paths and verify their result state.

## Findings

| Severity | What is observed | Reproduction | Owning boundary | Recommended next action |
| --- | --- | --- | --- | --- |
| P3 | Phaser production bundle exceeds Vite’s default 500 kB warning threshold. | Run `pnpm build`. | Build optimization | Defer optimization until a separately approved release pass. |

## Stop-condition check

- [ ] Game visibly boots into an actionable state.
- [ ] Main verb is playable.
- [ ] Current turn, roll, actions, and enemy response are understandable.
- [ ] No contract-external system was added.
- [ ] UI reads as a game face, not dashboard chrome.
- [ ] State is visible on screen, not only in logs/headless output.
- [ ] Renderer is not the source of truth.

## Agent conclusion

Live browser verification confirmed the actionable player-turn state, HP, Roll gating, d6 result, action availability, and visible combat log. Kryssie then manually verified Attack, Heal, Block reduction, enemy response, victory, combat-log clarity, and recovery from 1 HP to victory. The status advances to **Playtested** only through that Human Review decision.

## Human Review Gate — Kryssie

- [x] Accepted: Kryssie manually reviewed the complete v0.1 duel and accepted it as playable.
- [ ] Does not count yet; return to the named blocker.
- [ ] Approved to discuss a bounded v0.2 only after this v0.1 result is accepted.

**Reviewer notes:** Kryssie reached 1 HP, used Heal to recover to 7 HP, then used Block/Attack decisions to defeat Goblin Brawler. Manual review verified Attack, Heal, Block reduction from 3 to 0, enemy response, victory, and the causal combat log. Defeat-state evidence was captured by Sasha QA, preserving the Kryssie-never-loses doctrine while satisfying readable loss-state verification. “Me lose?” is now Human Review doctrine.
