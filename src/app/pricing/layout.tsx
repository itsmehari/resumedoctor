import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";
import { PricingJsonLd } from "@/components/seo/pricing-json-ld";

export const metadata: Metadata = {
  title: "Pricing – Free & Pro Plans",
  description:
    "Compare Free and Pro plans. ₹0 forever or ₹199/mo for PDF & Word export. Pay via UPI, Google Pay. No hidden fees.",
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: "Pricing – ResumeDoctor | Free & Pro Plans",
    description: "Compare Free and Pro plans. ₹0 forever or ₹199/mo for PDF & Word export.",
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
