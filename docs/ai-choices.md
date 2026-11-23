# Runtime AI Model Choices & Development-Time AI Disclosure (`ai-choices.md`)

Prepared per Build Pipeline Models v1.0.0 (`P4.05`, `P6.05`, `P7.07`).

## Runtime AI Models: **Not Applicable (`n/a`)**

- `human-synapse-bouton-lab` ships **zero** runtime LLM calls, zero ML model weights, zero inference endpoints, and zero prompt pipelines.
- Every simulation, statistical test, 50-digit oracle calculation, and formal proof executes deterministically with classical mathematical/biophysical algorithms and pinned seeds.
- Consequently, `prompts/`, `evals/`, and `evals/results/` are explicitly **`n/a`** in `project.yaml`.

## Development-Time AI Assistance Disclosure (CRediT & Scientific Integrity)

To comply with the Defensible Independent AI Research Playbook, CERN Zenodo's depositor policy, and Palomar Registry transparency expectations:

- **Human Author & Sole Accountable Party:** Alexander Stephen Donahue (Independent Researcher, Spokane, WA, USA; ORCID `0009-0006-8168-9648`). Human CRediT roles: Conceptualization; Methodology; Formal analysis (definition & statement-fidelity audit); Validation; Writing — review & editing.
- **Development-Time Assistant Used:** Antigravity (Google DeepMind) assisted with multi-language software refactoring, Lean 4 proof drafting, and LaTeX typesetting on 2026-11-23.
- **Verification Independence:** Every mathematical theorem is independently checked by the Lean 4.35.0 kernel and five additional independent checkers (`leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`); every numerical routine is verified against a 50-digit `mpmath`/rational oracle across 2,000 differential checks; every bibliography entry is verified live against Crossref (`23/23`); no AI system is listed as an author.
