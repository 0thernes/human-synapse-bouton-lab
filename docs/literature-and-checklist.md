# Literature Search Log, NeurIPS-Style Reproducibility Checklist, Datasheet & Export-Control Screen

Prepared per the Defensible Independent AI Research Playbook (§2 items 6–8, §8 items 12, 13, 20, 34). Updated for `v1.4.0` (2026-11-26).

---

## 1. Date-Stamped Literature Search Log (2026-11-23; Repaired & Expanded 2026-11-26)

| Domain | Databases & Venues Checked | Anchor Literature Verified (see `docs/citation-audit.json`) | Novelty & Species Scope Statement |
|---|---|---|---|
| Synaptic bouton proteomics & ultrastructure | Crossref, PubMed, *Science*, *eLife*, *IJMS* | Wilhelm et al. (*Science* 2014), Yakoubi et al. (*eLife* 2019), Rollenhagen et al. (*IJMS* 2020; *eLife* 2025 `RP99473`), Shapson-Coe et al. (*Science* 2024) | No biological novelty claimed. Rat (`374`) and human L1/L4/L5 (`3,500`/`1,800`/`1,500`) vesicle counts are separated (`F03`); vesicle lipid composition is explicitly attributed to *Narcine brasiliensis* electric organ (Deutsch & Kelly 1981); ATP and SNARE constants are illustrative model parameters. |
| V-ATPase, microtubules, tau & axonal hitchhiking | Crossref, *Nature*, *Science*, *Cell*, *Nature Neurosci.* | Coupland et al. (*Science* 2024, rat brain SVs, cholesterol-decorated $V_0$ rotor & loading-coupled $V_1$ dissociation), Wang et al. (*Nature* 2024, mouse SVs, `EMD-44847`, V-ATPase–synaptophysin interface), Kellogg et al. (*Science* 2018), Liao et al. (*Cell* 2019), De Pace et al. (*Nat. Neurosci.* 2024) | Coupland 2024 and Wang 2024 are strictly separated (`F36`); formalizes exact arithmetic/monotonicity consequences rather than claiming new cryo-EM structures. |
| Exocytosis, nanocolumns, bioenergetics, pharmacology & DNA-PAINT/RESI | Crossref, *Nature*, *Cell*, *Sci. Adv.*, *JACS*, *J. Physiol.*, *J. Neurosci.*, *Neural Comput.*, *NEJM* | Hodgkin & Huxley (1952), Dodge & Rahamimoff (1967), Jahr & Stevens (1990), Naraghi & Neher (1997), Tsodyks et al. (1998), Brown et al. (2010), Watanabe et al. (2013), Rangaraju et al. (2014), Tang et al. (2016), Xu et al. (2016, `10.1021/jacs.5b13107`), Milovanovic et al. (2018), Dong et al. (2019), Pulido & Ryan (2021), Reinhardt et al. (2023) | No novelty claimed: Lean lemmas are elementary known facts about the repository's own model formulas; primary sources added in `v1.4.0` for Hill $n=4$ (`dodge1967calcium`), STP (`tsodyks1998dynamic`), linearized $\mathrm{Ca}^{2+}$ buffering (`naraghi1997buffered`), and general anesthesia (`brown2010anesthesia`). |
| Consciousness indicators, decoherence & prior formal science | Crossref, *Nature*, *Phys. Rev. E*, *Digital Discovery*, *J. Conscious. Stud.* | Chalmers (1995), Tegmark (2000), Bobbin et al. (*Digital Discovery* 2024), Cogitate Consortium (*Nature* 2025) | Explicitly disclaims solving the Hard Problem or proving/detecting sentience; formalizes only elementary $2\times 2$ integer determinant facts (`T22`–`T24`, withdrawn from `NEURO-004`). |

- **Related prior formalization work (cited in White Paper 1 & `lean/formalization.yaml`):** Lean 4 formalization of Hill-kinetic gene-regulatory circuits ([marpaia/grn-lean](https://github.com/marpaia/grn-lean)); Bobbin et al., "Formalizing chemical physics using the Lean theorem prover", *Digital Discovery* 3(2):264–280 (2024), `doi:10.1039/D3DD00077J`; and "Modelling and Verifying Neuronal Archetypes in Rocq", `arXiv:2505.05362`.
- **Upgraded Live Citation Audit (`v1.4.0`, `C13`):** `scripts/verify_citations.py` parses `papers/references.bib` with a brace-balanced parser and verifies **28/28 DOI-bearing entries** live against Crossref for HTTP 200, normalized title Jaccard (`>= 0.88`), first-author surname, publication year, and `updated-by` Retraction Watch status (`0` mismatched, `0` retracted; 1 non-retraction publisher correction notice recorded on Wang 2024), plus **1 non-DOI metadata-checked entry** (`chalmers1995facing`, total 29; `docs/citation-audit.json`), backed by negative unit tests in `python/tests/test_citations.py`.

---

## 2. NeurIPS-Style Reproducibility & Integrity Checklist

| Item | Answer | Evidence |
|---|---|---|
| Are headline theoretical claims explicitly stated with full assumptions and limitations? | **Yes** | `CLAIMS.md`, `LIMITATIONS.md`, `lean/Challenge.lean`, White Papers 1 & 2 |
| Are all formal proofs machine-checked with zero `sorry`, zero unused hypotheses & enforced zero `Classical.choice`? | **Yes** | `lean/Solution.lean`, `lean/VerifyAxioms.lean`, `lean/comparator.json`, `lean/ExportVectors.lean`, `docs/lean-axioms-report.txt`, 6 kernels in CI |
| Are empirical hypotheses pre-registered before simulation runs, with deviations logged? | **Partly** | `PREREGISTRATION.md` (committed `a1919f2`; hypotheses, seeds, and statistics fixed, illustrative model constants set in code after registration; evidenced by git dates only), `DEVIATIONS.md` (H3 prediction fails in the simulator, H3b exploratory) |
| Are negative results, nulls, and limitations reported with equal prominence? | **Yes** | H3 (`40 Hz`) failure in the fixed-parameter simulator reported in `README.md`, `CLAIMS.md`, `ERRATA.md`, and White Paper 1 |
| Are all random seeds, sample sizes, confidence intervals, and multiple-comparison corrections reported? | **Yes** | Seeds `1000..1029` & `2000..2029` (`N=30`/arm), 10,000 permutations, 95% bootstrap CIs, Holm–Bonferroni (`data/experiments/stats_summary.json`) |
| Are code, lockfiles, container spec, and checksums openly archived? | **Yes** | Apache-2.0 / CC-BY-4.0, `Cargo.lock`, `uv.lock`, `package-lock.json`, `Dockerfile`, `MANIFEST.sha256`, SWHID |
| Is AI assistance transparently disclosed with human CRediT roles and zero AI authorship? | **Yes** | White Papers 1 & 2, `docs/AI_DISCLOSURE.md`, `lean/formalization.yaml`, `CITATION.cff`, `README.md` |
| Has an external, unaffiliated human reproduced the build and peer-reviewed the papers? | **No (Explicitly Disclosed)** | Clean-clone reproduction verified on fresh local checkout and public GitHub Actions (`ubuntu`/`macos`/`windows`); external peer review and independent third-party human replication remain open (`REPLICATION.md`). |

---

## 3. Datasheet Summary for Simulated Experimental Dataset (`data/experiments/`)

- **Dataset:** `data/experiments/per_seed_results.csv` (30 paired simulation rows), `data/experiments/stats_summary.json`, and `data/lean_engine_vectors.json`.
- **Motivation & Creation:** Created deterministically by `synapse-sim sweep` (`ChaCha8Rng`, fixed seeds `1000..1029` and null control `2000..2029`), `uv run synapse-stats` (`STAT_SEED=20261123`), and `lean/ExportVectors.lean`.
- **Composition & Privacy:** 100% synthetic computational biophysical outputs; zero human subjects, zero clinical records, zero PII.
- **Integrity & Licensing:** LF-normalized and SHA-256 pinned in `data/MANIFEST.sha256`, `croissant.json`, and root `MANIFEST.sha256`; licensed under **CC-BY-4.0** (`docs/LICENSE-CONTENT.md`).

---

## 4. Export-Control & Regulatory Self-Screen (15 CFR 734.8 Fundamental Research)

- **Scope:** Publicly published, open-source fundamental computational neuroscience, biophysical simulation, and elementary algebraic Lean 4 proofs.
- **Assessment:** Contains zero cryptographic attack/offensive-cyber software, zero weapons/biological-agent synthesis protocols (botulinum/tetanus neurotoxins are discussed strictly at the textbook SNARE-cleavage molecular biology level citing Dong et al. *Annu. Rev. Biochem.* 2019), zero dual-use controlled technical data, and zero proprietary or restricted datasets.
- **Disclaimer:** This is a non-legal self-screen under the fundamental-research exclusion (15 CFR 734.8); legal classification ultimately rests with qualified counsel if commercialized or extended into regulated domains.
