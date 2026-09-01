"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";

/**
 * Sticky contents rail. Fills the right column that the capped reading measure
 * leaves empty, and highlights the section you are currently in.
 */
export default function PostToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading currently in the upper half of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );

    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
      <p className="eyebrow">On this page</p>
      <ul className="mt-4 space-y-0.5 border-l border-line">
        {headings.map((h) => {
          const on = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l py-1.5 text-[12.5px] leading-snug transition-colors ${
                  h.level === 3 ? "pl-7" : "pl-4"
                } ${
                  on
                    ? "border-violet-400 text-fg"
                    : "border-transparent text-dim hover:text-muted"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
