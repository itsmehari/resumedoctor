import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";
import { PricingJsonLd } from "@/components/seo/pricing-json-ld";

export const metadata: Metadata = {
  title: "Pricing – Free & Pro Plans",
  description:
    "Compare Free and Pro plans. ₹0 forever; Pro and ₹49 trial are one-time on SuperProfile. No hidden fees.",
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: "Pricing – ResumeDoctor | Free & Pro Plans",
    description: "Compare Free and Pro plans. Pro adds PDF, Word, and more—purchase via SuperProfile.",
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
