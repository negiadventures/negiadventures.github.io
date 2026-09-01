---
layout: blog-post
title: "Hybrid Code Retrieval for AI Coding Agents That Beats Full-Repo Prompt Stuffing"
description: "A practical guide to hybrid code retrieval for AI coding agents using embeddings, tree-sitter structure, ripgrep fallback, and reranking so prompts stay smaller and edits stay more accurate."
date: 2026-04-25
tags:
  - AI Agents
  - Code Retrieval
  - Tree-sitter
  - Embeddings
  - Developer Tools
image: data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2318324d%27/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%20%20%3Ccircle%20cx%3D%271010%27%20cy%3D%27110%27%20r%3D%27160%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%20%20%3Ccircle%20cx%3D%27180%27%20cy%3D%27525%27%20r%3D%27205%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%20%20%3Crect%20x%3D%2782%27%20y%3D%2786%27%20width%3D%271036%27%20height%3D%27458%27%20rx%3D%2732%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27174%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EHybrid%20Code%20Retrieval%20for%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27242%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2744%27%20font-weight%3D%27700%27%3EAI%20Coding%20Agents%3C/text%3E%0A%20%20%3Ctext%20x%3D%27132%27%20y%3D%27318%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EEmbeddings%2C%20tree-sitter%2C%20ripgrep%20fallback%2C%20and%20reranking%3C/text%3E%0A%20%20%3Crect%20x%3D%27132%27%20y%3D%27376%27%20width%3D%27338%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27156%27%20y%3D%27411%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Estop%20shoving%20whole%20repos%20into%20the%20prompt%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27176%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27840%27%20y%3D%27212%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eembed%28%29%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27274%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27814%27%20y%3D%27310%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Etree-sitter%3C/text%3E%0A%20%20%3Crect%20x%3D%27770%27%20y%3D%27372%27%20width%3D%27252%27%20height%3D%2756%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%20%20%3Ctext%20x%3D%27840%27%20y%3D%27408%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Erg%3C/text%3E%0A%3C/svg%3E
---

# Hybrid Code Retrieval for AI Coding Agents That Beats Full-Repo Prompt Stuffing

Most AI coding mistakes are retrieval mistakes wearing a generation costume. The model edits the wrong file, misses the helper that already exists, or rewrites an API because the only thing it saw was a vague prompt plus a pile of repo text.

The fix is usually not a bigger context window. It is better retrieval. In this post I will show the hybrid setup I would use for a real coding agent: embeddings for semantic recall, tree-sitter for code structure, ripgrep for exact matches, and a lightweight reranker before anything reaches the prompt.

This matters because smaller, more relevant context tends to improve both accuracy and reviewability. It also makes failures easier to debug when the model still gets it wrong.

## Why this matters

If your agent only has one retrieval move, it will fail in predictable ways:

- embeddings miss exact symbol names or newly added files
- keyword search misses semantically related helpers
- whole-file stuffing buries the useful lines under noise
- giant prompts increase latency and cost while making review worse

For code, retrieval has to serve three different tasks at once:

1. **Find the right files**
2. **Find the right symbols inside those files**
3. **Deliver a compact, inspectable packet to the model**

That is why a hybrid stack works better than any single index.

Direct references worth reading if you are building this for real:

- [tree-sitter](https://tree-sitter.github.io/tree-sitter/) for fast syntax-aware parsing
- [ripgrep](https://github.com/BurntSushi/ripgrep) for exact symbol and string search
- [pgvector](https://github.com/pgvector/pgvector) if you want embeddings in Postgres
- [OpenTelemetry](https://opentelemetry.io/) if you want to trace retrieval latency and failure modes

## Architecture overview

```mermaid
flowchart LR
    A[User task] --> B[Intent classifier]
    B --> C[Embedding recall]
    B --> D[tree-sitter symbol index]
    B --> E[ripgrep exact match]
    C --> F[Candidate merge]
    D --> F
    E --> F
    F --> G[Reranker]
    G --> H[Context packet builder]
    H --> I[Agent edit or answer]
    I --> J[Verifier and tests]
```

A few implementation notes matter more than the diagram itself:

- embeddings should retrieve chunks, not entire repositories
- tree-sitter should index symbols and parent-child relationships
- ripgrep should stay available as the escape hatch for literals, flags, env vars, and exact API names
- the final packet should be bounded by token budget and file-count budget

## Implementation details

### 1. Build a symbol-aware index, not just file chunks

A flat embedding index over random 800-token code chunks is better than nothing, but it loses too much structure. I prefer indexing symbols and selected surrounding spans.

```ts
import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';

const parser = new Parser();
parser.setLanguage(TypeScript.typescript);

export function extractSymbols(source: string, path: string) {
  const tree = parser.parse(source);
  const symbols: Array<{path: string; name: string; kind: string; start: number; end: number}> = [];

  function walk(node: Parser.SyntaxNode) {
    if ([
      'function_declaration',
      'class_declaration',
      'method_definition',
      'interface_declaration',
      'type_alias_declaration'
    ].includes(node.type)) {
      const nameNode = node.childForFieldName('name');
      symbols.push({
        path,
        name: nameNode?.text ?? 'anonymous',
        kind: node.type,
        start: node.startIndex,
        end: node.endIndex
      });
    }

    for (const child of node.children) walk(child);
  }

  walk(tree.rootNode);
  return symbols;
}
```

The useful trick here is that the chunk boundary follows code structure. Later, when the agent asks about `buildContextPacket`, you can fetch the function body, its imports, and maybe its nearest sibling helpers instead of pasting two pages of unrelated code.

### 2. Keep keyword search as a first-class retrieval path

Exact search is still the best tool for some jobs. If a model mentions `X-Request-Id`, `FEATURE_FLAG_AGENT_MODE`, or `dangerouslySetInnerHTML`, I do not want to hope embeddings figure it out.

```bash
rg -n --hidden --glob '!node_modules' --glob '!dist' \
  'buildContextPacket|ContextBudget|FEATURE_FLAG_AGENT_MODE' .
```

I usually treat ripgrep hits as high-confidence candidates when:

- the query includes exact symbols
- the issue references a stack trace or config key
- the repo is changing quickly and embeddings may lag behind the latest commit

A lot of retrieval bugs come from teams treating semantic search as magical and exact search as legacy. That is backwards. Good systems use both.

### 3. Merge candidates, then rerank before prompt assembly

Once you have candidates from different channels, score them together. Embeddings alone will overvalue semantically similar but operationally irrelevant files.

```yaml
retrieval:
  maxCandidates: 40
  finalContextFiles: 8
  strategies:
    - name: embeddings
      weight: 0.45
    - name: tree_sitter_symbol_match
      weight: 0.35
    - name: ripgrep_exact_match
      weight: 0.20
  rerank:
    enabled: true
    model: cross-encoder-mini
    keepTopK: 12
```

My rule of thumb is simple: retrieve broadly, rerank aggressively, prompt narrowly.

The reranker does not need to be fancy. It only needs to answer, “Which of these candidates is most likely to matter for this specific task?” That one stage often cuts prompt size by half without hurting quality.

### 4. Build context packets that are reviewable by humans too

A good context packet is not just model food. It should be readable enough that a human reviewer can inspect the evidence later.

A packet I like includes:

- task summary
- top files with a one-line reason each
- symbol excerpts, not whole files by default
- related tests
- known constraints or no-go files
- one small section called `why_these_files` for auditability

```json
{
  "task": "Add retry jitter to the GitHub webhook worker",
  "files": [
    {
      "path": "src/workers/githubWebhook.ts",
      "reason": "Primary retry loop lives here"
    },
    {
      "path": "src/lib/backoff.ts",
      "reason": "Existing delay helpers already used by adjacent workers"
    }
  ],
  "symbols": [
    "processWebhookEvent",
    "computeBackoffMs",
    "RetryPolicy"
  ],
  "tests": [
    "tests/githubWebhook.test.ts"
  ]
}
```

That shape tends to produce better edits because the agent receives a compact map instead of an undifferentiated text dump.

## What went wrong, and the tradeoffs

### Failure mode 1: stale embeddings after fast-moving refactors

This is the most common production bug. Your semantic index points to an old helper that was renamed yesterday. The agent confidently edits dead code.

What I would do:

- tie the embedding index to a commit SHA
- rebuild incrementally on changed files
- lower embedding confidence when the repository is ahead of the indexed SHA
- always allow ripgrep fallback against the working tree

### Failure mode 2: symbol indexes that ignore generated or polyglot code

Tree-sitter is great, but only where you actually have grammars and clean parse paths. In mixed repos, you will still hit YAML, SQL, shell, generated SDKs, and templates.

That means your retrieval layer needs graceful degradation. I would rather have a crude exact-match fallback than pretend the structural index is complete.

### Failure mode 3: packing too much context because the retriever found it

Retrieval recall and prompt usefulness are not the same thing. More files can reduce answer quality by making the task ambiguous.

| Choice | Benefit | Cost | When I would use it |
| --- | --- | --- | --- |
| Large top-k recall | Better coverage | More noise and latency | Early exploration, offline evals |
| Aggressive reranking | Smaller prompt, better focus | Can hide edge-case files | Normal coding tasks |
| Whole-file inclusion | More surrounding context | Token bloat | Tiny files or config files |
| Symbol-level excerpts | High precision | Needs indexing work | Most application code |

### Security and reliability notes

Two things are easy to miss:

1. **Prompt injection can ride in through retrieved docs or generated files.** Treat retrieved external content as tainted, especially markdown, HTML, and copied issue text.
2. **Retrieval is part of your correctness boundary.** If the wrong file makes the packet, the model can be perfectly obedient and still ship the wrong patch.

I would trace retrieval spans separately and log these fields at minimum:

- query type
- candidate counts per strategy
- rerank latency
- final file list
- index commit SHA
- whether fallback search changed the final result

## Practical checklist

- [ ] embeddings are built from symbol-aware chunks, not random megachunks
- [ ] exact search exists and is not hidden behind a failure path
- [ ] every packet records why each file was included
- [ ] retrieval is tied to a repo SHA or change counter
- [ ] final context has a hard token budget and hard file-count budget
- [ ] tests and adjacent config files are eligible retrieval targets
- [ ] you can inspect retrieval latency and false-positive rates in traces

## What I would do again

If I were building this today, I would start embarrassingly simple:

1. ripgrep
2. tree-sitter symbol extraction
3. embeddings in a small local store
4. one reranker
5. packet builder with explicit budgets

I would not start with a giant vector pipeline and five clever heuristics. Most teams do not have a generation problem first. They have a retrieval discipline problem.

## Conclusion

Hybrid retrieval is one of the highest-leverage upgrades you can make to an AI coding agent. It reduces prompt size, improves edit accuracy, and makes bad outputs easier to debug.

The important shift is mental, not just technical: treat retrieval as part of the agent's architecture, not as a pre-processing detail.
