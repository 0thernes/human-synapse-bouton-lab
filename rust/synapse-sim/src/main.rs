// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

use std::env;
use std::time::Instant;
use synapse_sim::{
    compute_cleft_glu_peak_mm, compute_ei_balance, compute_local_ca_peak_um, compute_peak_epsc_pa,
    compute_release_probability, compute_snare_thermodynamics, compute_thermal_energy_pn_nm,
    run_monte_carlo_bouton, MonteCarloConfig,
};

fn main() {
    let args: Vec<String> = env::args().collect();
    let mode = args.get(1).map(String::as_str).unwrap_or("help");

    match mode {
        "vectors" => {
            let ca_list = [5.0, 15.0, 25.0, 35.0];
            let mut rows = Vec::new();
            for (idx, &ca) in ca_list.iter().enumerate() {
                let d = 10.0 + (idx as f64) * 15.0;
                let ca_peak = compute_local_ca_peak_um(2.0, d).unwrap();
                let pr = compute_release_probability(ca).unwrap();
                let glu = compute_cleft_glu_peak_mm(1.0, 22.0, (idx as f64) * 20.0).unwrap();
                let epsc = compute_peak_epsc_pa(glu, 37.0).unwrap();
                let ei = compute_ei_balance(3.0, 4.0, 7.0, 125.0, 37.0).unwrap();
                let snare = compute_snare_thermodynamics(4.0, 15.0, 5.0, 37.0).unwrap();
                rows.push(serde_json::json!({
                    "index": idx,
                    "ca_peak_um": ca_peak,
                    "pr": pr,
                    "glu_mm": glu,
                    "epsc_pa": epsc,
                    "v_steady_mv": ei.v_steady_mv,
                    "snare_barrier_kbt": snare.effective_barrier_kbt,
                    "kbt_37": compute_thermal_energy_pn_nm(37.0).unwrap()
                }));
            }
            println!("{}", serde_json::to_string_pretty(&rows).unwrap());
        }
        "sweep" => {
            let mut results = Vec::new();
            let base = |seed: u64, coupling: f64, offset: f64, mito: bool, rate_hz: f64| MonteCarloConfig {
                seed, n_aps: 200, ca_ext_mm: 2.0, coupling_nm: coupling, cleft_width_nm: 22.0,
                nanocolumn_offset_nm: offset, temp_c: 37.0, mito_active: mito, firing_rate_hz: rate_hz,
            };
            for seed in 1000..1030 {
                let h1_treat = run_monte_carlo_bouton(base(seed, 17.0, 0.0, true, 40.0)).unwrap();
                let h1_ctrl = run_monte_carlo_bouton(base(seed, 17.0, 80.0, true, 40.0)).unwrap();
                let h2_ctrl = run_monte_carlo_bouton(base(seed, 60.0, 0.0, true, 40.0)).unwrap();
                let h3_ctrl = run_monte_carlo_bouton(base(seed, 17.0, 0.0, false, 40.0)).unwrap();
                let h3b_mito = run_monte_carlo_bouton(base(seed, 17.0, 0.0, true, 20.0)).unwrap();
                let h3b_glyc = run_monte_carlo_bouton(base(seed, 17.0, 0.0, false, 20.0)).unwrap();
                let h4_null = run_monte_carlo_bouton(base(seed + 1000, 17.0, 0.0, true, 40.0)).unwrap();
                results.push(serde_json::json!({
                    "seed": seed,
                    "h1_aligned_epsc_pa": h1_treat.mean_abs_epsc_pa,
                    "h1_misaligned_epsc_pa": h1_ctrl.mean_abs_epsc_pa,
                    "h2_nanodomain_pr": h1_treat.empirical_pr,
                    "h2_microdomain_pr": h2_ctrl.empirical_pr,
                    "h3_mito_atp_frac": h1_treat.residual_atp_fraction,
                    "h3_glycolysis_atp_frac": h3_ctrl.residual_atp_fraction,
                    "h3b_exploratory_20hz_mito_atp_frac": h3b_mito.residual_atp_fraction,
                    "h3b_exploratory_20hz_glyc_atp_frac": h3b_glyc.residual_atp_fraction,
                    "h4_null_arm_b_epsc_pa": h4_null.mean_abs_epsc_pa
                }));
            }
            println!("{}", serde_json::to_string_pretty(&results).unwrap());
        }
        "bench" => {
            // Warmup (3 runs) + 10 timed runs (Build Standard B26)
            let mk = |seed: u64| MonteCarloConfig {
                seed, n_aps: 5000, ca_ext_mm: 2.0, coupling_nm: 17.0, cleft_width_nm: 22.0,
                nanocolumn_offset_nm: 0.0, temp_c: 37.0, mito_active: true, firing_rate_hz: 40.0,
            };
            for _ in 0..3 {
                let _ = run_monte_carlo_bouton(mk(1000)).unwrap();
            }
            let mut times_ms = Vec::new();
            let mut checksum = 0.0_f64;
            for r in 0..10 {
                let t0 = Instant::now();
                let s = run_monte_carlo_bouton(mk(1000 + r)).unwrap();
                let elapsed = t0.elapsed().as_secs_f64() * 1000.0;
                checksum += s.mean_abs_epsc_pa;
                times_ms.push(elapsed);
            }
            times_ms.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let median = (times_ms[4] + times_ms[5]) / 2.0;
            let iqr = times_ms[7] - times_ms[2];
            println!(
                "{}",
                serde_json::to_string_pretty(&serde_json::json!({
                    "workload": "5000_action_potentials_x_10_runs",
                    "runs": 10,
                    "median_ms": median,
                    "iqr_ms": iqr,
                    "min_ms": times_ms[0],
                    "max_ms": times_ms[9],
                    "checksum": checksum,
                    "raw_ms": times_ms
                }))
                .unwrap()
            );
        }
        "differential" => {
            use std::io::Read;
            let mut input = String::new();
            std::io::stdin().read_to_string(&mut input).unwrap();
            let cases: Vec<serde_json::Value> = serde_json::from_str(&input).unwrap();
            let mut out = Vec::with_capacity(cases.len());
            for c in &cases {
                let ca_ext = c["ca_ext_mm"].as_f64().unwrap();
                let coupling = c["coupling_nm"].as_f64().unwrap();
                let cleft = c["cleft_width_nm"].as_f64().unwrap();
                let offset = c["offset_nm"].as_f64().unwrap();
                let temp = c["temp_c"].as_f64().unwrap();
                let g_exc = c["g_exc_ns"].as_f64().unwrap();
                let g_inh = c["g_inh_ns"].as_f64().unwrap();
                let n_snare = c["n_snare"].as_f64().unwrap();
                let n_ca = c["n_ca"].as_f64().unwrap();
                let ca_peak = compute_local_ca_peak_um(ca_ext, coupling).unwrap();
                let pr = compute_release_probability(ca_peak).unwrap();
                let glu = compute_cleft_glu_peak_mm(1.0, cleft, offset).unwrap();
                let epsc = compute_peak_epsc_pa(glu, temp).unwrap();
                let ei = compute_ei_balance(g_exc, g_inh, 7.0, 125.0, temp).unwrap();
                let snare = compute_snare_thermodynamics(n_snare, 15.0, n_ca, temp).unwrap();
                out.push(serde_json::json!({
                    "ca_peak_um": ca_peak,
                    "pr": pr,
                    "glu_mm": glu,
                    "epsc_pa": epsc,
                    "v_steady_mv": ei.v_steady_mv,
                    "snare_barrier_kbt": snare.effective_barrier_kbt
                }));
            }
            println!("{}", serde_json::to_string(&out).unwrap());
        }
        _ => {
            println!("synapse-sim v1.0.0 — Usage: synapse-sim <vectors|sweep|bench|differential>");
        }
    }
}
