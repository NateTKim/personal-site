import { hero } from "@/content/profile";
import { HeroZoom } from "./hero-zoom";
import { WindowDots } from "./window-frame";

/**
 * The hero: one window holding the headline. On scroll it grows from an inset,
 * rounded frame to full bleed, then scrolls away (see HeroZoom and the
 * "Hero zoom" block in globals.css). Static with JS off or reduced motion.
 */
export function Hero() {
  return (
    <HeroZoom labelledBy="hero-title">
      {/* The window's chrome: border ring, body, title bar. Drawn behind the text. */}
      <div className="hero-ring" aria-hidden />
      <div className="hero-body" aria-hidden>
        <div className="hero-bar" />
        <div className="hero-dots">
          <WindowDots />
        </div>
      </div>

      <div className="hero-content">
        <div className="mx-auto w-full max-w-[76rem]">
          <h1
            id="hero-title"
            className="text-[clamp(2.375rem,1.1rem+5.6vw,6rem)] leading-[1.02] display-type text-balance text-foreground text-glow"
          >
            {hero.lead}
            {/* The italic phrase always starts its own line. */}
            <br />
            <span className="serif-italic">{hero.italic}</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-pretty text-muted-foreground sm:mt-8 sm:text-xl sm:leading-relaxed">
            {hero.sub}
          </p>
        </div>
      </div>
    </HeroZoom>
  );
}
