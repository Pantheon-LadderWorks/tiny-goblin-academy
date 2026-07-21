# Tiny Goblin Academy H6.18 External Evidence Output Foundation

**Status:** implementation complete; automated validation passed; human technical review passed; H6.18A closure approved
**Baseline:** `2e376c22f5c96e2f59c30b2de58cbb08e41203d7`
**Scope:** future heavy generated runtime/playtest evidence only

## Result

H6.18 implements the active replacement evidence architecture selected after the GitHub LFS blocker. Existing tracked evidence remains grandfathered in ordinary Git at its current paths. Future heavy generated runtime/playtest evidence now resolves through one verified external-output authority before a browser or development server starts.

The implementation does not create a second repository, clone, worktree, submodule, junction, symlink, hardlink, LFS pointer workflow, history rewrite, or synchronization protocol. Card Goblin Duel visual integration did not begin.

## Physical storage preflight

The approved external volume passed all required checks:

- volume label: `The Void`;
- volume serial: `F60EFF6E`;
- filesystem: `exFAT`;
- minimum free-space requirement: 5 GiB;
- observed free space during implementation: more than 1.45 TB;
- bounded root listing: passed;
- bounded create/read/hash/delete probe: passed;
- probe bytes: 46;
- probe SHA-256: `a4b117936a8abd8d033ae436701a889a2cff5c622bf2be239f20ec23d3e7c760`.

The tracked record uses `TGA_EVIDENCE_ROOT`; portable manifests do not contain the absolute local root.

## Shared resolver and command surface

The dependency-free implementation lives under `tools/evidence/` and provides:

- environment-root override through `TGA_EVIDENCE_ROOT`;
- ignored local configuration for physical identity and default root;
- no repository-relative or silent fallback;
- physical label, serial, filesystem, free-space, read, write, and containment checks;
- strict game/lane/run identifiers and filename sanitization;
- current Level 01–04 roots plus `future/<game-id>` routing for later levels;
- collision-refusing run directories and portable manifests;
- exact byte counts, SHA-256 hashes, media types, source commit, capture configuration, review state, and external-availability state;
- external manifests with local recovery details and portable manifests without absolute local paths.

The repository commands are:

```text
pnpm evidence:init
pnpm evidence:doctor
pnpm evidence:where
pnpm evidence:verify --manifest <path>
pnpm validate:evidence-storage
```

The actual local configuration is ignored at exactly `tools/evidence/evidence.local.json`. The tracked example contains placeholders only. No dependency was added, and `pnpm-lock.yaml` remained byte-identical.

## Capture-script audit

The authoritative 28-script inventory is classified in `docs/evidence/h6-18-external-evidence-output-foundation/capture-script-audit.json`:

- A — active heavy runtime/playtest capture: 9;
- B — lightweight-only capture: 0;
- C — production or source generation: 3;
- D — closed historical or unused tooling: 16.

Only the nine category-A generic capture scripts were modified. They now prepare the verified external run before Vite, Chromium, or another capture process starts, preserve the existing URLs, viewport choices, interaction sequences, timing, and filenames, and finalize a portable manifest afterward.

Category-C asset mapping, cleanup, and source/derived generation remain exclusively governed by `scripts/asset-pipeline/cli.mjs`, its registered cleanup-method registry, provenance contract, run-log helper, and validators. Category-C and category-D files are hash-pinned and unchanged. `tools/evidence/` exposes no asset cleanup, mapping, source-generation, or pixel-editing route.

## Synthetic smoke rehearsal

The real external-output rehearsal created one collision-safe run at portable identity:

`system/smoke-tests/h6-18-external-output-foundation/h6-18-smoke-001`

The run contains:

- `stills/synthetic-proof.png` — 69 bytes — SHA-256 `167d5cbdd920fa2e5f6beea7fc4f8df1552207322578560e0abcb002f54e4186`;
- `telemetry.json` — 92 bytes — SHA-256 `105d1bedc47d1ffab2fdc9d51ad316cca9e318ae3187707e2cd2a940469b3d75`;
- external `external-manifest.json` with local recovery details;
- tracked `docs/evidence/h6-18-external-evidence-output-foundation/portable-smoke-manifest-h6-18-smoke-001.json` without an absolute local path.

`pnpm evidence:verify` independently re-read and verified both external files. Reusing the same run ID failed with exit code 1 at the collision boundary, and all existing run and portable-manifest hashes remained unchanged.

## Validation result

- focused evidence tests: 37/37 passed, including filesystem/writeability/filename refusal, adapter-resolution, placeholder-only config, asset-pipeline isolation, and pre-finalization manifest-collision coverage;
- evidence-storage validation: passed;
- grandfathered tracked binaries verified: 795;
- current added candidates checked: 13 at closure validation;
- canonical asset-pipeline CLI validation: passed;
- canonical asset-pipeline smoke check: passed;
- asset CLI, cleanup registry, provenance contract, run-log helper, smoke check, and protected generators: byte-identical;
- package dependencies: unchanged;
- `pnpm-lock.yaml`: unchanged;
- `.gitattributes`: absent;
- LFS-backed files and local LFS object bytes: zero;
- all ten unaffected workspace packages: passed;
- One Room Platformer legacy simulation suite: 13/13 failed as a pre-existing baseline contract mismatch.

The One Room Platformer failure is outside H6.18: its committed test imports `tick` and `GEOMETRY`, which its committed simulation module does not export, and expects the former `(60, 352)` initial position while the committed module now initializes at `(0, 0)` for later Phaser synchronization. The simulation source, simulation test, and package metadata are byte-identical to `HEAD`; only the two standalone capture scripts changed, and the stale test does not import them. H6.18 does not alter gameplay authority to repair that unrelated baseline drift.

## H6.18A human technical review closure

The Architect reviewed and approved the external-heavy-evidence foundation. The review confirms the physical-volume guard, resolver precedence, absence of repository fallback, collision/traversal/filename refusal, portable manifests, byte and SHA-256 verification, grandfathered-evidence protection, 2 MiB compact-proof boundary, A9/B0/C3/D16 script classification, category-A-only redirection, canonical asset-pipeline sovereignty, preservation of partial failed runs, real synthetic smoke result, dependency/lockfile stability, and absence of runtime or gameplay changes.

```yaml
externalEvidenceRootConfiguredLocally: true
physicalVolumeGuardImplemented: true
evidenceResolverImplemented: true
externalManifestContractImplemented: true
grandfatheredEvidenceGuardImplemented: true
activeHeavyCaptureScriptsRedirected: true
activeHeavyCaptureScriptCount: 9
lightweightOnlyScriptCount: 0
productionSourceGenerationScriptCount: 3
historicalInactiveScriptCount: 16
captureScriptInventoryCount: 28
focusedEvidenceTestsPassed: 37
grandfatheredTrackedBinariesVerified: 795
syntheticSmokeRunPassed: true
duplicateRunRefused: true
portableManifestContainsAbsoluteRoot: false
assetPipelineBoundaryProtected: true
assetPipelineValidationPassed: true
assetPipelineSmokePassed: true
legacyTrackedEvidenceMoved: false
legacyTrackedEvidenceRewritten: false
lfsArchitectureAdopted: false
dualCheckoutImplemented: false
futureHeavyEvidenceRedirectionImplemented: true
humanTechnicalReviewPassed: true
knownOutOfLaneBaselineFailure: true
oneRoomPlatformerBaselineSuitePassing: false
h6_18IntroducedWorkspaceRegression: false
oneRoomPlatformerCorrectionAuthorized: false
cardGoblinDuelStarted: false
```

The committed One Room Platformer test, simulation, and package files remain byte-identical to the H6.18 baseline. Its isolated suite still reproduces 13/13 failures because the test expects `tick`, `GEOMETRY`, and the older initial position while the committed module exposes a different contract. This finding does not block H6.18 and is not corrected in this lane.

## Stop boundary

No existing evidence was moved, deleted, renamed, compressed, deduplicated, or rewritten. No source asset or production asset was changed. No asset-pipeline cleanup or mapping method was added. No gameplay, simulation, presentation, Hub/Tauri behavior, dependency, lockfile, history rewrite, LFS object, or publication architecture changed. H6.18A authorizes only the reviewed ordinary-Git commit and fast-forward publication.

H6.18 makes the future-heavy external-output policy operational for the audited active runtime/playtest capture surface. Its human technical review is approved. It does not approve a later game lane or visual integration.
