"use client";

import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

/**
 * The About copy claims agents write most of the code. Rather than assert it,
 * show the loop: plan, gates, patch, verify, and a human approving the risky
 * part. It is the one thing on the page that demonstrates the positioning.
 */
export default function AgentRun() {
  return (
    <Terminal
      sequence
      className="w-full max-w-none border-line bg-surface text-[12.5px]"
    >
      <TypingAnimation duration={38} className="text-muted">
        &gt; agent run --task "add idempotency keys to /charges"
      </TypingAnimation>

      <AnimatedSpan delay={1600} className="text-violet-300">
        ◆ planning · 4 files in scope
      </AnimatedSpan>
      <AnimatedSpan delay={2100} className="text-dim">
        ├ contracts/openapi.yaml
        <br />
        ├ src/charges/handler.ts
        <br />
        ├ migrations/0042_idempotency.sql
        <br />
        └ tests/charges.spec.ts
      </AnimatedSpan>

      <AnimatedSpan delay={2900} className="text-emerald-400">
        ✓ schema gate · expand-contract, no destructive DDL
      </AnimatedSpan>
      <AnimatedSpan delay={3400} className="text-emerald-400">
        ✓ contract diff · 0 breaking, 1 additive
      </AnimatedSpan>
      <AnimatedSpan delay={3900} className="text-amber-400">
        ! write scope · migrations/ requires approval
      </AnimatedSpan>
      <AnimatedSpan delay={4400} className="text-dim">
        &nbsp;&nbsp;approved by anirudh · 12s
      </AnimatedSpan>
      <AnimatedSpan delay={5000} className="text-emerald-400">
        ✓ tests · 34 passed, diff-scoped
      </AnimatedSpan>
      <AnimatedSpan delay={5500} className="text-emerald-400">
        ✓ patch applied · PR #218 opened
      </AnimatedSpan>

      <AnimatedSpan delay={6200} className="text-muted">
        agent wrote the code. the gates decided what shipped.
      </AnimatedSpan>
    </Terminal>
  );
}
