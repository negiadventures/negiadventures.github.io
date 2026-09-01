import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ME, PHOTOS } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 wash" />
      <Particles
        className="pointer-events-none absolute inset-0"
        quantity={90}
        staticity={45}
        ease={60}
        color="#8b7cf6"
        size={0.5}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <BlurFade inView>
          <p className="eyebrow">{ME.role}</p>
        </BlurFade>

        <BlurFade inView delay={0.08}>
          <h1 className="display mt-5 text-[2.6rem] leading-[1.06] sm:text-[3.8rem] lg:text-[4.4rem]">
            {ME.headline.lead}
            <br />
            <AuroraText
              className="italic"
              colors={["#8b7cf6", "#e879f9", "#f472b6", "#60a5fa"]}
              speed={0.7}
            >
              {ME.headline.accent}
            </AuroraText>
          </h1>
        </BlurFade>

        {/* Three portraits, scattered. The centre one sits in front. */}
        <BlurFade inView delay={0.16}>
          <div className="mt-12 flex items-center justify-center">
            {PHOTOS.map((p, i) => (
              <div
                key={p.src}
                style={{
                  transform: `rotate(${p.rotate}deg) scale(${p.scale})`,
                  zIndex: p.z,
                  marginLeft: i === 0 ? 0 : "-2.2rem",
                }}
                className="relative w-[30%] max-w-[186px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_50px_-12px_rgba(0,0,0,.8)] transition-transform duration-500 hover:!scale-105 hover:!rotate-0"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={840}
                  height={1120}
                  priority={i === 1}
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </BlurFade>

        <BlurFade inView delay={0.22}>
          <p className="display mt-10 text-[2.1rem] sm:text-[2.6rem]">{ME.name}</p>
        </BlurFade>

        <BlurFade inView delay={0.28}>
          <p className="mx-auto mt-5 max-w-[58ch] text-[16px] leading-relaxed text-muted">
            {ME.lede}
          </p>
        </BlurFade>

        {/* Two status tiles, the device the reference uses to add density */}
        <BlurFade inView delay={0.32}>
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {[ME.now, ME.building].map((tile, i) => (
              <div key={tile.label} className="bg-surface px-5 py-4 text-left">
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-sm ${i === 0 ? "bg-emerald-400" : "bg-violet-400"}`}
                  />
                  <span className="eyebrow">{tile.label}</span>
                </span>
                <p className="mt-2 text-[15px] font-semibold">{tile.title}</p>
                <p className="mt-0.5 text-[13px] text-dim">{tile.detail}</p>
              </div>
            ))}
          </div>
        </BlurFade>

        <BlurFade inView delay={0.4}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#contact">
              <ShimmerButton
                background="rgba(237,236,242,1)"
                shimmerColor="#8b7cf6"
                shimmerDuration="2.6s"
                borderRadius="999px"
                className="px-6 py-3 shadow-2xl"
              >
                <span className="text-[14px] font-semibold text-bg">
                  Start a conversation
                </span>
              </ShimmerButton>
            </a>
            <a
              href="#work"
              className="rounded-full border border-line-2 px-6 py-3 text-[14px] font-medium transition-colors hover:bg-surface"
            >
              See the work
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
