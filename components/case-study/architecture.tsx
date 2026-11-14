// Orin's request path, drawn as HTML so it reflows at 375px and reads with a
// screen reader. Every step is taken from the Orin repo
// (app/api/filing/[ticker]/route.ts, lib/edgar/*, lib/summarize.ts,
// lib/cache.ts, lib/rate-limit.ts, lib/health/score.ts).
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = "Vercel" | "SEC EDGAR" | "Supabase" | "Claude API" | "Browser";

const SERVICE_STYLE: Record<Service, string> = {
  Browser: "bg-sand-100 text-sand-800 ring-sand-200",
  Vercel: "bg-sand-100 text-sand-800 ring-sand-200",
  "SEC EDGAR": "bg-[oklch(0.96_0.04_78)] text-[oklch(0.45_0.1_68)] ring-[oklch(0.86_0.07_75)]",
  Supabase: "bg-up/10 text-up ring-up/25",
  "Claude API": "bg-brand-50 text-brand-700 ring-brand-200",
};

const STEPS: Array<{ title: string; detail: string; service: Service; branch?: string }> = [
  { title: "Type a ticker", detail: "The page calls /api/filing/[ticker].", service: "Browser" },
  {
    title: "Validate on the server",
    detail: "The ticker must match a strict pattern before any outside call is made.",
    service: "Vercel",
  },
  {
    title: "Find the latest 10-Q or 10-K",
    detail: "A cheap lookup that returns the filing's accession number.",
    service: "SEC EDGAR",
  },
  {
    title: "Check the cache",
    detail: "Keyed on the accession number.",
    service: "Supabase",
    branch: "Hit: return the stored analysis. No EDGAR facts, no AI call.",
  },
  {
    title: "Rate limit, then de-duplicate",
    detail: "Misses only: a per-IP limit, and concurrent requests for one filing share one analysis.",
    service: "Vercel",
  },
  {
    title: "Extract the numbers",
    detail: "XBRL company facts, with an ordered list of fallback tags per metric.",
    service: "SEC EDGAR",
  },
  {
    title: "Write the summary",
    detail: "The model gets the extracted figures as the only numbers it may use, plus the filing text.",
    service: "Claude API",
  },
  {
    title: "Check for invented numbers",
    detail: "Any number not in the allowed set withholds the whole summary. Only clean results are cached.",
    service: "Vercel",
  },
  {
    title: "Show it, then score it",
    detail: "Business Health is computed from the extracted metrics with plain arithmetic.",
    service: "Browser",
  },
];

export function ArchitectureDiagram() {
  return (
    <figure className="not-prose mt-8 rounded-2xl bg-card p-5 shadow-card ring-1 ring-sand-900/8 sm:p-7">
      <figcaption className="text-sm font-semibold tracking-tight">
        One lookup, from ticker to result
      </figcaption>
      <ol className="mt-5 flex flex-col">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col items-stretch">
            <div className="flex gap-4 rounded-xl p-3 ring-1 ring-sand-900/6 sm:p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-[13px] font-semibold text-sand-700 tabular-nums">
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-foreground">{s.title}</p>
                  <p className="text-sm leading-6 text-sand-700">{s.detail}</p>
                  {s.branch && (
                    <p className="mt-1.5 inline-flex rounded-lg bg-up/8 px-2.5 py-1 text-xs leading-5 text-up ring-1 ring-up/20">
                      {s.branch}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                    SERVICE_STYLE[s.service],
                  )}
                >
                  {s.service}
                </span>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowDown className="mx-auto my-1 size-4 text-sand-400" aria-hidden />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-sand-700">
        Alongside the request path: Clerk handles sign-in, and saved stocks live in Supabase Postgres behind
        row-level security. Everything deploys to Vercel from GitHub.
      </p>
    </figure>
  );
}
