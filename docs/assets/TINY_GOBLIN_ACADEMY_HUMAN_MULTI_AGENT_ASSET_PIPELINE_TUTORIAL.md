# Tiny Goblin Academy — Human + Multi-Agent Asset Pipeline Tutorial

## Purpose

This guide explains how the Tiny Goblin Academy asset pipeline was actually driven.

It was not a single-agent workflow.

It was a **human-steered, multi-agent review surface**:

1. **Kryssie / Human Product Director**
   Reviewed screenshots, evidence, app behavior, visual quality, and product usefulness.

2. **Browser Review Agent / Prompt Architect**
   Read logs, screenshots, pasted summaries, evidence notes, and repo paths; then created precise next-step prompts.

3. **Primary Code/Evidence Agent**
   Worked inside the repo, inspected files, generated manifests, created evidence images, ran validators, and committed scoped changes.

4. **Secondary Code/Documentation Agent**
   Picked up narrower tasks, metadata updates, reports, changelog edits, review-promotion passes, and commits when the primary code agent was unavailable or rate-limited.

This system worked because every lane had a loop:

```text
repo work → log back → human/product review → browser prompt review → next exact prompt → repo work
```

The magic was not “AI does everything.”
The magic was **Kryssie steering with evidence while agents handled repeatable pipeline law**.

---

# 1. The Core Mental Model

The asset pipeline has three separate truths:

```text
Source truth:
  Original image files. Never overwrite these.

Evidence truth:
  Contact sheets, bbox overlays, cleanup previews, dark-background previews, reports.

Runtime truth:
  What the game is actually allowed to consume.
```

Most H5 passes only moved assets from:

```text
unknown source art
```

to:

```text
mapped / reviewed / cleaned candidate / accepted for draft planning
```

They usually did **not** move assets to runtime.

That distinction matters.

A manifest can be correct and still not be runtime-approved.
A cleanup can look promising and still need human review.
A source sheet can be mapped and still be rejected for cleanup.

That is not failure. That is the pipeline doing its job.

---

# 2. The Agent Surface

## 2.1 Kryssie’s role: product steering

Kryssie was not expected to manually inspect every JSON field or verify every sourceRect mathematically.

Kryssie’s review role was:

```text
Does this look right?
Does the evidence prove what it claims?
Does this asset feel useful?
Is this sheet worth fighting for?
Are any regions obviously wrong?
Are any regions visually unacceptable?
Does this game/app screen feel good?
```

Examples of human/product review calls:

```text
“These six regions still have checkerboard ghosts. Exclude them.”

“This cleanup is cursed. Pass by / quarantine this sheet.”

“These cards are mapped, but those transparent frames should not have title/body/cost slots.”

“The Pet Campfire scene-anchor system is amazing, but the pup should not go in those clutter zones.”

“The hub is too tall. The cards need room again.”

“The terminal-state fix worked, but now the controls are floating over the game.”
```

That kind of review is extremely valuable because the pipeline needs judgment, not just automation.

## 2.2 Browser Review Agent role

The browser review agent was the prompt architect and pipeline reviewer.

It usually did not directly edit the repo. Instead, it read:

* pasted code-agent logs;
* screenshots;
* reports;
* evidence summaries;
* file paths;
* human comments;
* commit SHAs;
* validation results.

Then it decided:

```text
Accept?
Correct?
Defer?
Quarantine?
Promote metadata?
Run cleanup candidate?
Split into another lane?
```

Its output was usually a strict prompt for the repo agent.

The browser agent’s job was not to say “looks cool, continue.”
Its job was to turn messy reality into a **safe next task**.

## 2.3 Primary Code/Evidence Agent role

The primary code agent did the heavier repo work:

* inspect source assets;
* generate manifests;
* create bbox overlays;
* create numbered contact sheets;
* create cleanup candidates;
* create before/after previews;
* create dark-background previews;
* inspect evidence visually;
* run validators;
* stage exact files;
* commit.

This agent was best for expensive, visual, or code-heavy passes.

Typical lanes:

```text
H5.30 Dice Duel Tavern Region Mapping
H5.52 Farm Settlement Cleanup Candidate
H5.56 Dungeon Platformer Cleanup Attempt
H5.20 Ember Pup Pose Candidate Mapping
```

## 2.4 Secondary Code/Text Agent role

The secondary repo agent was useful for narrower or text-heavy work:

* update review metadata;
* create reports;
* update changelog;
* apply manifest review status;
* commit docs-only decisions;
* perform human-review promotion passes;
* finish a lane when the primary agent was unavailable.

Typical lanes:

```text
Human review promotion
Cleanup acceptance with exclusions
Cleanup deferred decision
Doctrine capture
Functional slot correction
```

This division saved the expensive/heavier agent for work that needed stronger repo inspection, image handling, or evidence generation.

---

# 3. Why Logs Were Shared Back

The pasted logs were not noise. They were the handoff medium.

Every time Kryssie pasted a Codex/AGY/Mega log back into the browser, it gave the review agent enough truth to decide the next step.

A good returned log included:

```text
Commit SHA
Files changed
Source path
Manifest path
Evidence folder
Region count
Category breakdown
Validation results
Final git status
Known caveats
Recommended next lane
```

That let the browser review agent answer questions like:

```text
Did it actually commit?
Was the tree clean?
Did it touch source PNGs?
Did it accidentally stage evidence junk?
Did it approve runtime too early?
Did it generate real evidence or cardboard evidence?
Did human review pass, fail, or pass with exclusions?
```

Without logs, the browser agent would be guessing.

With logs, it could create a precise next prompt.

---

# 4. The Standard Loop

## Step 1 — Choose the lane

Pick one asset lane.

Examples:

```text
Farm Settlement
Dungeon Platformer
Dice Duel Tavern
Card Goblin Duel card frames
Card Goblin Duel UI/tokens
Pet Campfire static props/icons
Ember Pup pose candidates
Pet Campfire background scene anchors
```

Do not process the entire asset folder at once unless the task is explicitly an audit.

## Step 2 — Use the correct prompt template

Use the reusable prompt templates depending on the lane state:

```text
Unknown sheet:
  Template 1 — Source Intake + Draft Region Mapping

Mapped sheet needing review:
  Template 2 — Region Human Review / Mapping Promotion

Reviewed sheet needing transparency:
  Template 3 — Derived Cleanup Candidate

Cleanup candidate needing review:
  Template 4 — Cleanup Human Review / Promotion With Optional Exclusions

Cursed cleanup:
  Template 5 — Cleanup Deferred / Quarantine Decision

Card/UI/frame/panel surfaces:
  Template 6 — Functional Surface Slot Mapping

Background scene:
  Template 7 — Scene Anchor / Layout Composition Planning
```

## Step 3 — Repo agent executes

The repo agent should:

```text
start from clean git status
inspect source files
avoid source image edits
generate manifest/evidence/report
run validators
stage exact files
commit
return a full summary
```

The agent should not use:

```text
git add .
git add ..
```

The agent should not stage:

```text
source PNG modifications
target/
dist/
installers
logs
temporary scripts
dependency folders
runtime build junk
```

## Step 4 — Human/product review

Kryssie reviews what humans are best at:

```text
screenshots
evidence images
bbox overlays
cleanup previews
visual fit
app behavior
whether a sheet is worth continuing
```

Human review decisions can be:

```text
Pass
Pass with exclusions
Needs correction
Defer cleanup
Reject / quarantine
Move to next lane
```

## Step 5 — Browser agent writes the next exact prompt

The browser review agent reads the log and human notes, then writes the next repo prompt.

This prompt should include:

```text
baseline commit
decision
exact files
exact forbidden scope
validation gates
commit message
final response requirements
```

Then the loop repeats.

---

# 5. The Asset Pipeline State Machine

Most asset lanes moved through this pattern:

```text
1. Intake / Mapping
2. Human Review
3. Cleanup Candidate
4. Cleanup Human Review
5. Accepted for Draft Pipeline Use
6. Optional Functional Slots / Scene Anchors
7. Runtime Wiring — deferred until explicitly approved
```

Not every sheet gets every step.

Some sheets stop early.

Example:

```text
Dungeon Platformer:
  H5.54 Mapping
  H5.55 Human Review
  H5.56 Cleanup Attempt Failed
  H5.56 Cleanup Deferred Decision
```

That is a complete and valid outcome.

The sheet remains useful as reference/cartography, but not as cleaned runtime art.

---

# 6. Choosing the Right Template

## 6.1 New source sheet

Use:

```text
Template 1 — Source Intake + Draft Region Mapping
```

Use when:

```text
No manifest exists yet.
The sheet needs region IDs.
The asset needs classification.
You need evidence for human review.
```

Output should include:

```text
region manifest
bbox overlay
numbered contact sheet
region table
source inspection preview
report
commit
```

## 6.2 Human says mapping looks good

Use:

```text
Template 2 — Region Human Review / Mapping Promotion
```

Use when:

```text
Evidence looks good.
Regions are accepted.
No sourceRect correction is needed.
The asset should move to cleanup planning.
```

This is usually a docs/metadata pass.

It should not regenerate evidence.

## 6.3 Fake checkerboard needs cleanup

Use:

```text
Template 3 — Derived Cleanup Candidate
```

Use when:

```text
Regions are reviewed.
Source has baked checkerboard/fake alpha.
The asset might become useful over backgrounds.
```

The derived output is still not runtime-approved.

## 6.4 Cleanup looks good, maybe with exclusions

Use:

```text
Template 4 — Cleanup Human Review / Promotion With Optional Exclusions
```

Use when Kryssie says:

```text
“These are good.”
“These 6 are bad; exclude them.”
“Accept this candidate but deny 9 and 14.”
```

This is how Farm Settlement and other sheets avoided endless cleanup fights.

## 6.5 Cleanup is cursed

Use:

```text
Template 5 — Cleanup Deferred / Quarantine Decision
```

Use when:

```text
checkerboard is tangled into gray art
cleanup damages sprite edges
cleanup leaves ugly artifacts
sheet adds too little value
regeneration is smarter than repair
```

This prevents future agents from rediscovering the same trap.

## 6.6 UI/card/frame surfaces need internal data zones

Use:

```text
Template 6 — Functional Surface Slot Mapping
```

Use when the question becomes:

```text
Where does card title go?
Where does cost icon go?
Where does body text go?
Where does art go?
Where does the status badge go?
Where does button text go?
Where does progress fill go?
```

This is the “frame is not a sticker” doctrine.

## 6.7 Backgrounds need readable placement zones

Use:

```text
Template 7 — Scene Anchor / Layout Composition Planning
```

Use when the question becomes:

```text
Where can the pup sit?
Where should care props appear?
Where should UI bubbles avoid?
Where is the central focal point?
Where is clutter?
Where is safe negative space?
```

This is the “backgrounds become rule-readable surfaces” doctrine.

---

# 7. What To Paste Back After Each Agent Run

A good handoff back to the browser review agent looks like this:

```text
Agent: Codex / AGY / Mega / Quinn / etc.

Task:
[What prompt was executed]

Commit:
[SHA + message]

Files changed:
[list]

Source:
[path]

Manifest:
[path]

Evidence:
[path]

Summary:
[region count, category breakdown, cleanup result, etc.]

Validation:
[commands passed]

Final git status:
[clean / dirty]

Caveats:
[anything weird, failed, uncertain, deferred]

Human note:
[what Kryssie thinks after looking]
```

Example:

```text
Codex finished H5.52.

Commit:
a764222 docs: add farm settlement cleanup candidate

Derived sheet:
assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png

Cleanup manifest:
manifests/academy.farm-settlement.cleanup-candidate.json

Evidence:
assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/

Human note:
Regions 4, 7, 13, 21, 30, and 31 still have checkerboard ghosts. I’m okay excluding them instead of fighting cleanup.
```

That is enough for the browser review agent to create the next prompt.

---

# 8. Human Review Language That Works Well

Useful steering phrases:

```text
Human review passed.

Human review passed with exclusions.

No sourceRect correction needed.

Region 9 and 14 explicitly denied.

Cleanup candidate accepted for draft pipeline use only.

Cleanup failed. Defer/quarantine this sheet.

Do not fight this one further.

This is useful as reference only.

This should become a functional surface, not just a sticker.

This needs scene anchors before runtime placement.

This asset is a character/state symbol, not a prop.

This is not an animation sheet.

This should not be runtime-approved yet.
```

These phrases map cleanly into manifests and reports.

---

# 9. What The Human Should Not Have To Do

The human should not have to manually verify:

```text
every JSON field
every schema invariant
every sourceRect bound
every validator command
every staged file
every report section
every exact status field
```

That is the agent’s job.

The human should focus on:

```text
visual/product correctness
obvious bbox problems
cleanup quality
whether assets are worth using
whether a UI/game screen feels right
which regions should be denied
whether a sheet should be abandoned
```

The pipeline works best when the agent handles the boring law and Kryssie handles the taste, vision, and “that looks wrong” lightning strike.

---

# 10. Repo-Agent Quality Gates

Every repo agent should obey these gates.

## 10.0 Canonical tooling gate

The repo agent must not quietly invent a cleanup pipeline.

Future asset-processing work should enter through:

```powershell
node scripts/asset-pipeline/cli.mjs --help
```

The important standard is shared across all agents:

```text
same CLI
same cleanup method registry
same run-log shape
same manifest provenance
same no-runtime boundary
```

Browser-review agents, code agents, evidence agents, and documentation agents must all treat unregistered pixel cleanup as a failed gate, not a clever shortcut.

If a method is missing, the next prompt should say one of:

```text
register an experimental method
defer cleanup
regenerate true-alpha source
create a pipeline implementation lane
```

It should not say:

```text
just run a quick inline cleanup script
```

Every future cleanup/mapping/evidence run should create or preserve:

```text
pipeline-run-log.json
```

That run log is the bridge between the visual evidence, the manifest, the source hash, the output hash, the exact tool command, and the final review decision.

## Before editing

```powershell
git status --short
git log --oneline -n 10
```

Stop if dirty unless the prompt explicitly allows continuing.

## During work

Do not:

```text
overwrite source PNGs
stage generated junk
approve runtime early
mix unrelated asset lanes
process several sheets because they are nearby
invent new architecture outside scope
```

## Before commit

Run relevant validators.

Common validator set:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

Run custom JSON gates when a new manifest is created.

Check reports for bell/control characters.

Check:

```powershell
git status --short
git diff --name-status
git diff --stat
git diff --cached --name-status
git diff --cached --stat
```

Stage exact files only.

## After commit

Run:

```powershell
git status --short
git log --oneline -n 10
```

Final status should be clean.

---

# 11. Evidence Quality Rules

Evidence must prove the claim.

Bad evidence:

```text
unlabeled 256x256 crops
text-only cards
contact sheets with hidden labels
bbox overlays where numbers overlap the art
cleanup previews that do not show before/after
metadata claims without visible metadata
```

Good evidence:

```text
source inspection preview
bbox overlay
numbered contact sheet
region table preview
before/after cleanup sheet
dark-background preview
background overlay preview
edge-risk preview
slot overlay
anchor overlay
composition scenario matrix
```

The browser review agent should reject weak evidence.

Phrase to use:

```text
Evidence rejected as insufficient. Repair the evidence layer before trusting cleanup or mapping claims.
```

---

# 12. When To Stop Fighting A Sheet

A sheet should be deferred/quarantined when:

```text
cleanup damages useful pixels
checkerboard is tangled into the asset art
glow/smoke/water/fire cannot be separated cleanly
the sheet is mixed in a way that makes runtime use risky
the asset does not add enough value to justify repair
a true-alpha regeneration would be cheaper and cleaner
```

This happened with the Dungeon Platformer cleanup candidate.

The correct outcome was not “try harder forever.”

The correct outcome was:

```text
mapping remains useful
cleanup deferred
sheet becomes reference/planning only
future use requires true-alpha regeneration or smaller lane-specific replacements
```

---

# 13. How The Prompt Templates Fit Together

## Normal static sheet flow

```text
Template 1 — Map regions
Template 2 — Human review mapping
Template 3 — Cleanup candidate
Template 4 — Cleanup human review
```

## Cursed cleanup flow

```text
Template 1 — Map regions
Template 2 — Human review mapping
Template 3 — Cleanup candidate attempt
Template 5 — Cleanup deferred decision
```

## Card/UI surface flow

```text
Template 1 — Map regions
Template 2 — Human review mapping
Template 3 — Cleanup candidate
Template 4 — Cleanup review
Template 6 — Functional surface slot mapping
```

## Background scene flow

```text
Template 1 — Intake background as scene-anchor candidate
Template 7 — Scene anchor mapping
Template 7 — Layout composition planning
```

## Character/pose-symbol flow

```text
Template 1 — Pose candidate mapping
Template 2 — Human review pose candidates
Template 3 — Cleanup candidate if needed
Template 4 — Cleanup review
Only later: animation manifest, if the sheet actually supports animation
```

Important distinction:

```text
pose/state-symbol != animation sheet
```

Ember Pup was a state-symbol character sheet, not a true animation set.

---

# 14. Example Full Lane: Farm Settlement

The Farm Settlement flow showed the mature pattern.

```text
Mapping:
  map 32 regions

Bounds correction:
  fix only overflowing regions, not the whole sheet

Human review:
  accept reviewed regions

Cleanup candidate:
  create derived cleaned sheet

Human review:
  accept 26 regions
  explicitly exclude 6 bad cleanup regions

Final result:
  useful cleaned candidate with documented exclusions
```

The important lesson:

```text
Do not ruin good regions while trying to save bad ones.
```

---

# 15. Example Full Lane: Dungeon Platformer

Dungeon Platformer showed the quarantine pattern.

```text
Mapping:
  first attempt used wrong visual-tight / ideal grid logic

Correction:
  Kryssie spotted the grid issue
  repo agent measured actual irregular baked grid

Human review:
  accepted 40 measured-grid regions

Cleanup attempt:
  failed because checker/lattice was tangled into gray dungeon art

Decision:
  cleanup deferred
  manifest remains useful as catalog/planning reference
  sheet not suitable as cleaned runtime atlas
```

The important lesson:

```text
The map can be useful even when the cleanup is cursed.
```

---

# 16. Example Full Lane: Pet Campfire

Pet Campfire showed split-lane maturity.

It was not one asset.

It became:

```text
static props/icons
Ember Pup pose/state-symbols
background scene anchors
placement grammar
layout composition scenarios
```

Key doctrine:

```text
The pup is a character/state symbol, not a barrel with ears.

The background is a readable scene surface, not just wallpaper.

Grammar says what may belong.
Composition says what the scene is trying to feel like.
Runtime still waits for permission.
```

---

# 17. Example Full Lane: Card Goblin Duel

Card Goblin Duel revealed functional surfaces.

Card frames were not just stickers.

They needed:

```text
region mapping
cleanup candidate
cleanup review
functional slot mapping
slot correction
UI/tokens region mapping
UI/tokens correction
```

Key doctrine:

```text
A frame is not a sticker.
A frame is a surface with rules.
```

This led to slot concepts like:

```text
title-zone
art-window-zone
body-text-zone
cost-icon-zone
status-badge-zone
selection-highlight-zone
child-card-mount-zone
content-window-zone
frame-decoration-zone
```

Transparent/open frames should not receive generic card-content slots unless they are meant to contain text/data directly.

---

# 18. Recommended Working Pattern For Future Contributors

A future user trying to follow this repo should work like this:

```text
1. Pick one lane.
2. Read the latest report for that lane.
3. Check manifest status.
4. Check whether human review already passed.
5. Choose the matching prompt template.
6. Run the repo task with exact scope.
7. Generate real evidence.
8. Return the full log.
9. Let the human/product reviewer accept, correct, exclude, or defer.
10. Write the next exact prompt.
```

Do not jump from:

```text
source asset exists
```

to:

```text
runtime should use this
```

That is how the goblins get into the walls.

---

# 19. Suggested Handoff Format For Future Agents

Use this after every run:

```text
Task:
[H lane + title]

Baseline:
[commit before work]

Commit:
[commit after work]

Files changed:
[list]

Source:
[path]

Manifest:
[path]

Evidence:
[path]

What changed:
[summary]

Counts:
[regions/surfaces/slots/anchors/etc.]

Review status:
[draft / reviewed / needs-human-review / passed / denied]

Runtime status:
[not-runtime-approved]

Validation:
[list of commands passed]

Confirmed untouched:
[source PNGs, game code, runtime code, unrelated lanes]

Caveats:
[risks, exclusions, uncertain labels, future work]

Recommended next lane:
[next H pass]
```

---

# 20. Tiny Final Doctrine

The asset pipeline is not just image cleanup.

It is a disciplined conversation between:

```text
art
evidence
manifests
human taste
agent verification
runtime restraint
```

Kryssie steers with screenshots, logs, and product judgment.

The browser review agent turns that steering into precise prompts.

The repo agents execute, validate, document, and commit.

No single agent owns the truth.

The truth is braided:

```text
source files
evidence images
manifest metadata
validation output
human review
commit history
```

That is how Tiny Goblin Academy moved from chaotic generated sheets to a working asset pipeline without letting fake transparency, bad boxes, cursed cleanup, or premature runtime wiring eat the project alive.
