// Phase 2 — SSR public resume page with rich link previews + dynamic OG.
// Converted from client to server component so WhatsApp / LinkedIn / Slack /
// iMessage render rich previews when the link is shared. Renders fresh on
// every request because the share-link USP is "always shows the latest".
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import type { ResumeSection } from "@/types/resume";

interface Props {
  params: { slug: string };
}

interface ResumeContent {
  sections?: ResumeSection[];
  meta?: Record<string, unknown>;
}

interface ResumeRow {
  id: string;
  title: string;
  templateId: string;
  content: ResumeContent | null;
  updatedAt: Date;
}

async function getResumeBySlug(slug: string): Promise<ResumeRow | null> {
  const trimmed = slug?.trim();
  if (!trimmed) return null;
  try {
    const resume = await prisma.resume.findUnique({
      where: { publicSlug: trimmed },
      select: {
        id: true,
        title: true,
        templateId: true,
        content: true,
        updatedAt: true,
      },
    });
    return (resume as unknown as ResumeRow | null) ?? null;
  } catch {
    return null;
  }
}

interface ExtractedMeta {
  name: string;
  headline: string | null;
  location: string | null;
  summary: string | null;
}

function extractMeta(resume: ResumeRow): ExtractedMeta {
  const sections = resume.content?.sections ?? [];
  const contact = sections.find((s) => s.type === "contact");
  const summarySection = sections.find(
    (s) => s.type === "summary" || s.type === "objective"
  );

  let name = resume.title?.trim() || "Resume";
  let headline: string | null = null;
  let location: string | null = null;
  let summary: string | null = null;

  if (contact && contact.type === "contact") {
    name = contact.data.name?.trim() || name;
    headline = contact.data.title?.trim() || null;
    location = contact.data.location?.trim() || null;
  }
  if (
    summarySection &&
    (summarySection.type === "summary" || summarySection.type === "objective")
  ) {
    const text = summarySection.data.text?.trim();
    summary = text ? text : null;
  }
  return { name, headline, location, summary };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resume = await getResumeBySlug(params.slug);
  if (!resume) {
    return {
      title: "Resume not found | ResumeDoctor",
      robots: { index: false, follow: false },
    };
  }
  const { name, headline, location, summary } = extractMeta(resume);
  const titleSuffix = headline ? ` · ${headline}` : "";
  const title = `${name}${titleSuffix} | ResumeDoctor`;

  // Strip markdown / excessive whitespace, cap to ~200 chars for a tidy preview.
  const summaryText = summary
    ? summary.replace(/\s+/g, " ").trim().slice(0, 200)
    : null;
  const description =
    summaryText ||
    `${name}${headline ? ` — ${headline}` : ""}${location ? ` · ${location}` : ""}. View the live resume on ResumeDoctor — always up to date.`;

  const url = `${siteUrl}/r/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Privacy-safe default: shareable link, but not indexed by Google.
    // Resumes carry PII (name, email, phone). Owners can share intentionally;
    // we should not surface them in public search results.
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "ResumeDoctor",
      // The auto-detected opengraph-image.tsx in this folder supplies the image.
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Always render fresh — the share-link promise is "always up to date".
export const dynamic = "force-dynamic";

export default async function PublicResumePage({ params }: Props) {
  const resume = await getResumeBySlug(params.slug);
  if (!resume) {
    notFound();
  }

  const sections = resume.content?.sections ?? [];
  const meta = resume.content?.meta ?? {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <SiteHeader variant="app" maxWidth="4xl" />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 py-8 px-4 overflow-auto outline-none"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <ResumePreview
              sections={sections}
              templateId={resume.templateId}
              primaryColor={meta.primaryColor as string | undefined}
              fontFamily={meta.fontFamily as "sans" | "serif" | "mono" | undefined}
              fontSize={meta.fontSize as "small" | "normal" | "large" | undefined}
              spacing={
                meta.spacing as "compact" | "normal" | "spacious" | undefined
              }
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-slate-500">
            <span>
              Created with{" "}
              <Link
                href="/"
                className="font-medium text-primary-600 hover:underline"
              >
                ResumeDoctor
              </Link>
            </span>
            <span aria-hidden>·</span>
            <Link
              href="/resume-link"
              className="font-medium text-primary-600 hover:underline"
            >
              Get your own resume link
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
