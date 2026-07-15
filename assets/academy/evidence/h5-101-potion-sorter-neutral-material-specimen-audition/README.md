# H5.101 Potion Sorter Neutral Material Specimen Audition Evidence

## Status

Generated / Validated / Human Review Passed / Approved for H5.102 Runtime Preparation / Not Runtime Approved

This packet places the accepted H5.100 and H5.100C material candidates on the same code-authored neutral objects under neutral inspection light and warm mechanism light.

## Boundary

- The laboratory is reproducible and evidence-only.
- It does not implement the Potion Sorter room or SceneRig.
- It does not register a runtime material, particle emitter, shader, or gameplay asset.
- It does not mutate any accepted source image, license, or provenance record.
- Every recipe remains provisional and has `runtimeApproved: false`.
- Human review approves the recorded selections for H5.102 runtime preparation only.

## Evidence Sheets

1. `01-timber-comparison.png` — Kenney hybrid default, DeadKir alternate, realistic control.
2. `02-masonry-comparison.png` — chunky stone hybrid, irregular rock alternate, realistic control.
3. `03-conveyor-repetition.png` — repeated slats, wear variation, iron brackets, warm-light behavior.
4. `04-iron-rail-bracket.png` — painted iron default, realistic small-hardware alternate, rust-heavy deferment.
5. `05-gear-brass-accent.png` — no brass, constrained Metal008 hub, rejected broad brass coverage.
6. `06-parchment-labels.png` — illustrated parchment, clean-fiber alternate, rejected grime-dominant treatment.
7. `07-potion-bottles.png` — code-authored glass with red, blue, and green classification colors.
8. `08-fx-helper-board.png` — glow, spark, dust, steam, and ooze source ingredients without emitter claims.
9. `09-neutral-vs-warm-light.png` — identical material coverage under both required light conditions.
10. `10-provisional-palette.png` — recommended hybrid material family.
11. `11-material-recipe-verdicts.png` — all provisional recipe dispositions and false runtime flags.
12. `12-constrained-rejected.png` — explicit scale and coverage boundaries.
13. `13-coherence-1920x1080.png` — primary desktop evidence.
14. `14-coherence-1024x640.png` — minimum desktop evidence.

## Reproduction

From the repository root:

```powershell
python assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition/generate_h5_101_lab.py
node assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition/capture_h5_101_evidence.mjs
python assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition/validate_h5_101_audition.py
```

The generator supports `--check` and must reproduce its five generated JSON/JavaScript outputs byte-for-byte.

## Provisional Recommendation

Use stylized materials for primary identity; use realistic sources only as quiet grain, wear, small hardware, or constrained brass focal response. Metal008 makes the gear and valve readable when its coverage stays small, but broad realistic brass is rejected. Human review passed and H5.102 runtime preparation is ready. Runtime integration remains separately gated.
