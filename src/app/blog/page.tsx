import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllPostSummaries, getAllTagLabels, getFeaturedPost } from "@/lib/blog";
import { getExamplesSortedByTier } from "@/lib/examples";
import { SiteHeader } from "@/components/site-header";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume & Career Tips",
  description:
    "Expert resume and job-search playbooks to help you get shortlisted faster. Practical guides, templates, and examples for India and global-English careers.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default function BlogIndexPage() {
  const featured = getFeaturedPost();
  const summaries = getAllPostSummaries();
  const allTags = getAllTagLabels();
  const examples = getExamplesSortedByTier().slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] dark:bg-slate-950">
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
              Actionable playbooks for job seekers
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl sm:leading-[1.08]">
              Resume &amp; career{" "}
              <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-violet-400">
                intelligence
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              High-clarity guides on ATS, resume writing, profile optimization, and application strategy — designed to
              help you turn job searches into interviews.
            </p>

            <div className="mt-10 rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Start here
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li>
                  <Link
                    href="/blog/ats-friendly-resume-complete-guide"
                    className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    ATS-friendly resume (pillar)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/resume-formats-india-guide"
                    className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Resume formats for India
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="font-semibold text-slate-700 hover:underline dark:text-slate-200">
                    Pricing — PDF & Word
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/how-to-read-ats-job-match-feedback"
                    className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Reading ATS / JD match feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Post grid + filters */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8" aria-label="Blog articles">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Latest</h2>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Articles</p>
            </div>
            <Link
              href="/try"
              prefetch
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Build your resume
              <ArrowUpRight className="h-4 w-4 opacity-80" aria-hidden />
            </Link>
          </div>

          <BlogIndexClient allTags={allTags} posts={summaries} featured={featured} />
        </section>

        {/* Examples cross-link */}
        <section className="border-t border-slate-200/80 bg-white/60 py-16 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Resume examples by role</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Pair these outlines with the articles above — structure for Software Engineer, Fresher, Data Analyst,
                Marketing, and more.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {examples.map((ex) => (
                <Link
                  key={ex.slug}
                  href={`/examples/${ex.slug}`}
                  className="group rounded-2xl border border-slate-200/90 bg-[#faf9f7] p-5 transition hover:border-primary-400/50 hover:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-primary-600/40 dark:hover:bg-slate-900"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                    {ex.industry}
                  </span>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{ex.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{ex.description}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-primary-600 opacity-0 transition group-hover:opacity-100 dark:text-primary-400">
                    Open example
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/examples"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                View all resume examples
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
