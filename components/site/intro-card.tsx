import { intro } from "@/content/profile";

/**
 * A short title card over the page on a visitor's first full load per browser session.
 * Server-rendered but hidden: it only shows while the pre-paint script in app/layout.tsx
 * has set html.intro (see "Intro card" in globals.css), so never with JS off, with
 * reduced motion, or on a client-side navigation. Decorative: hidden from assistive tech,
 * and nothing in it can take focus.
 */
export function IntroCard() {
  return (
    <div aria-hidden className="intro-card">
      <div className="intro-card-text">
        <p className="text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] leading-[1.04] display-type text-foreground text-glow">
          {intro.lead}
          <span className="serif-italic">{intro.italic}</span>
        </p>
        <p className="mt-4 text-[15px] leading-6 text-muted-foreground sm:mt-5 sm:text-[17px]">{intro.sub}</p>
      </div>
    </div>
  );
}
