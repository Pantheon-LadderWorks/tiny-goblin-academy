import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const iconManifestPath = path.join(repoRoot, 'manifests', 'hub.icons.json');
const gamesManifestPath = path.join(repoRoot, 'manifests', 'academy.games.json');

const errors = [];
const warnings = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function run() {
  if (!fs.existsSync(iconManifestPath)) {
    console.error(`❌ Error: Hub Icon Manifest not found at ${iconManifestPath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(gamesManifestPath)) {
    console.error(`❌ Error: Academy Game Manifest not found at ${gamesManifestPath}`);
    process.exit(1);
  }

  let iconsManifest;
  let gamesManifest;

  try {
    iconsManifest = JSON.parse(fs.readFileSync(iconManifestPath, 'utf8'));
  } catch (e) {
    console.error(`❌ Error: Failed to parse Hub Icon Manifest JSON: ${e.message}`);
    process.exit(1);
  }

  try {
    gamesManifest = JSON.parse(fs.readFileSync(gamesManifestPath, 'utf8'));
  } catch (e) {
    console.error(`❌ Error: Failed to parse Academy Game Manifest JSON: ${e.message}`);
    process.exit(1);
  }

  // 3. Validate top-level fields
  check(iconsManifest.schemaVersion === '0.1.0', `schemaVersion must be '0.1.0', got '${iconsManifest.schemaVersion}'`);
  check(iconsManifest.manifestType === 'hub-icon-map', `manifestType must be 'hub-icon-map', got '${iconsManifest.manifestType}'`);
  check(iconsManifest.project === 'Tiny Goblin Academy', `project must be 'Tiny Goblin Academy', got '${iconsManifest.project}'`);
  check(iconsManifest.status !== undefined, 'status must exist');
  check(iconsManifest.sheet !== undefined, 'sheet metadata must exist');
  check(Array.isArray(iconsManifest.icons), 'icons must be an array');

  if (errors.length > 0) return report();

  const sheet = iconsManifest.sheet;
  const icons = iconsManifest.icons;

  // 4. Validate sheet fields
  check(sheet.id, 'sheet.id must exist');
  check(sheet.imagePath, 'sheet.imagePath must exist');
  check(Number.isInteger(sheet.columns) && sheet.columns > 0, 'sheet.columns must be a positive integer');
  check(Number.isInteger(sheet.rows) && sheet.rows > 0, 'sheet.rows must be a positive integer');
  check(sheet.notes !== undefined, 'sheet.notes must exist');

  // 5. Validate sheet path hygiene
  if (sheet.imagePath) {
    check(!sheet.imagePath.includes('C:\\'), 'sheet.imagePath must not contain C:\\');
    check(!sheet.imagePath.includes('C:/'), 'sheet.imagePath must not contain C:/');
    check(!sheet.imagePath.includes('file:///'), 'sheet.imagePath must not contain file:///');
    check(!sheet.imagePath.includes('.gemini'), 'sheet.imagePath must not contain .gemini');
    check(!sheet.imagePath.includes('node_modules'), 'sheet.imagePath must not contain node_modules');
    check(!sheet.imagePath.includes('dist'), 'sheet.imagePath must not contain dist');
    check(!sheet.imagePath.includes('\\'), 'sheet.imagePath must not contain backslash path separators');

    const absoluteImagePath = path.join(repoRoot, sheet.imagePath);
    check(fs.existsSync(absoluteImagePath), `sheet image must exist on disk: ${sheet.imagePath}`);
  }

  // 6. Validate icon entries
  const gameIds = new Set();
  const slugs = new Set();
  const cells = new Set();

  icons.forEach((icon, i) => {
    const context = `icon index ${i}`;
    check(icon.gameId, `${context}: gameId must exist`);
    check(icon.slug, `${context}: slug must exist`);
    check(Number.isInteger(icon.row) && icon.row > 0, `${context}: row must be a positive integer`);
    check(Number.isInteger(icon.col) && icon.col > 0, `${context}: col must be a positive integer`);
    check(icon.label !== undefined, `${context}: label must exist`);
    check(typeof icon.used === 'boolean', `${context}: used must be a boolean`);
    check(icon.notes !== undefined, `${context}: notes must exist`);

    if (icon.row > sheet.rows) {
      errors.push(`${context}: row (${icon.row}) exceeds sheet rows (${sheet.rows})`);
    }
    if (icon.col > sheet.columns) {
      errors.push(`${context}: col (${icon.col}) exceeds sheet columns (${sheet.columns})`);
    }

    if (gameIds.has(icon.gameId)) {
      errors.push(`${context}: duplicate gameId '${icon.gameId}'`);
    }
    gameIds.add(icon.gameId);

    if (slugs.has(icon.slug)) {
      errors.push(`${context}: duplicate slug '${icon.slug}'`);
    }
    slugs.add(icon.slug);

    const cellId = `${icon.row},${icon.col}`;
    if (cells.has(cellId)) {
      errors.push(`${context}: duplicate cell assignment '${cellId}' for gameId '${icon.gameId}'`);
    }
    cells.add(cellId);
  });

  // 7. Cross-check against Academy Game Manifest
  const academyGames = gamesManifest.games || [];
  
  check(icons.length === academyGames.length, `Icon count (${icons.length}) must equal Academy Game count (${academyGames.length})`);
  check(icons.length === 10, `Expected 10 icons, found ${icons.length}`);

  const academyGameMap = new Map();
  academyGames.forEach(game => academyGameMap.set(game.id, game));

  academyGames.forEach(game => {
    if (!gameIds.has(game.id)) {
      errors.push(`Academy Game '${game.id}' is missing from Hub Icon Manifest`);
    }
  });

  icons.forEach((icon, i) => {
    const context = `icon index ${i} (${icon.gameId})`;
    const academyGame = academyGameMap.get(icon.gameId);
    
    if (!academyGame) {
      errors.push(`${context}: references unknown academy game '${icon.gameId}'`);
    } else {
      check(icon.slug === academyGame.slug, `${context}: icon slug '${icon.slug}' does not match game slug '${academyGame.slug}'`);
      
      if (icon.label !== academyGame.title) {
        warnings.push(`${context}: icon label '${icon.label}' differs from game title '${academyGame.title}'`);
      }
    }
  });

  report(iconsManifest);
}

function report(iconsManifest) {
  if (warnings.length > 0) {
    console.warn('\n⚠️ Warnings:');
    warnings.forEach(w => console.warn(` - ${w}`));
  }

  if (errors.length > 0) {
    console.error('\n❌ Hub Icon Manifest validation failed with the following errors:');
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  }

  console.log('✅ Hub Icon Manifest validation passed');
  if (iconsManifest && iconsManifest.sheet) {
    console.log(` - Hub Icon Manifest: ${iconManifestPath}`);
    console.log(` - Sheet Path: ${iconsManifest.sheet.imagePath}`);
    console.log(` - Sheet Grid: ${iconsManifest.sheet.columns}x${iconsManifest.sheet.rows}`);
    console.log(` - Validated Icons: ${iconsManifest.icons.length}`);
    console.log(` - Cross-checked Games: ${iconsManifest.icons.length}`);
  }
}

run();
