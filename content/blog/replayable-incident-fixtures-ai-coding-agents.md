---
layout: blog-post
title: "Replayable Incident Fixtures for AI Coding Agents Without Ghost Bugs"
description: "How to build replayable incident fixtures for AI coding agents with sanitized bug packets, verifier scripts, and deterministic replay loops."
date: 2026-06-16
tags:
  - AI Coding Agents
  - Incident Response
  - Debugging
  - Reliability
  - Fixtures
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23184a72%27/%3E%3C/linearGradient%3E%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271010%27%20cy%3D%27110%27%20r%3D%27176%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%3Ccircle%20cx%3D%27184%27%20cy%3D%27520%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EReplayable%20Incident%20Fixtures%20for%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EAI%20Coding%20Agents%20Without%20Ghost%20Bugs%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ECapture%20the%20failing%20request%2C%20freeze%20the%20dependencies%2C%20and%20give%20the%20agent%20a%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Edeterministic%20replay%20lane%20before%20vague%20prod-only%20bugs%20turn%20into%20guessing%3C/text%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27390%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eincident%20response%20gets%20faster%20when%20bugs%20are%20portable%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27810%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esanitized%20input%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27808%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Everifier%20script%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27822%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eexpiry%20policy%3C/text%3E%0A%3C/svg%3E"
canonical: "https://negiadventures.github.io/blog/replayable-incident-fixtures-ai-coding-agents.html"
---

# Replayable Incident Fixtures for AI Coding Agents Without Ghost Bugs

![Replayable Incident Fixtures for AI Coding Agents Without Ghost Bugs](data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23184a72%27/%3E%3C/linearGradient%3E%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271010%27%20cy%3D%27110%27%20r%3D%27176%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%3Ccircle%20cx%3D%27184%27%20cy%3D%27520%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EReplayable%20Incident%20Fixtures%20for%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EAI%20Coding%20Agents%20Without%20Ghost%20Bugs%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ECapture%20the%20failing%20request%2C%20freeze%20the%20dependencies%2C%20and%20give%20the%20agent%20a%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Edeterministic%20replay%20lane%20before%20vague%20prod-only%20bugs%20turn%20into%20guessing%3C/text%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27390%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eincident%20response%20gets%20faster%20when%20bugs%20are%20portable%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27810%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esanitized%20input%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27808%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Everifier%20script%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%3Ctext%20x%3D%27822%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eexpiry%20policy%3C/text%3E%0A%3C/svg%3E)

Production bugs are annoying enough when a human can reproduce them locally. They get worse when an AI coding agent is asked to help, but the only evidence is a screenshot, a stack trace fragment, and a memory like "it broke on one customer payload around 2 PM." That is how you get polished guesses instead of fixes.

The pattern that has worked best for me is to package incidents into replayable fixtures. The goal is simple: capture just enough sanitized evidence to reproduce the failure in a deterministic lane, then let the agent work against that lane instead of production folklore.

In this post, I’ll show how to structure an incident fixture packet, how to replay it safely, and where this approach breaks down.

## Why this matters

AI coding agents are strongest when the task has bounded inputs, clear verifier commands, and short feedback loops. Incident work usually has the opposite shape:

- partial logs
- drifting dependencies
- hidden secrets in payloads
- production-only side effects
- confused humans adding details after the fact

If you hand an agent raw prod access, you create security risk. If you hand it vague incident notes, you get fiction. Replayable fixtures split the difference. They preserve the evidence while keeping the repair loop local, reviewable, and safe.

Useful references:

- [Git bisect documentation](https://git-scm.com/docs/git-bisect)
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Architecture and workflow overview

A good fixture lane has four moving parts: capture, sanitize, replay, and expire.

```mermaid
flowchart LR
    A[Production incident] --> B[Capture request, trace IDs, env facts]
    B --> C[Sanitize payload and secrets]
    C --> D[Write fixture packet to repo or secure artifact store]
    D --> E[Run verifier script locally or in CI]
    E --> F[Agent proposes patch]
    F --> G[Verifier replays fixture again]
    G --> H[Human reviews evidence and patch]
```

I like the fixture packet to contain:

1. sanitized request or event payload
2. expected failure signature
3. dependency versions or image digest
4. verifier command
5. expiry date and ownership metadata

## Implementation details

### 1. Define a fixture manifest that the verifier can trust

Keep the schema small. The agent does not need every production detail.

```yaml
# fixtures/incidents/payment-timeout-2026-06-16/fixture.yaml
id: payment-timeout-2026-06-16
service: billing-api
entrypoint: tests/replay_payment_timeout.py
input: sanitized-request.json
expected_failure:
  type: TimeoutError
  contains: "downstream risk score request exceeded 1500ms"
environment:
  image: ghcr.io/acme/billing-api@sha256:4d9d...
  python: "3.12.4"
  feature_flags:
    risk_score_v2: true
ownership:
  created_by: sre-oncall
  expires_on: 2026-07-16
  jira: INC-4821
```

This keeps the replay lane inspectable. It also gives the agent a single source of truth for how the bug should fail before the patch and how it should pass after.

### 2. Sanitize hard before you serialize

The biggest failure mode here is quietly checking sensitive data into a repo. I prefer explicit scrubbers over "best effort" regex hope.

```python
import json
from copy import deepcopy

SENSITIVE_KEYS = ('email', 'ssn', 'token', 'authorization', 'card_number')


def sanitize_event(event: dict) -> dict:
    clean = deepcopy(event)

    def walk(node):
        if isinstance(node, dict):
            for key, value in list(node.items()):
                if key.lower() in SENSITIVE_KEYS:
                    node[key] = "[REDACTED]"
                else:
                    walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(clean)
    return clean


with open("raw-event.json") as f:
    raw = json.load(f)

with open("sanitized-request.json", "w") as f:
    json.dump(sanitize_event(raw), f, indent=2)
```

I would not rely on an LLM to decide whether something looks sensitive. Use a deterministic sanitizer first, then let a human spot-check the result.

### 3. Make the replay command boring and scriptable

A replay script should return non-zero on failure, print the failure signature, and avoid network dependence wherever possible.

```python
# tests/replay_payment_timeout.py
import json
import subprocess
import sys
from pathlib import Path

fixture_dir = Path("fixtures/incidents/payment-timeout-2026-06-16")
request_path = fixture_dir / "sanitized-request.json"

payload = json.loads(request_path.read_text())

result = subprocess.run(
    [
        "python",
        "scripts/run_local_request.py",
        "--fixture",
        str(request_path),
        "--offline-downstream",
    ],
    capture_output=True,
    text=True,
)

print(result.stdout)
print(result.stderr)

if "TimeoutError" not in result.stderr:
    print("expected timeout signature missing")
    sys.exit(1)
```

If the verifier depends on five manual steps, the agent will drift. If it is one command, the loop stays tight.

### Example terminal output

```text
$ python tests/replay_payment_timeout.py
loaded fixture: payment-timeout-2026-06-16
mock downstream latency: 1800ms
request_id: replay-7c2d5f
TimeoutError: downstream risk score request exceeded 1500ms
exit code: 1
```

That is enough evidence for the agent to start tracing the timeout path without touching production.

## Tradeoffs and what went wrong

Fixture lanes are great, but they are not free.

| Choice | Upside | Downside | When I use it |
| --- | --- | --- | --- |
| Check fixtures into repo | Reviewable, versioned, easy for agents | Risk of stale or sensitive data | Small sanitized payloads |
| Store fixtures as CI artifacts | Better for large traces | Harder to diff in code review | Big logs or binary inputs |
| Full container snapshot | High fidelity | Heavy, slow, expensive | Nasty dependency drift bugs |
| Minimal manifest + replay mocks | Fast and cheap | Can miss integration behavior | Most app-layer incidents |

A few failure lessons:

### Hidden dependency drift

I’ve seen a fixture reproduce fine on Monday and fail differently on Thursday because a local dependency moved. Pin runtime versions or container digests whenever the bug smells timing-related or parser-related.

### Over-sanitized inputs

Sometimes the sanitizer strips the exact field shape that triggers the bug. When that happens, preserve the structure and redact only values. Shape is often more important than content.

### Production-only side effects

Some bugs depend on queue timing, cold caches, or vendor behavior. In those cases, a fixture packet still helps, but you may need a shadow integration lane instead of a pure local replay.

### Fixture rot

If incident packets never expire, the repo becomes a graveyard of misleading evidence. Treat fixtures like test data with owners and TTLs.

## Best practices checklist

- Capture the failing input as close to the incident as possible.
- Sanitize deterministically before an agent ever sees the payload.
- Store one verifier command in the manifest.
- Pin the runtime or container when dependency drift matters.
- Prefer structural redaction over deleting fields entirely.
- Add an expiry date and owner to every fixture.
- Re-run the same fixture after the patch, not a hand-waved approximation.
- Keep a short note about what the fixture does **not** model.

## What I would do again

If I were setting this up from scratch, I would start with three things only:

1. a tiny fixture manifest
2. a deterministic sanitizer
3. a one-command verifier

That gets most of the benefit quickly. You can add trace bundles, container snapshots, or CI replay lanes later when the incidents justify the extra weight.

## Conclusion

Replayable incident fixtures make AI coding agents more useful because they turn vague production pain into bounded engineering work. The core idea is not fancy. Capture the evidence, scrub it safely, replay it deterministically, and expire it when it stops being trustworthy.

That is a much better debugging loop than asking an agent to fix a ghost.
