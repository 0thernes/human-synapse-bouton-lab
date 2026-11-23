# 0001. Record architecture decisions

- Status: accepted
- Date: 2026-11-23
- Decider: 0thernes

## Context

Design choices get forgotten or silently undone, especially across many AI agent sessions. We need a cheap, durable record of why things are the way they are.

## Decision

Record each significant decision as a numbered Markdown file in docs/adr/ using this template: context, decision, alternatives considered, consequences, status.

## Alternatives considered

- Comments in code: scattered, easy to lose.
- A wiki: lives outside the repo and drifts from the code.

## Consequences

- Agents and humans read docs/adr/ before changing architecture.
- Reversing a decision requires a new ADR that supersedes the old one.
