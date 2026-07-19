# Playtest Report — Dice Duel Tavern v0.1

> **Historical status:** Playtested / Human Review Passed. This record covers the original mechanical loop. H6.9–H6.12 later added the reviewed tavern, DieRig, production random source, materials, and typography without rewriting this v0.1 result.

## Run metadata

- **Original review date/time:** Historical manual review recorded; exact original run timestamp is unavailable.
- **Original build/commit/reference:** Historical accepted v0.1 source; exact original commit reference is unavailable in this report.
- **Original browser and viewport:** Browser play was recorded; exact original browser/version/viewport metadata is unavailable.
- **Tester:** Kryssie; Sasha QA supplied defeat-state evidence.
- **Contract reviewed:** `PLAYABLE_LOOP_CONTRACT.md`

## Outcome

Playtested / Human Review Passed.

## Required evidence

The original planned filenames were not preserved as exact artifact authority. The manual review and accepted report text establish the bounded v0.1 findings below; current H6.9–H6.12 evidence is separate later visual/runtime proof.

| Check | Historical result | Grounded finding |
| --- | --- | --- |
| Useful actionable boot state | Passed by manual review | Player/enemy HP, player turn, Roll gating, and causal log were visible. |
| Roll state | Passed by manual review | Roll value and enabled actions were clear. |
| Attack resolution | Passed by manual review | Damage cause/effect was logged and visible. |
| Heal resolution | Passed by manual review | Kryssie recovered from 1 HP to 7 HP; healing and capped HP behavior were understandable. |
| Block reduction | Passed by manual review | Block reduced the Goblin Brawler’s three-damage response to zero in the reviewed path. |
| Enemy response | Passed by manual review | The deterministic response and resulting HP change were legible. |
| Victory | Passed by manual review | Kryssie defeated the Goblin Brawler after recovering from 1 HP. |
| Defeat | Passed through Sasha QA evidence | The loss state was readable without requiring Kryssie to lose. |
| Turn clarity | Passed by manual review | No accepted state change required inference outside the visible causal trace. |

## Main-verb test path used

1. Confirm the player turn and Roll-only initial action.
2. Roll and verify the value plus action availability.
3. Exercise Attack, Heal, and Block across deliberate paths.
4. Confirm each player action and enemy response is narrated.
5. Reach readable victory and independently verify defeat.

## Findings

| Severity | What was observed | Owning boundary | Disposition |
| --- | --- | --- | --- |
| P3 | Phaser production bundle exceeded Vite’s default 500 kB advisory threshold. | Build optimization | Accepted and deferred to a separate optimization/release lane. |

## Stop-condition check

- [x] Game visibly booted into an actionable state.
- [x] Main verb was playable.
- [x] Current turn, roll, actions, and enemy response were understandable.
- [x] No contract-external RPG system was added.
- [x] State was visible on screen, not only in logs or headless output.
- [x] Renderer was not the source of truth.
- [x] Primitive dashboard presentation was accepted for First Playable and later corrected in the separate visual-integration chapter.

## Human Review Gate — Kryssie

- [x] Accepted: Kryssie manually reviewed the complete v0.1 duel and accepted it as playable.
- [ ] Does not count yet; return to the named blocker.

**Reviewer record:** Kryssie reached 1 HP, used Heal to recover to 7 HP, then used Block and Attack decisions to defeat the Goblin Brawler. Manual review verified Attack, Heal, Block reduction from 3 to 0, enemy response, victory, and the causal combat log. Sasha QA captured defeat-state evidence, preserving the Kryssie-never-loses doctrine while satisfying readable loss-state verification.

## Later authority

The current game has additional evidence under `evidence/h6-9-stage-first-shell-migration/`, `evidence/h6-10-dierig-motion-laboratory/`, `evidence/h6-11-live-dierig-random-d6-integration/`, and `evidence/h6-12-tavern-materials-shared-ui-typography/`. Those packets prove later presentation and runtime integration; they are not retroactive v0.1 run metadata.
