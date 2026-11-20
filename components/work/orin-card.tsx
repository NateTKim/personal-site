import Image from "next/image";
import { orin } from "@/content/work";
import { WindowFrame } from "@/components/site/window-frame";
import resultsShot from "@/public/orin/results.png";
import { WorkCard } from "./work-card";

/**
 * Orin: the one real image on the page, a live readorin.com result. Inside its
 * window Orin looks like Orin; the window chrome around it is the site's.
 */
export function OrinCard() {
  return (
    <WorkCard meta={orin}>
      <figure className="flex flex-col gap-3">
        <WindowFrame size="sm" title={orin.site}>
          <Image
            src={resultsShot}
            alt={orin.alt}
            placeholder="blur"
            // The nested window's width: the card's content box at each breakpoint.
            sizes="(min-width: 1360px) 1200px, (min-width: 640px) calc(88vw - 80px), calc(100vw - 74px)"
            className="block h-auto w-full"
          />
        </WindowFrame>
        <figcaption className="text-xs leading-5 text-subtle-foreground">{orin.caption}</figcaption>
      </figure>
    </WorkCard>
  );
}
