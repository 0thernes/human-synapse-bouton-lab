# SPDX-License-Identifier: Apache-2.0
"""Deterministic targeted mutation testing audit (Build Standard B13).

Creates isolated temporary mutated copies of `python/synapse_science/oracle.py`
(never altering tracked workspace files) and verifies that the existing pytest
suite kills 100% of planted biophysical invariant mutants.
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


def main() -> int:
    source = ORACLE.read_text(encoding="utf-8")
    killed = 0
    total = len(MUTANTS)

    print(f"Running targeted mutation audit (B13) on {ORACLE.name} ({total} mutants)...")
    for m in MUTANTS:
        if m.target not in source:
            print(f"  [ERROR] {m.id} target not found in oracle.py: {m.target!r}", file=sys.stderr)
            return 2

        with tempfile.TemporaryDirectory(prefix=f"mutant_{m.id}_") as tmp:
            tmp_pkg = Path(tmp) / "synapse_science"
            shutil.copytree(ROOT / "python" / "synapse_science", tmp_pkg)
            (tmp_pkg / "oracle.py").write_text(source.replace(m.target, m.replacement, 1), encoding="utf-8")

            env_cmd = [
                sys.executable,
                "-m",
                "pytest",
                "-q",
                "--no-header",
                "-k",
                "not differential",
                str(ROOT / "python" / "tests" / "test_oracle_and_api.py"),
            ]
            env = os.environ.copy()
            env["PYTHONPATH"] = str(tmp) + os.pathsep + env.get("PYTHONPATH", "")
            proc = subprocess.run(env_cmd, cwd=str(ROOT), env=env, capture_output=True, text=True)
            is_killed = proc.returncode != 0
            status = "KILLED" if is_killed else "SURVIVED"
            if is_killed:
                killed += 1
            print(f"  [{status}] {m.id}: {m.description}")

    rate = 100.0 * killed / total
    print(f"Mutation audit result: {killed}/{total} mutants killed ({rate:.1f}%).")
    return 0 if killed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
