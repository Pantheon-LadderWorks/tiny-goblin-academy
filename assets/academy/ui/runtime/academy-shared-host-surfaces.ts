export type AcademyHostSurfaceId =
  | 'ui-hud.dark-panel.long'
  | 'ui-hud.frame-large.teal'
  | 'ui-hud.paper-label.small';

export type AcademyHostSurfaceVerdict = 'used' | 'constrained' | 'rejected';

export interface AcademyHostSurfaceSlot {
  name: string;
  authorityId: string;
  contentKind: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

export interface AcademyHostSurfaceSpec {
  id: AcademyHostSurfaceId;
  regionIndex: number;
  sourceRegionId: string;
  sourceRect: { x: number; y: number; width: number; height: number };
  naturalSize: { width: number; height: number };
  sourceRegionManifest: string;
  slotAuthorityManifest: string;
  assetUrl: string | null;
  runtimeVerdict: AcademyHostSurfaceVerdict;
  runtimeReason: string;
  scalePolicy: 'uniform-contain-no-stretch';
  slots: AcademyHostSurfaceSlot[];
  protectedZones: string[];
}

const SOURCE_REGION_MANIFEST = 'manifests/academy/shared/academy.ui-hud.regions.json';
const SLOT_AUTHORITY_MANIFEST = 'manifests/academy/shared/planning/academy.ui-hud.functional-surfaces.json';

const region20AssetUrl = new URL(
  './crops/tga-ui-hud-region-20-large-teal-frame-v0.1.png',
  import.meta.url,
).href;

const region30AssetUrl = new URL(
  './crops/tga-ui-hud-region-30-small-paper-label-v0.1.png',
  import.meta.url,
).href;

export const ACADEMY_SHARED_HOST_SURFACES: Record<AcademyHostSurfaceId, AcademyHostSurfaceSpec> = {
  'ui-hud.dark-panel.long': {
    id: 'ui-hud.dark-panel.long',
    regionIndex: 5,
    sourceRegionId: 'ui-hud.dark-panel.long',
    sourceRect: { x: 1925, y: 124, width: 574, height: 174 },
    naturalSize: { width: 574, height: 174 },
    sourceRegionManifest: SOURCE_REGION_MANIFEST,
    slotAuthorityManifest: SLOT_AUTHORITY_MANIFEST,
    assetUrl: null,
    runtimeVerdict: 'rejected',
    runtimeReason: 'Four uniform instances crowd the actor and encounter-label lanes at narrow width; one instance cannot host all four HUD values within the reviewed two-slot contract.',
    scalePolicy: 'uniform-contain-no-stretch',
    slots: [
      { name: 'label', authorityId: 'ui-hud.functional-surface.dark-panel.long.left-label', contentKind: 'short-label', xPct: 11, yPct: 25, widthPct: 34, heightPct: 46 },
      { name: 'value', authorityId: 'ui-hud.functional-surface.dark-panel.long.right-value', contentKind: 'short-value-or-number', xPct: 49, yPct: 25, widthPct: 40, heightPct: 46 },
    ],
    protectedZones: ['outer-border'],
  },
  'ui-hud.frame-large.teal': {
    id: 'ui-hud.frame-large.teal',
    regionIndex: 20,
    sourceRegionId: 'ui-hud.frame-large.teal',
    sourceRect: { x: 960, y: 881, width: 665, height: 401 },
    naturalSize: { width: 665, height: 401 },
    sourceRegionManifest: SOURCE_REGION_MANIFEST,
    slotAuthorityManifest: SLOT_AUTHORITY_MANIFEST,
    assetUrl: region20AssetUrl,
    runtimeVerdict: 'used',
    runtimeReason: 'The reviewed title, body, and footer slots match the compact victory/result content at desktop and narrow widths.',
    scalePolicy: 'uniform-contain-no-stretch',
    slots: [
      { name: 'title', authorityId: 'ui-hud.functional-surface.frame-large.teal.title-band', contentKind: 'short-text', xPct: 13, yPct: 13, widthPct: 74, heightPct: 14 },
      { name: 'body', authorityId: 'ui-hud.functional-surface.frame-large.teal.body-field', contentKind: 'short-body-text', xPct: 13, yPct: 32, widthPct: 74, heightPct: 45 },
      { name: 'footer', authorityId: 'ui-hud.functional-surface.frame-large.teal.footer-field', contentKind: 'tiny-text-or-status', xPct: 18, yPct: 79, widthPct: 64, heightPct: 10 },
    ],
    protectedZones: ['frame-border'],
  },
  'ui-hud.paper-label.small': {
    id: 'ui-hud.paper-label.small',
    regionIndex: 30,
    sourceRegionId: 'ui-hud.paper-label.small',
    sourceRect: { x: 1075, y: 1338, width: 289, height: 132 },
    naturalSize: { width: 289, height: 132 },
    sourceRegionManifest: SOURCE_REGION_MANIFEST,
    slotAuthorityManifest: SLOT_AUTHORITY_MANIFEST,
    assetUrl: region30AssetUrl,
    runtimeVerdict: 'constrained',
    runtimeReason: 'Used only for the existing one-line upgrade kicker; the Bonk card and all actions remain game-owned code-native UI.',
    scalePolicy: 'uniform-contain-no-stretch',
    slots: [
      { name: 'label', authorityId: 'ui-hud.functional-surface.paper-label.small.short-label', contentKind: 'short-label', xPct: 14, yPct: 27, widthPct: 72, heightPct: 42 },
    ],
    protectedZones: ['paper-edge'],
  },
};

export function getAcademyHostSurface(id: string): AcademyHostSurfaceSpec | undefined {
  return ACADEMY_SHARED_HOST_SURFACES[id as AcademyHostSurfaceId];
}

export function getAcademyHostSurfaceCssVariables(surface: AcademyHostSurfaceSpec) {
  return {
    '--academy-host-aspect': `${surface.naturalSize.width} / ${surface.naturalSize.height}`,
  };
}

export function getAcademyHostSurfaceSlotCssVariables(slot: AcademyHostSurfaceSlot) {
  return {
    '--academy-slot-x': `${slot.xPct}%`,
    '--academy-slot-y': `${slot.yPct}%`,
    '--academy-slot-width': `${slot.widthPct}%`,
    '--academy-slot-height': `${slot.heightPct}%`,
  };
}

export function academyCssVariablesToString(variables: Record<string, string>) {
  return Object.entries(variables).map(([name, value]) => `${name}:${value}`).join(';');
}

export function bindAcademyHostSurfaceFallbacks(root: ParentNode = document) {
  root.querySelectorAll<HTMLImageElement>('[data-academy-host-asset]').forEach((asset) => {
    const host = asset.closest<HTMLElement>('[data-academy-host-surface]');
    if (!host) return;

    const useFallback = () => {
      host.dataset.assetState = 'fallback';
    };

    asset.addEventListener('error', useFallback, { once: true });
    if (asset.complete && asset.naturalWidth === 0) useFallback();
  });
}
