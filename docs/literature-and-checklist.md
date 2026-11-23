# Literature Search Log, NeurIPS-Style Reproducibility Checklist, Datasheet & Export-Control Screen

Prepared per the Defensible Independent AI Research Playbook (§2 items 6–8, §8 items 12, 13, 20, 34).

---

## 1. Date-Stamped Literature Search Log (2026-11-23)

| Domain | Databases & Venues Checked | Anchor Literature Verified (see `docs/citation-audit.json`) | Novelty Scope Statement |
|---|---|---|---|
| Synaptic bouton proteomics & ultrastructure | Crossref, PubMed, *Science*, *eLife*, *IJMS* | Wilhelm et al. (*Science* 2014), Yakoubi et al. (*eLife* 2019), Rollenhagen et al. (*IJMS* 2020; *eLife* 2024), Shapson-Coe et al. (*Science* 2024) | No biological novelty claimed; biophysical parameters explicitly anchored to primary peer-reviewed literature and separated by species (`F03`). |
| V-ATPase, microtubules, tau & axonal hitchhiking | Crossref, *Nature*, *Science*, *Cell*, *Nature Neurosci.* | Wang et al. (*Nature* 2024), Kellogg et al. (*Science* 2018), Liao et al. (*Cell* 2019), De Pace et al. (*Nat. Neurosci.* 2024) | Formalizes exact algebraic consequences (kinesin-1 ATP stoichiometry, resting leak ceilings) rather than claiming new cryo-EM structures. |
| Exocytosis, nanocolumns, bioenergetics & DNA-PAINT/RESI | Crossref, *Nature*, *Cell*, *Sci. Adv.*, *JACS*, *J. Physiol.* | Hodgkin & Huxley (1952), Jahr & Stevens (1990), Watanabe et al. (2013), Rangaraju et al. (2014), Tang et al. (2016), Xu et al. (2016), Milovanovic et al. (2018), Dong et al. (2019), Pulido & Ryan (2021), Reinhardt et al. (2023) | To our knowledge, first pure zero-Mathlib Lean 4.35.0 multi-kernel formalization pairing these 6 biophysical invariant classes with a 50-digit differential oracle and pre-registered Monte Carlo suite. |
| Consciousness indicators & decoherence bounds | Crossref, *Nature*, *Phys. Rev. E*, *J. Conscious. Stud.* | Chalmers (1995), Tegmark (2000), Cogitate Consortium (*Nature* 2025) | Explicitly disclaims solving the Hard Problem or proving/detecting sentience; formalizes only discrete bipartite coupling determinants (`T17`–`T18`). |

- **Live Citation & Retraction Audit:** `scripts/verify_citations.py` verified all **23/23** references in `papers/references.bib` live against Crossref (`docs/citation-audit.json`: `23/23 verified`, `0 retracted`, `0 HTTP errors`).

---

## 2. NeurIPS-Style Reproducibility & Integrity Checklist

| Item | Answer | Evidence |
|---|---|---|
| Are headline theoretical claims explicitly stated with full assumptions and limitations? | **Yes** | `CLAIMS.md`, `LIMITATIONS.md`, `lean/Challenge.lean`, White Papers 1 & 2 |
| Are all formal proofs machine-checked with zero `sorry` / custom axioms? | **Yes** | `lean/Solution.lean`, `lean/VerifyAxioms.lean`, `docs/lean-axioms-report.txt`, 6 kernels in CI |
| Are empirical hypotheses pre-registered before simulation runs, with deviations logged? | **Yes** | `PREREGISTRATION.md` (committed `a1919f2`), `DEVIATIONS.md` (H3 refuted, H3b exploratory) |
| Are negative results, nulls, and limitations reported with equal prominence? | **Yes** | H3 (`40 Hz`) refutation reported in `README.md`, `CLAIMS.md`, `ERRATA.md`, and White Paper 1 |
| Are all random seeds, sample sizes, confidence intervals, and multiple-comparison corrections reported? | **Yes** | Seeds `1000..1029` & `2000..2029` (`N=30`/arm), 10,000 permutations, 95% bootstrap CIs, Holm–Bonferroni (`data/experiments/stats_summary.json`) |
| Are code, lockfiles, container spec, and checksums openly archived? | **Yes** | Apache-2.0 / CC-BY-4.0, `Cargo.lock`, `uv.lock`, `package-lock.json`, `Dockerfile`, `MANIFEST.sha256`, SWHID |
| Is AI assistance transparently disclosed with human CRediT roles and zero AI authorship? | **Yes** | White Papers 1 & 2, `lean/formalization.yaml`, `CITATION.cff`, `README.md` |
| Has an external, unaffiliated human reproduced the build and peer-reviewed the papers? | **No (Explicitly Disclosed)** | Clean-clone reproduction verified on fresh local checkout and public GitHub Actions (`ubuntu`/`macos`/`windows`); external peer review and independent third-party human replication remain open (`REPLICATION.md`). |

---

## 3. Datasheet Summary for Simulated Experimental Dataset (`data/experiments/`)

- **Dataset:** `data/experiments/per_seed_results.csv` (30 paired simulation rows) and `data/experiments/stats_summary.json`.
- **Motivation & Creation:** Created deterministically on 2026-11-23 by `synapse-sim sweep` (`ChaCha8Rng`, fixed seeds `1000..1029` and null control `2000..2029`) and `uv run synapse-stats` (`STAT_SEED=20261123`) to test pre-registered hypotheses `H1`–`H4` (plus exploratory `H3b`).
- **Composition & Privacy:** 100% synthetic computational biophysical outputs; zero human subjects, zero clinical records, zero PII.
- **Integrity & Licensing:** LF-normalized and SHA-256 pinned in `data/MANIFEST.sha256` and root `MANIFEST.sha256`; licensed under **CC-BY-4.0** (`docs/LICENSE-CONTENT.md`).

---

## 4. Export-Control & Regulatory Self-Screen (15 CFR 734.8 Fundamental Research)

- **Scope:** Publicly published, open-source fundamental computational neuroscience, biophysical simulation, and elementary algebraic Lean 4 proofs.
- **Assessment:** Contains zero cryptographic attack/offensive-cyber software, zero weapons/biological-agent synthesis protocols (botulinum/tetanus neurotoxins are discussed strictly at the textbook SNARE-cleavage molecular biology level citing Dong et al. *Annu. Rev. Biochem.* 2019), zero dual-use controlled technical data, and zero proprietary or restricted datasets.
- **Disclaimer:** This is a non-legal self-screen under the fundamental-research exclusion (15 CFR 734.8); legal classification ultimately rests with qualified counsel if commercialized or extended into regulated domains.
