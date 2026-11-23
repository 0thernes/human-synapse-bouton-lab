# Architecture

`human-synapse-bouton-lab` is a four-language scientific verification and interactive workbench architecture engineered so that formal proofs, arbitrary-precision reference arithmetic, high-speed deterministic Monte Carlo simulation, and interactive 2D/3D visualization continuously cross-check one another.

## System Diagram

```mermaid
flowchart TD
    L["lean/ (Lean 4.35.0)<br/>Challenge.lean & Solution.lean<br/>18 Proofs · 0 Sorry · 5+ Kernels"] -->|Certifies exact algebraic invariants| PY
    PY["python/synapse_science/<br/>50-Digit mpmath Oracle + FastAPI<br/>Pre-Registered Stats + Media/Video"] <-->|1,000-case Differential Test (rtol <= 1e-10)| TS
    PY <-->|1,000-case Differential Test (rtol <= 1e-10)| RS
    RS["rust/synapse-sim/<br/>ChaCha8Rng Monte Carlo Engine<br/>proptest (2,000 cases) · Benchmarks"] -->|30-seed deterministic sweep| DATA["data/experiments/<br/>per_seed_results.csv<br/>stats_summary.json<br/>MANIFEST.sha256"]
    DATA --> PY
    TS["packages/synapse-core/<br/>Strict TypeScript Biophysical Core<br/>11-Discipline Open Problems<br/>fast-check (3,600+ cases)"] --> WEB["apps/web/<br/>Vite 6 + Three.js + Chart.js<br/>9-Tab Accessible Workbench<br/>GitHub Pages"]
    PY -->|Optional live /api/v1/*| WEB
    PY -->|Vector PDFs, PNGs, GIF, H.264 MP4| MEDIA["docs/media/ & papers/figures/"]
    MEDIA --> WEB
    MEDIA --> TEX["papers/wp1 & wp2 (AMS-LaTeX)<br/>Tectonic 0.17.0 -> dist/*.pdf & arXiv tarballs"]
```

## Components & Responsibilities

1. **Formal Proof Core (`lean/`):** Zero-Mathlib Lean 4.35.0 package proving exact natural/integer invariants for Hill $n=4$ cooperativity, KCC2 shunting inhibition, vesicle pool conservation (rat & human L1), ATP deficit & resting leak limits, kinesin-1 ATP cost, SNARE barrier monotonicity, RESI variance gain, and discrete bipartite causal coupling.
2. **Exact Oracle, Stats, API & Media (`python/synapse_science/`):**
   - `oracle.py`: 50-digit `mpmath` and exact `Fraction` ground truth (Build Standard B12).
   - `stats_experiments.py`: Paired/two-sample permutation tests, Cliff's $\delta$, Cohen's $d$, 10,000-resample 95% bootstrap CIs, Holm–Bonferroni correction, and `data/MANIFEST.sha256`.
   - `server.py`: FastAPI REST backend with Pydantic v2 schema contracts (`/openapi.json`), structured JSON request logging, and `/healthz`.
   - `generate_media.py`: Deterministic scientific figure, audited schematic blueprint, social preview, animated GIF, and H.264 MP4 video pipeline.
3. **Deterministic Native Simulator (`rust/synapse-sim/`):** Fast compiled Monte Carlo synaptic bouton engine using `ChaCha8Rng`, serving 30-seed pre-registered sweeps, 1,000-case differential batches, and honest warmup+10-run benchmarks (`0.3093 ms` median vs Node `1.8362 ms`).
4. **TypeScript Core & Interactive Web Workbench (`packages/synapse-core/`, `apps/web/`):** Zero-duplication shared library consumed by Vitest, differential tests, standalone examples, and the 9-tab accessible Vite/Three.js/Chart.js web application deployed to GitHub Pages.
5. **Publication Pipeline (`papers/`, `scripts/build_papers.py`, `dist/`):** Two AMS-LaTeX white papers compiled via Tectonic 0.17.0 with verified standalone arXiv tarballs and `dist/SHA256SUMS`.

## Architecture Decision Records

Every major structural choice is recorded in [`docs/adr/README.md`](adr/README.md).
