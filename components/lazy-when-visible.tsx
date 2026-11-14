"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders `children` only once the placeholder is near the viewport, so
 * heavy client-only pieces (Recharts) don't load or run during page load.
 * The placeholder keeps the same height to avoid layout shift.
 */
export function LazyWhenVisible({
  children,
  placeholderClassName,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  placeholderClassName: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  if (visible) return <>{children}</>;
  return <div ref={ref} className={cn("js-only", placeholderClassName)} aria-hidden />;
}
