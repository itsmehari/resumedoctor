import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getPostSlugs } from "@/lib/blog";
import { getExampleSlugs } from "@/lib/examples";

/**
 * Served at `/sitemap.xml` (referenced from `robots.txt`).
 * In Google Search Console → Sitemaps, submit: `https://resumedoctor.in/sitemap.xml`
 * (or your `NEXT_PUBLIC_APP_URL` + `/sitemap.xml`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getPostSlugs();
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const exampleSlugs = getExampleSlugs();
  const exampleUrls = exampleSlugs.map((slug) => ({
    url: `${siteUrl}/examples/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const publicPages = [
    { url: siteUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteUrl}/pricing`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/templates`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/try`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/try/templates`, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/login`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/signup`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/examples`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/lp/resume-builder-india`, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${siteUrl}/lp/fresher-campus-resume-india`, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${siteUrl}/lp/tailor-resume-job-description`, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${siteUrl}/lp/update-my-resume-india`, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${siteUrl}/lp/resume-export-pdf-docx-india`, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${siteUrl}/lp/marketing-landing`, changeFrequency: "monthly" as const, priority: 0.72 },
    { url: `${siteUrl}/features`, changeFrequency: "monthly" as const, priority: 0.72 },
    { url: `${siteUrl}/resume-link`, changeFrequency: "monthly" as const, priority: 0.85 },
  ];

  return [
    ...publicPages.map((page) => ({
      ...page,
      lastModified: new Date(),
    })),
    ...blogUrls,
    ...exampleUrls,
  ];
}
