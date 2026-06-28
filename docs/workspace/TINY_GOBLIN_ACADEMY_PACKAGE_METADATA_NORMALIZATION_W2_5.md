# Tiny Goblin Academy Package Metadata Normalization Plan — W2.5

## Status

Planning / No Package Changes Applied

State clearly:

* no package files were modified;
* no dependencies were installed;
* no node_modules folders were deleted;
* no lockfiles were deleted;
* this document defines the proposed normalization patch only.

## Purpose

Explain:

* W2 found inconsistent package metadata;
* package names, versions, private flags, and scripts should be normalized before root workspace install;
* normalization should reduce workspace ambiguity and prevent wrong package identities.

## W2 Findings Recap

Summarize:

* Game 04 is missing package name/version.
* Games 08 and 09 incorrectly use `07-pet-campfire` as package name.
* Versions are inconsistent or missing.
* Private flags are inconsistent or missing.
* Scripts are mostly consistent but should be reviewed.
* Games 08 and 09 have npm package-lock evidence.
* Game 09 has both pnpm and npm lockfiles.
* Game 02 still lacks package.json and remains excluded from workspace.

## Proposed Package Naming Standard

Recommend a consistent package naming pattern.

Preferred pattern:

* root: `tiny-goblin-academy-workspace`
* hub: `tiny-goblin-academy-hub`
* games: `tga-<two-digit-level>-<slug>`

Proposed names:

* `games/tier-1/03-dice-duel-tavern` → `tga-03-dice-duel-tavern`
* `games/tier-1/04-card-goblin-duel` → `tga-04-card-goblin-duel`
* `games/tier-1/05-dungeon-key-run` → `tga-05-dungeon-key-run`
* `games/tier-1/06-tiny-farm-day` → `tga-06-tiny-farm-day`
* `games/tier-1/07-pet-campfire` → `tga-07-pet-campfire`
* `games/tier-1/08-one-room-platformer` → `tga-08-one-room-platformer`
* `games/tier-1/09-top-down-slime-quest` → `tga-09-top-down-slime-quest`
* `games/tier-1/10-mini-settlement-sim` → `tga-10-mini-settlement-sim`

Note:

* Game 02 remains excluded until its package skeleton is reconstructed.
* Level 1 remains absent until rebuilt.

## Proposed Version Standard

Recommend:

* root workspace stays `0.0.0`;
* hub stays `0.0.0` unless already otherwise justified;
* Tier 1 games should use `0.1.0` because they represent v0.1 ladder lessons.

Call out any package currently missing or deviating from this.
*(Game 04, 05, 06, 07, 08, 09 lack versions. Game 03 and 10 use `0.1.0`.)*

## Proposed Private Flag Standard

Recommend:

* root workspace: `"private": true`
* hub: `"private": true`
* all lesson packages: `"private": true`

Reason:

* these are workspace packages, not intended for npm publication;
* distribution will happen through builds/itch later, not npm.

## Proposed Script Standard

Recommend a minimum script set for game packages if supported:

* `dev`
* `build`
* `test`

Optional scripts:

* `preview`
* `capture`
* `playtest`

Do not invent scripts unless the files already support them.
Do not normalize script bodies yet unless a clear typo exists.
For now, recommend only metadata normalization unless script inconsistencies are harmless and obvious.

## Lockfile Policy

State:

* Do not delete `package-lock.json` files in W2.5.
* Do not delete per-game `pnpm-lock.yaml` files in W2.5.
* Lockfile cleanup belongs to a later approved cleanup phase after controlled root install and validation.
* Game 09 having both lockfiles should be recorded as drift, not fixed yet.

## Game 02 Policy

State:

* Game 02 should not be added to `pnpm-workspace.yaml` yet.
* Game 02 needs a separate reconstruction plan.
* Do not create its package.json during metadata normalization for games 03-10.
* Keep it excluded until source/config/import review is complete.

## Proposed W2.6 Surgical Metadata Patch

Define the next implementation patch after this plan is reviewed.

It should:

* edit only package.json files for hub and games 03-10;
* fix package names;
* add/fix version fields;
* add/fix private flags;
* avoid dependency changes;
* avoid script behavior changes unless explicitly approved;
* not touch lockfiles;
* not run install.

Include a proposed file list:

* `hub/package.json`
* `games/tier-1/03-dice-duel-tavern/package.json`
* `games/tier-1/04-card-goblin-duel/package.json`
* `games/tier-1/05-dungeon-key-run/package.json`
* `games/tier-1/06-tiny-farm-day/package.json`
* `games/tier-1/07-pet-campfire/package.json`
* `games/tier-1/08-one-room-platformer/package.json`
* `games/tier-1/09-top-down-slime-quest/package.json`
* `games/tier-1/10-mini-settlement-sim/package.json`

## Risks

Include:

* accidentally changing dependency versions;
* accidentally changing script behavior;
* package identity drift;
* lockfile churn if install is accidentally run;
* adding Game 02 too early;
* pretending package metadata normalization proves build health.

## Open Questions

Include:

* Should hub package name become `tiny-goblin-academy-hub` if not already?
* Should every game be private?
* Should package versions all be `0.1.0`?
* Should script names be normalized now or after install validation?
* Should lockfiles be untouched until W5 cleanup?
* Should Game 02 reconstruction happen before W3 controlled install or after?

## Proposed Next Step

Recommend:

1. Review W2.5 plan.
2. Create W2.6 surgical package metadata patch.
3. Review package diffs.
4. Run validators only.
5. Still do not run install.
6. Then decide whether Game 02 reconstruction plan is needed before W3.

## Implementation Note

* W2.6 surgical metadata patch applied.
* Package names, versions, and private flags were normalized for Hub and games 03-10.
* No dependencies/scripts/lockfiles were changed.
* Game 02 remains excluded and needs a separate reconstruction plan.
* W3 controlled root install remains blocked until W2.6 is reviewed.
