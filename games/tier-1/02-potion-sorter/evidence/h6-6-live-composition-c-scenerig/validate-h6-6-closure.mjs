import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const evidenceRoot = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter', 'evidence', 'h6-6-live-composition-c-scenerig');
const gameRoot = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter');
const read = (file) => readFile(file, 'utf8');
const requireFact = (condition, message) => { if (!condition) throw new Error(message); };

const closure = JSON.parse(await read(path.join(evidenceRoot, 'human-review-closure.json')));
const validation = JSON.parse(await read(path.join(evidenceRoot, 'validation-report.json')));
const readme = await read(path.join(evidenceRoot, 'README.md'));
const report = await read(path.join(repoRoot, 'docs', 'runtime', 'TINY_GOBLIN_ACADEMY_H6_6_POTION_SORTER_LIVE_COMPOSITION_C_SCENERIG.md'));
const scene = await read(path.join(gameRoot, 'src', 'potion-scene.ts'));
const config = await read(path.join(gameRoot, 'src', 'scene-rig', 'config.ts'));
const environment = await read(path.join(gameRoot, 'src', 'scene-rig', 'environment-rigs.ts'));
const machines = await read(path.join(gameRoot, 'src', 'scene-rig', 'machine-rigs.ts'));
const potions = await read(path.join(gameRoot, 'src', 'scene-rig', 'potion-rigs.ts'));

const approvalFlags = [
  'humanReviewPassed', 'compositionCApproved', 'productionIntegrated', 'runtimeApproved',
  'tapInputApproved', 'additiveDragInputApproved', 'stableActorContinuityApproved',
  'openGantryApproved', 'mechanicalServiceBayApproved', 'duplicateRightRackRemoved',
  'sourceGameplayAuthorityPreserved'
];
for (const flag of approvalFlags) {
  requireFact(closure[flag] === true, `${flag} must be true in human-review-closure.json`);
  requireFact(validation.approval?.[flag] === true, `${flag} must be true in validation-report.json`);
  requireFact(readme.includes(`\`${flag}: true\``), `${flag} missing from evidence README`);
  requireFact(report.includes(`\`${flag}: true\``), `${flag} missing from implementation report`);
}

const requiredFindings = [
  'Left wing = botanicals and ingredient storage.',
  'Center = conveyor, inspection, and sorting authority.',
  'Right wing = machinery and service apparatus.',
  'The right wing must not regain a colorful bottle rack or duplicate storage board.',
  'Tap and drag are parallel presentation inputs into the same controller command path.',
  'SceneRig remains presentation architecture; simulation/controller remain gameplay authority.',
  'Composition C is now the canonical live Potion Sorter spatial composition.'
];
for (const finding of requiredFindings) requireFact(closure.designFindings.includes(finding), `Missing design finding: ${finding}`);

requireFact(closure.canonicalSpatialComposition === 'Composition C', 'Composition C must remain canonical');
requireFact(config.includes("{ role: 'rear', x: 800") && config.includes("{ role: 'middle', x: 800") && config.includes('aperture: { x: 800'), 'Centered perspective spine drifted');
requireFact(config.includes("{ type: 'sun' as const, label: 'EMBER', x: 340") && config.includes("{ type: 'moon' as const, label: 'MOON', x: 800") && config.includes("{ type: 'star' as const, label: 'MOSS', x: 1260"), 'Approved receiver ordering drifted');
requireFact(!/index:\s*(9|14)\b/.test(config), 'Denied H5.49 region entered runtime configuration');
requireFact(machines.includes('class InspectionApertureRig') && machines.includes('fillRoundedRect(650, 365, 300, 285, 72)'), 'Open inspection gantry contract drifted');
requireFact(!machines.includes('fillStyle(0x000000, 1)'), 'Solid black inspection portal is forbidden');
requireFact(environment.includes('GearboxRig') && environment.includes('servicePipe') && environment.includes('pressureGauge') && environment.includes('valveWheel'), 'Mechanical service bay is incomplete');
requireFact(!environment.includes('addToolsShelfSplit') && !environment.includes("shelfTitle('TOOLS')") && !environment.includes('this.addBottleGrid(back'), 'Duplicate right-side rack returned');
requireFact(scene.includes('chooseDestination(destination') && scene.includes('controller.placePotion(destination)'), 'Tap and drag must share controller placement authority');
requireFact(!scene.includes('dragPlacePotion') && !scene.includes('dragScore'), 'Separate drag gameplay authority is forbidden');
requireFact(potions.includes('PotionActorRig') && !potions.includes('dragClone') && !potions.includes('activePotionClone'), 'Potion actor clone/swap contract violated');
requireFact(potions.includes('returnActiveToInspection') && potions.includes('routeActive'), 'Continuous transit/return presentation is required');
requireFact(!/score\s*[+\-]=|combo\s*[+\-]=/.test(`${scene}\n${environment}\n${machines}\n${potions}`), 'SceneRig must not own scoring or combo rules');

process.stdout.write('H6.6B closure validation passed\n');
process.stdout.write(` - Approval flags: ${approvalFlags.length}\n`);
process.stdout.write(` - Design findings: ${requiredFindings.length}\n`);
process.stdout.write(' - Composition C, actor continuity, shared controller authority, open gantry, denied regions, and service-bay guards passed\n');
