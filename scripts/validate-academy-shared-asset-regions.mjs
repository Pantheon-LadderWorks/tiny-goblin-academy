import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const manifestPaths = [
  'manifests/academy/shared/academy.shared-core.regions.json',
  'manifests/academy/shared/deferred/academy.shared-fx.regions.json',
  'manifests/academy/shared/academy.ui-hud.regions.json'
];

let hasErrors = false;

function validateManifest(manifestPath) {
  const fullPath = path.join(REPO_ROOT, manifestPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Manifest not found: ${manifestPath}`);
    hasErrors = true;
    return;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(content);

    if (!data.sourceSheet) {
      console.error(`❌ Missing sourceSheet in ${manifestPath}`);
      hasErrors = true;
    } else {
      const sourceSheetPath = path.join(REPO_ROOT, data.sourceSheet);
      if (!fs.existsSync(sourceSheetPath)) {
        console.error(`❌ Source sheet not found: ${data.sourceSheet}`);
        hasErrors = true;
      }
    }

    if (data.derivedSheet !== null && typeof data.derivedSheet === 'string') {
      const derivedSheetPath = path.join(REPO_ROOT, data.derivedSheet);
      if (!fs.existsSync(derivedSheetPath)) {
        console.error(`❌ Derived sheet not found: ${data.derivedSheet}`);
        hasErrors = true;
      }
    }

    if (!['draft', 'reviewed', 'approved'].includes(data.status)) {
      console.error(`❌ Invalid status in ${manifestPath}: ${data.status}`);
      hasErrors = true;
    }

    if (!Array.isArray(data.regions)) {
      console.error(`❌ Missing or invalid regions array in ${manifestPath}`);
      hasErrors = true;
    } else {
      const ids = new Set();
      data.regions.forEach((region, idx) => {
        if (!region.id) {
          console.error(`❌ Missing region id at index ${idx} in ${manifestPath}`);
          hasErrors = true;
        } else {
          if (ids.has(region.id)) {
            console.error(`❌ Duplicate region id: ${region.id} in ${manifestPath}`);
            hasErrors = true;
          }
          ids.add(region.id);
        }

        if (!region.sourceRect || typeof region.sourceRect.x !== 'number' || typeof region.sourceRect.y !== 'number' || typeof region.sourceRect.w !== 'number' || typeof region.sourceRect.h !== 'number') {
          console.error(`❌ Invalid sourceRect for region ${region.id} in ${manifestPath}`);
          hasErrors = true;
        }

        if (!region.usage) {
          console.error(`❌ Missing usage for region ${region.id} in ${manifestPath}`);
          hasErrors = true;
        }
      });
    }

    if (!data.transparency) {
      console.error(`❌ Missing transparency object in ${manifestPath}`);
      hasErrors = true;
    }

    if (!manifestPath.includes(data.domain)) {
       console.error(`❌ Domain '${data.domain}' does not match manifest filename '${manifestPath}'`);
       hasErrors = true;
    }

    console.log(`✅ Validated ${manifestPath}`);
  } catch (e) {
    console.error(`❌ Error parsing JSON in ${manifestPath}: ${e.message}`);
    hasErrors = true;
  }
}

console.log('Validating H5.0 shared asset manifests...');
manifestPaths.forEach(validateManifest);

if (hasErrors) {
  process.exit(1);
} else {
  console.log('✅ All shared asset manifests are valid.');
}
