import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";
import { PricingJsonLd } from "@/components/seo/pricing-json-ld";

export const metadata: Metadata = {
  title: "Pricing – Try, Pass & Pro Plans",
  description:
    "Compare Try, optional 14-day pass, and Pro. Upgrade on SuperProfile when you need exports — use the same email at checkout.",
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: "Pricing – ResumeDoctor | Try, Pass & Pro",
    description:
      "Compare Try, optional 14-day pass, and Pro. Upgrade on SuperProfile for PDF, Word, and every template.",
    url: `${siteUrl}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
