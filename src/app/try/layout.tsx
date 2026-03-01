import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Try Free – No Signup, 5 Min Trial",
  description:
    "Build a professional resume in 5 minutes. No signup. No credit card. Try free with just your email. ATS-friendly templates.",
  alternates: { canonical: `${siteUrl}/try` },
  openGraph: {
    title: "Try ResumeDoctor Free – No Signup, 5 Min Trial",
    description: "Build a professional resume in 5 minutes. No signup. No credit card.",
    url: `${siteUrl}/try`,
  },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
