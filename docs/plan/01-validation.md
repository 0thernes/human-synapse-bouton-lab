# P1 Problem, Alternatives & Licensing Validation (`01-validation.md`)

Prepared per Build Pipeline Models v1.0.0 (`P1.01`–`P1.06`).

## Target User & Job To Be Done (`P1.01`)

- **Primary users:** Independent computational neuroscientists, biophysical modelers, formal-methods reviewers (Lean 4 / Palomar Registry), and graduate neuroscience/biophysics learners.
- **Job to be done:** Explore, audit, and cite multi-scale human cortical synaptic bouton equations (electrochemistry, `Ca2+` nanodomains, SNARE fusion, V-ATPase bioenergetics, RESI metrology) with cryptographic assurance that algebraic claims hold universally and numerical routines match across languages.
- **Current workaround:** Piecing together unverified textbook equations, single-language Python/MATLAB scripts without cross-language differential tests, unseeded browser demos, and non-reproducible PDF preprints.

## User Interviews & Commercial Demand Test (`P1.02`, `P1.04` — Marked `n/a`)

- **`P1.02` (Talk to 5 paying/target users):** **`n/a`** — This repository is a non-commercial open-science independent research publication and formal-verification workbench, not a commercial SaaS product. No user interviews are fabricated (`AI06`).
- **`P1.04` (Commercial demand test):** **`n/a`** — No paid funnel or landing-page waitlist applies. External validation is instead measured transparently via automated third-party infrastructure gates (Palomar Registry independent CI verification `45241561032`, CERN Zenodo DataCite DOI `10.5281/zenodo.24477928`, Software Heritage archival, and future independent human replication reports filed via `.github/ISSUE_TEMPLATE/replication.yml`).

## Alternatives & Existing Ecosystem (`P1.03`)

| Alternative | Strengths | Gaps Relative to This Project |
|---|---|---|
| **Doing nothing (static textbooks / PDFs)** | Zero setup; established narrative. | Non-interactive; equations not executable; silent parameter conflation (`F03`) goes uncaught. |
| **NEURON / Brian2** | Mature biophysical compartmental and spiking-network simulators. | No built-in Lean 4 formal proofs, no 50-digit differential oracle, no integrated RESI/SNARE/V-ATPase bouton metrology UI. |
| **MCell4 / BioNetGen** | High-fidelity 3D spatial particle reaction–diffusion. | Heavy setup; no zero-install web workbench; no kernel-checked algebraic bounds or pre-registered 11-discipline consciousness boundary audit. |
| **Legacy single-file HTML prototype (v9)** | Instant browser open; broad topic survey. | Unseeded `Math.random()` (`F02`), rat-vs-human vesicle conflation (`F03`), missing local image (`F04`), zero formal proofs or CI. |
| **Mathlib-based Lean repositories** | Rich mathematical library ecosystem. | Large toolchain/cache footprint; rarely paired with multi-language Rust/TS/Python scientific differential testing and pre-registered Monte Carlo stats. |
| **This repository (`human-synapse-bouton-lab`)** | Pure zero-Mathlib Lean 4.35.0 (6 kernels), Rust/TS/50-digit Python oracle, pre-registered stats with honest refutation, live Pages UI, 2 Tectonic PDFs. | Stationary nanodomain approximation rather than full 3D Brownian particle mesh; single-bouton scope (`LIMITATIONS.md`). |

## Legal, Licensing & Data Access Audit (`P1.06`)

| External Dependency / Asset | License / Terms Status | Access & Risk Notes |
|---|---|---|
| Published biophysical constants (Wilhelm 2014; Rollenhagen 2019–2024; Wang 2024; Reinhardt 2023) | Scientific facts / peer-reviewed citations (23/23 Crossref-verified, `docs/citation-audit.json`) | Properly cited with DOIs; zero scraped proprietary datasets or human-subject PII. |
| Lean 4.35.0 toolchain (`leanprover/lean4`) | Apache-2.0 | Zero Mathlib dependency; minimal trusted computing base (`ADR 0003`). |
| Rust crates (`rand`, `rand_chacha`, `serde`, `proptest`) | MIT / Apache-2.0 dual-licensed | Pinned in `Cargo.lock`; zero open advisories. |
| Python packages (`mpmath`, `fastapi`, `pydantic`, `matplotlib`, `pillow`, `pytest`, `ruff`, `mypy`) | BSD / MIT / PSF compatible | Pinned in `uv.lock`; `pillow 13.0.0`, `pytest 9.2.0`; zero open advisories. |
| Node / Vite / Three.js / Chart.js / Vitest / `fast-check` | MIT / Apache-2.0 | Pinned in `package-lock.json`; `npm audit` = `0` vulnerabilities. |
| Root repository code & manuscripts | Verbatim `Apache-2.0` (`LICENSE`) + `CC-BY-4.0` (`docs/LICENSE-CONTENT.md`) | Single SPDX license at repo root ensures clean detection by GitHub API and Palomar `detect_license.rb` (`ADR 0001`). |
| Author affiliation & Zenodo / Palomar / arXiv compliance | Independent Researcher (no unformed LLC, `F01`); transparent AI disclosure | Reviewed against Zenodo generative-AI depositor policy and Palomar submission terms; zero fabricated authorship. |
