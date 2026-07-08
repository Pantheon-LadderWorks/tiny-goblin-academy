# Tiny Goblin Academy — H5.65 Topdown Objects Cleanup Candidate

## Purpose

H5.65 creates a draft cleanup candidate for the reviewed Topdown Objects 8x8 grid sheet.

This is a cleanup candidate only. It does not approve runtime use, placement, collision, interaction, pickup, loot, portal, light, trap, damage, animation, or other gameplay behavior.

## Baseline

H5.64 reviewed the Topdown Objects region mapping and accepted the 64 grid-cell sourceRects for draft cleanup/planning use.

H5.65 uses the H5.64 reviewed manifest as the source of truth:

`manifests/academy.topdown.objects.regions.json`

## Source

`assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`

Source metadata:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha finding: no alpha channel
- Transparency finding: checker-style background is baked/fake transparency

The source PNG was not modified.

## Derived Cleanup Candidate

Created:

`assets/academy/topdown/objects/derived/tga-topdown-objects-cleaned-v0.1.png`

The derived sheet preserves the `1024x1024` layout and the reviewed 64 grid-cell positions.

## Cleanup Method

H5.65 uses a conservative reference-background cleanup:

- convert source to RGBA;
- use region 49, the blank cell, as the 128x128 checker/background reference;
- compare each pixel to the blank-cell reference at the same cell-relative coordinate;
- make close background-template pixels transparent;
- preserve object pixels when uncertain.

The final threshold was tightened after visual inspection to reduce gray-object damage.

This means the candidate intentionally favors preserving object interiors over aggressively removing every checker remnant.

## Cleanup Manifest

Created:

`manifests/academy.topdown.objects.cleanup-candidate.json`

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-cleanup-candidate`
- `runtimeEligibility`: `not-runtime-approved`
- cleanup regions: `64`

Every cleanup region includes:

- sourceRect
- derivedRect
- cleanupRisk
- cleanup/review notes
- behaviorBoundary metadata confirming no runtime behavior was introduced

## Risk Summary

Risk counts:

| Risk | Count |
| --- | ---: |
| `high` | 12 |
| `medium` | 4 |
| `low` | 47 |
| `none` | 1 |

High-risk / behavior-bearing regions:

- 7
- 9
- 10
- 17
- 18
- 47
- 55
- 57
- 58
- 60
- 61
- 62

These are high risk because they include portal, fire, glow, torch, campfire, glowing pad, spike trap, shadow/hole, slime, or other behavior-looking/soft-edge visuals.

## Behavior Boundary

Behavior-bearing objects remain behavior-deferred.

H5.65 does not approve:

- portal teleport
- light emission
- flame animation
- trap damage
- slime hazard
- pressure plate behavior
- shadow / hole behavior
- pickup behavior
- loot behavior
- chest behavior
- key behavior
- collision
- placement
- interaction
- runtime animation

## Visual Review Notes

The cleanup candidate is not automatically acceptable.

Some regions may be denied, excluded, or targeted for correction later if human review finds:

- remaining checkerboard residue;
- damaged gray/stone interiors;
- damaged transparent-looking edges;
- glow/fire/portal halos with checker remnants;
- shadow/slime/trap regions that are visually worse than keeping them deferred.

This is especially likely for gray/stone, portal, glow, fire, trap, shadow, and slime regions.

## Evidence Created

Evidence folder:

`assets/academy/evidence/h5-65-topdown-objects-cleanup-candidate/`

Evidence files:

- `topdown-objects-cleaned-derived-sheet-preview.png`
- `topdown-objects-cleaned-on-dark-preview.png`
- `topdown-objects-cleanup-before-after-contact-sheet.png`
- `topdown-objects-cleanup-edge-risk-preview.png`
- `topdown-objects-cleanup-table-preview.png`
- `topdown-objects-behavior-risk-preview.png`

## Non-Goals

- No source PNG modification.
- No runtime approval.
- No placement approval.
- No collision approval.
- No interaction approval.
- No behavior approval.
- No terrain changes.
- No wall changes.
- No mixed playfield-pack salvage.
- No game/runtime code changes.

## Recommended Next Lane

H5.66 — Topdown Objects Cleanup Human Review With Exclusions

If the candidate is too damaged or too noisy, use:

H5.66 — Topdown Objects Cleanup Deferred / Partial Acceptance
