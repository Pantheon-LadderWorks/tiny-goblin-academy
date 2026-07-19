import { describe, expect, it } from 'vitest';

import { DieRigAuthority } from '../src/dierig/dierig-authority';
import { DIE_FACE_MAPPINGS, type DieFace } from '../src/dierig/face-mapping';
import { OPPOSITE_FACE_PAIRS, orientationForTop, topFaceForOrientation } from '../src/dierig/dierig-model';
import { projectCubeFaces } from '../src/dierig/cube-projection';
import { createMotionPlan, sampleMotion, type DieMotionMode, type DieRollRequest } from '../src/dierig/motion-plan';

const request = (result: DieFace, mode: DieMotionMode = 'full', motionSeed = 41): DieRollRequest => ({ result, mode, motionSeed });

describe('H6.10 DieRig topology and canonical faces', () => {
  it('maps exactly one unique reviewed surface for every face', () => {
    expect(DIE_FACE_MAPPINGS).toHaveLength(6);
    expect(DIE_FACE_MAPPINGS.map(({ face }) => face)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(DIE_FACE_MAPPINGS.map(({ id }) => id)).size).toBe(6);
    expect(DIE_FACE_MAPPINGS.map(({ rect }) => rect)).toEqual([
      { x: 1, y: 1, w: 126, h: 126 },
      { x: 129, y: 1, w: 126, h: 126 },
      { x: 257, y: 1, w: 126, h: 126 },
      { x: 385, y: 1, w: 126, h: 126 },
      { x: 513, y: 1, w: 126, h: 126 },
      { x: 641, y: 1, w: 126, h: 126 },
    ]);
  });

  it('uses the fixed 1–6, 2–5, and 3–4 opposite pairs', () => {
    expect(OPPOSITE_FACE_PAIRS).toEqual([[1, 6], [2, 5], [3, 4]]);
  });

  it.each([1, 2, 3, 4, 5, 6] as DieFace[])('settles injected face %i on top', (face) => {
    expect(topFaceForOrientation(orientationForTop(face, 0.43))).toBe(face);
  });
});

describe('H6.10 deterministic choreography', () => {
  it('keeps full motion inside the approved multiphase timing and two-impact budget', () => {
    const plan = createMotionPlan('full');
    expect(plan.totalDuration).toBeGreaterThanOrEqual(1150);
    expect(plan.totalDuration).toBeLessThanOrEqual(1400);
    expect(plan.impactCount).toBe(2);
    expect(plan.phases.map(({ phase }) => phase)).toEqual([
      'anticipation', 'release', 'impact-one', 'rebound', 'impact-two', 'settle', 'confirmation',
    ]);
  });

  it('uses a direct 250–400 ms reduced path without extended tumble or rebound', () => {
    const plan = createMotionPlan('reduced');
    expect(plan.totalDuration).toBeGreaterThanOrEqual(250);
    expect(plan.totalDuration).toBeLessThanOrEqual(400);
    expect(plan.impactCount).toBe(0);
    expect(plan.phases.map(({ phase }) => phase)).toEqual(['anticipation', 'settle', 'confirmation']);
  });

  it.each([1, 2, 3, 4, 5, 6] as DieFace[])('preserves requested result %i through final settle in both modes', (face) => {
    for (const mode of ['full', 'reduced'] as const) {
      const plan = createMotionPlan(mode);
      const sample = sampleMotion(request(face, mode, 73), plan.totalDuration);
      expect(sample.phase).toBe('confirmation');
      expect(topFaceForOrientation(sample.orientation)).toBe(face);
      expect(Math.abs(sample.x)).toBeLessThanOrEqual(32);
      expect(sample.height).toBe(0);
    }
  });

  it('enters from the player side and varies final position deterministically by seed', () => {
    const atStart = sampleMotion(request(4, 'full', 17), 0);
    const plan = createMotionPlan('full');
    const finalA = sampleMotion(request(4, 'full', 17), plan.totalDuration);
    const finalB = sampleMotion(request(4, 'full', 17), plan.totalDuration);
    const finalC = sampleMotion(request(4, 'full', 18), plan.totalDuration);
    expect(atStart.x).toBeLessThan(-200);
    expect(finalA).toEqual(finalB);
    expect(finalA.x).not.toBe(finalC.x);
  });
});

describe('H6.10 persistent authority boundary', () => {
  it('retains one actor ID across repeated injected result requests', () => {
    const authority = new DieRigAuthority();
    const actorId = authority.actorId;
    expect(authority.request(request(1))).toBe(true);
    expect(authority.complete()).toEqual({ actorId, result: 1, completed: true });
    expect(authority.request(request(6, 'reduced'))).toBe(true);
    expect(authority.complete()).toEqual({ actorId, result: 6, completed: true });
    expect(authority.actorId).toBe(actorId);
  });

  it('rejects overlap and completes each accepted request exactly once', () => {
    const authority = new DieRigAuthority();
    expect(authority.request(request(3))).toBe(true);
    expect(authority.busy).toBe(true);
    expect(authority.activeRequest?.result).toBe(3);
    expect(authority.request(request(5))).toBe(false);
    expect(authority.complete()?.result).toBe(3);
    expect(authority.complete()).toBeNull();
    expect(authority.busy).toBe(false);
  });

  it('clears active presentation work on cancellation and destruction', () => {
    const authority = new DieRigAuthority();
    authority.request(request(2));
    authority.cancel();
    expect(authority.busy).toBe(false);
    expect(authority.activeRequest).toBeNull();
    expect(authority.complete()).toBeNull();
    authority.request(request(5));
    authority.destroy();
    expect(authority.busy).toBe(false);
    expect(authority.activeRequest).toBeNull();
  });
});

describe('H6.10 projected cube renderer model', () => {
  it('projects six canonical quadrilateral faces from one orientation', () => {
    const faces = projectCubeFaces(orientationForTop(1, 0.43), 86, 520);
    expect(faces).toHaveLength(6);
    expect(faces.map(({ face }) => face).sort()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(faces.every(({ points }) => points.length === 4)).toBe(true);
    expect(faces.every(({ points }) => points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)))).toBe(true);
  });

  it('keeps the requested top face visible and depth-sorts visible surfaces back-to-front', () => {
    for (const face of [1, 4, 6] as DieFace[]) {
      const projected = projectCubeFaces(orientationForTop(face, 0.43), 86, 520);
      const visible = projected.filter(({ visible }) => visible);
      expect(visible.some(({ face: visibleFace }) => visibleFace === face)).toBe(true);
      expect(visible.length).toBeGreaterThanOrEqual(3);
      const depths = visible.map(({ depth }) => depth);
      expect(depths).toEqual([...depths].sort((a, b) => a - b));
    }
  });
});
