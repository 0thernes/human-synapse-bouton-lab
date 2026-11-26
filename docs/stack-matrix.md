# Technology Stack Selection Matrix (`stack-matrix.md`)

Prepared per Build Pipeline Models v1.0.0 (`P4.01`–`P4.04`). Scores are `1` (poor) to `5` (excellent); weighted totals determine the chosen option.

## Scoring Criteria & Weights

- **Verification Rigor (`0.35`):** Formal soundness, type safety, reproducibility.
- **Performance & Determinism (`0.25`):** Reproducible seeds, speed, minimal runtime footprint.
- **Portability & Openness (`0.20`):** Cross-OS builds (Linux/macOS/Windows), permissive FOSS licensing.
- **Maintenance Simplicity / Boringness (`0.20`):** Lockfile stability, low operational overhead.

## Per-Layer Decision Matrix

### 1. Formal Proof Assistant
| Candidate | Rigor (0.35) | Perf/Det (0.25) | Portability (0.20) | Simplicity (0.20) | Weighted Total | Decision |
|---|---|---|---|---|---|---|
| **Lean 4.35.0 (Zero-Mathlib)** | 5 | 5 | 5 | 4 | **4.80** | **Chosen (`ADR 0003`)** — native Palomar & 6-kernel `lake comparator --paranoid` support. |
| Lean 4 + Mathlib | 5 | 3 | 4 | 2 | 3.70 | Rejected — heavy cache footprint unnecessary for exact algebraic invariants. |
| Rocq (Coq) | 5 | 4 | 4 | 3 | 4.15 | Runner-up — strong kernel, lacks direct Palomar `comparator` workflow. |

### 2. High-Speed Stochastic Simulator
| Candidate | Rigor (0.35) | Perf/Det (0.25) | Portability (0.20) | Simplicity (0.20) | Weighted Total | Decision |
|---|---|---|---|---|---|---|
| **Rust 2021 (`ChaCha8Rng` + `proptest`)** | 5 | 5 | 5 | 4 | **4.80** | **Chosen (`ADR 0002`)** — `5.94x` over Node, deterministic lockfile (`Cargo.lock`). |
| C++20 | 3 | 5 | 3 | 2 | 3.30 | Rejected — memory safety risks and complex cross-OS build toolchain. |
| Pure Python / NumPy | 4 | 2 | 5 | 5 | 3.90 | Used as 50-digit reference oracle & stats engine, not hot Monte Carlo loop. |

### 3. Reference Oracle, Stats, API & Media Renderer
| Candidate | Rigor (0.35) | Perf/Det (0.25) | Portability (0.20) | Simplicity (0.20) | Weighted Total | Decision |
|---|---|---|---|---|---|---|
| **Python 3.12 (`uv` + `mpmath` + FastAPI + Matplotlib)** | 5 | 4 | 5 | 5 | **4.75** | **Chosen (`ADR 0002`)** — 50-digit arbitrary precision, Pydantic OpenAPI, deterministic media. |
| Julia | 4 | 5 | 4 | 3 | 4.05 | Runner-up — slower cold-start CI and weaker OpenAPI/media ecosystem. |

### 4. Interactive Browser Workbench
| Candidate | Rigor (0.35) | Perf/Det (0.25) | Portability (0.20) | Simplicity (0.20) | Weighted Total | Decision |
|---|---|---|---|---|---|---|
| **Strict TypeScript + Vite 6 + Three.js + Chart.js** | 4 | 4 | 5 | 5 | **4.45** | **Chosen** — zero-install GitHub Pages delivery, `fast-check` (3,600+ cases), WCAG AA UI. |
| Streamlit / Dash | 3 | 3 | 4 | 4 | 3.40 | Rejected — requires hosted backend server (`> \$0` cost & availability SPOF). |

### 5. Publication Typesetting & Hosting
| Candidate | Rigor (0.35) | Perf/Det (0.25) | Portability (0.20) | Simplicity (0.20) | Weighted Total | Decision |
|---|---|---|---|---|---|---|
| **AMS-LaTeX + Tectonic 0.17.0 + GitHub Pages** | 5 | 5 | 5 | 5 | **5.00** | **Chosen (`ADR 0006`)** — arXiv-ready tarballs, self-contained single binary, `\$0` CDN hosting. |
| Full TeX Live (`4+ GB`) | 5 | 3 | 3 | 2 | 3.50 | Rejected for CI speed; arXiv tarballs still compile cleanly under TeX Live. |

## Build vs. Buy Table & Exit Paths (`P4.04`)

| Capability | Build vs. Buy | Choice | Exit Path if Provider Changes |
|---|---|---|---|
| Biophysical core & formal proofs | **Build** | Custom Apache-2.0 monorepo | Fully self-owned; zero vendor lock-in. |
| Git hosting, CI, Pages | **Buy (Free Open-Source)** | GitHub (`0thernes/human-synapse-bouton-lab`) | Standard Git repo + `Dockerfile` + static Vite `dist/` deploy identically to GitLab/Codeberg/Cloudflare Pages. |
| Persistent DOI archival | **Buy (Public Science)** | CERN Zenodo (`10.5281/zenodo.24477927`) | DataCite DOIs are permanent; mirrored in Software Heritage SWHID & `0thernes-research-archive`. |
| Formal proof registry | **Buy (Public Science)** | Palomar Registry ((prior Palomar submission cleanly withdrawn in v1.2.0)) | `lean/Challenge.lean` & `Solution.lean` remain independently checkable offline by any Lean 4.35.0 kernel. |
| RFC 3161 Timestamping | **Buy (Public Free TSA)** | DigiCert TSA (`timestamp.digicert.com`) | Standard RFC 3161 `.tsr` verifiable offline; swappable to FreeTSA or Sectigo TSA with one URL flag. |
