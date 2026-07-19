import type { DieFace } from './dierig/face-mapping';

export interface D6RollSource {
  nextFace(): DieFace;
}

export interface CryptoUint32Source {
  getRandomValues(array: Uint32Array): Uint32Array;
}

export const HISTORICAL_FIXED_D6_SEQUENCE = [4, 3, 6, 2, 5] as const satisfies readonly DieFace[];
export const D6_REJECTION_LIMIT = Math.floor(0x1_0000_0000 / 6) * 6;

export class CryptoD6RollSource implements D6RollSource {
  constructor(private readonly cryptoSource: CryptoUint32Source) {}

  nextFace(): DieFace {
    const sample = new Uint32Array(1);
    do {
      this.cryptoSource.getRandomValues(sample);
    } while (sample[0] >= D6_REJECTION_LIMIT);
    return ((sample[0] % 6) + 1) as DieFace;
  }
}

export class SequenceD6RollSource implements D6RollSource {
  private index = 0;

  constructor(private readonly faces: readonly DieFace[]) {
    if (faces.length === 0) throw new Error('A deterministic d6 sequence must contain at least one face.');
  }

  nextFace(): DieFace {
    const face = this.faces[this.index % this.faces.length];
    this.index += 1;
    return face;
  }
}

const parseEvidenceSequence = (search: string): DieFace[] | null => {
  const raw = new URLSearchParams(search).get('evidenceRolls');
  if (!raw) return null;
  const faces = raw.split(',').map(Number);
  return faces.length > 0 && faces.every((face) => Number.isInteger(face) && face >= 1 && face <= 6)
    ? faces as DieFace[]
    : null;
};

export const createRuntimeRollSource = ({
  crypto,
  isDevelopment,
  search,
}: {
  crypto: CryptoUint32Source;
  isDevelopment: boolean;
  search: string;
}): { source: D6RollSource; kind: 'production-crypto' | 'deterministic-evidence' } => {
  const evidenceFaces = isDevelopment ? parseEvidenceSequence(search) : null;
  return evidenceFaces
    ? { source: new SequenceD6RollSource(evidenceFaces), kind: 'deterministic-evidence' }
    : { source: new CryptoD6RollSource(crypto), kind: 'production-crypto' };
};
