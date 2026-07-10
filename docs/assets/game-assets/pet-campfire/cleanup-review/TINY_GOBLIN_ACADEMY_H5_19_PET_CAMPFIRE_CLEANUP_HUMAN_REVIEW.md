# Tiny Goblin Academy — H5.19 Pet Campfire Cleanup Human Review + Promotion

## 1. Purpose

H5.19 records Kryssie's human/product review of the H5.18 Pet Campfire static props/icons cleanup candidate.

This is a promotion within the draft asset pipeline only. It does not wire assets into Game 07, does not mark them final runtime-approved, and does not modify source PNGs.

## 2. Human Review Decision

Decision:

```text
H5.18 Human Review: Passed
Cleanup candidate accepted for draft pipeline use
No cleanup correction pass needed
```

Kryssie reviewed the H5.18 cleaned Pet Campfire static props/icons candidate visually and accepted it.

The 12 medium-high regions were treated as risk flags, not failures. No obvious checkerboard leftovers, missing details, destroyed outlines, eaten sparkles, mangled leash loops, dead fire edges, or broken sunrise/sunset rays were found.

## 3. Reviewed Inputs

H5.18 report:

`docs/assets/TINY_GOBLIN_ACADEMY_H5_18_PET_CAMPFIRE_STATIC_PROPS_ICONS_CLEANUP.md`

Cleanup candidate JSON:

`manifests/academy.pet-campfire.static-props-icons.cleanup-candidate.json`

Derived transparent candidate:

`assets/academy/games/pet-campfire/derived/tga-pet-campfire-static-props-icons-cleaned-v0.1.png`

Evidence reviewed:

`assets/academy/evidence/h5-18-pet-campfire-static-props-icons-cleanup/`

Key evidence:

- `cleaned-on-background-preview.png`
- `cleanup-edge-risk-preview.png`
- `cleanup-before-after-contact-sheet.png`
- `cleaned-derived-sheet-preview.png`
- `cleanup-table-preview.png`

## 4. Promotion Scope

Promoted:

```text
Pet Campfire static props/icons cleanup candidate
```

Promotion meaning:

```text
accepted-for-draft-pipeline-use
```

This means the derived transparent candidate is good enough to use as the next draft-pipeline input for review, planning, or future non-runtime integration proposals.

It does not mean:

- runtime wiring;
- final runtime approval;
- game code integration;
- animation approval;
- source PNG replacement;
- production release approval.

## 5. Risk Flag Resolution

The H5.18 cleanup pass flagged 12 regions as medium-high risk:

- stick + ball;
- campfire;
- water droplet;
- fire/warmth icon;
- warning icon;
- sparkles;
- thought cloud;
- sunrise check;
- brush;
- leash;
- moon/night;
- sunrise/sunset.

Human review resolved these as visually acceptable for draft pipeline use. The flags remain useful historical metadata, but they do not require a cleanup correction pass at this time.

## 6. Updated Cleanup Candidate Status

Updated:

`manifests/academy.pet-campfire.static-props-icons.cleanup-candidate.json`

Status fields now record:

```text
status: reviewed
reviewStatus: human-review-passed
pipelineUse: accepted-for-draft-pipeline-use
runtimeEligibility: not-runtime-approved
```

The original H5.17 region manifest remains a draft sourceRect manifest. Runtime approval remains a future gate.

## 7. Non-Goals

- No recleaning occurred.
- No source PNGs were modified.
- No Ember Pup poses were touched.
- No animation manifest was created.
- No background processing occurred.
- No game code was changed.
- No hub code was changed.
- No runtime wiring occurred.
- No Top-Down Slime Quest files were touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.

## 8. Validation

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

The cleanup candidate JSON was also parsed directly to verify valid JSON.

## 9. Recommended Next Lane

Recommended next lane:

```text
H5.20 — Ember Pup Pose / Animation Candidate Mapping
```

Reason: the static props/icons lane now has mapped regions and a human-accepted transparent cleanup candidate for draft pipeline use. The next Pet Campfire asset risk is the Ember Pup itself, which needs character/state handling rather than static prop treatment.
