module

public import Solution

-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Non-vacuity witness suite (v1.4.0 — 27 concrete witness theorems):
-- exhibits concrete numerical instances satisfying every hypothesis bundle
-- of all 24 headline theorems in Solution.lean.
-- Note: ATP and SNARE witness numbers are the author's illustrative model constants.

public section

namespace SynapseBouton.NonVacuity

open SynapseBouton

/-- Concrete witnesses for Hill n=4 (`Kd = 15 uM`, resting `5 uM` vs nanodomain `35 uM`,
    doubling from `Kd/2 = 15` to `Kd = 30`, and crossover vs. linear `n = 1`). -/
theorem witness_hill4_unit : pow4 20 < pow4 20 + pow4 15 :=
  hill4_unit_interval 20 15 (by omega)

theorem witness_hill4_half_max :
    0 < pow4 15 + pow4 15 ∧ 2 * pow4 15 = pow4 15 + pow4 15 :=
  hill4_half_max_exact 15 (by omega)

theorem witness_hill4_mono : pow4 5 * (pow4 35 + pow4 15) < pow4 35 * (pow4 5 + pow4 15) :=
  hill4_strict_monotone 5 35 15 (by omega) (by omega)

theorem witness_hill4_resting_floor :
    0 < pow4 5 + pow4 15 ∧ 82 * pow4 5 ≤ pow4 5 + pow4 15 :=
  hill4_resting_noise_floor 5 15 (by omega) (by omega)

theorem witness_hill4_doubling :
    0 < pow4 15 + pow4 (2 * 15) ∧
      0 < pow4 (2 * 15) + pow4 (2 * 15) ∧
      2 * pow4 (2 * 15) * (pow4 15 + pow4 (2 * 15)) =
        17 * pow4 15 * (pow4 (2 * 15) + pow4 (2 * 15)) :=
  hill4_ultrasensitive_doubling 15 (by omega)

theorem witness_hill4_crossover_below_kd :
    pow4 5 * (5 + 15) < 5 * (pow4 5 + pow4 15) :=
  (hill4_ultrasensitive_crossover_vs_linear 5 15 (by omega) (by omega)).1 (by omega)

theorem witness_hill4_crossover_above_kd :
    35 * (pow4 35 + pow4 15) < pow4 35 * (35 + 15) :=
  (hill4_ultrasensitive_crossover_vs_linear 35 15 (by omega) (by omega)).2 (by omega)

/-- Concrete witness for single-step Tsodyks-Markram STP (`scale = 1000`, `u = 400`, `u0 = 400`, `x = 1000`). -/
theorem witness_tsodyks_markram_step :
    400 ≤ tmUPlus 1000 400 400 ∧
      tmUPlus 1000 400 400 ≤ 1000 ∧
      tmEffRel 1000 (tmUPlus 1000 400 400) 1000 ≤ 1000 ∧
      1000 - tmEffRel 1000 (tmUPlus 1000 400 400) 1000 ≤ 1000 :=
  tsodyks_markram_step_unit_bounds 1000 400 400 1000
    (by omega) (by omega) (by omega) (by omega)

/-- Concrete witnesses for mature KCC2 E/I balance (`gL=1, gE=3, gI=4 nS; eI=-80, eL=-70, eE=0 mV`). -/
theorem witness_ei_bounds :
    (-80) * eiDen 1 3 4 ≤ eiNum 1 3 4 (-70) 0 (-80) ∧
      eiNum 1 3 4 (-70) 0 (-80) ≤ 0 * eiDen 1 3 4 :=
  ei_steady_state_bounds 1 3 4 (-70) 0 (-80) (by omega) (by omega) (by omega) (by omega) (by omega)

theorem witness_shunting_attenuation :
    eiNum 1 3 4 (-70) 0 (-80) * (1 + 3) < eiNum 1 3 0 (-70) 0 (-80) * eiDen 1 3 4 :=
  shunting_inhibition_strict_attenuation 1 3 4 (-70) 0 (-80)
    (by omega) (by omega) (by omega) (by omega) (by omega)

theorem witness_pure_shunting :
    0 < eiDen 1 3 4 ∧
      (0 : Int) < 1 + 3 ∧
      (0 : Int) < 3 * (0 - (-70)) ∧
      eiNum 1 3 4 (-70) 0 (-70) - (-70) * eiDen 1 3 4 = 3 * (0 - (-70)) ∧
      eiNum 1 3 0 (-70) 0 (-70) - (-70) * (1 + 3) = 3 * (0 - (-70)) :=
  pure_shunting_divisive_identity 1 3 4 (-70) 0 (by omega) (by omega) (by omega) (by omega)

/-- Concrete witness for `D/(D + mg*e)` monotonicity (`eRest=767`, `eDepol=3`, `dScale=357`, `mg=10`). -/
theorem witness_nmda_mg_unblock :
    357 < 357 + 10 * 767 ∧
      357 < 357 + 10 * 3 ∧
      357 * (357 + 10 * 3) < 357 * (357 + 10 * 767) :=
  nmda_mg_unblock_unit_interval_and_monotone 357 10 767 3
    (by omega) (by omega) (by omega) (by omega)

/-- Concrete witnesses for Wilhelm (2014) rat bouton (374 vesicles) & Human L1 (3,500 vesicles),
    plus a 3-step trace witness verified via structural induction. -/
def wilhelmBouton : VesiclePools := { rrp := 12, recycling := 62, reserve := 300 }
def humanL1Bouton : VesiclePools := { rrp := 20, recycling := 480, reserve := 3000 }

theorem witness_vesicle_conservation_rat :
    (stepVesiclePools wilhelmBouton 4 4 10).total = 374 := by
  have h := vesicle_pool_transition_invariant wilhelmBouton 4 4 10
    (by decide) (by decide) (by decide)
  exact h

theorem witness_vesicle_conservation_human_L1 :
    (stepVesiclePools humanL1Bouton 8 6 25).total = 3500 := by
  have h := vesicle_pool_transition_invariant humanL1Bouton 8 6 25
    (by decide) (by decide) (by decide)
  exact h

theorem witness_vesicle_multistep_human_L1 :
    (runVesicleTrace humanL1Bouton [(6, 4, 20), (5, 5, 15), (4, 6, 10)]).total = 3500 := by
  have hValid : ValidVesicleTrace humanL1Bouton [(6, 4, 20), (5, 5, 15), (4, 6, 10)] := by
    refine ⟨by decide, by decide, by decide, ?_⟩
    refine ⟨by decide, by decide, by decide, ?_⟩
    refine ⟨by decide, by decide, by decide, trivial⟩
  exact vesicle_pool_multistep_invariant humanL1Bouton [(6, 4, 20), (5, 5, 15), (4, 6, 10)] hValid

/-- Concrete witness for illustrative glycolysis-only ATP deficit (`a0 = 1,000,000 > 0`,
    burn `1,284,000 > 280,000` -> clamped store drops strictly below `1,000,000`). -/
theorem witness_atp_depletion :
    1000000 + 280000 * 1 < 1000000 + (4000 + 40 * 32000) * 1 ∧
      atpStoreAfter 1000000 4000 40 32000 280000 1 < 1000000 :=
  atp_deficit_strict_depletion 1000000 4000 40 32000 280000 1 (by omega) (by omega) (by omega)

/-- Concrete witness for the illustrative H3 mean-rate constants (40 Hz with active mitochondria:
    supply `950,000` vs burn `1,284,000`, deficit `334,000 ATP/s` -> upper bound gives `0` at `t = 3 s`). -/
theorem witness_atp_hitting_time_h3_40hz :
    atpStoreAfter 1000000 4000 40 32000 950000 3 = 0 :=
  atp_hitting_time_upper_bound 1000000 4000 40 32000 950000 3 (by omega) (by decide)

/-- Concrete witnesses for resting leak lowering both continuous critical frequency
    (`bLeak = 4,000, cAp = 32,000`) and integer floor maximal frequency (`bLeak = 40,000 >= cAp = 32,000`). -/
theorem witness_resting_leak :
    20 * 32000 < 950000 ∧
      (950000 - 4000) * 32000 < 950000 * 32000 ∧
      (32000 ≤ 4000 → (950000 - 4000) / 32000 < 950000 / 32000) :=
  resting_leak_strictly_lowers_sustainable_rate 4000 20 32000 950000 (by omega) (by omega) (by omega)

theorem witness_resting_leak_integer_drop :
    (950000 - 40000) / 32000 < 950000 / 32000 :=
  (resting_leak_strictly_lowers_sustainable_rate 40000 20 32000 950000
    (by omega) (by omega) (by omega)).2.2 (by omega)

theorem witness_kinesin_1mm : (8 * 125000) / 8 = 125000 ∧ 1000000 / 8 = 125000 :=
  kinesin_processive_atp_exact 125000

/-- Concrete witnesses for the illustrative SNARE barrier formula (`0 Ca2+` vs `5 Ca2+`). -/
theorem witness_snare_syt1 :
    snareEffBarrier50 4 5 150 ≤ snareEffBarrier50 4 0 150 :=
  snare_barrier_monotone_in_syt1_ca 4 0 5 150 (by omega)

theorem witness_snare_cooperativity :
    snareZipTenthKbt 3 < snareZipTenthKbt 4 ∧
      snareEffBarrier50 4 5 150 ≤ snareEffBarrier50 3 5 150 :=
  snare_copy_number_cooperativity 3 4 5 150 (by omega)

/-- Concrete witnesses for DNA-PAINT (`N = 2500, sigma = 110 nm`) vs RESI (`K = 9` subsets). -/
theorem witness_resi_variance : 12100 * 2500 < 12100 * (2500 * 9) :=
  resi_variance_strict_improvement 12100 2500 9 (by omega) (by omega) (by omega)

theorem witness_resi_duty : (2 * 1) * (2 * 5 + 5) < (2 * 5) * (2 * 1 + 5) :=
  resi_duty_cycle_monotone_in_imager 2 5 1 5 (by omega) (by omega) (by omega)

/-- Concrete witnesses for generic 2x2 integer determinant facts (`0`, `> 0`, and diagonal excess). -/
theorem witness_factorized_zero :
    bipartiteCoupling (3 * 4) (3 * 6) (7 * 4) (7 * 6) = 0 :=
  factorized_bipartition_zero_integration 3 7 4 6

theorem witness_correlated_nanocolumn :
    bipartiteCoupling 85 15 10 90 > 0 :=
  correlated_nanocolumn_positive_integration 85 15 10 90 (by omega)

theorem witness_diagonal_excess :
    ((15 : Int) + 70) * (10 + 80) > 15 * 10 ∧
      bipartiteCoupling (15 + 70) 15 10 (10 + 80) > 0 :=
  diagonal_excess_implies_positive_coupling 15 10 70 80 (by omega) (by omega) (by omega) (by omega)

end SynapseBouton.NonVacuity

end
