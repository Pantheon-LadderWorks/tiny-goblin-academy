// @ts-nocheck -- Vitest executes this contract test in Node; the game build intentionally omits @types/node.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const gameRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(gameRoot, '../../..');
const style = readFileSync(resolve(gameRoot, 'src/style.css'), 'utf8');
const markup = readFileSync(resolve(gameRoot, 'src/main.ts'), 'utf8');
const tauriConfig = JSON.parse(readFileSync(resolve(repoRoot, 'hub/src-tauri/tauri.conf.json'), 'utf8'));

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = style.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 'm'));
  expect(match, `missing CSS rule: ${selector}`).not.toBeNull();
  return match![1];
}

describe('H6.4A supported desktop and material typography contract', () => {
  it('uses the configured Tauri default and minimum desktop window sizes as authority', () => {
    expect(tauriConfig.app.windows[0]).toMatchObject({
      width: 1280,
      height: 720,
      minWidth: 1024,
      minHeight: 640,
    });
  });

  it('applies the complete registered small-paper-badge recipe to Region 30', () => {
    expect(markup).toContain('data-typography-recipe="badge-label-on-paper"');
    expect(rule('.upgrade-card .upgrade-label-surface')).toContain('width: 160px');

    const label = rule('.upgrade-label-surface .upgrade-kicker');
    expect(label).toContain("font-family: 'Outfit'");
    expect(label).toContain('font-weight: 600');
    expect(label).toContain('font-size: clamp(12px');
    expect(label).toContain('15px)');
    expect(label).toContain('line-height: 1.1');
    expect(label).toContain('letter-spacing: .045em');
    expect(label).toContain('color: #3d291d');
    expect(label).toContain('text-shadow: 0 1px 1px rgba(55, 31, 18, .15)');
  });

  it('keeps every Region 20 lane at or above its registered responsive minimum', () => {
    expect(markup).toContain('data-typography-recipe="result-on-teal-frame"');
    expect(markup).toContain('data-typography-recipe="body-on-parchment"');

    expect(rule('.victory-title')).toContain('font-size: clamp(22px');
    expect(rule('.victory-text')).toContain('font-size: clamp(17px');
    expect(rule('.victory-footer')).toContain('font-size: clamp(12px');
  });

  it('does not shrink code-owned HUD and action-card roles below canonical minima', () => {
    expect(rule('.stat-card span, .upgrade-kicker')).toContain('font-size: clamp(12px');
    expect(rule('.stat-card strong')).toContain('font-size: clamp(18px');
    expect(rule('.upgrade-desc')).toContain('font-size: clamp(17px');
    expect(rule('.hint')).toContain('font-size: clamp(17px');
  });

  it('keeps the page title and HUD values subordinate at the primary desktop size', () => {
    expect(rule('.masthead h1')).toContain('42px)');
    expect(rule('.stat-card strong')).toContain('28px)');
  });

  it('removes only the optional flavor hint before the minimum desktop card can cover the HUD', () => {
    expect(style).toMatch(/@media \(max-width: 1024px\)[\s\S]*?\.hint\s*\{\s*display: none;/);
  });

  it('raises the victory surface above the HUD so Region 20 keeps its title lane', () => {
    expect(style).toMatch(
      /\.game-stage:has\(\.victory-overlay\.visible\) \.play-surface\s*\{[^}]*z-index:\s*6;/,
    );
  });
});
