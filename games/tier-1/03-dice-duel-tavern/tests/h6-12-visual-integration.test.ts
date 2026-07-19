import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const repoRoot = new URL('../../../../', import.meta.url);
const repoFile = (path: string) => new URL(path, repoRoot);
const read = (path: string) => existsSync(repoFile(path)) ? readFileSync(repoFile(path), 'utf8') : '';

const mainPath = 'games/tier-1/03-dice-duel-tavern/src/main.ts';
const stylesPath = 'games/tier-1/03-dice-duel-tavern/src/styles.css';
const authorityPath = 'games/tier-1/03-dice-duel-tavern/src/tavern-visual-authority.ts';

describe('H6.12 Dice Duel final visual integration contract', () => {
  it('defines one explicit approved visual authority without creating derivative crops', () => {
    expect(existsSync(repoFile(authorityPath))).toBe(true);
    const authority = read(authorityPath);
    expect(authority).toContain('tga-dice-duel-tavern-cleaned-v0.1.png');
    expect(authority).toContain('wall_timber.png');
    expect(authority).toContain('wooden.png');
    expect(authority).toContain('metal_plates.png');
    expect(authority).toContain('Metal008_1K-JPG_Color.jpg');
    expect(authority).not.toMatch(/h6-12.*\.png|crop.*\.png/i);
  });

  it('loads the Academy runtime and assigns semantic typography roles', () => {
    const main = read(mainPath);
    const styles = read(stylesPath);
    expect(main).toContain("assets/academy/fonts/runtime/academy-typography.css");
    expect(main).toContain('waitForAcademyFonts');
    expect(main).toContain('data-typography-role="game-title"');
    expect(main).toContain('data-typography-role="result-state"');
    expect(main).toMatch(/id="php"[^>]*data-typography-role="data-value"/);
    expect(main).toMatch(/id="ehp"[^>]*data-typography-role="data-value"/);
    expect(main).toContain('data-typography-role="dialogue-speech"');
    expect(main).toContain('data-typography-role="debug-information"');
    expect(styles).not.toMatch(/font-family:\s*Georgia|font:\s*[^;]*Georgia/i);
    expect(styles).toContain('--academy-type-shadow: 3px 3px 0 #6e4057, 6px 6px 0 #241326');
  });

  it('promotes only unambiguous action tokens while retaining visible text labels', () => {
    const main = read(mainPath);
    const authority = read(authorityPath);
    for (const label of ['Attack', 'Heal', 'Block']) expect(main).toContain(`>${label}</span>`);
    for (const id of [
      'dice-duel-tavern.duel-token.sword-token-red',
      'dice-duel-tavern.duel-token.heal-token-green',
      'dice-duel-tavern.duel-token.shield-token-teal-gold',
    ]) expect(authority).toContain(id);
    expect(main).toContain('aria-hidden="true"');
    expect(main).not.toMatch(/<[^>]+data-a="(?:attack|heal|block)"[^>]*>\s*<[^>]+data-a=/s);
    expect(read(stylesPath)).toMatch(/\.mapped-region\s*\{[^}]*overflow:\s*hidden/s);
  });

  it('keeps every alternate die and baked FX candidate out of the promoted runtime set', () => {
    const authority = read(authorityPath);
    expect(authority).toContain('REJECTED_REGION_IDS');
    for (const denied of [
      'glowing-die', 'paired-dice', 'rolling-die-left', 'tumbling-die-shadow',
      'tilted-die-glow', 'rolling-die-small', 'dice-cluster', 'sparkle', 'dust-puff',
      'spiral-effect', 'burst-effect', 'smoke-wisps',
    ]) expect(authority).toContain(denied);
    expect(authority).toContain('PROMOTED_REGION_IDS');
  });

  it('uses decorative mapped props without adding character representations', () => {
    const authority = read(authorityPath);
    for (const id of [
      'dice-duel-tavern.tavern-prop.dice-cup-a',
      'dice-duel-tavern.tavern-prop.tavern-mug',
      'dice-duel-tavern.reward-token.coin-stacks',
      'dice-duel-tavern.tavern-prop.candle-lit',
    ]) expect(authority).toContain(id);
    expect(read(mainPath)).not.toMatch(/avatar|portrait|character-circle/i);
  });

  it('authors a bounded outcome surface while preserving the final die and rules', () => {
    const main = read(mainPath);
    const styles = read(stylesPath);
    expect(main).toContain('id="result-heading"');
    expect(main).toContain('id="result-copy"');
    expect(main).toContain("result.hidden = !isTerminal");
    expect(main).toContain("result.dataset.outcome = state.phase");
    expect(styles).toMatch(/\.result-banner\s*\{[^}]*width:\s*min\([^}]*pointer-events:\s*none/s);
    expect(main).not.toMatch(/reset|replay/i);
    expect(main).toContain('LiveDieRigPresentation');
  });

  it('keeps history contextual, the latest exchange visible, and focus/disabled states readable', () => {
    const main = read(mainPath);
    const styles = read(stylesPath);
    expect(main).toContain('state.log.slice(-2)');
    expect(main).toContain('id="history-panel"');
    expect(main).toContain('hidden');
    expect(styles).toContain(':focus-visible');
    expect(styles).toMatch(/button:disabled\s*\{[^}]*cursor:\s*not-allowed[^}]*border-color:/s);
    expect(styles).toMatch(/body\s*\{[^}]*overflow:\s*hidden/s);
    expect(styles).toMatch(/\.duel-stage\s*\{[^}]*overflow:\s*hidden/s);
  });

  it('adds no particle, shader, audio, dependency, or gameplay authority change', () => {
    const main = read(mainPath);
    const packageJson = JSON.parse(read('games/tier-1/03-dice-duel-tavern/package.json'));
    expect(main).not.toMatch(/particle|emitter|shader|audio/i);
    expect(packageJson.dependencies).toEqual({ phaser: '^4.2.0' });
    expect(read('games/tier-1/03-dice-duel-tavern/src/simulation.ts')).not.toContain('H6.12');
    expect(read('games/tier-1/03-dice-duel-tavern/src/roll-source.ts')).not.toContain('H6.12');
    expect(read('games/tier-1/03-dice-duel-tavern/src/live-duel-controller.ts')).not.toContain('H6.12');
  });
});
