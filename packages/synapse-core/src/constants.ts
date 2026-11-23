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

  // Nanoscale synaptic bouton parameters (Wilhelm et al. 2014 baseline)
  VESICLE_DIAMETER_NM: 41,
  VESICLE_CAPACITANCE_AF: 65,
  BOUTON_VESICLE_TOTAL: 374,
  RRP_MAX: 12,
  RECYCLING_MAX: 62,
  RESERVE_MAX: 300,

  // Ca2+ nanodomain & release cooperativity
  HILL_N: 4.0,
  CA_KD_UM: 15.0,
  CA_REST_UM: 0.08,
  LAMBDA_B_NM: 28,
  AMPAR_ECR_NM: 13.0,
  CLEFT_DEFAULT_NM: 22.0,
  DEBYE_LENGTH_NM: 0.79,

  // SNARE thermodynamics & local ATP bioenergetics
  SNARE_ZIP_KBT: 52.0, // Midpoint of 35–68 kBT
  FUSION_BARRIER_KBT: 28.0, // 20–30 kBT barrier
  BOUTON_FREE_ATP: 1_000_000, // ~10^6 free ATPs/terminal (Rangaraju et al. 2014)
  KINESIN_STEP_NM: 8.0, // Exact 8.0 nm per ATP hydrolyzed
  KINESIN_DEFAULT_RATE_HZ: 85.0, // ~680 nm/s
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
    label: 'Human Temporal Cortex Layer 1 (eLife 2024)',
    species: 'Homo sapiens',
    layer: 'Temporal neocortex L1',
    activeZoneAreaUm2: 0.2,
    rrpMax: 20,
    recyclingMax: 480,
    reserveMax: 3000,
    totalVesicles: 3500,
    citation: 'Rollenhagen et al., eLife reviewed preprint 99473v1 (2024)',
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

export const VESICLE_LIPIDOME: readonly LipidCompositionEntry[] = [
  {
    lipid: 'Cholesterol',
    molPercent: 33.3,
    biophysicalRole: 'Tunes bilayer thickness, negative intrinsic curvature, lowers hemifusion stalk barrier, lubricates V-ATPase V0 rotor.',
    citation: 'Deutsch & Kelly (1981) PubMed 7470487; Yang et al. (2016) PMC4972649; Wang et al. (2024) Science',
  },
  {
    lipid: 'Phosphatidylcholine (PC)',
    molPercent: 32.3,
    biophysicalRole: 'Cylindrical structural bulk matrix stabilizing 42 nm outer leaflet curvature.',
    citation: 'Deutsch & Kelly (1981) PubMed 7470487',
  },
  {
    lipid: 'Phosphatidylethanolamine (PE)',
    molPercent: 20.5,
    biophysicalRole: 'Cone-shaped lipid (60% cytoplasmic leaflet) promoting fusion stalk curvature and ultrafast endocytosis.',
    citation: 'Deutsch & Kelly (1981) PubMed 7470487',
  },
  {
    lipid: 'Phosphatidylserine (PS)',
    molPercent: 6.1,
    biophysicalRole: 'Anionic cytoplasmic headgroup (40% cytosolic) coordinating Ca2+-bound Synaptotagmin-1 C2A/C2B loops.',
    citation: 'Deutsch & Kelly (1981) PubMed 7470487',
  },
  {
    lipid: 'Sphingomyelin',
    molPercent: 3.0,
    biophysicalRole: 'Cholesterol-coupled raft microdomains partitioning SNARE and synaptophysin complexes.',
    citation: 'Deutsch & Kelly (1981) PubMed 7470487',
  },
];

export const LITERATURE_LEDGER: readonly LiteratureReference[] = [
  {
    id: 1,
    authors: 'Wilhelm BG, Mandad S, Truckenbrodt S, et al.',
    year: 2014,
    title: 'Composition of isolated synaptic boutons reveals the amounts of vesicle trafficking proteins',
    venue: 'Science 344(6187):1023–1028',
    identifier: 'PMID:24876496',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24876496/',
    tier: 'peer-reviewed',
  },
  {
    id: 2,
    authors: 'Yakoubi R, Rollenhagen A, et al.',
    year: 2019,
    title: 'Ultrastructural heterogeneity of layer 4 excitatory synaptic boutons in the adult human temporal lobe neocortex',
    venue: 'eLife 8:e48373',
    identifier: 'DOI:10.7554/eLife.48373',
    url: 'https://elifesciences.org/articles/48373',
    tier: 'peer-reviewed',
  },
  {
    id: 3,
    authors: 'Rollenhagen A, et al.',
    year: 2024,
    title: 'Ultrastructural sublaminar-specific diversity of excitatory synaptic boutons in L1 of human temporal lobe neocortex',
    venue: 'eLife Reviewed Preprint',
    identifier: 'eLife:99473v1',
    url: 'https://elifesciences.org/reviewed-preprints/99473v1',
    tier: 'preprint',
  },
  {
    id: 4,
    authors: 'Rollenhagen A, et al.',
    year: 2020,
    title: 'Synaptic Organization of the Human Temporal Lobe Neocortex',
    venue: 'IJMS 21(15):5558',
    identifier: 'DOI:10.3390/ijms21155558',
    url: 'https://www.mdpi.com/1422-0067/21/15/5558',
    tier: 'peer-reviewed',
  },
  {
    id: 5,
    authors: 'Shapson-Coe A, Januszewski M, et al.',
    year: 2024,
    title: 'A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution (H01)',
    venue: 'Science / PMC11718559',
    identifier: 'PMC11718559',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11718559/',
    tier: 'peer-reviewed',
  },
  {
    id: 6,
    authors: 'Wang C, et al.',
    year: 2024,
    title: 'High-resolution electron cryomicroscopy of V-ATPase in native synaptic vesicles',
    venue: 'Science 385(6705):168–174 (EMD-44847)',
    identifier: 'PMID:38900912',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38900912/',
    tier: 'peer-reviewed',
  },
  {
    id: 7,
    authors: 'Kellogg EH, et al.',
    year: 2018,
    title: 'Near-atomic model of microtubule-tau interactions',
    venue: 'Science / PMC6225777 (EMD-7769)',
    identifier: 'PMC6225777',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6225777/',
    tier: 'peer-reviewed',
  },
  {
    id: 8,
    authors: 'Liao YC, et al.',
    year: 2019,
    title: 'RNA Granules Hitchhike on Lysosomes for Long-Distance Transport Using Annexin A11',
    venue: 'Cell / PMC6890474',
    identifier: 'PMC6890474',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6890474/',
    tier: 'peer-reviewed',
  },
  {
    id: 9,
    authors: 'De Pace R, et al.',
    year: 2024,
    title: 'Messenger RNA transport on lysosomal vesicles maintains axonal homeostasis (BORC)',
    venue: 'Nature Neuroscience / PMC11156585',
    identifier: 'PMC11156585',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11156585/',
    tier: 'peer-reviewed',
  },
  {
    id: 10,
    authors: 'Deutsch JW, Kelly RB',
    year: 1981,
    title: 'Lipids of synaptic vesicles: relevance to the mechanism of membrane fusion',
    venue: 'Biochemistry / PubMed 7470487',
    identifier: 'PMID:7470487',
    url: 'https://pubmed.ncbi.nlm.nih.gov/7470487/',
    tier: 'peer-reviewed',
  },
  {
    id: 11,
    authors: 'Pulido C, Ryan TA',
    year: 2021,
    title: 'Synaptic vesicle pools are a major hidden resting metabolic burden of nerve terminals',
    venue: 'Science Advances / PMC8641928',
    identifier: 'PMC8641928',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8641928/',
    tier: 'peer-reviewed',
  },
  {
    id: 12,
    authors: 'Rangaraju V, Calloway N, Ryan TA',
    year: 2014,
    title: 'Activity-driven local ATP synthesis is required for synaptic function',
    venue: 'Cell 156(4):825–835',
    identifier: 'PMID:24529383',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24529383/',
    tier: 'peer-reviewed',
  },
  {
    id: 13,
    authors: 'Milovanovic D, Wu Y, Bian X, De Camilli P',
    year: 2018,
    title: 'A liquid phase of synapsin and lipid vesicles',
    venue: 'Science / PMC6191856',
    identifier: 'PMC6191856',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6191856/',
    tier: 'peer-reviewed',
  },
  {
    id: 14,
    authors: 'Dong M, Masuyer G, Stenmark P',
    year: 2019,
    title: 'Botulinum and Tetanus Neurotoxins',
    venue: 'Annual Review of Biochemistry / PMC7539302',
    identifier: 'PMC7539302',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7539302/',
    tier: 'peer-reviewed',
  },
  {
    id: 15,
    authors: 'Reinhardt SCM, Masullo LA, Baudrexel I, et al.',
    year: 2023,
    title: 'Ångström-resolution fluorescence microscopy (RESI)',
    venue: 'Nature 617:711–716',
    identifier: 'DOI:10.1038/s41586-023-05925-9',
    url: 'https://www.nature.com/articles/s41586-023-05925-9',
    tier: 'peer-reviewed',
  },
  {
    id: 16,
    authors: 'Xu W, Nathwani B, Lin C, et al.',
    year: 2016,
    title: 'A programmable DNA origami platform to organize SNAREs for membrane fusion',
    venue: 'JACS / PMC4950518',
    identifier: 'PMC4950518',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4950518/',
    tier: 'peer-reviewed',
  },
  {
    id: 17,
    authors: 'Jahr CE, Stevens CF',
    year: 1990,
    title: 'Voltage dependence of NMDA-activated macroscopic conductances predicted by single-channel kinetics',
    venue: 'J Neurosci 10(9):3178–3182',
    identifier: 'PMID:1697902',
    url: 'https://pubmed.ncbi.nlm.nih.gov/1697902/',
    tier: 'peer-reviewed',
  },
  {
    id: 18,
    authors: 'Hodgkin AL, Huxley AF',
    year: 1952,
    title: 'A quantitative description of membrane current and its application to conduction and excitation in nerve',
    venue: 'J Physiol 117(4):500–544',
    identifier: 'PMID:12991237',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12991237/',
    tier: 'peer-reviewed',
  },
  {
    id: 19,
    authors: 'Tang AH, Chen H, Li TP, et al.',
    year: 2016,
    title: 'A trans-synaptic nanocolumn aligns neurotransmitter release to receptors',
    venue: 'Nature 536:210–214',
    identifier: 'PMID:27462810',
    url: 'https://pubmed.ncbi.nlm.nih.gov/27462810/',
    tier: 'peer-reviewed',
  },
  {
    id: 20,
    authors: 'Watanabe S, Rost BR, Camacho-Pérez M, et al.',
    year: 2013,
    title: 'Ultrafast endocytosis at mouse hippocampal synapses',
    venue: 'Nature 504:242–247',
    identifier: 'PMID:24305055',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24305055/',
    tier: 'peer-reviewed',
  },
];
