import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for ResumeDoctor. Learn how we collect, use, and protect your resume data and personal information.",
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" maxWidth="3xl" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Privacy Policy
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Last updated: 5 March 2026
        </p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide when creating an account and
              building resumes: email address, name, and resume content (work
              history, education, skills, etc.). We also collect usage data such
              as pages visited and export actions to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              2. How We Use Your Information
            </h2>
            <p>
              Your data is used to provide the resume builder service, send
              account-related emails (verification, password reset), process
              payments where applicable, and improve our product. We do not sell
              your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              3. Data Storage & Security
            </h2>
            <p>
              Your data is stored on secure servers. We use industry-standard
              practices to protect your information. Passwords are hashed and
              never stored in plain text.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              4. Data Retention Policy
            </h2>
            <p>
              We keep your data only as long as necessary to provide the service
              or as required by law. The table below summarises how long each
              category of data is retained:
            </p>

            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 w-1/3">Data Type</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 w-1/4">Retention Period</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {[
                    ["Account profile (name, email)", "Until account deletion", "Deleted immediately when you delete your account"],
                    ["Resume content & versions", "Until account deletion", "All resumes and version history are permanently deleted with your account"],
                    ["Cover letters", "Until account deletion", "Linked cover letters are deleted with the account"],
                    ["Export history logs", "90 days", "Automatically purged after 90 days; used only for your export history view"],
                    ["AI usage logs (rate-limit counters)", "Rolling 30 days", "Used solely for enforcing daily AI usage limits"],
                    ["AI response cache", "24 hours", "Cached LLM responses are automatically expired after 24 hours"],
                    ["Feature usage analytics", "Rolling 90 days", "Anonymised aggregate counts; no content stored"],
                    ["ATS score cache", "Per resume version", "Cleared when the resume is deleted"],
                    ["Session tokens", "14 days (rolling)", "Invalidated on sign-out or account deletion"],
                    ["Password reset tokens", "1 hour", "Single-use; expire automatically"],
                    ["Database backups", "30 days", "Encrypted backups are retained for 30 days then permanently deleted"],
                    ["Payment & invoice records", "7 years", "Required by Indian GST/financial regulations"],
                  ].map(([type, period, notes]) => (
                    <tr key={type} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{type}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{period}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-6">
              Your Rights
            </h3>
            <p className="mt-2">
              You have the right to access, correct, download, or permanently
              delete your personal data at any time. You can exercise these
              rights directly from your account:
            </p>
            <ul className="mt-3 space-y-2 list-none pl-0">
              {[
                ["Download my data", "Settings → Data & Privacy → Download my data", "Exports a JSON file with your profile, resumes, and cover letters"],
                ["Delete my account", "Settings → Data & Privacy → Delete account", "Permanently and immediately deletes all your data. This cannot be undone"],
                ["Correction", "Settings → Profile", "Edit your name, email, or profile picture at any time"],
              ].map(([right, path, detail]) => (
                <li key={right} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
                  <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">{right}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{path}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To request data deletion or exercise any right not available
              through the interface, email us at{" "}
              <a
                href="mailto:privacy@resumedoctor.in"
                className="text-primary-600 hover:underline"
              >
                privacy@resumedoctor.in
              </a>
              . We will respond within 30 days as required under the{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              5. Cookies & Analytics
            </h2>
            <p>
              We use cookies for authentication and session management. We may
              use analytics tools to understand how our service is used. You can
              control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              6. Contact
            </h2>
            <p>
              For privacy-related questions or to exercise your rights, contact
              us at{" "}
              <a
                href="mailto:privacy@resumedoctor.in"
                className="text-primary-600 hover:underline"
              >
                privacy@resumedoctor.in
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
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
