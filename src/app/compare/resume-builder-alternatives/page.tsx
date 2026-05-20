import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ResumeDoctor vs Generic Builders — India Resume Comparison",
  description:
    "Compare ResumeDoctor with typical online resume builders: India-first portals, shareable resume link, OTP Try, SuperProfile billing, and ATS-aware templates.",
  alternates: { canonical: `${siteUrl}/compare/resume-builder-alternatives` },
};

const ROWS = [
  { label: "India job portals (Naukri, campus)", us: "Built-in copy and examples", them: "Often US-centric defaults" },
  { label: "Shareable live resume link", us: "Included; update once", them: "Usually PDF-only sharing" },
  { label: "Try without card", us: "OTP Try on /try", them: "Varies; often account + paywall" },
  { label: "ATS-friendly templates", us: "Standard section layouts", them: "Mixed; decorative templates common" },
  { label: "JD / keyword match in editor", us: "In-editor checks on Pro", them: "Rare or separate product" },
  { label: "Billing", us: "SuperProfile (INR, UPI-friendly)", them: "International cards/subscriptions" },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Compare", url: `${siteUrl}/compare/resume-builder-alternatives` },
        ]}
      />
      <SiteHeader variant="home" />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-primary-900 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why job seekers in India choose ResumeDoctor
            </h1>
            <p className="mt-4 text-lg text-white/85">
              An honest comparison with typical global resume builders—not a feature checklist war.
            </p>
            <Link
              href="/try"
              className="mt-8 inline-block rounded-xl bg-accent px-8 py-3.5 font-bold text-accent-dark hover:bg-accent-hover"
            >
              Try the builder — OTP, no card
            </Link>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="p-4 text-left font-semibold text-slate-900 dark:text-white">Topic</th>
                  <th className="p-4 text-left font-semibold text-primary-700 dark:text-primary-300">ResumeDoctor</th>
                  <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-400">Typical builder</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{row.label}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{row.us}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
            See{" "}
            <Link href="/features" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              all features
            </Link>
            ,{" "}
            <Link href="/pricing" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              pricing
            </Link>
            , and our{" "}
            <Link href="/glossary" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              glossary
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
