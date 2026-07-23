# Tiny Goblin Academy H6.21A — Card Surface System

**Status:** Implementation complete; automated validation and finalized external evidence passed; card-surface Human Visual Review passed; optical typography remains open.

**Baseline:** `1c5d9c3e02bbd8e64aeb968d50c7baad6c002313` — `feat: integrate card goblin tabletop dock`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Five-face card-surface promotion, mapped action tokens, responsive semantic cards, and evidence fixtures.

```yaml
h6_21AImplementationComplete: true
h6_21ATechnicalValidationPassed: true
h6_21ACardSurfaceHumanReviewPassed: true
h6_21AOpticalTypographyPassed: false
h6_21ACardRigImplemented: false
h6_21ALiveMotionIntegrated: false
h6_21AParticleWorkStarted: false
```

## Surface authority

H6.21A supersedes the earlier one-universal-face planning direction. Strategy B mapped tokens is the production direction; Strategy A remains a clean-interior development comparison only.

| Card | Face | Token |
| --- | --- | --- |
| Strike | blank parchment | sword |
| Guard | teal banner | shield |
| Mend | green banner | heart-plus || Spark | teal-edged tan | projectile star |
| Stun | teal banner | star cluster |
| Heavy Bonk | tan banner | club |

The frame crops and token source rectangles remain governed sheet regions. No source or derived image was generated or edited.

## Internal layout authority

Two normalized slot templates are implemented:

- banner cards: shared art, title, and body rectangles;
- blank-parchment Strike: its own art, title, and body rectangles.

Live DOM owns title, complete effect description, Play/Replace/Locked state badge, accessible action name, pointer input, keyboard focus, and disabled state. Painted frames and mapped tokens remain presentation surfaces.

The six-card laboratory renders deterministic development fixtures without production gameplay anchors. Ordinary runtime continues to expose only the legal `hand-slot-0..2` anchors. SparkChoice and Terminal expose anchors only for cards actually remaining in the authoritative hand.

## Review boundary

Kryssie approved the five faces, all six token identities and scales, both slot templates, responsive containment, outer card geometry, state badges, focus treatment, SparkChoice treatment, terminal lock treatment, and preserved H6.20E composition.

Containment tests prove text does not clip or overflow. They do not prove optical alignment against the painted ribbons and parchment panels. Banner title baselines, the Strike title, and body-block breathing room remain explicitly open for H6.21B.

CardRig motion did not begin during H6.21A. The cards remain semantic runtime buttons with static state styling; no deal, commitment, hold, exit, refill, skip-draw vacancy, Spark replacement motion, or cancellation authority is claimed.

## Final evidence

External authority:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\level-04-card-goblin-duel\
h6-21a-five-face-card-surface-lab-replacement-3\
capture-20260723t174650z-p712
```

Portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
h6-21a-five-face-card-surface-lab-replacement-3/
capture-20260723t174650z-p712.json
```

The finalized run owns eight screenshots plus `technical-review.json`. The portable manifest hashes nine payload files and preserves the earlier evidence history:

- aborted initialization: zero payload files;
- replacement-1: fixtures 1–5 only;
- replacement-2: fixtures 1–6 only;
- replacement-3: complete eight-fixture authority.

The complete run records zero console errors, zero document overflow, complete accessible names, fitting titles/body/state badges, unchanged protected hashes, and zero slot-debug exterior drift.

## Preserved boundaries

H6.21A does not change simulation rules, HP, card effects, queue order, draw behavior, Spark authority, terminal authority, Hub Ledger behavior, packages, lockfiles, or protected assets. It does not implement CardRig, CardEcho, particles, VFX, shaders, audio, or live structured presentation receipts.

H6.21B owns optical typography correction and the deterministic CardRig motion laboratory. H6.23 remains the live integration boundary.