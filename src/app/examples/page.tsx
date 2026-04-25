import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllExamples } from "@/lib/examples";
import { getAllPosts } from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { ExamplesItemListJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Resume Examples by Role – India",
  description:
    "Free resume examples for Software Engineer, Fresher, Data Analyst, Marketing, BPO, and more. Structure and tips for Indian job applications.",
  alternates: { canonical: `${siteUrl}/examples` },
};

export default function ExamplesIndexPage() {
  const examples = getAllExamples();
  const recentPosts = getAllPosts().slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <ExamplesItemListJsonLd
        examples={examples.map((e) => ({ slug: e.slug, title: e.title, description: e.description }))}
      />
      <SiteHeader variant="app" maxWidth="3xl" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Resume Examples by Role
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Structure and tips for different roles. Use these as a guide, then build your own with our templates.
        </p>

        <ul className="mt-10 space-y-6">
          {examples.map((ex) => (
            <li key={ex.slug}>
              <Link
                href={`/examples/${ex.slug}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  {ex.industry}
                </span>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {ex.title}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                  {ex.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* From our blog (internal linking) */}
        <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            From our blog
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Expert guides on resumes, ATS, and the Indian job market.
          </p>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100">{post.title}</span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="inline-block mt-4 text-sm font-medium text-primary-600 hover:underline">
            All blog posts →
          </Link>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
          <Link href="/templates" className="text-primary-600 hover:underline font-medium">
            Choose a template →
          </Link>
          <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:underline">
            Blog
          </Link>
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:underline">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
