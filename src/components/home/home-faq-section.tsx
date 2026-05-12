"use client";

import Link from "next/link";
import { PricingFaqAccordion } from "@/components/pricing/pricing-faq-accordion";
import { FAQ_ITEMS } from "@/components/seo/json-ld";

export function HomeFaqSection() {
  const items = FAQ_ITEMS.map((item, index) => ({
    id: `home-faq-${index}`,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24 dark:from-slate-900/40 dark:to-slate-950" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-500">Still in doubt?</p>
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Quick answers before you start your resume.</p>
        </div>
        <PricingFaqAccordion items={items} />
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Still have questions?{" "}
          <Link href="/blog" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Read our resume guides
          </Link>
        </p>
      </div>
    </section>
  );
}
