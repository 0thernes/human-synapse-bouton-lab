# Third-Party Notices and Attribution

`human-synapse-bouton-lab` is dual-licensed under **Apache-2.0** (source code & Lean 4 proofs) and **CC-BY-4.0** (white papers, documentation, datasets, figures, and videos). This file documents all shipped third-party libraries, toolchains, and scientific data attributions (Build Standard A39).

## Shipped / Core Runtime Dependencies

| Ecosystem | Package | License | Purpose |
|---|---|---|---|
| Web / Node | `three` (0.174.0) | MIT | Interactive 3D WebGL synaptic bouton viewport |
| Web / Node | `chart.js` (4.4.8) | MIT | Real-time oscilloscope, HH RK4, SNARE, and RESI charts |
| Web / Node | `vite` (6.2.2) | MIT | Static bundler for GitHub Pages deployment |
| Web / Node | `vitest`, `fast-check`, `eslint`, `typescript` | MIT / Apache-2.0 | Testing, property testing, linting, type checking |
| Rust | `rand`, `rand_chacha`, `serde`, `serde_json`, `proptest` | MIT OR Apache-2.0 | Deterministic RNG, JSON serialization, property tests |
| Python | `fastapi`, `uvicorn`, `pydantic`, `pydantic-settings` | MIT / BSD-3-Clause | Validated REST oracle backend & structured logging |
| Python | `numpy`, `scipy`, `sympy`, `mpmath`, `matplotlib`, `pillow`, `imageio`, `imageio-ffmpeg` | BSD-3-Clause / PSF / HPND / MIT | 50-digit exact oracle, statistics, figures, and H.264/GIF rendering |
| Python | `pytest`, `hypothesis`, `httpx`, `ruff`, `mypy`, `mutmut` | MIT / MPL-2.0 / BSD | Testing, fuzz/property testing, linting, static typing |
| Formal | Lean 4.35.0 (`lean`, `lake`, `leanchecker`, `nanoda`, `con-ron`, `con-leche`) | Apache-2.0 | Theorem prover and independent verification kernels |
| Typesetting | Tectonic 0.17.0 & AMS-LaTeX (`amsart`) | MIT / LPPL | White-paper PDF compilation |

No copyleft (GPL/AGPL) libraries are statically linked into shipped Apache-2.0 binaries. Full machine-readable component inventory is recorded in `sbom.cdx.json`.

## Scientific Data & Literature Attributions

All quantitative biological constants (vesicle counts, lipidome percentages, EMDB/PDB identifiers, H01 connectome statistics) are cited to their primary peer-reviewed publications in `papers/references.bib` and `packages/synapse-core/src/constants.ts`. All figures and videos in `docs/media/` and `papers/figures/` are generated originally from repository code under CC-BY-4.0.
