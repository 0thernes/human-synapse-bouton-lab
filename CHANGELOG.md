# Changelog

All notable changes to `human-synapse-bouton-lab` are documented here following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-11-23

### Added
- **Palomar Registry `module` Headers (`lean/`):** Added Lean 4.35.0 `module` headers and `@[expose]` definitions to `Challenge.lean`, `Solution.lean`, `NonVacuity.lean`, and `VerifyAxioms.lean` (re-verified across all 6 kernels).
- **Live Citation & Retraction Audit (`scripts/verify_citations.py`, `docs/citation-audit.json`):** Verified all `23/23` BibTeX entries live against the Crossref API (`0` dead links, `0` retractions).
- **Playbook Provenance & Hardening Artifacts:** Added `ERRATA.md`, digest-pinned `Dockerfile` (`debian:bookworm-slim@sha256:734a72b3...`), `docs/literature-and-checklist.md` (literature log, NeurIPS checklist, dataset datasheet, 15 CFR 734.8 export-control self-screen), `docs/adr/0005-commit-signing-and-zero-gate-precedence.md`, root `MANIFEST.sha256`, and RFC 3161 trusted timestamp (`MANIFEST.sha256.tsr`).
- **Software Heritage SWHID Integration:** Added verified SWHID `swh:1:snp:1a278fff55465dbe8d0b870408b6468822eb3e8b` into `CITATION.cff`, `.zenodo.json`, and both recompiled AMS-LaTeX white papers.
- **Expanded SLSA Release Provenance:** `.github/workflows/ci.yml` uploads `lean-axioms-ci.txt`, and `.github/workflows/release.yml` includes `docs/lean-axioms-report.txt` and `MANIFEST.sha256` inside the SLSA-attested `dist/` release artifacts.

### Fixed
- **Unified `F01`–`F10` Findings Reconciliation (`F10`):** Synchronized all 10 classified findings (`F01`–`F10`) identically across `packages/synapse-core/src/openProblems.ts` (verified by Vitest), Web UI Findings tab, `docs/reviews/2026-11-23-redteam.md`, `ERRATA.md`, and White Paper 2 Table 2.
- **Dependency Security Upgrades (`F10`):** Upgraded `pillow` (`11.3.0 -> 13.0.0`), `vite` (`6.2.2 -> 6.4.6`), `vitest` (`3.0.9 -> 4.1.12`), and `typescript-eslint`, achieving `0 vulnerabilities` in `npm audit` and clearing Pillow lockfile alerts.

## [1.0.0] - 2026-11-23

### Added
- **Lean 4.35.0 Formal Verification (`lean/`):** 18 pure sorry-free theorems across 6 biophysical & bipartite-coupling domains (`Challenge.lean`, `Solution.lean`), 19 physiological non-vacuity witnesses (`NonVacuity.lean`), axiom audit (`VerifyAxioms.lean`), `comparator.json`, and `formalization.yaml` replayed across official kernel, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, and `con-leche`.
- **Refactored Full-Stack Multi-Language Core:**
  - `@synapse/core` (strict TypeScript, modular biophysical equations, 11-discipline open problems registry, deterministic Mulberry32 PRNG, Vitest + 3,600+ `fast-check` property tests).
  - `rust/synapse-sim` (deterministic `ChaCha8Rng` Monte Carlo engine, 2,000 `proptest` cases, differential CLI, honest benchmark harness).
  - `python/synapse_science` (50-digit `mpmath`/rational oracle, pre-registered statistical analysis with Holm–Bonferroni & bootstrap CIs, FastAPI REST server with `/healthz` + OpenAPI contract tests, deterministic Matplotlib/FFmpeg figure & video generator).
  - `apps/web` (accessible 9-tab Vite + Three.js + Chart.js workbench with live WebGL bouton, forensic blueprint hotspots, embedded MP4 simulation videos, 11-discipline Open Hard Problems & Consciousness Frontier tab, and Six-Class Findings Ledger).
- **Two AMS-LaTeX White Papers (`papers/`, `dist/`):** Compiled cleanly with Tectonic 0.17.0 with standalone verified arXiv tarballs and data-driven vector PDF figures.
- **Pre-Registered 30-Seed Monte Carlo Dataset (`PREREGISTRATION.md`, `DEVIATIONS.md`, `data/`):** Complete per-seed CSV, statistical summary JSON, raw benchmark JSONs, and `data/MANIFEST.sha256`.
- **Build Standard v1.1.0 Compliance:** Complete 90-item governance, cross-platform informational CI, Pages deployment, signed/attested release workflow, SBOM, STRIDE threat model, accessibility audit, and 10-pass red-team review.

### Fixed
- **Regression `F01` (conflict):** Resolved unformed LLC affiliation and license conflict by adopting `Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)` and Apache-2.0 / CC-BY-4.0 dual licensing.
- **Regression `F02` (bug):** Replaced unseeded `Math.random()` and uncaught JSON trace crashes from legacy prototype v9 with deterministic seeded PRNG (`tests/synapse.test.ts`: `regression F02`) and hardened `TraceParseError` boundary rejection.
- **Regression `F03` (error):** Separated rat synaptosome baseline (`374` vesicles, Wilhelm 2014) from adult human temporal cortex presets (`3,500` L1 / `1,800` L4 / `1,500` L5) with unit + Lean conservation proofs (`tests/synapse.test.ts`: `regression F03`).
- **Regression `F04` (error):** Replaced broken `user_uploaded_files/.../4163_audit.jpg` reference with deterministic code-rendered `tripartite_bouton_blueprint.png`.
- **Correction `F09` (error / honest refutation):** Pre-registered hypothesis H3 predicted mitochondria sustain $>90\%$ ATP at 40 Hz; actual simulation refuted H3 because 40 Hz exceeds $f_{\text{crit,mito}} = 29.5625\,$Hz. Recorded verbatim in `CLAIMS.md`, `DEVIATIONS.md`, and White Paper 1 alongside exploratory 20 Hz follow-up `H3b`.
