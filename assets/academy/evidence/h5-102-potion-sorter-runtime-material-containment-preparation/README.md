# H5.102A Potion Sorter Runtime Material and Containment Preparation Evidence

## Status

Human Review Passed / Runtime Preparation Approved / Runtime Assets Not Approved / Preview-Only H6 SceneRig Ready

This packet translates H5.101's approved material direction and the H5.48C/H5.49 sprite authority into explicit preparation contracts. H5.102A corrects the first evidence pass after human review found unreadable inventory labels, an inappropriate four-slot primary containment prop, poor seating, visible debug geometry, and an inadequate single-frame aperture proof. It proves source resolution, atlas framing, actor/holder ownership, depth layering, holder-local geometry masks, and independent interaction geometry without changing Potion Sorter runtime code.

## Authority

- Sprite authority: H5.48C regenerated source and cleaned sheets.
- Review authority: H5.49 accepts 30 of 32 regions and hard-denies regions 9 and 14.
- Material authority: H5.101 human-reviewed selections, still `runtimeApproved: false`.
- Containment law: depth layering first, holder-local geometry second, authored alpha masks only when a demonstrated irregular opening requires one.
- Current verdict: the tested H5.48C holders do not require an authored alpha mask.

## Evidence Sheets

1. `01-runtime-prepared-material-inventory.png` — readable four-column direct-source inventory.
2. `01a-material-inventory-1024x640-plate-1.png` — minimum-window inventory plate one.
3. `01b-material-inventory-1024x640-plate-2.png` — minimum-window inventory plate two.
4. `02-potion-prop-skin-inventory.png` — all 32 H5.48C regions with both H5.49 denials preserved.
5. `03-layering-first-containment-diagram.png` — containment decision hierarchy.
6. `04-conveyor-cradle-proof.png` — shallow containment through depth layering only.
7. `05-foreground-rail-proof.png` — complete sprite occluded by a higher-depth rail.
8. `06-deep-containment-three-state-proof.png` — red approach, blue partial entry, and green accepted seating in single-color receivers.
9. `07-machine-aperture-three-state-proof.png` — approach, partial, and exit with synchronized position/scale/depth/clip.
10. `08-interaction-bounds-proof.png` — visible, mask, interaction, and sorting/drop geometry remain separate.
11. `09-irregular-opening-mask-verdict.png` — painted red-slot frame plus simple geometry is sufficient.
12. `10-material-binding-proof.png` — direct local texture loading without runtime registration.
13. `11-harness-1920x1080.png` — primary desktop proof bench.
14. `12-harness-1024x640.png` — supported minimum desktop proof bench.
15. `13-runtime-preparation-verdicts.png` — preparation decision table.
16. `14-rejected-deferred-containment.png` — rejected complexity and preserved denials.
17. `15-three-color-destination-containment-board.png` — accepted red, blue, and green destinations using regions 17–19.
18. `16-deep-containment-presentation-debug.png` — identical finished and diagnostic views with invisible presentation masking.
19. `17-machine-aperture-three-state-debug.png` — labeled local mask and interaction contours across all three states.

The capture runner also writes `evidence-layout-proof.json`, recording three live collision/overflow audits for the primary inventory and both minimum-window plates.

## Reproduction

From the repository root:

```powershell
python assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation/generate_h5_102_preparation.py
node assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation/capture_h5_102_evidence.mjs
python assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation/validate_h5_102_preparation.py
```

The generator supports `--check`. The Phaser harness loads the real cleaned H5.48C atlas and direct local material sources; it does not copy sprites, mutate source pixels, or register runtime assets.

## Boundary

H5.102A human review passed and approved these corrected contracts for runtime preparation only. It does not approve a runtime material, create the PotionActorRig in game code, build the room or conveyor SceneRig, alter simulation/controller behavior, add emitters or shaders, or modify package/lock files. The separately bounded preview-only H6 SceneRig lane is ready.
