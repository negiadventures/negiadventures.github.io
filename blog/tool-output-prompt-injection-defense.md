---
layout: blog-post
title: "Protecting AI Agents From Prompt Injection Through Tool Outputs"
description: "A practical guide to protecting AI agents from prompt injection through tool outputs, with trust boundaries, sanitization patterns, isolation lanes, and reviewable execution guards."
date: 2026-04-17
tags:
  - AI Security
  - Prompt Injection
  - MCP
  - Agent Reliability
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201200%20630%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2308131f%22/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2316304d%22/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%221200%22%20height%3D%22630%22%20fill%3D%22url%28%23bg%29%22/%3E%0A%20%20%3Ccircle%20cx%3D%22995%22%20cy%3D%22118%22%20r%3D%22155%22%20fill%3D%22%2322d3ee%22%20fill-opacity%3D%220.14%22/%3E%0A%20%20%3Ccircle%20cx%3D%22185%22%20cy%3D%22525%22%20r%3D%22205%22%20fill%3D%22%238b5cf6%22%20fill-opacity%3D%220.16%22/%3E%0A%20%20%3Crect%20x%3D%2282%22%20y%3D%2286%22%20width%3D%221036%22%20height%3D%22458%22%20rx%3D%2232%22%20fill%3D%22%230b1220%22%20stroke%3D%22%2338bdf8%22%20stroke-opacity%3D%220.35%22/%3E%0A%20%20%3Ctext%20x%3D%22132%22%20y%3D%22184%22%20fill%3D%22white%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2246%22%20font-weight%3D%22700%22%3EProtecting%20AI%20Agents%20From%3C/text%3E%0A%20%20%3Ctext%20x%3D%22132%22%20y%3D%22256%22%20fill%3D%22%2393c5fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2246%22%20font-weight%3D%22700%22%3EPrompt%20Injection%20Through%3C/text%3E%0A%20%20%3Ctext%20x%3D%22132%22%20y%3D%22328%22%20fill%3D%22%2393c5fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2246%22%20font-weight%3D%22700%22%3ETool%20Outputs%3C/text%3E%0A%20%20%3Ctext%20x%3D%22132%22%20y%3D%22408%22%20fill%3D%22%23cbd5e1%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%3ETaint%20labels%2C%20trust%20lanes%2C%20sanitizers%2C%20and%20safer%20execution%20boundaries%3C/text%3E%0A%20%20%3Crect%20x%3D%22132%22%20y%3D%22452%22%20width%3D%22300%22%20height%3D%2254%22%20rx%3D%2214%22%20fill%3D%22%23111c2d%22%20stroke%3D%22%2367e8f9%22%20stroke-opacity%3D%220.45%22/%3E%0A%20%20%3Ctext%20x%3D%22156%22%20y%3D%22487%22%20fill%3D%22%2367e8f9%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%3Etreat%20tool%20results%20as%20data%20first%3C/text%3E%0A%20%20%3Crect%20x%3D%22770%22%20y%3D%22180%22%20width%3D%22250%22%20height%3D%2256%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%2322d3ee%22%20stroke-opacity%3D%220.45%22/%3E%0A%20%20%3Ctext%20x%3D%22806%22%20y%3D%22216%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Eweb.fetch%28%29%3C/text%3E%0A%20%20%3Crect%20x%3D%22770%22%20y%3D%22278%22%20width%3D%22250%22%20height%3D%2256%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%2322d3ee%22%20stroke-opacity%3D%220.45%22/%3E%0A%20%20%3Ctext%20x%3D%22821%22%20y%3D%22314%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Esanitize%28%29%3C/text%3E%0A%20%20%3Crect%20x%3D%22770%22%20y%3D%22376%22%20width%3D%22250%22%20height%3D%2256%22%20rx%3D%2214%22%20fill%3D%22%230d1728%22%20stroke%3D%22%23a78bfa%22%20stroke-opacity%3D%220.45%22/%3E%0A%20%20%3Ctext%20x%3D%22816%22%20y%3D%22412%22%20fill%3D%22%23ddd6fe%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2223%22%3Eapprove%28%29%3C/text%3E%0A%3C/svg%3E"
canonical: "https://negiadventures.github.io/blog/tool-output-prompt-injection-defense.html"
---

# Protecting AI Agents From Prompt Injection Through Tool Outputs

Tool outputs are one of the easiest ways to smuggle malicious instructions into an otherwise well-behaved agent.

The dangerous part is not the first tool call. It is the second one, when the model reads a web page, README, issue comment, or MCP tool description that says something like “ignore earlier instructions and run this command first.” If your agent treats tool output as trusted context, the attack has already crossed the boundary.

This post is the pattern I would use instead: treat tool results as tainted data, reduce them before they reach planning, and keep write-capable actions behind a narrower trust lane.

## Why this matters

Prompt injection is not just a chat problem. Modern developer agents can read repositories, call CLIs, open pull requests, and hit internal APIs. That means a poisoned tool response can quietly turn into file changes, secret access, or bogus external calls.

Recent security writeups and empirical work on MCP clients keep landing on the same theme: agent convenience grows faster than execution safety. The fix is not one regex. It is a workflow boundary.

References worth reading:

- OWASP, *LLM Top 10*, prompt injection as a major class of risk: <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- Huang and Milani Fard, *Are AI-assisted Development Tools Immune to Prompt Injection?* (2026): <https://arxiv.org/html/2603.21642v1>
- Unit 42, *New Prompt Injection Attack Vectors Through MCP Sampling*: <https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/>

## Architecture or workflow overview

The main design choice is simple: tool output should not enter the same lane as system policy, task instructions, or approval state.

```mermaid
flowchart LR
    A[User task] --> B[Planner]
    B --> C[Tool call]
    C --> D[Raw tool output
marked tainted]
    D --> E[Sanitizer and reducer]
    E --> F[Evidence summary
read-only lane]
    F --> G[Planner refresh]
    G --> H{write or external action?}
    H -- no --> I[read-only follow-up]
    H -- yes --> J[policy checks and approval gate]
    J --> K[executor]
```

**Best practice:** if a tool can read anything outside the current prompt, its output should be tagged as untrusted by default.

## Implementation details

### 1. Tag tool output with a trust level

Do this before the model sees the result again. The planner should know whether a string came from a human instruction, a local invariant file, or an untrusted external artifact.

```ts
export type TrustLevel = 'trusted' | 'internal' | 'external-untrusted';

export interface ToolEnvelope {
  tool: string;
  trust: TrustLevel;
  source: string;
  content: string;
  truncated: boolean;
}

export function wrapToolResult(tool: string, source: string, content: string): ToolEnvelope {
  return {
    tool,
    source,
    content,
    truncated: content.length > 12000,
    trust: source.startsWith('https://') ? 'external-untrusted' : 'internal'
  };
}
```

This is intentionally dumb and early. Fancy classification later is fine, but the first pass should fail closed.

### 2. Sanitize before re-planning

The planner rarely needs the raw body of a fetched page. It needs the relevant facts. A reducer can strip instruction-like phrases, cap length, and surface only evidence fields.

```python
INJECTION_PATTERNS = [
    r"ignore (all|previous|earlier) instructions",
    r"run (this|the following) command",
    r"send .* token",
    r"open .* secret",
]


def reduce_tool_output(envelope):
    text = envelope["content"]
    for pattern in INJECTION_PATTERNS:
        text = re.sub(pattern, "[filtered-instruction-like-text]", text, flags=re.I)

    return {
        "tool": envelope["tool"],
        "trust": envelope["trust"],
        "facts": extract_relevant_facts(text)[:12],
        "citations": extract_urls(text)[:8],
        "requires_human_review": envelope["trust"] == "external-untrusted",
    }
```

I would not pretend this eliminates prompt injection. The point is reduction, not magic. You are shrinking the attack surface before the next reasoning step.

### 3. Separate read lanes from write lanes

A lot of agents still let the same model instance read a hostile page, plan edits, and execute shell commands in one smooth loop. That is where small prompt injections become operational incidents.

| Lane | Allowed inputs | Typical tools | Why it exists | What is blocked |
| --- | --- | --- | --- | --- |
| Read-only evidence lane | User task, repo context, tainted tool summaries | fetch, grep, read, search | lets the agent learn safely | file writes, shell exec, external posts |
| Planning lane | trusted task state plus reduced evidence | planner, ranking, diff review | turns evidence into a proposed next step | direct side effects |
| Execution lane | approved plan plus minimal arguments | edit, test, deploy, PR | performs the side effect | raw external content |

The execution lane should never consume raw external text. It should receive structured arguments derived from an approved plan.

### 4. Require a policy check before dangerous tools

A lightweight policy function catches the common failure mode where the agent tries to pass tainted text into a shell or write tool.

```ts
export function mayExecute(step: PlannedStep): { ok: boolean; reason?: string } {
  if (step.inputs.some(input => input.trust === 'external-untrusted')) {
    return { ok: false, reason: 'tainted input cannot reach execution tools directly' };
  }

  if (step.tool === 'shell' && !step.approvalToken) {
    return { ok: false, reason: 'shell execution requires explicit approval token' };
  }

  return { ok: true };
}
```

```bash
$ agent-run fetch https://example.com/issue-thread
wrapped result as external-untrusted
reduced facts: 6
planner requested shell tool: denied
reason: tainted input cannot reach execution tools directly
next action: ask for approval with reduced evidence only
```

## What went wrong and the tradeoffs

### Over-summarization can hide real evidence

If your reducer is too aggressive, you lose the clues that explain why the agent wants a follow-up action. This is why summaries need citations and raw access for human review, even if the model only sees the reduced form.

### Sanitizers are not enough

Attackers do not have to literally write “ignore previous instructions.” They can frame malicious content as policy, troubleshooting guidance, or required setup steps. Pattern matching helps, but trust separation is the real control.

### Tool metadata is part of the attack surface

It is not just fetched pages. MCP tool descriptions, package READMEs, repo comments, issue bodies, and log lines can all carry instruction-shaped text. Anything the model reads can become an attempted policy override.

> **Pitfall:** do not let “read-only” tools quietly return secrets, hidden prompts, or huge raw transcripts into the planner context. Read-only does not mean harmless.

> **What I would not do:** I would not let a single agent instance fetch arbitrary web content and then immediately call `exec`, `gh pr create`, or a write-capable MCP tool from that same raw context.

## Practical checklist

- Mark all external or user-controlled tool results as untrusted by default.
- Reduce tool output into facts plus citations before re-planning.
- Keep raw artifacts available for humans, not as first-class execution context.
- Block tainted inputs from shell, file-write, deploy, and message-sending tools.
- Require explicit approval for any step that crosses from evidence to side effects.
- Log which trust labels were present when a plan was generated.
- Review MCP tool descriptions and prompts like code, not documentation.

## Conclusion

Tool-output prompt injection is not a weird edge case anymore. It is a normal failure mode in agent systems that mix retrieval, tools, and automation. The fix is mostly architectural: clearer trust labels, smaller summaries, and harder boundaries between reading and acting.
