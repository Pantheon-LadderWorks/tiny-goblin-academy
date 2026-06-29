# Tiny Goblin Academy — H5.3 Shared Core Region Mapping + Evidence

## 1. Purpose

H5.3 maps Shared Core regions for review. It does not approve runtime usage.
The original pantry PNG remains the source asset and is unchanged.
The cleaned preview is a derived review artifact, not runtime truth.
No Shared Core asset may be wired into a game until its region is reviewed and runtime-approved.

## 2. Human Review Context

H5.2B canonized the evidence method: every mapped region manifest needs a synchronized bbox overlay, numbered contact sheet, and region table preview. H5.3 applies that standard to the static Shared Core prop/icon/object sheet.

Shared Core is a good second lane because it contains obvious reusable static props, icons, and academy objects. It is still not safe to promote directly to runtime: labels, categories, transparency cleanup quality, glows, and grouped assets need human review.

## 3. Source Sheet

- Source sheet: `assets/academy/shared-core/tga-shared-core-sheet-v0.1.png`
- Domain: `shared-core`
- Dimensions: 2816x1536
- Sheet type: static shared prop/icon/object sheet
- Manifest: `manifests/academy.shared-core.regions.json`

## 4. Derived Cleanup Preview Status

- Derived cleanup preview: `assets/academy/derived-cleaned/shared-core/tga-shared-core-sheet-cleaned-preview-v0.1.png`
- Cleanup status: `preview-generated`
- Human review required: yes
- Runtime status: not approved

The cleaned preview is used for crop readability in evidence. Source rectangles remain defined against the original source sheet coordinate system.

## 5. Mapping Scope

H5.3 maps 32 obvious, non-overlapping Shared Core regions. The pass avoids uncertain regions, OCR claims, runtime wiring, and approval-state promotion.

Mapped examples include:

- academy mark
- graduate goblin head
- open rune book
- chalkboard
- sealed scroll
- medal
- candle
- closed/open doors
- bonk button
- training dummy
- coin/key/chest/heart/banner
- potion/dice/cards/plant/campfire/water orb
- crate/gear/sparkles/markers/hourglass/shield/weapon/journal

## 6. Region Naming Convention

Region IDs follow:

```text
shared-core.<category>.<short-name>
```

Examples from this pass:

- `shared-core.academy-mark.goblin-book`
- `shared-core.goblin-head.graduate`
- `shared-core.book.rune-open`
- `shared-core.chalkboard.lesson`
- `shared-core.scroll.sealed`
- `shared-core.medal.gold-ribbon`
- `shared-core.candle.lit`
- `shared-core.door.closed-arched`
- `shared-core.currency-icon.goblin-coin`
- `shared-core.key.gold`
- `shared-core.chest.locked`
- `shared-core.heart.red`
- `shared-core.banner.crossed-swords`
- `shared-core.potion.green`
- `shared-core.dice.pair`
- `shared-core.card-stack.moon`
- `shared-core.plant.sprout-pot`
- `shared-core.campfire.logs`
- `shared-core.water-orb.blue`
- `shared-core.crate.wood`
- `shared-core.gear.gold`
- `shared-core.sparkle.gold`
- `shared-core.alert-marker.red`
- `shared-core.skull-marker.bow`
- `shared-core.question-marker.blue`
- `shared-core.hourglass.wood`
- `shared-core.shield.gold`
- `shared-core.weapon.wooden-sword`
- `shared-core.journal.quill`

## 7. Region Categories

Categories used in H5.3:

- `academy-mark`
- `goblin-head`
- `book`
- `chalkboard`
- `scroll`
- `medal`
- `candle`
- `door`
- `button-prop`
- `training-dummy`
- `currency-icon`
- `key`
- `chest`
- `heart`
- `banner`
- `potion`
- `dice`
- `card-stack`
- `plant`
- `campfire`
- `water-orb`
- `crate`
- `gear`
- `sparkle`
- `alert-marker`
- `skull-marker`
- `question-marker`
- `hourglass`
- `shield`
- `weapon`
- `journal`

Every region uses:

- `usage: "draft-review"`
- `reviewStatus: "needs-human-review"`

No region is marked approved, runtime-approved, or integrated.

## 8. Manifest Update Summary

Updated manifest:

- `manifests/academy.shared-core.regions.json`

The manifest remains `status: "draft"` and keeps:

- `domain: "shared-core"`
- `sourceSheet: "assets/academy/shared-core/tga-shared-core-sheet-v0.1.png"`
- `derivedSheet: "assets/academy/derived-cleaned/shared-core/tga-shared-core-sheet-cleaned-preview-v0.1.png"`
- `transparency.cleanupStatus: "preview-generated"`
- `transparency.humanReviewRequired: true`

The old placeholder regions were replaced with 32 draft-review mapped regions.

## 9. Evidence Files Created

Created under `assets/academy/evidence/h5-3/`:

- `shared-core-bbox-overlay.png`
- `shared-core-numbered-contact-sheet.png`
- `shared-core-region-table-preview.png`

The bbox overlay shows index-labeled source rectangles over the source sheet. The contact sheet shows the mapped crops, using the derived cleaned preview for readability. The table preview lists index, ID, category, sourceRect, usage, review status, and label.

## 10. Semantic Verification Notes

A correct sourceRect is not enough. Each label, category, and description must match the actual crop shown in the contact sheet.

Human review should pay extra attention to:

- glow-heavy crops: candle, open glowing door, green potion, campfire;
- intentionally grouped crops: dice pair and gold sparkle cluster;
- decorative markings that should not be treated as OCR/text semantics: book, chalkboard, journal;
- the open glowing door crop, because light spill makes the rectangle broader than the door body.

## 11. Validator Results

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
python scripts/asset-pipeline/make-region-evidence.py --help
```

See the H5.3 handoff for exact command output.

## 12. Non-Goals

- No original source PNG was modified.
- No pantry asset was overwritten.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri configuration was changed.
- No runtime asset wiring occurred.
- No animation sheets were processed.
- No Shared FX files were touched.
- No broad cleanup was run.
- No Shared Core region was runtime-approved.

## 13. Human Review Checklist

- [ ] Review `shared-core-numbered-contact-sheet.png` for crop accuracy and naming sanity.
- [ ] Review `shared-core-bbox-overlay.png` to confirm source rectangles match intended objects.
- [ ] Review `shared-core-region-table-preview.png` for ID/category/sourceRect consistency.
- [ ] Confirm glow-heavy crops remain acceptable as draft-review evidence only.
- [ ] Confirm dice pair and sparkle cluster should remain grouped, or split them in a later correction pass.
- [ ] Keep manifest status draft until human review approves the mapped regions.

## 14. Recommended Next Step

Recommended next category: **H5.4 — Shared FX Recovery Decision / Regeneration Plan**.

Shared FX remains deferred and high-risk. If momentum is preferred before opening that cursed JPEG gremlin box, an alternate next lane is **H5.4 — UI/HUD Human Review Corrections + Star Split Decision**.
