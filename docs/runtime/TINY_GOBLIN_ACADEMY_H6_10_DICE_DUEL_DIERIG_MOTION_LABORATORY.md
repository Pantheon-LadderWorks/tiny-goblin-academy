# Tiny Goblin Academy H6.10 — Dice Duel Tavern Persistent DieRig Motion Laboratory

Date: 2026-07-18
Baseline: `bff78f6409a98eaa31520afa2a0e6b45851ab9f7` (`refactor: migrate dice duel to stage-first tavern shell`)
Status: human motion review passed; ready for bounded production integration planning

## Boundary

H6.10 is an isolated presentation laboratory. It does not wire the DieRig into Dice Duel Tavern, choose gameplay results, alter the fixed simulation sequence, advance turns, or change the approved H6.9 tavern composition.

```text
productionIntegrated: false
runtimeRandomD6Integrated: false
liveGameplayChanged: false
humanMotionReviewPassed: true
motionLaboratoryApproved: true
persistentActorApproved: true
sixFaceTopologyApproved: true
fullMotionApproved: true
reducedMotionApproved: true
injectedResultAuthorityApproved: true
concurrentRequestGuardApproved: true
laboratoryInspectionScaleApproved: true
productionScaleCorrectionRequired: true
productionIntegrationReady: true
productionScaleConditionRecorded: true
```

## Rendering Route

The installed runtime is Phaser `4.2.0`. That version exposes `Phaser.GameObjects.Mesh2D`, so the laboratory uses the preferred narrow route: one Phaser-owned textured `Mesh2D` with deterministic mathematical projection. No external 3D renderer, physics engine, shader, particle emitter, DOM cube, package change, or lockfile change is involved.

The mesh is constructed once. Every frame updates the same actor's projected vertices and indices. A Phaser Graphics backing fills the transparent bevel area retained by the reviewed face art; it is presentation geometry associated with the same die, not a second die identity. One persistent ellipse provides the contact shadow, and one bounded Graphics ring provides confirmation.

Stable actor ID:

`dierig-h6-10-actor-001`

## Asset Authority

Authority:

- `manifests/academy/games/dice-duel-tavern/academy.dice-duel-tavern.cleanup-candidate.json`
- `manifests/academy/games/dice-duel-tavern/lineage/academy.dice-duel-tavern.regions.json`
- `assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png`

Selected laboratory surface identities:

1. `dice-duel-tavern.dice-face.flat-one`
2. `dice-duel-tavern.dice-face.flat-two`
3. `dice-duel-tavern.dice-face.flat-three`
4. `dice-duel-tavern.dice-face.flat-four`
5. `dice-duel-tavern.dice-face.flat-five`
6. `dice-duel-tavern.dice-face.flat-six`

The exact reviewed 126×126 derived rectangles remain canonical in `face-mapping.ts`. The renderer applies an in-memory UV inset inside each canonical rectangle to remove retained transparent presentation padding; it does not create derivatives, change canonical rectangles, or mutate pixels.

Rejected from DieRig animation:

- glowing die;
- paired dice;
- angled, rolling, tumbling, and small rolling candidates;
- dice cluster;
- baked sparkle, dust, spiral, burst, and smoke assets.

Source integrity:

| Authority | SHA-256 |
| --- | --- |
| source concept sheet | `D4E67458BCAC4ADF94D8734A0A94EA042E9882693C86540663FF8B801E7BE614` |
| cleaned derivative | `DB781E00A1FFF2BEBCD37A8C5418AD8D9CDE056ED04948D9990B80EE62C599FB` |
| cleanup-candidate manifest | `41AD270B71CEF5777E81A3DF451B102BA89F9C65EA8B35CB8BD279D87D8F2032` |
| lineage region manifest | `B20F4F4CE359BDBC603A303D2B9EC34AF2D4A8C699C889C1B6CD0969AA7D065C` |

## Stable Topology

| Face | Local side | Opposite |
| --- | --- | --- |
| 1 | +Y | 6 |
| 2 | +Z | 5 |
| 3 | +X | 4 |
| 4 | −X | 3 |
| 5 | −Z | 2 |
| 6 | −Y | 1 |

Opposite pairs are exactly `1–6`, `2–5`, and `3–4`. Tests settle every injected result 1–6 as the upper face. The optional cyan topology overlay exposes the projected quadrilaterals without changing the mesh.

## Authority and Continuity

`DieRigAuthority` accepts an already-chosen `{ result, mode, motionSeed }` request before motion starts. The presentation layer has no production random source and cannot change the result. It rejects a request while busy, emits one completion for each accepted request, and clears presentation authority and listeners on cancellation, scene shutdown, or destruction.

The repeat-roll recording completes four requests on actor `dierig-h6-10-actor-001`. The overlap proof records one accepted request, one deterministic rejection, one completion, and the originally requested settled result.

## Motion Choreography

Full motion totals `1330 ms` with two major impacts:

| Phase | Duration |
| --- | ---: |
| anticipation | 120 ms |
| release / primary tumble | 480 ms |
| first impact | 55 ms |
| rebound | 210 ms |
| final impact | 55 ms |
| settle | 280 ms |
| confirmation | 130 ms |

Reduced motion totals `380 ms` with zero impacts and no rebound:

| Phase | Duration |
| --- | ---: |
| anticipation | 60 ms |
| direct settle | 240 ms |
| confirmation | 80 ms |

Both paths retain the same actor and supplied result. Deterministic seed variation affects bounded final tray position and tumble presentation only.

## Laboratory and Evidence

The isolated Vite entry is `dierig-lab.html`. It provides face 1–6 controls, full/reduced selection, replay, seed input, stable actor ID, phase, requested/settled results, mode, seed, busy state, counts, phase trail, and optional topology diagnostics. Query parameters reproduce face, mode, seed, autoplay, and diagnostic state.

Evidence shelf:

`games/tier-1/03-dice-duel-tavern/evidence/h6-10-dierig-motion-laboratory/`

Evidence contains:

- all six 1920×1080 settled faces and one six-face contact sheet;
- initial laboratory at 1920×1080 and 1024×640;
- representative settled faces at 1024×640;
- moving and settled topology diagnostics at 1920×1080;
- full six-result motion, repeated persistent-actor rolls, reduced 1/4/6 motion, full-versus-reduced comparison, and overlap-rejection recordings;
- full and reduced telemetry for results 1, 4, and 6;
- persistent-actor and overlap telemetry;
- a browser capture report with zero console/page errors.

Agent visual inspection status:

- one physical die read: passed;
- projected volume and surface continuity: passed;
- tray entry, lift, impact, rebound, and grounding: passed;
- all six top results: passed;
- no visible final sprite replacement: passed;
- full timing and two-impact budget: passed;
- reduced path readability: passed;
- 1024×640 legibility: passed;
- human motion approval: passed on 2026-07-19.

## Human Motion Review

Human review approved the persistent actor construction, topology, multi-axis tumble, two-impact choreography, exact-face settlement, reduced-motion path, and visible absence of a final-face swap.

The laboratory intentionally retains its large inspection scale because that scale makes face mapping, UV orientation, topology, and actor continuity easy to audit. It is not the production size authority.

H6.11 production integration must apply the following bounded scale correction without redesigning or retroactively recapturing H6.10:

- settled production scale: approximately `70–75%` of the laboratory die;
- settled width target: approximately `22–27%` of the live tray's inner width;
- launch/perspective peak: no more than approximately `5–10%` above the production settled scale;
- the smaller grounded scale takes precedence over launch drama;
- preserve immediately readable pips, visible landing room, and the approved motion timings;
- resolve the final responsive value from live 1920×1080 and 1024×640 evidence rather than treating one percentage as an immutable coordinate.

This is a production-integration requirement, not an H6.10 laboratory defect. The approved evidence remains unchanged.

## Validation

Fresh validation on 2026-07-18:

- focused DieRig tests: 26/26 passed across 2 files;
- complete Dice Duel suite: 35/35 passed across 4 files;
- Dice Duel TypeScript no-emit and production build: passed; both `index.html` and `dierig-lab.html` emitted;
- laboratory browser load/capture: passed with zero console or page errors;
- Hub TypeScript no-emit: passed;
- Hub production build: passed;
- `cargo check` from `hub/src-tauri`: passed;
- Academy manifest validation: passed for 10 games;
- Academy asset-manifest validation: passed;
- Academy animation-manifest validation: passed;
- shared-region validation: passed;
- asset-pipeline provenance validation: passed in `legacy-ok` mode with known pre-H5.67 warnings;
- asset-pipeline smoke validation: passed;
- telemetry JSON parsing and semantic checks: passed;
- evidence PNG/WebM integrity: passed;
- source and protected-live-file hash checks: passed;
- UTF-8, control-character, mojibake, trailing-whitespace, and `git diff --check`: passed;
- listener, browser, local Vite listener, capture temp, and extracted-frame cleanup: passed.

## Live Runtime Non-Change Proof

Protected baseline hashes remain:

| File | SHA-256 |
| --- | --- |
| `src/simulation.ts` | `AC5DF7C97D6281A40E282E9C28A1EF922AA571F31D5FD4C503F4607254F8AE46` |
| `src/main.ts` | `971922160E934E1049369108637F5281471AC0CC7A428F8FEEA9674ACE9796B2` |
| `src/styles.css` | `A0FD2FE18B4FD498AF61975E485A2F5989E724BB65164A4905FF0D692A84B5DA` |
| live `index.html` | `E62FD925B9124179F67ED1C9705C3C781A66C2735DA3615B27017101572333A7` |
| game `package.json` | `F47D002E87DC3A6DA13E571A8BF0086C977D8F5F92FF0A9DC55C98C8CEE20798` |
| workspace `pnpm-lock.yaml` | `AF2E59974669109A578974D3314CBF429510DE88FE5EB497BA424B05228ACF26` |

No live simulation, main-loop, input, action, HP, fixed-sequence, H6.9 composition, Hub, package, lockfile, source image, or other-game file changed.

## Stop State

H6.10 remains unstaged and uncommitted. Human motion review has passed with the recorded production-scale condition. Production integration and H6.11 have not begun.
