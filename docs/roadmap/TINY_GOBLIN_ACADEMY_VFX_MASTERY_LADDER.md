# Tiny Goblin Academy VFX Mastery Ladder

Status: Canonical curriculum doctrine for visual-effects learning and promotion  
Authority: Kryssie Human Review  
Scope: Tiny Goblin Academy visual workbenches, CardRig effects, Phaser parity, and production integration

## Governing law

Technical capability does not equal visual completion.

A rung passes only when:

1. its implementation and automated checks pass;
2. its required visual fixtures exist;
3. the result satisfies the rung's explicit visual exit proof;
4. Kryssie grants Human Visual Review approval.

A typed runner may be technically excellent while its primitive craftsmanship remains at an earlier rung. A later-rung feature does not waive an earlier-rung failure. Work should descend to the earliest failed visual skill, correct it, and climb again.

## Shared review discipline

- Keep simulation authority separate from presentation authority.
- Keep source, attachment, travel, target, impact, hold, decay, and cleanup legible.
- Prefer one dominant action, one supporting accent, and one restrained impact or state response.
- Keep the card, player state, target, pile, and result corridor readable.
- Preserve full and reduced-motion semantic equivalence.
- Record what was implemented, what automation proved, what an agent observed, and what a human approved as separate facts.

## Rung 0 — Workbench correctness

**Learning objective:** Build an offline instrument that reliably displays and exports the user's selections.

**Implementation skills:** Local asset loading, deterministic playback, state selection, recipe serialization, responsive layout, stable timing, pause/reset, zero-network operation, and seam-safe geometry.

**Visual skills:** Distinguish a genuine preview from initialization noise, misleading attachment, clipped surfaces, resize drift, or broken repeating patterns.

**Required fixtures:** Single-card studio, state comparison, face-by-border matrix, full/reduced preview, recipe round trip, malformed-recipe rejection, minimum viewport, and perimeter debug.

**Automated checks:** Asset locality, zero external requests, control wiring, recipe validation, perimeter sampling, pause/reset, responsive containment, and browser-console cleanliness.

**Human Review questions:** Does the workbench show what was selected? Is any preview state deceptive? Can the user compare candidates without remembering the previous frame? Do controls alter the intended layer?

**Exit criteria:** The workbench reliably displays and exports its selected candidate with no bridge dependency, broken perimeter seam, hidden error, or misleading generic-center ownership.

**Common failures:** Cloud-only asset bridges, embedded initialization toasts, width-based dash periods on closed paths, fake readiness, broken imports, and controls wired into nothing.

**Does not belong:** Production Phaser integration, final card recipes, rarity canon, simulation changes, audio, or broad shader work.

## Rung 1 — Attachment authority

**Learning objective:** Make every effect visibly belong to a declared source, destination, or traveling object.

**Implementation skills:** Card-local bounds, draw/discard anchors, player/enemy targets, travel paths, tabletop-local ownership, coordinate conversion, z-order, resize, and cancellation.

**Visual skills:** Read source and causality instantly; prevent detached center-stage fireworks.

**Required fixtures:** `card-local`, `draw-pile-local`, `discard-pile-local`, `player-target`, `enemy-target`, `travel`, and `tabletop-local` previews on a complete visible card/tabletop.

**Automated checks:** Every layer declares one valid authority; generic viewport center is invalid; attached layers follow motion; pile and target regions remain distinct.

**Human Review questions:** What owns the effect? Where did it come from? Where did it go? Would the effect still make sense with labels hidden?

**Exit criteria:** Every visible effect clearly belongs to its declared authority through movement, resize, cancellation, and cleanup.

**Common failures:** Effects floating at resolution center, target flashes mistaken for source effects, pile reactions at status UI, and card-local glows left behind during travel.

**Does not belong:** Primitive polish beyond what attachment proof requires or gameplay event binding.

## Rung 2 — Primitive craftsmanship

**Learning objective:** Author clean reusable visual atoms.

**Implementation skills:** Perimeter traces, rim glows, pulses, shine, flare, motes, rings, projectiles, trails, impacts, dust, orbit, masking, and isolated dissolve feasibility.

**Visual skills:** Shape, timing, silhouette, heads/tails, falloff, color hierarchy, scale, opacity, and decay.

**Required fixtures:** One primitive at a time on its intended attachment surface, with a pause and visible primitive name.

**Automated checks:** Geometry budgets, object/emitter counts, continuity, duration, cleanup, reduced substitute, and no debug geometry in ordinary mode.

**Human Review questions:** Is the primitive clean by itself? Is its direction legible? Does it have an intentional beginning and end? Does any seam, slab, or accidental repetition appear?

**Exit criteria:** Each primitive looks deliberate alone and can be reused without visual repair.

**Common failures:** Fluorescent rectangles, dash-wrap artifacts, full-stage white flashes, square particle defaults, abrupt disappearance, and capability samplers mistaken for composed recipes.

**Does not belong:** Card identity, multi-stage choreography, or live gameplay integration.

## Rung 3 — Material language

**Learning objective:** Make materials communicate meaning rather than recolor one shared effect.

**Implementation skills:** Material parameter groups, palette constraints, emission behavior, motion character, texture/sprite selection, and controlled blend modes.

**Visual skills:** Physical slash, electricity/spark, protection/shield, healing, stun/control, weight/impact, and rarity/enchantment glow.

**Required fixtures:** A/B material comparisons using the same primitive structure and materially different recipes.

**Automated checks:** Palette and motion budgets, prohibited layers, blend/brightness bounds, and material-specific parameter ranges.

**Human Review questions:** Can the material be identified without the card name? Does healing feel restorative, protection stable, electricity energetic, and impact heavy?

**Exit criteria:** Materials are recognizable and stop reading as recolored copies.

**Common failures:** Every action using the same diagonal slash, white dominating the palette, healing behaving like sparks, and weight communicated only by larger scale.

**Does not belong:** Full card lifecycle composition or final rarity economy.

## Rung 4 — Composition grammar

**Learning objective:** Turn primitives into readable events.

**Implementation skills:** Ordered and parallel layer groups, phase timing, anticipation, synchronization, holds, decay, cancellation, and cleanup.

**Visual skills:** Preparation → action → impact or state formation → hold → decay → cleanup.

**Required fixtures:** Phase-isolated playback, complete playback, timing comparison, cancellation during every phase, and active-layer telemetry.

**Automated checks:** Stable ordering, bounded concurrency, phase coverage, total duration, no stale callbacks, and zero residue.

**Human Review questions:** Is there a clear dominant action? Can preparation, action, and result be distinguished? Does anything begin too early or overlap without purpose?

**Exit criteria:** Effects read as authored events rather than simultaneous noise.

**Common failures:** Every layer starting together, flicker without anticipation, impacts before travel completes, long empty holds, and decay that obscures the next action.

**Does not belong:** Six complete card recipes or simulation integration.

## Rung 5 — Card surface identity

**Learning objective:** Communicate card identity and interaction state before activation.

**Implementation skills:** Resting, focused, selected, committed, resolving, replacement, locked, and disabled state recipes bound to one CardRig.

**Visual skills:** Identity effects, interaction effects, activation preparation, border/face distinction, and restrained persistence.

**Required fixtures:** Single-state studio, synchronized state rack, keyboard/pointer focus, replacement, terminal lock, and reduced motion.

**Automated checks:** State coverage, attachment, accessible labels, no text obstruction, stable card bounds, and state cleanup.

**Human Review questions:** Is the state readable without confusing rarity, identity, or causality? Does Heavy Bonk feel exceptional without screaming continuously? Are focus and replacement distinct?

**Exit criteria:** Card state is readable before and during activation while identity and rules remain clear.

**Common failures:** Constant fireworks on ordinary cards, rarity and focus sharing one signal, face FX obscuring text, and disabled cards still looking actionable.

**Does not belong:** Draw/discard economy or complete activation sequences.

## Rung 6 — Shared lifecycle VFX

**Learning objective:** Give the card economy one consistent spatial and visual grammar.

**Implementation skills:** Draw-pile prepare, draw, hand settle, play prepare, commit, discard, discard receive, replacement, terminal, cancellation, and shared recipe inheritance.

**Visual skills:** Provenance, destination, pile reaction, card continuity, and hand settlement.

**Required fixtures:** Initial deal, normal refill, Heavy Bonk vacancy, Spark replacement, terminal, reset, resize, cancellation, and reduced motion.

**Automated checks:** Governed anchors, correct route order, replacement slot identity, no top-rail motion, no fake Heavy Bonk draw, and zero residue.

**Human Review questions:** Do cards visibly come from the draw pile and go to discard? Does Spark replacement read in the correct order? Does the vacancy make sense?

**Exit criteria:** Shared card economy behavior is spatially truthful, consistent, and clean.

**Common failures:** Draws from center/right, replacement cards flying toward status UI, discard without pile response, teleportation, and focus drift.

**Does not belong:** Card-specific material language beyond small attachment proof.

## Rung 7 — Card-specific recipes

**Learning objective:** Give each approved card a recognizable lifecycle personality.

**Implementation skills:** Shared-base inheritance, card-specific overrides, source/travel/target composition, recipe registry, and full/reduced variants.

**Visual skills:** Strike directness, Guard stability, Mend restoration, Spark energy, Stun control, and Heavy Bonk weight.

**Required fixtures:** One full lifecycle and one reduced lifecycle for Strike, Guard, Mend, Spark, Stun, and Heavy Bonk.

**Automated checks:** Exactly one recipe per card, shared lifecycle reuse, explicit target ownership, semantic equivalence, budgets, and cleanup.

**Human Review questions:** Can each card be recognized with title and rules hidden? Does its action feel causally connected to the visible card?

**Exit criteria:** All six cards are distinct, readable, and built from shared grammar rather than disconnected imperative animation piles.

**Common failures:** Recolored sameness, detached activations, overloading every primitive, and action effects that replace the source card.

**Does not belong:** Live simulation binding or final mastery tuning.

## Rung 8 — Responsive polish

**Learning objective:** Preserve effect meaning and hierarchy across governed surfaces.

**Implementation skills:** Scaling, clipping, coordinate conversion, resize recomputation/cancellation, contrast budgets, and safe regions.

**Visual skills:** Optical balance at 1280×660 and 1024×580, result-corridor protection, and controlled visual footprint.

**Required fixtures:** Every approved recipe at both desktop sizes, comparison racks, pile/target extremes, and resize during playback.

**Automated checks:** Containment, no text/HUD intersection, anchor geometry, maximum coverage, and stable cleanup after resize.

**Human Review questions:** Is the effect still legible at minimum size? Does it overpower the card or interface? Are important shapes clipped?

**Exit criteria:** Effects remain readable, contained, and balanced at both approved desktop sizes.

**Common failures:** Fixed-pixel particles overwhelming small cards, clipped trails, status-rail flashes, and minimum viewport becoming a different composition.

**Does not belong:** Performance optimization not motivated by measured behavior.

## Rung 9 — Accessibility and performance

**Learning objective:** Preserve meaning while reducing motion, brightness risk, and runtime cost.

**Implementation skills:** Reduced variants, flash/shake budgets, pooling, resource accounting, cancellation, repeated execution, and performance telemetry.

**Visual skills:** Calm substitutes using compact pulses, opacity, color, and short scale changes.

**Required fixtures:** Full/reduced side-by-side, repeated execution, cancellation, resize, brightness budget, and object/emitter leak tests.

**Automated checks:** Zero residue, stable object counts, no prohibited flashes, bounded shake, equivalent final state, and CPU/GPU restraint.

**Human Review questions:** Does reduced motion preserve cause and result? Is it materially calmer? Does repeated use remain comfortable and clean?

**Exit criteria:** Calm mode preserves meaning and repeated execution leaves zero residue or unbounded cost.

**Common failures:** Reduced motion merely running faster, full-stage flashes retained, invisible emitters accumulating, and camera shake communicating essential information.

**Does not belong:** Production event binding.

## Rung 10 — Production parity

**Learning objective:** Reproduce an approved Forge candidate faithfully in the Phaser runtime.

**Implementation skills:** Candidate-to-typed-recipe adapter, Phaser primitives, CardRig bounds bridge, simulation event binding, cancellation, and parity telemetry.

**Visual skills:** Identify and correct translation drift between canvas approximation and production rendering.

**Required fixtures:** Forge candidate, production fixture, synchronized A/B comparison, live CardRig lifecycle, and cancellation.

**Automated checks:** Schema compatibility, attachment parity, timing tolerance, layer order, cleanup, route preservation, and simulation invariants.

**Human Review questions:** Does production reproduce the approved rhythm, ownership, color hierarchy, and intensity? What changed in translation?

**Exit criteria:** The approved Forge recipe reproduces faithfully in Phaser and binds to gameplay without becoming gameplay authority.

**Common failures:** Different implementations in workbench and game, stale card bounds, center fallback, timing drift, and gameplay state waiting on decorative cleanup.

**Does not belong:** Broad visual redesign or new card identities.

## Rung 11 — Mastery and Human approval

**Learning objective:** Refine technically complete work into deliberate visual authorship.

**Implementation skills:** Candidate registry, evidence indexing, A/B instrumentation, stable capture, and promotion records.

**Visual skills:** Timing refinement, restraint, contrast, silhouette, material coherence, card-to-card balance, and final feel.

**Required fixtures:** A/B comparisons, contact sheets, motion recordings, reduced-motion review, complete lifecycle review, and final production evidence.

**Automated checks:** Evidence identity, file hashes, capture readiness, console cleanliness, portable metadata, and regression suite.

**Human Review questions:** Does it feel intentional? Is any layer merely showing off capability? Would subtraction improve clarity? Does the deck feel coherent without becoming uniform?

**Exit criteria:** Kryssie approves the recipe registry as authored, polished, accessible, and production-ready.

**Common failures:** Treating test counts as art approval, recapturing without a visual hypothesis, polishing one card out of balance with the deck, and silently promoting provisional work.

**Does not belong:** Automatic approval, unreviewed promotion, or expansion into the next curriculum lane.

## Promotion record

Every promoted effect should record:

- current rung;
- recipe and fixture identity;
- automated validation status;
- agent visual-review status;
- Human Visual Review status;
- full/reduced status;
- production-parity status;
- superseded evidence and reason;
- open visual debt.

The ladder exists to make visual learning cumulative. It is not a checklist for declaring rough capability finished early.
