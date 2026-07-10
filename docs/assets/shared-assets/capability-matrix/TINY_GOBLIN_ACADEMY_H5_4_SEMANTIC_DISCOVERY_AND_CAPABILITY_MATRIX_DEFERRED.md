# Tiny Goblin Academy — H5.4 Semantic Discovery Doctrine + Capability Matrix Deferred

## 1. Purpose

H5.4 defines the next layer of the Tiny Goblin Academy asset pipeline: region mapping is not only geometry. It is semantic discovery.

The goal of this pass is to document how mapped regions become a durable pantry memory without pretending that the full asset capability matrix exists yet.

## 2. Semantic Discovery Doctrine

Asset sheets were generated as pantry sheets. The repo may not know yet what every visual element is "for." Discovery happens by:

- mapping sourceRects;
- labeling visible assets;
- assigning tentative categories;
- preserving uncertainty in notes;
- separating grouped assets from individually usable assets;
- producing evidence for review.

A source rectangle answers "where are the pixels?" Semantic discovery asks the next questions:

- What does this crop visibly contain?
- Is it one asset, a composite prop, or a group of separable assets?
- Is the category useful for future implementation?
- Is the label honest about what can be seen?
- Is the asset clean enough for runtime consideration later?
- Is the asset a candidate, a reserve ingredient, or a risky cleanup item?

## 3. Pantry Sheet Reality

Generated asset sheets are source pantries, not mandatory usage contracts. Unused mapped regions can remain future ingredients. Duplicate, imperfect, grouped, or uncertain sprites can still be valuable if they are honestly described.

The manifest is the first card catalog. It should help future work remember what exists without forcing the current pass to decide every final use.

## 4. Manifest Status Boundary

Manifests are not runtime approval.

A mapped region may still be:

- `draft-review`;
- `needs-human-review`;
- semantically uncertain;
- grouped intentionally;
- reserved;
- cleanup-risky;
- not runtime-approved.

Runtime approval remains a later promotion gate. Mapping, naming, and evidence make review possible; they do not wire or bless the asset.

## 5. Capability Matrix Deferred

Do not create the full asset capability matrix yet.

The future capability matrix depends on broader mapping coverage across shared sheets, UI/HUD, FX, characters, terrain, top-down construction, game-specific sheets, and animation states. Creating it too early would make the matrix look authoritative before the pantry is indexed.

For now, H5.4 only defines the future shape.

## 6. Future Capability Matrix Concept

The eventual matrix should answer questions like:

- What kinds of UI panels do we have?
- What buttons, status icons, FX, props, characters, tiles, and animation states exist?
- Which mapped assets are unused, reserved, or candidate-ready for future lesson upgrades?
- Which features could be upgraded using already-mapped pantry assets?
- Which Tier 2 ideas are supported by existing assets?

Future capability categories may include:

- UI controls;
- HUD panels;
- status icons;
- props;
- pickups;
- rewards;
- FX;
- terrain;
- walls/boundaries;
- character poses;
- animation states;
- game-specific ingredients;
- cross-game reusable assets;
- Tier 2 candidates.

## 7. Future Matrix Fields

When the matrix is eventually created, likely fields include:

- `assetId`
- `sourceSheet`
- `domain`
- `category`
- `label`
- `semanticConfidence`
- `lifecycleState`
- `readinessState`
- `cleanupStatus`
- `runtimeEligibility`
- `likelyUseCases`
- `candidateGames`
- `currentUsage`
- `reservedFor`
- `reviewStatus`
- `notes`

These fields are conceptual only in H5.4. They are not populated here.

## 8. Review Responsibilities

Agent review owns the boring goblin-law layer:

- schema;
- ids;
- categories;
- labels;
- sourceRects;
- grouping;
- status discipline;
- runtime safety;
- semantic consistency against evidence.

Kryssie review owns the product and visual veto layer:

- visual/product judgment;
- whether an asset feels right in-app;
- final veto when something looks wrong;
- human review gates before runtime promotion.

This keeps the review workflow honest: the agent should not hand back obvious manifest work as if Kryssie needs to inspect every rectangle by hand, and Kryssie should not be forced to decide schema semantics when the asset has not even reached app feel yet.

## 9. Examples of Semantic Discovery Decisions

- The UI/HUD three-star rating may be one grouped rating widget now, but three separate star assets later.
- Divider naming may remain generic until actual use clarifies whether a divider is decorative, structural, or a control separator.
- The Shared Core dice pair may intentionally stay grouped as one dice-pair prop.
- The Shared Core sparkle cluster may intentionally stay grouped as one sparkle-cluster prop.
- Glow-heavy assets such as candles, open glowing doors, potions, campfires, and FX require cleanup/runtime review before promotion.
- Text-bearing assets like the bonk button can be mapped honestly, but runtime use must acknowledge that the asset carries visible text.

## 10. Next Mapping Queue / Triage Table

This is a queue and triage guide, not a capability matrix and not a usage decision.

| Recommended lane | Sheet path | Operational asset type | Risk | Required manifest type | Expected evidence | Cleanup posture | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H5.5 — Hub icon manifest QA / alignment review | `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png` and derived hub icon sheets | `hub-icon-sheet` | low/medium | existing hub icon region manifest / region QA | bbox overlay, contact sheet, table preview, current integration screenshots if needed | cleanup already has prior derived outputs; no new cleanup unless explicitly scoped | high |
| H5.5 or H5.6 — Goblin expression/action sheet mapping | `assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png` | `review-candidate` / expression sheet | medium | region manifest | bbox overlay, numbered contact sheet, semantic table | cleanup risky until expression edges and shadows are reviewed | high |
| H5.6 or H5.7 — Platformer goblin player animation mapping | `assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png` | `character-animation-sheet` | high | animation manifest | frame grid/contact sheet, animation row labels, pivot/baseline review | cleanup deferred until animation-safe pilot | high |
| H5.7 or H5.8 — Top-down slime player animation mapping | `assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png` | `character-animation-sheet` | high | animation manifest | frame grid/contact sheet, directional-row evidence, pivot/baseline review | cleanup deferred until animation-safe pilot | high |
| H5.x — Top-down soldier enemy animation mapping | `assets/academy/creatures/soldier/tga-topdown-soldier-enemy-v0.1.png` | `enemy-animation-sheet` | high | animation manifest | frame grid/contact sheet, directional-row evidence, pivot/baseline review | cleanup deferred until animation-safe pilot | medium/high |
| H5.x — Farm/settlement sheet region mapping | `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png` | `static-prop-sheet` / game-specific sheet | medium | region manifest | bbox overlay, numbered contact sheet, table preview | static cleanup may be pilot-safe after inspection | medium |
| H5.x — Top-down terrain mapping | `assets/academy/topdown/terrain/tga-topdown-terrain-floor-construction-concept-v0.1.png` | `terrain-sheet` | medium/high | tile/terrain manifest | grid overlay, tile contact sheet, adjacency/readability notes | cleanup deferred until tile edges are verified | medium |
| H5.x — Top-down wall/boundary mapping | `assets/academy/topdown/walls/tga-topdown-wall-boundary-construction-concept-v0.1.png` | `wall-boundary-sheet` | medium/high | tile/terrain or wall-boundary manifest | grid overlay, contact sheet, edge/corner compatibility notes | cleanup deferred until wall seams are verified | medium |
| H5.x — Top-down environment objects mapping | `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png` | `static-prop-sheet` | medium | region manifest | bbox overlay, numbered contact sheet, table preview | static cleanup may be pilot-safe after inspection | medium |
| H5.x — Game-specific sheet mapping | `assets/academy/games/*/*.png` | mixed game-specific sheets | medium/high | region, tile, scene-anchor, or animation manifest depending sheet | evidence type depends on lane | cleanup policy depends on sheet type | medium |
| Deferred — Shared FX recovery/regeneration | `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png` | `fx-sheet` | high | region manifest after recovery decision | metadata/compression evidence, dark preview, tiny pilot evidence only if approved | regeneration preferred; JPEG-style cleanup deferred | deferred |

## 11. Recommended Next Bounded Lane

Recommended next concrete lane: **H5.5 — Hub Icon Manifest QA / Alignment Review**.

Reason: the hub icon regions are already integrated and have a known manifest path. Reviewing alignment, evidence quality, and status discipline is lower-risk than opening animation sheets, while still strengthening the approval pipeline before broader semantic discovery.

If the goal is to start mapping fresh unmapped assets instead, the next safest new mapping lane is **H5.5 — Goblin Expression/Action Sheet Region Mapping + Evidence**.

Shared FX remains deferred until a separate recovery/regeneration decision.
