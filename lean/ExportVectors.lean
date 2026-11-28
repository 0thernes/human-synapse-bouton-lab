-- SPDX-License-Identifier: Apache-2.0
-- Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

module

import all Solution
--
-- Executable Lean 4 -> Engine test-vector exporter (v1.4.0, F38).
-- Evaluates the actual `@[expose]` definitions in `Solution.lean` directly inside Lean 4.35.0
-- and prints deterministic JSON vectors asserted by Python, TypeScript, and Rust test suites.
-- Run: cd lean && lake env lean --run ExportVectors.lean > ../data/lean_engine_vectors.json

open SynapseBouton

private def joinComma (xs : List String) : String :=
  String.intercalate ",\n" xs

public def main : IO Unit := do
  -- 1. Hill n=4 vectors (c in uM, kd = 15 uM)
  let hillCs : List Nat := [0, 5, 10, 15, 20, 30, 35, 60]
  let hillJson := hillCs.map fun c =>
    s!"    \{\"c\": {c}, \"kd\": 15, \"num\": {pow4 c}, \"den\": {pow4 c + pow4 15}}"

  -- 2. Conductance-weighted steady-state E/I vectors (gL=1, eL=-70, eE=0, eI in mV)
  let eiInputs : List (Int × Int × Int) := [(3, 4, -80), (3, 4, -70), (5, 2, -75), (10, 10, -80), (1, 8, -70)]
  let eiJson := eiInputs.map fun (gE, gI, eI) =>
    s!"    \{\"gL\": 1, \"gE\": {gE}, \"gI\": {gI}, \"eL\": -70, \"eE\": 0, \"eI\": {eI}, \"num\": {eiNum 1 gE gI (-70) 0 eI}, \"den\": {eiDen 1 gE gI}}"

  -- 3. Single-step fixed-point Tsodyks-Markram STP vectors (scale = 1000000)
  let stpInputs : List (Nat × Nat × Nat) := [(0, 400000, 1000000), (400000, 400000, 600000), (250000, 500000, 800000), (0, 1000000, 1000000)]
  let stpJson := stpInputs.map fun (u, u0, x) =>
    let uPlus := tmUPlus 1000000 u u0
    let effRel := tmEffRel 1000000 uPlus x
    s!"    \{\"scale\": 1000000, \"u\": {u}, \"u0\": {u0}, \"x\": {x}, \"uPlus\": {uPlus}, \"effRel\": {effRel}}"

  -- 4. SNAREpin zippering & barrier vectors across nSnare in 1..6, nCa in 0..5, clamp in {0, 150} (tenths)
  let mut snareJson : List String := []
  for nSnare in [1, 2, 3, 4, 5, 6] do
    for nCa in [0, 1, 2, 3, 4, 5] do
      for clampTenth in [0, 150] do
        let z := snareZipTenthKbt nSnare
        let b := snareEffBarrier50 nSnare nCa clampTenth
        snareJson := snareJson ++ [s!"    \{\"nSnare\": {nSnare}, \"nCa\": {nCa}, \"clampTenth\": {clampTenth}, \"zipTenth\": {z}, \"effBarrier50\": {b}}"]

  -- 5. Deterministic mean-rate ATP store vectors (explicitly constant-rate; Rust MC adds per-second jitter)
  let atpInputs : List (Nat × Nat × Nat × Nat × Nat × Nat) := [
    (1000000, 4000, 40, 32000, 950000, 1),
    (1000000, 4000, 40, 32000, 950000, 2),
    (1000000, 4000, 40, 32000, 950000, 3),
    (1000000, 4000, 40, 32000, 280000, 1),
    (1000000, 4000, 20, 32000, 280000, 3),
    (10, 0, 1, 5, 0, 2)
  ]
  let atpJson := atpInputs.map fun (a0, bLeak, f, cAp, sAtp, t) =>
    let rem := atpStoreAfter a0 bLeak f cAp sAtp t
    s!"    \{\"a0\": {a0}, \"bLeak\": {bLeak}, \"f\": {f}, \"cAp\": {cAp}, \"sAtp\": {sAtp}, \"t\": {t}, \"remaining\": {rem}}"

  -- 6. Vesicle pool multi-step conservation vectors
  let rat0 : VesiclePools := { rrp := 12, recycling := 62, reserve := 300 }
  let rat1 := stepVesiclePools rat0 4 4 10
  let hum0 : VesiclePools := { rrp := 20, recycling := 480, reserve := 3000 }
  let hum3 := runVesicleTrace hum0 [(6, 4, 20), (5, 5, 15), (4, 6, 10)]
  let vesJson := [
    s!"    \{\"preset\": \"rat_wilhelm_2014\", \"initialTotal\": {rat0.total}, \"afterTotal\": {rat1.total}}",
    s!"    \{\"preset\": \"human_l1_elife_2025\", \"initialTotal\": {hum0.total}, \"afterTotal\": {hum3.total}}"
  ]

  -- 7. Generic 2x2 integer determinant vectors
  let detInputs : List (Int × Int × Int × Int) := [(12, 18, 28, 42), (85, 15, 10, 90), (40, 10, 10, 40)]
  let detJson := detInputs.map fun (a, b, c, d) =>
    s!"    \{\"w00\": {a}, \"w01\": {b}, \"w10\": {c}, \"w11\": {d}, \"detAbs\": {bipartiteCoupling a b c d}}"

  IO.println "{"
  IO.println "  \"source\": \"lean/ExportVectors.lean (evaluated by Lean 4.35.0 on Solution.lean definitions)\","
  IO.println "  \"hill4\": ["
  IO.println (joinComma hillJson)
  IO.println "  ],"
  IO.println "  \"ei_balance\": ["
  IO.println (joinComma eiJson)
  IO.println "  ],"
  IO.println "  \"tsodyks_markram\": ["
  IO.println (joinComma stpJson)
  IO.println "  ],"
  IO.println "  \"snare\": ["
  IO.println (joinComma snareJson)
  IO.println "  ],"
  IO.println "  \"atp_mean_rate\": ["
  IO.println (joinComma atpJson)
  IO.println "  ],"
  IO.println "  \"vesicle_pools\": ["
  IO.println (joinComma vesJson)
  IO.println "  ],"
  IO.println "  \"det2x2\": ["
  IO.println (joinComma detJson)
  IO.println "  ]"
  IO.println "}"
