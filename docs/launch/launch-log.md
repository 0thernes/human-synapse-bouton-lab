# Launch-Day & Release Operations Log (`launch-log.md`)

Prepared per Build Pipeline Models v1.0.0 (`P9.07`).

## 2026-11-23 — Staged Rollout (`v1.0.0` -> `v1.1.0` -> `v1.1.1` -> `v1.1.2`)

1. **`v1.0.0` (Initial Full-Stack Release):**
   - Pushed clean monorepo (`Lean 4.35.0`, `Rust`, `TypeScript`, `Python`), 2 AMS-LaTeX white papers, figures, GIF, and 2 HD MP4 videos.
   - Caught & fixed `npm ci` `EBADPLATFORM` (`optional: true` on 26 platform packages) and Lean comment scan false positive in CI; verified `12/12` CI jobs green and Software Heritage snapshot `swh:1:snp:1a278fff55465dbe8d0b870408b6468822eb3e8b`.
2. **`v1.1.0` (Playbook & Security Hardening):**
   - Upgraded `pillow` (`13.0.0`), `vite` (`6.4.6`), `vitest` (`4.1.12`), `pytest` (`9.2.0`), reducing open GitHub Dependabot alerts from `156` to **`0`** and `npm audit` to **`0`**.
   - Added Palomar `module` headers & `@[expose]`, `ERRATA.md`, digest-pinned `Dockerfile`, 23/23 live Crossref citation audit (`docs/citation-audit.json`), root `MANIFEST.sha256` + DigiCert RFC 3161 `.tsr`, and 6-kernel `lake comparator --paranoid` CI pass (`45234241381`).
   - Archived `v1.1.0` in Software Heritage (`swh:1:snp:458adcd73c9a78054486147094950e2be6774271`).
3. **`v1.1.1` (Palomar Compliance, Zenodo DOI, ORCID & Social Preview):**
   - Replaced mixed root `LICENSE` with verbatim canonical `Apache-2.0` and moved `CC-BY-4.0` to `docs/LICENSE-CONTENT.md`; updated `lean/formalization.yaml` to official `v0.4` schema (`relationship: "other"`).
   - Passed Palomar preflight (`45240756860`) and official Palomar verification (`68sy455wsdm5`, run `45241561032`).
   - Uploaded GitHub Social Preview (`docs/media/social-preview.png`), cleaned ORCID bio (zero `"0thernes LLC"`), enabled Zenodo webhook -> minted live DataCite DOIs (`10.5281/zenodo.24477928`, Concept `10.5281/zenodo.24477927`), and published `10.5281/ZENODO.24477928` publicly on ORCID `0009-0006-8168-9648`.
   - Verified GitHub Pages (`45242057651`) HTTP `200` and `0thernes-research-archive` CI (`45242074819`) green.
4. **`v1.1.2` (Final Sweep — Build Pipeline Models v1.0.0 Closure & Provenance Re-Seal):**
   - Fixed 5 stale `LICENSE-CONTENT` links (`F11`), fixed `scripts/pipeline-audit.py` `glob.escape(root)` bracket bug (`F14`), generated `api/openapi.yaml`, added complete Build Pipeline Models `P0`–`P11` artifacts (`F13`), embedded Zenodo DOI + Palomar pass into both white papers, recompiled PDFs & arXiv tarballs, re-sealed `MANIFEST.sha256` + DigiCert `.tsr` (`F12`), and synced `0thernes-research-archive`.
   - Zero production errors or incidents observed during launch day.
