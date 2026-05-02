---
layout: blog-post
title: "Usable Context vs Advertised Context for AI Coding Agents"
description: "Why huge advertised context windows still break coding agents, and how bounded context packets, rolling summaries, and refresh loops keep long prompts usable."
date: 2026-05-02
tags:
  - Context Engineering
  - Coding Agents
  - Local LLMs
  - Prompt Budgeting
  - Reliability
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2308131f%27/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2319324f%27/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%20%20%3Ccircle%20cx%3D%271005%27%20cy%3D%27115%27%20r%3D%27160%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%20%20%3Ccircle%20cx%3D%27180%27%20cy%3D%27520%27%20r%3D%27210%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%20%20%3Crect%20x%3D%2782%27%20y%3D%2784%27%20width%3D%271036%27%20height%3D%27462%27%20rx%3D%2732%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27176%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EUsable%20Context%20vs%20Advertised%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27244%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EContext%20for%20AI%20Coding%20Agents%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27320%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EWhy%20big%20windows%20still%20collapse%2C%20and%20how%20to%20budget%20prompts%20that%20stay%20accurate%3C/text%3E%0A%20%20%3Crect%20x%3D%27132%27%20y%3D%27380%27%20width%3D%27328%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27156%27%20y%3D%27415%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Esize%20is%20advertised%2C%20usefulness%20is%20earned%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27178%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27812%27%20y%3D%27214%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Erepo-map.json%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27276%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27800%27%20y%3D%27312%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esummary.md%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27374%27%20width%3D%27250%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27820%27%20y%3D%27410%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Epin%28%29%3C/text%3E%0A%3C/svg%3E"
canonical: "https://negiadventures.github.io/blog/usable-context-vs-advertised-context-coding-agents.html"
---

# Usable Context vs Advertised Context for AI Coding Agents

The promise of long-context models is seductive. If a model says it supports 200K, 1M, or more tokens, it is tempting to throw in the whole repo, a pile of logs, and a backlog ticket and assume the agent will sort it out.

In practice, that usually degrades before it helps. The model pays less attention to the right files, latency climbs, and the fix quality quietly drops. What matters in coding workflows is not advertised window size. It is usable context, the portion of prompt space that stays relevant, reviewable, and fresh enough to guide the next edit.

This post walks through the patterns I trust more: bounded context packets, pinned files, rolling summaries, and refresh loops that let coding agents work with large systems without turning every run into expensive prompt fog.

## Why this matters

Coding agents fail in very specific ways when context gets sloppy:

- they anchor on stale files from earlier turns
- they miss the one invariant hidden in a migration, schema, or build script
- they spend tokens restating irrelevant repo background
- they become harder for humans to review because the prompt packet has no obvious shape

A bigger context window helps only if you preserve attention and structure. Production workflows need context that is small enough to inspect, refresh, and replace.

## Architecture or workflow overview

### Diagram

```mermaid
flowchart LR
    A[Task brief] --> B[Repo map + file candidates]
    B --> C[Retriever and ranker]
    C --> D[Bounded context packet]
    D --> E[Model edit step]
    E --> F[Verification output]
    F --> G[Rolling summary]
    G --> H[Packet refresh]
    H --> D
```

### The packet I actually want

1. Task brief with explicit success criteria
2. Pinned files that must stay in view
3. Ranked supporting files, capped by token budget
4. Short rolling summary of what changed and what was verified
5. Fresh retrieval after meaningful edits or failed checks

## Implementation details

### 1) Build a token budget before retrieval

The mistake is starting with files. Start with a budget.

```python
from dataclasses import dataclass

@dataclass
class ContextBudget:
    model_window: int
    reserved_for_output: int = 12000
    reserved_for_system: int = 6000
    safety_margin: int = 8000

    @property
    def usable_tokens(self) -> int:
        return max(
            0,
            self.model_window
            - self.reserved_for_output
            - self.reserved_for_system
            - self.safety_margin,
        )

budget = ContextBudget(model_window=200000)
print(budget.usable_tokens)  # 174000
```

This is still optimistic. In real coding loops, I often spend only a fraction of the theoretical remaining space on source files because I want room for tool results, diffs, retries, and short-term reasoning.

### 2) Pin the files that carry invariants

Not every relevant file is equally important. A small migration, policy file, or interface definition can matter more than ten implementation files.

```yaml
pinned_files:
  - path: db/schema.sql
    reason: source of truth for column names and constraints
  - path: apps/api/src/routes/users.ts
    reason: write path touched by this task
  - path: package.json
    reason: scripts and runtime assumptions
retrieval:
  max_supporting_files: 8
  max_tokens: 32000
  refresh_after:
    - failed_test
    - file_set_changed
    - task_phase_change
```

Pinned files stop the common failure mode where retrieval keeps swapping out the one document the model should never forget.

### 3) Summarize the run, not the whole world

Long sessions need compression, but generic summaries are almost useless. The summary has to preserve constraints, touched files, and unresolved risk.

```ts
type RollingSummary = {
  task: string;
  touchedFiles: string[];
  decisions: string[];
  verifiedBy: string[];
  openRisks: string[];
};

export function updateSummary(prev: RollingSummary, patch: Partial<RollingSummary>) {
  return {
    ...prev,
    ...patch,
    touchedFiles: [...new Set([...(prev.touchedFiles || []), ...(patch.touchedFiles || [])])],
    decisions: [...new Set([...(prev.decisions || []), ...(patch.decisions || [])])],
    verifiedBy: [...new Set([...(prev.verifiedBy || []), ...(patch.verifiedBy || [])])],
    openRisks: patch.openRisks ?? prev.openRisks ?? [],
  };
}
```

If the agent cannot explain what changed, what was checked, and what risk remains, the context packet is already decaying.

### 4) Refresh retrieval when the task changes shape

This is where many agents quietly fail. They keep using the same packet after the task moved from debugging to refactor, or from API code to deployment config.

Example refresh triggers:

- test failure mentions a file outside the current packet
- the edit spans a new subsystem
- a schema or interface changed
- the human asks for a different outcome than the original ticket

A static packet is fine for a tiny fix. It is weak for a live coding loop.

## Terminal snapshot

```bash
$ python tools/context_packet.py --task "fix user sync timeout" --model-window 200000
usable_tokens: 174000
pinned_files: 3
supporting_files_selected: 7
supporting_tokens: 28140
summary_tokens: 612
refresh_policy: failed_test,file_set_changed,task_phase_change
status: packet-ready
```

## What went wrong and the tradeoffs

### Comparison table

| Strategy | What it feels like | Main upside | Main downside | When I use it |
| --- | --- | --- | --- | --- |
| Stuff the repo into the prompt | Fast to start | Low setup effort | Attention collapse, higher latency, bad reviewability | Almost never |
| Pure semantic retrieval | Feels modern | Good first-pass recall | Misses exact invariants and file relationships | Small doc-heavy repos |
| Pinned files plus ranked support | Boring but reliable | Better accuracy and easier review | Needs repo-aware setup | Most coding agents |
| Rolling summary only | Cheap for long sessions | Token efficient | Can hide missing source details | Late-stage iterations |

### Failure modes I keep seeing

- **Stale summary drift:** the summary says the old plan even after the code path changed.
- **Hidden invariant loss:** the model forgets one pinned config or schema file and makes a clean-looking but unsafe edit.
- **False confidence from giant windows:** teams assume 1M context means no retrieval strategy is needed.
- **Cost creep:** tool outputs and repeated packet stuffing make long sessions slow and surprisingly expensive.

### Security and reliability note

Large packets also widen prompt injection exposure when external docs, issue text, or logs are mixed directly into the prompt. Treat retrieved content as untrusted input, especially when the same run can later execute commands or write code.

## Best-practices callout

- Prefer packet refresh over packet growth.
- Pin invariant files explicitly.
- Reserve output and tool-result space before you budget source files.
- Keep summaries structured and falsifiable.
- Rebuild the packet when the task changes phase.

## Practical checklist

- [ ] Define a usable token budget, not just the model maximum
- [ ] Mark pinned files before retrieval runs
- [ ] Cap supporting files and supporting tokens
- [ ] Store a rolling summary with decisions, checks, and open risks
- [ ] Refresh retrieval after failed tests or subsystem changes
- [ ] Review the packet itself when an agent starts making weird edits

## What I would not do

I would not market a coding workflow as solved just because a model supports a giant context number. Bigger windows are helpful, but they do not replace ranking, summaries, and disciplined refresh boundaries.

## Conclusion

Useful context is shaped, not dumped. The best coding agents I have seen do not win by remembering everything. They win by keeping the right things in view at the right time.

## Links

- <https://negiadventures.github.io/blog/>
- <https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips>
- <https://platform.openai.com/docs/guides/prompt-engineering>
- <https://www.promptingguide.ai/techniques/rag>
