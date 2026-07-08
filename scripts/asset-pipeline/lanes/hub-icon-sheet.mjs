#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const result = spawnSync('node', ['scripts/asset-pipeline/cli.mjs', 'profile', '--type', 'hub-icon-sheet', ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
