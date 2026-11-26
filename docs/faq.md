# Frequently Asked Questions (FAQ)

1. **Why use four languages (Lean 4, Rust, TypeScript, Python) instead of one?**
   Each language serves an orthogonal verification role: Lean 4.35.0 gives machine-checked universal mathematical proof (`lean/Solution.lean`); Python (`mpmath`) provides a 50-digit arbitrary-precision reference oracle (`python/synapse_science/oracle.py`) and statistical/media pipeline; Rust provides fast deterministic Monte Carlo execution (`0.3093 ms` median vs Node `1.8362 ms`, `docs/benchmarks.md`); and TypeScript powers the zero-install browser workbench (`apps/web`). Cross-language differential testing (`python/tests/test_differential.py`) proves all three computational engines agree to `< 1e-10` across 1,000 random inputs.

2. **Does this repository prove or build consciousness or artificial sentience?**
   **No.** See [`LIMITATIONS.md`](../LIMITATIONS.md) and White Paper 2 (`dist/Donahue_2026_open_hard_problems_consciousness_frontier.pdf`). Our Lean 4 "bipartite-coupling" theorems (T22–T24) are facts about 2×2 integer determinants, for example that a rank-one table has determinant 0 (`factorized_bipartition_zero_integration`). They contain no causal model and no notion of integration. Bridging physical/informational dynamics to phenomenal experience remains an unsolved Hard Problem.

3. **Why did pre-registered hypothesis H3 fail, and why is it still in the repo?**
   In [`PREREGISTRATION.md`](../PREREGISTRATION.md), we predicted mitochondria would retain `>90%` ATP under 40 Hz stochastic bursts over 60 s. In actual execution, mean ATP burn at 40 Hz (`1,284,000 ATP/s`) exceeded even mitochondrial synthesis (`950,000 ATP/s`, critical frequency `29.5625 Hz`), depleting both arms to `0.0` (`p_Holm = 1.0`). These ATP constants were set in code after registration and are illustrative, not taken from the cited papers, so the failure is a property of the model, not a biological finding. Under scientific integrity rules (`R6`, Playbook §2), pre-registered refutations are reported openly in `CLAIMS.md` (`C05: retracted`) rather than hidden; a post-hoc exploratory arm `H3b` at 20 Hz is logged separately in [`DEVIATIONS.md`](../DEVIATIONS.md).

4. **Why doesn't the Lean 4 project depend on Mathlib?**
   Zero-Mathlib pure Lean 4.35.0 proofs compile from scratch in ~6 seconds without downloading multi-gigabyte olean caches, use zero `Classical.choice`, and are replayed by `leanchecker-paranoid`, `nanoda_bin`, `con-ron` and `con-leche`. See [`docs/adr/0003-pure-lean-4-35-zero-mathlib-proofs.md`](adr/0003-pure-lean-4-35-zero-mathlib-proofs.md).

5. **Are the images and 3D views atomic-coordinate PDB/EMDB renders?**
   **No.** Every visual in `docs/media/` and `apps/web/` is a deterministic code-rendered schematic or data plot explicitly labeled as educational/schematic, not atomic coordinate data. Atomic 16K EXR/TIFF rendering via PDB/EMDB/cellPACK/Blender is documented as a separate external workstation pipeline in White Paper 1 and `ROADMAP.md`.

6. **Why does this repo cite "Independent Researcher" instead of "0thernes LLC"?**
   Resolved per Build Standard R8 (`F01`, [`docs/adr/0001-dual-license-and-independent-affiliation.md`](adr/0001-dual-license-and-independent-affiliation.md)): no LLC legal entity has been formally incorporated yet, so all metadata, licenses, ORCID attribution, and white papers honestly identify Alexander Stephen Donahue as an Independent Researcher (`ORCID 0009-0006-8168-9648`).
