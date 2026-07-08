# Tiny Goblin Academy — General Asset Processing Workflow

## Purpose

This workflow generalizes the H5 asset-processing pattern for any Tiny Goblin Academy asset lane.

It covers the whole asset path from source intake through mapping, evidence, human review, cleanup candidates, promotion, and later planning/runtime gates. It is intentionally stricter than “cut sprites and use them” because generated asset sheets often contain fake transparency, mixed semantic lanes, text-bearing artifacts, fragile FX, or assets that are visually useful but not yet runtime-safe.

Core doctrine:

```text
Source asset
→ inspect
→ classify
→ map
→ prove with evidence
→ human/product review
→ derived cleanup candidate if needed
→ human/product review again
→ planning grammar/layout/runtime proposal only when approved
```

No source image becomes runtime truth merely because it exists.

## Universal Rules

- Preserve source files untouched.
- Prefer derived outputs for cleanup, normalization, or transparency repair.
- Do not wire assets into game/runtime code during intake, mapping, cleanup, or human-review passes.
- Do not treat generated checkerboard as transparency until alpha is inspected.
- Do not use `git add .`; stage exact files only.
- Use UTF-8 for Markdown and JSON.
- Every mapping or cleanup lane needs evidence that a future human or agent can inspect without reopening the whole source sheet.
- Human/product review approves visual acceptability; it does not automatically approve runtime wiring.
- Runtime use needs a separate implementation or integration lane.
- Use the canonical asset-pipeline CLI where it applies: `scripts/asset-pipeline/cli.mjs`.
- Do not use inline cleanup scripts or unregistered pixel methods for normal cleanup candidates.
- H5.67+ cleanup/mapping/evidence operations must write or preserve `pipeline-run-log.json`.
- H5.67+ generated manifests must include `pipelineRun` provenance that points to the canonical pipeline command and run log.

## Standard Pass Sequence

### 1. Baseline / Safety Check

Before modifying anything:

```text
git status --short
git log --oneline -n 10
```

Expected:

- clean tree unless the current task explicitly continues known work;
- latest expected commit is present;
- no unrelated debris is mixed into the lane.

Stop and report if the tree is dirty in an unexpected way.

### 2. Source Intake / Context Read

Read the relevant project docs, prior H5 reports, current manifests, and asset-system plan.

Confirm:

- exact source path;
- intended asset domain;
- whether this is a new lane or review/promotion of an existing lane;
- files explicitly out of scope;
- whether cleanup, runtime wiring, game code, or background processing are forbidden.

### 3. Metadata / Transparency Inspection

Inspect source image metadata:

- dimensions;
- mode (`RGB`, `RGBA`, etc.);
- alpha existence;
- alpha distribution if present;
- obvious fake checkerboard / baked background;
- grid regularity or irregular layout;
- text, labels, UI words, or baked semantic marks;
- fragile details such as glow, smoke, thin outlines, sparkles, loops, holes, or soft shadows.

Record these findings in the manifest/report.

### 4. Lane Classification

Classify the asset before mapping. Common lanes:

- standard static prop/icon sheet;
- card/frame/token sheet;
- UI/HUD sheet;
- character pose/state-symbol sheet;
- animation sheet;
- FX sheet;
- background / scene-anchor image;
- mixed sheet requiring split lanes;
- third-party/quarantine asset;
- text-bearing sheet needing special cleanup/regeneration decisions.

If a source sheet contains multiple lanes, split the workflow instead of forcing one manifest to mean everything.

### 5. Region / Frame / Anchor Mapping

Create the draft manifest appropriate to the lane.

Common manifest fields:

- `schemaVersion`
- `status`
- `domain`
- `operationalType`
- source manifest/path references
- source dimensions
- transparency findings
- `reviewStatus`
- `runtimeEligibility`
- region/frame/anchor/composition arrays
- review notes

For sprite/region manifests, every mapped unit should include:

- stable `id`
- human-readable `label`
- `category`
- `sourceRect` or equivalent reference
- `usage: draft-review`
- `reviewStatus: needs-human-review`
- notes for ambiguity, grouping, cleanup risk, or semantic uncertainty.

Do not assign runtime approval during mapping.

### 6. Evidence Creation

Every mapping pass should create evidence in:

`assets/academy/evidence/<h-lane-name>/`

Minimum useful evidence for region sheets:

- bbox overlay over source sheet;
- numbered contact sheet;
- region table preview;
- source inspection preview when transparency/layout risk matters.

Minimum useful evidence for cleanup candidates:

- cleaned sheet preview;
- before/after contact sheet;
- edge-risk preview;
- cleanup table preview;
- background/context preview if placement/readability matters.

Minimum useful evidence for scene anchors or composition plans:

- anchor overlay;
- numbered/contact-style anchor sheet;
- matrix or table preview;
- boundary/non-goals summary;
- optional ghost or storyboard preview.

Evidence must say whether it is:

- draft mapping;
- cleanup candidate;
- human review;
- not runtime placement;
- no exact coordinates;
- no gameplay wiring;
- no animation approval.

### 7. Mapping Human Review

After mapping evidence, record human/product review in a dedicated report.

Promotion usually changes top-level manifest metadata:

```json
{
  "status": "reviewed",
  "reviewStatus": "human-review-passed",
  "pipelineUse": "accepted-for-draft-cleanup-and-planning-use",
  "runtimeEligibility": "not-runtime-approved"
}
```

Individual regions may remain `draft-review` / `needs-human-review` if the pass only promotes the mapping lane for future cleanup/planning.

Review reports should state:

- what passed;
- what remains deferred;
- whether sourceRect correction is needed;
- cleanup risks;
- runtime boundary;
- next recommended lane.

### 8. Cleanup Candidate

Only run cleanup after mapping is reviewed or when the lane explicitly allows a cleanup pilot.

Rules:

- source PNG remains untouched;
- output goes under an appropriate `derived/` path;
- cleanup metadata gets a dedicated manifest;
- cleanup evidence is created;
- cleanup remains `draft-review` until human/product review passes.

For fake checkerboard cleanup, prefer conservative derived cleanup over destructive source edits.

Cleanup candidates must use a registered cleanup method. Check:

```powershell
node scripts/asset-pipeline/cli.mjs list-cleanup-methods
```

If a method is not registered, do not create a normal cleanup candidate with it. Register it as experimental, defer cleanup, or regenerate/export true-alpha source.

Every future cleanup candidate should include a run log:

```text
assets/academy/evidence/<lane>/pipeline-run-log.json
```

H5.67+ cleanup manifests should include a matching `pipelineRun` block. Missing run-log or manifest provenance is a pipeline failure unless the pass is explicitly docs-only or legacy-pre-H5.67.

### 9. Cleanup Human Review / Promotion

After cleanup evidence, record human review in a dedicated report.

Promotion usually changes cleanup manifest metadata:

```json
{
  "status": "reviewed",
  "reviewStatus": "human-review-passed",
  "pipelineUse": "accepted-for-draft-pipeline-use",
  "runtimeEligibility": "not-runtime-approved"
}
```

This means the cleaned candidate is acceptable for draft pipeline use, not automatically runtime-approved.

### 10. Optional Planning Layers

Some lanes need planning after cleanup/mapping, before runtime:

- scene anchors;
- functional surface slot mapping;
- placement grammar;
- layout composition;
- capability matrix;
- code-driven animation illusion planning;
- movement contract / reachability planning;
- runtime integration proposal.

Planning manifests should reference reviewed upstream assets and preserve:

- no exact runtime coordinates unless explicitly approved;
- no gameplay wiring;
- no runtime placement data;
- no animation approval unless that is the specific lane.

Functional surface slot mapping defines where dynamic content belongs inside a reviewed asset surface, such as a card frame, HUD panel, dialogue panel, speech bubble, button, progress bar, badge, or status panel. Slots should use surface-relative percentages rather than global runtime coordinates. Slot manifests may include fit/overflow policy: scaling a surface instance up can be a future layout response when content needs more room, but scaling must remain bounded by view/playfield budget and is not runtime-approved unless a later integration lane approves it.

### 11. Runtime / Game Integration Gate

Runtime wiring is separate.

Before game code changes:

- source/mapping is reviewed;
- cleanup candidate is reviewed if transparency matters;
- runtime asset path is agreed;
- placement/animation/collision/behavior contracts exist where relevant;
- evidence expectations are known;
- rollback scope is clear.

Do not smuggle runtime integration into mapping or cleanup lanes.

## Asset-Type Specific Directions

### Standard Static Prop / Icon Sheets

Examples:

- care props;
- potion bottles;
- dice tavern props;
- farm/settlement props;
- card tokens without text risk.

Recommended flow:

```text
intake → region mapping → mapping review → cleanup candidate → cleanup review → later runtime/use planning
```

Notes:

- usually good candidates for derived fake-checkerboard cleanup;
- preserve small details like leash loops, sparkles, bowls, bottles, or token marks;
- accepted cleaned assets are not automatic scene placements.

### Card Frames / Card Backs / Board Slots

Examples:

- Card Goblin Duel card frames;
- card backs;
- board slots;
- open frames;
- overlay-ready blank card surfaces.

Recommended flow:

```text
intake → semantic region mapping → mapping review → careful cleanup candidate → cleanup review → card composition/runtime proposal later
```

Specific cautions:

- blank/overlay-ready interiors are semantically important;
- open-frame holes and slot interiors may contain fake checkerboard that should become transparent later;
- cleanup must preserve borders, glows, nameplates, and parchment surfaces;
- do not approve card gameplay, deck behavior, or UI wiring during asset prep.

### UI / HUD / Text-Bearing Sheets

Examples:

- UI/HUD sheets;
- tokens with baked labels;
- panels, badges, buttons, active-turn markers.

Recommended flow:

```text
intake → region mapping → text/label risk review → cleanup/regeneration decision → cleanup or textless replacement → review
```

Specific cautions:

- text-bearing assets are higher risk because baked words may not fit final UI;
- decide whether to preserve, regenerate textless, or mark as concept-only;
- do not wire UI until naming, state, and label strategy are clear.

### Character Pose / State-Symbol Sheets

Examples:

- Ember Pup pose/state symbols;
- expression/action pantries;
- non-cycle creature state sheets.

Recommended flow:

```text
intake → pose/state candidate mapping → mapping review → cleanup candidate → cleanup review → state-symbol usage planning
```

Specific cautions:

- do not call a sheet an animation sheet unless it has enough coherent frames for actual cycles;
- use “pose-symbol,” “state-symbol,” or “state candidate” when appropriate;
- do not assign timing, pivots, anchors, hitboxes, hurtboxes, or gameplay states during intake/cleanup;
- runtime animation approval is a separate lane.

### Animation Sheets

Examples:

- platformer goblin player animation sheet;
- future true walk/idle/jump strips.

Recommended flow:

```text
intake → frame/sequence contract → frame evidence → sequence review → pilot cleanup/normalization → animation review → runtime animation proposal
```

Specific cautions:

- do not run static-sheet cleanup blindly;
- preserve baseline, scale, silhouette, and anchor consistency;
- review frame order, loop intent, and action readability;
- only assign pivots/hitboxes/hurtboxes in explicit later lanes;
- for generated animation, prefer a full-strip generation/edit pass from an approved seed frame rather than independent frame generation.

### FX Sheets

Examples:

- smoke;
- glow;
- sparkles;
- dust;
- lightning;
- motion trails;
- burst effects.

Recommended flow:

```text
intake → risk audit → tiny cleanup pilots only → review → selective cleanup/regeneration decision
```

Specific cautions:

- FX live exactly where cleanup algorithms want to cut;
- JPEG/RGB/no-alpha FX sheets may require regeneration rather than cleanup;
- never pretend high-risk FX are transparent runtime assets without evidence;
- prefer quarantine/deferred status when cleanup risk is too high.

### Background / Scene-Anchor Images

Examples:

- Pet Campfire background;
- future One-Room Platformer room backgrounds;
- tavern/board/table backgrounds.

Recommended flow:

```text
source inspection → scene-anchor audit → anchor review → placement grammar → layout composition → runtime proposal later
```

Specific cautions:

- backgrounds are not sprite sheets;
- do not extract props unless explicitly approved;
- map safe zones, focal zones, UI-safe areas, obstruction zones, and readability risks;
- use anchors as background intelligence, not exact spawn coordinates;
- combine platformer background anchors with movement contracts before procedural or assisted layouts.

### Mixed Sheets / Split-Lane Sheets

Examples:

- Pet Campfire with Ember Pup poses, props/icons, and background context;
- sheets containing props, UI, FX, characters, and panels together.

Recommended flow:

```text
intake → split-lane classification → process each lane independently → connect lanes later through planning manifests
```

Specific cautions:

- do not force every asset type into one cleanup or manifest strategy;
- keep character/state, props/icons, UI, FX, and background anchors separate when their risks differ;
- use connection layers such as placement grammar or composition plans only after each lane is reviewed.

### Third-Party / Downloaded Assets

Recommended flow:

```text
quarantine → license/source record → intended-use classification → normalization decision → manifest → evidence → review → promotion
```

Specific cautions:

- downloaded assets are not academy assets until license, source, intended use, and pipeline status are recorded;
- do not dump third-party assets directly into runtime folders;
- preserve provenance.

### 3D Assets / Future Model Intake

Recommended flow:

```text
quarantine → canonical pose/origin/scale inspection → export/normalization → evidence → review → runtime proposal
```

Canonical pose gate:

```text
upright
forward-facing
scaled
grounded
origin-correct
```

Runtime controls should not compensate for haunted geometry.

## Review / Promotion Vocabulary

Use these terms consistently:

- `draft`: created, not reviewed.
- `reviewed`: accepted by human/product review for the stated pipeline use.
- `needs-human-review`: evidence exists but Kryssie/product review has not passed it yet.
- `human-review-passed`: human/product review accepted the evidence.
- `not-runtime-approved`: may not be wired as runtime truth.
- `accepted-for-draft-cleanup-and-planning-use`: mapping is good enough for cleanup/planning.
- `accepted-for-draft-pipeline-use`: cleaned candidate is visually acceptable for draft pipeline use.
- `placementApproval: none`: no runtime placement approval.
- `animationApproval: none`: no animation-cycle approval.

## Validation Checklist

Run existing validators appropriate to the repo:

```text
node scripts/asset-pipeline/cli.mjs validate
```

The CLI validation command wraps:

```text
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

Run provenance validation for H5.67+ lanes:

```text
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
```

Use hard mode only when the current lane explicitly migrates or generates H5.67+ provenance-complete manifests:

```text
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --hard
```

Also parse any new JSON directly and check lane-specific invariants:

- JSON parses;
- expected status/review fields are present;
- all sourceRects are positive and inside source dimensions;
- no exact runtime coordinates appear in planning-only manifests;
- no runtime approval field was accidentally introduced;
- source PNGs did not change;
- cleaned candidates did not change unless that is the current lane;
- game code did not change unless runtime integration is explicitly approved.

For Markdown reports, run a bell/control-character check:

```powershell
$report = "docs/assets/<REPORT>.md"
$content = Get-Content -LiteralPath $report -Raw -Encoding UTF8
if ($content.Contains([char]7)) { Write-Error "Bell/control character found"; exit 1 } else { Write-Host "No bell/control characters found" }
```

## Commit Discipline

Before staging:

```text
git status --short
git diff --name-status
git diff --stat
git diff --cached --name-status
git diff --cached --stat
```

Stage exact files only.

Do not stage:

- unrelated source PNGs;
- unrelated evidence;
- build outputs;
- temporary scripts;
- runtime/game code unless explicitly in scope;
- Tauri/Rust/Cargo files unless explicitly in scope.

Final response should report:

- commit SHA if committed;
- files changed;
- source path and source metadata when relevant;
- region/frame/anchor/composition counts;
- evidence created;
- human review decision when relevant;
- cleanup status;
- runtime boundary;
- validations run;
- final git status;
- recommended next lane.

## Short Version

```text
Map first.
Prove with evidence.
Review before cleanup.
Clean only derived copies.
Review before promotion.
Plan before runtime.
Runtime waits for explicit permission.
```
