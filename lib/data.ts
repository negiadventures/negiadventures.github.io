export const ME = {
  name: "Anirudh Negi",
  role: "AI Systems & Backend Engineer",
  now: { label: "Now", title: "Backend Engineer", detail: "GoFundMe" },
  headline: { lead: "Agents that ship.", accent: "Backends that hold." },
  building: { label: "Building", title: "Negi Ventures", detail: "AI · Tech · Finance" },
  github: "https://github.com/negiadventures",
  linkedin: "https://www.linkedin.com/in/negiadventures",
  studio: "https://negiventures.com",
  lede:
    "I build the parts of an AI system that are expensive to get wrong: tool contracts, failure semantics, and the guardrails that let agents ship to production safely.",
  sub:
    "Outside of work I architect and operate live products built almost entirely through agentic AI workflows. I own the design and the reliability; the agents write most of the code.",
};

export const PHOTOS = [
  { src: "/photos/me-3.webp", alt: "Anirudh outdoors", rotate: -7, z: 10, scale: 0.92 },
  { src: "/photos/me-2.webp", alt: "Anirudh in the city at golden hour", rotate: 2, z: 30, scale: 1 },
  { src: "/photos/me-1.webp", alt: "Anirudh in a studio portrait", rotate: 7, z: 20, scale: 0.92 },
];

export type Project = {
  /** Led by what it does, never the name. */
  blurb: string;
  name: string;
  href: string;
  repo?: string;
  tags: string[];
  /** Spotlight colours for the MagicCard border, not a flat fill. */
  accentFrom: string;
  accentTo: string;
  /** Shown in the Safari frame's address bar. */
  url: string;
  shot?: string;
  live: boolean;
  /**
   * Maturity, alongside the live pill. Utilix and Karyfy carry nothing: they
   * are finished products. The rest are honest about being early.
   */
  stage?: "Beta" | "Labs";
};

export const PROJECTS: Project[] = [
  {
    blurb:
      "One tool registry exposed six ways, so an agent and a human call the same 236 utilities",
    name: "Utilix",
    href: "https://utilix.tech",
    repo: "https://github.com/utilix-tech",
    tags: ["TypeScript", "Next.js", "MCP", "REST API", "Node SDK", "Python SDK"],
    accentFrom: "#4c8dff",
    accentTo: "#22d3ee",
    url: "utilix.tech",
    shot: "/shots/utilix.webp",
    live: true,
  },
  {
    blurb:
      "Six systems that carry a job search from discovery to signed offer, with an agent behind each one",
    name: "Karyfy",
    href: "https://karyfy.com",
    tags: ["FastAPI", "React", "PostgreSQL", "OpenSearch", "Kubernetes", "Clerk"],
    accentFrom: "#8b5cf6",
    accentTo: "#e879f9",
    url: "karyfy.com",
    shot: "/shots/karyfy.webp",
    live: true,
  },
  {
    blurb:
      "Live market data and a news pipeline feeding a paper trading terminal you can compete in",
    name: "PaperTrade Arena",
    href: "https://papertrade-arena.vercel.app",
    tags: ["Next.js", "Market data", "Streaming", "Postgres"],
    accentFrom: "#10b981",
    accentTo: "#34d399",
    url: "papertrade-arena.vercel.app",
    shot: "/shots/papertrade.webp",
    live: true,
    stage: "Beta",
  },
  {
    blurb:
      "Grades every OpenAPI change by who it actually breaks, because request and response changes are not symmetric",
    name: "Schema Drift",
    href: "https://schemadrift.negiventures.com",
    tags: ["TypeScript", "OpenAPI", "Vitest", "No backend"],
    accentFrom: "#f472b6",
    accentTo: "#fb923c",
    url: "schemadrift.negiventures.com",
    shot: "/shots/schemadrift.webp",
    live: true,
    stage: "Labs",
  },
  {
    blurb:
      "Replays agent runs as traces so you can see where the tokens, the retries and the human approvals actually went",
    name: "Agent Ops",
    href: "https://agentops.negiventures.com",
    tags: ["TypeScript", "Observability", "Vitest", "No backend"],
    accentFrom: "#7c9eff",
    accentTo: "#3ddc97",
    url: "agentops.negiventures.com",
    shot: "/shots/agentops.webp",
    live: true,
    stage: "Labs",
  },
  {
    blurb:
      "Checks any small-business site for the handful of things that decide whether customers can find it and contact it",
    name: "Local SEO Audit",
    href: "https://localseo.negiventures.com",
    tags: ["Next.js", "SEO", "Vitest", "Live fetch"],
    accentFrom: "#f59e0b",
    accentTo: "#fbbf24",
    url: "localseo.negiventures.com",
    shot: "/shots/localseo.webp",
    live: true,
    stage: "Labs",
  },
  {
    blurb:
      "Compares a 30 and a 15 year loan on what most calculators leave out: the deposit as money spent, PMI ending at 80% LTV, and costs that grow",
    name: "Mortgage Atlas",
    href: "https://mortgage.negiventures.com",
    tags: ["React", "Amortisation", "Vitest", "No backend"],
    accentFrom: "#0ea5e9",
    accentTo: "#22d3ee",
    url: "mortgage.negiventures.com",
    shot: "/shots/mortgage.webp",
    live: true,
    stage: "Labs",
  },
  {
    blurb:
      "Twenty-seven instruments synthesised in the browser and locked to one key, recorded into loops and arranged into a song you can download",
    name: "Thrum",
    href: "https://thrum.negiventures.com",
    tags: ["Web Audio", "DSP", "Vitest", "No backend"],
    accentFrom: "#e0a33d",
    accentTo: "#f5d491",
    url: "thrum.negiventures.com",
    shot: "/shots/thrum.webp",
    live: true,
    stage: "Labs",
  },
];

export const EXPLORING = [
  "Graph data modelling for recommendation systems",
  "Event-driven architecture and delivery guarantees",
  "Autonomous agents that ship to production safely",
  "MCP servers and LLM tool-calling design",
  "Developer experience and tooling",
];
