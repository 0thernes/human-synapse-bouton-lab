# P2 Success Metrics & Guardrails (`02-metrics.md`)

Prepared per Build Pipeline Models v1.0.0 (`P2.05`). Next scheduled metric review: **2026-12-23**.

## North-Star Metric

- **Independent Verification & Archival Completeness Score:** Percentage of independent machine-verifiable reproducibility and integrity gates passing simultaneously across all 4 languages, 6 Lean kernels, Build Standard v1.1.0, cryptographic manifests, and external scholarly registries.
  - **Target:** `100%` of automated internal gates green + live DOI, SWHID, ORCID, and Palomar Registry acceptance.
  - **Current Measured Value (2026-11-23):** Internal automated gates `100%` (12/12 CI jobs, 6/6 Lean kernels, 79/79 Build Standard, 0/2,000 differential errors, 6/6 mutants killed, 23/23 DOIs live, 0 open Dependabot alerts); Zenodo DOI (`10.5281/zenodo.24477928`), ORCID Works, and SWHID live; Palomar `68sy455wsdm5` passed mechanical verification (`45241561032`, awaiting editorial review).

## Input Metrics

| Metric | Target | Current Value (2026-11-23) | Measurement Command / Source |
|---|---|---|---|
| Lean 4.35.0 theorems & non-vacuity witnesses | `>= 18` theorems, `>= 18` witnesses, `0` `sorry` | `18` theorems, `19` witnesses, `0` `sorry` | `cd lean && lake build --wfail && lake env lean VerifyAxioms.lean` |
| Independent Lean kernels passing | `6 / 6` | `6 / 6` | Ubuntu CI `lake comparator --paranoid` (`45234241381`) |
| Cross-language differential checks (`rtol <= 1e-10`) | `>= 2,000` checks, `0` mismatches | `2,000 / 2,000` pass | `uv run pytest python/tests/test_differential.py` |
| Targeted mutation-kill ratio | `100%` (`6 / 6`) | `100%` (`6 / 6`) | `uv run python scripts/mutation_audit.py` |
| Bibliography live DOI & retraction audit | `100%` verified, `0` retractions | `23 / 23` verified, `0` retractions | `uv run python scripts/verify_citations.py` |
| Build Standard v1.1.0 audit score | `100.0%` (`79 / 79`, Core `33 / 33`) | `100.0%` (`79 / 79`, Core `33 / 33`) | `pwsh -File scripts/Audit-Repo.ps1 -Path .` |
| External human replications logged | `>= 1` by 2027-02-23 | `0` (outreach templates staged in `docs/outreach-drafts.md`) | GitHub Issues (`replication` label) |

## Guardrail Metrics (Must Never Regress)

| Guardrail | Hard Threshold | Current Value (2026-11-23) |
|---|---|---|
| Open security vulnerabilities (`npm audit` + GitHub Dependabot) | `0` | `0` |
| Committed secrets (`gitleaks`) | `0` | `0` |
| Root `MANIFEST.sha256` & `data/MANIFEST.sha256` integrity failures | `0` | `0` (re-sealed for `v1.1.2`) |
| Unverified or retracted claims left unflagged in `README.md` / papers | `0` | `0` (`C05` explicitly retracted) |
| Monthly direct cloud/hosting spend | `<= \$5.00 / mo` | `\$0.00 / mo` |
| Push gates / branch protection / mandatory PR approvals (`R1`, `R9`) | `0` | `0` |
