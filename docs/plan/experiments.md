# Experiment Log (`experiments.md`)

Prepared per Build Pipeline Models v1.0.0 (`P11.04`). Detailed protocol and raw seed datasets live in [`PREREGISTRATION.md`](../../PREREGISTRATION.md), [`DEVIATIONS.md`](../../DEVIATIONS.md), and `data/experiments/`.

| Exp ID | Pre-Registered? | Hypothesis | Raw Result (`N=30` seeds/arm, 10k perm, 10k bootstrap) | Decision / Action |
|---|---|---|---|---|
| **H1** | Yes (`a1919f2`) | Aligned (`0 nm`) trans-synaptic nanocolumn produces higher peak `\|EPSC\|` than `80 nm` offset. | `33.81` vs. `12.28 pA` (`delta = +21.53 pA`, 95% CI `[21.42, 21.63]`, Cliff's delta `+1.00`, `p_Holm = 0.0005`). | **Confirmed (`C03`).** Published in WP1 §5. |
| **H2** | Yes (`a1919f2`) | Tight `17 nm` `Ca2+` nanodomain produces higher `P_r` than `60 nm` microdomain. | `0.569` vs. `0.0007` (`delta = +0.568`, 95% CI `[0.560, 0.577]`, Cliff's delta `+1.00`, `p_Holm = 0.0005`). | **Confirmed (`C04`).** Published in WP1 §5. |
| **H3** | Yes (`a1919f2`) | Mitochondria sustain `> 90%` ATP over `60 s` at `40 Hz` vs. glycolysis `< 50%`. | Both arms depleted to `0.0` (`p_Holm = 1.0000`, Cliff's delta `0.00`); `40 Hz > f_crit,mito = 29.5625 Hz`. | **Prediction fails in the fixed-parameter simulator** (constants set after registration; `C05`, `ERRATA.md`). Preserved verbatim; zero silent edits. |
| **H4** | Yes (`a1919f2`) | Disjoint seed cohorts (`1000..1029` vs. `2000..2029`) show no spurious bias (null control). | `delta = +0.024 pA`, 95% CI `[-0.045, +0.091]`, `p_Holm = 0.9963`. | **Null Passed (`C06`).** Confirms unbiased `ChaCha8Rng` seeding. |
| **H3b** | **No** (Exploratory post-hoc, logged in `DEVIATIONS.md`) | At `20 Hz` (`< 29.5625 Hz`), mitochondria sustain `100%` ATP while glycolysis depletes. | `1.00` vs. `0.00` (`Cliff's delta = +1.00`, `p_Holm = 0.0005`). | **Exploratory Confirmed (`C07`).** Clearly labeled post-hoc in WP1 & `DEVIATIONS.md`. |
| **BENCH-1** | Yes (B18) | Rust `synapse-sim` outperforms Node v25.8.2 on `5,000` APs (`warmup + 10` runs). | Rust median `0.3093 ms` (IQR `0.0126`) vs. Node `1.8362 ms` (IQR `1.3254`) = **`5.94x` speedup**. | **Confirmed (`C08`).** Recorded in `docs/benchmarks.md`. |
| **MUT-1** | Yes (B11) | Test suite kills targeted mutations in core biophysical invariants. | `6 / 6` mutants killed (`100%`, `scripts/mutation_audit.py`). | **Confirmed.** Kept in verification suite. |
