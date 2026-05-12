"use client";

import { useEffect, useState } from "react";
import { TestimonialCard } from "@/components/home/landing-ui";

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  text: string;
};

export function HomeTestimonialsMarquee({ testimonials }: { testimonials: readonly Testimonial[] }) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const marqueeTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  if (reduceMotion) {
    return (
      <div className="hidden md:block">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-pressed={paused}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
        >
          {paused ? "Play scrolling stories" : "Pause scrolling stories"}
        </button>
      </div>
      <div className="relative overflow-hidden">
        <div className={`landing-marquee-track flex w-max gap-6 ${paused ? "landing-marquee-paused" : ""}`}>
          {marqueeTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
