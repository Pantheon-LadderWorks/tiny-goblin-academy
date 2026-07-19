import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const repoRoot = new URL('../../../../', import.meta.url);
const repoFile = (path: string) => new URL(path, repoRoot);
const read = (path: string) => readFileSync(repoFile(path), 'utf8');
const sha256 = (path: string) => createHash('sha256').update(readFileSync(repoFile(path))).digest('hex');

const labFiles = [
  'games/tier-1/03-dice-duel-tavern/dierig-lab.html',
  'games/tier-1/03-dice-duel-tavern/vite.config.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/face-mapping.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/dierig-model.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/motion-plan.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/dierig-authority.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/dierig.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/lab-main.ts',
  'games/tier-1/03-dice-duel-tavern/src/dierig/lab-styles.css',
];

describe('H6.10 DieRig laboratory source contract', () => {
  it('creates an isolated laboratory without changing the protected live runtime', () => {
    expect(labFiles.filter((path) => !existsSync(repoFile(path)))).toEqual([]);
    expect(sha256('games/tier-1/03-dice-duel-tavern/src/simulation.ts')).toBe('ac5df7c97d6281a40e282e9c28a1ef922aa571f31d5fd4c503f4607254f8ae46');
    expect(sha256('games/tier-1/03-dice-duel-tavern/src/main.ts')).toBe('971922160e934e1049369108637f5281471ac0cc7a428f8fee a9674ace9796b2'.replace(' ', ''));
    expect(sha256('games/tier-1/03-dice-duel-tavern/src/styles.css')).toBe('a0fd2fe18b4fd498af61975e485a2f5989e724bb65164a4905ff0d692a84b5da');
    expect(sha256('games/tier-1/03-dice-duel-tavern/index.html')).toBe('e62fd925b9124179f67ed1c9705c3c781a66c2735da3615b27017101572333a7');
    expect(sha256('games/tier-1/03-dice-duel-tavern/package.json')).toBe('f47d002e87dc3a6da13e571a8bf0086c977d8f5f92ff0a9dc55c98c8cee20798');
    expect(sha256('pnpm-lock.yaml')).toBe('af2e59974669109a578974d3314cbf429510de88fe5eb497ba424b05228acf26');
  });

  it('maps only the six canonical flat-face identities from the reviewed derivative', () => {
    const mapping = existsSync(repoFile(labFiles[2])) ? read(labFiles[2]) : '';
    for (const word of ['one', 'two', 'three', 'four', 'five', 'six']) {
      expect(mapping).toContain(`dice-duel-tavern.dice-face.flat-${word}`);
    }
    for (const rejected of ['glowing-die', 'paired-dice', 'rolling-die', 'tumbling-die', 'dice-cluster']) {
      expect(mapping).not.toContain(rejected);
    }
    expect(mapping).toContain('tga-dice-duel-tavern-cleaned-v0.1.png');
  });

  it('uses one Phaser Mesh2D actor without external 3D, physics, particles, or a final sprite swap', () => {
    const rig = existsSync(repoFile(labFiles[6])) ? read(labFiles[6]) : '';
    expect(rig).toContain('Phaser.GameObjects.Mesh2D');
    expect(rig).toContain('actorId');
    expect(rig).not.toMatch(/Three|Babylon|Matter|particle|emitter|Math\.random|DOM|CSS3D/i);
    expect(rig).not.toMatch(/final.*sprite|replace.*sprite|destroy\(.*mesh/i);
  });

  it('keeps the game entry and isolated laboratory in the production build graph', () => {
    const config = existsSync(repoFile(labFiles[1])) ? read(labFiles[1]) : '';
    expect(config).toContain('index.html');
    expect(config).toContain('dierig-lab.html');
  });
});
