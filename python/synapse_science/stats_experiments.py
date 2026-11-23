# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
Pre-registered 30-seed Monte Carlo statistical analysis suite (Build Standard B28-B32, B39).

Consumes deterministic Rust `synapse-sim sweep` outputs (or runs identical fallback if requested),
computes exact/Monte Carlo permutation p-values, Cliff's delta, Cohen's d, seeded 10,000-resample
95% bootstrap confidence intervals, Holm-Bonferroni adjusted p-values, raw per-seed CSV, and
SHA-256 data manifest (`data/MANIFEST.sha256`).
"""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

import numpy as np

STAT_SEED = 20261123
N_PERMUTATIONS = 10_000
N_BOOTSTRAP = 10_000


def cliffs_delta(x: np.ndarray, y: np.ndarray) -> float:
    """Non-parametric Cliff's delta effect size in [-1, 1]."""
    diff = x[:, None] - y[None, :]
    greater = float(np.sum(diff > 0))
    less = float(np.sum(diff < 0))
    return (greater - less) / float(len(x) * len(y))


def cohens_d_paired(x: np.ndarray, y: np.ndarray) -> float:
    d = x - y
    sd = float(np.std(d, ddof=1))
    if sd < 1e-12:
        return float("inf") if float(np.mean(d)) > 0 else 0.0
    return float(np.mean(d)) / sd


def cohens_d_two_sample(x: np.ndarray, y: np.ndarray) -> float:
    nx, ny = len(x), len(y)
    vx = float(np.var(x, ddof=1))
    vy = float(np.var(y, ddof=1))
    pooled = np.sqrt(((nx - 1) * vx + (ny - 1) * vy) / max(1, nx + ny - 2))
    if pooled < 1e-12:
        return 0.0
    return float(np.mean(x) - np.mean(y)) / float(pooled)


def paired_sign_flip_permutation_p(
    x: np.ndarray, y: np.ndarray, rng: np.random.Generator, n_perm: int = N_PERMUTATIONS
) -> float:
    diffs = x - y
    obs = abs(float(np.mean(diffs)))
    signs = rng.choice(np.array([-1.0, 1.0]), size=(n_perm, len(diffs)))
    perm_means = np.abs(np.mean(signs * diffs[None, :], axis=1))
    return float((np.sum(perm_means >= obs - 1e-12) + 1) / (n_perm + 1))


def two_sample_permutation_p(
    x: np.ndarray, y: np.ndarray, rng: np.random.Generator, n_perm: int = N_PERMUTATIONS
) -> float:
    obs = abs(float(np.mean(x) - np.mean(y)))
    pooled = np.concatenate([x, y])
    nx = len(x)
    exceed = 0
    for _ in range(n_perm):
        perm = rng.permutation(pooled)
        stat = abs(float(np.mean(perm[:nx]) - np.mean(perm[nx:])))
        if stat >= obs - 1e-12:
            exceed += 1
    return float((exceed + 1) / (n_perm + 1))


def bootstrap_diff_ci(
    x: np.ndarray,
    y: np.ndarray,
    paired: bool,
    rng: np.random.Generator,
    n_boot: int = N_BOOTSTRAP,
) -> tuple[float, float]:
    n = len(x)
    if paired:
        diffs = x - y
        idx = rng.integers(0, n, size=(n_boot, n))
        means = np.mean(diffs[idx], axis=1)
    else:
        idx_x = rng.integers(0, n, size=(n_boot, n))
        idx_y = rng.integers(0, len(y), size=(n_boot, len(y)))
        means = np.mean(x[idx_x], axis=1) - np.mean(y[idx_y], axis=1)
    lo, hi = np.percentile(means, [2.5, 97.5])
    return float(lo), float(hi)


def holm_bonferroni(p_values: list[float]) -> list[float]:
    m = len(p_values)
    order = sorted(range(m), key=lambda i: p_values[i])
    adjusted = [0.0] * m
    running_max = 0.0
    for rank, idx in enumerate(order):
        val = min(1.0, (m - rank) * p_values[idx])
        running_max = max(running_max, val)
        adjusted[idx] = running_max
    return adjusted


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def run_rust_sweep(repo_root: Path) -> list[dict[str, Any]]:
    exe_candidates = [
        repo_root / "target" / "release" / "synapse-sim.exe",
        repo_root / "target" / "release" / "synapse-sim",
    ]
    exe = next((p for p in exe_candidates if p.exists()), None)
    if exe is not None:
        cmd = [str(exe), "sweep"]
    else:
        cmd = ["cargo", "run", "--release", "--quiet", "--", "sweep"]
    proc = subprocess.run(cmd, cwd=repo_root, capture_output=True, text=True, check=True)
    return list(json.loads(proc.stdout))


def analyze_sweep(rows: list[dict[str, Any]]) -> dict[str, Any]:
    rng = np.random.default_rng(STAT_SEED)
    h1_t = np.array([r["h1_aligned_epsc_pa"] for r in rows], dtype=float)
    h1_c = np.array([r["h1_misaligned_epsc_pa"] for r in rows], dtype=float)
    h2_t = np.array([r["h2_nanodomain_pr"] for r in rows], dtype=float)
    h2_c = np.array([r["h2_microdomain_pr"] for r in rows], dtype=float)
    h3_t = np.array([r["h3_mito_atp_frac"] for r in rows], dtype=float)
    h3_c = np.array([r["h3_glycolysis_atp_frac"] for r in rows], dtype=float)
    h3b_t = np.array([r["h3b_exploratory_20hz_mito_atp_frac"] for r in rows], dtype=float)
    h3b_c = np.array([r["h3b_exploratory_20hz_glyc_atp_frac"] for r in rows], dtype=float)
    h4_b = np.array([r["h4_null_arm_b_epsc_pa"] for r in rows], dtype=float)

    specs = [
        ("H1_nanocolumn_alignment_epsc_pa", h1_t, h1_c, True, "preregistered"),
        ("H2_nanodomain_vs_microdomain_pr", h2_t, h2_c, True, "preregistered"),
        ("H3_mito_vs_glycolysis_atp_fraction", h3_t, h3_c, True, "preregistered"),
        ("H4_null_control_seed_invariance_epsc_pa", h1_t, h4_b, False, "preregistered"),
        ("H3b_exploratory_20hz_mito_vs_glycolysis", h3b_t, h3b_c, True, "exploratory_posthoc"),
    ]

    raw_ps: list[float] = []
    entries: list[dict[str, Any]] = []
    for name, treat, ctrl, paired, status_tag in specs:
        p_raw = (
            paired_sign_flip_permutation_p(treat, ctrl, rng)
            if paired
            else two_sample_permutation_p(treat, ctrl, rng)
        )
        ci_lo, ci_hi = bootstrap_diff_ci(treat, ctrl, paired, rng)
        raw_ps.append(p_raw)
        entries.append(
            {
                "hypothesis": name,
                "registration": status_tag,
                "n_seeds_per_arm": len(treat),
                "test": "paired_sign_flip_permutation" if paired else "two_sample_permutation",
                "treatment_median": float(np.median(treat)),
                "control_median": float(np.median(ctrl)),
                "treatment_mean": float(np.mean(treat)),
                "control_mean": float(np.mean(ctrl)),
                "diff_mean": float(np.mean(treat) - np.mean(ctrl)),
                "diff_ci95_low": ci_lo,
                "diff_ci95_high": ci_hi,
                "cliffs_delta": cliffs_delta(treat, ctrl),
                "cohens_d": cohens_d_paired(treat, ctrl) if paired else cohens_d_two_sample(treat, ctrl),
                "p_raw": p_raw,
            }
        )

    adj_ps = holm_bonferroni(raw_ps)
    for entry, p_adj in zip(entries, adj_ps, strict=True):
        entry["p_holm"] = p_adj

    return {
        "preregistration_file": "PREREGISTRATION.md",
        "stat_seed": STAT_SEED,
        "n_permutations": N_PERMUTATIONS,
        "n_bootstrap": N_BOOTSTRAP,
        "correction_method": "Holm-Bonferroni",
        "classification": "numerical_approximation",
        "hypotheses": entries,
    }


def write_outputs(repo_root: Path, rows: list[dict[str, Any]], summary: dict[str, Any]) -> None:
    out_dir = repo_root / "data" / "experiments"
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "per_seed_results.csv"
    json_path = out_dir / "stats_summary.json"

    fieldnames = list(rows[0].keys())
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    json_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8", newline="\n")

    # Write Build Standard B39 data/MANIFEST.sha256 (LF-normalized for cross-OS SHA-256 identity)
    data_dir = repo_root / "data"
    manifest_lines: list[str] = []
    for p in sorted(data_dir.rglob("*")):
        if p.is_file() and p.name != "MANIFEST.sha256":
            rel = p.relative_to(data_dir).as_posix()
            manifest_lines.append(f"{sha256_file(p)}  {rel}")
    (data_dir / "MANIFEST.sha256").write_text("\n".join(manifest_lines) + "\n", encoding="utf-8", newline="\n")


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    rows = run_rust_sweep(repo_root)
    summary = analyze_sweep(rows)
    write_outputs(repo_root, rows, summary)
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
