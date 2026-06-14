---
layout: blog-post
title: "Reranker Budgets for AI Coding Agents That Need Better Code Retrieval"
description: "A practical guide to using reranker budgets, exact-match promotion, and latency caps so AI coding agents retrieve the right code paths without turning every lookup into a slow expensive search stack."
date: 2026-06-14
tags:
  - Code Retrieval
  - AI Coding Agents
  - Reranking
  - Embeddings
  - Latency Budgets
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23184a72%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27%2F%3E%0A%3Ccircle%20cx%3D%271010%27%20cy%3D%27110%27%20r%3D%27176%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27%2F%3E%3Ccircle%20cx%3D%27184%27%20cy%3D%27520%27%20r%3D%27220%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27%2F%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27%2F%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EReranker%20Budgets%20for%20AI%20Coding%20Agents%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27224%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2738%27%20font-weight%3D%27700%27%3EThat%20Need%20Better%20Code%20Retrieval%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27298%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3ERetrieve%20more%20signal%2C%20not%20more%20files%2C%20by%20spending%20latency%20where%20exact%20search%3C%2Ftext%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27334%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Efails%20and%20using%20rerankers%20only%20on%20the%20candidates%20that%20deserve%20the%20cost%3C%2Ftext%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27382%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27%2F%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Ebetter%20retrieval%20comes%20from%20budget%20discipline%2C%20not%20wider%20top-k%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27824%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eexact%20hits%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27812%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Ererank%20slice%3C%2Ftext%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27%2F%3E%3Ctext%20x%3D%27822%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Etoken%20packet%3C%2Ftext%3E%0A%3C%2Fsvg%3E"
---

# Reranker Budgets for AI Coding Agents That Need Better Code Retrieval

## Visual plan
- **Hero image idea:** dark retrieval pipeline banner with exact hits, rerank slice, and final token packet stages.
- **Architecture diagram idea:** query flow from ripgrep and symbol index into embedding recall, reranker slice, and context packet builder.
- **Optional terminal-output visual idea:** latency log showing exact hit promotion and reranker cutoff.
- **Optional comparison table idea:** compare exact search only, wide embedding top-k, and budgeted reranker pipeline.
- **Tags:** Code Retrieval, AI Coding Agents, Reranking, Embeddings, Latency Budgets
- **Meta description:** A practical guide to using reranker budgets, exact-match promotion, and latency caps so AI coding agents retrieve the right code paths without turning every lookup into a slow expensive search stack.
- **Suggested code snippet sections:** candidate generation config, reranker budget policy, retrieval trace output.

## Hook
AI coding agents often fail retrieval in a very specific way: the right file is in the repository, but the context packet still arrives padded with almost-right code. The model then writes a plausible patch against the wrong abstraction layer.

A lot of teams react by increasing top-k everywhere. That usually raises latency, prompt size, and review noise faster than it raises accuracy.

This guide shows how to use reranker budgets, exact-match promotion, and context packet caps so code retrieval gets sharper without turning every agent lookup into a slow expensive mini-search engine.

## Why this matters
Production coding agents do not just need *some* relevant files. They need the right function, the right config, and the right test nearby enough that the model can patch with confidence.

Retrieval quality falls apart when:
- symbol names are overloaded across packages
- embeddings recall broad conceptual neighbors but miss the exact call site
- monorepo helpers flood the candidate list
- the reranker burns time on fifty near-duplicates the model never needed

A reranker is useful, but only if it spends latency on ambiguity instead of on obvious cases that exact search already solved.

> **Bottom line:** budgeted reranking beats unconditional reranking because most developer queries are mixed workloads, not pure semantic search.

## Architecture or workflow overview
```text
agent request
  -> query classifier
  -> exact search + symbol lookup + embedding recall
  -> candidate merge and dedupe
  -> reranker budget policy
  -> top context packet builder
  -> code-editing model
```

```mermaid
flowchart LR
    A[Agent asks for code context] --> B[Query classifier]
    B --> C[ripgrep and symbol index]
    B --> D[Embedding recall]
    C --> E[Candidate merge]
    D --> E
    E --> F{Ambiguous enough to rerank?}
    F -- no --> G[Promote exact hits]
    F -- yes --> H[Cross-encoder rerank top slice]
    G --> I[Context packet builder]
    H --> I
    I --> J[Patch or answer]
```

## Implementation details
### 1. Split retrieval into cheap recall and expensive judgment
The fastest retrieval systems do not ask the reranker to do everything. They let exact search catch precise identifiers, use embeddings for broader recall, then reserve reranking for the slice that is still ambiguous.

```yaml
query_router:
  exact_search:
    enabled: true
    max_hits: 20
    promote_if:
      - identifier_match
      - filepath_match
  embedding_search:
    enabled: true
    top_k: 24
  reranker:
    enabled: true
    only_if:
      - merged_candidates > 8
      - exact_confidence < 0.9
    slice_k: 10
    timeout_ms: 120
  packet_builder:
    max_files: 6
    max_tokens: 4800
```

That policy is boring on purpose. The key idea is that exact identifier hits should not compete with weak semantic neighbors unless the query is actually ambiguous.

### 2. Merge candidates by evidence, not arrival order
If your pipeline appends exact hits, then embedding hits, then reranks the whole pile, you waste time scoring duplicates. Merge first and keep an evidence ledger.

```python
from dataclasses import dataclass, field

@dataclass
class Candidate:
    path: str
    symbol: str | None = None
    exact_score: float = 0.0
    embedding_score: float = 0.0
    evidence: list[str] = field(default_factory=list)


def merge_candidates(exact_hits, embedding_hits):
    merged: dict[str, Candidate] = {}

    for hit in exact_hits:
        item = merged.setdefault(hit.path, Candidate(path=hit.path, symbol=hit.symbol))
        item.exact_score = max(item.exact_score, hit.score)
        item.evidence.append(f"exact:{hit.match_type}")

    for hit in embedding_hits:
        item = merged.setdefault(hit.path, Candidate(path=hit.path, symbol=hit.symbol))
        item.embedding_score = max(item.embedding_score, hit.score)
        item.evidence.append("embedding")

    return sorted(
        merged.values(),
        key=lambda c: (c.exact_score, c.embedding_score),
        reverse=True,
    )
```

This makes the reranker score *distinct hypotheses* instead of repeatedly scoring the same file because it appeared in three recall lanes.

### 3. Spend reranker budget only on uncertainty
The reranker should behave like a tie-breaker, not a mandatory middle layer. I like simple gates based on confidence and candidate count.

```ts
export function shouldRerank(input: {
  exactConfidence: number;
  mergedCount: number;
  queryType: 'identifier' | 'stacktrace' | 'concept' | 'diff';
}) {
  if (input.queryType === 'identifier' && input.exactConfidence >= 0.9) {
    return { enabled: false, reason: 'exact-hit-promoted' };
  }

  if (input.mergedCount <= 4) {
    return { enabled: false, reason: 'candidate-set-small' };
  }

  return {
    enabled: true,
    sliceK: input.queryType === 'concept' ? 12 : 8,
    timeoutMs: input.queryType === 'stacktrace' ? 80 : 120,
  };
}
```

That one gate keeps latency stable. In practice, symbol lookups and stack traces often have a strong exact signal already. Conceptual queries like “where do retries get bounded” benefit much more from reranking.

### 4. Log retrieval traces so humans can debug the retrieval layer
If an agent patches the wrong file, you want to know whether the model was confused or the retrieval packet was weak.

```text
[retrieve] query="where is billing retry backoff applied"
[retrieve] exact_hits=2 embedding_hits=24 merged=11
[retrieve] exact_confidence=0.42 rerank=enabled slice_k=10 timeout_ms=120
[retrieve] top_after_rerank=
  1 src/billing/retry_policy.ts score=0.93 evidence=embedding,exact:symbol
  2 src/billing/worker.ts score=0.88 evidence=embedding
  3 tests/billing/retry_policy.test.ts score=0.84 evidence=embedding
[packet] files=4 tokens=4310
```

## Tradeoff table
| Approach | What it optimizes | Failure mode | My take |
| --- | --- | --- | --- |
| Exact search only | Speed and explainability | Misses conceptual or paraphrased queries | Great first lane, weak full strategy |
| Wide embedding top-k | Recall | Bloated packets and semantic noise | Better demos than production |
| Always rerank everything | Ranking quality | Latency spikes and cost creep | Usually too blunt |
| Budgeted rerank slice | Accuracy per millisecond | Needs routing logic and telemetry | Best default for agent workflows |

## What went wrong, and the tradeoffs
### A bigger top-k made the model worse
I have seen retrieval stacks improve offline recall while making agent edits worse, because the packet builder stuffed in more similar helpers than the model could reliably separate.

**What I would not do:** treat retrieval recall as independent from prompt budget. The model still has to use the packet.

### Rerankers love duplicates if you let them
If you chunk code too aggressively, one file can dominate the rerank slice with five nearly identical fragments. That looks like confidence, but it is really duplication.

**Best practice:** dedupe by file first, then allow at most a small number of chunks per file in the rerank slice.

### Timeout policy matters more than benchmark bragging
A slower but better reranker is not actually better if it blows the interactive budget for every coding step.

**Rough comparison:** if exact plus embeddings returns in ~40 ms, spending another 80 to 120 ms on ambiguous queries is usually fine. Spending 350 ms on every query is where the stack starts to feel sticky.

### Security and privacy still apply
If you ship repository text to a hosted reranker, that is still source code leaving the primary boundary even if the main model is local.

**Security concern:** apply the same source-code handling rules to reranking infrastructure that you apply to your model gateway.

## Practical checklist
- promote exact identifier and filepath hits when confidence is high
- merge and dedupe candidates before reranking
- rerank only an ambiguity slice, not the full recall set
- cap reranker latency with timeouts and query-type-specific budgets
- keep packet size bounded by both file count and token count
- log retrieval traces so bad patches can be explained
- audit whether reranker gains survive contact with prompt limits

## References
- <https://www.pinecone.io/learn/series/rag/rerankers/>
- <https://www.sbert.net/examples/cross_encoder/applications/README.html>
- <https://platform.openai.com/docs/guides/embeddings>

## Conclusion
Rerankers are useful, but they are not magic. For AI coding agents, the winning pattern is usually exact search first, embeddings for broader recall, and a tightly budgeted reranker only where ambiguity remains.

That keeps retrieval sharp, latency predictable, and context packets small enough for the model to actually use.
