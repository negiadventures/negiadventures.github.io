---
layout: blog-post
title: "Path-Scoped Write Permissions for AI Coding Agents Without Repo-Wide Trust"
description: "A practical guide to enforcing path-scoped write permissions for AI coding agents with policy maps, CODEOWNERS alignment, pre-apply checks, and reviewer evidence so one helpful patch cannot quietly edit the whole repository."
date: 2026-07-02
tags:
  - AI Agents
  - Repository Security
  - CODEOWNERS
  - Policy Enforcement
  - Developer Workflow
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23164c73%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27%2F%3E%0A%3Ccircle%20cx%3D%271010%27%20cy%3D%27108%27%20r%3D%27178%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27%2F%3E%3Ccircle%20cx%3D%27188%27%20cy%3D%27520%27%20r%3D%27218%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27%2F%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27%2F%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EPath-Scoped%20Write%20Permissions%20for%20AI%20Coding%20Agents%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EWithout%20Repo-Wide%20Trust%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ELet%20agents%20edit%20the%20files%20they%20were%20assigned%2C%20then%20fail%20closed%20when%20a%20patch%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Edrifts%20into%20secrets%2C%20deploy%20configs%2C%20or%20someone%20else%26apos%3Bs%20service%20boundary.%3C%2Ftext%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27390%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Ewrite%20access%20should%20follow%20task%20scope%2C%20not%20tool%20existence%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27830%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Epath%20policy%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27816%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Epre-apply%20gate%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27812%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Ereview%20lane%3C%2Ftext%3E%0A%3C%2Fsvg%3E"
canonical: "https://negiadventures.github.io/blog/path-scoped-write-permissions-ai-coding-agents.html"
---

# Path-Scoped Write Permissions for AI Coding Agents Without Repo-Wide Trust

## Hook

Most AI coding agents do not need blanket write access to an entire repository. They need to touch a bounded set of files for one task, then stop. The problem is that many tool stacks still treat “can edit files” as a repo-wide capability.

That feels convenient until a bug fix drifts into deployment YAML, a refactor updates generated code nobody meant to review, or an agent decides the best place to help is a secrets-related config nearby.

This post walks through a cleaner model: path-scoped write permissions. Let the agent read broadly if you want, but only allow writes inside approved paths, with a hard pre-apply gate and a review lane for escalations.

## Why this matters

Permission boundaries for AI coding agents usually focus on shell access, network access, or whether the agent can push a branch. Those matter, but repository boundaries matter too.

In real repos, the dangerous failures are often local and plausible: a config file that should not have changed, a migration script pulled into scope by pattern matching, or a docs update that quietly edits product policy text.

## Architecture or workflow overview

**Visual plan**
- Hero image idea: repo write lanes with a gate between app code and infra paths
- Architecture diagram idea: task manifest to policy resolver to pre-apply gate to either apply or escalate
- Optional terminal-output visual idea: patch blocked on deploy.yaml and release workflow edits
- Optional comparison table idea: broad globs vs strict deny lists vs CODEOWNERS alignment vs hard pre-apply gate
- Tags: AI Agents, Repository Security, CODEOWNERS, Policy Enforcement, Developer Workflow
- Meta description: A practical guide to enforcing path-scoped write permissions for AI coding agents with policy maps, CODEOWNERS alignment, pre-apply checks, and reviewer evidence so one helpful patch cannot quietly edit the whole repository.
- Suggested code snippet sections: policy file, path resolver, pre-apply diff gate, escalation bundle

1. Start each run with a task manifest that names the write scope, not just the goal.
2. Resolve that scope against repo policy, CODEOWNERS, and no-go directories.
3. Let the agent draft changes normally, but treat every patch as provisional.
4. Before applying or committing, compare changed files against the approved path set.
5. If the patch crosses the boundary, fail closed and produce an escalation packet.

## Implementation details

### 1) Define write lanes as explicit policy, not vibes

```yaml
version: 1
lanes:
  ui-copy-fix:
    allow:
      - web/src/**
      - web/public/**
    deny:
      - web/src/generated/**
      - infra/**
      - .github/workflows/**
  docs-update:
    allow:
      - docs/**
      - README.md
    deny:
      - docs/policies/**
```

I prefer deny rules even when allow rules look sufficient. They make sharp edges visible, and they help when broad path globs would otherwise catch generated code, deploy configs, or legal text.

### 2) Resolve task scope against CODEOWNERS and sensitive paths

```ts
import picomatch from "picomatch";
import { parseCodeowners } from "./codeowners.js";

export function resolveWritablePaths(taskLane, policy, repoFiles) {
  const allow = policy.lanes[taskLane].allow.map(picomatch);
  const deny = policy.lanes[taskLane].deny.map(picomatch);
  const codeowners = parseCodeowners('.github/CODEOWNERS');

  return repoFiles.filter((file) => {
    const allowed = allow.some((match) => match(file));
    const blocked = deny.some((match) => match(file));
    const ownerLane = codeowners.ownerGroupFor(file);
    return allowed && !blocked && ownerLane !== 'security-admins';
  });
}
```

### 3) Fail closed at patch time, not after commit time

```bash
#!/usr/bin/env bash
set -euo pipefail

ALLOWED_FILE=.run/allowed-paths.txt
PATCH_FILE=.run/candidate.patch

violations=$(git apply --numstat "$PATCH_FILE"   | awk '{print $3}'   | grep -v -x -f "$ALLOWED_FILE" || true)

if [[ -n "$violations" ]]; then
  echo "OUT_OF_SCOPE_WRITE"
  echo "$violations"
  exit 42
fi

git apply "$PATCH_FILE"
```

```text
$ ./scripts/apply-scoped-patch.sh
OUT_OF_SCOPE_WRITE
infra/prod/deploy.yaml
.github/workflows/release.yml

Patch blocked. Escalation bundle written to .run/escalations/2026-07-02T120100Z.json
```

### 4) Produce reviewer evidence instead of a vague denial

```json
{
  "taskId": "run_01jz8v9m0n",
  "lane": "ui-copy-fix",
  "allowedPaths": ["web/src/**", "web/public/**"],
  "blockedFiles": ["infra/prod/deploy.yaml"],
  "reason": "Agent attempted to edit deployment config while fixing frontend asset path",
  "suggestedAction": "Require explicit approval or split into separate task"
}
```

## What went wrong / tradeoffs

| Choice | What it helps | What it costs |
| --- | --- | --- |
| Broad allow globs | Higher task completion rate on first try | More accidental cross-service edits |
| Strict deny lists | Protects dangerous paths reliably | Needs maintenance when repos move |
| CODEOWNERS alignment | Matches human ownership models | Breaks if CODEOWNERS is stale theater |
| Hard pre-apply gate | Fail-closed mutation control | More escalations for multi-file fixes |

- Do not confuse read scope with write scope.
- Expect stale policy to become the main operational failure mode.
- Avoid inferring write scope entirely from the prompt.
- Prefer explicit multi-lane escalation for legitimate cross-boundary fixes.

## Practical checklist

- Define per-task or per-lane write scopes in repo-local policy.
- Keep hard deny zones for secrets, infra, workflows, generated code, and policy text.
- Resolve scope against CODEOWNERS or another ownership map.
- Check changed files immediately before apply, commit, or push.
- Fail closed on out-of-scope files, with no partial mutation.
- Emit an escalation bundle with blocked paths and rationale.
- Review lane churn monthly so the policy does not rot into friction.

## Conclusion

Path-scoped write permissions are one of the simplest ways to make AI coding agents safer without making them useless. The model can still reason broadly. It just cannot mutate broadly by default.

If a task truly needs more reach, make that visible and deliberate. Repo trust should expand by evidence, not by accident.
