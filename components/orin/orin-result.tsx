"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LazyWhenVisible } from "@/components/lazy-when-visible";
import { computeBusinessHealth } from "@/lib/orin/score";
import { HEALTH_COLORS } from "@/lib/orin/colors";
import { formatPct, formatPerShare, formatUsd, formatUsdCompact } from "@/lib/orin/format";
import { parseSummary } from "@/lib/orin/parse-summary";
import type { FilingApiSuccess } from "@/lib/orin/api-types";
import type { MetricValue } from "@/lib/orin/types";
import {
  Analysis,
  Bento,
  HealthCard,
  MissCard,
  MoreNumbers,
  PlainEnglish,
  ResultHeader,
  StatCard,
  cardShell,
} from "./result-parts";

// The chart's stand-in, the same box while the chart is off screen (LazyWhenVisible) and while
// its code downloads: the chart's exact size (its root is h-52 w-full, revenue-chart.tsx), so
// nothing below it moves and the swap between the two is invisible.
const chartPlaceholder = "h-52 w-full rounded-xl bg-sand-100/60";

const RevenueChart = dynamic(() => import("./revenue-chart"), {
  ssr: false,
  loading: () => <div className={`js-only ${chartPlaceholder}`} aria-hidden />,
});

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function metricValue(m: MetricValue, fmt: (v: number) => string): string | null {
  return m.value === null ? null : fmt(m.value);
}

/** Orin's results screen for one real, cached analysis. */
export function OrinResult({ data, analysisInert }: { data: FilingApiSuccess; analysisInert: boolean }) {
  const { snapshot, summary, summaryNote } = data;
  const m = snapshot.metrics;
  const sections = useMemo(() => parseSummary(summary ?? ""), [summary]);
  const health = useMemo(() => computeBusinessHealth(snapshot), [snapshot]);
  const periodWord = snapshot.form === "10-Q" ? "quarter" : "fiscal year";
  const hasDerivedPoint = snapshot.history.some((p) => p.revenueDerived);

  return (
    <div className="flex flex-col gap-6">
      <ResultHeader
        title={snapshot.companyName}
        ticker={snapshot.ticker}
        meta={`Filing analyzed (${snapshot.form}) · ${periodWord} ended ${formatDate(snapshot.periodEnd)} · filed ${formatDate(snapshot.filedDate)}`}
        href={snapshot.filingUrl}
      />

      {health.available && health.score !== null && health.label !== null ? (
        <HealthCard
          score={String(health.score)}
          outOf="/10"
          label={health.label}
          accent={HEALTH_COLORS[health.label]}
          timeframe="Based on this report compared with the same period a year ago."
          why={health.why ?? ""}
          factors={health.factors}
          disclaimer="A read on how this business is performing, based only on figures from its SEC filings. It is not a stock rating, a prediction, or a recommendation to buy, sell, or hold."
        />
      ) : (
        <section
          aria-label="Business health"
          className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-sand-900/8"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sand-100 ring-1 ring-sand-200">
              <Activity className="size-4 text-sand-500" aria-hidden />
            </span>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              There isn&apos;t enough reported history in this filing to assess the company&apos;s business
              health yet. This can happen with recently public companies or filings missing key figures —
              we&apos;d rather say so than show a misleading score.
            </p>
          </div>
        </section>
      )}

      <Analysis inert={analysisInert}>
        <Bento
          miss={<MissCard items={sections.downplaying} empty={summaryNote ?? undefined} />}
          side={
            <>
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  label="Revenue"
                  explain="money brought in"
                  value={metricValue(m.revenue, formatUsdCompact)}
                  change={m.revenue.yoyPct}
                />
                <StatCard
                  label="Growth"
                  explain="vs. a year ago"
                  value={m.revenue.yoyPct !== null ? formatPct(m.revenue.yoyPct) : null}
                  change={m.revenue.yoyPct}
                  emphasizeChangeColor
                />
                <StatCard
                  label="EPS"
                  explain="profit per share"
                  value={metricValue(m.dilutedEps, formatPerShare)}
                  change={m.dilutedEps.yoyPct}
                />
              </div>

              {snapshot.history.length >= 2 && (
                <Card className={cardShell}>
                  <CardContent className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-base font-semibold tracking-tight">Revenue trend</h4>
                      <p className="text-xs text-muted-foreground">
                        Last {snapshot.history.length}{" "}
                        {snapshot.historyKind === "quarterly" ? "quarters" : "years"} in this sample
                      </p>
                    </div>
                    <LazyWhenVisible placeholderClassName={chartPlaceholder}>
                      <RevenueChart history={snapshot.history} />
                    </LazyWhenVisible>
                    <details>
                      <summary className="cursor-pointer rounded-sm text-sm font-medium text-foreground">
                        View chart data
                      </summary>
                      <table className="mt-3 w-full table-fixed text-left text-xs tabular-nums sm:text-sm">
                        <caption className="sr-only">Revenue and earnings per share by period</caption>
                        <thead>
                          <tr>
                            <th scope="col">Period ended</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Earnings per share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshot.history.map((p) => (
                            <tr key={p.periodEnd} className="border-t border-border">
                              <th scope="row" className="py-1.5 pr-2 font-normal">
                                {formatDate(p.periodEnd)}
                              </th>
                              <td className="pr-2">
                                {formatUsd(p.revenue)}
                                {p.revenueDerived ? " (calculated)" : ""}
                              </td>
                              <td>{p.eps === null ? "Not available" : formatPerShare(p.eps)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </details>
                    {hasDerivedPoint && (
                      <p className="text-[11px] leading-4 text-muted-foreground">
                        Companies don&apos;t file a separate fourth-quarter report, so those points are
                        calculated from the annual total minus the three reported quarters.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <MoreNumbers
                rows={[
                  {
                    label: "Net income",
                    explain: "profit after all costs",
                    value: metricValue(m.netIncome, formatUsd),
                  },
                  {
                    label: "Operating income",
                    explain: "profit from day-to-day business",
                    value: metricValue(m.operatingIncome, formatUsd),
                  },
                  {
                    label: "Gross margin",
                    explain: "share of sales kept after direct costs",
                    value: metricValue(m.grossMarginPct, (v) => formatPct(v, false)),
                  },
                  {
                    label: "Total assets",
                    explain: "everything the company owns",
                    value: metricValue(m.totalAssets, formatUsd),
                  },
                  {
                    label: "Total liabilities",
                    explain: "everything it owes",
                    value: metricValue(m.totalLiabilities, formatUsd),
                  },
                ]}
              />
            </>
          }
          summary={
            <PlainEnglish
              intro={summary ? sections.intro : []}
              notable={summary ? sections.notable : []}
              empty={summaryNote ?? undefined}
            />
          }
        />
        <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          Figures are reported in or derived from SEC filings. Orin calculates the health score; the
          explanations are AI-written using only those figures. Not investment advice.
        </p>
      </Analysis>
    </div>
  );
}
