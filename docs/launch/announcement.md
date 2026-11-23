# Release Announcement Copy (`announcement.md`)

Prepared per Build Pipeline Models v1.0.0 (`P9.04`). Every quantitative claim below maps directly to a verified entry in [`CLAIMS.md`](../../CLAIMS.md) (with `C05` explicitly reported as refuted).

---

## Short Summary (For Lean Zulip, Computational Neuroscience Lists & GitHub Release)

**`human-synapse-bouton-lab` v1.2.0 — Formally Verified Human Synaptic Bouton Biophysics & 11-Discipline Open Hard Problems Workbench**

We have published `human-synapse-bouton-lab` (`Apache-2.0` code & proofs; `CC-BY-4.0` manuscripts, figures, and datasets):

- **Pure Lean 4.35.0 Proofs (`C01`):** 18 zero-Mathlib elementary biophysical and $2\times 2$ weight-table algebraic factorization invariants with explicit positive-domain guarantees (`0` `sorry`, `0` `Classical.choice`, `20` non-vacuity witnesses) verified across **6 independent kernels** (`lean`, `leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`) in public repository Ubuntu CI.
- **Four-Language Differential Oracle (`C02`, `C08`):** Strict TypeScript, Rust (`ChaCha8Rng`, `5.94x` speedup over Node: `0.3093 ms` vs. `1.8362 ms`), and a 50-digit Python `mpmath`/rational oracle agree within `1e-10` across `2,000` cross-checks (`0` mismatches), with `6/6` targeted mutants killed.
- **Pre-Registered 30-Seed Monte Carlo With Honest Refutation (`C03`–`C07`):** Committed `PREREGISTRATION.md` before execution. Trans-synaptic nanocolumn alignment (`H1`, `p_Holm = 0.0005`, Cliff's delta `+1.00`), tight `17 nm` `Ca2+` nanodomains (`H2`, `p_Holm = 0.0005`), and the disjoint-seed null control (`H4`, `p_Holm = 0.9963`) passed; pre-registered `40 Hz` mitochondrial sustenance (`H3`) was **honestly refuted** (`40 > 29.5625 Hz` critical ceiling) and preserved verbatim alongside a separately logged `20 Hz` exploratory follow-up (`H3b`).
- **Two Reproducible AMS-LaTeX White Papers & Interactive 3D/2D Workbench:** Live 9-tab browser workbench, deterministic figures, animated GIF, and HD H.264 MP4 videos.

**Links:**
- Live Workbench: https://0thernes.github.io/human-synapse-bouton-lab/
- Repository & Releases: https://github.com/0thernes/human-synapse-bouton-lab
- CERN Zenodo Concept DOI: https://doi.org/10.5281/zenodo.24477927
- Author ORCID: https://orcid.org/0009-0006-8168-9648
- Independent Replication Guide: [`REPLICATION.md`](../../REPLICATION.md)

*Disclosure:* Preprint — not externally peer-reviewed. Does not solve the Hard Problem of consciousness. AI assistance (Antigravity, Google DeepMind) was used for refactoring, Lean proof drafting, and typesetting; all theorems are independently kernel-checked and all responsibility rests with the human author.
