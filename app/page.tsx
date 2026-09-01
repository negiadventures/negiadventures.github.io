import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Writing from "@/components/Writing";

export default function Page() {
  return (
    <main id="main" className="relative">
      {/* Hatched edges, the texture from the reference */}
      <div aria-hidden className="hatch pointer-events-none fixed inset-y-0 left-0 z-0 w-6 sm:w-10" />
      <div aria-hidden className="hatch pointer-events-none fixed inset-y-0 right-0 z-0 w-6 sm:w-10" />
      <div className="relative z-10">
        <Hero />
        <Work />
        <Writing />
        <About />
        <Contact />
      </div>
    </main>
  );
}
