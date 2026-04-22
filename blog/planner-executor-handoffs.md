---
layout: blog-post
title: "Planner-Executor Handoffs for AI Agents That Stay Reviewable"
description: "A practical guide to planner-executor handoffs for AI agents using task manifests, claim checks, verification gates, and rollback-friendly execution so multi-agent workflows stay understandable under real load."
date: 2026-04-22
tags:
  - Multi-Agent Systems
  - AI Agents
  - Workflow Design
  - Reliability
  - Reviewability
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2308121e%27/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2319334e%27/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%20%20%3Ccircle%20cx%3D%271020%27%20cy%3D%27110%27%20r%3D%27155%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%20%20%3Ccircle%20cx%3D%27180%27%20cy%3D%27520%27%20r%3D%27205%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%20%20%3Crect%20x%3D%2784%27%20y%3D%2786%27%20width%3D%271032%27%20height%3D%27456%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%20%20%3Ctext%20x%3D%27134%27%20y%3D%27184%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2746%27%20font-weight%3D%27700%27%3EPlanner-Executor%20Handoffs%3C/text%3E%0A%20%20%3Ctext%20x%3D%27134%27%20y%3D%27256%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2746%27%20font-weight%3D%27700%27%3Efor%20AI%20Agents%3C/text%3E%0A%20%20%3Ctext%20x%3D%27134%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ETask%20manifests%2C%20claim%20checks%2C%20verification%2C%20and%20clean%20execution%20boundaries%3C/text%3E%0A%20%20%3Crect%20x%3D%27134%27%20y%3D%27390%27%20width%3D%27304%27%20height%3D%2752%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27158%27%20y%3D%27424%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eseparate%20thinking%20from%20doing%3C/text%3E%0A%20%20%3Crect%20x%3D%27758%27%20y%3D%27182%27%20width%3D%27252%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27804%27%20y%3D%27217%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eplan.yaml%3C/text%3E%0A%20%20%3Crect%20x%3D%27758%27%20y%3D%27278%27%20width%3D%27252%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27786%27%20y%3D%27313%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eclaim-check.json%3C/text%3E%0A%20%20%3Crect%20x%3D%27758%27%20y%3D%27374%27%20width%3D%27252%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27818%27%20y%3D%27409%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eexecute%28%29%3C/text%3E%0A%3C/svg%3E
---

# Planner-Executor Handoffs for AI Agents That Stay Reviewable

Multi-agent demos usually fail in one boring place, the handoff. The planner writes a beautiful task list, the executor improvises past it, and by the time a reviewer looks at the diff nobody can tell what was intended versus what was guessed.

This gets worse under real load. Long prompts turn into soft contracts, retries re-run half-complete work, and two agents quietly operate on different assumptions about allowed files, budgets, or verification.

The fix is not more agent cleverness. It is a better handoff contract. If the planner emits a small manifest, the executor claims one task at a time, and verification gates are explicit, the system becomes much easier to debug and trust.

## Why this matters

The planner-executor split is attractive because it gives each agent a narrower job:

- the planner decomposes work
- the executor edits code or runs commands
- a verifier checks whether the result actually satisfied the contract

That separation only helps if the handoff is strong enough to survive model drift, retries, and human review. Otherwise you get more moving parts and less accountability.

Useful references: [Anthropic on building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [OpenTelemetry](https://opentelemetry.io/), and [AWS Step Functions task tokens](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) for the broader idea of explicit workflow state.

## Architecture or workflow overview

I like a four-artifact handoff: plan, claim check, execution record, and verification result.

```mermaid
flowchart LR
    A[Planner] --> B[Task manifest\nobjective, files, constraints, checks]
    B --> C[Claim check\ntask id, owner, ttl, attempt]
    C --> D[Executor\nedit, run, summarize]
    D --> E[Verifier\ntests, invariants, diff review]
    E --> F[Ledger\nstatus, rollback note, trace id]
```

### The contract I actually want

1. **Manifest** with one bounded task, not a novel.
2. **Allowed surface area** listing files, tools, and write scope.
3. **Verification gates** that must pass before completion.
4. **Claim check** so only one executor owns the task at a time.
5. **Execution summary** that says what changed and what remains risky.

## Implementation details

### 1. Make the planner write a real task manifest

If the planner hands over prose, the executor will fill in missing rules from vibes. A manifest gives you something reviewable.

```yaml
task_id: repo-142
objective: Add rate-limit backoff to the GitHub sync worker
allowed_paths:
  - src/github_sync.py
  - tests/test_github_sync.py
constraints:
  - Do not change API response schemas
  - Keep max retry delay under 30 seconds
verification:
  - pytest tests/test_github_sync.py -q
  - python -m scripts.smoke_github_sync
handoff_notes:
  - Existing failures come from 429 handling
  - Prefer jittered exponential backoff
```

The planner should not pre-write the entire patch. It should define the boundary, the success checks, and the danger zones.

### 2. Use a claim check before execution starts

This is the part teams skip, and then they wonder why two executors stamped on the same task.

```python
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class ClaimCheck:
    task_id: str
    owner: str
    expires_at: datetime
    attempt: int

    @classmethod
    def create(cls, task_id: str, owner: str, minutes: int = 20, attempt: int = 1):
        return cls(
            task_id=task_id,
            owner=owner,
            expires_at=datetime.utcnow() + timedelta(minutes=minutes),
            attempt=attempt,
        )

    def expired(self) -> bool:
        return datetime.utcnow() >= self.expires_at
```

A claim check is not fancy. It just prevents accidental parallelism and gives you a clean retry story.

### 3. Keep executor output structured

I do not want the executor returning only "done". I want a compact record a human or verifier can inspect.

```json
{
  "task_id": "repo-142",
  "status": "needs_review",
  "files_changed": [
    "src/github_sync.py",
    "tests/test_github_sync.py"
  ],
  "commands_run": [
    "pytest tests/test_github_sync.py -q",
    "python -m scripts.smoke_github_sync"
  ],
  "risks": [
    "Backoff constants tuned for current API rate window"
  ],
  "next_step": "Review retry cap before merging"
}
```

That record becomes the bridge between execution and review. It also makes it easier to build audit trails later.

### 4. Put verification outside the executor loop

The executor should propose work. The verifier should decide whether the work satisfied the contract.

```text
$ agent-run execute repo-142
[claim] task=repo-142 owner=executor-3 ttl=20m
[edit] src/github_sync.py updated
[test] pytest tests/test_github_sync.py -q ........ PASS
[smoke] python -m scripts.smoke_github_sync ...... PASS
[summary] status=needs_review files=2 risks=1
[verify] waiting on diff and invariant checks
```

This split matters because otherwise the same model that made the change is also grading its own homework.

## What went wrong and the tradeoffs

### Failure mode 1, the planner over-specifies the implementation

A planner that writes twenty tiny steps plus code-level instructions usually just pushes complexity downstream. The executor either ignores the plan or follows it so literally that better options are missed.

**What I would not do:** make the planner dictate exact code when the real need is a boundary and a verification target.

### Failure mode 2, the executor escapes the manifest

If allowed paths are not explicit, the executor will eventually wander into config files, shared utilities, or formatting churn. Then review scope explodes.

### Failure mode 3, retries lose ownership state

Without claim expiry and attempt counts, a crashed executor leaves behind a zombie task. The next worker cannot tell whether to resume, retry, or stop.

<div class="callout callout-warning"><strong>Pitfall:</strong> a planner-executor split does not magically create reliability. It usually adds one more place where ambiguous state can hide unless the handoff is explicit.</div>

| Pattern | Why it feels good initially | What breaks later | Better default |
| --- | --- | --- | --- |
| Planner writes long prose | Easy to prompt | Soft constraints, hidden assumptions | Small manifest with bounded fields |
| No claim ownership | Fewer moving parts | Duplicate execution | Claim check with TTL and attempt |
| Executor self-verifies | Fast loop | Self-grading bias | Separate verifier or invariant stage |
| Open-ended file access | More flexibility | Review blast radius grows | Allowed path list |

One tradeoff is real, though. Stronger handoffs add a bit of friction. For very small tasks, a single well-bounded agent may be simpler. I only split planner and executor when the task has enough complexity that reviewability matters more than pure speed.

## Practical checklist or decision framework

<div class="callout callout-success"><strong>Best practice:</strong> if a human reviewer cannot understand the task from the manifest plus execution record, the handoff is still too fuzzy.</div>

- write manifests with objective, allowed paths, constraints, and verification commands
- issue claim checks before any write-capable work starts
- keep one executor per task at a time, with ttl and attempt count
- require executor summaries that list files changed, commands run, and remaining risks
- separate verification from generation whenever the task can affect code, infra, or external state
- prefer a single agent for tiny tasks and a planner-executor split for higher-risk or multi-file work
- store ledger events so retries and postmortems are explainable later

## Conclusion

Planner-executor systems stay useful when the handoff looks more like a small workflow contract and less like a motivational speech. Keep the manifest tight, claim work explicitly, verify outside the edit loop, and make every run easy to inspect. Then multi-agent architecture stops being theater and starts being operationally sane.
