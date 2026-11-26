# Peer Scrutiny, arXiv Endorsement & Independent Replication Outreach Kits (`v1.3.0`)

Ready-to-send templates following the **5-Sentence Outreach Protocol** (Defensible Independent AI Research Playbook Edition 1.3) and Build Standard B44. Replace bracketed recipient details before sending; never cold-mass-email.

---

## 1. Lean Zulip Technical Verification & Independent Replication Post

**Target Stream:** Lean Zulip (`#general` or `#Is there code for X?` / `formalized-biophysics` topic — https://leanprover.zulipchat.com/)

> **Subject:** Pure Lean 4.35.0 (zero-Mathlib, 6-kernel `lake comparator --paranoid`) biophysical invariants — requesting definition-fidelity review
>
> Hi everyone — I have published an open-source, pure Lean 4.35.0 formalization (`leanprover/lean4:v4.35.0`, zero Mathlib, `module` headers, **24 elementary & discrete-dynamical invariants** with explicit positive-domain guarantees + **26 non-vacuity witnesses** + **6 adversarial counterexample checks** in `AdversarialChecks.lean`) covering nanoscale synaptic bouton biophysics (Hill $n=4$ $\mathrm{Ca}^{2+}$ cooperativity & $n=4$ vs. $n=1$ crossover, fixed-point Tsodyks–Markram STP unit bounds, conductance-based KCC2 shunting inhibition, Jahr–Stevens NMDAR $\mathrm{Mg}^{2+}$ unblock monotonicity, structural-induction multi-step vesicle-pool conservation, clamped ATP store depletion & exact $t=3\,$s hitting time, V-ATPase resting leak rate bounds, kinesin-1 ATP stoichiometry, SNAREpin Syt1 clamping, RESI $1/\sqrt{N\cdot K}$ variance, and $2\times 2$ weight-table algebraic factorization bounds with a common-cause counterexample):
>
> - **Repo (`v1.3.0`, Apache-2.0):** https://github.com/0thernes/human-synapse-bouton-lab
> - **Interactive Lean 4 Proof Blueprint & SVG DAG:** https://0thernes.github.io/human-synapse-bouton-lab/blueprint/
> - **Repository 6-Kernel CI (`lake comparator --paranoid`, 12/12 GREEN):** https://github.com/0thernes/human-synapse-bouton-lab/actions/runs/45747272478 (all 6 kernels accept `Solution.lean`; zero `sorry`, zero `Classical.choice`, zero `_native`)
> - **Zenodo Concept DOI (always latest):** `10.5281/zenodo.24477927` · **`v1.3.0` Version DOI:** `10.5281/zenodo.24548051`
> - **Software Heritage Prior Snapshot SWHID (`v1.2.0`):** `swh:1:snp:8ef70f745fae4f91f040720b28e21560c73deffc`
>
> **Explicitly NOT proved in Lean:** 4D Hodgkin–Huxley float64 RK4 trajectories, 3D Brownian PDEs, interventional causal graphs (counterexample `A05` proved in `AdversarialChecks.lean`), or any claim regarding phenomenal consciousness (all numerical/stochastic components are tagged `numerical_approximation` and cross-checked against a 50-digit Python `mpmath` oracle).
>
> **Concrete question:** Could anyone spot-check `lean/Challenge.lean`, `lean/NonVacuity.lean`, and `lean/AdversarialChecks.lean` for any remaining definition-fidelity edge cases, or run `bash scripts/dev.sh test` on an independent machine to log an external replication in `REPLICATION.md`?

---

## 2. Five-Sentence Specialist Email (arXiv Endorsement — `q-bio.NC` or `cs.LO`)

**Instructions:** Send only to a single researcher whose published paper is directly cited in `papers/references.bib` (e.g., an author of a quantitative synaptic bouton EM, nanocolumn, RESI, or formal-verification paper). Attach `dist/Donahue_2026_human_synaptic_bouton_verification.pdf`.

> **Subject:** Question on `[Specific Result in Their Paper]` + Lean 4.35.0 / 30-seed Monte Carlo verification (arXiv endorsement inquiry)
>
> Dear Prof. `[Last Name]`,
>
> 1. Your `[Year]` paper in *`[Journal]`* on `[specific finding, e.g., trans-synaptic nanocolumn alignment / human L1 cortical vesicle reserves / RESI Ångström localization]` served as a primary quantitative anchor for our new open-source biophysical verification framework, `human-synapse-bouton-lab` (`v1.3.0`).
> 2. We prove 24 elementary algebraic and discrete-dynamical invariants (Hill $n=4$ positive-domain noise floor $\le 1/82$ & $n=4$ vs. $n=1$ crossover, Tsodyks–Markram STP unit bounds, KCC2 shunting attenuation, NMDAR $\mathrm{Mg}^{2+}$ unblock monotonicity, structural-induction vesicle conservation, clamped positive ATP store depletion & exact $t=3\,$s hitting time, SNARE Syt1 barrier monotonicity, and RESI $1/\sqrt{NK}$ scaling) in pure Lean 4.35.0 with 26 concrete witnesses and 6 adversarial counterexamples verified by 6 independent kernels in CI, paired with a 50-digit `mpmath` cross-language differential oracle (`0/1,000` mismatches) and a pre-registered 30-seed Monte Carlo sweep confirming nanocolumn/nanodomain gains ($p_{\text{Holm}}=0.0005$) while honestly refuting our own pre-registered 40 Hz mitochondrial sustainability hypothesis ($f_{\text{crit,mito}}=29.56\,$Hz); we explicitly do *not* claim 3D Brownian PDE proofs, pure-mathematics novelty, or solved grand open problems (`0/1,900` Mega-Atlas solved).
> 3. Every artifact is archived with full cryptographic provenance: public 12/12 GitHub CI + SLSA v4 release (`https://github.com/0thernes/human-synapse-bouton-lab/releases/tag/v1.3.0`), CERN Zenodo DOI (`https://doi.org/10.5281/zenodo.24548051`, Concept DOI `10.5281/zenodo.24477927`), DigiCert RFC 3161 + OpenTimestamps manifest timestamps, Croissant 1.0 dataset metadata, and a live 23/23 Crossref citation audit (`docs/citation-audit.json`).
> 4. I have attached the 8-page zero-warning preprint (with a Statement Fidelity Audit on p. 4); our interactive workbench is live at `https://0thernes.github.io/human-synapse-bouton-lab/` and our interactive Lean 4 Proof Blueprint DAG is live at `https://0thernes.github.io/human-synapse-bouton-lab/blueprint/`.
> 5. Would you be willing to glance at Table 2 to let me know whether our `[specific parameter/convention]` faithfully matches your convention—and, if you find the work technically sound, would you consider endorsing my first arXiv `q-bio.NC` submission (`endorsement code: [INSERT CODE]`)?
>
> Thank you for your time,  
> Alexander Stephen Donahue  
> Independent Researcher, Spokane, WA, USA  
> ORCID: https://orcid.org/0009-0006-8168-9648 · `0_0@0thernes.art`

---

## 3. Peer Community In (PCI Neuroscience) & PREreview Submission Blurb

- **PREreview (Open Preprint Review Request):** https://prereview.org/ (paste Zenodo DOI `10.5281/zenodo.24548051` or `10.5281/zenodo.24477927` to request structured community peer review).
- **Peer Community In — Neuroscience / Mathematical & Computational Biology:** https://neuro.peercommunityin.org/ (free, open, diamond-OA peer review by ≥2 domain researchers; accepts Zenodo DOI `10.5281/zenodo.24548051`).

**Cover Summary (copy-paste ready):**
> `human-synapse-bouton-lab` (`v1.3.0`, Apache-2.0 code / CC-BY-4.0 manuscripts & data, Zenodo DOI `10.5281/zenodo.24548051`) is an independent, transparently AI-assisted computational neuroscience verification workbench and dual zero-warning white-paper preprint. It pairs 24 pure Lean 4.35.0 elementary algebraic and discrete-dynamical biophysical invariants (26 concrete witnesses + 6 adversarial counterexample checks, accepted by 6 independent kernels via `lake comparator --paranoid` in repository CI `#45747272478`, zero `sorry`, zero `Classical.choice`) with a 50-digit `mpmath` cross-language differential oracle (`0` mismatches across 1,000 random inputs in TypeScript & Rust), a 30-seed pre-registered Monte Carlo experiment (including an honestly reported refutation of pre-registered H3 at 40 Hz), a live 23/23 Crossref citation audit (0 retractions), an interactive Lean Proof Blueprint DAG (`/blueprint/`), and a companion 11-discipline open-problems monograph with an honest 1,900-problem Mega-Atlas crosswalk (`0/1,900` solved). We welcome adversarial referee scrutiny of both our Lean statement fidelity and our pre-registered biophysical simulations.

---

## 4. Independent Replication Invitation (Build Standard B44)

Anyone can replicate from scratch and file a public replication report (pass or fail) using our pre-built GitHub Issue form:
- **Replication Issue Form:** https://github.com/0thernes/human-synapse-bouton-lab/issues/new?template=replication.yml
- **Protocol:** [`REPLICATION.md`](../REPLICATION.md) (one-command clean-clone check via `bash scripts/dev.sh setup && bash scripts/dev.sh build && bash scripts/dev.sh test` or `docker build .`).
