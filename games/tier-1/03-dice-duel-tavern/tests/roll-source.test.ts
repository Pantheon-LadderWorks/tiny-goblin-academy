import { describe, expect, it } from 'vitest';

import {
  CryptoD6RollSource,
  D6_REJECTION_LIMIT,
  HISTORICAL_FIXED_D6_SEQUENCE,
  SequenceD6RollSource,
  createRuntimeRollSource,
} from '../src/roll-source';

const cryptoSequence = (...values: number[]) => {
  let index = 0;
  return {
    calls: () => index,
    getRandomValues(array: Uint32Array) {
      array[0] = values[index++] ?? 0;
      return array;
    },
  };
};

describe('H6.11 d6 roll-source boundary', () => {
  it('uses the largest unbiased Uint32 acceptance range and rejects its tail', () => {
    expect(D6_REJECTION_LIMIT).toBe(4_294_967_292);
    const crypto = cryptoSequence(0xffff_ffff, 5);
    expect(new CryptoD6RollSource(crypto).nextFace()).toBe(6);
    expect(crypto.calls()).toBe(2);
  });

  it('restricts deterministic mocked Web Crypto results to faces 1–6', () => {
    const source = new CryptoD6RollSource(cryptoSequence(0, 1, 2, 3, 4, 5));
    expect(Array.from({ length: 6 }, () => source.nextFace())).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('keeps the historical sequence only as an explicit deterministic fixture', () => {
    expect(HISTORICAL_FIXED_D6_SEQUENCE).toEqual([4, 3, 6, 2, 5]);
    const source = new SequenceD6RollSource(HISTORICAL_FIXED_D6_SEQUENCE);
    expect(Array.from({ length: 5 }, () => source.nextFace())).toEqual([4, 3, 6, 2, 5]);
  });

  it('selects Web Crypto for production and permits evidence injection only in development', () => {
    const crypto = cryptoSequence(2);
    expect(createRuntimeRollSource({ crypto, isDevelopment: false, search: '?evidenceRolls=4,3' }).kind).toBe('production-crypto');
    expect(createRuntimeRollSource({ crypto, isDevelopment: true, search: '?evidenceRolls=4,3' }).kind).toBe('deterministic-evidence');
  });
});
