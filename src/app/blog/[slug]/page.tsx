import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getRelatedExamplesForBlog, getRelatedPostsForBlog } from "@/lib/content-links";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import ReactMarkdown from "react-markdown";

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
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
      <SiteHeader variant="app" maxWidth="3xl" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">

        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span>›</span>
            <span>{post.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {post.description}
          </p>
          <div className="flex items-center gap-4 mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {post.author?.slice(0, 1) ?? "R"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{post.author}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {post.date
                  ? new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                  : ""}
                {" · "}{post.readTime} min read
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-5 mb-10 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-medium text-primary-900 dark:text-primary-200">
            Ready to build your resume? Start free — takes under 5 minutes.
          </p>
          <Link href="/try"
            className="flex-shrink-0 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 transition-colors">
            Try free →
          </Link>
        </div>

        {/* Article body */}
        <article className="prose prose-slate dark:prose-invert max-w-none
          prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-10 prose-h1:mb-4
          prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
          prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
          prose-li:text-slate-700 dark:prose-li:text-slate-300
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 dark:prose-strong:text-slate-100
          prose-code:text-primary-700 dark:prose-code:text-primary-300 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-blockquote:border-primary-400 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
          prose-ul:space-y-1 prose-ol:space-y-1
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Put these tips into action right now
          </h2>
          <p className="text-white/80 text-sm mb-5">
            Build your resume with our ATS-friendly templates — free to start.
          </p>
          <Link href="/try"
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-primary-700 font-bold px-7 py-3 transition-colors shadow">
            Build my resume free →
          </Link>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Related articles</h2>
            <ul className="space-y-2">
              {relatedPosts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="text-primary-600 hover:underline font-medium">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resume examples for you */}
        {relatedExamples.length > 0 && (
          <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Resume examples for you</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Role-specific structure and tips to build your resume.
            </p>
            <ul className="space-y-2">
              {relatedExamples.map((ex) => (
                <li key={ex.slug}>
                  <Link href={`/examples/${ex.slug}`} className="text-primary-600 hover:underline font-medium">
                    {ex.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/examples" className="inline-block mt-2 text-sm text-primary-600 hover:underline">
              View all resume examples →
            </Link>
          </section>
        )}

        {/* Post navigation */}
        <nav className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-4">
          {prevSlug ? (
            <Link href={`/blog/${prevSlug}`}
              className="text-sm text-primary-600 hover:underline">
              ← Previous article
            </Link>
          ) : <span />}
          {nextSlug ? (
            <Link href={`/blog/${nextSlug}`}
              className="text-sm text-primary-600 hover:underline">
              Next article →
            </Link>
          ) : <span />}
        </nav>

        <div className="mt-6 text-center">
          <Link href="/blog" className="text-slate-500 hover:text-primary-600 text-sm hover:underline">
            ← Back to all articles
          </Link>
        </div>
      </main>
    </div>
  );
}
