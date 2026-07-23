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
const captureContractsSource = readRepoFile('games/tier-1/04-card-goblin-duel/capture-contracts.cjs');
const anchorBridgeSource = readRepoFile('games/tier-1/04-card-goblin-duel/src/anchor-bridge.ts');
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

  it('integrates the approved H5.103 tabletop as one unsliced scene plate', () => {
    expect(mainSource).toContain('tga-card-goblin-duel-tabletop-scene-v0.1.png?url');
    expect(mainSource).toContain("setProperty('--tabletop-scene-url'");
    expect(styles).toMatch(/\.tabletop-scene\s*\{[^}]*var\(--tabletop-scene-url\)[^}]*background-size:\s*cover/s);
    expect(styles).not.toContain('tabletop-prop-sprite');
  });

  it('uses the H5.39 sheet only as functional card-frame chrome', () => {
    expect(mainSource).toContain('tga-card-goblin-duel-card-frames-cleaned-v0.1.png?url');
    expect(mainSource).toContain("setProperty('--card-frame-sheet-url'");
    expect(styles).toMatch(/\.card-frame-art\s*\{[^}]*var\(--card-frame-sheet-url\)/s);
    expect(styles).toContain('.card-content');
    expect(styles).toContain('.card-art-slot');
    expect(styles).toContain('.card-token');
    expect(styles).not.toContain('.card-icon');
  });

  it('lets full-height cards rise from an integrated lower staging dock', () => {
    expect(styles).toMatch(/\.hand-zone\s*\{[^}]*overflow:\s*visible/s);
    expect(styles).toMatch(/#hand\s*\{[^}]*align-items:\s*end/s);
    expect(styles).toMatch(/\.card-btn\s*\{[^}]*aspect-ratio:\s*123\s*\/\s*170/s);
    expect(styles).toContain('translateY(var(--card-rise))');
  });

  it('keeps the status rail in document flow above the tabletop artwork', () => {
    const railStart = markup.indexOf('class="duel-top-rail"');
    const stackStart = markup.indexOf('class="tabletop-stack"');
    const railEnd = markup.indexOf('</section>', markup.indexOf('class="player-status-rail"'));

    expect(railStart).toBeGreaterThan(-1);
    expect(stackStart).toBeGreaterThan(railEnd);
    expect(markup.slice(railStart, railEnd)).toContain('class="player-status-rail"');
    expect(styles).toMatch(/#duel-table\s*\{[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
    expect(styles).not.toMatch(/#duel-table\s*\{[^}]*var\(--tabletop-scene-url\)/s);
    expect(styles).not.toMatch(/\.duel-top-rail\s*\{[^}]*position:\s*absolute/s);
  });

  it('stacks a seamless sampled-plum hand dock below the tabletop plate', () => {
    expect(styles).toContain('--tabletop-dock-plum: #1a1218;');
    expect(styles).toMatch(/\.tabletop-stack\s*\{[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\) var\(--hand-dock-height\)[^}]*gap:\s*0/s);
    expect(styles).toMatch(/\.hand-zone\s*\{[^}]*background:\s*var\(--tabletop-dock-plum\)[^}]*border:\s*0/s);
    expect(styles).toContain('--hand-dock-height: clamp(150px, 25vh, 166px);');
  });

  it('measures rendered card exposure and protects the complete result corridor', () => {
    expect(captureSource).toContain("rect('.tabletop-scene')");
    expect(captureSource).toContain('tabletopOverlapRatio');
    expect(captureSource).toContain('dockContainmentRatio');
    expect(captureSource).toContain('resting card exceeds 30% tabletop exposure');
    expect(captureSource).toContain('focused card exceeds 35% tabletop exposure');
    expect(captureSource).toContain('blocks the protected result corridor');
    expect(styles).toMatch(/\.resolution-copy\s*\{[^}]*bottom:\s*var\(--result-corridor-bottom\)/s);
    expect(styles).toMatch(/\.terminal-outcome\s*\{[^}]*bottom:\s*var\(--result-corridor-bottom\)/s);
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

  it('defines the H6.21A five-face typography and content-sized badge contract', () => {
    expect(mainSource).toContain('tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png?url');
    expect(mainSource).toContain("setProperty('--card-token-sheet-url'");
    expect(styles).toContain(".card-btn[data-card-frame='blank-parchment']");
    expect(styles).toContain(".card-btn[data-card-frame='teal-edged-tan']");
    expect(styles).toMatch(/\.card-art-slot\s*\{[^}]*left:\s*var\(--art-x\)[^}]*top:\s*var\(--art-y\)/s);
    expect(styles).toMatch(/\.card-btn \.card-title\s*\{[^}]*left:\s*var\(--title-x\)[^}]*overflow:\s*visible/s);
    expect(styles).toMatch(/\.card-btn \.card-desc\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center[^}]*overflow:\s*visible/s);
    expect(styles).toMatch(/\.card-state\s*\{[^}]*width:\s*fit-content[^}]*min-width:\s*24%[^}]*max-width:\s*38%/s);
    expect(styles).not.toContain('text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.card-btn .card-desc');
  });

  it('keeps both card-surface strategies and measured browser evidence development-only', () => {
    expect(mainSource).toContain("searchParams.get('cardLab')");
    expect(mainSource).toContain("searchParams.get('cardSlots')");
    expect(mainSource).toContain("renderHandCard(card, index % 3, 'PlayerAction', cardLabStrategy, false)");
    expect(anchorBridgeSource).toContain("#hand .card-btn[data-stage-anchor^='hand-slot-']");
    expect(anchorBridgeSource).not.toContain("querySelectorAll('#hand .card-btn').length");
    expect(captureSource).toContain("laneId: 'h6-21a-five-face-card-surface-lab-replacement-3'");
    expect(captureSource).toContain("require('./capture-contracts.cjs')");
    expect(captureSource).toContain('validateFixtureContracts()');
    expect(captureSource).toContain('ABORTED_EVIDENCE_PATH');
    expect(captureSource).toContain('REPLACEMENT_ONE_EVIDENCE_PATH');
    expect(captureSource).toContain('REPLACEMENT_TWO_EVIDENCE_PATH');
    expect(captureSource).toContain('aborted capture initialization');
    expect(captureSource).toContain('countPayloadFiles(ABORTED_EVIDENCE_PATH)');
    expect(captureSource).not.toContain('fs.readdirSync(ABORTED_EVIDENCE_PATH).length !== 0');
    expect(captureSource).toContain('payloadFileCount: abortedPayloadFileCount');
    expect(captureSource).toContain("classification: 'partial evidence'");
    expect(captureContractsSource).toMatch(/id: '06'[\s\S]*phase: 'SparkChoice'[\s\S]*cardCount: 2[\s\S]*stateLabelCount: 2[\s\S]*stateLabel: 'Replace'/);
    expect(captureContractsSource).toMatch(/id: '07'[\s\S]*phase: 'Terminal'[\s\S]*cardCount: 2[\s\S]*stateLabelCount: 2[\s\S]*stateLabel: 'Locked'/);
    expect(captureContractsSource).toMatch(/id: '08'[\s\S]*cardCount: 6[\s\S]*gameplayAnchorCount: 0[\s\S]*slotDebug: true/);
    expect(captureSource).toContain('changed ${cardMetrics.name} exterior ${key}');
    expect(captureSource).toContain('altered deterministic simulation state');
    expect(captureSource).toContain('strategy-a-clean-interior');
    expect(captureSource).toContain('strategy-b-mapped-tokens');
    expect(captureSource).toContain('slot-debug-overlay');
    expect(captureSource).toContain('artRect');
    expect(captureSource).toContain('tokenScaleFactor');
    expect(captureSource).toContain('stateBadgeFits');
    expect(captureSource).toContain('slot rectangles intersect');
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
