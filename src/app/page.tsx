import { SiteHeader } from "@/components/site-header";
import { HomeLanding } from "@/components/home/home-landing";
import { HomeJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { siteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  title: "ResumeDoctor — ATS Resume Builder, Shareable Link & AI Help | India",
  description:
    "Build an ATS-friendly resume with 30+ templates, OTP Try, AI writing help, and a shareable resume link for WhatsApp and LinkedIn. Upgrade on SuperProfile for PDF and Word export.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <HomeJsonLd />
      <FaqJsonLd />
      <HowToJsonLd />

      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <HomeLanding />
      </main>
    </div>
  );
}
