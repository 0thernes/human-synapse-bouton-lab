# Parking Lot: Future Ideas Outside Current Scope (`ideas.md`)

Out-of-scope ideas captured during `P0`–`P11` so `v1.x` stays focused and verifiable (`P0.F4`, `AI02`).

1. **Meshed 3D Brownian Particle Reaction–Diffusion (`MCell4` / `BioNetGen`):** Compare stationary Naraghi–Neher `Ca2+` nanodomains directly against discrete 3D spatial stochastic trajectories inside reconstructed human L1/L4/L5 bouton meshes.
2. **Validated Interval-Arithmetic ODE Enclosure in Lean 4:** Formalize certified bounds on the 4D Hodgkin–Huxley action potential ODE inside Lean 4 (moving `solveHodgkinHuxleyRK4` beyond `numerical_approximation`).
3. **External Workstation Atomic 16K PDB/EMDB/cellPACK + Blender Render Pipeline:** Render verified cryo-EM structures (V-ATPase `Wang et al. 2024`, microtubule–tau `Kellogg et al. 2018`, SNARE/Syt1) as companion visual plates with PDB accession provenance.
4. **WebAssembly (`wasm32`) Compilation of `rust/synapse-sim`:** Compile the Rust `ChaCha8Rng` Monte Carlo engine to WASM so the static GitHub Pages workbench can run 5,000-AP sweeps directly in the browser at native speed without a local FastAPI server.
5. **Multi-Bouton Recurrent Microcircuit Extension:** Couple 100–1,000 parameterized boutons with STDP, astrocytic glutamate clearance, and metabolic ATP sharing to test energy-constrained recurrent binding hypotheses.
6. **External Independent Replication Bounty / Peer Community In Submission:** Solicit unaffiliated computational neuroscientists to execute `REPLICATION.md` and file signed replication reports via `.github/ISSUE_TEMPLATE/replication.yml`.
