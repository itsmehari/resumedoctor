import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your ResumeDoctor account to save resumes and export to PDF & Word.",
  alternates: { canonical: `${siteUrl}/signup` },
  robots: { index: false, follow: true },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
