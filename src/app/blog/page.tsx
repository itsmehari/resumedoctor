import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { getAllExamples } from "@/lib/examples";
import { format } from "date-fns";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Resume & Career Tips",
  description:
    "Expert guides on resumes, CVs, and job search. ATS tips, fresher formats, and templates for the Indian job market.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const examples = getAllExamples().slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="home" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Resume & Career Tips
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Expert guides to help you land your next role.
        </p>

        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {post.title}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                  {post.description}
                </p>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  {post.date ? format(new Date(post.date), "MMM d, yyyy") : ""} · {post.readTime} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Resume examples by role (internal linking) */}
        <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Resume examples by role
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Structure and tips for Software Engineer, Fresher, Data Analyst, Marketing, and more.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {examples.map((ex) => (
              <Link
                key={ex.slug}
                href={`/examples/${ex.slug}`}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  {ex.industry}
                </span>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{ex.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ex.description}</p>
              </Link>
            ))}
          </div>
          <Link href="/examples" className="inline-block mt-4 text-sm font-medium text-primary-600 hover:underline">
            View all resume examples →
          </Link>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link href="/" className="text-primary-600 hover:underline font-medium">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
