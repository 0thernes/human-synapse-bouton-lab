# AGENTS.md

Canonical instructions for every coding agent working in `human-synapse-bouton-lab` (Codex, OpenCode, Claude Code, Gemini CLI, Antigravity, Cursor, Grok Build, Grok Bot, and others).
`CLAUDE.md`, `GEMINI.md`, `.cursor/rules/build-standard.mdc`, and `llms.txt` only point here. Edit this file, never the pointers.
Full standard: `docs/build-standard.md` (Build Standard for LLMs v1.1.0, 90 items).

## Project

- **Name:** `human-synapse-bouton-lab`
- **Purpose:** Full-stack, formally verified human synaptic bouton biophysical workbench, Lean 4.35.0 proofs, pre-registered stochastic Monte Carlo simulator, and 11-discipline open hard problems & consciousness frontier monograph.
- **Author & Owner:** Alexander Stephen Donahue (`0thernes`, Independent Researcher, Spokane, WA, USA; ORCID `https://orcid.org/0009-0006-8168-9648`; `0_0@0thernes.art`). Do **not** cite an unformed LLC entity.
- **License:** Dual-licensed — canonical Apache-2.0 for code/proofs (`LICENSE`), CC-BY-4.0 for manuscripts/docs/datasets/media (`docs/LICENSE-CONTENT.md`).
- **Build Pipeline Models v1.0.0:** Current phase `P9/P11` (Shipped & Iterating), profile `T02` + `T05` (full-stack web workbench + verified scientific library), deploy target `D04` (GitHub Pages), manifest `project.yaml`, auditor `python scripts/pipeline-audit.py`, extra rule **R9** (deploy safety without gates), and AI guardrails **AI01–AI15**.
- **Manifest:** `repo.yaml` (schema in `repo-standard.schema.json`).
- **Stack:**
  - Lean `4.35.0` (`lean/`, zero Mathlib, `lake build --wfail`, `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`, `lake comparator`)
  - TypeScript `5.8` / Node `>=20` (`packages/synapse-core`, `apps/web` Vite 6 + Three.js + Chart.js, Vitest + `fast-check`, ESLint 9)
  - Rust `stable` / MSRV `1.80` (`rust/synapse-sim`, `ChaCha8Rng`, `proptest`, Clippy)
  - Python `3.12` / `uv` (`python/synapse_science`, 50-digit `mpmath` oracle, FastAPI + Pydantic v2, Hypothesis, Pytest, Ruff, Mypy strict, Matplotlib + FFmpeg media pipeline)
  - AMS-LaTeX / Tectonic `0.17.0` (`papers/wp1_synaptic_bouton`, `papers/wp2_open_problems_consciousness`, frozen PDFs + arXiv tarballs in `dist/`)
- **Layout:**
  - `lean/` — Isolated `Challenge.lean`, `Solution.lean` (18 theorems), `NonVacuity.lean`, `VerifyAxioms.lean`, `comparator.json`, `formalization.yaml`
  - `packages/synapse-core/` — Strict TypeScript biophysical & 11-discipline open-problems core library
  - `apps/web/` — 9-tab accessible interactive WebGL/Chart.js workbench deployed to GitHub Pages
  - `rust/synapse-sim/` — Deterministic native Monte Carlo simulator, differential CLI, and benchmark binary
  - `python/synapse_science/` — Exact 50-digit oracle, pre-registered stats pipeline, FastAPI server, and figure/video generator
  - `papers/` & `dist/` — Two AMS-LaTeX white papers, vector PDF figures, frozen release PDFs, and verified arXiv tarballs
  - `data/` — Pre-registered per-seed Monte Carlo CSVs, statistical summaries, raw benchmarks, and `data/MANIFEST.sha256`
  - `docs/` — Architecture, ADRs, benchmarks, threat model, accessibility, FAQ, glossary, run-log, media, and red-team reviews
  - `examples/` — Runnable standalone scripts in Node/TS and Python
- **Status:** `active`

## Commands

Use the task runner (`justfile`) or invoke `bash scripts/dev.sh <action>`:

- `just setup` — install pinned dependencies for Node, Python (`uv`), Rust, and Lean
- `just build` — compile `@synapse/core`, `@synapse/web`, Rust release binary, and Lean 4.35.0 proofs (`--wfail`)
- `just test` — run Vitest (`fast-check`), Cargo (`proptest`), Pytest (`hypothesis` + 1,000-case differential), and Lean multi-kernel verification
- `just lint` — report-only ESLint, Clippy, Ruff, and Mypy strict
- `just bench` — honest Rust vs Node median/IQR benchmarks with checksums
- `just stats` — run pre-registered 30-seed Monte Carlo sweep and regenerate `data/MANIFEST.sha256`
- `just media` — regenerate all vector PDFs, PNGs, social preview, animated GIF, and H.264 MP4 videos
- `just papers` — compile both AMS-LaTeX white papers with Tectonic into `dist/`
- `just reproduce` — clean-clone end-to-end verification and headline artifact regeneration
- `just audit` — score this repo against the 90-item Build Standard (`scripts/audit-repo.sh` / `scripts/Audit-Repo.ps1`)
- `just release X.Y.Z` — bump `VERSION`, `CITATION.cff`, commit, tag `vX.Y.Z`, and push straight to `main`

## Hard rules

- **R1.** Nothing may gate, block or slow a commit or push. No branch protection, no required status checks, no commit/tag signing gates, no git hooks, no push protection, no merge queues.
- **R2.** Commit and push straight to `main`. No pull requests and no feature branches.
- **R3.** CI is informational. A red CI run is a finding to fix by follow-up commit to `main`, never a barrier.
- **R4.** Banned tools and files: no Dependabot/Renovate, no PR templates, no CodeRabbit, no Copilot review or `.github/copilot-instructions.md`, no `FUNDING.yml`.
- **R5.** One-person lean, not corporate.
- **R6.** Never fabricate. Every claim, number, badge, screenshot, video, and test result must come from a real run of the current code. Unverified means labeled unverified.
- **R7.** Classify every finding as exactly one of: `bug`, `error`, `issue`, `problem`, `dilemma`, `conflict`.
- **R8.** Precedence when rules collide: Owner's explicit instruction, then these hard rules, then Build Standard items, then ecosystem conventions.

## Finding classes

- `bug`: defect in program logic (code runs differently from spec/intent).
- `error`: wrong artifact or failed execution outside program logic (wrong number, claim, doc, config, version, build).
- `issue`: gap — required item is missing or incomplete, nothing present is wrong.
- `problem`: external obstacle not caused by project code/artifacts.
- `dilemma`: trade-off between valid options where owner priorities decide.
- `conflict`: two requirements, sources, or rules contradict each other.

## Known traps

- **Windows PowerShell bracketed paths (`Z:\[Vibe Coded (AI)]\ANTIGRAVITY`):** PowerShell treats `[...]` as wildcards unless `-LiteralPath` is passed to `Set-Location`, `Test-Path`, `Get-ChildItem`, `Get-Content`, etc.
- **Species vesicle pool distinction:** Never conflate rat synaptosome baseline (`374`, Wilhelm 2014) with adult human temporal cortex boutons (`3,500` L1 / `1,800` L4 / `1,500` L5, Rollenhagen/Yakoubi eLife 2019–2024).
- **Pre-registered H3 (40 Hz) refutation:** Never alter `PREREGISTRATION.md` or hide H3's refutation at 40 Hz; exploratory 20 Hz `H3b` is explicitly logged in `DEVIATIONS.md`.
- **Lean `nanoda_bin` flag:** Because Lean `Init` exports `sorryAx` as a declaration symbol even when unused by theorems, pass `"unpermitted_axiom_hard_error": false` to `nanoda_bin` while auditing theorem axiom lists strictly via `VerifyAxioms.lean` and `lake comparator`.
- **Float64 labeling:** Always tag Hodgkin–Huxley RK4 and Monte Carlo outputs `numerical_approximation` (never claim kernel-checked proof for float64 numerics).
