"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function TrackedFeaturesLink({
  href,
  event,
  eventParams,
  children,
  onClick,
  ...rest
}: {
  href: string;
  event: string;
  eventParams?: Record<string, unknown>;
} & Omit<LinkProps, "href">) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        trackEvent(event, { target: href, ...eventParams });
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
