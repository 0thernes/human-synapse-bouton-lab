# P6 Vertical Slices Plan & Delivery Status (`slices.md`)

Prepared per Build Pipeline Models v1.0.0 (`P6.01`). Each slice delivers an end-to-end verifiable increment committed straight to `main` (`R1`, `P6.07`).

| Slice | Title | Journeys Covered | Key Evidence & Acceptance Verification | Status |
|---|---|---|---|---|
| **S1** | Repo Foundation & Build Standard v1.1.0 Core | `P5` setup | `LICENSE` (Apache-2.0), `docs/LICENSE-CONTENT.md`, `AGENTS.md`, lockfiles, `justfile`, `Audit-Repo.ps1` `100% (79/79)` | **Shipped** |
| **S2** | Pure Lean 4.35.0 Proof Core (18 Theorems + 19 Witnesses) | `J2` | `lean/Challenge.lean`, `Solution.lean`, `NonVacuity.lean`, `VerifyAxioms.lean`, 6-kernel CI `45234241381`, Palomar `CI-6-kernel` | **Shipped** |
| **S3** | Shared Strict TypeScript Core (`packages/synapse-core`) | `J1`, `J3` | 13/13 Vitest tests (3,600+ `fast-check`, F02/F03/F01-F10 regressions), ESLint 0 errors | **Shipped** |
| **S4** | Rust Native Monte Carlo Engine (`rust/synapse-sim`) | `J3` | `ChaCha8Rng` 30-seed sweeps, 5/5 Cargo tests (2,000 `proptest`), Clippy 0 warnings, `5.94x` speedup | **Shipped** |
| **S5** | Python 50-Digit Oracle, FastAPI & Pre-Registered Stats | `J3`, `J4` | 9/9 Pytest (2,000 differential checks `0` mismatches), `6/6` mutants killed, `api/openapi.yaml` & `openapi.json`, `ruff`/`mypy` 0 errors | **Shipped** |
| **S6** | Accessible 9-Tab Interactive Web Workbench (`apps/web`) | `J1` | Vite 6 + Three.js + Chart.js deployed live to GitHub Pages (`45242057651`, HTTP 200) | **Shipped** |
| **S7** | Deterministic Scientific Figures, GIF & HD H.264 Videos | `J1`, `J5` | `fig1`–`fig5` (PDF/PNG), `tripartite_bouton_blueprint.png`, `social-preview.png`, GIF, 2 MP4s | **Shipped** |
| **S8** | White Papers 1 & 2 + Standalone arXiv Tarballs + Provenance | `J5` | `dist/*.pdf`, `dist/arxiv_*.tar.gz`, `dist/SHA256SUMS`, `MANIFEST.sha256` + DigiCert RFC 3161 `.tsr`, 23/23 live Crossref DOIs | **Shipped** |
| **S9** | Security Hardening, External Archival & Build Pipeline Closure (`v1.1.0`–`v1.1.2`) | `P7`–`P11` | `0` Dependabot alerts, Zenodo DOI `10.5281/zenodo.24477927`, ORCID synced, SWH archived, 6-kernel repository CI (prior Palomar submission cleanly withdrawn), `P0`–`P11` artifacts | **Shipped (`v1.1.2`)** |
