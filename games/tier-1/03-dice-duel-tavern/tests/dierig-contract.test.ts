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
  it('keeps every approved H6.10 laboratory source byte-identical during live integration', () => {
    expect(labFiles.filter((path) => !existsSync(repoFile(path)))).toEqual([]);
    expect(sha256(labFiles[0])).toBe('b43b543e1a2d745b371e396d96cdfac33011c99543792eda4cef9932838d72b2');
    expect(sha256(labFiles[1])).toBe('0c57be0d8fb3c3b96eb2739d37acee6547029961dad37232f50f24779103f3d7');
    expect(sha256(labFiles[2])).toBe('3667c89ad4f4898770bf9d8e1954132bc79d51225ad50340d3c4858733cb5717');
    expect(sha256(labFiles[3])).toBe('20f7064a7268bbe33bc1444ad0eca9f01bdb0f0212a6694d6ac0877e2dbb2eb0');
    expect(sha256(labFiles[4])).toBe('6bbcf59547b2fac976800ccd0433124dc49b241661f5a3821cb3a84e609f2e3b');
    expect(sha256(labFiles[5])).toBe('04643756f7fb9bf8e26f96a527377c0f1357355c370b2c53fb1c62b54b4e08cf');
    expect(sha256(labFiles[6])).toBe('1f0ef15d7b961774315f6b8c5d15af4c215908fd2be65dadd2287c198f0cc67c');
    expect(sha256(labFiles[7])).toBe('cf644a10e04c39d28aacd5c35b3966aab0b2f7952d83369702750e7ce5d60e67');
    expect(sha256(labFiles[8])).toBe('b1b9ecdf0b4f8c9dd5fc6d54f6240ab79670ed1f6f995c84736201e6c0c243b7');
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
