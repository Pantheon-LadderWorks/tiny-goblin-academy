import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readRepoFile = (relativePath: string) =>
  readFileSync(new URL(`../../../../${relativePath}`, import.meta.url), 'utf8');

describe('Potion Sorter stage-first shell contract', () => {
  it('replaces the permanent side rails with HUD, play, and feedback layers inside one game stage', () => {
    const source = readRepoFile('games/tier-1/02-potion-sorter/src/main.ts');

    expect(source).toContain('class="game-stage"');
    expect(source).toContain('class="hud-layer"');
    expect(source).toContain('class="play-surface"');
    expect(source).toContain('class="feedback-layer"');
    expect(source).not.toContain('class="stat-stack"');
    expect(source).not.toContain('class="how-to"');

    const stageStart = source.indexOf('class="game-stage"');
    const stageEnd = source.indexOf('</div>\n  </div>', stageStart);
    const stageMarkup = source.slice(stageStart, stageEnd);
    expect(stageMarkup).toContain('id="timer"');
    expect(stageMarkup).toContain('id="score"');
    expect(stageMarkup).toContain('id="combo"');
    expect(stageMarkup).toContain('id="game-canvas"');
    expect(stageMarkup).toContain('id="instruction"');
    expect(stageMarkup).toContain('id="round-result"');
  });

  it('lets the stage consume the available iframe instead of reserving dashboard columns', () => {
    const styles = readRepoFile('games/tier-1/02-potion-sorter/src/styles.css');

    expect(styles).toMatch(/body\s*\{[^}]*height:\s*100vh[^}]*overflow:\s*hidden/s);
    expect(styles).toMatch(/\.game-shell\s*\{[^}]*height:\s*100vh[^}]*display:\s*flex[^}]*flex-direction:\s*column/s);
    expect(styles).toMatch(/\.game-stage\s*\{[^}]*flex:\s*1[^}]*min-height:\s*0/s);
    expect(styles).not.toContain('grid-template-columns: 150px minmax(0, 1fr) 190px');
  });

  it('hydrates the shared Help overlay from the active game instead of leaving Potion Sorter rules in the iframe', () => {
    const runtimeView = readRepoFile('hub/src/components/DevGameRuntimeView.tsx');
    const helpData = readRepoFile('hub/src/data/runtimeHelp.ts');

    expect(runtimeView).toContain('getRuntimeHelpContent(runtime.gameId)');
    expect(helpData).toContain("'tga-02'");
    expect(helpData).toContain('Select the active potion');
    expect(helpData).toContain('Choose the matching destination');
    expect(helpData).toContain('Wrong destinations reset your combo');
  });
});
