# Tiny Goblin Academy Hub Contract

## Status

* H2 Visual Dashboard Pass: Completed
* Hub Mode: Read-Only
* Launcher/Install/Runtime Architecture: Entering H3 runtime/control-surface reconciliation

## Purpose

The Hub is the future unified launcher/interface for Tiny Goblin Academy. It should turn the current collection of microgames into a coherent academy product without changing the individual game contracts yet.

## Core Doctrine

* The Hub is a product shell, not a gameplay rewrite.
* The Hub launches, describes, and organizes games.
* The Hub must not silently hide missing or deferred states.
* The Hub reads truth from manifests, not hardcoded assumptions.
* The Hub must follow `docs/PANTHEON_PRODUCT_BOOT_EXPERIENCE_STANDARD.md`.
* No raw dashboard spawn.
* Every Pantheon product needs a door.

## Intended User Loop

1. User launches Tiny Goblin Academy.
2. Boot/product-entry sequence runs.
3. Hub opens to Academy dashboard.
4. User sees all Tier 1 games and their status.
5. User selects a game.
6. Hub launches or opens that game.
7. User can return to Hub.
8. Hub preserves clear status and avoids ghost processes.

## First Implementation Target

The first Hub implementation should be a minimal read-only dashboard shell:

* boot / entry screen;
* manifest-loaded game roster;
* truthful status cards;
* game detail panel;
* no process launching yet;
* no package/build orchestration yet;
* no asset implementation yet;
* no gameplay contract rewrites.

Purpose:
This prevented the first scaffold from jumping directly into Tauri process management, dev server launching, package orchestration, or visual asset integration before the manifest/display layer existed. With H2 complete, the Hub remains read-only but is ready for H3 control-surface reconciliation.

## Required Hub Views

* Boot / entry view
* Academy dashboard
* Game roster / launcher cards
* Game detail panel
* Status / archive notes panel
* Credits / licensing panel
* Future settings panel

## Required Game Card Data

Each game card should be able to show:
* game number
* title
* tier
* status
* source availability
* playable availability
* restoration/deferred state if applicable
* short description
* core lesson
* controls summary
* asset/status notes
* docs/evidence links where appropriate

## Level 1 Restoration (Resolved)

Level 1 Button Goblin Clicker historically passed Human Review, but its source was missing during early hub development. It has now been successfully rebuilt and restored to the workspace. The Hub manifest reflects this updated state (`restored v0.1`).

## Source vs Build vs Installed State

* Source Available: source folder exists in repo.
* Build Available: a built version exists.
* Installed/Playable: the hub can launch it from the expected runtime path.
* Deferred/Archived: known history exists, but current runtime/source may be missing.

## Process / Launch Rules

* Only one game process/server should run at a time unless explicitly designed otherwise.
* The Hub must avoid ghost Vite/dev servers.
* Dev mode can start local servers, but must track ports/PIDs.
* Distribution mode should prefer built static assets when possible.
* Closing/returning from a game must cleanly stop any process the Hub started.

## Boot Experience Requirement

Reference: `docs/PANTHEON_PRODUCT_BOOT_EXPERIENCE_STANDARD.md`
Reference: `docs/TINY_GOBLIN_ACADEMY_BOOT_EXPERIENCE_INTEGRATION.md`

The Hub must not start with a raw dashboard. It must implement a product-entry flow before showing the game roster.

* Hub has an existing boot screen (hub-entry only) which is complete for the read-only Hub.
* Game launch boot is future runtime work and should not be implemented until actual game launch behavior exists.
* In-game preload scenes are future curriculum/game refinement work.
* Glyphforge boot splash concept exists as a reference asset, not final trademark-cleared branding.

## Asset Relationship

Reference: `docs/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`

The Hub may display asset-driven previews later, but asset ingestion does not mean implementation. Sprites are asset pantries; manifests decide what is used.

## Non-Goals

* Do not upgrade gameplay loops as part of Hub contract.
* Do not implement visual asset swaps yet.
* Do not create itch release builds yet.
* Do not add updater/signing logic yet.
* Do not turn the Hub into a full game engine.

## Acceptance Checklist

* [ ] Hub has boot/entry flow.
* [ ] Hub reads game roster from manifest data.
* [ ] Level 1 restored state is represented truthfully.
* [ ] Source/build/playable states are distinct.
* [ ] Game launch/return flow is defined.
* [ ] Ghost process prevention is defined.
* [ ] No gameplay contract is rewritten.
* [ ] No asset sheet is used without manifest mapping.
* [ ] Itch/distribution assumptions are documented but not implemented.
