# Pre-Registration of Stochastic Synaptic Monte Carlo Hypotheses

**Status:** Frozen prior to executing statistical sweeps (Build Standard B32)  
**Author:** Alexander Stephen Donahue (`Independent Researcher`, ORCID: `https://orcid.org/0009-0006-8168-9648`)  
**Date:** 2026-11-23  
**Repository:** `human-synapse-bouton-lab`

## 1. Research Questions & Primary Hypotheses

We evaluate two mechanistic hypotheses using our independent deterministic stochastic synaptic release simulator (`rust/synapse-sim` cross-checked against `python/synapse_science/stats_experiments.py`), modeled on 3D active-zone nanodomain coupling and trans-synaptic nanocolumn alignment (PNAS 2024; MPG 2025):

- **H1 (Trans-Synaptic Nanocolumn Alignment Gain):**
  - *Treatment arm:* Aligned RIM1/2–PSD-95 trans-synaptic nanocolumn (`nanocolumnOffsetNm = 0 nm`, `cleftWidthNm = 22 nm`, `caExtMm = 2.0 mM`, `couplingNm = 17 nm`, `tempC = 37 °C`, 200 action potentials per seed).
  - *Control arm:* Misaligned release site (`nanocolumnOffsetNm = 80 nm`, all other parameters identical).
  - *Primary metric:* Mean peak postsynaptic EPSC amplitude $|\text{EPSC}|$ (pA) per seed across released trials.
  - *Directional prediction:* Treatment $|\text{EPSC}|$ strictly exceeds Control $|\text{EPSC}|$ with Cliff's $\delta \ge 0.80$ and Holm–Bonferroni adjusted permutation $p < 0.001$.
  - *Refutation condition:* Hypothesis H1 is refuted if Holm-adjusted $p \ge 0.01$ or if the 95% bootstrap confidence interval of $\Delta|\text{EPSC}|$ includes $\le 0\,\text{pA}$.

- **H2 (Ca²⁺ Nanodomain vs. Microdomain Coupling Reliability):**
  - *Treatment arm:* Tight CaV2.1–Synaptotagmin-1 nanodomain coupling (`couplingNm = 17 nm`, `caExtMm = 2.0 mM`, `nanocolumnOffsetNm = 0 nm`, 200 action potentials per seed).
  - *Control arm:* Loose microdomain coupling (`couplingNm = 60 nm`, all other parameters identical).
  - *Primary metric:* Empirical vesicle release probability $\hat{P}_r$ (fraction of action potentials evoking $\ge 1$ vesicle fusion) and release reliability (1 minus failure rate).
  - *Directional prediction:* Treatment $\hat{P}_r$ strictly exceeds Control $\hat{P}_r$ with Cliff's $\delta \ge 0.80$ and Holm–Bonferroni adjusted permutation $p < 0.001$.
  - *Refutation condition:* Hypothesis H2 is refuted if Holm-adjusted $p \ge 0.01$ or if mean $\hat{P}_r(\text{17 nm}) - \hat{P}_r(\text{60 nm}) \le 0.25$.

- **H3 (Mitochondrial ATP Sustainability Under High-Frequency Firing — Control vs. Mito-Knockout):**
  - *Treatment arm:* Active presynaptic mitochondria + local glycolysis (`mitoActive = true`, firing rate swept across stochastic Poisson bursts centered at `40 Hz`, 60-second epoch).
  - *Control arm:* Glycolysis only (`mitoActive = false`, identical Poisson spike train per seed).
  - *Primary metric:* End-of-epoch residual bouton ATP fraction (out of $10^6$ free ATP molecules, Rangaraju et al. 2014) after accounting for Pulido & Ryan (2021) resting V-ATPase $\text{H}^+$ leak.
  - *Directional prediction:* Control arm suffers strict ATP depletion ($< 50\%$ residual ATP) while treatment arm remains bioenergetically sustained ($> 90\%$ residual ATP), Holm-adjusted $p < 0.001$.
  - *Refutation condition:* Refuted if glycolysis-only sustains $\ge 90\%$ ATP or if Holm-adjusted $p \ge 0.01$.

- **H4 (Negative / Null Control — Seed-Permutation Invariance):**
  - *Arm A vs. Arm B:* Two identical aligned-nanocolumn cohorts (`0 nm` offset) driven by disjoint seed blocks (`1000..1029` vs. `2000..2029`).
  - *Prediction:* No statistically significant difference (Holm-adjusted $p > 0.05$, 95% CI of mean difference contains $0$).
  - *Refutation condition:* If the null control yields $p < 0.01$, the RNG or statistical pipeline has a systematic bias (`bug`).

## 2. Sample Size, Seeds & Stopping Rule

- **Seeds:** Exact deterministic seed set $S = \{1000, 1001, \dots, 1029\}$ ($N = 30$ independent seeds per arm; null control arm B uses $S_{\text{null}} = \{2000, \dots, 2029\}$).
- **Stopping rule:** Fixed sample size $N = 30$ seeds per arm. No optional stopping, no seed dropping, no post-hoc parameter tuning after execution.
- **Exclusion rule:** None; all 30 seeds are reported verbatim in raw CSV output (`data/experiments/per_seed_results.csv`).

## 3. Pre-Specified Statistical Analysis Plan

1. **Hypothesis test:** Exact/Monte Carlo two-sided paired sign-flip permutation test for paired-seed comparisons (H1, H2, H3) and two-sample permutation test for disjoint-seed null control (H4), with `10,000` seeded permutations (`stat_seed = 20261123`).
2. **Effect sizes:** Difference in medians, Cohen's $d$, and non-parametric Cliff's $\delta$.
3. **Uncertainty:** 95% percentile bootstrap confidence intervals (`10,000` resamples, `stat_seed = 20261123`).
4. **Multiple-comparison correction:** Holm–Bonferroni family-wise error rate control across all 4 tests (`H1`, `H2`, `H3`, `H4`) at $\alpha = 0.05$.
5. **Classification tag:** All stochastic simulation outputs are explicitly labeled `numerical_approximation` (distinguished from Lean 4 `kernel-checked` theorems and `exact-oracle` rational bounds).

## 4. Deviations Policy

Any change made after this commit is logged with timestamp and rationale in `DEVIATIONS.md`.
