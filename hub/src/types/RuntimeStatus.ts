export type RuntimeMode = "developer" | "production";
export type PlayableMode = "none" | "dev" | "static" | "bundled" | "itch-cave";

export interface GameStatus {
  gameId: string;
  listed: boolean;
  sourceAvailable: boolean;
  workspaceMember: boolean;
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
