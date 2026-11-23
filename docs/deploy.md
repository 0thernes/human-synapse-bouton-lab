# Deployment, Environments & Rollback Guide (`deploy.md`)

Prepared per Build Pipeline Models v1.0.0 (`P8.03`, `P8.09`, `P8.10`, `R9`).

## Environments (`P8.03`)

| Environment | URL / Endpoint | Artifact & Update Mechanism | Access |
|---|---|---|---|
| **Local Development** | `http://localhost:5173` (Web) · `http://127.0.0.1:8000` (Optional FastAPI) | `npm --workspace apps/web run dev` and `uv run synapse-api` | Local developer workstation |
| **Local Production Preview** | `http://localhost:4173` (Web) · `http://127.0.0.1:8000/healthz` (Container) | `npm run build && npm --workspace apps/web run preview` or `docker build -t hsbl . && docker run -p 8000:8000 hsbl` | Local verification prior to push |
| **Production (Static Workbench)** | `https://0thernes.github.io/human-synapse-bouton-lab/` | Automatically built and atomically swapped by `.github/workflows/pages.yml` on every push to `main` (zero approval gates, `R9`). | Public HTTPS |
| **Immutable Archival Releases** | `https://github.com/0thernes/human-synapse-bouton-lab/releases` + Zenodo `https://doi.org/10.5281/zenodo.24477927` | Triggered automatically by pushing annotated semver tag `vX.Y.Z` (`.github/workflows/release.yml` + SLSA attestation + Zenodo GitHub webhook). | Public permanent archive |

## Rollout Strategy (`P8.09`)

- GitHub Pages performs an **atomic artifact swap** per `main` commit; visitors never see a half-deployed bundle.
- Because the workbench is a pure static client bundle with zero database mutations and zero paid feature flags, canary traffic splitting is unnecessary and would add complexity without reducing risk (`ADR 0006`).
- All runtime endpoints remain backward-compatible under `/api/v1/*` (`api/openapi.yaml`).

## One-Command Deploy & Rollback (`P8.10`)

### Deploy Latest `main`
```bash
git push origin main
```

### Cut Versioned Release + SLSA Attestation + Zenodo DOI
```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main --follow-tags
```

### Atomic Rollback Command (Tested Method)
```bash
# Identify the last known-good commit SHA, revert cleanly on main, and push:
git revert --no-edit <bad-commit-sha>
git push origin main
# .github/workflows/pages.yml automatically rebuilds and atomically swaps production in ~60 s.
```

### Rollback Verification Record
- **Drill Date:** 2026-11-23
- **Verified Behavior:** Local `git bundle create` + `git bundle verify` (`docs/ops/backup-restore.md`) confirms complete history recovery across all refs (`v1.0.0`, `v1.1.0`, `v1.1.1`, `main`); GitHub Pages deployment run `45242057651` completed atomic swap in `44 s` and returned HTTP `200` on `https://0thernes.github.io/human-synapse-bouton-lab/`.
