import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getExampleBySlug, getExampleSlugs } from "@/lib/examples";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getExampleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ex = getExampleBySlug(slug);
  if (!ex) return {};
  return {
    title: ex.title,
    description: ex.description,
    alternates: { canonical: `${siteUrl}/examples/${slug}` },
  };
}

export default async function ExampleDetailPage({ params }: Props) {
  const { slug } = await params;
  const ex = getExampleBySlug(slug);
  if (!ex) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/examples" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Examples
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

      <article className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
          {ex.industry}
        </span>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {ex.title}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {ex.description}
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Resume tips for this role
          </h2>
          <ul className="mt-4 space-y-3">
            {ex.tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-3 text-slate-700 dark:text-slate-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
          <Link
            href="/try"
            className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Create your resume
          </Link>
          <Link href="/examples" className="text-primary-600 hover:underline font-medium">
            ← All examples
          </Link>
        </div>
      </article>
    </div>
  );
}
