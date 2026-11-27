# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
README Verbatim #print axioms Drift Auditor (Playbook Edition 1.3 §8 Item 4).

Verifies that the verbatim `<!-- BEGIN_AXIOMS --> ... <!-- END_AXIOMS -->` code block
embedded in README.md matches the exact Lean 4.35.0 `#print axioms` output produced by
`lean/VerifyAxioms.lean` (locally in `docs/lean-axioms-report.txt` or live CI `lean-axioms-ci.txt`),
and verifies zero forbidden axioms (`sorryAx`, `Classical.choice`, `Lean.ofReduceBool`, `Lean.trustCompiler`, `_native`).
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_AXIOMS = ROOT / "docs" / "lean-axioms-report.txt"
README_PATH = ROOT / "README.md"
FORBIDDEN_RE = re.compile(r"\b(sorryAx|Classical\.choice|Lean\.ofReduceBool|Lean\.trustCompiler)\b|_native")


def normalize_axioms(text: str) -> list[str]:
    lines = [ln.strip() for ln in text.replace("\r\n", "\n").splitlines() if ln.strip()]
    return [ln for ln in lines if ln.startswith("'SynapseBouton.")]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify README verbatim #print axioms matches Lean output.")
    parser.add_argument("--axioms-file", type=Path, default=DEFAULT_AXIOMS)
    args = parser.parse_args()

    axioms_raw = args.axioms_file.read_text(encoding="utf-8")
    readme_raw = README_PATH.read_text(encoding="utf-8")

    if FORBIDDEN_RE.search(axioms_raw):
        print(f"FAIL: Forbidden axiom detected in {args.axioms_file}", file=sys.stderr)
        return 1

    expected = normalize_axioms(axioms_raw)
    if len(expected) != 24:
        print(f"FAIL: Expected 24 theorem axiom lines in {args.axioms_file}, found {len(expected)}", file=sys.stderr)
        return 1

    m = re.search(
        r"<!--\s*BEGIN_AXIOMS\s*-->(.*?)<!--\s*END_AXIOMS\s*-->",
        readme_raw,
        re.DOTALL,
    )
    if not m:
        print("FAIL: Missing <!-- BEGIN_AXIOMS --> ... <!-- END_AXIOMS --> markers in README.md", file=sys.stderr)
        return 1

    actual = normalize_axioms(m.group(1))
    if actual != expected:
        print("FAIL: README.md verbatim #print axioms block drifted from kernel output!", file=sys.stderr)
        print(f"Expected ({len(expected)} lines), found ({len(actual)} lines).", file=sys.stderr)
        for idx, (e, a) in enumerate(zip(expected, actual), start=1):
            if e != a:
                print(f"  Mismatch at line {idx}:\n    expected: {e}\n    actual:   {a}", file=sys.stderr)
        return 1

    print(f"PASS: README.md verbatim #print axioms matches all {len(expected)} kernel-verified theorems (0 forbidden axioms).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
