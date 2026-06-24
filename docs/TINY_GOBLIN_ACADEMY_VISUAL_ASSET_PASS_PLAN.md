# Tiny Goblin Academy — Visual Asset Pass Plan

## Purpose
Capture the planned learning pass for sprite sheets, animation, visual consistency, and asset pipeline discipline.

## Why This Matters
* Tier 1 used simple shapes/emoji/rectangles effectively.
* Future work needs to learn sprites, sprite sheets, animation states, frame grids, and asset manifests.
* This is especially relevant to top-down games, platformers, companions, and character animation.

## Key Discovery
* Sprites do not need to be manually cut out of sheets one by one.
* Game engines can crop frames from a sprite sheet at runtime using source rectangle math.
* Strict frame grids like 32x32 or 64x64 make animation reliable.
* Asset pass should teach frame indexing, animation timing, and state-linked animation.

## Candidate Targets
* Level 7 Pet Campfire: companion idle/reaction animations.
* Level 8 One-Room Platformer: player idle/run/jump/fall frames.
* Level 9 Top-Down Slime Quest: slime idle/move/pounce, enemy, essence, exit.
* Possibly Level 5 Dungeon Key Run: player/enemy/key/door tiles.
* Possibly Level 10 Mini Settlement Sim: citizen/shelter/resource icons.

## Sprite Sheet Concepts
* uniform frame grid;
* frame width/height;
* source x/y cropping;
* animation frame index;
* animation timer separate from simulation tick;
* state-to-animation mapping;
* asset manifest keys;
* no manual cutting unless needed for cleanup.

## Hard Boundaries
* Visual pass is not v0.2 gameplay.
* Do not change mechanics during asset pass unless explicitly approved.
* Do not introduce sprite-pipeline automatically.
* Do not generate assets without approved visual direction.
* Do not replace simulation truth with animation state.
* Animation must display state, not own state.

## Open Questions
* Which game gets the first asset pass?
* 32x32 or 64x64 frame grid?
* Handmade, AI-assisted, or downloaded/open-license placeholder sheets?
* Phaser sprite animation vs Canvas drawImage manual cropping?
* Asset manifest format?
