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

/** Build Standard v1.2.0 ten canonical finding classes (R7). */
export type FindingClass =
  | 'bug'
  | 'error'
  | 'issue'
  | 'problem'
  | 'concern'
  | 'dilemma'
  | 'conflict'
  | 'gap'
  | 'hole'
  | 'blindspot';

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
    ourProgress: 'Proved elementary cleared-denominator Hill n=4 inequalities (monotonicity, 1/82 floor, 8.5x doubling, n=4 vs n=1 crossover) in Lean 4.35.0; built 30-seed Rust/Python Monte Carlo simulator using Naraghi-Neher (1997) stationary buffers.',
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
    ourProgress: 'Verified exact CODATA thermal energy k_B T = 4.282 pN*nm in a 50-digit mpmath oracle; separated classical thermal constraints (Tegmark 2000) from unverified quantum-consciousness claims.',
    leanOrCodeAnchor: 'packages/synapse-core/src/electrophysiology.ts; papers/wp2_open_problems_consciousness',
    epistemicStatus: 'empirically-constrained',
    falsificationCriterion: 'Classical-only hypothesis would be falsified by reproducible direct spectroscopic observation of millisecond-scale physiological quantum coherence driving synaptic exocytosis at 310 K.',
    remainingGap: 'Nanoscale proton-wire Grotthuss hopping rates along hydrated cleft interfaces still lack atomic-time-resolved in situ measurement.',
  },
  {
    id: 'OP-CHEM-01',
    discipline: 'Chemistry',
    title: 'Atomic-Resolution Hemifusion Stalk Catalysis & Native V-ATPase Reversible V1 Dissociation',
    formalStatement: 'Resolve the exact free-energy pathway by which vesicle lipids (e.g., 33.3 mol% cholesterol in Narcine brasiliensis SVs; cholesterol-decorated V0 rotor in rat SVs, Coupland et al. 2024) and 3-6 SNAREpins lower the fusion barrier within < 1 ms, and how loading triggers V1 uncoupling.',
    ourProgress: 'Formalized non-strict monotonicity of our integer-scaled illustrative SNARE barrier formula in Lean 4.35.0 (T18-T19), linked to Python/TS/Rust via ExportVectors.lean.',
    leanOrCodeAnchor: 'lean/Solution.lean (snare_*); packages/synapse-core/src/snare.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if DNA-origami SNARE ring assays (Xu et al. 2016) show fusion barrier height increasing with functional SNAREpin copy number from 1 to 6.',
    remainingGap: 'All-atom polarizable MD simulation of lipid stalk water-bridge rupture over millisecond timescales remains computationally intractable.',
  },
  {
    id: 'OP-BIO-01',
    discipline: 'Biology',
    title: 'Evolutionary Scaling Laws of Human Cortical Boutons (Larger Vesicle Reserves Over Rodents)',
    formalStatement: 'Explain why adult human temporal cortex L1/L4/L5 boutons maintain 1,500-3,500 synaptic vesicles (4.0-9.4x the Wilhelm 2014 rat synaptosome baseline of 374; 2-3x active-zone area) and up to 50-contact axons (H01) despite resting V-ATPase H+-leak ATP costs.',
    ourProgress: 'Corrected rat-vs-human vesicle conflation with explicit Rat (374) and Human L1 (3,500)/L4 (1,800)/L5 (1,500) presets; proved single- and multi-step vesicle counter conservation (T12-T13) and resting-leak ceiling bounds (T16) in Lean 4.',
    leanOrCodeAnchor: 'lean/Solution.lean (vesicle_pool_*, resting_leak_*); packages/synapse-core/src/constants.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if comparative cross-primate 3D EM shows human L1 vesicle pools do not exceed rodent L5B pools under identical fixation protocols.',
    remainingGap: 'Direct causal linkage between enlarged human reserve pools and sustained multi-second working-memory firing remains empirically unclosed.',
  },
  {
    id: 'OP-NEURO-01',
    discipline: 'Neuroscience',
    title: 'Trans-Synaptic Nanocolumn Plasticity & Quantal Variability Scaling Across Cortical Layers',
    formalStatement: 'Determine how RIM1/2-Munc13 presynaptic release nanodomains dynamically realign across the 22 nm cleft with PSD-95/AMPAR clusters during LTP and sleep homeostasis.',
    ourProgress: 'Executed pre-registered 30-seed Monte Carlo simulator comparison (0 nm aligned vs 80 nm misaligned; Holm-adjusted p = 0.0005, Cliff delta = +1.00) and proved single-step fixed-point Tsodyks-Markram STP unit bounds (T07).',
    leanOrCodeAnchor: 'PREREGISTRATION.md; python/synapse_science/stats_experiments.py; lean/Solution.lean (T07)',
    epistemicStatus: 'computationally-bounded',
    falsificationCriterion: 'Simulator prediction refuted if aligned (0 nm) vs misaligned (80 nm) arms fail Holm-adjusted p < 0.01 or 95% CI includes <= 0 pA.',
    remainingGap: 'In vivo live-human nanoscale tracking of trans-synaptic alignment during awake cognition is not yet technically feasible.',
  },
  {
    id: 'OP-NPSYCH-01',
    discipline: 'Neuropsychology',
    title: 'Cross-Scale Explanatory Bridge from Molecular Synaptopathies to Subjective Cognitive Deficits',
    formalStatement: 'Map how nanoscale failures (tau polymorphs, ANXA11/BORC mRNA hitchhiking loss, CaMKII autophosphorylation decay) causally produce human episodic memory loss, executive dysfunction, and altered phenomenology.',
    ourProgress: 'Cataloged primary clinical-molecular links (tau EMD-7769, BORC/ANXA11 axonal transport) and explicitly mapped multi-scale causal blind spots in White Paper 2 (companion survey).',
    leanOrCodeAnchor: 'papers/wp2_open_problems_consciousness/main.tex',
    epistemicStatus: 'open-hard-problem',
    falsificationCriterion: 'A single-scale reductionist map is refuted whenever identical synaptic density loss yields divergent clinical cognitive trajectories across patients (cognitive reserve).',
    remainingGap: 'No validated quantitative transfer function maps single-bouton protein copy-number defects directly to first-person cognitive report.',
  },
  {
    id: 'OP-NCS-01',
    discipline: 'NeuroCS',
    title: 'Stochastic Biohybrid Synaptic Computation vs. Deterministic Von Neumann / GPU Precision',
    formalStatement: 'Characterize the information-per-joule Pareto frontier where stochastic unreliable biological synapses outperform deterministic digital weights in continuous learning.',
    ourProgress: 'Built cross-language TS/Rust/Python biophysical engines with 1,000-case differential testing (0 mismatches), Lean-to-engine vector parity (ExportVectors.lean), and honest median/IQR Rust vs Node benchmarks (5.94x speedup). (No formal claim from T22-T24 on energy efficiency.)',
    leanOrCodeAnchor: 'rust/synapse-sim; docs/benchmarks.md; python/tests/test_differential.py',
    epistemicStatus: 'computationally-bounded',
    falsificationCriterion: 'Bio-efficiency claim refuted if CMOS neuromorphic hardware achieves lower energy per synaptic plasticity event at equivalent dendritic integration complexity.',
    remainingGap: 'Real-time whole-cortex simulation at single-vesicle stochastic resolution (~10^14 synapses x 300,000 proteins) exceeds current exascale compute by >10^9x.',
  },
  {
    id: 'OP-NMATH-01',
    discipline: 'NeuroMath',
    title: 'Mechanized Formal Verification of Nonlinear Biophysical ODEs and Stochastic Master Equations',
    formalStatement: 'Close the gap between exact discrete integer invariants checked in Lean 4 and rigorous verified numerical enclosures (interval ODE integrators) for 4D Hodgkin-Huxley spiking trajectories.',
    ourProgress: 'Delivered 24 pure Lean 4.35.0 integer/list-induction lemmas (0 unused hypotheses, enforced zero Classical.choice, 27 witnesses, 7 sanity/sharpness checks, 6 kernels in CI) + Lean->engine vector tests + 50-digit mpmath oracle; credits prior work (grn-lean, Bobbin et al. 2024, arXiv:2505.05362).',
    leanOrCodeAnchor: 'lean/Challenge.lean; lean/Solution.lean; lean/ExportVectors.lean; python/synapse_science/oracle.py',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Any theorem refuted if any of the 6 independent kernels rejects the proof export or if differential/vector testing finds a mismatch against the oracle.',
    remainingGap: 'Formalizing validated interval arithmetic for the full 4D Hodgkin-Huxley RK4 trajectory inside Lean 4 remains future work.',
  },
  {
    id: 'OP-NCHEM-01',
    discipline: 'Neurochemistry',
    title: 'Synapsin-1 Liquid-Liquid Phase Separation (LLPS) Dynamics & Hidden Resting Metabolic Load',
    formalStatement: 'Quantify the exact CaMKII phosphorylation threshold dispersing synapsin-1 vesicle condensates and the thermodynamic cost of maintaining resting V-ATPase proton gradients across 3,500 vesicles.',
    ourProgress: 'Proved truncated linear ATP store depletion (T14) and zero-time upper bound (T15, with sharpness counterexample A07) in Lean 4; reported that pre-registered H3 (40 Hz) fails in the fixed-parameter simulator under illustrative post-registration constants (logged alongside exploratory 20 Hz H3b).',
    leanOrCodeAnchor: 'lean/Solution.lean (T14-T16); lean/AdversarialChecks.lean (A07); DEVIATIONS.md',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Biological resting-burden hypothesis is testable via live axonal ATP imaging (Rangaraju 2014; Pulido & Ryan 2021); simulator H3 output is fixed by illustrative constants.',
    remainingGap: 'Non-equilibrium phase-diagram equations for multicomponent synapsin/alpha-synuclein/vesicle condensates under physiological crowding remain unsolved.',
  },
  {
    id: 'OP-NBIO-01',
    discipline: 'Neurobiology',
    title: 'Meter-Scale Axonal Logistics, Microtubule Lattice Self-Repair & Lysosomal mRNA Hitchhiking',
    formalStatement: 'Determine how neurons coordinate kinesin-1 (8.0 nm/ATP, ~17 days/meter), dynein-dynactin retrograde clearance, tau envelopes, and ANXA11/BORC lysosomal mRNA hitchhiking without lethal traffic jams over 80+ years.',
    ourProgress: 'Verified (8*n)/8 = n and 10^6/8 = 125,000 in Lean 4 (T17, arithmetic behind 8 nm/step); integrated longitudinal tau protofilament crest geometry (EMD-7769) and ANXA11/BORC literature into workbench & White Paper 1.',
    leanOrCodeAnchor: 'lean/Solution.lean (T17); packages/synapse-core/src/bioenergetics.ts',
    epistemicStatus: 'empirically-constrained',
    falsificationCriterion: 'Refuted if single-molecule optical trapping detects kinesin-1 stepping lengths deviating systematically from 8.0 nm/ATP along native 13-protofilament axonal microtubules.',
    remainingGap: 'How luminal microtubule particles regulate lattice self-repair and axonal transport mechanics remains unknown.',
  },
  {
    id: 'OP-NPHYS-01',
    discipline: 'Neurophysics',
    title: 'Sub-Nanometer Metrology, Shunting Inhibition Mechanics & Acid-Base Protonic Computation',
    formalStatement: 'Unify sub-nanometer RESI/DNA-PAINT receptor mapping, conductance-based shunting inhibition, and transient cleft acidification (pH microdomains) into a single coupled electro-diffusive physical theory.',
    ourProgress: 'Proved conductance-weighted mean bounds & shunting attenuation (T08-T10), monotonicity of D/(D+m*e) in abstract e (T11), and cleared-denominator RESI variance/duty-cycle inequalities (T20-T21) in Lean 4.35.0.',
    leanOrCodeAnchor: 'lean/Solution.lean (T08-T11, T20-T21); packages/synapse-core/src/metrology.ts',
    epistemicStatus: 'kernel-checked-partial',
    falsificationCriterion: 'Refuted if mature KCC2 GABAergic conductance fails to attenuate excitatory steady-state depolarization when E_I <= E_L < E_E.',
    remainingGap: 'Direct experimental measurement of proton-wire coupling speed vs. classical glutamate diffusion in intact human cortical clefts remains open.',
  },
];

export const CONSCIOUSNESS_CLUES: readonly ConsciousnessClue[] = [
  {
    id: 'CS-DED-01',
    mode: 'deductive',
    domain: 'Generic 2x2 Integer Determinant Facts (Lean 4.35.0)',
    proposition: 'On any 2x2 integer table w_ij, rank-1 outer products (w_ij = a_i * b_j) have determinant 0 (T22), while strict diagonal product dominance (T23) or positive diagonal excess (T24) implies |w00*w11 - w01*w10| > 0.',
    evidenceOrProof: 'Kernel-checked in lean/Solution.lean (T22-T24, generic aliases outer_product_det_zero / det_pos_of_diag_dominance / det_pos_of_diag_excess). A05 evaluates bipartiteCoupling 40 10 10 40 = 1500 > 0; reading that table as a common-cause counterexample is informal prose.',
    whatIsNotClaimed: 'Contains NO neural, nanocolumn, causal, or consciousness model inside Lean; makes NO formal contribution to NEURO-004 (mechanistic NCC), IIT, or sentience detection.',
  },
  {
    id: 'CS-DED-02',
    mode: 'deductive',
    domain: 'Linear Mean-Rate ATP Store Bounds (Lean 4.35.0)',
    proposition: 'In the repository deterministic mean-rate integer model, whenever constant burn exceeds constant supply, a positive ATP store strictly drops (T14) and reaches 0 for all t >= floor(a0/D) + 1 (T15 upper bound; A07 shows strict inequality when D divides a0).',
    evidenceOrProof: 'Kernel-checked in lean/Solution.lean (T14-T16) and checked against constant-rate oracle formulas via ExportVectors.lean. Simulator H3/H3b outputs follow from illustrative post-registration constants.',
    whatIsNotClaimed: 'Does NOT prove ATP metabolism generates subjective experience, and does NOT constitute a wet-lab biological refutation.',
  },
  {
    id: 'CS-IND-01',
    mode: 'inductive',
    domain: 'Empirical Anesthesia, Pharmacology & Structural Biology',
    proposition: 'General anesthetics targeting GABA_A and NMDA receptors reliably induce reversible loss of conscious responsiveness (Brown, Lydic & Schiff 2010), while clostridial neurotoxins (BoNT/A) selectively cleave SNARE proteins and block synaptic vesicle fusion (Dong et al. 2019).',
    evidenceOrProof: 'Peer-reviewed clinical anesthesia review (Brown et al. NEJM 2010) and toxin structural review (Dong et al. Annu. Rev. Biochem. 2019).',
    whatIsNotClaimed: 'Behavioral unresponsiveness or peripheral synaptic block does not by itself separate access consciousness, motor output block, and phenomenal experience.',
  },
  {
    id: 'CS-IND-02',
    mode: 'inductive',
    domain: 'Human Cortical Specialization (H01 & eLife 2019-2025)',
    proposition: 'Human temporal neocortical boutons maintain large vesicle pools (1,500-3,500 across L1/L4/L5; Rollenhagen/Yakoubi 2019-2025) and rare up-to-50-contact high-strength axonal couplings in H01 (Shapson-Coe et al. 2024).',
    evidenceOrProof: 'Yakoubi et al. (eLife 2019), Rollenhagen et al. (IJMS 2020; eLife 2025), Shapson-Coe et al. (Science 2024).',
    whatIsNotClaimed: 'Larger vesicle pools do not distinguish human consciousness from non-human animal sentience.',
  },
  {
    id: 'CS-ABD-01',
    mode: 'abductive',
    domain: 'Multi-Theory Empirical Landscape (COGITATE 2025 Adversarial Collaboration)',
    proposition: 'Sub-millisecond nanocolumn precision (Tang et al. 2016), NMDAR voltage-gated Mg2+ coincidence unblock (Jahr & Stevens 1990), and shunting E/I control support high-SNR recurrent signaling, while adversarial testing of GNWT and IIT challenged key predictions of both theories (Cogitate Consortium 2025).',
    evidenceOrProof: 'Synthesis of Jahr & Stevens (1990), Tang et al. (2016), and Cogitate Consortium (Nature 2025).',
    whatIsNotClaimed: 'Abductive synthesis is hypothesis framing, NOT deductive proof; neither IIT nor GNWT is settled.',
  },
  {
    id: 'CS-BAR-01',
    mode: 'epistemic-barrier',
    domain: 'Philosophy of Mind — The Hard Problem & Measurement Gap',
    proposition: 'No third-person biophysical equation, Lean 4 theorem, or neural simulation currently bridges objective functional/informational dynamics to first-person phenomenal experience ("what it is like"; Chalmers 1995).',
    evidenceOrProof: 'Structural epistemic boundary: none of the 1,900 Mega-Atlas open problems (including NEURO-001 and NEURO-003) is solved, fully or partially.',
    whatIsNotClaimed: 'We explicitly reject claiming that this repository builds, proves, or detects artificial or biological sentience.',
  },
];

export const CLASSIFIED_FINDINGS: readonly ClassifiedFinding[] = [
  {
    id: 'F01',
    findingClass: 'conflict',
    title: 'Affiliation & Copyright Conflict (Unformed LLC vs. Independent Researcher)',
    description: 'Legacy metadata cited "0thernes LLC" and MIT/All-Rights-Reserved, conflicting with Playbook rules noting no LLC entity is formed yet and recommending Apache-2.0 + CC-BY-4.0.',
    resolution: 'Resolved under Build Standard R8 (ADR 0001): all repository files, CITATION.cff, .zenodo.json, formalization.yaml, and white papers credit "Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)" under Apache-2.0 (code) + CC-BY-4.0 (content/media).',
    status: 'resolved',
  },
  {
    id: 'F02',
    findingClass: 'bug',
    title: 'Legacy Monolithic HTML Used Unseeded Math.random() & Crashed on Malformed JSON Traces',
    description: 'Prototype v9 called Math.random() inside synaptic fusion logic (violating B03 determinism) and let JSON.parse throw uncaught SyntaxError on malformed traces (violating B06).',
    resolution: 'Resolved: deterministic Mulberry32 PRNG (prng.ts) + ChaCha8Rng (Rust) + hardened TraceParseError validation (2 MB cap, monotonic timestamps) with regression tests.',
    status: 'resolved',
  },
  {
    id: 'F03',
    findingClass: 'error',
    title: 'Species Parameter Conflation (Rat 374 Vesicles & Ray Electric Organ Lipids)',
    description: 'Rat synaptosome count (374, Wilhelm 2014) was labeled under a human bouton heading, and marine ray (Narcine brasiliensis) lipidome (Deutsch & Kelly 1981) was presented without species attribution.',
    resolution: 'Resolved: Rat (374) and Human L1 (3,500)/L4 (1,800)/L5 (1,500) presets separated cleanly; Narcine brasiliensis species/preparation explicitly labeled in constants.ts, Web UI, and White Paper 1.',
    status: 'resolved',
  },
  {
    id: 'F04',
    findingClass: 'gap',
    title: 'Missing Legacy Asset (4163_audit.jpg) & Build Standard v1.2.0 10-Class Upgrade',
    description: 'Legacy prototype lacked reproducible figures/videos/proofs; repo also trailed Build Standard v1.2.0 (10 finding classes including concern/gap/hole/blindspot, SHA-256-verified security scanners, URN schema $id).',
    resolution: 'Resolved: deterministic code-rendered blueprint, figs 1-5, GIF, 2 MP4s, 24 Lean theorems, and full upgrade to Build Standard v1.2.0 (100.0% score).',
    status: 'resolved',
  },
  {
    id: 'F05',
    findingClass: 'problem',
    title: 'Windows Bracketed-Path, Cross-OS Newline & Software Heritage Anubis PoW Obstacles',
    description: 'Bracketed path Z:\\[Vibe Coded (AI)] broke unescaped PowerShell/glob/pytest invocations; Windows lacks bwrap; Software Heritage Save Code Now is gated by Anubis PoW.',
    resolution: 'Resolved locally for PowerShell (-LiteralPath), pipeline-audit.py (glob.escape), mutation_audit.py (relative pytest path), LF newlines, and Ubuntu CI 6-kernel bwrap; Anubis PoW gate is never bypassed and documented transparently.',
    status: 'resolved',
  },
  {
    id: 'F06',
    findingClass: 'issue',
    title: 'Stale Version Strings, Witness Count (26 vs 27) & Overstated Theorem Names/Docstrings',
    description: 'Lean NonVacuity.lean had 27 witness theorems (misreported as 26), A04 cited T15 instead of T16, and Domain VI names/docstrings suggested biological/causal content beyond 2x2 integer determinants.',
    resolution: 'Resolved in v1.4.0: corrected count to 27 everywhere, fixed A04 -> T16, tightened all Lean docstrings, added generic aliases (outer_product_det_zero, det_pos_of_diag_dominance, det_pos_of_diag_excess), and synchronized both white papers.',
    status: 'resolved',
  },
  {
    id: 'F07',
    findingClass: 'dilemma',
    title: 'Zero-Mathlib Pure Lean Core vs. Float64 RK4 ODE & Monte Carlo Approximations',
    description: 'Full Mathlib real-analysis ODE enclosures trade portability/multi-kernel replay for heavier trust bases, while float64 trajectories are not kernel-checked proofs.',
    resolution: 'Bounded (ADR 0003): 24 pure Lean 4.35.0 integer/list-induction invariants (6 kernels, enforced zero Classical.choice), tested Lean->engine vector bridge (ExportVectors.lean), 50-digit mpmath oracle, and explicit numerical_approximation tags.',
    status: 'accepted-limitation',
  },
  {
    id: 'F08',
    findingClass: 'blindspot',
    title: 'Whole-Cortex Scale Gap, Unformalized Phenomenal Consciousness & Post-Registration Constants',
    description: '10^14 synapses x 300k proteins exceeds exascale by >10^9x; third-person equations cannot bridge the Hard Problem; PREREGISTRATION.md fixed hypotheses/seeds/stats before code but not the illustrative ATP constants.',
    resolution: 'Explicitly documented in LIMITATIONS.md, ERRATA.md, CLAIMS.md, and both white papers: H3/H3b labeled fixed-parameter simulator properties under illustrative constants, 0/1,900 Mega-Atlas solved, and consciousness explicitly outside formal proof scope.',
    status: 'accepted-limitation',
  },
  {
    id: 'F09',
    findingClass: 'error',
    title: 'Citation Mismatches (Xu Wrong DOI, Coupland vs Wang Conflation, Author/Title Drift)',
    description: 'xu2016dnaorigami carried DOI 10.1021/jacs.5b12688 (unrelated MOF paper); yakoubi2019layer4, rollenhagen2020human, rollenhagen2024l1 had author mismatches; depace2024borc title was truncated; Coupland 2024 Science findings were misattributed to Wang 2024 Nature.',
    resolution: 'Resolved in v1.4.0 (F36): repaired every BibTeX entry from live Crossref metadata, added Coupland 2024, Dodge 1967, Tsodyks 1998, Naraghi 1997, Brown 2010, and Bobbin 2024, and upgraded verify_citations.py to enforce title, first-author, year, and updated-by retraction checks.',
    status: 'resolved',
  },
  {
    id: 'F10',
    findingClass: 'hole',
    title: 'Unenforced Gates: Mutation Harness Exit-4 False Kills, Classical.choice & Lean-Engine Link',
    description: 'mutation_audit.py crashed with pytest exit 4 on bracketed paths (faking 6/6 kills while M04 lacked an assertion); comparator.json/CI permitted Classical.choice; T02/T07 had unused hypotheses; no test linked Lean definitions to TS/Rust/Python engines.',
    resolution: 'Closed in v1.4.0 (F35, F37, F38): mutation_audit.py now enforces an unmutated rc=0 control + strict rc=1 kill check + real M04 assertion; comparator.json/CI/check_readme_axioms.py forbid Classical.choice; T02 strengthened & T07 generalized (0 unused hypotheses); ExportVectors.lean tests Lean->Python/TS/Rust parity.',
    status: 'resolved',
  },
  {
    id: 'F11',
    findingClass: 'concern',
    title: 'External Peer Scrutiny, Independent Human Replication & Unescaped WebGL Error String',
    description: 'White papers have not yet undergone external journal peer review or unaffiliated human replication; scene3d.ts WebGL fallback also interpolated an unescaped error string into innerHTML.',
    resolution: 'Escaped WebGL fallback string in scene3d.ts; external peer-review and unaffiliated human replication status remain transparently disclosed as open across README.md, REPLICATION.md, and both white papers.',
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
    literatureAnchor: 'Kellogg et al., Science 360:1242–1246 (2018) / DOI:10.1126/science.aat1780 / EMD-7769',
  },
  {
    id: 2,
    xPct: 50,
    yPct: 54,
    severity: 'critical',
    title: 'Intracellular PSD-95 Strictly Beneath Postsynaptic Bilayer',
    defectInNaiveVisuals: 'Uncorrected diagrams place PSD-95/CaMKII scaffolds floating inside the extracellular 22 nm synaptic cleft.',
    biophysicalCorrection: 'The postsynaptic density (PSD-95, Shank, Homer, CaMKII) is strictly intracellular directly beneath the postsynaptic bilayer, aligned across the cleft with presynaptic RIM1/2 nanocolumns.',
    literatureAnchor: 'Tang et al., Nature 536:210–214 (2016) / DOI:10.1038/nature19058',
  },
  {
    id: 3,
    xPct: 43,
    yPct: 44,
    severity: 'scale',
    title: 'Lateral CaV2.1 Channel Nanodomain Offset (~17 nm)',
    defectInNaiveVisuals: 'Cartoon illustrations place Ca2+ channels directly blocking the fusion pore or 100+ nm away.',
    biophysicalCorrection: 'Open CaV2.1 channels sit laterally ~17 nm from Synaptotagmin-1 sensors, generating localized ~20–40 uM Ca2+ nanodomains modeled via Naraghi–Neher linearized buffers and 4th-power cooperativity.',
    literatureAnchor: 'Naraghi & Neher, J Neurosci (1997); Dodge & Rahamimoff, J Physiol (1967); Wilhelm et al., Science (2014)',
  },
  {
    id: 4,
    xPct: 68,
    yPct: 33,
    severity: 'frontier',
    title: 'Native V-ATPase Cholesterol-Decorated Rotor, V1 Dissociation & Synaptophysin Interface',
    defectInNaiveVisuals: 'Static textbook vesicles omit V-ATPase stoichiometry and treat vesicles as bare empty spheres.',
    biophysicalCorrection: 'Coupland et al. (Science 2024, rat brain SVs) resolved cholesterol decorating the V0 rotor, stoichiometric synaptophysin binding, and ATP-hydrolysis/loading-coupled V1 loss; companion work by Wang et al. (Nature 2024, mouse SVs, EMD-44847) mapped the V-ATPase–synaptophysin interface and copy-number topography.',
    literatureAnchor: 'Coupland et al., Science 385:168–174 (2024); Wang et al., Nature 631:899–904 (2024)',
  },
  {
    id: 5,
    xPct: 82,
    yPct: 51,
    severity: 'accurate',
    title: 'Perisynaptic Astrocyte Leaflets & EAAT2/GLT-1 Clearance',
    defectInNaiveVisuals: 'Bipartite diagrams omit the third glial partner, leaving glutamate clearance unexplained.',
    biophysicalCorrection: 'Perisynaptic astrocyte leaflets flank the 22 nm cleft expressing dense EAAT2/GLT-1 transporters (~1 ATP/glutamate recycled via glutamine synthetase), limiting glutamate spillover.',
    literatureAnchor: 'Rollenhagen et al., eLife 13:RP99473 (2025) / DOI:10.7554/eLife.99473',
  },
];
