---
layout: blog-post
title: "Speculative Patch Generation for AI Coding Agents That Stays Reviewable"
description: "Build safer AI coding workflows by generating multiple candidate patches in parallel, scoring them with verifiers, and promoting only the most reviewable result."
date: 2026-05-11
tags:
  - AI Coding Agents
  - Verification
  - Developer Workflows
  - Git Worktrees
  - Reliability
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307121d%27/%3E%0A%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23173b62%27/%3E%0A%20%20%3C/linearGradient%3E%0A%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271020%27%20cy%3D%27108%27%20r%3D%27170%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%3Ccircle%20cx%3D%27180%27%20cy%3D%27520%27%20r%3D%27214%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2782%27%20y%3D%2784%27%20width%3D%271036%27%20height%3D%27462%27%20rx%3D%2732%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27132%27%20y%3D%27172%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27700%27%3ESpeculative%20Patch%20Generation%20for%20AI%20Coding%20Agents%3C/text%3E%0A%3Ctext%20x%3D%27132%27%20y%3D%27238%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27700%27%3EThat%20Stays%20Reviewable%3C/text%3E%0A%3Ctext%20x%3D%27132%27%20y%3D%27314%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EGenerate%20multiple%20candidate%20fixes%2C%20verify%20them%20hard%2C%20and%20only%20promote%20the%20patch%20that%20survives%20real%20checks%3C/text%3E%0A%3Crect%20x%3D%27132%27%20y%3D%27382%27%20width%3D%27348%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27156%27%20y%3D%27417%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eparallel%20ideas%2C%20single%20promoted%20result%3C/text%3E%0A%3Crect%20x%3D%27772%27%20y%3D%27176%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27810%27%20y%3D%27212%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Espawn%28worktree%29%3C/text%3E%0A%3Crect%20x%3D%27772%27%20y%3D%27274%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27828%27%20y%3D%27310%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Everify%28%29%3C/text%3E%0A%3Crect%20x%3D%27772%27%20y%3D%27372%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27808%27%20y%3D%27408%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Epromote%28best%29%3C/text%3E%0A%3C/svg%3E
canonical: https://negiadventures.github.io/blog/speculative-patch-generation-ai-coding-agents.html
---

# Speculative Patch Generation for AI Coding Agents That Stays Reviewable

## Hook
When an AI coding agent gets stuck on a tricky bug, the worst pattern is pretending the first patch is probably fine. It usually is not. One candidate may pass tests but hardcode the wrong assumption, another may be architecturally cleaner but break an edge case, and a third may simply not compile.

Speculative patch generation is the workflow I reach for when the bug has more than one plausible fix. Instead of asking one agent for one answer, I let the system generate several narrow candidate patches in parallel, score them with the same verifier pipeline, and promote exactly one result.

This is not about adding model theater. It is about buying optionality without multiplying reviewer pain.

## Why this matters
The production problem is simple: many engineering tasks are ambiguous at first contact. Retry logic, flaky tests, schema edge cases, race conditions, and performance regressions often have multiple valid directions. If your agent commits too early, humans spend the rest of the review untangling a path the machine should have discarded on its own.

A speculative workflow helps when:

- the failure mode has at least two believable root causes
- the edit surface is medium-sized but bounded
- verification is cheaper than long human review threads
- rollback cost is high enough that you want stronger promotion gates

What I would not do is run speculation on every typo, formatting fix, or tiny refactor. The overhead is real.

## Architecture or workflow overview
The core loop is: classify the task, generate 2 to 4 candidate patches in isolated worktrees, run identical verifiers, score the outputs, and promote one patch or escalate to a human if none are good enough.

```mermaid
flowchart LR
    A[Task arrives] --> B[Classify ambiguity and risk]
    B --> C1[Candidate A worktree]
    B --> C2[Candidate B worktree]
    B --> C3[Candidate C worktree]
    C1 --> D[Shared verifier pipeline]
    C2 --> D
    C3 --> D
    D --> E[Scorecard: tests, diff risk, policy, cost]
    E --> F{Promote one?}
    F -->|yes| G[Apply winning patch]
    F -->|no| H[Escalate with evidence]
```

A useful rule is to speculate on approach, not on everything. Make the candidates different in one meaningful dimension, such as lock strategy, retry placement, caching behavior, or validation order.

## Implementation details
### 1) Spawn isolated candidates
Use one branch or worktree per candidate so the patches cannot trample each other. Git worktrees are a nice fit because they keep file state isolated while sharing the object store.

```bash
git worktree add ../wt-fix-a -b spec/fix-a
git worktree add ../wt-fix-b -b spec/fix-b
git worktree add ../wt-fix-c -b spec/fix-c
```

Each candidate should get a different prompt contract. If every branch receives the same brief, you are mostly paying for duplicates.

```yaml
candidates:
  - id: fix-a
    strategy: "move retry loop to client boundary"
    constraints: ["no schema changes", "preserve timeout budget"]
  - id: fix-b
    strategy: "keep retry local, add idempotency key"
    constraints: ["no new dependency", "must preserve metrics tags"]
  - id: fix-c
    strategy: "fail fast on duplicate writes"
    constraints: ["optimize for safety over throughput"]
```

### 2) Run the same verifier pipeline on every candidate
This is where most teams either win or cheat. Do not let each candidate invent its own proof of correctness. The verifier contract must be shared.

```json
{
  "pipeline": [
    "npm run lint",
    "npm test -- --runInBand",
    "python tools/check_diff_risk.py",
    "semgrep --config p/default .",
    "python tools/score_patch.py results.json"
  ],
  "promotion_threshold": 0.82,
  "hard_fail": ["security", "migration-risk", "snapshot-drift"]
}
```

A candidate that passes tests but trips a policy gate should still lose. This is especially important when the agent is willing to hide risk behind small diffs.

### 3) Build a deterministic scorecard
If promotion depends on vibes, the whole workflow collapses. I like a weighted score that is simple enough to explain in review.

```python
from dataclasses import dataclass

@dataclass
class CandidateScore:
    tests_passed: bool
    lint_passed: bool
    risk_penalty: float
    diff_size_penalty: float
    latency_penalty: float
    reviewer_bonus: float = 0.0

    def total(self) -> float:
        base = 1.0
        if not self.tests_passed or not self.lint_passed:
            return 0.0
        return max(
            0.0,
            base
            - self.risk_penalty
            - self.diff_size_penalty
            - self.latency_penalty
            + self.reviewer_bonus,
        )
```

The point is not pretending the score is mathematically pure. The point is making the choice inspectable and repeatable.

## Terminal view I actually want
```text
candidate   tests   risk   diff   p95-latency   score   result
fix-a       pass    low    42     +4ms          0.91    promote
fix-b       pass    med    67     +1ms          0.79    hold
fix-c       fail    low    21     -2ms          0.00    reject
```

## What went wrong and the tradeoffs
The first failure mode is correlated bad context. If every candidate sees the same flawed incident summary, you get three wrong answers instead of one. I mitigate that by giving each candidate the same invariant set but slightly different hypotheses.

The second failure mode is verifier blind spots. Speculation works only if the promotion gate catches the bad kind of clever. If your tests miss idempotency regressions or policy checks ignore dangerous config drift, the cleanest-looking patch can still be wrong.

The third tradeoff is cost. Parallel candidate generation uses more tokens, more CI, and more local compute. That is acceptable for ambiguous high-leverage fixes, not for routine maintenance.

### Comparison table
| Approach | Best for | Main upside | Main downside |
| --- | --- | --- | --- |
| Single agent, single patch | Small obvious fixes | Lowest cost and fastest loop | Commits too early on ambiguous bugs |
| Speculative patch generation | Medium ambiguity, bounded blast radius | Better fix quality and stronger promotion confidence | Higher token and verification cost |
| Human-only design first | High-risk architecture or migrations | Strongest judgment and constraint handling | Slowest iteration cycle |

### Pitfalls to avoid
- Do not promote the biggest diff just because it looks comprehensive.
- Do not let candidates modify different test fixtures unless that variance is intentional.
- Do not compare scores generated from different verifier versions.
- Do not keep losing candidates around forever. They become noise and accidental future context.

## Practical checklist or decision framework
Use speculative patch generation when most of these are true:

- [ ] there are at least two plausible fix strategies
- [ ] the task can be isolated to a few files or a narrow subsystem
- [ ] verifier cost is lower than expected human review churn
- [ ] you have hard-fail policy checks for security and migrations
- [ ] the team can explain why the promoted patch won
- [ ] losing candidates will be deleted or archived intentionally

If only one of those boxes is checked, I would skip speculation and run a simpler single-patch flow.

## Best practices I would keep
1. Cap candidates at three unless the task is unusually expensive to debug by hand.
2. Keep one shared verifier version for all candidates.
3. Require a short winner summary that explains why the promoted patch beat the others.
4. Record why the losers lost, because that becomes useful training data for future routing.

## Conclusion
Speculative patch generation is worth it when uncertainty is high and review time is expensive. The trick is not generating more code. The trick is generating controlled alternatives, verifying them identically, and promoting exactly one result with evidence.

## References
- [Git worktree documentation](https://git-scm.com/docs/git-worktree)
- [Semgrep documentation](https://semgrep.dev/docs/)
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/)
