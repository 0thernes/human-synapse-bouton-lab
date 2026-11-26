# Limitations and Real-vs-Metaphor Boundary

Honest epistemic limits of `human-synapse-bouton-lab` (Build Standard B41). Overclaiming destroys scientific credibility; every boundary below is stated explicitly.

## Not Tested / Outside Current Verification Scope

- **3D Brownian particle reaction–diffusion:** Active-zone $\mathrm{Ca}^{2+}$ gradients use a stationary Naraghi–Neher linearized buffer approximation rather than meshed 3D MCell4/BioNetGen particle trajectories.
- **Formal ODE enclosures:** 4D Hodgkin–Huxley RK4 trajectories and stochastic Monte Carlo runs use IEEE-754 float64 (`numerical_approximation`), not formal interval arithmetic inside Lean 4.
- **Browser end-to-end WebGL pixel tests:** Headless Three.js GPU rendering is not tested in headless CI runners without WebGL hardware; TypeScript compilation, Vite bundling, and `@synapse/core` computation are tested across all OS runners.
- **Atomic-coordinate 16K rendering:** Generating 16K EXR/TIFF atomic renders via cellPACK/ChimeraX/Blender requires downloading multi-gigabyte PDB/EMDB/H01 assets outside this repository.
- **Lean–engine correspondence:** The Lean definitions are hand-written integer analogues of the TypeScript/Rust engines. No test checks that they compute the same values. For example, Lean `atpStoreAfter` uses a constant rate, while the Rust simulator draws a new rate jitter each second.
- **Model constants:** The ATP constants (950,000 and 280,000 ATP/s supply, 4,000 ATP/s resting leak, 32,000 ATP per spike, 10^6 ATP store) and SNARE constants are the author's illustrative choices, not values derived from the cited papers. For comparison, Pulido & Ryan (2021) report about 3,100 ATP/s total resting consumption per nerve terminal, of which H+ efflux accounts for up to 44%. The threshold 29.5625 Hz and the 3 s depletion time follow from these constants only.
- **Scope of individual Lean statements (2026-11-26 audit):** T11 is monotonicity in an abstract natural number `e`; the voltage dependence of NMDA Mg²⁺ unblock is not formalised. T10 states two numerator identities; the divisive ratio itself is not a Lean statement. T07 covers one spike update only. T15 is an upper bound on the zero time of a deterministic mean-rate store. T17 contains no kinesin model. T18 and T19 are non-strict. The hypotheses `kd > 0` (T02) and `u0 > 0` (T07) are unused.
- **Citation checking:** `scripts/verify_citations.py` checks that each DOI resolves; it does not compare titles, authors or years and does not read Crossref `updated-by` retraction notices. One DOI in `papers/references.bib` points to an unrelated paper and two entries list wrong authors (see `ERRATA.md`).
- **Species of source data:** Not every parameter is human-derived. For example, the vesicle lipid composition in White Paper 1 comes from synaptic vesicles of the electric organ of the marine ray *Narcine brasiliensis* (Deutsch & Kelly 1981).

## Platforms

| OS | Status | Notes |
|---|---|---|
| Windows 11 (x86_64) | Tested locally & in CI | All TS, Rust, Python, Lean (`leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`), Tectonic, and media generators pass. `bwrap` sandbox for `lake comparator` is Linux-only. |
| Linux (`ubuntu-latest`) | Tested in CI | Full TS, Rust, Python, Lean (`lake check --paranoid` + `lake comparator` with `bubblewrap`), security scans, and Pages deploy. |
| macOS (`macos-latest`) | Tested in CI | Cross-platform matrix tests Node, Python, and Rust stacks. |

## Sample Sizes and Statistics

- Pre-registered Monte Carlo sweeps (`PREREGISTRATION.md`) run $N = 30$ fixed seeds per arm (`1000..1029`; null control `2000..2029`), with 10,000 permutations, 10,000 bootstrap resamples, and Holm–Bonferroni correction.
- Statistical significance tests properties of our deterministic biophysical simulator, **not** wet-lab human cortical patch-clamp recordings.
- The registration (`a1919f2`) fixed hypotheses, seeds and statistics, but not the model constants. It is evidenced only by git commit dates, not by an external timestamp.

## Literal versus Metaphor

| Term used | Literal meaning in this repo | Metaphor or marketing? |
|---|---|---|
| **Formally verified / kernel-checked** | Applies only to the 24 elementary integer and list-induction lemmas in `lean/Solution.lean` (plus 27 witnesses and 6 sanity checks) accepted by Lean 4.35.0 and independent checkers in repository CI. These lemmas are about the repository's own integer model formulas, not about the TypeScript/Rust engines or biological tissue. | Literal for `lean/`; never applies to float64 ODEs, causality, or prose conjectures. |
| **Consciousness / sentience frontier** | Structured map in White Paper 2 separating elementary $2\times 2$ integer determinant facts (T22–T24), empirical neuroscience correlates, abductive hypotheses, and the unsolved Hard Problem. `A05` evaluates one example determinant; its reading as a common-cause table is informal. None of the 1,900 Mega-Atlas problems is solved, fully or partially; `NEURO-001` and `NEURO-019` remain open. White Paper 2 is a companion survey (archive entry `0TH-2026-008`); `T22`–`T24` make no formal contribution to `NEURO-004` (mechanistic NCC), although its Table 2 lists them as a "verified partial contribution" (withdrawn, see `ERRATA.md`). | **NOT** a claim of proving, measuring, or creating consciousness or sentience; a $2\times 2$ determinant says nothing about causal structure. |
| **Audited schematic blueprint** | Deterministic Python-rendered biophysical cross-section enforcing verified structural topology (longitudinal tau, intracellular PSD-95, lateral CaV2.1). | Schematic model — **NOT** atomic-coordinate PDB/EMDB cryo-ET data. |
| **50-digit exact oracle** | Arbitrary-precision `mpmath` (`dps=50`) and Python `fractions.Fraction` reference solver for algebraic/transcendental formulas. | Literal for `oracle.py`; does not remove model-simplification error relative to real biology. |

## Known Bugs

See open GitHub issues labeled `bug` and the classified Six-Class Audit Ledger in `docs/reviews/2026-11-23-redteam.md` (the six finding classes of Build Standard v1.1.0; Build Standard v1.2.0 uses ten).

## Corrections to Past Claims

- **2026-11-23 (`C05` / `F09`):** Pre-registered hypothesis H3 predicted mitochondria sustain $>90\%$ ATP at 40 Hz over 60 s. In the fixed-parameter simulator the prediction fails because 40 Hz exceeds the model threshold $f_{\text{crit,mito}} = 29.5625\,$Hz, depleting both arms to 0.0. That threshold comes from constants set after registration (see `ERRATA.md`, 2026-11-26), so this is a property of the model, not a biological refutation. Kept permanently in `CLAIMS.md` as `retracted` and documented in `DEVIATIONS.md` and `CHANGELOG.md`.
- **2026-11-23 (`F01`, `F03`):** Corrected legacy prototype v9 / Edition 2 PDF defects: replaced unformed "0thernes LLC" affiliation with Independent Researcher, and separated rat synaptosome baseline (`374` vesicles) from human cortical L1/L4/L5 presets (`1,500–3,500` vesicles).
- **2026-11-23 (`v1.2.0`, `E05` / `F15`–`F20`):** Tightened Lean 4.35.0 positive-domain hypotheses (`kd > 0`, `halfKd > 0`, `gL, gE, gI > 0`, `eL < eE`, `a0 > 0`, `cAp > 0`), formalized nonnegative clamped ATP store drop (`atpStoreAfter < a0`) and exact rational vs. integer-floor resting-leak bounds, narrowed Domain VI interpretation strictly to observational $2\times 2$ weight-table algebraic factorization rather than interventional causality, updated `lean/formalization.yaml` provenance (`formalizes`/`adapts`), and separated repository CI multi-kernel claims from external registries (`ERRATA.md`).
- **2026-11-25 (`v1.3.0`, `E06` / `F21`–`F34`):** Expanded Lean suite to 24 theorems + 27 witnesses (misreported at the time as 26) + 6 sanity checks (`AdversarialChecks.lean`), repaired `data/benchmarks/node_bench.json` JSON corruption, hardened Python `NaN`/`Inf`, TS `u0 <= 1` / monotonic trace, Rust `firing_rate_hz`, and WebGL fallback boundaries, eliminated all LaTeX box/hyperref warnings, added live `/blueprint/` Proof DAG + Mega-Atlas crosswalk (`0 / 1,900` solved), and documented our Withdrawal & Retraction Policy in `ERRATA.md`.
- **2026-11-26 (statement audit):** Withdrew the "`23/23` Crossref verified, `0` retractions" claim, the "exact hitting time" wording for `T15`, the description of `AdversarialChecks.lean` as proving hypotheses "tight and non-redundant", the statement that `A05` proves the determinant test never certifies causality, and the reading of H3 as a biological refutation. Corrected the witness count to 27. Details and the errors that remain in the frozen papers and Lean files are in `ERRATA.md` under "2026-11-26 statement audit".
- **2026-11-26 (statement audit, White Paper 2 / `0TH-2026-008`):** Withdrew the listing of `T22`–`T24` as a "verified partial contribution" to `NEURO-004` and the statement that `A05` "proves" a $2\times 2$ determinant is not causality or sentience (`NEURO-003`). White Paper 2 is described as a companion survey with no formal result of its own (`CLAIMS.md` `C12`).
