---
layout: blog-post
title: "Session-Aware MCP Tools for Multi-User Agent Systems"
description: "A practical guide to building session-aware MCP tools with tenant binding, claim checks, lease scoping, and audit trails so multi-user agent systems stop leaking context or acting in the wrong workspace."
date: 2026-06-02
tags:
  - AI Agents
  - MCP
  - Security
  - Multi-Tenant
  - Reliability
image: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20630%27%3E%0A%3Cdefs%3E%0A%20%20%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%2307111d%27/%3E%0A%20%20%20%20%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2317486b%27/%3E%0A%20%20%3C/linearGradient%3E%0A%3C/defs%3E%0A%3Crect%20width%3D%271200%27%20height%3D%27630%27%20fill%3D%27url%28%23bg%29%27/%3E%0A%3Ccircle%20cx%3D%271010%27%20cy%3D%27108%27%20r%3D%27174%27%20fill%3D%27%2322d3ee%27%20fill-opacity%3D%270.14%27/%3E%0A%3Ccircle%20cx%3D%27180%27%20cy%3D%27520%27%20r%3D%27216%27%20fill%3D%27%238b5cf6%27%20fill-opacity%3D%270.16%27/%3E%0A%3Crect%20x%3D%2778%27%20y%3D%2786%27%20width%3D%271044%27%20height%3D%27458%27%20rx%3D%2730%27%20fill%3D%27%230b1220%27%20stroke%3D%27%2338bdf8%27%20stroke-opacity%3D%270.35%27/%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27164%27%20fill%3D%27white%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2740%27%20font-weight%3D%27700%27%3ESession-Aware%20MCP%20Tools%20for%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27226%27%20fill%3D%27%2393c5fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2740%27%20font-weight%3D%27700%27%3EMulti-User%20Agent%20Systems%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27300%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3EBind%20every%20tool%20call%20to%20the%20right%20tenant%2C%20workspace%2C%20and%20approval%20chain%3C/text%3E%0A%3Ctext%20x%3D%27126%27%20y%3D%27336%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2728%27%3Ebefore%20a%20shared%20agent%20leaks%20context%20or%20writes%20into%20the%20wrong%20conversation%3C/text%3E%0A%3Crect%20x%3D%27126%27%20y%3D%27388%27%20width%3D%27372%27%20height%3D%2754%27%20rx%3D%2714%27%20fill%3D%27%23111c2d%27%20stroke%3D%27%2367e8f9%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27152%27%20y%3D%27423%27%20fill%3D%27%2367e8f9%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2724%27%3Eshared%20tools%20need%20session%20identity%2C%20not%20just%20valid%20JSON%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27166%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27826%27%20y%3D%27204%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Esession%20claim%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27266%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%2322d3ee%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27824%27%20y%3D%27304%27%20fill%3D%27%23bae6fd%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Etenant%20bind%3C/text%3E%0A%3Crect%20x%3D%27776%27%20y%3D%27366%27%20width%3D%27258%27%20height%3D%2758%27%20rx%3D%2714%27%20fill%3D%27%230d1728%27%20stroke%3D%27%23a78bfa%27%20stroke-opacity%3D%270.45%27/%3E%0A%3Ctext%20x%3D%27820%27%20y%3D%27404%27%20fill%3D%27%23ddd6fe%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2723%27%3Eaudit%20trail%3C/text%3E%0A%3C/svg%3E"
canonical: "https://negiadventures.github.io/blog/session-aware-mcp-tools-multi-user-agents.html"
---

# Session-Aware MCP Tools for Multi-User Agent Systems

Session-aware tools become mandatory the moment one MCP server is shared across multiple users, multiple repos, or multiple long-lived agent sessions.

The easy version of a tool server just validates input and runs the action. The painful version comes later, when a perfectly valid tool call uses the wrong workspace, replays an old approval, or writes a note into somebody else’s thread because the runtime forgot who the caller actually was.

This post walks through the design pattern I would use: bind every tool call to a session claim, resolve tenant and workspace server-side, scope leases tightly, and make the audit trail survive past the model turn.

## Why this matters

A lot of MCP demos assume a single human, a single workspace, and a short-lived interaction. Production setups are not that polite.

Once a server is shared, the failure modes change:

- a repo tool runs in the wrong checkout because `repo_path` came from model text instead of trusted session state
- a messaging tool reuses an approval minted in a different conversation
- a cache keyed only by tool name returns data from another tenant
- a browser or shell session stays warm long enough for the next user to inherit it

What makes these bugs nasty is that the schema can still be valid. The problem is not malformed input. The problem is broken identity and broken binding.

## Architecture or workflow overview

```mermaid
flowchart TD
    A[Agent session] --> B[Session claim envelope]
    B --> C[Tool gateway]
    C --> D{Validate claim
TTL, tenant, session, lease}
    D -->|pass| E[Resolve trusted workspace and policy]
    E --> F[Execute MCP tool]
    F --> G[Emit audit record with claim fingerprint]
    D -->|fail| H[Reject call and require re-approval]
```

The important move is that the model does not get to declare its own tenant, workspace, or approval scope. The runtime derives those from a signed or otherwise trusted session envelope.

## Implementation details

### 1) Carry a session claim with every tool call

I like a small envelope that is minted by the orchestrator and passed to the tool server outside the model-visible arguments when possible.

```json
{
  "session_id": "sess_01JY7Q7K7H2M8",
  "tenant_id": "team-acme",
  "actor_id": "user_142",
  "workspace_id": "repo:billing-api",
  "approval_fingerprint": "apr_8e9b7c",
  "lease_id": "lease_4bf2",
  "issued_at": "2026-06-02T12:03:00Z",
  "expires_at": "2026-06-02T12:08:00Z",
  "allowed_tools": ["github.comment_issue", "repo.read_file"]
}
```

That envelope lets the server answer questions the schema cannot: who is calling, which tenant owns the call, which workspace is in scope, whether approval was granted for this exact session, and whether the lease is still alive.

### 2) Resolve sensitive context on the server side

Do not ask the model for raw filesystem paths or tenant IDs if the runtime already knows them.

```ts
interface SessionClaim {
  sessionId: string;
  tenantId: string;
  workspaceId: string;
  allowedTools: string[];
  expiresAt: string;
}

export async function executeTool(
  toolName: string,
  input: unknown,
  claim: SessionClaim
) {
  assertAllowed(toolName, claim.allowedTools);
  assertNotExpired(claim.expiresAt);

  const workspace = await workspaceRegistry.resolve({
    tenantId: claim.tenantId,
    workspaceId: claim.workspaceId,
  });

  return toolRouter.run(toolName, {
    input,
    workspaceRoot: workspace.root,
    auditTags: {
      tenantId: claim.tenantId,
      sessionId: claim.sessionId,
    },
  });
}
```

This is one of those boring guardrails that prevents spectacular messes. The model can request `src/auth.ts`, but it should never choose an arbitrary path from another customer’s checkout.

### 3) Key caches and warm resources by tenant plus session lane

Cross-tenant cache bleed is a very real failure mode.

```python
def cache_key(tool_name: str, tenant_id: str, workspace_id: str, logical_input_hash: str) -> str:
    return ":".join([
        "mcp-cache",
        tool_name,
        tenant_id,
        workspace_id,
        logical_input_hash,
    ])
```

If you only key by tool name and normalized input, a shared retrieval tool or browser snapshot can hand the wrong answer to the wrong user. I would rather lose a bit of cache efficiency than debug that incident.

### 4) Make approvals session-bound, not globally reusable

A human approval should usually bind to the tool name, the tenant or workspace, the session ID, a narrow action summary, and a short TTL.

```text
approval_id: apr_8e9b7c
session_id: sess_01JY7Q7K7H2M8
tool: github.comment_issue
scope: repo:billing-api / issue:1842
ttl: 300s
status: valid
```

If you approve one comment action in one thread, that approval should not quietly authorize another write in another workspace five minutes later.

## What went wrong, and the tradeoffs

### Failure mode 1, session identity exists only in prompt text

This is the classic trap. The model says which repo or tenant it is operating on, and the server trusts it because the schema looked right.

That is not session awareness. That is prompt-shaped wishful thinking.

### Failure mode 2, warm workers outlive their trust boundary

Long-lived browser contexts, shell sessions, and checked-out repos are good for latency, but they are risky if they are not rebound or destroyed between tenants.

| Choice | Benefit | Cost | When I would use it |
| --- | --- | --- | --- |
| Per-call isolation | Strongest boundary | Higher latency | High-risk write tools |
| Per-session warm state | Good speed with clear ownership | Cleanup complexity | Medium-risk coding workflows |
| Cross-session shared state | Cheapest | Easy to leak context | Almost never for write-capable tools |

What I would not do is keep a single warm write-capable shell around for multiple humans just because it feels efficient.

### Failure mode 3, audit logs lose the claim fingerprint

If the audit record only says tool X ran with input Y, incident review becomes guesswork.

A useful record should preserve at least session ID, tenant ID, actor ID or actor class, approval fingerprint, lease ID, resolved workspace, and exact tool name.

> **Best practice:** treat session claims like capability tokens. Sign them, validate them server-side, keep them short-lived, and never let the model rewrite them.

> **Pitfall:** mixed read/write tools are easy to under-classify. If a preview endpoint leaves durable state, sends telemetry, or allocates resources, it is not harmless just because it returns JSON.

## Practical checklist

- [ ] bind every tool call to a trusted session claim
- [ ] resolve tenant, workspace, and policy server-side
- [ ] scope approvals to session plus action fingerprint
- [ ] expire leases aggressively and reject replayed claims
- [ ] key caches and warm resources by tenant and workspace
- [ ] emit claim fingerprints into audit and trace records
- [ ] isolate or reset warm runtimes between trust boundaries
- [ ] test cross-tenant and replay failures on purpose

## Conclusion

Multi-user MCP systems break in ways single-user demos never show.

If you want shared tools to stay safe, the trick is not a bigger prompt. It is tighter runtime binding. Session-aware claims, scoped leases, and audit-friendly execution make the difference between a useful shared tool layer and a slow-moving data leak.

## References

- [Model Context Protocol](https://modelcontextprotocol.io)
- [OAuth 2.0 Token Exchange, RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693)
- [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Google Zanzibar paper](https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/)
