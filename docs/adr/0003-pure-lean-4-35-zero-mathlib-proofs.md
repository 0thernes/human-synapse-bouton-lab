# ADR 0003: Pure Lean 4.35.0 Zero-Mathlib Formal Proofs for Multi-Kernel Replay

- **Status:** Accepted
- **Date:** 2026-11-23

## Context
Large Mathlib-dependent Lean repositories require multi-gigabyte olean caches, slow CI runners, and complicate independent kernel replay.

## Decision
Formalize all 18 core biophysical and bipartite-coupling theorems directly over exact `Nat` and `Int` cross-multiplied arithmetic in pure Lean 4.35.0 (`Challenge.lean` / `Solution.lean` / `NonVacuity.lean` / `VerifyAxioms.lean`) with zero Mathlib dependencies, zero `Classical.choice`, and zero `sorry`.

## Consequences
Clean builds finish in ~6 seconds on any machine, and all 57,998 exported declarations replay cleanly across `lean`, `leanchecker`, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, and `con-leche`. Nonlinear float64 ODEs remain outside kernel scope and are explicitly tagged `numerical_approximation`.
