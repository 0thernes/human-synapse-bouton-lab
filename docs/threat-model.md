# Threat Model (STRIDE)

Security threat model for `human-synapse-bouton-lab` v1.0.0 (Build Standard B36).

## Assets & Trust Boundaries

1. **Scientific integrity & formal proofs (`lean/`, `data/MANIFEST.sha256`, `dist/SHA256SUMS`):** Must not be silently altered or pass invalid proofs.
2. **Untrusted client trace payloads (`analyzeExperimentalTrace` in `@synapse/core` and `apps/web`):** Accepts user-pasted CSV/JSON strings.
3. **FastAPI REST endpoints (`/api/v1/*`):** Accepts external JSON payloads over HTTP when run locally.
4. **Build & release supply chain (`.github/workflows/`):** Generates release tarballs, PDFs, `SHA256SUMS`, and Sigstore SLSA attestations.

## STRIDE Analysis

| Category | Threat | Entry Point | Mitigation | Linked Test / Check |
|---|---|---|---|---|
| **Spoofing** | Forged authorship or fake CI logs claiming verified results. | Git history, README badges, releases | Real author identity (`A23`), public GitHub Actions CI (`A10`), Sigstore SLSA attestations (`actions/attest-build-provenance@v2`), `SHA256SUMS`, Software Heritage SWHID. | `.github/workflows/release.yml` |
| **Tampering** | Silent modification of Lean theorem statements or experiment datasets. | `lean/`, `data/` | Isolated `Challenge.lean` vs `Solution.lean` (`lake comparator`), multi-kernel replay (`leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`), `data/MANIFEST.sha256`. | `lean/VerifyAxioms.lean`, `data/MANIFEST.sha256` |
| **Repudiation** | Post-hoc p-hacking or hidden parameter tuning after viewing Monte Carlo output. | Statistical claims | Immutable `PREREGISTRATION.md` committed prior to execution (root SHA `a1919f2`), append-only `DEVIATIONS.md`, append-only `docs/run-log.md`. | `PREREGISTRATION.md`, `DEVIATIONS.md` |
| **Information Disclosure** | Accidental commit of API tokens, `.env`, or personal data. | Git commits, API logs | `.gitignore` blocks `.env`; `gitleaks` full-history scan in CI; no personal data collected (`personal_data: false`); structured logs omit bodies. | `.github/workflows/ci.yml` (`security` job), `Audit-Repo.ps1` (`hygiene`) |
| **Denial of Service** | Oversized or malformed CSV/JSON trace freezing browser or API server. | `analyzeExperimentalTrace`, FastAPI `/api/v1/*` | Hard 2 MB trace payload cap (`MAX_TRACE_BYTES`), explicit `TraceParseError`, strict Pydantic v2 finite bounds (`gt=0`, `le=...`) rejecting invalid payloads with HTTP 422. | `packages/synapse-core/tests/synapse.test.ts` (B06), `python/tests/test_oracle_and_api.py` |
| **Elevation of Privilege** | XSS injection via untrusted text rendered into DOM in `apps/web`. | DOM rendering in `apps/web/src/main.ts` | HTML escaping helper (`esc()`) applied to all dynamic/error text; no `eval()`, no dynamic script tags, strict CORS allowlist on FastAPI (`allow_credentials=False`). | `apps/web/src/main.ts`, `python/synapse_science/server.py` |
