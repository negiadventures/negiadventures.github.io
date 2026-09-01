---
layout: blog-post
title: "Retry and Recovery Patterns for Long-Running AI Agent Jobs"
description: "A practical guide to building retryable AI agent jobs with idempotency keys, checkpoints, queues, and human-safe recovery paths."
date: 2026-04-12
tags:
  - AI Agents
  - Reliability
  - Queues
  - Distributed Systems
  - Production Ops
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23070f1a%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2315314e%27/%3E%3C/linearGradient%3E%3ClinearGradient%20id%3D%27panel%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%230b1220%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2310192b%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%3Ccircle%20cx%3D%271020%27%20cy%3D%27105%27%20r%3D%27155%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%3Ccircle%20cx%3D%27180%27%20cy%3D%27535%27%20r%3D%27210%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%3Crect%20x%3D%2780%27%20y%3D%2785%27%20width%3D%271040%27%20height%3D%27460%27%20rx%3D%2732%27%20fill%3D%27url%28%23panel%29%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%3Ctext%20x%3D%27135%27%20y%3D%27188%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2748%27%20font-weight%3D%27700%27%3ERetry%20and%20Recovery%3C/text%3E%3Ctext%20x%3D%27135%27%20y%3D%27260%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2748%27%20font-weight%3D%27700%27%3Efor%20Long-Running%20AI%20Jobs%3C/text%3E%3Ctext%20x%3D%27135%27%20y%3D%27342%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EIdempotency%2C%20checkpoints%2C%20queues%2C%20and%20safe%20operator%20restarts%3C/text%3E%3Crect%20x%3D%27135%27%20y%3D%27392%27%20width%3D%27280%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27158%27%20y%3D%27427%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3EProduction%20reliability%20patterns%3C/text%3E%3Cpath%20d%3D%27M770%20215h230v52H770z%27%20fill%3D%27%230c1626%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27807%27%20y%3D%27248%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2722%27%3Eenqueue%28job%29%3C/text%3E%3Cpath%20d%3D%27M770%20302h230v52H770z%27%20fill%3D%27%230c1626%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27795%27%20y%3D%27335%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2722%27%3Echeckpoint%20saved%3C/text%3E%3Cpath%20d%3D%27M770%20389h230v52H770z%27%20fill%3D%27%230c1626%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27833%27%20y%3D%27422%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2722%27%3Eresume%28%29%3C/text%3E%3C/svg%3E
visual_plan:
  hero: "Dark reliability banner with queue events, checkpoint blocks, and restart/resume cues"
  diagram: "Agent job lifecycle from enqueue to checkpoint, retry, human review, and completion"
  terminal: "Worker log showing retry scheduling and safe resume after a timeout"
  comparison_table: "When to retry, resume from checkpoint, or escalate to a human"
  code_sections:
    - "Job envelope with idempotency keys and retry budget"
    - "Worker loop with durable checkpoints and lease renewal"
    - "Queue payload and operator replay command"
meta_description: "A practical guide to building retryable AI agent jobs with idempotency keys, checkpoints, queues, and human-safe recovery paths."
---

# Retry and Recovery Patterns for Long-Running AI Agent Jobs

A lot of AI agent demos look reliable right up until the first timeout, model 429, or half-finished side effect. Then the job either starts over from scratch, duplicates work, or leaves an operator guessing what actually happened.

Long-running agent tasks need the same discipline as any other background system. If a job can call tools, write data, or spend money for ten minutes straight, retry logic is no longer a small implementation detail. It is the difference between a recoverable blip and a broken workflow.

This post walks through the patterns I would use to make long-running agent jobs restartable, observable, and safer to operate: idempotency keys, leases, checkpoints, bounded retries, and clean human handoff.

## Why this matters

The failure shape of agent jobs is messy by default:

- a model call can time out after the tool already mutated state
- a worker can die after generating a useful partial result
- a queue retry can replay the same side effect unless the job is idempotent
- an operator can rerun a stuck task without knowing whether the previous attempt is still alive

That makes “just retry it” a risky answer. The system needs to know which work is safe to repeat, which work should resume from a checkpoint, and which work should stop and ask for a human.

## Architecture or workflow overview

### The flow I want

```mermaid
flowchart TD
    A[Job created with idempotency key] --> B[Queue stores job envelope]
    B --> C[Worker acquires lease]
    C --> D[Load latest checkpoint]
    D --> E[Run next bounded step]
    E --> F{Step result}
    F -->|Success| G[Save checkpoint and renew lease]
    G --> H{More steps left?}
    H -->|Yes| E
    H -->|No| I[Mark completed]
    F -->|Transient failure| J[Backoff and requeue]
    F -->|Permanent failure| K[Send to dead letter or human review]
    F -->|Unsafe ambiguity| L[Pause for operator decision]
```

### The design rule

Treat the agent like a workflow engine, not a single giant prompt. Each step should be small enough to retry or resume with confidence.

| Concern | Good default | Why it helps |
| --- | --- | --- |
| Duplicate protection | Idempotency key per externally visible action | Stops replayed writes and duplicate PRs, tickets, or messages |
| Progress tracking | Durable checkpoint after each meaningful step | Avoids restarting the whole run after minute nine of ten |
| Worker ownership | Lease with heartbeat renewal | Prevents two workers from “helpfully” processing the same job |
| Retry policy | Exponential backoff plus retry budget | Handles flaky dependencies without creating infinite churn |
| Human intervention | Explicit paused state | Makes ambiguity visible instead of silently guessing |

## Implementation details

### 1. Put every job in a durable envelope

The queue payload should carry enough state to answer three questions later: what is this job, what has it already done, and how many more times am I willing to try.

```json
{
  "jobId": "blog-pr-2026-04-12-001",
  "workflow": "daily-blog-pr",
  "attempt": 2,
  "maxAttempts": 5,
  "leaseOwner": null,
  "idempotencyKey": "daily-blog-pr:2026-04-12",
  "checkpointVersion": 4,
  "resumeFrom": "write_html",
  "createdAt": "2026-04-12T11:55:02Z",
  "visibilityTimeoutSeconds": 900
}
```

I like keeping the envelope boring and explicit. The agent can still have rich internal state, but the queue contract should be simple enough for operators and scripts to inspect quickly.

### 2. Separate step execution from workflow control

A worker should not blindly re-run the whole plan on every retry. It should load the latest checkpoint, execute one bounded step, persist the result, then decide whether to continue or requeue.

```ts
async function processJob(job: JobEnvelope) {
  const lease = await acquireLease(job.jobId, workerId, 15 * 60);
  if (!lease.ok) return;

  const checkpoint = await loadCheckpoint(job.jobId);
  const step = nextStep(checkpoint);

  try {
    const result = await runStep(step, checkpoint.context);

    await saveCheckpoint(job.jobId, {
      ...checkpoint,
      lastStep: step.name,
      context: result.context,
      completedSteps: [...checkpoint.completedSteps, step.name]
    });

    await renewLease(job.jobId, workerId);
    await enqueueIfNeeded(job.jobId);
  } catch (error) {
    if (isTransient(error) && job.attempt < job.maxAttempts) {
      await requeueWithBackoff(job, nextDelay(job.attempt + 1));
      return;
    }

    if (isAmbiguousWrite(error)) {
      await pauseForHuman(job.jobId, checkpoint, error);
      return;
    }

    await moveToDeadLetter(job, error);
  } finally {
    await releaseLease(job.jobId, workerId);
  }
}
```

The main point is that the worker owns orchestration, while `runStep` owns task logic. That split makes replay and debugging much less chaotic.

### 3. Checkpoint before risky boundaries

I would checkpoint before and after any expensive or side-effecting operation:

- before a model call that can take 60 seconds and burn a lot of tokens
- before a tool call that writes to GitHub, Jira, Slack, or a database
- after generating an artifact that is expensive to reproduce
- before switching from analysis to action

A good checkpoint is not a full transcript dump. It is the minimum structured state required to continue safely.

```yaml
job_id: blog-pr-2026-04-12-001
last_step: create_pr
completed_steps:
  - choose_topic
  - write_markdown
  - write_html
artifacts:
  branch: ai-blog/2026-04-12-agent-retry-recovery
  commit_sha: 7d9e3ba
  pr_url: null
side_effects:
  github_push:
    done: true
    idempotency_key: daily-blog-pr:2026-04-12:push
  github_pr_create:
    done: false
context:
  slug: agent-retry-recovery
  title: Retry and Recovery Patterns for Long-Running AI Agent Jobs
```

That is enough to resume from PR creation without regenerating the post or pushing another branch.

### 4. Use logs that operators can actually act on

A clean terminal trace is a reliability feature. If the log makes it obvious whether the worker retried, resumed, or paused, humans can recover faster.

```text
2026-04-12T11:58:02Z job=blog-pr-2026-04-12-001 step=create_pr attempt=1 lease=worker-3
2026-04-12T11:58:06Z provider=github status=502 class=transient action=requeue delay=120s
2026-04-12T12:00:07Z job=blog-pr-2026-04-12-001 step=create_pr attempt=2 checkpoint=write_html
2026-04-12T12:00:09Z provider=github status=201 pr=142 action=complete
```

That is much better than a single vague line saying “task failed”.

## What went wrong, and the tradeoffs

### Retry is not the same thing as recovery

A transient timeout on a read-only model call is a normal retry case. A timeout after sending an email or creating a pull request is different. The system may not know whether the side effect already happened.

That is why I separate failures into three buckets:

| Failure type | Example | Best response |
| --- | --- | --- |
| Transient | 429, network timeout, overloaded model gateway | Retry with backoff |
| Recoverable with checkpoint | Worker restart mid-run, deploy interruption | Resume from last durable step |
| Ambiguous side effect | Request timed out after a write may have succeeded | Pause, verify externally, then resume or mark done |

### The most common mistake

The most common mistake is storing the entire workflow state only in memory. It works until the worker restarts. Then the queue retries a job that no longer remembers what it already did.

### Security and reliability concerns

If the job can perform write actions, every replay path needs guardrails:

- use idempotency keys for external APIs whenever possible
- bind every checkpoint to a concrete principal or service account
- keep step outputs structured so you can audit what happened
- avoid automatic retries on destructive steps unless the downstream API is explicitly idempotent

### What I would not do

I would not let a single agent prompt manage a 20-step workflow without durable checkpoints. I also would not auto-retry side-effecting tool calls just because the HTTP client labeled the error as retryable. In agent systems, ambiguity matters more than optimistic throughput.

> **Pitfall callout**
>
> If your workflow creates Git branches, PRs, tickets, or notifications, a missing idempotency key will eventually show up as duplicate human-visible work. That is the kind of bug that makes an automation feel untrustworthy very quickly.

## Practical checklist or decision framework

### What I would do again

- [ ] Give every externally visible action its own idempotency key
- [ ] Break long jobs into bounded steps with checkpointable outputs
- [ ] Use worker leases so only one runner owns a job at a time
- [ ] Keep retry budgets finite and visible in the job envelope
- [ ] Pause ambiguous writes for operator review instead of guessing
- [ ] Send dead-letter jobs somewhere an operator will actually inspect

### Quick decision framework

1. **Can this step be repeated safely?** If yes, retry.
2. **Can this step resume from saved state?** If yes, restore checkpoint and continue.
3. **Could this step have already mutated the outside world?** If yes, verify before replay.
4. **Is the failure repeated after the retry budget is spent?** Escalate to a human or dead-letter queue.

## Conclusion

Long-running agent jobs become much easier to trust once retry and recovery are treated as first-class design problems. Durable checkpoints, explicit idempotency, and honest pause states keep failures small instead of mysterious.

If I were building a new agent runner today, I would optimize less for uninterrupted happy-path execution and more for clean restarts after the inevitable messy failure. That is what makes the automation feel production-ready instead of lucky.
