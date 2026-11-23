# SPDX-License-Identifier: Apache-2.0
# Runnable example: 50-digit exact rational & mpmath biophysical oracle check.
# Run: uv run python examples/exact_oracle_example.py

from synapse_science.oracle import (
    exact_electrochemistry,
    exact_hill4_fraction,
    exact_metrology,
    exact_thermal_energy_pn_nm,
)


def main() -> None:
    print("Exact rational Hill n=4 at Kd/3 (5 uM):", exact_hill4_fraction(5, 1, 15, 1))
    print("Exact rational Hill n=4 at Kd   (15 uM):", exact_hill4_fraction(15, 1, 15, 1))
    print("Exact k_B T at 37 C (50 digits):", exact_thermal_energy_pn_nm(37))
    ec = exact_electrochemistry(145, 12, 4, 140, 2, 0.08, 120, 9, 0.04, 0.45, 37)
    print(f"Nernst/GHK at 37 C: E_K={ec['eKMv']:.2f} mV, E_Na=+{ec['eNaMv']:.2f} mV, V_GHK={ec['vmGhkMv']:.2f} mV")
    met = exact_metrology(2500, 110, 2, 2, 5, 3, 9)
    print(f"RESI (K=9): sigma={met['resiNm']:.3f} nm, FWHM={met['fwhmNm']:.3f} nm, 3 nm resolvable={met['resolvable']}")


if __name__ == "__main__":
    main()
