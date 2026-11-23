# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
Cross-language differential testing (Build Standard B11):
Runs 1,000 seeded random inputs through:
  1. Python 50-digit exact mpmath oracle (`synapse_science.oracle`)
  2. TypeScript `@synapse/core` (via Node)
  3. Rust `synapse-sim` (compiled native binary)
and asserts agreement within strict relative tolerance (1e-10) across all 1,000 cases.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

import numpy as np
import pytest

from synapse_science.oracle import (
    exact_cleft_glu_peak_mm,
    exact_ei_balance,
    exact_local_ca_peak_um,
    exact_peak_epsc_pa,
    exact_release_probability,
    exact_snare_thermodynamics,
)

REPO_ROOT = Path(__file__).resolve().parents[2]


def _make_cases(n: int = 1000) -> list[dict[str, float]]:
    rng = np.random.default_rng(20261123)
    cases = []
    for _ in range(n):
        cases.append(
            {
                "ca_ext_mm": float(rng.uniform(0.5, 4.0)),
                "coupling_nm": float(rng.uniform(8.0, 100.0)),
                "cleft_width_nm": float(rng.uniform(14.0, 36.0)),
                "offset_nm": float(rng.uniform(0.0, 120.0)),
                "temp_c": float(rng.uniform(20.0, 40.0)),
                "g_exc_ns": float(rng.uniform(0.2, 20.0)),
                "g_inh_ns": float(rng.uniform(0.2, 20.0)),
                "n_snare": float(int(rng.integers(1, 7))),
                "n_ca": float(int(rng.integers(0, 6))),
            }
        )
    return cases


def _run_oracle(cases: list[dict[str, float]]) -> list[dict[str, float]]:
    out = []
    for c in cases:
        ca_peak = float(exact_local_ca_peak_um(c["ca_ext_mm"], c["coupling_nm"]))
        pr = float(exact_release_probability(ca_peak))
        glu = float(exact_cleft_glu_peak_mm(1.0, c["cleft_width_nm"], c["offset_nm"]))
        epsc = float(exact_peak_epsc_pa(glu, c["temp_c"]))
        ei = exact_ei_balance(c["g_exc_ns"], c["g_inh_ns"], 7.0, 125.0, c["temp_c"])
        snare = exact_snare_thermodynamics(c["n_snare"], 15.0, c["n_ca"], c["temp_c"])
        out.append(
            {
                "ca_peak_um": ca_peak,
                "pr": pr,
                "glu_mm": glu,
                "epsc_pa": epsc,
                "v_steady_mv": ei["vSteadyMv"],
                "snare_barrier_kbt": snare["effectiveBarrierKbt"],
            }
        )
    return out


def test_differential_python_vs_typescript_1000_cases() -> None:
    cli = REPO_ROOT / "packages" / "synapse-core" / "scripts" / "differential_cli.mjs"
    dist_idx = REPO_ROOT / "packages" / "synapse-core" / "dist" / "index.js"
    if not shutil.which("node") or not dist_idx.exists():
        pytest.skip("Node or built @synapse/core dist/ not available in this isolated Python environment")
    cases = _make_cases(1000)
    oracle = _run_oracle(cases)
    proc = subprocess.run(
        ["node", str(cli)],
        input=json.dumps(cases),
        capture_output=True,
        text=True,
        check=True,
    )
    ts_out = json.loads(proc.stdout)
    assert len(ts_out) == 1000
    for o, t in zip(oracle, ts_out, strict=True):
        for k in o:
            assert np.isclose(o[k], t[k], rtol=1e-10, atol=1e-12), f"Mismatch in {k}: oracle={o[k]} ts={t[k]}"


def test_differential_python_vs_rust_1000_cases() -> None:
    exe = next(
        (
            p
            for p in [
                REPO_ROOT / "target" / "release" / "synapse-sim.exe",
                REPO_ROOT / "target" / "release" / "synapse-sim",
            ]
            if p.exists()
        ),
        None,
    )
    if exe is None:
        pytest.skip("Compiled Rust synapse-sim release binary not built yet")
    cases = _make_cases(1000)
    oracle = _run_oracle(cases)
    proc = subprocess.run(
        [str(exe), "differential"],
        input=json.dumps(cases),
        capture_output=True,
        text=True,
        check=True,
    )
    rs_out = json.loads(proc.stdout)
    assert len(rs_out) == 1000
    for o, r in zip(oracle, rs_out, strict=True):
        for k in o:
            assert np.isclose(o[k], r[k], rtol=1e-10, atol=1e-12), f"Mismatch in {k}: oracle={o[k]} rust={r[k]}"
