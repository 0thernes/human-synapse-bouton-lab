# ADR 0006: Deploy Target and Atomic Rollback Strategy

- **Status:** Accepted
- **Date:** 2026-11-23
- **Build Pipeline Step:** `P4.06`, `P8.09`, `P8.10`

## Context

`human-synapse-bouton-lab` requires zero-cost, permanently accessible public delivery of the 9-tab interactive biophysical workbench (`apps/web`), reproducible local/containerized execution of the optional FastAPI compute server, and an instant, gate-free rollback path compliant with Build Standard `R1` and Build Pipeline Rule `R9` (deploy safety without blocking push gates).

## Decision

1. **Primary Production Target:** Deploy the static Vite bundle (`apps/web/dist`) to **GitHub Pages** (`https://0thernes.github.io/human-synapse-bouton-lab/`) via `.github/workflows/pages.yml` on every push to `main` (atomic GitHub Pages artifact swap; zero branch protection or manual approval gates).
2. **Local Preview & Self-Hosted API Target:** Serve local preview via `npm --workspace apps/web run preview` and optional local REST backend via `uv run synapse-api` or the digest-pinned `Dockerfile` (`python:3.12-slim@sha256:...`).
3. **Immutable Archival Releases:** Tagging `vX.Y.Z` triggers `.github/workflows/release.yml`, generating SLSA build provenance attestations, SHA-256 release assets, and automatic CERN Zenodo DataCite DOI archival.
4. **One-Command Rollback:** Because GitHub Pages swaps static build artifacts atomically from `main`, rolling back a bad deployment requires only reverting the offending commit on `main` (`git revert --no-edit <bad-sha> && git push origin main`), which triggers `.github/workflows/pages.yml` to rebuild and swap back cleanly within ~60 seconds.

## Consequences

- **Positive:** `\$0.00/mo` operational cost, zero server runtime attack surface, instant static failover, full client-side determinism even without a live FastAPI server.
- **Negative:** Interactive browser workbench cannot run multi-core native Rust sweeps directly in-browser until a future `wasm32` build (`docs/plan/ideas.md`).
