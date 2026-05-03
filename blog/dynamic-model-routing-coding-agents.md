---
layout: blog-post
title: "Dynamic Model Routing for AI Coding Agents Without Burning Budget"
description: "How to route coding-agent tasks between fast and expensive models using task scoring, guardrails, verification loops, and fallback policies that improve latency without quietly lowering quality."
date: 2026-05-03
tags:
  - Coding Agents
  - Model Routing
  - Cost Engineering
  - Reliability
  - AI Infrastructure
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2308131f%27/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2318324d%27/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%20%20%3Ccircle%20cx%3D%271010%27%20cy%3D%27115%27%20r%3D%27160%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%20%20%3Ccircle%20cx%3D%27185%27%20cy%3D%27520%27%20r%3D%27210%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%20%20%3Crect%20x%3D%2782%27%20y%3D%2784%27%20width%3D%271036%27%20height%3D%27462%27%20rx%3D%2732%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27174%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EDynamic%20Model%20Routing%20for%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27242%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EAI%20Coding%20Agents%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27320%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ESend%20the%20easy%20work%20fast%2C%20escalate%20the%20risky%20work%20before%20cost%20and%20quality%20drift%3C/text%3E%0A%20%20%3Crect%20x%3D%27132%27%20y%3D%27380%27%20width%3D%27304%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27156%27%20y%3D%27415%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eroute%20by%20risk%2C%20not%20vibes%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27178%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27808%27%20y%3D%27214%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eclassify%28task%29%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27276%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27816%27%20y%3D%27312%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eroute%28model%29%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27374%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27816%27%20y%3D%27410%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Everify%28%29%3C/text%3E%0A%3C/svg%3E"
canonical: "https://negiadventures.github.io/blog/dynamic-model-routing-coding-agents.html"
---

# Dynamic Model Routing for AI Coding Agents Without Burning Budget

Most teams start model selection for coding agents with a brand name and a gut feeling. That works until the cheap model misses a migration edge case, or the expensive model gets asked to rename one variable and burns money doing it.

The better pattern is routing. Score the task, reserve expensive models for the work that actually needs them, and keep a verification loop that catches bad downgrades before they become merged code.

This post walks through a practical routing setup for coding agents: task classification, model policy, escalation rules, and the failure modes that show up when routing logic gets too clever.

## Why this matters

Coding-agent traffic is not uniform. A tiny docs fix, a dependency bump, a schema migration, and a flaky test investigation are radically different jobs. Treating them the same wastes either money or attention.

In production, routing matters for three reasons:

- **Latency**: fast models unblock low-risk loops
- **Cost**: expensive reasoning should be used selectively
- **Quality**: risky edits need stronger models and stronger verification

## Architecture or workflow overview

```mermaid
flowchart LR
    A[Task brief + changed files] --> B[Task classifier]
    B --> C[Risk score]
    C --> D[Routing policy]
    D --> E[Fast model lane]
    D --> F[Strong model lane]
    E --> G[Verification]
    F --> G
    G --> H{{Pass?}}
    H -- Yes --> I[Commit or PR artifact]
    H -- No --> J[Escalate or retry]
    J --> F
```

1. Classify the task before calling a model.
2. Map the score to a model lane.
3. Run verification appropriate to that lane.
4. Escalate failed or high-risk work instead of retrying blindly on the same cheap model.

## Implementation details

### 1) Score the task before you pick the model

A routing decision should be boring and inspectable. I like a small ruleset that combines blast radius, file type, and action type.

```python
from dataclasses import dataclass

@dataclass
class TaskSignal:
    files_touched: int
    has_schema_change: bool
    has_auth_code: bool
    test_failures: int
    needs_new_code: bool


def risk_score(signal: TaskSignal) -> int:
    score = 0
    score += min(signal.files_touched, 8)
    score += 5 if signal.has_schema_change else 0
    score += 5 if signal.has_auth_code else 0
    score += min(signal.test_failures * 2, 6)
    score += 3 if signal.needs_new_code else 0
    return score
```

The goal is not academic precision. The goal is to stop sending risky edits to the cheapest possible lane.

### 2) Keep routing policy separate from prompts

Do not bury routing logic inside the agent prompt. Keep it in a policy file so you can change it without rewriting every task template.

```yaml
models:
  fast:
    provider: openrouter
    model: anthropic/claude-3.5-haiku
    max_context_tokens: 32000
  strong:
    provider: openrouter
    model: anthropic/claude-3.7-sonnet
    max_context_tokens: 120000
  verifier:
    provider: openai
    model: gpt-4.1-mini

routing:
  fast_max_score: 6
  strong_min_score: 7
  always_strong_if:
    - schema_change
    - auth_code
    - production_incident
  escalate_on:
    - failed_tests
    - patch_rejected
    - low_confidence_summary
```

This separation makes audits much easier. You can diff routing changes independently from instruction changes.

### 3) Route by task class, then verify harder than you route

Verification is where cheap routing survives contact with reality.

```ts
type Route = "fast" | "strong";

type RunResult = {
  route: Route;
  passed: boolean;
  checks: string[];
  confidence: number;
};

export function nextRoute(result: RunResult): Route {
  if (!result.passed) return "strong";
  if (result.confidence < 0.65) return "strong";
  if (result.checks.includes("snapshot-only")) return "strong";
  return result.route;
}
```

If your fast lane produces a patch that only passes weak checks, escalate anyway. Passing a shallow check is not the same as being safe to merge.

```text
$ route-agent --task "fix retry leak in sync worker"
classifier: files=4 schema_change=false auth_code=false test_failures=2 new_code=true
risk_score: 11
selected_lane: strong
verification: pytest -q && npm run lint && npm run typecheck
result: pass
cost_usd_estimate: 0.84
latency_seconds: 38.7
```

### 4) Add a small benchmark ledger

Routing gets better when you track outcomes instead of arguing from anecdotes.

| Lane | Median latency | Typical use | Common failure |
| --- | --- | --- | --- |
| Fast | 6 to 14 s | docs, narrow refactors, boilerplate tests | misses hidden invariants |
| Strong | 20 to 55 s | migrations, auth, multi-file fixes | higher cost, slower loop |
| Verifier | 4 to 10 s | second-pass critique, summary checks | can approve weak tests if prompts are vague |

A simple ledger with route, task type, pass rate, and escalation rate will tell you quickly whether your thresholds are wrong.

## What went wrong and the tradeoffs

The biggest routing mistake is overfitting to cost. Teams get excited about saving money, drop too much work into the fast lane, then pay for it later in retries, review churn, and incidents.

Another failure mode is classifier drift. If the codebase changes but your routing rules do not, new risky areas remain mislabeled. This shows up a lot when infrastructure or auth logic moves into new directories.

> **Pitfall:** If the agent can edit CI, migrations, secrets handling, or deployment config, the routing policy should default upward. Those are not places to discover that your fast lane was overly optimistic.

There is also a security angle. Routing systems often inspect filenames, issue text, and tool outputs. If those inputs are untrusted, your classifier can be manipulated into downgrading or upgrading tasks. Treat task metadata as tainted input and validate it before policy evaluation.

> **Best practice:** keep a tiny set of non-negotiable “always strong” conditions, then tune the rest with measured results.

## Practical checklist

- [ ] Score tasks using explicit signals, not prompt prose
- [ ] Keep routing policy in config, not hidden in agent instructions
- [ ] Maintain an always-escalate list for schema, auth, deploy, and incident work
- [ ] Escalate on failed verification or low confidence, not just on hard errors
- [ ] Track pass rate, escalation rate, latency, and review rejection rate by lane
- [ ] Revisit thresholds when the repo architecture changes

## What I would do again

I would start with only two execution lanes and one verifier. Most teams do not need a five-model orchestra. They need a fast path, a careful path, and a way to prove the cheap path did not lie.

## Conclusion

Model routing is one of the easiest ways to make coding agents cheaper without making them worse. The trick is to route by risk, verify aggressively, and escalate early when the cheap lane starts guessing.

## References

- [LiteLLM routing docs](https://docs.litellm.ai/docs/routing)
- [OpenRouter model routing overview](https://openrouter.ai/docs/features/provider-routing)
- [vLLM serving docs](https://docs.vllm.ai/)
