import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ResumeDoctor account to access your resumes and continue building.",
  alternates: { canonical: `${siteUrl}/login` },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
