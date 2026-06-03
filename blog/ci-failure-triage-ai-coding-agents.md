---
title: "CI Failure Triage for AI Coding Agents That Should Not Retry Blindly"
description: "A practical guide to triaging CI failures for AI coding agents with failure buckets, artifact packs, flaky-test fingerprints, and patch-vs-retry rules so automation stops retrying doomed jobs or patching around broken infrastructure."
date: 2026-06-03
tags:
  - AI Agents
  - CI/CD
  - Reliability
  - Test Automation
  - GitHub Actions
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23184f78%27%2F%3E%0A%20%20%3C%2FlinearGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27%2F%3E%0A%3Ccircle%20cx%3D%271008%27%20cy%3D%27108%27%20r%3D%27174%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27%2F%3E%0A%3Ccircle%20cx%3D%27184%27%20cy%3D%27520%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27%2F%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27%2F%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27166%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3ECI%20Failure%20Triage%20for%20AI%20Coding%20Agents%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27226%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EThat%20Should%20Not%20Retry%20Blindly%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27300%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ESeparate%20code%20bugs%20from%20flaky%20tests%2C%20infra%20outages%2C%20and%20missing%20secrets%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27336%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Ebefore%20your%20agent%20burns%20tokens%20patching%20the%20wrong%20thing%3C%2Ftext%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27360%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eretry%20is%20a%20decision%2C%20not%20a%20reflex%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27820%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eartifact%20pack%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27808%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Efailure%20bucket%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27830%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esafe%20lane%3C%2Ftext%3E%0A%3C%2Fsvg%3E"
slug: "ci-failure-triage-ai-coding-agents"
---

# CI Failure Triage for AI Coding Agents That Should Not Retry Blindly

## Visual plan
- **Hero image idea:** dark CI control-room banner with artifact pack, failure bucket, and safe lane callouts
- **Architecture or diagram idea:** Mermaid flow from failed run to classifier, artifact packer, retry lane, and patch lane
- **Optional terminal-output visual idea:** a failed GitHub Actions run summary showing bucket assignment and retry verdict
- **Optional comparison table idea:** code bug vs flaky test vs infra fault vs secret/config failure
- **Tags:** AI Agents, CI/CD, Reliability, Test Automation, GitHub Actions
- **Meta description:** A practical guide to triaging CI failures for AI coding agents with failure buckets, artifact packs, flaky-test fingerprints, and patch-vs-retry rules so automation stops retrying doomed jobs or patching around broken infrastructure.
- **Suggested code snippet sections:** failure classifier config, artifact bundle payload, retry policy logic

## Hook
Most AI coding pipelines treat a red CI run like a generic “try again” signal. That is how you end up paying for three more model calls while the real problem is a bad cache key, a missing secret, or one flaky browser test on Ubuntu.

A human reviewer usually spots the difference quickly. The log says `npm ERR! 401`, or the stack trace only appears on one shard, or the failure is obviously infra because the Docker pull timed out before tests even started.

Agents need that judgment encoded. This post walks through a triage pattern I like: classify failures into buckets, collect a compact artifact pack, then send the run into an explicit retry lane, patch lane, or human-escalation lane.

## Why this matters
When AI agents are allowed to patch code after CI fails, the expensive mistake is not a bad diff. It is misdiagnosis.

If the run failed because the code is wrong, generating a patch is useful. If the run failed because the runner lost network, a test is flaky, or a secret is unavailable on forks, code changes are noise. They waste review time and can even make the branch worse.

In production repo automation, I care about four outcomes:

- **faster recovery** for real code regressions
- **lower token burn** on failures that should never trigger another model pass
- **cleaner audit trails** for why the system retried, patched, or escalated
- **fewer fake fixes** that paper over infra or test hygiene problems

## Architecture or workflow overview
```mermaid
flowchart TD
    A[CI run fails] --> B[Collect artifact pack]
    B --> C[Failure classifier]
    C --> D{{Bucket}}
    D -->|code regression| E[Patch lane]
    D -->|flaky test| F[Quarantine or rerun lane]
    D -->|infra outage| G[Retry with cooldown]
    D -->|secret or config| H[Human escalation]
    E --> I[Focused patch + verifier]
    F --> J[Fingerprint failure + emit test debt record]
    G --> K[Bounded rerun with same commit SHA]
    H --> L[Stop automation and attach evidence]
```

The key design choice is that retry, patch, and escalation are different products. They need different evidence, different budgets, and different permissions.

## Implementation details

### 1) Normalize failures into buckets before you ask the model to help
I would not feed the raw CI transcript straight back into the agent. First reduce it into a classifier input with exit signals, failing step names, and a few high-value log lines.

```yaml
buckets:
  code_regression:
    match_any:
      - "AssertionError"
      - "TypeError:"
      - "undefined is not a function"
    action: patch
    max_auto_retries: 0
  flaky_test:
    match_any:
      - "Timeout 30000ms exceeded"
      - "ECONNRESET during test"
      - "stale element reference"
    action: rerun_once
    max_auto_retries: 1
  infra_fault:
    match_any:
      - "failed to pull image"
      - "network timed out"
      - "No space left on device"
    action: cooldown_retry
    max_auto_retries: 2
  secret_or_config:
    match_any:
      - "401 Unauthorized"
      - "Missing required environment variable"
      - "Resource not accessible by integration"
    action: escalate
    max_auto_retries: 0
```

This does not need to be perfect. It just needs to be good enough to stop obviously wrong remediation paths.

### 2) Build a compact artifact pack, not a log dump
The artifact pack is what I would persist and pass downstream. It is smaller than the full logs, but rich enough for both an agent and a human reviewer.

```json
{
  "run_id": 194281775,
  "commit_sha": "1d3c5af",
  "workflow": "test-and-lint",
  "failed_job": "playwright-e2e",
  "bucket": "flaky_test",
  "fingerprint": "playwright-timeout:checkout.spec.ts:guest checkout works",
  "first_failure_line": "Timeout 30000ms exceeded while waiting for [data-test=place-order]",
  "suspect_files": ["tests/e2e/checkout.spec.ts", "playwright.config.ts"],
  "rerun_eligible": true,
  "links": {
    "run": "https://github.com/org/repo/actions/runs/194281775",
    "artifacts": "https://github.com/org/repo/actions/runs/194281775/artifacts"
  }
}
```

I like storing one fingerprint per distinct failure shape. That makes it easier to spot recurring flakes without rereading the same logs every day.

### 3) Make retry policy explicit in code
Blind retry loops are where automation gets sloppy. Put the retry decision behind a small policy function so you can audit and tune it.

```ts
export function decideNextAction(input: {
  bucket: 'code_regression' | 'flaky_test' | 'infra_fault' | 'secret_or_config';
  retriesUsed: number;
  maxRetries: number;
  sameFingerprintCount: number;
}) {
  if (input.bucket === 'code_regression') {
    return { action: 'open_patch_lane', reason: 'code evidence present' };
  }

  if (input.bucket === 'flaky_test' && input.retriesUsed < 1) {
    return { action: 'rerun_same_sha', reason: 'single rerun allowed for flaky bucket' };
  }

  if (input.bucket === 'infra_fault' && input.retriesUsed < input.maxRetries) {
    return { action: 'cooldown_retry', reason: 'runner or network fault likely transient' };
  }

  return {
    action: 'escalate',
    reason: input.sameFingerprintCount > 2
      ? 'repeated fingerprint suggests systemic issue'
      : 'policy disallows more automation'
  };
}
```

The nice thing about this pattern is that the model no longer decides whether it deserves another turn. The runtime does.

### 4) Add a terminal-style summary for reviewers
Short summaries save a lot of human patience. This is the kind of output I want attached to a bot comment or run note.

```text
$ triage-ci-failure --run 194281775
bucket: flaky_test
fingerprint: playwright-timeout:checkout.spec.ts:guest checkout works
sha: 1d3c5af
next-action: rerun_same_sha
why: single rerun allowed for flaky bucket
notes: same code passed on previous two commits, failure isolated to e2e shard 3
```

That is enough for someone skimming the PR to understand why the system retried instead of opening a bad patch.

## What went wrong, and the tradeoffs
One lesson here is that failure buckets drift. Tests change, CI providers change, and a pattern that used to mean “flaky” can become a real regression after a framework upgrade.

Another lesson is that artifact packs can become too thin. If you over-reduce the evidence, the patch lane loses the context it needs to fix a legitimate bug. If you under-reduce it, you are back to shoving giant logs into the model.

| Bucket | Best first action | Risk if misclassified | What I watch |
| --- | --- | --- | --- |
| Code regression | Open patch lane | Missed bug or bad auto-fix | failing test name, blame window, suspect files |
| Flaky test | Rerun once, same SHA | hides real instability | fingerprint frequency, shard skew, pass-on-rerun rate |
| Infra fault | Cooldown retry | wasteful loops during outages | provider status, runner error rate, pull/cache failures |
| Secret or config | Escalate to human | impossible code patch attempts | auth errors, env availability, permission scopes |

### A few failure modes I would not ignore
- **Fork PR permissions**: bots often try to “fix” code when the real problem is that secrets are intentionally unavailable to forked workflows.
- **Test-order dependence**: reruns can pass and still hide contamination between tests.
- **Artifact expiry**: if your pack points at logs that vanish in a day, incident review gets much harder.
- **Cost leaks**: one noisy flake can repeatedly wake an expensive patching agent unless fingerprint repetition is capped.

<div class="callout callout-warning"><p><strong>Pitfall:</strong> never let the patch lane mutate the branch after a failure bucket that says <code>secret_or_config</code>. If the environment is wrong, code changes are usually theater.</p></div>

<div class="callout callout-best"><p><strong>Best practice:</strong> keep the patch lane focused on suspect files and the failing test context. The agent should get a narrow packet, not the entire workflow transcript.</p></div>

## Practical checklist
- [ ] define a small, reviewable set of CI failure buckets
- [ ] collect compact artifact packs with stable fingerprints
- [ ] separate retry, patch, and escalation lanes in code
- [ ] cap retries by bucket, not with one global number
- [ ] rerun flaky buckets on the same commit SHA before changing code
- [ ] persist failure fingerprints so repeat offenders are visible
- [ ] stop automation on auth, secret, and permission failures
- [ ] attach a short reviewer summary to every automated decision

## Conclusion
AI coding agents get much better the moment CI failure handling stops being one vague “fix it” loop.

Bucket the failure, preserve the evidence, and make retry a policy decision. That alone cuts a lot of bad patches, useless reruns, and noisy automation theater.

## References
- [GitHub Actions workflow commands and contexts](https://docs.github.com/actions)
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [pytest flaky test guidance](https://docs.pytest.org/en/stable/explanation/flaky.html)
- [Buildkite test analytics concepts](https://buildkite.com/docs/test-engine)
