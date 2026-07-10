# Tiny Goblin Academy — Scene Anchors As Background Intelligence

## Purpose

This note records a future-facing doctrine discovered during the Pet Campfire H5.24-H5.25 scene-anchor work.

Backgrounds should not be treated only as decorative images. A strong background can become a rule-readable scene surface when it has an anchor manifest that identifies where characters, props, UI, hazards, goals, and interactions can safely exist.

## Core Doctrine

```text
The background is not just art.
The background is a map waiting to be taught what belongs where.
```

Scene-anchor manifests can identify:

- safe placement zones;
- focal zones;
- UI-safe negative space;
- obstruction zones;
- readability-risk zones;
- interaction anchors;
- avoid-placement zones;
- required-route or optional-route anchors.

Pet Campfire proved this pattern for state-symbol and prop placement. H5.24 mapped the campsite as a scene surface, and H5.25 clarified that Ember Pup state-symbol placement and UI/prop/care-symbol placement need separate grammars.

## Future One-Room Platformer v0.2 Note

One-Room Platformer v0.1 relied heavily on Sticker Book placement by eye. That worked for the Birthday Build, but it also created the classic platformer tuning trap:

```text
manual platform placement
↓
can the player reach it?
↓
adjust jump height / sprite scale / layout
↓
repeat
```

For future One-Room Platformer v0.2 work, the side-view background should receive a scene-anchor audit before room expansion, assisted layout generation, or procedural room work.

Likely platformer anchor categories:

- floor / safe start zones;
- hazard gap zones;
- goal / door zones;
- platform-friendly wall or shelf zones;
- avoid zones where the art is too busy;
- UI-safe exterior zones;
- required-route anchors;
- optional or future-route anchors.

## Sticker Book Role

Sticker Book should remain useful, but its role should shift:

```text
Sticker Book = authoring / review / tweak / export surface
Scene anchors = background intelligence
Movement contract = physics truth
Validator / procedural helper = layout fairness check
```

The Sticker Book should not be the only source of truth for valid gameplay placement.

## Movement Contract + Scene Anchors

Platformer scene anchors should combine with a stable player movement contract.

Future assisted or procedural room generation should use:

- background anchors;
- movement envelope;
- required path rules;
- hazard rules;
- goal placement rules;
- optional / future-route rules.

Do not tune player physics around every manually placed platform.

Instead:

```text
Tune required-route layout against a stable player movement contract.
```

## Future Use

This is not an implementation task for the current Level 8 build.

No Level 8 runtime work is reopened by this note. This doctrine should inform future v0.2 room generation, future backgrounds, scene-anchor manifests, layout validators, and assisted authoring tools.

Tiny goblin summary:

```text
The Sticker Book lets Kryssie place things.
Scene anchors teach the background where things belong.
Movement contracts tell the layout what is fair.
```
