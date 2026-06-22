---
layout: blog-post
title: "Lease-Based Workspace Locks for Parallel AI Coding Agents Without Patch Collisions"
description: "A practical guide to lease-based workspace locks for parallel AI coding agents using TTL-backed claims, path scopes, heartbeats, and stale-lock recovery so concurrent runs stop clobbering the same files."
date: 2026-06-22
tags:
  - AI Coding Agents
  - Concurrency Control
  - Repo Automation
  - Developer Tooling
  - Reliability
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23164c73%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%3Ccircle%20cx%3D%27992%27%20cy%3D%27108%27%20r%3D%27184%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%3Ccircle%20cx%3D%27192%27%20cy%3D%27516%27%20r%3D%27216%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3ELease-Based%20Workspace%20Locks%20for%20Parallel%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EAI%20Coding%20Agents%20Without%20Patch%20Collisions%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2728%27%3ELet%20multiple%20agents%20work%20in%20parallel%20without%20letting%20two%20runs%20silently%3C/text%3E%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2728%27%3Eedit%20the%20same%20files,%20reuse%20stale%20worktrees,%20or%20steal%20broken%20locks.%3C/text%3E%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27388%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2724%27%3Econcurrency%20without%20coordination%20is%20just%20fast%20corruption%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27818%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Epath%20lease%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27810%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Eheartbeat%20TTL%3C/text%3E%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27802%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial,%20sans-serif%27%20font-size%3D%2723%27%3Estale-lock%20sweep%3C/text%3E%3C/svg%3E
---

# Lease-Based Workspace Locks for Parallel AI Coding Agents Without Patch Collisions

## Hook
If you let multiple coding agents run against the same repository, they eventually step on each other. One rewrites a file another agent already patched. One reuses a worktree that still has uncommitted state. One crashes and leaves behind a lock that nobody trusts.

That failure mode is easy to miss because every individual run looks reasonable. The corruption only becomes visible later, when a verifier fails for the wrong reason or a reviewer sees a PR that mixed unrelated edits.

The fix is not “just use branches.” Branches isolate git history, not active file ownership. What you need is a small lease system around paths, worktrees, and heartbeats.

## Why this matters
Parallel AI coding is now normal in repo automation, eval harnesses, and scheduled fixers. The moment you allow more than one worker to mutate a repo, you need a coordination story.

This matters most when you have:

- multiple agents running from a queue
- shared repos with reusable worktrees
- retry behavior after timeouts or verifier failures
- long-running tasks that pause for human approval

Without coordination, you get hidden costs:

- noisy diffs with unrelated edits
- non-deterministic verifier failures
- stale worktrees that poison later tasks
- race conditions that look like model mistakes

## Visual plan
- Hero: dark control-plane banner with path lease, heartbeat TTL, and stale-lock sweep cues
- Diagram: queue → planner → lease store → workspace → verifier flow with renewal and expiry
- Terminal visual: lock acquisition and stale-lock reclaim output
- Comparison table: file lock vs branch-per-task vs lease-based scopes
- Tags: AI Coding Agents, Concurrency Control, Repo Automation, Developer Tooling, Reliability
- Meta description: A practical guide to lease-based workspace locks for parallel AI coding agents using TTL-backed claims, path scopes, heartbeats, and stale-lock recovery so concurrent runs stop clobbering the same files.
- Code sections: lease claim schema, heartbeat renewal loop, lock-aware task scheduler

## Architecture or workflow overview
```mermaid
flowchart LR
    Q[Task Queue] --> P[Planner]
    P --> L[Lease Store]
    L -->|path + worktree claim| W[Workspace Runner]
    W --> H[Heartbeat Renewal]
    W --> V[Verifier]
    H --> L
    V --> R[Release or Expire]
    R --> L
    L --> S[Stale Lock Sweeper]
```

The useful unit is not “repo locked” or “repo unlocked.” It is a scoped lease.

A task claims:

1. a workspace or worktree identifier
2. a path prefix or file set
3. a TTL with periodic renewal
4. an owner identity and task ID

That gives you enough coordination to let unrelated edits proceed in parallel while still blocking collisions.

## Implementation details
### 1. Store leases as explicit records
The lease record should be boring and inspectable. I like a single table or JSON document model with strong uniqueness around the scope key.

```json
{
  "leaseId": "lease_01jy4v8r9f",
  "repo": "github.com/acme/payments",
  "scope": {
    "kind": "path-set",
    "paths": ["services/billing", "libs/tax"]
  },
  "workspaceId": "wt-billing-17",
  "owner": {
    "taskId": "job_4821",
    "agentId": "codex-worker-4"
  },
  "status": "active",
  "version": 3,
  "acquiredAt": "2026-06-22T12:02:00Z",
  "expiresAt": "2026-06-22T12:07:00Z"
}
```

A few details matter here:

- keep the scope explicit, not implied by branch name
- version the record so renewals can be compare-and-swap updates
- make expiry visible so operators can reason about stale state quickly

### 2. Renew leases with heartbeats, not permanent locks
Permanent locks are how automation gets stuck forever. Use short TTLs and renew only while the task is still healthy.

```python
from datetime import datetime, timedelta, UTC

LEASE_TTL = timedelta(minutes=5)
RENEW_EVERY = timedelta(minutes=2)

def renew_lease(store, lease_id, expected_version):
    now = datetime.now(UTC)
    updated = store.compare_and_swap(
        lease_id=lease_id,
        expected_version=expected_version,
        patch={
            "version": expected_version + 1,
            "expiresAt": (now + LEASE_TTL).isoformat()
        }
    )
    if not updated:
        raise RuntimeError("lease lost or replaced")
    return expected_version + 1
```

The worker should treat a failed renewal as a stop signal. That is the safest choice. If another process reclaimed the lease, continuing to edit is now hostile.

### 3. Make scheduling aware of overlapping scopes
A queue worker should not just pop the next task and hope. It should ask whether the requested scope overlaps with active leases.

```ts
function canStart(taskScope: string[], activeScopes: string[][]): boolean {
  return !activeScopes.some(active =>
    active.some(path =>
      taskScope.some(candidate =>
        candidate.startsWith(path) || path.startsWith(candidate)
      )
    )
  );
}
```

This overlap rule is intentionally simple. Prefix-based scopes work well when repos already follow service or package boundaries. If your ownership model is weaker than that, the locking problem is not the first thing you need to fix.

### 4. Separate worktree reuse from scope ownership
A common bug is treating a reusable worktree as proof of safe ownership. It is not.

A better pattern is:

- lease the path scope first
- allocate or attach a clean worktree second
- run verification in that worktree
- release both independently

That prevents one stale worktree from becoming a hidden global singleton.

### Example terminal output
```text
$ agent-runner acquire --repo acme/payments --scope services/billing
lease acquired: lease_01jy4v8r9f
workspace: wt-billing-17
ttl: 300s

$ agent-runner renew lease_01jy4v8r9f
lease renewed: version=4 expiresAt=2026-06-22T12:09:00Z

$ agent-runner sweep-stale --repo acme/payments
reclaimed: lease_01jy4v7d2a owner=job_4818 expired=164s
```

## Comparison table
| Approach | What it helps | Where it fails | My take |
| --- | --- | --- | --- |
| Global repo lock | Easy to implement | Kills parallelism, causes queues to back up | Fine for prototypes, wasteful in production |
| Branch per task only | Cleaner git history | Does not prevent file collisions or stale worktrees | Necessary, not sufficient |
| OS file locks | Low-level exclusivity | Hard to reason about across distributed workers | Useful inside one machine, weak as a fleet policy |
| Lease-based scoped locks | Good parallelism with visible ownership | Needs heartbeat logic and stale-lock recovery | Best fit for serious agent runners |

## What went wrong and the tradeoffs
### Failure mode: stale locks after worker death
This is the obvious one. A worker crashes, the lease remains, and everything downstream waits forever.

That is why TTL-backed expiry matters more than manual unlock commands. Manual unlock is an escape hatch, not your steady-state design.

### Failure mode: scopes that are too broad
If every task asks for `src/`, your lease system becomes a fancy global lock. If every task asks for individual files, planners spend more time computing scopes than doing useful work.

In practice, path-prefix scopes such as service directories, package roots, or owned module sets are the sweet spot.

### Failure mode: unsafe lock stealing
Some teams let a newer worker steal an existing lease if it looks idle. I do not love that unless you also have proof the original task is dead.

Safer inputs for reclaiming a lease:

- TTL expired
- heartbeat missed twice
- underlying worker process no longer exists
- verifier has not emitted progress for a bounded interval

### Security concern: forged renewals
If a worker can renew any lease by ID, one compromised process can hold the repo hostage.

Minimum guardrails:

- signed or scoped worker identity
- compare-and-swap version checks
- lease owner binding on renew and release calls
- audit logs for every reclaim action

### Cost tradeoff: more coordination traffic
Yes, lease heartbeats add writes. But the alternative is wasting much larger amounts of time in failed runs, rework, and noisy reviews. This is a good trade in any system that runs agents continuously.

## Practical checklist
Use lease-based workspace locks if most of these are true:

- [ ] more than one agent can mutate the same repo at once
- [ ] tasks can run longer than a few minutes
- [ ] workers retry automatically after failure
- [ ] worktrees are reused instead of always recreated
- [ ] reviewers keep seeing mixed or flaky diffs

What I would do again:

- [ ] scope leases to service or package boundaries
- [ ] use short TTLs with automatic renewal
- [ ] stop work immediately on lost lease
- [ ] make stale-lock sweeps observable and auditable
- [ ] keep branch isolation, but do not mistake it for concurrency control

## Best-practices callout
A lease system should fail closed for writes and fail open for reads. If lock state is ambiguous, pause the mutating task. Let read-only planning or retrieval continue.

That one rule prevents a lot of quiet damage.

## Conclusion
Parallel AI coding gets messy when the system confuses “multiple branches exist” with “multiple writers are coordinated.” They are not the same thing.

Lease-based workspace locks are not glamorous, but they turn concurrency from a source of diff corruption into something you can actually reason about.

## References
- https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html
- https://redis.io/docs/latest/develop/use/patterns/distributed-locks/
- https://git-scm.com/docs/git-worktree
