# Deprecation and Upgrade Path

This document records deprecation policy and breaking-change migration steps across releases of `human-synapse-bouton-lab` (Build Standard A41).

## Policy

1. Semantic Versioning (`MAJOR.MINOR.PATCH`) is governed by `VERSION` as the single source of truth.
2. Public APIs in `@synapse/core`, `synapse_science`, `rust/synapse-sim`, and FastAPI `/api/v1/*` are deprecated for at least one `MINOR` release (with `@deprecated` JSDoc / `DeprecationWarning` / `#[deprecated]`) before removal in a `MAJOR` release.
3. Every breaking change includes a concrete before/after migration snippet below.

## Upgrading from Legacy Monolithic Prototype (`v9` HTML / `synapse_engine.ts`) to `v1.0.0`

### 1. Imports
- **Before (prototype):** Single monolithic `synapse_engine.ts` + inline `<script>` in `human_synapse_bouton_lab_source.html`.
- **After (`v1.0.0`):** Import cleanly from `@synapse/core`:
  ```ts
  import { computeElectrochemistry, computeSnareThermodynamics, createSeededRng } from '@synapse/core';
  ```

### 2. Trace Parser Error Handling (Regression `F02`)
- **Before:** `analyzeExperimentalTrace('')` silently returned `{ count: 0, ... }` and malformed JSON threw raw `SyntaxError`.
- **After:** `analyzeExperimentalTrace` throws a typed `TraceParseError` on empty, malformed, oversized (`>2 MB`), or `<3`-sample traces. Catch `TraceParseError` explicitly.

### 3. Species Vesicle Pool Presets (Regression `F03`)
- **Before:** `CONSTANTS.BOUTON_VESICLE_TOTAL = 374` (rat synaptosome) was presented under a human bouton heading.
- **After:** Select an explicit cohort from `BOUTON_PRESETS` (`rat_wilhelm_2014`, `human_l1_elife_2024`, `human_l4_elife_2019`, `human_l5_ijms_2020`).
