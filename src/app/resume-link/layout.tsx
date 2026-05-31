import type { Metadata } from "next";
import {
  RESUME_LINK_METADATA,
  RESUME_LINK_OG_IMAGE,
  RESUME_LINK_CANONICAL,
} from "@/lib/resume-link-seo-data";

export const metadata: Metadata = {
  title: RESUME_LINK_METADATA.title,
  description: RESUME_LINK_METADATA.description,
  alternates: { canonical: RESUME_LINK_CANONICAL },
  keywords: RESUME_LINK_METADATA.keywords,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: RESUME_LINK_METADATA.title,
    description: RESUME_LINK_METADATA.description,
    url: RESUME_LINK_CANONICAL,
    type: "website",
    siteName: "ResumeDoctor",
    locale: "en_IN",
    images: [{ url: RESUME_LINK_OG_IMAGE, width: 1200, height: 630, alt: "ResumeDoctor — share your resume as a link" }],
  },
  twitter: {
    card: "summary_large_image",
    title: RESUME_LINK_METADATA.title,
    description: RESUME_LINK_METADATA.description,
    images: [RESUME_LINK_OG_IMAGE],
  },
};

export default function ResumeLinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
