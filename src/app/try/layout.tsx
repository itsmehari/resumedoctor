import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Try ResumeDoctor – No Signup, 15 Min Trial",
  description:
    "Build a professional resume in 15 minutes. No signup. No credit card. Start Try with just your email. ATS-friendly templates.",
  alternates: { canonical: `${siteUrl}/try` },
  openGraph: {
    title: "Try ResumeDoctor – No Signup, 15 Min Trial",
    description: "Build a professional resume in 15 minutes. No signup. No credit card.",
    url: `${siteUrl}/try`,
  },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
