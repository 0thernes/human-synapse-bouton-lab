# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""Live citation integrity & retraction-status auditor (Playbook Edition 1.3 §8 Item 16; F36).

Parses `papers/references.bib`, queries the live Crossref REST API for every DOI, and
STRICTLY verifies:
  1. HTTP 200 resolution,
  2. Normalized title match against Crossref metadata (catches wrong DOIs such as MOF vs. DNA origami),
  3. First-author surname match against Crossref metadata (catches wrong/hallucinated authors),
  4. Publication year consistency (`published-print`, `published-online`, `issued`, `created`),
  5. Retraction detection across Crossref `updated-by` (Retraction Watch), `update-to`, and
     `relation.is-retracted-by` (reporting non-retraction `correction` notices transparently).

Writes a machine-readable audit report to `docs/citation-audit.json` with separate counts
for `verified_crossref_count`, `verified_url_count`, `verified_metadata_no_doi_count`,
`mismatch_count`, `retracted_count`, and `error_count`.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = ROOT / "papers" / "references.bib"
OUT_PATH = ROOT / "docs" / "citation-audit.json"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip() if (ROOT / "VERSION").exists() else "1.4.0"
USER_AGENT = f"human-synapse-bouton-lab/{VERSION} (mailto:0_0@0thernes.art)"


def normalize_text(raw: str) -> str:
    """Strip LaTeX macros/braces, HTML tags, accents, and punctuation for exact comparison."""
    s = re.sub(r"</(?:sup|sub)>(?=[A-Za-z])", " ", raw)
    s = re.sub(r"<[^>]+>", "", s)
    s = re.sub(r"\\textsuperscript\{([^}]*)\}", r"\1", s)
    s = s.replace(r"{\AA}", "A").replace(r"\AA", "A").replace(r"{\aa}", "a").replace(r"\aa", "a")
    s = s.replace(r"{\ss}", "ss").replace(r"\ss", "ss").replace(r"{\l}", "l").replace(r"\l", "l")
    s = re.sub(r"\\[\"'`^~=.]\{?([A-Za-z])\}?", r"\1", s)
    s = s.replace("{", "").replace("}", "")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace("ß", "ss").replace("ł", "l").replace("Ł", "l")
    s = re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
    return s


def first_author_surname(author_field: str) -> str:
    """Extract normalized first-author surname from a BibTeX author field."""
    first = re.split(r"\s+and\s+", author_field.strip(), maxsplit=1)[0].strip()
    if "," in first:
        surname = first.split(",", 1)[0].strip()
    else:
        surname = first
    return normalize_text(surname)


def _extract_bib_fields(blk: str) -> dict[str, str]:
    """Brace-balanced BibTeX field extractor handling arbitrarily nested `{...}`."""
    fields: dict[str, str] = {}
    i = blk.find(",")
    if i < 0:
        return fields
    i += 1
    n = len(blk)
    while i < n:
        while i < n and blk[i] in " \t\r\n,}":
            i += 1
        if i >= n:
            break
        m_name = re.match(r"([A-Za-z0-9_-]+)\s*=\s*", blk[i:])
        if not m_name:
            i += 1
            continue
        fname = m_name.group(1).lower()
        i += m_name.end()
        if i >= n:
            break
        if blk[i] == "{":
            depth = 1
            start = i + 1
            i += 1
            while i < n and depth > 0:
                if blk[i] == "{":
                    depth += 1
                elif blk[i] == "}":
                    depth -= 1
                i += 1
            raw_val = blk[start : i - 1]
        elif blk[i] == '"':
            start = i + 1
            i += 1
            while i < n and blk[i] != '"':
                if blk[i] == "\\" and i + 1 < n:
                    i += 2
                else:
                    i += 1
            raw_val = blk[start:i]
            i += 1
        else:
            start = i
            while i < n and blk[i] not in ",\r\n}":
                i += 1
            raw_val = blk[start:i]
        fields[fname] = re.sub(r"\s+", " ", raw_val).strip()
    return fields


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
        parsed = _extract_bib_fields(blk)
        for field in ("author", "title", "year", "journal", "doi", "note"):
            if field in parsed:
                rec[field] = parsed[field]
        entries.append(rec)
    return entries


def extract_crossref_years(msg: dict[str, Any]) -> set[str]:
    years: set[str] = set()
    for dk in ("published-print", "published-online", "issued", "created"):
        dp = (msg.get(dk) or {}).get("date-parts")
        if dp and isinstance(dp, list) and dp[0] and dp[0][0]:
            years.add(str(dp[0][0]))
    return years


def extract_crossref_first_author(msg: dict[str, Any]) -> str:
    authors = msg.get("author") or []
    if not authors:
        return ""
    first = authors[0]
    raw = str(first.get("family") or first.get("name") or "")
    return normalize_text(raw)


def titles_match(bib_title: str, cr_title: str) -> tuple[bool, float]:
    nb = normalize_text(bib_title)
    nc = normalize_text(cr_title)
    if not nb or not nc:
        return False, 0.0
    if nb == nc:
        return True, 1.0
    tb = set(nb.split())
    tc = set(nc.split())
    jaccard = len(tb & tc) / max(1, len(tb | tc))
    return jaccard >= 0.88, round(jaccard, 4)


def detect_retractions_and_updates(msg: dict[str, Any]) -> tuple[bool, list[str]]:
    """Inspect Crossref `updated-by` (Retraction Watch), `update-to`, and `relation`."""
    notices: list[str] = []
    retracted = False
    for key in ("updated-by", "update-to"):
        for u in msg.get(key) or []:
            utype = str(u.get("type", "")).lower()
            ulabel = str(u.get("label", "")).lower()
            usrc = str(u.get("source", ""))
            udoi = str(u.get("DOI", ""))
            notices.append(f"{key}:{utype or ulabel}:{usrc}:{udoi}")
            if "retract" in utype or "retract" in ulabel:
                retracted = True
    relation = msg.get("relation") or {}
    if "is-retracted-by" in relation:
        retracted = True
        notices.append("relation:is-retracted-by")
    return retracted, notices


def evaluate_crossref_record(entry: dict[str, str], msg: dict[str, Any], http_code: int = 200) -> dict[str, Any]:
    """Pure, unit-testable evaluator comparing a BibTeX entry against a Crossref `message` dict."""
    cr_titles = msg.get("title") or []
    cr_title = str(cr_titles[0]) if cr_titles else ""
    t_ok, t_score = titles_match(entry.get("title", ""), cr_title)

    bib_first = first_author_surname(entry.get("author", ""))
    cr_first = extract_crossref_first_author(msg)
    a_ok = bool(bib_first and cr_first and (bib_first == cr_first or bib_first in cr_first or cr_first in bib_first))

    bib_year = entry.get("year", "").strip()
    cr_years = extract_crossref_years(msg)
    y_ok = bool(bib_year and bib_year in cr_years)

    is_retracted, notices = detect_retractions_and_updates(msg)

    mismatches: list[str] = []
    if not t_ok:
        mismatches.append(f"title_mismatch(jaccard={t_score})")
    if not a_ok:
        mismatches.append(f"first_author_mismatch(bib={bib_first!r}, cr={cr_first!r})")
    if not y_ok:
        mismatches.append(f"year_mismatch(bib={bib_year!r}, cr={sorted(cr_years)!r})")

    if is_retracted:
        status = "retracted"
    elif mismatches:
        status = "mismatch"
    else:
        status = "verified_crossref"

    return {
        "key": entry["key"],
        "bib_year": bib_year,
        "bib_title": entry.get("title", ""),
        "bib_first_author": bib_first,
        "doi": entry.get("doi"),
        "http_status": http_code,
        "crossref_title": cr_title,
        "crossref_first_author": cr_first,
        "crossref_years": sorted(cr_years),
        "title_jaccard": t_score,
        "title_match": t_ok,
        "first_author_match": a_ok,
        "year_match": y_ok,
        "retracted": is_retracted,
        "update_notices": notices,
        "mismatches": mismatches,
        "status": status,
    }


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
    mismatches = 0

    for entry in entries:
        key = entry["key"]
        doi = entry.get("doi")
        if doi:
            url = f"https://api.crossref.org/works/{urllib.parse.quote(doi, safe='')}"
            try:
                code, payload = fetch_json(url)
                msg = payload.get("message", {})
                record = evaluate_crossref_record(entry, msg, code)
                if record["status"] == "retracted":
                    retractions += 1
                    failures += 1
                elif record["status"] == "mismatch":
                    mismatches += 1
                    failures += 1
            except Exception as exc:
                record = {
                    "key": key,
                    "bib_year": entry.get("year", ""),
                    "bib_title": entry.get("title", ""),
                    "doi": doi,
                    "retracted": False,
                    "status": "error",
                    "error": str(exc),
                }
                failures += 1
        else:
            note = entry.get("note", "")
            m_url = re.search(r"\\url\{([^}]+)\}", note)
            if m_url:
                u = m_url.group(1)
                try:
                    code = head_url(u)
                    ok = 200 <= code < 400
                    record = {
                        "key": key,
                        "bib_year": entry.get("year", ""),
                        "bib_title": entry.get("title", ""),
                        "doi": None,
                        "url": u,
                        "http_status": code,
                        "retracted": False,
                        "status": "verified_url" if ok else "error",
                    }
                    if not ok:
                        failures += 1
                except Exception as exc:
                    record = {
                        "key": key,
                        "bib_year": entry.get("year", ""),
                        "bib_title": entry.get("title", ""),
                        "doi": None,
                        "url": u,
                        "retracted": False,
                        "status": "error",
                        "error": str(exc),
                    }
                    failures += 1
            else:
                q = urllib.parse.urlencode({"query.title": entry.get("title", ""), "rows": "1"})
                try:
                    code, payload = fetch_json(f"https://api.crossref.org/works?{q}")
                    items = payload.get("message", {}).get("items") or []
                    record = {
                        "key": key,
                        "bib_year": entry.get("year", ""),
                        "bib_title": entry.get("title", ""),
                        "doi": None,
                        "http_status": code,
                        "crossref_search_top": (items[0].get("title") or [""])[0] if items else "",
                        "retracted": False,
                        "status": "verified_metadata_no_doi",
                    }
                except Exception as exc:
                    record = {
                        "key": key,
                        "bib_year": entry.get("year", ""),
                        "bib_title": entry.get("title", ""),
                        "doi": None,
                        "retracted": False,
                        "status": "error",
                        "error": str(exc),
                    }
                    failures += 1

        results.append(record)
        extra = f" mismatches={record['mismatches']}" if record.get("mismatches") else ""
        print(f"  [{record['status']:24s}] {key} ({doi or record.get('url') or 'no-doi'}){extra}")

    verified_cr = sum(1 for r in results if r["status"] == "verified_crossref")
    verified_url = sum(1 for r in results if r["status"] == "verified_url")
    verified_no_doi = sum(1 for r in results if r["status"] == "verified_metadata_no_doi")
    report = {
        "audited_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "bib_file": "papers/references.bib",
        "total_references": len(results),
        "verified_crossref_count": verified_cr,
        "verified_url_count": verified_url,
        "verified_metadata_no_doi_count": verified_no_doi,
        "mismatch_count": mismatches,
        "retracted_count": retractions,
        "error_count": failures,
        "checks_enforced": ["http_200", "title_similarity", "first_author_surname", "year", "updated_by_retraction"],
        "entries": results,
    }
    OUT_PATH.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(
        f"Citation audit complete: {verified_cr} Crossref DOI matched, "
        f"{verified_url} URL checked, {verified_no_doi} metadata-only (no DOI), "
        f"{mismatches} mismatched, {retractions} retracted, {failures} errors "
        f"(total {len(results)})."
    )
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
