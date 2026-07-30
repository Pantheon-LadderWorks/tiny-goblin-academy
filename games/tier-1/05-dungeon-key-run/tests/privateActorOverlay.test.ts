import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {resolvePrivateActorOverlay} from '../src/privateActorOverlay';

const actors = [
  ['female-goblin', '8c6f07c0bada27315c95998c2e5e94031f37fd4835a8fc4164f9e04428bf5704'],
  ['thug', 'b1643995718d2cfd2dbff4ae55faac9036a77355a7385fa07e179d78aa8872cd'],
] as const;

function fixture(schema = '1.0.0') {
  const files = new Map<string, Uint8Array>();
  const manifestActors = actors.map(([actorId, sourceHash]) => ({
    actor_id: actorId,
    role: actorId === 'female-goblin' ? 'player' : 'enemy-patrol-chaser',
    source_archive_sha256: sourceHash,
    actor_profile_authority: 'detailed-expressive-top-down-vector-family-v0.1@725ea4426a2b9b2c39aa326c1b7167d412fe55a1',
    visible_content_height_px: 224,
    normalized_canvas: [256, 256], logical_ground_point: [128, 244], phaser_origin: [0.5, 0.953125],
    rendering_mode: 'uniform-smooth', contact_shadow_authority: 'separate-governed-soft-ellipse',
    animations: (['down', 'up', 'left', 'right'] as const).flatMap((direction) => (['idle', 'walk'] as const).map((action) => {
      const path = `actors/${actorId}/${action}.${direction}.png`;
      const bytes = new TextEncoder().encode(path);
      files.set(path, bytes);
      return {name: `actor.${actorId}.${action}.${direction}`, action, direction, frame_count: action === 'idle' ? 16 : 20, duration_ms: action === 'idle' ? 1320 : 660, loop: true, strip: {path, bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex'), dimensions: [1, 1], frame_dimensions: [256, 256]}};
    })),
  }));
  const identity = {schema_version: schema, pilot_id: 'glyphforge-craftpix-dungeon-key-runtime-overlay-v0.1', game_id: 'tga-05-dungeon-key-run', generator: {id: 'build-dungeon-key-runtime-overlay', version: '1.0.0'}, actors: manifestActors};
  const canonicalize = (value: unknown): unknown => Array.isArray(value) ? value.map(canonicalize) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize((value as Record<string, unknown>)[key])])) : value;
  const bundle_identity_sha256 = createHash('sha256').update(JSON.stringify(canonicalize(identity))).digest('hex');
  return {manifest: {...identity, bundle_identity_sha256}, files};
}

function fetcher(manifest: unknown, files: Map<string, Uint8Array>, mutate?: (path: string, bytes: Uint8Array) => Uint8Array) {
  return async (input: RequestInfo | URL) => {
    const url = new URL(input.toString());
    if (url.pathname.endsWith('/manifest.json')) return new Response(JSON.stringify(manifest), {status: 200, headers: {'content-type': 'application/json'}});
    const marker = '/dungeon-key-actors/';
    const path = url.pathname.slice(url.pathname.indexOf(marker) + marker.length);
    const bytes = files.get(path);
    return bytes ? new Response(mutate ? mutate(path, bytes) : bytes, {status: 200}) : new Response('', {status: 404});
  };
}

describe('private actor overlay resolver', () => {
  it('keeps the generated projection and personal paths out of public Git', () => {
    const repo = resolve(import.meta.dirname, '../../../..');
    const tracked = execFileSync('git', ['ls-files'], {cwd: repo, encoding: 'utf8'});
    expect(tracked).not.toContain('games/tier-1/05-dungeon-key-run/public/__private_runtime__/');
    for (const relative of [
      'games/tier-1/05-dungeon-key-run/private-actor-overlay.contract.json',
      'games/tier-1/05-dungeon-key-run/src/privateActorOverlay.ts',
      'tools/private-overlays/dungeon-key-actor-overlay.mjs',
    ]) {
      const text = readFileSync(resolve(repo, relative), 'utf8');
      expect(text).not.toContain('C:\\Users\\');
      expect(text).not.toContain('file:///');
    }
  });

  it('activates fallback when the overlay is absent without external acquisition', async () => {
    const result = await resolvePrivateActorOverlay(async () => new Response('', {status: 404}), 'https://local.test/overlay-proof.html');
    expect(result).toMatchObject({status: 'fallback-active', reason: 'missing', fallbackActive: true});
  });

  it('rejects unsupported schemas and malformed actor scope', async () => {
    const unsupported = fixture('2.0.0');
    expect(await resolvePrivateActorOverlay(fetcher(unsupported.manifest, unsupported.files), 'https://local.test/')).toMatchObject({reason: 'unsupported-version'});
    const malformed = fixture();
    malformed.manifest.actors.pop();
    expect(await resolvePrivateActorOverlay(fetcher(malformed.manifest, malformed.files), 'https://local.test/')).toMatchObject({reason: 'invalid-manifest'});
  });

  it('rejects missing and hash-mismatched strips as an all-or-fallback bundle', async () => {
    const missing = fixture();
    missing.files.delete('actors/thug/walk.right.png');
    expect(await resolvePrivateActorOverlay(fetcher(missing.manifest, missing.files), 'https://local.test/')).toMatchObject({reason: 'missing', fallbackActive: true});
    const corrupt = fixture();
    expect(await resolvePrivateActorOverlay(fetcher(corrupt.manifest, corrupt.files, (path, bytes) => path.endsWith('idle.down.png') ? new Uint8Array([9]) : bytes), 'https://local.test/')).toMatchObject({reason: 'hash-mismatch'});
  });

  it('returns Phaser-loadable local URLs only after both actors verify', async () => {
    const valid = fixture();
    const result = await resolvePrivateActorOverlay(fetcher(valid.manifest, valid.files), 'https://local.test/overlay-proof.html');
    expect(result.status).toBe('available');
    expect(result.actorStatus).toEqual({'female-goblin': 'available', thug: 'available'});
    expect(result.manifest?.actors.flatMap((actor) => actor.animations).every((animation) => animation.strip.url?.startsWith('https://local.test/__private_runtime__/'))).toBe(true);
  });
});
