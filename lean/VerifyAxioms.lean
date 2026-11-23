-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Axiom audit module: prints exact axiom dependencies of all 18 exported headline theorems.
-- Every theorem must use only standard Lean axioms subset of [propext, Classical.choice, Quot.sound]
-- (and zero custom axioms / zero Lean.ofReduceBool / zero sorryAx).

import Solution
import NonVacuity

#print axioms SynapseBouton.hill4_unit_interval
#print axioms SynapseBouton.hill4_half_max_exact
#print axioms SynapseBouton.hill4_strict_monotone
#print axioms SynapseBouton.hill4_resting_noise_floor
#print axioms SynapseBouton.hill4_ultrasensitive_doubling
#print axioms SynapseBouton.ei_steady_state_bounds
#print axioms SynapseBouton.shunting_inhibition_strict_attenuation
#print axioms SynapseBouton.pure_shunting_divisive_identity
#print axioms SynapseBouton.vesicle_pool_transition_invariant
#print axioms SynapseBouton.atp_deficit_strict_depletion
#print axioms SynapseBouton.resting_leak_strictly_lowers_sustainable_rate
#print axioms SynapseBouton.kinesin_processive_atp_exact
#print axioms SynapseBouton.snare_barrier_monotone_in_syt1_ca
#print axioms SynapseBouton.snare_copy_number_cooperativity
#print axioms SynapseBouton.resi_variance_strict_improvement
#print axioms SynapseBouton.resi_duty_cycle_monotone_in_imager
#print axioms SynapseBouton.factorized_bipartition_zero_integration
#print axioms SynapseBouton.correlated_nanocolumn_positive_integration
