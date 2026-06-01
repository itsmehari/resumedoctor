"use client";

import Image, { type StaticImageData } from "next/image";
import heroBeforeAfter from "../../../Resumedoctor-heroimage.png";

const HERO_DESK_IMAGE = "/images/hero-desk-resume.png";

const HERO_IMAGES: { src: StaticImageData | string; alt: string; priority?: boolean }[] = [
  {
    src: heroBeforeAfter,
    alt: "Before and after resume example — more interviews",
    priority: true,
  },
  {
    src: HERO_DESK_IMAGE,
    alt: "Professional resume on laptop and desk — ResumeDoctor",
  },
];

type HeroVisualProps = {
  /** 0 = before/after, 1 = desk scene — synced with hero slider */
  activeVisual?: number;
  compact?: boolean;
};

export function HeroVisual({ activeVisual = 0, compact = false }: HeroVisualProps) {
  const index = activeVisual % HERO_IMAGES.length;

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
            priority={Boolean(item.priority) && compact === false && i === 0}
            sizes="(max-width: 1024px) 90vw, 48vw"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      ))}
    </div>
  );
}
