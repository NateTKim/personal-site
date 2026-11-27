// Presentational pieces of Orin's results screen, ported from the Orin repo
// (components/home-client.tsx Results/StatCard/SecondaryMetrics and
// components/business-health.tsx). Markup and classes are Orin's; the only
// changes are heading levels (h2→h3, h3→h4, to nest under this page's
// section heading), container-query breakpoints (the screen lives inside a
// browser frame, not a full viewport), props instead of direct data access
// so the NATE easter egg can reuse the same layout, and full-strength
// muted text for the 11px hints (Orin fades them to 70%, under AA contrast).
// Analysis is the site's own: the part the demo's preview collapses.
import { ArrowDownRight, ArrowUpRight, ExternalLink, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HealthFactor } from "@/lib/orin/score";

export const cardShell = "rounded-2xl bg-card shadow-card ring-sand-900/8";

export function ResultHeader({
  title,
  ticker,
  meta,
  href,
  hrefLabel = "Read the official report",
}: {
  title: string;
  ticker: string;
  meta: string;
  href: string;
  hrefLabel?: string;
}) {
  return (
    <Card className={cardShell}>
      <CardContent className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="font-display text-2xl font-medium tracking-tight">{title}</h3>
            <span className="rounded-md bg-accent px-2 py-0.5 text-sm font-medium tracking-wide text-accent-foreground ring-1 ring-brand-100">
              {ticker}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{meta}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2 rounded-xl bg-card")}
        >
          {hrefLabel}
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </CardContent>
    </Card>
  );
}

function FactorChip({
  factor,
}: {
  factor: Pick<HealthFactor, "direction" | "sentiment" | "label" | "detail">;
}) {
  const arrow = factor.direction === "up" ? "↑" : factor.direction === "down" ? "↓" : "→";
  const tone =
    factor.sentiment === "positive"
      ? "text-up"
      : factor.sentiment === "negative"
        ? "text-down"
        : "text-sand-500";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-50 px-2.5 py-1 text-xs ring-1 ring-sand-900/8">
      <span className={cn("font-semibold", tone)} aria-hidden>
        {arrow}
      </span>
      <span className="font-medium text-foreground/80">{factor.label}</span>
      <span className="text-muted-foreground">· {factor.detail}</span>
    </span>
  );
}

export function HealthCard({
  score,
  outOf,
  label,
  accent,
  timeframe,
  why,
  factors,
  disclaimer,
}: {
  score: string;
  outOf: string;
  label: string;
  accent: { text: string; tile: string; dot: string };
  timeframe: string;
  why: string;
  factors: ReadonlyArray<
    Pick<HealthFactor, "direction" | "sentiment" | "label" | "detail"> & { key: string }
  >;
  disclaimer: string;
}) {
  return (
    <section
      aria-label="Business health"
      className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-sand-900/8 @lg:p-6"
    >
      <div className="flex flex-col gap-5 @lg:flex-row @lg:items-stretch @lg:gap-6">
        <div
          className={cn(
            "flex shrink-0 flex-col items-center justify-center rounded-2xl px-7 py-4 ring-1",
            accent.tile,
          )}
        >
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-medium text-foreground tabular-nums">{score}</span>
            <span className="text-sm text-sand-700">{outOf}</span>
          </div>
          <span className={cn("mt-0.5 text-sm font-semibold", accent.text)}>{label}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("inline-block size-2 shrink-0 rounded-full", accent.dot)} aria-hidden />
              <h4 className="text-sm font-semibold tracking-tight">Business health</h4>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{timeframe}</p>
          </div>
          <p className="text-[15px] leading-6 text-foreground/90">{why}</p>
          <div className="flex flex-wrap gap-2">
            {factors.map((f) => (
              <FactorChip key={f.key} factor={f} />
            ))}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

export function MissCard({
  items,
  subtitle = "Things this report mentions quietly that deserve your attention",
  caption = "Our AI's reading of the report's own wording — a starting point for questions, not a verdict.",
  empty,
}: {
  items: readonly string[];
  subtitle?: string;
  caption?: string;
  empty?: string;
}) {
  return (
    <section aria-label="What most people miss" className="@4xl:col-span-3 @4xl:col-start-1 @4xl:row-start-1">
      <div className="relative h-full overflow-hidden rounded-2xl bg-card p-6 shadow-card-lg ring-1 ring-brand-200/70 @lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,--theme(--color-brand-100/45%),transparent_60%)]"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600/10 ring-1 ring-brand-600/20">
            <Eye className="size-5 text-brand-700" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h4 className="text-xl font-semibold tracking-tight">What most people miss</h4>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <ol className="relative mt-6 flex flex-col gap-4">
            {items.map((b, i) => (
              <li key={i} className="flex gap-4 rounded-xl bg-brand-50/60 p-4 ring-1 ring-brand-100/70">
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-[13px] font-semibold text-brand-700 tabular-nums"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <p className="max-w-[62ch] text-[15px] leading-7 text-foreground/90">{b}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="relative mt-6 text-sm leading-6 text-muted-foreground">
            {empty ?? "We couldn't produce insights for this report."}
          </p>
        )}

        <p className="relative mt-5 text-xs leading-5 text-muted-foreground">{caption}</p>
      </div>
    </section>
  );
}

export function StatCard({
  label,
  explain,
  value,
  change,
  emphasizeChangeColor = false,
}: {
  label: string;
  explain: string;
  value: string | null;
  change: number | null;
  emphasizeChangeColor?: boolean;
}) {
  const up = change !== null && change >= 0;
  const changeColor = up ? "text-up" : "text-down";
  return (
    <Card className={cardShell}>
      <CardContent className="flex flex-col gap-1 px-3 py-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </span>
          {change !== null &&
            (up ? (
              <ArrowUpRight className={cn("size-3.5", changeColor)} aria-hidden />
            ) : (
              <ArrowDownRight className={cn("size-3.5", changeColor)} aria-hidden />
            ))}
        </div>
        {value === null ? (
          <span className="text-sm text-muted-foreground">not reported</span>
        ) : (
          <span
            className={cn(
              "text-lg font-bold tracking-tight tabular-nums @sm:text-xl @lg:text-2xl",
              emphasizeChangeColor && change !== null && changeColor,
            )}
          >
            {value}
          </span>
        )}
        <span className="text-[11px] leading-4 text-muted-foreground">{explain}</span>
      </CardContent>
    </Card>
  );
}

export function MoreNumbers({
  title = "More numbers",
  rows,
}: {
  title?: string;
  rows: ReadonlyArray<{ label: string; explain: string; value: string | null }>;
}) {
  return (
    <Card className={cardShell}>
      <CardContent className="py-2">
        <h4 className="text-base font-semibold tracking-tight">{title}</h4>
        <dl className="mt-3 flex flex-col divide-y divide-border/70">
          {rows.map(({ label, explain, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="flex flex-col">
                <span className="text-sm text-foreground/80">{label}</span>
                <span className="text-[11px] leading-4 text-muted-foreground">{explain}</span>
              </dt>
              <dd className="text-right text-sm font-medium tabular-nums">
                {value === null ? (
                  <span className="font-normal text-muted-foreground">not reported</span>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function PlainEnglish({
  intro,
  notable,
  notableTitle = "What changed since last year",
  empty,
}: {
  intro: readonly string[];
  notable: readonly string[];
  notableTitle?: string;
  empty?: string;
}) {
  return (
    <section aria-label="Plain-English summary" className="@4xl:col-span-3 @4xl:col-start-1 @4xl:row-start-2">
      <Card className={cn(cardShell, "h-full")}>
        <CardContent className="flex flex-col gap-4 py-2">
          <h4 className="text-lg font-semibold tracking-tight">In plain English</h4>
          {intro.length > 0 || notable.length > 0 ? (
            <div className="flex flex-col gap-4">
              {intro.map((p, i) => (
                <p key={i} className="max-w-[68ch] text-[15px] leading-7 text-foreground/90">
                  {p}
                </p>
              ))}
              {notable.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <h5 className="text-sm font-semibold">{notableTitle}</h5>
                  <ul className="flex flex-col gap-2">
                    {notable.map((b, i) => (
                      <li
                        key={i}
                        className="flex max-w-[68ch] gap-2.5 text-[15px] leading-7 text-foreground/90"
                      >
                        <span
                          className="mt-[13px] size-1.5 shrink-0 rounded-full bg-primary/60"
                          aria-hidden
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              {empty ?? "The explanation is unavailable right now."}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

/** The id of a result's Analysis: what the demo's "Show the full analysis" button controls. */
export const ANALYSIS_ID = "orin-analysis";

/**
 * Everything in a result below its health card. While the demo's preview is collapsed this
 * part is clipped and faded out (orin-demo.tsx), and `inert` keeps it out of the
 * accessibility tree and the keyboard order.
 */
export function Analysis({ inert, children }: { inert: boolean; children: React.ReactNode }) {
  return (
    <div id={ANALYSIS_ID} inert={inert} className="flex flex-col gap-6">
      {children}
    </div>
  );
}

/** Orin's bento: insights + summary in the primary column, numbers beside. */
export function Bento({
  miss,
  side,
  summary,
}: {
  miss: React.ReactNode;
  side: React.ReactNode;
  summary: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-5 @4xl:grid-rows-[auto_1fr]">
      {miss}
      <div className="flex flex-col gap-6 @4xl:col-span-2 @4xl:col-start-4 @4xl:row-span-2 @4xl:row-start-1">
        {side}
      </div>
      {summary}
    </div>
  );
}
