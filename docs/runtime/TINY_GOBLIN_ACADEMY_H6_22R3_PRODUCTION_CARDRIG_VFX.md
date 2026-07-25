# Tiny Goblin Academy H6.22R3 — Production CardRig VFX

**Status:** Production integration, automated validation, and browser lifecycle proof complete.

**Committed baseline:** `1f33e2e93c3b9d3a85153c3acab796cbd244ff1c`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Complete the production CardRig root, promote the retained effect runner into live gameplay, and author the six card materials without changing simulation authority.

```yaml
cardRigProductionLayers: 7
sharedOuterFrame: wood
specialFrameRequiresExplicitMetadata: true
simulationChanged: false
ledgerContractChanged: false
liveGameplayIntegrated: true
reducedMotionIntegrated: true
productionBrowserLoopPassed: true
effectResidueAfterEveryRun: 0
```

## Complete CardRig

Every moving production card owns one semantic root and seven ordered presentation layers:

1. face;
2. content;
3. true outer frame;
4. state;
5. card-local FX;
6. motion carrier;
7. activation source.

The root also declares one motion owner, activation-source owner, and cleanup owner. The standard frame policy is face-agnostic `wood`; `gold-ornate` is available only through explicit special metadata, and `none` remains a first-class fallback. Environmental slot surfaces are never accepted as outer frames, and transient focus/replacement/terminal states do not swap the persistent frame.

## Mastery ladder implementation

| Rung | Production authority |
|---|---|
| 2 — Primitive craftsmanship | seam-safe two-traveler rim trace, narrowed colored shine, distinct projectile/trail bodies, pile pulse, impacts, rings, motes, masks, shield, healing rise, dust, and terminal accents |
| 3 — Material language | physical slash, protection, healing, electricity, control, and weight-impact are typed materials rather than palette-only aliases |
| 4 — Composition grammar | preparation → action → impact/state → hold → decay → cleanup; groups are sequential and layers within a group are concurrent |
| 5 — Card surface identity | focus, replacement, locked, disabled, persistent frame, and card-local preparation remain separate authorities |
| 6 — Shared lifecycle VFX | draw-pile prepare, card draw, hand settle, commit, discard receive, Spark replacement, Heavy Bonk vacancy, terminal, reset, and resize cancellation |
| 7 — Card-specific recipes | exactly one full/reduced recipe for Strike, Guard, Mend, Spark, Stun, and Heavy Bonk |
| 8 — Responsive polish | effects resolve from governed DOM/canvas anchors and moving CardRig bounds; resize cancels to authoritative stable state |
| 9 — Accessibility/performance | reduced plans remove long travel and shake, full-viewport flashes are prohibited, Heavy Bonk shake is bounded, and all tracked resources return to zero |

## Six materials

- **Strike — physical slash:** warm trace, direct slash travel, narrow trail, sharp enemy impact.
- **Guard — protection:** teal trace, player-local shield formation, stable ring, restrained motes, held guard pulse.
- **Mend — healing:** green trace, rising restorative motes, card-local heart field, soft player ring.
- **Spark — electricity:** gold trace and shine, one visible star projectile with additive trail, compact starburst and ring.
- **Stun — control:** teal/gold trace, bounded enemy orbit, suspended pulse, lock ring.
- **Heavy Bonk — weight impact:** slower charge, deliberate downward hit, dust, broad low ring, one bounded tabletop response, and no refill.

Enemy attack travels explicitly from `enemy-target` to `player-target`. Victory and defeat are target/tabletop terminal accents and do not depend on a card that may already have left the hand.

## Production coordinator

Simulation remains the sole gameplay authority. A click resolves `playCard` or `resolveSparkChoice` exactly once, publishes one Ledger transition, and then builds a presentation-only CardRig plan from the before/after states. Input is locked while that plan runs.

The coordinator then executes:

- opening deal: draw pile → three complete CardRigs → hand settle;
- normal play: CardRig → center → card material → discard → pile receive → refill → enemy answer;
- Spark: Spark material and discard → replacement state → direct replacement discard → exact-slot refill;
- Heavy Bonk: material and discard → explicit vacancy, without a fake draw;
- terminal: locked hand plus victory/defeat accent;
- reset/resize: cancel CardRig and effect runner together, clean resources, render authoritative state, unlock input.

## Proof

- unit suite: 139/139 passing at integration checkpoint;
- preserved H6.21B motion browser contracts: passed before R1 sweep;
- preserved semantic route contracts: passed before R1 sweep;
- preserved H6.22A effect-lab contracts: passed before R1 sweep;
- H6.22R1 composition/attachment contracts: 15/15;
- production browser loop: opening, Strike, Spark replacement, Heavy Bonk vacancy, terminal, and resize cancellation passed;
- production browser console errors: 0;
- effect resources after every inspected run: 0.

The former detached H6.22A visual packet remains historically rejected. The production coordinator, live CardRig source object, governed piles/targets, and corrected visual primitives supersede it.
