// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { CONSTANTS } from './constants.js';
import { assertFinite, assertNonNegative, computeQ10Factor } from './electrophysiology.js';

export interface SnareThermodynamicsInput {
  snareCount: number; // 1–6 SNAREpins in ring
  clampEnergyKbt: number; // Complexin fusion clamp (0–25 kBT)
  syt1CaBound: number; // 0–5 Ca2+ ions bound to C2A(3)+C2B(2)
  tempC: number;
}

export interface SnareThermodynamicsResult {
  totalZipKbt: number;
  effectiveBarrierKbt: number;
  netDriveKbt: number;
  fusionRatePerSec: number;
  fusionDelayMs: number;
  stateLabel: string;
}

export interface SnareReactionCoordinatePoint {
  coordinate: number;
  stage: string;
  energyKbt: number;
}

/** SNAREpin zippering thermodynamics & Syt1 (5 Ca2+) / Complexin clamp kinetics. */
export function computeSnareThermodynamics(inp: SnareThermodynamicsInput): SnareThermodynamicsResult {
  assertFinite(inp.snareCount, 'snareCount');
  assertNonNegative(inp.clampEnergyKbt, 'clampEnergyKbt');
  assertNonNegative(inp.syt1CaBound, 'syt1CaBound');
  assertFinite(inp.tempC, 'tempC');

  const nSnare = Math.max(1, Math.min(6, inp.snareCount));
  const nCa = Math.max(0, Math.min(5, inp.syt1CaBound));
  const totalZipKbt = nSnare * 11.5;
  const clampRelief = (nCa / 5) * inp.clampEnergyKbt;
  const syt1CurvatureBoost = nCa * 2.4;
  const effectiveBarrierKbt = Math.max(
    1.2,
    CONSTANTS.FUSION_BARRIER_KBT + (inp.clampEnergyKbt - clampRelief) - syt1CurvatureBoost - (nSnare - 1) * 3.2
  );
  const netDriveKbt = totalZipKbt - effectiveBarrierKbt;
  const k0 = 1.5e6 * computeQ10Factor(inp.tempC, 2.0);
  const fusionRatePerSec = k0 * Math.exp(-effectiveBarrierKbt);
  const fusionDelayMs = Math.min(99999, 1000 / Math.max(1e-6, fusionRatePerSec));
  const stateLabel =
    fusionDelayMs < 1.5
      ? 'Synchronous Release (<1.5 ms)'
      : fusionDelayMs < 50
        ? 'Asynchronous / Delayed Release'
        : 'Clamped Primed State (Complexin Arrest)';
  return { totalZipKbt, effectiveBarrierKbt, netDriveKbt, fusionRatePerSec, fusionDelayMs, stateLabel };
}

/** Free-energy profile along reaction coordinate (Docked -> Primed -> Hemifusion Stalk -> Fusion Pore Open). */
export function computeSnareEnergyProfile(inp: SnareThermodynamicsInput): SnareReactionCoordinatePoint[] {
  const res = computeSnareThermodynamics(inp);
  const stages = [
    { coordinate: 0.0, stage: 'Docked', energyKbt: 0.0 },
    { coordinate: 0.25, stage: 'Half-Zippered (Primed)', energyKbt: -Math.min(18, res.totalZipKbt * 0.28) },
    { coordinate: 0.55, stage: 'Hemifusion Stalk Peak', energyKbt: res.effectiveBarrierKbt },
    { coordinate: 0.8, stage: 'Fusion Pore Nucleation', energyKbt: res.effectiveBarrierKbt * 0.35 - res.totalZipKbt * 0.3 },
    { coordinate: 1.0, stage: 'Cis-SNARE Full Collapse', energyKbt: -res.totalZipKbt },
  ];
  return stages;
}
