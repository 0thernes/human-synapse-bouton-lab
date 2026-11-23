# Cost Model (`cost-model.md`)

Prepared per Build Pipeline Models v1.0.0 (`P3.05`). Unit prices verified as of **2026-11-23** for public open-source repositories.

| Scale Tier | Components & Expected Usage | Unit Price & Source (2026-11-23) | Estimated Monthly Cost | Notes |
|---|---|---|---|---|
| **Tier 0 — Solo Local Development** | Local workstation (Lean 4.35.0, Rust, Node 24, Python/uv, Tectonic 0.17.0, Docker) | `\$0.00` incremental software licenses (all FOSS) | **\$0.00 / mo** | Hardware already owned. |
| **Tier 1 — Public Open-Science Publication (Current Active Tier)** | GitHub Public Repo + GitHub Actions CI (12 jobs, ~8 min/push) + GitHub Pages (`< 100 GB/mo`) + CERN Zenodo DOI + ORCID + Software Heritage + Palomar Registry | GitHub Actions free for standard public runners; GitHub Pages free for public repos (`docs.github.com/billing`, 2026-11-23); Zenodo/ORCID/SWH/Palomar `\$0.00` public science infrastructure | **\$0.00 / mo** | Zero recurring fixed cost; zero paid API keys in runtime. |
| **Tier 2 — Optional Self-Hosted Public FastAPI Instance (Future, Not Active)** | 1x small cloud container (`512 MB` RAM, `0.5 vCPU`, e.g., Fly.io / Cloud Run free-to-low tier) serving `/api/v1/*` | Google Cloud Run / Fly.io shared CPU (`~ \$0.00` inside free tier up to 2M req/mo; `~ \$5–\$10/mo` dedicated minimum; `cloud.google.com/run/pricing`, 2026-11-23) | **\$0.00 – \$10.00 / mo** | Not needed while static GitHub Pages runs full client-side TS core. |
| **Tier 3 — Heavy Workloads (Future `ideas.md` MCell4 / 16K Renders)** | Burst GPU/CPU compute for 3D particle PDE or atomic PDB Blender rendering | Cloud spot compute (`~ \$0.50–\$2.00 / hr` on demand) | **Pay-per-run only** | Strictly out of scope for `v1.x`. |

## Budget Guardrail

- **Hard cap for `v1.x`:** `<= \$5.00 / mo` recurring spend. Actual spend to date: **`\$0.00`**.
- **Runtime AI API Cost:** `\$0.00` — runtime code makes zero LLM/AI API calls (`docs/ai-choices.md`).
