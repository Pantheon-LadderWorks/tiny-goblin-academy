export type RuntimeMode = "developer" | "production";
export type PlayableMode = "none" | "dev" | "static" | "bundled" | "itch-cave";

export type BuildStatus = "not-applicable" | "not-built" | "built" | "incomplete" | "unknown";

export interface GameStatus {
  gameId: string;
  slug: string;
  listed: boolean;
  sourceDirectoryExists: boolean;
  packageJsonExists: boolean;
  workspaceMember: boolean;
  nodeModulesExists: boolean;
  hasDevScript: boolean;
  hasBuildScript: boolean;
  hasPreviewScript: boolean;
  distExists: boolean;
  distHasIndexHtml: boolean;
  distAssetCount: number;
  buildStatus: BuildStatus;

  // Dev Action Model
  devLaunchAvailable: boolean;
  devInstallDepsAvailable: boolean;
  devUninstallDepsAvailable: boolean;
  devLaunchBlockedReason: string | null;

  // Prod Action Model
  productionInstallAvailable: boolean;
  productionUninstallAvailable: boolean;
  productionLaunchAvailable: boolean;
  productionUpdateAvailable: boolean;
  productionActionBlockedReason: string | null;

  // H3.4 Compatibility fields
  sourceAvailable: boolean;
  dependenciesInstalled: boolean;
  devRunnable: boolean;
  buildAvailable: boolean;
  installed: boolean;
  installable: boolean;
  playableAvailable: boolean;
  playableMode: PlayableMode;
  runtimeManaged: boolean;
  distributionReady: boolean;
  updateAvailable: boolean;
  installedVersion: string | null;
  availableVersion: string | null;
  installSize: number | null;
  lastChecked: string | null;
  lastPlayed: string | null;
  errorState: string | null;
}

export interface HubRuntimeStatus {
  runtimeMode: RuntimeMode;
}

export interface InstallDevDependenciesResult {
  gameId: string;
  ok: boolean;
  commandLabel: string;
  startedAt: string;
  finishedAt: string;
  exitCode: number | null;
  stdoutTail: string;
  stderrTail: string;
  dependenciesInstalledAfter: boolean;
  errorState: string | null;
}
