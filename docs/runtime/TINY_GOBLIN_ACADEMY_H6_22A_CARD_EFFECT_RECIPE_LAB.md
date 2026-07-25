# Tiny Goblin Academy H6.22A — CardEffectRecipe Laboratory

**Status:** Technical architecture retained; detached visual packet rejected by Human Review and superseded by H6.22R1 composition work.

**Committed baseline:** `12428d232713807773774b7cc75d6885f3170035`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Reusable layered 2D card-effect capability and visual-language laboratory.

```yaml
h6_22AImplementationComplete: true
h6_22ATechnicalValidationPassed: true
h6_22AHumanVisualReviewPassed: false
h6_22ALiveGameplayIntegrated: false
h6_23Started: false
```

## Boundary

H6.22A is a development-only presentation laboratory. Fixtures inject visual events through `?cardFx=<fixture>&motion=full|reduced`; they do not call simulation actions, publish Hub Ledger transitions, alter HP, change card queues, invoke SparkChoice, or modify CardRig route semantics.

The lane does not change card faces, icons, typography, dimensions, tabletop artwork, packages, lockfiles, audio, or image assets. Runtime textures are generated in memory from Phaser geometry.

## R1 reconciliation

Human Review rejected the detached center-stage effect demonstrations as proof of card recipes. The typed registry, deterministic grouped runner, cancellation and supersession behavior, resource accounting, and zero-residue cleanup remain valid foundations. Attachment vocabulary and Phaser target resolution are adapted by H6.22R1 so effects declare explicit CardRig, pile, target, travel, or tabletop ownership. The provisional visual recipes remain unapproved; they are not live gameplay authority and are not final VFX art direction.

## Architecture

Three authorities keep the system reusable without creating a second gameplay engine:

1. `card-effect-recipes.ts` is the typed registry for recipe identity, full/reduced plans, layer ownership, group ordering, durations, targets, blend modes, semantics, stable end state, and fixture mapping.
2. `card-effect-runner.ts` is the deterministic executor. It uses an injectable clock, executes layer groups sequentially and group members concurrently, owns cancellation and supersession, and guarantees one cleanup path.
3. `card-effect-phaser.ts` is the disposable Phaser port. It adapts recipes into generated sprites, particle emitters, tweens, geometry masks, built-in glow filters, camera responses, and a bounded RenderTexture sample.

The port records live counts for emitters, temporary objects, masks, FX controllers, and abort listeners. A run is not technically complete unless every count returns to zero.

## Primitive capability inventory

The required sampler proves:

- card rim glow;
- animated shine sweep;
- traveling token or projectile;
- additive trail emitter;
- compact impact burst;
- expanding ring or shockwave;
- orbiting or looping motes;
- masked card-local particles;
- shield pulse;
- healing rise and motes;
- weighty downward impact;
- dust response.

Additional reusable layers include surface preparation, target pulse, restrained stage response, and a RenderTexture feasibility stamp. A custom-shader seam is declared as future-optional; no dissolve shader was implemented or required.

## Six card recipes

- **Strike:** warm rim and fast shine, sword/slash travel, narrow additive trail, and a compact sharp impact. The timing is direct and fast.
- **Guard:** teal surface preparation and shield formation, protective ring, restrained perimeter motes, and a subtle guarded-state pulse. It reads as protection rather than explosion.
- **Mend:** green card emphasis, soft shine, upward restorative motes, masked card-local particles, and a soft expanding ring. The particle count is deliberately restrained.
- **Spark:** gold shine and rim, projectile-star travel, additive trail, compact starburst, and a brief impact ring. The fixture proves visual language only and does not enter live SparkChoice.
- **Stun:** teal/gold card shine, controlled star-cluster orbit, suspended target pulse, and a compact lock ring. It communicates control without cartoon-bird language.
- **Heavy Bonk:** slow card charge, deliberate downward strike, broad dust response, low shockwave, and restrained camera shake. Its pacing is heavier than Strike and structurally different from Spark.

Additional capability samples cover enemy attack impact, victory accent, and defeat accent. They remain presentation fixtures and do not mutate simulation state.

## Full and reduced motion

Every registered recipe consumes the same fixture authority in both modes and resolves to the same zero-resource stable state.

Full motion may use travel, orbit, additive trails, particle bursts, rings, masked local effects, and restrained camera response. Reduced motion substitutes short rim emphasis, opacity/scale pulses, compact non-traveling impacts, minimal displacement, and no prolonged orbit or shake.

The reduced-comparison fixture executes full and reduced Spark plans sequentially and records both runs independently.

## Cancellation and cleanup

The runner cancels on reset, resize, fixture replacement, and explicit fixture cancellation. Superseded runs are cleaned before the replacement recipe begins. Abort listeners are removed on both completion and cancellation.

Browser execution found and corrected one real bookkeeping defect: orbit-container destruction also destroyed child stars, but the tracker initially retained those inactive children. The final port removes tracked objects even when Phaser has already destroyed them through a parent.

Final technical evidence records zero emitters, temporary objects, masks, FX controllers, and listeners:

- before every fixture;
- after every fixture;
- after cancellation;
- after resize cancellation;
- after each full/reduced comparison run;
- after all three repeated Heavy Bonk runs.

## Fixtures and containment

Fourteen deterministic fixtures are registered: primitive sampler; six cards; enemy attack; victory; defeat; reduced comparison; layered cancellation; resize cancellation; and repeated execution.

All fourteen passed at `1280×660` and `1024×580`, producing 28 technical fixture assertions. The game retained zero document overflow, kept the canvas, top rail, result corridor, and hand inside the viewport, and preserved player HP, enemy HP, and card identity.

## External evidence

Final external authority:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\level-04-card-goblin-duel\
h6-22a-card-effect-recipe-lab\capture-20260724t233238z-p9668
```

Portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
h6-22a-card-effect-recipe-lab/capture-20260724t233238z-p9668.json
```

The manifest governs 21 files: nine WebM recordings, six card keyframes, one contact sheet, and five JSON records. All 21 byte sizes and SHA-256 hashes were freshly verified. Browser-console errors: zero.

Two earlier capture-infrastructure attempts created empty external folders with zero files and no portable manifests. They are not evidence authorities and involved no visual tuning or recapture decision. `capture-20260724t233238z-p9668` is the sole H6.22A review authority.

## Reconciliation state

The reusable H6.22A engine is checkpointed with H6.22R1 as implementation infrastructure. Its detached visual packet remains historically preserved but visually rejected; those provisional recipes are development fixtures, not production recipes or Human-approved art direction. No H6.23 live gameplay integration has begun at this checkpoint.

## Fresh validation summary

Final fresh closure validation produced:

- Card Goblin unit and contract suite: `113/113` tests across 13 files;
- focused Hub Ledger bridge: `8/8` tests;
- H6.22A browser contracts: `28/28` fixture/viewport runs;
- preserved CardRig semantic route contracts: `9/9`;
- preserved H6.21B browser fixture sweep: `18/18`;
- Card Goblin production build: passed;
- Academy Hub production build: passed;
- Academy roster, Hub icon, asset manifest, animation manifest, shared-region, Hub-region, and pipeline-provenance validation: passed;
- final browser server and Playwright process cleanup: passed.

The build emitted existing advisory chunk-size and Hub dynamic-import warnings; neither warning failed the build or originated as a new gameplay authority.
