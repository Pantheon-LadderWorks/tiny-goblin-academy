import manifest from '../../../manifests/academy.games.json';

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
  sourceAvailable?: boolean;
  workspaceMember?: boolean;
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
}

export const tier1Roster: GameManifest[] = manifest.games;
