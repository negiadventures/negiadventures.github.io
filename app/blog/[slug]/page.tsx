import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllSlugs, getPost } from "@/lib/blog";
import { ME } from "@/lib/data";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · ${ME.name}`,
    description: post.description,
    alternates: post.canonical ? { canonical: post.canonical } : undefined,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/blog" className="eyebrow transition-colors hover:text-fg">
        ← Writing
      </Link>

      <article className="mt-8">
        <header>
          <h1 className="display text-[2.1rem] leading-[1.12] sm:text-[2.7rem]">
            {post.title}
          </h1>
          <p className="mt-5 font-mono text-[11px] tracking-wide text-dim uppercase">
            {formatDate(post.date)} · {post.readingMinutes} min read
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <li
                key={t}
                className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-wide text-muted uppercase"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        <div
          className="prose prose-invert mt-12 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-violet-300 prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <footer className="mt-20 border-t border-line pt-8">
        <Link href="/blog" className="text-[14px] text-muted hover:text-fg">
          ← All writing
        </Link>
      </footer>
    </main>
  );
}
