import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getRelatedExamplesForBlog, getRelatedPostsForBlog, type RelatedLink } from "@/lib/content-links";
import { ArticleJsonLd, BlogFaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { compileBlogMdx } from "@/lib/compile-blog-mdx";
import { extractMarkdownHeadings, splitContentForMidRelated } from "@/lib/blog-headings";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { BlogReadingProgress } from "@/components/blog/blog-reading-progress";
import { BlogShareRow } from "@/components/blog/blog-share-row";
import { BlogToc } from "@/components/blog/blog-toc";
import { BlogFloatingChrome } from "@/components/blog/blog-floating-chrome";
import { BlogMidRelatedCarousel } from "@/components/blog/blog-mid-related";
import { BlogFaqAccordion } from "@/components/blog/blog-faq-accordion";
import { BlogArticleFeedback } from "@/components/blog/blog-article-feedback";
import { BlogLeadMagnet } from "@/components/blog/blog-lead-magnet";
import { BlogReaderMode } from "@/components/blog/blog-reader-mode";
import { cn } from "@/lib/utils";
interface Props {
  params: { slug: string };
}

function resolveImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${siteUrl}${path}`;
  return `${siteUrl}/${path}`;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const imagePath = post.ogImage || post.coverImage;
  const imageUrl = resolveImageUrl(imagePath);
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
      modifiedTime: post.updated,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

const proseArticle =
  "prose prose-slate max-w-none dark:prose-invert " +
  "prose-p:transition-colors prose-p:first-of-type:text-[1.12rem] prose-p:first-of-type:font-medium " +
  "prose-p:first-of-type:leading-relaxed " +
  "prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight " +
  "prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4 " +
  "prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:text-xl dark:prose-h2:border-slate-700 " +
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg " +
  "prose-p:text-[1.05rem] prose-p:leading-[1.75] prose-p:text-slate-700 dark:prose-p:text-slate-300 " +
  "prose-li:marker:text-primary-500 prose-li:text-slate-700 dark:prose-li:text-slate-300 " +
  "prose-a:font-medium prose-a:text-primary-600 prose-a:underline-offset-2 prose-a:transition-all hover:prose-a:underline " +
  "prose-strong:text-slate-900 dark:prose-strong:text-white " +
  "prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-primary-800 dark:prose-code:bg-slate-800 dark:prose-code:text-primary-200 " +
  "prose-pre:my-4 " +
  "prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-violet-50/50 prose-blockquote:py-3 prose-blockquote:pl-4 " +
  "prose-blockquote:italic prose-blockquote:font-serif dark:prose-blockquote:bg-violet-950/20 " +
  "prose-hr:border-slate-200 dark:prose-hr:border-slate-700";

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allSlugs = getPostSlugs();
  const currentIndex = allSlugs.indexOf(params.slug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;
  const relatedPosts = getRelatedPostsForBlog(params.slug);
  const relatedExamples = getRelatedExamplesForBlog(params.slug);
  const midLinks: RelatedLink[] = relatedPosts.slice(0, 3);
  const midSlugs = new Set(midLinks.map((l) => l.slug));
  const deduped = relatedPosts.filter((p) => !midSlugs.has(p.slug));
  const keepReading: RelatedLink[] = deduped.length > 0 ? deduped : relatedPosts;

  const headings = extractMarkdownHeadings(post.content);
  const split = splitContentForMidRelated(post.content);
  let body: ReactNode;
  if (split) {
    const part1 = await compileBlogMdx(split.first);
    const part2 = await compileBlogMdx(split.rest);
    body = (
      <>
        {part1}
        <BlogMidRelatedCarousel posts={midLinks} />
        {part2}
      </>
    );
  } else {
    body = await compileBlogMdx(post.content);
  }

  const shareUrl = `${siteUrl}/blog/${post.slug}`;
  const cover = post.coverImage || "/blog/covers/default.svg";
  const imageUrlForJson = resolveImageUrl(post.ogImage || post.coverImage);
  const authorImage = post.authorImage;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] print:bg-white dark:bg-slate-950">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        date={post.date}
        author={post.author}
        dateModified={post.updated}
        imageUrl={imageUrlForJson}
      />
      {post.faq?.length ? <BlogFaqJsonLd items={post.faq} /> : null}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ]}
      />
      <BlogReadingProgress />
      <SiteHeader variant="home" />

      <article id="main-content" tabIndex={-1} className="blog-post-article flex-1 outline-none">
        <header className="blog-masthead relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-40%,rgba(59,130,246,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-30%,rgba(99,102,241,0.15),transparent)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:8px_8px] dark:opacity-[0.07] dark:[background-image:radial-gradient(#fff_1px,transparent_1px)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-12">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Blog
              </Link>
              <div className="print:hidden">
                <BlogReaderMode />
              </div>
            </div>
            {cover ? (
              <div className="print:hidden mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-700">
                <div className="relative aspect-[1200/500] w-full sm:aspect-[1200/420]">
                  <Image
                    src={cover}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 1024px) 768px, 100vw"
                  />
                </div>
              </div>
            ) : null}
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl sm:leading-tight lg:text-[2.5rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{post.description}</p>
            <BlogShareRow url={shareUrl} title={post.title} />
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200/80 pt-8 dark:border-slate-800">
              {authorImage ? (
                <Image
                  src={authorImage}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 text-sm font-bold text-white shadow-md">
                  {post.author?.slice(0, 1) ?? "R"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  <Link href="/about" className="hover:underline">
                    {post.author}
                  </Link>
                </p>
                {post.authorBio ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{post.authorBio}</p> : null}
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  {post.date ? (
                    <span>
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                  {post.updated ? (
                    <span className="text-primary-600 dark:text-primary-400">
                      · Updated{" "}
                      {new Date(post.updated).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readTime} min read
                  </span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="xl:grid xl:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] xl:gap-12">
            {headings.length > 0 ? (
              <aside className="mb-8 hidden xl:mb-0 xl:block" aria-label="On this page">
                <div className="blog-toc-sticky sticky top-28 space-y-6">
                  <BlogToc headings={headings} />
                </div>
              </aside>
            ) : null}
            <div>
              <div
                className={cn(
                  "blog-cta-strip blog-hide-in-reader print:hidden mb-10 flex flex-col gap-4 rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm dark:border-primary-900/40 dark:from-primary-950/40 dark:to-slate-900/80 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                )}
              >
                <p className="text-sm font-medium leading-snug text-primary-950 dark:text-primary-100">
                  Ready to turn this into interviews? Build your role-aligned resume in minutes and tailor it for your next application.
                </p>
                <Link
                  href="/try"
                  prefetch
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
                >
                  Start with Try
                  <ArrowUpRight className="h-4 w-4 opacity-90" aria-hidden />
                </Link>
              </div>

              <div
                className={cn("blog-prose", proseArticle)}
                data-blog-article
                id="article-body"
                tabIndex={-1}
              >
                {body}
              </div>

              {post.faq?.length ? <BlogFaqAccordion items={post.faq} /> : null}

              <div className="blog-lead print:hidden mt-12">
                <BlogLeadMagnet />
              </div>

              <div className="blog-bottom-cta blog-hide-in-reader print:hidden relative mt-14 overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-center dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-500/30 blur-2xl"
                  aria-hidden
                />
                <h2 className="relative text-xl font-bold text-white sm:text-2xl">Put this guide to work</h2>
                <p className="relative mx-auto mt-2 max-w-md text-sm text-slate-300">
                  Use ATS-safe templates, stronger copy, and faster tailoring workflows to apply with confidence.
                </p>
                <Link
                  href="/try"
                  prefetch
                  className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
                >
                  Build my resume now
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="print:hidden">
                <BlogArticleFeedback slug={post.slug} />
              </div>

              {keepReading.length > 0 && (
                <section className="print:hidden mt-14 border-t border-slate-200 pt-12 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Next best reads</h2>
                  <ul className="mt-4 space-y-3">
                    {keepReading.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          prefetch
                          className="group flex items-start justify-between gap-3 rounded-xl border border-transparent py-2 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/50"
                        >
                          <span className="font-medium text-slate-800 group-hover:text-primary-600 dark:text-slate-200 dark:group-hover:text-primary-400">
                            {p.title}
                          </span>
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {relatedExamples.length > 0 && (
                <section className="print:hidden mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Role-specific resume examples</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Role-specific outlines you can copy structure from.
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {relatedExamples.map((ex) => (
                      <li key={ex.slug}>
                        <Link
                          href={`/examples/${ex.slug}`}
                          prefetch
                          className="block rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-primary-600"
                        >
                          {ex.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/examples"
                    prefetch
                    className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    All examples →
                  </Link>
                </section>
              )}

              <nav className="print:hidden mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-10 dark:border-slate-800">
                {prevSlug ? (
                  <Link
                    href={`/blog/${prevSlug}`}
                    prefetch
                    className="text-sm font-medium text-primary-600 transition hover:underline dark:text-primary-400"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                {nextSlug ? (
                  <Link
                    href={`/blog/${nextSlug}`}
                    prefetch
                    className="text-sm font-medium text-primary-600 transition hover:underline dark:text-primary-400"
                  >
                    Next →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>

              <p className="print:hidden mt-8 text-center">
                <Link href="/blog" prefetch className="text-sm text-slate-500 transition hover:text-primary-600 dark:text-slate-400">
                  ← All articles
                </Link>
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="print:hidden">
        <BlogFloatingChrome
          headings={headings}
          shareUrl={shareUrl}
          title={post.title}
        />
      </div>
    </div>
  );
}
