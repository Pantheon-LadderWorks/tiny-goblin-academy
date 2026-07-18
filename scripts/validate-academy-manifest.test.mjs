import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

test('accepts current per-game build availability metadata', () => {
  const result = spawnSync(process.execPath, [path.join(scriptsDir, 'validate-academy-manifest.mjs')], {
    cwd: path.resolve(scriptsDir, '..'),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});
