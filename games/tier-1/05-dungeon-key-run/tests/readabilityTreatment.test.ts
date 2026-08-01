import {describe, expect, it} from 'vitest';
import {createInitialState} from '../src/simulation';
import {
  PATROL_TENSION_TREATMENT,
  buildTreatmentState,
  resolveTreatmentRuntimeOptions,
} from '../src/readabilityTreatment';

describe('Patrol Tension production treatment', () => {
  it('crowns adjusted B as a code-native, presentation-only default', () => {
    expect(PATROL_TENSION_TREATMENT).toMatchObject({
      id: 'patrol-tension-adjusted-b',
      name: 'Patrol Tension',
      enabledByDefault: true,
      simulationMutation: false,
      ledgerMutation: false,
      stageOnly: true,
      externalAssetDependencies: [],
    });
    expect(JSON.stringify(PATROL_TENSION_TREATMENT).toLowerCase()).not.toContain('kenney');
  });

  it('uses muted non-gory patrol wear instead of saturated red scuffs', () => {
    expect(PATROL_TENSION_TREATMENT.patrolWear).toMatchObject({
      language: 'worn-footprints-and-boot-abrasion',
      color: '#8f7654',
      alpha: 0.18,
    });
    expect(PATROL_TENSION_TREATMENT.patrolWear.alpha).toBeLessThanOrEqual(0.2);
    expect(PATROL_TENSION_TREATMENT.patrolWear.cells).toEqual([
      [7, 4], [8, 4], [8, 5], [7, 5],
    ]);
  });

  it('adapts key and exit emphasis from simulation state only', () => {
    const initial = buildTreatmentState(createInitialState());
    expect(initial.keyLight.visible).toBe(true);
    expect(initial.exitLight.alpha).toBe(0.16);

    const unlocked = buildTreatmentState({...createInitialState(), hasKey: true});
    expect(unlocked.keyLight.visible).toBe(false);
    expect(unlocked.exitLight.alpha).toBe(0.34);
  });

  it('keeps every mask cutout inside the complete 320 by 320 stage', () => {
    const state = buildTreatmentState(createInitialState());
    expect(state.stageBounds).toEqual({x: 0, y: 0, width: 320, height: 320});
    for (const cutout of state.maskCutouts) {
      expect(cutout.x - cutout.radius).toBeGreaterThanOrEqual(0);
      expect(cutout.y - cutout.radius).toBeGreaterThanOrEqual(0);
      expect(cutout.x + cutout.radius).toBeLessThanOrEqual(320);
      expect(cutout.y + cutout.radius).toBeLessThanOrEqual(320);
    }
  });

  it('offers query-only development observability without changing the default', () => {
    expect(resolveTreatmentRuntimeOptions('')).toEqual({enabled: true, debug: []});
    expect(resolveTreatmentRuntimeOptions('?treatment=off&debug=grid,collision,patrol,anchors')).toEqual({
      enabled: false,
      debug: ['grid', 'collision', 'patrol', 'anchors'],
    });
  });
});
