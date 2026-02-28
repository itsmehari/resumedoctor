import Link from "next/link";

export const metadata = {
  title: "Privacy Policy – ResumeDoctor",
  description: "Privacy policy for ResumeDoctor resume builder.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN")}
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
              4. Data Retention
            </h2>
            <p>
              We retain your account and resume data until you delete your
              account. You may request deletion of your data at any time by
              contacting us or using the account deletion feature when available.
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
              us at the support email provided on our website.
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
