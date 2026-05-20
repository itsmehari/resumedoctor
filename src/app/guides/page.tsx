import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getAllPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resume Guides — Tips for India Job Seekers | ResumeDoctor",
  description:
    "Free resume and CV guides: ATS-friendly formatting, fresher CVs, Naukri and LinkedIn tips, exports, and interview prep. India-first advice from ResumeDoctor.",
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: {
    title: "Resume Guides — ResumeDoctor",
    description: "Curated guides to build, tailor, and share your resume in India.",
    url: `${siteUrl}/guides`,
    type: "website",
    siteName: "ResumeDoctor",
  },
};

const PILLARS: { label: string; tags: string[] }[] = [
  { label: "ATS & formatting", tags: ["ats", "formatting", "resume"] },
  { label: "Freshers & campus", tags: ["fresher", "campus", "cv"] },
  { label: "Portals & applying", tags: ["naukri", "linkedin", "job-search"] },
  { label: "Export & tools", tags: ["export", "pdf", "tools"] },
];

export default function GuidesPage() {
  const posts = getAllPosts();

  const featured = posts.filter((p) => p.featured).slice(0, 4);
  const featuredSlugs = new Set(featured.map((p) => p.slug));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Guides", url: `${siteUrl}/guides` },
        ]}
      />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Resume guides
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Practical articles for Indian job seekers—ATS, freshers, portals, and exports. Then build yours in minutes.
            </p>
            <Link
              href="/try"
              className="mt-8 inline-block rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-accent-dark hover:bg-accent-hover"
            >
              Build my resume — Try
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          {featured.length > 0 && (
            <section className="mb-14">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {featured.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-700"
                    >
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {post.readTime} min read
                      </span>
                      <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {post.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {PILLARS.map((pillar) => {
            const matched = posts.filter(
              (p) =>
                !featuredSlugs.has(p.slug) &&
                p.tags.some((t) => pillar.tags.some((pt) => t.includes(pt) || pt.includes(t)))
            );
            if (matched.length === 0) return null;

            return (
              <section key={pillar.label} className="mb-12">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{pillar.label}</h2>
                <ul className="mt-4 space-y-3">
                  {matched.slice(0, 8).map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                          {post.title}
                        </span>
                        <span className="text-xs text-slate-500">{post.readTime} min</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-white">All articles</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse the full blog archive with search and tags.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              Open blog →
            </Link>
          </section>

          <p className="mt-10 text-center text-sm text-slate-500">
            Product help:{" "}
            <Link href="/faq" className="text-primary-600 hover:underline dark:text-primary-400">
              FAQ
            </Link>{" "}
            ·{" "}
            <Link href="/ats-resume-checker" className="text-primary-600 hover:underline dark:text-primary-400">
              ATS checker
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
