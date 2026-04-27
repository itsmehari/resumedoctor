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
    description: "India-first resume and CV builder. ATS-friendly templates; PDF and Word with Pro.",
    sameAs: [], // Add LinkedIn, Twitter, etc. when available
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Create ATS-friendly resumes and CVs in minutes. India-first resume builder with premium templates. Export to TXT on the free plan; PDF and Word with Pro.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: "ATS-friendly templates; TXT export on free plan; PDF and Word on Pro; India job portals",
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
      "Yes. ResumeDoctor offers a free forever plan with unlimited resumes, TXT export, print/HTML preview, 10 base templates, and all section types. You can also start a short browser trial with email verification—no credit card.",
  },
  {
    question: "How do I export my resume to PDF?",
    answer:
      "Upgrade to Pro with a one-time purchase on SuperProfile (for example, the monthly tier is ₹199). That unlocks PDF and Word export and removes watermarks. Free users can export as TXT and use print preview.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "Yes. All ResumeDoctor templates are designed for Applicant Tracking Systems used by Naukri, LinkedIn, Indeed, and other job portals. They use clean layouts and standard section structures.",
  },
  {
    question: "How long does it take to create a resume?",
    answer:
      "Most users finish a professional resume in 5–15 minutes. Start a quick trial from the home page to explore the builder before you sign up.",
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

/** Article JSON-LD for blog posts (WBS 12.7) */
export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteUrl}/blog/${slug}`,
    datePublished: date,
    author: {
      "@type": "Organization",
      name: author || siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.png` },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
    />
  );
}

/** BreadcrumbList for blog and example pages (Todo 13) */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** ItemList for /examples index (WBS 12.7) */
export function ExamplesItemListJsonLd({
  examples,
}: {
  examples: { slug: string; title: string; description: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Resume Examples by Role – India",
    description: "Free resume examples for Software Engineer, Fresher, Data Analyst, Marketing, BPO, and more.",
    numberOfItems: examples.length,
    itemListElement: examples.map((ex, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ex.title,
      description: ex.description,
      url: `${siteUrl}/examples/${ex.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** HowTo for /examples/[slug] – "How to write a [Role] resume" (WBS 12.7) */
export function ExampleHowToJsonLd({
  title,
  description,
  slug,
  steps,
}: {
  title: string;
  description: string;
  slug: string;
  steps: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Write a ${title.replace(/ Resume Example$/i, "")} Resume`,
    description,
    url: `${siteUrl}/examples/${slug}`,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
