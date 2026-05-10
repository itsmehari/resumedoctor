"use client";

import Link from "next/link";
import { PricingFaqAccordion } from "@/components/pricing/pricing-faq-accordion";

const FAQ_ITEMS = [
  {
    id: "otp-vs-pass",
    question: "What is the difference between OTP Try and the ₹49 14-day pass?",
    answer: (
      <>
        <strong>Try</strong> is a short OTP session so you can explore the builder without a card. The{" "}
        <strong>₹49 · 14-day pass</strong> is a separate, India-only window of full Pro access purchased on SuperProfile —
        it is not the same as OTP Try. See{" "}
        <Link href="/pricing#trial">14-day pass details</Link> and{" "}
        <Link href="/pricing">full pricing</Link>.
      </>
    ),
  },
  {
    id: "superprofile-email",
    question: "Why do you mention SuperProfile and the same email?",
    answer: (
      <>
        Pro checkout runs on SuperProfile. Use the <strong>same email</strong> as your ResumeDoctor account so your plan
        attaches correctly. More context is on{" "}
        <Link href="/pricing">pricing</Link>.
      </>
    ),
  },
  {
    id: "resume-link-privacy",
    question: "Who can see my resume link?",
    answer: (
      <>
        Your public URL is meant for sharing with recruiters and contacts you choose. You control when you publish and
        what appears on the page. Read how the link works on{" "}
        <Link href="/resume-link">Resume link</Link> and our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </>
    ),
  },
  {
    id: "basic-vs-pro-export",
    question: "What do Basic and Pro include for exports?",
    answer: (
      <>
        TXT may be available on Basic where shown. Portal-ready PDF and Word for resumes typically require Pro or a resume
        pack; cover letter Word aligns with resume Word on Pro. Exact limits are on{" "}
        <Link href="/pricing">pricing</Link>. Signed-in users can also open{" "}
        <Link href="/cover-letters">Cover letters</Link> from the dashboard.
      </>
    ),
  },
];

export function FeaturesFaq() {
  return <PricingFaqAccordion items={FAQ_ITEMS} />;
}
