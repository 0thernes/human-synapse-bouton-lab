# Lean 4.35.0 Statement Fidelity, Non-Vacuity & Sanity Checks (`v1.4.0`)

This document maps informal statements (Defensible Independent AI Research Playbook, Edition 1.3, §4 & §8 Items 5, 12) to Lean 4.35.0 declarations in [`lean/Challenge.lean`](../lean/Challenge.lean) & [`lean/Solution.lean`](../lean/Solution.lean), the **27 concrete non-vacuity witness theorems** in [`lean/NonVacuity.lean`](../lean/NonVacuity.lean), the **7 sanity and sharpness checks** in [`lean/AdversarialChecks.lean`](../lean/AdversarialChecks.lean), and the executable Lean-to-engine vector bridge in [`lean/ExportVectors.lean`](../lean/ExportVectors.lean).

All 24 statements are elementary integer inequalities, conservation identities, or list-induction facts about the repository's own model formulas. They are known elementary facts; none answers a published open question. In `v1.4.0`, every unused hypothesis was removed (`0` unused hypotheses across all 24 lemmas), zero `Classical.choice` is strictly enforced by `lean/comparator.json`, CI, and `scripts/check_readme_axioms.py`, and [`lean/ExportVectors.lean`](../lean/ExportVectors.lean) exports `data/lean_engine_vectors.json` directly from Lean definitions to verify numerical parity with Python, TypeScript, and Rust (`ERRATA.md` `E07`).

## Scope & Encoding Conventions

- **Exact Arithmetic Representation:** Real-valued rational ratios ($P_r = c^4/(c^4 + K_d^4)$, conductance dividers, Jahr–Stevens NMDAR unblock, RESI localization variance, imager duty cycle, Tsodyks–Markram fixed-point updates, SNARE barrier tenths/fiftieths) are cross-multiplied or integer-scaled over `Nat` / `Int` with **explicit strict positivity hypotheses** so every lemma is checked with zero IEEE-754 rounding, zero `sorry` in proof modules, zero `native_decide`, zero unused hypotheses, strictly enforced zero `Classical.choice`, and no Mathlib. No real-valued function is defined.
- **Explicitly Outside Lean Scope:** Continuum 3D Brownian reaction–diffusion PDEs, IEEE-754 float64 4D Hodgkin–Huxley RK4 trajectories (tagged `numerical_approximation`), Rust's stochastic per-second jitter in `run_monte_carlo_bouton`, any causal model, and phenomenal consciousness/sentience.

## Notes on Individual Statements (`v1.4.0`, Post-Audit)

- **T02** (`hill4_half_max_exact`): Strengthened in `v1.4.0` to prove `0 < pow4 kd + pow4 kd ∧ 2 * pow4 kd = pow4 kd + pow4 kd`, so `hkd : kd > 0` is used and necessary (negation checked by `A01`).
- **T07** (`tsodyks_markram_step_unit_bounds`): Covers one discrete spike update; generalized in `v1.4.0` by dropping unused `u0 > 0` (holds for all `u0 ≤ scale`, `0` unused hypotheses).
- **T10** (`pure_shunting_divisive_identity`): States strict denominator/drive positivity and two cleared-denominator numerator identities; the real ratio itself is not formed as a `Real` type.
- **T11** (`nmda_mg_unblock_unit_interval_and_monotone`): Monotonicity of $D/(D+m e)$ in an abstract positive natural number $e$, the algebraic form of Jahr–Stevens $\mathrm{Mg}^{2+}$ unblock (no voltage or real exponential appears).
- **T15** (`atp_hitting_time_upper_bound`): Proves an **upper bound** on zero time: the constant-rate integer store is 0 for every $t \ge \lfloor a_0/D\rfloor + 1$. For the illustrative H3 constants this gives $t \ge 3\,$s; in general depletion can occur strictly earlier when $D \mid a_0$ (proved by `A07`: $a_0=10, D=5 \implies$ store hits 0 at $t=2 < 3$). Rust's simulated runs add per-second jitter.
- **T17** (`kinesin_processive_atp_exact`): Integer arithmetic identity `(8 * steps) / 8 = steps ∧ 1000000 / 8 = 125000`; contains no biophysical motor dynamics. **T18** and **T19** are non-strict monotonicity on integer-scaled barrier formulas.
- **T22–T24** (`outer_product_det_zero`, `det_pos_of_diag_dominance`, `det_pos_of_diag_excess` — aliases of the legacy biological names): Elementary $2\times 2$ integer determinant identities over four arbitrary `Int` values. They contain no notion of integration, causality, or nanocolumn structure; they are counted once among the 24 lemmas and are withdrawn from `NEURO-004` and `NeuroCS`.
- **Illustrative constants:** The ATP and SNARE constants used in witnesses and H3/H3b are illustrative model values, not wet-lab measurements from the cited papers.

## Complete 24-Lemma Fidelity Matrix (`v1.4.0`)

| # | Lean Declaration (`SynapseBouton.*`) | Domain | Exact Positive-Domain Guards | Non-Vacuity Witness (`NonVacuity.lean`) | Axiom Footprint |
|---|---|---|---|---|---|
| **T01** | `hill4_unit_interval` | I — Hill $n=4$ | `kd > 0` | `witness_hill4_unit` (`c=20, kd=15`) | `[propext, Quot.sound]` |
| **T02** | `hill4_half_max_exact` | I — Hill $n=4$ | `kd > 0` (used) | `witness_hill4_half_max` (`kd=15`) | `[propext, Quot.sound]` |
| **T03** | `hill4_strict_monotone` | I — Hill $n=4$ | `c1 < c2`, `kd > 0` | `witness_hill4_mono` (`5 < 35, kd=15`) | `[]` (axiom-free) |
| **T04** | `hill4_resting_noise_floor` | I — Hill $n=4$ | `kd > 0`, `3*c ≤ kd` | `witness_hill4_resting_floor` (`c=5, kd=15`) | `[propext, Quot.sound]` |
| **T05** | `hill4_ultrasensitive_doubling` | I — Hill $n=4$ | `halfKd > 0` ($K_d = 2\,\text{halfKd}$) | `witness_hill4_doubling` (`halfKd=15`) | `[propext, Quot.sound]` |
| **T06** | `hill4_ultrasensitive_crossover_vs_linear` | I — Hill $n=4$ | `c > 0`, `kd > 0` | `witness_hill4_crossover_below_kd`, `witness_hill4_crossover_above_kd` | `[propext]` |
| **T07** | `tsodyks_markram_step_unit_bounds` | I — STP | `scale > 0`, `u ≤ scale`, `u0 ≤ scale`, `x ≤ scale` | `witness_tsodyks_markram_step` (`S=1000, u=400, u0=400, x=1000`) | `[propext, Quot.sound]` |
| **T08** | `ei_steady_state_bounds` | II — E/I | `gL > 0`, `gE, gI ≥ 0`, `eI ≤ eL ≤ eE` | `witness_ei_bounds` (`gL=1, gE=3, gI=4`) | `[propext, Quot.sound]` |
| **T09** | `shunting_inhibition_strict_attenuation` | II — E/I | `gL, gE, gI > 0`, `eI ≤ eL < eE` | `witness_shunting_attenuation` | `[propext, Quot.sound]` |
| **T10** | `pure_shunting_divisive_identity` | II — E/I | `gL, gE, gI > 0`, `eL < eE` | `witness_pure_shunting` | `[propext, Quot.sound]` |
| **T11** | `nmda_mg_unblock_unit_interval_and_monotone` | II — NMDAR | `dScale > 0`, `mg > 0`, `0 < eDepol < eRest` | `witness_nmda_mg_unblock` (`-70 mV` vs `+20 mV`) | `[propext, Quot.sound]` |
| **T12** | `vesicle_pool_transition_invariant` | III — Vesicles | `exo ≤ rrp`, `prime ≤ rec + exo`, `mob ≤ res` | `witness_vesicle_conservation_rat` (`374`), `witness_vesicle_conservation_human_L1` (`3,500`) | `[propext, Quot.sound]` |
| **T13** | `vesicle_pool_multistep_invariant` | III — Vesicles | `ValidVesicleTrace p trace` (arbitrary finite list) | `witness_vesicle_multistep_human_L1` (3-step burst) | `[propext, Quot.sound]` |
| **T14** | `atp_deficit_strict_depletion` | III — ATP | `a0 > 0`, `sAtp < bLeak + f*cAp`, `t > 0` | `witness_atp_depletion` (`a0=10^6`, `40 Hz`) | `[propext, Quot.sound]` |
| **T15** | `atp_hitting_time_upper_bound` | III — ATP | `sAtp < bLeak + f*cAp`, `a0/D + 1 ≤ t` | `witness_atp_hitting_time_h3_40hz` (upper bound `t ≥ 3 s`) | `[propext, Quot.sound]` |
| **T16** | `resting_leak_strictly_lowers_sustainable_rate` | III — ATP | `bLeak > 0`, `cAp > 0`, `bLeak + f*cAp ≤ sAtp` | `witness_resting_leak`, `witness_resting_leak_integer_drop` | `[propext, Quot.sound]` |
| **T17** | `kinesin_processive_atp_exact` | III — Transport | Universal over `steps : Nat` | `witness_kinesin_1mm` (`125,000 ATP/mm`) | `[propext, Quot.sound]` |
| **T18** | `snare_barrier_monotone_in_syt1_ca` | IV — SNARE | `nCa1 ≤ nCa2` | `witness_snare_syt1` (`0 -> 5 Ca2+`) | `[propext, Quot.sound]` |
| **T19** | `snare_copy_number_cooperativity` | IV — SNARE | `n1 < n2` | `witness_snare_cooperativity` (`n=3 -> 4`) | `[propext, Quot.sound]` |
| **T20** | `resi_variance_strict_improvement` | V — RESI | `sigmaSq > 0`, `nPhotons > 0`, `kSubsets ≥ 2` | `witness_resi_variance` (`N=2500, K=9`) | `[propext, Quot.sound]` |
| **T21** | `resi_duty_cycle_monotone_in_imager` | V — RESI | `kOn > 0`, `kOff > 0`, `c1 < c2` | `witness_resi_duty` (`c=1 -> 5`) | `[]` (axiom-free) |
| **T22** | `factorized_bipartition_zero_integration` (`outer_product_det_zero`) | VI — 2×2 Det. | Universal over `a0 a1 b0 b1 : Int` | `witness_factorized_zero` (`(3,7)⊗(4,6)`) | `[propext, Quot.sound]` |
| **T23** | `correlated_nanocolumn_positive_integration` (`det_pos_of_diag_dominance`) | VI — 2×2 Det. | `w00 * w11 > w01 * w10` | `witness_correlated_nanocolumn` (`(85,15;10,90)`) | `[propext]` |
| **T24** | `diagonal_excess_implies_positive_coupling` (`det_pos_of_diag_excess`) | VI — 2×2 Det. | `w01, w10 ≥ 0`, `d1, d2 > 0` | `witness_diagonal_excess` (`d1=70, d2=80`) | `[propext, Quot.sound]` |

## Sanity and Sharpness Checks (`lean/AdversarialChecks.lean`, 7 Theorems)

1. **`A01` (`adv_hill4_zero_kd_degenerate`):** Proves explicit negation `¬ (∀ c kd : Nat, pow4 c < pow4 c + pow4 kd)` (at `c = kd = 0`, `0/0` degeneracy falsifies `T01`/`T02`).
2. **`A02` (`adv_shunting_zero_gE_degenerate`):** Proves explicit negation `¬ (∀ gE eL eE : Int, eL < eE → 0 < gE * (eE - eL))` (dropping `gE > 0` falsifies `T10`'s positive excitatory drive).
3. **`A03` (`adv_atp_zero_store_cannot_drop`):** Proves `¬ (atpStoreAfter 0 4000 40 32000 950000 1 < 0)` (dropping `a0 > 0` makes `T14`'s strict drop impossible in `Nat`).
4. **`A04` (`adv_resting_leak_integer_floor_tie`):** Proves explicit negation `¬ (∀ bLeak cAp sAtp : Nat, bLeak > 0 → cAp > 0 → bLeak ≤ sAtp → (sAtp - bLeak) / cAp < sAtp / cAp)` (explains `T16`'s exact `cAp ≤ bLeak` condition).
5. **`A05` (`adv_common_cause_positive_determinant`):** Evaluates `bipartiteCoupling 40 10 10 40 = 1500 ∧ bipartiteCoupling 40 10 10 40 > 0`. No causal model is defined in Lean; reading this table as two variables driven by a latent common cause is explicitly marked informal.
6. **`A06` (`adv_hill4_crossover_sharp_at_kd`):** Proves exact tie and explicit negation of both strict `T06` inequalities at `c = K_d = 15`.
7. **`A07` (`adv_atp_hitting_time_is_upper_bound`):** Proves `atpStoreAfter 10 0 1 5 0 2 = 0 ∧ 2 < 10 / 5 + 1`, certifying that `T15` is an upper bound (depletion can happen strictly earlier when $D \mid a_0$).
