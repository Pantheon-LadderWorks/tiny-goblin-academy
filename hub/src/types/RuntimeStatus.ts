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

export interface UninstallDevDependenciesResult {
  gameId: string;
  ok: boolean;
  uninstallAttempted: boolean;
  startedAt: string;
  finishedAt: string;
  targetLabel: string;
  dependencyPathWasPresent: boolean;
  dependencyPathRemoved: boolean;
  dependenciesInstalledAfter: boolean;
  blockedReason: string | null;
  errorState: string | null;
}

export interface DevGameProcessStatus {
  gameId: string;
  status: string;
  running: boolean;
  pid: number | null;
  url: string | null;
  port: number | null;
  startedAt: string | null;
  packageName: string | null;
  errorState: string | null;
  updatedAt: string | null;
  commandLabel: string | null;
  workspaceRoot: string | null;
  cwdUsed: string | null;
  spawnAttempted: boolean;
  spawnSucceeded: boolean;
  readinessAttempts: number;
  lastReadinessError: string | null;
  stdoutTail: string;
  stderrTail: string;
  blockedReason: string | null;
}

export interface LaunchDevGameResult {
  gameId: string;
  ok: boolean;
  launchAttempted: boolean;
  commandLabel: string;
  pid: number | null;
  url: string | null;
  port: number | null;
  startedAt: string | null;
  stdoutTail: string;
  stderrTail: string;
  blockedReason: string | null;
  errorState: string | null;
}

export interface StopDevGameResult {
  gameId: string;
  ok: boolean;
  stopAttempted: boolean;
  pid: number | null;
  stoppedAt: string | null;
  blockedReason: string | null;
  errorState: string | null;
}
