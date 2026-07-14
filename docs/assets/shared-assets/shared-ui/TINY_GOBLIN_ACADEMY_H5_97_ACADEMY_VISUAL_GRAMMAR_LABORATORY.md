# Tiny Goblin Academy — H5.97 Academy Visual Grammar Laboratory

Status: human visual review passed. Runtime approval: none. Font runtime approval: none. UI component runtime approval: none.

## Purpose

H5.97 creates the Academy Visual Grammar Laboratory: a static review surface for typography, shared UI treatment, and mechanic-specific UI responsibilities before H6 runtime wiring continues.

This pass now has two honest parts:

- H5.97A — controlled fantasy/storybook font source intake and provenance capture.
- H5.97B/H5.97C — visual grammar laboratory using the actual available font binaries and H5.95 shared UI functional-slot grammar.
- H5.97D — material-aware typography recipes that define how semantic roles behave on specific host materials.

## Font source intake

Fantasy/display font candidates were downloaded from the Google Fonts repository into `assets/academy/fonts/source/google-fonts/` with OFL/FONTLOG files where available. Local user-owned support fonts from the Kryssie Method font shelf and Windows system fonts were used only as evaluation/baseline sources.

This does not wire runtime font bundling. H5.98 promotes the accepted families and recipes, verifies licenses, and designates the initial defaults before H5.99 runtime use.

Macondo carries one inherited technical provenance debt in this snapshot: its local `OFL.txt` copyright line contains replacement-character damage. The source and binary remain preserved for audit, but Macondo cannot be promoted until H5.98 replaces or verifies that text against the authoritative source.

## Accepted font evidence

- Font family specimen comparison.
- Narrow typography comparison.
- Visual grammar candidate comparison table.
- Font role pairing comparison after H5.97C correction.

Provisional direction:

- Academy display: Cinzel Decorative, large ceremonial use only.
- Game display: Cinzel.
- Story/body: Caudex or Alegreya.
- Values/data/accessibility: Atkinson Hyperlegible.
- Labels: Outfit needs medium/semibold treatment, not thin tiny text.
- Debug/dev truth: Fira Code.
- Accent-only: Macondo, MedievalSharp, Almendra, Merienda, and similar decorative faces.

## H5.97C UI evidence correction

The first H5.97B UI comparison usefully proved that naive hybrid placement fails: text can escape the asset, overflow the frame, collide with ornament, or make every game look like the same generic card.

H5.97C corrects the evidence by rendering sample content inside the approved H5.95 crop-relative slots for regions 1, 5, 18, 19, 20, 21, 22, 30, and 34. Each trial records uniform scale, slot occupancy, overflow, contrast/readability note, and a verdict such as fits, constrained, fails-without-nine-slice, or unsuitable-for-content.

### Region 22 optical correction

Human review found that Region 22's title slot was geometrically safe but optically low and left-heavy on the asymmetrical ribbon. The authoritative slot geometry changed from `x 0.12 / y 0.19 / w 0.62 / h 0.17` to `x 0.17 / y 0.14 / w 0.55 / h 0.15`. This moves the title lane about 27 source pixels right and 16 source pixels up, tightens it to the ribbon's quiet writing band, and holds its right edge at `0.72` to protect the feather plaque.

The shared-host fit sheet was regenerated from the corrected H5.95 manifest, and `academy-region-22-title-slot-optical-correction.png` records the before/after geometry.

## H5.97D material-aware typography contract

H5.97D records 15 provisional whole-treatment recipes under one doctrine:

```text
semantic role × host material = rendered text treatment
```

The same semantic role is not one universal CSS class. Each recipe records family, style, weight, size range, line height, tracking, fill, stroke, shadow, padding, alignment, case treatment, line limit, overflow behavior, and a readability verdict.

Covered materials include Academy shell, dark stage, parchment, dark metal/stone, teal ornamental frame, dialogue scroll, small paper badge, transparent playfield overlay, and developer overlay. Covered roles include Academy/game titles, headings, instructions, compact labels, data, result state, dialogue, debug truth, and optional game accents.

Main findings:

- parchment text should read as warm ink, not outlined browser text;
- dark metal and playfield text need restrained edge protection;
- the real Button Goblin cavern defeats flat text in bright/moving areas;
- a restrained backplate is preferable when stroke and shadow alone remain scene-dependent;
- hover, focus, disabled, warning, success, and purchased states require shape/word/edge cues in addition to color;
- desktop and narrow layouts share role recipes but must reflow physical structure before shrinking below protected text minimums;
- DOM/CSS and Phaser should preserve behavioral parity, not pixel identity.

## Main finding

Shared visual grammar does not mean shared physical layout.

The Academy can share typography hierarchy, label treatment, data treatment, focus/accessibility conventions, color relationships, result hierarchy, and some reusable decorative or host assets. Each game still owns the physical UI structure required by its mechanic.

## Game-specific pressure tests

- Academy Hub: shell navigation, doorway cards, modal/result hierarchy.
- Button Goblin: compact HUD, action card, feedback lane, click target.
- Potion Sorter: shelves, destination layout, drag/drop affordance, selection/result feedback.
- Card Goblin: card/hand/board-slot grammar and dense card-specific content.
- One-Room Platformer: sparse corner HUD and stage-owned movement/touch controls.

Using one large shared panel/card template for every game would recreate the problem H5.96 was meant to prevent.

## Evidence

- `academy-font-family-specimen-comparison.png`
- `academy-font-role-pairing-comparison.png`
- `academy-narrow-layout-typography-comparison.png`
- `academy-shared-host-surface-content-fit-preview.png`
- `academy-ui-mode-comparison-hub.png`
- `academy-ui-mode-comparison-button-goblin.png`
- `academy-ui-mode-comparison-potion-sorter.png`
- `academy-ui-mode-comparison-card-goblin.png`
- `academy-ui-mode-comparison-platformer.png`
- `academy-visual-grammar-candidate-comparison-table.png`
- `academy-region-22-title-slot-optical-correction.png`
- `academy-material-aware-typography-recipe-comparison.png`
- `academy-component-text-state-treatment-comparison.png`
- `academy-busy-background-typography-stress-test.png`
- `academy-typography-desktop-narrow-comparison.png`
- `academy-typography-recipe-contract-table.png`
- `academy-dom-phaser-typography-parity-notes.png`
- `academy-visual-grammar-laboratory.html`

## Non-goals

- No runtime wiring.
- No final font selection.
- No Button Goblin UI asset selection.
- No nine-slice approval.
- No package or lock changes.
- No game runtime source changes.

## H5.98 readiness

Human review accepted H5.97A/B/C/D, including all rendered treatments and the corrected Region 22 geometry (`x 0.17 / y 0.14 / w 0.55 / h 0.15`). H5.98 may now promote the evidence-backed families and recipes, choose one implementation default per semantic role, preserve approved alternatives, and resolve Macondo provenance without another visual selection exercise.

Recommended next lane: H5.98 — Academy Typography Promotion and Default Recipe Registry.
