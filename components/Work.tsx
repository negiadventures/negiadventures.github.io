"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { Safari } from "@/components/ui/safari";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <BlurFade inView>
        <p className="eyebrow text-center">Selected work</p>
        <h2 className="display mt-4 text-center text-[2.2rem] sm:text-[2.9rem]">
          Things I built and run
        </h2>
      </BlurFade>

      <div className="mt-14 space-y-8">
        {PROJECTS.map((p, i) => (
          <BlurFade key={p.name} inView delay={0.06 * i}>
            <MagicCard
              gradientSize={280}
              gradientColor="#16161f"
              gradientOpacity={0.85}
              gradientFrom={p.accentFrom}
              gradientTo={p.accentTo}
              className="rounded-3xl border border-line p-0"
            >
              <div className="relative grid min-w-0 gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-6">
                    <p className="max-w-[44ch] text-[18px] leading-snug font-medium text-fg">
                      {p.blurb}
                    </p>
                    <a
                      href={p.href}
                      target={p.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.name}`}
                      className="group/arrow mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-2 text-muted transition-colors hover:border-transparent hover:bg-fg hover:text-bg"
                    >
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover/arrow:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </div>

                  {p.shot ? (
                    // Plain Safari frame. Lens magnification was tried here and
                    // removed: it overflowed the card and made the screenshot
                    // harder to read at a glance, not easier.
                    <div className="mt-8 overflow-hidden rounded-lg">
                      <Safari url={p.url} imageSrc={p.shot} className="w-full" />
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

                <div className="min-w-0 lg:pt-1">
                  <h3 className="flex flex-wrap items-center gap-2 text-[20px] font-semibold tracking-tight">
                    {p.name}
                    {p.live && (
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-emerald-300 uppercase">
                        Live
                      </span>
                    )}
                  </h3>

                  {/* Tags scroll rather than wrap into four ragged rows */}
                  <div className="relative mt-5 w-full min-w-0 overflow-hidden lg:mt-4">
                    <Marquee pauseOnHover className="[--duration:26s] [--gap:0.5rem]">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-muted uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent" />
                  </div>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
