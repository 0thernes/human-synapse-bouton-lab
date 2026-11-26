// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

export type Discipline11 =
  | 'Math'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Neuroscience'
  | 'Neuropsychology'
  | 'NeuroCS'
  | 'NeuroMath'
  | 'Neurochemistry'
  | 'Neurobiology'
  | 'Neurophysics';

export type EpistemicStatus =
  | 'kernel-checked-partial'
  | 'computationally-bounded'
  | 'empirically-constrained'
  | 'open-hard-problem';

export type ReasoningMode = 'deductive' | 'inductive' | 'abductive' | 'epistemic-barrier';

export type FindingClass = 'bug' | 'error' | 'issue' | 'problem' | 'dilemma' | 'conflict';

export interface OpenHardProblem {
  id: string;
  discipline: Discipline11;
  title: string;
  formalStatement: string;
  ourProgress: string;
  leanOrCodeAnchor: string;
  epistemicStatus: EpistemicStatus;
  falsificationCriterion: string;
  remainingGap: string;
}

export interface ConsciousnessClue {
  id: string;
  mode: ReasoningMode;
  domain: string;
  proposition: string;
  evidenceOrProof: string;
  whatIsNotClaimed: string;
}

export interface ClassifiedFinding {
  id: string;
  findingClass: FindingClass;
  title: string;
  description: string;
  resolution: string;
  status: 'resolved' | 'accepted-limitation' | 'open-owner-decision';
}

export interface ForensicAuditHotspot {
  id: number;
  xPct: number;
  yPct: number;
  severity: 'critical' | 'scale' | 'frontier' | 'accurate';
  title: string;
  defectInNaiveVisuals: string;
  biophysicalCorrection: string;
  literatureAnchor: string;
}

export const OPEN_HARD_PROBLEMS: readonly OpenHardProblem[] = [
  {
    id: 'OP-MATH-01',
    discipline: 'Math',
    title: 'Discrete Particle Reaction-Diffusion vs. Continuum PDE Convergence at N < 100 Ca2+ Ions',
    formalStatement: 'Quantify exact L1 error bounds between discrete 3D Brownian chemical master equation trajectories and Smoluchowski continuum PDEs inside 17 nm active-zone nanodomains.',
    ourProgress: 'Proved exact rational Hill n=4 monotonicity, resting noise floor (<= 1/82 at c <= Kd/3), and 8.5x doubling ultrasensitivity in Lean 4.35.0; built 30-seed Rust/Python Monte Carlo comparator.',
    leanOrCodeAnchor: 'lean/Solution.lean (hill4_*); rust/synapse-sim',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if discrete 3D Brownian MCell4 solver diverges qualitatively from the Hill n=4 monotonic ordering under matched active-zone geometry.',
    remainingGap: 'Full 3D meshed Smoluchowski-to-master-equation Wasserstein convergence theorem remains open.',
  },
  {
    id: 'OP-PHYS-01',
    discipline: 'Physics',
    title: 'Thermal Decoherence vs. Classical Stochastic Thermodynamics in Warm Wet Boutons (310.15 K)',
    formalStatement: 'Determine whether any coherent quantum degrees of freedom in microtubules or ion channels survive longer than femtosecond-to-picosecond thermal decoherence at k_B T = 4.282 pN*nm and Debye length 0.79 nm.',
    ourProgress: 'Verified exact thermal energy k_B T = 4.282 pN*nm and classical ATP energetic dissipation bounds in Lean 4 + exact mpmath oracle; separated verified thermal physics from speculative quantum-consciousness claims.',
    leanOrCodeAnchor: 'packages/synapse-core/src/electrophysiology.ts; papers/wp2_open_problems_consciousness',
    epistemicStatus: 'empirically-constrained',
    falsificationCriterion: 'Classical-only hypothesis would be falsified by reproducible direct spectroscopic observation of millisecond-scale physiological quantum coherence driving synaptic exocytosis at 310 K.',
    remainingGap: 'Nanoscale proton-wire Grotthuss tunneling rates along hydrated cleft interfaces (IJMS 2026) still lack atomic-time-resolved in situ measurement.',
  },
  {
    id: 'OP-CHEM-01',
    discipline: 'Chemistry',
    title: 'Atomic-Resolution Hemifusion Stalk Catalysis & Cholesterol-Lubricated V-ATPase V1 Dissociation',
    formalStatement: 'Resolve the exact free-energy pathway by which 33.3 mol% cholesterol + DHA-22:6 acyl chains and 3-6 SNAREpins lower the 28 k_B T hydration barrier within < 1 ms, and how glutamate fullness triggers V1 uncoupling.',
    ourProgress: 'Formalized SNAREpin copy-number cooperativity and Syt1 5-Ca2+ Complexin clamp relief monotonicity in Lean 4.35.0; implemented exact PMF and reaction-coordinate solver.',
    leanOrCodeAnchor: 'lean/Solution.lean (snare_*); packages/synapse-core/src/snare.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if DNA-origami SNARE ring assays show barrier height increasing with functional SNAREpin copy number from 1 to 6.',
    remainingGap: 'All-atom quantum-mechanical / polarizable MD simulation of lipid stalk water-bridge rupture over millisecond timescales remains computationally intractable.',
  },
  {
    id: 'OP-BIO-01',
    discipline: 'Biology',
    title: 'Evolutionary Scaling Laws of Human Cortical Boutons (2-3x Vesicle Reserves Over Rodents)',
    formalStatement: 'Explain why adult human temporal cortex L1/L4/L5 boutons maintain 1,500-3,500 synaptic vesicles and up to 50-contact high-strength axons (H01) despite steep resting V-ATPase H+-leak ATP costs.',
    ourProgress: 'Corrected rat-vs-human species conflation by adding explicit Human L1/L4/L5 presets (eLife 2019/2024; IJMS 2020) and proved exact vesicle pool conservation & resting leak headroom theorems in Lean 4.',
    leanOrCodeAnchor: 'lean/Solution.lean (vesicle_pool_transition_invariant, resting_leak_strictly_lowers_sustainable_rate)',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if comparative cross-primate 3D EM shows human L1 vesicle pools do not exceed rodent L5B pools under identical fixation protocols.',
    remainingGap: 'Direct causal linkage between enlarged human reserve pools and sustained multi-second working-memory firing remains empirically unclosed.',
  },
  {
    id: 'OP-NEURO-01',
    discipline: 'Neuroscience',
    title: 'Trans-Synaptic Nanocolumn Plasticity & Quantal Variability Scaling Across Cortical Layers',
    formalStatement: 'Determine how RIM1/2-Munc13 presynaptic release nanodomains dynamically realign across the 22 nm cleft with liquid-like PSD-95/AMPAR clusters (7,000-13,000/um^2) during LTP and sleep homeostasis.',
    ourProgress: 'Pre-registered (PREREGISTRATION.md) and executed 30-seed Monte Carlo control-vs-treatment experiment (0 nm aligned vs 80 nm misaligned) with permutation tests, Cliff delta, 95% bootstrap CIs, and Holm-Bonferroni correction.',
    leanOrCodeAnchor: 'PREREGISTRATION.md; python/synapse_science/stats_experiments.py',
    epistemicStatus: 'computationally-bounded',
    falsificationCriterion: 'Model prediction refuted if aligned (0 nm) vs misaligned (80 nm) arms fail Holm-adjusted p < 0.01 or 95% CI includes <= 0 pA.',
    remainingGap: 'In vivo live-human nanoscale tracking of trans-synaptic alignment during awake cognition is not yet technically feasible.',
  },
  {
    id: 'OP-NPSYCH-01',
    discipline: 'Neuropsychology',
    title: 'Cross-Scale Explanatory Bridge from Molecular Synaptopathies to Subjective Cognitive Deficits',
    formalStatement: 'Map how nanoscale failures (tau polymorphs, ANXA11/BORC mRNA hitchhiking loss, CaMKII autophosphorylation decay) causally produce human episodic memory loss, executive dysfunction, and altered phenomenology.',
    ourProgress: 'Cataloged primary clinical-molecular links (Alzheimer tau folds, Parkinson BLOC-1/BORC, ALS ANXA11, CaV3.1 epilepsy montelukast) and explicitly mapped the multi-scale causal blind spots in White Paper 2.',
    leanOrCodeAnchor: 'papers/wp2_open_problems_consciousness/main.tex',
    epistemicStatus: 'open-hard-problem',
    falsificationCriterion: 'A single-scale reductionist map is refuted whenever identical synaptic density loss yields divergent clinical cognitive trajectories across patients (cognitive reserve).',
    remainingGap: 'No validated quantitative transfer function maps single-bouton protein copy-number defects directly to first-person cognitive report.',
  },
  {
    id: 'OP-NCS-01',
    discipline: 'NeuroCS',
    title: 'Stochastic Biohybrid Synaptic Computation vs. Deterministic Von Neumann / GPU Precision',
    formalStatement: 'Characterize the information-per-joule Pareto frontier where stochastic unreliable biological synapses (~10.5k-20k ATP/vesicle cycle, P_r < 1) outperform deterministic digital weights in continuous learning.',
    ourProgress: 'Implemented deterministic cross-language biophysical kernels (TypeScript, Rust, Python exact oracle) + honest median/IQR benchmarks and proved exact bipartite causal coupling bounds.',
    leanOrCodeAnchor: 'rust/synapse-sim; docs/benchmarks.md; lean/Solution.lean (bipartiteCoupling)',
    epistemicStatus: 'computationally-bounded',
    falsificationCriterion: 'Bio-efficiency claim refuted if CMOS neuromorphic hardware achieves lower energy per synaptic plasticity event at equivalent dendritic integration complexity.',
    remainingGap: 'Real-time whole-cortex simulation at single-vesicle stochastic resolution (~10^14 synapses x 300,000 proteins) exceeds current exascale compute by >10^9x.',
  },
  {
    id: 'OP-NMATH-01',
    discipline: 'NeuroMath',
    title: 'Mechanized Formal Verification of Nonlinear Biophysical ODEs and Stochastic Master Equations',
    formalStatement: 'Close the gap between exact discrete algebraic invariants checked in Lean 4 and rigorous verified numerical enclosures (interval ODE integrators) for 4D Hodgkin-Huxley spiking trajectories.',
    ourProgress: 'Delivered 24 sorry-free, non-vacuous Lean 4.35.0 theorems (26 witnesses + 6 adversarial counterexample checks) replayed across 6 independent kernels (official kernel, leanchecker-paranoid, nanoda, lean4lean, con-leche, con-ron) + 50-digit mpmath oracle.',
    leanOrCodeAnchor: 'lean/Challenge.lean; lean/Solution.lean; lean/NonVacuity.lean; lean/AdversarialChecks.lean; python/synapse_science/oracle.py',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Any theorem refuted if any of the 6 independent kernels rejects the proof export or if differential testing finds a counterexample against the exact oracle.',
    remainingGap: 'Formalizing validated interval arithmetic for the full 4D Hodgkin-Huxley RK4 trajectory inside Lean 4 remains future work.',
  },
  {
    id: 'OP-NCHEM-01',
    discipline: 'Neurochemistry',
    title: 'Synapsin-1 Liquid-Liquid Phase Separation (LLPS) Dynamics & Hidden Resting Metabolic Load',
    formalStatement: 'Quantify the exact CaMKII phosphorylation threshold dispersing synapsin-1 vesicle condensates and the thermodynamic cost of maintaining resting V-ATPase proton gradients across 3,500 vesicles.',
    ourProgress: 'Proved exact ATP deficit depletion & resting V-ATPase leak headroom theorems in Lean 4; ran pre-registered 30-seed mitochondrial vs glycolysis-only depletion test (H3).',
    leanOrCodeAnchor: 'lean/Solution.lean (atp_deficit_strict_depletion); packages/synapse-core/src/bioenergetics.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if glycolysis alone sustains >90% bouton ATP under 40 Hz stochastic bursts over 60 s in H3 or in live axonal imaging (Rangaraju 2014).',
    remainingGap: 'Non-equilibrium phase-diagram equations for multicomponent synapsin/alpha-synuclein/vesicle condensates under physiological crowding remain unsolved.',
  },
  {
    id: 'OP-NBIO-01',
    discipline: 'Neurobiology',
    title: 'Meter-Scale Axonal Logistics, Microtubule Lattice Self-Repair & Lysosomal mRNA Hitchhiking',
    formalStatement: 'Determine how neurons coordinate kinesin-1 (8.0 nm/ATP, ~17 days/meter), dynein-dynactin retrograde clearance, tau envelopes, and ANXA11/BORC lysosomal mRNA hitchhiking without lethal traffic jams over 80+ years.',
    ourProgress: 'Formalized exact kinesin-1 step-ATP conservation (125,000 ATP/mm) in Lean 4; integrated tau longitudinal protofilament crest geometry (EMD-7769) and axonal logistics into workbench & White Paper 1.',
    leanOrCodeAnchor: 'lean/Solution.lean (kinesin_processive_atp_exact); packages/synapse-core/src/bioenergetics.ts',
    epistemicStatus: 'empirically-constrained',
    falsificationCriterion: 'Refuted if single-molecule optical trapping detects kinesin-1 stepping lengths deviating systematically from 8.0 nm/ATP along native 13-protofilament axonal microtubules.',
    remainingGap: 'How luminal microtubule particles (Cryo-ET 2024) regulate lattice self-repair and axonal transport mechanics remains unknown.',
  },
  {
    id: 'OP-NPHYS-01',
    discipline: 'Neurophysics',
    title: 'Sub-Nanometer Metrology, Shunting Inhibition Mechanics & Acid-Base Protonic Computation',
    formalStatement: 'Unify sub-nanometer RESI/DNA-PAINT receptor mapping, conductance-based shunting inhibition, and transient cleft acidification (pH microdomains) into a single coupled electro-diffusive physical theory.',
    ourProgress: 'Proved exact E/I reversal boundedness, strict KCC2 shunting attenuation, pure-shunting divisive identity, and RESI 1/(N*K) variance improvement in Lean 4.35.0; cross-validated across TS, Rust, and Python.',
    leanOrCodeAnchor: 'lean/Solution.lean (ei_*, shunting_*, resi_*); packages/synapse-core/src/metrology.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if mature KCC2 GABAergic conductance fails to attenuate excitatory steady-state depolarization when E_I <= E_L < E_E.',
    remainingGap: 'Direct experimental measurement of proton-wire coupling speed vs. classical glutamate diffusion in intact human cortical clefts remains open.',
  },
];

export const CONSCIOUSNESS_CLUES: readonly ConsciousnessClue[] = [
  {
    id: 'CS-DED-01',
    mode: 'deductive',
    domain: 'Formal 2x2 Algebraic Factorization (Lean 4.35.0)',
    proposition: 'Any product-factorized 2x2 weight table (w_ij = a_i * b_j) has strictly zero cross-coupling determinant (|w00*w11 - w01*w10| = 0), whereas tables with strict diagonal product dominance or positive diagonal excess yield strictly positive determinant (> 0).',
    evidenceOrProof: 'Kernel-checked in lean/Solution.lean (factorized_bipartition_zero_integration, correlated_nanocolumn_positive_integration, diagonal_excess_implies_positive_coupling) + common-cause counterexample in lean/AdversarialChecks.lean.',
    whatIsNotClaimed: 'Restricts strictly to observational 2x2 weight-table factorization (NOT interventional causal disconnection under latent common causes, NOT geometric nanocolumn derivation inside Lean, NOT proof of IIT or phenomenal qualia).',
  },
  {
    id: 'CS-DED-02',
    mode: 'deductive',
    domain: 'Bioenergetic & Biophysical Constraints (Lean 4.35.0)',
    proposition: 'High-bandwidth recurrent synaptic signaling faces a hard metabolic cliff: without local mitochondrial oxidative phosphorylation, high-frequency bursts strictly deplete local bouton ATP.',
    evidenceOrProof: 'Kernel-checked in lean/Solution.lean (atp_deficit_strict_depletion, resting_leak_strictly_lowers_sustainable_rate) and confirmed by 30-seed H3 Monte Carlo experiment.',
    whatIsNotClaimed: 'Does NOT prove ATP metabolism itself generates subjective experience; it constrains physical substrates capable of sustained biological recurrent dynamics.',
  },
  {
    id: 'CS-IND-01',
    mode: 'inductive',
    domain: 'Empirical Anesthesia, Pharmacology & Cryo-ET',
    proposition: 'Selective molecular perturbations of synaptic transmission (BoNT/A SNAP-25 cleavage, CaV2.1 block, GABA_A/NMDAR anesthetics, mitochondrial failure) reliably extinguish behavioral responsiveness and verbal report of conscious experience.',
    evidenceOrProof: 'Peer-reviewed pharmacology & structural biology (Dong 2019; Wang 2024; Shapson-Coe H01 2024).',
    whatIsNotClaimed: 'Correlational necessity of synaptic transmission for report does not disentangle access consciousness, motor output block, and phenomenal experience.',
  },
  {
    id: 'CS-IND-02',
    mode: 'inductive',
    domain: 'Human Cortical Specialization (H01 & eLife 2019-2024)',
    proposition: 'Human neocortical boutons scale vesicle reserves 2-3x beyond rodents and include rare up-to-50-contact high-strength axonal couplings, supporting sustained high-reliability multi-synaptic transmission.',
    evidenceOrProof: 'Rollenhagen et al. (eLife 2019, IJMS 2020, eLife 2024); Harvard-Google H01 connectome (PMC11718559).',
    whatIsNotClaimed: 'Larger vesicle pools do not distinguish human consciousness from non-human animal sentience.',
  },
  {
    id: 'CS-ABD-01',
    mode: 'abductive',
    domain: 'Multi-Theory Convergence Indicators (GNWT / RPT / IIT / Predictive Processing)',
    proposition: 'Best mechanistic inference from nanoscale biophysics: fast (<1.5 ms) trans-synaptic nanocolumn precision, NMDAR voltage-gated coincidence detection, and shunting E/I control are prime candidate physical mechanisms enabling millisecond-scale recurrent binding and global broadcast.',
    evidenceOrProof: 'Synthesis of NMDAR Mg2+ coincidence gating (Jahr & Stevens 1990), nanocolumn alignment (Tang 2016; PNAS 2024), and shunting inhibition.',
    whatIsNotClaimed: 'Abductive inference is hypothesis generation, NOT deductive proof; major theories (IIT vs GNWT adversarial collaborations) remain empirically contested.',
  },
  {
    id: 'CS-BAR-01',
    mode: 'epistemic-barrier',
    domain: 'Philosophy of Mind — The Hard Problem & Measurement Gap',
    proposition: 'No third-person biophysical equation, Lean 4 theorem, or neural simulation currently bridges objective functional/informational dynamics to first-person phenomenal experience ("what it is like").',
    evidenceOrProof: 'Structural epistemic boundary: any formal simulator can exhibit identical behavioral/informational metrics with or without postulating qualia (explanatory gap / substrate-independence dilemma).',
    whatIsNotClaimed: 'We explicitly reject claiming that this repository builds, proves, or detects artificial or biological sentience.',
  },
];

export const CLASSIFIED_FINDINGS: readonly ClassifiedFinding[] = [
  {
    id: 'F01',
    findingClass: 'conflict',
    title: 'Affiliation & Copyright Conflict (Unformed LLC vs. Independent Researcher)',
    description: 'Legacy template/monograph metadata cited "0thernes LLC" and MIT/All-Rights-Reserved, conflicting with Nov 22 Playbook Finding #1/#3/#4 noting no LLC entity is formed yet and recommending Apache-2.0 + CC-BY-4.0.',
    resolution: 'Resolved by owner under Build Standard R8 (ADR 0001): all repository files, CITATION.cff, .zenodo.json, formalization.yaml, and white papers credit "Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)" under Apache-2.0 (code) + CC-BY-4.0 (content/media).',
    status: 'resolved',
  },
  {
    id: 'F02',
    findingClass: 'bug',
    title: 'Legacy Monolithic HTML Used Unseeded Math.random() & Crashed on Malformed JSON Traces',
    description: 'Prototype v9 called Math.random() inside synaptic fusion logic (violating B03 determinism) and let JSON.parse throw raw uncaught SyntaxError or silently return zeroed results on empty trace inputs (violating B06 negative boundary handling).',
    resolution: 'Resolved: replaced with deterministic Mulberry32 PRNG (prng.ts) + ChaCha8Rng (Rust) + hardened TraceParseError validation (2 MB cap) with dedicated unit, negative, and regression tests (B06/B07).',
    status: 'resolved',
  },
  {
    id: 'F03',
    findingClass: 'error',
    title: 'Species Parameter Conflation (Rat 374 Vesicles Labeled Under Human Bouton Title)',
    description: 'Prototype CONSTANTS.BOUTON_VESICLE_TOTAL = 374 comes from rat synaptosomes (Wilhelm 2014), whereas adult human temporal cortex boutons average 1,500-3,500 vesicles (eLife 2019/2024; IJMS 2020).',
    resolution: 'Resolved: preserved Rat Wilhelm 2014 (374) explicitly labeled as baseline and added first-class Human Temporal Cortex L1 (3,500), L4 (1,800), and L5 (1,500) presets with Lean 4.35.0 conservation theorem T09.',
    status: 'resolved',
  },
  {
    id: 'F04',
    findingClass: 'issue',
    title: 'Missing Legacy Asset (4163_audit.jpg) & Lack of Proofs/Videos in Prototype',
    description: 'Prototype HTML referenced non-existent user_uploaded_files/ttl=63d/tool_generated/4163_audit.jpg and shipped neither formal Lean proofs nor reproducible simulation figures/videos.',
    resolution: 'Resolved: replaced with deterministic code-rendered tripartite_bouton_blueprint.png, 5 vector figures (fig1-fig5), animated GIF, two H.264 MP4 simulation videos, and 24 Lean 4.35.0 theorems.',
    status: 'resolved',
  },
  {
    id: 'F05',
    findingClass: 'problem',
    title: 'Windows Bracketed-Path & Cross-OS Newline Tooling Failures',
    description: 'Upstream New-Repo.ps1 lacked -LiteralPath on Z:\\[Vibe Coded (AI)], Audit-Repo.ps1 opened relative paths against .NET CWD instead of $Root, and Windows CSV writers emitted CRLF that broke Linux SHA-256 parity.',
    resolution: 'Resolved: fixed Audit-Repo.ps1 ([Path]::Combine($Root, $f)), enforced LF newlines in stats_experiments.py for cross-OS MANIFEST.sha256 identity, and documented the bracket-safety rule in AGENTS.md.',
    status: 'resolved',
  },
  {
    id: 'F06',
    findingClass: 'problem',
    title: 'Cloud Image-Generator 503 Exhaustion & Windows Lack of bwrap Sandbox',
    description: 'External image-generator returned 503 MODEL_CAPACITY_EXHAUSTED during setup, and Windows lacks Linux bubblewrap (bwrap) required by sandboxed lake comparator.',
    resolution: 'Resolved: built a 100% deterministic Python Matplotlib/Pillow/FFmpeg scientific figure and video pipeline (stronger under R6) and verified all 6 independent Lean kernels via sandboxed lake comparator --paranoid on Ubuntu CI.',
    status: 'resolved',
  },
  {
    id: 'F07',
    findingClass: 'dilemma',
    title: 'Zero-Mathlib Pure Lean Core vs. Float64 RK4 ODE & Monte Carlo Approximations',
    description: 'Full Mathlib real-analysis proofs of 4D Hodgkin-Huxley ODEs and stochastic Monte Carlo sweeps trade speed and multi-kernel portability for heavier trust bases, while float64 integration is not a kernel proof.',
    resolution: 'Resolved (ADR 0003): proved 24 algebraic & dynamical invariants in zero-Mathlib Lean 4.35.0 (6 kernels, 26 witnesses, 6 adversarial checks), verified exact transcendentals with a 50-digit mpmath oracle (1,000-case differential test, 0 mismatches), and tagged all float64 ODE/MC trajectories numerical_approximation.',
    status: 'accepted-limitation',
  },
  {
    id: 'F08',
    findingClass: 'dilemma',
    title: 'Nanoscale Bouton Fidelity vs. Whole-Cortex Scale & Static Pages vs. Live API',
    description: 'Simulating 300,000 discrete proteins across 10^14 human cortical synapses exceeds exascale by >10^9x, and requiring a hosted API server conflicts with zero-maintenance static GitHub Pages availability.',
    resolution: 'Resolved: adopted a multi-scale boundary architecture with explicit cross-scale handoffs (White Paper 2) plus a dual-mode web workbench running @synapse/core statically on GitHub Pages with automatic local FastAPI /healthz upgrade.',
    status: 'accepted-limitation',
  },
  {
    id: 'F09',
    findingClass: 'error',
    title: 'Pre-Registered Hypothesis H3 (40 Hz) Exceeded Mitochondrial Critical Frequency',
    description: 'PREREGISTRATION.md predicted mitochondria would retain >90% ATP at 40 Hz, overlooking resting V-ATPase H+ leak + 40 Hz burn = 1,284,000 ATP/s > 950,000 ATP/s supply (exact f_crit,mito = 29.5625 Hz).',
    resolution: 'Resolved honestly: preserved H3 verbatim as refuted/retracted (C05 in CLAIMS.md, ERRATA.md, White Paper 1) and logged a separately labeled post-hoc exploratory comparison H3b at 20 Hz in DEVIATIONS.md.',
    status: 'resolved',
  },
  {
    id: 'F10',
    findingClass: 'issue',
    title: 'Consciousness Epistemic Gap, Playbook Hardening & Transitive Dependency Hygiene',
    description: 'Phenomenal consciousness/sentience remains formally unproved and empirically underdetermined; additionally, post-v1.0.0 review flagged upstream pillow/vite lockfile alerts, missing ERRATA.md/Dockerfile/RFC-3161 timestamp, Palomar module headers, live Crossref DOI audit, and R1 vs. commit-signing conflict.',
    resolution: 'Handled in v1.1.0: upgraded pillow (13.0.0), vite (6.4.6), vitest (4.1.12) to 0 npm vulnerabilities; added Palomar module headers, ERRATA.md, digest-pinned Dockerfile, 23/23 live Crossref citation audit, root MANIFEST.sha256 + RFC 3161 .tsr, ADR 0005, and SWHID metadata; phenomenal consciousness remains explicitly bounded outside formal proofs.',
    status: 'accepted-limitation',
  },
];

export const FORENSIC_AUDIT_HOTSPOTS: readonly ForensicAuditHotspot[] = [
  {
    id: 1,
    xPct: 24,
    yPct: 24,
    severity: 'critical',
    title: 'Tau Longitudinal Protofilament Binding (Not Spiraling)',
    defectInNaiveVisuals: 'Naive AI renders wrap tau helically around microtubules and clash sterically with walking kinesin-1 heads.',
    biophysicalCorrection: 'Cryo-EM (EMD-7769, Kellogg et al. 2018) shows tau binds longitudinally along protofilament crests; kinesin-1 walks unobstructed protofilaments and detaches at cohesive tau envelopes.',
    literatureAnchor: 'Kellogg et al., Science (2018) PMC6225777 / EMD-7769',
  },
  {
    id: 2,
    xPct: 50,
    yPct: 54,
    severity: 'critical',
    title: 'Intracellular PSD-95 Strictly Beneath Postsynaptic Bilayer',
    defectInNaiveVisuals: 'Uncorrected diagrams place PSD-95/CaMKII scaffolds floating inside the extracellular 22 nm synaptic cleft.',
    biophysicalCorrection: 'The postsynaptic density (PSD-95, Shank, Homer, CaMKII) is strictly intracellular directly beneath the postsynaptic bilayer, aligned across the cleft with presynaptic RIM1/2 nanocolumns.',
    literatureAnchor: 'Tang et al., Nature (2016); PNAS (2024)',
  },
  {
    id: 3,
    xPct: 43,
    yPct: 44,
    severity: 'scale',
    title: 'Lateral CaV2.1 Channel Nanodomain Offset (~17 nm)',
    defectInNaiveVisuals: 'Cartoon illustrations place Ca2+ channels directly blocking the fusion pore or 100+ nm away.',
    biophysicalCorrection: '1-3 open CaV2.1 channels sit laterally <= 17 nm from Synaptotagmin-1 sensors, generating localized ~20-40 uM Ca2+ nanodomains for sub-millisecond Hill n=4 release.',
    literatureAnchor: 'MPG (2025); Wilhelm et al., Science (2014)',
  },
  {
    id: 4,
    xPct: 68,
    yPct: 33,
    severity: 'frontier',
    title: 'Native V-ATPase Cholesterol Rotor & Reversible V1 Dissociation',
    defectInNaiveVisuals: 'Static textbook vesicles omit V-ATPase stoichiometry and treat vesicles as bare empty spheres.',
    biophysicalCorrection: 'Cryo-EM (EMD-44847, Wang et al. 2024 Science) reveals cholesterol coating the V0 rotor, stoichiometric synaptophysin binding, and V1 popping off once glutamate loading completes.',
    literatureAnchor: 'Wang et al., Science 385:168-174 (2024) / EMD-44847',
  },
  {
    id: 5,
    xPct: 82,
    yPct: 51,
    severity: 'accurate',
    title: 'Perisynaptic Astrocyte Leaflets & EAAT2/GLT-1 Clearance',
    defectInNaiveVisuals: 'Bipartite diagrams omit the third glial partner, leaving glutamate clearance unexplained.',
    biophysicalCorrection: 'Perisynaptic astrocyte leaflets flank the 22 nm cleft expressing dense EAAT2/GLT-1 transporters (~1 ATP/glutamate recycled via glutamine synthetase), preventing NMDA excitotoxicity.',
    literatureAnchor: 'Rollenhagen et al., eLife (2024); PMC10913822',
  },
];
