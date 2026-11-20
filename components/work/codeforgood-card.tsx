import { codeforgood } from "@/content/work";
import { WindowFrame } from "@/components/site/window-frame";
import { cn } from "@/lib/utils";
import { WorkCard } from "./work-card";
import { eyebrow, pane, secondPane, splitPanes } from "./panes";

const [signups, members, teams] = codeforgood.funnel;
const pct = (n: number) => `${(n / signups.value) * 100}%`;

/**
 * CodeForGood's visual (shared by the card and /work/codeforgood): a funnel
 * from signups to members (bars on one scale of people, starting at zero;
 * "120+" is drawn at 120) to project teams (a different unit, so one block per
 * team instead of a bar), and the named partners. The number column is as wide
 * as the widest number (a subgrid), so the bars line up.
 */
export function CodeForGoodVisual() {
  return (
    <WindowFrame size="sm" bodyClassName={cn(splitPanes, "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]")}>
      <figure className={pane}>
        <figcaption className={eyebrow}>From signups to project teams</figcaption>
        <ol className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-5">
          {[signups, members].map((step) => (
            <Step key={step.key} display={step.display} label={step.label}>
              <svg aria-hidden className="block h-2.5 w-full">
                <rect width="100%" height="100%" rx="2" className="fill-white/[0.06]" />
                <rect width={pct(step.value)} height="100%" rx="2" className="fill-(--bar-before)" />
              </svg>
            </Step>
          ))}
          <Step display={teams.display} label={teams.label} accent>
            <span aria-hidden className="flex flex-wrap gap-1.5">
              {Array.from({ length: teams.value }, (_, i) => (
                <span key={i} className="size-2.5 rounded-[3px] bg-data" />
              ))}
            </span>
          </Step>
        </ol>
        <p className="text-xs leading-5 text-subtle-foreground">
          Signups and members share one scale; &ldquo;120+&rdquo; is drawn at 120. Each block is one team.
        </p>
      </figure>
      <div className={secondPane}>
        <p className={eyebrow} id="codeforgood-partners">
          Partners include
        </p>
        <ul aria-labelledby="codeforgood-partners" className="flex flex-wrap gap-2">
          {codeforgood.partners.map((p) => (
            <li
              key={p}
              className="rounded-(--tag-radius) border border-frame-border bg-white/[0.02] px-3 py-1.5 text-[13px] leading-5 text-foreground"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </WindowFrame>
  );
}

/** CodeForGood: the card on the home page. */
export function CodeForGoodCard() {
  return (
    <WorkCard meta={codeforgood}>
      <CodeForGoodVisual />
    </WorkCard>
  );
}

function Step({
  display,
  label,
  accent = false,
  children,
}: {
  display: string;
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="col-span-2 grid grid-cols-subgrid items-end">
      <span
        className={cn(
          "text-[2.5rem] leading-none display-type tabular-nums sm:text-5xl",
          accent ? "text-data" : "text-foreground",
        )}
      >
        {display}
        <span className="sr-only"> {label}</span>
      </span>
      <span aria-hidden className="flex flex-col gap-2 pb-1">
        <span className="text-[13px] leading-4 text-muted-foreground">{label}</span>
        {children}
      </span>
    </li>
  );
}
