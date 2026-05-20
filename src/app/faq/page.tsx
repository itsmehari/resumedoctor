import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { MarketingFaqSection } from "@/components/marketing/marketing-faq-section";
import { SITE_FAQ_ITEMS } from "@/lib/faq-data";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ — ResumeDoctor | India Resume Builder",
  description:
    "Answers about ResumeDoctor: OTP Try, resume link sharing, PDF and Word export, SuperProfile billing, ATS-friendly templates, and privacy.",
  alternates: { canonical: `${siteUrl}/faq` },
  openGraph: {
    title: "FAQ — ResumeDoctor",
    description: "Common questions about building, sharing, and exporting your resume in India.",
    url: `${siteUrl}/faq`,
    type: "website",
    siteName: "ResumeDoctor",
  },
};

function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SITE_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <FaqJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "FAQ", url: `${siteUrl}/faq` },
        ]}
      />
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-lg text-white/85">
              ResumeDoctor helps you create, maintain, and share your resume—built for Indian job seekers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <MarketingFaqSection items={SITE_FAQ_ITEMS} />

          <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
            Still deciding?{" "}
            <Link href="/try" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              Start OTP Try
            </Link>{" "}
            ·{" "}
            <Link href="/pricing" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              See pricing
            </Link>{" "}
            ·{" "}
            <Link href="/guides" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              Read guides
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
