// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  BOUTON_PRESETS,
  BiophysicsValidationError,
  CLASSIFIED_FINDINGS,
  CONSTANTS,
  OPEN_HARD_PROBLEMS,
  TraceParseError,
  analyzeExperimentalTrace,
  classifyEndocytosisMode,
  computeBioenergetics,
  computeCleftGluPeakMm,
  computeEffectivePharmacology,
  computeEiBalance,
  computeElectrochemistry,
  computeKinesinTransport,
  computeLocalCaPeakUm,
  computeMetrology,
  computeNmdaMgUnblock,
  computePeakEpscPa,
  computeReleaseProbability,
  computeSnareEnergyProfile,
  computeSnareThermodynamics,
  computeThermalEnergyPnNm,
  createSeededRng,
  fnv1aHex,
  runVerificationSuite,
  simulateTsodyksMarkram,
  solveHodgkinHuxleyRK4,
} from '../src/index.js';

describe('Verification Suite & Falsifiable Claims (B05)', () => {
  it('passes all 16 biophysical self-verification checks', () => {
    const results = runVerificationSuite();
    expect(results.length).toBe(16);
    for (const check of results) {
      expect(check.passed, `${check.id} (${check.name}): ${check.detail}`).toBe(true);
    }
  });

  it('covers all 11 requested scientific disciplines in OPEN_HARD_PROBLEMS', () => {
    const required = [
      'Math',
      'Physics',
      'Chemistry',
      'Biology',
      'Neuroscience',
      'Neuropsychology',
      'NeuroCS',
      'NeuroMath',
      'Neurochemistry',
      'Neurobiology',
      'Neurophysics',
    ];
    const present = new Set(OPEN_HARD_PROBLEMS.map((p) => p.discipline));
    for (const d of required) {
      expect(present.has(d as (typeof OPEN_HARD_PROBLEMS)[number]['discipline']), `Missing discipline ${d}`).toBe(true);
    }
  });
});

describe('Negative Boundary Tests (B06)', () => {
  it('rejects non-finite and out-of-domain biophysical inputs loudly', () => {
    expect(() => computeThermalEnergyPnNm(-300)).toThrow(BiophysicsValidationError);
    expect(() => computeThermalEnergyPnNm(Number.NaN)).toThrow(BiophysicsValidationError);
    expect(() => computeLocalCaPeakUm(-1, 20)).toThrow(BiophysicsValidationError);
    expect(() => computeLocalCaPeakUm(2, 0)).toThrow(BiophysicsValidationError);
    expect(() => computeReleaseProbability(-0.01)).toThrow(BiophysicsValidationError);
    expect(() => computeCleftGluPeakMm(-1, 22, 0)).toThrow(BiophysicsValidationError);
    expect(() => computePeakEpscPa(-0.5, 37)).toThrow(BiophysicsValidationError);
    expect(() => computeNmdaMgUnblock(-70, -1)).toThrow(BiophysicsValidationError);
    expect(() =>
      simulateTsodyksMarkram({ pulseTimesMs: [0, 20], u0: 1.5, tauRecMs: 300, tauFacilMs: 50 })
    ).toThrow(BiophysicsValidationError);
    expect(() =>
      computeMetrology({
        photons: 0,
        psfSigmaNm: 110,
        imagerConcNm: 2,
        kOn: 2,
        kOff: 5,
        spacingNm: 3,
        resiSubsetsK: 9,
      })
    ).toThrow(BiophysicsValidationError);
  });

  it('rejects empty, malformed JSON, too-short, and oversized trace payloads', () => {
    expect(() => analyzeExperimentalTrace('')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('   \n  ')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('{invalid-json')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('{"notData": 123}')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('0,1\n1,2')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('0,-2\n5,-15\n2,-30\n6,-4')).toThrow(TraceParseError);
    expect(() => analyzeExperimentalTrace('0,1\n'.repeat(600_000))).toThrow(TraceParseError);
  });
});

describe('Regression Tests for Refactored Defects (B07)', () => {
  it('regression F02: deterministic seeded PRNG replays bit-identical sequences', () => {
    const a = createSeededRng(1000);
    const b = createSeededRng(1000);
    const outA = Array.from({ length: 128 }, () => a.next()).join(',');
    const outB = Array.from({ length: 128 }, () => b.next()).join(',');
    expect(fnv1aHex(outA)).toBe(fnv1aHex(outB));
  });

  it('regression F03: Human L1/L4/L5 presets conserve total vesicles distinctly from rat Wilhelm 2014', () => {
    const rat = BOUTON_PRESETS.find((p) => p.id === 'rat_wilhelm_2014');
    const humanL1 = BOUTON_PRESETS.find((p) => p.id === 'human_l1_elife_2024');
    expect(rat?.totalVesicles).toBe(374);
    expect(humanL1?.totalVesicles).toBe(3500);
    for (const preset of BOUTON_PRESETS) {
      expect(preset.rrpMax + preset.recyclingMax + preset.reserveMax).toBe(preset.totalVesicles);
    }
  });
});

describe('Property-Based Tests (B10, 1000+ cases per invariant)', () => {
  it('Hill n=4 release probability is strictly bounded in [0, 1) and monotone', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 500, noNaN: true }),
        fc.double({ min: 0.001, max: 500, noNaN: true }),
        (c, delta) => {
          const p1 = computeReleaseProbability(c);
          const p2 = computeReleaseProbability(c + delta);
          expect(p1).toBeGreaterThanOrEqual(0);
          expect(p1).toBeLessThan(1);
          expect(p2).toBeGreaterThanOrEqual(p1);
        }
      ),
      { numRuns: 1200 }
    );
  });

  it('Mature KCC2 E/I balance always attenuates excitatory depolarization (shunting)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 50, noNaN: true }),
        fc.double({ min: 0.1, max: 50, noNaN: true }),
        (gExc, gInh) => {
          const res = computeEiBalance({
            gExcNs: gExc,
            gInhNs: gInh,
            clInMm: 7.0,
            clOutMm: 125.0,
            tempC: 37,
          });
          expect(res.vSteadyMv).toBeGreaterThanOrEqual(res.eClMv - 1e-9);
          expect(res.vSteadyMv).toBeLessThanOrEqual(0 + 1e-9);
          expect(res.shuntingRatio).toBeLessThan(1.0);
        }
      ),
      { numRuns: 1200 }
    );
  });

  it('SNARE barrier is monotonically non-increasing in bound Syt1 Ca2+ and SNAREpin count', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 0, max: 4 }),
        fc.double({ min: 0, max: 25, noNaN: true }),
        (nSnare, nCa, clamp) => {
          const b0 = computeSnareThermodynamics({ snareCount: nSnare, clampEnergyKbt: clamp, syt1CaBound: nCa, tempC: 37 });
          const bCa = computeSnareThermodynamics({ snareCount: nSnare, clampEnergyKbt: clamp, syt1CaBound: nCa + 1, tempC: 37 });
          const bN = computeSnareThermodynamics({ snareCount: nSnare + 1, clampEnergyKbt: clamp, syt1CaBound: nCa, tempC: 37 });
          expect(bCa.effectiveBarrierKbt).toBeLessThanOrEqual(b0.effectiveBarrierKbt + 1e-12);
          expect(bN.effectiveBarrierKbt).toBeLessThanOrEqual(b0.effectiveBarrierKbt + 1e-12);
        }
      ),
      { numRuns: 1200 }
    );
  });
});

describe('Metamorphic & Golden Tests (B08, B14)', () => {
  it('metamorphic scaling: doubling fused vesicles doubles cleft peak glutamate identically', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.double({ min: 12, max: 40, noNaN: true }),
        fc.double({ min: 0, max: 120, noNaN: true }),
        (ves, cleft, offset) => {
          const g1 = computeCleftGluPeakMm(ves, cleft, offset);
          const g2 = computeCleftGluPeakMm(ves * 2, cleft, offset);
          expect(g2).toBeCloseTo(2 * g1, 10);
        }
      ),
      { numRuns: 500 }
    );
  });

  it('metamorphic scaling: increasing RESI subsets K strictly decreases resiNm', () => {
    const base = computeMetrology({ photons: 2500, psfSigmaNm: 110, imagerConcNm: 2, kOn: 2, kOff: 5, spacingNm: 3, resiSubsetsK: 1 });
    const k4 = computeMetrology({ photons: 2500, psfSigmaNm: 110, imagerConcNm: 2, kOn: 2, kOff: 5, spacingNm: 3, resiSubsetsK: 4 });
    expect(k4.resiNm).toBeCloseTo(base.resiNm / 2, 12);
  });

  it('golden baseline values match exact scientific specifications', () => {
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
    expect(ec.rtOverFMv).toBeCloseTo(26.7266, 3);
    expect(ec.eNaMv).toBeCloseTo(66.5982, 3);
    expect(ec.eKMv).toBeCloseTo(-95.0229, 3);
    expect(ec.vmGhkMv).toBeCloseTo(-70.613, 3);

    const kin = computeKinesinTransport();
    expect(kin.atpPerMm).toBe(125000);
    expect(kin.velocityNmPerSec).toBe(680);

    const pharm = computeEffectivePharmacology(0.5, -30, 'bonta');
    expect(pharm.effectivePr).toBeCloseTo(0.01, 6);

    const profile = computeSnareEnergyProfile({ snareCount: 4, clampEnergyKbt: 15, syt1CaBound: 5, tempC: 37 });
    expect(profile.length).toBe(5);

    const stp = simulateTsodyksMarkram({ pulseTimesMs: [0, 20, 40, 60], u0: 0.4, tauRecMs: 300, tauFacilMs: 50 });
    expect(stp.length).toBe(4);
    expect(stp[0].effectiveRelease).toBeCloseTo(0.4, 6);

    const trace = analyzeExperimentalTrace('0,-2\n1,-2.1\n2,-2.0\n3,-15\n4,-32\n5,-22\n6,-10\n7,-3');
    expect(trace.count).toBe(8);
    expect(trace.peakValue).toBe(-32);
    expect(trace.snr).toBeGreaterThan(50);

    const hh = solveHodgkinHuxleyRK4({ iInjUaCm2: 15, gNaMsCm2: 120, gKMsCm2: 36, tempC: 6.3, durationMs: 20 });
    expect(hh.classification).toBe('numerical_approximation');
    expect(hh.spiked).toBe(true);

    expect(classifyEndocytosisMode(37)).toContain('Ultrafast');
    expect(CONSTANTS.DEBYE_LENGTH_NM).toBe(0.79);
  });

  it('canonical F01-F11 findings ledger covers all 11 IDs and all 10 Build Standard v1.2.0 classes', () => {
    const ids = CLASSIFIED_FINDINGS.map((f) => f.id);
    expect(ids).toEqual(['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10', 'F11']);
    const classes = new Set(CLASSIFIED_FINDINGS.map((f) => f.findingClass));
    expect(classes).toEqual(
      new Set(['bug', 'error', 'issue', 'problem', 'concern', 'dilemma', 'conflict', 'gap', 'hole', 'blindspot'])
    );
  });

  it('Lean 4.35.0 exported vectors (ExportVectors.lean) match @synapse/core outputs (F38)', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const vecPath = resolve(here, '../../../data/lean_engine_vectors.json');
    const vectors = JSON.parse(readFileSync(vecPath, 'utf-8')) as {
      hill4: Array<{ c: number; kd: number; num: number; den: number }>;
      snare: Array<{ nSnare: number; nCa: number; clampTenth: number; zipTenth: number; effBarrier50: number }>;
      tsodyks_markram: Array<{ scale: number; u: number; u0: number; x: number; uPlus: number; effRel: number }>;
      atp_mean_rate: Array<{ a0: number; bLeak: number; f: number; cAp: number; sAtp: number; t: number; remaining: number }>;
    };

    for (const row of vectors.hill4) {
      expect(computeReleaseProbability(row.c)).toBeCloseTo(row.num / row.den, 12);
    }
    for (const row of vectors.snare) {
      const res = computeSnareThermodynamics({
        snareCount: row.nSnare,
        clampEnergyKbt: row.clampTenth / 10,
        syt1CaBound: row.nCa,
        tempC: 37,
      });
      expect(res.totalZipKbt).toBeCloseTo(row.zipTenth / 10, 12);
      expect(res.effectiveBarrierKbt).toBeCloseTo(row.effBarrier50 / 50, 12);
    }
    const tmFirst = vectors.tsodyks_markram[0];
    const stp = simulateTsodyksMarkram({
      pulseTimesMs: [0],
      u0: tmFirst.u0 / tmFirst.scale,
      tauRecMs: 300,
      tauFacilMs: 50,
    });
    expect(stp[0].u).toBeCloseTo(tmFirst.uPlus / tmFirst.scale, 12);
    expect(stp[0].effectiveRelease).toBeCloseTo(tmFirst.effRel / tmFirst.scale, 12);

    const h3Row = vectors.atp_mean_rate.find((r) => r.f === 40 && r.sAtp === 950000 && r.t === 3);
    expect(h3Row?.remaining).toBe(0);
    const bio40 = computeBioenergetics({
      luminalPh: 5.5,
      cytosolicPh: 7.2,
      deltaPsiMv: 40,
      firingRateHz: 40,
      mitoActive: true,
      tempC: 37,
    });
    expect(bio40.atpBurnPerSec).toBe(4000 + 40 * 32000);
    expect(bio40.atpSynthPerSec).toBe(950000);
    expect(Math.ceil(bio40.sustainSeconds)).toBe(3);
  });
});
