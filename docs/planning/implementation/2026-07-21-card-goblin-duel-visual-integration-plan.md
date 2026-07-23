# Card Goblin Duel Visual Integration Plan

**Execution status:** H6.20E and H6.21A are complete. H6.21A promoted the approved multi-face card-surface system with finalized external evidence. Optical typography and CardRig motion remain open for the separately authorized H6.21B laboratory.

Date: 2026-07-21
Status: human-approved sequencing authority updated through H6.21A. H6.21B is authorized as a bounded laboratory; H6.22–H6.24 remain separately gated and are not blanket implementation authorization.

## Goal

Transform Level 04 from a three-column prototype dashboard into a stage-first card-table duel whose headline Tier 1.5 lesson is authored particle/VFX construction synchronized to deterministic card events.

Preserve the accepted six-card loop, explicit Spark replacement choice, enemy response, causal ledger, and terminal lock. Keep card controls and live text accessible and code-owned while Phaser becomes the stage/VFX plane rather than a decorative emoji strip.

## Preserved laws

- `simulation.ts` remains authoritative for phase, hand, queue, HP, Guard, Stun, Skip Draw, ledger, and outcome.
- The card pool remains exactly Strike, Guard, Mend, Spark, Stun, and Heavy Bonk.
- No random card effect, deckbuilding, mana, progression, rarity, equipment, persistence, account, or tactical-RPG system enters this pass.
- One accepted input causes one authoritative simulation transition.
- Presentation may delay the next legal input; it may not choose, recalculate, reorder, or suppress game truth.
- Spark retains its explicit player replacement choice before the enemy response.
- Victory/defeat remains simulation-owned and terminal.
- Live title, effect text, values, ledger, focus, and accessible card controls remain code-owned.
- Existing H5 source, mapping, cleanup, review, and provenance remain historical authority.
- Pantry acceptance does not imply runtime approval.

## H6.20 — Stage-first card-table shell and anchor contract

Replace the permanent status and ledger rails with one coherent duel stage. Move player/enemy HP, turn ownership, hand, next-card information, and a compact causal history into the play composition. Put instructions in Academy Help and diagnostics in Academy Dev.

Keep DOM buttons as the hand's input and focus authority. Place them within a stage layer that can expose stable card rectangles to Phaser without turning particles into input authority.

Define responsive anchors for:

- player authority and player impact point;
- Card Goblin authority and enemy impact point;
- each live hand-card button;
- played-card commitment point;
- deck/queue and replacement point;
- terminal/outcome emphasis point.

The anchor bridge converts DOM viewport rectangles into Phaser-local stage coordinates after layout and resize. It owns geometry only, never game state.

Evidence gate:

- direct initial state at 1920×1080 and 1024×640;
- SparkChoice shell state at both viewports;
- terminal state;
- Academy Help and Dev surfaces;
- Hub launch;
- keyboard focus order and visible focus;
- no gameplay, card-asset, particle, or recipe changes.

## H6.21 — Card surfaces and CardRig laboratory

H6.21 is split into two bounded authorities.

### H6.21A — Completed card-surface authority

H6.21A supersedes the initial one-universal-face direction. Direct comparison selected five governed frame faces across the six actions and Strategy B mapped tokens as the production direction:

- Strike: blank parchment with sword;
- Guard: teal banner with shield;
- Mend: green banner with heart-plus;
- Spark: teal-edged tan with projectile star;
- Stun: teal banner with star cluster;
- Heavy Bonk: tan banner with club.

Two internal slot templates are authoritative: one banner template and one blank-parchment template. Runtime title, complete effect text, state badges, accessible names, and focus remain code-owned. The development laboratory does not register production gameplay anchors; ordinary runtime retains the exact three-anchor hand contract.

All eight H6.21A evidence fixtures completed under the finalized replacement-3 run. Card text is technically contained without clipping, document overflow, or accessibility failure. Kryssie approved the card-face system, mapped tokens, responsive containment, focus, SparkChoice, and terminal treatments.

Optical typography is not complete: banner title baselines and body blocks still require visual centering against the painted artwork. H6.21A did not implement CardRig motion.

### H6.21B — Authorized optical typography and CardRig laboratory

First correct optical title and body alignment without changing the approved faces, tokens, outer card geometry, dock, tabletop, or simulation. Then build CardRig as a stable semantic DOM card identity with one typed, cancellation-safe presentation authority and an injectable animation clock.

Prove deterministic fixtures for deal/settle, restrained hover and keyboard focus, commitment and exit, normal refill, Heavy Bonk vacancy, Spark replacement order, enemy-reaction handoff, terminal lock, reset/resize/fixture cancellation, and full/reduced-motion final-state equivalence.

The H6.21B laboratory consumes injected committed presentation events. It does not wire motion into live gameplay; live structured-event integration remains H6.23.

## H6.22 — ParticleRecipe laboratory and human review

Use a dedicated Phaser VFX plane with pooled emitters/objects and explicit cleanup. Test recipes against synthetic structured event fixtures and the approved stage anchors.

Compare three ingredient classes rather than assuming every H5 effect icon is a particle:

- reviewed H5 UI-token effect stamps;
- provenance-clean true-alpha particle artwork, including the governed Kenney particle pantry;
- code-authored circles, lines, arcs, trails, flashes, and masks.

Target recipe identities:

| Event | Required reading | Candidate treatment |
| --- | --- | --- |
| Strike | Fast player-to-enemy damage | restrained slash/trail plus compact impact |
| Guard | Next attack prevented/reduced | shield flare at player, then absorption response |
| Mend | Player HP restored | upward heart/light motes with no enemy targeting |
| Spark | 1 damage, then choice required | bright travel spark, enemy hit, then hand-choice emphasis |
| Stun | Next enemy attack skipped | bounded stars/ring around enemy authority point |
| Heavy Bonk | Large damage and missing refill | weighty impact, brief dust/smoke, visible hand vacancy |
| Enemy attack | Opponent response after player resolution | short enemy-to-player travel/impact distinct from player effects |
| Terminal | Outcome confirmation | restrained victory or defeat treatment after truth is committed |

Each recipe declares trigger event, origin, target, duration, density, blend mode, cleanup deadline, cancellation behavior, and reduced-motion substitute.

Reject recipes that obscure cards, ledger, HP, Spark choices, or focus indicators; imply damage before the simulation commits it; continue after cancellation; leak emitters; or make all six cards feel identical.

Human review compares full-speed and reduced-motion recordings at both supported viewports. The particle-effects reference supplied during H6.19 is review input here.

## H6.23 — Live structured-event, CardRig, and VFX integration

Introduce a controller/presentation coordinator between accepted DOM intent and the next legal input.

Recommended law:

`intent → simulation transition and structured receipt → input lock → ordered presentation → exact state confirmation → next legal input`

Use explicit structured events such as:

- `card-committed`;
- `damage-applied`, `heal-applied`, `guard-armed`, `stun-armed`, or `skip-draw-applied`;
- `spark-choice-requested` and `card-replaced`;
- `hand-refilled` or `draw-skipped`;
- `enemy-attack-resolved` or `enemy-attack-skipped`;
- `terminal-reached`.

The exact schema belongs to the pure controller/simulation boundary. The VFX layer receives committed events and stage anchors only. It must never parse ledger prose to infer authority.

Input rules:

- reject repeated card clicks while a committed sequence is presenting;
- enable Spark replacement choices only after the Spark damage presentation reaches its choice handoff;
- keep terminal controls locked;
- restore focus to the next legal card or approved replay control after presentation;
- cancel old CardRig/VFX work before reset, resize reconstruction, or teardown;
- use identical state transitions in full and reduced motion.

Add focused tests for one transition per accepted input, event order, invalid indices, Spark terminal kill, early-click rejection, Spark choice gating, reduced-motion equivalence, terminal behavior, and cancellation without stale effects.

## H6.24 — Materials, typography, selective UI tokens, and closure

Reuse approved Academy-local type roles and restrained material recipes. Keep dynamic card text, HP, ledger, and state labels native. Use physical surfaces only where they improve the stage rather than recreating permanent side panels.

Promote only the six action identities and effect/support pieces that survive H6.21/H6.22 review. Do not dump the 48-token sheet into runtime UI. Text-bearing `Active Turn` art remains unsuitable for dynamic turn authority unless a separate decision proves otherwise.

Resolve the terminal dead end through one bounded replay/reset decision. Replay may reset the existing deterministic duel only; it does not add campaign, rewards, progression, deck selection, or persistence.

Refresh runtime evidence for:

- initial hand and queue;
- each of the six cards;
- Guard and Stun enemy responses;
- Heavy Bonk skipped refill;
- complete Spark choice sequence;
- multiple turns;
- victory, defeat, and approved replay behavior;
- full and reduced motion;
- Help, Dev, keyboard focus, resize, direct launch, and Hub launch;
- process/listener/browser cleanup.

Correct stale README, contract, human-review, playtest, release-checklist, and roster build-availability language without deleting the historical failure/correction record. Write `LESSONS_LEARNED_VISUAL_INTEGRATION.md` only after human runtime and visual approval.

## Validation matrix

Every lane runs its smallest focused tests. Closure additionally runs:

- Card Goblin tests and production build;
- Hub TypeScript no-emit and production build;
- `cargo check` for Hub launch integration;
- Academy game and hub-icon manifest validation;
- changed asset-manifest and JSON parsing;
- provenance and asset-pipeline validation for newly promoted runtime derivatives;
- strict UTF-8, control-character, and mojibake checks;
- `git diff --check`;
- supported-window evidence review;
- listener, browser, capture, temporary-file, and process cleanup.

## Ordered recommendation

1. H6.20 stage-first shell and anchor contract.
2. H6.21 minimal card-surface promotion and CardRig laboratory.
3. H6.22 ParticleRecipe laboratory and human review.
4. H6.23 live structured-event, CardRig, and VFX integration.
5. H6.24 materials, typography, selective tokens, evidence, documentation, and lessons closure.

There is no new H5 mapping/cleanup prerequisite. The first implementation task is the stage-first shell because particles need truthful, stable origin and target geometry before recipe construction begins.
