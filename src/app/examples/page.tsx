import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllExamples } from "@/lib/examples";

export const metadata: Metadata = {
  title: "Resume Examples by Role – India",
  description:
    "Free resume examples for Software Engineer, Fresher, Data Analyst, Marketing, BPO, and more. Structure and tips for Indian job applications.",
  alternates: { canonical: `${siteUrl}/examples` },
};

export default function ExamplesIndexPage() {
  const examples = getAllExamples();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/blog" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Blog
            </Link>
            <Link href="/templates" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Templates
            </Link>
            <Link href="/try" className="text-primary-600 font-medium">
              Try Free
            </Link>
          </nav>
        </div>
      </header>

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
