# Backup Scope & Disaster-Recovery Restore Drill (`backup-restore.md`)

Prepared per Build Pipeline Models v1.0.0 (`P10.05`).

## Redundant Multi-Archive Backup Topology

Because this repository has zero mutable runtime databases, 100% of intellectual property, formal proofs, datasets, figures, videos, and LaTeX source lives in Git plus four independent external archives:

1. **Primary Remote:** GitHub (`https://github.com/0thernes/human-synapse-bouton-lab`).
2. **Local Workstation Copy:** Dedicated ReFS Dev Drive (`Z:\[Vibe Coded (AI)]\ANTIGRAVITY\human-synapse-bouton-lab`).
3. **Master Research Archive Submodule & Frozen PDFs:** `https://github.com/0thernes/0thernes-research-archive` (`0TH-2026-007` & `0TH-2026-008`).
4. **Immutable Third-Party Scholarly Archives:**
   - **CERN Zenodo (DataCite DOI):** `https://doi.org/10.5281/zenodo.24477927` (`v1.1.1`: `10.5281/zenodo.24477928`).
   - **Software Heritage:** `swh:1:snp:1a278fff55465dbe8d0b870408b6468822eb3e8b` (`v1.0.0`), `swh:1:snp:458adcd73c9a78054486147094950e2be6774271` (`v1.1.0`).

## Recorded Restore Drill Log

### Drill #1 — 2026-11-23 (Full Offline `git bundle` Verification)
- **Commands Run:**
  ```powershell
  git bundle create $env:TEMP\hsbl-restore-drill.bundle --all
  git bundle verify $env:TEMP\hsbl-restore-drill.bundle
  ```
- **Observed Output (Exit Code `0`):**
  ```text
  C:/Users/Alexa/AppData/Local/Temp/hsbl-restore-drill.bundle is okay
  The bundle contains these 6 refs:
  ef3f5ca25227d9e4efde28485ab8b0a88e34e070 refs/heads/main
  ef3f5ca25227d9e4efde28485ab8b0a88e34e070 refs/remotes/origin/main
  4ac34b18778093b39255a4e31a3f490b8dd74f1e refs/tags/v1.0.0
  18524a939b5dc6e8f05b1b3547ee40ea1131ac99 refs/tags/v1.1.0
  3a01654bca43e9ba6004b708074f620c0065fc3f refs/tags/v1.1.1
  ef3f5ca25227d9e4efde28485ab8b0a88e34e070 HEAD
  The bundle records a complete history.
  BUNDLE_SIZE_BYTES=3663373
  ```
- **Result:** **PASS** — full repository history and all release tags reconstructible offline from a `3.66 MB` bundle (or from GitHub, Zenodo, Software Heritage, or `0thernes-research-archive`). Next quarterly drill due: **2027-02-23**.
