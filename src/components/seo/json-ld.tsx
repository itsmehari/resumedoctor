/**
 * JSON-LD structured data for SEO, GEO, and AEO.
 * Helps search engines and AI systems understand the site.
 */
import { siteUrl, siteName } from "@/lib/seo";

export function HomeJsonLd() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description:
      "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/templates?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    description: "India-first resume and CV builder. ATS-friendly templates, PDF export, trusted by job seekers.",
    sameAs: [], // Add LinkedIn, Twitter, etc. when available
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates and export to PDF.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "127",
    },
    featureList: "Export to Naukri, LinkedIn, Indeed, TimesJobs, Shine",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
    </>
  );
}

const FAQ_ITEMS = [
  {
    question: "What is ResumeDoctor?",
    answer:
      "ResumeDoctor is an India-first online resume and CV builder that helps you create ATS-friendly resumes in minutes. You get professional templates, expert content suggestions, and export to PDF and Word.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. ResumeDoctor offers a free forever plan with unlimited resumes, TXT export, print/HTML preview, and all section types. You can try the builder free for 5 minutes with just your email—no signup required.",
  },
  {
    question: "How do I export my resume to PDF?",
    answer:
      "Upgrade to the Pro plan (₹199/month) to unlock PDF and Word export. Free users can export as TXT and use print preview. Pro also removes watermarks.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "Yes. All ResumeDoctor templates are designed for Applicant Tracking Systems used by Naukri, LinkedIn, Indeed, and other job portals. They use clean layouts and standard section structures.",
  },
  {
    question: "How long does it take to create a resume?",
    answer:
      "Most users finish a professional resume in 5–15 minutes. You can try free for 5 minutes with just your email to see how it works.",
  },
];

export function FaqJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export function HowToJsonLd() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Create a Resume in 5 Minutes with ResumeDoctor",
    description: "Step-by-step guide to building a professional, ATS-friendly resume in minutes.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose a template",
        text: "Select from professional, ATS-friendly resume templates (Modern Blue, Classic Green, Minimalist, and more).",
      },
      {
        "@type": "HowToStep",
        name: "Add your details",
        text: "Fill in your work experience, education, skills, and summary. Use power words and bullet points for impact.",
      },
      {
        "@type": "HowToStep",
        name: "Export and apply",
        text: "Download your resume as PDF or Word and apply directly to Naukri, LinkedIn, Indeed, and other job portals.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
    />
  );
}

export { FAQ_ITEMS };
