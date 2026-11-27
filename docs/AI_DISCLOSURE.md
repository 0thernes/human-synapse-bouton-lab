# AI-Contribution & Transparency Disclosure

In accordance with the Defensible Independent AI Research Playbook (Edition 1.3), ICMJE/COPE authorship standards, and CERN Zenodo's generative-AI depositor guidelines (effective April 27, 2026), this file documents the exact human and AI roles across `human-synapse-bouton-lab`.

## Human Author & Full Responsibility

- **Sole Author:** Alexander Stephen Donahue (`Independent Researcher`, Spokane, WA, USA; ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).
- **Human CRediT Roles:** Conceptualization; Methodology; Formal analysis (problem framing, rat-vs-human physiological separation, positive-domain hypothesis tightening, statement-fidelity auditing, and epistemic boundary enforcement); Validation; Software supervision; Writing – review & editing; Archival stewardship.
- **No AI Authorship:** No AI model or agent is listed as a co-author or copyright holder. The human author assumes full scientific, ethical, and legal responsibility for every claim, proof, dataset, and manuscript in this repository.

## AI Tools Used & Exact Scope

- **Tool:** Antigravity (Google DeepMind) interactive coding and research environment.
- **Tasks Assisted:** Multi-language software refactoring (TypeScript, Rust, Python, Three.js), Lean 4.35.0 proof tactic drafting, AMS-LaTeX typesetting, deterministic Matplotlib/FFmpeg figure & video scripting, and automated forensic verification audits.
- **Independent Machine Certification (`v1.4.0`):**
  1. Every Lean 4.35.0 lemma (`24` elementary lemmas, `0` unused hypotheses, `27` concrete non-vacuity witnesses, `7` sanity and sharpness checks) is replayed with zero `sorry` in proof modules and strictly enforced zero `Classical.choice` (`lean/comparator.json`, CI grep, `check_readme_axioms.py`) by six proof-checking kernels (`lean`, `leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`) in public Ubuntu CI, with executable vector parity (`lean/ExportVectors.lean` → `data/lean_engine_vectors.json`) asserted across Python, TypeScript, and Rust. Kernel checking does not establish biological novelty; see `docs/statement-fidelity.md`.
  2. Every floating-point biophysical equation is independently cross-validated across TypeScript, Rust, and a 50-digit `mpmath`/rational Python reference oracle over `1,000` seeded random cases (`0` mismatches within `1e-10`) plus `6/6` (`100%`) control-verified mutation kills (`scripts/mutation_audit.py`: unmutated baseline `rc=0`, all 6 planted faults killed with `rc=1`).
  3. All 28 DOI-bearing entries in `papers/references.bib` pass live Crossref verification (`scripts/verify_citations.py` + negative unit tests in `python/tests/test_citations.py`) checking HTTP 200, normalized title Jaccard, first-author surname, publication year, and Crossref `updated-by` Retraction Watch status (`0` mismatched, `0` retracted; 1 publisher correction notice on Wang 2024), alongside 1 non-DOI metadata-checked entry (`chalmers1995facing`, total 29).
  4. The hypotheses, seeds, and statistics of the Monte Carlo experiments were registered in `PREREGISTRATION.md` before any code; the illustrative bioenergetic constants were set later. The failure of pre-registered hypothesis `H3` (`40 Hz`) in the fixed-parameter simulator is reported verbatim in `CLAIMS.md`, `ERRATA.md`, `DEVIATIONS.md`, and White Paper 1.

## Policy & Platform Compliance

- **Zenodo Generative-AI Eligibility:** Zenodo archival deposits explicitly document AI-assisted research software and formally machine-checked mathematical artifacts rather than unverified AI-generated prose; human direction, independent kernel certification, and pre-registered falsifiability are verified in every release.
- **Peer Review Status:** Both AMS-LaTeX white papers are independent preprints and have **not** undergone external journal peer review.
