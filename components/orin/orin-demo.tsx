"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEMO_TICKERS, TICKER_RE, type DemoSample, type DemoTicker } from "@/lib/orin/demo-data";
import { DemoFrame } from "./demo-frame";
import { OrinResult, formatDate } from "./orin-result";
import { NateResult } from "./nate-result";

type View =
  | { kind: "sample"; ticker: DemoTicker }
  | { kind: "nate" }
  | { kind: "live"; ticker: string }
  | { kind: "invalid" };

function isDemoTicker(t: string): t is DemoTicker {
  return (DEMO_TICKERS as readonly string[]).includes(t);
}

export function OrinDemo({ samples }: { samples: Record<DemoTicker, DemoSample> }) {
  const [view, setView] = useState<View>({ kind: "sample", ticker: "AAPL" });
  const [input, setInput] = useState("");
  const [announce, setAnnounce] = useState("");
  const [expanded, setExpanded] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.info("%cOrin demo: try the ticker NATE.", "color:#3b64dd;font-weight:600");
  }, []);

  function show(raw: string) {
    const t = raw.trim().toUpperCase();
    if (!t) return;
    setExpanded(false);
    if (isDemoTicker(t)) {
      setView({ kind: "sample", ticker: t });
      setAnnounce(`Showing Orin's sample analysis for ${samples[t].result.snapshot.companyName}.`);
    } else if (t === "NATE") {
      setView({ kind: "nate" });
      setAnnounce("Showing the NATE easter egg, a joke result built from Nate's resume.");
    } else if (TICKER_RE.test(t)) {
      setView({ kind: "live", ticker: t });
      setAnnounce(`${t} isn't one of the bundled samples. A link to run it live on Orin is shown.`);
    } else {
      setView({ kind: "invalid" });
      setAnnounce("That doesn't look like a stock ticker.");
    }
  }

  const currentTicker =
    view.kind === "sample"
      ? view.ticker
      : view.kind === "nate"
        ? "NATE"
        : view.kind === "live"
          ? view.ticker
          : "";
  const url = `readorin.com/${currentTicker ? `?ticker=${currentTicker}` : ""}`;
  const sample = view.kind === "sample" ? samples[view.ticker] : null;

  return (
    <DemoFrame url={url}>
      <div className="@container relative bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-50/60 to-transparent"
        />
        <div className="relative flex flex-col gap-4 p-4 pb-0 @lg:gap-5 @lg:px-8 @lg:pt-7">
          {/* Orin's app header: wordmark + compact search form */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">Orin</span>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                show(input);
              }}
            >
              <label htmlFor="demo-ticker" className="sr-only">
                Stock ticker
              </label>
              <Input
                id="demo-ticker"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Any ticker, e.g. MSFT"
                maxLength={10}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="h-11 w-40 rounded-xl bg-card text-base shadow-card @lg:w-48"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl px-5 shadow-[0_6px_16px_-8px_var(--color-brand-600)]"
              >
                Explain it
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sample tickers">
            <span className="mr-1 text-sm text-muted-foreground">Real samples:</span>
            {DEMO_TICKERS.map((t) => {
              const active = view.kind === "sample" && view.ticker === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => show(t)}
                  className={cn(
                    "h-8 rounded-full px-3.5 text-sm font-medium tracking-wide ring-1 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground ring-primary"
                      : "bg-card text-sand-800 ring-sand-900/10 hover:bg-brand-50 hover:text-brand-700",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* What this is, stated on the frame itself. */}
          {sample && (
            <p className="flex items-start gap-2 rounded-xl bg-sand-100 px-3.5 py-2.5 text-xs leading-5 text-sand-700 ring-1 ring-sand-900/5">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Sample output · not investment advice.</strong>{" "}
                {sample.result.snapshot.companyName} {sample.source.form} for the{" "}
                {sample.source.form === "10-Q" ? "quarter" : "fiscal year"} ended{" "}
                {formatDate(sample.source.periodEnd)}, filed {formatDate(sample.result.snapshot.filedDate)}.
                Generated by Orin on {formatDate(sample.source.cachedAt.slice(0, 10))} and exported from its
                cache.
              </span>
            </p>
          )}

          <div role="status" className="sr-only">
            {announce}
          </div>
        </div>

        {/* The result is shown as a preview so the page stays skimmable;
            "Show the full analysis" opens the rest in place. With JS off the
            <noscript> style below removes the clip. */}
        <div className="relative p-4 @lg:px-8 @lg:py-6">
          <div
            ref={resultRef}
            id="orin-demo-result"
            className={cn(
              "demo-result flex flex-col gap-6",
              !expanded && "max-h-[62rem] overflow-hidden @4xl:max-h-[56rem]",
            )}
          >
            {view.kind === "sample" && sample && <OrinResult data={sample.result} />}
            {view.kind === "nate" && <NateResult />}
            {view.kind === "live" && <RunLive ticker={view.ticker} />}
            {view.kind === "invalid" && (
              <p className="rounded-2xl bg-card p-6 text-sm text-muted-foreground shadow-card ring-1 ring-sand-900/8">
                That doesn&apos;t look like a stock ticker. Try something like AAPL.
              </p>
            )}

            <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
              {view.kind === "nate"
                ? "All numbers come straight from Nate's resume. The jokes are hand-written. Not investment advice."
                : "All numbers come straight from the company's official SEC report. The explanations are AI-written using only those numbers. Not investment advice."}
            </p>
          </div>

          {(view.kind === "sample" || view.kind === "nate") && (
            <div
              className={cn(
                "demo-expand flex justify-center",
                expanded
                  ? "pt-6"
                  : "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background from-35% to-transparent pt-28 pb-6",
              )}
            >
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls="orin-demo-result"
                onClick={() => {
                  if (expanded) resultRef.current?.scrollIntoView({ block: "nearest" });
                  setExpanded((e) => !e);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-5 text-sm font-medium text-foreground shadow-card-lg ring-1 ring-sand-900/10 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {expanded ? "Show less" : "Show the full analysis"}
                <ChevronDown
                  className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
                  aria-hidden
                />
              </button>
            </div>
          )}
          <noscript>
            <style>{`.demo-result{max-height:none!important;overflow:visible!important}.demo-expand{display:none!important}`}</style>
          </noscript>
        </div>
      </div>
    </DemoFrame>
  );
}

function RunLive({ ticker }: { ticker: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 shadow-card ring-1 ring-sand-900/8 @lg:p-8">
      <h3 className="font-display text-2xl font-medium tracking-tight">
        {ticker} isn&apos;t one of the four samples here.
      </h3>
      <p className="max-w-[60ch] text-[15px] leading-7 text-foreground/90">
        This page only bundles real Orin output for AAPL, NVDA, TSLA and AMZN. Orin itself can pull {ticker}
        &apos;s latest 10-Q or 10-K from SEC EDGAR and explain it.
      </p>
      <a
        href={`https://readorin.com/?ticker=${encodeURIComponent(ticker)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
      >
        Run {ticker} live on Orin
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only">(opens readorin.com in a new tab)</span>
      </a>
    </div>
  );
}
