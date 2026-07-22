import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readRepoFile = (relativePath: string): string => readFileSync(
  new URL(`../../../../${relativePath}`, import.meta.url),
  'utf8',
);

const mainSource = readRepoFile('games/tier-1/04-card-goblin-duel/src/main.ts');
const markup = readRepoFile('games/tier-1/04-card-goblin-duel/index.html');
const styles = readRepoFile('games/tier-1/04-card-goblin-duel/src/style.css');
const captureSource = readRepoFile('games/tier-1/04-card-goblin-duel/capture.cjs');
const hubRuntime = readRepoFile('hub/src/components/DevGameRuntimeView.tsx');
const hubStyles = readRepoFile('hub/src/styles/hub.css');
const tauriConfig = JSON.parse(readRepoFile('hub/src-tauri/tauri.conf.json')) as {
  app: { windows: Array<{ width: number; height: number; minWidth: number; minHeight: number }> };
};

describe('H6.20C Hub-native contained duel table', () => {
  it('keeps the canonical Academy masthead used by Levels 01–03', () => {
    expect(markup).toContain('Tiny Goblin Academy · Level 04');
    expect(markup).toContain('<h1>Card Goblin Duel</h1>');
    expect(markup).toContain('Read the hand. Plan the cycle. Bonk the Card Goblin.');
  });

  it('removes duplicate Hub utilities and player-facing implementation labels', () => {
    expect(markup).not.toContain('Academy Help');
    expect(markup).not.toContain('Academy Dev');
    expect(markup).not.toContain('Causal Ledger');
    expect(markup).not.toContain('Opponent Bank');
    expect(markup).not.toContain('Player Bank');
    expect(markup).not.toContain('Resolution Seal');
    expect(markup).not.toContain('id="log"');
    expect(markup).not.toContain('class="academy-drawers"');
  });

  it('contains no ordinary-mode emoji actor rig or future VFX implementation', () => {
    expect(mainSource).not.toContain('🧙');
    expect(mainSource).not.toContain('👺');
    expect(mainSource).not.toContain('playerAvatar');
    expect(mainSource).not.toContain('enemyAvatar');
    expect(mainSource).not.toContain('CardRig');
    expect(mainSource).not.toContain('CardEcho');
    expect(mainSource).not.toMatch(/particle|projectile|shader|trail|orbital|debris/i);
  });

  it('uses one contained table with an integrated top rail, resolution area, player rail, and hand', () => {
    const tableStart = markup.indexOf('id="duel-table"');
    const tableEnd = markup.indexOf('</section>', markup.lastIndexOf('class="hand-zone"'));
    const tableMarkup = markup.slice(tableStart, tableEnd);

    expect(tableMarkup).toContain('class="duel-top-rail"');
    expect(tableMarkup).toContain('class="resolution-zone"');
    expect(tableMarkup).toContain('class="player-status-rail"');
    expect(tableMarkup).toContain('class="hand-zone"');
    expect(tableMarkup).toContain('class="card-landing-slot"');
    expect(tableMarkup.indexOf('class="hand-zone"')).toBeGreaterThan(tableMarkup.indexOf('class="resolution-zone"'));
  });

  it('treats the actual Tauri Hub minimum as the supported laptop authority', () => {
    expect(tauriConfig.app.windows[0]).toMatchObject({
      width: 1280,
      height: 720,
      minWidth: 1024,
      minHeight: 640,
    });
    expect(hubStyles).toMatch(/\.runtime-content\s*\{[^}]*overflow:\s*hidden[^}]*min-height:\s*0/s);
    expect(hubStyles).toMatch(/\.runtime-content iframe\s*\{[^}]*width:\s*100%[^}]*height:\s*100%/s);
    expect(styles).toMatch(/html,\s*body\s*\{[^}]*height:\s*100%[^}]*overflow:\s*hidden/s);
    expect(styles).toMatch(/#app\s*\{[^}]*height:\s*100(?:dvh|%)[^}]*min-height:\s*0/s);
    expect(styles).toMatch(/#duel-table\s*\{[^}]*min-height:\s*0[^}]*overflow:\s*hidden/s);
  });

  it('does not claim or capture the rejected 480-pixel mobile layout', () => {
    expect(captureSource).not.toContain('NARROW');
    expect(captureSource).not.toContain('480');
    expect(captureSource).not.toContain('narrow-viewport');
    expect(styles).not.toContain('@media (max-width: 560px)');
  });

  it('moves complete causal history into the Hub Ledger surface', () => {
    expect(hubRuntime).toContain('parseAcademyLedgerMessage');
    expect(hubRuntime).toContain('applyAcademyLedgerMessage');
    expect(hubRuntime).toContain('createAcademyLedgerSnapshotRequest');
    expect(hubRuntime).toContain('runtime-ledger-list');
    expect(hubRuntime).not.toContain('without migrating per-game ledgers yet');
    expect(mainSource).toContain('publishCardGoblinTransition');
    expect(mainSource).toContain('ledger.handleHubMessage');
    expect(mainSource).toContain('ledger.reset()');
    expect(mainSource).not.toContain('publishRuntimeLedgerSnapshot');
    expect(mainSource).not.toContain('log.innerHTML');
  });
});
