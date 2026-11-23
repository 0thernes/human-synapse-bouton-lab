# ADR 0005: Commit/Tag Signing vs. Zero-Gate Build Standard Precedence

- **Status:** Accepted (2026-11-23)
- **Context:** The Defensible Independent AI Research Playbook (§8 item #24) recommends SSH/GPG-signed commits and signed Git tags (`git tag -s`), whereas Build Standard for LLMs v1.1.0 Hard Rule **R1** strictly prohibits commit or tag signing requirements, push gates, or git hooks that block or slow commits to `main`.
- **Decision:** Follow Build Standard **R8** (precedence: owner instruction → Hard Rules R1–R8 → standard items → external playbooks):
  1. Never enforce commit or tag signing gates, branch protection, or git hooks on `0thernes/human-synapse-bouton-lab` (preserving **R1**).
  2. Supply tamper-evident cryptographic provenance via **zero-friction public mechanisms** instead:
     - GitHub Actions **SLSA Build Provenance Attestations** (`actions/attest-build-provenance@v2` via Sigstore OIDC) on every tagged release's PDFs, arXiv tarballs, axiom report, and `SHA256SUMS`.
     - Root `MANIFEST.sha256` sealed with a publicly verifiable **RFC 3161 Trusted Timestamp** (`MANIFEST.sha256.tsr`).
     - Permanent immutable **Software Heritage SWHID** archival (`swh:1:snp:...`) and pinned Git submodule SHA in `0thernes-research-archive`.
  3. The repository owner may optionally enable local SSH commit signing (`gpg.format = ssh`) in their personal git config at any time without violating R1, because it remains optional and never gates pushes.
- **Consequences:** Resolves the R1 vs. Playbook #24 rule conflict transparently without weakening cryptographic provenance.
