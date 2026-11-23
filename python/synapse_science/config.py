# SPDX-License-Identifier: Apache-2.0
# Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
"""Validated environment configuration (Build Standard A33)."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SYNAPSE_", env_file=".env", extra="ignore")

    api_host: str = "127.0.0.1"
    api_port: int = 8000
    log_level: str = "INFO"
    default_seed: int = 1000
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"


def load_settings() -> Settings:
    return Settings()
