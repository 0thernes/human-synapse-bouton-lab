// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

export class TraceParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TraceParseError';
  }
}

export interface TraceAnalysisResult {
  count: number;
  baseline: number;
  peakValue: number;
  timeToPeakMs: number;
  rise10To90Ms: number;
  chargeFc: number;
  snr: number;
  times: number[];
  values: number[];
}

const MAX_TRACE_BYTES = 2_000_000; // 2 MB DoS guard (Build Standard B06 / B36)

/**
 * Parse CSV or JSON experimental electrophysiology trace and compute quantitative metrics.
 * Hardened against empty input, malformed JSON, oversized payloads, and non-monotonic / <3 point traces.
 */
export function analyzeExperimentalTrace(rawText: string): TraceAnalysisResult {
  if (typeof rawText !== 'string' || rawText.trim().length === 0) {
    throw new TraceParseError('Input trace is empty');
  }
  if (rawText.length > MAX_TRACE_BYTES) {
    throw new TraceParseError(`Input trace exceeds maximum size (${MAX_TRACE_BYTES} bytes)`);
  }

  const times: number[] = [];
  const values: number[] = [];
  const trimmed = rawText.trim();

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      throw new TraceParseError(`Malformed JSON trace: ${(err as Error).message}`);
    }
    const arr = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === 'object' && Array.isArray((parsed as { data?: unknown }).data)
        ? ((parsed as { data: unknown[] }).data)
        : null;
    if (!arr) {
      throw new TraceParseError('JSON trace must be an array or an object with a numeric "data" array');
    }
    for (const row of arr) {
      if (row && typeof row === 'object') {
        const rec = row as Record<string, unknown>;
        const arrRow = Array.isArray(row) ? row : null;
        const t = Number(arrRow ? arrRow[0] : (rec.t ?? rec.time ?? rec.time_ms));
        const v = Number(arrRow ? arrRow[1] : (rec.v ?? rec.value ?? rec.epsc));
        if (Number.isFinite(t) && Number.isFinite(v)) {
          times.push(t);
          values.push(v);
        }
      }
    }
  } else {
    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) continue;
      const parts = clean.split(/[,;\t]+/).map((s) => s.trim());
      if (parts.length >= 2) {
        const t = Number(parts[0]);
        const v = Number(parts[1]);
        if (Number.isFinite(t) && Number.isFinite(v)) {
          times.push(t);
          values.push(v);
        }
      }
    }
  }

  if (times.length < 3) {
    throw new TraceParseError(`At least 3 valid numeric (time, value) samples are required; found ${times.length}`);
  }

  const baseN = Math.max(2, Math.floor(times.length * 0.12));
  let baseSum = 0;
  for (let i = 0; i < baseN; i++) baseSum += values[i];
  const baseline = baseSum / baseN;

  let noiseVar = 0;
  for (let i = 0; i < baseN; i++) noiseVar += Math.pow(values[i] - baseline, 2);
  const noiseStd = Math.sqrt(noiseVar / Math.max(1, baseN - 1));

  let peakIdx = 0;
  let maxAbs = -1;
  for (let i = 0; i < values.length; i++) {
    const dev = Math.abs(values[i] - baseline);
    if (dev > maxAbs) {
      maxAbs = dev;
      peakIdx = i;
    }
  }
  const peakValue = values[peakIdx];
  const peakDelta = peakValue - baseline;
  const timeToPeakMs = times[peakIdx] - times[0];

  let t10 = times[0];
  let t90 = times[peakIdx];
  let found10 = false;
  for (let i = 0; i <= peakIdx; i++) {
    const frac = Math.abs(peakDelta) > 1e-9 ? (values[i] - baseline) / peakDelta : 0;
    if (!found10 && frac >= 0.1) {
      t10 = times[i];
      found10 = true;
    }
    if (frac >= 0.9) {
      t90 = times[i];
      break;
    }
  }
  const rise10To90Ms = Math.max(0, t90 - t10);

  let area = 0;
  for (let i = 1; i < times.length; i++) {
    area += 0.5 * ((values[i - 1] - baseline) + (values[i] - baseline)) * (times[i] - times[i - 1]);
  }
  const snr = noiseStd > 1e-6 ? Math.abs(peakDelta) / noiseStd : Math.abs(peakDelta) > 0 ? 999 : 0;

  return {
    count: times.length,
    baseline,
    peakValue,
    timeToPeakMs,
    rise10To90Ms,
    chargeFc: area,
    snr,
    times,
    values,
  };
}
