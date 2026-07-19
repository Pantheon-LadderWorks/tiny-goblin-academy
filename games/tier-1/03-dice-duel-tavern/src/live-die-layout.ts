export interface ProductionDieScaleInput {
  trayInnerWidthCss: number;
  canvasWidthCss: number;
  logicalCanvasWidth: number;
  projectedWidthAtScaleOne: number;
}

export interface ProductionDieScaleMetrics {
  targetWidthCss: number;
  settledScale: number;
  launchScale: number;
  settledRatio: number;
}

export const PRODUCTION_SETTLED_RATIO = 0.245;
export const PRODUCTION_LAUNCH_MULTIPLIER = 1.07;

export const computeProductionDieScale = (input: ProductionDieScaleInput): ProductionDieScaleMetrics => {
  const cssPerLogicalPixel = input.canvasWidthCss / input.logicalCanvasWidth;
  const targetWidthCss = input.trayInnerWidthCss * PRODUCTION_SETTLED_RATIO;
  const settledScale = targetWidthCss / (input.projectedWidthAtScaleOne * cssPerLogicalPixel);
  return {
    targetWidthCss,
    settledScale,
    launchScale: settledScale * PRODUCTION_LAUNCH_MULTIPLIER,
    settledRatio: targetWidthCss / input.trayInnerWidthCss,
  };
};
