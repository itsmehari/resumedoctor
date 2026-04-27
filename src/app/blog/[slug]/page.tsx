import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getRelatedExamplesForBlog, getRelatedPostsForBlog } from "@/lib/content-links";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | ResumeDoctor Blog`,
    description: post.description,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allSlugs = getPostSlugs();
  const currentIndex = allSlugs.indexOf(params.slug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;
  const relatedPosts = getRelatedPostsForBlog(params.slug);
  const relatedExamples = getRelatedExamplesForBlog(params.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] dark:bg-slate-950">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        date={post.date}
        author={post.author}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ]}
      />
      <SiteHeader variant="home" />

      <article className="flex-1">
        {/* Masthead */}
        <header className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-40%,rgba(59,130,246,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-30%,rgba(99,102,241,0.15),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Blog
            </Link>
            <h1 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl sm:leading-tight lg:text-[2.5rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{post.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200/80 pt-8 dark:border-slate-800">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 text-sm font-bold text-white shadow-md">
                {post.author?.slice(0, 1) ?? "R"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{post.author}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readTime} min read
                  </span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
          {/* CTA strip */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm dark:border-primary-900/40 dark:from-primary-950/40 dark:to-slate-900/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-sm font-medium leading-snug text-primary-950 dark:text-primary-100">
              Ready to apply these ideas? Start free — most people finish a first draft in under five minutes.
            </p>
            <Link
              href="/try"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
            >
              Try free
              <ArrowUpRight className="h-4 w-4 opacity-90" aria-hidden />
            </Link>
          </div>

          {/* Body */}
          <div
            className="prose prose-slate max-w-none dark:prose-invert
            prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:text-xl dark:prose-h2:border-slate-700
            prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg
            prose-p:text-[1.05rem] prose-p:leading-[1.75] prose-p:text-slate-700 dark:prose-p:text-slate-300
            prose-li:marker:text-primary-500 prose-li:text-slate-700 dark:prose-li:text-slate-300
            prose-a:font-medium prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-primary-400
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-primary-800 dark:prose-code:bg-slate-800 dark:prose-code:text-primary-200
            prose-blockquote:border-l-4 prose-blockquote:border-primary-400 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:not-italic dark:prose-blockquote:bg-slate-900/50
            prose-hr:border-slate-200 dark:prose-hr:border-slate-700
          "
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Bottom CTA */}
          <div className="relative mt-14 overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-center dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-500/30 blur-2xl"
              aria-hidden
            />
            <h2 className="relative text-xl font-bold text-white sm:text-2xl">Put this guide to work</h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-slate-300">
              ATS-friendly templates, AI assist, and exports when you upgrade — free to start.
            </p>
            <Link
              href="/try"
              className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              Build my resume
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Keep reading</h2>
              <ul className="mt-4 space-y-3">
                {relatedPosts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-transparent py-2 transition hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/50"
                    >
                      <span className="font-medium text-slate-800 group-hover:text-primary-600 dark:text-slate-200 dark:group-hover:text-primary-400">
                        {p.title}
                      </span>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedExamples.length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Resume examples</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Role-specific outlines you can copy structure from.</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {relatedExamples.map((ex) => (
                  <li key={ex.slug}>
                    <Link
                      href={`/examples/${ex.slug}`}
                      className="block rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-primary-600"
                    >
                      {ex.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/examples" className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
                All examples →
              </Link>
            </section>
          )}

          <nav className="mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-10 dark:border-slate-800">
            {prevSlug ? (
              <Link href={`/blog/${prevSlug}`} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            {nextSlug ? (
              <Link href={`/blog/${nextSlug}`} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <p className="mt-8 text-center">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400">
              ← All articles
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
