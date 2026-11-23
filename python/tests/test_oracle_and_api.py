# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
Pytest + Hypothesis + FastAPI Contract + Cross-Language Differential Test Suite.
Covers Build Standard B05, B06, B09, B10, B11, B12, B14, B20.
"""

from __future__ import annotations

from fractions import Fraction

import numpy as np
import pytest
from fastapi.testclient import TestClient
from hypothesis import given, settings
from hypothesis import strategies as st

from synapse_science.oracle import (
    exact_bioenergetics,
    exact_cleft_glu_peak_mm,
    exact_ei_balance,
    exact_electrochemistry,
    exact_hill4_fraction,
    exact_local_ca_peak_um,
    exact_metrology,
    exact_peak_epsc_pa,
    exact_release_probability,
    exact_snare_thermodynamics,
    exact_thermal_energy_pn_nm,
)
from synapse_science.server import create_app
from synapse_science.stats_experiments import holm_bonferroni


def test_exact_rational_hill4_matches_lean_theorems() -> None:
    assert exact_hill4_fraction(15, 1, 15, 1) == Fraction(1, 2)
    assert exact_hill4_fraction(5, 1, 15, 1) == Fraction(1, 82)
    ratio = exact_hill4_fraction(15, 1, 15, 1) / exact_hill4_fraction(15, 2, 15, 1)
    assert ratio == Fraction(17, 2)


def test_negative_oracle_inputs_rejected() -> None:
    with pytest.raises(ValueError):
        exact_thermal_energy_pn_nm(-300.0)
    with pytest.raises(ValueError):
        exact_local_ca_peak_um(-1.0, 20.0)
    with pytest.raises(ValueError):
        exact_local_ca_peak_um(2.0, 0.0)
    with pytest.raises(ValueError):
        exact_release_probability(-0.5)
    with pytest.raises(ValueError):
        exact_hill4_fraction(-1, 1)


@settings(max_examples=1000)
@given(
    c=st.floats(min_value=0.0, max_value=400.0, allow_nan=False, allow_infinity=False),
    delta=st.floats(min_value=1e-4, max_value=100.0, allow_nan=False, allow_infinity=False),
)
def test_property_hill4_monotone_and_unit_interval(c: float, delta: float) -> None:
    p1 = float(exact_release_probability(c))
    p2 = float(exact_release_probability(c + delta))
    assert 0.0 <= p1 < 1.0
    assert p2 >= p1


@settings(max_examples=500)
@given(
    ves=st.integers(min_value=1, max_value=20),
    cleft=st.floats(min_value=12.0, max_value=50.0, allow_nan=False, allow_infinity=False),
    offset=st.floats(min_value=0.0, max_value=120.0, allow_nan=False, allow_infinity=False),
)
def test_metamorphic_vesicle_linearity(ves: int, cleft: float, offset: float) -> None:
    g1 = float(exact_cleft_glu_peak_mm(ves, cleft, offset))
    g2 = float(exact_cleft_glu_peak_mm(ves * 2, cleft, offset))
    assert np.isclose(g2, 2.0 * g1, rtol=1e-12)


def test_holm_bonferroni_reference_fixture() -> None:
    adj = holm_bonferroni([0.001, 0.04, 0.03, 0.50])
    assert np.allclose(adj, [0.004, 0.09, 0.09, 0.50], atol=1e-12)


def test_fastapi_openapi_contract_and_endpoints() -> None:
    client = TestClient(create_app())
    r_health = client.get("/healthz")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "ok"

    schema = client.get("/openapi.json").json()
    for path in [
        "/healthz",
        "/api/v1/electrochemistry",
        "/api/v1/nanodomain",
        "/api/v1/snare",
        "/api/v1/bioenergetics",
        "/api/v1/ei-balance",
        "/api/v1/metrology",
    ]:
        assert path in schema["paths"]

    r_ec = client.post("/api/v1/electrochemistry", json={"temp_c": 37.0})
    assert r_ec.status_code == 200
    assert -82.0 < r_ec.json()["vmGhkMv"] < -62.0

    r_nano = client.post("/api/v1/nanodomain", json={"coupling_nm": 17.0, "nanocolumn_offset_nm": 0.0})
    assert r_nano.status_code == 200
    assert r_nano.json()["peakEpscPa"] < -15.0

    r_snare = client.post("/api/v1/snare", json={"snare_count": 4, "syt1_ca_bound": 5})
    assert r_snare.status_code == 200
    assert r_snare.json()["fusionDelayMs"] < 1.5

    r_bio = client.post("/api/v1/bioenergetics", json={"firing_rate_hz": 10.0, "mito_active": True})
    assert r_bio.status_code == 200
    assert r_bio.json()["sustained"] is True

    r_ei = client.post("/api/v1/ei-balance", json={"g_exc_ns": 3.0, "g_inh_ns": 4.0})
    assert r_ei.status_code == 200
    assert r_ei.json()["shuntingRatio"] < 0.7

    r_met = client.post("/api/v1/metrology", json={"photons": 2500, "resi_subsets_k": 9})
    assert r_met.status_code == 200
    assert r_met.json()["resolvable"] is True

    # Negative API contract check (B06)
    r_bad = client.post("/api/v1/electrochemistry", json={"na_out_mm": -5.0})
    assert r_bad.status_code == 422


def test_oracle_golden_values() -> None:
    ec = exact_electrochemistry(145, 12, 4, 140, 2, 0.08, 120, 9, 0.04, 0.45, 37)
    assert abs(ec["rtOverFMv"] - 26.7266) < 1e-3
    assert abs(ec["vmGhkMv"] - (-70.613012)) < 1e-4
    assert abs(float(exact_thermal_energy_pn_nm(37)) - 4.282083) < 1e-3
    assert exact_snare_thermodynamics(4, 15, 5, 37)["fusionDelayMs"] < 1.5
    assert exact_bioenergetics(5.5, 7.2, 40, 10, True, 37)["sustainSeconds"] == float("inf")
    assert exact_ei_balance(3.0, 4.0, 7.0, 125.0, 37)["shuntingRatio"] < 0.65
    assert exact_metrology(2500, 110, 2, 2, 5, 3, 9)["resolvable"] is True
    assert float(exact_peak_epsc_pa(1.62, 37)) < -20.0
