# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
Exact arbitrary-precision (50-digit mpmath & Fraction) biophysical reference oracle.

Serves as Build Standard B12 (Reference Implementation as Test Oracle) and eliminates
floating-point illusions (Defensible Playbook Layer 3) across TypeScript and Rust engines.
"""

from __future__ import annotations

from fractions import Fraction
from typing import Any

import mpmath as mp

# 50 decimal digits of precision for transcendental Nernst/GHK/Arrhenius/Gaussian calculations
mp.mp.dps = 50

K_B_EXACT = mp.mpf("1.380649e-23")
R_GAS_EXACT = mp.mpf("8.314462618")
FARADAY_EXACT = mp.mpf("96485.33212")
CA_KD_EXACT = Fraction(15, 1)
CA_REST_EXACT = mp.mpf("0.08")
LAMBDA_B_EXACT = mp.mpf("28")
FUSION_BARRIER_EXACT = mp.mpf("28")
BOUTON_FREE_ATP = 1_000_000


def exact_hill4_fraction(ca_num: int, ca_den: int = 1, kd_num: int = 15, kd_den: int = 1) -> Fraction:
    """Exact rational Hill n=4 release probability P_r = c^4 / (c^4 + Kd^4)."""
    if ca_num < 0 or ca_den <= 0 or kd_num <= 0 or kd_den <= 0:
        raise ValueError("Hill inputs must satisfy c >= 0 and Kd > 0 with positive denominators")
    c = Fraction(ca_num, ca_den)
    kd = Fraction(kd_num, kd_den)
    c4 = c**4
    kd4 = kd**4
    return c4 / (c4 + kd4)


def exact_thermal_energy_pn_nm(temp_c: float) -> mp.mpf:
    if temp_c < -273.15:
        raise ValueError("Temperature cannot be below absolute zero (-273.15 C)")
    temp_k = max(mp.mpf("273.15"), mp.mpf(str(temp_c)) + mp.mpf("273.15"))
    return K_B_EXACT * temp_k * mp.mpf("1e21")


def exact_q10_factor(temp_c: float, q10: float = 2.1) -> mp.mpf:
    if q10 <= 0:
        raise ValueError("q10 must be strictly positive")
    return mp.power(mp.mpf(str(q10)), (mp.mpf(str(temp_c)) - mp.mpf("37")) / mp.mpf("10"))


def exact_local_ca_peak_um(ca_ext_mm: float, coupling_nm: float) -> mp.mpf:
    if ca_ext_mm < 0 or coupling_nm <= 0:
        raise ValueError("ca_ext_mm >= 0 and coupling_nm > 0 required")
    d_safe = max(mp.mpf("5"), mp.mpf(str(coupling_nm)))
    ca_ratio = max(mp.mpf("0.1"), mp.mpf(str(ca_ext_mm))) / mp.mpf("2")
    return CA_REST_EXACT + ((mp.mpf("1060") * ca_ratio) / d_safe) * mp.exp(-d_safe / LAMBDA_B_EXACT)


def exact_release_probability(ca_local_um: float) -> mp.mpf:
    if ca_local_um < 0:
        raise ValueError("ca_local_um must be non-negative")
    c = mp.mpf(str(ca_local_um))
    kd = mp.mpf("15")
    c4 = mp.power(c, 4)
    kd4 = mp.power(kd, 4)
    return c4 / (c4 + kd4)


def exact_cleft_glu_peak_mm(
    fused_vesicles: float, cleft_width_nm: float, nanocolumn_offset_nm: float
) -> mp.mpf:
    if fused_vesicles < 0 or cleft_width_nm <= 0 or nanocolumn_offset_nm < 0:
        raise ValueError("Invalid cleft glutamate inputs")
    if fused_vesicles == 0:
        return mp.mpf("0")
    w_safe = max(mp.mpf("10"), mp.mpf(str(cleft_width_nm)))
    r = mp.mpf(str(nanocolumn_offset_nm))
    sigma = mp.mpf("42")
    return (
        mp.mpf(str(fused_vesicles))
        * mp.mpf("1.62")
        * (mp.mpf("22") / w_safe)
        * mp.exp(-(r * r) / (mp.mpf("2") * sigma * sigma))
    )


def exact_peak_epsc_pa(glu_peak_mm: float, temp_c: float) -> mp.mpf:
    if glu_peak_mm < 0:
        raise ValueError("glu_peak_mm must be non-negative")
    if glu_peak_mm == 0:
        return mp.mpf("0")
    g = mp.power(mp.mpf(str(glu_peak_mm)), mp.mpf("1.6"))
    k = mp.power(mp.mpf("0.55"), mp.mpf("1.6"))
    return mp.mpf("-38.5") * (g / (g + k)) * exact_q10_factor(temp_c, 1.4)


def exact_electrochemistry(
    na_out: float,
    na_in: float,
    k_out: float,
    k_in: float,
    ca_out: float,
    ca_in_um: float,
    cl_out: float,
    cl_in: float,
    p_na_rel: float,
    p_cl_rel: float,
    temp_c: float,
) -> dict[str, float]:
    vals = [na_out, na_in, k_out, k_in, ca_out, ca_in_um, cl_out, cl_in]
    if any(v <= 0 for v in vals) or p_na_rel < 0 or p_cl_rel < 0:
        raise ValueError("Ion concentrations must be > 0 and permeabilities >= 0")
    temp_k = max(mp.mpf("273.15"), mp.mpf(str(temp_c)) + mp.mpf("273.15"))
    rt_f = (R_GAS_EXACT * temp_k / FARADAY_EXACT) * mp.mpf("1000")
    e_na = rt_f * mp.log(max(mp.mpf("0.1"), mp.mpf(str(na_out))) / max(mp.mpf("0.1"), mp.mpf(str(na_in))))
    e_k = rt_f * mp.log(max(mp.mpf("0.1"), mp.mpf(str(k_out))) / max(mp.mpf("0.1"), mp.mpf(str(k_in))))
    ca_in_mm = max(mp.mpf("1e-5"), mp.mpf(str(ca_in_um)) / mp.mpf("1000"))
    e_ca = (rt_f / mp.mpf("2")) * mp.log(max(mp.mpf("0.01"), mp.mpf(str(ca_out))) / ca_in_mm)
    e_cl = -rt_f * mp.log(max(mp.mpf("0.1"), mp.mpf(str(cl_out))) / max(mp.mpf("0.1"), mp.mpf(str(cl_in))))
    num = mp.mpf(str(k_out)) + mp.mpf(str(p_na_rel)) * mp.mpf(str(na_out)) + mp.mpf(str(p_cl_rel)) * mp.mpf(str(cl_in))
    den = mp.mpf(str(k_in)) + mp.mpf(str(p_na_rel)) * mp.mpf(str(na_in)) + mp.mpf(str(p_cl_rel)) * mp.mpf(str(cl_out))
    vm = rt_f * mp.log(max(mp.mpf("1e-6"), num) / max(mp.mpf("1e-6"), den))
    return {
        "eNaMv": float(e_na),
        "eKMv": float(e_k),
        "eCaMv": float(e_ca),
        "eClMv": float(e_cl),
        "vmGhkMv": float(vm),
        "rtOverFMv": float(rt_f),
    }


def exact_ei_balance(
    g_exc_ns: float, g_inh_ns: float, cl_in_mm: float, cl_out_mm: float, temp_c: float
) -> dict[str, Any]:
    if g_exc_ns < 0 or g_inh_ns < 0 or cl_in_mm <= 0 or cl_out_mm <= 0:
        raise ValueError("Invalid E/I balance parameters")
    temp_k = max(mp.mpf("273.15"), mp.mpf(str(temp_c)) + mp.mpf("273.15"))
    rt_f = (R_GAS_EXACT * temp_k / FARADAY_EXACT) * mp.mpf("1000")
    e_cl = -rt_f * mp.log(max(mp.mpf("1"), mp.mpf(str(cl_out_mm))) / max(mp.mpf("0.5"), mp.mpf(str(cl_in_mm))))
    g_l = mp.mpf("1")
    e_l = mp.mpf("-70")
    e_exc = mp.mpf("0")
    g_e = mp.mpf(str(g_exc_ns))
    g_i = mp.mpf(str(g_inh_ns))
    g_tot = g_l + g_e + g_i
    v_steady = (g_l * e_l + g_e * e_exc + g_i * e_cl) / max(mp.mpf("1e-6"), g_tot)
    v_exc_only = (g_l * e_l + g_e * e_exc) / max(mp.mpf("1e-6"), g_l + g_e)
    shunting = (v_steady - e_l) / (v_exc_only - e_l) if abs(v_exc_only - e_l) > mp.mpf("1e-4") else mp.mpf("1")
    return {
        "eClMv": float(e_cl),
        "vSteadyMv": float(v_steady),
        "shuntingRatio": float(shunting),
    }


def exact_snare_thermodynamics(
    snare_count: float, clamp_energy_kbt: float, syt1_ca_bound: float, temp_c: float
) -> dict[str, Any]:
    if clamp_energy_kbt < 0 or syt1_ca_bound < 0:
        raise ValueError("clamp_energy_kbt and syt1_ca_bound must be non-negative")
    n_snare = min(mp.mpf("6"), max(mp.mpf("1"), mp.mpf(str(snare_count))))
    n_ca = min(mp.mpf("5"), max(mp.mpf("0"), mp.mpf(str(syt1_ca_bound))))
    clamp = mp.mpf(str(clamp_energy_kbt))
    total_zip = n_snare * mp.mpf("11.5")
    clamp_relief = (n_ca / mp.mpf("5")) * clamp
    syt1_boost = n_ca * mp.mpf("2.4")
    eff_barrier = max(
        mp.mpf("1.2"),
        FUSION_BARRIER_EXACT + (clamp - clamp_relief) - syt1_boost - (n_snare - mp.mpf("1")) * mp.mpf("3.2"),
    )
    net_drive = total_zip - eff_barrier
    k0 = mp.mpf("1.5e6") * exact_q10_factor(temp_c, 2.0)
    rate = k0 * mp.exp(-eff_barrier)
    delay = min(mp.mpf("99999"), mp.mpf("1000") / max(mp.mpf("1e-6"), rate))
    return {
        "totalZipKbt": float(total_zip),
        "effectiveBarrierKbt": float(eff_barrier),
        "netDriveKbt": float(net_drive),
        "fusionRatePerSec": float(rate),
        "fusionDelayMs": float(delay),
    }


def exact_bioenergetics(
    luminal_ph: float,
    cytosolic_ph: float,
    delta_psi_mv: float,
    firing_rate_hz: float,
    mito_active: bool,
    temp_c: float,
) -> dict[str, Any]:
    if firing_rate_hz < 0:
        raise ValueError("firing_rate_hz must be >= 0")
    temp_k = max(mp.mpf("273.15"), mp.mpf(str(temp_c)) + mp.mpf("273.15"))
    nernst_ph = (mp.mpf("2.302585") * R_GAS_EXACT * temp_k * mp.mpf("1000")) / FARADAY_EXACT
    delta_ph = max(mp.mpf("0"), mp.mpf(str(cytosolic_ph)) - mp.mpf(str(luminal_ph)))
    pmf = mp.mpf(str(delta_psi_mv)) + nernst_ph * delta_ph
    quanta = int(round(float(min(mp.mpf("5500"), max(mp.mpf("200"), (pmf / mp.mpf("145")) * mp.mpf("3200"))))))
    burn = 4000.0 + firing_rate_hz * 32000.0
    synth = 950000.0 if mito_active else 280000.0
    net = burn - synth
    sustain = float("inf") if net <= 0 else BOUTON_FREE_ATP / net
    return {
        "deltaPh": float(delta_ph),
        "pmfMv": float(pmf),
        "estGluQuanta": quanta,
        "atpBurnPerSec": burn,
        "atpSynthPerSec": synth,
        "sustainSeconds": sustain,
    }


def exact_metrology(
    photons: float,
    psf_sigma_nm: float,
    imager_conc_nm: float,
    k_on: float,
    k_off: float,
    spacing_nm: float,
    resi_subsets_k: float,
) -> dict[str, Any]:
    if any(v <= 0 for v in [photons, psf_sigma_nm, imager_conc_nm, k_on, k_off, resi_subsets_k]) or spacing_nm < 0:
        raise ValueError("Metrology parameters must be positive (spacing >= 0)")
    n_safe = max(mp.mpf("10"), mp.mpf(str(photons)))
    sigma_safe = max(mp.mpf("1"), mp.mpf(str(psf_sigma_nm)))
    k_sub = max(mp.mpf("1"), mp.mpf(str(resi_subsets_k)))
    crlb = sigma_safe / mp.sqrt(n_safe)
    resi = crlb / mp.sqrt(k_sub)
    fwhm = mp.mpf("2.35482") * resi
    bright_ms = (mp.mpf("1") / max(mp.mpf("0.05"), mp.mpf(str(k_off)))) * mp.mpf("1000")
    dark_ms = (
        mp.mpf("1")
        / (max(mp.mpf("0.05"), mp.mpf(str(k_on))) * mp.mpf("1e6") * max(mp.mpf("0.01"), mp.mpf(str(imager_conc_nm))) * mp.mpf("1e-9"))
    ) * mp.mpf("1000")
    duty_pct = (bright_ms / (bright_ms + dark_ms)) * mp.mpf("100")
    return {
        "crlbNm": float(crlb),
        "resiNm": float(resi),
        "fwhmNm": float(fwhm),
        "brightTimeMs": float(bright_ms),
        "darkTimeMs": float(dark_ms),
        "dutyCyclePct": float(duty_pct),
        "resolvable": mp.mpf(str(spacing_nm)) >= fwhm,
    }
