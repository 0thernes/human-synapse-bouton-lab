// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

//! Deterministic biophysical and stochastic Monte Carlo synaptic bouton engine.
//!
//! Cross-validates `@synapse/core` (TypeScript) and `synapse_science.oracle` (Python mpmath)
//! and drives pre-registered multi-seed statistical experiments (`PREREGISTRATION.md`).

use rand::Rng;
use rand_chacha::rand_core::SeedableRng;
use rand_chacha::ChaCha8Rng;
use serde::{Deserialize, Serialize};

pub const K_B_J_PER_K: f64 = 1.380649e-23;
pub const R_GAS_J_MOL_K: f64 = 8.314462618;
pub const FARADAY_C_PER_MOL: f64 = 96485.33212;
pub const HILL_N: f64 = 4.0;
pub const CA_KD_UM: f64 = 15.0;
pub const CA_REST_UM: f64 = 0.08;
pub const LAMBDA_B_NM: f64 = 28.0;
pub const FUSION_BARRIER_KBT: f64 = 28.0;
pub const BOUTON_FREE_ATP: f64 = 1_000_000.0;

#[derive(Debug, Clone, PartialEq)]
pub enum SimError {
    InvalidInput(String),
}

impl std::fmt::Display for SimError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SimError::InvalidInput(msg) => write!(f, "invalid biophysical input: {msg}"),
        }
    }
}

impl std::error::Error for SimError {}

fn check_finite(v: f64, name: &str) -> Result<f64, SimError> {
    if !v.is_finite() {
        return Err(SimError::InvalidInput(format!("{name} must be finite")));
    }
    Ok(v)
}

fn check_non_neg(v: f64, name: &str) -> Result<f64, SimError> {
    check_finite(v, name)?;
    if v < 0.0 {
        return Err(SimError::InvalidInput(format!("{name} must be >= 0")));
    }
    Ok(v)
}

fn check_pos(v: f64, name: &str) -> Result<f64, SimError> {
    check_finite(v, name)?;
    if v <= 0.0 {
        return Err(SimError::InvalidInput(format!("{name} must be > 0")));
    }
    Ok(v)
}

pub fn compute_thermal_energy_pn_nm(temp_c: f64) -> Result<f64, SimError> {
    check_finite(temp_c, "temp_c")?;
    if temp_c < -273.15 {
        return Err(SimError::InvalidInput("temp_c below absolute zero".into()));
    }
    let temp_k = (temp_c + 273.15).max(273.15);
    Ok(K_B_J_PER_K * temp_k * 1e21)
}

pub fn compute_q10_factor(temp_c: f64, q10: f64) -> Result<f64, SimError> {
    check_finite(temp_c, "temp_c")?;
    check_pos(q10, "q10")?;
    Ok(q10.powf((temp_c - 37.0) / 10.0))
}

pub fn compute_local_ca_peak_um(ca_ext_mm: f64, coupling_nm: f64) -> Result<f64, SimError> {
    check_non_neg(ca_ext_mm, "ca_ext_mm")?;
    check_pos(coupling_nm, "coupling_nm")?;
    let d_safe = coupling_nm.max(5.0);
    let ca_ratio = ca_ext_mm.max(0.1) / 2.0;
    Ok(CA_REST_UM + ((1060.0 * ca_ratio) / d_safe) * (-d_safe / LAMBDA_B_NM).exp())
}

pub fn compute_release_probability(ca_local_um: f64) -> Result<f64, SimError> {
    check_non_neg(ca_local_um, "ca_local_um")?;
    let cn = ca_local_um.powf(HILL_N);
    let kdn = CA_KD_UM.powf(HILL_N);
    Ok(if cn + kdn > 0.0 { cn / (cn + kdn) } else { 0.0 })
}

pub fn compute_cleft_glu_peak_mm(
    fused_vesicles: f64,
    cleft_width_nm: f64,
    nanocolumn_offset_nm: f64,
) -> Result<f64, SimError> {
    check_non_neg(fused_vesicles, "fused_vesicles")?;
    check_pos(cleft_width_nm, "cleft_width_nm")?;
    check_non_neg(nanocolumn_offset_nm, "nanocolumn_offset_nm")?;
    if fused_vesicles <= 0.0 {
        return Ok(0.0);
    }
    let w_safe = cleft_width_nm.max(10.0);
    let sigma_diff_nm = 42.0;
    Ok(fused_vesicles
        * 1.62
        * (22.0 / w_safe)
        * (-(nanocolumn_offset_nm * nanocolumn_offset_nm) / (2.0 * sigma_diff_nm * sigma_diff_nm))
            .exp())
}

pub fn compute_peak_epsc_pa(glu_peak_mm: f64, temp_c: f64) -> Result<f64, SimError> {
    check_non_neg(glu_peak_mm, "glu_peak_mm")?;
    check_finite(temp_c, "temp_c")?;
    if glu_peak_mm <= 0.0 {
        return Ok(0.0);
    }
    let g = glu_peak_mm.powf(1.6);
    let k = 0.55_f64.powf(1.6);
    let p_open = g / (g + k);
    Ok(-38.5 * p_open * compute_q10_factor(temp_c, 1.4)?)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EiBalanceResult {
    pub e_cl_mv: f64,
    pub v_steady_mv: f64,
    pub shunting_ratio: f64,
}

pub fn compute_ei_balance(
    g_exc_ns: f64,
    g_inh_ns: f64,
    cl_in_mm: f64,
    cl_out_mm: f64,
    temp_c: f64,
) -> Result<EiBalanceResult, SimError> {
    check_non_neg(g_exc_ns, "g_exc_ns")?;
    check_non_neg(g_inh_ns, "g_inh_ns")?;
    check_pos(cl_in_mm, "cl_in_mm")?;
    check_pos(cl_out_mm, "cl_out_mm")?;
    check_finite(temp_c, "temp_c")?;
    let temp_k = (temp_c + 273.15).max(273.15);
    let rt_over_f_mv = ((R_GAS_J_MOL_K * temp_k) / FARADAY_C_PER_MOL) * 1000.0;
    let e_cl_mv = -rt_over_f_mv * (cl_out_mm.max(1.0) / cl_in_mm.max(0.5)).ln();
    let g_l = 1.0;
    let e_l = -70.0;
    let e_exc = 0.0;
    let g_tot = g_l + g_exc_ns + g_inh_ns;
    let v_steady_mv = (g_l * e_l + g_exc_ns * e_exc + g_inh_ns * e_cl_mv) / g_tot.max(1e-6);
    let v_exc_only = (g_l * e_l + g_exc_ns * e_exc) / (g_l + g_exc_ns).max(1e-6);
    let shunting_ratio = if (v_exc_only - e_l).abs() > 1e-4 {
        (v_steady_mv - e_l) / (v_exc_only - e_l)
    } else {
        1.0
    };
    Ok(EiBalanceResult {
        e_cl_mv,
        v_steady_mv,
        shunting_ratio,
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SnareResult {
    pub total_zip_kbt: f64,
    pub effective_barrier_kbt: f64,
    pub net_drive_kbt: f64,
    pub fusion_delay_ms: f64,
}

pub fn compute_snare_thermodynamics(
    snare_count: f64,
    clamp_energy_kbt: f64,
    syt1_ca_bound: f64,
    temp_c: f64,
) -> Result<SnareResult, SimError> {
    check_finite(snare_count, "snare_count")?;
    check_non_neg(clamp_energy_kbt, "clamp_energy_kbt")?;
    check_non_neg(syt1_ca_bound, "syt1_ca_bound")?;
    check_finite(temp_c, "temp_c")?;
    let n_snare = snare_count.clamp(1.0, 6.0);
    let n_ca = syt1_ca_bound.clamp(0.0, 5.0);
    let total_zip_kbt = n_snare * 11.5;
    let clamp_relief = (n_ca / 5.0) * clamp_energy_kbt;
    let syt1_boost = n_ca * 2.4;
    let effective_barrier_kbt = (FUSION_BARRIER_KBT + (clamp_energy_kbt - clamp_relief)
        - syt1_boost
        - (n_snare - 1.0) * 3.2)
        .max(1.2);
    let net_drive_kbt = total_zip_kbt - effective_barrier_kbt;
    let k0 = 1.5e6 * compute_q10_factor(temp_c, 2.0)?;
    let rate = k0 * (-effective_barrier_kbt).exp();
    let fusion_delay_ms = (1000.0 / rate.max(1e-6)).min(99999.0);
    Ok(SnareResult {
        total_zip_kbt,
        effective_barrier_kbt,
        net_drive_kbt,
        fusion_delay_ms,
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonteCarloTrialSummary {
    pub seed: u64,
    pub n_aps: usize,
    pub coupling_nm: f64,
    pub nanocolumn_offset_nm: f64,
    pub empirical_pr: f64,
    pub mean_abs_epsc_pa: f64,
    pub total_vesicles_fused: usize,
    pub residual_atp_fraction: f64,
    pub classification: String,
}

#[derive(Debug, Clone, Copy)]
pub struct MonteCarloConfig {
    pub seed: u64,
    pub n_aps: usize,
    pub ca_ext_mm: f64,
    pub coupling_nm: f64,
    pub cleft_width_nm: f64,
    pub nanocolumn_offset_nm: f64,
    pub temp_c: f64,
    pub mito_active: bool,
    pub firing_rate_hz: f64,
}

/// Deterministic stochastic Monte Carlo synaptic bouton experiment (ChaCha8Rng, Build Standard B03/B28).
/// Explicitly tagged `numerical_approximation`.
pub fn run_monte_carlo_bouton(cfg: MonteCarloConfig) -> Result<MonteCarloTrialSummary, SimError> {
    let MonteCarloConfig {
        seed,
        n_aps,
        ca_ext_mm,
        coupling_nm,
        cleft_width_nm,
        nanocolumn_offset_nm,
        temp_c,
        mito_active,
        firing_rate_hz,
    } = cfg;
    if n_aps == 0 {
        return Err(SimError::InvalidInput("n_aps must be >= 1".into()));
    }
    check_pos(cleft_width_nm, "cleft_width_nm")?;
    check_non_neg(nanocolumn_offset_nm, "nanocolumn_offset_nm")?;
    check_finite(temp_c, "temp_c")?;
    check_non_neg(firing_rate_hz, "firing_rate_hz")?;
    let mut rng = ChaCha8Rng::seed_from_u64(seed);
    let base_ca = compute_local_ca_peak_um(ca_ext_mm, coupling_nm)?;
    let rrp_cap: usize = 12;
    let mut rrp: usize = rrp_cap;
    let mut released_aps: usize = 0;
    let mut total_fused: usize = 0;
    let mut sum_abs_epsc: f64 = 0.0;

    for _ in 0..n_aps {
        // Channel opening stochastic jitter (+/- 12% around mean nanodomain Ca2+)
        let ca_jitter = 0.88 + 0.24 * rng.gen::<f64>();
        let ca_trial = (base_ca * ca_jitter).max(0.0);
        let pr_vesicle = compute_release_probability(ca_trial)?;
        let mut fused_this_ap = 0usize;
        // Independent RRP release slots (up to 4 active docking sites evaluated per AP)
        let active_slots = rrp.min(4);
        for _ in 0..active_slots {
            if rng.gen::<f64>() < (pr_vesicle * 0.45).min(0.98) {
                fused_this_ap += 1;
            }
        }
        if fused_this_ap > 0 {
            released_aps += 1;
            total_fused += fused_this_ap;
            rrp = rrp.saturating_sub(fused_this_ap);
            // Nanoscale lateral jitter of vesicle release site (+/- 8 nm)
            let offset_jitter = (nanocolumn_offset_nm + (rng.gen::<f64>() - 0.5) * 16.0).max(0.0);
            let glu = compute_cleft_glu_peak_mm(fused_this_ap as f64, cleft_width_nm, offset_jitter)?;
            let epsc = compute_peak_epsc_pa(glu, temp_c)?;
            sum_abs_epsc += epsc.abs();
        }
        // Stochastic RRP replenishment from recycling pool between spikes
        if rrp < rrp_cap && rng.gen::<f64>() < 0.72 {
            rrp += 1;
        }
    }

    // 60-second bioenergetic Poisson burst integration (Rangaraju 2014 + Pulido-Ryan 2021 leak)
    let mut atp = BOUTON_FREE_ATP;
    let synth_per_sec = if mito_active { 950_000.0 } else { 280_000.0 };
    for _sec in 0..60 {
        let rate_jitter = 0.85 + 0.30 * rng.gen::<f64>();
        let burn = 4_000.0 + (firing_rate_hz * rate_jitter) * 32_000.0;
        atp = (atp + synth_per_sec - burn).clamp(0.0, BOUTON_FREE_ATP);
    }

    let empirical_pr = released_aps as f64 / n_aps as f64;
    let mean_abs_epsc_pa = if released_aps > 0 {
        sum_abs_epsc / released_aps as f64
    } else {
        0.0
    };

    Ok(MonteCarloTrialSummary {
        seed,
        n_aps,
        coupling_nm,
        nanocolumn_offset_nm,
        empirical_pr,
        mean_abs_epsc_pa,
        total_vesicles_fused: total_fused,
        residual_atp_fraction: atp / BOUTON_FREE_ATP,
        classification: "numerical_approximation".to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn negative_inputs_rejected() {
        assert!(compute_thermal_energy_pn_nm(-300.0).is_err());
        assert!(compute_thermal_energy_pn_nm(f64::NAN).is_err());
        assert!(compute_local_ca_peak_um(-1.0, 20.0).is_err());
        assert!(compute_local_ca_peak_um(2.0, 0.0).is_err());
        assert!(compute_release_probability(-0.1).is_err());
        assert!(compute_cleft_glu_peak_mm(-1.0, 22.0, 0.0).is_err());
        assert!(run_monte_carlo_bouton(MonteCarloConfig {
            seed: 1000, n_aps: 0, ca_ext_mm: 2.0, coupling_nm: 17.0, cleft_width_nm: 22.0,
            nanocolumn_offset_nm: 0.0, temp_c: 37.0, mito_active: true, firing_rate_hz: 40.0
        }).is_err());
        assert!(run_monte_carlo_bouton(MonteCarloConfig {
            seed: 1000, n_aps: 10, ca_ext_mm: 2.0, coupling_nm: 17.0, cleft_width_nm: 22.0,
            nanocolumn_offset_nm: 0.0, temp_c: 37.0, mito_active: true, firing_rate_hz: -5.0
        }).is_err());
        assert!(run_monte_carlo_bouton(MonteCarloConfig {
            seed: 1000, n_aps: 10, ca_ext_mm: 2.0, coupling_nm: 17.0, cleft_width_nm: 22.0,
            nanocolumn_offset_nm: -1.0, temp_c: 37.0, mito_active: true, firing_rate_hz: 20.0
        }).is_err());
    }

    #[test]
    fn determinism_identical_seed_produces_identical_output() {
        let cfg = MonteCarloConfig {
            seed: 1000, n_aps: 200, ca_ext_mm: 2.0, coupling_nm: 17.0, cleft_width_nm: 22.0,
            nanocolumn_offset_nm: 0.0, temp_c: 37.0, mito_active: true, firing_rate_hz: 40.0,
        };
        let a = run_monte_carlo_bouton(cfg).unwrap();
        let b = run_monte_carlo_bouton(cfg).unwrap();
        assert_eq!(serde_json::to_string(&a).unwrap(), serde_json::to_string(&b).unwrap());
    }

    #[test]
    fn numeric_edge_values_stable() {
        assert_eq!(compute_release_probability(0.0).unwrap(), 0.0);
        assert!((compute_release_probability(15.0).unwrap() - 0.5).abs() < 1e-12);
        assert_eq!(compute_cleft_glu_peak_mm(0.0, 22.0, 0.0).unwrap(), 0.0);
        assert_eq!(compute_peak_epsc_pa(0.0, 37.0).unwrap(), 0.0);
    }

    #[test]
    fn lean_exported_vectors_match_rust_engine() {
        let manifest_dir = std::path::Path::new(env!("CARGO_MANIFEST_DIR"));
        let vec_path = manifest_dir.join("../../data/lean_engine_vectors.json");
        let raw = std::fs::read_to_string(&vec_path)
            .expect("data/lean_engine_vectors.json must exist (exported by lean/ExportVectors.lean)");
        let data: serde_json::Value = serde_json::from_str(&raw).expect("valid Lean vector JSON");

        for row in data["hill4"].as_array().expect("hill4 array") {
            let c = row["c"].as_f64().unwrap();
            let num = row["num"].as_f64().unwrap();
            let den = row["den"].as_f64().unwrap();
            let got = compute_release_probability(c).unwrap();
            assert!((got - num / den).abs() < 1e-12, "Hill4 mismatch at c={c}");
        }

        for row in data["snare"].as_array().expect("snare array") {
            let n_snare = row["nSnare"].as_f64().unwrap();
            let n_ca = row["nCa"].as_f64().unwrap();
            let clamp = row["clampTenth"].as_f64().unwrap() / 10.0;
            let zip_exp = row["zipTenth"].as_f64().unwrap() / 10.0;
            let bar_exp = row["effBarrier50"].as_f64().unwrap() / 50.0;
            let res = compute_snare_thermodynamics(n_snare, clamp, n_ca, 37.0).unwrap();
            assert!((res.total_zip_kbt - zip_exp).abs() < 1e-12);
            assert!((res.effective_barrier_kbt - bar_exp).abs() < 1e-12);
        }
    }

    proptest! {
        #![proptest_config(ProptestConfig::with_cases(1000))]
        #[test]
        fn prop_hill4_monotone_and_bounded(c in 0.0_f64..400.0, d in 0.001_f64..100.0) {
            let p1 = compute_release_probability(c).unwrap();
            let p2 = compute_release_probability(c + d).unwrap();
            prop_assert!((0.0..1.0).contains(&p1));
            prop_assert!(p2 >= p1);
        }

        #[test]
        fn prop_ei_shunting_bounded(g_exc in 0.1_f64..50.0, g_inh in 0.1_f64..50.0) {
            let res = compute_ei_balance(g_exc, g_inh, 7.0, 125.0, 37.0).unwrap();
            prop_assert!(res.v_steady_mv >= res.e_cl_mv - 1e-9);
            prop_assert!(res.v_steady_mv <= 1e-9);
            prop_assert!(res.shunting_ratio < 1.0);
        }
    }
}
