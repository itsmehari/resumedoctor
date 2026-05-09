import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "30 Resume Templates — Professional Designs for India",
  description:
    "Choose from 30 professional resume templates — Modern, Classic, Creative, Minimal, Two-Column, Dark Sidebar. Recruiter-tested for Naukri, LinkedIn, and Indeed. Share as a link or export to PDF and Word on Pro.",
  alternates: { canonical: `${siteUrl}/templates` },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
