# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""Unit & negative tests for scripts/verify_citations.py (F36, Build Standard B06/B07)."""

from __future__ import annotations

import importlib.util
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_PATH = REPO_ROOT / "scripts" / "verify_citations.py"

_spec = importlib.util.spec_from_file_location("verify_citations", SCRIPT_PATH)
assert _spec is not None and _spec.loader is not None
vc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vc)


def test_wrong_doi_title_and_author_mismatch_rejected() -> None:
    """Regression F36: wrong DOI (MOF paper vs Xu et al. DNA origami) must fail as mismatch."""
    bib_entry = {
        "key": "xu2016dnaorigami",
        "author": "Xu, Weiming and Nathwani, Bhavik and Rothman, James E.",
        "title": "A Programmable {DNA} Origami Platform to Organize {SNAREs} for Membrane Fusion",
        "year": "2016",
        "doi": "10.1021/jacs.5b12688",
    }
    wrong_crossref_msg = {
        "title": ["Thermal Stabilization of Metal-Organic Framework-Derived Single-Site Catalytic Clusters through Nanocasting"],
        "author": [{"family": "Malonzo", "given": "C. D."}],
        "issued": {"date-parts": [[2016]]},
    }
    rec = vc.evaluate_crossref_record(bib_entry, wrong_crossref_msg, 200)
    assert rec["status"] == "mismatch"
    assert rec["title_match"] is False
    assert rec["first_author_match"] is False
    assert rec["retracted"] is False


def test_updated_by_retraction_watch_detected() -> None:
    """Regression F36: Crossref `updated-by` Retraction Watch notice (e.g. Wakefield 1998) must fail as retracted."""
    bib_entry = {
        "key": "wakefield1998",
        "author": "Wakefield, A. J.",
        "title": "Ileal-lymphoid-nodular hyperplasia, non-specific colitis, and pervasive developmental disorder in children",
        "year": "1998",
        "doi": "10.1016/S0140-6736(97)11096-0",
    }
    retracted_msg = {
        "title": ["RETRACTED: Ileal-lymphoid-nodular hyperplasia, non-specific colitis, and pervasive developmental disorder in children"],
        "author": [{"family": "Wakefield", "given": "AJ"}],
        "issued": {"date-parts": [[1998]]},
        "updated-by": [
            {"DOI": "10.1016/s0140-6736(04)15715-2", "type": "correction", "label": "Correction", "source": "retraction-watch"},
            {"DOI": "10.1016/s0140-6736(10)60175-4", "type": "retraction", "label": "Retraction", "source": "retraction-watch"},
        ],
    }
    rec = vc.evaluate_crossref_record(bib_entry, retracted_msg, 200)
    assert rec["status"] == "retracted"
    assert rec["retracted"] is True
    assert any("retraction" in n for n in rec["update_notices"])


def test_publisher_correction_recorded_without_false_retraction() -> None:
    """Non-retraction publisher correction (Wang et al. 2024) stays verified_crossref and logs the notice."""
    bib_entry = {
        "key": "wang2024vatpase",
        "author": "Wang, Chuchu and Brunger, Axel T.",
        "title": "Structure and topography of the synaptic {V-ATPase}--synaptophysin complex",
        "year": "2024",
        "doi": "10.1038/s41586-024-07610-x",
    }
    msg = {
        "title": ["Structure and topography of the synaptic V-ATPase–synaptophysin complex"],
        "author": [{"family": "Wang", "given": "Chuchu"}],
        "issued": {"date-parts": [[2024]]},
        "updated-by": [
            {"DOI": "10.1038/s41586-025-09149-x", "type": "correction", "label": "Correction", "source": "publisher"}
        ],
    }
    rec = vc.evaluate_crossref_record(bib_entry, msg, 200)
    assert rec["status"] == "verified_crossref"
    assert rec["retracted"] is False
    assert len(rec["update_notices"]) == 1


def test_bibtex_has_corrected_dois_and_latex_accents_normalize() -> None:
    entries = vc.parse_bib((REPO_ROOT / "papers" / "references.bib").read_text(encoding="utf-8"))
    by_key = {e["key"]: e for e in entries}
    assert len(entries) == 29
    assert by_key["xu2016dnaorigami"]["doi"] == "10.1021/jacs.5b13107"
    assert by_key["rollenhagen2024l1"]["doi"] == "10.7554/eLife.99473"
    assert by_key["coupland2024vatpase"]["doi"] == "10.1126/science.adp5577"
    assert "10.1021/jacs.5b12688" not in (REPO_ROOT / "papers" / "references.bib").read_text(encoding="utf-8")
    ok, score = vc.titles_match(
        r"{\AA}ngstr{\"o}m-resolution fluorescence microscopy",
        "Ångström-resolution fluorescence microscopy",
    )
    assert ok and score == 1.0
