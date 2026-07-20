# Tiny Goblin Academy Agent Authority

This file is the repository-wide operational authority for coding agents. Read it before editing. A nested `AGENTS.md` may add narrower instructions for its subtree, but it may not weaken this repository's safety, Git, evidence, asset, authority, or human-review laws.

## Current implementation status

The approved evidence architecture is not yet implemented. Do not behave as if it is live.

```yaml
evidenceArchitectureApproved: true
dualCheckoutImplemented: false
lfsMigrationExecuted: false
lfsRulesInstalled: false
evidenceCheckoutCreated: false
canonicalCCutoverComplete: false
sourceAuthority: current canonical C checkout
evidenceAuthority: current repository history
onlyCPushesAfterDualCheckout: true
cardGoblinDuelStarted: false
```

At this baseline:

- The canonical active checkout is `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder`.
- No D evidence checkout, dual-checkout helper, lane lock, evidence hook, or evidence LFS rule exists.
- No `.gitattributes` LFS policy exists, no evidence file is LFS-backed, and no LFS history migration or canonical C cutover has occurred.
- Evidence remains tracked through the current ordinary-Git history.
- Card Goblin Duel visual integration has not begun.

Only the lane that changes one of these facts may update this block.

## Approved future evidence architecture

The approved target is one canonical GitHub repository with one linear history:

- C is the sole source-development authority and the only checkout allowed to push.
- D is a restricted evidence-only appliance.
- Synchronization is fetch plus fast-forward-only; divergence or ambiguity causes a hard refusal.
- Evidence lanes temporarily lock C commits and all pushes.
- C remains LFS-cold; D materializes and verifies reviewed evidence objects.
- Unpublished-history conversion occurs only in a disposable migration clone.
- The physical D volume must be identified and verified; a drive letter alone is insufficient.
- Canonical C is never rewritten, and an old clone is never deleted, without separate approval.

The detailed authorities are:

- `docs/evidence/TINY_GOBLIN_ACADEMY_EVIDENCE_STORAGE_AUDIT.md`
- `docs/evidence/TINY_GOBLIN_ACADEMY_EVIDENCE_SIZE_INVENTORY.json`
- `docs/planning/implementation/2026-07-19-tga-external-evidence-warehouse-plan.md`

Do not hardcode transient ahead/behind counts, a local D path, a drive serial, or a volume identity into portable repository configuration.

## Repository authority model

### Simulation and presentation

- Simulation/state owns gameplay truth.
- Presentation may reveal, animate, and explain truth; it may not choose or alter it.
- Deterministic test or evidence injection must travel through the production authority path.
- Stale, duplicate, or late presentation completions must not alter state.

### Human approval

Keep these states separate:

1. implementation complete;
2. automated validation passed;
3. agent visual review passed;
4. human visual review passed;
5. human runtime review passed;
6. production integrated;
7. curriculum closed.

Never silently promote one state into another. Human review is the final visual and runtime gate.

### Stage-first integration

- Establish mechanic-owned stage geometry before adding major visual actors.
- Preserve intentional negative space.
- Shared UI grammar does not require identical layouts.
- Optical correctness and reviewed screenshots may override mathematically neat but visually wrong placement.

### Curriculum boundaries

- Stay inside the explicitly approved game, lesson, and lane.
- Do not drift into later games, polish, audio, particles, shaders, packaging, replay work, or adjacent curriculum without authorization.
- Prepared assets do not imply runtime approval.
- An accepted laboratory does not imply live integration.
- A completed runtime does not imply curriculum closure.

`LOOP_FIRST_PROTOCOL.md` and `docs/roadmap/TINY_GOBLIN_ACADEMY_TIER_1_5_VISUAL_INTEGRATION_CURRICULUM_PLAN.md` remain the deeper loop and curriculum authorities.

## Git safety law

- Before editing, inspect the branch, HEAD, staged state, modified paths, and untracked paths. Abort on unrelated drift.
- Stage only exact reviewed paths. Never use `git add .`.
- Never use broad staging unless its complete expansion is printed and reviewed first.
- Before commit, inspect cached name-status, cached stat, and cached diff check.
- Commit only when the task explicitly authorizes it. Never push unless explicitly authorized.
- Never amend an earlier approved commit without explicit authorization.
- Never force-push, use `reset --hard`, run destructive clean commands, or delete backup material automatically.
- Never perform automatic merge, rebase, conflict resolution, or history rewriting.
- After a timeout, inspect actual Git state before repeating a commit. Distinguish a successful commit followed by slow maintenance from a failed commit.
- Stop rather than guess when histories diverge.
- Worktrees, extra clones, new remotes, bundles, backup refs, and history migration require explicit task authorization.

## Evidence safety law

- Tracked evidence is repository authority. Do not casually move, delete, compress, deduplicate, rename, or reclassify it.
- Keep source assets and evidence as separate categories.
- Until an approved implementation lane executes, evidence remains ordinary Git in the current repository history.
- Future evidence binaries are path-governed through LFS. Repository-wide image or video extension rules are forbidden.
- Preserve game and lane ownership for generated evidence.
- Capture instrumentation must not alter production authority. Development-only capture hooks must stay out of production behavior.
- Report missing evidence honestly. Never silently recreate evidence and represent it as original proof.
- Do not substitute junctions, symlinks, hardlinks, submodules, worktrees, or a separate evidence repository for the approved architecture.
- Never execute evidence migration inside canonical C.
- Never assume D exists until the current implementation status says it does.

## Asset-pipeline law

Use this sequence:

```text
register → inspect → alpha/background audit → classify → map
→ cleanup decision → validator → wiring → evidence → human review → promotion
```

- Keep source sheets untouched.
- RGBA does not prove useful transparency; inspect alpha and baked backgrounds.
- Do not perform uncontrolled manual pixel edits or unregistered inline cleanup.
- Do not create a derivative asset merely to evade the manifest or mapping system.
- Use exact mapped identities and record promoted and rejected regions.
- Prepared assets are not runtime-approved assets.
- Preserve validators, provenance, manifests, hashes, run logs, and human-review records.

Detailed authority remains in:

- `docs/assets/doctrine/asset-pipeline/TINY_GOBLIN_ACADEMY_ASSET_PIPELINE_CLI_LOCKDOWN_DOCTRINE.md`
- `docs/assets/pipeline/workflows/TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`
- `scripts/asset-pipeline/cli.mjs`

## Build and dependency law

- Use `pnpm`; do not introduce npm, Yarn, or Bun lockfiles.
- Do not install dependencies or change packages without explicit need and review.
- Visual and documentation lanes must not create package or lockfile drift.
- Use the repository-configured Rust toolchain and Tauri target settings. Do not change global Rust configuration.
- Do not run heavy Tauri release, installer, MSI, or NSIS builds unless explicitly authorized.
- Do not create standalone per-game executables unless a future architecture requires them.
- The Hub's source-present repository/developer mode is intentional. Hub-managed local game servers are not a packaging defect.
- Source-absent production/distribution behavior is a separate authority. Do not “fix” one mode by collapsing it into the other.

Current Hub mode authority is recorded in:

- `docs/runtime/TINY_GOBLIN_ACADEMY_HUB_EXTERNAL_BUILD_WORKSPACE_RESOLUTION.md`
- `docs/hub/runtime/TINY_GOBLIN_ACADEMY_HUB_RUNTIME_AND_PACKAGING_NOTES.md`
- `hub/src-tauri/src/lib.rs`

## Repository and filesystem safety

- Inspect only task-approved roots. Do not recursively scan unrelated user directories or entire drives.
- Do not touch external frameworks or infrastructure outside this repository unless the task explicitly includes them.
- Do not delete or relocate source until copy/move capability and destination integrity are proven.
- Before future relocation, verify processes that may block moves.
- Do not perform broad cleanup, delete caches, or remove evidence automatically without authorization.
- Preserve UTF-8; scan changed text for control characters and mojibake.
- Use exact filesystem paths and verify they exist.
- Never infer that a drive letter identifies the intended physical volume.

## Agent execution behavior

- Read this file and the relevant scoped authorities before editing.
- When an approved task is executable, use tools and perform the work; do not return a prose-only implementation plan.
- Do not reopen decisions that have explicit human approval.
- Do not invent blockers when repository evidence resolves them.
- Report unavailable validation honestly; never fabricate a successful check.
- Do not continue into the next lane automatically.
- Leave work unstaged while human visual or runtime review is pending.
- Stop at the stated boundary.
- Do not delegate to subagents or parallel agents unless the task explicitly authorizes it.
- Verify protected hashes and invariants when required.
- Actually inspect screenshots and recordings before claiming visual readiness.

## Stop and escalate

Stop, report the condition, and preserve state when any of these occurs:

- unexpected dirty paths or staged content;
- branch divergence or a missing/mismatched baseline;
- unclear source/evidence ownership;
- failed protected hashes;
- package or lockfile drift;
- source-asset mutation;
- unapproved gameplay-authority change;
- unapproved Hub/Tauri behavior change;
- missing or mismatched physical storage during a future evidence lane;
- an LFS pointer without its required object;
- ambiguity that could destroy or overwrite work;
- instructions that conflict with repository safety law.
