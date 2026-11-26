# Limitations and Real-vs-Metaphor Boundary

Honest epistemic limits of `human-synapse-bouton-lab` (Build Standard B41). Overclaiming destroys scientific credibility; every boundary below is stated explicitly.

## Not Tested / Outside Current Verification Scope

- **3D Brownian particle reaction–diffusion:** Active-zone $\mathrm{Ca}^{2+}$ gradients use a stationary Naraghi–Neher linearized buffer approximation rather than meshed 3D MCell4/BioNetGen particle trajectories.
- **Formal ODE enclosures:** 4D Hodgkin–Huxley RK4 trajectories and stochastic Monte Carlo runs use IEEE-754 float64 (`numerical_approximation`), not formal interval arithmetic inside Lean 4.
- **Browser end-to-end WebGL pixel tests:** Headless Three.js GPU rendering is not tested in headless CI runners without WebGL hardware; TypeScript compilation, Vite bundling, and `@synapse/core` computation are tested across all OS runners.
- **Atomic-coordinate 16K rendering:** Generating 16K EXR/TIFF atomic renders via cellPACK/ChimeraX/Blender requires downloading multi-gigabyte PDB/EMDB/H01 assets outside this repository.

## Platforms

| OS | Status | Notes |
|---|---|---|
| Windows 11 (x86_64) | Tested locally & in CI | All TS, Rust, Python, Lean (`leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`), Tectonic, and media generators pass. `bwrap` sandbox for `lake comparator` is Linux-only. |
| Linux (`ubuntu-latest`) | Tested in CI | Full TS, Rust, Python, Lean (`lake check --paranoid` + `lake comparator` with `bubblewrap`), security scans, and Pages deploy. |
| macOS (`macos-latest`) | Tested in CI | Cross-platform matrix tests Node, Python, and Rust stacks. |

## Sample Sizes and Statistics

- Pre-registered Monte Carlo sweeps (`PREREGISTRATION.md`) run $N = 30$ fixed seeds per arm (`1000..1029`; null control `2000..2029`), with 10,000 permutations, 10,000 bootstrap resamples, and Holm–Bonferroni correction.
- Statistical significance tests properties of our deterministic biophysical simulator, **not** wet-lab human cortical patch-clamp recordings.

## Literal versus Metaphor

| Term used | Literal meaning in this repo | Metaphor or marketing? |
|---|---|---|
| **Formally verified / kernel-checked** | Strictly applies ONLY to the 24 elementary algebraic, discrete-dynamical, inductive, and factorization invariants in `lean/Solution.lean` (plus 26 witnesses and 6 adversarial checks) accepted by Lean 4.35.0 and independent checkers in repository CI. | Literal for `lean/`; NEVER applies to float64 ODEs, interventional causality, or prose conjectures. |
| **Consciousness / sentience frontier** | Structured epistemic map separating elementary algebraic weight-table factorization bounds (common-cause counterexample proved in `AdversarialChecks.lean`), empirical neuroscience correlates, abductive hypotheses, and the unsolved Hard Problem; `0 / 1,900` Mega-Atlas problems claimed solved. | **NOT** a claim of proving, measuring, or creating consciousness or sentience; observational $2\times 2$ determinants do not establish interventional causal disconnection under latent common causes. |
| **Audited schematic blueprint** | Deterministic Python-rendered biophysical cross-section enforcing verified structural topology (longitudinal tau, intracellular PSD-95, lateral CaV2.1). | Schematic model — **NOT** atomic-coordinate PDB/EMDB cryo-ET data. |
| **50-digit exact oracle** | Arbitrary-precision `mpmath` (`dps=50`) and Python `fractions.Fraction` reference solver for algebraic/transcendental formulas. | Literal for `oracle.py`; does not remove model-simplification error relative to real biology. |

## Known Bugs

See open GitHub issues labeled `bug` and the classified Six-Class Audit Ledger in `docs/reviews/2026-11-23-redteam.md`.

## Corrections to Past Claims

- **2026-11-23 (`C05` / `F09`):** Pre-registered hypothesis H3 predicted mitochondria sustain $>90\%$ ATP at 40 Hz over 60 s. Actual simulation refuted H3 because 40 Hz exceeds $f_{\text{crit,mito}} = 29.5625\,$Hz, depleting both arms to 0.0. Kept permanently in `CLAIMS.md` as `retracted` and documented in `DEVIATIONS.md` and `CHANGELOG.md`.
- **2026-11-23 (`F01`, `F03`):** Corrected legacy prototype v9 / Edition 2 PDF defects: replaced unformed "0thernes LLC" affiliation with Independent Researcher, and separated rat synaptosome baseline (`374` vesicles) from human cortical L1/L4/L5 presets (`1,500–3,500` vesicles).
- **2026-11-23 (`v1.2.0`, `E05` / `F15`–`F20`):** Tightened Lean 4.35.0 positive-domain hypotheses (`kd > 0`, `halfKd > 0`, `gL, gE, gI > 0`, `eL < eE`, `a0 > 0`, `cAp > 0`), formalized nonnegative clamped ATP store drop (`atpStoreAfter < a0`) and exact rational vs. integer-floor resting-leak bounds, narrowed Domain VI interpretation strictly to observational $2\times 2$ weight-table algebraic factorization rather than interventional causality, updated `lean/formalization.yaml` provenance (`formalizes`/`adapts`), and separated repository CI multi-kernel claims from external registries (`ERRATA.md`).
- **2026-11-25 (`v1.3.0`, `E06` / `F21`–`F34`):** Expanded Lean suite to 24 theorems + 26 witnesses + 6 adversarial counterexample checks (`AdversarialChecks.lean`), repaired `data/benchmarks/node_bench.json` JSON corruption, hardened Python `NaN`/`Inf`, TS `u0 <= 1` / monotonic trace, Rust `firing_rate_hz`, and WebGL fallback boundaries, eliminated all LaTeX box/hyperref warnings, added live `/blueprint/` Proof DAG + Mega-Atlas crosswalk (`0 / 1,900` solved), and documented our Withdrawal & Retraction Policy in `ERRATA.md`.
