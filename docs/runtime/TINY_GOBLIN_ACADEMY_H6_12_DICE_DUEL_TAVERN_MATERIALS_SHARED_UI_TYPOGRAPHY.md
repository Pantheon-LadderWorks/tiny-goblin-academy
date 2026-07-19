# Tiny Goblin Academy H6.12 — Dice Duel Tavern Materials, Selective UI, and Academy Typography

## Status

- Baseline: `022afcecf64e11d80491c45a0ef566f13cec51e7`
- Implementation status: complete and validated
- Human visual review: passed
- Runtime approval: approved
- Closure commit: this document is included in the H6.12A closure commit; verify the exact hash through Git history
- Curriculum closure: not started

## Required closure fields

- `academyTypographyIntegrated: true`
- `sharedGameTitleIntegrated: true`
- `sharedResultHeadingIntegrated: true`
- `materialTreatmentIntegrated: true`
- `selectiveDiceDuelAssetsPromoted: true`
- `actionTokenIntegrationStatus: "attack, heal, and block mapped tokens integrated as decorative SVG crops inside text-labeled DOM buttons"`
- `tavernPropIntegrationStatus: "dice cup, tavern mug, coin stacks, and candle integrated as restrained decorative mapped regions"`
- `rejectedRegionList:` see [Asset decisions](#asset-decisions)
- `finalTavernMaterialPassComplete: true`
- `finalTypographyUIPassComplete: true`
- `dieRigChanged: false`
- `randomAuthorityChanged: false`
- `actionRulesChanged: false`
- `HPAndOutcomeRulesChanged: false`
- `replayIntegrated: false`
- `particlesIntegrated: false`
- `shadersIntegrated: false`
- `audioIntegrated: false`
- `productionIntegrated: true`
- `humanVisualReviewPassed: true`
- `runtimeApproved: true`
- `academyTypographyApproved: true`
- `sharedGameTitleApproved: true`
- `sharedResultHeadingApproved: true`
- `materialTreatmentApproved: true`
- `actionTokenTreatmentApproved: true`
- `tavernPropTreatmentApproved: true`
- `historyTreatmentApproved: true`
- `victoryTreatmentApproved: true`
- `defeatTreatmentApproved: true`
- `finalSettledDieVisibilityApproved: true`
- `responsive1920Approved: true`
- `responsive1024Approved: true`
- `curriculumClosureComplete: false`

`productionIntegrated` means the H6.12 presentation is present in the game production build. It does not claim a rebuilt Tauri Hub or a standalone Dice Duel executable.

## Typography roles

Dice Duel imports the existing Academy-local typography runtime and waits for the local font contract before Phaser boot.

| Role | Dice Duel use |
| --- | --- |
| `compact-label` | Academy eyebrow, player/opponent labels, tray microcopy, button labels |
| `game-title` | `Dice Duel Tavern` with the shared bold Cinzel face and crisp plum dimensional shadow |
| `body-instruction` | subtitle and secondary result copy |
| `panel-heading` | turn-state banner and recent-exchange heading |
| `data-value` | player and opponent HP values |
| `dialogue-title` | combat-history drawer title |
| `dialogue-speech` | latest exchange and complete combat record |
| `result-state` | `TAVERN VICTORY!` and `DUEL DEFEAT` |
| `debug-information` | development diagnostics only |

Gameplay-facing semantic text no longer depends on Dice Duel-local Georgia declarations.

## Material decisions

Only existing provenance-clean Academy pantry assets are referenced. Source pixels were not changed.

| Use | Existing source |
| --- | --- |
| Tavern wall structure | `assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png` |
| Hero table | `assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/wooden.png` |
| Tray and UI hardware | `assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png` |
| Restrained focal brass | `assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg` |

The table receives the strongest readable grain. Structural timber is quieter, metal is restricted to dark hardware surfaces, and realistic brass appears only in small fasteners and accents. The approved tray geometry remains the darkest field so the cream Mesh2D die retains focus and contrast.

## Asset decisions

The live DOM maps exact regions from the existing cleaned 1024×1024 Dice Duel sheet. No crop or derivative PNG was created.

Promoted:

- `dice-duel-tavern.duel-token.sword-token-red`
- `dice-duel-tavern.duel-token.heal-token-green`
- `dice-duel-tavern.duel-token.shield-token-teal-gold`
- `dice-duel-tavern.tavern-prop.dice-cup-a`
- `dice-duel-tavern.tavern-prop.tavern-mug`
- `dice-duel-tavern.reward-token.coin-stacks`
- `dice-duel-tavern.tavern-prop.candle-lit`

Explicitly rejected from runtime:

- `dice-duel-tavern.dice-token.glowing-die`
- `dice-duel-tavern.dice-token.paired-dice`
- `dice-duel-tavern.roll-effect.rolling-die-left`
- `dice-duel-tavern.roll-effect.tumbling-die-shadow`
- `dice-duel-tavern.roll-effect.tilted-die-glow`
- `dice-duel-tavern.roll-effect.rolling-die-small`
- `dice-duel-tavern.dice-token.dice-cluster`
- all mapped sparkle, dust-puff, spiral, burst, and smoke-wisp frames

These are rejected because the persistent live Mesh2D remains the only die actor and H6.12 does not introduce baked effects or particles.

Additional prop decisions:

- Hanging sign: rejected because the live Crooked Six sign is larger and readable.
- Wood table corner: rejected because it competes with the approved perspective table geometry.
- Food plate: rejected as clutter beside the protected die path.
- Coin pouch: rejected because the mapped coin stacks communicate the wager more clearly.

## UI and accessibility

- Attack, Heal, and Block remain ordinary labeled DOM buttons; mapped tokens are decorative and have no independent input authority or accessible name.
- Roll remains text-led, avoiding a decorative second die.
- Disabled controls combine semantic `disabled` state, color, contrast, border, and icon treatment rather than opacity alone.
- Keyboard focus uses a visible light outline with offset.
- Latest causal exchange remains visible while the full combat history stays in a contextual drawer.
- History focus moves to Close on open and back to History on close; existing Escape behavior is preserved.
- Victory and defeat use a bounded material-backed tavern notice above the tray. HP plaques and the final settled die remain visible, and no replay/reset control is added.
- Both 1920×1080 and 1024×640 evidence report no horizontal overflow, no history/action collision, and a fully visible tray and die.

## Protected runtime proof

- H6.10 laboratory and H6.11 runtime authority files match baseline byte hashes.
- Web Crypto remains the production roll source; the production preview ignores deterministic and reduced-motion query overrides.
- Full and reduced DieRig motion, two-impact timing, 24.5% settled scale, persistent actor return, terminal settle, rolling-phase input gating, Attack/Heal/Block behavior, enemy damage, HP caps, victory, and defeat are covered by the unchanged protected suite.
- Button Goblin, Potion Sorter, Hub/Tauri source, package manifests, and lockfiles are outside the changed path set.

## Fresh validation

- H6.12 focused tests: 8/8 passed.
- Protected Dice Duel tests: 44/44 passed.
- Full Dice Duel suite: 58/58 passed across 9 files.
- Dice Duel production build: passed, including `index.html` and `dierig-lab.html`; existing large-chunk advisory only.
- Direct-game browser/evidence audit: passed with zero console errors.
- Production-preview crypto-authority audit: passed.
- Hub TypeScript no-emit: passed.
- Hub production web build: passed; existing Tauri dynamic/static-import advisory only.
- `cargo check` from `hub/src-tauri`: passed using the configured `D:/DevCache/Rust/targets/tiny-goblin-academy` target directory.
- Academy, asset, animation, shared-region, hub-icon, hub-icon-region, provenance, and pipeline-smoke validators: passed. Provenance reported only its established legacy-manifest warnings.
- PNG integrity: 23/23 passed.
- WebM integrity: 4/4 passed.
- Source, cleaned-sheet, material, H6.10, and H6.11 hashes: recorded and passed.

## Evidence

The review packet is at:

`games/tier-1/03-dice-duel-tavern/evidence/h6-12-tavern-materials-shared-ui-typography/`

It contains all 23 required stills, four recordings, responsive/runtime telemetry, before/after comparisons, production-preview authority results, protected/source hashes, and capture status. Every still and recording was inspected before this report was written.

## Stop boundary

H6.12 passed human visual review and is runtime-approved. Dice Duel lessons/metadata closure has not begun, and evidence-storage migration remains a separate later lane.
