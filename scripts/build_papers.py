#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""Compile both AMS-LaTeX white papers with Tectonic and verify standalone arXiv source tarballs."""

from __future__ import annotations

import hashlib
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

PAPERS = [
    (
        "wp1_synaptic_bouton",
        "Donahue_2026_human_synaptic_bouton_verification.pdf",
        "arxiv_wp1_synaptic_bouton.tar.gz",
        [
            "fig1_nanoscale_architecture.pdf",
            "fig2_electrophysiology_hodgkin_huxley.pdf",
            "fig3_snare_bioenergetics_metrology.pdf",
            "fig4_preregistered_monte_carlo.pdf",
        ],
    ),
    (
        "wp2_open_problems_consciousness",
        "Donahue_2026_open_hard_problems_consciousness_frontier.pdf",
        "arxiv_wp2_open_problems_consciousness.tar.gz",
        ["fig5_open_problems_consciousness_map.pdf"],
    ),
]


def find_tectonic() -> str:
    found = shutil.which("tectonic")
    if found:
        return found
    win_default = Path.home() / ".local" / "bin" / "tectonic.exe"
    if win_default.exists():
        return str(win_default)
    raise RuntimeError("tectonic executable not found on PATH or in ~/.local/bin")


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    dist_dir = repo_root / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)
    tec = find_tectonic()

    for folder, pdf_name, tar_name, figs in PAPERS:
        wp_dir = repo_root / "papers" / folder
        build_dir = wp_dir / "build"
        build_dir.mkdir(parents=True, exist_ok=True)

        print(f"=== Compiling {folder} ===")
        proc = subprocess.run(
            [tec, "-X", "compile", "main.tex", "--outdir", "build", "--keep-intermediates"],
            cwd=wp_dir,
            capture_output=True,
            text=True,
        )
        print(proc.stdout)
        if proc.stderr.strip():
            print(proc.stderr)
        if proc.returncode != 0:
            raise RuntimeError(f"Tectonic failed on {folder} (exit {proc.returncode})")

        pdf_out = dist_dir / pdf_name
        shutil.copy2(build_dir / "main.pdf", pdf_out)

        tex = (wp_dir / "main.tex").read_text(encoding="utf-8")
        tex_flat = tex.replace("../figures/", "").replace("../references", "references")
        bbl = (build_dir / "main.bbl").read_text(encoding="utf-8")

        with tempfile.TemporaryDirectory() as td:
            tdir = Path(td)
            (tdir / "out").mkdir()
            (tdir / "main.tex").write_text(tex_flat, encoding="utf-8")
            (tdir / "main.bbl").write_text(bbl, encoding="utf-8")
            shutil.copy2(repo_root / "papers" / "references.bib", tdir / "references.bib")
            for f in figs:
                shutil.copy2(repo_root / "papers" / "figures" / f, tdir / f)
            verify = subprocess.run(
                [tec, "-X", "compile", "main.tex", "--outdir", "out"],
                cwd=tdir,
                capture_output=True,
                text=True,
            )
            if verify.returncode != 0:
                raise RuntimeError(f"Standalone arXiv tarball compile failed for {folder}:\n{verify.stdout}\n{verify.stderr}")
            tar_path = dist_dir / tar_name
            with tarfile.open(tar_path, "w:gz") as tf:
                for item in ["main.tex", "main.bbl", "references.bib", *figs]:
                    tf.add(tdir / item, arcname=item)
            print(f"VERIFIED standalone arXiv tarball: {tar_path.name} ({tar_path.stat().st_size / 1024:.1f} KB)")

    # Write SHA256SUMS for dist/
    sums: list[str] = []
    for p in sorted(dist_dir.iterdir()):
        if p.is_file() and p.name != "SHA256SUMS":
            digest = hashlib.sha256(p.read_bytes()).hexdigest()
            sums.append(f"{digest}  {p.name}")
    (dist_dir / "SHA256SUMS").write_text("\n".join(sums) + "\n", encoding="utf-8")
    print("\n=== dist/SHA256SUMS ===")
    print("\n".join(sums))
    return 0


if __name__ == "__main__":
    sys.exit(main())
