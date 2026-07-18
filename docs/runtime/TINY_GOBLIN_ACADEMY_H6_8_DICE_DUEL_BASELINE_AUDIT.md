# Tiny Goblin Academy H6.8 — Dice Duel Tavern Baseline Audit

Date: 2026-07-18
Baseline: `9811bb84974ac01e162dfd85e5a4304acb07cb21` on `main`; worktree was clean before this audit.

## Identity and launch truth

- Canonical folder: `games/tier-1/03-dice-duel-tavern`
- Package: `tga-03-dice-duel-tavern`
- Roster identity: `tga-03`, slug `dice-duel-tavern`, title `Dice Duel Tavern`
- Commands: `pnpm --filter tga-03-dice-duel-tavern dev`; `pnpm --filter tga-03-dice-duel-tavern build`; tests through the same filter.
- Hub roster: source/dev/playable available, playable mode `dev`; roster incorrectly says `buildAvailable: false` although the package has a working build script.
- Current responsive contract is implicit CSS: desktop max width 1100 px, three columns above 800 px, one-column stack below 800 px. No game-local minimum desktop contract is documented.
- Package, roster, folder, browser title, and contract agree on the game name. The README is stale: it still says implementation requires authorization although runtime and human review already exist.

## Authoritative gameplay contract

State is a pure `Duel` value in `src/simulation.ts`: player HP 10, enemy HP 10, phase, current roll, log, and deterministic die index. The v0.1 baseline uses the fixed sequence `[4, 3, 6, 2, 5]`; the audited runtime does not yet use randomness despite the roster lesson saying “Randomness and turn-based state.” This is recorded as baseline truth, not preserved production doctrine.

1. Start in `roll`; only Roll is enabled.
2. Roll consumes the next deterministic value, records it, and enters `action`.
3. Attack deals the roll to enemy HP. Heal restores the roll up to 10. Block reduces the immediate enemy attack by the roll.
4. Unless Attack wins immediately, the Goblin Brawler synchronously attacks for 3 in the same call stack.
5. Enemy resolution returns directly to `roll`, or enters `lost` at zero player HP.
6. Victory/loss disables all controls. There is no reset/replay control.
7. The DOM shows only the six newest log entries.

## Authority map

| Boundary | Current owner | Finding |
| --- | --- | --- |
| Simulation | `simulation.ts` | Owns all durable truth and deterministic sequence. Pure transitions are testable. |
| Controller | top-level handlers in `main.ts` | Thin but not separated; immediately calls simulation then `render()`. |
| Phaser renderer | one `create()` callback | Static circles and labels only. It never reads state after creation and owns no game truth. |
| DOM presentation | `render()` in `main.ts` | Turn, HP, roll, log, result, and button gating. |

No timer, promise, tween, delayed opponent phase, animation queue, or presentation lock exists. Input is gated only by simulation phase and disabled buttons. Enemy action is not a separately visible phase.

## Human-approved H6 direction

The post-audit review approved a bounded roll-source correction and visual identity for the future runtime:

- Production play will request one authoritative random d6 result per accepted Roll input.
- Tests, evidence capture, and bounded state reproduction will inject fixed or seeded results.
- The committed result enters simulation authority before presentation begins.
- Input remains locked while presentation performs the result; animation, timing, frame rate, bounce, and final orientation may never reroll or modify game truth.
- Flat faces 1–6 from the cleaned H5.32 derivative are the canonical six DieRig surfaces.
- Angled, corner, rolling, and tumbling dice remain source/reference candidates rather than runtime animation frames because their perspective, scale, and lighting do not form one coherent actor.
- The selected architecture is one persistent six-face 2.5D DieRig with fixed opposite-pair mapping, scripted X/Y/Z tumble, launch arc, bounded impacts, code-authored shadow response, and target-orientation settle.
- Selected dust or sparkle stamps may punctuate impacts, but Dice Duel does not take ownership of the Academy particle-system lesson.

Approved authority flow:

`Roll intent → authoritative d6 result → simulation stores result → input locks → DieRig choreography → exact-face settle → actions unlock`

This changes the placeholder roll source without adding a player verb, phase, enemy, die, damage rule, equipment system, or expanded randomness table. Attack still deals the committed roll, Heal still restores that value up to 10, and Block still applies it against the immediate three-damage enemy response.

## Runtime evidence

Fresh local launch succeeded at `http://127.0.0.1:4313`. Captures were made at 1920×1080 and 1024×640, then scripted through roll, Block, Heal, multiple Attack turns, and victory. The initial 1024×640 capture confirms a permanent left state rail, permanent right combat-log rail, constrained 520×280 center canvas, duplicate title layer, and dashboard-like boxed chrome. The game has no Help surface, Dev/diagnostic surface, reset surface, or motion to inspect. The current “complete turn sequence” is instantaneous DOM replacement rather than choreography.

Observed sequence: Roll 4 enables actions; Block 4 reduces the enemy attack from 3 to 0; Heal 3 is applied before the immediate enemy attack; victory ends at player 1/10, enemy 0/10 with every button disabled. Loss remains mechanically reachable through repeated low-value Block turns, but there is no bounded deterministic test control or replay harness in the runtime.

## Shell verdict

**Stage-first shell migration is required before motion work.** Both side rails are permanent, the central playfield is visibly subordinate, the title is duplicated relative to the Academy shell, and the log/instructions occupy dashboard chrome instead of a stage-owned treatment or Help surface. This is a full migration, not merely cosmetic spacing. Preserve the causal log, but relocate it into a stage-compatible expandable/history surface rather than deleting it.

## Asset readiness

| Family | Status |
| --- | --- |
| Source concept sheet | Present, provenance-tracked, RGB with baked checkerboard; source-only and never runtime-safe directly. |
| 64 region map | Mapped and human-reviewed in H5.30–H5.31; accepted for cleanup/planning; not runtime-approved. |
| Cleaned derivative | Generated and human-reviewed in H5.32–H5.33; accepted for draft pipeline use; not runtime-approved or wired. |
| Flat faces 1–6 | Human-selected as the canonical six surfaces for the future persistent DieRig; runtime crop/alpha/scale promotion proof is still required. |
| Rolling/tumbling dice | Rejected as runtime animation frames; retained as source/reference candidates only. |
| FX candidates | Cleaned and reviewed with retained fragility notes; optional support only, not lesson owner. |
| Duel/action tokens | Cleaned low-risk candidates; not selected or wired. |
| Tavern props/background pieces | Cleaned low-risk candidates; insufficient by themselves to define a complete stage. |
| Runtime wiring | None. Current renderer uses Phaser Graphics circles only. |

No new H5 mapping or cleanup lane is required. A bounded **runtime selection/promotion evidence gate** is required inside H6 before integration, because H5 deliberately stopped at draft-pipeline approval.

## Typography and shared surfaces

Dice Duel uses only `Georgia, serif` plus Phaser defaults. It consumes no Academy local font files, semantic typography roles, title/result treatment, shared physical surfaces, or shared UI assets. All roles are game-local CSS. Recommended future roles: Academy display face for title and outcome; readable Academy body face for turn, HP, prompts, and log; tabular/numeric-friendly treatment for values and die result. The log should remain code-native text. Dice, action emblems, and a few tavern props may use selected assets; structural panels and responsive layout should remain code-native.

## Motion-phase baseline

| Phase | Trigger | Presentation duty | Lock/interruption | Proof |
| --- | --- | --- | --- | --- |
| Anticipation | authoritative `roll` phase | focus die/cup and active player | input open only for Roll | clear ready state |
| Commitment | accepted Roll input | close actions and freeze repeat input | locked | one accepted roll |
| Release/roll | result already chosen by simulation | animate stable die actor without changing result | not interruptible | no reroll from timing |
| Travel/tumble | same roll event | spatial arc/rotation/face cycling | not interruptible | actor continuity |
| Impact/bounce | presentation timeline | bounded contacts, optional tiny marks | reduced-motion may skip | readable contact beats |
| Settle | presentation timeline ends | stop on authoritative face | locked until settled | final face equals state.roll |
| Confirm | settled event | announce number and enable actions | actions open | DOM/log agree |
| Action causality | accepted action transition | show attack/heal/block before damage | locked | ordered log + HP change |
| Opponent response | enemy transition | distinct telegraph and response beat | locked | enemy cause visible |
| Handoff | resulting `roll` phase | return focus to player | unlock Roll | no stale dice/log |
| Win/loss | `won`/`lost` | dominant result and replay affordance | terminal except replay | unmistakable outcome |

Reduced motion should keep the result fixed, replace long tumble/bounces with a short direct reveal, preserve ordered action/enemy causality, and retain the same control lock/unlock points.

## Identity law for the later runtime

Use one persistent six-face 2.5D player DieRig (and a separate opponent-response actor only if the design needs one). Each approved flat face belongs to one stable cube surface, with opposite pairs fixed once. Simulation stores the authoritative result before animation begins. Renderer timing must never reroll, mutate the result, or create contradictory decorative faces. On handoff, reuse or deliberately reset actors; never leave duplicated or stale dice.

## Documentation debt

- `README.md` has contradictory authorization language.
- `PLAYTEST_REPORT.md` says metadata/evidence “Not run” while later prose claims live verification and human acceptance.
- `RELEASE_CHECKLIST.md` leaves required completed preconditions unchecked.
- No current visual-integration ledger exists for Dice Duel.
- No reset/replay contract exists although terminal states disable all controls.
- Existing H5 documents remain valid historical records and must not be rewritten as runtime approval.
- `LESSONS_LEARNED.md` is intentionally historical/backfilled; add visual-integration lessons only after the future pass.

## Approved runway

1. **H6.9 — Stage-first shell migration.** Remove the dashboard rails and establish the full tavern stage without integrating the finished DieRig.
2. **H6.10 — DieRig motion laboratory.** Promote the flat faces through bounded runtime evidence, build the persistent six-face rig, map target orientations, and prove full-speed and reduced-motion choreography with injected results.
3. **Human motion review.** Approve throw, weight, bounce count, timing, readability, settle, and exact-face confirmation before live combat integration.
4. **H6.11 — Live random-roll and SceneRig integration.** Replace the production fixed sequence with an injected runtime d6 source and connect authoritative results to the approved choreography.
5. **H6.12 — Tavern materials, selective UI, and typography.** Finish the table scene, action tokens, result presentation, causal-history surface, and shared Academy grammar.
6. **Lessons ledger and closure.** Resolve replay/reset, refresh evidence, correct stale documentation, and record visual-integration learning.

**First implementation task: H6.9 stage-first shell migration.** Asset mapping and cleanup are already complete; the current dashboard shell would otherwise constrain and distort every motion decision.
