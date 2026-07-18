# Potion Sorter — Visual Integration Lessons Learned

## Record identity

**Curriculum pass:** Post-playable visual and runtime integration<br>
**Level:** 2 — Potion Sorter<br>
**Closure lane:** H6.7/H6.7A documentation closure<br>
**Mechanical baseline:** Playtested / Human Review Passed; reconstructed in `LESSONS_LEARNED.md`<br>
**Visual/runtime closure commits:** `f4526fd`, `2f2140a`, and `20c0b0f`

This is Potion Sorter's second learning record. It does not replace or rewrite
the reconstructed mechanical lesson.

## Inherited mechanical baseline

- Simulation owns potion order, matching, score, combo, timer, and completion.
- Tap-select and drag may enter the same controller path without defining
  different game rules.
- Tests prove rules, runtime evidence proves presentation, and human review
  decides whether the result reads as a coherent game.
- Button Goblin passed forward the Academy shell, stage-first composition,
  semantic typography, selective physical host surfaces, and named rig
  architecture.

## Phase 1 — Material-source pantry and provenance

### Starting understanding

Potion Sorter needed a room assembled from reusable surfaces, but the Academy
had no governed material pantry. The first intake produced strong neutral CC0
sources from ambientCG plus stylized Kenney particle helpers, then review
identified that the structural identity was still too photographic.

### Intended lesson

Learn to acquire, preserve, classify, and audition open material sources before
allowing them into a runtime composition.

### Approaches attempted or rejected

- Preserved realistic timber, stone, metal, paper, and grime as neutral/detail
  sources rather than treating them as the final fantasy look.
- Added bounded stylized fantasy candidates from Kenney, DeadKir, and
  Luke.RUSTLTD instead of replacing the accepted neutral pantry.
- Rejected rendered model previews as reusable texture truth.
- Deferred model-first Quaternius packages and rejected a mismatched Kenney
  Modular Dungeon palette atlas.

### Failures and surprises

- A provenance-clean pantry can still be stylistically incomplete.
- Pantry acceptance is not the same as game selection or runtime approval.
- Realistic brass was valuable precisely because it was restrained: a gear hub,
  valve rim, or fitted accent gained contrast without turning the room
  photorealistic.

### What worked and why

The hybrid strategy gave primary identity to stylized fantasy materials while
retaining realistic CC0 sources for quiet grain, wear, and focal metal response.
Original archives, hashes, licenses, metadata, extractions, and research-only
previews remained distinct.

### Invariants preserved

- Source packages and pixels remained unchanged.
- Research previews stayed evidence-only.
- No pantry decision silently became runtime approval.

### Reusable doctrine

- Legal cleanliness, technical fitness, and stylistic fitness are separate
  gates.
- A reusable pantry should preserve useful alternatives without forcing every
  accepted source into the current game.
- Stylized identity and restrained realistic detail can cooperate when each has
  an explicit material role.

### GlyphForge graduates

- Neutral and stylized fantasy material-pantry classifications.
- Package/license/hash preservation pattern.
- `primary identity`, `support alternate`, and `hybrid accent` material roles.

### Evidence and commits

- `docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100_POTION_SORTER_TEXTURE_MATERIAL_INTAKE_AND_PROVENANCE.md`
- `docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_100C_STYLIZED_FANTASY_TEXTURE_PANTRY_ADDENDUM.md`
- `728e9f0` — establish the neutral material pantry.
- `bc7d613` — record the stylized fantasy pantry approval.

### Inheritance passed to Dice Duel Tavern

Dice Duel may source tavern materials from a governed hybrid pantry rather than
shopping blindly or baking every surface into one illustration.

## Phase 2 — Same geometry, different material recipes

### Starting understanding

Raw texture squares could show color and grain, but not whether materials would
cooperate on actual room forms.

### Intended lesson

Compare material recipes on identical code-authored specimens so geometry,
lighting, and scale remain controlled variables.

### Approaches attempted or rejected

- Rejected choosing a room palette from source thumbnails alone.
- Compared stylized, realistic, and hybrid recipes on the same beams, masonry,
  plates, parchment, glass, grime, and mechanism parts.
- Rejected broad realistic brass while approving it as a small focal accent.

### Failures and surprises

- Materials that looked strong alone could dominate or flatten neighboring
  surfaces when composed.
- Wear and ooze worked better as bounded overlays/masks than broad repeating
  fills.

### What worked and why

Neutral and warm-light specimen plates made tiling, scale, hierarchy, and
hybrid compatibility visible before room construction.

### Invariants preserved

- Geometry stayed identical across candidates.
- Recipes remained provisional until runtime integration.
- No shader or PBR system was invented for a 2D material-foundation lesson.

### Reusable doctrine

- Audition recipes on shared geometry, not isolated squares.
- Material scale and repetition are composition decisions.
- Use focal realism where extra response adds substance; keep primary identity
  stylistically coherent.

### GlyphForge graduates

- Neutral specimen audition harness.
- Reproducible material-recipe inventory and comparison method.

### Evidence and commits

- `docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_101_NEUTRAL_MATERIAL_SPECIMEN_AUDITION.md`
- `22cf2cd` — audition Potion Sorter material recipes.

### Inheritance passed to Dice Duel Tavern

Dice, table, cup, and tavern surfaces can reuse controlled specimen comparison
before live composition.

## Phase 3 — Containment, masks, and interaction geometry

### Starting understanding

Potion bottles had to approach an inspection station, enter machinery, and
settle behind receiver lips. Simple overlap did not prove physical containment.

### Intended lesson

Separate presentation bounds, interaction bounds, anchors, depth, and masks so
flat assets can participate in readable 2D spatial relationships.

### Approaches attempted or rejected

- Rejected the four-compartment organizer as proof of three distinct receiver
  identities.
- Replaced unreadable all-in-one inventory evidence with legible plates.
- Used ordinary depth ordering for shallow containment and local geometry masks
  for deep containers and apertures.
- Rejected an alpha mask because the supported cases did not require one.

### Failures and surprises

- Early bottle seating was sloppy enough that the proof could not be trusted.
- Debug masks shown in presentation views looked like production geometry.
- Interaction envelopes needed to remain generous even when visual clips were
  precise.

### What worked and why

Regions 17, 18, and 19 became the actual red, blue, and green receiver
identities. Approach, partial-entry, and accepted states proved three depths;
separate debug sheets exposed anchors, clips, and interaction envelopes without
polluting the finished view.

### Invariants preserved

- Masks stayed local to their owning holder or aperture.
- Visual clipping never became hit-test authority.
- The controller remained responsible for whether a placement was correct.

### Reusable doctrine

- Layering handles shallow containment; geometry masks handle deep containment
  and apertures; alpha masks require a demonstrated need.
- Visual, interaction, and diagnostic geometry are different contracts.
- Presentation evidence should hide masks; diagnostic evidence should expose
  them.

### GlyphForge graduates

- Holder-local containment contract.
- Independent interaction-envelope doctrine.
- Presentation/debug evidence split.

### Evidence and commits

- `docs/assets/game-assets/potion-sorter/TINY_GOBLIN_ACADEMY_H5_102_RUNTIME_MATERIAL_CONTAINMENT_PREPARATION.md`
- `fc48cf9` — prepare runtime containment.

### Inheritance passed to Dice Duel Tavern

Dice trays, cups, tables, and selection zones may use the same separation of
visual containment, interaction bounds, and rule authority.

## Phase 4 — Composition C and preview-first SceneRig design

### Starting understanding

The approved room needed to show an incoming queue, an inspection aperture, and
three physical destinations without recreating the old dashboard or flattening
the room into one background.

### Intended lesson

Generalize Button Goblin's `ActorRig` thinking into a complete `SceneRig` made
of named, replaceable, stateful presentation systems.

### Approaches attempted or rejected

- Auditioned conveyor-forward, aperture-forward, and hybrid compositions.
- Selected Composition C: conveyor queue, aperture focal station, and deep
  destinations each receive one spatial job.
- Rejected the first implementation that preserved the ingredient list but lost
  the approved perspective markup.
- Preserved the useful deterministic movement machinery while rebuilding the
  room blocking around the approved composition.

### Failures and surprises

- A technically complete SceneRig can still embody the wrong composition.
- Duplicate bottle actors left originals sitting on the conveyor while replicas
  moved.
- Render-ownership handoffs briefly made bottles disappear.
- A solid black inspection square and incorrect top-bar depth broke the
  conveyor illusion.

### What worked and why

The final preview kept the same bottle actors throughout travel, changed their
scale/depth/mask continuously, opened the gantry so the conveyor remained
visible, and protected the rear bottle behind the inspection frame. Motion
proof caught failures that still images could not.

### Invariants preserved

- Preview work did not replace live gameplay before approval.
- Scene pieces remained named and individually addressable.
- The deterministic demonstration cycle presented, rather than fabricated,
  spatial state.

### Reusable doctrine

- A mockup answers one composition question; a preview proves the selected
  structure in motion.
- Preserve one actor through transitions whenever possible; avoid invisible
  ownership gaps and duplicate representations.
- Approved composition is authority; implementation coordinates remain
  evidence-led.

### GlyphForge graduates

- Layered room/conveyor `SceneRig` architecture.
- Perspective queue anchors carrying position, scale, depth, and occlusion.
- Continuous actor-ownership transition doctrine.

### Evidence and commits

- `games/tier-1/02-potion-sorter/evidence/h6-hybrid-scenerig-preview/`
- `a318182` — establish the hybrid SceneRig preview.

### Inheritance passed to Dice Duel Tavern

Dice Duel begins with a reusable SceneRig vocabulary. Its new discipline is
motion choreography—anticipation, roll, bounce, settle, choice, and impact—not
rediscovering how to layer a room.

## Phase 5 — Stage-first shell migration and live SceneRig integration

### Starting understanding

The old permanent stats and instructions rails squeezed the game into a center
panel. The approved room required the stage to become the game before its live
integration.

### Intended lesson

Migrate a mechanically complete game into the shared Academy desktop shell,
then replace only its presentation with the approved SceneRig.

### Approaches attempted or rejected

- Removed permanent side rails and moved Time, Score, Combo, instructions, and
  results into the stage/shared Help boundary.
- Kept shell migration and SceneRig integration as separate commits so defects
  remained attributable.
- Rejected a colorful front `TOOLS` bottle rack that duplicated the Botanicals
  shelf and obscured the gearbox.

### Failures and surprises

- The first live right wing contained three competing identities: gearbox,
  bottle storage, and tool cabinet.
- Fixing depth order alone made the wrong shelf more believable instead of
  making the composition clearer.
- The receiver interaction correction and visual service-bay correction had to
  be reviewed as distinct concerns.

### What worked and why

The final room uses an asymmetric authority map: botanicals left, sorting
station center, sparse mechanical service bay right. The live queue, aperture,
receivers, tap path, and drag path all feed the existing controller boundary.
At minimum size, decorative wings crop while the playable center stays intact.

### Invariants preserved

- No simulation values or matching rules changed.
- Shell controls stayed Academy-owned.
- Composition C remained the canonical spatial authority.
- The right wing did not regain duplicate potion storage.

### Reusable doctrine

- Migrate the host before integrating a room designed for the expanded stage.
- Fixing depth does not validate the object being layered.
- Negative space is a tool; every wing does not need another dominant cabinet.
- One logical stage with decorative side cropping can serve both supported
  desktop contracts without reflowing the game into a new composition.

### GlyphForge graduates

- Stage-first game migration sequence.
- Asymmetric room-authority map.
- Sparse machinery/service-bay composition.

### Evidence and commits

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_5_POTION_SORTER_STAGE_FIRST_SHELL_MIGRATION.md`
- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_6_POTION_SORTER_LIVE_COMPOSITION_C_SCENERIG.md`
- `f4526fd` — migrate Potion Sorter to the stage-first shell.
- `2f2140a` — integrate Composition C SceneRig.

### Inheritance passed to Dice Duel Tavern

Dice Duel inherits the Academy shell, protected center-stage contract, and
layered room ownership without an artificial ban on any previously learned
technique.

## Phase 6 — Shared typography and selective result surface

### Starting understanding

The room was coherent, but its text still used prototype-local treatments and
the round result lacked an authored Academy surface.

### Intended lesson

Apply the shared semantic font grammar selectively, let live DOM and Phaser
text retain meaning, and give completion clear visual authority.

### Approaches attempted or rejected

- Reused local Academy fonts and semantic recipes rather than acquiring a new
  Potion-only family.
- Kept the HUD code-native; rejected Region 5 again because it did not fit the
  live three-card status contract.
- Used Region 20 only for the round result.
- Returned the initial title/result hierarchy for a shared-token correction
  when the font family improved but the display weight remained too delicate.

### Failures and surprises

- A better font family can still lose hierarchy when weight and shadow are too
  restrained.
- The same weakness existed retroactively in Button Goblin because both games
  consumed the shared recipe.
- Completion copy and timer-expiry copy needed truthful distinct states.

### What worked and why

Cinzel 800 with a crisp plum shadow restored masthead authority. A stronger,
larger result recipe made `ALCHEMY COMPLETE!` and `ACADEMY GRADUATE!` the
dominant certificate messages without enlarging either plaque. Caudex, Outfit,
Atkinson Hyperlegible, and Macondo retained their semantic roles. The shared
correction removed conflicting local overrides in both games.

### Invariants preserved

- Result geometry and supported-window fit did not change.
- Text remained live, accessible DOM or Phaser content.
- No package, lockfile, source font, source image, simulation, or controller
  changed.

### Reusable doctrine

- Shared typography should own hierarchy; local CSS should own only composition
  needs that cannot be expressed by the semantic recipe.
- Font family, weight, tracking, stroke, shadow, material, and scale form one
  treatment.
- Shared-token changes require cross-game evidence wherever the token is live.

### GlyphForge graduates

- Strengthened `game-title` and `result-state` shared recipes.
- Cross-game shared-token regression tests and comparison evidence.
- Region 20 Potion Sorter completion/expiry host treatment.

### Evidence and commits

- `games/tier-1/02-potion-sorter/evidence/h6-7-shared-typography-ui-surfaces/`
- `games/tier-1/02-potion-sorter/evidence/h6-7a-shared-display-hierarchy-readability/`
- `20c0b0f` — integrate Potion Sorter shared typography surfaces.

### Inheritance passed to Dice Duel Tavern

Dice Duel may reuse semantic typography, result surfaces, materials, masks,
SceneRig layers, and actor ownership freely. Previously learned techniques are
capabilities, not forbidden territory; the new curriculum focus is motion
choreography and readable interaction feedback.

## Deferred teaching territory

| Curriculum phase | Potion Sorter status | Future lane |
|---|---|---|
| Asset intake and provenance | Taught | Reuse and extend only as needed |
| Material recipe audition | Taught | Reuse across later games |
| Scene rigging | Taught | Dice Duel inherits it |
| Masks and occlusion | Taught at foundational level | Dungeon Key Run may deepen it |
| UI and typography | Inherited and extended | Reuse |
| Animation and feedback | Spatial transitions taught | Dice Duel motion choreography |
| Particles and VFX | Deferred | Card Goblin Duel primary lesson |
| Audio | Deferred | Later full audio pass |
| Accessibility and input | Parallel pointer paths and bounded reduced-motion presentation | Later accessibility/input pass |
| Performance optimization | Validation only | Later optimization pass |
| Advanced rendering and shaders | Explicitly deferred | Later rendering pass |
| Release and distribution | Explicitly deferred | Fresh Academy package follows documentation closure |

## Doctrine promoted from Potion Sorter

- Pantry acceptance, game selection, and runtime approval are separate gates.
- Audition material recipes on identical geometry.
- Stylized identity and restrained realistic detail can form a coherent hybrid.
- Visual, interaction, and diagnostic geometry require separate contracts.
- SceneRig is presentation architecture; simulation/controller remains gameplay
  authority.
- One actor should remain continuously owned through motion, depth, and masking
  transitions.
- Approved composition outranks convenient implementation blocking.
- Previously learned techniques remain available; curriculum focus identifies
  the new discipline, not a ban list.

## Final inheritance passed to Dice Duel Tavern

Dice Duel begins with:

- the Academy stage-first desktop shell;
- semantic local typography and selective physical UI surfaces;
- governed material sources and specimen-audition discipline;
- layered SceneRig ownership, masks, occlusion, anchors, and interaction bounds;
- deterministic evidence and human visual-review gates.

Its new teaching territory is procedural motion choreography and readable
interaction feedback. Card Goblin Duel retains the major authored particle/VFX
lesson. Audio, advanced shaders, optimization, and release remain later passes.

## Visual-pass closure record

- Runtime validation: passed
- Evidence validation: passed
- Human visual review: passed
- Game-specific ledger review: passed human review
- Reusable doctrine: promoted with limits recorded above
- Next-game inheritance: recorded
- Cross-game visual synthesis: deferred until all ten visual ledgers close
