# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `1.0.x` | Yes |
| `< 1.0.0` | No (legacy prototype) |

## Reporting a Vulnerability

Please report security issues **privately** rather than opening a public issue:

1. **GitHub Private Vulnerability Reporting** (enabled on `https://github.com/0thernes/human-synapse-bouton-lab/security/advisories/new`), or
2. **Email:** `0_0@0thernes.art` with subject `[SECURITY] human-synapse-bouton-lab`.

### What to Expect

- Initial acknowledgement within 72 hours.
- Triage and remediation plan within 7 days for confirmed vulnerabilities affecting the FastAPI backend (`python/synapse_science/server.py`), trace parser (`traceAnalyzer.ts`), or dependency supply chain.
- See [`docs/threat-model.md`](docs/threat-model.md) for our STRIDE threat model and DoS/validation boundaries.
