/**
 * Blog articles – expertise content for GEO/AEO.
 * Content is loaded from content/blog/*.md (MDX-compatible body).
 */
import matter from "gray-matter";
import fs from "fs";
import path from "path";

export interface FaqItem {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** ISO date — shown when present */
  updated?: string;
  author: string;
  authorBio?: string;
  /** Path under public/, e.g. /avatars/author.png */
  authorImage?: string;
  readTime: number;
  content: string;
  /** Path under public/, e.g. /blog/covers/ats.webp */
  coverImage?: string;
  /** Override OG/Twitter image when set */
  ogImage?: string;
  featured?: boolean;
  tags: string[];
  /** Short label for hero metadata, e.g. "Resume Guide" */
  contentCategory?: string;
  faq?: FaqItem[];
}

export type BlogPostSummary = Pick<
  BlogPost,
  "slug" | "title" | "description" | "date" | "readTime" | "tags" | "coverImage" | "featured" | "updated"
>;

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function normalizeFaq(raw: unknown): FaqItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: FaqItem[] = [];
  for (const row of raw) {
    if (row && typeof row === "object" && "q" in row && "a" in row) {
      const q = String((row as { q: string }).q).trim();
      const a = String((row as { a: string }).a).trim();
      if (q && a) out.push({ q, a });
    }
  }
  return out.length ? out : undefined;
}

function loadPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    updated: typeof data.updated === "string" ? data.updated : undefined,
    author: data.author ?? "ResumeDoctor",
    authorBio: typeof data.authorBio === "string" ? data.authorBio : undefined,
    authorImage: typeof data.authorImage === "string" ? data.authorImage : undefined,
    readTime: typeof data.readTime === "number" ? data.readTime : 5,
    content: content.trim(),
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    featured: Boolean(data.featured),
    tags: normalizeTags(data.tags),
    contentCategory: typeof data.contentCategory === "string" ? data.contentCategory : undefined,
    faq: normalizeFaq(data.faq),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => loadPost(f.replace(/\.md$/, "")))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getAllPostSummaries(): BlogPostSummary[] {
  return getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    readTime: p.readTime,
    tags: p.tags,
    coverImage: p.coverImage,
    featured: p.featured,
    updated: p.updated,
  }));
}

/** Featured post: explicit `featured: true`, else first by date. */
export function getFeaturedPost(): BlogPost | null {
  const posts = getAllPosts();
  const f = posts.find((p) => p.featured);
  if (f) return f;
  return posts[0] ?? null;
}

export function getPostsExcludingFeatured(): BlogPost[] {
  const featured = getFeaturedPost();
  if (!featured) return getAllPosts();
  return getAllPosts().filter((p) => p.slug !== featured.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return loadPost(slug);
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllTagLabels(): string[] {
  const set = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) set.add(t);
  }
  return Array.from(set).sort();
}
