import { alphaeon } from "@/content/work";
import { BeforeAfterChart } from "@/components/home/before-after-chart";
import { WindowFrame } from "@/components/site/window-frame";
import { RepoDiagram } from "./repo-diagram";
import { SpeedupCallout } from "./speedup-callout";
import { WorkCard } from "./work-card";
import { eyebrow, pane, splitPanes, secondPane } from "./panes";

/** Alphaeon Credit's visual, built from the resume's numbers only. Shared by the card and /work/alphaeon. */
export function AlphaeonVisual() {
  return (
    <WindowFrame size="sm" bodyClassName={splitPanes}>
      <figure className={pane}>
        <figcaption className={eyebrow}>Time per task, before and after</figcaption>
        <SpeedupCallout value={alphaeon.speedup} label={alphaeon.speedupLabel} />
        <BeforeAfterChart id="alphaeon-time" rows={alphaeon.time} />
        <p className="text-xs leading-5 text-subtle-foreground">
          &ldquo;Under 15 sec&rdquo; is drawn at 15 seconds, its upper bound. &ldquo;3&ndash;5 min&rdquo; is
          drawn as a range: solid to 3 minutes, hatched to 5.
        </p>
      </figure>
      <figure className={secondPane}>
        <figcaption className={eyebrow}>Scope</figcaption>
        <RepoDiagram
          id="alphaeon-repos"
          count={alphaeon.ticketCount}
          label={alphaeon.ticketLabel}
          repoCount={alphaeon.repoCount}
          stacks={alphaeon.stacks}
          className="lg:flex-1"
        />
      </figure>
    </WindowFrame>
  );
}

/** Alphaeon Credit: the card on the home page. */
export function AlphaeonCard() {
  return (
    <WorkCard meta={alphaeon}>
      <AlphaeonVisual />
    </WorkCard>
  );
}
