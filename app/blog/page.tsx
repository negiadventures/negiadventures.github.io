import type { Metadata } from "next";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import BlogBrowser from "@/components/BlogBrowser";
import { getAllTags, getPosts } from "@/lib/blog";
import { ME } from "@/lib/data";

export const metadata: Metadata = {
  title: `Writing · ${ME.name}`,
  description:
    "Notes on running AI coding agents in production: reliability, guardrails, MCP, evaluation and developer workflow.",
};

export default function BlogIndex() {
  const posts = getPosts();
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <BlurFade inView>
        <Link href="/" className="eyebrow transition-colors hover:text-fg">
          ← {ME.name}
        </Link>
        <h1 className="display mt-6 text-[2.6rem] sm:text-[3.4rem]">Writing</h1>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
          {posts.length} posts on running AI coding agents in production: reliability,
          guardrails, MCP, evaluation and the workflow around them.
        </p>

      </BlurFade>

      <BlogBrowser posts={posts} tags={tags} />
    </main>
  );
}
