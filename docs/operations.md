# Operations, Backups, and Offsite Repository Mirror

Operational notes for backup, archival preservation, and disaster recovery (Build Standard A35).

## Persistent Data & Checksums

- This repository stores no mutable user database; all scientific datasets (`data/experiments/per_seed_results.csv`, `data/experiments/stats_summary.json`, `data/benchmarks/*.json`) are deterministic outputs pinned by `data/MANIFEST.sha256` and verified via `sha256sum -c`.

## Offsite Repository Mirror & Git Bundle Backup

1. **Software Heritage Permanent Archive (ISO/IEC 18670 SWHID):** Submitted via Save Code Now (`https://archive.softwareheritage.org/save/`) immediately upon public release so source trees persist independently of GitHub.
2. **Master Research Archive Submodule:** Pinned by exact release commit SHA inside `https://github.com/0thernes/0thernes-research-archive` alongside frozen PDFs and SHA-256 verification manifests.
3. **Local Offsite Git Bundle Procedure (Tested):**
   ```bash
   git bundle create ../human-synapse-bouton-lab-backup.bundle --all
   git bundle verify ../human-synapse-bouton-lab-backup.bundle
   ```
   Copy the verified `.bundle` file to external storage or an encrypted cloud bucket. To mirror directly to a second Git host (e.g., Codeberg or GitLab):
   ```bash
   git remote add backup <second-remote-url>
   git push backup --mirror
   ```

## Observability (FastAPI Backend — A34)

- **Structured Logging:** Every HTTP request emits a single-line JSON object (`ts`, `level`, `logger`, `req_id`, `method`, `path`, `status`, `ms`) to stdout; no secrets or personal data are logged.
- **Health Endpoint:** `GET /healthz` returns HTTP `200` with `{"status":"ok","version":"1.0.0","oracle_precision_digits":"50"}`.
