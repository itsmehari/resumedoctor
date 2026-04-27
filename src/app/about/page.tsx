import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About ResumeDoctor",
  description:
    "ResumeDoctor is India's resume builder built for job seekers. Learn about our mission to make professional resumes accessible to everyone.",
  alternates: { canonical: `${siteUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="home" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          About ResumeDoctor
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          India-first. Built for job seekers.
        </p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              Our Mission
            </h2>
            <p>
              ResumeDoctor makes professional, ATS-friendly resumes accessible to every job seeker in India. We believe everyone deserves a resume that gets noticed—without the cost of a professional writer or the hassle of complex design tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              What We Build
            </h2>
            <p>
              We build resume and CV templates designed for the Indian job market—Naukri, LinkedIn, Indeed, TimesJobs, Shine, and more. Our templates use clean layouts and standard structures so Applicant Tracking Systems (ATS) can read your content correctly. Export to TXT on the free plan, or upgrade to Pro for PDF and Word when you&apos;re ready to apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              Try Before You Sign Up
            </h2>
            <p>
              You can start a short browser trial: enter your email for a verification code (no credit card). Build and preview a resume; sign up to save your work and keep editing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              Contact
            </h2>
            <p>
              Questions? Reach out via the support email on our website. We&apos;re here to help.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex gap-4">
          <Link
            href="/try"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Try Free
          </Link>
          <Link
            href="/"
            className="text-primary-600 hover:underline font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
