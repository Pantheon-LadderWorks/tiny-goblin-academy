import type { DieFace } from './face-mapping';
import { orientationForTop, slerpQuaternion, tumbleOrientation, type Quaternion } from './dierig-model';

export type DieMotionMode = 'full' | 'reduced';
export type DieMotionPhase = 'idle' | 'anticipation' | 'release' | 'impact-one' | 'rebound' | 'impact-two' | 'settle' | 'confirmation';

export interface DieRollRequest { result: DieFace; mode: DieMotionMode; motionSeed: number }
export interface DieRollCompletion { actorId: string; result: DieFace; completed: true }
export interface MotionPhaseDefinition { phase: DieMotionPhase; duration: number; impact?: boolean }
export interface MotionPlan { mode: DieMotionMode; phases: readonly MotionPhaseDefinition[]; totalDuration: number; impactCount: number }
export interface MotionSample { phase: DieMotionPhase; x: number; y: number; height: number; scale: number; shadowScale: number; shadowAlpha: number; orientation: Quaternion }

const FULL_PHASES: readonly MotionPhaseDefinition[] = [
  { phase: 'anticipation', duration: 120 },
  { phase: 'release', duration: 480 },
  { phase: 'impact-one', duration: 55, impact: true },
  { phase: 'rebound', duration: 210 },
  { phase: 'impact-two', duration: 55, impact: true },
  { phase: 'settle', duration: 280 },
  { phase: 'confirmation', duration: 130 },
];

const REDUCED_PHASES: readonly MotionPhaseDefinition[] = [
  { phase: 'anticipation', duration: 60 },
  { phase: 'settle', duration: 240 },
  { phase: 'confirmation', duration: 80 },
];

const easeOut = (value: number) => 1 - ((1 - value) ** 3);
const easeInOut = (value: number) => value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2;
const lerp = (from: number, to: number, amount: number) => from + ((to - from) * amount);
const finalOffset = (seed: number) => ((((seed * 9301) + 49297) % 233280) / 233280 * 64) - 32;

export const createMotionPlan = (mode: DieMotionMode): MotionPlan => {
  const phases = mode === 'full' ? FULL_PHASES : REDUCED_PHASES;
  return {
    mode,
    phases,
    totalDuration: phases.reduce((total, phase) => total + phase.duration, 0),
    impactCount: phases.filter(({ impact }) => impact).length,
  };
};

const locatePhase = (plan: MotionPlan, elapsed: number) => {
  const bounded = Math.max(0, Math.min(plan.totalDuration, elapsed));
  let cursor = 0;
  for (const definition of plan.phases) {
    const end = cursor + definition.duration;
    if (bounded <= end || definition === plan.phases.at(-1)) {
      return { definition, progress: definition.duration ? (bounded - cursor) / definition.duration : 1 };
    }
    cursor = end;
  }
  return { definition: plan.phases.at(-1)!, progress: 1 };
};

export const sampleMotion = (request: DieRollRequest, elapsed: number): MotionSample => {
  const plan = createMotionPlan(request.mode);
  const { definition, progress: rawProgress } = locatePhase(plan, elapsed);
  const progress = Math.max(0, Math.min(1, rawProgress));
  const target = orientationForTop(request.result, 0.34 + ((request.motionSeed % 9) * 0.035));
  const settledX = finalOffset(request.motionSeed);

  if (request.mode === 'reduced') {
    if (definition.phase === 'anticipation') {
      return { phase: definition.phase, x: lerp(-92, -104, progress), y: 4, height: 0, scale: lerp(0.94, 0.9, progress), shadowScale: 0.82, shadowAlpha: 0.44, orientation: tumbleOrientation(0.78, request.motionSeed, target) };
    }
    if (definition.phase === 'settle') {
      const eased = easeInOut(progress);
      return { phase: definition.phase, x: lerp(-104, settledX, eased), y: lerp(4, 0, eased), height: Math.sin(progress * Math.PI) * 34, scale: lerp(0.9, 1, eased), shadowScale: lerp(0.72, 1, eased), shadowAlpha: lerp(0.32, 0.52, eased), orientation: slerpQuaternion(tumbleOrientation(0.78, request.motionSeed, target), target, eased) };
    }
    return { phase: 'confirmation', x: settledX, y: 0, height: 0, scale: 1, shadowScale: 1, shadowAlpha: 0.52, orientation: target };
  }

  switch (definition.phase) {
    case 'anticipation':
      return { phase: definition.phase, x: lerp(-310, -330, progress), y: 10, height: 0, scale: lerp(0.9, 0.84, progress), shadowScale: lerp(0.78, 0.68, progress), shadowAlpha: lerp(0.42, 0.55, progress), orientation: tumbleOrientation(0.02, request.motionSeed, target) };
    case 'release': {
      const eased = easeOut(progress);
      return { phase: definition.phase, x: lerp(-330, -24, eased), y: lerp(10, -8, progress), height: Math.sin(progress * Math.PI) * 150, scale: lerp(0.84, 1.03, Math.sin(progress * Math.PI)), shadowScale: lerp(0.68, 0.42, Math.sin(progress * Math.PI)), shadowAlpha: lerp(0.55, 0.2, Math.sin(progress * Math.PI)), orientation: tumbleOrientation(progress * 0.58, request.motionSeed, target) };
    }
    case 'impact-one':
      return { phase: definition.phase, x: lerp(-24, -14, progress), y: 0, height: 0, scale: 1 - (Math.sin(progress * Math.PI) * 0.09), shadowScale: 1.08, shadowAlpha: 0.62, orientation: tumbleOrientation(0.58 + (progress * 0.04), request.motionSeed, target) };
    case 'rebound':
      return { phase: definition.phase, x: lerp(-14, settledX, easeOut(progress)), y: 0, height: Math.sin(progress * Math.PI) * 64, scale: lerp(0.98, 1, progress), shadowScale: lerp(0.88, 0.62, Math.sin(progress * Math.PI)), shadowAlpha: lerp(0.5, 0.27, Math.sin(progress * Math.PI)), orientation: tumbleOrientation(0.62 + (progress * 0.22), request.motionSeed, target) };
    case 'impact-two':
      return { phase: definition.phase, x: settledX, y: 0, height: 0, scale: 1 - (Math.sin(progress * Math.PI) * 0.055), shadowScale: 1.04, shadowAlpha: 0.59, orientation: tumbleOrientation(0.84 + (progress * 0.025), request.motionSeed, target) };
    case 'settle': {
      const eased = easeOut(progress);
      const start = tumbleOrientation(0.865, request.motionSeed, target);
      return { phase: definition.phase, x: settledX, y: 0, height: Math.sin(progress * Math.PI) * 10, scale: 1, shadowScale: lerp(0.95, 1, eased), shadowAlpha: lerp(0.48, 0.52, eased), orientation: slerpQuaternion(start, target, eased) };
    }
    default:
      return { phase: 'confirmation', x: settledX, y: 0, height: 0, scale: 1, shadowScale: 1, shadowAlpha: 0.52, orientation: target };
  }
};
