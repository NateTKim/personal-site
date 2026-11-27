"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WindowFrame } from "@/components/site/window-frame";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-media-query";
import { DEMO_TICKERS, type DemoSample, type DemoTicker } from "@/lib/orin/demo-data";
import { OrinResult, formatDate } from "./orin-result";
import { NateResult } from "./nate-result";
import { ANALYSIS_ID } from "./result-parts";

// Stricter than Orin's TICKER_RE: up to 10 characters, letters with single dots or hyphens between them.
const TICKER_INPUT_RE = /^(?=.{1,10}$)[A-Za-z]+(?:[.-][A-Za-z]+)*$/;

type View = { kind: "sample"; ticker: DemoTicker } | { kind: "nate" } | { kind: "live"; ticker: string };

function isDemoTicker(t: string): t is DemoTicker {
  return (DEMO_TICKERS as readonly string[]).includes(t);
}

/**
 * Orin's results screen with real cached output, inside one of the site's
 * window frames. The frame is static (no scroll zoom: the hero's zoom is the
 * site's only large animation) and its chrome is the site's; only its body
 * looks like Orin. That body is the .orin-theme scope, and `fontClassName`
 * attaches Orin's fonts there (their CSS variables are set on it and nowhere
 * else). The window title works as the address bar.
 *
 * With JS off, the server HTML holds the AAPL sample in full (the <noscript>
 * style below removes the preview clip) and the revenue chart's data table.
 */
export function OrinDemo({
  samples,
  fontClassName,
}: {
  samples: Record<DemoTicker, DemoSample>;
  fontClassName: string;
}) {
  const [view, setView] = useState<View>({ kind: "sample", ticker: "AAPL" });
  const [input, setInput] = useState("");
  const [announce, setAnnounce] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [inputError, setInputError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  // The collapsed preview's faded part is inert only once hydrated, so the server HTML
  // (all there is with JS off) never carries `inert`.
  const analysisInert = useHydrated() && !expanded;

  useEffect(() => {
    console.info("%cOrin demo: try the ticker NATE.", "font-weight:600");
  }, []);

  function show(raw: string) {
    const symbol = raw.trim();
    if (!TICKER_INPUT_RE.test(symbol)) {
      setInputError(
        !symbol
          ? "Enter a stock ticker, such as AAPL."
          : "Enter a ticker of up to 10 characters, such as AAPL or BRK.B.",
      );
      setAnnounce("");
      return;
    }
    const t = symbol.toUpperCase();
    setInputError("");
    setExpanded(false);
    if (isDemoTicker(t)) {
      setView({ kind: "sample", ticker: t });
      setAnnounce(`Showing Orin's sample analysis for ${samples[t].result.snapshot.companyName}.`);
    } else if (t === "NATE") {
      setView({ kind: "nate" });
      setAnnounce("Showing the NATE easter egg, a joke result built from Nate's resume.");
    } else {
      setView({ kind: "live", ticker: t });
      setAnnounce(`${t} isn't one of the bundled samples. A link to look it up on Orin is shown.`);
    }
  }

  const currentTicker = view.kind === "sample" ? view.ticker : view.kind === "nate" ? "NATE" : view.ticker;
  const url = `readorin.com/?ticker=${currentTicker}`;
  const sample = view.kind === "sample" ? samples[view.ticker] : null;

  return (
    <WindowFrame size="sm" title={url} bodyClassName={cn("orin-theme", fontClassName)}>
      <div className="@container relative bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-50/60 to-transparent"
        />
        <div className="relative flex flex-col gap-4 p-4 pb-0 @lg:gap-5 @lg:px-8 @lg:pt-7">
          {/* Orin's app header: wordmark + compact search form. Below 24rem the form
              takes its own full-width row, so it never runs past the frame. */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">Orin</span>
            <form
              className="js-only flex w-full items-end gap-2 @sm:w-auto"
              onSubmit={(e) => {
                e.preventDefault();
                show(input);
              }}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1 @sm:flex-none">
                <label htmlFor="demo-ticker" className="text-xs text-muted-foreground">
                  Stock ticker
                </label>
                <Input
                  id="demo-ticker"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  placeholder="e.g. MSFT"
                  aria-invalid={inputError ? true : undefined}
                  aria-describedby="demo-ticker-error"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="h-11 rounded-xl bg-card text-base shadow-card @sm:w-40 @lg:w-48"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl px-5 shadow-[0_6px_16px_-8px_var(--color-brand-600)]"
              >
                Explain it
              </Button>
            </form>
          </div>
          <p id="demo-ticker-error" role="alert" className="js-only text-sm text-destructive empty:sr-only">
            {inputError}
          </p>

          <div className="js-only flex flex-wrap items-center gap-2" role="group" aria-label="Sample tickers">
            <span className="mr-1 text-sm text-muted-foreground">Cached samples:</span>
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
                <strong className="font-semibold">
                  Historical demo · cached sample · not investment advice.
                </strong>{" "}
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

        {/* The result is shown as a preview so the page stays skimmable: everything below
            the health card (the result's Analysis) fades out under the button and is inert
            until "Show the full analysis" opens it in place. With JS off the <noscript>
            style below removes the clip. */}
        <div className="relative p-4 @lg:px-8 @lg:py-6">
          <div
            ref={resultRef}
            id="orin-demo-result"
            className={cn(
              "demo-result flex flex-col gap-6",
              !expanded && "max-h-[62rem] overflow-hidden @4xl:max-h-[56rem]",
            )}
          >
            {sample && <OrinResult data={sample.result} analysisInert={analysisInert} />}
            {view.kind === "nate" && <NateResult analysisInert={analysisInert} />}
            {view.kind === "live" && <RunLive ticker={view.ticker} />}
          </div>

          {(sample || view.kind === "nate") && (
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
                aria-controls={ANALYSIS_ID}
                onClick={() => {
                  if (expanded) resultRef.current?.scrollIntoView({ block: "nearest" });
                  setExpanded((e) => !e);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-5 text-sm font-medium text-foreground shadow-card-lg ring-1 ring-sand-900/10 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {expanded ? "Show less" : "Show the full analysis"}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200 motion-reduce:transition-none",
                    expanded && "rotate-180",
                  )}
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
    </WindowFrame>
  );
}

function RunLive({ ticker }: { ticker: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 shadow-card ring-1 ring-sand-900/8 @lg:p-8">
      <h3 className="font-display text-2xl font-medium tracking-tight">
        {ticker} isn&apos;t one of the four samples here.
      </h3>
      <p className="max-w-[60ch] text-[15px] leading-7 text-foreground/90">
        This demo contains four cached samples. You can look up {ticker} on the live Orin site.
      </p>
      <a
        href={`https://readorin.com/?ticker=${encodeURIComponent(ticker)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
      >
        Look up {ticker} on Orin
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only">(opens readorin.com in a new tab)</span>
      </a>
    </div>
  );
}
