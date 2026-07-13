# Tiny Goblin Academy x Hatch Pet Pipeline Maturity Comparison

## Executive Conclusion

Tiny Goblin Academy and Hatch Pet solve different parts of the same larger asset-production problem.

TGA is stronger as a broad asset-governance system. It has a mature taxonomy, multi-class asset doctrine, source-preservation rules, cleanup-method registration, provenance validation, human review vocabulary, and runtime-promotion gates. It is especially good at preventing pantry assets from accidentally becoming runtime truth.

Hatch Pet is stronger as an animation-generation production run. It treats a generated character as a job graph with a canonical identity reference, grounded prompts, row-level extraction, deterministic derivation, atlas normalization, motion previews, direction semantics, final despill, package validation, and retained audit artifacts. It is especially good at turning image generation from "make me a cute thing" into a reproducible production lane.

The correct move is not to clone Hatch Pet into TGA. The useful move is to adopt its generation-run discipline where TGA actually has generated animated assets, while preserving TGA's stronger asset-class taxonomy and bounded runtime approval model. Every barrel, wall tile, UI button, background, and static prop does not need an eleven-row pet audit. Animated characters, enemies, pets, segmented rigs, and generated FX loops are where Hatch Pet's maturity is most transferable.

## Inspected Evidence

TGA evidence inspected:

- `C:\Users\kryst\Workspace\game-development\GAME_DEVELOPMENT_MANIFEST_V1.yaml`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\README.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\meta\progress-tracker.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\assets\README.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\assets\pantry\visual-assets\TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\assets\pipeline\workflows\TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\assets\pipeline\cli\TINY_GOBLIN_ACADEMY_H5_67_RUN_LOG_MANIFEST_PROVENANCE_CONTRACT.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\ASSET_SHEET_PIPELINE.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\asset-pipeline\README.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\asset-pipeline\cli.mjs`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\asset-pipeline\lib\asset-taxonomy.mjs`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\asset-pipeline\lib\cleanup-method-registry.mjs`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\scripts\asset-pipeline\lib\provenance-contract.mjs`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\runtime\TINY_GOBLIN_ACADEMY_H6_3_BUTTON_GOBLIN_BACKGROUND_STAGE_INTEGRATION.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\runtime\TINY_GOBLIN_ACADEMY_H6_3B_BUTTON_GOBLIN_VECTOR_ACTOR_RIG_PREVIEW.md`
- `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\docs\runtime\TINY_GOBLIN_ACADEMY_H6_3C_BUTTON_GOBLIN_LIVE_GOBLIN_RIG_INTEGRATION.md`
- Representative manifests under `C:\Users\kryst\Workspace\game-development\ai-game-studio-ladder\manifests\academy\creatures`, `manifests\academy\games`, and `manifests\academy\runtime\planning`

Hatch Pet and Aster evidence inspected:

- `C:\Users\kryst\.codex\skills\hatch-pet\SKILL.md`
- `C:\Users\kryst\.codex\skills\hatch-pet\references\codex-pet-contract.md`
- `C:\Users\kryst\.codex\skills\hatch-pet\references\animation-rows.md`
- `C:\Users\kryst\.codex\skills\hatch-pet\references\qa-rubric.md`
- `C:\Users\kryst\.codex\skills\hatch-pet\scripts\*.py`
- `C:\Users\kryst\.codex\skills\hatch-pet\tests\*.py`
- `C:\Users\kryst\.codex\pet-runs\pet_request.json`
- `C:\Users\kryst\.codex\pet-runs\imagegen-jobs.json`
- `C:\Users\kryst\.codex\pet-runs\prompts\`
- `C:\Users\kryst\.codex\pet-runs\decoded\`
- `C:\Users\kryst\.codex\pet-runs\frames\`
- `C:\Users\kryst\.codex\pet-runs\qa\`
- `C:\Users\kryst\.codex\pet-runs\final\`
- `C:\Users\kryst\.codex\pets\aster\pet.json`
- `C:\Users\kryst\.codex\pets\aster\validation.json`

## Reconstructed TGA Pipeline

Current TGA doctrine is:

```text
intake
-> classification
-> alpha/background audit
-> region/frame/anchor mapping
-> evidence creation
-> human review
-> cleanup decision
-> derived cleanup candidate
-> validation
-> runtime planning
-> bounded runtime approval
-> evidence
-> promotion
```

The strongest current TGA principles are:

- Source PNGs remain untouched.
- Cleanup and normalization happen in derived outputs.
- Mapping and cleanup are not runtime approval.
- Runtime wiring is its own H6 lane.
- Asset class matters before tooling is chosen.
- Mixed sheets are split into lanes instead of forced into one manifest.
- Evidence is required before review.
- Human review approves pixels, not future gameplay.
- `pipeline-run-log.json` and `pipelineRun` provenance are required for future H5.67+ generated manifests.
- The canonical CLI owns common commands: `inspect-source`, `make-evidence`, `map-grid-batch`, `cleanup-candidate`, `validate`, `validate-provenance`, and `write-run-log`.

Current automation level:

| Lifecycle part | Current TGA maturity |
| --- | --- |
| Intake | Manifest- and doctrine-driven; still often human initiated. |
| Classification | Strong taxonomy in `asset-taxonomy.mjs`; script-assisted through lane profiles. |
| Alpha/background audit | Script-assisted and convention-heavy; good doctrine around fake checkerboard. |
| Region mapping | Strong for grids/regions/background anchors; partially automated. |
| Human review | Strong vocabulary and records; intentionally human. |
| Cleanup decision | Strong registry policy; individual methods vary in maturity. |
| Validation | Strong repo validators and provenance validator; hard provenance not yet universal. |
| Runtime planning | Strong H6 planning manifests and docs. |
| Runtime approval | Strong narrow-approval doctrine; H6.3 proves one asset can graduate without approving the pantry. |
| Evidence | Strong for static/region/background and runtime screenshots; weaker for animation motion previews. |
| Promotion | Strong in wording and manifests; still manually staged. |

TGA's main weaknesses for generated animation are not governance weaknesses. They are production-orchestration gaps: no first-class generation job graph, no standard canonical identity reference field, limited animation-specific row QA, limited motion-preview standardization, no explicit repair taxonomy, and no convergence policy for repeated generated-row failures.

## Reconstructed Hatch Pet / Aster Pipeline

Hatch Pet doctrine is:

```text
concept
-> run scaffold
-> canonical identity image
-> visual generation job graph
-> generated action rows
-> incremental row extraction
-> deterministic inspection
-> optional derivation
-> standard atlas
-> motion QA
-> cardinal direction anchors
-> coherent direction rows
-> direction registration
-> semantic and continuity QA
-> chroma removal/despill
-> final atlas validation
-> package
-> retained audit artifacts
```

Aster's concrete run contains:

- `pet_request.json` as the production request and pet contract.
- `imagegen-jobs.json` as a visual job graph with dependencies, prompts, output paths, identity references, derivation policy, and mirror policy.
- `references\canonical-base.png` as the canonical identity image.
- Prompt files for base image, standard rows, look rows, and retries.
- Decoded generated row sheets under `decoded\`.
- Extracted per-frame PNGs under `frames\`.
- Deterministic standard-row inspection in `qa\review.json`.
- Running-left derived from running-right with a recorded mirror decision.
- Standard and extended contact sheets.
- GIF previews for standard animation rows.
- Cardinal look anchors and look-row registration.
- Direction contact sheet and continuity measurement.
- Final atlas, final WebP, despill report, and validation JSON.
- Packaged pet under `C:\Users\kryst\.codex\pets\aster`.

Separate responsibilities:

| Responsibility | Hatch Pet mechanism |
| --- | --- |
| Image generation | `$imagegen` jobs, grounded by canonical image and layout guides. |
| Deterministic processing | Frame extraction, row inspection, mirroring, atlas composition, registration, despill, validation. |
| Semantic QA | Row semantics, motion previews, look mechanics, cardinal anchors, direction continuity. |
| Human judgment | Cardinal rejection/regeneration and visual acceptance of continuity warnings. |
| Packaging | `pet.json`, `spritesheet.webp`, package validation. |
| Cleanup | One final authoritative chroma/despill pass after atlas assembly. |

The important maturity gain is that Hatch Pet makes generation itself inspectable. It does not rely on the generated image being good because it looks good once in chat.

## Domain Comparison Matrix

| Domain | Classification | Evidence |
| --- | --- | --- |
| Source identity / canonical reference | Hatch Pet stronger | Aster has `references\canonical-base.png` and every grounded row job references it. TGA has identity assets and actor doctrine, but not a standard generated-character identity-reference contract. |
| Job/run manifest | Hatch Pet stronger | `imagegen-jobs.json` records visual jobs, dependencies, prompt paths, outputs, source paths, and derivation policies. TGA has `pipeline-run-log.json` doctrine but not generation-job orchestration. |
| Dependency graph | Hatch Pet stronger | Look rows depend on cardinals; running-left depends on running-right; standard rows depend on base. TGA lane order is doctrinal and manifest-driven, but not represented as a visual DAG. |
| Prompt provenance | Hatch Pet stronger | Prompt files are retained per base/row/retry. TGA has prompt shelves and provenance plans, but not a universal prompt-to-output graph for generated assets. |
| Generated-source preservation | Complementary | Hatch keeps decoded outputs and source paths to generated image cache. TGA preserves pantry sources and forbids mutation. TGA would need to retain generated prompts/source sheets with run-log hashes. |
| Source-sheet preservation | TGA stronger | TGA explicitly forbids source PNG mutation and routes cleanup to derived paths. Hatch preserves decoded generated sheets, but source cache cleanup policy is Codex-specific and less integrated with repo provenance. |
| Chroma-key selection | Hatch Pet stronger for pet-style generated atlases | Aster uses explicit `#FF00FF` and validates zero chroma residue. TGA has color-key cleanup only as pilot/experimental and correctly avoids assuming it for all lanes. |
| Alpha truth | TGA stronger generally | TGA's alpha/fake-checkerboard doctrine is broader across asset classes. Hatch is strong for its own chroma-key contract but assumes a pet-generation setup. |
| Region/frame extraction | Hatch Pet stronger for fixed animation rows; TGA stronger for mixed sheets | Hatch extracts fixed frames deterministically. TGA maps arbitrary regions, grids, anchors, and mixed assets. |
| Shared scale and baseline normalization | Hatch Pet stronger | `assemble_extended_atlas.py` and tests enforce shared scale behavior for look rows. TGA animation lane says baseline/scale matter, but tooling is not as complete. |
| Stable anchor geometry | Complementary | TGA has scene anchors and runtime placement boundaries. Hatch has fixed cell geometry and registration. They solve different anchor types. |
| Row/state semantics | Hatch Pet stronger for animation; TGA stronger for broad taxonomy | Hatch rows are exact animation states. TGA taxonomy distinguishes asset classes but animation sequence contracts are lighter. |
| Animation continuity | Hatch Pet stronger | GIF previews, row inspection, continuity metrics, and row-specific tests exist. TGA has `make-animation-evidence.py` and animation manifests but weaker standard acceptance gates. |
| Direction semantics | Hatch Pet stronger | Cardinal anchors, 16-direction rows, look mechanics, direction QA, and blind QA scripts/tests are first-class. TGA only needs this for assets with directional meaning. |
| Component connectivity | Hatch Pet stronger for atlas cells | `validate_atlas.py` and frame inspection reason about cells/components. TGA validates rects and manifests but not as deeply for animated silhouettes. |
| Clipping and edge checks | Hatch Pet stronger for generated pet cells | Tests reject out-of-cell look-row scaling. TGA has region-bounds validation but not as much animation-cell edge pressure. |
| Interior transparent-hole detection | Hatch Pet stronger | Aster continuity report explicitly warns on transparent interior holes. TGA doctrine warns about holes/open interiors, but checks are not as uniformly automated. |
| Cleanup/despill ownership | Complementary | TGA has a cleanup method registry and provenance contract. Hatch has a tested single final chroma/despill pass. TGA should register/adapt the method, not bypass its registry. |
| Contact-sheet evidence | Equivalent | Both produce contact-sheet evidence. Hatch does it for final animation atlas; TGA does it for regions and cleanup lanes. |
| Motion-preview evidence | Hatch Pet stronger | GIF previews exist for Aster standard rows. TGA runtime screenshots are strong, but asset-prep motion previews are not yet central. |
| Blind or independent QA | Hatch Pet stronger in doctrine/tests | Hatch has blind direction QA scripts and consensus tests. Aster itself appears to have abbreviated this stage. TGA has human review but no blind directional QA concept. |
| Failure classification | Hatch Pet stronger | Skill doctrine distinguishes repair/regenerate/derive/resynthesize. TGA records warnings and review status, but has less explicit generated-animation failure taxonomy. |
| Retry/repair policy | Hatch Pet stronger | Row retries and repair prompts exist. TGA cleanup methods have caution statuses, but generated repair loops are not formalized. |
| Convergence and cycle detection | Hatch Pet stronger in concept | Hatch has explicit repair boundaries and tests for acceptance policy; TGA lacks a named convergence-failure policy. |
| Deterministic vs generative repair | Hatch Pet stronger for animation | Running-left derivation records deterministic mirroring; look rows require coherent synthesis. TGA has deterministic cleanup doctrine but not animation-generation repair decisions. |
| Promotion/runtime approval | TGA stronger | H6.3 and H6.3C demonstrate narrow runtime approval and pending review states. Hatch package validation approves a Codex pet package, not TGA runtime. |
| Packaging contract | Hatch Pet stronger for pet packages; TGA stronger for runtime gates | Hatch has exact `pet.json` and atlas dimensions. TGA should not import pet packaging, but can adopt "packaging candidate" as a pre-runtime artifact. |
| Retained audit artifacts | Complementary | Aster retains many run artifacts. TGA has stronger repo-side evidence conventions and provenance fields. |
| Temporary artifact cleanup | TGA stronger generally | TGA has source/derived/evidence discipline. Hatch has storage guidance, but Aster still records source paths into generated-image cache and keeps many decoded assets. |
| Test coverage | Hatch Pet stronger for animation processing; TGA stronger for repo validators | Hatch tests despill, atlas assembly, direction acceptance, and blind consensus. TGA tests manifests, provenance, hub icons, and smoke checks. |
| CLI ergonomics | TGA stronger as repo pipeline | TGA has a canonical CLI command surface. Hatch has specialized scripts but no general user-facing CLI wrapper. |
| Reproducibility | Complementary | Hatch can mostly reproduce final package from retained decoded artifacts and scripts. TGA can prove provenance when run logs exist. Aster's pending look job statuses weaken perfect reproducibility. |
| Suitability for batch production | TGA stronger across asset classes; Hatch stronger for one pet class | TGA has lanes for broad production. Hatch is deep but narrow. |

## Transferable Practices

### A. Adopt Generally

1. Add a generation-run manifest for generated assets.
   - Problem solved: generated outputs currently lack a first-class job graph.
   - Asset classes affected: all generated source assets, especially animated characters, FX, UI concepts, and backgrounds.
   - Proposed artifact: `generation-run.json` or `visual-generation-run.json` linked from `pipelineRun`.
   - Hatch evidence: Aster's `imagegen-jobs.json`.
   - Fit with TGA: complements H5.67 run-log provenance.
   - Cost: low to document, medium to validate.
   - Overengineering risk: low if optional for non-generated assets.
   - Sequence: Tier A doctrine first.

2. Add canonical identity references for generated recurring characters.
   - Problem solved: multiple generations drift unless tied to an approved seed.
   - Asset classes affected: characters, enemies, pets, NPCs, segmented rigs, brand mascots.
   - Proposed artifact: `canonicalIdentityReference` field in animation/creature manifests.
   - Hatch evidence: `references\canonical-base.png` used by all Aster grounded row jobs.
   - Fit with TGA: aligns with Button Goblin rig/skin doctrine and creature animation manifests.
   - Cost: low.
   - Overengineering risk: medium if forced onto one-off props.
   - Sequence: before generated animated-character integration.

3. Retain prompt and decoded-source provenance for generated assets.
   - Problem solved: future agents cannot reconstruct what produced a sheet.
   - Asset classes affected: generated source sheets and generated replacements.
   - Proposed artifact: `prompts\`, `decoded\`, and source hash/source path records inside evidence lane.
   - Hatch evidence: Aster retains base/row/retry prompts and decoded outputs.
   - Fit with TGA: extends H5.67 provenance beyond deterministic CLI operations.
   - Cost: low to medium.
   - Overengineering risk: low if retained only for generated lanes.
   - Sequence: Tier A doctrine, Tier B validator later.

4. Add explicit repair classification.
   - Problem solved: "try again" hides whether repair is deterministic, generative, semantic, or abandonment.
   - Asset classes affected: generated assets and cleanup candidates.
   - Proposed artifact: `repairClassification` and `repairDecision` fields.
   - Hatch evidence: mirror derivation, row retry prompts, cardinal repair prompts, and coherent look-row policy.
   - Fit with TGA: complements cleanup method registry and review warnings.
   - Cost: low.
   - Overengineering risk: low.
   - Sequence: Tier A doctrine.

5. Retain motion-preview evidence for animation lanes.
   - Problem solved: still contact sheets do not prove cadence, loop readability, or state motion.
   - Asset classes affected: character, enemy, pet, FX loops, vector actor previews.
   - Proposed artifact: GIF/WebM previews plus sequence contact sheet.
   - Hatch evidence: Aster `qa\previews\*.gif`.
   - Fit with TGA: extends current evidence doctrine; H6.3B already made a preview sequence sheet.
   - Cost: medium.
   - Overengineering risk: low for animations, high for static assets.
   - Sequence: Tier B.

### B. Adopt Only for Animated Character Assets

- Semantic animation state contracts: required for character/enemy/pet animation sheets and segmented rigs, not for static props.
- Shared scale and foot-baseline normalization: required for walk/run/jump/idle cycles, less useful for UI and backgrounds.
- Frame cadence checks: required for loops and state transitions, optional for pose-symbol sheets.
- Left/right mirror safety decisions: useful only where direction can be semantically mirrored.
- Cardinal anchor generation: useful only for top-down/directional characters or gaze mechanics.
- Direction semantics and adjacent direction continuity: useful for look/aim/walk direction sets, unnecessary for most TGA assets.
- Blind directional QA: useful when direction meaning is easy to self-deceive; unnecessary for props/backgrounds.

### C. Do Not Import

- Codex-specific row meanings such as `review`, `waiting`, or `failed` as mandatory TGA animation states.
- Mandatory 8 x 11 atlas geometry.
- Fixed 192 x 208 cells.
- `pet.json` packaging.
- Mandatory 16-direction gaze rows.
- Chroma-key extraction when native alpha, source-region mapping, or regenerated true-alpha source is better.
- Full Hatch-level QA for static props, UI buttons, tile sheets, wall sheets, and backgrounds.
- Pet package validation as runtime approval.
- Single-character companion assumptions for mixed sheets or code-authored vector actors.

## Asset-Class Applicability Matrix

| Asset class | Useful Hatch concepts | Not applicable | Proposed validation level | Evidence burden | Promotion gate |
| --- | --- | --- | --- | --- | --- |
| Background-stage assets | Generation-run manifest if generated; prompt/source retention; final cleanup record if edited. | Frame extraction, row semantics, direction QA. | Metadata, alpha/background audit, anchor map, runtime screenshot. | Anchor overlay, browser evidence, readability screenshots. | Narrow H6 runtime approval per game/role. |
| Static props | Source preservation, decoded-source retention, cleanup method, contact sheet. | Motion previews, direction rows, baseline normalization. | Rect bounds, alpha, cleanup provenance. | Numbered contact sheet and before/after cleanup if needed. | Reviewed for draft use; later placement/runtime gate. |
| UI/HUD assets | Prompt provenance for generated UI concepts; textless/source variant retention. | Pet rows, motion cadence, cardinal anchors. | Text risk, responsive fit, alpha/holes. | Region sheet, table preview, UI mock/runtime screenshot. | UI integration lane, not asset prep. |
| Tile/terrain sheets | Deterministic extraction, grid validation, source retention. | Identity reference, look mechanics, row states. | Grid consistency, tile bounds, adjacency risk. | Numbered tile sheet, map preview if useful. | Tilemap/runtime planning lane. |
| Wall/boundary sheets | Deterministic extraction, edge/clipping checks. | Pet packaging, direction gaze. | Bounds, wall continuity, collision-planning metadata. | Contact sheet plus collision/layout preview. | Runtime collision/planning gate. |
| FX sheets | Motion previews, prompt provenance, repair classification. | Foot baselines, pet state rows, chroma-destructive cleanup by default. | Loop readability, alpha softness, edge risk. | GIF/WebM preview plus alpha risk sheet. | FX-specific runtime approval. |
| Character animation sheets | Canonical identity, visual job graph, row/state contract, frame extraction, baseline normalization, motion previews. | Codex row names and fixed atlas geometry. | Full animation manifest validation plus visual QA. | Contact sheet, motion preview, baseline/scale report, repair decisions. | Animation runtime proposal after review. |
| Enemy animation sheets | Same as character sheets, plus hurt/hit state semantics. | Pet look rows unless enemy needs aim/gaze. | Full animation validation and gameplay-state mapping. | Motion previews and state table. | Enemy runtime integration lane. |
| Pet animation sheets | Highest Hatch transfer: identity, state rows, motion previews, direction semantics if needed. | Codex package contract unless targeting Codex UI. | Full animation validation. | Contact sheet, GIFs, state/interaction notes. | Pet game integration lane. |
| Code-authored vector actors | Semantic state contract, canonical identity, motion evidence, baseline/hit-area evidence. | Chroma/despill, source-sheet extraction, fixed atlas. | Runtime tests, preview evidence, hit-area verification. | Screenshots/sequence sheet and interaction states. | H6-style preview approval before live integration. |
| Segmented sprite rigs | Identity reference, part manifest, baseline/pivot contracts, motion previews. | Whole-atlas pet package. | Part bounds, pivot/hitbox validation, runtime preview. | Part contact sheet plus rig preview. | Rig preview approval, then live integration. |
| Mixed sheets | Run/source preservation and split-lane classification. | One Hatch pipeline for all parts. | Classify first; validate each lane separately. | Split-lane reports. | No promotion until each lane has its own review status. |

## Aster Artifact Audit

Planned artifacts that exist:

- Request: `pet_request.json`.
- Visual job graph: `imagegen-jobs.json`.
- Canonical identity: `references\canonical-base.png`.
- Layout guides: `references\layout-guides\*.png`.
- Prompt files: `prompts\base-pet.md`, `prompts\rows\*.md`, `prompts\row-retries\*.md`, look repair prompts.
- Decoded generated sheets: `decoded\*.png`.
- Extracted frames: `frames\`.
- Standard review: `qa\review.json`.
- Contact sheets: `qa\contact-sheet.png`, `qa\contact-sheet-extended.png`.
- Motion previews: `qa\previews\*.gif`.
- Look mechanics: `qa\look-mechanics.md`.
- Direction evidence: `qa\look-directions.png`, `qa\look-continuity.json`.
- Final atlas and package candidates: `final\spritesheet.png`, `final\spritesheet.webp`, `final\spritesheet-despilled.png`.
- Despill report: `final\despill-report.json`.
- Extended validation: `final\validation-extended.json`.
- Packaged pet: `C:\Users\kryst\.codex\pets\aster\pet.json`, `spritesheet.webp`, and `validation.json`.

Artifacts or stages that appear absent or abbreviated:

- `imagegen-jobs.json` still marks `look-cardinals`, `look-row-9`, and `look-row-10` as `pending` even though the outputs exist. The run is materially complete, but the job graph was not fully reconciled.
- No separate blind direction QA verdict artifact was found in the Aster run folder, despite Hatch Pet having blind QA scripts/tests.
- No formal direction semantic verdict JSON was found beyond `look-continuity.json` and the visual direction sheet.
- The first rejected cardinal attempt is not retained as a clearly named failed artifact in the run folder; only the accepted cardinal assets are obvious.
- Aster's continuity result is `ok: true` but `reviewRequired: true`, with transparent interior-hole warnings and several local outlier warnings.
- The final `pet.json` records that warnings were accepted for this custom pet, but that acceptance is not a standalone signed review artifact.

Warnings that matter:

- `qa\look-continuity.json` reports transparent interior hole rows in multiple directions.
- It reports local outliers including `157.5->180`, `225->247.5`, and `337.5->000`.
- It reports high area ratios around `157.5->180`, `180->202.5`, and `337.5->000`.
- These were accepted by judgment because the direction loop remained visually readable, not because the warnings disappeared.

Reproducibility judgment:

Aster is substantially reproducible from retained decoded artifacts, prompts, scripts, and final reports. It is not perfectly audit-clean by TGA standards because the job graph still has pending look jobs, some ideal QA artifacts are absent, and manual acceptance is embedded in package notes rather than a separate review record.

Cleanup judgment:

The authoritative final despill pass did run and passed validation. `despill-report.json` shows `alpha_preserved: true`, zero rejected pixels, and 160,558 changed pixels. `validation-extended.json` and packaged `validation.json` report correct v2 atlas geometry, RGBA/WebP support, no errors, and no warnings. This is a real production pass, but TGA should route any equivalent method through its cleanup-method registry and provenance contract.

## Maturity Roadmap

### Tier A - Immediate Doctrine / Documentation

1. Document generated-asset run manifests.
   - Problem solved: TGA distinguishes source/provenance well but does not yet name generation as its own run object.
   - Asset classes affected: generated character sheets, generated FX, generated UI concepts, regenerated true-alpha sources.
   - Proposed artifact: `docs/assets/pipeline/contracts/TINY_GOBLIN_ACADEMY_GENERATED_ASSET_RUN_CONTRACT.md`.
   - Why Hatch demonstrates need: Aster's `imagegen-jobs.json` made dependencies, prompt files, and outputs inspectable.
   - Fit: Extends H5.67 provenance without replacing it.
   - Cost: low.
   - Risk of overengineering: low if the contract is optional outside generated lanes.
   - Sequence: first.

2. Add vocabulary for canonical identity references and semantic animation states.
   - Problem solved: animated characters need identity continuity and state language before generation.
   - Asset classes affected: characters, enemies, pets, segmented rigs, vector actor skins.
   - Proposed artifact: glossary update in asset workflow docs.
   - Why Hatch demonstrates need: Aster stayed coherent because every row referenced a canonical base.
   - Fit: Supports H6.3B rig/skin doctrine.
   - Cost: low.
   - Risk: low.
   - Sequence: alongside Tier A contract.

3. Add explicit non-transfer rule.
   - Problem solved: prevents future agents from applying pet QA to every asset.
   - Asset classes affected: all.
   - Proposed artifact: short "Hatch-derived practices are animation-lane tools, not universal law" note in the asset system plan.
   - Why Hatch demonstrates need: Hatch is extremely deep but intentionally narrow.
   - Fit: Reinforces TGA's taxonomy-first doctrine.
   - Cost: low.
   - Risk: none.
   - Sequence: immediate.

### Tier B - Small Reusable Tooling Improvements

1. Extend animation evidence generation.
   - Problem solved: TGA has contact/screenshot evidence but needs standard motion previews before animation review.
   - Asset classes affected: character, enemy, pet, FX.
   - Proposed script: extend `scripts\asset-pipeline\make-animation-evidence.py` or wrap it through `cli.mjs`.
   - Why Hatch demonstrates need: Aster's GIF previews make motion review possible without loading a runtime.
   - Fit: Adds evidence, not runtime wiring.
   - Cost: medium.
   - Risk: low.
   - Sequence: before true raster character integration.

2. Register a final-atlas despill method.
   - Problem solved: generated chroma sheets need a tested edge-cleanup path that does not become an inline script.
   - Asset classes affected: generated character/pet/enemy sheets using chroma backgrounds.
   - Proposed artifact/script: `chroma-edge-despill-final-atlas` cleanup method and report schema.
   - Why Hatch demonstrates need: Aster's single final despill is well-tested and produced a measurable report.
   - Fit: Must enter TGA through cleanup-method registry.
   - Cost: medium.
   - Risk: medium if used on FX or soft-shadow assets.
   - Sequence: only after doctrine warns where not to use it.

3. Add animation repair classification fields.
   - Problem solved: repeated generated repairs need a clear stop/continue/derive decision.
   - Asset classes affected: generated animation sheets and segmented rigs.
   - Proposed manifest fields: `repairClassification`, `repairAttempt`, `repairLimit`, `convergenceStatus`.
   - Why Hatch demonstrates need: Aster's mirror decision and cardinal regeneration were different repair classes.
   - Fit: Complements TGA review warnings.
   - Cost: low to medium.
   - Risk: low.
   - Sequence: after Tier A vocabulary.

### Tier C - Future Generation-Run Orchestration

1. Build a visual-job DAG runner only after Tier A/B prove useful.
   - Problem solved: large generated character batches need dependency-aware execution and artifact reconciliation.
   - Asset classes affected: generated character/enemy/pet sheets and possibly FX packs.
   - Proposed script: `scripts\asset-pipeline\generate-visual-run.mjs` or similar, but only after contract stabilization.
   - Why Hatch demonstrates need: Aster's `imagegen-jobs.json` is the missing shape.
   - Fit: Would sit above existing CLI and emit standard run logs/manifests.
   - Cost: high.
   - Risk: high if it becomes a parallel pipeline.
   - Sequence: much later.

2. Add optional blind directional QA.
   - Problem solved: direction meaning is easy to self-confirm when the reviewer knows the intended order.
   - Asset classes affected: directional characters, aim/look loops, top-down enemies.
   - Proposed script: direction-pair sheet plus verdict combiner.
   - Why Hatch demonstrates need: Hatch has scripts/tests for blind directional review, even though Aster's actual run appears abbreviated.
   - Fit: Optional animation-lane evidence, never static-asset law.
   - Cost: medium.
   - Risk: medium if used too broadly.
   - Sequence: after at least one TGA directional character needs it.

## Unified Vocabulary

| Recommended term | Meaning | Rename existing TGA term? |
| --- | --- | --- |
| Canonical identity reference | Approved visual seed used to ground future generated character outputs. | No; add as new generated-character field. |
| Generation run | A bounded image-generation production attempt with retained request, prompts, decoded outputs, and reports. | No. |
| Visual job | One generation/derivation step inside a generation run. | No. |
| Dependency graph | Declared ordering between visual jobs and deterministic processing steps. | No. |
| Decoded source | Generated image copied into the run folder before extraction/normalization. | No. |
| Deterministic derivative | Output made by script from existing assets, such as mirrored frames or assembled atlases. | No. |
| Semantic animation state | Named state whose frames carry gameplay/UI meaning, such as idle, run, bonk, defeat. | Add alongside existing animation manifests. |
| Shared baseline | Common ground/foot/pivot reference across animation frames or actor states. | No. |
| Continuity evidence | Contact sheets, GIFs, metrics, or screenshots proving frame-to-frame/state-to-state coherence. | Add as evidence subtype. |
| Repair classification | Label distinguishing deterministic repair, generative retry, semantic resynthesis, manual acceptance, or abandoned attempt. | No. |
| Convergence failure | Repeated repair attempts fail to improve or cycle between defects. | No. |
| Packaging candidate | Valid assembled asset package that is not yet runtime-approved. | Add as pre-runtime term. |
| Runtime candidate | Asset package proposed for a bounded runtime lane. | Add carefully; do not replace `not-runtime-approved`. |
| Promoted runtime asset | Asset approved for one explicit runtime role and scope. | Align with H6 narrow runtime approval. |

## Top Five Recommendations

1. Add generated-asset run doctrine before further generated animated-character integration.
   - Timing: before further H6 runtime integration that introduces generated raster actors.
   - Why: TGA needs Aster's job-graph clarity before a generated creature becomes runtime material.

2. Add canonical identity reference fields for recurring/generated characters.
   - Timing: during animated-character integration.
   - Why: this is the lowest-cost, highest-value guard against visual drift.

3. Add motion-preview evidence as a normal animation-lane requirement.
   - Timing: during animated-character integration.
   - Why: still sheets are not enough to review animation cadence.

4. Register/adapt a final-atlas despill method instead of using ad hoc chroma cleanup.
   - Timing: after Tier 1.5 visual integration, before any chroma-generated raster character is promoted.
   - Why: Hatch shows the value of one authoritative final pass, but TGA must keep cleanup registry/provenance law.

5. Add repair classification and convergence language.
   - Timing: after Tier 1.5 visual integration or during the first generated-character production lane.
   - Why: it prevents "just regenerate again" from becoming invisible pipeline debt.

## Immediate Implementation Impact

No TGA implementation should change immediately because of this audit.

H6 should keep moving through the current bounded runtime sequence. The comparison supports strengthening doctrine and animation evidence before future generated raster-character work; it does not justify interrupting H6.3C or replacing the current code-authored Button Goblin rig with a Hatch-like sprite atlas.

## Proposed Next Action

Review this audit, then open a small Tier A documentation lane:

```text
TGA Generated Asset Run Contract
```

Scope for that lane should be docs only: define generation-run manifests, canonical identity references, retained prompt/decoded-source expectations, repair classifications, and non-transfer rules. Tooling should wait until that contract proves useful.
