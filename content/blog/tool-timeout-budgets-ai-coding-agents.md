---
layout: blog-post
title: "Tool Timeout Budgets for AI Coding Agents Without Hung Runs"
description: "How to design tool timeout budgets for AI coding agents with layered deadlines, cancellation hooks, retries, and fallback lanes so hung tools stop burning whole runs."
date: 2026-06-23
tags:
  - Agent Reliability
  - Tooling
  - Automation
  - DevOps
  - AI Coding
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%0A%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2317486f%27/%3E%0A%20%20%3C/linearGradient%3E%0A%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271000%27%20cy%3D%27108%27%20r%3D%27180%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%3Ccircle%20cx%3D%27186%27%20cy%3D%27518%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3ETool%20Timeout%20Budgets%20for%20AI%20Coding%20Agents%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EWithout%20Hung%20Runs%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EGive%20every%20shell%20command%2C%20API%20call%2C%20and%20browser%20step%20a%20clear%20deadline%2C%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Ea%20kill%20path%2C%20and%20a%20fallback%20lane%20before%20one%20stuck%20tool%20burns%20the%20whole%20run.%3C/text%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27384%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Etimeouts%20are%20product%20decisions%2C%20not%20just%20process%20flags%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27826%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esoft%20deadline%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27814%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Egrace%20window%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27818%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Ehard%20kill%3C/text%3E%0A%3C/svg%3E
canonical: https://negiadventures.github.io/blog/tool-timeout-budgets-ai-coding-agents.html
---

# Tool Timeout Budgets for AI Coding Agents Without Hung Runs

<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%0A%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2317486f%27/%3E%0A%20%20%3C/linearGradient%3E%0A%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271000%27%20cy%3D%27108%27%20r%3D%27180%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%3Ccircle%20cx%3D%27186%27%20cy%3D%27518%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3ETool%20Timeout%20Budgets%20for%20AI%20Coding%20Agents%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EWithout%20Hung%20Runs%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EGive%20every%20shell%20command%2C%20API%20call%2C%20and%20browser%20step%20a%20clear%20deadline%2C%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Ea%20kill%20path%2C%20and%20a%20fallback%20lane%20before%20one%20stuck%20tool%20burns%20the%20whole%20run.%3C/text%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27384%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Etimeouts%20are%20product%20decisions%2C%20not%20just%20process%20flags%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27826%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esoft%20deadline%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27814%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Egrace%20window%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27818%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Ehard%20kill%3C/text%3E%0A%3C/svg%3E" alt="Tool Timeout Budgets for AI Coding Agents Without Hung Runs" style="width:100%;border-radius:16px;border:1px solid rgba(148,163,184,.22);margin:8px 0 24px;" />

A lot of agent failures are not really reasoning failures. They are timeout failures with good marketing.

A shell command waits forever on a package mirror. A browser step hangs behind a modal. A model gateway streams one token and then stalls. The agent looks indecisive, but the real bug is that nobody taught the tool lane when to give up.

This post shows how I would design timeout budgets for coding agents so slow tools degrade predictably instead of consuming the entire run. The pattern is simple: layered deadlines, explicit cancellation, retry classes, and fallback lanes that match the value of the step.

## Why this matters

If your agent has a 20 minute task budget and one verifier command can sit for 18 minutes before dying, you do not have a verifier. You have a single-point schedule risk.

Timeout policy becomes more important as agents get more autonomous:

- parallel runs amplify queue contention
- browser steps hide stalls better than CLI tools
- API retries can silently turn a 10 second step into a 4 minute one
- human reviewers only see "agent timed out" unless you keep per-tool receipts

The practical goal is not to make every tool fast. It is to make every delay legible.

## Architecture or workflow overview

```mermaid
flowchart LR
    A[Agent task budget] --> B[Step planner]
    B --> C[Tool budget resolver]
    C --> D[Soft deadline]
    D --> E[Grace window]
    E --> F[Hard kill]
    F --> G[Retry or fallback lane]
    G --> H[Verifier receipt + summary]
```

A good timeout ladder has four parts:

1. **Task budget** for the entire run
2. **Step budget** for the current unit of work
3. **Tool budget** for the exact command, API call, or browser action
4. **Fallback policy** when the tool exceeds budget

## Implementation details

### 1. Put deadlines in the tool manifest, not in scattered shell strings

```yaml
# tool-budgets.yaml
defaults:
  soft_timeout_ms: 15000
  grace_timeout_ms: 5000
  hard_timeout_ms: 25000
  max_retries: 1

classes:
  quick_read:
    soft_timeout_ms: 4000
    grace_timeout_ms: 1000
    hard_timeout_ms: 6000
    max_retries: 0

  verify_medium:
    soft_timeout_ms: 30000
    grace_timeout_ms: 10000
    hard_timeout_ms: 45000
    max_retries: 1

  browser_action:
    soft_timeout_ms: 12000
    grace_timeout_ms: 5000
    hard_timeout_ms: 20000
    max_retries: 1

tools:
  npm_test_changed:
    class: verify_medium
  playwright_checkout_flow:
    class: browser_action
  git_diff_name_only:
    class: quick_read
```

This keeps two mistakes out of the system:

- hard-coded timeouts copied across scripts
- one global timeout that treats `git diff` and `playwright test` like the same job

### 2. Resolve a per-step deadline from the remaining task budget

```ts
interface Budget {
  softMs: number;
  graceMs: number;
  hardMs: number;
  maxRetries: number;
}

function resolveBudget(tool: Budget, remainingTaskMs: number, remainingStepMs: number): Budget {
  const ceiling = Math.max(1500, Math.min(remainingTaskMs, remainingStepMs));
  const hardMs = Math.min(tool.hardMs, ceiling);
  const graceMs = Math.min(tool.graceMs, Math.floor(hardMs * 0.35));
  const softMs = Math.max(500, Math.min(tool.softMs, hardMs - graceMs));

  return {
    softMs,
    graceMs,
    hardMs,
    maxRetries: hardMs < tool.hardMs ? 0 : tool.maxRetries,
  };
}
```

This is the part teams skip. A 45 second verifier is fine early in a run and irresponsible when 18 seconds remain.

### 3. Use soft timeout, grace timeout, then hard kill

```ts
async function runWithBudget(cmd: string[], budget: Budget) {
  const child = spawn(cmd[0], cmd.slice(1), { stdio: ['ignore', 'pipe', 'pipe'] });
  let softExpired = false;

  const softTimer = setTimeout(() => {
    softExpired = true;
    child.kill('SIGTERM');
  }, budget.softMs);

  const hardTimer = setTimeout(() => {
    child.kill('SIGKILL');
  }, budget.softMs + budget.graceMs);

  const result = await collectChildResult(child);
  clearTimeout(softTimer);
  clearTimeout(hardTimer);

  return {
    ...result,
    softExpired,
    timedOut: softExpired && result.exitCode === null,
  };
}
```

Soft timeout gives cooperative tools a chance to flush buffers and write cleanup state. Hard kill protects the run when they do not.

### 4. Keep a receipt so the agent can explain what happened

```json
{
  "tool": "playwright_checkout_flow",
  "budget": {
    "softMs": 12000,
    "graceMs": 5000,
    "hardMs": 17000
  },
  "attempt": 1,
  "stdoutHeartbeatMs": 840,
  "result": "timed_out",
  "fallback": "switch_to_api_health_check",
  "capturedTail": "waiting for selector [data-testid=checkout-submit]"
}
```

That receipt is what turns a vague failure into a reviewable decision.

### Example terminal output

```text
$ agent verify --target checkout-flow
[budget] task=19.8m step=2.0m tool=17.0s (soft=12.0s grace=5.0s)
[tool] playwright_checkout_flow attempt=1
[warn] soft timeout reached, sending SIGTERM
[warn] grace expired, forcing SIGKILL
[fallback] switching to api_health_check + screenshot artifact review
[summary] verifier degraded safely, patch review may continue with medium confidence
```

## What went wrong and the tradeoffs

### The most common failure mode: retrying the wrong thing

A slow package registry or flaky model gateway can justify a retry. A deadlocked migration script usually cannot. If you retry both equally, you multiply bad waits.

| Situation | Good default | Why |
| --- | --- | --- |
| `git diff`, metadata reads | no retry | cheap to rerun at a higher layer |
| HTTP 429 or 503 | bounded retry with jitter | provider may recover quickly |
| browser selector timeout | one retry after page reset | session may be poisoned |
| long verifier with zero stdout | no retry, downgrade lane | repeated silence is signal |
| schema migration lock wait | abort and escalate | risk of unsafe side effects |

### Timeout budgets can hide real performance problems

If the fix for every slow test is "lower the timeout," you are only becoming better at failing earlier. Keep percentile data by tool class, or the budget file becomes superstition.

### Cancellation is part of correctness

Some tools do not exit cleanly on `SIGTERM`. Browser workers, Docker builds, and subprocess trees are classic offenders. If your kill path leaks child processes, your timeout policy will slowly poison the host.

> **Pitfall:** A timeout without cleanup can be worse than no timeout. You stop waiting, but the machine keeps doing the work anyway.

### Security matters here too

Budget decisions affect security-sensitive flows:

- secrets brokers should fail closed on timeout
- approval checks should not auto-pass when the policy service is slow
- destructive tools should not resume from partial state without an explicit receipt

## Practical checklist

Use this if you are adding timeout control to an existing agent stack:

- define timeout classes for reads, writes, browsers, and verifiers
- derive tool budgets from remaining task time, not static config alone
- separate soft deadline, grace period, and hard kill
- record retry reason and fallback lane in a machine-readable receipt
- track stdout heartbeat gaps so "slow" and "stuck" are not treated the same
- fail closed for approvals, secrets, and destructive operations
- measure tool percentiles weekly and tune classes with data

## What I would do again

1. Start with 3 to 4 tool classes, not 20.
2. Make fallback lanes explicit before adding more retries.
3. Instrument timeout receipts before arguing about model quality.

## Conclusion

Hung runs are usually orchestration debt wearing an agent costume. Once each tool has a real budget, a kill path, and a fallback lane, the agent becomes much easier to trust and much easier to debug.

**Tags:** Agent Reliability, Tooling, Automation, DevOps, AI Coding
