import { siteUrl } from "@/lib/seo";

const PRICING_FAQ = [
  { q: "How do I pay for Pro?", a: "Pay via UPI (Google Pay, PhonePe, or any UPI app) by scanning the QR code. Email us after payment to activate your Pro account." },
  { q: "What's included in the free plan?", a: "Unlimited resumes, TXT export, print/HTML preview, and all section types. You can create and edit as many resumes as you need." },
  { q: "Can I cancel Pro anytime?", a: "Yes. Pro is billed monthly. You can cancel before the next billing cycle. Contact us for refund requests." },
];

export function PricingJsonLd() {
  const products = [
    {
      "@type": "Product",
      name: "ResumeDoctor Free",
      description: "Unlimited resumes, TXT export, print/HTML preview, all section types.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    },
    {
      "@type": "Product",
      name: "ResumeDoctor Pro",
      description: "Everything in Free plus PDF export, Word export, no watermarks.",
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
