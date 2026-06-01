"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  FALLBACK_TRIAL_14_URL,
  resolveSuperprofileCheckoutHref,
} from "@/components/pricing/superprofile-pricing-links";
import {
  HERO_SLIDER_INTERVAL_MS,
  HERO_SLIDES,
  type HeroSlide,
} from "@/components/home/hero-slider-data";

const TRIAL_CHECKOUT_URL = resolveSuperprofileCheckoutHref(
  process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14,
  FALLBACK_TRIAL_14_URL
);

function renderHeadline(slide: HeroSlide) {
  const { headline, headlineHighlight } = slide;
  if (!headlineHighlight || !headline.includes(headlineHighlight)) {
    return headline;
  }

  const [before, after] = headline.split(headlineHighlight);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-amber-200 via-accent to-amber-300 bg-clip-text text-transparent">
        {headlineHighlight}
      </span>
      {after}
    </>
  );
}

function openSuperprofileCheckout(slideId: string) {
  trackEvent("hero_slider_cta_click", {
    slide_id: slideId,
    cta_href: TRIAL_CHECKOUT_URL,
    cta_kind: "superprofile_trial",
  });
  trackEvent("superprofile_checkout_click", { label: "hero_slider_trial_14" });
}

function SlideCta({ slide }: { slide: HeroSlide }) {
  const base =
    slide.ctaVariant === "trial"
      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-900/15 dark:bg-orange-600 dark:hover:bg-orange-500"
      : "bg-accent text-accent-dark hover:bg-accent-hover shadow-black/30";

  const className = `inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-6 py-3.5 text-center text-base font-bold transition-all shadow-xl active:scale-[0.98] sm:w-auto sm:px-8 sm:py-4 ${base}`;

  return (
    <a
      href={TRIAL_CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => openSuperprofileCheckout(slide.id)}
      className={className}
    >
      {slide.ctaLabel}
      <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
    </a>
  );
}

export function HeroSlider({
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: {
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
} = {}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex ?? internalIndex;
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());

  const slide = HERO_SLIDES[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      const next = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
      if (onActiveIndexChange) {
        onActiveIndexChange(next);
      } else {
        setInternalIndex(next);
      }
    },
    [onActiveIndexChange]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const current = HERO_SLIDES[activeIndex];
    const key = `${current.id}-${activeIndex}`;
    if (trackedRef.current.has(key)) return;
    trackedRef.current.add(key);
    trackEvent("hero_slider_view", { slide_id: current.id, slide_index: activeIndex });
  }, [activeIndex]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => goNext(), HERO_SLIDER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, goNext]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  return (
    <div
      className="relative w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 text-center lg:text-left"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/90 sm:text-xs">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" aria-hidden />
        {slide.eyebrow}
      </div>

      <div aria-live="polite" aria-atomic="true" className="relative min-h-[280px] sm:min-h-[300px] lg:min-h-[320px]">
        <div key={slide.id} className="animate-fade-in">
          <h1 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.35rem]">
            {renderHeadline(slide)}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-white/85 sm:mt-4 sm:text-lg lg:max-w-lg">
            {slide.subheadline}
          </p>

          <div
            className={`mt-4 inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 rounded-xl border px-3 py-2 sm:mt-5 sm:px-4 sm:py-2.5 lg:justify-start ${
              slide.priceAmount === "Free"
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-orange-400/30 bg-orange-500/10"
            }`}
          >
            <span
              className={`text-2xl font-extrabold tabular-nums sm:text-3xl lg:text-4xl ${
                slide.priceAmount === "Free" ? "text-emerald-300" : "text-orange-300"
              }`}
            >
              {slide.priceAmount ?? "₹49"}
            </span>
            <span className="text-xs font-medium text-white/80 sm:text-sm">{slide.priceDetail}</span>
          </div>

          <p className="mt-2 text-xs text-white/75 sm:text-sm">{slide.proofLine}</p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <SlideCta slide={slide} />
            <Link
              href={slide.secondaryHref}
              className="text-center text-sm font-semibold text-white/80 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              {slide.secondaryLabel} →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8 sm:gap-3 lg:justify-start">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex flex-1 max-w-[200px] sm:max-w-none items-center justify-center gap-1.5 sm:gap-2" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Slide ${index + 1}: ${item.headline}`}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                index === activeIndex ? "w-7 sm:w-8 bg-accent" : "w-2 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
