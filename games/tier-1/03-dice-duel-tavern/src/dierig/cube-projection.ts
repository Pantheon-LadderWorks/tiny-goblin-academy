import type { DieFace } from './face-mapping';
import { FACE_NORMALS, rotateVector, type Quaternion, type Vec3 } from './dierig-model';

export interface ProjectedPoint { x: number; y: number }
export interface ProjectedCubeFace {
  face: DieFace;
  points: readonly ProjectedPoint[];
  depth: number;
  visible: boolean;
}

const FACE_CORNERS: Record<DieFace, readonly Vec3[]> = {
  1: [{ x: -1, y: 1, z: -1 }, { x: -1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: -1 }],
  2: [{ x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }],
  3: [{ x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: 1, z: 1 }],
  4: [{ x: -1, y: -1, z: -1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: 1 }, { x: -1, y: 1, z: -1 }],
  5: [{ x: 1, y: -1, z: -1 }, { x: -1, y: -1, z: -1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: 1, z: -1 }],
  6: [{ x: -1, y: -1, z: 1 }, { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: -1, z: 1 }],
};

const CAMERA_PITCH = 0.58;

const cameraSpace = (point: Vec3): Vec3 => ({
  x: point.x,
  y: (point.y * Math.cos(CAMERA_PITCH)) - (point.z * Math.sin(CAMERA_PITCH)),
  z: (point.y * Math.sin(CAMERA_PITCH)) + (point.z * Math.cos(CAMERA_PITCH)),
});

export const projectCubeFaces = (orientation: Quaternion, halfSize: number, perspective: number): ProjectedCubeFace[] => {
  const faces = ([1, 2, 3, 4, 5, 6] as DieFace[]).map((face) => {
    const transformed = FACE_CORNERS[face].map((corner) => cameraSpace(rotateVector(corner, orientation)));
    const normal = cameraSpace(rotateVector(FACE_NORMALS[face], orientation));
    return {
      face,
      points: transformed.map((point) => {
        const scale = perspective / Math.max(1, perspective - (point.z * halfSize));
        return { x: point.x * halfSize * scale, y: -point.y * halfSize * scale };
      }),
      depth: transformed.reduce((total, point) => total + point.z, 0) / transformed.length,
      visible: normal.z >= -0.000001,
    };
  });
  return faces.sort((a, b) => a.depth - b.depth);
};
