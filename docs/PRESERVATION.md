# Preservation, Cryptographic Provenance & Archival Registry

This file records every independent archival anchor, cryptographic checksum manifest, trusted timestamp, and persistent identifier for `human-synapse-bouton-lab`.

## Persistent Identifiers & Public Archives

| Anchor | Identifier / URL | Scope & Verification |
|---|---|---|
| **GitHub Canonical Repository** | [`https://github.com/0thernes/human-synapse-bouton-lab`](https://github.com/0thernes/human-synapse-bouton-lab) | Complete source, Lean 4.35.0 proofs, CI workflows, white papers, and SLSA release assets |
| **Live Interactive Workbench** | [`https://0thernes.github.io/human-synapse-bouton-lab/`](https://0thernes.github.io/human-synapse-bouton-lab/) | 9-tab static Vite + Three.js + Chart.js biophysical workbench |
| **Live Lean 4 Proof Blueprint & DAG** | [`https://0thernes.github.io/human-synapse-bouton-lab/blueprint/`](https://0thernes.github.io/human-synapse-bouton-lab/blueprint/) | Self-contained interactive SVG dependency graph for all 24 lemmas, 27 witnesses, and 7 sanity/sharpness checks |
| **CERN Zenodo Concept DOI** | [`10.5281/zenodo.24477927`](https://doi.org/10.5281/zenodo.24477927) | Evergreen DataCite Concept DOI — always resolves to the latest release |
| **Zenodo Prior Version DOIs** | `v1.1.1`: `10.5281/zenodo.24477928` · `v1.1.2`: `10.5281/zenodo.24478612` · `v1.2.0`: [`10.5281/zenodo.24484350`](https://doi.org/10.5281/zenodo.24484350) · `v1.3.0`: [`10.5281/zenodo.24548051`](https://doi.org/10.5281/zenodo.24548051) | Immutable release-specific Zenodo deposits (recorded in `CITATION.cff`, `CITATION.bib`, `.zenodo.json`, and both white papers; `v1.4.0` DOI minted automatically on tag push) |
| **Software Heritage Snapshots (SWHID)** | `v1.0.0`: `swh:1:snp:1a278fff55465dbe8d0b870408b6468822eb3e8b`<br>`v1.1.2`: `swh:1:snp:d922faec88e60f6f950f98eb6572b55f7b450bc7`<br>`v1.2.0`: [`swh:1:snp:8ef70f745fae4f91f040720b28e21560c73deffc`](https://archive.softwareheritage.org/swh:1:snp:8ef70f745fae4f91f040720b28e21560c73deffc) | Permanent UNESCO/Inria source archive (note: public SWH Save Code Now is gated by Anubis PoW and is never bypassed programmatically) |
| **Author ORCID Record** | [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648) | Publicly verified ORCID Works record linking Concept DOI & latest version DOI |
| **Master Archive Registration** | [`0thernes/0thernes-research-archive`](https://github.com/0thernes/0thernes-research-archive) | Entries `0TH-2026-007` (WP1) and `0TH-2026-008` (WP2, a companion survey paper that shares this repository and Lean suite) with pinned submodule SHA, frozen PDFs, and SHA-256 verification CI |

## Cryptographic Integrity & Timestamp Verification Commands

1. **Verify Root Source & Artifact Checksums (`MANIFEST.sha256`):**
   ```bash
   sha256sum -c MANIFEST.sha256
   ```
2. **Verify Data & Benchmark Checksums (`data/MANIFEST.sha256`):**
   ```bash
   (cd data && sha256sum -c MANIFEST.sha256)
   ```
3. **Verify Release Distribution Checksums (`dist/SHA256SUMS`):**
   ```bash
   (cd dist && sha256sum -c SHA256SUMS)
   ```
4. **Verify DigiCert RFC 3161 Trusted Timestamp (`MANIFEST.sha256.tsr`):**
   ```bash
   openssl ts -reply -in MANIFEST.sha256.tsr -text
   ```
5. **Verify OpenTimestamps Bitcoin-Anchored Proof (`MANIFEST.sha256.ots`, when present):**
   ```bash
   ots verify MANIFEST.sha256.ots
   ```
6. **Verify GitHub SLSA Build Provenance Attestation:**
   ```bash
   gh attestation verify dist/Donahue_2026_human_synaptic_bouton_verification.pdf --repo 0thernes/human-synapse-bouton-lab
   ```
7. **Verify Croissant 1.0 Dataset Metadata (`croissant.json`):**
   All dataset files in `data/experiments/` and `data/benchmarks/` carry exact SHA-256 digests in [`croissant.json`](../croissant.json).
