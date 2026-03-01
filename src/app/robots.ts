import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/resumes/", "/api/"],
    },
    sitemap: sitemapUrl,
  };
}
