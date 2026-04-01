---
layout: blog-post
title: "Tracing AI Agents with OpenTelemetry Without Drowning in Logs"
description: "A practical guide to tracing AI agents with OpenTelemetry and OpenInference so you can debug tool calls, latency, token usage, and multi-step failures without drowning in logs."
date: 2026-04-01
tags:
  - AI Agents
  - OpenTelemetry
  - Observability
  - LLM Ops
image: /images/profile.jpg
---

# Tracing AI Agents with OpenTelemetry Without Drowning in Logs

If you have ever debugged an agent with nothing but `print()` statements and vibes, you already know the problem. Traditional logs tell you that *something* happened. They rarely tell you which model call asked for a tool, how long that tool took, which retrieval step poisoned the answer, or why the agent burned 40 seconds and 30k tokens before returning something useless.

That is exactly where tracing helps. Instead of one flat log stream, you get a request-shaped view of the entire run: the root task, nested model calls, tool executions, retrieval steps, retries, and the final answer. Done well, tracing turns agent debugging from archaeology into engineering.

This is the practical setup I would use for an agent system in 2026: **OpenTelemetry for the trace model, OpenInference semantic conventions for AI-specific fields, and a backend that can actually visualize nested spans.**

## Why normal logs are not enough for agent systems

A typical agent failure is multi-step:

1. the user asks a messy real-world question
2. the agent calls the model
3. the model selects the wrong tool
4. the tool returns partial data
5. the agent retries with stale context
6. the final answer looks confident anyway

If you only collect logs, those events end up scattered across services and timestamps. You can grep for fragments, but you cannot easily see the full path of the request.

A trace gives you that path. OpenTelemetry treats the whole run as a **trace** and each unit of work as a **span**. That maps cleanly to agent workloads:

- root span = one user task
- child spans = model calls, retrieval, tool execution, guardrails, post-processing
- span attributes = model name, token counts, latency, tool name, status, retry count
- events = prompts truncated for inspection, validation failures, fallback decisions

That structure matters because agent bugs are rarely isolated. They are usually coordination bugs.

## The minimum span model that stays useful

The fastest way to ruin observability is to instrument everything without deciding what questions you want answered. For AI agents, I want the trace to answer five things quickly:

- Which step failed?
- Was the problem the model, the tool, or the retrieval layer?
- How much latency and token spend came from each step?
- Did the agent recover with a retry or fallback?
- Did the final answer come from grounded data or just model improvisation?

A minimal span tree usually looks like this:

```text
agent.run
├── planner.llm
├── retriever.search
├── tool.github_issue_lookup
├── tool.repo_read
├── responder.llm
└── guardrails.output_check
```

Do not start by tracing every helper function in your codebase. Start at workflow boundaries. If a step changes cost, latency, or behavior, it probably deserves its own span.

## A practical Python example

This example keeps the structure simple on purpose. The root span wraps the entire run, and each meaningful sub-step becomes a child span.

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces"))
)
tracer = trace.get_tracer("support-agent")


def run_agent(user_query: str) -> str:
    with tracer.start_as_current_span("agent.run") as root:
        root.set_attribute("agent.query", user_query)
        root.set_attribute("agent.max_iterations", 6)

        plan = call_planner_llm(user_query)
        docs = search_docs(plan)
        tool_result = maybe_call_tool(plan)
        answer = compose_answer(user_query, docs, tool_result)

        root.set_attribute("agent.status", "completed")
        return answer
```

Then make the children explicit:

```python
def call_planner_llm(user_query: str) -> dict:
    with tracer.start_as_current_span("planner.llm") as span:
        span.set_attribute("gen_ai.system", "openai")
        span.set_attribute("gen_ai.request.model", "gpt-4.1")
        span.set_attribute("agent.phase", "planning")

        response = client.responses.create(
            model="gpt-4.1",
            input=user_query,
        )

        span.set_attribute("gen_ai.usage.input_tokens", response.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", response.usage.output_tokens)
        span.set_attribute("agent.finish_reason", response.output[0].finish_reason)
        return parse_plan(response)
```

The code itself is not the hard part. The hard part is deciding what to attach as attributes so future-you can answer real production questions.

## Use OpenInference so your spans describe AI work, not just generic RPCs

Plain OpenTelemetry gives you the trace primitives: traces, spans, context propagation, exporters, and backends. That is great, but AI systems have extra semantics that matter:

- model provider and model name
- input and output token usage
- prompts and messages
- tool calls
- retrieval inputs and returned documents
- session and user metadata
- agent role or step type

This is where **OpenInference** is useful. It adds conventions and instrumentation for LLM and agent workloads so your traces carry AI-native meaning instead of a bag of arbitrary custom fields.

In practice that means you can standardize around attributes for model calls, retrieval, and tools without inventing your own naming scheme every week.

## What I would capture on every agent run

At the root span level:

- agent name and version
- user-visible task id
- workflow or route name
- session id when relevant
- final status: completed, failed, timed_out, blocked, fallback
- total iteration count

At model-call spans:

- provider and model name
- prompt template or prompt version
- input and output token counts
- latency
- finish reason
- fallback source if a backup model was used

At tool spans:

- tool name
- normalized arguments, redacted if sensitive
- latency
- retry count
- result size or summary
- exception type on failure

At retrieval spans:

- corpus or index name
- query used after rewriting
- top-k requested and returned
- whether citations made it into the answer
- retrieval score summary if available

Those fields cover most of the “why did this run go weird?” questions that show up in real systems.

## The redaction rule matters more than the exporter choice

A lot of teams get excited about dashboards and forget the obvious question: are you shipping sensitive prompts, documents, API arguments, or customer data into your tracing backend?

You need a policy before broad instrumentation goes live.

A practical default:

- keep full raw prompts out of traces unless you truly need them
- hash or redact user identifiers
- store tool arguments in summarized form when they may contain secrets
- emit document ids or chunk ids instead of full retrieved passages by default
- gate verbose capture behind an environment flag for temporary debugging

This is boring operational hygiene, but it matters. Observability can become a data leak if you instrument first and think later.

## Three dashboards that actually help

### 1. Slowest traces by percentile

Use this to find where latency really accumulates. You may discover the model is fine and the real culprit is a slow tool or vector search round-trip.

### 2. Failed traces grouped by span name

This quickly reveals whether failures cluster around one tool, one guardrail, or one retrieval path.

### 3. Cost-heavy traces with token breakdown

If your root span cost looks bad, the child spans will show whether the issue is a planner loop, a verbose responder model, or repeated retries.

That alone gets you most of the operational value without turning observability into its own product.

## A simple failure taxonomy

Your traces become much more useful when failures are labeled consistently. I like categories such as:

- `tool_error`
- `retrieval_miss`
- `model_refusal`
- `timeout`
- `rate_limit`
- `guardrail_block`
- `bad_plan`
- `hallucinated_answer`

Attach one of those to the root span and, when useful, to the failing child span. Over time that gives you a real distribution of failures instead of a generic red wall of “exception occurred.”

## What good traces changed for one of my agent workflows

The most useful pattern I keep seeing is that traces reveal *misattribution*. People blame the model first because the model is the most visible part of the system.

In reality, the bigger problems are often elsewhere:

- retrieval returned the wrong chunk family
- a tool silently truncated results
- the planner used a broad tool when a narrow tool existed
- a retry loop preserved the original bad assumption
- a fallback model masked the first failure and made root cause harder to see

Tracing makes these visible because you can follow the whole chain in one place.

## Common mistakes

### Instrumenting only the final model call

If you do not trace planning, retrieval, and tools, you will miss the steps that usually create the bad answer.

### Capturing too much raw payload data

The point is to debug behavior, not to mirror your whole database into observability.

### Using inconsistent span names

`llm_call`, `model`, `ai-step`, and `prompt-1` are not a taxonomy. Pick stable names so you can aggregate meaningfully.

### Ignoring context propagation across services

If the API layer, worker, and tool service do not share trace context, your traces stop at the most inconvenient boundary.

## A pragmatic stack that works

If I wanted a setup that stays portable, I would use:

1. **OpenTelemetry SDK** for span creation and export
2. **OpenInference** conventions or instrumentation for AI-specific metadata
3. **OTLP exporter** so the backend stays swappable
4. A backend like **Jaeger**, **Tempo/Grafana**, **Langfuse**, **Phoenix**, or another OTEL-compatible store depending on the team

That gives you a standards-based instrumentation layer and freedom to change the visualization layer later.

## References and resources

- [OpenTelemetry traces documentation](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenInference specification and instrumentation](https://github.com/Arize-ai/openinference)
- [Langfuse observability overview](https://langfuse.com/docs/observability/overview)
- [Arize Phoenix](https://phoenix.arize.com/)

## Key takeaways

1. Agent failures are usually workflow failures, not just model failures.
2. Trace the full run shape: planning, retrieval, tools, response, and guardrails.
3. OpenTelemetry gives the structure; OpenInference makes that structure AI-aware.
4. Redaction policy is part of observability design, not an afterthought.
5. Good traces reduce debugging time and make token, latency, and reliability work much less guessy.
