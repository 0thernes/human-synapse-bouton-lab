// SPDX-License-Identifier: Apache-2.0
// Honest TypeScript benchmark (Build Standard B26): warmup + 10 runs + median + IQR + checksum.
import { performance } from 'node:perf_hooks';
import {
  computeCleftGluPeakMm,
  computeLocalCaPeakUm,
  computePeakEpscPa,
  computeReleaseProbability,
  createSeededRng,
} from '../dist/index.js';

function runWorkload(seed, nAps) {
  const rng = createSeededRng(seed);
  const baseCa = computeLocalCaPeakUm(2.0, 17.0);
  let rrp = 12;
  let released = 0;
  let sumAbsEpsc = 0;
  for (let i = 0; i < nAps; i++) {
    const ca = baseCa * (0.88 + 0.24 * rng.next());
    const pr = computeReleaseProbability(ca);
    let fused = 0;
    const slots = Math.min(rrp, 4);
    for (let s = 0; s < slots; s++) {
      if (rng.next() < Math.min(0.98, pr * 0.45)) fused++;
    }
    if (fused > 0) {
      released++;
      rrp = Math.max(0, rrp - fused);
      const offset = Math.max(0, (rng.next() - 0.5) * 16.0);
      const glu = computeCleftGluPeakMm(fused, 22.0, offset);
      sumAbsEpsc += Math.abs(computePeakEpscPa(glu, 37.0));
    }
    if (rrp < 12 && rng.next() < 0.72) rrp++;
  }
  return released > 0 ? sumAbsEpsc / released : 0;
}

for (let w = 0; w < 3; w++) runWorkload(1000, 5000);
const times = [];
let checksum = 0;
for (let r = 0; r < 10; r++) {
  const t0 = performance.now();
  checksum += runWorkload(1000 + r, 5000);
  times.push(performance.now() - t0);
}
times.sort((a, b) => a - b);
const median = (times[4] + times[5]) / 2;
const iqr = times[7] - times[2];
console.log(
  JSON.stringify(
    {
      runtime: `Node ${process.version}`,
      workload: '5000_action_potentials_x_10_runs',
      runs: 10,
      median_ms: Number(median.toFixed(4)),
      iqr_ms: Number(iqr.toFixed(4)),
      min_ms: Number(times[0].toFixed(4)),
      max_ms: Number(times[9].toFixed(4)),
      checksum: Number(checksum.toFixed(6)),
      raw_ms: times.map((t) => Number(t.toFixed(4))),
    },
    null,
    2
  )
);
