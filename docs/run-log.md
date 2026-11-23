# Audit Trail & Run Log

Append-only record of verified builds, formal checks, statistical sweeps, benchmarks, and publication runs (Build Standard B40). Corrections are appended as new rows; prior entries are never rewritten.

| Date (UTC-8) | Commit / Stage | Actor / Tool | Command | Outcome & Key Artifact |
|---|---|---|---|---|
| 2026-11-23 | `a1919f2` | Alexander S. Donahue + Antigravity | Root scaffold + `PREREGISTRATION.md` frozen prior to sweeps | Root commit `a1919f2a8a002c0ef0f69cb065e4381bf045c6fd` |
| 2026-11-23 | Lean build | Lean 4.35.0 (`leanprover/lean4:v4.35.0`) | `cd lean && lake build --wfail && lake env lean VerifyAxioms.lean` | 18/18 theorems, 0 warnings, 0 `sorry`, 0 `Classical.choice`; `docs/lean-axioms-report.txt` |
| 2026-11-23 | Multi-kernel replay | `leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche` | Exported 57,998 declarations via `leanexport` and replayed | All 5 independent local checkers exited 0 (`con-ron` & `con-leche` `--verified`) |
| 2026-11-23 | TS / Rust / Python tests | Node v25.8.2, Rust 1.94.1, Python 3.12 (`uv`) | `npm run build && npm test && cargo test && uv run pytest` | TS 12/12, Rust 5/5 (2,000 proptest), Python 9/9 (2,000 differential checks, 0 mismatches), 0 lint/mypy/clippy errors |
| 2026-11-23 | Pre-reg. 30-seed MC | `synapse-sim sweep` + `uv run synapse-stats` | Deterministic seeds `1000..1029` & `2000..2029` | H1 & H2 confirmed (`p_Holm=0.0005`), H3 (40 Hz) honestly refuted (`p_Holm=1.0`), H4 null passed (`0.9963`), exploratory H3b (20 Hz) logged in `DEVIATIONS.md`; `data/MANIFEST.sha256` |
| 2026-11-23 | Honest benchmarks | `synapse-sim bench` & `npm run bench` | 3 warmups + 10 timed runs (5,000 APs) | Rust `0.3093 ms` (IQR `0.0126`) vs Node `1.8362 ms` (IQR `1.3254`), `5.94x` speedup; `data/benchmarks/*.json` |
| 2026-11-23 | Media & videos | `uv run synapse-media` | Generated 5 vector PDF/PNG figures, audited blueprint, social preview, GIF, 2 H.264 MP4s | All files `< 600 KB`; visually inspected and polished for zero label overlap |
| 2026-11-23 | White papers | Tectonic 0.17.0 (`scripts/build_papers.py`) | Compiled WP1 & WP2 + verified fresh standalone arXiv tarballs | `dist/Donahue_2026_*.pdf`, `dist/arxiv_*.tar.gz`, `dist/SHA256SUMS` |
| 2026-11-23 | Mutation & Standard | `scripts/mutation_audit.py`, `Audit-Repo.ps1`, `audit-repo.sh` | Targeted 6-mutant B13 audit + Build Standard v1.1.0 audit (PS & POSIX) | 6/6 mutants killed (100.0%); Build Standard v1.1.0 Structure 100.0% (79/79), Completion 100.0% (79/79), Core 100.0% (33/33) |
