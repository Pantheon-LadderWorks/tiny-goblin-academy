# Dice Duel Tavern Visual Integration Plan

**Execution status:** Completed through H6.12. Stage-first shell, persistent DieRig laboratory, production-random live integration, materials/UI/typography, human runtime review, and human visual review passed. The separate curriculum closure records the completed lesson; evidence-warehouse migration remains outside this plan.

Date: 2026-07-18
Status: human-approved implementation runway; H6.9 is the next bounded implementation lane.

## Goal

Transform Level 03 from a three-column prototype dashboard into a stage-first tavern duel whose primary Tier 1.5 lesson is motion choreography and readable causal action. Preserve the accepted turn/damage contract while correcting the placeholder fixed production roll source to a true d6 behind an injectable authority boundary.

## Preserved laws

- `simulation.ts` remains authoritative for HP, phase, roll, log, and outcome.
- Production play samples one authoritative random d6 result per accepted Roll input.
- Tests, evidence, and bounded state capture inject fixed or seeded roll results.
- Presentation receives an already-selected roll result; animation never chooses or changes it.
- Enemy response remains causally ordered after the player action, even when presentation makes that response visibly asynchronous.
- Card Goblin Duel retains the major particle/VFX curriculum lane.
- Existing H5 source, mapping, cleanup, review, and provenance records remain historical authority.
- No new player verb, combat phase, enemy, die, damage formula, equipment system, or expanded randomness table enters this pass.

## H6.9 — Stage-first shell migration

Create a bounded static/runtime-equivalent stage that removes the permanent left/right rails, duplicate page title, and constrained 520×280 arena. Move HP, turn ownership, roll status, actions, and compact causal history into the play scene. Put instructions in the Academy Help surface; expose diagnostics only through the Academy Dev surface. Preserve responsive operation at 1920×1080 and 1024×640.

Evidence gate: initial, narrow-desktop, Help, Dev, and Hub-launch captures; no gameplay or asset changes yet.

## H6.10 — Runtime asset promotion and DieRig motion laboratory

Do not remap or reclean the sheet. Select the minimum approved subset from the H5.32 cleaned derivative:

- flat faces 1–6 as the canonical surfaces of one persistent 2.5D DieRig;
- one dice cup/tray or tavern prop set if composition benefits;
- Attack, Heal, and Block emblems only where they improve action reading;
- at most tiny impact/support marks, not a particle showcase.

The angled, corner, rolling, and tumbling dice are not a coherent frame sequence and must not be swapped through as one actor. Retain them as source/reference material only. Create runtime-oriented mapping/selection metadata and evidence proving crop, alpha, scaling, anchor, and dark-background readability for the selected flat faces.

Build one controlled six-face 2.5D cube rather than a flat rotating card or physics-driven rigid body. Fix opposite pairs once, keep one actor identity, and use scripted X/Y/Z rotation, launch arc, two or three bounded impacts, a code-authored shadow/squash response, target-orientation settle, and a perfectly readable final face. Feed the laboratory injected authoritative results and prove:

1. anticipation;
2. commitment lock;
3. release;
4. travel/tumble;
5. bounded impacts;
6. settle;
7. exact face confirmation;
8. Attack/Heal/Block causality;
9. opponent response;
10. handoff;
11. victory/defeat result.

Include an explicit reduced-motion mode using the same state triggers and a shorter direct reveal. Provide repeatable controls for each result and phase. Do not let preview timing modify simulation.

## Human visual and motion approval

Review full-speed and reduced-motion recordings at both target viewports. Reject any sequence where the displayed face differs from the authoritative result, controls unlock early, the opponent response reads as simultaneous with the player action, or the causal log/HP change becomes ambiguous.

## H6.11 — Live random-roll and SceneRig integration

Introduce a controller/presentation coordinator between pure simulation transitions and visual completion. Recommended law:

`Roll intent → authoritative d6 result → simulation stores result → input locks → choreography queue → exact-face settle → next legal input`

Keep stable die identity, explicit presentation phase, cancellation-safe teardown, and one render/update path. The coordinator may delay when the next input becomes available, but must not delay or recalculate game truth.

Use an injected roll-source boundary: normal play supplies a real d6 source; tests, evidence, and bounded capture supply fixed or seeded results. The renderer receives only the committed value and has no roll-source access.

Add focused tests for:

- one simulation transition per accepted input;
- stable result throughout roll animation;
- no duplicate/stale dice after handoff;
- correct control lock/unlock;
- reduced-motion equivalence;
- terminal-state behavior.

## H6.12 — Tavern materials, selective typography, and shared UI grammar

Build the broad textured tavern tabletop, central roll tray, opposing player/Brawler authority zones, compact in-stage HP, restrained props, action-token treatment, and compact causal-history surface. Reuse approved pantry materials selectively rather than introducing a new texture-intake lane. Adopt Academy-local semantic type roles for title, outcome, body, labels, and numbers. Keep the combat history and dynamic values as code-native text. Use shared surface grammar selectively; do not clone Button Goblin or Potion Sorter physical layouts.

## Replay, evidence, lessons, and closure

Resolve the current terminal dead end with a bounded replay/reset decision. Refresh runtime evidence for all actions, multiple turns, win, loss, replay, Help, Dev, Hub launch, both viewports, and reduced motion. Correct stale README/playtest/checklist claims without erasing historical review. Add visual-integration lessons only after human approval.

## Validation matrix

Every implementation lane should run the smallest relevant tests plus, at closure:

- Dice Duel tests and production build;
- Hub TypeScript no-emit and production build;
- `cargo check`;
- Academy game and asset manifest validation;
- provenance validation;
- asset-pipeline smoke checks;
- changed JSON parsing;
- strict UTF-8/control-character/mojibake checks;
- `git diff --check`;
- listener/browser/capture/temp cleanup.

## Ordered recommendation

1. H6.9 stage-first shell migration.
2. H6.10 flat-face runtime promotion and persistent six-face 2.5D DieRig laboratory.
3. Full-speed and reduced-motion human approval.
4. H6.11 live random-roll and SceneRig integration.
5. H6.12 tavern materials, selective UI, and typography.
6. Replay/evidence/lessons closure.

There is no new H5 mapping/cleanup prerequisite. The first implementation task is the stage-first shell migration because the present three-column dashboard is the dominant blocker to truthful motion design.
