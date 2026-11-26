// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import { BiophysicsValidationError, assertFinite, assertNonNegative, assertPositive } from './electrophysiology.js';

export interface HodgkinHuxleyInput {
  iInjUaCm2: number;
  gNaMsCm2: number;
  gKMsCm2: number;
  tempC: number;
  durationMs: number;
}

export interface HodgkinHuxleyResult {
  timesMs: number[];
  vmMv: number[];
  mGate: number[];
  hGate: number[];
  nGate: number[];
  peakVmMv: number;
  spiked: boolean;
  classification: 'numerical_approximation';
}

export interface TsodyksMarkramInput {
  pulseTimesMs: number[];
  u0: number; // baseline utilization of synaptic efficacy (0..1)
  tauRecMs: number; // recovery time constant from depression (ms)
  tauFacilMs: number; // facilitation decay time constant (ms)
}

export interface TsodyksMarkramStep {
  timeMs: number;
  u: number;
  x: number;
  effectiveRelease: number;
}

/**
 * 4th-order Runge-Kutta (RK4) solver for the coupled Hodgkin-Huxley ODEs (V, m, h, n).
 * Explicitly tagged `numerical_approximation` (IEEE-754 float64 fixed-step RK4, dt = 0.05 ms).
 */
export function solveHodgkinHuxleyRK4(inp: HodgkinHuxleyInput): HodgkinHuxleyResult {
  assertFinite(inp.iInjUaCm2, 'iInjUaCm2');
  assertNonNegative(inp.gNaMsCm2, 'gNaMsCm2');
  assertNonNegative(inp.gKMsCm2, 'gKMsCm2');
  assertFinite(inp.tempC, 'tempC');
  assertPositive(inp.durationMs, 'durationMs');

  const dt = 0.05;
  const steps = Math.min(800, Math.max(40, Math.round(inp.durationMs / dt)));
  const phi = Math.pow(3.0, (inp.tempC - 6.3) / 10);
  const cm = 1.0;
  const gL = 0.3;
  const eNa = 50.0;
  const eK = -77.0;
  const eL = -54.387;

  const am = (v: number): number =>
    Math.abs(v + 40) < 1e-4 ? 1.0 : (0.1 * (v + 40)) / (1 - Math.exp(-(v + 40) / 10));
  const bm = (v: number): number => 4.0 * Math.exp(-(v + 65) / 18);
  const ah = (v: number): number => 0.07 * Math.exp(-(v + 65) / 20);
  const bh = (v: number): number => 1.0 / (1 + Math.exp(-(v + 35) / 10));
  const an = (v: number): number =>
    Math.abs(v + 55) < 1e-4 ? 0.1 : (0.01 * (v + 55)) / (1 - Math.exp(-(v + 55) / 10));
  const bn = (v: number): number => 0.125 * Math.exp(-(v + 65) / 80);

  let V = -65.0;
  let m = am(V) / (am(V) + bm(V));
  let h = ah(V) / (ah(V) + bh(V));
  let n = an(V) / (an(V) + bn(V));

  const deriv = (
    v: number,
    mv: number,
    hv: number,
    nv: number,
    t: number
  ): [number, number, number, number] => {
    const iApp = t >= 2.0 && t <= 4.0 ? inp.iInjUaCm2 : 0.0;
    const iNa = inp.gNaMsCm2 * Math.pow(mv, 3) * hv * (v - eNa);
    const iK = inp.gKMsCm2 * Math.pow(nv, 4) * (v - eK);
    const iL = gL * (v - eL);
    return [
      (iApp - iNa - iK - iL) / cm,
      phi * (am(v) * (1 - mv) - bm(v) * mv),
      phi * (ah(v) * (1 - hv) - bh(v) * hv),
      phi * (an(v) * (1 - nv) - bn(v) * nv),
    ];
  };

  const timesMs: number[] = [];
  const vmMv: number[] = [];
  const mGate: number[] = [];
  const hGate: number[] = [];
  const nGate: number[] = [];
  let peakVmMv = V;

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    if (i % 2 === 0) {
      timesMs.push(Number(t.toFixed(2)));
      vmMv.push(Number(V.toFixed(2)));
      mGate.push(Number(m.toFixed(3)));
      hGate.push(Number(h.toFixed(3)));
      nGate.push(Number(n.toFixed(3)));
    }
    if (V > peakVmMv) peakVmMv = V;
    const k1 = deriv(V, m, h, n, t);
    const k2 = deriv(
      V + 0.5 * dt * k1[0],
      m + 0.5 * dt * k1[1],
      h + 0.5 * dt * k1[2],
      n + 0.5 * dt * k1[3],
      t + 0.5 * dt
    );
    const k3 = deriv(
      V + 0.5 * dt * k2[0],
      m + 0.5 * dt * k2[1],
      h + 0.5 * dt * k2[2],
      n + 0.5 * dt * k2[3],
      t + 0.5 * dt
    );
    const k4 = deriv(
      V + dt * k3[0],
      m + dt * k3[1],
      h + dt * k3[2],
      n + dt * k3[3],
      t + dt
    );
    V += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    m += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    h += (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    n += (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
  }
  return {
    timesMs,
    vmMv,
    mGate,
    hGate,
    nGate,
    peakVmMv,
    spiked: peakVmMv > 15,
    classification: 'numerical_approximation',
  };
}

/** Jahr & Stevens (1990) NMDAR voltage-dependent Mg2+ unblock fraction. */
export function computeNmdaMgUnblock(vPostMv: number, mgExtMm: number): number {
  assertFinite(vPostMv, 'vPostMv');
  assertNonNegative(mgExtMm, 'mgExtMm');
  return 1.0 / (1.0 + (mgExtMm / 3.57) * Math.exp(-0.062 * vPostMv));
}

/** Deterministic Tsodyks-Markram (1997) short-term synaptic plasticity recurrence. */
export function simulateTsodyksMarkram(inp: TsodyksMarkramInput): TsodyksMarkramStep[] {
  assertPositive(inp.u0, 'u0');
  if (inp.u0 > 1) {
    throw new BiophysicsValidationError(`u0 must be <= 1 (received ${inp.u0})`);
  }
  assertPositive(inp.tauRecMs, 'tauRecMs');
  assertPositive(inp.tauFacilMs, 'tauFacilMs');

  const out: TsodyksMarkramStep[] = [];
  let u = 0;
  let x = 1.0;
  let prevT = inp.pulseTimesMs.length > 0 ? inp.pulseTimesMs[0] : 0;

  for (let i = 0; i < inp.pulseTimesMs.length; i++) {
    const t = assertFinite(inp.pulseTimesMs[i], `pulseTimesMs[${i}]`);
    const dt = Math.max(0, t - prevT);
    if (i > 0) {
      u = u * Math.exp(-dt / inp.tauFacilMs);
      x = 1.0 - (1.0 - x) * Math.exp(-dt / inp.tauRecMs);
    }
    const uPlus = u + inp.u0 * (1.0 - u);
    const effectiveRelease = uPlus * x;
    out.push({ timeMs: t, u: uPlus, x, effectiveRelease });
    u = uPlus;
    x = Math.max(0, x - effectiveRelease);
    prevT = t;
  }
  return out;
}
