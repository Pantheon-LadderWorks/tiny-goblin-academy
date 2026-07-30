#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {cp, mkdir, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const game = join(repo, 'games/tier-1/05-dungeon-key-run');
const contract = JSON.parse(await readFile(join(game, 'private-actor-overlay.contract.json'), 'utf8'));
const destination = join(game, 'public/__private_runtime__/dungeon-key-actors');
const expectedActors = new Map(contract.actors.map((actor) => [actor.actorId, actor.sourceArchiveSha256]));

export class OverlayProjectionError extends Error {}

const hashBuffer = (value) => createHash('sha256').update(value).digest('hex');
const hashFile = async (path) => hashBuffer(await readFile(path));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const canonicalize = (value) => Array.isArray(value)
  ? value.map(canonicalize)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]))
    : value;

function sourceManifestPath(value) {
  if (!value) throw new OverlayProjectionError('overlay root is not configured');
  const configured = resolve(value);
  return configured.toLowerCase().endsWith('.json') ? configured : join(configured, 'manifest.json');
}

function safeRelative(path) {
  return typeof path === 'string' && !isAbsolute(path) && !path.split(/[\\/]/).includes('..') && path.endsWith('.png');
}

async function validateManifest(manifestPath, root) {
  let manifest;
  try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { throw new OverlayProjectionError('invalid-manifest'); }
  if (manifest.schema_version !== contract.schemaVersion) throw new OverlayProjectionError('unsupported-version');
  if (manifest.pilot_id !== contract.pilotId || manifest.game_id !== contract.gameId || !Array.isArray(manifest.actors) || manifest.actors.length !== 2) throw new OverlayProjectionError('invalid-manifest');
  const identity = {schema_version: manifest.schema_version, pilot_id: manifest.pilot_id, game_id: manifest.game_id, generator: manifest.generator, actors: manifest.actors};
  if (hashBuffer(JSON.stringify(canonicalize(identity))) !== manifest.bundle_identity_sha256) throw new OverlayProjectionError('invalid-manifest');
  const actualIds = new Set(manifest.actors.map((actor) => actor.actor_id));
  if (actualIds.size !== 2 || [...expectedActors.keys()].some((actorId) => !actualIds.has(actorId))) throw new OverlayProjectionError('invalid-manifest');
  const files = [];
  for (const actor of manifest.actors) {
    if (actor.source_archive_sha256 !== expectedActors.get(actor.actor_id) || actor.actor_profile_authority !== contract.actorProfileAuthority || !Array.isArray(actor.animations) || actor.animations.length !== 8) throw new OverlayProjectionError('invalid-manifest');
    for (const animation of actor.animations) {
      const record = animation.strip;
      if (!record || !safeRelative(record.path)) throw new OverlayProjectionError('invalid-manifest');
      const file = resolve(root, record.path);
      if (!file.startsWith(`${resolve(root)}${sep}`) || !existsSync(file)) throw new OverlayProjectionError('missing');
      const info = await stat(file);
      if (info.size !== record.bytes || await hashFile(file) !== record.sha256) throw new OverlayProjectionError('hash-mismatch');
      files.push({source: file, relative: record.path, sha256: record.sha256});
    }
  }
  const pngs = [];
  async function walk(directory) { for (const entry of await readdir(directory, {withFileTypes: true})) { const full = join(directory, entry.name); if (entry.isDirectory()) await walk(full); else if (entry.name.endsWith('.png')) pngs.push(relative(root, full).replaceAll('\\', '/')); } }
  await walk(root);
  if (pngs.length !== files.length || pngs.some((path) => !files.some((file) => file.relative === path))) throw new OverlayProjectionError('invalid-manifest');
  return {manifest, files};
}

function assertDestination(path) {
  if (resolve(path) !== resolve(destination)) throw new OverlayProjectionError('refusing unsafe projection target');
}

export async function clean() {
  assertDestination(destination);
  await rm(destination, {recursive: true, force: true});
}

export async function materialize(sourceValue) {
  const manifestPath = sourceManifestPath(sourceValue);
  const sourceRoot = dirname(manifestPath);
  const validated = await validateManifest(manifestPath, sourceRoot);
  const temporary = `${destination}.tmp`;
  await rm(temporary, {recursive: true, force: true});
  await mkdir(temporary, {recursive: true});
  try {
    for (const file of validated.files) {
      const target = join(temporary, file.relative);
      await mkdir(dirname(target), {recursive: true});
      await cp(file.source, target);
    }
    await writeFile(join(temporary, 'manifest.json'), json(validated.manifest), 'utf8');
    await validateManifest(join(temporary, 'manifest.json'), temporary);
    await clean();
    await mkdir(destination, {recursive: true});
    for (const file of validated.files) {
      const target = join(destination, file.relative);
      await mkdir(dirname(target), {recursive: true});
      await cp(join(temporary, file.relative), target);
    }
    // Manifest-last means an interrupted projection can never look complete.
    await cp(join(temporary, 'manifest.json'), join(destination, 'manifest.json'));
    await rm(temporary, {recursive: true, force: true});
  } catch (error) {
    await rm(temporary, {recursive: true, force: true});
    throw error;
  }
  return status();
}

export async function status() {
  const manifestPath = join(destination, 'manifest.json');
  if (!existsSync(manifestPath)) return {status: 'fallback-active', reason: 'missing', pilotId: contract.pilotId, actors: {'female-goblin': 'missing', thug: 'missing'}};
  try {
    const {manifest, files} = await validateManifest(manifestPath, destination);
    return {status: 'available', pilotId: contract.pilotId, bundleIdentity: manifest.bundle_identity_sha256, actors: {'female-goblin': 'available', thug: 'available'}, files: files.length, projection: 'ignored-generated-cache'};
  } catch (error) {
    return {status: 'fallback-active', reason: error.message, pilotId: contract.pilotId, actors: {'female-goblin': 'invalid', thug: 'invalid'}};
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const sourceFlag = args.indexOf('--source');
  const source = sourceFlag >= 0 ? args[sourceFlag + 1] : process.env.TGA_DUNGEON_KEY_ACTOR_OVERLAY;
  let result;
  if (command === 'materialize') result = await materialize(source);
  else if (command === 'verify' || command === 'status') result = await status();
  else if (command === 'clean') { await clean(); result = await status(); }
  else throw new OverlayProjectionError('usage: materialize|verify|status|clean [--source <private-overlay-root>]');
  console.log(json(result).trim());
  if (command === 'verify' && result.status !== 'available') process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(json({status: 'error', reason: error.message}).trim()); process.exitCode = 1; });
