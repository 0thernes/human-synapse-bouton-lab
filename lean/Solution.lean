module

-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Machine-checked Lean 4.35.0 proofs of all 18 theorems in Challenge.lean.
-- Zero sorry, zero admit, zero native_decide, zero custom axioms, zero Mathlib.

public section

namespace SynapseBouton

/-- Exact fourth power `x^4` used in Hill `n = 4` release probability `P_r(c) = c^4 / (c^4 + Kd^4)`. -/
@[expose] def pow4 (x : Nat) : Nat := x * x * x * x

/-- Conductance-weighted steady-state numerator: `gL*eL + gE*eE + gI*eI`. -/
@[expose] def eiNum (gL gE gI eL eE eI : Int) : Int :=
  gL * eL + gE * eE + gI * eI

/-- Total postsynaptic conductance denominator: `gL + gE + gI`. -/
@[expose] def eiDen (gL gE gI : Int) : Int :=
  gL + gE + gI

/-- Presynaptic vesicle pool state (RRP, Recycling Pool, Reserve/Resting Pool). -/
structure VesiclePools where
  rrp : Nat
  recycling : Nat
  reserve : Nat
  deriving DecidableEq, Repr

@[expose] def VesiclePools.total (p : VesiclePools) : Nat :=
  p.rrp + p.recycling + p.reserve

/-- Conservative single-step vesicle pool transition. -/
@[expose] def stepVesiclePools (p : VesiclePools) (exo prime mob : Nat) : VesiclePools :=
  { rrp := p.rrp - exo + prime
    recycling := p.recycling + exo - prime + mob
    reserve := p.reserve - mob }

/-- Nonnegative clamped local ATP store after duration `t` under constant supply `sAtp`
    and total consumption rate `bLeak + f * cAp` (clamped at 0 via `Nat` subtraction). -/
@[expose] def atpStoreAfter (a0 bLeak f cAp sAtp t : Nat) : Nat :=
  (a0 + sAtp * t) - (bLeak + f * cAp) * t

/-- Integer-scaled SNAREpin zippering energy (in tenths of `k_B T`). -/
@[expose] def snareZipTenthKbt (nSnare : Nat) : Int :=
  115 * (nSnare : Int)

/-- Integer-scaled unclamped SNARE effective barrier (in fiftieths of `k_B T`). -/
@[expose] def snareRawBarrier50 (nSnare nCa clampTenth : Nat) : Int :=
  1400 + (5 - (nCa : Int)) * (clampTenth : Int) - 120 * (nCa : Int) - 160 * ((nSnare : Int) - 1)

/-- Clamped effective barrier in fiftieths of `k_B T` with lower floor 60 (`= 1.2 k_B T`). -/
@[expose] def snareEffBarrier50 (nSnare nCa clampTenth : Nat) : Int :=
  max 60 (snareRawBarrier50 nSnare nCa clampTenth)

/-- Exact 2x2 discrete weight-table cross-coupling determinant `|w00*w11 - w01*w10|`. -/
@[expose] def bipartiteCoupling (w00 w01 w10 w11 : Int) : Int :=
  Int.ofNat (Int.natAbs (w00 * w11 - w01 * w10))

-- ============================================================================
-- Helper lemmas (private, exact arithmetic)
-- ============================================================================

private theorem pow4_pos {x : Nat} (hx : x > 0) : pow4 x > 0 := by
  unfold pow4
  exact Nat.mul_pos (Nat.mul_pos (Nat.mul_pos hx hx) hx) hx

private theorem pow4_lt_pow4 {a b : Nat} (h : a < b) : pow4 a < pow4 b := by
  unfold pow4
  have h2 : a * a < b * b := Nat.mul_lt_mul_of_lt_of_lt h h
  have h3 : a * a * a < b * b * b := Nat.mul_lt_mul_of_lt_of_lt h2 h
  exact Nat.mul_lt_mul_of_lt_of_lt h3 h

private theorem pow4_le_pow4 {a b : Nat} (h : a ≤ b) : pow4 a ≤ pow4 b := by
  unfold pow4
  have h2 : a * a ≤ b * b := Nat.mul_le_mul h h
  have h3 : a * a * a ≤ b * b * b := Nat.mul_le_mul h2 h
  exact Nat.mul_le_mul h3 h

-- ============================================================================
-- DOMAIN I: Ca2+ Nanodomain & Hill n=4 Cooperativity (5 Theorems)
-- ============================================================================

theorem hill4_unit_interval (c kd : Nat) (hkd : kd > 0) :
    pow4 c < pow4 c + pow4 kd := by
  have hpos : pow4 kd > 0 := pow4_pos hkd
  omega

theorem hill4_half_max_exact (kd : Nat) (_hkd : kd > 0) :
    2 * pow4 kd = pow4 kd + pow4 kd := by
  omega

theorem hill4_strict_monotone (c1 c2 kd : Nat) (hc : c1 < c2) (hkd : kd > 0) :
    pow4 c1 * (pow4 c2 + pow4 kd) < pow4 c2 * (pow4 c1 + pow4 kd) := by
  have hlt : pow4 c1 < pow4 c2 := pow4_lt_pow4 hc
  have hpos : pow4 kd > 0 := pow4_pos hkd
  have hmul : pow4 c1 * pow4 kd < pow4 c2 * pow4 kd := Nat.mul_lt_mul_of_pos_right hlt hpos
  have hcomm : pow4 c1 * pow4 c2 = pow4 c2 * pow4 c1 := Nat.mul_comm (pow4 c1) (pow4 c2)
  rw [Nat.mul_add, Nat.mul_add, hcomm]
  exact Nat.add_lt_add_left hmul (pow4 c2 * pow4 c1)

theorem hill4_resting_noise_floor (c kd : Nat) (hkd : kd > 0) (h : 3 * c ≤ kd) :
    0 < pow4 c + pow4 kd ∧ 82 * pow4 c ≤ pow4 c + pow4 kd := by
  have hpos : pow4 kd > 0 := pow4_pos hkd
  have hle : pow4 (3 * c) ≤ pow4 kd := pow4_le_pow4 h
  have h81 : pow4 (3 * c) = 81 * pow4 c := by
    unfold pow4
    have : (3 * c) * (3 * c) * (3 * c) * (3 * c) = 81 * (c * c * c * c) := by
      simp [Nat.mul_assoc, Nat.mul_left_comm, Nat.mul_comm]
    exact this
  rw [h81] at hle
  constructor <;> omega

theorem hill4_ultrasensitive_doubling (halfKd : Nat) (hh : halfKd > 0) :
    0 < pow4 halfKd + pow4 (2 * halfKd) ∧
      0 < pow4 (2 * halfKd) + pow4 (2 * halfKd) ∧
      2 * pow4 (2 * halfKd) * (pow4 halfKd + pow4 (2 * halfKd)) =
        17 * pow4 halfKd * (pow4 (2 * halfKd) + pow4 (2 * halfKd)) := by
  have hpos : pow4 halfKd > 0 := pow4_pos hh
  have h16 : pow4 (2 * halfKd) = 16 * pow4 halfKd := by
    unfold pow4
    simp [Nat.mul_assoc, Nat.mul_left_comm, Nat.mul_comm]
  refine ⟨by rw [h16]; omega, by rw [h16]; omega, ?_⟩
  rw [h16]
  have hleft : 2 * (16 * pow4 halfKd) * (pow4 halfKd + 16 * pow4 halfKd) =
      544 * (pow4 halfKd * pow4 halfKd) := by
    have hsum : pow4 halfKd + 16 * pow4 halfKd = 17 * pow4 halfKd := by omega
    rw [hsum]
    simp [Nat.mul_left_comm, Nat.mul_comm]
    omega
  have hright : 17 * pow4 halfKd * (16 * pow4 halfKd + 16 * pow4 halfKd) =
      544 * (pow4 halfKd * pow4 halfKd) := by
    have hsum : 16 * pow4 halfKd + 16 * pow4 halfKd = 32 * pow4 halfKd := by omega
    rw [hsum]
    simp [Nat.mul_left_comm, Nat.mul_comm]
    omega
  rw [hleft, hright]

-- ============================================================================
-- DOMAIN II: Conductance-Based E/I Balance & Shunting Inhibition (3 Theorems)
-- ============================================================================

theorem ei_steady_state_bounds (gL gE gI eL eE eI : Int)
    (hgL : gL > 0) (hgE : gE ≥ 0) (hgI : gI ≥ 0)
    (hIL : eI ≤ eL) (hLE : eL ≤ eE) :
    eI * eiDen gL gE gI ≤ eiNum gL gE gI eL eE eI ∧
      eiNum gL gE gI eL eE eI ≤ eE * eiDen gL gE gI := by
  unfold eiNum eiDen
  have hIE : eI ≤ eE := Int.le_trans hIL hLE
  have h1 : gL * (eL - eI) ≥ 0 := Int.mul_nonneg (Int.le_of_lt hgL) (Int.sub_nonneg.mpr hIL)
  have h2 : gE * (eE - eI) ≥ 0 := Int.mul_nonneg hgE (Int.sub_nonneg.mpr hIE)
  have h3 : gL * (eE - eL) ≥ 0 := Int.mul_nonneg (Int.le_of_lt hgL) (Int.sub_nonneg.mpr hLE)
  have h4 : gI * (eE - eI) ≥ 0 := Int.mul_nonneg hgI (Int.sub_nonneg.mpr hIE)
  constructor
  · have hdiff : (gL * eL + gE * eE + gI * eI) - eI * (gL + gE + gI) =
        gL * (eL - eI) + gE * (eE - eI) := by
      simp [Int.mul_add, Int.mul_sub, Int.mul_comm]
      omega
    have hnn : gL * (eL - eI) + gE * (eE - eI) ≥ 0 := Int.add_nonneg h1 h2
    omega
  · have hdiff : eE * (gL + gE + gI) - (gL * eL + gE * eE + gI * eI) =
        gL * (eE - eL) + gI * (eE - eI) := by
      simp [Int.mul_add, Int.mul_sub, Int.mul_comm]
      omega
    have hnn : gL * (eE - eL) + gI * (eE - eI) ≥ 0 := Int.add_nonneg h3 h4
    omega

theorem shunting_inhibition_strict_attenuation (gL gE gI eL eE eI : Int)
    (hgL : gL > 0) (hgE : gE > 0) (hgI : gI > 0)
    (hIL : eI ≤ eL) (hLE : eL < eE) :
    eiNum gL gE gI eL eE eI * (gL + gE) < eiNum gL gE 0 eL eE eI * eiDen gL gE gI := by
  unfold eiNum eiDen
  have hIE : eI < eE := Int.lt_of_le_of_lt hIL hLE
  have hterm1 : gI * gL * (eL - eI) ≥ 0 :=
    Int.mul_nonneg (Int.mul_nonneg (Int.le_of_lt hgI) (Int.le_of_lt hgL)) (Int.sub_nonneg.mpr hIL)
  have hterm2 : gI * gE * (eE - eI) > 0 :=
    Int.mul_pos (Int.mul_pos hgI hgE) (Int.sub_pos.mpr hIE)
  have hdiff : (gL * eL + gE * eE + 0 * eI) * (gL + gE + gI) -
      (gL * eL + gE * eE + gI * eI) * (gL + gE) =
      gI * gL * (eL - eI) + gI * gE * (eE - eI) := by
    simp [Int.mul_add, Int.mul_sub, Int.mul_left_comm, Int.mul_comm]
    omega
  omega

theorem pure_shunting_divisive_identity (gL gE gI eL eE : Int)
    (hgL : gL > 0) (hgE : gE > 0) (hgI : gI > 0) (hLE : eL < eE) :
    0 < eiDen gL gE gI ∧
      0 < gL + gE ∧
      0 < gE * (eE - eL) ∧
      eiNum gL gE gI eL eE eL - eL * eiDen gL gE gI = gE * (eE - eL) ∧
      eiNum gL gE 0 eL eE eL - eL * (gL + gE) = gE * (eE - eL) := by
  unfold eiNum eiDen
  have hDrive : 0 < gE * (eE - eL) := Int.mul_pos hgE (Int.sub_pos.mpr hLE)
  refine ⟨by omega, by omega, hDrive, ?_, ?_⟩
  · simp [Int.mul_add, Int.mul_sub, Int.mul_comm]
    omega
  · simp [Int.mul_add, Int.mul_sub, Int.mul_comm]
    omega

-- ============================================================================
-- DOMAIN III: Presynaptic Vesicle Conservation & Bioenergetics (4 Theorems)
-- ============================================================================

theorem vesicle_pool_transition_invariant (p : VesiclePools) (exo prime mob : Nat)
    (hExo : exo ≤ p.rrp)
    (hPrime : prime ≤ p.recycling + exo)
    (hMob : mob ≤ p.reserve) :
    (stepVesiclePools p exo prime mob).total = p.total := by
  unfold stepVesiclePools VesiclePools.total
  dsimp
  omega

theorem atp_deficit_strict_depletion (a0 bLeak f cAp sAtp t : Nat)
    (ha0 : a0 > 0) (hDeficit : sAtp < bLeak + f * cAp) (ht : t > 0) :
    a0 + sAtp * t < a0 + (bLeak + f * cAp) * t ∧
      atpStoreAfter a0 bLeak f cAp sAtp t < a0 := by
  unfold atpStoreAfter
  have hmul : sAtp * t < (bLeak + f * cAp) * t := Nat.mul_lt_mul_of_pos_right hDeficit ht
  constructor <;> omega

theorem resting_leak_strictly_lowers_sustainable_rate (bLeak f cAp sAtp : Nat)
    (hLeak : bLeak > 0) (hCap : cAp > 0) (hSust : bLeak + f * cAp ≤ sAtp) :
    f * cAp < sAtp ∧
      (sAtp - bLeak) * cAp < sAtp * cAp ∧
      (cAp ≤ bLeak → (sAtp - bLeak) / cAp < sAtp / cAp) := by
  have hSubLt : sAtp - bLeak < sAtp := by omega
  have hRat : (sAtp - bLeak) * cAp < sAtp * cAp := Nat.mul_lt_mul_of_pos_right hSubLt hCap
  refine ⟨by omega, hRat, ?_⟩
  intro hGe
  have hAddLe : sAtp - bLeak + cAp ≤ sAtp := by omega
  have hDivStep : (sAtp - bLeak) / cAp + 1 = (sAtp - bLeak + cAp) / cAp := by
    rw [Nat.add_div_right _ hCap]
  have hDivLe : (sAtp - bLeak + cAp) / cAp ≤ sAtp / cAp := Nat.div_le_div_right hAddLe
  omega

theorem kinesin_processive_atp_exact (steps : Nat) :
    (8 * steps) / 8 = steps ∧ 1000000 / 8 = 125000 := by
  constructor
  · omega
  · decide

-- ============================================================================
-- DOMAIN IV: SNAREpin Zippering & Complexin/Syt1 Clamp Kinetics (2 Theorems)
-- ============================================================================

theorem snare_barrier_monotone_in_syt1_ca (nSnare nCa1 nCa2 clampTenth : Nat)
    (hCa : nCa1 ≤ nCa2) :
    snareEffBarrier50 nSnare nCa2 clampTenth ≤ snareEffBarrier50 nSnare nCa1 clampTenth := by
  unfold snareEffBarrier50 snareRawBarrier50
  have hCaI : (nCa1 : Int) ≤ (nCa2 : Int) := Int.ofNat_le.mpr hCa
  have hClampNN : (clampTenth : Int) ≥ 0 := Int.natCast_nonneg clampTenth
  have hMul : ((nCa2 : Int) - (nCa1 : Int)) * (clampTenth : Int) ≥ 0 :=
    Int.mul_nonneg (Int.sub_nonneg.mpr hCaI) hClampNN
  have hRaw :
      1400 + (5 - (nCa2 : Int)) * (clampTenth : Int) - 120 * (nCa2 : Int) - 160 * ((nSnare : Int) - 1) ≤
      1400 + (5 - (nCa1 : Int)) * (clampTenth : Int) - 120 * (nCa1 : Int) - 160 * ((nSnare : Int) - 1) := by
    have hexp :
        (5 - (nCa1 : Int)) * (clampTenth : Int) - (5 - (nCa2 : Int)) * (clampTenth : Int) =
        ((nCa2 : Int) - (nCa1 : Int)) * (clampTenth : Int) := by
      simp [Int.sub_mul]
      omega
    omega
  omega

theorem snare_copy_number_cooperativity (n1 n2 nCa clampTenth : Nat)
    (hN : n1 < n2) :
    snareZipTenthKbt n1 < snareZipTenthKbt n2 ∧
      snareEffBarrier50 n2 nCa clampTenth ≤ snareEffBarrier50 n1 nCa clampTenth := by
  unfold snareZipTenthKbt snareEffBarrier50 snareRawBarrier50
  constructor <;> omega

-- ============================================================================
-- DOMAIN V: DNA-PAINT / RESI Super-Resolution Metrology (2 Theorems)
-- ============================================================================

theorem resi_variance_strict_improvement (sigmaSq nPhotons kSubsets : Nat)
    (hS : sigmaSq > 0) (hN : nPhotons > 0) (hK : kSubsets ≥ 2) :
    sigmaSq * nPhotons < sigmaSq * (nPhotons * kSubsets) := by
  have h1 : nPhotons < nPhotons * kSubsets := by
    have hk : 1 < kSubsets := by omega
    have := Nat.mul_lt_mul_of_pos_left hk hN
    simpa [Nat.mul_one] using this
  exact Nat.mul_lt_mul_of_pos_left h1 hS

theorem resi_duty_cycle_monotone_in_imager (kOn kOff c1 c2 : Nat)
    (hOn : kOn > 0) (hOff : kOff > 0) (hC : c1 < c2) :
    (kOn * c1) * (kOn * c2 + kOff) < (kOn * c2) * (kOn * c1 + kOff) := by
  have h1 : kOn * c1 < kOn * c2 := Nat.mul_lt_mul_of_pos_left hC hOn
  have h2 : (kOn * c1) * kOff < (kOn * c2) * kOff := Nat.mul_lt_mul_of_pos_right h1 hOff
  have hcomm : (kOn * c1) * (kOn * c2) = (kOn * c2) * (kOn * c1) :=
    Nat.mul_comm (kOn * c1) (kOn * c2)
  rw [Nat.mul_add, Nat.mul_add, hcomm]
  exact Nat.add_lt_add_left h2 ((kOn * c2) * (kOn * c1))

-- ============================================================================
-- DOMAIN VI: 2x2 Discrete Bipartition Algebraic Factorization Bounds (2 Theorems)
-- ============================================================================

theorem factorized_bipartition_zero_integration (a0 a1 b0 b1 : Int) :
    bipartiteCoupling (a0 * b0) (a0 * b1) (a1 * b0) (a1 * b1) = 0 := by
  unfold bipartiteCoupling
  have hzero : (a0 * b0) * (a1 * b1) - (a0 * b1) * (a1 * b0) = 0 := by
    have heq : (a0 * b0) * (a1 * b1) = (a0 * b1) * (a1 * b0) := by
      simp [Int.mul_left_comm, Int.mul_comm]
    omega
  rw [hzero]
  rfl

theorem correlated_nanocolumn_positive_integration (w00 w01 w10 w11 : Int)
    (hCorr : w00 * w11 > w01 * w10) :
    bipartiteCoupling w00 w01 w10 w11 > 0 := by
  unfold bipartiteCoupling
  have hpos : w00 * w11 - w01 * w10 > 0 := Int.sub_pos.mpr hCorr
  have hne : w00 * w11 - w01 * w10 ≠ 0 := Int.ne_of_gt hpos
  have hnat : 0 < Int.natAbs (w00 * w11 - w01 * w10) := Int.natAbs_pos.mpr hne
  exact Int.ofNat_lt.mpr hnat

end SynapseBouton

end
