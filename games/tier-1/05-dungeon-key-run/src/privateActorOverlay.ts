export const OVERLAY_SCHEMA_VERSION = '1.0.0';
export const OVERLAY_PILOT_ID = 'glyphforge-craftpix-dungeon-key-runtime-overlay-v0.1';
export const OVERLAY_GAME_ID = 'tga-05-dungeon-key-run';
export const OVERLAY_PROFILE_AUTHORITY = 'detailed-expressive-top-down-vector-family-v0.1@725ea4426a2b9b2c39aa326c1b7167d412fe55a1';
export const OVERLAY_MANIFEST_URL = '__private_runtime__/dungeon-key-actors/manifest.json';

const EXPECTED_ACTORS = {
  'female-goblin': '8c6f07c0bada27315c95998c2e5e94031f37fd4835a8fc4164f9e04428bf5704',
  thug: 'b1643995718d2cfd2dbff4ae55faac9036a77355a7385fa07e179d78aa8872cd',
} as const;

export type OverlayFailureStatus =
  | 'missing'
  | 'invalid-manifest'
  | 'hash-mismatch'
  | 'unsupported-version';

export type OverlayStatus = 'available' | 'fallback-active' | OverlayFailureStatus;

export interface RuntimeStrip {
  path: string;
  sha256: string;
  bytes: number;
  dimensions: [number, number];
  frame_dimensions: [number, number];
  url?: string;
}

export interface RuntimeAnimation {
  name: string;
  action: 'idle' | 'walk';
  direction: 'down' | 'up' | 'left' | 'right';
  frame_count: number;
  duration_ms: number;
  loop: true;
  strip: RuntimeStrip;
}

export interface RuntimeActor {
  actor_id: keyof typeof EXPECTED_ACTORS;
  role: string;
  source_archive_sha256: string;
  actor_profile_authority: string;
  visible_content_height_px: number;
  normalized_canvas: [number, number];
  logical_ground_point: [number, number];
  phaser_origin: [number, number];
  rendering_mode: 'uniform-smooth';
  contact_shadow_authority: 'separate-governed-soft-ellipse';
  animations: RuntimeAnimation[];
}

export interface RuntimeOverlayManifest {
  schema_version: string;
  pilot_id: string;
  game_id: string;
  generator: {id: string; version: string};
  bundle_identity_sha256: string;
  actors: RuntimeActor[];
}

export interface OverlayResolution {
  status: OverlayStatus;
  reason?: OverlayFailureStatus;
  manifest?: RuntimeOverlayManifest;
  actorStatus: Record<keyof typeof EXPECTED_ACTORS, 'available' | 'missing' | 'invalid'>;
  fallbackActive: boolean;
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const fallback = (reason: OverlayFailureStatus): OverlayResolution => ({
  status: 'fallback-active',
  reason,
  actorStatus: {'female-goblin': reason === 'missing' ? 'missing' : 'invalid', thug: reason === 'missing' ? 'missing' : 'invalid'},
  fallbackActive: true,
});

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

function isAnimation(value: unknown): value is RuntimeAnimation {
  if (!isRecord(value) || !isRecord(value.strip)) return false;
  return typeof value.name === 'string'
    && (value.action === 'idle' || value.action === 'walk')
    && ['down', 'up', 'left', 'right'].includes(String(value.direction))
    && Number.isInteger(value.frame_count)
    && typeof value.strip.path === 'string'
    && /^[a-f0-9]{64}$/.test(String(value.strip.sha256));
}

function validateManifest(value: unknown): RuntimeOverlayManifest | null {
  if (!isRecord(value) || !Array.isArray(value.actors)) return null;
  if (value.pilot_id !== OVERLAY_PILOT_ID || value.game_id !== OVERLAY_GAME_ID) return null;
  if (value.actors.length !== 2) return null;
  for (const raw of value.actors) {
    if (!isRecord(raw) || typeof raw.actor_id !== 'string' || !(raw.actor_id in EXPECTED_ACTORS)) return null;
    const actorId = raw.actor_id as keyof typeof EXPECTED_ACTORS;
    if (raw.source_archive_sha256 !== EXPECTED_ACTORS[actorId]) return null;
    if (raw.actor_profile_authority !== OVERLAY_PROFILE_AUTHORITY) return null;
    if (!Array.isArray(raw.animations) || raw.animations.length !== 8 || !raw.animations.every(isAnimation)) return null;
    const keys = new Set(raw.animations.map((animation) => `${animation.action}.${animation.direction}`));
    if (keys.size !== 8) return null;
  }
  if (new Set(value.actors.map((actor) => (actor as Record<string, unknown>).actor_id)).size !== 2) return null;
  return value as unknown as RuntimeOverlayManifest;
}

const canonicalize = (value: unknown): unknown => Array.isArray(value)
  ? value.map(canonicalize)
  : isRecord(value)
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]))
    : value;

async function sha256Hex(buffer: BufferSource): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function resolvePrivateActorOverlay(
  fetchImpl: FetchLike = fetch,
  baseUrl: string = document.baseURI,
): Promise<OverlayResolution> {
  const manifestUrl = new URL(OVERLAY_MANIFEST_URL, baseUrl);
  let response: Response;
  try {
    response = await fetchImpl(manifestUrl, {cache: 'no-store'});
  } catch {
    return fallback('missing');
  }
  if (!response.ok) return fallback('missing');
  if (!response.headers.get('content-type')?.includes('application/json')) return fallback('missing');
  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return fallback('invalid-manifest');
  }
  if (isRecord(raw) && raw.schema_version !== OVERLAY_SCHEMA_VERSION) return fallback('unsupported-version');
  const manifest = validateManifest(raw);
  if (!manifest) return fallback('invalid-manifest');
  const identity = {schema_version: manifest.schema_version, pilot_id: manifest.pilot_id, game_id: manifest.game_id, generator: manifest.generator, actors: manifest.actors};
  if (await sha256Hex(new TextEncoder().encode(JSON.stringify(canonicalize(identity)))) !== manifest.bundle_identity_sha256) return fallback('invalid-manifest');
  const projectionRoot = new URL('.', manifestUrl);
  try {
    for (const actor of manifest.actors) {
      for (const animation of actor.animations) {
        if (animation.strip.path.startsWith('/') || animation.strip.path.includes('..')) return fallback('invalid-manifest');
        const assetUrl = new URL(animation.strip.path, projectionRoot);
        if (assetUrl.origin !== projectionRoot.origin || !assetUrl.pathname.startsWith(projectionRoot.pathname)) return fallback('invalid-manifest');
        const assetResponse = await fetchImpl(assetUrl, {cache: 'no-store'});
        if (!assetResponse.ok) return fallback('missing');
        const bytes = await assetResponse.arrayBuffer();
        if (bytes.byteLength !== animation.strip.bytes || await sha256Hex(bytes) !== animation.strip.sha256) return fallback('hash-mismatch');
        animation.strip.url = assetUrl.href;
      }
    }
  } catch {
    return fallback('missing');
  }
  return {
    status: 'available',
    manifest,
    actorStatus: {'female-goblin': 'available', thug: 'available'},
    fallbackActive: false,
  };
}
