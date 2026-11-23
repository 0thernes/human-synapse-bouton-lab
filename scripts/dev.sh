#!/usr/bin/env bash
# Stack-agnostic developer commands. Zero dependencies beyond bash and each stack's own toolchain.
# Usage: scripts/dev.sh <detect|setup|build|test|lint|bench|run|clean|release VERSION> [stack]
# Stacks: node python rust go ruby java c-cpp dotnet. Missing toolchains are skipped with a notice, never an error.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

ACTION="${1:-help}"; shift || true
ONLY="${1:-}"
STACKS=(node python rust go ruby java c-cpp dotnet)
STATUS=0

has() { command -v "$1" >/dev/null 2>&1; }
exists() { compgen -G "$1" >/dev/null 2>&1; }
note() { printf '[dev] %s\n' "$*"; }
skip() { note "skip $1: $2"; }
run() { note "\$ $*"; "$@" || { note "failed ($?): $*"; STATUS=1; }; }

detect_one() {
  case "$1" in
    node)   [ -f package.json ] ;;
    python) [ -f pyproject.toml ] || [ -f setup.py ] || [ -f requirements.txt ] ;;
    rust)   [ -f Cargo.toml ] ;;
    go)     [ -f go.mod ] ;;
    ruby)   [ -f Gemfile ] || exists '*.gemspec' ;;
    java)   [ -f pom.xml ] || [ -f build.gradle ] || [ -f build.gradle.kts ] ;;
    c-cpp)  [ -f CMakeLists.txt ] || [ -f meson.build ] || { [ -f Makefile ] && exists 'src/*.c*'; } ;;
    dotnet) exists '*.sln' || exists '*.csproj' || exists '*.fsproj' || exists 'src/*/*.csproj' ;;
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

node_pm() {
  if [ -f pnpm-lock.yaml ]; then echo pnpm
  elif [ -f yarn.lock ]; then echo yarn
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then echo bun
  else echo npm; fi
}
node_script() { grep -Eq "\"$1\"[[:space:]]*:" package.json; }

do_node() {
  local pm; pm=$(node_pm)
  if ! has node; then skip node "node not installed"; return; fi
  if [ "$pm" = pnpm ] && ! has pnpm && has corepack; then corepack enable >/dev/null 2>&1 || true; fi
  if ! has "$pm"; then skip node "$pm not installed"; return; fi
  case "$1" in
    setup) case "$pm" in
             npm) if [ -f package-lock.json ]; then run npm ci; else run npm install; fi ;;
             pnpm) run pnpm install --frozen-lockfile ;;
             yarn) run yarn install --frozen-lockfile ;;
             bun) run bun install --frozen-lockfile ;;
           esac ;;
    build|test|lint|bench) if node_script "$1"; then run "$pm" run "$1"; else skip node "no \"$1\" script in package.json"; fi ;;
    run) if node_script start; then run "$pm" run start -- "${@:2}"; else skip node "no start script"; fi ;;
    clean) run rm -rf node_modules dist .next coverage ;;
  esac
}

py() { if has python3; then python3 "$@"; else python "$@"; fi; }
do_python() {
  if ! has python3 && ! has python; then skip python "python not installed"; return; fi
  local uv=0; [ -f uv.lock ] && has uv && uv=1
  case "$1" in
    setup)
      if [ $uv = 1 ]; then run uv sync --frozen
      else
        [ -f requirements.txt ] && run py -m pip install -r requirements.txt
        { [ -f pyproject.toml ] || [ -f setup.py ]; } && run py -m pip install -e .
        if exists 'tests/*.py' || exists 'test_*.py'; then py -c 'import pytest' 2>/dev/null || run py -m pip install pytest; fi
      fi ;;
    build) if [ -f pyproject.toml ]; then if py -c 'import build' 2>/dev/null; then run py -m build; else skip python "package 'build' not installed"; fi; else skip python "no pyproject.toml"; fi ;;
    test)
      if [ $uv = 1 ]; then run uv run pytest -q
      elif py -c 'import pytest' 2>/dev/null; then run py -m pytest -q
      elif exists 'tests/*.py'; then run py -m unittest discover -s tests -t . -v
      elif exists 'test_*.py'; then run py -m unittest discover -v
      else skip python "no tests found"; fi ;;
    lint) if has ruff; then run ruff check .; else skip python "ruff not installed"; fi
          if has mypy; then run mypy .; else skip python "mypy not installed"; fi ;;
    bench) skip python "no benchmark defined (TODO(fill))" ;;
    run) skip python "define a run command in the justfile" ;;
    clean) run rm -rf build dist .pytest_cache .mypy_cache .ruff_cache ;;
  esac
}

do_rust() {
  if ! has cargo; then skip rust "cargo not installed"; return; fi
  local locked=(); [ -f Cargo.lock ] && locked=(--locked)
  case "$1" in
    setup) run cargo fetch "${locked[@]}" ;;
    build) run cargo build --release "${locked[@]}" ;;
    test) run cargo test "${locked[@]}" ;;
    lint) run cargo clippy --all-targets "${locked[@]}" ;;
    bench) run cargo bench "${locked[@]}" ;;
    run) run cargo run --release "${locked[@]}" -- "${@:2}" ;;
    clean) run cargo clean ;;
  esac
}

do_go() {
  if ! has go; then skip go "go not installed"; return; fi
  case "$1" in
    setup) run go mod download ;;
    build) run go build ./... ;;
    test) run go test ./... ;;
    lint) run go vet ./... ;;
    bench) run go test -bench=. -count=5 -run='^$' ./... ;;
    run) run go run . "${@:2}" ;;
    clean) run go clean ./... ;;
  esac
}

do_ruby() {
  if ! has ruby; then skip ruby "ruby not installed"; return; fi
  local bx=(); [ -f Gemfile ] && has bundle && bx=(bundle exec)
  case "$1" in
    setup) if [ -f Gemfile ] && has bundle; then run bundle install; else skip ruby "no Gemfile or bundler"; fi ;;
    build) if exists '*.gemspec'; then run gem build ./*.gemspec; else skip ruby "no gemspec"; fi ;;
    test)
      if [ -f Rakefile ]; then run "${bx[@]}" rake
      elif [ -d spec ]; then run "${bx[@]}" rspec
      elif [ -d test ]; then run ruby -Ilib -Itest -e 'Dir["test/**/*_test.rb", "test/**/test_*.rb"].each { |f| require File.expand_path(f) }'
      else skip ruby "no tests found"; fi ;;
    lint) if has rubocop || [ ${#bx[@]} -gt 0 ]; then run "${bx[@]}" rubocop; else skip ruby "rubocop not installed"; fi ;;
    bench|run) skip ruby "define in the justfile" ;;
    clean) run rm -rf pkg tmp ;;
  esac
}

do_java() {
  local g=()
  if [ -x ./gradlew ]; then g=(./gradlew); elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then has gradle && g=(gradle); fi
  if [ -f pom.xml ] && [ ${#g[@]} -eq 0 ]; then
    local mvn=mvn; [ -x ./mvnw ] && mvn=./mvnw
    if ! has "$mvn" && [ ! -x ./mvnw ]; then skip java "maven not installed"; return; fi
    case "$1" in
      setup) run "$mvn" -B -q dependency:go-offline ;;
      build) run "$mvn" -B package -DskipTests ;;
      test) run "$mvn" -B test ;;
      lint) run "$mvn" -B -q verify -DskipTests ;;
      clean) run "$mvn" -B -q clean ;;
      *) skip java "define in the justfile" ;;
    esac
    return
  fi
  if [ ${#g[@]} -eq 0 ]; then skip java "gradle not installed"; return; fi
  case "$1" in
    setup) run "${g[@]}" --no-daemon dependencies -q ;;
    build) run "${g[@]}" --no-daemon assemble ;;
    test) run "${g[@]}" --no-daemon test ;;
    lint) run "${g[@]}" --no-daemon check -x test ;;
    run) run "${g[@]}" --no-daemon run ;;
    clean) run "${g[@]}" --no-daemon clean ;;
    *) skip java "define in the justfile" ;;
  esac
}

do_c_cpp() {
  if [ -f CMakeLists.txt ]; then
    if ! has cmake; then skip c-cpp "cmake not installed"; return; fi
    case "$1" in
      setup) run cmake -S . -B build -DCMAKE_BUILD_TYPE=Release ;;
      build) [ -d build ] || run cmake -S . -B build -DCMAKE_BUILD_TYPE=Release; run cmake --build build --config Release ;;
      test) [ -d build ] || { run cmake -S . -B build; run cmake --build build; }; run ctest --test-dir build --output-on-failure -C Release ;;
      lint) if has clang-tidy && [ -f build/compile_commands.json ]; then git ls-files -z '*.c' '*.cc' '*.cpp' | xargs -0 clang-tidy -p build || STATUS=1; else skip c-cpp "clang-tidy or compile_commands.json missing"; fi ;;
      clean) run rm -rf build ;;
      *) skip c-cpp "define in the justfile" ;;
    esac
  elif [ -f meson.build ]; then
    if ! has meson; then skip c-cpp "meson not installed"; return; fi
    case "$1" in
      setup) run meson setup builddir ;;
      build) [ -d builddir ] || run meson setup builddir; run meson compile -C builddir ;;
      test) [ -d builddir ] || run meson setup builddir; run meson test -C builddir ;;
      clean) run rm -rf builddir ;;
      *) skip c-cpp "define in the justfile" ;;
    esac
  else
    if ! has make; then skip c-cpp "make not installed"; return; fi
    case "$1" in
      build) run make ;;
      test) if make -n test >/dev/null 2>&1; then run make test; else skip c-cpp "no make test target"; fi ;;
      clean) run make clean ;;
      *) skip c-cpp "define in the justfile" ;;
    esac
  fi
}

do_dotnet() {
  if ! has dotnet; then skip dotnet "dotnet not installed"; return; fi
  case "$1" in
    setup) run dotnet restore ;;
    build) run dotnet build --no-restore -c Release ;;
    test) run dotnet test -c Release ;;
    lint) run dotnet format --verify-no-changes ;;
    run) run dotnet run -- "${@:2}" ;;
    clean) run dotnet clean ;;
    *) skip dotnet "define in the justfile" ;;
  esac
}

dispatch() {
  local action="$1"; shift
  local list; list=$(detected)
  if [ -z "$list" ]; then note "no supported stack detected (node, python, rust, go, ruby, java, c-cpp, dotnet); nothing to $action"; return 0; fi
  local s
  for s in $list; do
    note "== $s: $action"
    case "$s" in
      c-cpp) do_c_cpp "$action" "$@" ;;
      *) "do_$s" "$action" "$@" ;;
    esac
  done
}

release() {
  local v="${1:-}"
  [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-+][0-9A-Za-z.-]+)?$ ]] || { note "usage: dev.sh release X.Y.Z"; exit 2; }
  if git rev-parse "v$v" >/dev/null 2>&1; then note "tag v$v already exists"; exit 2; fi
  grep -Eq "^## \[$v\]" CHANGELOG.md || { note "CHANGELOG.md has no '## [$v]' section; move the Unreleased notes under '## [$v] - $(date +%F)' first"; exit 2; }
  printf '%s\n' "$v" > VERSION
  [ -f CITATION.cff ] && sed -i.bak -E "s/^version: .*/version: \"$v\"/; s/^date-released: .*/date-released: \"$(date +%F)\"/" CITATION.cff && rm -f CITATION.cff.bak
  git add VERSION CITATION.cff CHANGELOG.md 2>/dev/null
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
