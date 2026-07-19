# Tiny Goblin Academy H6.11 — Dice Duel Live DieRig and Authoritative Random d6 Integration

Date: 2026-07-19
Baseline: `778b13f824407980c4ec8423d7ac6330f29d63e8` (`feat: add dice duel persistent dierig motion laboratory`)
Status: human runtime review passed; runtime approved; ready to commit

## Boundary

H6.11 integrates the approved H6.10 persistent DieRig into the H6.9 Crooked Six tavern without beginning the final materials, action-token, particle, typography, or curriculum-closure passes.

```text
liveDieRigIntegrated: true
productionScaleApplied: true
productionRandomD6Integrated: true
unbiasedCryptoSamplingIntegrated: true
deterministicTestInjectionPreserved: true
fixedV01SequenceRemovedFromProduction: true
rollingPhaseIntegrated: true
inputLockIntegrated: true
persistentActorContinuityPreserved: true
fullMotionIntegrated: true
reducedMotionIntegrated: true
actionRulesChanged: false
HPAndOutcomeRulesChanged: false
replayIntegrated: false
particlesIntegrated: false
finalTavernMaterialPassComplete: false
finalTypographyUIPassComplete: false
productionIntegrated: true
liveDieRigApproved: true
authoritativeRandomD6Approved: true
unbiasedCryptoSamplingApproved: true
persistentActorContinuityApproved: true
productionScaleApproved: true
rollingPhaseApproved: true
inputLockApproved: true
returnToReadyApproved: true
terminalSettledDieApproved: true
packagedHubDeveloperModeAuditPassed: true
automatedWindowsControlAuditPassed: false
automatedWindowsControlAuditRequiredForClosure: false
productionDistributionModeTested: false
productionDistributionModeRequiredForH611: false
humanRuntimeReviewPassed: true
runtimeApproved: true
```

The roll source changed from the v0.1 placeholder sequence to a real d6. Gameplay did not remain byte-identical: the simulation now has an explicit `rolling` phase and production uses injected Web Crypto results. The action mathematics and outcome rules remain unchanged.

## Roll-source Architecture

`src/roll-source.ts` owns the narrow `D6RollSource` boundary.

- Production uses `crypto.getRandomValues` over `Uint32Array(1)`.
- The acceptance range ends at `4,294,967,292`, the largest multiple of six below `2^32`.
- Values in the four-value tail are rejected before modulo conversion, avoiding modulo bias.
- `Math.random` is absent.
- Random generation is absent from simulation, controller, DieRig, and motion code.
- The historical `[4, 3, 6, 2, 5]` sequence survives only as an explicit deterministic fixture.
- Query-based deterministic evidence sequences are honored only when Vite reports development mode. Production builds always select Web Crypto.

The controller samples exactly once, calls `beginRoll` with that face, and only then asks presentation to move. The animation reveals the stored result; it cannot select or change it.

## Simulation and Controller Authority

The pure phase sequence is now:

```text
roll → rolling → action → roll | won | lost
```

`beginRoll` is legal only from `roll`, accepts an already-generated face, stores it, and enters `rolling` without adding a visible result log. `completeRoll` is legal only from `rolling`, preserves the face, enters `action`, and records one `You rolled N.` entry. Duplicate completion returns the existing state unchanged.

`LiveDuelController` owns request identity and input gating, not HP or action mathematics. It rejects Roll during rolling and return-to-ready, rejects actions before settle, accepts only the matching actor/request/face completion, ignores stale or duplicate completions, and routes Attack, Heal, and Block through the pure simulation.

If presentation cannot accept a committed request, the adapter attempts a bounded reduced direct-settle using the same face. It never rerolls. Fallback count appears only in development diagnostics and never creates a combat-history event.

## Persistent Actor and Live Presentation

Exactly one approved H6.10 `DieRig` is constructed by `LiveDieRigPresentation`.

Stable actor ID:

`dierig-h6-10-actor-001`

The adapter groups that actor's existing mesh, backing, contact shadow, confirmation ring, and diagnostic geometry into one responsive Phaser presentation container. No second die, final-face sprite, angled rolling sprite, opponent die, particle emitter, physics engine, external 3D engine, shader, or new dependency exists.

The die begins beside the player wager/cup station. During a full roll, the live adapter blends that ready-dock offset into the approved 1330 ms H6.10 choreography. After a nonterminal action the same actor returns in 230 ms with no bounce or ceremony; Roll remains disabled until return completes. Victory and defeat leave the same actor settled on the final face.

Destruction disconnects the resize observer, stops entry/return tweens, clears the H6.10 authority listener path, and destroys the grouped Phaser presentation.

## Production Scale and Motion

Scale is recomputed from live DOM tray geometry rather than a viewport-specific pixel constant.

| Contract | Tray inner width | Projected settled width | Settled ratio |
| --- | ---: | ---: | ---: |
| 1920×1080 | 690.726 px | 169.228 px | 24.5% |
| 1024×640 | 455.179 px | 111.519 px | 24.5% |

The responsive target is inside the approved 22–27% range at both contracts. Full launch presentation peaks at approximately 107% of the settled scale and returns to settled scale before the first impact. The H6.10 laboratory remains at its approved inspection scale.

Full motion remains approximately 1330 ms with two major impacts. Reduced motion remains approximately 380 ms with no major impacts or rebound. Runtime selection follows `prefers-reduced-motion`; development evidence can explicitly select full or reduced motion without creating player-facing settings.

## Protected Gameplay Rules

Fresh tests and deterministic browser runs confirm:

- player and Goblin Brawler still start at 10/10 HP;
- Attack deals the stored face value;
- Heal restores the stored face value, capped at 10, before the enemy response;
- Block reduces the immediate three-damage response by the stored face value;
- enemy base damage remains 3;
- one roll remains available per player turn;
- victory and defeat thresholds are unchanged;
- recent exchange and complete history remain available;
- one truthful roll entry is recorded per settled turn;
- replay/reset, extra dice, actions, enemies, items, crits, and equipment remain absent.

## Evidence

Evidence shelf:

`games/tier-1/03-dice-duel-tavern/evidence/h6-11-live-dierig-random-d6-integration/`

The packet contains:

- initial and measured responsive evidence at 1920×1080 and 1024×640;
- exact frozen anticipation, release, first-impact, and rebound states;
- full settles on faces 1, 4, and 6;
- reduced settle on face 4;
- post-settle action unlock and return-to-ready evidence;
- recent exchange and complete-history evidence;
- deterministic victory and defeat with the final actor settled;
- development authority diagnostics;
- live full, repeated-turn, reduced, concurrent-input, and victory WebM recordings;
- machine-readable random-source, protected-hash, scale, phase, lock, history, identity, and terminal-state records;
- a passed browser capture report with no console or page errors.

Agent visual inspection passed for player-side readiness, continuous tray entry, fake volume, both impacts, final grounding, action unlocking, same-actor return, responsive composition, terminal retention, and absence of duplicate actors.

Human runtime review passed through the freshly packaged Academy `app.exe` in its intended repository/developer mode. The packaged Hub found the source workspace, hydrated Dice Duel through its managed local game server, and proved the complete route from Academy boot through repeated rolls and actions to a 1 HP victory and return path. The same live die repeatedly left the ready station, rolled, settled, unlocked actions only after settle, and remained settled on the terminal face.

This is not a production-distribution-mode test and does not expose a packaging defect. Repository/developer mode intentionally launches source-available games through managed local servers so contributors can build and run the open-source Academy from the packaged Hub. Source-absent production distribution uses the separate catalog/Butler route and is outside H6.11. No game executable embedding, launcher redesign, or Tauri rebuild is required by this review.

## Validation

Fresh validation on 2026-07-19:

- focused authority, simulation, controller, integration, responsive-scale, and protected-laboratory tests: passed;
- complete Dice Duel suite: 50/50 passed across 8 files;
- Dice Duel TypeScript no-emit and production build: passed; live game and laboratory entries emitted;
- direct-game Playwright audit at 1920×1080 and 1024×640: passed with zero console/page errors;
- final development evidence capture: passed with exact-phase freezes and zero console/page errors;
- built production-preview audit: passed; development sequence/motion overrides were ignored, `production-crypto` remained active, and one real result settled inside 1–6;
- Hub TypeScript no-emit: passed;
- Hub production build: passed;
- `cargo check` from `hub/src-tauri`: passed using `D:/DevCache/Rust/targets/tiny-goblin-academy`;
- Academy manifest validation: passed for 10 games;
- Academy asset-manifest validation: passed;
- Academy animation-manifest validation: passed;
- shared-region validation: passed;
- asset-pipeline provenance validation: passed in `legacy-ok` mode with known historical warnings;
- asset-pipeline smoke validation: passed;
- 22 evidence JSON records parsed;
- 18 PNG and 5 WebM files passed integrity checks;
- source concept, cleaned derivative, and every protected H6.10 laboratory hash passed;
- package and lockfile drift: absent;
- UTF-8, control-character, mojibake, trailing-whitespace, and `git diff --check`: passed;
- local Vite/preview listeners, browser capture work, capture temp, and agent-created temporary screenshots: cleaned.

Automated Windows control did not initialize (`failed to write kernel assets: The system cannot find the path specified`), so that automation result remains explicitly false. It is not required for closure because Kryssie's human packaged-Hub runtime audit directly exercised the intended repository/developer route and passed. Production distribution mode was not tested and is not required for H6.11.

The nonfatal Dice Duel chunk-size warning, Hub mixed static/dynamic Tauri import warning, and permitted legacy-provenance warnings remain unchanged classes of known validation output.

## Stop State

H6.11 is human-approved and ready for exact-path staging and commit. H6.12 has not begun.
