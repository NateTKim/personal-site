"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Light scroll reveals. Elements marked `data-reveal` fade up once (260ms,
 * CSS in globals.css) as they enter the viewport. Nothing is hidden until
 * this runs, and anything already on screen is marked visible first, so
 * there is no flash. Skipped entirely for reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    const vh = window.innerHeight;
    for (const el of pending) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.setAttribute("data-in", "");
    }
    document.documentElement.classList.add("reveal-on");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of pending) if (!el.hasAttribute("data-in")) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
