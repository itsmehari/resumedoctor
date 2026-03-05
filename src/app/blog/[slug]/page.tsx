import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { format } from "date-fns";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author, url: siteUrl },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
    url: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/blog" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Blog
            </Link>
            <Link href="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-400">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <article className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {post.title}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {post.date ? format(new Date(post.date), "MMMM d, yyyy") : ""} · {post.readTime} min read · {post.author}
        </p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => {
                if (href?.startsWith("/")) {
                  return <Link href={href}>{children}</Link>;
                }
                return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex gap-4">
          <Link
            href="/try"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Create Your Resume
          </Link>
          <Link href="/blog" className="text-primary-600 hover:underline font-medium">
            ← More articles
          </Link>
        </div>
      </article>
    </div>
  );
}
