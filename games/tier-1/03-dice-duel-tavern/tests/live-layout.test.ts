import { describe, expect, it } from 'vitest';

import { computeProductionDieScale } from '../src/live-die-layout';

describe('H6.11 production DieRig scale', () => {
  it.each([
    { contract: '1920x1080', tray: 700, canvas: 1896 },
    { contract: '1024x640', tray: 474, canvas: 1008 },
  ])('targets 24.5% of the live tray at $contract', ({ tray, canvas }) => {
    const metrics = computeProductionDieScale({
      trayInnerWidthCss: tray,
      canvasWidthCss: canvas,
      logicalCanvasWidth: 1200,
      projectedWidthAtScaleOne: 190,
    });
    expect(metrics.settledRatio).toBeCloseTo(0.245, 6);
    expect(metrics.settledRatio).toBeGreaterThanOrEqual(0.22);
    expect(metrics.settledRatio).toBeLessThanOrEqual(0.27);
    expect(metrics.launchScale / metrics.settledScale).toBeCloseTo(1.07, 6);
  });
});
