# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""Deterministic targeted mutation testing audit (Build Standard B13; hardened F35).

Creates isolated temporary mutated copies of `python/synapse_science/oracle.py`
(never altering tracked workspace files) and enforces:
  1. Unmutated baseline control run MUST exit 0 and import `oracle.py` from the temp copy
     (prevents editable `.venv` shadowing or Windows bracketed-path pytest exit-4 false kills).
  2. Each mutant counts as KILLED strictly when pytest exits with code 1 (test assertion failure),
     never on usage/import errors (exit codes 2, 3, 4, 5).
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORACLE = ROOT / "python" / "synapse_science" / "oracle.py"
TEST_REL = "python/tests/test_oracle_and_api.py"


@dataclass(frozen=True)
class Mutant:
    id: str
    description: str
    target: str
    replacement: str


MUTANTS: tuple[Mutant, ...] = (
    Mutant(
        id="M01",
        description="Perturb exact Hill cooperativity exponent from 4 to 3",
        target="c4 = c**4",
        replacement="c4 = c**3",
    ),
    Mutant(
        id="M02",
        description="Invert Nernst thermal voltage sign in exact_electrochemistry",
        target='rt_f = (R_GAS_EXACT * temp_k / FARADAY_EXACT) * mp.mpf("1000")',
        replacement='rt_f = -(R_GAS_EXACT * temp_k / FARADAY_EXACT) * mp.mpf("1000")',
    ),
    Mutant(
        id="M03",
        description="Corrupt SNARE clamp relief stoichiometry (5 -> 10)",
        target='clamp_relief = (n_ca / mp.mpf("5")) * clamp',
        replacement='clamp_relief = (n_ca / mp.mpf("10")) * clamp',
    ),
    Mutant(
        id="M04",
        description="Drop resting V-ATPase H+ leak floor (4000 ATP/s) in bioenergetics",
        target="burn = 4000.0 + firing_rate_hz * 32000.0",
        replacement="burn = firing_rate_hz * 32000.0",
    ),
    Mutant(
        id="M05",
        description="Remove RESI subset K variance reduction factor",
        target="resi = crlb / mp.sqrt(k_sub)",
        replacement="resi = crlb",
    ),
    Mutant(
        id="M06",
        description="Perturb Ca2+ Hill sensor Kd from 15 uM to 20 uM",
        target='kd = mp.mpf("15")',
        replacement='kd = mp.mpf("20")',
    ),
)


def _run_pytest_against_copy(tmp_dir: Path) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env["PYTHONPATH"] = str(tmp_dir) + os.pathsep + env.get("PYTHONPATH", "")
    # Verify inside the child interpreter that synapse_science.oracle resolves from tmp_dir
    probe = subprocess.run(
        [sys.executable, "-c", "import synapse_science.oracle as o; print(o.__file__)"],
        cwd=str(ROOT),
        env=env,
        capture_output=True,
        text=True,
        check=True,
    )
    loaded = Path(probe.stdout.strip()).resolve()
    expected = (tmp_dir / "synapse_science" / "oracle.py").resolve()
    if loaded != expected:
        raise RuntimeError(f"Mutation harness shadowed! Loaded {loaded} instead of {expected}")

    return subprocess.run(
        [
            sys.executable,
            "-m",
            "pytest",
            "-q",
            "--no-header",
            "-k",
            "not differential",
            TEST_REL,
        ],
        cwd=str(ROOT),
        env=env,
        capture_output=True,
        text=True,
    )


def main() -> int:
    source = ORACLE.read_text(encoding="utf-8")
    killed = 0
    total = len(MUTANTS)

    print(f"Running targeted mutation audit (B13) on {ORACLE.name} ({total} mutants)...")

    # Mandatory unmutated baseline control (F35): guarantees zero false kills from harness errors
    with tempfile.TemporaryDirectory(prefix="mutant_control_") as tmp:
        tmp_root = Path(tmp)
        shutil.copytree(ROOT / "python" / "synapse_science", tmp_root / "synapse_science")
        ctrl = _run_pytest_against_copy(tmp_root)
        if ctrl.returncode != 0:
            print(
                f"  [HARNESS ERROR] Unmutated baseline control failed (rc={ctrl.returncode}):\n"
                f"{ctrl.stdout}\n{ctrl.stderr}",
                file=sys.stderr,
            )
            return 2
        print("  [PASS]   CONTROL: Unmutated baseline passed (rc=0; isolated temp import verified)")

    for m in MUTANTS:
        if m.target not in source:
            print(f"  [ERROR] {m.id} target not found in oracle.py: {m.target!r}", file=sys.stderr)
            return 2

        with tempfile.TemporaryDirectory(prefix=f"mutant_{m.id}_") as tmp:
            tmp_root = Path(tmp)
            tmp_pkg = tmp_root / "synapse_science"
            shutil.copytree(ROOT / "python" / "synapse_science", tmp_pkg)
            (tmp_pkg / "oracle.py").write_text(source.replace(m.target, m.replacement, 1), encoding="utf-8")

            proc = _run_pytest_against_copy(tmp_root)
            if proc.returncode == 1:
                killed += 1
                print(f"  [KILLED] {m.id}: {m.description}")
            elif proc.returncode == 0:
                print(f"  [SURVIVED] {m.id}: {m.description}")
            else:
                print(
                    f"  [HARNESS ERROR] {m.id} exited with unexpected pytest code {proc.returncode}:\n"
                    f"{proc.stdout}\n{proc.stderr}",
                    file=sys.stderr,
                )
                return 2

    rate = 100.0 * killed / total
    print(f"Mutation audit result: {killed}/{total} mutants genuinely killed ({rate:.1f}%).")
    return 0 if killed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
