---
layout: blog-post
title: "Dependency Cache Warming for AI Coding Agents Without Cold Install Thrash"
description: "A practical guide to warming pnpm, uv, Docker BuildKit, and CI caches so AI coding agents stop wasting runs on repeated dependency installs and flaky bootstrap latency."
date: 2026-06-21
tags:
  - AI Coding Agents
  - Build Systems
  - CI Reliability
  - Dependency Caching
  - Developer Workflow
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23164c73%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%3Ccircle%20cx%3D%271004%27%20cy%3D%27110%27%20r%3D%27176%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%3Ccircle%20cx%3D%27188%27%20cy%3D%27518%27%20r%3D%27218%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%3Ctext%20x%3D%27126%27%20y%3D%27166%27%20fill%3D%27white%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EDependency%20Cache%20Warming%20for%20AI%20Coding%20Agents%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27226%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EWithout%20Cold%20Install%20Thrash%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27300%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2728%27%3EWarm%20pnpm,%20uv,%20and%20BuildKit%20caches%20before%20your%20agent%20spends%20half%20the%20run%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27336%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2728%27%3Edownloading%20the%20same%20dependencies%20again%20and%20again.%3C/text%3E%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27370%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2724%27%3Ebootstrap%20latency%20is%20an%20ops%20problem,%20not%20an%20agent%20problem%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27822%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Elockfile%20key%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27814%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Ewarm%20store%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27818%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Efast%20verify%3C/text%3E%3C/svg%3E"
---

# Dependency Cache Warming for AI Coding Agents Without Cold Install Thrash

AI coding agents are surprisingly bad at one very ordinary thing, waiting through the same dependency bootstrap over and over.

If half of every run is `pnpm install`, `uv sync`, or rebuilding the same Docker layers, the model is not the bottleneck anymore. Your packaging and cache policy is.

What matters is not just having a cache somewhere. What matters is warming the right cache, keyed to the right evidence, before the agent starts editing.

## Why this matters

A human developer tolerates one slow install and keeps working in the same shell for hours. Agent workflows do the opposite. They spin up fresh workspaces, bounce across repos, retry in CI, and often verify patches in isolation.

That changes the economics. A 90 second bootstrap penalty is annoying for a person. For an agent that runs 40 times a day, it quietly becomes the dominant cost in latency, CI minutes, and flaky failed runs.

This is especially true when you mix:

- ephemeral worktrees or sandboxes
- language-specific stores like `pnpm`, `uv`, `pip`, or `cargo`
- Docker-based verifiers
- cache-hostile keys such as branch names or timestamps

## Architecture and workflow overview

### Visual plan
- Hero: neon terminal-style banner showing lockfile key, warm store, fast verify
- Diagram: lockfile hash to shared cache to workspace bootstrap to focused verify
- Terminal visual: before vs after bootstrap timings for cold and warm runs
- Comparison table: package-manager cache type, what to warm, common failure mode
- Tags: AI Coding Agents, Build Systems, CI Reliability, Dependency Caching, Developer Workflow
- Meta description: A practical guide to warming pnpm, uv, Docker BuildKit, and CI caches so AI coding agents stop wasting runs on repeated dependency installs and flaky bootstrap latency.
- Code sections: GitHub Actions cache keying, local bootstrap script, Docker BuildKit cache mounts

### Mermaid flow

```mermaid
flowchart LR
    A[Agent task starts] --> B[Read lockfile + runtime versions]
    B --> C[Compute cache fingerprint]
    C --> D{Warm cache hit?}
    D -->|yes| E[Hydrate workspace fast]
    D -->|no| F[Prime shared store once]
    F --> G[Persist cache artifacts]
    G --> E
    E --> H[Run focused tests or verifier]
    H --> I[Publish timings and cache status]
```

The key design choice is that the cache belongs to the dependency graph, not to a branch or an agent session. If the lockfile and runtime match, the agent should inherit a warm store immediately.

## Implementation details

### 1. Key caches from dependency evidence, not from branch names

For JavaScript repos, I like keying the warm store from:

- `pnpm-lock.yaml` or `package-lock.json`
- package manager version
- Node version
- OS or architecture when native modules are involved

A GitHub Actions example:

```yaml
name: agent-verify

on:
  workflow_dispatch:
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Enable pnpm
        run: corepack enable

      - name: Resolve pnpm store path
        id: pnpm-store
        run: echo "path=$(pnpm store path --silent)" >> "$GITHUB_OUTPUT"

      - uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-store.outputs.path }}
          key: pnpm-${{ runner.os }}-node22-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: |
            pnpm-${{ runner.os }}-node22-

      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --runInBand
```

This is boring, which is exactly why it works. The agent gets a warm package store when dependency evidence matches, and a clean miss when it does not.

Reference docs:
- https://pnpm.io/cli/store
- https://github.com/actions/cache
- https://github.com/actions/setup-node

### 2. Warm the shared store, not just `node_modules`

Caching `node_modules` looks tempting, but it is usually the wrong layer for agent systems. It is larger, more OS-sensitive, and more likely to break when path layouts or symlinks change.

A better pattern is warming the package-manager store and then doing a fast materialization step inside each fresh workspace.

For local or self-hosted agent runners, a bootstrap script can make this explicit:

```bash
#!/usr/bin/env bash
set -euo pipefail

LOCK_HASH=$(sha256sum pnpm-lock.yaml | awk '{print $1}')
STORE_ROOT="${HOME}/.cache/agent-pnpm"
MARKER="${STORE_ROOT}/${LOCK_HASH}.ready"

corepack enable
mkdir -p "$STORE_ROOT"
pnpm config set store-dir "$STORE_ROOT"

if [[ ! -f "$MARKER" ]]; then
  echo "[warm] priming pnpm store for ${LOCK_HASH}"
  pnpm fetch --frozen-lockfile
  touch "$MARKER"
else
  echo "[warm] store already primed for ${LOCK_HASH}"
fi

pnpm install --frozen-lockfile --prefer-offline
```

`pnpm fetch` is useful here because it populates the content-addressed store without pretending the workspace is already linked. The agent still gets a clean workspace, but the expensive network step is mostly gone.

Reference docs:
- https://pnpm.io/cli/fetch
- https://pnpm.io/symlinked-node-modules-structure

### 3. Give Python agent runs the same treatment with `uv`

Python workflows suffer from the same problem, especially when every verification job recreates a virtual environment from scratch.

A simple pattern is:

- key from `uv.lock` plus Python version
- cache the `uv` download and wheel cache
- rebuild the virtualenv from warm artifacts instead of hitting the network

Reference docs:
- https://docs.astral.sh/uv/concepts/cache/
- https://docs.astral.sh/uv/concepts/projects/sync/

### 4. Warm Docker verifier layers with BuildKit cache mounts

If your agent verifies patches inside Docker, language package caches are only half the story. You also want BuildKit cache mounts so repeated builds reuse downloaded packages across runs.

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-bookworm AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm fetch --frozen-lockfile

FROM node:22-bookworm AS test
WORKDIR /app
COPY --from=deps /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY . .
RUN corepack enable
RUN pnpm install --frozen-lockfile --prefer-offline
RUN pnpm test
```

This keeps dependency downloads attached to the Docker cache lifecycle instead of redoing them for every agent patch.

Reference docs:
- https://docs.docker.com/build/cache/optimize/
- https://docs.docker.com/reference/dockerfile/#run---mounttypecache

### Terminal before vs after

```text
cold run
  pnpm fetch            52s
  pnpm install          31s
  focused tests         18s
  total                 101s

warm run
  cache restore          3s
  pnpm install           8s
  focused tests         18s
  total                  29s
```

That kind of delta changes whether agent verification feels usable or wasteful.

## Comparison table

| Stack | What to warm | Best key material | Common failure mode |
| --- | --- | --- | --- |
| pnpm | content-addressed store | lockfile, Node version, OS | keying from branch names, causing low reuse |
| uv | wheel and package cache | `uv.lock`, Python version, OS | caching venv only, then rebuilding anyway |
| Docker BuildKit | build cache mounts and layers | Dockerfile plus lockfiles | invalidating all layers with early `COPY . .` |
| pip | wheel/download cache | requirements lock plus Python version | cache poisoning from unpinned transitive deps |

## What went wrong and tradeoffs

### Failure mode 1: overly broad restore keys

Broad restore keys improve hit rate, but they can also hide drift. If native modules are involved, restoring a cache from the wrong Node minor or architecture creates slow, confusing failures.

What I would not do: use a single global key like `node-cache-linux` for all repos.

### Failure mode 2: caching mutable environments instead of immutable inputs

Teams often cache whole virtualenvs or `node_modules` directories, then wonder why runs become flaky after a package manager upgrade. Those directories are downstream artifacts. The lockfile and runtime version are the real invariants.

### Failure mode 3: success metrics that ignore bootstrap time

If you only measure test pass rate, cache regressions stay invisible. Agent systems need bootstrap telemetry too:

- cache hit or miss
- restore duration
- install duration
- bytes downloaded
- verifier duration after bootstrap

### Security concern: caches are shared attack surface

A shared dependency cache is useful, but it is also a place where poisoned or stale artifacts can linger. At minimum, pair cache warming with:

- frozen lockfiles
- registry integrity checks
- scoped write permissions on self-hosted runners
- cache eviction when package manager versions change sharply

For public CI, I am wary of workflows that let untrusted forks write back into privileged cache namespaces.

## Practical checklist

- [ ] Key caches from lockfiles plus runtime version
- [ ] Prefer warming the package store over caching full install directories
- [ ] Separate network fetch from workspace materialization when possible
- [ ] Add BuildKit cache mounts for Docker-based verifiers
- [ ] Record cache hit rate and bootstrap duration in job output
- [ ] Invalidate aggressively when native modules or package manager versions change
- [ ] Treat shared caches as mutable infrastructure that needs access control

## Best-practices callout

If your agent workflow uses fresh workspaces, optimize for fast reconstruction, not for preserving one magical workspace forever. Warm stores plus deterministic installs scale better than trying to keep giant mutable environments alive.

## Conclusion

When an AI coding agent feels slow, the model often gets blamed first. A lot of the time the real culprit is repetitive bootstrap work.

Warm the dependency graph once, key it carefully, and let every fresh agent run inherit that speedup. It is one of the least glamorous reliability fixes you can make, and one of the highest leverage ones.
