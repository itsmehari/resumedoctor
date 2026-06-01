"use client";

import Image, { type StaticImageData } from "next/image";
import heroBeforeAfter from "../../../Resumedoctor-heroimage.png";
import { HERO_SLIDE_VISUAL_BY_INDEX } from "@/components/home/hero-slider-data";

const HERO_IMAGES: { src: StaticImageData | string; alt: string; priority?: boolean }[] = [
  {
    src: heroBeforeAfter,
    alt: "Before and after resume example — more interviews",
    priority: true,
  },
  {
    src: "/images/hero-desk-resume.png",
    alt: "Professional resume on laptop and desk — ResumeDoctor",
  },
  {
    src: "/images/hero-pro-trial-49.png",
    alt: "Try SuperProfile Pro — ₹49 for 14 days, PDF and Word export",
  },
  {
    src: "/images/hero-get-hired-laptop.png",
    alt: "Build a resume that gets you hired — ResumeDoctor on laptop",
  },
];

type HeroVisualProps = {
  /** Hero slide index (0–4) — picks the matching visual */
  slideIndex?: number;
  compact?: boolean;
};

export function HeroVisual({ slideIndex = 0, compact = false }: HeroVisualProps) {
  const visualIndex =
    HERO_SLIDE_VISUAL_BY_INDEX[slideIndex % HERO_SLIDE_VISUAL_BY_INDEX.length] ?? 0;
  const index = visualIndex % HERO_IMAGES.length;

  return (
    <div
      className={`relative w-full ${compact ? "" : "max-w-none lg:w-[115%] lg:-ml-[8%]"}`}
      style={{ aspectRatio: "4/3" }}
    >
      {HERO_IMAGES.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={item.src}
            alt={i === index ? item.alt : ""}
            fill
            priority={Boolean(item.priority) && !compact && i === 0}
            sizes="(max-width: 1024px) 90vw, 48vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      ))}
    </div>
  );
}
