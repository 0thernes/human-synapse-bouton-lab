#!/usr/bin/env python3
"""Report which Build Pipeline Models artifacts exist. Report-only: always exits 0 (R1, R3)."""
import csv, glob, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tsv = os.path.join(root, "scripts", "pipeline-checks.tsv")
seen = {}
with open(tsv, encoding="utf-8") as f:
    for r in csv.DictReader(f, delimiter="\t"):
        rel_pat = r["path"].replace("YYYY-MM-DD-title", "*").replace("YYYY-MM", "*")
        pat = os.path.join(glob.escape(root), rel_pat)
        exact = os.path.join(root, r["path"])
        ok = bool(glob.glob(pat)) or os.path.exists(exact)
        seen.setdefault(r["phase_id"], []).append((ok, r["path"]))
for ph, items in seen.items():
    have = sum(o for o, _ in items)
    print(f"{ph}: {have}/{len(items)} artifacts present")
    for o, p in items:
        if not o:
            print(f"   missing (issue): {p}")
sys.exit(0)
