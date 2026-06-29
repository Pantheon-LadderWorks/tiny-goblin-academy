# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

* **Dev Launcher Runtime**: Successfully orchestrated non-blocking dev servers and embedded games inside the Tauri app with a dedicated boot screen and graceful process termination.
* **Dev Mode Launcher Controls**: Added UI skeleton and robust backend status detection for developer launcher buttons.
* **Dev Dependency Management**: Implemented explicit backend commands and UI wiring for installing and safely uninstalling package-local dev dependencies within the trusted sandbox.
* **Read-Only Runtime Status Model**: Implemented Tauri shell and Rust backend for real-time, read-only inspection of game build and dev states.
* **Tauri Shell Foundation**: Scaffolded and hardened the desktop Tauri shell for the Academy Hub.
* **Level 1 Restoration**: Restored Button Goblin Clicker v0.1 game loop.
* **Desktop Game Grid**: Redesigned the Hub as a desktop game grid with polished icon rendering, checkerboard cleanup, and transparent tile presentation.
* **Workspace Cleanup & Validation**: Executed a full dependency cleanup, implemented a pnpm workspace skeleton, and normalized package metadata.
* **Architecture & Contracts**: Documented and reconciled boot doctrine, launcher runtime semantics, workspace validation, and H3.3 runtime contracts.
* **Asset Ingestion**: Formalized asset sheet intake and ingested core concept sheets across multiple games.
* **Manifest Validation**: Reconciled the academy manifest validator to recognize the restored state of Level 1.
* **Asset Operations**: Completed H4.0 Operational Asset Cartography Census, classifying all academy assets by taxonomy and pipeline readiness.
* **Asset Operations**: Corrected swapped A0 source asset file contents — `tga-icon-source-v0.1.png` and `tga-pet-campfire-background-source-v0.1.png` were swapped at intake; file paths are now correct.
* **Asset Planning**: Added H4.1 Hub Visual Identity + Main Boot Asset Plan — contracts for all five hub-facing identity surfaces (boot splash, hub banner, hub icon sheet, app icon/favicon, per-game loading), proposed manifest strategy, evidence stack, and H4.2–H4.9 sequence.
* **Asset Operations**: Completed H4.2 Favicon / App Icon Export Pipeline — generated candidate PNG sizes (16-512px) from source icon, produced visual preview evidence sheets, and created a draft favicon exports manifest.
* **Asset Operations**: Completed H4.2B Tauri App Icon Integration — approved H4.2 PNG candidate exports and copied them into the Tauri target icon paths, leaving the `.ico` file untouched as a fallback.
* **Asset Operations**: Completed H4.2C Web / ICO / SVG Icon Surface Audit — generated a multi-size `.ico` candidate using Python/Pillow, replaced Tauri's `icon.ico`, and replaced the basic web placeholder `favicon.svg` with a base64 wrapper.
* **Asset Operations**: Completed H4.3 Main Hub Banner Placement Evidence — created responsive header placement mockups and standalone previews of the main scroll banner, logged under the new hub identity draft manifest.
* **Asset Operations**: Completed H4.4 Main Glyphforge Boot Surface Modernization Evidence — rendered responsive full-screen hero mockups and overlay variation sheets for the boot splash concept, prepping for combined H4.5 runtime integration.
* **Asset Operations**: Completed H4.5 Hub Banner & Main Boot Runtime Integration — wired the H4.3 Hub Banner with a custom plaque/frame treatment and the H4.4 Boot Screen (Layout C) into a single Tauri build verification pass, fully modernizing the primary app entry surfaces.
* **Asset Operations**: Completed H4.5B Visual Smoke Polish — refined header density, banner zoom, boot Layout C responsiveness, and Tauri window defaults.
* **Planning**: Added H4.6 hub surface contract and future layer scaling plan, documenting the pivot from fixed dashboard layout to full-screen launcher surface with tier-aware horizontal shelf planning, dev/prod runtime distinctions, future options, Butler/update, account, and cross-game ledger layers.
* Public repo preparation, branding assets added, and legacy private concepts scrubbed.

