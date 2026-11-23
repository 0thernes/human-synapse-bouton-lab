# Service Level Objectives & Alerts (`slos.md`)

Prepared per Build Pipeline Models v1.0.0 (`P10.02`).

| Service / Surface | SLI (Indicator) | SLO Target | Alert / Detection Mechanism | Owner Action on Breach |
|---|---|---|---|---|
| **GitHub Pages Workbench (`https://0thernes.github.io/human-synapse-bouton-lab/`)** | HTTP `200` availability & clean static bundle deploy | `>= 99.9%` monthly availability (GitHub Pages SLA) | `.github/workflows/pages.yml` failure email notification to owner GitHub account | Inspect Pages workflow logs; revert offending commit on `main` (`docs/ops/runbook.md`). |
| **Weekly Multi-Language & Formal CI (`.github/workflows/ci.yml`)** | 12/12 verification jobs passing (Lean 6-kernel, TS, Rust, Python, Audit, Security, Papers) | `100%` green on `main` pushes and Monday `06:00 UTC` cron | GitHub Actions failure notification to owner email (`0_0@0thernes.art`) | Diagnose broken toolchain/dependency pin, patch forward, log in `ERRATA.md` if scientific output affected. |
| **Security & Supply-Chain Posture** | Open High/Critical Dependabot or `npm audit` alerts | `0` open High/Critical alerts (`<= 7` days MTTR for new CVEs) | GitHub Dependabot security alert notifications + CI `osv-scanner` & `gitleaks` | Upgrade lockfile, verify full test suite, tag patch release `v1.1.x`. |
| **Optional Local FastAPI Server (`/healthz`)** | Local `GET /healthz` response code & compute p95 latency | HTTP `200`, `< 50 ms` p95 on local workstation | Structured JSON request logs to stderr | Restart `uv run synapse-api` or container; static Pages workbench stays unaffected. |
