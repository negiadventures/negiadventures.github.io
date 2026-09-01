export const ME = {
  name: "Anirudh Negi",
  role: "Backend & Distributed Systems Engineer",
  location: "Monmouth Junction, NJ",
  now: { label: "Now", title: "Backend Engineer", detail: "GoFundMe" },
  building: { label: "Building", title: "Negi Ventures", detail: "AI · Tech · Finance" },
  github: "https://github.com/negiadventures",
  linkedin: "https://www.linkedin.com/in/negiadventures",
  studio: "https://negiventures.com",
  lede:
    "I design the parts of a backend that are expensive to get wrong: schema and API contracts, failure semantics, and migration strategy.",
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
  gradient: string;
  shot?: string;
  live: boolean;
};

export const PROJECTS: Project[] = [
  {
    blurb:
      "One tool registry exposed six ways, so an agent and a human call the same 236 utilities",
    name: "Utilix",
    href: "https://utilix.tech",
    repo: "https://github.com/utilix-tech",
    tags: ["TypeScript", "Next.js", "MCP", "REST API", "Node SDK", "Python SDK"],
    gradient: "from-[#1e3a8a] via-[#2563eb] to-[#60a5fa]",
    shot: "/shots/utilix.webp",
    live: true,
  },
  {
    blurb:
      "Six systems that carry a job search from discovery to signed offer, with an agent behind each one",
    name: "Karyfy",
    href: "https://karyfy.com",
    tags: ["FastAPI", "React", "PostgreSQL", "OpenSearch", "Kubernetes", "Clerk"],
    gradient: "from-[#4c1d95] via-[#7c3aed] to-[#a78bfa]",
    shot: "/shots/karyfy.webp",
    live: true,
  },
  {
    blurb:
      "Live market data and a news pipeline feeding a paper trading terminal you can compete in",
    name: "PaperTrade Arena",
    href: "https://papertrade-arena.vercel.app",
    tags: ["Next.js", "Market data", "Streaming", "Postgres"],
    gradient: "from-[#065f46] via-[#059669] to-[#34d399]",
    shot: "/shots/papertrade.webp",
    live: true,
  },
  {
    blurb:
      "Grades every OpenAPI change by who it actually breaks, because request and response changes are not symmetric",
    name: "Schema Drift",
    href: "#",
    tags: ["TypeScript", "OpenAPI", "Vitest", "No backend"],
    gradient: "from-[#7f1d1d] via-[#dc2626] to-[#fb923c]",
    live: false,
  },
];

export const EXPLORING = [
  "Graph data modelling for recommendation systems",
  "Event-driven architecture and delivery guarantees",
  "Autonomous agents that ship to production safely",
  "MCP servers and LLM tool-calling design",
  "Developer experience and tooling",
];
