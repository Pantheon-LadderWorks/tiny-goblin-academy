import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(evidenceRoot, '../..');
const repoRoot = path.resolve(gameRoot, '../../..');
const baseline = '022afcecf64e11d80491c45a0ef566f13cec51e7';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const repoRelative = (absolute) => path.relative(repoRoot, absolute).replaceAll('\\', '/');

const protectedPaths = [
  'dierig-lab.html',
  'vite.config.ts',
  'src/dierig/cube-projection.ts',
  'src/dierig/dierig-authority.ts',
  'src/dierig/dierig-model.ts',
  'src/dierig/dierig.ts',
  'src/dierig/face-mapping.ts',
  'src/dierig/lab-main.ts',
  'src/dierig/lab-styles.css',
  'src/dierig/motion-plan.ts',
  'src/live-die-layout.ts',
  'src/live-dierig-presentation.ts',
  'src/live-duel-controller.ts',
  'src/roll-source.ts',
  'src/simulation.ts',
];

const protectedHashes = {};
for (const relative of protectedPaths) {
  const absolute = path.join(gameRoot, relative);
  const repositoryPath = repoRelative(absolute);
  const currentSha256 = sha256(await readFile(absolute));
  const baselineSha256 = sha256(execFileSync('git', ['show', `${baseline}:${repositoryPath}`], { cwd: repoRoot }));
  protectedHashes[relative] = { baselineSha256, currentSha256, unchanged: baselineSha256 === currentSha256 };
}

const assetPaths = [
  'assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png',
  'assets/academy/materials/source/h5-100c/kenney/extracted-selected/wall_timber.png',
  'assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/wooden.png',
  'assets/academy/materials/source/h5-100c/opengameart/deadkir-handpainted-tileables/originals/metal_plates.png',
  'assets/academy/materials/source/h5-100/ambientcg/extracted-color/Metal008/Metal008_1K-JPG_Color.jpg',
];
const assetHashes = {};
for (const relative of assetPaths) assetHashes[relative] = sha256(await readFile(path.join(repoRoot, relative)));

const protectedReport = {
  baseline,
  protectedFiles: protectedHashes,
  allProtectedFilesUnchanged: Object.values(protectedHashes).every((entry) => entry.unchanged),
};
await writeFile(path.join(evidenceRoot, 'protected-hashes.json'), `${JSON.stringify(protectedReport, null, 2)}\n`, 'utf8');
await writeFile(path.join(evidenceRoot, 'asset-source-hashes.json'), `${JSON.stringify({ sources: assetHashes }, null, 2)}\n`, 'utf8');
if (!protectedReport.allProtectedFilesUnchanged) throw new Error('Protected H6.10/H6.11 file drift detected.');
