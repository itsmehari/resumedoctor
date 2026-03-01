import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getPostSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getPostSlugs();
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publicPages = [
    { url: siteUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteUrl}/pricing`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/templates`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/try`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/login`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/signup`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  return [
    ...publicPages.map((page) => ({
      ...page,
      lastModified: new Date(),
    })),
    ...blogUrls,
  ];
}
