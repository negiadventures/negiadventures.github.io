import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { formatDate, getPosts } from "@/lib/blog";

export default function Writing() {
  const posts = getPosts();
  const recent = posts.slice(0, 3);

  return (
    <section id="writing" className="relative overflow-hidden border-t border-line">
      <AnimatedGridPattern
        numSquares={26}
        maxOpacity={0.06}
        duration={3.2}
        className={cn(
          "pointer-events-none absolute inset-0 h-full skew-y-6 fill-violet-400/25 stroke-violet-400/15",
          "[mask-image:radial-gradient(420px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
        <BlurFade inView>
          <p className="eyebrow text-center">From the desk</p>
          <TextAnimate
            as="h2"
            by="word"
            animation="blurInUp"
            once
            accessible={false}
            className="display mt-4 text-center text-[2.2rem] sm:text-[2.9rem]"
          >
            Thoughts &amp;
          </TextAnimate>
          <p className="mx-auto mt-4 max-w-[52ch] text-center text-[15px] leading-relaxed text-muted">
            {posts.length} posts on running AI coding agents in production. Guardrails,
            evaluation, MCP, and the things that break at 3am.
          </p>
        </BlurFade>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {recent.map((p, i) => (
            <BlurFade key={p.slug} inView delay={0.07 * i} className="min-w-0">
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-2"
              >
                <p className="font-mono text-[10px] tracking-wide text-dim uppercase">
                  {formatDate(p.date)} · {p.readingMinutes} min
                </p>
                <h3 className="mt-3 text-[16px] leading-snug font-semibold tracking-[-0.01em] transition-colors group-hover:text-violet-300">
                  {p.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-muted">
                  {p.description}
                </p>
                <p className="mt-4 font-mono text-[10px] tracking-wide text-dim uppercase">
                  {p.tags.slice(0, 2).join(" · ")}
                </p>
              </Link>
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.24}>
          <p className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-[14px] font-medium transition-colors hover:bg-surface"
            >
              Read all {posts.length} posts <span aria-hidden>→</span>
            </Link>
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
