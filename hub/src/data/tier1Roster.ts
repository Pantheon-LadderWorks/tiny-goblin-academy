import manifest from '../../../manifests/academy/core/academy.games.json';

export interface GameManifest {
  id: string;
  tier: number;
  level: number;
  title: string;
  slug: string;
  sourcePath: string | null;
  status: string;
  displayStatus: string;
  historicallyPassed: boolean;
  restorationDeferred: boolean;
  coreLesson: string;
  shortDescription: string;
  controls: string;
  notes: string;
  
  // Dynamic fields from runtime status
  listed?: boolean;
  sourceDirectoryExists?: boolean;
  packageJsonExists?: boolean;
  workspaceMember?: boolean;
  nodeModulesExists?: boolean;
  hasDevScript?: boolean;
  hasBuildScript?: boolean;
  hasPreviewScript?: boolean;
  distExists?: boolean;
  distHasIndexHtml?: boolean;
  distAssetCount?: number;
  buildStatus?: string;
  
  // Dev Action Model
  devLaunchAvailable?: boolean;
  devInstallDepsAvailable?: boolean;
  devUninstallDepsAvailable?: boolean;
  devLaunchBlockedReason?: string | null;

  // Prod Action Model
  productionInstallAvailable?: boolean;
  productionUninstallAvailable?: boolean;
  productionLaunchAvailable?: boolean;
  productionUpdateAvailable?: boolean;
  productionActionBlockedReason?: string | null;

  // H3.4 Compatibility fields
  sourceAvailable?: boolean;
  dependenciesInstalled?: boolean;
  devRunnable?: boolean;
  buildAvailable?: boolean;
  installed?: boolean;
  installable?: boolean;
  playableAvailable?: boolean;
  playableMode?: string;
  runtimeManaged?: boolean;
  distributionReady?: boolean;
  updateAvailable?: boolean;
  installedVersion?: string | null;
  availableVersion?: string | null;
  installSize?: number | null;
  lastChecked?: string | null;
  lastPlayed?: string | null;
  errorState?: string | null;

  // Frontend merge diagnostic: true only after Tauri backend status has
  // supplied live runtime/source readiness for this roster entry.
  runtimeStatusLoaded?: boolean;
  runtimeStatusError?: string | null;
}

export const tier1Roster: GameManifest[] = manifest.games;
