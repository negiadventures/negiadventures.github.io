import { BorderBeam } from "@/components/ui/border-beam";
import { Meteors } from "@/components/ui/meteors";
import { BlurFade } from "@/components/ui/blur-fade";
import { ME } from "@/lib/data";

const LINKS = [
  { label: "GitHub", href: ME.github },
  { label: "LinkedIn", href: ME.linkedin },
  { label: "Negi Ventures", href: ME.studio },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <BlurFade inView>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-10 text-center sm:p-14">
          <Meteors number={14} minDelay={0.4} maxDelay={4} className="opacity-60" />
          <p className="relative eyebrow">Get in touch</p>
          <h2 className="display mt-4 text-[2.2rem] sm:text-[2.9rem]">
            Let&rsquo;s build something that holds
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted">
            Open to backend and distributed systems work, and to anything involving
            agents that have to run in production.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line-2 px-5 py-2.5 text-[14px] font-medium transition-colors hover:bg-surface-2"
              >
                {l.label}
              </a>
            ))}
          </div>

          <BorderBeam size={160} duration={11} colorFrom="#8b7cf6" colorTo="#f472b6" />
        </div>
      </BlurFade>

      <p className="mt-10 text-center font-mono text-[11px] text-dim">
        © {new Date().getFullYear()} {ME.name}
      </p>
    </section>
  );
}
