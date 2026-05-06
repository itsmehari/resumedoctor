import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your ResumeDoctor account password.",
  alternates: { canonical: `${siteUrl}/forgot-password` },
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}