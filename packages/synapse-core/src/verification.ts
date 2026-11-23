// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { CONSTANTS, BOUTON_PRESETS } from './constants.js';
import {
  classifyEndocytosisMode,
  computeCleftGluPeakMm,
  computeLocalCaPeakUm,
  computePeakEpscPa,
  computeReleaseProbability,
  computeThermalEnergyPnNm,
} from './electrophysiology.js';
import { computeEiBalance, computeElectrochemistry } from './electrochemistry.js';
import { computeSnareThermodynamics } from './snare.js';
import { computeBioenergetics, computeKinesinTransport } from './bioenergetics.js';
import { computeNmdaMgUnblock, solveHodgkinHuxleyRK4 } from './hodgkinHuxley.js';
import { computeMetrology } from './metrology.js';
import { createSeededRng, fnv1aHex } from './prng.js';

export interface VerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
  tier: 'exact-algebra' | 'biophysical-bound' | 'numerical_approximation' | 'determinism';
}

export function runVerificationSuite(): VerificationCheck[] {
  const checks: VerificationCheck[] = [];

  const ca20 = computeLocalCaPeakUm(2.0, 20);
  const ca60 = computeLocalCaPeakUm(2.0, 60);
  checks.push({
    id: 'V01',
    name: 'Ca²⁺ Nanodomain Spatial Decay (20 nm > 60 nm)',
    passed: Number.isFinite(ca20) && Number.isFinite(ca60) && ca20 > 10 && ca20 > ca60 * 3,
    detail: `C(20nm)=${ca20.toFixed(2)} μM > C(60nm)=${ca60.toFixed(2)} μM`,
    tier: 'biophysical-bound',
  });

  const prLow = computeReleaseProbability(5);
  const prMid = computeReleaseProbability(15);
  const prHigh = computeReleaseProbability(35);
  checks.push({
    id: 'V02',
    name: 'Hill n=4 Cooperativity Monotonicity & Half-Max',
    passed: prLow <= 1 / 82 + 1e-12 && Math.abs(prMid - 0.5) < 1e-12 && prHigh > 0.95,
    detail: `P_r(5)=${prLow.toFixed(4)}, P_r(15)=${prMid.toFixed(3)}, P_r(35)=${prHigh.toFixed(4)}`,
    tier: 'exact-algebra',
  });

  const gluAligned = computeCleftGluPeakMm(1, 22, 0);
  const gluMisaligned = computeCleftGluPeakMm(1, 22, 80);
  checks.push({
    id: 'V03',
    name: 'Trans-Synaptic Nanocolumn Alignment Gain',
    passed: gluAligned > 1.2 && gluAligned > gluMisaligned * 4,
    detail: `[Glu](0nm)=${gluAligned.toFixed(2)} mM vs [Glu](80nm)=${gluMisaligned.toFixed(2)} mM`,
    tier: 'biophysical-bound',
  });

  const epscAligned = computePeakEpscPa(gluAligned, 37);
  const epscZero = computePeakEpscPa(0, 37);
  checks.push({
    id: 'V04',
    name: 'AMPAR EPSC Polarity & Zero-Glutamate Guard',
    passed: epscAligned < -15 && epscZero === 0 && Number.isFinite(epscAligned),
    detail: `EPSC(aligned)=${epscAligned.toFixed(2)} pA, EPSC(0)=${epscZero} pA`,
    tier: 'biophysical-bound',
  });

  const kbt37 = computeThermalEnergyPnNm(37);
  checks.push({
    id: 'V05',
    name: 'Thermal Energy k_B T at 310.15 K (~4.282 pN·nm)',
    passed: Math.abs(kbt37 - 4.282083) < 0.002,
    detail: `k_B T(37°C)=${kbt37.toFixed(4)} pN·nm`,
    tier: 'exact-algebra',
  });

  const ufe37 = classifyEndocytosisMode(37);
  const cme24 = classifyEndocytosisMode(24);
  checks.push({
    id: 'V06',
    name: 'Ultrafast Endocytosis Temperature Switch (37°C vs 24°C)',
    passed: ufe37.startsWith('Ultrafast') && cme24.startsWith('Clathrin'),
    detail: `37°C -> ${ufe37}; 24°C -> ${cme24}`,
    tier: 'biophysical-bound',
  });

  const metResi = computeMetrology({
    photons: 2500,
    psfSigmaNm: 110,
    imagerConcNm: 2,
    kOn: 2,
    kOff: 5,
    spacingNm: 3,
    resiSubsetsK: 9,
  });
  checks.push({
    id: 'V07',
    name: 'DNA-PAINT / RESI 1/√(N·K) Ångström-Scale Scaling',
    passed: Math.abs(metResi.crlbNm - 2.2) < 1e-9 && Math.abs(metResi.resiNm - 2.2 / 3) < 1e-9 && metResi.resolvable,
    detail: `σ_DNA-PAINT=${metResi.crlbNm.toFixed(2)} nm -> σ_RESI(K=9)=${metResi.resiNm.toFixed(3)} nm`,
    tier: 'exact-algebra',
  });

  const allPoolsConserved = BOUTON_PRESETS.every(
    (p) => p.rrpMax + p.recyclingMax + p.reserveMax === p.totalVesicles
  );
  checks.push({
    id: 'V08',
    name: 'Vesicle Pool Conservation Across Rat & Human L1/L4/L5 Presets',
    passed: allPoolsConserved && CONSTANTS.RRP_MAX + CONSTANTS.RECYCLING_MAX + CONSTANTS.RESERVE_MAX === 374,
    detail: `Rat=374, Human L1=3500, L4=1800, L5=1500 conserved`,
    tier: 'exact-algebra',
  });

  const ec = computeElectrochemistry({
    naOutMm: 145,
    naInMm: 12,
    kOutMm: 4,
    kInMm: 140,
    caOutMm: 2,
    caInUm: 0.08,
    clOutMm: 120,
    clInMm: 9,
    pNaRel: 0.04,
    pClRel: 0.45,
    tempC: 37,
  });
  checks.push({
    id: 'V09',
    name: 'Nernst & GHK Resting Potential Physiology (37°C)',
    passed: ec.eKMv < -90 && ec.eNaMv > 60 && ec.eCaMv > 125 && ec.vmGhkMv > -82 && ec.vmGhkMv < -62,
    detail: `E_K=${ec.eKMv.toFixed(1)}, E_Na=+${ec.eNaMv.toFixed(1)}, E_Ca=+${ec.eCaMv.toFixed(1)}, V_GHK=${ec.vmGhkMv.toFixed(1)} mV`,
    tier: 'exact-algebra',
  });

  const snareClamped = computeSnareThermodynamics({ snareCount: 3, clampEnergyKbt: 15, syt1CaBound: 0, tempC: 37 });
  const snareTriggered = computeSnareThermodynamics({ snareCount: 4, clampEnergyKbt: 15, syt1CaBound: 5, tempC: 37 });
  checks.push({
    id: 'V10',
    name: 'SNARE Zippering & Syt1 (5 Ca²⁺) Clamp Release Switch',
    passed: snareClamped.fusionDelayMs > 100 && snareTriggered.fusionDelayMs < 1.5,
    detail: `0 Ca²⁺: ${snareClamped.fusionDelayMs.toFixed(0)} ms vs 5 Ca²⁺: ${snareTriggered.fusionDelayMs.toFixed(2)} ms`,
    tier: 'biophysical-bound',
  });

  const bio = computeBioenergetics({
    luminalPh: 5.5,
    cytosolicPh: 7.2,
    deltaPsiMv: 40,
    firingRateHz: 10,
    mitoActive: true,
    tempC: 37,
  });
  checks.push({
    id: 'V11',
    name: 'V-ATPase Proton Motive Force & Local ATP Sustainability',
    passed: bio.pmfMv > 135 && bio.pmfMv < 155 && bio.estGluQuanta >= 2800 && bio.sustainSeconds === Infinity,
    detail: `PMF=${bio.pmfMv.toFixed(1)} mV (ΔpH=${bio.deltaPh.toFixed(1)}), Quanta≈${bio.estGluQuanta}`,
    tier: 'biophysical-bound',
  });

  const kin = computeKinesinTransport(85, 8.0);
  checks.push({
    id: 'V12',
    name: 'Kinesin-1 Processive Velocity & 125,000 ATP/mm Scaling',
    passed: kin.velocityNmPerSec === 680 && kin.atpPerMm === 125000 && kin.transitDaysPerMeter > 16.5 && kin.transitDaysPerMeter < 17.5,
    detail: `v=${kin.velocityNmPerSec} nm/s, ${kin.atpPerMm} ATP/mm, ${kin.transitDaysPerMeter.toFixed(2)} days/m`,
    tier: 'exact-algebra',
  });

  const hhSpike = solveHodgkinHuxleyRK4({ iInjUaCm2: 15, gNaMsCm2: 120, gKMsCm2: 36, tempC: 6.3, durationMs: 20 });
  const hhSub = solveHodgkinHuxleyRK4({ iInjUaCm2: 1, gNaMsCm2: 120, gKMsCm2: 36, tempC: 6.3, durationMs: 20 });
  checks.push({
    id: 'V13',
    name: 'Hodgkin-Huxley 4D RK4 Action Potential Threshold',
    passed: hhSpike.spiked && !hhSub.spiked && hhSpike.peakVmMv > 25,
    detail: `I=15 -> peak=${hhSpike.peakVmMv.toFixed(1)} mV (spiked); I=1 -> peak=${hhSub.peakVmMv.toFixed(1)} mV`,
    tier: 'numerical_approximation',
  });

  const mgRest = computeNmdaMgUnblock(-70, 1.0);
  const mgDepol = computeNmdaMgUnblock(+20, 1.0);
  checks.push({
    id: 'V14',
    name: 'NMDAR Voltage-Dependent Mg²⁺ Coincidence Switch',
    passed: mgRest < 0.05 && mgDepol > 0.9,
    detail: `B(-70mV)=${mgRest.toFixed(4)} (blocked) vs B(+20mV)=${mgDepol.toFixed(4)} (unblocked)`,
    tier: 'biophysical-bound',
  });

  const ei = computeEiBalance({ gExcNs: 3.0, gInhNs: 4.0, clInMm: 7.0, clOutMm: 125.0, tempC: 37 });
  checks.push({
    id: 'V15',
    name: 'Mature KCC2 GABAergic Shunting Inhibition Attenuation',
    passed: ei.eClMv < -72 && ei.shuntingRatio < 0.65 && ei.gabaPolarity === 'Hyperpolarizing (Mature KCC2)',
    detail: `E_Cl=${ei.eClMv.toFixed(1)} mV, V_∞=${ei.vSteadyMv.toFixed(1)} mV, ratio=${ei.shuntingRatio.toFixed(3)}`,
    tier: 'exact-algebra',
  });

  const r1 = createSeededRng(20261123);
  const r2 = createSeededRng(20261123);
  const seq1 = Array.from({ length: 32 }, () => r1.next().toFixed(12)).join(',');
  const seq2 = Array.from({ length: 32 }, () => r2.next().toFixed(12)).join(',');
  checks.push({
    id: 'V16',
    name: 'Deterministic PRNG Seed Replay Invariance (B03)',
    passed: fnv1aHex(seq1) === fnv1aHex(seq2),
    detail: `seed=20261123 digest=${fnv1aHex(seq1)}`,
    tier: 'determinism',
  });

  return checks;
}
