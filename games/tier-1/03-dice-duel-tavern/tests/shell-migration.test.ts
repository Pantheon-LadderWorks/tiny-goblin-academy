import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readRepoFile = (relativePath: string) =>
  readFileSync(new URL(`../../../../${relativePath}`, import.meta.url), 'utf8');

describe('Dice Duel Tavern H6.9 stage-first shell contract', () => {
  it('replaces the permanent dashboard rails with one full-width duel stage', () => {
    const index = readRepoFile('games/tier-1/03-dice-duel-tavern/index.html');
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');
    const styles = readRepoFile('games/tier-1/03-dice-duel-tavern/src/styles.css');

    expect(index).not.toContain('<aside>');
    expect(source).toContain('class="duel-stage"');
    expect(source).toContain('class="tavern-backdrop"');
    expect(source).toContain('class="table-surface"');
    expect(source).toContain('class="throw-zone"');
    expect(styles).toMatch(/body\s*\{[^}]*height:\s*100vh[^}]*overflow:\s*hidden/s);
    expect(styles).toMatch(/\.duel-stage\s*\{[^}]*flex:\s*1[^}]*min-height:\s*0/s);
    expect(styles).not.toContain('grid-template-columns:170px 1fr 260px');
  });

  it('keeps every current action and status inside the stage', () => {
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');
    const stageStart = source.indexOf('class="duel-stage"');
    const stageMarkup = source.slice(stageStart);

    expect(stageMarkup).toContain('id="turn"');
    expect(stageMarkup).toContain('id="php"');
    expect(stageMarkup).toContain('id="ehp"');
    expect(stageMarkup).toContain('id="roll"');
    expect(stageMarkup).toContain('id="rollbtn"');
    expect(stageMarkup).toContain('data-a="attack"');
    expect(stageMarkup).toContain('data-a="heal"');
    expect(stageMarkup).toContain('data-a="block"');
    expect(stageMarkup).toContain('id="result"');
  });

  it('shows compact causal feedback while retaining the complete simulation log in a drawer', () => {
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');

    expect(source).toContain('id="causal-feed"');
    expect(source).toContain('id="history-toggle"');
    expect(source).toContain('id="history-panel"');
    expect(source).toContain('id="history-log"');
    expect(source).toContain('state.log.slice(-2)');
    expect(source).toContain('state.log.map');
    expect(source).not.toContain('state.log.slice(-6)');
  });

  it('adds bounded Dice Duel instructions to the Academy Help surface', () => {
    const helpData = readRepoFile('hub/src/data/runtimeHelp.ts');

    expect(helpData).toContain("'tga-03'");
    expect(helpData).toContain('Roll the d6');
    expect(helpData).toContain('Attack deals the rolled value');
    expect(helpData).toContain('Heal restores the rolled value');
    expect(helpData).toContain('Block reduces the immediate Goblin Brawler response');
  });

  it('preserves the H6.9 room while H6.11 replaces only the bounded die layer and roll source', () => {
    const simulation = readRepoFile('games/tier-1/03-dice-duel-tavern/src/simulation.ts');
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');

    expect(simulation).not.toContain('const dice=[4,3,6,2,5]');
    expect(source).not.toContain('Math.random');
    expect(source).toContain('LiveDieRigPresentation');
    expect(source).not.toContain('sprite');
    expect(source).not.toMatch(/reset|replay/i);
  });

  it('uses an avatar-free asymmetric tavern table with one authored shared rolling tray', () => {
    const source = readRepoFile('games/tier-1/03-dice-duel-tavern/src/main.ts');
    const styles = readRepoFile('games/tier-1/03-dice-duel-tavern/src/styles.css');

    expect(source).not.toContain('fillCircle(');
    expect(source).not.toContain('strokeCircle(');
    expect(source).not.toContain('this.add.text(');
    expect(source).toContain('class="tavern-sign"');
    expect(source).toContain('class="barrel-stack"');
    expect(source).toContain('class="peg-rack"');
    expect(source).toContain('class="table-station player-station"');
    expect(source).toContain('class="table-station opponent-station"');
    expect(source).toContain('class="dice-cup"');
    expect(source).toContain('class="tankard"');
    expect(source).toContain('class="wager-stack"');
    expect(source).toContain('class="tray-landing-mark"');
    expect(styles).toContain('.throw-zone::before');
    expect(styles).not.toMatch(/\.throw-zone\s*\{[^}]*border:\s*2px dashed/s);
  });
});
