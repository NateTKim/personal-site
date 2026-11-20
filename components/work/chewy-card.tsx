import { Info } from "lucide-react";
import { chewy } from "@/content/work";
import { WindowFrame } from "@/components/site/window-frame";
import { WorkCard } from "./work-card";
import { eyebrow, pane, secondPane, splitPanes } from "./panes";

/** The price scale runs from $0, so the upside bar is in proportion. */
const SCALE_MAX = 40;
const DOLLAR_TICKS = [0, 10, 20, 30, 40];
const x = (dollars: number) => `${(dollars / SCALE_MAX) * 100}%`;

/**
 * Chewy equity research's visual (shared by the card and /work/chewy): the
 * pitch as a card (rating, target against the share price, upside) and the key
 * assumptions the pitch defended. Labelled as a student club pitch, not
 * investment advice.
 *
 * The two prices sit side by side at every width. Below 640px their size
 * follows the width of the row (cqi units on the <dl>'s container), so on a
 * 320px screen both still fit their columns.
 */
export function ChewyVisual() {
  const { priceTarget, sharePrice } = chewy;
  return (
    <WindowFrame size="sm" bodyClassName={splitPanes}>
      <figure className={pane}>
        <figcaption className="flex items-start gap-2 text-[13px] leading-5 text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {chewy.disclaimer}
        </figcaption>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-(--tag-radius) border border-foreground/50 px-3 py-0.5 text-sm leading-6 font-semibold tracking-wider text-foreground">
            {chewy.rating}
          </span>
          <span className="text-sm text-muted-foreground">Chewy · {chewy.ticker}</span>
        </div>

        <dl className="@container grid grid-cols-2 gap-x-6">
          <div className="flex flex-col gap-1.5">
            <dt className={eyebrow}>Price target</dt>
            <dd className="text-[clamp(1.75rem,14cqi,2.25rem)] leading-none display-type text-data tabular-nums sm:text-6xl">
              {priceTarget.label}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className={eyebrow}>Share price</dt>
            <dd className="text-[clamp(1.75rem,14cqi,2.25rem)] leading-none display-type text-foreground tabular-nums sm:text-6xl">
              {sharePrice.label}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5">
          <p className="flex items-baseline justify-between gap-3">
            <span className={eyebrow}>Upside from {sharePrice.label}</span>
            <span className="text-2xl leading-none display-type text-data tabular-nums">{chewy.upside}</span>
          </p>
          <svg aria-hidden className="block h-2.5 w-full">
            <rect width="100%" height="100%" rx="2" className="fill-white/[0.06]" />
            <rect width={x(sharePrice.value)} height="100%" rx="2" className="fill-(--bar-before)" />
            <rect
              x={x(sharePrice.value)}
              width={x(priceTarget.value - sharePrice.value)}
              height="100%"
              rx="2"
              className="fill-data"
            />
          </svg>
          <svg aria-hidden className="block h-4 w-full overflow-visible label-text tabular-nums">
            {DOLLAR_TICKS.map((d, i) => (
              <text
                key={d}
                x={x(d)}
                y="11"
                textAnchor={i === 0 ? "start" : i === DOLLAR_TICKS.length - 1 ? "end" : "middle"}
                className="fill-subtle-foreground"
              >
                ${d}
              </text>
            ))}
          </svg>
        </div>
      </figure>

      <div className={secondPane}>
        <p className={eyebrow} id="chewy-assumptions">
          Key assumptions
        </p>
        <ol aria-labelledby="chewy-assumptions" className="flex flex-col divide-y divide-frame-divider">
          {chewy.assumptions.map((a, i) => (
            <li key={a.key} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 py-4 first:pt-0 last:pb-0">
              <span aria-hidden className="text-sm leading-6 text-subtle-foreground tabular-nums">
                0{i + 1}
              </span>
              <span className="text-[15px] leading-6 text-foreground">{a.title}</span>
            </li>
          ))}
        </ol>
        <p className="text-[13px] leading-5 text-muted-foreground">{chewy.assumptionsNote}</p>
      </div>
    </WindowFrame>
  );
}

/** Chewy equity research: the card on the home page. */
export function ChewyCard() {
  return (
    <WorkCard meta={chewy}>
      <ChewyVisual />
    </WorkCard>
  );
}
