# Tiny Goblin Academy H6.22R1 — CardRig Composition and Attachment Authority

**Status:** Implementation and technical validation complete; Human structural acceptance passed; standalone visual-review lane superseded by the Card Goblin completion goal.

**Committed baseline:** `5ee42c216f59c6cb1f53835e92c45bdb8eec4727`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Complete CardRig layer composition, true-frame socket, environmental-slot separation, and semantic VFX attachment authority.

```yaml
h6_22R0CommittedAndPushed: true
h6_22R1ImplementationComplete: true
h6_22R1TechnicalValidationPassed: true
h6_22R1HumanVisualReviewPassed: false
h6_22R1HumanStructuralReviewAccepted: true
h6_22R1StandaloneVisualReviewRequired: false
h6_22R2Started: false
h6_23Started: false
```

## Architecture boundary

H6.22R1 restores the card as the acting visual object. It does not author final card VFX, assign permanent rarity frames, change simulation, or integrate H6.22 effects into live gameplay.

The governed CardRig layer order is:

1. shadow;
2. base face;
3. live content (icon, title, rules);
4. transparent true outer frame;
5. interaction state;
6. card-local FX.

All layers share one semantic card-button root. The environmental slot remains outside the moving CardRig so location state and card classification cannot be confused.

## True frames and environmental slots

The true-frame socket uses the existing cleaned card-frame sheet directly. No crop derivative was created.

| Style | Governed region | Source rectangle |
|---|---|---:|
| `none` | no overlay | — |
| `gold-ornate` | `card-goblin-duel.card-frames.card-front-frame.gold-ornate-open-frame` | `641,824,125,189` |
| `wood` | `card-goblin-duel.card-frames.card-front-frame.wood-open-frame` | `770,825,123,187` |
| `corner-ornate` | `card-goblin-duel.card-frames.card-front-frame.corner-ornate-open-frame` | `898,825,123,187` |

Environmental surfaces remain a separate authority: none, green slot, teal slot, gold glow, red corners, and gray gold. Production cards retain `none` for both authorities in this lane. No rarity doctrine or permanent card-to-frame mapping is established.

## Attachment authority

The production vocabulary contains exactly seven attachment classes:

| Authority | Semantic owner |
|---|---|
| `card-local` | current CardRig root |
| `draw-pile-local` | governed player draw origin |
| `discard-pile-local` | governed player discard target |
| `player-target` | governed player impact target |
| `enemy-target` | governed enemy impact target |
| `travel` | moving CardRig or explicit travel object |
| `tabletop-local` | governed played-card/tabletop position |

`viewport-center` is not valid production authority. Card-local and travel diagnostics follow their owner through hand, played-center, and discard movement. Stable anchors are sampled through `requestAnimationFrame`; resize and reset cancel the active attachment and remove every temporary node, owner class, and animation-frame callback.

## H6.22A reconciliation

Retained:

- typed effect recipes;
- deterministic grouped execution;
- cancellation and supersession;
- resource accounting;
- zero-residue cleanup.

Adapted:

- ambiguous target names;
- Phaser attachment resolution;
- development fixture wiring.

Rejected or deferred:

- detached center-stage demonstrations as card-recipe evidence;
- provisional visual recipe polish;
- final rarity meanings and permanent frame assignment;
- live H6.23 gameplay integration.

## Technical evidence

External run:

```text
Tiny-Goblin-Academy/Evidence/level-04-card-goblin-duel/
h6-22r1-cardrig-composition-attachment-authority/
capture-20260725t171740095z-p21380
```

The run contains two stills and thirteen motion recordings. All 15 files are nonzero and SHA-256 governed. It proves the complete layer stack, true-frame lifecycle attachment, environmental-slot separation, seven attachment authorities, resize cancellation, reset cleanup, and reduced motion. Every fixture remained contained; browser console errors were zero; all final resource counts were zero.

The slot-versus-frame still is technically valid but visually conservative because occupied cards cover most of their environmental sockets. Human Review may request a more explicit vacancy/slot comparison in a later evidence lane; no replacement run was taken.

## Validation

- Card Goblin suite: `126/126` passed across 15 files;
- R1 browser contracts: `15/15` passed;
- preserved H6.21B browser fixtures: `18/18` passed;
- preserved semantic route contracts: `9/9` passed;
- Card Goblin production build: passed;
- Academy Hub production build: passed;
- Academy, asset-manifest, pipeline, provenance, and evidence-storage validation: passed;
- protected card-frame, UI-token, and tabletop hashes: unchanged;
- package and lockfiles: unchanged;
- simulation and Hub Ledger behavior: unchanged;
- `git diff --check`: passed.

## Promotion state

Kryssie accepted R1 as useful structural plumbing and explicitly declined another evidence lane whose only purpose would be to make the semantic proof look more exciting. R1 may be checkpointed and consumed by the broader Card Goblin completion goal. This acceptance does not promote the provisional H6.22A visual recipes or claim final game quality.

At this checkpoint, Rung 2, Rung 3, Rung 7, and H6.23 have not begun.
