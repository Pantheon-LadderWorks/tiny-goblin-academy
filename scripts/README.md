# Scripts

This directory contains repo-level maintenance and validation utilities.

* They must not launch games unless explicitly designed later.
* Current script validates the Academy Game Manifest only.
* Scripts should avoid local absolute paths and generated temp assumptions.

## Commands

To validate the Academy Game Manifest, run the following command from the repo root:

```sh
node scripts/validate-academy-manifest.mjs
```
