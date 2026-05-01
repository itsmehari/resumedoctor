import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllExamples } from "@/lib/examples";
import { getAllPosts } from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { ExamplesItemListJsonLd } from "@/components/seo/json-ld";
import { ArrowUpRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Examples by Role – India",
  description:
    "Resume examples for Software Engineer, Fresher, Data Analyst, Marketing, BPO, and more. Structure and tips for Indian job applications.",
  alternates: { canonical: `${siteUrl}/examples` },
};

export default function ExamplesIndexPage() {
  const examples = getAllExamples();
  const recentPosts = getAllPosts().slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] dark:bg-slate-950">
      <ExamplesItemListJsonLd
        examples={examples.map((e) => ({ slug: e.slug, title: e.title, description: e.description }))}
      />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <div
            className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-600/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-600/10"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <Layers className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
              Outlines for Indian roles
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Resume examples{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-primary-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-primary-400">
                by role
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Use these as structural references — section order, tone, and what recruiters scan first — then build your
              own version in the builder.
            </p>
            <div className="mt-8">
              <Link
                href="/try"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Open the builder
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8" aria-label="Resume examples list">
          <ul className="grid gap-5 sm:grid-cols-2">
            {examples.map((ex) => (
              <li key={ex.slug}>
                <Link
                  href={`/examples/${ex.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-800/40 sm:p-7"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {ex.industry}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-emerald-800 dark:text-slate-50 dark:group-hover:text-emerald-300">
                    {ex.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{ex.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                    Read outline
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-slate-200/80 bg-white/70 py-14 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">From our blog</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600 dark:text-slate-400">
              Deep dives on ATS, formats, and interviews — written to pair with these outlines.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-slate-200/90 bg-[#faf9f7] p-5 transition hover:border-primary-300/60 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-primary-700/50 dark:hover:bg-slate-900"
                  >
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{post.title}</span>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{post.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                All articles
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </p>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 px-4 py-12 text-sm sm:px-6 lg:px-8">
          <Link href="/templates" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Templates
          </Link>
          <Link href="/pricing" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Pricing — export PDF & Word
          </Link>
          <Link href="/blog" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
            Blog
          </Link>
          <Link href="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
