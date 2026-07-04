const fs = require('fs');

const col_divs = [0, 280, 562, 843, 1124, 1406, 1688, 1970, 2251, 2532, 2816];
const columns = [];
for (let i = 0; i < 10; i++) {
  columns.push({ x: col_divs[i], w: col_divs[i+1] - col_divs[i] });
}

const row_divs = [0, 254, 511, 768, 1025, 1280, 1536];
const rows = [];
for (let i = 0; i < 6; i++) {
  rows.push({ y: row_divs[i], h: row_divs[i+1] - row_divs[i] });
}

const manifest = {
  schemaVersion: '0.1',
  status: 'draft',
  domain: 'platformer-goblin-player',
  operationalType: 'character-animation-sheet',
  sourceSheet: 'assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png',
  derivedSheet: 'assets/academy/derived-cleaned/goblin/tga-platformer-goblin-player-cleaned-v0.1.png',
  frameGrid: {
    note: 'Restored dynamic 10-col grid (H5.10C) using empirical numpy probe data.',
    columns: 10,
    rows: 6,
    cellWidth: 281,
    frameHeightCropped: null,
    columnRects: columns.map((c, i) => ({ col: i, x: c.x, w: c.w })),
    rowRects: rows.map((r, i) => ({ row: i, y: r.y, h: r.h }))
  },
  transparency: {
    sourceHasAlpha: true,
    sourceAlphaUsable: false,
    background: 'baked-checkerboard',
    cleanupRequired: true,
    cleanupStatus: 'preview-generated',
    humanReviewRequired: true,
    cleanupNote: 'Canyon strategy applied.',
    pilotFrameSuggested: 'platformer-goblin.walk frame 0'
  },
  animations: [
    { id: 'platformer-goblin.idle', label: 'Idle', rowIndex: 0, frames: 6, loop: true },
    { id: 'platformer-goblin.walk', label: 'Walk / Run', rowIndex: 1, frames: 10, loop: true },
    { id: 'platformer-goblin.jump', label: 'Jump / Airborne', rowIndex: 2, frames: 7, loop: false },
    { id: 'platformer-goblin.attack', label: 'Attack / Club Swing', rowIndex: 3, frames: 8, loop: false },
    { id: 'platformer-goblin.hurt', label: 'Hurt / Fall / Knocked', rowIndex: 4, frames: 7, loop: false },
    { id: 'platformer-goblin.celebrate', label: 'Celebrate / Success', rowIndex: 5, frames: 6, loop: true }
  ].map(seq => ({
    id: seq.id,
    label: seq.label,
    type: 'animation-sequence',
    rowIndex: seq.rowIndex,
    rowY: rows[seq.rowIndex].y,
    frameCount: seq.frames,
    loop: seq.loop,
    reviewStatus: 'needs-human-review',
    usage: 'draft-review',
    notes: '',
    frames: Array.from({length: seq.frames}).map((_, i) => ({
      index: i,
      sourceRect: { 
        x: columns[i].x, 
        y: rows[seq.rowIndex].y, 
        w: columns[i].w, 
        h: rows[seq.rowIndex].h 
      },
      durationMs: null,
      pivot: null
    }))
  }))
};

fs.writeFileSync('manifests/academy.platformer-goblin-player.animations.json', JSON.stringify(manifest, null, 2) + '\n');
