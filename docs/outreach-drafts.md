# Peer Scrutiny, arXiv Endorsement, Palomar & Independent Replication Outreach Kits

Ready-to-send templates following the **5-Sentence Outreach Protocol** (Independent Scientist's Verification Playbook §Step 5) and Build Standard B44. Replace bracketed recipient details before sending; never cold-mass-email.

---

## 1. Lean Zulip Technical Verification & Independent Replication Post

**Target Stream:** Lean Zulip (`#general` or `#Is there code for X?` / `formalized-biophysics` topic — https://leanprover.zulipchat.com/)

> **Subject:** Pure Lean 4.35.0 (zero-Mathlib, 6-kernel `lake comparator --paranoid`) biophysical invariants — requesting definition-fidelity review
>
> Hi everyone — I have published an open-source, pure Lean 4.35.0 formalization (`leanprover/lean4:v4.35.0`, zero Mathlib, Palomar `module` headers, 18 theorems + 19 non-vacuity witnesses) of exact algebraic invariants in nanoscale synaptic bouton biophysics (Hill $n=4$ $\mathrm{Ca}^{2+}$ cooperativity, conductance-based KCC2 shunting inhibition, vesicle-pool conservation, V-ATPase resting leak ceilings, kinesin-1 ATP stoichiometry, SNAREpin Syt1 clamping, RESI $1/\sqrt{N\cdot K}$ variance, and discrete bipartite coupling bounds):
>
> - **Repo (`v1.1.0`, Apache-2.0):** https://github.com/0thernes/human-synapse-bouton-lab (commit `a0fc8f9919139c4a8957c5d9dbbe3e8de39985a8`)
> - **6-Kernel CI (`lake comparator --paranoid`):** https://github.com/0thernes/human-synapse-bouton-lab/actions/runs/45234241381 (all 6 kernels accept `Solution.lean`; zero `sorry`, zero `Classical.choice`)
> - **Zenodo DataCite DOI:** `10.5281/zenodo.24477928` (concept DOI: `10.5281/zenodo.24477927`, https://zenodo.org/records/24477928)
- **Software Heritage SWHID:** `swh:1:snp:458adcd73c9a78054486147094950e2be6774271`
>
> **Explicitly NOT proved in Lean:** 4D Hodgkin–Huxley float64 RK4 trajectories, 3D Brownian PDEs, or any claim regarding phenomenal consciousness (all numerical/stochastic components are tagged `numerical_approximation` and cross-checked against a 50-digit Python `mpmath` oracle).
>
> **Concrete question:** Could anyone spot-check `lean/Challenge.lean` and `lean/NonVacuity.lean` for any subtle vacuous hypothesis or convention mismatch before I finalize my Palomar Registry entry, or run `bash scripts/dev.sh test` on an independent machine to log an external replication in `REPLICATION.md`?

---

## 2. Five-Sentence Specialist Email (arXiv Endorsement — `q-bio.NC` or `cs.LO`)

**Instructions:** Send only to a single researcher whose published paper is directly cited in `papers/references.bib` (e.g., an author of a quantitative synaptic bouton EM, nanocolumn, RESI, or formal-verification paper). Attach `dist/Donahue_2026_human_synaptic_bouton_verification.pdf`.

> **Subject:** Question on `[Specific Result in Their Paper]` + Lean 4.35.0 / 30-seed Monte Carlo verification (arXiv endorsement inquiry)
>
> Dear Prof. `[Last Name]`,
>
> 1. Your `[Year]` paper in *`[Journal]`* on `[specific finding, e.g., trans-synaptic nanocolumn alignment / human L1 cortical vesicle reserves / RESI Ångström localization]` served as a primary quantitative anchor for our new open-source biophysical verification framework, `human-synapse-bouton-lab` (`v1.1.0`).
> 2. We prove 18 exact algebraic invariants (Hill $n=4$ noise floor $\le 1/82$, KCC2 shunting attenuation, rat-374 vs. human-3,500 vesicle conservation, resting V-ATPase leak ceilings, SNARE Syt1 barrier monotonicity, and RESI $1/\sqrt{NK}$ scaling) in pure Lean 4.35.0 verified by 6 independent kernels, paired with a 50-digit `mpmath` cross-language differential oracle (`0/1,000` mismatches) and a pre-registered 30-seed Monte Carlo sweep that confirms nanocolumn/nanodomain gains ($p_{\text{Holm}}=0.0005$) while honestly refuting our own pre-registered 40 Hz mitochondrial sustainability hypothesis ($f_{\text{crit,mito}}=29.56\,$Hz); we explicitly do *not* claim 3D Brownian PDE proofs or peer-reviewed biological novelty.
> 3. Every artifact is archived with full cryptographic provenance: public GitHub CI + SLSA release (`https://github.com/0thernes/human-synapse-bouton-lab/releases/tag/v1.1.0`), Software Heritage snapshot (`swh:1:snp:458adcd73c9a78054486147094950e2be6774271`), DigiCert RFC 3161 manifest timestamp, and live 23/23 Crossref citation audit (`docs/citation-audit.json`).
> 4. I have attached the 8-page preprint (with a 1-page Statement Fidelity Table on p. 4) and our standalone interactive workbench is live at `https://0thernes.github.io/human-synapse-bouton-lab/`.
> 5. Would you be willing to glance at Table 2 to let me know whether our `[specific parameter/convention]` faithfully matches your convention—and, if you find the work technically sound, would you consider endorsing my first arXiv `q-bio.NC` submission (`endorsement code: [INSERT CODE]`)?
>
> Thank you for your time,  
> Alexander Stephen Donahue  
> Independent Researcher, Spokane, WA, USA  
> ORCID: https://orcid.org/0009-0006-8168-9648 · `0_0@0thernes.art`

---

## 3. Peer Community In (PCI Neuroscience) & PREreview Submission Blurb

- **PREreview (Open Preprint Review Request):** https://prereview.org/ (once a Zenodo DOI or arXiv ID is minted, paste the DOI to request structured community peer review).
- **Peer Community In — Neuroscience / Mathematical & Computational Biology:** https://neuro.peercommunityin.org/ (free, open, diamond-OA peer review by ≥2 domain researchers; requires a public preprint DOI such as Zenodo or bioRxiv/arXiv).

**Cover Summary (copy-paste ready):**
> `human-synapse-bouton-lab` (`v1.1.0`, Apache-2.0 code / CC-BY-4.0 manuscripts & data) is an independent, transparently AI-assisted computational neuroscience verification workbench and dual white-paper preprint. It pairs 18 pure Lean 4.35.0 algebraic biophysical theorems (accepted by 6 independent kernels via `lake comparator --paranoid`, zero `sorry`, zero `Classical.choice`) with a 50-digit `mpmath` cross-language differential oracle (`0` mismatches across 1,000 random inputs in TypeScript & Rust), a 30-seed pre-registered Monte Carlo experiment (including an honestly reported refutation of pre-registered H3 at 40 Hz), a live 23/23 Crossref citation audit (0 retractions), and a companion 11-discipline open-problems monograph explicitly demarcating formal bounds from unresolved empirical and philosophical gaps. We welcome adversarial referee scrutiny of both our Lean statement fidelity and our pre-registered biophysical simulations.

---

## 4. Independent Replication Invitation (Build Standard B44)

Anyone can replicate from scratch and file a public replication report (pass or fail) using our pre-built GitHub Issue form:
- **Replication Issue Form:** https://github.com/0thernes/human-synapse-bouton-lab/issues/new?template=replication.yml
- **Protocol:** [`REPLICATION.md`](../REPLICATION.md) (one-command clean-clone check via `bash scripts/dev.sh setup && bash scripts/dev.sh build && bash scripts/dev.sh test` or `docker build .`).
