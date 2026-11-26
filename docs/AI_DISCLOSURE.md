# AI-Contribution & Transparency Disclosure

In accordance with the Defensible Independent AI Research Playbook (Edition 1.3), ICMJE/COPE authorship standards, and CERN Zenodo's generative-AI depositor guidelines (effective April 27, 2026), this file documents the exact human and AI roles across `human-synapse-bouton-lab`.

## Human Author & Full Responsibility

- **Sole Author:** Alexander Stephen Donahue (`Independent Researcher`, Spokane, WA, USA; ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).
- **Human CRediT Roles:** Conceptualization; Methodology; Formal analysis (problem framing, rat-vs-human physiological separation, positive-domain hypothesis tightening, statement-fidelity auditing, and epistemic boundary enforcement); Validation; Software supervision; Writing – review & editing; Archival stewardship.
- **No AI Authorship:** No AI model or agent is listed as a co-author or copyright holder. The human author assumes full scientific, ethical, and legal responsibility for every claim, proof, dataset, and manuscript in this repository.

## AI Tools Used & Exact Scope

- **Tool:** Antigravity (Google DeepMind) interactive coding and research environment.
- **Tasks Assisted:** Multi-language software refactoring (TypeScript, Rust, Python, Three.js), Lean 4.35.0 proof tactic drafting, AMS-LaTeX typesetting, deterministic Matplotlib/FFmpeg figure & video scripting, and automated forensic verification audits.
- **Independent Machine Certification:**
  1. Every Lean 4.35.0 theorem (`24` headline theorems, `26` non-vacuity witnesses, `6` adversarial counterexample checks) is independently verified with zero `sorry` and zero `Classical.choice` by six distinct proof-checking kernels (`lean`, `leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`) in public Ubuntu CI.
  2. Every floating-point biophysical equation is independently cross-validated across TypeScript, Rust, and a 50-digit `mpmath`/rational Python reference oracle over `1,000` seeded random cases (`0` mismatches within `1e-10`) plus `6/6` (`100%`) controlled mutation kills.
  3. Every primary literature reference (`23/23`) is verified live against the Crossref API with zero retractions (`docs/citation-audit.json`).
  4. All stochastic Monte Carlo results were pre-registered in `PREREGISTRATION.md` prior to execution, and the refutation of pre-registered hypothesis `H3` (`40 Hz`) is reported verbatim in `CLAIMS.md`, `ERRATA.md`, `DEVIATIONS.md`, and White Paper 1.

## Policy & Platform Compliance

- **Zenodo Generative-AI Eligibility:** Zenodo archival deposits explicitly document AI-assisted research software and formally machine-checked mathematical artifacts rather than unverified AI-generated prose; human direction, independent kernel certification, and pre-registered falsifiability are verified in every release.
- **Peer Review Status:** Both AMS-LaTeX white papers are independent preprints and have **not** undergone external journal peer review.
