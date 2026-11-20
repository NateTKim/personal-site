import { businessSoftware } from "@/content/work";
import { BeforeAfterChart } from "@/components/home/before-after-chart";
import { WindowFrame } from "@/components/site/window-frame";
import { cn } from "@/lib/utils";
import { SpeedupCallout } from "./speedup-callout";
import { WorkCard } from "./work-card";
import { eyebrow, pane, secondPane, splitPanes } from "./panes";

/**
 * Business-Software's visual (shared by the card and /work/business-software):
 * the admin task's time before and after the dashboard (the same chart as
 * Alphaeon's, on a 0–10 minute scale), and the scale of the platform it was
 * built for. Those are the platform's figures, not Nate's, and the panel says
 * so. It is drawn like the stats strip: number over label, hairline between,
 * accent on the numbers only. The numbers sit level with the "10x" beside them
 * and the note level with the chart's axis.
 */
export function BusinessSoftwareVisual() {
  return (
    <WindowFrame size="sm" bodyClassName={splitPanes}>
      <figure className={pane}>
        <figcaption className={eyebrow}>Time per task, before and after</figcaption>
        <SpeedupCallout value={businessSoftware.speedup} label={businessSoftware.speedupLabel} />
        <BeforeAfterChart
          id="business-software-time"
          rows={businessSoftware.time}
          maxSeconds={600}
          minutes={[0, 2, 4, 6, 8, 10]}
        />
      </figure>

      <figure className={secondPane}>
        <figcaption className={eyebrow}>{businessSoftware.platformLabel}</figcaption>
        {/* 1fr (not minmax(0, 1fr)): a column never gets narrower than its number. */}
        <dl className="grid grid-cols-[1fr_1fr]">
          {businessSoftware.platform.map((f, i) => (
            <div
              key={f.key}
              className={cn(
                "flex flex-col-reverse justify-end gap-2.5",
                i > 0 ? "border-l border-frame-divider pl-4 sm:pl-6" : "pr-4 sm:pr-6",
              )}
            >
              <dt className="text-[13px] leading-snug text-muted-foreground">{f.label}</dt>
              <dd className="text-[2rem] leading-none display-type whitespace-nowrap text-data tabular-nums sm:text-5xl">
                {f.display}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[13px] leading-snug text-subtle-foreground lg:mt-auto">
          {businessSoftware.platformNote}
        </p>
      </figure>
    </WindowFrame>
  );
}

/** Business-Software: the card on the home page. */
export function BusinessSoftwareCard() {
  return (
    <WorkCard meta={businessSoftware}>
      <BusinessSoftwareVisual />
    </WorkCard>
  );
}
