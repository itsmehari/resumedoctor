import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for your ResumeDoctor account.",
  alternates: { canonical: `${siteUrl}/verify-email` },
  robots: { index: false, follow: false },
};

export default function VerifyEmailLayout({ children }: { children: ReactNode }) {
  return children;
}
