// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { assertNonNegative, assertPositive } from './electrophysiology.js';

export interface MetrologyParams {
  photons: number;
  psfSigmaNm: number;
  imagerConcNm: number;
  kOn: number;
  kOff: number;
  spacingNm: number;
  resiSubsetsK: number; // 1 = standard DNA-PAINT, >1 = RESI sequential subsets
}

export interface MetrologyResult {
  crlbNm: number;
  resiNm: number;
  fwhmNm: number;
  brightTimeMs: number;
  darkTimeMs: number;
  dutyCyclePct: number;
  resolvable: boolean;
}

/** DNA-PAINT / 3D MINFLUX / RESI (Reinhardt et al. 2023) localization precision & kinetics. */
export function computeMetrology(p: MetrologyParams): MetrologyResult {
  assertPositive(p.photons, 'photons');
  assertPositive(p.psfSigmaNm, 'psfSigmaNm');
  assertPositive(p.imagerConcNm, 'imagerConcNm');
  assertPositive(p.kOn, 'kOn');
  assertPositive(p.kOff, 'kOff');
  assertNonNegative(p.spacingNm, 'spacingNm');
  assertPositive(p.resiSubsetsK, 'resiSubsetsK');

  const nSafe = Math.max(10, p.photons);
  const sigmaSafe = Math.max(1, p.psfSigmaNm);
  const kSub = Math.max(1, p.resiSubsetsK);
  const crlbNm = sigmaSafe / Math.sqrt(nSafe);
  const resiNm = crlbNm / Math.sqrt(kSub);
  const fwhmNm = 2 * Math.sqrt(2 * Math.LN2) * resiNm;
  const brightTimeMs = (1 / Math.max(0.05, p.kOff)) * 1000;
  const darkTimeMs = (1 / (Math.max(0.05, p.kOn) * 1e6 * Math.max(0.01, p.imagerConcNm) * 1e-9)) * 1000;
  const dutyCyclePct = (brightTimeMs / (brightTimeMs + darkTimeMs)) * 100;
  const resolvable = p.spacingNm >= fwhmNm;
  return { crlbNm, resiNm, fwhmNm, brightTimeMs, darkTimeMs, dutyCyclePct, resolvable };
}
