import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your ResumeDoctor account.",
  alternates: { canonical: `${siteUrl}/reset-password` },
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
