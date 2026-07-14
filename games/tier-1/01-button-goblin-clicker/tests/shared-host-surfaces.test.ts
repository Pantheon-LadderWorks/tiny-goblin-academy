import { describe, expect, it } from 'vitest';
import {
  ACADEMY_SHARED_HOST_SURFACES,
  getAcademyHostSurface,
  getAcademyHostSurfaceCssVariables,
  getAcademyHostSurfaceSlotCssVariables,
} from '../../../../assets/academy/ui/runtime/academy-shared-host-surfaces';

describe('Academy shared host-surface runtime contract', () => {
  it('promotes Region 20 as a uniform, three-slot victory surface', () => {
    const surface = getAcademyHostSurface('ui-hud.frame-large.teal');

    expect(surface).toMatchObject({
      regionIndex: 20,
      runtimeVerdict: 'used',
      naturalSize: { width: 665, height: 401 },
      scalePolicy: 'uniform-contain-no-stretch',
      sourceRegionManifest: 'manifests/academy/shared/academy.ui-hud.regions.json',
      slotAuthorityManifest: 'manifests/academy/shared/planning/academy.ui-hud.functional-surfaces.json',
    });
    expect(surface?.slots.map((slot) => slot.name)).toEqual(['title', 'body', 'footer']);
    expect(surface?.protectedZones).toEqual(['frame-border']);
  });

  it('promotes Region 30 for exactly one short label', () => {
    const surface = getAcademyHostSurface('ui-hud.paper-label.small');

    expect(surface).toMatchObject({
      regionIndex: 30,
      runtimeVerdict: 'constrained',
      naturalSize: { width: 289, height: 132 },
    });
    expect(surface?.slots).toHaveLength(1);
    expect(surface?.slots[0]).toMatchObject({ name: 'label', contentKind: 'short-label' });
  });

  it('records Region 5 as rejected instead of forcing the four-card HUD into two slots', () => {
    const surface = getAcademyHostSurface('ui-hud.dark-panel.long');

    expect(surface).toMatchObject({
      regionIndex: 5,
      runtimeVerdict: 'rejected',
      assetUrl: null,
    });
    expect(surface?.runtimeReason).toContain('narrow');
  });

  it('expresses natural aspect ratio and reviewed slot geometry as CSS variables', () => {
    const surface = ACADEMY_SHARED_HOST_SURFACES['ui-hud.frame-large.teal'];

    expect(getAcademyHostSurfaceCssVariables(surface)).toEqual({
      '--academy-host-aspect': '665 / 401',
    });
    expect(getAcademyHostSurfaceSlotCssVariables(surface.slots[0])).toEqual({
      '--academy-slot-x': '13%',
      '--academy-slot-y': '13%',
      '--academy-slot-width': '74%',
      '--academy-slot-height': '14%',
    });
  });

  it('returns undefined for an unregistered surface so callers keep code-native fallback UI', () => {
    expect(getAcademyHostSurface('ui-hud.unknown')).toBeUndefined();
  });
});
