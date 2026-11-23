#!/usr/bin/env bash
# Stack-agnostic developer commands for human-synapse-bouton-lab (Node, Python, Rust, Lean 4.35.0).
# Usage: scripts/dev.sh <detect|setup|build|test|lint|bench|run|clean|release VERSION> [stack]
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

ACTION="${1:-help}"; shift || true
ONLY="${1:-}"
STACKS=(node python rust lean)
STATUS=0

has() { command -v "$1" >/dev/null 2>&1; }
note() { printf '[dev] %s\n' "$*"; }
skip() { note "skip $1: $2"; }
run() { note "\$ $*"; "$@" || { note "failed ($?): $*"; STATUS=1; }; }

detect_one() {
  case "$1" in
    node)   [ -f package.json ] ;;
    python) [ -f pyproject.toml ] ;;
    rust)   [ -f Cargo.toml ] ;;
    lean)   [ -f lean/lakefile.toml ] ;;
    *) return 1 ;;
  esac
}

detected() {
  local s
  for s in "${STACKS[@]}"; do
    if [ -n "$ONLY" ] && [ "$s" != "$ONLY" ]; then continue; fi
    detect_one "$s" && echo "$s"
  done
}

do_node() {
  if ! has node; then skip node "node not installed"; return; fi
  case "$1" in
    setup) if [ -f package-lock.json ]; then run npm ci; else run npm install; fi ;;
    build) run npm run build ;;
    test)  run npm run test && run node examples/nanocolumn_example.mjs ;;
    lint)  run npm run lint && run npm run typecheck ;;
    bench) run npm run bench ;;
    run)   run npm run dev ;;
    clean) run rm -rf node_modules apps/web/dist packages/synapse-core/dist ;;
  esac
}

do_python() {
  if ! has uv && ! has python3 && ! has python; then skip python "python/uv not installed"; return; fi
  case "$1" in
    setup) if has uv; then run uv sync --extra dev --frozen || run uv sync --extra dev; else run python3 -m pip install -e ".[dev]"; fi ;;
    build) if has uv; then run uv build; else skip python "uv not installed"; fi ;;
    test)  if has uv; then run uv run pytest -v python/tests/ && run uv run python examples/exact_oracle_example.py; else run pytest -v python/tests/; fi ;;
    lint)  if has uv; then run uv run ruff check python/ && run uv run mypy python/synapse_science/; fi ;;
    bench) note "python uses 50-digit exact oracle; see rust & node benchmarks" ;;
    run)   run uv run synapse-api ;;
    clean) run rm -rf .pytest_cache .mypy_cache .ruff_cache ;;
  esac
}

do_rust() {
  if ! has cargo; then skip rust "cargo not installed"; return; fi
  local locked=(); [ -f Cargo.lock ] && locked=(--locked)
  case "$1" in
    setup) run cargo fetch "${locked[@]}" ;;
    build) run cargo build --release "${locked[@]}" ;;
    test)  run cargo test "${locked[@]}" ;;
    lint)  run cargo clippy --all-targets "${locked[@]}" ;;
    bench) run cargo run --release "${locked[@]}" -- bench ;;
    run)   run cargo run --release "${locked[@]}" -- vectors ;;
    clean) run cargo clean ;;
  esac
}

do_lean() {
  if ! has lake; then skip lean "lake not installed"; return; fi
  case "$1" in
    setup) note "lean toolchain pinned via lean/lean-toolchain (zero external deps)" ;;
    build) run bash -c 'cd lean && lake build --wfail' ;;
    test)
      run bash -c 'cd lean && lake build --wfail && lake env lean VerifyAxioms.lean && lake env leanchecker Solution && lake env leanchecker NonVacuity'
      run bash -c '! grep -rnE "\b(sorry|admit|native_decide)\b|^\s*axiom\b|implemented_by|@\[extern" lean/Solution.lean lean/NonVacuity.lean lean/VerifyAxioms.lean'
      ;;
    lint)  note "lean warnings enforced via lake build --wfail" ;;
    bench) note "lean proof build time tracked in docs/benchmarks.md" ;;
    run)   run bash -c 'cd lean && lake env lean VerifyAxioms.lean' ;;
    clean) run rm -rf lean/.lake ;;
  esac
}

dispatch() {
  local action="$1"; shift
  local list; list=$(detected)
  for s in $list; do
    note "== $s: $action"
    "do_$s" "$action" "$@"
  done
}

release() {
  local v="${1:-}"
  [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-+][0-9A-Za-z.-]+)?$ ]] || { note "usage: dev.sh release X.Y.Z"; exit 2; }
  if git rev-parse "v$v" >/dev/null 2>&1; then note "tag v$v already exists"; exit 2; fi
  grep -Eq "^## \[$v\]" CHANGELOG.md || { note "CHANGELOG.md has no '## [$v]' section"; exit 2; }
  printf '%s\n' "$v" > VERSION
  sed -i.bak -E "s/^version: .*/version: \"$v\"/; s/^date-released: .*/date-released: \"$(date +%F)\"/" CITATION.cff && rm -f CITATION.cff.bak
  git add VERSION CITATION.cff CHANGELOG.md
  git commit -m "Release v$v" || true
  git tag -a "v$v" -m "v$v"
  git push origin HEAD:main --follow-tags
}

case "$ACTION" in
  detect) for s in "${STACKS[@]}"; do if detect_one "$s"; then echo "$s=true"; else echo "$s=false"; fi; done ;;
  setup|build|test|lint|bench|clean) dispatch "$ACTION" ;;
  run) ONLY=""; dispatch run "$@" ;;
  release) release "${1:-}" ;;
  *) sed -n '2,4p' "$0"; exit 0 ;;
esac
exit $STATUS
