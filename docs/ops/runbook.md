# Operations & Incident Runbook (`runbook.md`)

Prepared per Build Pipeline Models v1.0.0 (`P10.03`, `P10.04`).

## 1. Roll Back a Bad GitHub Pages / `main` Deployment

```bash
git log --oneline -n 5
git revert --no-edit <bad-commit-sha>
git push origin main
# Wait ~60 s for .github/workflows/pages.yml atomic swap, then verify:
curl -fsSI https://0thernes.github.io/human-synapse-bouton-lab/ | head -n 5
```

## 2. Emergency Kill Switch for Optional Local FastAPI Backend

The browser workbench runs 100% client-side by default and only upgrades to `http://127.0.0.1:8000/api/v1/*` if `/healthz` responds. Stopping the local `uvicorn` process or Docker container immediately isolates the API without affecting any static UI user.

## 3. Patch a Dependency CVE Without Breaking Cross-Platform Lockfiles

- **Python (`uv.lock`):** Update constraint in `pyproject.toml`, run `uv lock --upgrade-package <pkg> && uv sync && uv run pytest`.
- **Rust (`Cargo.lock`):** Run `cargo update -p <crate> && cargo test --locked && cargo clippy --all-targets --locked`.
- **Node (`package-lock.json`):** Update version cleanly while **preserving `optional: true`** on all `os`/`cpu`-constrained platform entries (e.g., `@esbuild/*`, `@rollup/*`) so Linux CI `npm ci` never hits `EBADPLATFORM` (`F05` lesson), then verify `npm ci && npm test && npm audit`.

## 4. Re-Seal `MANIFEST.sha256` and DigiCert RFC 3161 Timestamp After Any Paper/Lean Edit

```bash
find lean papers data dist -maxdepth 3 -type f ! -path '*/.lake/*' ! -path '*/build/*' ! -name '*.aux' ! -name '*.log' | sort | xargs sha256sum > MANIFEST.sha256
sha256sum -c MANIFEST.sha256
openssl ts -query -data MANIFEST.sha256 -no_nonce -sha256 -cert -out manifest.tsq
curl -fsS -H "Content-Type: application/timestamp-query" --data-binary @manifest.tsq http://timestamp.digicert.com -o MANIFEST.sha256.tsr
rm -f manifest.tsq
```

## 5. Blameless Postmortem Policy (`P10.04`)

Zero production incidents have occurred to date (`project.yaml` `P10.04: n/a`). If an incident occurs in the future, add a file under `docs/ops/postmortems/<YYYY-MM-DD>-<slug>.md` recording: (1) Timeline (UTC), (2) Root cause without blame, (3) User/scientific impact, (4) Detection & recovery latency, and (5) Permanent regression test (`B07`) + `ERRATA.md` entry.
