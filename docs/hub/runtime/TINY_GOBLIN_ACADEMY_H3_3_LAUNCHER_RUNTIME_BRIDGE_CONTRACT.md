# Tiny Goblin Academy H3.3 — Launcher / Runtime Bridge Contract

## 1. Purpose
Define the foundational bridge contract between the Tiny Goblin Academy Hub (React/Vite) and the native Tauri shell (Rust). This contract dictates how the Hub models, queries, and mutates the installation, build, update, and launch states of the Academy mini-games.

## 2. Non-goals
- **No immediate implementation**: This is a design/contract document. Do not implement game launching, installation, or artifact downloads yet.
- **No dev-server spawning**: The launcher must not silently spawn dev servers.
- **No silent installs**: The launcher must not run `pnpm install` silently.

## 3. Current State
- **Tauri Shell Exists**: We have a verified, restricted Tauri shell (H3.2) capable of rendering the Hub.
- **UI Bridge Spike**: A safe diagnostic command (`get_diagnostic_info`) is wired up.
- **Boot/Runtime Doctrine**: Developer/source modes are distinctly separate from Production/artifact modes. Boot screens belong with game launch behavior, not before it exists.

## 4. Mode Split
The contract strictly segregates Developer Mode from Production Mode, avoiding a "cursed goblin button" that conflates the two.

### Developer Mode
- Assumes source files, `pnpm`, Vite, TypeScript, and dev dependencies are available in the repository.
- Understands workspace packages, root `pnpm install` state, and dev/build script availability.
- Acknowledges if a game has a local static build artifact.
- **MUST NOT** claim a game is "player installed" just because its workspace dependencies exist.
- **MUST NOT** silently spawn dev servers or run `pnpm install`.
- Eventually exposes developer actions (e.g., check source status, check dependencies, build static artifact, open local static build). Dev server runs must require explicit confirmation.

### Production Mode
- Assumes the player does NOT have source files, `pnpm`, or dev dependencies.
- "Install" means downloading/extracting a playable artifact to a local app-owned location.
- "Update" compares the local installed version to a remote manifest or butlerd cave state.
- "Uninstall" specifically removes the local playable artifact and updates local state.
- "Launch" executes the local playable artifact, never a dev server.

## 5. Game State Vocabulary
The Hub card state is modeled using the following explicitly defined vocabulary:

- **listed**: The game is known in the Hub catalog/roster.
- **sourceAvailable**: (Dev Mode) The source code directory exists locally.
- **workspaceMember**: (Dev Mode) The game is formally recognized as a workspace package.
- **dependenciesInstalled**: (Dev Mode) The `node_modules` for this game are populated, but this is NOT the same as a player "installed" state.
- **devRunnable**: (Dev Mode) The game has a dev server script available, but is not "production-ready".
- **buildAvailable**: (Dev Mode) A local static artifact has been built from source. Not necessarily "installed" in a player sense.
- **installed**: (Production Mode) A production-ready, playable artifact exists locally in an app-owned path.
- **installable**: A playable artifact is available to download/install.
- **playableAvailable**: An overarching state confirming that the user can click "Play". Maps to `buildAvailable` in Dev mode, or `installed` in Production mode.
- **playableMode**: Enum of how it can be played (`none | dev | static | bundled | itch-cave`).
- **runtimeManaged**: The artifact is managed by a specific runtime (e.g., Tauri, butlerd).
- **distributionReady**: A built artifact has been verified and is ready for distribution uploads.
- **updateAvailable**: The remote version exceeds the `installedVersion`.
- **installedVersion**: The version currently installed on the user's machine.
- **availableVersion**: The latest version available remotely.
- **installSize**: The required disk space for the artifact.
- **lastChecked**: Timestamp of the last update/manifest check.
- **lastPlayed**: Timestamp of the last game launch.
- **errorState**: Any current diagnostic or failure state for the game.

## 6. Hub Card State Model
Hub cards will rely on the vocabulary above. For example, in Dev mode, a game might show "Source Available" but not "Build Available", blocking the Play button until a static build is generated. In Production mode, an uninstalled game will show "Install", checking the remote manifest to transition to "Installed".

## 7. Backend Command Contract
Future Tauri commands required to support this state model. All commands must be strictly typed, narrow, game-ID based, and avoid arbitrary shell/filesystem execution.

- `get_runtime_status()`: Returns the overall Hub runtime mode (Dev vs Production).
- `get_game_status(gameId)`: Returns the current state vocabulary for a specific game.
- `list_game_statuses()`: Returns state for all roster games.
- `build_game_static(gameId)`: (Dev only) Generates a local static build. Requires confirmation. Mutates state.
- `install_game(gameId)`: (Production only) Downloads/installs an artifact. Requires confirmation. Mutates state.
- `uninstall_game(gameId)`: Removes artifact/cave. Requires confirmation. Mutates state.
- `launch_game(gameId)`: Launches the playable artifact (or explicitly confirmed dev server).
- `check_game_updates()`: Queries manifest/butlerd for new versions.
- `update_game(gameId)`: Applies an available update. Requires confirmation. Mutates state.
- `open_game_folder(gameId)`: Safe path-restricted open of the game's data/install folder.

## 8. Dev Mode Command Candidates
- `get_game_status(gameId)` (inspects `src`, `node_modules`, `dist` directories)
- `build_game_static(gameId)`

## 9. Production Mode Command Candidates
- `install_game(gameId)`
- `update_game(gameId)`

## 10. Local Persistence Model
In Production Mode, install states, versions, and paths will be tracked in a local SQLite or JSON datastore managed by the Tauri backend (or delegated entirely to butlerd if Option C is chosen).

## 11. Future Artifact Hosting Options
- **Option A (Bundled Academy Package)**: Easiest release, ships all games with the Hub. Does not support selective install/uninstall cleanly.
- **Option B (Static Artifact Manifest via R2/S3/CDN)**: Maximum control. Launcher downloads selected games into app data, checks manifests, and updates individually. Higher infrastructure responsibility.
- **Option C (itch/butlerd)**: Modern launcher path. Delegates cave management, updates, and integrity to the itch daemon.

*Recommendation*: Start Dev Mode using local static builds. For Production, Option B (R2/S3 Manifest) is best for ultimate control, but Option C (butlerd) is highly elegant if the itch ecosystem remains the primary distribution backbone. We will evaluate these fully later.

## 12. Future Butler/butlerd Option
If utilizing itch.io heavily, integrating `butlerd` over JSON-RPC allows itch to manage builds/patches entirely, providing a AAA-style delta-patching update mechanism.

## 13. Future R2/S3/CDN Manifest Option
A custom JSON manifest hosted on R2. The Hub reads the manifest, compares hashes/versions, downloads zips, and extracts them to an app-owned data folder.

## 14. Update Model
1. Backend checks remote manifest/butlerd.
2. Compares `installedVersion` vs `availableVersion`.
3. If new, set `updateAvailable`.
4. User confirms update.
5. Download/patch artifact.
6. Status updates.

## 15. Uninstall Model
1. User confirms uninstall.
2. Backend deletes the app-owned artifact/cave (Production mode only).
3. Dev mode source files are NEVER deleted.
4. User/save data deletion is explicit and handled separately.

## 16. Launch Model
- **Dev Mode**: Launching a dev server requires explicit developer action. Otherwise, launch the static build.
- **Production Mode**: Launch the local artifact.
- *Note: Game boot screens integrate here. They must not run until actual launch behavior exists.*

## 17. Boot Screen Relationship
Game boot screens belong in the launch phase. They are not to be conflated with the Hub's boot screen. A game's boot screen will only render once the `launch_game(gameId)` command is executed and the artifact is initializing.

## 18. Security / Permissions
- 🚫 **No broad shell permissions.**
- 🚫 **No arbitrary path deletion.**
- 🚫 **No arbitrary process execution.**
- Install roots MUST be app-owned or user-selected.
- Game IDs MUST map through verified manifests (no raw user paths).
- Destructive actions MUST require user confirmation.
- Logs MUST sanitize secrets/tokens.

## 19. H3.4+ Implementation Sequence
1. **H3.4**: Read-only runtime status model in Hub (React UI).
2. **H3.5**: Dev-mode build status detection (Rust -> React).
3. **H3.6**: Explicit static build command for one game.
4. **H3.7**: Open local static build.
5. **H3.8**: Production artifact manifest prototype.
6. **H3.9**: Install/uninstall local static artifact prototype.
7. **H3.10**: Update check prototype.
8. **Later**: Butler/butlerd spike evaluation.

## 20. Acceptance Checklist
- [x] Defines Developer Mode vs Production Mode
- [x] Establishes vocabulary for source vs installed vs runnable
- [x] Outlines Tauri backend command requirements and strict safety bounds
- [x] Proposes future hosting/update models without committing to implementation
- [x] Establishes an ordered sequence for H3.4+
