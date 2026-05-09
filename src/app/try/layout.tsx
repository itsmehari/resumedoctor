import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Try ResumeDoctor — No Signup, 15 Min Quick Build",
  description:
    "Build a professional resume in 15 minutes. No signup. No credit card. Start Try with just your email — pick a template, fill it in, and share as a link.",
  alternates: { canonical: `${siteUrl}/try` },
  openGraph: {
    title: "Try ResumeDoctor — No Signup, 15 Min Quick Build",
    description:
      "Build a professional resume in 15 minutes. No signup. No credit card. Share as a link or export on Pro.",
    url: `${siteUrl}/try`,
  },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
