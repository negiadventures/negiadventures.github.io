import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <BlurFade inView>
        <p className="eyebrow text-center">Selected work</p>
        <h2 className="display mt-4 text-center text-[2.2rem] sm:text-[2.9rem]">
          Things I built and run
        </h2>
      </BlurFade>

      <div className="mt-14 space-y-8">
        {PROJECTS.map((p, i) => (
          <BlurFade key={p.name} inView delay={0.06 * i}>
            <a
              href={p.href}
              target={p.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start"
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:p-8 ${p.gradient}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <p className="max-w-[46ch] text-[17px] leading-snug font-medium text-white/95">
                    {p.blurb}
                  </p>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>

                {p.shot ? (
                  <div className="mt-7 overflow-hidden rounded-t-xl border-t border-r border-l border-white/20 shadow-2xl">
                    <Image
                      src={p.shot}
                      alt={`${p.name} interface`}
                      width={760}
                      height={475}
                      className="block w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <p className="mt-7 rounded-lg border border-white/25 bg-black/20 px-4 py-3 font-mono text-[12px] text-white/80">
                    In development
                  </p>
                )}
              </div>

              <div className="lg:pt-2">
                <h3 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight">
                  {p.name}
                  {p.live && (
                    <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-emerald-300 uppercase">
                      Live
                    </span>
                  )}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-wide text-muted uppercase"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
