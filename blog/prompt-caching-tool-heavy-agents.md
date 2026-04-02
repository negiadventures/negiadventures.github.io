---
layout: blog-post
title: "Prompt Caching for Tool-Heavy AI Agents That Need to Stay Fast"
description: "A practical guide to reducing latency and cost in tool-heavy AI agents with stable prompt prefixes, prompt caching, context compaction, and retrieval boundaries."
date: 2026-04-02
tags:
  - AI Agents
  - Prompt Caching
  - Cost Optimization
  - Developer Workflow
image: /images/profile.jpg
---

# Prompt Caching for Tool-Heavy AI Agents That Need to Stay Fast

Tool-heavy agents get expensive for a boring reason: they keep resending the same context. The system prompt barely changes. Tool schemas barely change. Operating rules barely change. But every turn pays to reprocess them unless you design for cacheability.

If your agent reads code, calls tools, retries, summarizes, and asks follow-up questions, prompt caching is one of the highest-leverage optimizations you can make. It does not magically fix a bad workflow, but it can shave real latency and cost off the boring repetitive part of every turn.

The trick is simple in theory and easy to get wrong in practice: keep the front of the prompt stable, push variable inputs toward the end, and stop dragging a full transcript around after the useful bits have already been compressed.

This post walks through a practical pattern for doing that in production.

## Where tool-heavy agents waste money

A typical coding or ops agent sends the model:

- a long system prompt
- policies and formatting rules
- tool definitions or schemas
- a transcript of prior turns
- retrieved files, logs, or docs
- the actual new user request

Only the last part changes a lot. The rest is often near-identical across requests.

That means the expensive part of each request is often not the new task. It is the repeated preamble. If you keep changing the prefix order, inserting dynamic state too early, or stuffing every new retrieval chunk before the instruction block, you destroy cache reuse.

## The practical design rule: freeze the prefix

For prompt caching to help, exact prefix matches matter. So the design goal is not just “make prompts shorter.” It is “make the beginning of prompts extremely stable.”

A good ordering for tool-using agents looks like this:

1. System role and permanent operating rules
2. Stable team or app instructions
3. Stable tool definitions
4. Stable few-shot examples if you truly need them
5. Rolling compacted context or summary state
6. Retrieved task-specific context
7. The latest user request

That ordering does two useful things:

- the largest reusable block stays at the front
- the volatile stuff moves to the back where it cannot poison the cache key

If you instead inject timestamps, request IDs, ephemeral debug notes, or changing retrieval results at the top, your cache hit rate falls off a cliff.

## A bad pattern versus a better one

### Bad

```json
{
  "input": [
    {"role": "system", "content": "You are a coding agent."},
    {"role": "user", "content": "Current time: 2026-04-02T12:00:07Z"},
    {"role": "user", "content": "Relevant repo files: ...dynamic chunk..."},
    {"role": "user", "content": "Tool list: ...long schema block..."},
    {"role": "user", "content": "Please fix the failing tests."}
  ]
}
```

### Better

```json
{
  "input": [
    {"role": "system", "content": "You are a coding agent. Follow repo rules, explain risky actions, and verify before finishing."},
    {"role": "system", "content": "Available tools: ...stable schema block..."},
    {"role": "system", "content": "Workflow policy: inspect, plan, edit, test, summarize."},
    {"role": "assistant", "content": "Compacted prior state: branch, known failures, accepted constraints."},
    {"role": "user", "content": "Relevant repo files: ...dynamic chunk..."},
    {"role": "user", "content": "Please fix the failing tests in auth middleware."}
  ]
}
```

Nothing revolutionary there. It is just discipline.

## Prompt caching is not only for chatbots

People sometimes treat prompt caching like a generic API billing tweak. For agents, it is more structural than that.

In a tool-heavy workflow, the model repeatedly re-reads:

- tool schemas
- environment policies
- output formatting rules
- coding conventions
- repo-specific guidance
- escalation rules

That is exactly the stuff you want the model to remember every turn, and exactly the stuff that should be stable enough to cache.

In other words: agent quality often pushes you toward richer instructions, while agent cost pushes you toward a reusable prefix. Prompt caching is the compromise that lets you have both, if you structure the prompt correctly.

## Use compaction before the transcript becomes the product

Long-running agents have a second problem: even if the prefix is stable, the conversation history keeps growing.

This is where compaction matters. Once the session has accumulated enough tool calls, intermediate plans, and dead-end reasoning, sending the full transcript every time becomes silly. The transcript starts dominating both cost and latency.

The fix is to carry forward state, not raw history.

In practice that means one of two approaches:

- use server-side compaction when your API supports it
- or compact explicitly and pass forward the compacted window as the new baseline context

The important operational habit is this: after compaction, stop dragging older turns forward unless they are still genuinely needed.

## What should survive compaction

A compacted state object for an agent should preserve:

- the current goal
- accepted constraints
- important prior decisions
- unresolved risks
- outputs from tools that still matter
- names, paths, or identifiers the model must not lose

It should usually drop:

- superseded plans
- verbose intermediate tool chatter
- failed branches that have already been ruled out
- repetitive confirmations
- raw logs that can be re-fetched if needed

A decent test is: if the model lost this item, would it make a worse next decision? If not, compact it away.

## Retrieval boundaries matter as much as caching

Teams often sabotage caching by retrieving too much context too early.

A better pattern is:

- keep the reusable instruction prefix fixed
- retrieve only the smallest task-relevant context
- inject retrieval results after the stable prefix
- expire or replace retrieval chunks aggressively between turns

For example, a coding agent does not need the entire repo map, ten failing logs, three old stack traces, and a copied issue thread on every turn. It needs the few files or traces relevant to the current decision.

Prompt caching rewards stable prefixes. Retrieval quality depends on selective context. Those two ideas work together.

## A production-friendly request loop

This is the basic loop I like for tool-using agents:

```python
BASE_PREFIX = [
    SYSTEM_RULES,
    TOOL_SCHEMAS,
    WORKFLOW_POLICY,
]

state = load_compacted_state()  # branch, active task, constraints, known failures

while True:
    retrieved = fetch_minimum_relevant_context(task=state.active_task)
    latest_user_message = get_latest_user_message()

    response = client.responses.create(
        model="gpt-5.4",
        input=[*BASE_PREFIX, state, *retrieved, latest_user_message],
        prompt_cache_retention="24h",
        prompt_cache_key="repo:main-agent",
        store=False,
        context_management=[{"type": "compaction", "compact_threshold": 200000}],
    )

    state = extract_latest_compacted_state(response)
    handle_tools_and_output(response)
```

A few things are doing real work here:

- `BASE_PREFIX` stays stable
- state is compact rather than a full transcript
- retrieval is deliberately minimal
- the cache key stays consistent for related requests
- compaction prevents the context window from bloating forever

## Mistakes that quietly kill cache hit rate

### 1. Injecting timestamps near the top

If every request starts with a fresh timestamp block, your prefix is no longer identical.

### 2. Reordering tools between requests

Even semantically identical tool lists can stop matching if order or formatting changes.

### 3. Shoving retrieval before instructions

Dynamic context belongs late, not early.

### 4. Treating every past turn as sacred

Most agent transcripts are mostly debris after a few turns.

### 5. Changing prompt templates casually

Tiny edits to a shared prefix can have a large latency and cost impact in production. Version them on purpose.

## How to tell whether this is working

Do not guess. Measure.

Watch:

- cached prompt tokens
- median latency by workflow type
- long-tail latency after many turns
- input token count before and after compaction
- success rate after shrinking retrieval scope

If cost drops but accuracy tanks, you compacted too aggressively or retrieved too little. If accuracy is stable but latency barely changes, your supposedly stable prefix probably is not stable enough.

## Where this matters most

This pattern pays off most in agents that:

- run multi-step coding tasks
- repeatedly call the same tool set
- operate under stable policies
- revisit the same repo or workspace many times
- hold long conversations with intermittent follow-ups

It matters less for one-shot requests with tiny prompts. If the prompt is short and mostly unique every time, there is not much to cache.

## A sane rollout plan

If you want to adopt this without breaking your system, do it in this order:

1. Freeze and version the reusable prefix
2. Move dynamic retrieval and timestamps to the end
3. Keep tool schemas stable across related requests
4. Introduce prompt cache keys for repeated workflows
5. Add compaction once long-running sessions become noisy
6. Measure both cost and task success before tightening further

That sequence usually gets you most of the win without turning the agent architecture into a science project.

## The real takeaway

The fastest way to make an agent cheaper is often not choosing a smaller model. It is stopping the expensive habit of making the model reread the same novel every turn.

Prompt caching works best when paired with prompt discipline, narrow retrieval, and aggressive context compaction. Together, those three patterns make tool-heavy agents feel less bloated, less fragile, and much easier to run at scale.

## References and resources

- OpenAI API: Prompt Caching — https://developers.openai.com/api/docs/guides/prompt-caching
- OpenAI API: Compaction — https://developers.openai.com/api/docs/guides/compaction
- OpenAI API: Cost Optimization — https://developers.openai.com/api/docs/guides/cost-optimization
- OpenAI API: Prompting — https://developers.openai.com/api/docs/guides/prompting
