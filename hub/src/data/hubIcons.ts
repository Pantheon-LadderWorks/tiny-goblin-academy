import manifest from '../../../manifests/hub.icons.json';
import sheetImage from '../../../assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png';

export interface HubIconMapSheet {
  id: string;
  imagePath: string;
  columns: number;
  rows: number;
  notes: string;
}

export interface HubIconEntry {
  gameId: string;
  slug: string;
  row: number;
  col: number;
  label: string;
  used: boolean;
  notes: string;
}

export interface HubIconManifest {
  schemaVersion: string;
  manifestType: string;
  project: string;
  status: string;
  sheet: HubIconMapSheet;
  icons: HubIconEntry[];
}

export const hubIconManifest = manifest as HubIconManifest;

// Make the resolved vite image path available to the consumer
export const hubIconSheetImage = sheetImage;

export function getIconForGame(gameId: string): HubIconEntry | undefined {
  return hubIconManifest.icons.find((icon) => icon.gameId === gameId);
}
