import AgentRun from "@/components/AgentRun";
import CountUp from "@/components/CountUp";
import { BlurFade } from "@/components/ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { TextAnimate } from "@/components/ui/text-animate";
import { getPosts } from "@/lib/blog";
import { EXPLORING, ME, PROJECTS } from "@/lib/data";

export default function About() {
  const stats = [
    { value: PROJECTS.filter((p) => p.live).length, label: "Products live" },
    { value: getPosts().length, label: "Posts written" },
    { value: 236, label: "Utilities shipped" },
    { value: 191, label: "MCP tools" },
  ];

  return (
    <section id="about" className="border-t border-line bg-surface/30">
      <div className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
        <BlurFade inView>
          <p className="eyebrow">Know about me</p>
        </BlurFade>

        <TextAnimate
          as="h2"
          by="word"
          animation="blurInUp"
          once
          accessible={false}
          className="display mt-4 max-w-[20ch] text-[2.2rem] sm:text-[2.9rem]"
        >
          Backend engineer, and a little bit of
        </TextAnimate>

        <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <BlurFade inView>
            <div className="min-w-0">
              <p className="max-w-[64ch] text-[16px] leading-relaxed text-muted">
                {ME.lede}
              </p>
              <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-muted">
                Outside of work I architect and operate live products built
                almost entirely through agentic workflows. I own the design and
                the reliability;{" "}
                <Highlighter action="underline" color="#8b5cf6" strokeWidth={2}>
                  <span className="text-fg">the agents write most of the code</span>
                </Highlighter>
                .
              </p>
              <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-muted">
                Most of what I build starts as something that annoyed me at work:
                a migration that should have been safer, a contract that broke
                quietly, a tool that should have existed.
              </p>

              <div className="mt-9">
                <AgentRun />
              </div>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <div className="min-w-0 space-y-5">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {stats.map((s) => (
                  <div key={s.label} className="bg-surface px-5 py-5">
                    <span className="block font-mono text-[26px] leading-none font-semibold text-fg">
                      <CountUp value={s.value} />
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-tight text-dim">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="eyebrow">What I&rsquo;m exploring</p>
                <ul className="mt-5 space-y-3.5">
                  {EXPLORING.map((e) => (
                    <li
                      key={e}
                      className="flex gap-3 text-[14px] leading-snug text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400"
                      />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
