import { BlurFade } from "@/components/ui/blur-fade";
import { EXPLORING, ME } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-surface/30">
      <div className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <BlurFade inView>
            <div>
              <p className="eyebrow">Know about me</p>
              <h2 className="display mt-4 max-w-[18ch] text-[2.2rem] sm:text-[2.9rem]">
                Backend engineer, and a little bit of
              </h2>
              <p className="mt-7 max-w-[62ch] text-[16px] leading-relaxed text-muted">
                {ME.lede}
              </p>
              <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-muted">
                {ME.sub}
              </p>
              <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-muted">
                Most of what I build starts as something that annoyed me at work: a
                migration that should have been safer, a contract that broke quietly,
                a tool that should have existed.
              </p>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="eyebrow">What I&rsquo;m exploring</p>
              <ul className="mt-5 space-y-3.5">
                {EXPLORING.map((e) => (
                  <li key={e} className="flex gap-3 text-[14px] leading-snug text-muted">
                    <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
