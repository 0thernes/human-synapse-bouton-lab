// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { CONSTANTS } from './constants.js';

export type EndocytosisMode =
  | 'Ultrafast (UFE, 50–100 ms)'
  | 'Transitional (UFE + CME)'
  | 'Clathrin-Mediated (CME, 10–30 s)';

export type PharmacologyAgent =
  | 'control'
  | 'bonta'
  | 'agatoxin'
  | 'tboa'
  | 'cnqx'
  | 'pip2_depletion';

export interface BiophysicalParams {
  caExtMm: number;
  couplingNm: number;
  cleftWidthNm: number;
  nanocolumnOffsetNm: number;
  tempC: number;
  trueScale: boolean;
  showNanocolumn: boolean;
  showLlps: boolean;
  showDebye: boolean;
}

export class BiophysicsValidationError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = 'BiophysicsValidationError';
  }
}

export function assertFinite(value: number, name: string): number {
  if (!Number.isFinite(value)) {
    throw new BiophysicsValidationError(`${name} must be finite, received ${String(value)}`);
  }
  return value;
}

export function assertNonNegative(value: number, name: string): number {
  assertFinite(value, name);
  if (value < 0) {
    throw new BiophysicsValidationError(`${name} must be non-negative, received ${value}`);
  }
  return value;
}

export function assertPositive(value: number, name: string): number {
  assertFinite(value, name);
  if (value <= 0) {
    throw new BiophysicsValidationError(`${name} must be strictly positive, received ${value}`);
  }
  return value;
}

export function computeThermalEnergyPnNm(tempC: number): number {
  assertFinite(tempC, 'tempC');
  if (tempC < -273.15) {
    throw new BiophysicsValidationError(`tempC cannot be below absolute zero (-273.15 °C), received ${tempC}`);
  }
  const tempK = Math.max(273.15, tempC + 273.15);
  return CONSTANTS.K_B_J_PER_K * tempK * 1e21;
}

export function computeQ10Factor(tempC: number, q10: number = 2.1): number {
  assertFinite(tempC, 'tempC');
  assertPositive(q10, 'q10');
  return Math.pow(q10, (tempC - 37) / 10);
}

export function classifyEndocytosisMode(tempC: number): EndocytosisMode {
  assertFinite(tempC, 'tempC');
  if (tempC >= 30) return 'Ultrafast (UFE, 50–100 ms)';
  if (tempC >= 27) return 'Transitional (UFE + CME)';
  return 'Clathrin-Mediated (CME, 10–30 s)';
}

/** Linearized Ca2+ nanodomain spatial decay model (Naraghi-Neher stationary buffer approximation). */
export function computeLocalCaPeakUm(caExtMm: number, couplingNm: number): number {
  assertNonNegative(caExtMm, 'caExtMm');
  assertPositive(couplingNm, 'couplingNm');
  const dSafe = Math.max(5, couplingNm);
  const caRatio = Math.max(0.1, caExtMm) / 2.0;
  return CONSTANTS.CA_REST_UM + ((1060 * caRatio) / dSafe) * Math.exp(-dSafe / CONSTANTS.LAMBDA_B_NM);
}

/** Hill n=4 cooperative vesicular release probability. */
export function computeReleaseProbability(caLocalUm: number): number {
  assertNonNegative(caLocalUm, 'caLocalUm');
  const cn = Math.pow(caLocalUm, CONSTANTS.HILL_N);
  const kdn = Math.pow(CONSTANTS.CA_KD_UM, CONSTANTS.HILL_N);
  return cn + kdn > 0 ? cn / (cn + kdn) : 0;
}

/** Peak cleft glutamate concentration (mM) with Gaussian trans-synaptic nanocolumn misalignment decay. */
export function computeCleftGluPeakMm(
  fusedVesicles: number,
  cleftWidthNm: number,
  nanocolumnOffsetNm: number
): number {
  assertNonNegative(fusedVesicles, 'fusedVesicles');
  assertPositive(cleftWidthNm, 'cleftWidthNm');
  assertNonNegative(nanocolumnOffsetNm, 'nanocolumnOffsetNm');
  if (fusedVesicles <= 0) return 0;
  const wSafe = Math.max(10, cleftWidthNm);
  const sigmaDiffNm = 42;
  return (
    fusedVesicles *
    1.62 *
    (22.0 / wSafe) *
    Math.exp(-(nanocolumnOffsetNm * nanocolumnOffsetNm) / (2 * sigmaDiffNm * sigmaDiffNm))
  );
}

/** Peak postsynaptic AMPAR EPSC (pA, inward negative) with Hill n=1.6 binding and Q10 conductance scaling. */
export function computePeakEpscPa(gluPeakMm: number, tempC: number): number {
  assertNonNegative(gluPeakMm, 'gluPeakMm');
  assertFinite(tempC, 'tempC');
  if (gluPeakMm <= 0) return 0;
  const pOpen = Math.pow(gluPeakMm, 1.6) / (Math.pow(gluPeakMm, 1.6) + Math.pow(0.55, 1.6));
  return -38.5 * pOpen * computeQ10Factor(tempC, 1.4);
}

/** Effective release probability & EPSC gain under canonical molecular pharmacology perturbations. */
export function computeEffectivePharmacology(
  basePr: number,
  baseEpscPa: number,
  agent: PharmacologyAgent
): { effectivePr: number; effectiveEpscPa: number; cleftClearanceFactor: number; mechanism: string } {
  assertNonNegative(basePr, 'basePr');
  assertFinite(baseEpscPa, 'baseEpscPa');
  switch (agent) {
    case 'control':
      return {
        effectivePr: basePr,
        effectiveEpscPa: baseEpscPa,
        cleftClearanceFactor: 1.0,
        mechanism: 'Baseline physiological cortical bouton (unperturbed).',
      };
    case 'bonta':
      return {
        effectivePr: basePr * 0.02,
        effectiveEpscPa: baseEpscPa * 0.02,
        cleftClearanceFactor: 1.0,
        mechanism: 'Botulinum Neurotoxin A (PDB 1XTG): Zn2+ metalloprotease cleaves SNAP-25 C-terminus, silencing SNARE fusion.',
      };
    case 'agatoxin':
      return {
        effectivePr: basePr * 0.08,
        effectiveEpscPa: baseEpscPa * 0.08,
        cleftClearanceFactor: 1.0,
        mechanism: 'omega-Agatoxin IVA: Selective P/Q-type CaV2.1 channel pore block collapses nanodomain Ca2+ influx.',
      };
    case 'tboa':
      return {
        effectivePr: basePr,
        effectiveEpscPa: baseEpscPa * 1.18,
        cleftClearanceFactor: 0.25,
        mechanism: 'DL-TBOA: Blocks astrocytic EAAT2/GLT-1 glutamate uptake, prolonging cleft decay and spillover.',
      };
    case 'cnqx':
      return {
        effectivePr: basePr,
        effectiveEpscPa: baseEpscPa * 0.03,
        cleftClearanceFactor: 1.0,
        mechanism: 'CNQX: Competitive postsynaptic AMPAR antagonist blocking fast inward EPSC while sparing presynaptic release.',
      };
    case 'pip2_depletion':
      return {
        effectivePr: basePr * 0.35,
        effectiveEpscPa: baseEpscPa * 0.35,
        cleftClearanceFactor: 1.0,
        mechanism: 'Membrane PI(4,5)P2 depletion impairs Synaptotagmin-1 C2B polybasic electrostatic docking.',
      };
  }
}
