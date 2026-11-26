# 3-Cycle Deep Forensic Hardening Log, Repository Index & Table of Contents (`v1.3.0`)

This document records the complete **Repository Index & Table of Contents** and all **three exhaustive forensic hardening cycles** performed across every folder, file, syntax layer, formal proof, numerical boundary, workflow, dataset, figure, and AMS-LaTeX white paper in `human-synapse-bouton-lab` (`v1.2.0 -> v1.3.0`, November 25, 2026), audited against:
1. **Build Standard v1.1.0** (`I:\All GH Repos\Repo Checklist`, 79/79 checks, Core 33/33)
2. **Build Pipeline Models v1.0.0** (`I:\All GH Repos\Build Pipeline Models`, `P0`–`P11` lifecycle artifacts)
3. **Defensible Independent AI Research Playbook Edition 1.3** (`I:\White Papers\DEFENSIBLE_INDEPENDENT_AI_RESEARCH_PLAYBOOK.md`, Nov 24, 2026)
4. **Unsolved Problems Mega-Atlas** (`0thernes/unsolved-problems-mega-atlas`, `1,900` problems across `28` superdomains)

---

## Repository Index & Table of Contents

| Directory / Root Group | Scope & Key Files | Cycle 1–3 Hardening Status |
|---|---|---|
| **Root Governance & Provenance** | `README.md`, `VERSION`, `LICENSE`, `NOTICE`, `AUTHORS.md`, `CITATION.cff`, `CITATION.bib`, `.zenodo.json`, `croissant.json`, `CHANGELOG.md`, `CLAIMS.md`, `PREREGISTRATION.md`, `DEVIATIONS.md`, `ERRATA.md`, `LIMITATIONS.md`, `REPLICATION.md`, `HARDENING_LOG.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md`, `Dockerfile`, `justfile`, `repo.yaml`, `project.yaml`, `sbom.cdx.json`, `llms.txt`, `llms-full.txt`, `MANIFEST.sha256`, `MANIFEST.sha256.tsr` | **100% Audited & Synchronized (`v1.3.0`)** |
| **`.github/workflows/`** | `ci.yml` (6-kernel Lean, 3-OS Node/Rust/Python+Differential, Build Standard audit, gitleaks+osv-scanner, README axiom drift), `pages.yml` (workbench + `/blueprint/`), `release.yml` (SLSA v4 attestations + SHA256SUMS) | **100% Node 24 Native (`@v7`/`@v6`/`@v5`/`@v10`/`@v4`); retired `palomar-preflight.yml`** |
| **`lean/`** | `Challenge.lean` (24 statements), `Solution.lean` (24 pure zero-Mathlib zero-`Classical.choice` proofs), `NonVacuity.lean` (26 concrete witnesses), `AdversarialChecks.lean` (6 counterexample proofs), `VerifyAxioms.lean`, `lakefile.toml`, `lean-toolchain` (`4.35.0`), `comparator.json`, `formalization.yaml` | **24/24 Theorems + 26 Witnesses + 6 Adversarial Checks; 6 Kernels Clean** |
| **`blueprint/`** | `index.html` (self-contained interactive SVG Dependency DAG & 24-theorem inspector deployed to `/blueprint/`) | **NEW in `v1.3.0` (Playbook v1.3 Item 11)** |
| **`packages/synapse-core/`** | Strict TypeScript biophysical engine (`constants.ts`, `electrophysiology.ts`, `electrochemistry.ts`, `hodgkinHuxley.ts`, `snare.ts`, `bioenergetics.ts`, `metrology.ts`, `prng.ts`, `traceAnalyzer.ts`, `verification.ts`, `openProblems.ts`), `tests/synapse.test.ts` (13 suites, 3,600+ `fast-check`), `scripts/bench.mjs` | **Hardened `F25` (`u0 <= 1`), `F31` (monotonic trace timestamps), `F27` (observational factorization)** |
| **`apps/web/`** | 9-tab accessible Vite + Three.js + Chart.js workbench (`index.html`, `src/main.ts`, `src/scene3d.ts`, `src/styles.css`, `src/i18n/en.json`, `public/media/*`) | **Hardened `F32` (graceful WebGL fallback), `F33` (`v1.3.0`, live `/blueprint/` links)** |
| **`rust/synapse-sim/`** | Deterministic `ChaCha8Rng` Monte Carlo & benchmark engine (`src/lib.rs`, `src/main.rs`, `Cargo.toml`), 2,000 `proptest` cases | **Hardened `F22` (`CARGO_PKG_VERSION`), `F34` (upfront `firing_rate_hz`/`offset`/`cleft`/`temp` guards), `clippy -D warnings` clean** |
| **`python/synapse_science/`** | 50-digit `mpmath`/rational oracle (`oracle.py`), FastAPI server (`server.py`), pre-registered stats (`stats_experiments.py`), media/figure/video renderer (`generate_media.py`), tests (`test_oracle_and_api.py`, `test_differential.py`) | **Hardened `F24` (`_check_finite` NaN/Inf guards), `F33` (dynamic `VERSION`, 24 theorems), `6/6` mutation kills** |
| **`papers/` & `dist/`** | `papers/wp1_synaptic_bouton/main.tex`, `papers/wp2_open_problems_consciousness/main.tex`, `papers/references.bib` (23/23 Crossref-resolved at the time; one DOI was later found to resolve to an unrelated paper, see `ERRATA.md`), `papers/figures/fig1..5.{pdf,png}`, `dist/Donahue_2026_*.pdf`, `dist/arxiv_*.tar.gz`, `dist/SHA256SUMS` | **Hardened `F28` (0 Overfull/Underfull `\hbox`, 0 `hyperref` duplicate anchor warnings); Mega-Atlas Crosswalk table added** |
| **`data/`** | `data/experiments/per_seed_results.csv`, `data/experiments/stats_summary.json`, `data/benchmarks/rust_bench.json`, `data/benchmarks/node_bench.json`, `data/MANIFEST.sha256` | **Repaired `F21` (corrupted `node_bench.json`), updated `data/MANIFEST.sha256` & `croissant.json`** |
| **`scripts/`** | `dev.sh`, `Audit-Repo.ps1`, `audit-repo.sh`, `pipeline-audit.py`, `build_papers.py`, `mutation_audit.py`, `verify_citations.py`, `check_readme_axioms.py` | **Fixed `F21`/`F23` (`dev.sh`), `F33` (`verify_citations.py`), added `check_readme_axioms.py`** |
| **`docs/`** | `architecture.md`, `benchmarks.md`, `verification.md`, `statement-fidelity.md`, `mega-atlas-crosswalk.md`, `AI_DISCLOSURE.md`, `PRESERVATION.md`, `literature-and-checklist.md`, `citation-audit.json`, `lean-axioms-report.txt`, `adr/*`, `plan/*`, `launch/*`, `ops/*`, `reviews/*`, `media/*` | **Synchronized all stale SWHIDs, DOIs, witness counts (`26`), and retired Palomar refs (`F27`)** |
| **`api/`, `examples/`, `reports/`** | `api/openapi.{yaml,json}`, `examples/nanocolumn_example.mjs`, `examples/exact_oracle_example.py`, `reports/security/2026-11-23-audit.md` | **Synchronized to `v1.3.0` & verified executable** |

---

## Cycle 1 — Full-Repository Programmatic Forensic Scan & Mega-Atlas Audit

1. **Mega-Atlas 1,900-Problem Scan:** Programmatically inspected all 1,900 rows (`48` columns, `28` superdomains) of `unsolved-problems-mega-atlas/outputs/MegaAtlas_Unsolved_Problems_V2.csv`. Verified **honest result: `0 / 1,900` open problems fully solved**, with `18` highest-CSS Atlas entries mapped in [`docs/mega-atlas-crosswalk.md`](docs/mega-atlas-crosswalk.md).
2. **File-by-File Defect Discovery (`F21`–`F34`):**
   - `F21` (`bug` — CRITICAL): `data/benchmarks/node_bench.json` failed `json.loads()` due to `npm run bench` banner stdout on lines 2–3.
   - `F22` (`bug`): `rust/synapse-sim/src/main.rs:140` hardcoded `v1.0.0`.
   - `F23` (`bug`): `scripts/dev.sh:82` failed Lean forbidden-token grep on line 7 comment in `Solution.lean`.
   - `F24` (`bug`): `python/synapse_science/oracle.py` lacked `math.isfinite()` validation on `NaN`/`Inf`.
   - `F25` (`bug`): `packages/synapse-core/src/hodgkinHuxley.ts` lacked `u0 <= 1` upper-bound check.
   - `F26` (`issue`): 16 GitHub Actions Node 20 deprecation annotations; missing `_native` axiom grep & README axiom drift check.
   - `F27` (`error`): Stale `.zenodo.json` SWHID (`1a278fff`), stale `CITATION.cff` `v1.1.2` DOI/SWHID, stale `19` witness counts across 6 docs, stale retired Palomar refs across 10 docs, stale `CS-DED-01` causal wording in `openProblems.ts`.
   - `F28` (`issue`): LaTeX Overfull/Underfull `\hbox` and 9 `hyperref` duplicate anchor warnings in WP1 & WP2.
   - `F29` (`issue`): Missing Nov 24 Playbook Edition 1.3 gold-standard artifacts (README verbatim `#print axioms` 5-Second Proof block, live `/blueprint/` Proof DAG, `AdversarialChecks.lean`, Withdrawal Policy, `CITATION.bib`, `AUTHORS.md`, `NOTICE`, `croissant.json`, `docs/statement-fidelity.md`, `docs/AI_DISCLOSURE.md`, `docs/PRESERVATION.md`, `docs/mega-atlas-crosswalk.md`, `HARDENING_LOG.md`).
   - `F30` (`enhancement`): Opportunity to deepen pure Lean 4.35.0 suite from 18 to 24 substantive algebraic/inductive/dynamical theorems + 26 concrete witnesses.
   - `F31` (`bug`): `traceAnalyzer.ts` documented monotonic timestamp rejection without implementing it.
   - `F32` (`bug`): `apps/web/src/scene3d.ts` lacked `try/catch` fallback when WebGL context creation fails.
   - `F33` (`bug`): Hardcoded `v1.0.0`/`v1.1.0`/`18 Theorems` literals in `apps/web/src/main.ts`, `generate_media.py`, `verify_citations.py`, and `"5 local checkers"` in WP2.
   - `F34` (`bug`): Rust `run_monte_carlo_bouton` did not validate `firing_rate_hz`, `nanocolumn_offset_nm`, `cleft_width_nm`, or `temp_c` upfront.

---

## Cycle 2 — Surgical Fixes, 24-Theorem Formal Upgrade & Zero-Warning Papers

- Upgraded `lean/` to **24 pure theorems + 26 witnesses + 6 adversarial counterexamples**, verified across all 5 local kernels (`58,034` declarations) and 6 Ubuntu CI kernels (`0` warnings, `0` `sorry`, `0` `Classical.choice`, `0` `_native`).
- Patched every single Cycle 1 bug (`F21`–`F34`) across TypeScript, Three.js, Rust, Python, Shell, GitHub Actions, JSON/YAML/TOML metadata, and both AMS-LaTeX manuscripts.
- Rebuilt deterministic figures (`fig1`–`fig5`), blueprint (`tripartite_bouton_blueprint.png`), social preview (`social-preview.png`), GIF/MP4 videos, and both frozen PDFs + standalone verified arXiv source tarballs with **0 Overfull `\hbox`, 0 Underfull `\hbox`, and 0 `hyperref` warnings**.

---

## Cycle 3 — Exhaustive Adversarial Re-Audit & Clean-Clone Verification

Verified prior to `v1.3.0` tag push:
1. **Programmatic Forensic Scanner:** `0` invalid JSON/YAML/TOML/CSV files, `0` broken relative Markdown links, `0` stale `19` witness / `0thernes LLC` / active Palomar / old SWHID drifts, `0` placeholder tokens, `0` private review leaks.
2. **Full 4-Language Suite (`bash scripts/dev.sh test` + linters + mutation + citations):**
   - Lean 4.35.0: `24/24` axioms verified, `scripts/check_readme_axioms.py` PASS, 5 local kernels + 6 CI kernels PASS.
   - TypeScript: `13/13` Vitest PASS, ESLint `0` errors, `tsc --noEmit` `0` errors.
   - Rust: `5/5` Cargo tests PASS, `cargo clippy --all-targets --locked -- -D warnings` `0` warnings.
   - Python: `9/9` Pytest + `2,000` differential cross-checks PASS, `ruff` `0` errors, `mypy` `0` errors, `mutation_audit.py` `6/6` (`100.0%`) killed, `verify_citations.py` `23/23` live Crossref verified (`0` retractions). *(2026-11-26 statement audit: one of these DOIs resolves to an unrelated paper, and the checker does not compare titles or authors; see `ERRATA.md`.)*
3. **Compliance Audits:** Build Standard v1.1.0 `Audit-Repo.ps1` & `audit-repo.sh` **100.0% (`79/79`, Core `33/33`)**; Build Pipeline Models `pipeline-audit.py` **100% PASS**.
4. **Cryptographic Seals:** `MANIFEST.sha256` (`100% OK`), `data/MANIFEST.sha256` (`100% OK`), `dist/SHA256SUMS` (`100% OK`), DigiCert RFC 3161 `MANIFEST.sha256.tsr`, and clean-clone reproduction in isolated temp directory PASS.
