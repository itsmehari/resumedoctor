/**
 * AIO – AI Integration Optimisation
 * Machine-readable structured data for AI tools, RAG, and embeddings.
 * Use: GET /api/structured-data
 */
import { NextResponse } from "next/server";
import { siteUrl, siteName } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    url: `${siteUrl}/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    date: p.date,
  }));

  const data = {
    schema: "resumedoctor-structured-data-v1",
    site: {
      name: siteName,
      url: siteUrl,
      description:
        "India-first resume and CV builder. ATS-friendly templates, PDF export, trusted by job seekers.",
      features: [
        "ATS-friendly resume templates",
        "PDF and Word export",
        "5-minute OTP try session",
        "Works with Naukri, LinkedIn, Indeed",
      ],
    },
    product: {
      name: siteName,
      category: "Resume Builder",
      plans: [
        { name: "Try", price: 0, features: ["OTP session", "Template preview"] },
        { name: "Pro", price: 199, features: ["PDF export", "Word export"] },
      ],
    },
    content: {
      blog: posts,
    },
    faq: [
      { q: "What is ResumeDoctor?", a: "India-first online resume builder with ATS-friendly templates." },
      { q: "How can I try ResumeDoctor?", a: "Use the OTP try flow for a quick session, then purchase Pro on SuperProfile when you need full exports." },
    ],
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
