# ADR 0004: Pre-Registered 30-Seed Monte Carlo Protocol and Transparent Refutation Policy

- **Status:** Accepted
- **Date:** 2026-11-23

## Context
Stochastic simulations are prone to cherry-picking seeds or post-hoc threshold adjustment if hypotheses are not frozen prior to execution.

## Decision
Commit `PREREGISTRATION.md` in the initial repository commit (`a1919f2`) fixing seeds (`1000..1029`, null `2000..2029`), tests (permutation + Holm–Bonferroni), and refutation thresholds prior to execution. Record any failed pre-registered hypothesis verbatim as refuted/retracted and log any follow-up arm separately in `DEVIATIONS.md`.

## Consequences
When the pre-registered H3 prediction (40 Hz ATP sustainability) failed in the fixed-parameter simulator, because the ATP constants chosen after registration put the model threshold at `29.5625 Hz`, the failure was reported rather than edited away. It is a property of the simulator's constants, not a biological finding.
