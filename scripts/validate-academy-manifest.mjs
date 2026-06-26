import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(REPO_ROOT, 'manifests', 'academy.games.json');

let errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

let manifest;
try {
  const content = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  manifest = JSON.parse(content);
} catch (e) {
  console.error(`Failed to load manifest at ${MANIFEST_PATH}`);
  console.error(e.message);
  process.exit(1);
}

// 3. Validate top-level fields
assert(manifest.schemaVersion === '0.1.0', 'schemaVersion must be 0.1.0');
assert(manifest.manifestType === 'academy-game-roster', 'manifestType must be academy-game-roster');
assert(manifest.project === 'Tiny Goblin Academy', 'project must be Tiny Goblin Academy');
assert(manifest.status, 'status is missing');
assert(Array.isArray(manifest.games), 'games must be an array');

if (!Array.isArray(manifest.games)) {
  console.error(errors.join('\n'));
  process.exit(1);
}

// 4. Validate roster invariants
assert(manifest.games.length === 10, `Expected 10 games, found ${manifest.games.length}`);

const levels = manifest.games.map(g => g.level);
const ids = manifest.games.map(g => g.id);
const slugs = manifest.games.map(g => g.slug);

for (let i = 1; i <= 10; i++) {
  assert(levels.includes(i), `Level ${i} is missing`);
  assert(ids.includes(`tga-${i.toString().padStart(2, '0')}`), `ID tga-${i.toString().padStart(2, '0')} is missing`);
}

assert(new Set(levels).size === levels.length, 'Duplicate levels found');
assert(new Set(ids).size === ids.length, 'Duplicate ids found');
assert(new Set(slugs).size === slugs.length, 'Duplicate slugs found');

let verifiedSourceFolders = 0;

// 5. Validate required fields for every game
const requiredFields = [
  'id', 'tier', 'level', 'title', 'slug', 'sourcePath', 'status', 
  'displayStatus', 'historicallyPassed', 'sourceAvailable', 
  'devRunnable', 'buildAvailable', 'playableAvailable', 
  'playableMode', 'restorationDeferred', 'coreLesson', 
  'shortDescription', 'controls', 'notes'
];

manifest.games.forEach((game, index) => {
  requiredFields.forEach(field => {
    assert(game.hasOwnProperty(field), `Game at index ${index} (${game.id || 'unknown'}) is missing field: ${field}`);
  });

  // 6. Validate path hygiene
  if (game.sourcePath !== null) {
    assert(typeof game.sourcePath === 'string', `Game ${game.id} sourcePath must be a string or null`);
    
    if (typeof game.sourcePath === 'string') {
      const sp = game.sourcePath;
      assert(!sp.includes('C:\\'), `Game ${game.id} sourcePath contains C:\\`);
      assert(!sp.includes('C:/'), `Game ${game.id} sourcePath contains C:/`);
      assert(!sp.includes('file:///'), `Game ${game.id} sourcePath contains file:///`);
      assert(!sp.includes('.gemini'), `Game ${game.id} sourcePath contains .gemini`);
      assert(!sp.includes('node_modules'), `Game ${game.id} sourcePath contains node_modules`);
      assert(!sp.includes('dist'), `Game ${game.id} sourcePath contains dist`);
      assert(!sp.includes('\\'), `Game ${game.id} sourcePath contains backslash \\`);
    }
  }

  if (game.sourceAvailable === true) {
    assert(game.sourcePath !== null, `Game ${game.id} has sourceAvailable true but sourcePath is null`);
    if (game.sourcePath) {
      const fullPath = path.join(REPO_ROOT, game.sourcePath);
      assert(fs.existsSync(fullPath), `Game ${game.id} sourcePath does not exist on disk: ${game.sourcePath}`);
      if (fs.existsSync(fullPath)) {
        verifiedSourceFolders++;
      }
    }
  } else {
    assert(game.sourcePath === null, `Game ${game.id} has sourceAvailable false but sourcePath is not null`);
  }

  // 7. Validate Level 1 invariant
  if (game.id === 'tga-01') {
    assert(game.level === 1, `tga-01 level must be 1`);
    assert(game.historicallyPassed === true, `tga-01 historicallyPassed must be true`);
    assert(game.sourceAvailable === false, `tga-01 sourceAvailable must be false`);
    assert(game.devRunnable === false, `tga-01 devRunnable must be false`);
    assert(game.buildAvailable === false, `tga-01 buildAvailable must be false`);
    assert(game.playableAvailable === false, `tga-01 playableAvailable must be false`);
    assert(game.playableMode === 'none', `tga-01 playableMode must be none`);
    assert(game.restorationDeferred === true, `tga-01 restorationDeferred must be true`);
    assert(game.sourcePath === null, `tga-01 sourcePath must be null`);
  } else {
    // 8. Validate Levels 2-10 expectations
    assert(game.historicallyPassed === true, `Game ${game.id} historicallyPassed must be true`);
    assert(game.sourceAvailable === true, `Game ${game.id} sourceAvailable must be true`);
    assert(game.devRunnable === true, `Game ${game.id} devRunnable must be true`);
    assert(game.buildAvailable === false, `Game ${game.id} buildAvailable must be false`);
    assert(game.playableAvailable === true, `Game ${game.id} playableAvailable must be true`);
    assert(game.playableMode === 'dev', `Game ${game.id} playableMode must be dev`);
    assert(game.restorationDeferred === false, `Game ${game.id} restorationDeferred must be false`);
    if (game.sourcePath) {
      assert(game.sourcePath.startsWith('games/tier-1/'), `Game ${game.id} sourcePath must start with games/tier-1/`);
    }
  }
});

// 9. Print a clear success report if valid
if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} errors:`);
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ Manifest validation passed`);
  console.log(` - Path: ${MANIFEST_PATH}`);
  console.log(` - Games count: ${manifest.games.length}`);
  console.log(` - Verified source folders: ${verifiedSourceFolders}`);
  console.log(` - Level 1 deferred invariant verified`);
  process.exit(0);
}
