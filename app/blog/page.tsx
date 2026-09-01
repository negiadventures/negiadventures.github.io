import type { Metadata } from "next";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { formatDate, getAllTags, getPosts } from "@/lib/blog";
import { ME } from "@/lib/data";

export const metadata: Metadata = {
  title: `Writing · ${ME.name}`,
  description:
    "Notes on running AI coding agents in production: reliability, guardrails, MCP, evaluation and developer workflow.",
};

export default function BlogIndex() {
  const posts = getPosts();
  const tags = getAllTags().slice(0, 14);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <BlurFade inView>
        <Link href="/" className="eyebrow transition-colors hover:text-fg">
          ← {ME.name}
        </Link>
        <h1 className="display mt-6 text-[2.6rem] sm:text-[3.4rem]">Writing</h1>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
          {posts.length} posts on running AI coding agents in production: reliability,
          guardrails, MCP, evaluation and the workflow around them.
        </p>

        <ul className="mt-8 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li
              key={t.tag}
              className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-wide text-muted uppercase"
            >
              {t.tag} <span className="text-dim">{t.count}</span>
            </li>
          ))}
        </ul>
      </BlurFade>

      <ul className="mt-14 space-y-1">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <BlurFade inView delay={Math.min(i, 8) * 0.03}>
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
                <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-muted">
                  {p.description}
                </p>
                <p className="mt-2.5 font-mono text-[10px] tracking-wide text-dim uppercase">
                  {p.readingMinutes} min · {p.tags.slice(0, 3).join(" · ")}
                </p>
              </Link>
            </BlurFade>
          </li>
        ))}
      </ul>
    </main>
  );
}
