---
layout: blog-post
title: "SLOs and Burn-Rate Alerts for AI Coding Gateways Before Slow Turns Become Failed Runs"
description: "A practical guide to defining SLOs and burn-rate alerts for AI coding gateways with first-token latency, tool success budgets, lane-aware error budgets, and fallback policy so operators catch drift before slow turns become broken automation."
date: 2026-07-03
tags:
  - AI Coding
  - SLOs
  - Gateway Ops
  - Reliability
  - Observability
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%20630%22%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%3E%0A%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2307111d%22%2F%3E%0A%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231b4f75%22%2F%3E%0A%20%20%3C%2FlinearGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%221200%22%20height%3D%22630%22%20fill%3D%22url%28%23bg%29%22%2F%3E%0A%3Ccircle%20cx%3D%221012%22%20cy%3D%22106%22%20r%3D%22178%22%20fill%3D%22%2322d3ee%22%20fill-opacity%3D%220.14%22%2F%3E%0A%3Ccircle%20cx%3D%22192%22%20cy%3D%22520%22%20r%3D%22220%22%20fill%3D%22%238b5cf6%22%20fill-opacity%3D%220.16%22%2F%3E%0A%3Crect%20x%3D%2278%22%20y%3D%2286%22%20width%3D%221044%22%20height%3D%22458%22%20rx%3D%2230%22%20fill%3D%22%230b1220%22%20stroke%3D%22%2338bdf8%22%20stroke-opacity%3D%220.35%22%2F%3E%0A%3Ctext%20x%3D%22126%22%20y%3D%22164%22%20fill%3D%22white%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2238%22%20font-weight%3D%22700%22%3ESLOs%20and%20Burn-Rate%20Alerts%20for%20AI%20Coding%20Gateways%3C%2Ftext%3E%0A%3Ctext%20x%3D%22126%22%20y%3D%22224%22%20fill%3D%22%2393c5fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2238%22%20font-weight%3D%22700%22%3EBefore%20Slow%20Turns%20Become%20Failed%20Runs%3C%2Ftext%3E%0A%3Ctext%20x%3D%22126%22%20y%3D%22298%22%20fill%3D%22%23cbd5e1%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%3EMeasure%20first-token%20latency%2C%20fallback%20health%2C%20and%20tool-success%20budgets%20before%3C%2Ftext%3E%0A%3Ctext%20x%3D%22126%22%20y%3D%22334%22%20fill%3D%22%23cbd5e1%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%3Edevelopers%20experience%20%E2%80%9Cthe%20agent%20feels%20weird%20today%E2%80%9D%20as%20a%20full%20reliability%20incident.%3C%2Ftext%3E%0A%3Crect%20x%3D%22126%22%20y%3D%22388%22%20width%3D%22410%22%20height%3D%2254%22%20rx%3D%2214%22%20fill%3D%22%23111c2d%22%20stroke%3D%22%2367e8f9%22%20stroke-opacity%3D%220.45%22%2F%3E%0A%3Ctext%20x%3D%22152%22%20y%3D%22423%22%20fill%3D%22%2367e8f9%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%3Eslow%20LLM%20turns%20are%20an%20SRE%20problem%20once%20they%20hit%20real%20workflows%3C%2Ftext%3E%0A%3Crect%20x%3D%22782%22%20y%3D%22166%22%20width%3D%22244%22%20height%3D%2258%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%2322d3ee%22%20stroke-opacity%3D%220.45%22%2F%3E%0A%3Ctext%20x%3D%22842%22%20y%3D%22204%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Elatency%20SLO%3C%2Ftext%3E%0A%3Crect%20x%3D%22782%22%20y%3D%22266%22%20width%3D%22244%22%20height%3D%2258%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%2322d3ee%22%20stroke-opacity%3D%220.45%22%2F%3E%0A%3Ctext%20x%3D%22830%22%20y%3D%22304%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Eburn%20alert%3C%2Ftext%3E%0A%3Crect%20x%3D%22782%22%20y%3D%22366%22%20width%3D%22244%22%20height%3D%2258%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%23a78bfa%22%20stroke-opacity%3D%220.45%22%2F%3E%0A%3Ctext%20x%3D%22814%22%20y%3D%22404%22%20fill%3D%22%23ddd6fe%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Efallback%20lane%3C%2Ftext%3E%0A%3C%2Fsvg%3E"
canonical: "https://negiadventures.github.io/blog/slos-burn-rate-alerts-ai-coding-gateways.html"
---

# SLOs and Burn-Rate Alerts for AI Coding Gateways Before Slow Turns Become Failed Runs

AI coding gateways rarely fail in one dramatic step. More often, they get strange first. First token latency doubles, tool calls start timing out, fallback traffic spikes, and developers report that the agent feels off before anything is fully down.

That gray area is where a lot of teams lose trust. If the gateway serves repo automation, terminal coding sessions, and scheduled jobs, “a little slower than usual” can easily become half-finished patches, missed cron windows, and people retrying runs that were already in trouble.

This post walks through a practical SLO model for AI coding gateways: what to measure, how to split budgets by lane, and how to alert on burn rate before developers experience reliability drift as random workflow pain.

## Why this matters

Coding gateways are not just chat endpoints. They sit in front of model pools, tool routers, fallback policy, prompt caches, and approval-sensitive automation. That means classic uptime is not enough.

A gateway can be technically up while still being functionally bad at its job. If interactive sessions take 18 seconds to first token, or patch-verification runs fall back to a cheaper lane with worse tool reliability, your system is serving requests but failing users.

That is why I prefer SLOs that track the shape of useful work, not just request success. For coding workflows, the key questions are:

- Did the model start responding fast enough to keep the loop usable?
- Did the gateway finish the run within the lane's expected deadline?
- Did tool-heavy requests stay inside their error budget without excessive fallback?
- Did degraded behavior surface early enough for operators to steer traffic?

## Architecture or workflow overview

```mermaid
flowchart LR
    A[Client lane
interactive, cron, CI] --> B[Gateway router]
    B --> C[Primary model pool]
    B --> D[Fallback model pool]
    B --> E[Tool execution lane]
    C --> F[Metrics pipeline]
    D --> F
    E --> F
    F --> G[SLO evaluator]
    G --> H[Burn-rate alerts]
    H --> I[Operator action
reroute, shed, downgrade, pause]
```

The useful pattern is to evaluate separate reliability lanes instead of one blended average:

1. **Interactive coding lane** tracks first-token latency and turn completion.
2. **Scheduled automation lane** tracks end-to-end success before deadline.
3. **Tool-heavy lane** tracks tool success ratio and fallback frequency.
4. **Safety lane** tracks approval failures separately so policy denials do not hide real outages.

## Implementation details

### 1) Define SLOs around user-visible work

I would not start with raw request success. For coding systems, the better units are first-token latency, turn completion latency, and workflow success before deadline.

```yaml
slos:
  interactive_first_token:
    objective: 0.95
    window: 30d
    sli: first_token_latency_ms <= 2500
    filters:
      lane: interactive
  scheduled_run_deadline:
    objective: 0.99
    window: 30d
    sli: run_completed_before_deadline == true
    filters:
      lane: scheduled
  tool_step_success:
    objective: 0.985
    window: 30d
    sli: tool_step_success == true
    filters:
      lane: tool_heavy
```

These SLOs are intentionally concrete. A developer can feel the difference between 2.5 seconds and 9 seconds to first token. A cron job either hit its deadline or it did not. That makes the budgets easier to defend.

### 2) Emit lane-aware metrics from the gateway itself

The gateway should label every request with enough context to explain drift later. I usually want lane, model pool, fallback status, tool count, cache hit state, and whether the run finished or was operator-aborted.

```ts
metrics.observe('gateway_first_token_ms', firstTokenMs, {
  lane: request.lane,
  model_pool: response.pool,
  fallback: String(response.usedFallback),
  cache_prefix_hit: String(response.cachePrefixHit),
  tool_count_bucket: bucketize(request.toolCalls.length)
});

metrics.increment('gateway_run_outcome_total', 1, {
  lane: request.lane,
  outcome: run.completedBeforeDeadline ? 'success' : 'deadline_miss',
  model_pool: response.pool
});
```

Without these labels, burn alerts tell you something is wrong but not whether the issue is a single overloaded model pool, a cache miss storm, or one tool adapter poisoning the whole workflow.

### 3) Burn-rate alerts should reflect how fast you are spending trust

A lot of teams alert on absolute error rate only. That is too slow for agent infrastructure. If your interactive lane burns through a week's budget in 45 minutes, you want to know immediately.

```promql
# Fast-burn alert for first-token SLO
(
  1 - (
    sum(rate(gateway_first_token_sli_good_total{lane="interactive"}[5m])) /
    sum(rate(gateway_first_token_sli_total{lane="interactive"}[5m]))
  )
) > (1 - 0.95) * 14.4
```

The exact multiplier depends on your paging philosophy, but the idea is stable: alert on budget consumption speed, not just current pain. Fast-burn catches sharp incidents. Slower-burn alerts catch the “service feels weird today” degradation that often matters more for coding loops.

```promql
# Slow-burn alert for scheduled automation lane
(
  1 - (
    sum(rate(gateway_run_deadline_good_total{lane="scheduled"}[1h])) /
    sum(rate(gateway_run_deadline_total{lane="scheduled"}[1h]))
  )
) > (1 - 0.99) * 3
```

### 4) Tie alerts to concrete fallback actions

Burn alerts are only useful if they drive a predictable operator response. I like a small action table tied to each lane.

| Alert condition | Likely cause | Operator action |
| --- | --- | --- |
| Interactive fast-burn on first-token latency | overloaded primary pool, cache miss storm | reroute small requests, trim long-context lane, shed non-urgent traffic |
| Scheduled deadline misses rising | tool queue saturation or slow model tier | pause low-priority cron runs, extend deadlines for non-critical jobs, shift to secondary region |
| Tool-step SLO burn | flaky MCP adapter or shell runner | isolate broken tool lane, disable tool class, preserve chat-only traffic |
| Fallback rate spike with normal request volume | primary pool instability | drain unhealthy pool, lock safe fallback, review quality regression risk |

This is the difference between observability and operations. Metrics tell you what changed. Action tables decide what happens next.

## What went wrong and tradeoffs

One common mistake is blending all requests into a single availability number. That hides the real problem. A gateway can look healthy because cheap chat requests are fine while long coding turns are quietly degrading.

Another failure mode is alerting on model errors while ignoring fallback overuse. A fallback that keeps requests technically successful can still be a bad user experience if it is slower, worse at tool use, or more expensive than the normal lane.

> **Pitfall:** do not count policy denials as gateway failures. Approval rejections, tool allowlist blocks, and scope denials are real events, but they belong in a separate safety dashboard. Mixing them into uptime metrics makes outages and guardrails harder to distinguish.

There is also a cost tradeoff. More granular SLOs mean more labels, more dashboards, and more arguments about which lane deserves premium capacity. I still think that is better than pretending one average latency number captures AI coding reliability.

What I would not do is page on every model hiccup. Page on burned user trust instead. If a brief blip stays inside the budget and the fallback lane masked it cleanly, a dashboard note is enough.

## Practical checklist

- Define separate SLOs for interactive, scheduled, and tool-heavy lanes.
- Measure first-token latency, run deadline success, and fallback rate.
- Label metrics with lane, pool, fallback status, and tool-count bucket.
- Use fast-burn and slow-burn alerts instead of one static threshold.
- Keep policy denials separate from reliability failures.
- Attach every alert to an operator playbook action.
- Review whether fallback preserved quality, not just availability.

## Conclusion

AI coding gateways need the same discipline as other production systems, but the useful signals are slightly different. Developers notice responsiveness, deadline misses, and degraded tool behavior long before a generic uptime graph looks scary.

If you measure the right things and alert on error-budget burn instead of vague averages, you can catch reliability drift early, protect good workflows, and keep one slow model pool from turning into a trust problem across the whole gateway.
