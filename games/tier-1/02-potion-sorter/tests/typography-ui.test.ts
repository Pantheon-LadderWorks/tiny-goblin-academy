// @ts-nocheck -- Vitest executes this contract test in Node; the game build intentionally omits @types/node.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const gameRoot = new URL('../', import.meta.url);
const readGameFile = (relativePath: string) => readFileSync(new URL(relativePath, gameRoot), 'utf8');
const readRepoFile = (relativePath: string) => readFileSync(new URL(`../../../../${relativePath}`, import.meta.url), 'utf8');

function rule(source: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 'm'));
  expect(match, `missing CSS rule: ${selector}`).not.toBeNull();
  return match![1];
}

describe('Potion Sorter H6.7 typography and selective host-surface contract', () => {
  it('consumes the shared typography runtime before Phaser creates text', () => {
    const source = readGameFile('src/main.ts');

    expect(source).toContain("assets/academy/fonts/runtime/academy-typography.css");
    expect(source).toContain('waitForAcademyFonts');
    expect(source.indexOf('await waitForAcademyFonts')).toBeLessThan(source.indexOf('new Phaser.Game'));
  });

  it('assigns semantic roles to every persistent DOM typography family', () => {
    const source = readGameFile('src/main.ts');

    expect(source).toContain('data-typography-role="game-title"');
    expect(source).toContain('data-typography-role="body-instruction"');
    expect(source).toContain('data-typography-role="compact-label"');
    expect(source).toContain('data-typography-role="data-value"');
    expect(source).toContain('data-typography-role="optional-game-accent"');
    expect(source).toContain('data-typography-role="result-state"');
  });

  it('keeps live HUD cards code-native and uses Region 20 only for round completion', () => {
    const source = readGameFile('src/main.ts');

    expect(source).toContain("getAcademyHostSurface('ui-hud.frame-large.teal')");
    expect(source).toContain('data-region-index="20"');
    expect(source).not.toContain("getAcademyHostSurface('ui-hud.dark-panel.long')");
    expect(source).not.toContain('data-region-index="5"');
    expect(source).toContain('class="stat-card"');
  });

  it('gives successful completion and timer expiry truthful result headlines', () => {
    const source = readGameFile('src/main.ts');

    expect(source).toContain("roundResultTitle.textContent = state.timeRemaining > 0 ? 'Alchemy Complete!' : 'Shift Ended!'");
    expect(source).toContain("state.timeRemaining > 0 ? 'ALL POTIONS PROCESSED · SHIFT COMPLETE' : 'TIMER EXPIRED · POTIONS REMAIN'");
  });

  it('uses the shared Phaser recipes for receiver and room labels', () => {
    const machines = readGameFile('src/scene-rig/machine-rigs.ts');
    const environment = readGameFile('src/scene-rig/environment-rigs.ts');

    expect(machines).toContain("createAcademyPhaserTextStyle('compact-label'");
    expect(environment).toContain("createAcademyPhaserTextStyle('compact-label'");
    expect(machines).not.toContain("fontFamily: 'Cinzel, Georgia, serif'");
    expect(environment).not.toContain("fontFamily: 'Cinzel, Georgia, serif'");
  });

  it('preserves readable canonical minima at the supported minimum desktop contract', () => {
    const styles = readGameFile('src/styles.css');
    const sharedStyles = readRepoFile('assets/academy/fonts/runtime/academy-typography.css');

    expect(styles).toMatch(/\.stat-card span[^}]*font-size:\s*clamp\(12px/s);
    expect(styles).toMatch(/\.stat-card strong[^}]*font-size:\s*clamp\(18px/s);
    expect(styles).toMatch(/\.instruction[^}]*font-size:\s*clamp\(17px/s);
    expect(sharedStyles).toMatch(/\[data-typography-role='result-state'\][^{]*\{[^}]*font-size:\s*clamp\(24px/s);
  });

  it('strengthens the shared display hierarchy without game-local recipe drift', () => {
    const runtime = readRepoFile('assets/academy/fonts/runtime/academy-typography.ts');
    const sharedStyles = readRepoFile('assets/academy/fonts/runtime/academy-typography.css');
    const potionStyles = readGameFile('src/styles.css');
    const buttonStyles = readRepoFile('games/tier-1/01-button-goblin-clicker/src/style.css');

    expect(runtime).toMatch(/'game-title':\s*\{[\s\S]*?weight:\s*800[\s\S]*?sizeRangePx:\s*\[30, 50\]/);
    expect(runtime).toMatch(/'result-state':\s*\{[\s\S]*?weight:\s*800[\s\S]*?sizeRangePx:\s*\[24, 39\][\s\S]*?letterSpacing:\s*'\.005em'/);

    const title = rule(sharedStyles, "[data-typography-role='game-title']");
    expect(title).toContain('font-weight: 800');
    expect(title).toContain('font-size: clamp(30px, 3.8vw, 50px)');
    expect(title).toContain('3px 3px 0 #6e4057');
    expect(title).toContain('6px 6px 0 #241326');

    const result = rule(sharedStyles, "[data-typography-role='result-state']");
    expect(result).toContain('font-weight: 800');
    expect(result).toContain('font-size: clamp(24px');
    expect(result).toContain('39px)');
    expect(result).toContain('letter-spacing: .005em');

    expect(potionStyles).not.toMatch(/\.masthead h1\s*\{/);
    expect(buttonStyles).not.toMatch(/\.masthead h1\s*\{/);
    expect(rule(potionStyles, '.round-result-title')).not.toMatch(/font-size|font-weight|letter-spacing|text-shadow|-webkit-text-stroke/);
    expect(rule(buttonStyles, '.victory-title')).not.toMatch(/font-size|font-weight|letter-spacing|text-shadow|-webkit-text-stroke/);
  });
});
