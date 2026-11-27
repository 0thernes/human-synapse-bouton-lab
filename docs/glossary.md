# Scientific & Engineering Glossary

Alphabetized definitions linking domain terms, code modules, and all ten Build Standard v1.2.0 finding classes (Build Standard A44).

- **Active Zone (AZ):** Specialized presynaptic membrane release launchpad enriched in RIM1/2, Munc13, Bassoon, SNAREs, and $\mathrm{Ca_V2.1}$ channels (`packages/synapse-core/src/electrophysiology.ts`).
- **AMPA / NMDA Receptors:** Postsynaptic ionotropic glutamate channels clustered in liquid-like nanodomains ($7{,}000\text{–}13{,}000/\mu\mathrm{m}^2$); NMDARs require simultaneous glutamate binding and postsynaptic depolarization to relieve $\mathrm{Mg}^{2+}$ block (`computeNmdaMgUnblock`).
- **Annexin A11 (ANXA11) & BORC:** Molecular tether and kinesin-adaptor complex mediating long-distance axonal mRNA granule hitchhiking on LAMP1+ lysosomes (Liao 2019; De Pace 2024).
- **Blindspot (Finding Class):** A user, platform, failure mode, or assumption nobody has examined yet, so what is wrong there is unknown; must be investigated purposefully and refiled under concrete classes.
- **Bug (Finding Class):** Defect in program logic where code runs differently from its specification or intent (requires fix + regression test B07).
- **Concern (Finding Class):** A risk that has not caused harm yet (security, cost, legal, scientific reliability); record likelihood, impact, and mitigation or acceptance rationale.
- **Conflict (Finding Class):** Two requirements, sources, or rules contradicting each other; resolved via owner precedence rule R8.
- **Cryo-Electron Tomography (Cryo-ET):** 3D tilt-series imaging of vitrified hydrated brain tissue revealing native macromolecular landscapes without chemical stains.
- **Dilemma (Finding Class):** Trade-off between two or more valid design options decided by owner priorities.
- **DNA-PAINT / RESI:** Super-resolution fluorescence microscopy achieving sub-nanometer precision ($\sigma_{\text{RESI}} = \sigma_{\text{PSF}}/\sqrt{N\cdot K}$) via transient imager hybridization and orthogonal sequential subsets (`metrology.ts`, `lean/Solution.lean`).
- **Error (Finding Class):** Wrong artifact or failed execution outside program logic (e.g., wrong number, wrong DOI, stale doc, broken link, mismatched version).
- **Gap (Finding Class):** Something required or expected is missing (file, feature, doc, or standard item), while nothing present is wrong.
- **Hill $n=4$ Cooperativity:** Fourth-power calcium-release relation $P_r(c) = c^4/(c^4 + K_d^4)$ reflecting cooperative $\mathrm{Ca}^{2+}$ binding to Synaptotagmin-1 C2A/C2B domains (Dodge & Rahamimoff 1967; `computeReleaseProbability`, `lean/Solution.lean`).
- **Hole (Finding Class):** A missing check or safeguard along an existing path, allowing a defect to pass unnoticed; close by adding a check and verifying it catches a planted fault.
- **Issue (Finding Class):** A weakness in something that exists — it works and is not wrong, but is unclear, inconsistent, fragile, or hard to maintain.
- **Kernel-Checked:** Mathematical lemma mechanically verified by the Lean 4.35.0 trusted kernel and independent replay checkers (`leanchecker-paranoid`, `lean4lean`, `nanoda_bin`, `con-ron`, `con-leche`).
- **Liquid-Liquid Phase Separation (LLPS):** Demixing of intrinsically disordered synapsin-1 domains into membraneless droplets sequestering reserve synaptic vesicles.
- **Numerical Approximation:** Floating-point (IEEE-754 float64) ODE integration or stochastic Monte Carlo estimate; explicitly distinguished from kernel-checked proofs.
- **Postsynaptic Density (PSD-95):** Dense intracellular scaffold mat situated **strictly beneath** the postsynaptic bilayer, aligned across the cleft with presynaptic release sites.
- **Problem (Finding Class):** External obstacle blocking progress not caused by the repository's own code or artifacts (e.g., upstream 503 quota, missing OS sandbox tool, PoW gate).
- **Shunting Inhibition:** Divisive attenuation of excitatory depolarization when inhibitory GABAergic conductance ($g_I$) opens near or below resting potential ($E_I \le E_L < E_E$), formally proved in `lean/Solution.lean`.
- **SNARE Complex:** Four-helix coiled-coil bundle (VAMP-2, syntaxin-1, SNAP-25; PDB `1N7S`) whose zippering drives vesicle–membrane fusion (`snare.ts`).
- **Synaptic Bouton:** Presynaptic axonal swelling housing neurotransmitter vesicles (374 in rat synaptosomes; 1,500–3,500 in human temporal cortex), active-zone scaffolds, mitochondria, and microtubules.
- **Tau (MAPT):** Microtubule-associated protein binding longitudinally along protofilament crests (`EMD-7769`)—never spiraling around microtubules.
- **Trans-Synaptic Nanocolumn:** Vertical nanoscale alignment of presynaptic RIM1/2 release sites directly across the ~22 nm cleft with postsynaptic PSD-95/AMPAR clusters (Tang et al. 2016).
- **V-ATPase:** Rotary proton pump acidifying synaptic vesicles; native cryo-EM resolved cholesterol decorating the $V_0$ rotor and ATP-hydrolysis/loading-coupled $V_1$ dissociation in rat brain vesicles (Coupland et al., *Science* 2024) alongside the V-ATPase–synaptophysin interface and copy-number topography in mouse vesicles (Wang et al., *Nature* 2024, `EMD-44847`).
