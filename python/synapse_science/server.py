# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""
Full-stack FastAPI backend for human-synapse-bouton-lab.

Provides structured JSON logging (A34), /healthz endpoint, strict Pydantic v2 validation,
and exact-oracle endpoints matching the TypeScript and Rust biophysical kernels (B09).
"""

from __future__ import annotations

import json
import logging
import time
import uuid
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import __version__
from .config import load_settings
from .oracle import (
    exact_bioenergetics,
    exact_cleft_glu_peak_mm,
    exact_ei_balance,
    exact_electrochemistry,
    exact_local_ca_peak_um,
    exact_metrology,
    exact_peak_epsc_pa,
    exact_release_probability,
    exact_snare_thermodynamics,
    exact_thermal_energy_pn_nm,
)


class JsonLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%SZ"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        return json.dumps(payload)


def configure_logging(level: str) -> logging.Logger:
    logger = logging.getLogger("synapse_science.api")
    logger.setLevel(level.upper())
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonLogFormatter())
        logger.addHandler(handler)
    return logger


class ElectrochemistryRequest(BaseModel):
    na_out_mm: float = Field(145.0, gt=0)
    na_in_mm: float = Field(12.0, gt=0)
    k_out_mm: float = Field(4.0, gt=0)
    k_in_mm: float = Field(140.0, gt=0)
    ca_out_mm: float = Field(2.0, gt=0)
    ca_in_um: float = Field(0.08, gt=0)
    cl_out_mm: float = Field(120.0, gt=0)
    cl_in_mm: float = Field(9.0, gt=0)
    p_na_rel: float = Field(0.04, ge=0)
    p_cl_rel: float = Field(0.45, ge=0)
    temp_c: float = Field(37.0, ge=-273.15)


class SnareRequest(BaseModel):
    snare_count: float = Field(4.0, ge=1.0, le=6.0)
    clamp_energy_kbt: float = Field(15.0, ge=0.0, le=40.0)
    syt1_ca_bound: float = Field(5.0, ge=0.0, le=5.0)
    temp_c: float = Field(37.0, ge=-273.15)


class BioenergeticsRequest(BaseModel):
    luminal_ph: float = Field(5.5, ge=1.0, le=14.0)
    cytosolic_ph: float = Field(7.2, ge=1.0, le=14.0)
    delta_psi_mv: float = Field(40.0, ge=-200.0, le=250.0)
    firing_rate_hz: float = Field(10.0, ge=0.0, le=500.0)
    mito_active: bool = True
    temp_c: float = Field(37.0, ge=-273.15)


class NanodomainRequest(BaseModel):
    ca_ext_mm: float = Field(2.0, ge=0.0, le=20.0)
    coupling_nm: float = Field(17.0, gt=0.0, le=500.0)
    fused_vesicles: float = Field(1.0, ge=0.0, le=50.0)
    cleft_width_nm: float = Field(22.0, gt=0.0, le=200.0)
    nanocolumn_offset_nm: float = Field(0.0, ge=0.0, le=500.0)
    temp_c: float = Field(37.0, ge=-273.15)


class EiRequest(BaseModel):
    g_exc_ns: float = Field(3.0, ge=0.0)
    g_inh_ns: float = Field(4.0, ge=0.0)
    cl_in_mm: float = Field(7.0, gt=0.0)
    cl_out_mm: float = Field(125.0, gt=0.0)
    temp_c: float = Field(37.0, ge=-273.15)


class MetrologyRequest(BaseModel):
    photons: float = Field(2500.0, gt=0.0)
    psf_sigma_nm: float = Field(110.0, gt=0.0)
    imager_conc_nm: float = Field(2.0, gt=0.0)
    k_on: float = Field(2.0, gt=0.0)
    k_off: float = Field(5.0, gt=0.0)
    spacing_nm: float = Field(3.0, ge=0.0)
    resi_subsets_k: float = Field(9.0, gt=0.0)


def create_app() -> FastAPI:
    settings = load_settings()
    logger = configure_logging(settings.log_level)

    app = FastAPI(
        title="Human Synapse Bouton Lab API",
        version=__version__,
        description="50-digit exact biophysical oracle and computational neuroscience REST API.",
        license_info={"name": "Apache-2.0", "url": "https://www.apache.org/licenses/LICENSE-2.0"},
    )
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_logging_middleware(request: Request, call_next: Any) -> Any:
        req_id = str(uuid.uuid4())[:8]
        t0 = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        logger.info(
            json.dumps(
                {
                    "req_id": req_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status": response.status_code,
                    "ms": round(elapsed_ms, 2),
                }
            )
        )
        return response

    @app.get("/healthz")
    def healthz() -> dict[str, str]:
        return {"status": "ok", "version": __version__, "oracle_precision_digits": "50"}

    @app.post("/api/v1/electrochemistry")
    def post_electrochemistry(req: ElectrochemistryRequest) -> dict[str, Any]:
        try:
            res = exact_electrochemistry(
                req.na_out_mm,
                req.na_in_mm,
                req.k_out_mm,
                req.k_in_mm,
                req.ca_out_mm,
                req.ca_in_um,
                req.cl_out_mm,
                req.cl_in_mm,
                req.p_na_rel,
                req.p_cl_rel,
                req.temp_c,
            )
            return {"classification": "exact_50digit_oracle", **res}
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    @app.post("/api/v1/nanodomain")
    def post_nanodomain(req: NanodomainRequest) -> dict[str, Any]:
        ca_um = float(exact_local_ca_peak_um(req.ca_ext_mm, req.coupling_nm))
        pr = float(exact_release_probability(ca_um))
        glu_mm = float(
            exact_cleft_glu_peak_mm(req.fused_vesicles, req.cleft_width_nm, req.nanocolumn_offset_nm)
        )
        epsc_pa = float(exact_peak_epsc_pa(glu_mm, req.temp_c))
        kbt = float(exact_thermal_energy_pn_nm(req.temp_c))
        return {
            "classification": "exact_50digit_oracle",
            "localCaPeakUm": ca_um,
            "releaseProbability": pr,
            "cleftGluPeakMm": glu_mm,
            "peakEpscPa": epsc_pa,
            "thermalEnergyPnNm": kbt,
        }

    @app.post("/api/v1/snare")
    def post_snare(req: SnareRequest) -> dict[str, Any]:
        return {
            "classification": "exact_50digit_oracle",
            **exact_snare_thermodynamics(
                req.snare_count, req.clamp_energy_kbt, req.syt1_ca_bound, req.temp_c
            ),
        }

    @app.post("/api/v1/bioenergetics")
    def post_bioenergetics(req: BioenergeticsRequest) -> dict[str, Any]:
        res = exact_bioenergetics(
            req.luminal_ph,
            req.cytosolic_ph,
            req.delta_psi_mv,
            req.firing_rate_hz,
            req.mito_active,
            req.temp_c,
        )
        if res["sustainSeconds"] == float("inf"):
            res["sustainSeconds"] = None
            res["sustained"] = True
        else:
            res["sustained"] = False
        return {"classification": "exact_50digit_oracle", **res}

    @app.post("/api/v1/ei-balance")
    def post_ei(req: EiRequest) -> dict[str, Any]:
        return {
            "classification": "exact_50digit_oracle",
            **exact_ei_balance(req.g_exc_ns, req.g_inh_ns, req.cl_in_mm, req.cl_out_mm, req.temp_c),
        }

    @app.post("/api/v1/metrology")
    def post_metrology(req: MetrologyRequest) -> dict[str, Any]:
        return {
            "classification": "exact_50digit_oracle",
            **exact_metrology(
                req.photons,
                req.psf_sigma_nm,
                req.imager_conc_nm,
                req.k_on,
                req.k_off,
                req.spacing_nm,
                req.resi_subsets_k,
            ),
        }

    return app


app = create_app()


def main() -> None:
    settings = load_settings()
    uvicorn.run(
        "synapse_science.server:app",
        host=settings.api_host,
        port=settings.api_port,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
