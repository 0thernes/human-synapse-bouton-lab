# Replication Protocol

Exact instructions for an independent operator or clean container to reproduce every formal proof, test, statistical sweep, benchmark, figure, video, and PDF in `human-synapse-bouton-lab` (Build Standard B43, B44).

## 1. Environment & Toolchain Requirements

- **OS:** Linux (recommended for full `bwrap` sandboxed `lake check --paranoid`), macOS, or Windows 11.
- **Hardware:** Any 64-bit CPU, $\ge 8\,$GB RAM, $\ge 2\,$GB free disk space (zero GPU required; zero Mathlib cache download required).
- **Pinned Toolchains:**
  - Lean `4.35.0` (`lean/lean-toolchain`)
  - Node.js `>=20` (tested on `v25.8.2`, lockfile `package-lock.json`)
  - Rust `stable` MSRV `1.80` (tested on `1.94.1`, lockfile `Cargo.lock`)
  - Python `3.12` via `uv` (lockfile `uv.lock`)
  - Tectonic `0.17.0` (only needed to recompile AMS-LaTeX PDFs)

## 2. Exact Clean-Clone Commands

```bash
git clone https://github.com/0thernes/human-synapse-bouton-lab.git
cd human-synapse-bouton-lab

# Step 1: Install pinned dependencies (expected runtime: ~45-90s)
bash scripts/dev.sh setup

# Step 2: Build TypeScript, WebGL app, Rust release binary, and Lean 4.35.0 proofs (~30-60s)
bash scripts/dev.sh build

# Step 3: Run full test & verification suite across all 4 stacks (~15s)
bash scripts/dev.sh test

# Step 4: Regenerate pre-registered 30-seed Monte Carlo stats & verify SHA-256 data manifest (~3s)
uv run synapse-stats
sha256sum -c data/MANIFEST.sha256   # run inside data/ directory

# Step 5: Run honest benchmarks (~1s)
./target/release/synapse-sim bench
npm run bench --workspace=@synapse/core

# Step 6: Regenerate figures, blueprint, social preview, GIF, and MP4 videos (~25s)
uv run synapse-media
```

## 3. Expected Outputs & Tolerances

| Artifact / Check | Exact Expected Result | Tolerance |
|---|---|---|
| Lean `lake build --wfail` | Exit 0, 24 lemmas, 0 unused hyps, 27 witnesses, 7 checks, zero `sorry`, enforced axioms $\subseteq [\text{propext}, \text{Quot.sound}]$ | Exact |
| `vitest run` (`@synapse/core`) | `14 passed (14)` (incl. 10 finding classes & Lean vector parity) | Exact |
| `cargo test` (`synapse-sim`) | `6 passed; 0 failed` (incl. 2,000 proptests & Lean vector parity) | Exact |
| `pytest python/tests/` | `14 passed` (1,000-case TS & Rust diff. within `1e-10`, Lean vector parity, negative citation checks) | `rtol <= 1e-10` |
| `python scripts/mutation_audit.py` | Unmutated control `rc=0`; `6/6` mutants strictly killed (`rc=1`) | Exact |
| `data/experiments/per_seed_results.csv` | Byte-identical deterministic `ChaCha8Rng` output across platforms | SHA-256 match (`data/MANIFEST.sha256`) |
| `H1` / `H2` / `H3` / `H4` / `H3b` `p_holm` | `0.0005` / `0.0005` / `1.0000` (failed in sim.) / `0.9963` / `0.0005` | Exact at `STAT_SEED=20261123` |
| Rust vs. Node benchmark | Rust median `< Node` median (`~0.3 ms` vs `~1.8 ms` on desktop x86_64) | Hardware-dependent |

## 4. Reporting an Independent Replication

Please open an issue using the **Replication report** form (`.github/ISSUE_TEMPLATE/replication.yml`) with your OS, CPU, toolchain versions, commit SHA, and whether every check matched or differed (including failed replications).

## 5. Recorded Replication Log

| Date | Operator / Environment | Commit | Outcome | Notes |
|---|---|---|---|---|
| 2026-11-23 | Clean-clone isolated verification (`ubuntu-latest`, `macos-latest`, `windows-latest` GitHub Actions CI run `45218417682`) | `v1.0.0` (`6bdb7d5`) | Verified | All 4 stacks (6-kernel Lean 4.35.0 `lake comparator --paranoid`, TS, Rust, Python 1,000-case differential) passed 12/12 CI jobs; Build Standard v1.1.0 scored 100.0% (79/79). |
| 2026-11-23 | Isolated clean local clone (`_tmp_clean_repl`, Windows x86_64) + GitHub Actions CI (`v1.1.0`) | `v1.1.0` | Verified | Clean clone verified `sha256sum -c MANIFEST.sha256`, `lake build --wfail` (Palomar `module` headers), `npm ci && npm run build && npm test`, `cargo test --locked`, and `uv run pytest`. |
