/// <reference types="vite/client" />

import type { DieFace } from './dierig/face-mapping';
import type { DieRigTelemetry } from './dierig/dierig';
import type { DieMotionMode } from './dierig/motion-plan';

declare global {
  interface Window {
    __DIE_RIG_LAB__?: {
      actorId: string;
      ready: boolean;
      roll: (face?: DieFace, mode?: DieMotionMode, seed?: number) => boolean;
      getTelemetry: () => DieRigTelemetry;
    };
  }
}
