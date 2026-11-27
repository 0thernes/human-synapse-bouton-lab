# AGENTS.md

Canonical instructions for every coding agent working in `human-synapse-bouton-lab` (Codex, OpenCode, Claude Code, Gemini CLI, Antigravity, Cursor, Grok Build, Grok Bot, and others).
`CLAUDE.md`, `GEMINI.md`, `.cursor/rules/build-standard.mdc`, and `llms.txt` only point here. Edit this file, never the pointers.
Full standard: `docs/build-standard.md` (Build Standard for LLMs v1.2.0, 90 items).

## Project

- **Name:** `human-synapse-bouton-lab`
- **Purpose:** Full-stack human synaptic bouton biophysical workbench with 24 Lean 4.35.0 elementary model invariants (27 concrete witnesses, 7 sanity/sharpness checks, 6 independent CI kernels), pre-registered stochastic Monte Carlo simulator, 50-digit reference oracle, and an 11-discipline open hard problems & consciousness frontier companion survey.
- **Author & Owner:** Alexander Stephen Donahue (`0thernes`, Independent Researcher, Spokane, WA, USA; ORCID `https://orcid.org/0009-0006-8168-9648`; `0_0@0thernes.art`). Do **not** cite an unformed LLC entity.
- **License:** Dual-licensed — canonical Apache-2.0 for code/proofs (`LICENSE`), CC-BY-4.0 for manuscripts/docs/datasets/media (`docs/LICENSE-CONTENT.md`).
- **Build Pipeline Models v1.0.0:** Current phase `P11` (Shipped & Iterating), profile `T02` + `T05` (full-stack web workbench + verified scientific library), deploy target `D04` (GitHub Pages), manifest `project.yaml`, auditor `python scripts/pipeline-audit.py`, extra rule **R9** (deploy safety without gates), and AI guardrails **AI01–AI15**.
- **Manifest:** `repo.yaml` (schema in `repo-standard.schema.json`, Build Standard v1.2.0).
- **Stack:**
  - Lean `4.35.0` (`lean/`, zero Mathlib, `lake build --wfail`, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`, `lake comparator --paranoid`, `ExportVectors.lean`)
  - TypeScript `5.8` / Node `>=20` (`packages/synapse-core`, `apps/web` Vite 6 + Three.js + Chart.js, Vitest + `fast-check`, ESLint 9)
  - Rust `stable` / MSRV `1.80` (`rust/synapse-sim`, `ChaCha8Rng`, `proptest`, Clippy)
  - Python `3.12` / `uv` (`python/synapse_science`, 50-digit `mpmath` oracle, FastAPI + Pydantic v2, Hypothesis, Pytest, Ruff, Mypy strict, Matplotlib + FFmpeg media pipeline)
  - AMS-LaTeX / Tectonic `0.17.0` (`papers/wp1_synaptic_bouton`, `papers/wp2_open_problems_consciousness`, frozen PDFs + arXiv tarballs in `dist/`)
- **Layout:**
  - `lean/` — Isolated `Challenge.lean`, `Solution.lean` (24 elementary lemmas, 0 unused hypotheses, enforced 0 `Classical.choice`), `NonVacuity.lean` (27 concrete witnesses), `AdversarialChecks.lean` (7 sanity/sharpness checks), `VerifyAxioms.lean`, `ExportVectors.lean`, `comparator.json`, `formalization.yaml`
  - `packages/synapse-core/` — Strict TypeScript biophysical & 11-discipline open-problems core library
  - `apps/web/` — 9-tab accessible interactive WebGL/Chart.js workbench deployed to GitHub Pages (plus `/blueprint/` Lean Proof DAG)
  - `rust/synapse-sim/` — Deterministic native Monte Carlo simulator, differential CLI, and benchmark binary
  - `python/synapse_science/` — Exact 50-digit oracle, pre-registered stats pipeline, FastAPI server, and figure/video generator
  - `papers/` & `dist/` — Two AMS-LaTeX white papers, vector PDF figures, frozen release PDFs, and verified arXiv tarballs
  - `data/` — Pre-registered per-seed Monte Carlo CSVs, statistical summaries, exported Lean vectors (`data/lean_engine_vectors.json`), raw benchmarks, and `data/MANIFEST.sha256`
  - `docs/` — Architecture, ADRs, benchmarks, threat model, accessibility, FAQ, glossary, run-log, media, citation audit, statement fidelity, Mega-Atlas crosswalk, and red-team reviews
  - `examples/` — Runnable standalone scripts in Node/TS and Python
- **Status:** `active`

## Commands

Use the task runner (`justfile`) or invoke `bash scripts/dev.sh <action>`:

- `just setup` — install pinned dependencies for Node, Python (`uv`), Rust, and Lean
- `just build` — compile `@synapse/core`, `@synapse/web`, Rust release binary, and Lean 4.35.0 proofs (`--wfail`)
- `just test` — run Vitest (`fast-check`), Cargo (`proptest`), Pytest (`hypothesis` + 1,000-case differential + Lean vector parity + citation unit tests), and Lean multi-kernel verification
- `just lint` — report-only ESLint, Clippy, Ruff, and Mypy strict
- `just bench` — honest Rust vs Node median/IQR benchmarks with checksums
- `just stats` — run pre-registered 30-seed Monte Carlo sweep and regenerate `data/MANIFEST.sha256`
- `just media` — regenerate all vector PDFs, PNGs, social preview, animated GIF, and H.264 MP4 videos
- `just papers` — compile both AMS-LaTeX white papers with Tectonic into `dist/`
- `just reproduce` — clean-clone end-to-end verification and headline artifact regeneration
- `just audit` — score this repo against the 90-item Build Standard v1.2.0 (`scripts/audit-repo.sh` / `scripts/Audit-Repo.ps1`)
- `just release X.Y.Z` — bump `VERSION`, `CITATION.cff`, commit, tag `vX.Y.Z`, and push straight to `main`

## Hard rules

- **R1.** Nothing may gate, block or slow a commit or push. No branch protection, no required status checks, no commit/tag signing gates, no git hooks, no push protection, no merge queues.
- **R2.** Commit and push straight to `main`. No pull requests and no feature branches.
- **R3.** CI is informational. A red CI run is a finding to fix by follow-up commit to `main`, never a barrier.
- **R4.** Banned tools and files: no Dependabot/Renovate, no PR templates, no CodeRabbit, no Copilot review or `.github/copilot-instructions.md`, no `FUNDING.yml`.
- **R5.** One-person lean, not corporate.
- **R6.** Never fabricate. Every claim, number, badge, screenshot, video, and test result must come from a real run of the current code. Unverified means labeled unverified.
- **R7.** Classify every finding as exactly one of: `bug`, `error`, `issue`, `problem`, `concern`, `dilemma`, `conflict`, `gap`, `hole`, `blindspot`.
- **R8.** Precedence when rules collide: Owner's explicit instruction, then these hard rules, then Build Standard items, then ecosystem conventions.

## Finding classes

- `bug`: defect in program logic (code runs differently from spec/intent).
- `error`: wrong artifact or failed execution outside program logic (wrong number, claim, doc, config, version, build).
- `issue`: weakness in something that exists (works and is not wrong, but unclear, inconsistent, fragile, or hard to maintain).
- `problem`: external obstacle not caused by project code/artifacts.
- `concern`: risk that has not caused harm yet (security, cost, legal, reliability).
- `dilemma`: trade-off between valid options where owner priorities decide.
- `conflict`: two requirements, sources, or rules contradict each other.
- `gap`: something required or expected is missing; nothing present is wrong.
- `hole`: missing check or safeguard, so a defect could pass unnoticed.
- `blindspot`: a user, platform, failure mode, or assumption nobody has examined yet.

## Known traps

- **Windows PowerShell & pytest bracketed paths (`Z:\[Vibe Coded (AI)]\ANTIGRAVITY`):** PowerShell treats `[...]` as wildcards unless `-LiteralPath` is passed; `pytest` rejects absolute paths containing `[...]` with exit code 4 (`ERROR: path cannot contain [] parametrization`), so always pass relative test paths (e.g., `python/tests/...`) from repo root!
- **Species & preparation distinctions:** Never conflate rat synaptosome baseline (`374`, Wilhelm 2014) with adult human temporal cortex boutons (`3,500` L1 / `1,800` L4 / `1,500` L5, Rollenhagen/Yakoubi 2019–2025), nor *Narcine brasiliensis* electric-organ lipidomics (Deutsch & Kelly 1981) with human cortex, nor Coupland et al. 2024 (*Science*, rat SVs) with Wang et al. 2024 (*Nature*, mouse SVs).
- **Pre-registered H3 (40 Hz) failure & illustrative constants:** Never alter `PREREGISTRATION.md` or hide H3's failure at 40 Hz; exploratory 20 Hz `H3b` is explicitly logged in `DEVIATIONS.md`. Always disclose that H3/H3b rate constants were chosen when writing the simulator (illustrative fixed-parameter model values).
- **Lean `nanoda_bin` transitive `Init` config:** Because Lean's transitive `Init` export contains internal declarations referencing `sorryAx` and `Classical.choice` even when unused by our theorems, standalone `nanoda_bin` requires `"unpermitted_axiom_hard_error": false` and `"Classical.choice"` in its JSON config to avoid panicking inside `Init`. Zero `Classical.choice` on all 24 exported theorems is strictly enforced by `lean/comparator.json` (`["propext", "Quot.sound"]`), CI `VerifyAxioms.lean` grep, and `scripts/check_readme_axioms.py`.
- **Float64 labeling:** Always tag Hodgkin–Huxley RK4 and Monte Carlo outputs `numerical_approximation` (never claim kernel-checked proof for float64 numerics).
