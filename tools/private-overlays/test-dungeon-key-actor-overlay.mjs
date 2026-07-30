import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {clean, materialize, status} from './dungeon-key-actor-overlay.mjs';

const source = process.env.TGA_DUNGEON_KEY_ACTOR_OVERLAY;
if (!source) throw new Error('TGA_DUNGEON_KEY_ACTOR_OVERLAY is required for the focused materializer test');

await clean();
assert.equal((await status()).reason, 'missing');
const available = await materialize(source);
assert.equal(available.status, 'available');
assert.deepEqual(available.actors, {'female-goblin': 'available', thug: 'available'});

const repo = resolve(import.meta.dirname, '../..');
const projection = resolve(repo, 'games/tier-1/05-dungeon-key-run/public/__private_runtime__/dungeon-key-actors');
const manifestPath = resolve(projection, 'manifest.json');
const original = await readFile(manifestPath, 'utf8');
const corrupt = JSON.parse(original);
corrupt.schema_version = '999.0.0';
await writeFile(manifestPath, `${JSON.stringify(corrupt, null, 2)}\n`);
assert.equal((await status()).reason, 'unsupported-version');
await writeFile(manifestPath, original);
assert.equal((await status()).status, 'available');

const tracked = execFileSync('git', ['ls-files'], {cwd: repo, encoding: 'utf8'});
assert.ok(!tracked.includes('public/__private_runtime__'));
assert.ok(existsSync(projection));
console.log(JSON.stringify({status: 'pass', materializer: available, corruptedManifestFallback: 'pass', gitProjectionGuard: 'pass'}, null, 2));
