# SPDX-License-Identifier: Apache-2.0
# Digest-pinned reproducible verification container (Defensible Playbook §8 item #20).
# Base digest verified live against registry-1.docker.io/v2/library/debian/manifests/bookworm-slim on 2026-11-23.
FROM debian:bookworm-slim@sha256:734a72b3d6142a71993b4bc580ca01d8ca687f77a2c422d96a961d3376b179bc

ENV DEBIAN_FRONTEND=noninteractive \
    PATH="/root/.elan/bin:/root/.cargo/bin:/root/.local/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
      bash bubblewrap build-essential ca-certificates curl git pkg-config python3 python3-venv xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 24 LTS, uv, Rust stable, and Lean 4.35.0 (pinned by lean/lean-toolchain)
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --component clippy \
    && curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain leanprover/lean4:v4.35.0

WORKDIR /workspace
COPY . .

RUN bash scripts/dev.sh setup \
    && bash scripts/dev.sh build \
    && bash scripts/dev.sh test

CMD ["uv", "run", "synapse-api"]
