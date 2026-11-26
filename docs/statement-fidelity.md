# Lean 4.35.0 Statement Fidelity, Non-Vacuity & Adversarial Audit

This document provides the complete line-by-line fidelity mapping required by the Defensible Independent AI Research Playbook (Edition 1.3, §4 & §8 Items 5, 12) between informal biophysical/mathematical statements, Lean 4.35.0 declarations in [`lean/Challenge.lean`](../lean/Challenge.lean) & [`lean/Solution.lean`](../lean/Solution.lean), concrete physiological non-vacuity witnesses in [`lean/NonVacuity.lean`](../lean/NonVacuity.lean), and adversarial counterexample checks in [`lean/AdversarialChecks.lean`](../lean/AdversarialChecks.lean).

## Scope & Encoding Conventions

- **Exact Arithmetic Representation:** Real-valued rational ratios ($P_r = c^4/(c^4 + K_d^4)$, conductance dividers, Jahr–Stevens NMDAR unblock, RESI localization variance, imager duty cycle, Tsodyks–Markram fixed-point updates, SNARE barrier tenths/fiftieths) are cross-multiplied or integer-scaled over `Nat` / `Int` with **explicit strict positivity hypotheses** so every theorem is checked constructively with zero IEEE-754 rounding, zero `sorry`, zero `native_decide`, zero `Classical.choice`, and zero Mathlib.
- **Explicitly Outside Lean Scope:** Continuum 3D Brownian reaction–diffusion PDEs, IEEE-754 float64 4D Hodgkin–Huxley RK4 trajectories (tagged `numerical_approximation`), interventional causal graphs with latent confounders, and phenomenal consciousness/sentience.

## Complete 24-Theorem Fidelity Matrix (`v1.3.0`)

| # | Lean Declaration (`SynapseBouton.*`) | Domain | Exact Positive-Domain Guards | Non-Vacuity Witness (`NonVacuity.lean`) | Axiom Footprint |
|---|---|---|---|---|---|
| **T01** | `hill4_unit_interval` | I — Hill $n=4$ | `kd > 0` | `witness_hill4_unit` (`c=20, kd=15`) | `[propext, Quot.sound]` |
| **T02** | `hill4_half_max_exact` | I — Hill $n=4$ | `kd > 0` | `witness_hill4_half_max` (`kd=15`) | `[propext, Quot.sound]` |
| **T03** | `hill4_strict_monotone` | I — Hill $n=4$ | `c1 < c2`, `kd > 0` | `witness_hill4_mono` (`5 < 35, kd=15`) | `[]` (axiom-free) |
| **T04** | `hill4_resting_noise_floor` | I — Hill $n=4$ | `kd > 0`, `3*c ≤ kd` | `witness_hill4_resting_floor` (`c=5, kd=15`) | `[propext, Quot.sound]` |
| **T05** | `hill4_ultrasensitive_doubling` | I — Hill $n=4$ | `halfKd > 0` ($K_d = 2\,\text{halfKd}$) | `witness_hill4_doubling` (`halfKd=15`) | `[propext, Quot.sound]` |
| **T06** | `hill4_ultrasensitive_crossover_vs_linear` | I — Hill $n=4$ | `c > 0`, `kd > 0` | `witness_hill4_crossover_below_kd`, `witness_hill4_crossover_above_kd` | `[propext]` |
| **T07** | `tsodyks_markram_step_unit_bounds` | I — STP | `scale > 0`, `u ≤ scale`, `0 < u0 ≤ scale`, `x ≤ scale` | `witness_tsodyks_markram_step` (`S=1000, u=400, u0=400, x=1000`) | `[propext, Quot.sound]` |
| **T08** | `ei_steady_state_bounds` | II — E/I | `gL > 0`, `gE, gI ≥ 0`, `eI ≤ eL ≤ eE` | `witness_ei_bounds` (`gL=1, gE=3, gI=4`) | `[propext, Quot.sound]` |
| **T09** | `shunting_inhibition_strict_attenuation` | II — E/I | `gL, gE, gI > 0`, `eI ≤ eL < eE` | `witness_shunting_attenuation` | `[propext, Quot.sound]` |
| **T10** | `pure_shunting_divisive_identity` | II — E/I | `gL, gE, gI > 0`, `eL < eE` | `witness_pure_shunting` | `[propext, Quot.sound]` |
| **T11** | `nmda_mg_unblock_unit_interval_and_monotone` | II — NMDAR | `dScale > 0`, `mg > 0`, `0 < eDepol < eRest` | `witness_nmda_mg_unblock` (`-70 mV` vs `+20 mV`) | `[propext, Quot.sound]` |
| **T12** | `vesicle_pool_transition_invariant` | III — Vesicles | `exo ≤ rrp`, `prime ≤ rec + exo`, `mob ≤ res` | `witness_vesicle_conservation_rat` (`374`), `witness_vesicle_conservation_human_L1` (`3,500`) | `[propext, Quot.sound]` |
| **T13** | `vesicle_pool_multistep_invariant` | III — Vesicles | `ValidVesicleTrace p trace` (arbitrary finite list) | `witness_vesicle_multistep_human_L1` (3-step burst) | `[propext, Quot.sound]` |
| **T14** | `atp_deficit_strict_depletion` | III — ATP | `a0 > 0`, `sAtp < bLeak + f*cAp`, `t > 0` | `witness_atp_depletion` (`a0=10^6`, `40 Hz`) | `[propext, Quot.sound]` |
| **T15** | `atp_hitting_time_upper_bound` | III — ATP | `sAtp < bLeak + f*cAp`, `a0/D + 1 ≤ t` | `witness_atp_hitting_time_h3_40hz` (`t=3 s -> 0`) | `[propext, Quot.sound]` |
| **T16** | `resting_leak_strictly_lowers_sustainable_rate` | III — ATP | `bLeak > 0`, `cAp > 0`, `bLeak + f*cAp ≤ sAtp` | `witness_resting_leak`, `witness_resting_leak_integer_drop` | `[propext, Quot.sound]` |
| **T17** | `kinesin_processive_atp_exact` | III — Transport | Universal over `steps : Nat` | `witness_kinesin_1mm` (`125,000 ATP/mm`) | `[propext, Quot.sound]` |
| **T18** | `snare_barrier_monotone_in_syt1_ca` | IV — SNARE | `nCa1 ≤ nCa2` | `witness_snare_syt1` (`0 -> 5 Ca2+`) | `[propext, Quot.sound]` |
| **T19** | `snare_copy_number_cooperativity` | IV — SNARE | `n1 < n2` | `witness_snare_cooperativity` (`n=3 -> 4`) | `[propext, Quot.sound]` |
| **T20** | `resi_variance_strict_improvement` | V — RESI | `sigmaSq > 0`, `nPhotons > 0`, `kSubsets ≥ 2` | `witness_resi_variance` (`N=2500, K=9`) | `[propext, Quot.sound]` |
| **T21** | `resi_duty_cycle_monotone_in_imager` | V — RESI | `kOn > 0`, `kOff > 0`, `c1 < c2` | `witness_resi_duty` (`c=1 -> 5`) | `[]` (axiom-free) |
| **T22** | `factorized_bipartition_zero_integration` | VI — 2×2 Tables | Universal over `a0 a1 b0 b1 : Int` | `witness_factorized_zero` (`(3,7)⊗(4,6)`) | `[propext, Quot.sound]` |
| **T23** | `correlated_nanocolumn_positive_integration` | VI — 2×2 Tables | `w00 * w11 > w01 * w10` | `witness_correlated_nanocolumn` (`(85,15;10,90)`) | `[propext]` |
| **T24** | `diagonal_excess_implies_positive_coupling` | VI — 2×2 Tables | `w01, w10 ≥ 0`, `d1, d2 > 0` | `witness_diagonal_excess` (`d1=70, d2=80`) | `[propext, Quot.sound]` |

## Adversarial Counterexample Suite (`lean/AdversarialChecks.lean`, 6 Theorems)

To prove our hypotheses are non-redundant and our epistemic boundaries are tight, `lean/AdversarialChecks.lean` machine-proves six negative/counterexample theorems:
1. **`adv_hill4_zero_kd_degenerate`:** Dropping `kd > 0` allows `pow4 0 + pow4 0 = 0` (`0/0` denominator degeneracy).
2. **`adv_shunting_zero_gE_degenerate`:** Dropping `gE > 0` collapses excitatory drive `gE * (eE - eL)` to `0` (`0/0` divisive ratio).
3. **`adv_atp_zero_store_cannot_drop`:** Dropping `a0 > 0` makes strict drop `atpStoreAfter 0 ... < 0` impossible in `Nat`.
4. **`adv_resting_leak_integer_floor_tie`:** Dropping `cAp ≤ bLeak` allows integer-floor ties (`(110 - 1) / 100 = 110 / 100`), explaining why `T16` separates unconditional rational reduction from conditional integer-floor reduction.
5. **`adv_common_cause_positive_determinant`:** Exhibits a symmetric common-cause table `(40, 10; 10, 40)` with `bipartiteCoupling = 1500 > 0`, machine-proving inside Lean that positive determinant is strictly an observational algebraic property and NEVER certifies direct interventional causality.
6. **`adv_hill4_crossover_sharp_at_kd`:** Proves exact equality `P_4(15) = P_1(15) = 1/2` at `c = K_d`, confirming sharpness of `T06`.
