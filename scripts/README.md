# Scripts

This directory contains repo-level maintenance and validation utilities.

* They do not launch games or check runtime build output (this is a structural check only).
* Scripts should avoid local absolute paths and generated temp assumptions.

## Commands

### Academy Game Manifest Validation

To validate the Academy Game Manifest, run the following command from the repo root:

```sh
node scripts/validate-academy-manifest.mjs
```
### Hub Icon Manifest Validation

To validate the Hub Icon Manifest, run the following command from the repo root:

``sh
node scripts/validate-hub-icons.mjs
``

**What it does:**
* Validates manifests/hub.icons.json structure, ensuring the sheet metadata and icon entries are correctly formed.
* Cross-checks icon mappings against manifests/academy.games.json to ensure every game has exactly one mapped icon, and no duplicate assignments exist.
* Checks that the path to the icon sheet is repo-relative and the file actually exists.
* Does not crop images, launch games, or build assets.
