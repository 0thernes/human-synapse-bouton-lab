// SPDX-License-Identifier: Apache-2.0
// Cross-language differential test harness CLI (reads JSON test cases from stdin, writes JSON to stdout).
import {
  computeCleftGluPeakMm,
  computeEiBalance,
  computeLocalCaPeakUm,
  computePeakEpscPa,
  computeReleaseProbability,
  computeSnareThermodynamics,
} from '../dist/index.js';

const chunks = [];
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}
const cases = JSON.parse(Buffer.concat(chunks).toString('utf8'));
const out = cases.map((c) => {
  const ca_peak_um = computeLocalCaPeakUm(c.ca_ext_mm, c.coupling_nm);
  const pr = computeReleaseProbability(ca_peak_um);
  const glu_mm = computeCleftGluPeakMm(1.0, c.cleft_width_nm, c.offset_nm);
  const epsc_pa = computePeakEpscPa(glu_mm, c.temp_c);
  const ei = computeEiBalance({
    gExcNs: c.g_exc_ns,
    gInhNs: c.g_inh_ns,
    clInMm: 7.0,
    clOutMm: 125.0,
    tempC: c.temp_c,
  });
  const snare = computeSnareThermodynamics({
    snareCount: c.n_snare,
    clampEnergyKbt: 15.0,
    syt1CaBound: c.n_ca,
    tempC: c.temp_c,
  });
  return {
    ca_peak_um,
    pr,
    glu_mm,
    epsc_pa,
    v_steady_mv: ei.vSteadyMv,
    snare_barrier_kbt: snare.effectiveBarrierKbt,
  };
});
process.stdout.write(JSON.stringify(out));
