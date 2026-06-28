# CodeCraft Native Rust Environment Safety Audit

## Incident Summary
During the H3.1 Tauri Shell Spike preflight, the commands `cargo --version` and `rustc --version` were executed to check for Rust availability. On this system, `cargo.exe` and `rustc.exe` in the PATH are rustup shims. Running them unexpectedly triggered `rustup` to sync channel updates and attempt to download/install components for the stable toolchain (cargo, clippy, rust-docs, rust-std, rustc, rustfmt).

Because this machine's Rust environment is heavily cached via junctions to protect the C: drive, the update failed repeatedly with file conflict and rename errors (e.g., `bin\cargo.exe`, `bin\cargo-clippy.exe`). The system rolled back the changes, but the safety of the environment for existing projects (like CodeCraft Native) is now unknown.

## Environment Findings

### Path Resolution
* `cargo`: `C:\Users\kryst\.cargo\bin\cargo.exe`
* `rustc`: `C:\Users\kryst\.cargo\bin\rustc.exe`
* `rustup`: `C:\Users\kryst\.cargo\bin\rustup.exe`

### Directory Structure & Junctions
The Rust environment is explicitly junctioned to the `D:\DevCache` drive.
* `C:\Users\kryst\.cargo` -> `<JUNCTION> [D:\DevCache\Rust\.cargo]`
* `C:\Users\kryst\.rustup` -> `<JUNCTION> [D:\DevCache\Rust\.rustup]`

Both `D:\DevCache\Rust` and `D:\DevCache\Gradle` exist as physical directories.

### Environment Variables
* `RUSTUP_HOME`, `CARGO_HOME`, and `RUSTUP_UPDATE_ROOT` are not explicitly set in the PowerShell environment.
* `PATH` correctly includes `C:\Users\kryst\.cargo\bin`.

### Disk Space
* **C: Drive**: ~18.7 GB free (cramped, justifying the junctions).
* **D: Drive**: ~1.6 TB free.

### Repository State
The Git working tree was already dirty before any Tauri commands were attempted:
* Modified: `pnpm-lock.yaml`
* Untracked: `get-pip.py`, `game_studio_tree.md`, various temporary Python/JS capture scripts, and `assets/academy/hub/tga-hub-game-icons-transparent.png`.

## Current Risk and Unknowns
* It is unknown whether the `rustup` rollback successfully restored all previous toolchain binaries and libraries, or if it left partial files behind due to the conflict errors.
* The exact state of the `CodeCraft Native` compilation environment is unverified. 

## Strict Guardrails

> [!CAUTION]
> **DO NOT** attempt to automatically repair, update, or clean the Rust environment. Automatic repairs on a junctioned toolchain may severely damage the setup.

1. **Do not run `rustup`**.
2. **Do not run `cargo` or `rustc`**, even for version checks.
3. **Do not modify or delete** the junctions in `C:\Users\kryst`.
4. **CodeCraft Native work is paused** until the toolchain is confirmed intact by the user.
5. **H3.1 Tauri Shell Spike is blocked**.

## Next Steps Recommendation
1. The user must manually verify the Rust environment (e.g., running a safe test build inside the CodeCraft Native repository).
2. Perform a repo hygiene pass to classify and clean up the untracked files and the modified `pnpm-lock.yaml` in this repository before resuming the Tauri spike.
