import Phaser from 'phaser';

import { DieRig } from './dierig';
import { DIE_SHEET_KEY, DIE_SHEET_URL, type DieFace } from './face-mapping';
import type { DieMotionMode } from './motion-plan';
import './lab-styles.css';

const query = new URLSearchParams(window.location.search);
let selectedFace = Math.max(1, Math.min(6, Number(query.get('face') ?? 1))) as DieFace;
let selectedMode: DieMotionMode = query.get('mode') === 'reduced' ? 'reduced' : 'full';
let selectedSeed = Number(query.get('seed') ?? 41);
let diagnostics = query.get('diagnostic') === '1';
let activeLabScene: DieRigLabScene | null = null;

document.querySelector<HTMLDivElement>('#dierig-lab')!.innerHTML = `
  <main class="lab-shell">
    <header class="lab-header">
      <div><span>H6.10 · MOTION LABORATORY</span><h1>Persistent DieRig</h1></div>
      <p>Injected result → one projected cube → exact-once completion</p>
    </header>
    <section class="laboratory" aria-label="DieRig motion laboratory">
      <aside class="controls-panel">
        <div class="control-group"><span>INJECT FACE</span><div class="face-controls">
          ${[1, 2, 3, 4, 5, 6].map((face) => `<button data-face="${face}" type="button">${face}</button>`).join('')}
        </div></div>
        <div class="control-group"><span>MOTION PATH</span><div class="mode-controls">
          <button data-mode="full" type="button">Full choreography</button>
          <button data-mode="reduced" type="button">Reduced motion</button>
        </div></div>
        <label class="seed-control"><span>MOTION SEED</span><input id="motion-seed" type="number" value="${selectedSeed}" /></label>
        <button id="roll-die" class="primary-control" type="button">Roll injected result</button>
        <button id="diagnostic-toggle" type="button">Topology overlay</button>
        <div class="authority-law"><b>Authority boundary</b><span>The lab injects a result. The DieRig presents it. The DieRig never chooses it.</span></div>
      </aside>
      <div class="stage-frame">
        <div class="tavern-wall" aria-hidden="true"><i></i><i></i><i></i><div class="house-sign">THE CROOKED SIX<small>HOUSE DIE TEST BENCH</small></div></div>
        <div class="table-rim" aria-hidden="true"></div>
        <div class="throw-tray" aria-hidden="true"><span>HOUSE ROLL</span><div class="tray-mark"></div><small>ONE DIE · SIX REVIEWED SURFACES</small></div>
        <div id="dierig-canvas" aria-label="Persistent three-dimensional die presentation"></div>
      </div>
      <aside class="telemetry-panel" aria-live="polite">
        <span class="telemetry-title">LIVE TELEMETRY</span>
        <dl>
          <div><dt>Actor</dt><dd id="actor-id">—</dd></div>
          <div><dt>Phase</dt><dd id="phase">idle</dd></div>
          <div><dt>Requested</dt><dd id="requested">—</dd></div>
          <div><dt>Settled</dt><dd id="settled">1</dd></div>
          <div><dt>Mode</dt><dd id="telemetry-mode">full</dd></div>
          <div><dt>Seed</dt><dd id="telemetry-seed">41</dd></div>
          <div><dt>Busy</dt><dd id="busy">false</dd></div>
          <div><dt>Requests</dt><dd id="requests">0</dd></div>
          <div><dt>Completed</dt><dd id="completions">0</dd></div>
          <div><dt>Rejected overlap</dt><dd id="rejected">0</dd></div>
          <div><dt>Impacts</dt><dd id="impacts">0</dd></div>
          <div><dt>Elapsed</dt><dd id="elapsed">0 ms</dd></div>
        </dl>
        <div><span class="trail-label">PHASE TRAIL</span><ol id="phase-trail"></ol></div>
      </aside>
    </section>
  </main>`;

const text = (id: string, value: string) => { document.querySelector<HTMLElement>(`#${id}`)!.textContent = value; };
const updateControls = () => {
  document.querySelectorAll<HTMLElement>('[data-face]').forEach((button) => button.classList.toggle('selected', Number(button.dataset.face) === selectedFace));
  document.querySelectorAll<HTMLElement>('[data-mode]').forEach((button) => button.classList.toggle('selected', button.dataset.mode === selectedMode));
  document.querySelector('#diagnostic-toggle')?.classList.toggle('selected', diagnostics);
};

class DieRigLabScene extends Phaser.Scene {
  die!: DieRig;

  constructor() { super('h6-10-dierig-lab'); }

  preload(): void { this.load.image(DIE_SHEET_KEY, DIE_SHEET_URL); }

  create(): void {
    activeLabScene = this;
    this.die = new DieRig(this, DIE_SHEET_KEY, 480, 378);
    this.die.setDiagnosticVisible(diagnostics);
    updateControls();
    window.__DIE_RIG_LAB__ = {
      actorId: this.die.actorId,
      roll: (face = selectedFace, mode = selectedMode, seed = selectedSeed) => this.roll(face, mode, seed),
      getTelemetry: () => structuredClone(this.die.telemetry),
      ready: true,
    };
    if (query.get('autoplay') !== '0') this.time.delayedCall(350, () => this.roll(selectedFace, selectedMode, selectedSeed));
  }

  update(): void {
    if (!this.die) return;
    const telemetry = this.die.telemetry;
    text('actor-id', telemetry.actorId);
    text('phase', telemetry.phase);
    text('requested', telemetry.requestedFace?.toString() ?? '—');
    text('settled', telemetry.settledFace.toString());
    text('telemetry-mode', telemetry.mode);
    text('telemetry-seed', String(telemetry.seed));
    text('busy', String(telemetry.busy));
    text('requests', String(telemetry.requestCount));
    text('completions', String(telemetry.completionCount));
    text('rejected', String(telemetry.rejectedOverlapCount));
    text('impacts', String(telemetry.impactCount));
    text('elapsed', `${telemetry.elapsed} ms`);
    document.querySelector('#phase-trail')!.innerHTML = telemetry.phaseTrail.map((phase) => `<li>${phase}</li>`).join('');
    document.querySelector('#roll-die')?.toggleAttribute('disabled', telemetry.busy);
    document.body.dataset.labState = telemetry.busy ? 'rolling' : 'settled';
  }

  roll(face: DieFace, mode: DieMotionMode, seed: number): boolean {
    return this.die.requestRoll({ result: face, mode, motionSeed: seed });
  }
}

new Phaser.Game({
  type: Phaser.WEBGL,
  parent: 'dierig-canvas',
  width: 960,
  height: 640,
  transparent: true,
  antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: DieRigLabScene,
});

document.querySelectorAll<HTMLButtonElement>('[data-face]').forEach((button) => button.addEventListener('click', () => {
  selectedFace = Number(button.dataset.face) as DieFace;
  updateControls();
}));
document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => button.addEventListener('click', () => {
  selectedMode = button.dataset.mode as DieMotionMode;
  updateControls();
}));
document.querySelector<HTMLInputElement>('#motion-seed')!.addEventListener('change', (event) => { selectedSeed = Number((event.currentTarget as HTMLInputElement).value); });
document.querySelector<HTMLButtonElement>('#roll-die')!.addEventListener('click', () => window.__DIE_RIG_LAB__?.roll(selectedFace, selectedMode, selectedSeed));
document.querySelector<HTMLButtonElement>('#diagnostic-toggle')!.addEventListener('click', () => {
  diagnostics = !diagnostics;
  activeLabScene?.die.setDiagnosticVisible(diagnostics);
  updateControls();
});
