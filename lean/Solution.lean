module

-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
--
-- Machine-checked Lean 4.35.0 proofs of all 24 theorems in Challenge.lean (v1.4.0).
-- Zero sorry, zero admit, zero native_decide, zero custom axioms, zero Classical.choice
-- (enforced by comparator.json & CI), zero unused hypotheses, zero Mathlib.

public section

namespace SynapseBouton

/-- Exact third power `x^3` helper used in Hill `n = 4` vs. linear `n = 1` crossover proof. -/
@[expose] def pow3 (x : Nat) : Nat := x * x * x

/-- Exact fourth power `x^4` used in cleared-denominator Hill `n = 4` ratio `c^4 / (c^4 + Kd^4)`. -/
@[expose] def pow4 (x : Nat) : Nat := x * x * x * x

/-- Conductance-weighted steady-state numerator: `gL*eL + gE*eE + gI*eI`. -/
@[expose] def eiNum (gL gE gI eL eE eI : Int) : Int :=
  gL * eL + gE * eE + gI * eI

/-- Total postsynaptic conductance denominator: `gL + gE + gI`. -/
@[expose] def eiDen (gL gE gI : Int) : Int :=
  gL + gE + gI

/-- Fixed-point scaled single-spike Tsodyks-Markram facilitation update `uPlus = u + floor(u0 * (S - u) / S)`. -/
@[expose] def tmUPlus (scale u u0 : Nat) : Nat :=
  u + (u0 * (scale - u)) / scale

/-- Fixed-point scaled single-spike Tsodyks-Markram effective release `effRel = floor(uPlus * x / S)`. -/
@[expose] def tmEffRel (scale uPlus x : Nat) : Nat :=
  (uPlus * x) / scale

/-- Presynaptic vesicle pool counts (RRP, Recycling Pool, Reserve/Resting Pool). -/
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

/-- Step-wise conservation validity predicate over an arbitrary finite list of transition steps. -/
@[expose] def ValidVesicleTrace : VesiclePools → List (Nat × Nat × Nat) → Prop
  | _, [] => True
  | p, (exo, prime, mob) :: rest =>
      exo ≤ p.rrp ∧ prime ≤ p.recycling + exo ∧ mob ≤ p.reserve ∧
        ValidVesicleTrace (stepVesiclePools p exo prime mob) rest

/-- Iterated execution of a finite sequence of vesicle pool cycling steps. -/
@[expose] def runVesicleTrace : VesiclePools → List (Nat × Nat × Nat) → VesiclePools
  | p, [] => p
  | p, (exo, prime, mob) :: rest =>
      runVesicleTrace (stepVesiclePools p exo prime mob) rest

/-- Nonnegative clamped deterministic mean-rate ATP store after duration `t` under constant
    supply `sAtp` and constant total burn `bLeak + f * cAp` (truncated at 0 via `Nat` subtraction). -/
@[expose] def atpStoreAfter (a0 bLeak f cAp sAtp t : Nat) : Nat :=
  (a0 + sAtp * t) - (bLeak + f * cAp) * t

/-- Integer-scaled SNAREpin zippering energy formula (in tenths of `k_B T`). -/
@[expose] def snareZipTenthKbt (nSnare : Nat) : Int :=
  115 * (nSnare : Int)

/-- Integer-scaled unclamped SNARE barrier formula (in fiftieths of `k_B T`). -/
@[expose] def snareRawBarrier50 (nSnare nCa clampTenth : Nat) : Int :=
  1400 + (5 - (nCa : Int)) * (clampTenth : Int) - 120 * (nCa : Int) - 160 * ((nSnare : Int) - 1)

/-- Clamped effective barrier formula in fiftieths of `k_B T` with lower floor 60 (`= 1.2 k_B T`). -/
@[expose] def snareEffBarrier50 (nSnare nCa clampTenth : Nat) : Int :=
  max 60 (snareRawBarrier50 nSnare nCa clampTenth)

/-- Exact 2x2 integer determinant magnitude `|w00*w11 - w01*w10|`. -/
@[expose] def bipartiteCoupling (w00 w01 w10 w11 : Int) : Int :=
  Int.ofNat (Int.natAbs (w00 * w11 - w01 * w10))

-- ============================================================================
-- Helper lemmas (private, exact constructive arithmetic)
-- ============================================================================

private theorem pow3_lt_pow3 {a b : Nat} (h : a < b) : pow3 a < pow3 b := by
  unfold pow3
  have h2 : a * a < b * b := Nat.mul_lt_mul_of_lt_of_lt h h
  exact Nat.mul_lt_mul_of_lt_of_lt h2 h

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
-- DOMAIN I: Cleared-Denominator Hill n=4 Inequalities & Single-Step STP (7 Theorems)
-- ============================================================================

theorem hill4_unit_interval (c kd : Nat) (hkd : kd > 0) :
    pow4 c < pow4 c + pow4 kd := by
  have hpos : pow4 kd > 0 := pow4_pos hkd
  omega

theorem hill4_half_max_exact (kd : Nat) (hkd : kd > 0) :
    0 < pow4 kd + pow4 kd ∧ 2 * pow4 kd = pow4 kd + pow4 kd := by
  have hpos : pow4 kd > 0 := pow4_pos hkd
  constructor <;> omega

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

theorem hill4_ultrasensitive_crossover_vs_linear (c kd : Nat) (hc : c > 0) (hkd : kd > 0) :
    (c < kd → pow4 c * (c + kd) < c * (pow4 c + pow4 kd)) ∧
      (kd < c → c * (pow4 c + pow4 kd) < pow4 c * (c + kd)) := by
  have hckdPos : c * kd > 0 := Nat.mul_pos hc hkd
  have hExpL : pow4 c * (c + kd) = pow4 c * c + (c * kd) * pow3 c := by
    unfold pow4 pow3
    rw [Nat.mul_add]
    congr 1
    simp [Nat.mul_left_comm, Nat.mul_comm]
  have hExpR : c * (pow4 c + pow4 kd) = pow4 c * c + (c * kd) * pow3 kd := by
    unfold pow4 pow3
    rw [Nat.mul_add]
    congr 1
    · simp [Nat.mul_comm]
    · simp [Nat.mul_left_comm, Nat.mul_comm]
  constructor
  · intro hlt
    rw [hExpL, hExpR]
    exact Nat.add_lt_add_left (Nat.mul_lt_mul_of_pos_left (pow3_lt_pow3 hlt) hckdPos) (pow4 c * c)
  · intro hgt
    rw [hExpL, hExpR]
    exact Nat.add_lt_add_left (Nat.mul_lt_mul_of_pos_left (pow3_lt_pow3 hgt) hckdPos) (pow4 c * c)

theorem tsodyks_markram_step_unit_bounds (scale u u0 x : Nat)
    (hS : scale > 0) (hu : u ≤ scale) (hu0Le : u0 ≤ scale) (hx : x ≤ scale) :
    u ≤ tmUPlus scale u u0 ∧
      tmUPlus scale u u0 ≤ scale ∧
      tmEffRel scale (tmUPlus scale u u0) x ≤ x ∧
      x - tmEffRel scale (tmUPlus scale u u0) x ≤ scale := by
  have hIncLe : (u0 * (scale - u)) / scale ≤ scale - u := by
    have hMul : u0 * (scale - u) ≤ scale * (scale - u) := Nat.mul_le_mul_right (scale - u) hu0Le
    have hDiv : (u0 * (scale - u)) / scale ≤ (scale * (scale - u)) / scale := Nat.div_le_div_right hMul
    rw [Nat.mul_div_cancel_left (scale - u) hS] at hDiv
    exact hDiv
  have huPlusGe : u ≤ tmUPlus scale u u0 := by
    unfold tmUPlus
    exact Nat.le_add_right u _
  have huPlusLe : tmUPlus scale u u0 ≤ scale := by
    unfold tmUPlus
    have hSum : u + (u0 * (scale - u)) / scale ≤ u + (scale - u) :=
      Nat.add_le_add_left hIncLe u
    have hEq : u + (scale - u) = scale := Nat.add_sub_of_le hu
    omega
  have hRelLe : tmEffRel scale (tmUPlus scale u u0) x ≤ x := by
    unfold tmEffRel
    have hMul : tmUPlus scale u u0 * x ≤ scale * x := Nat.mul_le_mul_right x huPlusLe
    have hDiv : (tmUPlus scale u u0 * x) / scale ≤ (scale * x) / scale := Nat.div_le_div_right hMul
    rw [Nat.mul_div_cancel_left x hS] at hDiv
    exact hDiv
  refine ⟨huPlusGe, huPlusLe, hRelLe, by omega⟩

-- ============================================================================
-- DOMAIN II: Conductance-Weighted Mean & Monotonicity of D/(D + m*e) (4 Theorems)
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

theorem nmda_mg_unblock_unit_interval_and_monotone (dScale mg eRest eDepol : Nat)
    (hD : dScale > 0) (hMg : mg > 0) (hE2 : eDepol > 0) (hDepol : eDepol < eRest) :
    dScale < dScale + mg * eRest ∧
      dScale < dScale + mg * eDepol ∧
      dScale * (dScale + mg * eDepol) < dScale * (dScale + mg * eRest) := by
  have hE1 : eRest > 0 := Nat.lt_trans hE2 hDepol
  have hProd1 : mg * eRest > 0 := Nat.mul_pos hMg hE1
  have hProd2 : mg * eDepol > 0 := Nat.mul_pos hMg hE2
  have hProdLt : mg * eDepol < mg * eRest := Nat.mul_lt_mul_of_pos_left hDepol hMg
  have hDenLt : dScale + mg * eDepol < dScale + mg * eRest := Nat.add_lt_add_left hProdLt dScale
  refine ⟨by omega, by omega, Nat.mul_lt_mul_of_pos_left hDenLt hD⟩

-- ============================================================================
-- DOMAIN III: Vesicle Pool Conservation & Mean-Rate Linear ATP Bounds (6 Theorems)
-- ============================================================================

theorem vesicle_pool_transition_invariant (p : VesiclePools) (exo prime mob : Nat)
    (hExo : exo ≤ p.rrp)
    (hPrime : prime ≤ p.recycling + exo)
    (hMob : mob ≤ p.reserve) :
    (stepVesiclePools p exo prime mob).total = p.total := by
  unfold stepVesiclePools VesiclePools.total
  dsimp
  omega

theorem vesicle_pool_multistep_invariant (p : VesiclePools) (trace : List (Nat × Nat × Nat))
    (hValid : ValidVesicleTrace p trace) :
    (runVesicleTrace p trace).total = p.total := by
  induction trace generalizing p with
  | nil => rfl
  | cons step rest ih =>
    rcases step with ⟨exo, prime, mob⟩
    rcases hValid with ⟨hExo, hPrime, hMob, hRest⟩
    calc
      (runVesicleTrace (stepVesiclePools p exo prime mob) rest).total
          = (stepVesiclePools p exo prime mob).total := ih (stepVesiclePools p exo prime mob) hRest
      _ = p.total := vesicle_pool_transition_invariant p exo prime mob hExo hPrime hMob

theorem atp_deficit_strict_depletion (a0 bLeak f cAp sAtp t : Nat)
    (ha0 : a0 > 0) (hDeficit : sAtp < bLeak + f * cAp) (ht : t > 0) :
    a0 + sAtp * t < a0 + (bLeak + f * cAp) * t ∧
      atpStoreAfter a0 bLeak f cAp sAtp t < a0 := by
  unfold atpStoreAfter
  have hmul : sAtp * t < (bLeak + f * cAp) * t := Nat.mul_lt_mul_of_pos_right hDeficit ht
  constructor <;> omega

theorem atp_hitting_time_upper_bound (a0 bLeak f cAp sAtp t : Nat)
    (hDeficit : sAtp < bLeak + f * cAp)
    (hTime : a0 / ((bLeak + f * cAp) - sAtp) + 1 ≤ t) :
    atpStoreAfter a0 bLeak f cAp sAtp t = 0 := by
  unfold atpStoreAfter
  let D := (bLeak + f * cAp) - sAtp
  have hD : D > 0 := by omega
  have hModLt : a0 % D < D := Nat.mod_lt a0 hD
  have hDivMod : D * (a0 / D) + a0 % D = a0 := Nat.div_add_mod a0 D
  have hA0Lt : a0 < D * (a0 / D + 1) := by
    rw [Nat.mul_add, Nat.mul_one]
    omega
  have hMulLe : D * (a0 / D + 1) ≤ D * t := Nat.mul_le_mul_left D hTime
  have hA0LeDt : a0 ≤ D * t := Nat.le_of_lt (Nat.lt_of_lt_of_le hA0Lt hMulLe)
  have hBurnEq : (bLeak + f * cAp) * t = sAtp * t + D * t := by
    have hSum : bLeak + f * cAp = sAtp + D := by omega
    rw [hSum, Nat.add_mul]
  have hLe : a0 + sAtp * t ≤ (bLeak + f * cAp) * t := by
    rw [hBurnEq]
    omega
  exact Nat.sub_eq_zero_of_le hLe

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
-- DOMAIN IV: Clamped Linear SNARE Barrier Formula Monotonicity (2 Theorems)
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
-- DOMAIN V: Cleared-Denominator Variance & Duty-Cycle Inequalities (2 Theorems)
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
-- DOMAIN VI: Generic 2x2 Integer Determinant Facts (3 Theorems + Generic Aliases)
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

theorem diagonal_excess_implies_positive_coupling (w01 w10 d1 d2 : Int)
    (h01 : w01 ≥ 0) (h10 : w10 ≥ 0) (hd1 : d1 > 0) (hd2 : d2 > 0) :
    (w01 + d1) * (w10 + d2) > w01 * w10 ∧
      bipartiteCoupling (w01 + d1) w01 w10 (w10 + d2) > 0 := by
  have h1 : w01 * d2 ≥ 0 := Int.mul_nonneg h01 (Int.le_of_lt hd2)
  have h2 : d1 * w10 ≥ 0 := Int.mul_nonneg (Int.le_of_lt hd1) h10
  have h3 : d1 * d2 > 0 := Int.mul_pos hd1 hd2
  have hExp : (w01 + d1) * (w10 + d2) = w01 * w10 + w01 * d2 + d1 * w10 + d1 * d2 := by
    simp [Int.add_mul, Int.mul_add]
    omega
  have hDom : (w01 + d1) * (w10 + d2) > w01 * w10 := by omega
  exact ⟨hDom, correlated_nanocolumn_positive_integration (w01 + d1) w01 w10 (w10 + d2) hDom⟩

/-- Generic algebraic alias for T22 (outer-product 2x2 determinant vanishes). -/
abbrev outer_product_det_zero := @factorized_bipartition_zero_integration

/-- Generic algebraic alias for T23 (strict diagonal product dominance implies positive |det|). -/
abbrev det_pos_of_diag_dominance := @correlated_nanocolumn_positive_integration

/-- Generic algebraic alias for T24 (strict positive diagonal excess implies positive |det|). -/
abbrev det_pos_of_diag_excess := @diagonal_excess_implies_positive_coupling

end SynapseBouton

end
