import type { DieFace } from './face-mapping';

export interface Vec3 { x: number; y: number; z: number }
export interface Quaternion { x: number; y: number; z: number; w: number }

export const OPPOSITE_FACE_PAIRS = [[1, 6], [2, 5], [3, 4]] as const;

export const FACE_NORMALS: Record<DieFace, Vec3> = {
  1: { x: 0, y: 1, z: 0 },
  2: { x: 0, y: 0, z: 1 },
  3: { x: 1, y: 0, z: 0 },
  4: { x: -1, y: 0, z: 0 },
  5: { x: 0, y: 0, z: -1 },
  6: { x: 0, y: -1, z: 0 },
};

export const identityQuaternion = (): Quaternion => ({ x: 0, y: 0, z: 0, w: 1 });

const normalize = (quaternion: Quaternion): Quaternion => {
  const magnitude = Math.hypot(quaternion.x, quaternion.y, quaternion.z, quaternion.w) || 1;
  return {
    x: quaternion.x / magnitude,
    y: quaternion.y / magnitude,
    z: quaternion.z / magnitude,
    w: quaternion.w / magnitude,
  };
};

const multiply = (a: Quaternion, b: Quaternion): Quaternion => normalize({
  w: (a.w * b.w) - (a.x * b.x) - (a.y * b.y) - (a.z * b.z),
  x: (a.w * b.x) + (a.x * b.w) + (a.y * b.z) - (a.z * b.y),
  y: (a.w * b.y) - (a.x * b.z) + (a.y * b.w) + (a.z * b.x),
  z: (a.w * b.z) + (a.x * b.y) - (a.y * b.x) + (a.z * b.w),
});

const axisAngle = (axis: Vec3, angle: number): Quaternion => {
  const half = angle / 2;
  const sine = Math.sin(half);
  return normalize({ x: axis.x * sine, y: axis.y * sine, z: axis.z * sine, w: Math.cos(half) });
};

const fromEuler = (x: number, y: number, z: number): Quaternion => multiply(
  axisAngle({ x: 0, y: 1, z: 0 }, y),
  multiply(axisAngle({ x: 0, y: 0, z: 1 }, z), axisAngle({ x: 1, y: 0, z: 0 }, x)),
);

export const orientationForTop = (face: DieFace, yaw = 0): Quaternion => {
  const alignment: Record<DieFace, Quaternion> = {
    1: identityQuaternion(),
    2: axisAngle({ x: 1, y: 0, z: 0 }, -Math.PI / 2),
    3: axisAngle({ x: 0, y: 0, z: 1 }, Math.PI / 2),
    4: axisAngle({ x: 0, y: 0, z: 1 }, -Math.PI / 2),
    5: axisAngle({ x: 1, y: 0, z: 0 }, Math.PI / 2),
    6: axisAngle({ x: 1, y: 0, z: 0 }, Math.PI),
  };
  return multiply(axisAngle({ x: 0, y: 1, z: 0 }, yaw), alignment[face]);
};

export const rotateVector = (vector: Vec3, orientation: Quaternion): Vec3 => {
  const q = normalize(orientation);
  const uv = {
    x: (q.y * vector.z) - (q.z * vector.y),
    y: (q.z * vector.x) - (q.x * vector.z),
    z: (q.x * vector.y) - (q.y * vector.x),
  };
  const uuv = {
    x: (q.y * uv.z) - (q.z * uv.y),
    y: (q.z * uv.x) - (q.x * uv.z),
    z: (q.x * uv.y) - (q.y * uv.x),
  };
  const factor = 2 * q.w;
  return {
    x: vector.x + (uv.x * factor) + (uuv.x * 2),
    y: vector.y + (uv.y * factor) + (uuv.y * 2),
    z: vector.z + (uv.z * factor) + (uuv.z * 2),
  };
};

export const topFaceForOrientation = (orientation: Quaternion): DieFace => {
  let result: DieFace = 1;
  let highest = -Infinity;
  for (const face of [1, 2, 3, 4, 5, 6] as DieFace[]) {
    const height = rotateVector(FACE_NORMALS[face], orientation).y;
    if (height > highest) {
      highest = height;
      result = face;
    }
  }
  return result;
};

export const slerpQuaternion = (from: Quaternion, to: Quaternion, amount: number): Quaternion => {
  const clamped = Math.max(0, Math.min(1, amount));
  let target = normalize(to);
  const source = normalize(from);
  let dot = (source.x * target.x) + (source.y * target.y) + (source.z * target.z) + (source.w * target.w);
  if (dot < 0) {
    dot = -dot;
    target = { x: -target.x, y: -target.y, z: -target.z, w: -target.w };
  }
  if (dot > 0.9995) {
    return normalize({
      x: source.x + ((target.x - source.x) * clamped),
      y: source.y + ((target.y - source.y) * clamped),
      z: source.z + ((target.z - source.z) * clamped),
      w: source.w + ((target.w - source.w) * clamped),
    });
  }
  const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
  const sine = Math.sin(theta);
  const a = Math.sin((1 - clamped) * theta) / sine;
  const b = Math.sin(clamped * theta) / sine;
  return normalize({
    x: (source.x * a) + (target.x * b),
    y: (source.y * a) + (target.y * b),
    z: (source.z * a) + (target.z * b),
    w: (source.w * a) + (target.w * b),
  });
};

export const tumbleOrientation = (progress: number, seed: number, target: Quaternion): Quaternion => {
  const remaining = 1 - Math.max(0, Math.min(1, progress));
  const seedOffset = (seed % 11) * 0.07;
  const spin = fromEuler(
    remaining * ((Math.PI * 4.4) + seedOffset),
    remaining * ((Math.PI * 3.2) + (seedOffset * 0.7)),
    remaining * ((Math.PI * 2.6) - (seedOffset * 0.4)),
  );
  return multiply(target, spin);
};
