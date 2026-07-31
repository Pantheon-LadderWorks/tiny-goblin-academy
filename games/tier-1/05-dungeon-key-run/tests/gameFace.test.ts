import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const gameRoot = resolve(import.meta.dirname, '..');

describe('Dungeon Key Run production game face', () => {
  it('provides the approved full-screen Ruin Hall shell', () => {
    const html = readFileSync(resolve(gameRoot, 'index.html'), 'utf8');
    expect(html).toContain('class="academy-shell"');
    expect(html).toContain('id="ruin-hall-stage"');
    expect(html).toContain('id="objective-copy"');
    expect(html).toContain('id="feedback"');
    expect(html).toContain('id="canvas"');
    expect(html).toContain('id="btn-ledger"');
    expect(html).toContain('id="btn-help"');
  });

  it('keeps review-only and private filesystem authority out of production source', () => {
    const files = ['index.html', 'src/main.ts', 'src/sceneAuthority.ts'];
    for (const file of files) {
      const content = readFileSync(resolve(gameRoot, file), 'utf8');
      expect(content).not.toContain('.private-review');
      expect(content).not.toContain('C:\\Users\\');
      expect(content).not.toContain('authority overlay');
    }
  });
});
