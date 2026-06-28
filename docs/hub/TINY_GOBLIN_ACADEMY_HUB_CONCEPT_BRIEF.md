# Tiny Goblin Academy Hub — Concept Brief

## Concept
A lightweight desktop launcher / academy portal for the completed Tiny Goblin Academy games.

## Product Purpose
* Instead of publishing ten tiny games separately, the hub packages them as one cohesive learning arcade / portfolio piece.
* The hub can become the itch.io-facing product.
* The games remain learning artifacts, but the hub creates a polished user-facing shell.

## Candidate Stack
* Tauri for lightweight desktop shell.
* Rust backend for process management.
* Web frontend for hub UI.
* Native WebView instead of bundling Chromium like Electron.

*(Note: Electron is known/familiar but heavier. Tauri is preferred for this launcher because Kryssie likes Rust speed and the hub should stay lightweight.)*

## Core Hub Features — MVP
* list all available games;
* show level number, title, version/status, and core lesson;
* show whether evidence/docs exist;
* click Play to launch a game;
* start that game’s local dev/server process;
* open the game in an embedded webview or managed browser view;
* return to hub;
* stop the game server cleanly;
* avoid orphaned processes;
* preserve one-game-at-a-time process discipline.

## Launcher Manifest Idea
Each game exposes metadata:
* id;
* title;
* level;
* version;
* status;
* path;
* start command;
* port;
* evidence path;
* description/core lesson.

The hub reads this manifest rather than hardcoding every game forever.

## Process Management Notes
* Use strict ports or dynamic port discovery.
* Capture scripts taught that self-starting local servers are useful.
* Avoid ghost servers.
* Ensure cleanup on exit.

## Itch.io / Butler Angle
* Kryssie has an itch.io profile already.
* The hub could be released free as a first software/game learning portfolio product.
* Butler can later be used to push updates.
* Deployment is not started yet.

## Risks
* Process management complexity.
* Path/port handling on Windows.
* Packaging multiple Vite games.
* WebView vs external browser decisions.
* Update strategy.
* Keeping hub from becoming a full platform too early.

## Non-Goals
* No implementation yet.
* No Tauri install yet.
* No Butler setup yet.
* No release yet.
* No game rewrites.
* No auto-update system in MVP unless separately contracted.
