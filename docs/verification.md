# Verification

How human-synapse-bouton-lab proves it is not BS, following Part B of the [build standard](build-standard.md). Update the status column as evidence lands; `just audit` checks what it can detect.

| Rung | What | Command or artifact | Status |
|---|---|---|---|
| B01-B03 | Reproducible build, pinned toolchain, determinism | `just reproduce`, lockfiles | TODO(fill) |
| B04-B05 | Claims ledger and falsifiable tests | [CLAIMS.md](../CLAIMS.md) | TODO(fill) |
| B06-B09 | Negative, regression, golden and contract tests | `just test` | TODO(fill) |
| B10-B14 | Property-based, differential, reference, mutation, metamorphic | | TODO(fill) |
| B15-B21 | Fuzzing, sanitizers, static and type checks, races, numerics, failure injection | `just lint` | TODO(fill) |
| B22-B25 | Formal methods (only for a critical core) | proofs/ | n/a unless needed |
| B26-B27 | Honest benchmarks and tracking | docs/benchmarks.md | n/a unless speed is claimed |
| B28-B32 | Statistics: controls, seeds, tests, effect sizes, corrections, preregistration | | n/a unless results are claimed |
| B33-B34 | ML held-out evals, AI hallucination and regression evals | evals/ | n/a unless ML or AI |
| B35-B36 | Security scanning (report-only), threat model | CI security job, [threat-model.md](threat-model.md) | TODO(fill) |
| B37-B40 | Checksums, attestations, data hashes, audit trail | release workflow, [run-log.md](run-log.md) | wired in the release workflow |
| B41-B45 | Limitations, refutation conditions, replication, review | [LIMITATIONS.md](../LIMITATIONS.md), [REPLICATION.md](../REPLICATION.md), reviews/ | TODO(fill) |

Verify a release artifact:

```bash
sha256sum -c SHA256SUMS
gh attestation verify <artifact> --repo 0thernes/human-synapse-bouton-lab
```
