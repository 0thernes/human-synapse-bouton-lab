# Honest Benchmarks and Performance Budgets

All numbers below come directly from real runs on current code (Build Standard A37, B26, R6).

## Environment

- **OS / Architecture:** Windows 11 (x86_64) on ReFS Dev Drive (`Z:\`)
- **Rust Toolchain:** `rustc 1.94.1` (`cargo build --release`)
- **Node Runtime:** `Node.js v25.8.2`
- **Workload:** 5,000 stochastic action potentials per run (coupled $\mathrm{Ca}^{2+}$ nanodomain jitter, Hill $n=4$ release across RRP slots, cleft glutamate diffusion, AMPAR EPSC integration, and RRP replenishment), 3 warmup runs + 10 timed runs across seeds `1000..1009`.

## Measured Results (2026-11-23)

| Implementation | Command | Runs | Median (ms) | IQR (ms) | Min – Max (ms) | Correctness Checksum | Raw Artifact |
|---|---|---|---|---|---|---|---|
| **Rust (`synapse-sim`)** | `./target/release/synapse-sim bench` | 10 | **0.3093** | **0.0126** | `0.2998 – 0.3337` | `336.847792` | `data/benchmarks/rust_bench.json` |
| **TypeScript (`@synapse/core`, Node v25.8.2)** | `npm run bench --workspace=@synapse/core` | 10 | **1.8362** | **1.3254** | `0.9428 – 5.5241` | `336.783092` | `data/benchmarks/node_bench.json` |

*Note on Checksums:* Rust uses `ChaCha8Rng` while TypeScript uses Mulberry32, so individual random draws differ slightly while converging to the same expected mean EPSC sum (`336.85` vs `336.78` across 50,000 APs, `<0.02%` difference). Deterministic mathematical formulas without RNG match to `< 1e-10` across all 1,000 differential test cases (`python/tests/test_differential.py`).

**Honest Trade-Off (Where Rust Loses):** Rust requires a ~3–35 s native compile step and binary packaging, whereas `@synapse/core` executes directly inside any browser (GitHub Pages) with zero installation and `< 2 ms` per 5,000 APs.

## Performance Budgets (A37)

| Metric | Budget | Current Measured Value | Measurement Command | Status |
|---|---|---|---|---|
| Rust 5,000-AP Monte Carlo median latency | `< 2.0 ms` | `0.3093 ms` | `./target/release/synapse-sim bench` | Within budget |
| Node 5,000-AP Monte Carlo median latency | `< 10.0 ms` | `1.8362 ms` | `npm run bench --workspace=@synapse/core` | Within budget |
| Web workbench gzipped JS bundle (`apps/web`) | `< 300 KB` | `221.42 KB` (gzip) | `npm run build --workspace=@synapse/web` | Within budget |
| Lean 4.35.0 full clean proof build | `< 30 s` | `~6.0 s` (all 7 jobs) | `cd lean && lake build --wfail` | Within budget |

## Benchmark History (B27, Report-Only)

| Date | Commit / Tag | Rust Median (ms) | Rust IQR (ms) | Node Median (ms) | Node IQR (ms) | Speedup |
|---|---|---|---|---|---|---|
| 2026-11-23 | `v1.0.0` | `0.3093` | `0.0126` | `1.8362` | `1.3254` | `5.94x` |
