/**
 * JSON-LD for resume link pages — SEO + GEO + AEO (@graph bundle).
 */
import { siteUrl, siteName } from "@/lib/seo";
import {
  RESUME_LINK_AEO_DEFINITION,
  RESUME_LINK_CANONICAL,
  RESUME_LINK_DEMO_URL,
  RESUME_LINK_FAQS,
  RESUME_LINK_HOW_TO_STEPS,
  RESUME_LINK_USE_CASES,
  type ResumeLinkFaq,
} from "@/lib/resume-link-seo-data";

function faqMainEntity(items: ResumeLinkFaq[]) {
  return items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  }));
}

type ResumeLinkJsonLdProps = {
  pageUrl: string;
  pageName: string;
  pageDescription: string;
  breadcrumbs: { name: string; url: string }[];
  faqs?: ResumeLinkFaq[];
  includeHowTo?: boolean;
};

/** Full @graph for /resume-link and /lp/resume-link-india. */
export function ResumeLinkPageJsonLd({
  pageUrl,
  pageName,
  pageDescription,
  breadcrumbs,
  faqs = RESUME_LINK_FAQS,
  includeHowTo = true,
}: ResumeLinkJsonLdProps) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      inLanguage: "en-IN",
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      },
      about: {
        "@type": "Thing",
        name: "Shareable resume link",
        description: RESUME_LINK_AEO_DEFINITION,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#resume-link-definition", "#resume-link-faq"],
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqMainEntity(faqs),
    },
    {
      "@type": "ItemList",
      name: "Where to share your resume link in India",
      description: "Channels Indian job seekers use to share a live CV URL.",
      numberOfItems: RESUME_LINK_USE_CASES.length,
      itemListElement: RESUME_LINK_USE_CASES.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        description: item.description,
      })),
    },
    {
      "@type": "Service",
      name: "ResumeDoctor Resume Link",
      provider: {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      description: RESUME_LINK_AEO_DEFINITION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free resume link publishing",
        url: pageUrl,
      },
    },
  ];

  if (includeHowTo) {
    graph.push({
      "@type": "HowTo",
      "@id": `${pageUrl}#howto`,
      name: "How to share your resume as a link on WhatsApp and LinkedIn",
      description:
        "Publish a live resume URL on ResumeDoctor and share it with recruiters in India without sending PDF attachments.",
      inLanguage: "en-IN",
      step: RESUME_LINK_HOW_TO_STEPS.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** Demo page — WebPage + ExampleOfWork (citable live sample). */
export function ResumeLinkDemoJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${RESUME_LINK_DEMO_URL}#webpage`,
        url: RESUME_LINK_DEMO_URL,
        name: "ResumeDoctor live resume link demo",
        description:
          "Working example of a shareable resume link — see how recruiters view your CV on mobile and desktop.",
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
        isBasedOn: RESUME_LINK_CANONICAL,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Resume link", item: RESUME_LINK_CANONICAL },
          { "@type": "ListItem", position: 3, name: "Live demo", item: RESUME_LINK_DEMO_URL },
        ],
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** Homepage resume-link section — helps AI connect product capability to URL. */
export function HomeResumeLinkCapabilityJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    name: "Resume link capability",
    description: RESUME_LINK_AEO_DEFINITION,
    url: RESUME_LINK_CANONICAL,
    isPartOf: siteUrl,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
