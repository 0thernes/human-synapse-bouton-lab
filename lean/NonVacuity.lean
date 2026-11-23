-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Non-vacuity witness suite: exhibits concrete physiological instances satisfying every
-- hypothesis bundle of every headline theorem in Solution.lean (Defensible Playbook §1).

import Solution

namespace SynapseBouton.NonVacuity

open SynapseBouton

/-- Concrete physiological witness for Hill n=4 (Kd = 15 uM, resting 5 uM vs nanodomain 35 uM). -/
theorem witness_hill4_unit : pow4 20 < pow4 20 + pow4 15 :=
  hill4_unit_interval 20 15 (by omega)

theorem witness_hill4_half_max : 2 * pow4 15 = pow4 15 + pow4 15 :=
  hill4_half_max_exact 15 (by omega)

theorem witness_hill4_mono : pow4 5 * (pow4 35 + pow4 15) < pow4 35 * (pow4 5 + pow4 15) :=
  hill4_strict_monotone 5 35 15 (by omega) (by omega)

theorem witness_hill4_resting_floor : 82 * pow4 5 ≤ pow4 5 + pow4 15 :=
  hill4_resting_noise_floor 5 15 (by omega)

theorem witness_hill4_doubling :
    2 * pow4 (2 * 15) * (pow4 15 + pow4 (2 * 15)) =
      17 * pow4 15 * (pow4 (2 * 15) + pow4 (2 * 15)) :=
  hill4_ultrasensitive_doubling 15

/-- Concrete witness for mature KCC2 E/I balance (gL=1, gE=3, gI=4 nS; eI=-80, eL=-70, eE=0 mV). -/
theorem witness_ei_bounds :
    (-80) * eiDen 1 3 4 ≤ eiNum 1 3 4 (-70) 0 (-80) ∧
      eiNum 1 3 4 (-70) 0 (-80) ≤ 0 * eiDen 1 3 4 :=
  ei_steady_state_bounds 1 3 4 (-70) 0 (-80) (by omega) (by omega) (by omega) (by omega) (by omega)

theorem witness_shunting_attenuation :
    eiNum 1 3 4 (-70) 0 (-80) * (1 + 3) < eiNum 1 3 0 (-70) 0 (-80) * eiDen 1 3 4 :=
  shunting_inhibition_strict_attenuation 1 3 4 (-70) 0 (-80)
    (by omega) (by omega) (by omega) (by omega) (by omega)

theorem witness_pure_shunting :
    eiNum 1 3 4 (-70) 0 (-70) - (-70) * eiDen 1 3 4 = 3 * (0 - (-70)) :=
  pure_shunting_divisive_identity 1 3 4 (-70) 0

/-- Concrete witness for Wilhelm (2014) bouton (12 + 62 + 300 = 374 vesicles) & Human L1 (3500 vesicles). -/
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

/-- Concrete witness for glycolysis-only ATP depletion at 40 Hz (burn = 1,284,000 > synth = 280,000). -/
theorem witness_atp_depletion :
    1000000 + 280000 * 1 < 1000000 + (4000 + 40 * 32000) * 1 :=
  atp_deficit_strict_depletion 1000000 4000 40 32000 280000 1 (by omega) (by omega)

theorem witness_resting_leak : 20 * 32000 < 950000 :=
  resting_leak_strictly_lowers_sustainable_rate 4000 20 32000 950000 (by omega) (by omega)

theorem witness_kinesin_1mm : (8 * 125000) / 8 = 125000 ∧ 1000000 / 8 = 125000 :=
  kinesin_processive_atp_exact 125000

/-- Concrete witness for SNAREpin clamping (0 Ca2+) vs synchronous release (5 Ca2+). -/
theorem witness_snare_syt1 :
    snareEffBarrier50 4 5 150 ≤ snareEffBarrier50 4 0 150 :=
  snare_barrier_monotone_in_syt1_ca 4 0 5 150 (by omega)

theorem witness_snare_cooperativity :
    snareZipTenthKbt 3 < snareZipTenthKbt 4 ∧
      snareEffBarrier50 4 5 150 ≤ snareEffBarrier50 3 5 150 :=
  snare_copy_number_cooperativity 3 4 5 150 (by omega)

/-- Concrete witness for DNA-PAINT (N=2500, sigma=110 nm) vs RESI (K=9 subsets). -/
theorem witness_resi_variance : 12100 * 2500 < 12100 * (2500 * 9) :=
  resi_variance_strict_improvement 12100 2500 9 (by omega) (by omega) (by omega)

theorem witness_resi_duty : (2 * 1) * (2 * 5 + 5) < (2 * 5) * (2 * 1 + 5) :=
  resi_duty_cycle_monotone_in_imager 2 5 1 5 (by omega) (by omega) (by omega)

/-- Concrete witness for bipartite causal coupling: product state (0) vs aligned nanocolumn (>0). -/
theorem witness_factorized_zero :
    bipartiteCoupling (3 * 4) (3 * 6) (7 * 4) (7 * 6) = 0 :=
  factorized_bipartition_zero_integration 3 7 4 6

theorem witness_correlated_nanocolumn :
    bipartiteCoupling 85 15 10 90 > 0 :=
  correlated_nanocolumn_positive_integration 85 15 10 90 (by omega)

end SynapseBouton.NonVacuity
