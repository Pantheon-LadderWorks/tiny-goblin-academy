# Tiny Goblin Academy — H5.85 Academy Visual Asset Pantry Index

## Purpose

H5.85 creates a current visual asset pantry index for Tiny Goblin Academy and ingests the first Button Goblin Clicker-specific background asset.

This is intentionally not runtime wiring. The goal is to give future Codex/Mega/tooling work one honest place to ask:

```text
What visual assets exist?
Where are the cleaned versions?
Which manifest owns them?
Which tool should preview them?
What is accepted, deferred, denied, or still draft?
```

## Scope Boundary

This pass does not reorganize the flat `manifests/` folder or the crowded `docs/assets/` folder. Those folders need a future hygiene/restructure lane, but doing that during asset intake would blur the evidence trail.

This pass also does not audit every stale root/doc note. It records known stale-doc risk, especially older Level 1 / Button Goblin Clicker restoration language, so it can be handled deliberately later.

## New Button Goblin Clicker Background Intake

New source asset:

`assets/academy/games/button-goblin-clicker/backgrounds/tga-button-goblin-clicker-cavern-stage-background-v0.1.png`

Source metadata:

| Field | Value |
| --- | --- |
| Format | PNG |
| Dimensions | `1672x941` |
| Mode | RGB |
| Alpha | none |
| Role | clicker-stage-background |
| Cleanup required | no — full opaque background |

This background fits Button Goblin Clicker because it has a large central negative-space stage for the current SVG goblin/click target, with decorative cavern clutter pushed to the edges. It supports the Tap Titans-like direction without requiring a new goblin sprite sheet yet.

Draft scene-anchor manifest:

`manifests/academy.button-goblin-clicker.background.scene-anchors.json`

Evidence:

`assets/academy/evidence/h5-85-button-goblin-clicker-background-intake/`

Anchors created:

| Count | Purpose |
| ---: | --- |
| 1 | central click-target safe zone |
| 1 | lower floor / grounding zone |
| 1 | upper ceiling decorative frame |
| 2 | left/right decorative edge zones |
| 2 | torch/glow readability-risk zones |
| 1 | bottom foreground obstruction band |
| 1 | top-center HUD caution band |

## Global Pantry Index Manifest

Created:

`manifests/academy.visual-asset-pantry-index.json`

This index is manifest-derived and points to the current source / derived / manifest locations for the major visual pantry groups.

## Game-Specific Pantry Summary

| Game / domain | Current useful visual pantry | Cleaned / derived path |
| --- | --- | --- |
| Button Goblin Clicker | New cavern stage background, 9 draft scene anchors | none; opaque source background |
| Potion Sorter | 30 accepted cleaned regions, 2 denied | `assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png` |
| Dice Duel Tavern | 64 accepted cleaned regions; future code-driven roll illusion idea preserved | `assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png` |
| Card Goblin Duel | 32 accepted card frames, 48 accepted UI/tokens, card frame functional slots | `assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png`; `assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png` |
| Tiny Farm Day / Farm Settlement | 26 accepted cleaned regions, 6 denied | `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png` |
| Pet Campfire | 25 accepted props/icons, 16 accepted Ember Pup pose/state symbols, reviewed scene anchors, placement grammars, composition plan | `assets/academy/games/pet-campfire/derived/tga-pet-campfire-static-props-icons-cleaned-v0.1.png`; `assets/academy/games/pet-campfire/derived/tga-pet-campfire-ember-pup-poses-cleaned-v0.1.png` |
| One Room Platformer | Birthday Build visuals exist; 48 construction pieces manifest/cleaned sheet present | `assets/academy/games/one-room-platformer/tga-one-room-platformer-construction-pieces-cleaned-v0.2.png` |
| Topdown / Slime Quest / Dungeon Key Run | terrain, walls, objects, and future floor pantry indexed; runtime remains last/near-last | see Topdown Pantry Summary |
| Dungeon Platformer mixed sheet | 40 reviewed mixed regions; cleanup deferred | none |

## Topdown Pantry Summary

| Asset group | Manifest | Source / derived status |
| --- | --- | --- |
| Existing terrain cleanup | `manifests/academy.topdown.terrain.cleanup-candidate.json` | 59 accepted, 25/35 deferred, 30/31/64 blank/reference, 32/36/37/38/39 retained partial content |
| True-alpha horizontal/mixed walls | `manifests/academy.topdown.walls.true-alpha-regions.json` | 58 accepted mapped regions; no cleanup needed |
| Vertical walls cleanup | `manifests/academy.topdown.walls.vertical.cleanup-candidate.json` | 72 accepted cleaned regions |
| Regenerated non-FX objects | `manifests/academy.topdown.objects.nonfx-regenerated.cleanup-candidate.json` | 64 accepted cleaned regions; preferred object sheet |
| Historical old object cleanup | `manifests/academy.topdown.objects.nonfx-cleanup-candidate.json` | 51 accepted fallback regions, region 1 product-excluded, 11 effect regions excluded |
| Future floor tilesheets | `manifests/academy.topdown.floor-tilesheets.future.regions.json` | 6 sheets / 384 reviewed future-pantry regions; no cleanup/tilemap approval |

## Shared / Creature Pantry Summary

| Asset group | Manifest | Status |
| --- | --- | --- |
| Shared Core | `manifests/academy.shared-core.regions.json` | draft; cleaned preview exists, not runtime-approved |
| UI / HUD | `manifests/academy.ui-hud.regions.json` | draft; cleaned preview exists, not runtime-approved |
| Shared FX | `manifests/academy.shared-fx.regions.json` | deferred/reference-only; particle-first policy |
| Goblin expression/action | `manifests/academy.goblin-expression-action.regions.json` | draft semantic discovery |
| Platformer goblin | `manifests/academy.platformer-goblin-player.animations.json` | draft animation candidate; flipbook target later |
| Training dummy | `manifests/academy.platformer-training-dummy-enemy.animations.json` | draft animation candidate |
| Topdown slime/soldier | topdown slime/soldier animation manifests | deferred for future topdown runtime planning |

## Tooling Index Implication

The visual tooling idea should be registry-driven:

| Tool | Should load |
| --- | --- |
| Flipbook Viewer | animation manifests and pose/state sheets |
| Sticker / Picture Book Viewer | props, icons, backgrounds, card frames, terrain, walls, objects, and scene-anchor surfaces |
| Particle FX Viewer | particle presets and regenerated true-alpha FX one-offs |
| Sound / Audio Pipeline Viewer | later Tier 2.5 audio assets, not part of this visual lane |

## Tier 1.5 Runtime Planning Note

Finishing the topdown pantry does not make Top-Down Slime Quest the first runtime integration target.

Runtime visual integration should start with the easiest safe game:

1. Button Goblin Clicker
2. simple static/UI visual games
3. platformer-ish games
4. farm/potion/card/dice depending complexity
5. Top-Down Slime Quest last or near-last

Topdown runtime remains harder because it still needs animation decisions, tile behavior, map layout, placement rules, collision, pathfinding/walkability boundaries, and possibly enemy/player state work.

## Known Organization Debt

The index confirms the next cleanup problem is documentation and manifest organization, not more asset processing.

Known debt:

* `manifests/` is flat and crowded.
* `docs/assets/` contains many H4/H5 lane reports at one level.
* root/docs notes include stale Button Goblin Clicker restoration language.
* README/changelog/root planning docs should be reconciled before public-facing runtime docs rely on them.

This pass records that debt but does not reorganize it.

## Non-Goals

H5.85 does not:

* wire Button Goblin Clicker runtime;
* modify game code;
* replace the current SVG goblin;
* create sprite animations;
* build the visual tool suite;
* build the sound pipeline;
* clean or regenerate assets;
* reorganize manifests/docs folders;
* runtime-approve any asset.

## Recommended Next Steps

1. H5.86 — Academy Visual Asset Pantry Human Review.
2. H5.87 — Visual Tool Suite Registry Plan.
3. H6.0 — Button Goblin Clicker Runtime Visual Integration Plan.
4. H6.1 — Button Goblin Clicker Background Runtime Wiring.
