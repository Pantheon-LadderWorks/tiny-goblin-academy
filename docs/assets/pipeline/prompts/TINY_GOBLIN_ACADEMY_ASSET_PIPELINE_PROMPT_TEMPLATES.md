# Tiny Goblin Academy — Reusable Asset Pipeline Prompt Templates

Use these templates by replacing bracketed placeholders like `[ASSET_NAME]`, `[LANE_ID]`, `[SOURCE_PATH]`, and `[COMMIT_MESSAGE]`.

---

# TEMPLATE 0 — Universal Asset Pipeline Guardrail Preamble

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[TASK_TITLE]`.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Workflow reference:
`docs/assets/TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Task scope:
`[ONE_PARAGRAPH_SCOPE_SUMMARY]`

Hard constraints:

Do not modify source PNGs.
Do not overwrite original pantry assets.
Do not wire runtime/game code.
Do not approve runtime use unless explicitly instructed.
Do not approve collision, hitboxes, hurtboxes, animation, placement, or gameplay behavior unless explicitly instructed.
Do not touch unrelated asset lanes.
Do not touch Top-Down Slime Quest unless this task is specifically about Top-Down Slime Quest.
Do not touch Shared FX unless this task is specifically about Shared FX.
Do not run Tauri/Rust/Cargo.
Do not use `git add .` or `git add ..`.
Stage exact files only.
Write text/JSON files using UTF-8.

Canonical tooling required:

Asset processing must use the canonical asset-pipeline command surface where it applies:

`scripts/asset-pipeline/cli.mjs`

Use canonical commands such as:

```powershell
node scripts/asset-pipeline/cli.mjs inspect-source --source [SOURCE_PATH]
node scripts/asset-pipeline/cli.mjs make-evidence --manifest [REGION_MANIFEST_PATH] --out [EVIDENCE_FOLDER]
node scripts/asset-pipeline/cli.mjs list-cleanup-methods
node scripts/asset-pipeline/cli.mjs cleanup-candidate --method [REGISTERED_METHOD] --source [SOURCE_PATH] --output [DERIVED_SHEET_PATH] --preview [PREVIEW_PATH] --run-log [EVIDENCE_FOLDER]/pipeline-run-log.json
node scripts/asset-pipeline/cli.mjs validate
node scripts/asset-pipeline/cli.mjs validate-provenance
```

Do not write inline one-off cleanup scripts.
Do not invent unregistered pixel methods.
Do not create a cleanup candidate from a method that is not registered in `scripts/asset-pipeline/lib/cleanup-method-registry.mjs`.

If an edge case does not fit the current method registry, stop and either:

* register an explicit experimental method;
* defer cleanup;
* regenerate/export true-alpha source;
* ask Kryssie for a pipeline lane.

Every H5.67+ cleanup/mapping/evidence operation should include or create a machine-readable run log:

`pipeline-run-log.json`

Every H5.67+ generated manifest should include `pipelineRun` provenance fields pointing to the tool, command, method, method status, source hash, git baseline, and run log.

If the current prompt needs to inspect the contract, run:

```powershell
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
```

Do not accept new generated asset outputs that lack both manifest provenance and an evidence run log unless the pass is explicitly docs-only or legacy-pre-H5.67.

Before editing, run:

```powershell
git status --short
git log --oneline -n 10
```

Expected: clean working tree unless this prompt explicitly says otherwise.

Stop and report if the tree is dirty or unexpected files are present.

---

# TEMPLATE 1 — Source Intake + Draft Region Mapping

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Source Intake + Region Mapping.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Workflow reference:
`docs/assets/TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Source asset:
`[SOURCE_PATH]`

Task:
Perform a source intake and draft region mapping pass for `[ASSET_NAME]`.

This is a mapping pass only.

First classify the sheet. Do not assume the lane.

Classify as one or more of:

* static prop sheet
* UI/icon sheet
* card/frame/surface sheet
* tile/terrain sheet
* scene-anchor background
* mixed sheet
* FX sheet
* character/pose candidate sheet
* animation candidate sheet
* review-candidate / quarantine candidate

If the sheet is safely mappable as one draft manifest, proceed.
If the sheet clearly needs split lanes, record the split-lane classification and map only the safe draft region lane.

Source inspection must record:

* source path
* dimensions
* image mode / pixel format
* alpha channel presence
* whether alpha is usable
* whether transparency is fake/baked checkerboard
* whether the file extension matches the actual format
* layout classification
* cleanup risk summary

Create manifest:

`[REGION_MANIFEST_PATH]`

Manifest requirements:

```json
{
  "schemaVersion": 1,
  "status": "draft",
  "reviewStatus": "needs-human-review",
  "runtimeEligibility": "not-runtime-approved",
  "domain": "[DOMAIN]",
  "operationalType": "[OPERATIONAL_TYPE]",
  "sourceSheet": "[SOURCE_PATH]",
  "sourceDimensions": {
    "w": 0,
    "h": 0
  },
  "transparency": {
    "sourceHasAlpha": false,
    "sourceAlphaUsable": false,
    "background": "baked-checkerboard-or-other-verdict",
    "cleanupRequired": true,
    "cleanupStatus": "not-run",
    "humanReviewRequired": true
  },
  "regions": []
}
```

Each region must include:

```json
{
  "id": "[stable-region-id]",
  "label": "[human-readable-label]",
  "category": "[category]",
  "sourceRect": { "x": 0, "y": 0, "w": 0, "h": 0 },
  "usage": "draft-review",
  "reviewStatus": "needs-human-review",
  "runtimeEligibility": "not-runtime-approved",
  "cleanupRisk": "[low|medium|medium-high|high]",
  "notes": []
}
```

Create evidence folder:

`[EVIDENCE_FOLDER]`

Required evidence:

* `[asset-name]-bbox-overlay.png`
* `[asset-name]-numbered-contact-sheet.png`
* `[asset-name]-region-table-preview.png`
* `[asset-name]-source-inspection-preview.png`

Optional evidence if useful:

* `[asset-name]-split-lane-classification-preview.png`
* `[asset-name]-risk-preview.png`

Evidence must be real evidence:

* visible labels
* source path
* source dimensions
* mode/alpha/transparency verdict
* numbered regions
* readable sourceRects
* no unlabeled crops passed off as proof
* no text-only cards passed off as cleanup evidence

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Source Asset
3. Source Metadata Findings
4. Layout / Lane Classification
5. Region Mapping Results
6. Category Breakdown
7. Cleanup Risk Summary
8. Evidence Created
9. Runtime Boundary
10. Non-Goals
11. Human Review Notes
12. Recommended Next Step

Required doctrine text:

This pass creates draft region/cartography evidence only. It does not approve runtime assets, cleanup output, collision, placement, animation, gameplay behavior, or wiring.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

Validation:

Run standard validators:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

Parse the new manifest and confirm:

* JSON parses
* status is draft
* reviewStatus is needs-human-review
* runtimeEligibility is not-runtime-approved
* every region has sourceRect
* every sourceRect is inside source dimensions
* no cleanup output created
* no source PNG changed
* no game code changed

Bell/control-character check:

```powershell
$report = "docs/assets/[REPORT_NAME].md"
$content = Get-Content -LiteralPath $report -Raw -Encoding UTF8
if ($content.Contains([char]7)) { Write-Error "Bell/control character found in report"; exit 1 } else { Write-Host "No bell/control characters found" }
```

Stage exact files only.

Likely files:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
* `[REGION_MANIFEST_PATH]`
* `docs/assets/[REPORT_NAME].md`
* evidence files in `[EVIDENCE_FOLDER]`

Do not stage:

* source PNGs
* derived cleanup assets
* game code
* runtime code
* unrelated manifests
* build outputs
* temporary scripts

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* source path
* source metadata
* classification
* region count
* category breakdown
* evidence created
* cleanup risk summary
* validation results
* final git status
* recommended next lane

---

# TEMPLATE 2 — Region Human Review / Mapping Promotion

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Region Human Review.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Reviewed mapping commit:
`[MAPPING_COMMIT_SHA] [MAPPING_COMMIT_MESSAGE]`

Manifest:
`[REGION_MANIFEST_PATH]`

Evidence:
`[EVIDENCE_FOLDER]`

Human review decision:

`[HUMAN_REVIEW_DECISION_TEXT]`

Accepted notes:

* `[NOTE_1]`
* `[NOTE_2]`
* `[NOTE_3]`

Denied/excluded regions, if any:

* `[REGION_ID_OR_NUMBER] — [REASON]`

Task:
Record the human review result for `[ASSET_NAME]`.

This is a metadata/review pass only.

Do not regenerate evidence.
Do not run cleanup.
Do not create derived assets.
Do not modify source PNGs.
Do not wire runtime/game code.

Update manifest metadata:

```json
{
  "status": "reviewed",
  "reviewStatus": "human-review-passed",
  "pipelineUse": "accepted-for-draft-cleanup-and-planning-use",
  "runtimeEligibility": "not-runtime-approved"
}
```

If specific regions are denied, preserve them in the manifest as excluded or denied:

```json
{
  "reviewStatus": "human-review-denied",
  "pipelineUse": "excluded-from-cleanup-and-runtime-use",
  "runtimeEligibility": "not-runtime-approved",
  "exclusionReason": "[reason]"
}
```

Add review notes:

* `[ASSET_NAME] human review passed in `[LANE_ID]`.
* `[REGION_COUNT]` mapped regions accepted for draft cleanup/planning use.
* No sourceRect correction pass needed unless otherwise stated.
* Source PNG remains untouched.
* Cleanup remains deferred to a future derived cleanup candidate.
* Runtime wiring remains deferred.
* Any denied regions are explicitly excluded and must not be used.

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Review Input
3. Human Review Decision
4. Accepted Region Mapping
5. Denied / Excluded Regions
6. Cleanup Status
7. Runtime Boundary
8. Non-Goals
9. Recommended Next Step

Required doctrine text:

This human review accepts the draft region mapping for planning and cleanup use only. It does not approve runtime assets, gameplay behavior, collision, placement, animation, or wiring.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

Validation:

Run standard validators.

Parse manifest and confirm:

* status is reviewed
* reviewStatus is human-review-passed
* runtimeEligibility is not-runtime-approved
* region count remains expected
* denied regions, if any, are not runtime-approved
* no source PNG changed
* no cleanup output created
* no game code changed

Bell/control-character check on report.

Stage exact files only.

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* human review decision
* accepted region count
* denied/excluded regions
* cleanup status
* runtime boundary
* validation results
* final git status
* recommended next lane

---

# TEMPLATE 3 — Derived Cleanup Candidate

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Cleanup Candidate.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Reviewed region manifest:
`[REGION_MANIFEST_PATH]`

Source sheet:
`[SOURCE_PATH]`

Task:
Create a derived transparent cleanup candidate for the reviewed `[ASSET_NAME]` regions.

Important:

This is a cleanup candidate only.
Do not approve runtime use.
Do not wire assets into games.
Do not modify the source PNG.

Cleanup rules:

* Source PNG must remain untouched.
* Use reviewed sourceRects as truth.
* Cleanup only inside reviewed regions.
* Use conservative fake-checkerboard/background removal.
* Preserve fragile outlines/glows/smoke/sparkles/thin-line details.
* Do not overcut uncertain pixels.
* Mark fragile regions with cleanup risk flags instead of forcing clean output.
* Preserve region order and region IDs.
* Preserve split-lane classification metadata if present.

Create derived output:

`[DERIVED_SHEET_PATH]`

Create cleanup manifest:

`[CLEANUP_MANIFEST_PATH]`

Manifest requirements:

```json
{
  "schemaVersion": 1,
  "status": "draft",
  "reviewStatus": "needs-human-review",
  "domain": "[DOMAIN]",
  "operationalType": "[OPERATIONAL_TYPE]-cleanup-candidate",
  "sourceSheet": "[SOURCE_PATH]",
  "derivedSheet": "[DERIVED_SHEET_PATH]",
  "runtimeEligibility": "not-runtime-approved",
  "cleanupApproval": "none",
  "regions": []
}
```

Each cleanup region must include:

* original region id
* original label/category
* sourceRect
* derivedRect
* cleanupStatus
* cleanupRisk
* removed pixel count or cleanup summary if available
* reviewStatus: needs-human-review
* runtimeEligibility: not-runtime-approved
* notes

Evidence folder:

`[EVIDENCE_FOLDER]`

Required evidence:

1. `[asset-name]-cleaned-derived-sheet-preview.png`
2. `[asset-name]-cleaned-on-dark-preview.png`
3. `[asset-name]-cleanup-before-after-contact-sheet.png`
4. `[asset-name]-cleanup-edge-risk-preview.png`
5. `[asset-name]-cleanup-table-preview.png`

Optional evidence:

* `[asset-name]-cleaned-on-background-preview.png`
* `[asset-name]-split-lane-cleanup-risk-preview.png`
* `[asset-name]-alpha-mask-preview.png`

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Source Inputs
3. Problem Summary
4. Cleanup Method
5. Derived Outputs
6. Evidence Created
7. Region Cleanup Results
8. Edge Risk Findings
9. Background / Dark Preview Findings
10. Non-Goals
11. Human/Product Review Notes
12. Recommended Next Step

Required doctrine text:

This cleanup candidate is derived review evidence only. Original pantry assets remain source truth. The derived sheet is not runtime-approved until human review accepts it. Cleanup review may pass with explicit exclusions if some regions retain checkerboard, halo artifacts, or damaged edges.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

Validation:

Run standard validators.

Parse cleanup manifest and confirm:

* status is draft
* reviewStatus is needs-human-review
* runtimeEligibility is not-runtime-approved
* cleanup region count matches reviewed accepted region count unless exclusions are explicitly documented
* every sourceRect is inside source dimensions
* every derivedRect is inside derived sheet dimensions
* source PNG unchanged
* no game code changed
* no runtime wiring occurred

Bell/control-character check on report.

Stage exact files only.

Likely files:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
* cleanup manifest
* cleanup report
* derived cleaned sheet
* evidence folder files

Do not stage:

* source PNGs
* game code
* runtime code
* unrelated manifests
* build outputs
* temporary scripts

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* derived sheet path
* cleanup manifest path
* evidence files created
* cleanup region count
* high-risk/review-risk summary
* excluded/failed regions, if any
* validation results
* final git status
* recommended next lane

---

# TEMPLATE 4 — Cleanup Human Review / Promotion With Optional Exclusions

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Cleanup Human Review.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Cleanup candidate manifest:
`[CLEANUP_MANIFEST_PATH]`

Derived cleanup sheet:
`[DERIVED_SHEET_PATH]`

Evidence folder:
`[EVIDENCE_FOLDER]`

Human review decision:

`[HUMAN_REVIEW_DECISION_TEXT]`

Accepted regions:

`[ACCEPTED_REGION_COUNT]`

Denied/excluded regions:

`[DENIED_REGION_LIST]`

Task:
Record the human review result for the cleanup candidate.

This is a review/promotion pass only.

Do not regenerate cleanup.
Do not modify source PNGs.
Do not modify derived images.
Do not wire runtime/game code.
Do not approve runtime use unless explicitly instructed.

Update cleanup manifest metadata:

```json
{
  "status": "reviewed",
  "reviewStatus": "human-review-passed",
  "pipelineUse": "accepted-for-draft-pipeline-use",
  "runtimeEligibility": "not-runtime-approved",
  "cleanupApproval": "human-review-passed-with-exclusions-if-any"
}
```

For denied regions:

```json
{
  "reviewStatus": "human-review-denied",
  "pipelineUse": "excluded-from-cleanup-and-runtime-use",
  "runtimeEligibility": "not-runtime-approved",
  "cleanupApproval": "denied",
  "exclusionReason": "[reason]"
}
```

Preserve cleanup risk notes.
Do not erase history just because top-level review passed.

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Review Input
3. Human Review Decision
4. Accepted Cleanup Candidate Regions
5. Denied / Excluded Regions
6. Cleanup Risk Notes Retained
7. Runtime Boundary
8. Non-Goals
9. Recommended Next Step

Required doctrine text:

Cleanup acceptance means the derived candidate may be used for future draft pipeline planning. It does not approve runtime use, gameplay behavior, collision, placement, animation, or wiring.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

Validation:

Run standard validators.

Parse cleanup manifest and confirm:

* status is reviewed
* reviewStatus is human-review-passed
* runtimeEligibility is not-runtime-approved
* accepted and denied regions are explicitly represented
* denied regions are not runtime-approved
* no image files changed
* no source PNG changed
* no game code changed

Bell/control-character check on report.

Stage exact files only.

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* cleanup review decision
* accepted region count
* denied/excluded regions
* cleanup status
* runtime boundary
* validation results
* final git status
* recommended next lane

---

# TEMPLATE 5 — Cleanup Deferred / Quarantine Decision

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Cleanup Deferred Decision.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Context:

A cleanup candidate was attempted or considered for `[ASSET_NAME]`, but cleanup is not accepted.

Reason:

`[SHORT_REASON]`

Examples:

* baked checkerboard/lattice overlaps gray asset art
* cleanup damages outlines
* conservative cleanup leaves visible grid/checker artifacts
* soft FX/glow/smoke edges cannot be safely separated
* sheet adds too little value compared to cleanup cost
* source should be regenerated as true alpha instead

Task:
Record a docs-only cleanup-deferred decision.

Do not create a cleaned derived sheet.
Do not regenerate evidence images.
Do not modify source PNGs.
Do not modify game/runtime code.

Source:

`[SOURCE_PATH]`

Reviewed manifest:

`[REGION_MANIFEST_PATH]`

Update the region manifest with a top-level cleanupDecision object:

```json
{
  "cleanupDecision": {
    "decision": "cleanup-deferred",
    "reason": "[reason]",
    "attemptedLane": "[LANE_ID]",
    "generalCleanupViable": false,
    "recommendedFutureUse": "reference-only / regenerate true-alpha per needed lane",
    "runtimeEligibility": "not-runtime-approved",
    "cleanupEligibility": "deferred",
    "notes": [
      "broad cleanup damages source art",
      "conservative cleanup leaves visible artifacts",
      "no derived cleanup candidate accepted",
      "no runtime/collision/animation/placement/gameplay approval"
    ]
  }
}
```

Keep existing reviewed mapping status unless the manifest schema requires a safer phrase.

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Cleanup Attempt / Review Context
3. Decision
4. Reason Cleanup Was Deferred
5. What Remains Useful
6. Runtime Boundary
7. Future Options
8. Non-Goals
9. Recommended Next Lane

Required doctrine text:

The mapping remains useful for catalog, inventory, planning, and future regeneration reference. The source sheet should not be treated as a cleaned runtime atlas. Future use should prefer selective regeneration, true-alpha replacement, or smaller lane-specific assets.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

Validation:

Run standard validators.

Parse manifest and confirm:

* previous reviewed mapping status remains valid
* runtimeEligibility remains not-runtime-approved
* cleanupDecision.decision is cleanup-deferred
* no derived cleanup PNG exists or no new derived PNG was created
* no source PNG changed
* no game code changed

Bell/control-character check on report.

Stage exact files only.

Likely files:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
* `[REGION_MANIFEST_PATH]`
* `docs/assets/[REPORT_NAME].md`

Do not stage:

* source PNGs
* derived cleanup assets
* evidence images unless explicitly updated
* game code
* runtime code
* build outputs

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* files changed
* cleanup decision summary
* reason cleanup was deferred
* what remains useful
* runtime/collision/animation boundaries
* validation results
* final git status
* recommended next lane

Tiny verdict format:

The map is useful. The cleanup is cursed. Keep the manifest as catalog/planning truth, but do not let this sheet near runtime unless it returns as true alpha or smaller lane-specific regenerated assets.

---

# TEMPLATE 6 — Functional Surface Slot Mapping

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[ASSET_NAME] Functional Surface Slot Mapping.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Reviewed region manifest:
`[REGION_MANIFEST_PATH]`

Cleanup candidate manifest, if available:
`[CLEANUP_MANIFEST_PATH]`

Task:
Create draft functional slot mapping for reviewed `[ASSET_NAME]` surfaces.

Important doctrine:

A frame, panel, card, button, meter, dialogue box, or UI plate is not just a sticker. It is a functional surface. Functional surfaces need named slots that define where future data, icons, text, embedded images, badges, status markers, and interaction states may appear.

This is a slot planning pass only.

Do not create runtime UI code.
Do not wire game behavior.
Do not create actual card data.
Do not approve text rendering.
Do not approve gameplay.

Map only surfaces that make semantic sense.

Do not force generic slots into transparent/open frames.

Examples:

Normal card face may use:

* title-zone
* art-window-zone
* body-text-zone
* cost-icon-zone
* status-badge-zone
* selection-highlight-zone

Open/transparent/card-mount frames may use:

* child-card-mount-zone
* content-window-zone
* frame-decoration-zone
* selection-highlight-zone

Buttons may use:

* icon-zone
* label-zone
* press-state-zone

Progress bars may use:

* fill-track-zone
* fill-value-zone
* label-zone

Dialogue panels may use:

* portrait-zone
* speaker-name-zone
* dialogue-text-zone
* continue-marker-zone

Create manifest:

`[FUNCTIONAL_SLOT_MANIFEST_PATH]`

Manifest requirements:

```json
{
  "schemaVersion": 1,
  "status": "draft",
  "reviewStatus": "needs-human-review",
  "runtimeEligibility": "not-runtime-approved",
  "slotApproval": "none",
  "domain": "[DOMAIN]",
  "operationalType": "functional-surface-slot-mapping",
  "sourceRegionManifest": "[REGION_MANIFEST_PATH]",
  "surfaces": []
}
```

Each surface should include:

```json
{
  "surfaceId": "[stable-surface-id]",
  "regionId": "[existing-region-id]",
  "label": "[surface label]",
  "surfaceType": "[card-face|frame|button|panel|dialogue|meter|slot|icon-button|other]",
  "slotModel": "[normal-card|open-frame|button|panel|meter|custom]",
  "usage": "draft-review",
  "reviewStatus": "needs-human-review",
  "runtimeEligibility": "not-runtime-approved",
  "slotApproval": "none",
  "slots": [
    {
      "slotId": "[slot-id]",
      "slotRole": "[semantic-role]",
      "relativeRect": { "x": 0, "y": 0, "w": 0, "h": 0 },
      "coordinateSpace": "surface-relative",
      "exactRuntimeCoordinatesApproved": false,
      "notes": []
    }
  ],
  "notes": []
}
```

Create evidence folder:

`[EVIDENCE_FOLDER]`

Evidence:

* `[asset-name]-functional-slot-overlay.png`
* `[asset-name]-functional-slot-contact-sheet.png`
* `[asset-name]-functional-slot-table-preview.png`
* `[asset-name]-functional-slot-summary.png`

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Functional Surface Doctrine
3. Source Inputs
4. Surface Selection
5. Slot Models Used
6. Surfaces Mapped
7. Slot Count Summary
8. Rejected / Non-Surface Regions
9. Runtime Boundary
10. Non-Goals
11. Human Review Notes
12. Recommended Next Step

Required doctrine text:

Functional slot mapping defines where future information may belong on a UI surface. It does not create runtime UI, approve gameplay data, approve card behavior, approve text rendering, or wire the game. Slots are draft semantic planning data until runtime integration explicitly consumes them.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_FUNCTIONAL_SURFACE_SLOT_MAPPING_DOCTRINE.md` if it exists or if this pass creates it

Validation:

Run standard validators.

Parse functional slot manifest and confirm:

* status is draft
* reviewStatus is needs-human-review
* runtimeEligibility is not-runtime-approved
* slotApproval is none
* every surface references an existing region id
* every slot has relativeRect
* no relativeRect extends outside 0..1 if normalized, or outside surface dimensions if pixel-relative
* no runtime approval field exists
* no game code changed
* no source PNG changed

Bell/control-character check on report.

Stage exact files only.

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* surfaces mapped
* slot count
* slot model summary
* corrections/rejections
* runtime boundary
* validation results
* final git status
* recommended next lane

---

# TEMPLATE 7 — Scene Anchor / Layout Composition Planning

Proceed with Tiny Goblin Academy `[LANE_ID]` — `[SCENE_NAME] Scene Anchor / Layout Composition Planning.

Project path:
`C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`

Baseline:
`[BASELINE_COMMIT_SHA] [BASELINE_COMMIT_MESSAGE]`

Scene background:
`[BACKGROUND_SOURCE_PATH]`

Related assets/manifests:

* `[RELATED_MANIFEST_1]`
* `[RELATED_MANIFEST_2]`

Task:
Create draft scene-anchor or layout-composition planning for `[SCENE_NAME]`.

Important doctrine:

Backgrounds are not only decorative art. They can become rule-readable scene surfaces. Scene anchors define where objects, characters, props, UI, and status symbols may belong without approving exact runtime coordinates.

This pass is planning only.

Do not create runtime placement data.
Do not wire game code.
Do not approve exact coordinates.
Do not approve gameplay.
Do not modify source images.

For scene-anchor mapping, create anchors such as:

* focal center
* safe foreground clearing
* left interaction cluster
* right interaction cluster
* UI-safe upper space
* sign/banner surface
* care/rest zone
* clutter/avoid zone
* obstruction zone
* decorative-only zone

For composition planning, create scenarios such as:

* default idle
* happy/greeting
* hungry/care
* thirsty/care
* sleepy/rest
* sad/comfort
* sick/recovery
* active/play
* quest/status

Create manifest:

`[SCENE_ANCHOR_OR_COMPOSITION_MANIFEST_PATH]`

Use anchor references and named slot roles only.

Coordinate policy:

```json
{
  "coordinatePolicy": "anchor-references-only-no-exact-runtime-coordinates",
  "runtimeEligibility": "not-runtime-approved",
  "placementApproval": "none"
}
```

Allowed slot shape:

```json
{
  "slotRole": "primary-character",
  "anchorId": "[anchor-id]",
  "relativeHint": "[readability hint]",
  "exactCoordinatesApproved": false
}
```

Create evidence folder:

`[EVIDENCE_FOLDER]`

Evidence:

* `[scene-name]-anchor-overlay.png`
* `[scene-name]-anchor-contact-sheet.png`
* `[scene-name]-ghost-placement-preview.png`
* `[scene-name]-anchor-table-preview.png`
* `[scene-name]-composition-scenario-matrix.png` if composition planning
* `[scene-name]-composition-storyboard-preview.png` if composition planning

Create report:

`docs/assets/[REPORT_NAME].md`

Required sections:

1. Purpose
2. Source Inputs
3. Scene Anchor Doctrine
4. Anchor / Composition Method
5. Anchors or Scenarios Created
6. Slot Roles
7. Readability Findings
8. Rejected Patterns
9. Evidence Created
10. Runtime Boundary
11. Non-Goals
12. Human/Product Review Notes
13. Recommended Next Step

Required doctrine text:

Grammar says what may belong. Composition says what the scene is trying to feel like. Runtime still waits for permission.

Update:

* `CHANGELOG.md`
* `docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
* scene-anchor doctrine docs if applicable

Validation:

Run standard validators.

Parse manifest and confirm:

* status is draft
* reviewStatus is needs-human-review
* runtimeEligibility is not-runtime-approved
* placementApproval is none
* exactCoordinatesApproved is false for all slots
* no runtime placement data created
* no source image changed
* no game code changed

Bell/control-character check on report.

Stage exact files only.

Commit message:

`[COMMIT_MESSAGE]`

Final response must report:

* commit SHA
* anchor/scenario count
* composition/placement boundary
* evidence created
* runtime boundary
* validation results
* final git status
* recommended next lane
