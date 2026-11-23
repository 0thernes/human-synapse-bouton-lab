# Build Pipeline Models v1.0.0 — Applied Checklist (`docs/plan/checklist.md`)

Ticked only when backed by observed evidence (`AI07`, `AI15`). Non-applicable SaaS/SQL/AI-runtime items are explicitly marked `n/a` with reasons (`project.yaml`).

## P0 Idea and Red-Team
- [x] **P0.01–P0.05, P0.08:** One-liner, 5 Purple Cow angles, 3 Reframes, power-law upside, margin of safety, and 3-day appetite recorded in [`docs/plan/00-idea.md`](00-idea.md).
- [x] **P0.06:** Five riskiest assumptions tagged (`value`, `usability`, `feasibility`, `ethics`) in [`docs/plan/00-redteam.md`](00-redteam.md).
- [x] **P0.07:** Four measurable kill/pivot criteria (`KC01`–`KC04`) with thresholds and dates in [`docs/plan/kill-criteria.md`](kill-criteria.md).
- [x] **P0.F4:** Parking lot of out-of-scope future ideas in [`docs/plan/ideas.md`](ideas.md).

## P1 Problem, User and Market Validation
- [x] **P1.01, P1.03, P1.06:** Target users, 6-row alternatives table, and dependency licensing/terms audit in [`docs/plan/01-validation.md`](01-validation.md).
- [n/a] **P1.02, P1.04:** Non-commercial open-science independent research publication; commercial customer interviews and paid demand funnels do not apply (zero fabricated data; external validation uses Palomar CI, Zenodo DOI, and replication protocol).
- [x] **P1.05:** Five measured technical feasibility spikes (`SP01`–`SP05`) in [`docs/plan/01-spikes.md`](01-spikes.md).
- [x] **P1.07:** Dated go/hold/double-down decisions with evidence in [`docs/plan/decision-log.md`](decision-log.md).

## P2 Requirements and Success Metrics
- [x] **P2.01–P2.04, P2.06:** Problem, users, scope, 5 non-goals, journeys `J1`–`J5` with Given/When/Then criteria, measurable NFRs, and MoSCoW in [`docs/plan/02-requirements.md`](02-requirements.md).
- [x] **P2.05:** North-star, input, and guardrail metrics with targets and review date in [`docs/plan/02-metrics.md`](02-metrics.md).
- [x] **P2.07:** Full Claims Ledger in [`CLAIMS.md`](../../CLAIMS.md).

## P3 Systems Design and Architecture
- [x] **P3.01, P3.06, P3.09:** C4 Level 1 & Level 2 Mermaid diagrams, Scaling plan, and Observability (`/healthz`, JSON logs, CI schedule) in [`docs/architecture.md`](../architecture.md).
- [x] **P3.02:** Canonical entities, keys, sources of truth, and integrity seals in [`docs/data-model.md`](../data-model.md).
- [x] **P3.03:** Machine-generated OpenAPI 3.1 contract in [`api/openapi.yaml`](../../api/openapi.yaml) and [`api/openapi.json`](../../api/openapi.json).
- [x] **P3.04:** Threat model in [`docs/threat-model.md`](../threat-model.md).
- [x] **P3.05:** Sourced cost model (`\$0.00/mo` active tier) in [`docs/cost-model.md`](../cost-model.md).
- [x] **P3.07:** Per-component failure-mode matrix in [`docs/failure-modes.md`](../failure-modes.md).
- [x] **P3.08:** Six Architecture Decision Records (`0001`–`0006`) indexed in [`docs/adr/README.md`](../adr/README.md).

## P4 Stack Selection
- [x] **P4.01–P4.04:** Weighted stack decision matrix and build-vs-buy exit paths in [`docs/stack-matrix.md`](../stack-matrix.md).
- [n/a] **P4.05:** Zero runtime AI/LLM calls or model weights; documented with dev-time AI disclosure in [`docs/ai-choices.md`](../ai-choices.md).
- [x] **P4.06:** Deploy target and atomic rollback ADR in [`docs/adr/0006-deploy-target-and-rollback.md`](../adr/0006-deploy-target-and-rollback.md).
- [x] **P4.07:** Compatible third-party licenses and zero open CVEs in [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md) and [`sbom.cdx.json`](../../sbom.cdx.json).

## P5 Repo and Environment Setup
- [x] **P5.01–P5.07:** Repo live on GitHub, Build Standard v1.1.0 **100.0% (79/79, Core 33/33)**, pinned lockfiles (`lean-toolchain`, `Cargo.lock`, `uv.lock`, `package-lock.json`), `justfile`, `.env.example`, `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`/`.cursor/rules/*.mdc`, digest-pinned `Dockerfile`.

## P6 Build in Vertical Slices
- [x] **P6.01–P6.04, P6.07–P6.08:** Slices `S1`–`S9` in [`docs/plan/slices.md`](slices.md), live GitHub Pages walking skeleton + all 9 tabs, multi-language test suites (Vitest, Cargo, Pytest, Lean), `docs/run-log.md`, direct `main` commits, and [`CHANGELOG.md`](../../CHANGELOG.md).
- [n/a] **P6.05, P6.06:** No runtime AI prompts/evals (`prompts/`, `evals/`) and no hidden feature flags (`docs/flags.md`) — all 9 modules ship complete. Note: monorepo places source/tests cleanly under `packages/synapse-core/`, `apps/web/`, `rust/synapse-sim/`, `python/`, and `lean/` rather than single-language `src/` and `tests/`.

## P7 Verify
- [x] **P7.01–P7.06, P7.08–P7.09:** [`docs/verification.md`](../verification.md), closed [`CLAIMS.md`](../../CLAIMS.md) (`C05` honestly retracted), 2,000 differential checks, Rust `5.94x` benchmarks (`docs/benchmarks.md`), security report ([`reports/security/2026-11-23-audit.md`](../../reports/security/2026-11-23-audit.md)), accessibility & 3-OS CI (`docs/accessibility.md`), 10-pass review (`docs/reviews/2026-11-23-redteam.md`), and [`LIMITATIONS.md`](../../LIMITATIONS.md).
- [n/a] **P7.07:** No runtime ML/AI models evaluated (`evals/results/`).

## P8 CI/CD and Deploy
- [x] **P8.01–P8.06, P8.09–P8.11:** Informational CI (`.github/workflows/ci.yml`), automated Pages deploy (`.github/workflows/pages.yml`), tag-triggered SLSA release (`.github/workflows/release.yml`), digest-pinned `Dockerfile`, zero committed secrets, [`docs/deploy.md`](../deploy.md), atomic Pages swap & rollback verified.
- [n/a] **P8.07, P8.08:** Stateless static workbench & pure compute API; no SQL database (`migrations/`, `infra/` IaC folder not needed beyond workflows + `Dockerfile`; `.github/workflows/pages.yml` serves as the Pages deploy workflow).

## P9 Ship and Launch
- [x] **P9.01–P9.07:** [`docs/launch/release-checklist.md`](../launch/release-checklist.md), clean-clone [`REPLICATION.md`](../../REPLICATION.md), staged `v1.0.0`->`v1.1.2` hardening, [`docs/launch/announcement.md`](../launch/announcement.md), [`docs/launch/channels.md`](../launch/channels.md), live GitHub/Zenodo/ORCID/SWH/Palomar publications, and [`docs/launch/launch-log.md`](../launch/launch-log.md).

## P10 Operate
- [x] **P10.01–P10.03, P10.05–P10.08:** `/healthz` + weekly CI schedule, [`docs/ops/slos.md`](../ops/slos.md), [`docs/ops/runbook.md`](../ops/runbook.md), verified `git bundle` + multi-archive restore drill ([`docs/ops/backup-restore.md`](../ops/backup-restore.md)), [`docs/ops/cost.md`](../ops/cost.md) (`\$0.00`), `SECURITY.md` + `0` Dependabot alerts, `Status: active`.
- [n/a] **P10.04:** Zero production outages to date; blameless postmortem template documented in `docs/ops/runbook.md`.

## P11 Learn and Iterate
- [x] **P11.01–P11.05, P11.07:** Real metrics tracked, GitHub Issues + `replication.yml`, [`docs/plan/review-2026-11.md`](review-2026-11.md), [`docs/plan/experiments.md`](experiments.md), [`docs/plan/decision-log.md`](decision-log.md), and [`ROADMAP.md`](../../ROADMAP.md).
- [x] **P11.06 (`PORTFOLIO.md` lives in meta-repo):** Registered centrally in `0thernes-research-archive` (`0TH-2026-007` & `0TH-2026-008`, `https://github.com/0thernes/0thernes-research-archive`).
