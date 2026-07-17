import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const gameRoot = new URL('../', import.meta.url);
const readGameFile = (relativePath: string) => readFileSync(new URL(relativePath, gameRoot), 'utf8');

describe('Potion Sorter H6.6 live SceneRig contract', () => {
  it('provides the approved Composition C rig boundary', () => {
    const requiredModules = [
      'src/scene-rig/config.ts',
      'src/scene-rig/environment-rigs.ts',
      'src/scene-rig/machine-rigs.ts',
      'src/scene-rig/potion-rigs.ts'
    ];

    requiredModules.forEach((path) => expect(existsSync(new URL(path, gameRoot)), path).toBe(true));

    const scene = readGameFile('src/potion-scene.ts');
    expect(scene).toContain('PotionRoomRig');
    expect(scene).toContain('ConveyorRig');
    expect(scene).toContain('InspectionApertureRig');
    expect(scene).toContain('SortingStationRig');
    expect(scene).toContain('PotionQueuePresentation');
    expect(scene).toContain('AlchemyLightingRig');
  });

  it('binds only the approved potion and receiver frames', () => {
    const config = readGameFile('src/scene-rig/config.ts');
    expect(config).toContain("sun: { index: 1");
    expect(config).toContain("moon: { index: 2");
    expect(config).toContain("star: { index: 3");
    expect(config).toContain("sun: { index: 17");
    expect(config).toContain("moon: { index: 18");
    expect(config).toContain("star: { index: 19");
    expect(config).not.toMatch(/index:\s*(9|14)\b/);
  });

  it('keeps production free of preview autoplay and capture authority', () => {
    const source = [
      readGameFile('src/potion-scene.ts'),
      readGameFile('src/scene-rig/config.ts')
    ].join('\n');

    expect(source).not.toContain('deterministicDemo');
    expect(source).not.toContain('captureEvidence');
    expect(source).not.toContain('autoplay');
  });

  it('routes additive drag through stable actor and receiver contracts', () => {
    const scene = readGameFile('src/potion-scene.ts');
    const potions = readGameFile('src/scene-rig/potion-rigs.ts');
    const machines = readGameFile('src/scene-rig/machine-rigs.ts');

    expect(scene).toContain('PointerDragGesture');
    expect(scene).toContain('controller.placePotion(destination)');
    expect(potions).toContain('beginActiveDrag');
    expect(potions).toContain('moveActiveDrag');
    expect(potions).toContain('returnActiveToInspection');
    expect(machines).toContain('receiverAt');
    expect(machines).toContain('setDragHover');
    expect(potions).not.toContain('dragClone');
  });

  it('builds the gearbox as a sparse mechanical service bay without a duplicate bottle rack', () => {
    const environment = readGameFile('src/scene-rig/environment-rigs.ts');

    expect(environment).toContain('GearboxRig');
    expect(environment).toContain('gearTooth');
    expect(environment).toContain('spoke');
    expect(environment).toContain('accessPlate');
    expect(environment).toContain('SERVICE_BAY_FOREGROUND_DEPTH');
    expect(environment).toContain('GEARBOX_MECHANISM_DEPTH');
    expect(environment).toContain('servicePipe');
    expect(environment).toContain('pressureGauge');
    expect(environment).toContain('valveWheel');
    expect(environment).not.toContain('addToolsShelfSplit');
    expect(environment).not.toContain('this.addBottleGrid(back');
    expect(environment).not.toContain("tileSprite(1285, 525, 88, 88, 'brass')");
  });
});
