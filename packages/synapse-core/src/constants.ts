// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

export interface BoutonSpeciesPreset {
  id: 'rat_wilhelm_2014' | 'human_l1_elife_2024' | 'human_l4_elife_2019' | 'human_l5_ijms_2020';
  label: string;
  species: 'Rattus norvegicus' | 'Homo sapiens';
  layer: string;
  activeZoneAreaUm2: number;
  rrpMax: number;
  recyclingMax: number;
  reserveMax: number;
  totalVesicles: number;
  citation: string;
}

export interface LipidCompositionEntry {
  lipid: string;
  molPercent: number;
  speciesPreparation: string;
  biophysicalRole: string;
  citation: string;
}

export interface LiteratureReference {
  id: number;
  authors: string;
  year: number;
  title: string;
  venue: string;
  identifier: string;
  url: string;
  tier: 'peer-reviewed' | 'preprint' | 'dataset-portal' | 'textbook-reference';
}

export const CONSTANTS = {
  // Exact CODATA 2018/2022 SI physical constants
  K_B_J_PER_K: 1.380649e-23,
  R_GAS_J_MOL_K: 8.314462618,
  FARADAY_C_PER_MOL: 96485.33212,

  // Nanoscale synaptic bouton parameters (Wilhelm et al. 2014 rat synaptosome baseline)
  VESICLE_DIAMETER_NM: 41,
  VESICLE_CAPACITANCE_AF: 65,
  BOUTON_VESICLE_TOTAL: 374,
  RRP_MAX: 12,
  RECYCLING_MAX: 62,
  RESERVE_MAX: 300,

  // Ca2+ nanodomain & release cooperativity (illustrative model parameters)
  HILL_N: 4.0,
  CA_KD_UM: 15.0,
  CA_REST_UM: 0.08,
  LAMBDA_B_NM: 28,
  AMPAR_ECR_NM: 13.0,
  CLEFT_DEFAULT_NM: 22.0,
  DEBYE_LENGTH_NM: 0.79,

  // SNARE thermodynamics & local ATP bioenergetics (author's illustrative model constants)
  SNARE_ZIP_KBT: 52.0,
  FUSION_BARRIER_KBT: 28.0,
  BOUTON_FREE_ATP: 1_000_000,
  KINESIN_STEP_NM: 8.0,
  KINESIN_DEFAULT_RATE_HZ: 85.0,
} as const;

export const BOUTON_PRESETS: readonly BoutonSpeciesPreset[] = [
  {
    id: 'rat_wilhelm_2014',
    label: 'Rat Synaptosome (Wilhelm 2014 Baseline)',
    species: 'Rattus norvegicus',
    layer: 'Cortical synaptosome',
    activeZoneAreaUm2: 0.08,
    rrpMax: 12,
    recyclingMax: 62,
    reserveMax: 300,
    totalVesicles: 374,
    citation: 'Wilhelm et al., Science 344:1023–1028 (2014)',
  },
  {
    id: 'human_l1_elife_2024',
    label: 'Human Temporal Cortex Layer 1 (eLife 2025)',
    species: 'Homo sapiens',
    layer: 'Temporal neocortex L1',
    activeZoneAreaUm2: 0.2,
    rrpMax: 20,
    recyclingMax: 480,
    reserveMax: 3000,
    totalVesicles: 3500,
    citation: 'Rollenhagen et al., eLife 13:RP99473 (2025, DOI:10.7554/eLife.99473)',
  },
  {
    id: 'human_l4_elife_2019',
    label: 'Human Temporal Cortex Layer 4 (eLife 2019)',
    species: 'Homo sapiens',
    layer: 'Temporal neocortex L4',
    activeZoneAreaUm2: 0.13,
    rrpMax: 14,
    recyclingMax: 286,
    reserveMax: 1500,
    totalVesicles: 1800,
    citation: 'Yakoubi, Rollenhagen et al., eLife 8:e48373 (2019)',
  },
  {
    id: 'human_l5_ijms_2020',
    label: 'Human Temporal Cortex Layer 5 (IJMS 2020)',
    species: 'Homo sapiens',
    layer: 'Temporal neocortex L5',
    activeZoneAreaUm2: 0.3,
    rrpMax: 16,
    recyclingMax: 234,
    reserveMax: 1250,
    totalVesicles: 1500,
    citation: 'Rollenhagen et al., IJMS 21(15):5558 (2020)',
  },
];

/**
 * Synaptic vesicle lipid composition from marine ray electric organ (Narcine brasiliensis;
 * Deutsch & Kelly 1981). Explicitly tagged by species/preparation — NOT human cortical data.
 */
export const VESICLE_LIPIDOME: readonly LipidCompositionEntry[] = [
  {
    lipid: 'Cholesterol',
    molPercent: 33.3,
    speciesPreparation: 'Narcine brasiliensis electric organ SVs (Deutsch & Kelly 1981); rat brain SV V-ATPase rotor decoration (Coupland et al. 2024 Science)',
    biophysicalRole: 'Tunes bilayer thickness, negative intrinsic curvature, lowers hemifusion stalk barrier, and decorates the V-ATPase V0 rotor.',
    citation: 'Deutsch & Kelly (1981) DOI:10.1021/bi00505a024; Coupland et al. (2024) Science DOI:10.1126/science.adp5577',
  },
  {
    lipid: 'Phosphatidylcholine (PC)',
    molPercent: 32.3,
    speciesPreparation: 'Narcine brasiliensis electric organ SVs',
    biophysicalRole: 'Cylindrical structural bulk matrix stabilizing ~42 nm outer leaflet curvature.',
    citation: 'Deutsch & Kelly (1981) DOI:10.1021/bi00505a024',
  },
  {
    lipid: 'Phosphatidylethanolamine (PE)',
    molPercent: 20.5,
    speciesPreparation: 'Narcine brasiliensis electric organ SVs',
    biophysicalRole: 'Cone-shaped phospholipid promoting fusion stalk curvature and rapid membrane remodeling.',
    citation: 'Deutsch & Kelly (1981) DOI:10.1021/bi00505a024',
  },
  {
    lipid: 'Phosphatidylserine (PS)',
    molPercent: 6.1,
    speciesPreparation: 'Narcine brasiliensis electric organ SVs',
    biophysicalRole: 'Anionic cytoplasmic headgroup coordinating Ca2+-bound Synaptotagmin-1 C2A/C2B loops.',
    citation: 'Deutsch & Kelly (1981) DOI:10.1021/bi00505a024',
  },
  {
    lipid: 'Sphingomyelin',
    molPercent: 3.0,
    speciesPreparation: 'Narcine brasiliensis electric organ SVs',
    biophysicalRole: 'Cholesterol-associated microdomains partitioning vesicle membrane proteins.',
    citation: 'Deutsch & Kelly (1981) DOI:10.1021/bi00505a024',
  },
];

export const LITERATURE_LEDGER: readonly LiteratureReference[] = [
  {
    id: 1,
    authors: 'Wilhelm BG, Mandad S, Truckenbrodt S, et al.',
    year: 2014,
    title: 'Composition of isolated synaptic boutons reveals the amounts of vesicle trafficking proteins',
    venue: 'Science 344(6187):1023–1028',
    identifier: 'DOI:10.1126/science.1252884',
    url: 'https://doi.org/10.1126/science.1252884',
    tier: 'peer-reviewed',
  },
  {
    id: 2,
    authors: 'Yakoubi R, Rollenhagen A, von Lehe M, Miller D, Walkenfort B, Hasenberg M, Sätzler K, Lübke JHR',
    year: 2019,
    title: 'Ultrastructural heterogeneity of layer 4 excitatory synaptic boutons in the adult human temporal lobe neocortex',
    venue: 'eLife 8:e48373',
    identifier: 'DOI:10.7554/eLife.48373',
    url: 'https://doi.org/10.7554/eLife.48373',
    tier: 'peer-reviewed',
  },
  {
    id: 3,
    authors: 'Rollenhagen A, Sadeghi A, Walkenfort B, Hilgetag CC, Sätzler K, Lübke JHR',
    year: 2025,
    title: 'Ultrastructural sublaminar-specific diversity of excitatory synaptic boutons in layer 1 of the adult human temporal lobe neocortex',
    venue: 'eLife 13:RP99473',
    identifier: 'DOI:10.7554/eLife.99473',
    url: 'https://doi.org/10.7554/eLife.99473',
    tier: 'peer-reviewed',
  },
  {
    id: 4,
    authors: 'Rollenhagen A, Walkenfort B, Yakoubi R, et al.',
    year: 2020,
    title: 'Synaptic Organization of the Human Temporal Lobe Neocortex as Revealed by High-Resolution Transmission, Focused Ion Beam Scanning, and Electron Microscopic Tomography',
    venue: 'IJMS 21(15):5558',
    identifier: 'DOI:10.3390/ijms21155558',
    url: 'https://doi.org/10.3390/ijms21155558',
    tier: 'peer-reviewed',
  },
  {
    id: 5,
    authors: 'Shapson-Coe A, Januszewski M, Berger DR, et al.',
    year: 2024,
    title: 'A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution',
    venue: 'Science 384(6696):eadk4858',
    identifier: 'DOI:10.1126/science.adk4858',
    url: 'https://doi.org/10.1126/science.adk4858',
    tier: 'peer-reviewed',
  },
  {
    id: 6,
    authors: 'Coupland CE, Karimi R, Bueler SA, et al. (Rubinstein lab)',
    year: 2024,
    title: 'High-resolution electron cryomicroscopy of V-ATPase in native synaptic vesicles',
    venue: 'Science 385(6705):168–174 (rat brain SVs; cholesterol-decorated V0 rotor & loading-coupled V1 loss)',
    identifier: 'DOI:10.1126/science.adp5577',
    url: 'https://doi.org/10.1126/science.adp5577',
    tier: 'peer-reviewed',
  },
  {
    id: 7,
    authors: 'Wang C, Jiang W, Leitz J, et al. (Brunger lab)',
    year: 2024,
    title: 'Structure and topography of the synaptic V-ATPase–synaptophysin complex',
    venue: 'Nature 631:899–904 (mouse SVs; V-ATPase–synaptophysin interface & copy-number topography; EMD-44847)',
    identifier: 'DOI:10.1038/s41586-024-07610-x',
    url: 'https://doi.org/10.1038/s41586-024-07610-x',
    tier: 'peer-reviewed',
  },
  {
    id: 8,
    authors: 'Kellogg EH, Hejab NMA, Poepsel S, et al.',
    year: 2018,
    title: 'Near-atomic model of microtubule-tau interactions',
    venue: 'Science 360(6394):1242–1246 (EMD-7769)',
    identifier: 'DOI:10.1126/science.aat1780',
    url: 'https://doi.org/10.1126/science.aat1780',
    tier: 'peer-reviewed',
  },
  {
    id: 9,
    authors: 'Liao YC, Fernandopulle MS, Wang G, et al.',
    year: 2019,
    title: 'RNA Granules Hitchhike on Lysosomes for Long-Distance Transport, Using Annexin A11 as a Molecular Tether',
    venue: 'Cell 179(1):147–164',
    identifier: 'DOI:10.1016/j.cell.2019.08.050',
    url: 'https://doi.org/10.1016/j.cell.2019.08.050',
    tier: 'peer-reviewed',
  },
  {
    id: 10,
    authors: 'De Pace R, Ghosh S, Ryan VH, et al.',
    year: 2024,
    title: 'Messenger RNA transport on lysosomal vesicles maintains axonal mitochondrial homeostasis and prevents axonal degeneration',
    venue: 'Nature Neuroscience 27:1087–1102',
    identifier: 'DOI:10.1038/s41593-024-01619-1',
    url: 'https://doi.org/10.1038/s41593-024-01619-1',
    tier: 'peer-reviewed',
  },
  {
    id: 11,
    authors: 'Deutsch JW, Kelly RB',
    year: 1981,
    title: 'Lipids of synaptic vesicles: relevance to the mechanism of membrane fusion (Narcine brasiliensis electric organ)',
    venue: 'Biochemistry 20(2):378–385',
    identifier: 'DOI:10.1021/bi00505a024',
    url: 'https://doi.org/10.1021/bi00505a024',
    tier: 'peer-reviewed',
  },
  {
    id: 12,
    authors: 'Pulido C, Ryan TA',
    year: 2021,
    title: 'Synaptic vesicle pools are a major hidden resting metabolic burden of nerve terminals',
    venue: 'Science Advances 7(49):eabi9027',
    identifier: 'DOI:10.1126/sciadv.abi9027',
    url: 'https://doi.org/10.1126/sciadv.abi9027',
    tier: 'peer-reviewed',
  },
  {
    id: 13,
    authors: 'Rangaraju V, Calloway N, Ryan TA',
    year: 2014,
    title: 'Activity-driven local ATP synthesis is required for synaptic function',
    venue: 'Cell 156(4):825–835',
    identifier: 'DOI:10.1016/j.cell.2013.12.042',
    url: 'https://doi.org/10.1016/j.cell.2013.12.042',
    tier: 'peer-reviewed',
  },
  {
    id: 14,
    authors: 'Milovanovic D, Wu Y, Bian X, De Camilli P',
    year: 2018,
    title: 'A liquid phase of synapsin and lipid vesicles',
    venue: 'Science 361(6402):604–607',
    identifier: 'DOI:10.1126/science.aat5671',
    url: 'https://doi.org/10.1126/science.aat5671',
    tier: 'peer-reviewed',
  },
  {
    id: 15,
    authors: 'Dong M, Masuyer G, Stenmark P',
    year: 2019,
    title: 'Botulinum and Tetanus Neurotoxins',
    venue: 'Annual Review of Biochemistry 88:811–837',
    identifier: 'DOI:10.1146/annurev-biochem-013118-111654',
    url: 'https://doi.org/10.1146/annurev-biochem-013118-111654',
    tier: 'peer-reviewed',
  },
  {
    id: 16,
    authors: 'Reinhardt SCM, Masullo LA, Baudrexel I, et al.',
    year: 2023,
    title: 'Ångström-resolution fluorescence microscopy',
    venue: 'Nature 617:711–716',
    identifier: 'DOI:10.1038/s41586-023-05925-9',
    url: 'https://doi.org/10.1038/s41586-023-05925-9',
    tier: 'peer-reviewed',
  },
  {
    id: 17,
    authors: 'Xu W, Nathwani B, Lin C, Wang J, Karatekin E, Pincet F, Shih W, Rothman JE',
    year: 2016,
    title: 'A Programmable DNA Origami Platform to Organize SNAREs for Membrane Fusion',
    venue: 'JACS 138(13):4439–4447',
    identifier: 'DOI:10.1021/jacs.5b13107',
    url: 'https://doi.org/10.1021/jacs.5b13107',
    tier: 'peer-reviewed',
  },
  {
    id: 18,
    authors: 'Dodge FA, Rahamimoff R',
    year: 1967,
    title: 'Co-operative action of calcium ions in transmitter release at the neuromuscular junction',
    venue: 'The Journal of Physiology 193(2):419–432',
    identifier: 'DOI:10.1113/jphysiol.1967.sp008367',
    url: 'https://doi.org/10.1113/jphysiol.1967.sp008367',
    tier: 'peer-reviewed',
  },
  {
    id: 19,
    authors: 'Tsodyks M, Pawelzik K, Markram H',
    year: 1998,
    title: 'Neural Networks with Dynamic Synapses',
    venue: 'Neural Computation 10(4):821–835',
    identifier: 'DOI:10.1162/089976698300017502',
    url: 'https://doi.org/10.1162/089976698300017502',
    tier: 'peer-reviewed',
  },
  {
    id: 20,
    authors: 'Naraghi M, Neher E',
    year: 1997,
    title: 'Linearized Buffered Ca2+ Diffusion in Microdomains and Its Implications for Calculation of [Ca2+] at the Mouth of a Calcium Channel',
    venue: 'The Journal of Neuroscience 17(18):6961–6973',
    identifier: 'DOI:10.1523/JNEUROSCI.17-18-06961.1997',
    url: 'https://doi.org/10.1523/JNEUROSCI.17-18-06961.1997',
    tier: 'peer-reviewed',
  },
  {
    id: 21,
    authors: 'Jahr CE, Stevens CF',
    year: 1990,
    title: 'Voltage dependence of NMDA-activated macroscopic conductances predicted by single-channel kinetics',
    venue: 'J Neurosci 10(9):3178–3182',
    identifier: 'DOI:10.1523/JNEUROSCI.10-09-03178.1990',
    url: 'https://doi.org/10.1523/JNEUROSCI.10-09-03178.1990',
    tier: 'peer-reviewed',
  },
  {
    id: 22,
    authors: 'Hodgkin AL, Huxley AF',
    year: 1952,
    title: 'A quantitative description of membrane current and its application to conduction and excitation in nerve',
    venue: 'J Physiol 117(4):500–544',
    identifier: 'DOI:10.1113/jphysiol.1952.sp004764',
    url: 'https://doi.org/10.1113/jphysiol.1952.sp004764',
    tier: 'peer-reviewed',
  },
  {
    id: 23,
    authors: 'Tang AH, Chen H, Li TP, et al.',
    year: 2016,
    title: 'A trans-synaptic nanocolumn aligns neurotransmitter release to receptors',
    venue: 'Nature 536:210–214',
    identifier: 'DOI:10.1038/nature19058',
    url: 'https://doi.org/10.1038/nature19058',
    tier: 'peer-reviewed',
  },
  {
    id: 24,
    authors: 'Watanabe S, Rost BR, Camacho-Pérez M, et al.',
    year: 2013,
    title: 'Ultrafast endocytosis at mouse hippocampal synapses',
    venue: 'Nature 504:242–247',
    identifier: 'DOI:10.1038/nature12809',
    url: 'https://doi.org/10.1038/nature12809',
    tier: 'peer-reviewed',
  },
  {
    id: 25,
    authors: 'Brown EN, Lydic R, Schiff ND',
    year: 2010,
    title: 'General Anesthesia, Sleep, and Coma',
    venue: 'New England Journal of Medicine 363(27):2638–2650',
    identifier: 'DOI:10.1056/NEJMra0808281',
    url: 'https://doi.org/10.1056/NEJMra0808281',
    tier: 'peer-reviewed',
  },
  {
    id: 26,
    authors: 'Bobbin MP, Sharlin S, Feyzishendi P, Dang AH, Wraback CM, Josephson TR',
    year: 2024,
    title: 'Formalizing chemical physics using the Lean theorem prover',
    venue: 'Digital Discovery 3(2):264–280',
    identifier: 'DOI:10.1039/D3DD00077J',
    url: 'https://doi.org/10.1039/D3DD00077J',
    tier: 'peer-reviewed',
  },
];
