# Tiny Goblin Academy — H5.5 Hub Icon Manifest QA / Alignment Review

## 1. Purpose

H5.5 reviews the Hub Icon lane because it is already integrated into the launcher.
This pass checks whether the manifest and evidence still support the runtime usage.
This pass does not redesign the hub, change game cards, or approve any new asset domain.
The asset capability matrix remains deferred.

## 2. Current Hub Icon Lane Status

The Hub Icon lane is already in runtime use through `SpriteFrame` rendering. The lane uses named source rectangles rather than a uniform 5x2 crop grid because the source sheet is an irregular pantry sheet.

H5.5 confirms that the lane still has 10 icon regions, one for each Academy game level, and that the visual crops line up with the expected hub game icons.

## 3. Source and Derived Asset References

Source pantry sheet:

- `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`

Derived/runtime sheet:

- `assets/academy/hub/derived/tga-hub-game-icons-transparent-v0.1.png`

Older derived candidate still present:

- `assets/academy/hub/derived/tga-hub-game-icons-cleaned-v0.1.png`

The runtime `SpriteFrame` component currently imports the derived transparent sheet. The original source sheet remains pantry truth and was not modified in H5.5.

## 4. Manifest Files Reviewed

Reviewed:

- `manifests/hub.icons.json`
- `manifests/hub.icon-regions.json`
- `hub/src/data/hubIconRegions.ts`
- `hub/src/components/SpriteFrame.tsx`
- `scripts/validate-hub-icon-regions.mjs`
- `scripts/validate-hub-icons.mjs`

Important path correction: `manifests/academy.hub-icons.regions.json` does not exist. The active source-region manifest is `manifests/hub.icon-regions.json`.

## 5. Runtime Integration Boundary

Runtime icon rendering uses:

- `hub/src/data/hubIconRegions.ts` for source rectangles;
- `hub/src/components/SpriteFrame.tsx` for crop rendering;
- `assets/academy/hub/derived/tga-hub-game-icons-transparent-v0.1.png` as the rendered image sheet.

H5.5 did not change runtime hub UI, game cards, `SpriteFrame`, game launch behavior, or Tauri configuration.

The JSON manifest and the TypeScript mirror currently match in the reviewed fields. The TS mirror is a drift-watch item for future maintenance because runtime does not import `manifests/hub.icon-regions.json` directly.

## 6. Region Alignment Review

Reviewed 10 hub icon regions:

1. `tga-01` — Button Goblin Clicker
2. `tga-02` — Potion Sorter
3. `tga-03` — Dice Duel Tavern
4. `tga-04` — Card Goblin Duel
5. `tga-05` — Dungeon Key Run
6. `tga-06` — Tiny Farm Day
7. `tga-07` — Pet Campfire
8. `tga-08` — One-Room Platformer
9. `tga-09` — Top-Down Slime Quest
10. `tga-10` — Mini Settlement Sim

The bbox evidence shows every rectangle aligned over the intended icon. The order is game-id order in the manifest/evidence, not visual sheet position order.

## 7. Semantic Label Review

Labels match the visible icon banners and the Academy game roster.

The visual sheet uses slightly shorter banner text for some games, such as `Button-Click`, `Card Duel`, and `Dungeon Key Run`. The manifest labels use the canonical game titles where available. This is acceptable for QA because the labels identify the Academy games, not literal OCR output from the banner.

## 8. SourceRect / Crop Review

The sourceRects are valid positive rectangles within the 768x1376 source sheet. Each crop includes the complete icon medallion and banner label without large unrelated areas.

The source sheet is irregular. The older `hub.icons.json` grid manifest remains draft metadata and should not be treated as sufficient crop geometry by itself. The source-region manifest is the relevant crop authority.

## 9. Evidence Regeneration Summary

Created H5.5 evidence under:

- `assets/academy/evidence/h5-5/`

Generated files:

- `hub-icons-bbox-overlay.png`
- `hub-icons-numbered-contact-sheet.png`
- `hub-icons-region-table-preview.png`

The evidence generator was extended with a small compatibility normalization path for `manifestType: "hub-icon-source-regions"`. The manifest itself was not reshaped or duplicated.

## 10. Status Discipline Review

The hub icon lane is already runtime-integrated, but H5.5 does not approve any new asset domain and does not create broader runtime approval language.

Status discipline findings:

- `manifests/hub.icons.json` remains `status: "draft"`.
- `manifests/hub.icon-regions.json` uses per-region `status: "mapped"`.
- Evidence labels clearly say `Not runtime-approved`.
- The asset capability matrix remains deferred.

## 11. Issues Found

Findings:

- The prompt guessed `manifests/academy.hub-icons.regions.json`, but the actual active region manifest is `manifests/hub.icon-regions.json`.
- The reusable H5 evidence generator did not initially support the older hub icon manifest shape.
- The runtime uses a TypeScript mirror of the region manifest, which is acceptable for this pass but should be watched for JSON/TS drift in future hub work.

No sourceRect, label, duplicate-id, missing-game, or crop-alignment blocker was found.

## 12. Corrections Applied

Applied:

- Added hub icon manifest compatibility support to `scripts/asset-pipeline/make-region-evidence.py`.
- Regenerated H5.5 hub icon evidence.
- Documented the runtime/source/derived separation in this report.
- Added a smoke-check reference for the hub icon source-region manifest.

No hub icon manifest corrections were required.

## 13. Validator Results

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
python scripts/asset-pipeline/make-region-evidence.py --help
```

See the H5.5 handoff for exact command output.

## 14. Non-Goals

- No source PNG was modified.
- No derived cleaned PNG was modified.
- No hub layout was redesigned.
- No game cards were changed.
- No game launch behavior was changed.
- No game code was changed.
- No Tauri configuration was changed.
- No new assets were wired.
- Shared FX was not touched.
- The asset capability matrix was not created.

## 15. Human/Product Review Notes

The icons appear visually aligned and semantically matched to the game roster. Product review should still retain veto power if any icon feels wrong in the launcher, especially where the banner text is shorter than the canonical game title.

## 16. Recommended Next Step

Recommended next concrete mapping lane: **H5.6 — Goblin Expression/Action Sheet Region Mapping + Evidence**.

This opens the first creature/expression pantry lane while avoiding the higher-risk animation mapping and keeping Shared FX quarantined until a separate recovery/regeneration decision.
