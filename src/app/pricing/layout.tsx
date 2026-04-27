import type { Metadata } from "next";
import { siteUrl, siteName } from "@/lib/seo";
import { PricingJsonLd } from "@/components/seo/pricing-json-ld";

export const metadata: Metadata = {
  title: "Pricing – Free & Pro Plans",
  description:
    "Compare Free and Pro. Start free and try with OTP; upgrade on SuperProfile when you need exports — same email at checkout.",
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    title: "Pricing – ResumeDoctor | Free & Pro Plans",
    description:
      "Compare Free and Pro. Try with OTP; upgrade on SuperProfile for PDF, Word, and every template — same email at checkout.",
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
