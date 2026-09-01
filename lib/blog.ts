import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "blog");

/**
 * The old Jekyll site served four posts at a short URL as standalone HTML,
 * while the markdown source carries a longer filename. The sitemap points at
 * the short form, so both must keep resolving or those URLs 404.
 * Key = short alias in the sitemap, value = the markdown slug.
 */
export const SLUG_ALIASES: Record<string, string> = {
  "ai-tutor": "ai-tutor-ai-assisted-development",
  gamehub: "gamehub-ai-assisted-development",
  "mortgage-atlas": "mortgage-atlas-ai-assisted-development",
  "stock-analysis": "stock-analysis-ai-assisted-development",
};

/** Every slug that must produce a page, canonical plus alias. */
export function getAllSlugs(): string[] {
  return [...getPosts().map((p) => p.slug), ...Object.keys(SLUG_ALIASES)];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  /** Frontmatter `image`, usually an inline SVG data URI. */
  image?: string;
  canonical?: string;
  readingMinutes: number;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface FullPost extends Post {
  html: string;
  headings: Heading[];
}

function toTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function toDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v ?? "");
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s.slice(0, 10) : d.toISOString().slice(0, 10);
}

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

let cache: Post[] | null = null;

export function getPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return [];

  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? file),
        description: String(data.description ?? data.meta_description ?? ""),
        date: toDate(data.date),
        tags: toTags(data.tags),
        image: typeof data.image === "string" ? data.image : undefined,
        canonical: typeof data.canonical === "string" ? data.canonical : undefined,
        readingMinutes: readingMinutes(content),
      };
    })
    // Newest first.
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return cache;
}

export function getPost(slug: string): FullPost | null {
  const resolved = SLUG_ALIASES[slug] ?? slug;
  const file = path.join(DIR, `${resolved}.md`);
  if (!fs.existsSync(file)) return null;

  const meta = getPosts().find((p) => p.slug === resolved);
  if (!meta) return null;

  const { content } = matter(fs.readFileSync(file, "utf8"));

  // The markdown starts with an H1 that duplicates the frontmatter title,
  // which the page renders itself. Drop the first one so it isn't shown twice.
  let body = content.replace(/^\s*#\s+.+\n/, "");

  body = stripAuthoringNotes(body);

  marked.setOptions({ gfm: true, breaks: false });
  let html = marked.parse(body) as string;

  // Give every h2/h3 a stable id so the sidebar can link to it, and collect
  // them for the table of contents.
  const headings: Heading[] = [];
  const used = new Set<string>();
  html = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, lvl: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60);
      if (!id) id = `section-${headings.length + 1}`;
      let unique = id;
      let n = 2;
      while (used.has(unique)) unique = `${id}-${n++}`;
      used.add(unique);
      headings.push({ id: unique, text, level: Number(lvl) as 2 | 3 });
      return `<h${lvl} id="${unique}">${inner}</h${lvl}>`;
    }
  );

  return { ...meta, html, headings };
}

/**
 * Several posts carry leftover authoring scaffolding: hero image ideas,
 * diagram ideas, suggested code sections, a duplicate meta description. The old
 * Jekyll output never rendered any of it, so stripping keeps parity instead of
 * publishing internal notes for the first time.
 *
 * It appears in at least six shapes across the corpus ("## Visual plan",
 * "## Internal visual plan", "**Visual plan**", "Visual plan for this post:",
 * "Here is the visual plan I used...", bare "Visual plan"), so rather than
 * chase each variant we match the structure: a short line mentioning a visual
 * plan, followed by the bullet list it introduces.
 */
function stripAuthoringNotes(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  // Strip any leading blockquote markers: one variant wraps the whole block
  // in "> " which would otherwise hide it from both tests below.
  const deQuote = (l: string) => l.replace(/^[ \t]*(?:>[ \t]?)+/, "");
  const isBullet = (l: string) => /^[ \t]*[-*][ \t]+\S/.test(deQuote(l));
  const isPlanLabel = (l: string) => {
    const bare = deQuote(l).replace(/^#{1,6}[ \t]*/, "").replace(/\*\*/g, "").trim();
    return bare.length <= 120 && /visual plan/i.test(bare);
  };

  for (let i = 0; i < lines.length; i++) {
    if (isPlanLabel(lines[i])) {
      // Look ahead past blank lines for the bullet list it introduces.
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      let bullets = 0;
      while (j < lines.length && (isBullet(lines[j]) || deQuote(lines[j]).trim() === "")) {
        if (isBullet(lines[j])) bullets++;
        j++;
      }
      // Only treat it as scaffolding when a real list follows.
      if (bullets >= 2) {
        i = j - 1;
        continue;
      }
    }
    out.push(lines[i]);
  }

  return out
    .join("\n")
    // Any planning bullet that survived on its own.
    .replace(
      /^[ \t]*[-*][ \t]*\*{0,2}(?:hero(?: image)?(?: idea)?|architecture(?: or)?(?: diagram| workflow)?(?: idea)?|diagram(?: idea)?|optional [a-z- ]*idea|optional comparison table|terminal visual(?: idea)?|suggested code sections|meta description|tags)\*{0,2}[ \t]*:[^\n]*\n?/gim,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getPosts()) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
