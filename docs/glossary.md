# Scientific & Engineering Glossary

Alphabetized definitions linking domain terms, code modules, and Build Standard finding classes (Build Standard A44).

- **Active Zone (AZ):** Specialized presynaptic membrane release launchpad enriched in RIM1/2, Munc13, Bassoon, SNAREs, and $\mathrm{Ca_V2.1}$ channels (`packages/synapse-core/src/electrophysiology.ts`).
- **AMPA / NMDA Receptors:** Postsynaptic ionotropic glutamate channels clustered in liquid-like nanodomains ($7{,}000\text{–}13{,}000/\mu\text{m}^2$); NMDARs require simultaneous glutamate binding and postsynaptic depolarization to relieve $\mathrm{Mg}^{2+}$ block (`computeNmdaMgUnblock`).
- **Annexin A11 (ANXA11) & BORC:** Molecular tether and kinesin-adaptor complex mediating long-distance axonal mRNA granule hitchhiking on LAMP1+ lysosomes (Liao 2019; De Pace 2024).
- **Bug (Finding Class):** Defect in program logic where code runs differently from its specification or intent (requires fix + regression test B07).
- **Conflict (Finding Class):** Two requirements, sources, or rules contradicting each other; resolved via owner precedence rule R8.
- **Cryo-Electron Tomography (Cryo-ET):** 3D tilt-series imaging of vitrified hydrated brain tissue revealing native macromolecular landscapes without chemical stains.
- **Dilemma (Finding Class):** Trade-off between two or more valid design options decided by owner priorities.
- **DNA-PAINT / RESI:** Super-resolution fluorescence microscopy achieving sub-nanometer precision ($\sigma_{\text{RESI}} = \sigma_{\text{PSF}}/\sqrt{N\cdot K}$) via transient imager hybridization and orthogonal sequential subsets (`metrology.ts`, `lean/Solution.lean`).
- **Error (Finding Class):** Wrong artifact or failed execution outside program logic (e.g., wrong number, stale doc, broken link, mismatched version).
- **Hill $n=4$ Cooperativity:** Fourth-power calcium-release relation $P_r(c) = c^4/(c^4 + K_d^4)$ reflecting cooperative $\mathrm{Ca}^{2+}$ binding to Synaptotagmin-1 C2A/C2B domains (`computeReleaseProbability`, `lean/Solution.lean`).
- **Issue (Finding Class):** A gap where something required is missing or incomplete, while nothing present is wrong.
- **Kernel-Checked:** Mathematical theorem mechanically verified by the Lean 4.35.0 trusted kernel and independent replay checkers (`leanchecker-paranoid`, `nanoda_bin`, `con-ron`, `con-leche`).
- **Liquid-Liquid Phase Separation (LLPS):** Demixing of intrinsically disordered synapsin-1 domains into membraneless droplets sequestering reserve synaptic vesicles.
- **Numerical Approximation:** Floating-point (IEEE-754 float64) ODE integration or stochastic Monte Carlo estimate; explicitly distinguished from kernel-checked proofs.
- **Postsynaptic Density (PSD-95):** Dense intracellular scaffold mat situated **strictly beneath** the postsynaptic bilayer, aligned across the cleft with presynaptic release sites.
- **Problem (Finding Class):** External obstacle blocking progress not caused by the repository's own code or artifacts (e.g., upstream 503 quota, missing OS sandbox tool).
- **Shunting Inhibition:** Divisive attenuation of excitatory depolarization when inhibitory GABAergic conductance ($g_I$) opens near or below resting potential ($E_I \le E_L < E_E$), formally proved in `lean/Solution.lean`.
- **SNARE Complex:** Four-helix coiled-coil bundle (VAMP-2, syntaxin-1, SNAP-25; PDB `1N7S`) whose zippering drives vesicle–membrane fusion (`snare.ts`).
- **Synaptic Bouton:** Presynaptic axonal swelling housing neurotransmitter vesicles (374 in rat synaptosomes; 1,500–3,500 in human temporal cortex), active-zone scaffolds, mitochondria, and microtubules.
- **Tau (MAPT):** Microtubule-associated protein binding longitudinally along protofilament crests (`EMD-7769`)—never spiraling around microtubules.
- **Trans-Synaptic Nanocolumn:** Vertical nanoscale alignment of presynaptic RIM1/2 release sites directly across the ~22 nm cleft with postsynaptic PSD-95/AMPAR clusters.
- **V-ATPase:** Rotary proton pump acidifying synaptic vesicles (`EMD-44847`), lubricated by cholesterol and partnered with synaptophysin, with cytoplasmic $V_1$ dissociating after glutamate loading (`bioenergetics.ts`).
