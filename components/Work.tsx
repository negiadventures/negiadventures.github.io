"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { BorderBeam } from "@/components/ui/border-beam";
import { Lens } from "@/components/ui/lens";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { Safari } from "@/components/ui/safari";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <BlurFade inView>
        <p className="eyebrow text-center">Selected work</p>
        <TextAnimate
          as="h2"
          by="word"
          animation="blurInUp"
          once
          accessible={false}
          className="display mt-4 text-center text-[2.2rem] sm:text-[2.9rem]"
        >
          Things I built and run
        </TextAnimate>
      </BlurFade>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <BlurFade key={p.name} inView delay={0.06 * i}>
            <MagicCard
              gradientSize={280}
              gradientColor="#16161f"
              gradientOpacity={0.85}
              gradientFrom={p.accentFrom}
              gradientTo={p.accentTo}
              className="h-full rounded-2xl border border-line p-0"
            >
              <div className="flex h-full min-w-0 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3">
                    <p className="min-w-0 flex-1 text-[15px] leading-snug font-medium text-fg">
                      {p.blurb}
                    </p>
                    <div className="flex shrink-0 items-center gap-3">
                    <h3 className="flex items-center gap-2 text-[16px] font-semibold tracking-tight">
                      {p.name}
                      {p.live && (
                        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-emerald-300 uppercase">
                          Live
                        </span>
                      )}
                    </h3>
                    <a
                      href={p.href}
                      target={p.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.name}`}
                      className="group/arrow mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-muted transition-colors hover:border-transparent hover:bg-fg hover:text-bg"
                    >
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover/arrow:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                    </div>
                  </div>

                  {p.shot ? (
                    // Hover magnifies the screenshot so dense product UI is
                    // actually readable. Needs min-w-0 on the grid parents or
                    // the frame blows the card out and the zoom looks broken.
                    <div className="mt-5 w-full min-w-0 overflow-hidden rounded-lg">
                      <Lens zoomFactor={1.8} lensSize={170}>
                        <Safari url={p.url} imageSrc={p.shot} className="w-full" />
                      </Lens>
                    </div>
                  ) : (
                    <div className="relative mt-8 overflow-hidden rounded-xl border border-line bg-surface px-5 py-8 text-center">
                      <p className="font-mono text-[12px] tracking-wide text-dim uppercase">
                        In development
                      </p>
                      <BorderBeam size={90} duration={8} colorFrom={p.accentFrom} colorTo={p.accentTo} />
                    </div>
                  )}
                </div>

                {/* Tags run full width under the shot instead of stacking in
                    a narrow rail beside it. */}
                <div className="relative mt-auto w-full min-w-0 overflow-hidden pt-5">
                  <Marquee pauseOnHover className="[--duration:30s] [--gap:0.5rem]">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-muted uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </Marquee>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg to-transparent" />
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
