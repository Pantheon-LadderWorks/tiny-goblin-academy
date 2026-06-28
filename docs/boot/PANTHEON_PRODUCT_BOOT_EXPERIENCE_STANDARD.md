# Pantheon Product Boot Experience Standard

## Purpose

Every Pantheon LadderWorks product must have a deliberate entry state before dropping the user into a dashboard, hub, game, or app. 

Core doctrine:
* No raw white screens.
* No sudden dashboard spawn.
* No silent “is this broken?” pause.
* Every Pantheon product needs a door.

## Core Boot Loop

The product-entry loop follows a distinct sequence:
Launch → maker mark → product identity → loading/status signal → transition into hub/game/app.

This is not vanity polish. It is a trust handshake.

## Why It Matters

* **Identity & Perceived Quality:** A proper boot sequence establishes the brand and sets a high quality bar immediately.
* **User Confidence:** It proves the application is running and responsive.
* **Transition:** It creates a psychological threshold, shifting the user from their desktop/OS into the product space.
* **Consistency:** It unifies all Pantheon projects under a shared professional standard.
* **Expectations:** Players and users expect a real entry state from games and polished apps.

## Required Elements

* **Maker Mark / Studio Mark:** The overarching studio identity.
* **Product Title:** The specific game or application name.
* **Short Status/Loading Phrase:** Text that communicates progress (e.g., "Initializing...").
* **Clear Transition:** A graceful entry into the actual product.
* **Accessible Duration:** Enough time to read without artificially wasting the user's time.
* **Honest Loading:** No fake loading bars if nothing is actually loading.
* **Graceful Fallback:** If assets or audio fail, the boot sequence should degrade gracefully, not trap the user.

## Timing Rules

* The default boot screen should be short, usually 1–3 seconds.
* If real loading takes longer, show honest progress/status.
* Allow skip/fast path where appropriate.
* Do not trap returning users in long cinematic intros every launch.

## Audio Rules

* Audio is strictly optional.
* No loud surprise audio.
* Respect mute/user preferences.
* Only use a short recognizable sting (if any).
* No looping music on loading unless the product intentionally supports it.

## Visual Rules

* Clean contrast.
* Readable title.
* No cluttered fake UI.
* No broken image flash.
* No raw default framework screen.
* No unstyled loading text.
* Product-specific visual language should take over after the maker mark.

## Tiny Goblin Academy Application

Intended boot sequence for the Academy Hub:
1. Pantheon LadderWorks / studio maker mark.
2. Tiny Goblin Academy title or academy crest.
3. Short status phrase, e.g. “Opening the Academy…”
4. Optional tiny sound cue: page flip, chalk scratch, soft forge chime, or tiny bonk.
5. Transition into the Academy Hub.

*The hub contract must reference this standard before implementation.*

## Studio Boot Concept Asset

A current working boot-card concept for the game-studio identity has been saved to:
`assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png`

This serves as a visual reference for the boot experience. It establishes the "Glyphforge Games" working identity. Note that this studio identity is an internal concept and has not been legally finalized or trademark-cleared.

## Relationship to Future Hub Contract

The Academy Hub must not start with a raw dashboard. The hub must implement a product-entry flow that satisfies this standard before displaying the game list. This entry flow is a foundational requirement for the Hub Contract.

## Non-Goals

* This document does not implement the boot screen.
* This document does not install Tauri.
* This document does not create the hub.
* This document does not finalize legal trademark checks for any studio name.
* This document does not require long cinematic intros.

## Acceptance Checklist

* [ ] Product has a deliberate entry state.
* [ ] Maker/product identity appears before dashboard/hub/game.
* [ ] Loading/status is visible if needed.
* [ ] No raw white screen or sudden dashboard spawn.
* [ ] Audio, if present, respects user comfort.
* [ ] Transition into product is clear.
* [ ] Boot screen assets are repo-relative and licensed/credited appropriately.
* [ ] Implementation does not rely on local absolute paths.
