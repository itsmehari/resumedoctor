import Link from "next/link";

export const metadata = {
  title: "Terms of Service – ResumeDoctor",
  description: "Terms of service for ResumeDoctor resume builder.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Terms of Service
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              1. Acceptance of Terms
            </h2>
            <p>
              By using ResumeDoctor (&quot;the Service&quot;), you agree to these Terms of
              Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              2. Description of Service
            </h2>
            <p>
              ResumeDoctor provides an online resume and CV builder. We offer
              free and paid tiers. Features, pricing, and availability may change
              with notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              3. Account & Responsibility
            </h2>
            <p>
              You are responsible for maintaining the security of your account
              and for all activity under it. You must provide accurate
              information when signing up. You must not use the Service for
              unlawful purposes or to submit content that infringes others&apos;
              rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              4. Your Content
            </h2>
            <p>
              You retain ownership of the content you create (resumes, CVs). By
              using the Service, you grant us a license to store, process, and
              display your content as needed to provide the Service. We do not
              claim ownership of your resume content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              5. Payments & Refunds
            </h2>
            <p>
              Paid plans are billed as described at the time of purchase.
              Refunds are handled on a case-by-case basis. Contact us for
              refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              6. Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is.&quot; We are not liable for any
              indirect, incidental, or consequential damages. Our liability is
              limited to the amount you paid for the Service in the past 12
              months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              7. Changes
            </h2>
            <p>
              We may update these terms. Continued use of the Service after
              changes constitutes acceptance. We will notify users of material
              changes where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-8">
              8. Contact
            </h2>
            <p>
              For questions about these terms, contact us at the support email
              provided on our website.
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
