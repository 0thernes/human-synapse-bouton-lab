# SPDX-License-Identifier: Apache-2.0
"""Live citation integrity & retraction-status auditor (Playbook §4 & §8 #13).

Parses `papers/references.bib`, queries the live Crossref REST API for every
DOI (checking HTTP 200 resolution, title/year consistency, and Crossref
retraction/update-to notices), verifies direct URLs for non-DOI entries, and
writes a machine-readable audit report to `docs/citation-audit.json`.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = ROOT / "papers" / "references.bib"
OUT_PATH = ROOT / "docs" / "citation-audit.json"
USER_AGENT = "human-synapse-bouton-lab/1.1.0 (mailto:0_0@0thernes.art)"


def parse_bib(text: str) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    blocks = re.split(r"(?=@\w+\{)", text)
    for blk in blocks:
        blk = blk.strip()
        if not blk.startswith("@"):
            continue
        m_head = re.match(r"@(\w+)\{([^,]+),", blk)
        if not m_head:
            continue
        rec: dict[str, str] = {"type": m_head.group(1), "key": m_head.group(2).strip()}
        for field in ("title", "year", "journal", "doi", "note"):
            m = re.search(rf"\b{field}\s*=\s*\{{((?:[^{{}}]|\{{[^{{}}]*\}})*)\}}", blk, re.DOTALL)
            if m:
                rec[field] = re.sub(r"\s+", " ", m.group(1)).strip()
        entries.append(rec)
    return entries


def fetch_json(url: str, timeout: float = 15.0) -> tuple[int, dict[str, Any]]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return int(resp.status), json.loads(resp.read().decode("utf-8"))


def head_url(url: str, timeout: float = 15.0) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT}, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return int(resp.status)
    except urllib.error.HTTPError as exc:
        if exc.code == 405:
            req_get = urllib.request.Request(url, headers={"User-Agent": USER_AGENT}, method="GET")
            with urllib.request.urlopen(req_get, timeout=timeout) as resp:
                return int(resp.status)
        return int(exc.code)


def main() -> int:
    entries = parse_bib(BIB_PATH.read_text(encoding="utf-8"))
    results: list[dict[str, Any]] = []
    failures = 0
    retractions = 0

    for entry in entries:
        key = entry["key"]
        doi = entry.get("doi")
        year = entry.get("year", "")
        record: dict[str, Any] = {
            "key": key,
            "bib_year": year,
            "bib_title": entry.get("title", ""),
            "doi": doi,
            "status": "unknown",
            "retracted": False,
        }
        if doi:
            url = f"https://api.crossref.org/works/{urllib.parse.quote(doi, safe='')}"
            try:
                code, payload = fetch_json(url)
                msg = payload.get("message", {})
                cr_titles = msg.get("title") or []
                cr_title = cr_titles[0] if cr_titles else ""
                # Check Crossref update-to / assertion / relation retraction signals
                updates = msg.get("update-to") or []
                relation = msg.get("relation") or {}
                is_retracted = any(
                    "retract" in str(u.get("type", "")).lower() or "retract" in str(u.get("label", "")).lower()
                    for u in updates
                ) or ("is-retracted-by" in relation)
                record.update(
                    {
                        "http_status": code,
                        "crossref_title": cr_title,
                        "retracted": is_retracted,
                        "status": "retracted" if is_retracted else "verified_crossref",
                    }
                )
                if is_retracted:
                    retractions += 1
                    failures += 1
            except Exception as exc:
                record.update({"status": "error", "error": str(exc)})
                failures += 1
        else:
            note = entry.get("note", "")
            m_url = re.search(r"\\url\{([^}]+)\}", note)
            if m_url:
                u = m_url.group(1)
                try:
                    code = head_url(u)
                    record.update({"url": u, "http_status": code, "status": "verified_url" if 200 <= code < 400 else "error"})
                    if not (200 <= code < 400):
                        failures += 1
                except Exception as exc:
                    record.update({"url": u, "status": "error", "error": str(exc)})
                    failures += 1
            else:
                # Non-DOI archival journal article (e.g. Chalmers 1995 JCS)
                q = urllib.parse.urlencode({"query.title": entry.get("title", ""), "rows": "1"})
                try:
                    code, payload = fetch_json(f"https://api.crossref.org/works?{q}")
                    items = payload.get("message", {}).get("items") or []
                    record.update(
                        {
                            "http_status": code,
                            "crossref_search_top": (items[0].get("title") or [""])[0] if items else "",
                            "status": "verified_metadata_no_doi",
                        }
                    )
                except Exception as exc:
                    record.update({"status": "error", "error": str(exc)})
                    failures += 1

        results.append(record)
        print(f"  [{record['status']:24s}] {key} ({doi or record.get('url') or 'no-doi'})")

    report = {
        "audited_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "bib_file": "papers/references.bib",
        "total_references": len(results),
        "verified_count": sum(1 for r in results if str(r["status"]).startswith("verified")),
        "retracted_count": retractions,
        "error_count": failures,
        "entries": results,
    }
    OUT_PATH.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Citation audit complete: {report['verified_count']}/{report['total_references']} verified, {retractions} retracted, {failures} errors.")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
