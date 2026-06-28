# Gemini / Antigravity Workspace Instructions
**Project: Tiny Goblin Academy / AI Game Studio Ladder**

Welcome to the Tiny Goblin Academy workspace. When operating in this project, adhere strictly to the following rules to maintain repository hygiene and respect architectural boundaries.

## Repository Hygiene & Untracked Files
1. **Never delete untracked files** without explicit user permission. Files like `game_studio_tree.md` or intermediate artifact scripts may be actively managed by the human user.
2. **Post-Commit Audits**: When asked to run a post-commit audit, investigate explicitly what was tracked, untracked, and modified. Do not sweep up unrelated assets into commits.

## Architecture Boundaries
1. **CodeCraft Native**: This is a separate, explicitly dirty repository/module. Do **not** touch it, clean it, or modify its source unless explicitly instructed to do so.
2. **Tauri Doctrine**: Maintain a strict separation between **Dev Mode** (source-based execution via `pnpm run dev`) and **Production Mode** (pre-built artifacts residing in the "cave"). The Hub UI and backend models must clearly distinguish these states.
3. **No "Cursed Goblin Buttons"**: Do not conflate installation, updating, and launching into single "Play" buttons. Avoid any action that performs silent mutations (installs/updates). Actions must be explicit and read-only unless specifically in an installation phase.

## Environment & Build Rules
1. **Rust Environment Paths**:
   - `CARGO_HOME` and `RUSTUP_HOME` **MUST** reside on `C:` (NTFS format). They cannot live on FAT32.
   - `CARGO_TARGET_DIR` (build artifact overflow) should be redirected to `D:\DevCache\Rust\target` (FAT32-safe).
2. **Artifact Management**: Do not blindly stage generated build outputs, `target/` directories, or installer bundles (like `.msi` or `.exe`). Ensure `git status` is clean of build junk before committing.
