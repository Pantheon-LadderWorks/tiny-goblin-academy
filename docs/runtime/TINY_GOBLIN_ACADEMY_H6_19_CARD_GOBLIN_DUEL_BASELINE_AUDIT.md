# Tiny Goblin Academy H6.19 — Card Goblin Duel Baseline Audit

Date: 2026-07-21
Baseline: `5b6d51b596d6191e4601bc593ad488a4a1d9a41b` on `main`; worktree was clean before this audit and matched `origin/main` at 0 ahead / 0 behind.

## Identity and launch truth

- Canonical folder: `games/tier-1/04-card-goblin-duel`
- Package: `tga-04-card-goblin-duel`
- Roster identity: `tga-04`, level `4`, slug `card-goblin-duel`, title `Card Goblin Duel`
- Commands: `pnpm --filter tga-04-card-goblin-duel dev`; `test`; `build`
- Hub roster says source/dev/playable available and playable mode `dev`.
- Roster metadata incorrectly says `buildAvailable: false`; the package has a working production build.
- Browser title, folder, package, roster identity, and implemented lesson agree.
- The game is historically passed and playable; visual integration has not begun.

## Authoritative gameplay contract

The implemented runtime—not the stale planning status lines—is the current mechanical authority.

- One Card Goblin, one duel, one screen, six deterministic cards, hand size three.
- Player HP starts at 10; Card Goblin HP starts at 12.
- Initial hand: Strike, Guard, Mend. Initial queue: Spark, Stun, Heavy Bonk.
- Played cards move to the queue back; legal draws refill from the queue front.
- Card Goblin attacks for 2 after each completed player card unless Guard or Stun modifies the response.
- No random card effects, deck construction, mana economy, progression, rarity, equipment, accounts, or tactical-RPG systems exist.

## Card effects and phases

| Card | Implemented effect |
| --- | --- |
| Strike | Deal 2 damage. |
| Guard | Reduce the next enemy attack by 2, minimum 0. |
| Mend | Heal 2 HP, capped at 10. |
| Spark | Deal 1 damage, then enter an explicit replacement-choice phase. |
| Stun | Prevent the next enemy attack once. |
| Heavy Bonk | Deal 4 damage and skip that turn's refill. |

The simulation has three explicit phases:

1. `PlayerAction` accepts one hand-card input.
2. `SparkChoice` accepts one replacement choice and delays the enemy response until that choice resolves.
3. `Terminal` locks all later card input after victory or defeat.

The ledger records card effects, draws/replacements, flags, enemy response, and outcome. The DOM displays only its eight newest entries.

## Authority map

| Boundary | Current owner | Finding |
| --- | --- | --- |
| Simulation | `src/simulation.ts` | Owns hand, queue, HP, flags, phase, deterministic rules, terminal truth, and ledger. |
| Controller | click handlers in `src/main.ts` | Calls one simulation transition, then immediately rerenders. No presentation queue exists. |
| DOM | `index.html` plus `render()` | Owns cards, accessible buttons, HP/status text, phase prompt, next-card preview, and ledger. |
| Phaser | one static scene in `main.ts` | Decorative emoji avatar strip and a 50 ms player hop only; owns no game truth. |

## Presentation and input baseline

No timer, delayed opponent phase, event receipt, animation queue, cancellation path, reduced-motion path, or presentation lock exists. Simulation and UI replacement happen synchronously in the click handler.

During `SparkChoice`, the same remaining hand buttons become replacement-choice controls. Outside terminal state, card availability is governed by the simulation phase rather than a separate presentation state.

The UI clamps displayed HP to zero while the simulation and ledger may preserve overkill values. No reset/replay, Help, Dev/diagnostic, keyboard instruction, or explicit focus-restoration contract exists.

The current Phaser strip uses a wizard emoji, sword emoji, goblin emoji, and text labels. Real actor art, card surfaces, UI tokens, particles, and material assets are not wired.

## Fresh validation

H6.19 ran the current baseline without changing gameplay:

- Card Goblin simulation tests: 9/9 passed.
- Production TypeScript/Vite build: passed.
- Academy game manifest validation: passed for all ten games.
- Hub icon manifest validation: passed for all ten game identities.
- Existing build warning: the Phaser-containing production chunk is larger than 500 kB after minification.

No fresh browser/runtime capture was created in H6.19. Fresh supported-window and Hub-launch evidence belongs to the first stage migration, where the shell actually changes.

## Shell verdict

**Stage-first migration is required before card motion or VFX construction.**

The permanent 220 px status rail and 280 px ledger rail subordinate the central play area. The 600×260 Phaser strip is decorative rather than stage-authoritative, and the card hand sits below it as a separate dashboard widget. Particle origin/target relationships would be brittle and visually dishonest if designed against this shell.

The future shell should place the duel, card hand, HP, turn ownership, next-card information, and compact causal history within one coherent card-table stage. Instructions belong in Help; diagnostics belong in Dev.

## Card-frame asset readiness

| Layer | Status |
| --- | --- |
| Source concept sheet | Present, provenance-tracked, 1024×1024; source-only. |
| Region map | 32 reviewed surfaces with preserved source rectangles. |
| Cleaned derivative | Human-review passed for draft pipeline use; not runtime-approved. |
| Corrected functional slots | 116 surface-type-aware planning slots; no runtime/global coordinates approved. |
| Runtime selection | None. No crop, scale, anchor, mount, or responsive proof exists. |
| Runtime wiring | None. Current cards are code-native CSS rectangles. |

The corrected H5.39 evidence confirms that solid card faces, card backs, board slots, and transparent/open frames require different slot semantics. H5.40 accepts that doctrine for planning only.

Derived card-frame sheet:

`assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png`

- Size: 733,998 bytes
- SHA-256: `4164decf68fd86bf1cdd3680a5318aeb912edb66a25ca463dde9bd8e26a4d486`
- `runtimeEligibility: not-runtime-approved`
- `visualIntegrationApproval: none`

No new H5 mapping or cleanup lane is required. A bounded H6 runtime-selection and promotion gate is required.

## Minimum card-surface promotion candidates

These are bounded promotion candidates, not H6.19 approvals:

| Candidate | Derived rectangle | Intended proof |
| --- | --- | --- |
| Blank parchment card surface | `4,27,123,170` | Neutral player-card host with code-native title, art/icon, and body text. |
| Green banner front frame | `132,27,123,170` | Alternate framed card host; compare against the neutral surface rather than integrating both automatically. |
| Goblin pattern card back | `132,259,123,164` | One opponent/deck identity surface. |
| Green deck stack | `779,268,107,146` | Compact queue/deck presentation. |
| Glowing highlighted front | `641,19,126,184` | High-risk review candidate; code-authored highlight may be safer. |
| Gray disabled front | `769,27,123,170` | High-risk review candidate; code-authored disabled treatment may be safer. |

The first promotion gate should prefer one player-card face, one card back, and one deck/queue surface. It should not integrate every reviewed frame.

## UI-token and effect asset readiness

| Layer | Status |
| --- | --- |
| Source concept sheet | Present, 1024×1024; source-only. |
| Region map and corrections | 48 reviewed regions. |
| Cleaned derivative | Human-review passed for draft pipeline use. |
| Functional surfaces | 18 candidate flags remain metadata only; no slot approval. |
| Runtime selection | None. |
| Runtime wiring | None. |

Derived UI-token sheet:

`assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png`

- Size: 588,395 bytes
- SHA-256: `db06cb5f7403fe8eb412d205d112a6f74dabcfa0157d2d336ea96de9a7b1ba88`

The cleaned sheet preserves suitable candidates for six card identities and later effect recipes:

- Strike: sword icon at `2,2,120,124`.
- Guard: shield icon at `130,2,124,124`.
- Mend: heart-plus icon at `258,2,124,124`.
- Spark: projectile-star effect at `386,2,124,124` or sparkle effect at `514,642,124,124`.
- Stun: star-cluster effect at `642,2,124,124` or a separately reviewed restrained swirl.
- Heavy Bonk: club icon at `514,2,124,124`.

Effect-recipe candidates include explosion, shield burst, glowing heart, swirl, sparkle, smoke cloud, and gold sparkle burst across the `y=642` effect row. These are large effect stamps, not automatically particle sprites. H6 must compare them against true-alpha particle sources and code-authored primitives before choosing a recipe.

The H5.44/H5.45 review remains authoritative: the sheet is useful and visually clean, but no runtime UI, functional-slot, gameplay, text-rendering, or integration approval exists.

## Tier 1.5 lesson contract

Card Goblin Duel owns authored moment-to-moment VFX synchronized to deterministic card events:

- event origin and target relationships;
- particle recipe composition rather than uncontrolled image spam;
- lifetime, cleanup, blend treatment, and bounded density;
- causal timing across card commitment, effect, replacement/draw, enemy response, and outcome;
- full and reduced-motion equivalence;
- VFX that explains or celebrates state without becoming state.

The game does not need maximal effects on every event. Each of the six cards needs a distinct, readable presentation identity; only the events that benefit from particles should use them.

## Presentation architecture requirement

Keep cards, live text, focus, and accessible input in the DOM. Keep Phaser as the authored stage/VFX plane. Add a stage-anchor bridge that converts approved DOM card, player, enemy, deck, and ledger anchors into Phaser-local coordinates.

A future presentation coordinator may lock the next legal input until a bounded visual sequence finishes, but it may not choose a card, alter damage, reorder the queue, skip SparkChoice, or decide terminal state.

Recommended causal law:

`accepted DOM intent → authoritative simulation transition → structured event receipt → input gate → card/VFX choreography → exact state confirmation → next legal input`

For Spark:

`Spark accepted → 1 damage confirmed → Spark effect settles → replacement choice enabled → choice accepted → replacement/draw shown → enemy response shown → next legal input`

Simulation or a pure controller adapter should emit structured event receipts. Presentation should not parse ledger prose as its authority.

## Documentation debt

The game-owned documents disagree because they describe different historical moments without labeling them clearly:

- `AGENT_TASKS.md` and `PLAYABLE_LOOP_CONTRACT.md` still say planning/not approved.
- `README.md` says Human Review Passed / Level 4 Complete, then asks for pre-implementation approval.
- `HUMAN_REVIEW.md` says planned.
- `PLAYTEST_REPORT.md` records the corrected First Playable but concludes that Human Review is pending.
- `RELEASE_CHECKLIST.md` marks screenshots complete even though the original local screenshot links were removed during public cleanup.

H6.19 does not erase or rewrite those historical records. This audit is the current rebaseline authority. Closure must correct stale status language while preserving historical review context.

## Focused test debt

The nine existing tests prove the six card effects, Spark's two-step sequence, and terminal locks. The visual-integration lane should add focused protection for:

- invalid hand and Spark-choice indices;
- Spark killing the enemy before a replacement choice;
- no input during a presentation lock;
- one simulation transition per accepted input;
- stable structured event order;
- full/reduced-motion state equivalence;
- cancellation-safe teardown without duplicate cards or effects;
- replay/reset only if separately approved.

## Recommended implementation runway

1. **H6.20 — Stage-first card-table shell and anchor contract.** Remove the dashboard rails, build the coherent duel stage, preserve DOM card/input authority, define stable stage anchors, and capture both supported desktop windows. No runtime asset or particle integration.
2. **H6.21 — Runtime card-surface promotion and CardRig motion laboratory.** Select the minimum card face/back/deck subset, prove crop/alpha/scale/slots, and author deterministic draw, hover, commit, replacement, discard, and enemy-reaction motion with full/reduced modes.
3. **H6.22 — ParticleRecipe laboratory and human review.** Compare reviewed H5 effect stamps, true-alpha particle sources, and code-authored primitives. Prove bounded recipes against injected card-event fixtures without live gameplay wiring.
4. **H6.23 — Live structured-event and VFX integration.** Add the presentation coordinator, input gates, stage-anchor bridge, exact event ordering, cancellation-safe teardown, and full/reduced-motion equivalence.
5. **H6.24 — Materials, semantic typography, selective UI tokens, terminal/replay decision, runtime evidence, and visual lessons closure.**

The particle-effects reference supplied during H6.19 belongs to H6.22 recipe review, not the shell lane.

## First implementation task

H6.20 is the next bounded task.

It must:

- preserve every current card rule and simulation output;
- move HP, turn state, hand, next card, and compact ledger into one stage-first composition;
- keep live text and card buttons code-owned and keyboard/focus capable;
- define player, enemy, hand-card, deck, and impact anchors in one responsive coordinate system;
- expose instructions through Academy Help and diagnostics through Academy Dev;
- work at 1920×1080 and 1024×640;
- capture direct and Hub-launch evidence;
- integrate no cleaned card sheet, UI-token sheet, particle pack, or authored effect yet.

There is no new H5 prerequisite. The blocker is no longer missing or unreadable art; it is the current shell and missing presentation/event boundary.

Final doctrine:

```text
Simulation commits the card truth. DOM preserves readable input. CardRig presents identity. ParticleRecipe explains the event. Phaser never invents the outcome.
```
