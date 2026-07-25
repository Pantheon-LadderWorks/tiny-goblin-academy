const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.resolve(__dirname, '..', 'card-vfx-forge-prototype-v0.1.html');

test('Forge HTML is offline and wires the repository core and governed assets', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.match(html, /card-vfx-forge-core\.js/);
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /sandbox:\/\/|sandbox:\/mnt\/data/i);
  assert.doesNotMatch(html, /cdn\.|fetch\s*\(/i);
});

test('Forge HTML exposes the approved Rung-0 controls', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const id of [
    'card-select', 'state-select', 'frame-select', 'slot-select', 'attachment-select', 'border-select',
    'face-select', 'activation-select', 'reduced-motion', 'debug-perimeter',
    'play-surface', 'play-activation', 'play-lifecycle', 'pause-playback', 'reset-playback',
    'frame-matrix', 'slot-matrix', 'recipe-json', 'apply-recipe', 'save-recipe', 'download-recipe',
    'import-recipe', 'lifecycle-strip', 'stage-canvas', 'status-message'
  ]) assert.match(html, new RegExp(`id=["']${id}["']`));
});

test('Forge HTML names every governed attachment authority and lifecycle phase', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const name of [
    'card-local', 'draw-pile-local', 'discard-pile-local', 'player-target',
    'enemy-target', 'travel', 'tabletop-local', 'prepare', 'action', 'impact',
    'hold', 'decay', 'cleanup'
  ]) assert.match(html, new RegExp(name));
});

test('every parameter output binding resolves to a real output element', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const outputIds = new Set([...html.matchAll(/<output\s+id=["']([^"']+)["']/g)].map(match => match[1]));
  assert.match(html, /const parameterOutputIds\s*=\s*\{[^}]*borderWidth:\s*'border-width-value'[^}]*scale:\s*'effect-scale-value'/s);
  for (const id of ['intensity-value', 'speed-value', 'density-value', 'glow-value', 'border-width-value', 'effect-scale-value']) {
    assert.ok(outputIds.has(id), `missing output ${id}`);
  }
});
