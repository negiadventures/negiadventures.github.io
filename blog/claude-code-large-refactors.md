---
layout: blog-post
title: "Claude Code Workflows for Large Refactors Without Losing the Plot"
description: "A practical guide to using Claude Code for large refactors with specs, checkpoints, verification loops, and guardrails that keep big changes understandable."
date: 2026-03-28
tags:
  - Claude Code
  - Refactoring
  - AI Coding
  - Developer Workflow
image: /images/profile.jpg
canonical: https://negiadventures.github.io/blog/claude-code-large-refactors.html
---

# Claude Code Workflows for Large Refactors Without Losing the Plot

Large refactors are where AI coding tools become either a force multiplier or a chaos engine. Small edits are easy. The hard part is changing architecture, naming, directory layout, or service boundaries without slowly turning the codebase into something nobody understands.

Claude Code is especially useful here because it works well in a repository-shaped workflow: read the code, inspect neighboring files, propose a plan, make targeted edits, and verify the result in the same loop. But the tool only helps if the workflow around it is disciplined.

This post covers the practical setup I would use to make Claude Code useful on big refactors without giving it permission to create a giant, inscrutable diff.

## The problem with AI-assisted refactors

The failure mode is not just bad code. It is comprehension debt.

You ask for a broad cleanup, the tool touches thirty files, abstractions shift, names change, tests partly pass, and now the repository technically builds but nobody on the team is fully sure what happened. That is worse than a failed attempt because it costs review time, debugging time, and confidence.

For large refactors, the real goal is not “let the model change everything.” The real goal is:

1. define the end state clearly
2. break the work into reviewable slices
3. keep verification close to each slice
4. preserve a readable narrative in commits and PRs

That is where Claude Code can help a lot.

## Start with a spec before touching code

If the refactor is larger than a couple of files, I want a short spec first. Not a giant design doc. Just enough structure to stop drift.

A good refactor spec answers:

- What is changing?
- What is not changing?
- What interfaces must remain stable?
- What can be deleted after migration?
- How will we verify success?
- What are the risky areas?

A lightweight spec can live in `specs/refactor-auth-service.md` or even in the PR description while you work.

### Example prompt

<div class="code-block"><pre><code>I want to refactor the billing module into three layers:
1. API routes
2. domain services
3. provider adapters

Constraints:
- Do not change external API behavior
- Keep Stripe as the only provider for now
- Preserve all existing tests
- Prefer moving code over rewriting logic

First: inspect the repo and write a short refactor plan with phases,
risky files, invariants to preserve, and verification commands.
Do not edit code yet.</code></pre></div>

That last line matters. “Do not edit code yet” is often the difference between getting a plan and getting a diff you did not ask for.

## Use phases, not one giant prompt

A large refactor should feel like a sequence of small migrations.

A practical phase breakdown looks like this:

### Phase 1: map the current system
- identify entry points
- find duplicated logic
- list dependencies and side effects
- note the test surface

### Phase 2: create destination structure
- add new directories or modules
- introduce interfaces or helper layers
- keep behavior unchanged

### Phase 3: move code incrementally
- migrate one subsystem at a time
- keep old call sites working during transition
- remove dead code only after verification

### Phase 4: normalize naming and cleanup
- rename symbols consistently
- update docs and comments
- tighten tests and lint rules

### Phase 5: final verification
- run tests, type checks, lint, and a quick manual smoke test
- inspect the diff for accidental behavior changes

Claude Code tends to do much better when each phase has a narrow objective and a clear stop condition.

## Ask for checkpoints, not just results

One of the most useful patterns is checkpointing. Instead of saying “finish the refactor,” tell Claude Code to stop after a bounded milestone and summarize what changed.

### Example checkpoint prompt

<div class="code-block"><pre><code>Implement only Phase 2 from the plan.

Requirements:
- create the target module structure
- do not change runtime behavior yet
- keep the diff as small as possible
- after editing, summarize every file changed and why
- then stop</code></pre></div>

That gives you a natural review point before the tool keeps going.

## Make verification commands explicit

Never assume the tool knows the most relevant verification path. Tell it exactly what “done” means.

For a JavaScript or TypeScript repo, that might be:

<div class="code-block"><pre><code>npm test
npm run lint
npm run typecheck</code></pre></div>

For a Python service:

<div class="code-block"><pre><code>pytest
ruff check .
mypy src</code></pre></div>

And for larger systems, I like to add one targeted smoke path:

<div class="code-block"><pre><code># example
pnpm test billing-webhook.spec.ts
pnpm exec playwright test tests/smoke/checkout.spec.ts</code></pre></div>

The point is simple: broad refactors need broad checks, but they also need one or two checks that are close to the risky path.

## Prefer move-first refactors over rewrite-first refactors

When using AI tools, move-first beats rewrite-first most of the time.

Why?

- smaller diffs are easier to review
- tests stay meaningful
- behavior drift is easier to catch
- you preserve the repository’s history and intent

A good instruction is:

<div class="code-block"><pre><code>Prefer extraction, relocation, and renaming over rewriting logic.
If behavior must change, call it out explicitly before making the change.</code></pre></div>

That single constraint tends to improve refactor quality a lot.

## Use a second pass for review, not just generation

One useful workflow is to use Claude Code twice:

1. once as the implementer
2. once as the reviewer

After a phase lands, ask for a review-style read of the diff:

<div class="code-block"><pre><code>Review the current diff like a strict senior engineer.
Look for:
- accidental behavior changes
- naming inconsistencies
- dead abstractions
- missed imports or references
- test gaps
- places where the new structure is worse than the old one

Do not edit yet. Just produce findings ordered by severity.</code></pre></div>

This works well because critique mode is different from generation mode. You often get better results by separating them.

## Keep a visible migration narrative

Refactors become easier to review when the repository tells a story.

That means:

- branch names that describe the migration
- commits grouped by phase
- PR text that explains what changed first, second, and third
- comments in temporary adapters that say when they can be deleted

Claude Code can help draft this narrative too. Ask it to produce a PR outline after the coding phase:

- problem being solved
- migration steps
- what stayed stable
- follow-up cleanup still left

That turns the AI from “code generator” into “technical editor,” which is usually more valuable during big changes.

## Watch out for these common failure modes

### 1. Hidden cross-file breakage
A tool may update the obvious imports but miss string-based references, config keys, or CLI flags.

### 2. New abstractions with no payoff
AI tools love creating wrappers. Some are useful. Many just add indirection. If a new layer does not simplify testing, ownership, or reuse, question it.

### 3. Mixed naming schemes
Half the repo says `billingService`, the other half says `billingManager`, and two folders use different conventions. This is a refactor smell, not progress.

### 4. Big diff, weak tests
If the change touches fifteen files and the only passing check is one unit test, confidence is fake.

### 5. Cleanup that is too early
Deleting old paths before the new path is fully verified is how migrations become outages.

## A practical refactor loop that works

If I were doing a serious refactor with Claude Code, my loop would look like this:

1. write a short spec
2. ask for a phased plan only
3. execute one phase at a time
4. run explicit verification after each phase
5. request a review-only pass on the diff
6. clean up naming and docs last
7. open a PR with a readable migration story

That sounds slower than one giant autonomous run, but in practice it is faster because review quality stays high and rollback risk stays low.

## Example: turning a routes-heavy app into layered modules

Say your app currently has route handlers doing everything directly:

- request parsing
- validation
- business logic
- third-party API calls
- response formatting

A clean layered refactor might target this end state:

- `routes/` for HTTP-only concerns
- `services/` for application logic
- `providers/` for third-party integrations
- `models/` or `schemas/` for data contracts

The staged prompt sequence could be:

1. map all route handlers and shared dependencies
2. create `services/` and `providers/` without changing behavior
3. migrate one route group at a time
4. run route-level tests after each migration
5. remove duplicated logic only after the new structure is stable

That is the kind of work AI tools can accelerate well because it mixes pattern recognition with repetitive but reviewable edits.

## The best use of Claude Code in big refactors

The best use is not “let it redesign my system from scratch.”

The best use is:

- make the existing system legible
- plan a migration path
- handle repetitive edits carefully
- verify aggressively
- explain the resulting diff clearly

In other words, Claude Code is strongest when it acts like a fast staff engineer with supervision, not an unchecked autopilot.

## References and resources

- Anthropic Claude Code docs: https://docs.anthropic.com
- Addy Osmani on LLM coding workflows: https://medium.com/@addyosmani/my-llm-coding-workflow-going-into-2026-52fe1681325e
- Martin Fowler on refactoring: https://martinfowler.com/books/refactoring.html
- GitHub guide to code review best practices: https://github.blog/developer-skills/github/code-review-best-practices/

## Key takeaways

- Large AI-assisted refactors fail when scope is vague and verification is weak.
- Short specs, phased execution, and explicit checkpoints make Claude Code much more reliable.
- Review mode matters as much as generation mode.
- The best refactor outcome is not just working code. It is a working codebase that still makes sense to humans.
