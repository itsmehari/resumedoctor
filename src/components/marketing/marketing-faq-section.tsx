"use client";

import { PricingFaqAccordion, type PricingFaqItem } from "@/components/pricing/pricing-faq-accordion";
import type { FaqEntry } from "@/lib/faq-data";

export function MarketingFaqSection({ items }: { items: FaqEntry[] }) {
  const accordionItems: PricingFaqItem[] = items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return <PricingFaqAccordion items={accordionItems} />;
}
