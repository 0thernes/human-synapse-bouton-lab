# ADR 0004: Pre-Registered 30-Seed Monte Carlo Protocol and Transparent Refutation Policy

- **Status:** Accepted
- **Date:** 2026-11-23

## Context
Stochastic simulations are prone to cherry-picking seeds or post-hoc threshold adjustment if hypotheses are not frozen prior to execution.

## Decision
Commit `PREREGISTRATION.md` in the initial repository commit (`a1919f2`) fixing seeds (`1000..1029`, null `2000..2029`), tests (permutation + Holm–Bonferroni), and refutation thresholds prior to execution. Record any failed pre-registered hypothesis verbatim as refuted/retracted and log any follow-up arm separately in `DEVIATIONS.md`.

## Consequences
When pre-registered H3 (40 Hz ATP sustainability) was genuinely refuted by the bioenergetic critical-frequency cliff (`29.5625 Hz`), the refutation was preserved openly rather than p-hacked, proving the statistical pipeline is falsifiable.
