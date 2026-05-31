import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment received — welcome to Pro | ResumeDoctor",
  description:
    "Your ₹49 14-day full Pro pass is activating. Build, export PDF/DOCX, and share your resume link on ResumeDoctor.",
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
