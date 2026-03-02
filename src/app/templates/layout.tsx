import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "30 Resume Templates – ATS-Friendly Designs for India",
  description:
    "Choose from 30 professional, ATS-friendly resume templates. Professional, Modern, Minimal, Creative, Executive, Fresher & more. Designed for Naukri, LinkedIn, Indeed.",
  alternates: { canonical: `${siteUrl}/templates` },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
