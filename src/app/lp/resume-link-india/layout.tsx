import type { Metadata } from "next";
import {
  RESUME_LINK_INDIA_LP,
  RESUME_LINK_INDIA_LP_METADATA,
  RESUME_LINK_OG_IMAGE,
} from "@/lib/resume-link-seo-data";

export const metadata: Metadata = {
  title: RESUME_LINK_INDIA_LP_METADATA.title,
  description: RESUME_LINK_INDIA_LP_METADATA.description,
  alternates: { canonical: RESUME_LINK_INDIA_LP },
  keywords: RESUME_LINK_INDIA_LP_METADATA.keywords,
  robots: { index: true, follow: true },
  openGraph: {
    title: RESUME_LINK_INDIA_LP_METADATA.title,
    description: RESUME_LINK_INDIA_LP_METADATA.description,
    url: RESUME_LINK_INDIA_LP,
    type: "website",
    siteName: "ResumeDoctor",
    locale: "en_IN",
    images: [{ url: RESUME_LINK_OG_IMAGE, width: 1200, height: 630, alt: "Share resume on WhatsApp India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: RESUME_LINK_INDIA_LP_METADATA.title,
    description: RESUME_LINK_INDIA_LP_METADATA.description,
    images: [RESUME_LINK_OG_IMAGE],
  },
};

export default function ResumeLinkIndiaLpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
