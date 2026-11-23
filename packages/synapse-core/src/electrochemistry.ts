// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { CONSTANTS } from './constants.js';
import { assertFinite, assertNonNegative, assertPositive } from './electrophysiology.js';

export interface IonConcentrations {
  naOutMm: number;
  naInMm: number;
  kOutMm: number;
  kInMm: number;
  caOutMm: number;
  caInUm: number;
  clOutMm: number;
  clInMm: number;
  pNaRel: number;
  pClRel: number;
  tempC: number;
}

export interface ElectrochemicalResult {
  eNaMv: number;
  eKMv: number;
  eCaMv: number;
  eClMv: number;
  vmGhkMv: number;
  rtOverFMv: number;
}

export interface EiBalanceInput {
  gExcNs: number;
  gInhNs: number;
  clInMm: number;
  clOutMm: number;
  tempC: number;
}

export interface EiBalanceResult {
  eClMv: number;
  vSteadyMv: number;
  shuntingRatio: number;
  gabaPolarity: 'Hyperpolarizing (Mature KCC2)' | 'Shunting (Near Rest)' | 'Depolarizing (Immature/NKCC1)';
}

/** Exact Nernst reversal potentials & Goldman–Hodgkin–Katz (GHK) resting potential. */
export function computeElectrochemistry(ions: IonConcentrations): ElectrochemicalResult {
  assertPositive(ions.naOutMm, 'naOutMm');
  assertPositive(ions.naInMm, 'naInMm');
  assertPositive(ions.kOutMm, 'kOutMm');
  assertPositive(ions.kInMm, 'kInMm');
  assertPositive(ions.caOutMm, 'caOutMm');
  assertPositive(ions.caInUm, 'caInUm');
  assertPositive(ions.clOutMm, 'clOutMm');
  assertPositive(ions.clInMm, 'clInMm');
  assertNonNegative(ions.pNaRel, 'pNaRel');
  assertNonNegative(ions.pClRel, 'pClRel');
  assertFinite(ions.tempC, 'tempC');

  const tempK = Math.max(273.15, ions.tempC + 273.15);
  const rtOverFMv = ((CONSTANTS.R_GAS_J_MOL_K * tempK) / CONSTANTS.FARADAY_C_PER_MOL) * 1000;
  const eNaMv = rtOverFMv * Math.log(Math.max(0.1, ions.naOutMm) / Math.max(0.1, ions.naInMm));
  const eKMv = rtOverFMv * Math.log(Math.max(0.1, ions.kOutMm) / Math.max(0.1, ions.kInMm));
  const caInMm = Math.max(1e-5, ions.caInUm / 1000);
  const eCaMv = (rtOverFMv / 2) * Math.log(Math.max(0.01, ions.caOutMm) / caInMm);
  const eClMv = -rtOverFMv * Math.log(Math.max(0.1, ions.clOutMm) / Math.max(0.1, ions.clInMm));

  const num = ions.kOutMm + ions.pNaRel * ions.naOutMm + ions.pClRel * ions.clInMm;
  const den = ions.kInMm + ions.pNaRel * ions.naInMm + ions.pClRel * ions.clOutMm;
  const vmGhkMv = rtOverFMv * Math.log(Math.max(1e-6, num) / Math.max(1e-6, den));
  return { eNaMv, eKMv, eCaMv, eClMv, vmGhkMv, rtOverFMv };
}

/** Steady-state postsynaptic E/I conductance divider & KCC2/NKCC1 Cl- reversal solver. */
export function computeEiBalance(inp: EiBalanceInput): EiBalanceResult {
  assertNonNegative(inp.gExcNs, 'gExcNs');
  assertNonNegative(inp.gInhNs, 'gInhNs');
  assertPositive(inp.clInMm, 'clInMm');
  assertPositive(inp.clOutMm, 'clOutMm');
  assertFinite(inp.tempC, 'tempC');

  const tempK = Math.max(273.15, inp.tempC + 273.15);
  const rtOverFMv = ((CONSTANTS.R_GAS_J_MOL_K * tempK) / CONSTANTS.FARADAY_C_PER_MOL) * 1000;
  const eClMv = -rtOverFMv * Math.log(Math.max(1, inp.clOutMm) / Math.max(0.5, inp.clInMm));
  const gL = 1.0;
  const eL = -70.0;
  const eExc = 0.0;
  const gTot = gL + inp.gExcNs + inp.gInhNs;
  const vSteadyMv = (gL * eL + inp.gExcNs * eExc + inp.gInhNs * eClMv) / Math.max(1e-6, gTot);
  const vExcOnly = (gL * eL + inp.gExcNs * eExc) / Math.max(1e-6, gL + inp.gExcNs);
  const shuntingRatio = Math.abs(vExcOnly - eL) > 1e-4 ? (vSteadyMv - eL) / (vExcOnly - eL) : 1.0;
  const gabaPolarity =
    eClMv < -72
      ? 'Hyperpolarizing (Mature KCC2)'
      : eClMv <= -64
        ? 'Shunting (Near Rest)'
        : 'Depolarizing (Immature/NKCC1)';
  return { eClMv, vSteadyMv, shuntingRatio, gabaPolarity };
}
