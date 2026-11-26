# Changelog

All notable changes to `human-synapse-bouton-lab` are documented here following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed (2026-11-26 statement audit, companion White Paper 2, archive entry `0TH-2026-008`)
- Described White Paper 2 as a companion survey paper with no formal result of its own; its formal content is `T22`–`T24` and `A05` from the shared Lean suite. Used the paper's own title in `README.md`.
- Withdrew the listing of `T22`–`T24` as a verified partial contribution to `NEURO-004` and the statement that `A05` proves a determinant is not causality (`CLAIMS.md` `C12`, `docs/mega-atlas-crosswalk.md`, `LIMITATIONS.md`).
- Corrected the White Paper 2 theorem locator in `lean/formalization.yaml` (Theorem 4.1, not 3.1) and recorded the `v1.3.0` version DOI `10.5281/zenodo.24548051` in `README.md` and `docs/PRESERVATION.md`.
- Recorded the errors that remain in the frozen White Paper 2 source and PDF in `ERRATA.md`.

## [1.3.0] - 2026-11-25

### Added
- **24 Pure Lean 4.35.0 Theorems + 26 Witnesses + 6 Adversarial Counterexample Checks (`F29`, `F30`):** Added 6 new constructive theorems (`hill4_ultrasensitive_crossover_vs_linear`, `tsodyks_markram_step_unit_bounds`, `nmda_mg_unblock_unit_interval_and_monotone`, `vesicle_pool_multistep_invariant` by structural induction, `atp_hitting_time_upper_bound` proving exact H3 depletion at `t = 3 s`, and `diagonal_excess_implies_positive_coupling`), expanded `lean/NonVacuity.lean` to 26 witnesses, and added `lean/AdversarialChecks.lean` proving concrete counterexamples when positive-domain or causal guards are dropped.
- **Interactive Lean 4 Proof Blueprint & SVG Dependency DAG (`blueprint/index.html`):** Self-contained interactive theorem inspector and dependency graph deployed live alongside the workbench at `/blueprint/`.
- **Unsolved Problems Mega-Atlas Crosswalk (`docs/mega-atlas-crosswalk.md` & White Paper 2 §3):** Complete, honest audit of all 1,900 problems in `0thernes/unsolved-problems-mega-atlas` (`0 / 1,900` fully solved; 18 high-CSS Atlas IDs mapped to exact machine-checked sub-lemmas, Monte Carlo bounds, and explicit remaining barriers).
- **Defensible Research Playbook Edition 1.3 & Archival Parity (`F29`):** Added verbatim 24-theorem `#print axioms` 5-Second Proof block in `README.md` with automated CI drift auditor (`scripts/check_readme_axioms.py`), `CITATION.bib`, `AUTHORS.md`, `NOTICE`, `croissant.json`, `docs/statement-fidelity.md`, `docs/AI_DISCLOSURE.md`, `docs/PRESERVATION.md`, Withdrawal & Retraction Policy in `ERRATA.md`, and complete 3-cycle forensic hardening ledger (`HARDENING_LOG.md`).

### Fixed
- **Benchmark JSON Corruption (`F21`):** Fixed `scripts/dev.sh` (`npm run --silent bench --workspace=@synapse/core`) and regenerated clean valid JSON `data/benchmarks/node_bench.json` + updated `data/MANIFEST.sha256`.
- **Cross-Language Input Boundary Guards (`F24`, `F25`, `F31`, `F32`, `F34`):** Added `math.isfinite()` NaN/Inf guards across `python/synapse_science/oracle.py`, `u0 <= 1` guard in `hodgkinHuxley.ts`, monotonic timestamp validation in `traceAnalyzer.ts`, upfront `firing_rate_hz`/`nanocolumn_offset_nm`/`cleft_width_nm`/`temp_c` checks in Rust `run_monte_carlo_bouton`, and graceful `try/catch` WebGL fallback in `apps/web/src/scene3d.ts`.
- **Script, CLI & Metadata Drift (`F22`, `F23`, `F27`, `F33`):** Replaced hardcoded `v1.0.0`/`v1.1.0` strings in Rust `main.rs`, `apps/web/src/main.ts`, `generate_media.py`, and `verify_citations.py`; fixed `scripts/dev.sh` Lean comment-stripping grep; synchronized all active docs, `.zenodo.json`, `CITATION.cff`, and `openProblems.ts` with `v1.3.0` counts & observational factorization wording.
- **CI Modernization (`F26`):** Upgraded all GitHub Actions in `ci.yml`, `pages.yml`, and `release.yml` to native Node 24 tags (`@v7`/`@v6`/`@v5`/`@v10`/`@v4`), added `_native` axiom scan, `AdversarialChecks` `leanchecker`, and README axiom drift verification; removed retired `palomar-preflight.yml`.
- **Zero-Warning AMS-LaTeX White Papers (`F28`):** Eliminated every Overfull `\hbox`, Underfull `\hbox`, and `hyperref` duplicate anchor warning across both White Papers 1 & 2 (`0` box/hyperref warnings in Tectonic 0.17.0).

## [1.2.0] - 2026-11-23

### Changed (Lean 4.35.0 Statement-Fidelity & Positive-Domain Hardening — `ERRATA.md` `E05`)
- **Hill $n=4$ Positive-Domain Guarantees (`F15`):** Added explicit `kd > 0` to `hill4_resting_noise_floor` and `halfKd > 0` (clarifying true dissociation constant $K_d = 2\,\text{halfKd}$ for $K_d/2 \to K_d$ doubling) to `hill4_ultrasensitive_doubling`, proving strict positivity of all denominators.
- **Pure-Shunting Well-Definedness (`F16`):** Added `gL, gE, gI > 0` and `eL < eE` to `pure_shunting_divisive_identity`, certifying `0 < eiDen gL gE gI`, `0 < gL + gE`, and `0 < gE * (eE - eL)` alongside both cleared-denominator identities.
- **Clamped Positive ATP Store Depletion (`F17`):** Added `atpStoreAfter`, required `a0 > 0` in `atp_deficit_strict_depletion`, and proved strict depletion of the nonnegative clamped store (`atpStoreAfter < a0`).
- **Resting V-ATPase Leak Rational & Integer-Floor Rate Bounds (`F18`):** Added `cAp > 0` to `resting_leak_strictly_lowers_sustainable_rate`, proving BOTH exact rational critical-frequency reduction `(sAtp - bLeak) * cAp < sAtp * cAp` AND strict integer-floor reduction whenever `cAp ≤ bLeak`, plus a 20th concrete witness (`witness_resting_leak_integer_drop`) in `lean/NonVacuity.lean`.
- **Observational $2\times 2$ Factorization Scope (`F19`):** Restricted Domain VI docstrings, `README.md`, `LIMITATIONS.md`, and White Papers 1 & 2 strictly to observational $2\times 2$ weight-table algebraic factorization (`= 0`) vs. strict diagonal product dominance (`> 0`), explicitly disclaiming interventional causality or geometric nanocolumn derivation inside Lean.
- **Provenance & Verification Scope Clarity (`F20`):** Updated `lean/formalization.yaml` source relationships to `formalizes`/`adapts`, separated repository Ubuntu CI 6-kernel verification cleanly from external registries, and withdrew the earlier Palomar Registry submission prior to registration.

## [1.1.2] - 2026-11-23

### Added
- **Build Pipeline Models v1.0.0 Full Lifecycle Artifacts (`F13`):** Added `project.yaml`, `project.schema.json`, `.cursor/rules/build-pipeline-models.mdc`, `scripts/pipeline-audit.py`, `scripts/pipeline-checks.tsv`, `api/openapi.yaml` & `api/openapi.json`, `docs/plan/` (`00-idea.md`, `00-redteam.md`, `kill-criteria.md`, `ideas.md`, `01-validation.md`, `01-spikes.md`, `decision-log.md`, `02-requirements.md`, `02-metrics.md`, `slices.md`, `experiments.md`, `review-2026-11.md`, `checklist.md`), `docs/data-model.md`, `docs/cost-model.md`, `docs/failure-modes.md`, `docs/stack-matrix.md`, `docs/ai-choices.md`, `docs/deploy.md`, `docs/adr/0006-deploy-target-and-rollback.md`, `docs/launch/` (`release-checklist.md`, `announcement.md`, `channels.md`, `launch-log.md`), `docs/ops/` (`slos.md`, `runbook.md`, `backup-restore.md` with recorded `git bundle` restore drill, `cost.md`), and `reports/security/2026-11-23-audit.md`; expanded `docs/architecture.md` with C4 Level 1/2 diagrams, Scaling, and Observability.
- **White Papers Updated with Live External Provenance (`F13`):** Embedded CERN Zenodo Concept DOI (`10.5281/zenodo.24477927`), Version DOI (`10.5281/zenodo.24477928`), Software Heritage SWHID (`swh:1:snp:458adcd73c9a78054486147094950e2be6774271`), and Palomar Registry mechanical pass (`68sy455wsdm5`, run `45241561032`) in both AMS-LaTeX white papers and recompiled frozen PDFs & standalone arXiv tarballs.

### Fixed
- **Stale `LICENSE-CONTENT` References (`F11`):** Updated remaining links in `AGENTS.md`, `README.md`, `docs/literature-and-checklist.md`, `repo.yaml`, and regenerated `llms-full.txt` to point exclusively to `docs/LICENSE-CONTENT.md`.
- **Cryptographic Manifest Re-Seal (`F12`):** Regenerated root `MANIFEST.sha256` after Palomar `lean/` metadata updates and re-stamped live DigiCert RFC 3161 `MANIFEST.sha256.tsr` (`0` checksum failures).
- **Bracket-Safe Wildcard Globbing (`F14`):** Patched `scripts/pipeline-audit.py` to call `glob.escape(root)` so wildcard checks (`docs/adr/0001-*.md`, `.cursor/rules/*.mdc`, `docs/plan/review-*.md`) succeed on Dev-Drive paths containing literal brackets (`Z:\[Vibe Coded (AI)]\...`).
- **Package & SBOM Version Parity:** Synchronized `python/synapse_science/__init__.py` (`__version__`) and `sbom.cdx.json` root component version with `VERSION` (`1.1.2`).

## [1.1.1] - 2026-11-23

### Added
- **Palomar Registry Submission (`submission_id: 68sy455wsdm5`):** Upgraded `lean/formalization.yaml` to the official `v0.4` `mathlib-initiative/formalization.yaml` schema, added `.github/workflows/palomar-preflight.yml`, passed official Palomar mechanical preflight (`45240756860` on `4c0211a`), and submitted via Palomar's sanctioned 5-step `gh` API verification.
- **Peer & Replication Outreach Kits:** Added `docs/outreach-drafts.md` (Lean Zulip technical review post, 5-sentence arXiv endorsement email, PCI Neuroscience / PREreview blurb, and replication form link).
- **Zenodo DataCite DOI Minting & ORCID Cleanup:** Enabled Zenodo GitHub integration for automatic CERN DataCite DOI archival on this release, uploaded `social-preview.png` to GitHub repository settings, and updated ORCID `0009-0006-8168-9648` biography to `Independent Researcher, Spokane, WA, USA`.

### Fixed
- **Canonical SPDX `LICENSE` Detection:** Replaced root `LICENSE` with verbatim canonical Apache-2.0 text and moved the CC-BY-4.0 content license notice to `docs/LICENSE-CONTENT.md` so GitHub and Palomar `licensee` unambiguously detect `Apache-2.0`.

## [1.1.0] - 2026-11-23

### Added
- **Palomar Registry `module` Headers (`lean/`):** Added Lean 4.35.0 `module` headers and `@[expose]` definitions to `Challenge.lean`, `Solution.lean`, `NonVacuity.lean`, and `VerifyAxioms.lean` (re-verified across all 6 kernels).
- **Live Citation & Retraction Audit (`scripts/verify_citations.py`, `docs/citation-audit.json`):** Verified all `23/23` BibTeX entries live against the Crossref API (`0` dead links, `0` retractions). *(2026-11-26 statement audit: one of these DOIs resolves to an unrelated paper, and the checker does not compare titles or authors; see `ERRATA.md`.)*
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
