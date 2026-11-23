// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

/**
 * Deterministic 32-bit Mulberry32 PRNG (Build Standard B03).
 * Eliminates non-reproducible Math.random() calls in stochastic synaptic release simulations.
 */
export interface SeededRng {
  readonly seed: number;
  next(): number;
  nextInt(maxExclusive: number): number;
  nextPoisson(lambda: number): number;
}

export function createSeededRng(seed: number): SeededRng {
  if (!Number.isFinite(seed)) {
    throw new RangeError('PRNG seed must be a finite integer');
  }
  let state = (seed >>> 0) || 1;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    seed: seed >>> 0,
    next,
    nextInt(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new RangeError('maxExclusive must be a positive integer');
      }
      return Math.floor(next() * maxExclusive);
    },
    nextPoisson(lambda: number): number {
      if (!Number.isFinite(lambda) || lambda < 0) {
        throw new RangeError('Poisson lambda must be finite and non-negative');
      }
      if (lambda === 0) return 0;
      const limit = Math.exp(-lambda);
      let k = 0;
      let p = 1.0;
      do {
        k += 1;
        p *= next();
      } while (p > limit);
      return k - 1;
    },
  };
}

/** Deterministic FNV-1a 32-bit hex digest for cross-run determinism assertions. */
export function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
