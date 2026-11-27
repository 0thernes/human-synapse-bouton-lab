# Limitations and Real-vs-Metaphor Boundary

Honest epistemic limits of `human-synapse-bouton-lab` (Build Standard v1.2.0 B41). Overclaiming destroys scientific credibility; every boundary below is stated explicitly.

## Not Tested / Outside Current Verification Scope

- **3D Brownian particle reaction–diffusion:** Active-zone $\mathrm{Ca}^{2+}$ gradients use a stationary Naraghi–Neher linearized buffer approximation (Naraghi & Neher 1997) rather than meshed 3D MCell4/BioNetGen particle trajectories.
- **Formal ODE enclosures:** 4D Hodgkin–Huxley RK4 trajectories and stochastic Monte Carlo runs use IEEE-754 float64 (`numerical_approximation`), not formal interval arithmetic inside Lean 4.
- **Browser end-to-end WebGL pixel tests:** Headless Three.js GPU rendering is not tested in headless CI runners without WebGL hardware; TypeScript compilation, Vite bundling, and `@synapse/core` computation are tested across all OS runners.
- **Atomic-coordinate 16K rendering:** Generating 16K EXR/TIFF atomic renders via cellPACK/ChimeraX/Blender requires downloading multi-gigabyte PDB/EMDB/H01 assets outside this repository.
- **Lean–engine correspondence scope:** In `v1.4.0`, `lean/ExportVectors.lean` exports exact JSON vectors (`data/lean_engine_vectors.json`) from `Solution.lean` definitions that are asserted directly in Python, TypeScript, and Rust unit/differential tests (closing `F38`). However, the Lean definitions remain discrete `Nat`/`Int` constant-rate models, whereas Rust's stochastic `run_monte_carlo_bouton` adds per-second rate jitter and float64 clamping.
- **Model constants:** The ATP constants (`950,000` and `280,000 ATP/s` supply, `4,000 ATP/s` resting leak, `32,000 ATP/AP`, `10^6` ATP store) and SNARE constants are illustrative model choices, not values derived from the cited papers. For comparison, Pulido & Ryan (2021) report about `~3,100 ATP/s` total resting consumption per cultured rat hippocampal terminal, of which $\mathrm{H}^+$ efflux accounts for up to 44%. The threshold `29.5625 Hz` and the `3 s` depletion bound follow from these illustrative constants only.
- **Scope of individual Lean statements:** `T11` is monotonicity of `D/(D+m*e)` in an abstract positive natural `e` (voltage dependence is not formalized); `T10` states two cleared-denominator numerator identities alongside strict denominator positivity; `T07` covers one discrete spike update; `T15` is an upper bound on zero time (check `A07` proves strict earliness when $D \mid A_0$); `T17` is the arithmetic identity `(8*n)/8 = n ∧ 1000000/8 = 125000`; `T18`–`T19` are non-strict monotonicity on scaled formulas; `T22`–`T24` are elementary 2×2 integer determinant identities. All 24 lemmas now have **zero unused hypotheses** (`v1.4.0`, `F37`).
- **Species and preparation of source data:** Not every parameter is human-derived. The vesicle lipid composition in White Paper 1 and `constants.ts` comes from cholinergic synaptic vesicles of the electric organ of the marine ray *Narcine brasiliensis* (Deutsch & Kelly 1981); native V-ATPase cryo-EM comes from rat brain synaptic vesicles (Coupland et al., *Science* 2024) and mouse vesicles (Wang et al., *Nature* 2024, `EMD-44847`). Only the Layer 1/4/5 active-zone and vesicle-pool ultrastructure counts (Rollenhagen/Yakoubi 2019–2025) and H01 connectome data (Shapson-Coe et al. 2024) are human temporal cortex.
- **External peer review & independent human replication:** Both white papers are independent preprints and have not yet undergone external journal peer review or replication by an unaffiliated third-party human researcher.

## Platforms

| OS | Status | Notes |
|---|---|---|
| Windows 11 (x86_64) | Tested locally & in CI | All TS, Rust, Python, Lean (`leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`, `ExportVectors.lean`), Tectonic, and media generators pass. `bwrap` sandbox for `lake comparator` is Linux-only. |
| Linux (`ubuntu-latest`) | Tested in CI | Full TS, Rust, Python, Lean (`lake check --paranoid` + `lake comparator --paranoid` with `bubblewrap` and enforced zero `Classical.choice`), security scans, and Pages deploy. |
| macOS (`macos-latest`) | Tested in CI | Cross-platform matrix tests Node, Python, and Rust stacks. |

## Sample Sizes and Statistics

- Pre-registered Monte Carlo sweeps (`PREREGISTRATION.md`) run $N = 30$ fixed seeds per arm (`1000..1029`; null control `2000..2029`), with 10,000 permutations, 10,000 bootstrap resamples, and Holm–Bonferroni correction.
- Statistical significance tests properties of our deterministic biophysical simulator, **not** wet-lab human cortical patch-clamp recordings.
- The registration (`a1919f2`) fixed hypotheses, seeds, and statistics, but not the model constants. It is evidenced only by git commit dates, not by an external timestamp.

## Literal versus Metaphor

| Term used | Literal meaning in this repo | Metaphor or marketing? |
|---|---|---|
| **Formally verified / kernel-checked** | Applies only to the 24 elementary integer and list-induction lemmas in `lean/Solution.lean` (0 unused hypotheses, enforced 0 `Classical.choice`, plus 27 witnesses and 7 sanity/sharpness checks) accepted by Lean 4.35.0 and independent checkers in repository CI, plus exact vector parity (`data/lean_engine_vectors.json`) on shared discrete evaluations. | Literal for `lean/`; never applies to float64 ODEs, stochastic jitter runs, causality, or prose conjectures. |
| **Consciousness / sentience frontier** | Structured companion survey in White Paper 2 separating elementary $2\times 2$ integer determinant facts (`T22`–`T24`), empirical neuroscience correlates, abductive hypotheses, and the unsolved Hard Problem. `A05` evaluates one example determinant (`1,500`); its reading as a common-cause table is informal. None of the 1,900 Mega-Atlas problems is solved, fully or partially; `NEURO-001`, `NEURO-003`, `NEURO-004`, and `NEURO-019` remain open. | **NOT** a claim of proving, measuring, or creating consciousness or sentience; a $2\times 2$ determinant says nothing about causal structure. |
| **Audited schematic blueprint** | Deterministic Python-rendered biophysical cross-section enforcing verified structural topology (longitudinal tau, intracellular PSD-95, lateral CaV2.1). | Schematic model — **NOT** atomic-coordinate PDB/EMDB cryo-ET data. |
| **50-digit exact oracle** | Arbitrary-precision `mpmath` (`dps=50`, exact `ln(10)` and $2\sqrt{2\ln 2}$) and Python `fractions.Fraction` reference solver for algebraic/transcendental formulas. | Literal for `oracle.py`; does not remove model-simplification error relative to real biology. |

## Known Bugs & Findings Ledger

See open GitHub issues labeled under the ten Build Standard v1.2.0 classes (`bug`, `error`, `issue`, `problem`, `concern`, `dilemma`, `conflict`, `gap`, `hole`, `blindspot`), [`ERRATA.md`](ERRATA.md), [`HARDENING_LOG.md`](HARDENING_LOG.md), and [`docs/reviews/2026-11-23-redteam.md`](docs/reviews/2026-11-23-redteam.md).

## Corrections to Past Claims

- **2026-11-23 (`C05` / `F09`):** Pre-registered hypothesis H3 predicted mitochondria sustain $>90\%$ ATP at 40 Hz over 60 s. In the fixed-parameter simulator the prediction fails because 40 Hz exceeds the model threshold $f_{\text{crit,mito}} = 29.5625\,$Hz, depleting both arms to 0.0. That threshold comes from illustrative constants set after registration, so this is a property of the simulator, not a biological refutation. Kept permanently in `CLAIMS.md` as `retracted` and documented in `DEVIATIONS.md` and `CHANGELOG.md`.
- **2026-11-23 (`F01`, `F03`):** Corrected legacy prototype v9 / Edition 2 PDF defects: replaced unformed "0thernes LLC" affiliation with Independent Researcher, and separated rat synaptosome baseline (`374` vesicles) from human cortical L1/L4/L5 presets (`1,500–3,500` vesicles).
- **2026-11-23 (`v1.2.0`, `E05` / `F15`–`F20`):** Tightened Lean 4.35.0 positive-domain hypotheses, formalized nonnegative clamped ATP store drop and exact rational vs. integer-floor resting-leak bounds, narrowed Domain VI interpretation, updated `lean/formalization.yaml` provenance, and separated repository CI multi-kernel claims from external registries.
- **2026-11-25 (`v1.3.0`, `E06` / `F21`–`F34`):** Expanded Lean suite to 24 lemmas + 27 witnesses (misreported at the time as 26) + 6 checks, repaired `node_bench.json`, hardened NaN/Inf/STP/trace/Rust/WebGL boundaries, eliminated all LaTeX box/hyperref warnings, added live `/blueprint/` DAG + Mega-Atlas crosswalk (`0 / 1,900` solved), and added Withdrawal & Retraction Policy.
- **2026-11-26 (statement audit):** Withdrew the "`23/23` Crossref verified, `0` retractions" claim (`C10`), "exact hitting time" wording for `T15` (`C11`), and WP2 `NEURO-004`/`NEURO-003` overstatements (`C12`); corrected witness count to 27; logged all remaining frozen-paper, BibTeX, script, and Lean issues in `ERRATA.md`.
- **2026-11-26 (`v1.4.0`, `E07` / `F35`–`F43`):** Closed every unfixed item from the 2026-11-26 statement audit plus newly discovered `F35`–`F43`: repaired `scripts/mutation_audit.py` exit-4 false kills + `M04` coverage (`C14`), repaired all BibTeX entries + Coupland/Wang separation + upgraded `scripts/verify_citations.py` with title/author/year/`updated-by` retraction checks (`C13`), strictly enforced zero `Classical.choice`, eliminated all unused hypotheses (`T02`/`T07`), added `A07`, linked Lean to Python/TS/Rust via `ExportVectors.lean`, recompiled White Papers 1 & 2, and upgraded to Build Standard v1.2.0 (10 finding classes).
