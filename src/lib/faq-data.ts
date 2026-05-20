/** Shared FAQ copy for /faq, homepage JSON-LD, and marketing pages */

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export const SITE_FAQ_ITEMS: FaqEntry[] = [
  {
    id: "what-is",
    question: "What is ResumeDoctor?",
    answer:
      "ResumeDoctor is an India-first online resume and CV builder. You create recruiter-friendly resumes with professional templates, optional AI writing help, a shareable resume link, and PDF or Word export when you upgrade on SuperProfile.",
  },
  {
    id: "who-for",
    question: "Who is ResumeDoctor for?",
    answer:
      "Job seekers in India—from freshers and campus hires to experienced professionals—who apply on Naukri, LinkedIn, Indeed, referrals, and campus drives. The product is tuned for Indian hiring workflows, not generic US-only resume norms.",
  },
  {
    id: "try-before-pay",
    question: "How can I try ResumeDoctor before paying?",
    answer:
      "Start with OTP Try at /try for a short, no-card preview of the builder. When you need full exports and every template, upgrade to Pro on SuperProfile using the same email as your ResumeDoctor account.",
  },
  {
    id: "resume-link",
    question: "What is the ResumeDoctor resume link?",
    answer:
      "After you publish, you get a URL like resumedoctor.in/r/your-slug. Share it on WhatsApp, LinkedIn, or email. When you edit your resume, the link shows the latest version—you do not resend attachments.",
  },
  {
    id: "export",
    question: "How do I export my resume to PDF or Word?",
    answer:
      "Portal-ready PDF and Word are available on Pro (or with resume pack credits where shown). Upgrade on SuperProfile with the same email as your account. TXT may be available on free tiers where indicated.",
  },
  {
    id: "ats-templates",
    question: "Are the templates ATS-friendly?",
    answer:
      "Yes. Templates use clean layouts and standard section structures suited to Applicant Tracking Systems used by major Indian job portals. In the editor you can also run readability and job-description match checks on Pro.",
  },
  {
    id: "ats-checker",
    question: "Where is the ATS resume checker?",
    answer:
      "Signed-in users run ATS and job-description match inside the resume editor. For an overview of how it works, see /ats-resume-checker and /features.",
  },
  {
    id: "superprofile",
    question: "Why do you mention SuperProfile and the same email?",
    answer:
      "Pro checkout runs on SuperProfile. Use the same email as your ResumeDoctor account so your plan or credits attach automatically after payment.",
  },
  {
    id: "time-to-build",
    question: "How long does it take to create a resume?",
    answer:
      "Most users draft a credible first version in 5–15 minutes after picking a template. You can refine bullets with AI assist and export or share when ready.",
  },
  {
    id: "privacy-link",
    question: "Who can see my public resume link?",
    answer:
      "Only people you share the URL with. You control publishing and updates. See /resume-link and our Privacy Policy at /privacy for details.",
  },
];
