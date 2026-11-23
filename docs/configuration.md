# Configuration and Environment Variables

All runtime settings are validated via `pydantic-settings` in `python/synapse_science/config.py` and mirrored in `.env.example` (Build Standard A33). Never commit a `.env` file containing secrets.

| Variable | Type | Default | Required | Effect |
|---|---|---|---|---|
| `SYNAPSE_API_HOST` | `string` | `127.0.0.1` | No | Bind interface for the FastAPI exact-oracle server (`uv run synapse-api`). |
| `SYNAPSE_API_PORT` | `integer` | `8000` | No | TCP port for the FastAPI server. |
| `SYNAPSE_LOG_LEVEL` | `string` | `INFO` | No | Structured JSON log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `SYNAPSE_DEFAULT_SEED` | `integer` | `1000` | No | Default deterministic PRNG seed for CLI/API simulation helpers. |
| `SYNAPSE_CORS_ORIGINS` | `comma-list` | `http://localhost:5173,http://127.0.0.1:5173` | No | Allowed browser origins for cross-origin API calls. |
| `VITE_API_BASE_URL` | `string` | `http://127.0.0.1:8000` | No | Optional backend URL probed by `apps/web` (`/healthz`); falls back cleanly to in-browser `@synapse/core` when unavailable. |
