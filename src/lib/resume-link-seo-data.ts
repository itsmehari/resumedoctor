/**
 * Resume link SEO, GEO & AEO — single source of truth for metadata, FAQs, and JSON-LD.
 * Optimized for Google, Bing, and AI answer engines (ChatGPT, Perplexity, Gemini).
 */
import { siteUrl, siteName } from "@/lib/seo";
import { FREE_LINK_SLUG_EXAMPLE } from "@/lib/resume-link-utils";

export const RESUME_LINK_OG_IMAGE = `${siteUrl}/og-image.png`;

export const RESUME_LINK_CANONICAL = `${siteUrl}/resume-link`;
export const RESUME_LINK_INDIA_LP = `${siteUrl}/lp/resume-link-india`;
export const RESUME_LINK_DEMO_URL = `${siteUrl}/r/demo`;

/** Plain-language definition block — lead with this for AEO citation. */
export const RESUME_LINK_AEO_DEFINITION =
  "A resume link is a public web URL (for example resumedoctor.in/r/your-slug) that shows your current CV in the browser. Unlike a PDF attachment, the link always reflects your latest edit, opens in one tap on WhatsApp and LinkedIn, and works on any phone without a download.";

export const RESUME_LINK_METADATA = {
  title: "Resume Link — Share Your CV as a URL | ResumeDoctor India",
  description:
    "Publish a free resume link for WhatsApp, LinkedIn & email. One URL always shows your latest CV — no PDF re-sends. India-first builder with optional Pro Link custom URL.",
  keywords: [
    "resume link",
    "resume link India",
    "share resume online",
    "shareable resume URL",
    "online resume link",
    "WhatsApp resume link",
    "LinkedIn resume link",
    "live resume",
    "resume URL",
    "CV link India",
    "share CV on WhatsApp",
    "resume link vs PDF",
    "Naukri resume link",
  ],
};

export const RESUME_LINK_INDIA_LP_METADATA = {
  title: "Share Resume on WhatsApp India — Live CV Link | ResumeDoctor",
  description:
    "Stop sending PDF attachments. Publish one resume link for WhatsApp, LinkedIn DMs, Naukri follow-ups & QR cards. Free on ResumeDoctor — always shows your latest version.",
  keywords: [
    "share resume WhatsApp India",
    "resume link India",
    "CV link WhatsApp",
    "online resume India",
    "shareable CV URL",
  ],
};

export const RESUME_LINK_DEMO_METADATA = {
  title: "Live Demo — Resume as a Link | ResumeDoctor",
  description:
    "See a working ResumeDoctor resume link on mobile and desktop. Example CV at resumedoctor.in/r/demo — then publish your own free link in minutes.",
};

export type ResumeLinkFaq = { q: string; a: string };

/** Expanded FAQs tuned for voice search and AI answer extraction. */
export const RESUME_LINK_FAQS: ResumeLinkFaq[] = [
  {
    q: "What is a resume link?",
    a: RESUME_LINK_AEO_DEFINITION,
  },
  {
    q: "How do I share my resume on WhatsApp in India?",
    a: `Build your CV on ResumeDoctor, click Share in the editor, and copy your link (for example resumedoctor.in/r/${FREE_LINK_SLUG_EXAMPLE}). Paste it in a WhatsApp chat — recruiters open it in one tap without downloading a PDF.`,
  },
  {
    q: "Is a resume link better than a PDF?",
    a: "For mobile-first sharing (WhatsApp, LinkedIn DMs, email signatures), a link is usually better: it always shows your latest version, opens instantly, and avoids version chaos like resume-final-v2.pdf. PDFs are still useful when a job portal requires a file upload — ResumeDoctor exports PDF on Pro.",
  },
  {
    q: "Is the ResumeDoctor resume link free?",
    a: "Yes. Publishing a public resume link is free on ResumeDoctor. You get an auto-generated URL. Pro Link (₹99/mo or included with Pro annual) adds a custom URL like /r/your-name, view analytics, and removes the footer on your public page.",
  },
  {
    q: "Is the link always up to date?",
    a: "Yes. When you edit your resume in ResumeDoctor, every shared link shows the latest saved version on the next visit. You do not need to re-send or re-publish.",
  },
  {
    q: "Can I unpublish my resume link?",
    a: "Yes. Stop sharing from the editor at any time. Existing copies of the URL will then show a not-found page.",
  },
  {
    q: "Will my resume link appear on Google search?",
    a: "By default, no. Public resume pages use noindex to protect your privacy — the link is for people you share with, not open web discovery. Marketing pages like /resume-link are indexed.",
  },
  {
    q: "Can I use a custom URL like /r/my-name?",
    a: "Yes with Pro Link. Claim a vanity slug from the Share panel (e.g. /r/hari-krishnan). Your old random URL keeps working so previous shares never break.",
  },
  {
    q: "How do I see who viewed my resume link?",
    a: "Pro Link shows anonymous view counts and last-opened time in the Share popover. We do not log visitor identities — bot traffic is filtered.",
  },
  {
    q: "Does the link work on WhatsApp and LinkedIn?",
    a: "Yes. Shared links include rich preview cards (name, role, branded image) on WhatsApp, LinkedIn, iMessage, Slack, and most email clients.",
  },
  {
    q: "How do I add my resume link to my email signature?",
    a: "Copy your published URL from the Share button and paste it as a hyperlink under your name in Gmail, Outlook, or your company signature template.",
  },
  {
    q: "Can I use a QR code for my resume link?",
    a: "Yes. After publishing, download a QR PNG from the Share panel and print it on business cards, campus fair banners, or networking handouts.",
  },
];

export const RESUME_LINK_HOW_TO_STEPS = [
  {
    name: "Build your resume",
    text: "Sign in or use OTP Try on ResumeDoctor. Pick an India-friendly template and fill experience, education, and skills with AI-assisted bullets.",
  },
  {
    name: "Publish your link",
    text: `Open Share in the editor. ResumeDoctor generates a URL like resumedoctor.in/r/${FREE_LINK_SLUG_EXAMPLE} — copy it to your clipboard.`,
  },
  {
    name: "Share on WhatsApp, LinkedIn, or email",
    text: "Paste the link in recruiter chats, LinkedIn DMs, your email signature, or download a QR for in-person networking. Edit anytime — the link stays current.",
  },
];

export const RESUME_LINK_USE_CASES = [
  {
    name: "WhatsApp job applications",
    description: "Recruiters in India open links in one tap — no PDF download on mobile.",
  },
  {
    name: "LinkedIn direct messages",
    description: "Follow up after applying with a single URL instead of re-attaching files.",
  },
  {
    name: "Email signature",
    description: "Every email becomes a soft pitch with your live CV under your name.",
  },
  {
    name: "QR on business cards",
    description: "Print a QR to your resume link for campus drives and networking events.",
  },
  {
    name: "Naukri and portal follow-ups",
    description: "Send one current link after applying on job portals when recruiters ask for your CV.",
  },
];

export const RESUME_LINK_VS_PDF_ROWS = [
  {
    aspect: "Always latest version",
    link: "Yes — edit once, every shared link updates",
    pdf: "No — must re-send after every edit",
  },
  {
    aspect: "Mobile (WhatsApp)",
    link: "Opens in one tap in browser",
    pdf: "Download, open app, pinch-to-zoom",
  },
  {
    aspect: "Recruiter friction",
    link: "Low — tap and read",
    pdf: "Higher — attachment fatigue",
  },
  {
    aspect: "Job portal upload",
    link: "Use when sharing directly with people",
    pdf: "Often required for Naukri/portal forms",
  },
  {
    aspect: "Cost on ResumeDoctor",
    link: "Free to publish",
    pdf: "Free preview; PDF export on Pro",
  },
];

export const RESUME_LINK_LP_FAQS: ResumeLinkFaq[] = RESUME_LINK_FAQS.slice(0, 6);
