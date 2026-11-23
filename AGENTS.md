# AGENTS.md

Canonical instructions for every coding agent working in this repository (Codex, OpenCode, Claude Code, Gemini CLI, Antigravity, Cursor, Grok Build, Grok Bot and others).
CLAUDE.md, GEMINI.md, .cursor/rules/build-standard.mdc and llms.txt only point here. Edit this file, never the pointers.
Full standard: docs/build-standard.md (Build Standard for LLMs v1.1.0, 90 items). Read the relevant items before building.

## Project

- Name: human-synapse-bouton-lab
- Purpose: Full-stack, formally verified human synaptic bouton biophysical workbench, Lean 4.35.0 proofs, stochastic Monte Carlo nanocolumn simulator, and 11-discipline open hard problems & consciousness frontier monograph.
- Owner: 0thernes
- Manifest: repo.yaml (project type, stack, flags and per-item status; schema in repo-standard.schema.json)
- Stack: TODO(fill): languages, runtimes and versions
- Layout: TODO(fill): top-level folders and what lives in each
- Status: experimental (change to active, maintenance-only or archived when true)

## Commands

Use the task runner (A31). The justfile delegates to scripts/dev.sh, which detects the stack (node, python, rust, go, ruby, java, c/c++, dotnet). Every command must work from a clean clone.

- just setup: install pinned toolchain and dependencies
- just build: build
- just test: run all tests
- just lint: linters and type checks (report-only)
- just bench: benchmarks with medians and spread
- just reproduce: clean clone to headline results
- just audit: score this repo against the standard (scripts/audit-repo.sh)
- just release X.Y.Z: bump VERSION, tag vX.Y.Z and push (the release workflow publishes notes, SHA256SUMS and attestations)

## Hard rules

- R1. Nothing may gate, block or slow a commit or push. No branch protection, no required status checks, no commit or tag signing requirements, no git hooks (pre-commit, pre-push, commit-msg), no push protection, no merge queues.
- R2. Commit and push straight to main. No pull requests and no feature branches. Fixes for failing checks are follow-up commits to main.
- R3. CI is informational. CI reports results on every push. A red CI run is a finding to fix, never a barrier.
- R4. Banned tools and files. No Dependabot or Renovate auto-PRs, no PR templates, no CodeRabbit, no Copilot review or .github/copilot-instructions.md, no FUNDING file unless the owner asks.
- R5. One-person lean, not corporate. Prefer one file over a framework, one command over a checklist, plain text over portals. Add process only if it directly helps the owner build or prove the work.
- R6. Never fabricate. Every claim, number, badge, screenshot and test result must come from a real run of the current code. Unverified means labeled unverified.
- R7. Classify every finding. Each finding is exactly one of: bug, error, issue, problem, dilemma, conflict (definitions below).
- R8. Precedence when rules collide. Owner's explicit instruction, then these hard rules, then this standard's items, then ecosystem conventions.

## Finding classes

Classify every finding as exactly one:

- bug: A defect in program logic: the code runs but does something different from its specification or intent.
- error: A wrong artifact or failed execution outside program logic: an incorrect number, claim, doc, config, version, build or command.
- issue: A gap: something this standard or the task requires is missing or incomplete, but nothing present is wrong.
- problem: An external obstacle that blocks progress and is not caused by the project's own code or artifacts.
- dilemma: A trade-off between two or more valid options where the right choice depends on the owner's priorities.
- conflict: Two requirements, sources or rules contradict each other, so satisfying one violates the other.

## Order of operations

1. Read the project's AGENTS.md first (create it if missing, using item A32), then this standard.
2. Decide which items apply: evaluate applies_when for all 90 items and list not-applicable ones with a reason.
3. Do the minimum core set (below) before anything else.
4. Then do remaining core items, then recommended, then advanced, ordered by effort (S before M before L).
5. For each item, run its 'done when' check and save its evidence artifact in the repo.
6. Commit small, meaningful commits straight to main and push after each working step. Never open a PR or feature branch.
7. Report results: items done, items not applicable (with reason), items not done, and every finding classified as exactly one of the six classes.

## Minimum core set

- A01 README with a one-line purpose
- A03 Quickstart that works from a clean clone
- A06 LICENSE
- A07 CHANGELOG
- A08 Semantic version, tags and a single version source
- A09 Automated tests that pass
- A10 Informational CI
- A12 .gitignore
- A24 No secrets, build output or huge files committed
- A31 Task runner with one-word commands
- A32 Agent entry points: AGENTS.md canonical, plus CLAUDE.md, GEMINI.md, Cursor rules, llms.txt
- B01 Reproducible build from a clean clone
- B02 Pinned toolchains and lockfiles
- B04 CLAIMS.md ledger
- B05 Falsifiable tests per claim
- B06 Negative tests
- B07 Regression test per fixed bug
- B41 Limitations and real-vs-metaphor
- B43 Replication protocol

## Checklist (tier in brackets; details and 'done when' checks in docs/build-standard.md)

Part A: Repo Fundamentals

- [ ] A01 README with a one-line purpose [core]
- [ ] A02 Badge ribbon [recommended]
- [ ] A03 Quickstart that works from a clean clone [core]
- [ ] A04 Usage examples [core]
- [ ] A05 Demo media [recommended]
- [ ] A06 LICENSE [core]
- [ ] A07 CHANGELOG [core]
- [ ] A08 Semantic version, tags and a single version source [core]
- [ ] A09 Automated tests that pass [core]
- [ ] A10 Informational CI [core]
- [ ] A11 Releases [recommended]
- [ ] A12 .gitignore [core]
- [ ] A13 .gitattributes and .editorconfig [recommended]
- [ ] A14 CONTRIBUTING guide [recommended]
- [ ] A15 CODE_OF_CONDUCT [recommended]
- [ ] A16 SECURITY.md [core]
- [ ] A17 SUPPORT.md [recommended]
- [ ] A18 Issue templates [recommended]
- [ ] A19 About description and topics [core]
- [ ] A20 docs/ folder [recommended]
- [ ] A21 Architecture Decision Records [recommended]
- [ ] A22 CITATION.cff [advanced]
- [ ] A23 Clean history and correct identity [core]
- [ ] A24 No secrets, build output or huge files committed [core]
- [ ] A25 Cross-platform CI [recommended]
- [ ] A26 Social preview image [recommended]
- [ ] A27 Pages demo or docs site [advanced]
- [ ] A28 Package manifest [recommended]
- [ ] A29 ROADMAP.md [recommended]
- [ ] A30 Labels including the six finding classes [recommended]
- [ ] A31 Task runner with one-word commands [core]
- [ ] A32 Agent entry points: AGENTS.md canonical, plus CLAUDE.md, GEMINI.md, Cursor rules, llms.txt [core]
- [ ] A33 Environment and configuration documented [core]
- [ ] A34 Observability basics: logs, errors, health [recommended]
- [ ] A35 Data, migrations, backups and an offsite repo mirror [recommended]
- [ ] A36 One-command deploy and rollback [recommended]
- [ ] A37 Performance budgets [advanced]
- [ ] A38 Accessibility and internationalization [core]
- [ ] A39 Third-party licensing and attribution [recommended]
- [ ] A40 AI components pinned, evaluated and budgeted [core]
- [ ] A41 Deprecation and upgrade path [advanced]
- [ ] A42 Maintenance status [recommended]
- [ ] A43 examples/ directory [recommended]
- [ ] A44 FAQ and glossary [recommended]
- [ ] A45 Privacy and personal-data handling [core]

Part B: Verification Ladder: prove it isn't BS

- [ ] B01 Reproducible build from a clean clone [core]
- [ ] B02 Pinned toolchains and lockfiles [core]
- [ ] B03 Determinism checks [core]
- [ ] B04 CLAIMS.md ledger [core]
- [ ] B05 Falsifiable tests per claim [core]
- [ ] B06 Negative tests [core]
- [ ] B07 Regression test per fixed bug [core]
- [ ] B08 Golden and snapshot tests [recommended]
- [ ] B09 Contract and API tests [recommended]
- [ ] B10 Property-based tests [core]
- [ ] B11 Differential testing [recommended]
- [ ] B12 Reference implementation as test oracle [recommended]
- [ ] B13 Mutation testing [recommended]
- [ ] B14 Metamorphic testing [advanced]
- [ ] B15 Fuzzing [recommended]
- [ ] B16 Sanitizers and runtime checkers [core]
- [ ] B17 Static analysis and linters, report-only [recommended]
- [ ] B18 Strict type checking [recommended]
- [ ] B19 Concurrency and race testing [advanced]
- [ ] B20 Numeric and floating-point stability [advanced]
- [ ] B21 Failure injection [advanced]
- [ ] B22 Formal specification and proof [advanced]
- [ ] B23 Design model checking [advanced]
- [ ] B24 Verified implementation language [advanced]
- [ ] B25 Bounded model checking of real code [advanced]
- [ ] B26 Honest benchmarks [core]
- [ ] B27 Performance tracking over time, report-only [advanced]
- [ ] B28 Controls and multiple seeds [core]
- [ ] B29 Significance testing [core]
- [ ] B30 Effect sizes and confidence intervals [core]
- [ ] B31 Multiple-comparison correction [recommended]
- [ ] B32 Pre-registration of hypotheses [advanced]
- [ ] B33 ML evaluation on held-out data [core]
- [ ] B34 AI hallucination and regression evals [core]
- [ ] B35 Security scanning, report-only, with optional SBOM [recommended]
- [ ] B36 Threat model [recommended]
- [ ] B37 Release hashes and checksums [core]
- [ ] B38 Build provenance and attestations [recommended]
- [ ] B39 Data checksums and dataset versioning [recommended]
- [ ] B40 Audit trail [recommended]
- [ ] B41 Limitations and real-vs-metaphor [core]
- [ ] B42 What would prove us wrong [core]
- [ ] B43 Replication protocol [core]
- [ ] B44 Independent replication [advanced]
- [ ] B45 Peer and red-team review [recommended]

## Known traps

- TODO(fill): project-specific pitfalls agents keep hitting; add one line each time
