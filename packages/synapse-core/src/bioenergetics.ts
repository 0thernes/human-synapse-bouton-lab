// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { CONSTANTS } from './constants.js';
import { assertFinite, assertNonNegative, assertPositive } from './electrophysiology.js';

export interface BioenergeticsInput {
  luminalPh: number; // ~5.5 physiological
  cytosolicPh: number; // ~7.2 physiological
  deltaPsiMv: number; // +40 mV vesicular membrane potential
  firingRateHz: number; // 0–100 Hz
  mitoActive: boolean;
  tempC: number;
}

export interface BioenergeticsResult {
  deltaPh: number;
  pmfMv: number;
  estGluQuanta: number;
  atpBurnPerSec: number;
  atpSynthPerSec: number;
  sustainSeconds: number;
  restingLeakFraction: number;
}

export interface KinesinTransportResult {
  velocityNmPerSec: number;
  atpPerMm: number;
  transitDaysPerMeter: number;
}

/** V-ATPase Proton Motive Force (PMF) & Rangaraju (2014) / Pulido-Ryan (2021) local ATP bioenergetics. */
export function computeBioenergetics(inp: BioenergeticsInput): BioenergeticsResult {
  assertFinite(inp.luminalPh, 'luminalPh');
  assertFinite(inp.cytosolicPh, 'cytosolicPh');
  assertFinite(inp.deltaPsiMv, 'deltaPsiMv');
  assertNonNegative(inp.firingRateHz, 'firingRateHz');
  assertFinite(inp.tempC, 'tempC');

  const tempK = Math.max(273.15, inp.tempC + 273.15);
  const nernstPhMv = (2.302585 * CONSTANTS.R_GAS_J_MOL_K * tempK * 1000) / CONSTANTS.FARADAY_C_PER_MOL;
  const deltaPh = Math.max(0, inp.cytosolicPh - inp.luminalPh);
  const pmfMv = inp.deltaPsiMv + nernstPhMv * deltaPh;
  const estGluQuanta = Math.round(Math.min(5500, Math.max(200, (pmfMv / 145) * 3200)));
  const restingLeakAtpPerSec = 4000;
  const atpBurnPerSec = restingLeakAtpPerSec + inp.firingRateHz * 32000;
  const atpSynthPerSec = inp.mitoActive ? 950000 : 280000;
  const netBurn = atpBurnPerSec - atpSynthPerSec;
  const sustainSeconds = netBurn <= 0 ? Infinity : CONSTANTS.BOUTON_FREE_ATP / netBurn;
  const restingLeakFraction = restingLeakAtpPerSec / Math.max(1, atpBurnPerSec);
  return {
    deltaPh,
    pmfMv,
    estGluQuanta,
    atpBurnPerSec,
    atpSynthPerSec,
    sustainSeconds,
    restingLeakFraction,
  };
}

/** Processive Kinesin-1 axonal transport energetics: v = d * R (d = 8.0 nm/ATP). */
export function computeKinesinTransport(
  hydrolysisRateHz: number = CONSTANTS.KINESIN_DEFAULT_RATE_HZ,
  stepNm: number = CONSTANTS.KINESIN_STEP_NM
): KinesinTransportResult {
  assertPositive(hydrolysisRateHz, 'hydrolysisRateHz');
  assertPositive(stepNm, 'stepNm');
  const velocityNmPerSec = stepNm * hydrolysisRateHz;
  const atpPerMm = 1e6 / stepNm;
  const transitDaysPerMeter = 1e9 / velocityNmPerSec / 86400;
  return { velocityNmPerSec, atpPerMm, transitDaysPerMeter };
}
