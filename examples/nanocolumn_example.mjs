// SPDX-License-Identifier: Apache-2.0
// Runnable example: Trans-synaptic nanocolumn alignment & Hill n=4 release gain.
// Run: node examples/nanocolumn_example.mjs

import {
  computeCleftGluPeakMm,
  computeLocalCaPeakUm,
  computePeakEpscPa,
  computeReleaseProbability,
  computeSnareThermodynamics,
} from '../packages/synapse-core/dist/index.js';

const ca17 = computeLocalCaPeakUm(2.0, 17);
const ca60 = computeLocalCaPeakUm(2.0, 60);
const pr17 = computeReleaseProbability(ca17);
const pr60 = computeReleaseProbability(ca60);

const gluAligned = computeCleftGluPeakMm(1, 22, 0);
const gluOffset80 = computeCleftGluPeakMm(1, 22, 80);
const epscAligned = computePeakEpscPa(gluAligned, 37);
const epscOffset80 = computePeakEpscPa(gluOffset80, 37);
const snareSync = computeSnareThermodynamics({ snareCount: 4, clampEnergyKbt: 15, syt1CaBound: 5, tempC: 37 });

console.log(
  JSON.stringify(
    {
      nanodomain_17nm: { ca_um: Number(ca17.toFixed(2)), pr: Number(pr17.toFixed(4)) },
      microdomain_60nm: { ca_um: Number(ca60.toFixed(2)), pr: Number(pr60.toFixed(4)) },
      aligned_0nm: { glu_mm: Number(gluAligned.toFixed(3)), epsc_pa: Number(epscAligned.toFixed(2)) },
      misaligned_80nm: { glu_mm: Number(gluOffset80.toFixed(3)), epsc_pa: Number(epscOffset80.toFixed(2)) },
      snare_5ca: { barrier_kbt: Number(snareSync.effectiveBarrierKbt.toFixed(2)), delay_ms: Number(snareSync.fusionDelayMs.toFixed(3)) },
    },
    null,
    2
  )
);
