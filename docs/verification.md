# Verification Architecture & Evidence Summary (`v1.3.0`)

`human-synapse-bouton-lab` implements all six layers of the Independent Scientist's Verification Stack (Defensible Research Playbook Edition 1.3):

1. **Multi-Kernel Lean 4.35.0 Formal Verification (`lean/`):**
   - **24 theorems** in isolated `Challenge.lean` / `Solution.lean` (`lake build --wfail`: 0 errors, 0 warnings).
   - **26 concrete physiological non-vacuity witnesses** (`NonVacuity.lean`) and **6 adversarial counterexample checks** (`AdversarialChecks.lean`).
   - Axiom audit (`docs/lean-axioms-report.txt`, drift-checked against `README.md` by `scripts/check_readme_axioms.py`): zero `sorryAx`, zero `Classical.choice`, zero `Lean.ofReduceBool`, zero `_native` (strictly `[]`, `[propext]`, or `[propext, Quot.sound]`).
   - Independently replayed across 58,034 declarations by `lean`, `leanchecker`, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, and `con-leche` locally, plus sandboxed `lake check --paranoid` & `lake comparator --paranoid` across all 6 kernels (`lean`, `leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`) in public Ubuntu CI.
2. **Statement Fidelity Audit & Live Blueprint:** Complete line-by-line mapping in [`docs/statement-fidelity.md`](statement-fidelity.md), White Paper 1 Table 2, and interactive SVG dependency DAG at [`blueprint/index.html`](../blueprint/index.html) (live at `/blueprint/`).
3. **50-Digit Exact Oracle & 1,000-Case Differential Testing:** `python/synapse_science/oracle.py` (`mpmath` `dps=50` + exact `Fraction`, with `math.isfinite()` boundary guards) verified against TypeScript (`@synapse/core`) and Rust (`synapse-sim`) over 1,000 seeded random inputs (`0` mismatches within `1e-10`).
4. **Property, Negative, Regression, Metamorphic & Mutation Verification:**
   - Property-based testing: `fast-check` (3,600+ cases), `proptest` (2,000 cases), `hypothesis` (1,500 cases).
   - Negative boundary guards: explicit `BiophysicsValidationError` (including `u0 <= 1`), `TraceParseError` (including monotonic timestamp enforcement), Rust `SimError` (including `firing_rate_hz >= 0`), Python `ValueError` (`NaN`/`Inf`), and FastAPI HTTP 422.
   - Controlled mutation audit (B13): `scripts/mutation_audit.py` plants 6 core biophysical mutants (`M01`–`M06`) in isolated temp copies and verifies **6/6 killed (100.0%)** by `pytest`.
5. **Pre-Registered Empirical Rigor:** `PREREGISTRATION.md` committed at root SHA `a1919f2` prior to execution; 30-seed Monte Carlo sweep (`1000..1029` + null `2000..2029`), Holm–Bonferroni correction, honest refutation of pre-registered H3 (`40 Hz`, with exact discrete hitting time $t=3\,$s proved in Lean `T15`), logged exploratory `H3b` (`20 Hz`) in `DEVIATIONS.md`, Croissant 1.0 metadata (`croissant.json`), and `data/MANIFEST.sha256`.
6. **Tamper-Evident Provenance:** `MANIFEST.sha256`, DigiCert RFC 3161 `MANIFEST.sha256.tsr`, OpenTimestamps `MANIFEST.sha256.ots` (when anchored), `dist/SHA256SUMS`, `sbom.cdx.json`, `CITATION.cff`, `CITATION.bib`, `.zenodo.json`, GitHub SLSA release attestations (`actions/attest-build-provenance@v4`), Software Heritage SWHIDs, live Crossref citation audit (`23/23`), and `0thernes-research-archive` registration (`docs/PRESERVATION.md`).
