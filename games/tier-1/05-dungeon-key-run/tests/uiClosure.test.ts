import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  DUNGEON_KEY_UI_AUTHORITY,
  DUNGEON_KEY_TYPOGRAPHY_ROLES,
  DUNGEON_KEY_UI_STATES,
} from '../src/uiAuthority';

const gameRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(gameRoot, '../../..');
const html = readFileSync(resolve(gameRoot, 'index.html'), 'utf8');
const style = readFileSync(resolve(gameRoot, 'src/style.css'), 'utf8');
const main = readFileSync(resolve(gameRoot, 'src/main.ts'), 'utf8');
const sharedTypography = readFileSync(resolve(repoRoot, 'assets/academy/fonts/runtime/academy-typography.css'), 'utf8');

const localRuleBody = (selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = style.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'm'));
  expect(match, `missing local CSS rule for ${selector}`).not.toBeNull();
  return match?.[1] ?? '';
};

describe('Dungeon Key final typography and shared UI authority', () => {
  it('maps every production text surface to a governed semantic role', () => {
    expect(DUNGEON_KEY_TYPOGRAPHY_ROLES).toEqual({
      academyBrand: 'compact-label', gameTitle: 'game-title', roomSubtitle: 'compact-label',
      objectiveKicker: 'compact-label', objectiveHeading: 'panel-heading', objectiveBody: 'body-instruction',
      statusChip: 'data-value', feedback: 'dialogue-speech', result: 'result-state',
      drawerKicker: 'compact-label', drawerTitle: 'dialogue-title', drawerBody: 'dialogue-speech',
      ledgerEntry: 'dialogue-speech', controlLabel: 'compact-label',
    });
    for (const role of new Set(Object.values(DUNGEON_KEY_TYPOGRAPHY_ROLES))) {
      expect(sharedTypography).toContain(`[data-typography-role='${role}']`);
      expect(html).toContain(`data-typography-role="${role}"`);
    }
  });
  it('consumes the promoted local font runtime without private aliases or new dependencies', () => {
    expect(main).toContain("assets/academy/fonts/runtime/academy-typography.css");
    expect(main).toContain('waitForAcademyFonts');
    expect(style).not.toContain('@font-face');
    expect(style).not.toContain("'TGA Cinzel'");
    expect(style).not.toContain("'TGA Caudex'");
    expect(style).not.toContain("'TGA Outfit'");
    expect(DUNGEON_KEY_UI_AUTHORITY.approvedFamilies).toEqual([
      'Cinzel', 'Caudex', 'Outfit', 'Atkinson Hyperlegible',
    ]);
  });

  it('leaves semantic family and weight ownership to the shared typography runtime', () => {
    const roleBearingLocalRules = [
      '.academy-brand',
      '.academy-title strong',
      '.academy-title span',
      '.panel-kicker',
      '.objective-hud h1, .drawer h2',
      '.status-chip',
      '.feedback',
      '.outcome-banner',
    ];
    for (const selector of roleBearingLocalRules) {
      expect(localRuleBody(selector)).not.toMatch(/\bfont(?:-family|-weight)?\s*:/);
    }
  });

  it('keeps the stage dominant and supports only the governed laptop viewport', () => {
    expect(DUNGEON_KEY_UI_AUTHORITY.minimumViewport).toEqual({width: 1024, height: 640});
    expect(DUNGEON_KEY_UI_AUTHORITY.stageDominant).toBe(true);
    expect(DUNGEON_KEY_UI_AUTHORITY.permanentHistoryRail).toBe(false);
    expect(style).toMatch(/min-width:\s*1024px/);
    expect(style).toMatch(/min-height:\s*640px/);
    expect(html).not.toContain('history-rail');
  });

  it('defines the complete shared control state vocabulary', () => {
    expect(DUNGEON_KEY_UI_STATES).toEqual([
      'rest', 'hover', 'focus-visible', 'pressed', 'disabled', 'open',
    ]);
    expect(style).toContain(':hover:not(:disabled)');
    expect(style).toContain(':focus-visible');
    expect(style).toContain(':active:not(:disabled)');
    expect(style).toContain(':disabled');
    expect(style).toContain('[aria-expanded="true"]');
  });
});

describe('Dungeon Key overlay and input closure', () => {
  it('treats Help and Ledger as modal shell destinations', () => {
    expect(html).toMatch(/id="help-drawer"[^>]*role="dialog"[^>]*aria-modal="true"/);
    expect(html).toMatch(/id="ledger-drawer"[^>]*role="dialog"[^>]*aria-modal="true"/);
    expect(main).toContain('focusDrawer');
    expect(main).toContain('restoreFocus');
    expect(main).toContain("event.key.toLowerCase() === 'l'");
    expect(main).toContain("event.key === 'Escape'");
  });

  it('blocks stage input and traps focus while a drawer is open', () => {
    expect(main).toContain('activeDrawer');
    expect(main).toContain('if (activeDrawer) return;');
    expect(main).toContain("event.key === 'Tab'");
    expect(main).toContain('focusableElements');
  });

  it('keeps Patrol Tension isolated to the Phaser stage', () => {
    expect(style).not.toContain('readability-treatment');
    expect(style).not.toContain('patrol-tension-adjusted-b');
    expect(main).toContain('PATROL_TENSION_TREATMENT');
  });
});
