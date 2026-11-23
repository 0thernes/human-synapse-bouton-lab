# ADR 0002: Four-Language Architecture with 50-Digit Oracle and 1,000-Case Differential Testing

- **Status:** Accepted
- **Date:** 2026-11-23

## Context
The legacy prototype lived inside a single 220 KB monolithic HTML file duplicating JavaScript and TypeScript equations with no automated tests, no native simulator, and no high-precision numerical oracle.

## Decision
Refactor into four specialized stacks sharing one exact mathematical specification: `@synapse/core` (TypeScript) + `apps/web` (Vite/Three.js), `rust/synapse-sim` (compiled deterministic `ChaCha8Rng` Monte Carlo engine), `python/synapse_science` (50-digit `mpmath` oracle, FastAPI backend, stats, media/video renderer), and `lean/` (formal proofs), verified via 1,000-case cross-language differential tests (`python/tests/test_differential.py`).

## Consequences
Any formula drift between TypeScript, Rust, and Python is caught immediately at `< 1e-10` relative tolerance, while browser users get a zero-install GitHub Pages workbench and scientists get native Rust speed (`5.94x` faster than Node) and 50-digit exact reference endpoints.
