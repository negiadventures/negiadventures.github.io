"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/lib/blog";

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Search and tag filtering, entirely client-side. 100 posts of metadata is
 * a few tens of KB, so shipping it beats standing up an index for a static site.
 */
export default function BlogBrowser({
  posts,
  tags,
}: {
  posts: Post[];
  tags: { tag: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  // ~200 tags is a wall. Show the ones that actually cluster the archive, keep
  // any selected tag visible, and hide the long tail behind an expander.
  const TOP_N = 12;
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && typing) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    return posts.filter((p) => {
      if (active.length && !active.every((t) => p.tags.includes(t))) return false;
      if (!terms.length) return true;
      const hay = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      // Every term must appear somewhere, so multi-word queries narrow.
      return terms.every((t) => hay.includes(t));
    });
  }, [posts, query, active]);

  const visibleTags = useMemo(() => {
    if (showAllTags) return tags;
    const top = tags.slice(0, TOP_N);
    const selectedOutside = tags.filter(
      (t) => active.includes(t.tag) && !top.some((x) => x.tag === t.tag)
    );
    return [...top, ...selectedOutside];
  }, [tags, showAllTags, active]);

  const hiddenCount = tags.length - visibleTags.length;

  const toggle = (tag: string) =>
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clear = () => {
    setQuery("");
    setActive([]);
  };

  const filtering = query.trim() !== "" || active.length > 0;

  return (
    <>
      <div className="mt-8">
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-1/2 left-4 -translate-y-1/2 text-dim"
          >
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full rounded-xl border border-line bg-surface py-3 pr-20 pl-10 text-[15px] text-fg transition-colors placeholder:text-dim hover:border-line-2 focus:border-violet-400 focus:outline-none"
          />
          <kbd className="absolute top-1/2 right-4 -translate-y-1/2 rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-dim">
            /
          </kbd>
        </div>

        <ul className="mt-4 flex flex-wrap items-center gap-1.5">
          {visibleTags.map((t) => {
            const on = active.includes(t.tag);
            return (
              <li key={t.tag}>
                <button
                  onClick={() => toggle(t.tag)}
                  aria-pressed={on}
                  className={`rounded-md border px-2 py-1 font-mono text-[10px] tracking-wide uppercase transition-colors ${
                    on
                      ? "border-violet-400 bg-violet-400/15 text-fg"
                      : "border-line bg-surface text-muted hover:border-line-2 hover:text-fg"
                  }`}
                >
                  {t.tag} <span className={on ? "text-violet-300" : "text-dim"}>{t.count}</span>
                </button>
              </li>
            );
          })}

          {hiddenCount > 0 && (
            <li>
              <button
                onClick={() => setShowAllTags((v) => !v)}
                className="rounded-md border border-dashed border-line-2 px-2 py-1 font-mono text-[10px] tracking-wide text-dim uppercase transition-colors hover:text-fg"
              >
                {showAllTags ? "show less" : `+${hiddenCount} more`}
              </button>
            </li>
          )}
        </ul>

        <div className="mt-5 flex items-center gap-4">
          <p aria-live="polite" className="font-mono text-[11px] text-dim">
            {results.length} {results.length === 1 ? "post" : "posts"}
            {filtering ? ` of ${posts.length}` : ""}
          </p>
          {filtering && (
            <button
              onClick={clear}
              className="font-mono text-[11px] text-violet-300 underline underline-offset-2 hover:text-fg"
            >
              clear filters
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-muted">
          Nothing matches that. <button onClick={clear} className="text-violet-300 underline underline-offset-2">Clear filters</button>
        </p>
      ) : (
        <ul className="mt-10 space-y-1">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-xl border border-transparent px-4 py-5 transition-colors hover:border-line hover:bg-surface/60"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] transition-colors group-hover:text-violet-300">
                    {p.title}
                  </h2>
                  <span className="shrink-0 font-mono text-[11px] whitespace-nowrap text-dim">
                    {formatDate(p.date)}
                  </span>
                </div>
                <p className="mt-2 max-w-[78ch] text-[14px] leading-relaxed text-muted">
                  {p.description}
                </p>
                <p className="mt-2.5 font-mono text-[10px] tracking-wide text-dim uppercase">
                  {p.readingMinutes} min · {p.tags.slice(0, 3).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
