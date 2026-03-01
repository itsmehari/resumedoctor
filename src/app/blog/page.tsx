import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Resume & Career Tips",
  description:
    "Expert guides on resumes, CVs, and job search. ATS tips, fresher formats, and templates for the Indian job market.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Home
            </Link>
            <Link href="/try" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Try Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Resume & Career Tips
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Expert guides to help you land your next role.
        </p>

        <ul className="mt-10 space-y-8">
          {getAllPosts().map((post) => (
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

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link href="/" className="text-primary-600 hover:underline font-medium">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
