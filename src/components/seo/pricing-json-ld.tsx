import { siteUrl } from "@/lib/seo";

const PRICING_FAQ = [
  { q: "How do I pay for Pro?", a: "Pay through SuperProfile on the pricing page. Use the same email as your ResumeDoctor account for automatic activation." },
  { q: "What are the plan options?", a: "Use Try for quick OTP preview, choose the optional 14-day full-Pro pass in India, or purchase Pro monthly/annual on SuperProfile." },
  { q: "Is Pro a subscription? Can I get a refund?", a: "Pro is a one-time purchase per tier (no automatic renewals). Contact support for refund requests; we treat them case by case." },
];

export function PricingJsonLd() {
  const products = [
    {
      "@type": "Product",
      name: "ResumeDoctor Pro (example: monthly tier)",
      description: "PDF and Word export, no watermarks, all templates, and higher limits. Sold as a one-time purchase on SuperProfile; prices vary by tier.",
      offers: {
        "@type": "Offer",
        price: "199",
        priceCurrency: "INR",
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    },
  ];

  const productList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: p,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
