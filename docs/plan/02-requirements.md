# P2 Requirements, Journeys, Acceptance Criteria & NFRs (`02-requirements.md`)

Prepared per Build Pipeline Models v1.0.0 (`P2.01`–`P2.04`, `P2.06`).

## Problem

Computational neuroscience demos and exploratory monographs routinely mix unverified prose, floating-point drift, species-parameter conflation (rat `374` vs. human cortical `1,500–3,500` vesicles), unseeded randomness, and overclaimed theories of consciousness. Researchers need a transparent, multi-language, formally verified synaptic bouton reference that cleanly separates deductive proofs, exact numerical oracles, statistical approximations, and open philosophical barriers.

## Users

1. **Formal-Methods & Registry Reviewers** (Lean 4 / Palomar Registry): verify `Challenge.lean`, `Solution.lean`, axioms, and non-vacuity witnesses across independent kernels.
2. **Computational Neuroscientists & Replicators**: inspect pre-registered Monte Carlo stats, run differential cross-checks, and reproduce both AMS-LaTeX white papers from a clean clone.
3. **Students & Interdisciplinary Explorers**: interact with the live 9-tab 2D/3D browser workbench (`https://0thernes.github.io/human-synapse-bouton-lab/`) and study the 11-discipline Open Hard Problems & Consciousness boundary map.

## Scope (In-Scope for `v1.x`)

- Pure Lean 4.35.0 formal proof package (24 theorems, 19 non-vacuity witnesses, `VerifyAxioms.lean`, `comparator.json`, `formalization.yaml`).
- Rust `synapse-sim` (`ChaCha8Rng` Monte Carlo sweeps, `proptest`, benchmarks).
- Python `synapse_science` (50-digit `mpmath`/rational oracle, FastAPI REST API, pre-registered stats, deterministic figures/GIF/MP4 renderer).
- Strict TypeScript `packages/synapse-core` + accessible Vite/Three.js/Chart.js `apps/web` deployed to GitHub Pages.
- Two reproducible AMS-LaTeX white papers (`WP1` & `WP2`) with standalone arXiv tarballs, `MANIFEST.sha256`, RFC 3161 timestamp, Zenodo DOI, ORCID, SWHID, and Build Standard + Build Pipeline audits.

## Non-Goals (Explicitly Excluded from `v1.x`)

1. **Not a 3D meshed Brownian particle PDE/CME solver** (stationary Naraghi–Neher nanodomain approximation is used; see `LIMITATIONS.md`).
2. **Not a whole-cortex or multi-million-synapse connectome simulator** (`> 10^9x` beyond exascale at molecular resolution; `F08`).
3. **Not a claim to solve the Hard Problem of consciousness or engineer artificial sentience** (explicitly demarcated as an epistemic barrier in White Paper 2).
4. **Not a multi-tenant commercial SaaS or cloud database application** (stateless browser workbench + optional local FastAPI; zero user accounts or PII).
5. **Not an atomic cryo-EM PDB/EMDB workstation render farm** (workbench schematics are clearly labeled educational/analytical models).

## User Journeys & Acceptance Criteria (`P2.02`, `P2.03`)

### J1 — Interactive Biophysical Exploration (Web Workbench)
- **Start:** User opens `https://0thernes.github.io/human-synapse-bouton-lab/` (or `npm run dev`).
- **Steps:** Navigate across all 9 accessible tabs (3D Bouton, Electrochemistry, Nanodomains & E/I, SNARE & Toxins, Bioenergetics, HH RK4 & Traces, DNA-PAINT/RESI, 11-Discipline Open Problems, Six-Class Findings & Proofs), switch between Rat (`374`) and Human L1 (`3,500`) / L4 (`1,800`) / L5 (`1,500`) presets, and adjust parameters.
- **Visible Outcome:** Interactive plots, 3D scene, and verified readouts update immediately with zero console errors and WCAG AA keyboard navigation.
- **Acceptance Criteria:**
  - *Given* the live static build with no local FastAPI server running, *When* a user adjusts `Ca2+` coupling distance or selects Human L1 (`3,500`), *Then* the TypeScript core computes deterministic updates client-side and maintains `rrp + recycling + reserve == totalVesicles`.
  - *Given* malformed or oversized (`> 2 MB`) trace data pasted into the Experimental Trace Analyzer, *When* analyzed, *Then* `TraceParseError` is raised cleanly with an accessible error message rather than an uncaught crash (`F02`).

### J2 — Formal Multi-Kernel Verification
- **Start:** Reviewer clones the repository and enters `lean/`.
- **Steps:** Run `lake build --wfail`, `lake env lean VerifyAxioms.lean`, and (on Linux) `lake comparator --paranoid`.
- **Visible Outcome:** All 24 theorems compile with zero warnings, print axioms strictly within `[propext, Quot.sound]`, and pass all 6 independent kernels.
- **Acceptance Criteria:**
  - *Given* a clean checkout of `lean/`, *When* `lake build --wfail && lake env lean VerifyAxioms.lean` executes, *Then* exit code is `0` and stdout contains zero `sorryAx`, zero `Classical.choice`, and zero `Lean.ofReduceBool`.

### J3 — Cross-Language Differential & Pre-Registered Statistical Reproduction
- **Start:** Replicator runs `just reproduce` (or individual `pytest`, `cargo test`, `npm test` commands per `REPLICATION.md`).
- **Steps:** Run Rust Monte Carlo sweep, Python stats/differential/mutation audits, and checksum verification.
- **Visible Outcome:** `0` differential mismatches across `2,000` checks, `6/6` mutants killed, `23/23` DOIs verified, and `sha256sum -c MANIFEST.sha256` passes 100%.
- **Acceptance Criteria:**
  - *Given* pinned lockfiles, *When* `uv run pytest python/tests/test_differential.py` runs, *Then* all 1,000 TS and 1,000 Rust inputs agree with the 50-digit Python oracle within `1e-10`.

### J4 — Local REST API Contract Consumption
- **Start:** Developer launches `uv run synapse-api` (or pinned Docker image).
- **Steps:** Query `GET /healthz` and `POST /api/v1/{electrochemistry,nanodomain,snare,bioenergetics,ei-balance,metrology}`.
- **Visible Outcome:** JSON responses conform strictly to `api/openapi.yaml` / `api/openapi.json` with structured request logging.
- **Acceptance Criteria:**
  - *Given* valid JSON payload matching `api/openapi.yaml`, *When* `POST /api/v1/electrochemistry` is called, *Then* HTTP `200` returns exact oracle outputs matching `test_api.py`; *When* invalid negative Kelvin or NaN inputs are sent, *Then* HTTP `422` validation error is returned.

### J5 — White Paper & Archival Reproduction
- **Start:** Reader downloads `dist/*.pdf` or runs `uv run python scripts/build_papers.py`.
- **Steps:** Compile both AMS-LaTeX manuscripts and verify `dist/arxiv_*.tar.gz` standalone compilation and `dist/SHA256SUMS`.
- **Visible Outcome:** Print-ready PDFs embedding live Zenodo DOI, SWHID, Palomar verification run, and zero LaTeX errors.
- **Acceptance Criteria:**
  - *Given* `Tectonic 0.17.0` and `uv`, *When* `uv run python scripts/build_papers.py` runs, *Then* both PDFs and standalone arXiv tarballs compile with exit code `0` and matching SHA-256 checksums.

## Non-Functional Requirements (`P2.04`)

| Category | Requirement | Target / Status |
|---|---|---|
| Correctness (Formal) | Zero `sorry`, zero custom axioms, zero `Classical.choice` across all 24 theorems | `100%` (verified across 6 kernels) |
| Correctness (Numerical) | Max relative error between TS, Rust, and 50-digit Python oracle across 1,000 inputs | `<= 1e-10` (`0` violations) |
| Performance (Simulation) | Rust 5,000-AP Monte Carlo median runtime | `< 1.0 ms` (measured `0.3093 ms`, `5.94x` faster than Node) |
| Performance (API) | Local FastAPI `/healthz` and compute endpoint p95 latency | `< 50 ms` (pure in-memory math) |
| Security & Supply Chain | Committed secrets, open npm vulns, open GitHub Dependabot alerts | `0` secrets, `0` npm vulns, `0` Dependabot alerts |
| Accessibility | Keyboard focus navigation, skip link, ARIA tab roles, `prefers-reduced-motion`, WCAG AA contrast | Verified in `docs/accessibility.md` |
| Portability | Cross-OS CI matrix (`ubuntu-latest`, `macos-latest`, `windows-latest`) + pinned `Dockerfile` | `12/12` CI jobs green |
| Availability (Static UI) | GitHub Pages HTTPS delivery | GitHub Pages SLA (`>= 99.9%`); zero backend SPOF |
| Multi-tenant concurrency / SQL latency | Commercial database throughput | **`n/a`** — stateless static web workbench & local compute API |

## MoSCoW Prioritization (`P2.06`)

- **Must:** 18 pure Lean 4.35.0 theorems + multi-kernel check; TS/Rust/50-digit Python differential suite; pre-registered Monte Carlo with honest refutation; 9-tab accessible GitHub Pages UI; 2 compiled AMS-LaTeX PDFs; Build Standard 100% + zero CVEs; Zenodo/SWH/ORCID/Palomar archival.
- **Should:** HD H.264 MP4 videos + GIF; FastAPI REST API + OpenAPI YAML/JSON; digest-pinned `Dockerfile`; DigiCert RFC 3161 timestamp; Build Pipeline Models `P0`–`P11` artifacts.
- **Could:** Live browser WASM execution of Rust simulator; automated weekly CI cron verification.
- **Won't (in `v1.x`):** 3D meshed Brownian MCell4 solver; whole-cortex simulation; cloud SaaS accounts/billing; atomic 16K PDB/Blender workstation renders.
