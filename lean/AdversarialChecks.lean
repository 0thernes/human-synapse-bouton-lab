module

public import Solution

-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Sanity and Sharpness Checks (v1.4.0 — 7 machine-checked boundary & example lemmas):
-- Demonstrates concrete boundary failures when specific positivity or threshold guards are
-- dropped (A01-A04, A06), records a kernel-checked example of a non-factorising 2x2 integer
-- table (A05; any causal reading is informal), and shows why T15 is an upper bound rather
-- than an exact hitting time when D divides a0 (A07).

public section

namespace SynapseBouton.AdversarialChecks

open SynapseBouton

/-- Check A01: Dropping `kd > 0` in T02/T04 fails the positive-denominator conjunct at `c = kd = 0`. -/
theorem adv_hill4_zero_kd_degenerate :
    pow4 0 + pow4 0 = 0 ∧ ¬ (0 < pow4 0 + pow4 0) := by
  constructor <;> decide

/-- Check A02: Dropping `gE > 0` in T10 fails the positive excitatory-drive conjunct at `gE = 0`. -/
theorem adv_shunting_zero_gE_degenerate :
    (0 : Int) * (0 - (-70)) = 0 ∧ ¬ ((0 : Int) < 0 * (0 - (-70))) := by
  constructor <;> decide

/-- Check A03: Dropping `a0 > 0` in T14 makes strict drop `atpStoreAfter 0 ... < 0` impossible in `Nat`. -/
theorem adv_atp_zero_store_cannot_drop :
    ¬ (atpStoreAfter 0 4000 40 32000 280000 1 < 0) := by
  omega

/-- Check A04: Dropping `cAp <= bLeak` in T16 allows integer-floor ties (`(110 - 1) / 100 = 110 / 100`),
    negating strict integer-floor reduction when `0 < bLeak < cAp`. -/
theorem adv_resting_leak_integer_floor_tie :
    (110 - 1) / 100 = 110 / 100 ∧ ¬ ((110 - 1) / 100 < 110 / 100) := by
  constructor <;> decide

/-- Check A05: Kernel-checked evaluation of one non-factorising 2x2 integer table `(40, 10; 10, 40)`
    giving `bipartiteCoupling 40 10 10 40 = 1500 > 0`. Note: NO causal model is defined in Lean;
    reading this table as two conditionally independent variables driven by a shared binary common
    cause (so a positive 2x2 determinant does not establish direct causality) is informal. -/
theorem adv_common_cause_positive_determinant :
    bipartiteCoupling 40 10 10 40 = 1500 ∧ bipartiteCoupling 40 10 10 40 > 0 := by
  constructor <;> decide

/-- Check A06: At exact half-max `c = Kd = 15`, Hill `n = 4` and linear `n = 1` coincide identically,
    negating strict inequality and confirming sharpness of the strict crossover in T06. -/
theorem adv_hill4_crossover_sharp_at_kd :
    pow4 15 * (15 + 15) = 15 * (pow4 15 + pow4 15) ∧
      ¬ (pow4 15 * (15 + 15) < 15 * (pow4 15 + pow4 15)) := by
  constructor <;> decide

/-- Check A07: When net deficit `D` evenly divides `a0` (e.g., `a0 = 10`, `D = 5`), the deterministic
    mean-rate store already hits 0 at `t = 2`, strictly earlier than the T15 upper bound `10 / 5 + 1 = 3`.
    Confirms T15 (`atp_hitting_time_upper_bound`) is an upper bound in general, not always an exact hitting time. -/
theorem adv_atp_hitting_time_is_upper_bound :
    atpStoreAfter 10 0 1 5 0 2 = 0 ∧ 2 < 10 / ((0 + 1 * 5) - 0) + 1 := by
  constructor <;> decide

end SynapseBouton.AdversarialChecks

end
