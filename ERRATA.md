# Errata & Corrections Log

Append-only public record of every error, bug, discrepancy, and correction identified in `human-synapse-bouton-lab`, its source prototype/monograph inputs, its pre-registered experiments, and its white papers (per the Independent Scientist's Verification Playbook & Build Standard B04/B07).

---

## E01 — Pre-Registered Hypothesis H3 (`40 Hz`) Refuted (`F09`, `C05`)
- **Date:** 2026-11-23 (`v1.0.0`)
- **Finding Class:** `error`
- **Affected Artifacts:** `PREREGISTRATION.md`, `CLAIMS.md` (`C05`), White Paper 1 §4
- **What Happened:** `PREREGISTRATION.md` (committed at `a1919f2` prior to execution) predicted that mitochondrial OxPhos (`950,000 ATP/s`) would maintain $>90\%$ bouton ATP over `60 s` at `40 Hz`. Upon execution, resting V-ATPase $\text{H}^+$ leak (`4,000 ATP/s`) plus `40 Hz` firing cost (`40 * 32,000 = 1,280,000 ATP/s`) totaled `1,284,000 ATP/s`, exceeding mitochondrial supply (exact critical frequency $f_{\text{crit,mito}} = (950,000 - 4,000)/32,000 = 29.5625\,\text{Hz}$). Both treatment and control arms depleted to `0.0` (`p_Holm = 1.0000`, Cliff's $\delta = 0.00$).
- **Correction:** Preserved verbatim as **refuted / retracted** (`C05` in `CLAIMS.md` and White Paper 1). Logged a separately labeled post-hoc exploratory comparison `H3b` at `20 Hz` in `DEVIATIONS.md` (`1.00` vs. `0.00`, $p_{\text{Holm}} = 0.0005$).

## E02 — Legacy Prototype v9 & Monograph Edition 2 Corrections (`F01`, `F02`, `F03`, `F04`)
- **Date:** 2026-11-23 (`v1.0.0`)
- **Finding Classes:** `conflict` (`F01`), `bug` (`F02`), `error` (`F03`), `issue` (`F04`)
- **What Was Corrected:**
  1. **`F01`:** Replaced unformed `"0thernes LLC"` entity name and `"MIT / All Rights Reserved"` headers with `"Alexander Stephen Donahue (Independent Researcher, Spokane, WA, USA; ORCID 0009-0006-8168-9648)"` and dual open licensing (`Apache-2.0` code + `CC-BY-4.0` manuscripts/media; ADR 0001).
  2. **`F02`:** Replaced unseeded `Math.random()` and uncapped raw `JSON.parse()` in legacy HTML v9 with deterministic Mulberry32 / `ChaCha8Rng` and hardened `TraceParseError` (2 MB cap) + regression tests (`B07`).
  3. **`F03`:** Separated rat synaptosome vesicle baseline (`374`, Wilhelm et al. 2014) from adult human temporal cortex L1/L4/L5 boutons (`3,500` / `1,800` / `1,500`, Rollenhagen et al. 2019–2024) with Lean conservation theorem `T09`.
  4. **`F04`:** Replaced missing local asset `4163_audit.jpg` with deterministic code-rendered `tripartite_bouton_blueprint.png`, publication figures `fig1`–`fig5`, animated GIF, and HD H.264 MP4 videos.

## E03 — `v1.0.0` → `v1.1.0` Audit Hardening & `F01`–`F10` Reconciliation (`F05`, `F10`)
- **Date:** 2026-11-23 (`v1.1.0`)
- **Finding Classes:** `problem` (`F05`), `issue` (`F10`)
- **What Was Corrected:**
  1. **Findings Ledger Alignment:** Standardized `F01`–`F10` identically across `packages/synapse-core/src/openProblems.ts`, `docs/reviews/2026-11-23-redteam.md`, White Paper 2 Table 2, and the Web UI Findings tab (`v1.0.0` had truncated `F09`–`F10` in `openProblems.ts` and `F10` in the redteam review/WP2).
  2. **Palomar Registry `module` Headers:** Added Lean 4.35.0 `module` headers and `@[expose]` definitions to `Challenge.lean`, `Solution.lean`, `NonVacuity.lean`, and `VerifyAxioms.lean` (re-verified by all 6 kernels).
  3. **Live Citation & Retraction Audit:** Verified all 23 BibTeX entries live against the Crossref API (`docs/citation-audit.json`: `23/23 verified`, `0 retracted`, `0 errors`).
  4. **Dependency Security Upgrades:** Upgraded `pillow` (`11.3.0 -> 13.0.0`), `vite` (`6.2.2 -> 6.4.6`), `vitest` (`3.0.9 -> 4.1.12`), and `typescript-eslint`, bringing `npm audit` to `0 vulnerabilities`.
  5. **Provenance Upgrades:** Added root `MANIFEST.sha256`, RFC 3161 trusted timestamp token (`MANIFEST.sha256.tsr`), pinned `Dockerfile`, `docs/literature-and-checklist.md`, `ERRATA.md`, and verified Software Heritage SWHID (`swh:1:snp:1a278fff55465dbe8d0b870408b6468822eb3e8b`) in `CITATION.cff`, `.zenodo.json`, and both white papers.
