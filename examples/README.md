# Runnable Examples

Self-contained examples tested as smoke checks in CI (Build Standard A43):

- **`nanocolumn_example.mjs`** — Demonstrates `@synapse/core` $\mathrm{Ca}^{2+}$ nanodomain coupling, trans-synaptic nanocolumn alignment gain, and SNAREpin clamp release:
  ```bash
  node examples/nanocolumn_example.mjs
  ```
- **`exact_oracle_example.py`** — Demonstrates 50-digit `mpmath` and exact rational `Fraction` checks matching our Lean 4.35.0 theorems:
  ```bash
  uv run python examples/exact_oracle_example.py
  ```
- **Rust CLI (`synapse-sim`)** — Run deterministic Monte Carlo vectors, pre-registered sweeps, or benchmarks:
  ```bash
  cargo run --release -- vectors
  ```
