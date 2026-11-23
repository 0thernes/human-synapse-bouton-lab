# Task runner (https://just.systems). Run `just` to list recipes.
# Every recipe delegates to plain scripts so `bash scripts/dev.sh <action>` works identically.
# Hard Rule R1: No recipe installs git hooks or gates a commit or push.

set shell := ["bash", "-euo", "pipefail", "-c"]
set windows-shell := ["bash", "-euo", "pipefail", "-c"]

# List recipes
default:
    @just --list

# Install pinned dependencies across Node, Python (uv), Rust, and Lean
setup:
    bash scripts/dev.sh setup

# Build TypeScript core + WebGL app, Rust release binary, and Lean 4.35.0 proofs
build:
    bash scripts/dev.sh build

# Run all unit, property, differential, API contract, and Lean proof checks
test:
    bash scripts/dev.sh test

# Linters and strict type checks (report-only)
lint:
    bash scripts/dev.sh lint

# Honest warmup + 10-run benchmarks (Rust vs Node)
bench:
    bash scripts/dev.sh bench

# Run the FastAPI 50-digit exact oracle backend locally
run:
    uv run synapse-api

# Run pre-registered 30-seed Monte Carlo sweep and regenerate data/MANIFEST.sha256
stats:
    uv run synapse-stats

# Regenerate all publication figures, audited blueprint, social preview, GIF, and MP4 videos
media:
    uv run synapse-media

# Compile both AMS-LaTeX white papers and verify standalone arXiv source tarballs
papers:
    uv run python scripts/build_papers.py

# Build static GitHub Pages bundle into _site/
site:
    npm run build
    rm -rf _site
    cp -r apps/web/dist _site

# Clean clone to headline verified results (Build Standard B01)
reproduce: setup build test stats
    node examples/nanocolumn_example.mjs
    uv run python examples/exact_oracle_example.py

# Score this repo against Build Standard v1.1.0 (report-only; writes audit.json)
audit *ARGS:
    bash scripts/audit-repo.sh --json audit.json {{ARGS}}

# Detect active stacks
detect:
    bash scripts/dev.sh detect

# Release: bump VERSION, CITATION and CHANGELOG, commit, tag vX.Y.Z, push straight to main
release VERSION:
    bash scripts/dev.sh release {{VERSION}}

# Push offsite git mirror
mirror:
    git push backup --mirror

# Remove local build outputs
clean:
    bash scripts/dev.sh clean
