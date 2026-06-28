# Fake Transparency Cleanup Tool Doctrine

## The Problem
Many generated concept assets arrive with baked checkerboard backgrounds visually simulating transparency, but completely lacking a real alpha channel. If every pixel has an alpha value of 255 (fully opaque), CSS and game engines will render the checkerboard.

## The Tool
**Path:** `scripts/clean-fake-transparent-sheet.py`

This tool systematically converts these fake checkerboard pixels into true PNG alpha transparency without requiring manual cutouts.

## How it Works
It uses a **full-sheet border-connected flood fill**. By detecting low-saturation gray-like pixels starting strictly from the image perimeter, it removes the background without global destruction, preserving any intentional grays deeper within the artwork.

## Rules of Usage

### Safe Candidates
* Static icon sheets
* UI element pantries
* Isolated prop sheets where the background touches all borders and items are distinct

### Dangerous Candidates
* **DO NOT** run this tool blindly on **Animation Sprite Sheets** (e.g., goblins, slimes, players). 
* Character features (shadows, armor, dirt) often cross into the low-saturation gray thresholds. A careless flood fill can result in corrupted limbs, hollow outlines, motion smear, or "transparent kneecaps".
* Animation sheets require pilot testing, frame manifests, and contact-sheet evidence before any full-sheet automated cleanup.

### Output Strategy
* **Always leave the original source sheet untouched.**
* Save the cleaned version as a new file in a `derived/` folder. 
* This ensures the master concept asset is never irreversibly altered.
