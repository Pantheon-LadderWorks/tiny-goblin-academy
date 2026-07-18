# Tiny Goblin Academy Hub External-Build Workspace Resolution

## Status

Runtime proof complete / closure record.

## Purpose

Record the correction that lets a locally built Tiny Goblin Academy Hub executable resolve the Academy source workspace when the executable lives outside the repository and is launched without a repository-root working directory.

## Resolver Order

The Hub resolves the workspace in this order:

1. Search the current working directory and its ancestors.
2. Search the running executable directory and its ancestors.
3. Search the source workspace captured by the local developer build through `CARGO_MANIFEST_DIR`, walking its ancestors.

Every candidate must contain the canonical Academy roster manifest at `manifests/academy/core/academy.games.json`. The manifest remains the workspace validation authority.

## Human Runtime Proof

Human runtime validation on July 18, 2026 proved both external launch routes:

- the new desktop shortcut launched successfully;
- the shortcut target was `D:\DevCache\Rust\targets\tiny-goblin-academy\release\app.exe`;
- the same D-drive `app.exe` launched directly from File Explorer;
- neither route depended on a repository-root working directory;
- both routes found the Academy workspace on C: and hydrated the games successfully.

## Boundary

- This fallback is for a local developer Hub built from the Academy source workspace.
- It does not copy or bundle the games into `app.exe`.
- The games remain workspace-backed development runtimes served through their dev-server launch paths.
- Moving or renaming the repository requires rebuilding the local Hub so the compiled source-workspace fallback is refreshed.
- No individual game path is hardcoded by this correction.
- The canonical Academy manifest validates the workspace before the fallback is accepted.
- This behavior is not a production installer, portable player package, or Butler distribution mechanism.

## Regression Coverage

`hub/src-tauri/src/lib.rs` includes a focused regression test that changes the process working directory to an external temporary directory and verifies that the compiled source workspace is still resolved.

## Closure Result

The external-build resolver is live-proven rather than only unit-tested. A D-drive release executable can independently find and hydrate the C-drive Academy workspace through the manifest-validated compiled-source fallback.
