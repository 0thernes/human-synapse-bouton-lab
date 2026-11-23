# Task runner (https://just.systems). Run `just` to list recipes.
# Every recipe delegates to a plain script, so nothing here is required: bash scripts/dev.sh <action> works too.
# No recipe installs git hooks or gates a commit or push.

set shell := ["bash", "-euo", "pipefail", "-c"]
set windows-shell := ["bash", "-euo", "pipefail", "-c"]

# List recipes
default:
    @just --list

# Install the pinned toolchain and dependencies for every detected stack
setup:
    bash scripts/dev.sh setup

# Build every detected stack
build:
    bash scripts/dev.sh build

# Run all tests
test:
    bash scripts/dev.sh test

# Linters and type checks (report-only)
lint:
    bash scripts/dev.sh lint

# Benchmarks: report median and spread over repeated runs (define per stack when speed is claimed)
bench:
    bash scripts/dev.sh bench

# Run the project
run *ARGS:
    bash scripts/dev.sh run {{ARGS}}

# Clean clone to headline results (extend with the commands that produce README numbers)
reproduce: setup build test
    @echo "reproduce: setup, build and test passed. Add the commands that regenerate headline results here."

# Score this repo against the Build Standard (report-only; writes audit.json)
audit *ARGS:
    bash scripts/audit-repo.sh --json audit.json {{ARGS}}

# Show which stacks scripts/dev.sh detects
detect:
    bash scripts/dev.sh detect

# Release: bump VERSION, CITATION and CHANGELOG heading, commit, tag vX.Y.Z and push to main
release VERSION:
    bash scripts/dev.sh release {{VERSION}}

# Push an offsite mirror (set a remote named backup first; see docs/operations.md)
mirror:
    git push backup --mirror

# Remove build output
clean:
    bash scripts/dev.sh clean

# Deploy and rollback: uncomment and fill in if the project is deployed (A36)
# deploy VERSION:
#     <your deploy command for VERSION>
# rollback:
#     <your rollback command>
