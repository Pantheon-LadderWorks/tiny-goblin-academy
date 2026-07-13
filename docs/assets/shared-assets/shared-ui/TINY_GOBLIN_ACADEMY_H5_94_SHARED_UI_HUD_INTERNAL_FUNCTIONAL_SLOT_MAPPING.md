# Tiny Goblin Academy — H5.94 Shared UI/HUD Internal Functional Slot Mapping

## Purpose

H5.94 fills the missing layer between the H5.2/H5.2B shared UI/HUD outer region mapping and any future game-specific UI use.

The shared UI/HUD sheet already had outer crops. It did not yet have internal functional geometry describing where live text, icons, values, labels, or short body content might fit inside usable UI pieces.

This pass maps shared UI/HUD internal functional slots only.

## Correction Boundary

This lane was corrected after review because the first draft jumped ahead into Button Goblin Clicker UI selection.

H5.94 is now scoped to:

- classify all 34 shared UI/HUD outer regions by functional role;
- identify dynamic host surfaces separately from icons, baked-state displays, and decorative pieces;
- define draft surface-relative slot rectangles for the shared host surfaces;
- preserve all runtime/game selection decisions for later lanes.

Button Goblin Clicker UI asset selection is deferred to a later H5.96-style planning lane. H6 remains the runtime implementation surface.

## Existing Authority

Outer shared UI/HUD region mapping remains:

```text
manifests/academy/shared/academy.ui-hud.regions.json
```

Source and derived shared UI/HUD images remain:

```text
assets/academy/ui/tga-ui-hud-sheet-v0.1.png
assets/academy/derived-cleaned/ui/tga-ui-hud-sheet-cleaned-preview-v0.1.png
```

H5.94 did not modify those image files or the H5.2/H5.2B outer manifest.

## Relationship To H5.39/H5.40

H5.39/H5.40 established the surface-type-aware precedent for Card Goblin Duel:

- a region crop identifies the asset;
- a cleaned candidate prepares the visual surface;
- a functional slot map defines where dynamic content may later belong;
- slot rectangles remain surface-relative, not runtime coordinates;
- future fit responses may include scaling a rendered surface within view budget, but runtime scaling is not approved by the slot map.

H5.94 applies that same idea to shared UI/HUD pieces.

## Region Functional Classification

All 34 shared UI/HUD outer regions were classified for draft review:

- dynamic host surfaces: 11;
- fixed semantic displays or baked-state surfaces: 10;
- icon/control assets: 11;
- decorative-only assets: 2.

Dynamic host surfaces are the only regions that received internal slot geometry in this pass.

Fixed semantic displays, icon/control assets, and decorative-only regions remain useful asset candidates, but they are not general-purpose text/content hosts.

## Host Surfaces Mapped

H5.94 creates draft internal functional slots for:

- long teal pill panel;
- long gold pill panel;
- long dark panel;
- small teal frame;
- medium teal frame;
- large teal frame;
- small speech bubble;
- feather dialogue panel;
- small paper label;
- small speech tag;
- vertical status panel.

Each host surface records:

- source region id and index;
- surface type;
- surface-relative slot rectangles;
- safe insets;
- protected decorative zones;
- fit/overflow policy;
- review status;
- runtime boundary notes.

## Evidence Created

Evidence was created under:

```text
assets/academy/evidence/h5-94-shared-ui-functional-surfaces-button-goblin/
```

Files:

```text
shared-ui-functional-slot-corrected-overlay.png
shared-ui-functional-slot-table-preview.png
shared-ui-region-functional-classification-preview.png
```

The evidence intentionally avoids Button Goblin selection, game screenshots, background anchors, runtime placement, and composition recommendations.

### H5.94A Evidence Legibility Correction

After review, the H5.94 mapping logic was accepted but the evidence was regenerated for legibility.

H5.94A keeps the same slot geometry and classifications, but improves review artifacts by:

- using short in-component slot labels such as `primary`, `label`, `value`, `title`, `body`, `footer`, `icon`, and `caption`;
- separating neutral crop boundaries from red protected border/decorative exclusions;
- showing one table row per slot so every `xPct`, `yPct`, `wPct`, and `hPct` value remains visible;
- wrapping the 34-region classification preview so host-capability text is not ellipsized.

No geometry redesign, game selection, runtime approval, source image change, or runtime code change was introduced by H5.94A.

## Manifest Created

```text
manifests/academy/shared/planning/academy.ui-hud.functional-surfaces.json
```

The manifest remains:

```text
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
slotApproval: none
gameSelectionApproval: none
coordinatePolicy: surface-relative-percentages-only-no-runtime-coordinates
```

## Non-Goals

H5.94 does not:

- select shared UI assets for Button Goblin Clicker;
- select shared UI assets for any other game;
- modify Button Goblin runtime files;
- modify Button Goblin screenshots or background-anchor evidence;
- create runtime UI;
- approve exact runtime coordinates;
- approve game-specific UI composition;
- modify shared UI source or derived PNGs;
- modify the H5.2/H5.2B outer region manifest;
- alter shell Help/Ledger/Dev behavior;
- modify package or lock files.

## Human/Product Review Notes

H5.95 human/product review passed.

Accepted findings:

- all 34 outer regions are classified correctly for draft planning;
- 11 dynamic host surfaces are identified correctly;
- 18 internal draft slots are accepted as shared asset intelligence;
- crop boundaries, protected decorative exclusions, and content slots are visually distinguishable;
- slot geometry remains surface-relative and differs appropriately by component capability;
- evidence legibility is accepted after H5.94A;
- no geometry discrepancy was found.

Preserved boundaries:

- runtime approval: none;
- game selection approval: none;
- nine-slice approval: none;
- Button Goblin shared UI asset selection remains deferred to H5.96;
- runtime work remains an H6 concern.

## Recommended Next Step

```text
H5.96 — Button Goblin Shared UI Asset Selection Planning
```

H5.96 can now ask which Button Goblin interface roles actually need the approved capabilities of each shared UI component. H5.95 does not make that selection.
