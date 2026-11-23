# Verification Architecture & Evidence Summary

`human-synapse-bouton-lab` implements all six layers of the Independent Scientist's Verification Stack:

1. **Multi-Kernel Lean 4.35.0 Formal Verification (`lean/`):**
   - 18 theorems in isolated `Challenge.lean` / `Solution.lean` (`lake build --wfail`: 0 errors, 0 warnings).
   - 19 concrete physiological non-vacuity witnesses (`NonVacuity.lean`).
   - Axiom audit (`docs/lean-axioms-report.txt`): zero `sorryAx`, zero `Classical.choice`, zero `Lean.ofReduceBool` (only `[]`, `[propext]`, or `[propext, Quot.sound]`).
   - Independently replayed across 57,998 declarations by `lean`, `leanchecker`, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, and `con-leche` locally, plus sandboxed `lake check --paranoid` & `lake comparator --paranoid` on Ubuntu CI.
2. **Statement Fidelity Audit:** Complete line-by-line mapping in `README.md` and White Paper 1 Table 2.
3. **50-Digit Exact Oracle & 1,000-Case Differential Testing:** `python/synapse_science/oracle.py` (`mpmath` `dps=50` + exact `Fraction`) verified against TypeScript (`@synapse/core`) and Rust (`synapse-sim`) over 1,000 seeded random inputs (`0` mismatches within `1e-10`).
4. **Property, Negative, Regression, Metamorphic & Mutation Verification:**
   - Property-based testing: `fast-check` (3,600+ cases), `proptest` (2,000 cases), `hypothesis` (1,500 cases).
   - Negative boundary guards: explicit `BiophysicsValidationError`, `TraceParseError`, Rust `SimError`, FastAPI HTTP 422.
   - Controlled mutation audit (B13): `scripts/mutation_audit.py` plants 6 core biophysical mutants (`M01` Hill exponent 4→3, `M02` Nernst voltage sign inversion, `M03` SNARE clamp stoichiometry 5→10, `M04` dropped V-ATPase H⁺ leak floor, `M05` removed RESI $\sqrt{K}$ factor, `M06` perturbed $K_d$ 15→20 µM) in isolated temp copies and verifies **6/6 killed (100.0%)** by `pytest`; `mutmut` is also included in `pyproject.toml` dev extras.
5. **Pre-Registered Empirical Rigor:** `PREREGISTRATION.md` committed at root SHA `a1919f2` prior to execution; 30-seed Monte Carlo sweep (`1000..1029` + null `2000..2029`), Holm–Bonferroni correction, honest refutation of pre-registered H3 (`40 Hz`), logged exploratory `H3b` (`20 Hz`) in `DEVIATIONS.md`, and `data/MANIFEST.sha256`.
6. **Tamper-Evident Provenance:** `dist/SHA256SUMS`, `sbom.cdx.json`, `CITATION.cff`, `.zenodo.json`, GitHub SLSA release attestations (`actions/attest-build-provenance@v2`), Software Heritage Save Code Now SWHID, and master archive registration.
