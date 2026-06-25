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
  sourceAvailable: boolean;
  devRunnable: boolean;
  buildAvailable: boolean;
  playableAvailable: boolean;
  playableMode: string;
  restorationDeferred: boolean;
  coreLesson: string;
  shortDescription: string;
  controls: string;
  notes: string;
}

export const tier1Roster: GameManifest[] = manifest.games;
