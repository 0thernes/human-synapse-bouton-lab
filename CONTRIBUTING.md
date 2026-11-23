# Contributing to `human-synapse-bouton-lab`

This is a lean, one-person, AI-native scientific software and formal-verification repository governed by the **Build Standard for LLMs v1.1.0** (`docs/build-standard.md`).

## Direct-to-`main`, Zero-Gates Workflow (Hard Rules R1–R3)

- Work is committed and pushed **straight to `main`** (no feature branches, no pull-request merge gates, no git hooks, no required status checks).
- CI runs on every push to `main` as **informational reporting**. A red CI job is fixed with a follow-up commit to `main`.
- Use GitHub Issues (structured forms with the six finding classes: `bug`, `error`, `issue`, `problem`, `dilemma`, `conflict`) and Discussions for questions, critiques, replication reports, and proposals.

## Local Setup & Commands

```bash
bash scripts/dev.sh setup    # Install Node, Python (uv), Rust, and Lean dependencies
bash scripts/dev.sh build    # Build TS/Vite, Rust release binary, and Lean 4.35.0 (--wfail)
bash scripts/dev.sh test     # Run Vitest, Cargo proptest, Pytest + 1,000-case differential, Lean
bash scripts/dev.sh lint     # Report-only ESLint, Clippy, Ruff, Mypy strict
bash scripts/audit-repo.sh   # Score repo against the 90-item Build Standard
```

## Scientific & Epistemic Standards

1. Never fabricate numbers, benchmarks, or citations (`R6`).
2. Every quantitative claim added to `README.md` or a white paper must have a corresponding row in `CLAIMS.md` with an explicit falsification condition.
3. Lean 4 proofs must contain zero `sorry`, zero `admit`, zero `native_decide`, zero custom axioms, and a concrete non-vacuity witness in `lean/NonVacuity.lean`.
4. All commits carry real author identity and imperative commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
