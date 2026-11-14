// Real Orin output, exported from Orin's Supabase cache (table cached_filings)
// by scripts/export-orin-demo.mjs. Never hand-edit these files.
import AAPL from "@/content/orin-demo/AAPL.json";
import NVDA from "@/content/orin-demo/NVDA.json";
import TSLA from "@/content/orin-demo/TSLA.json";
import AMZN from "@/content/orin-demo/AMZN.json";
import type { FilingApiSuccess } from "./api-types";

export interface DemoSample {
  exportedAt: string;
  source: {
    table: string;
    accessionNumber: string;
    form: string;
    periodEnd: string;
    cachedAt: string;
  };
  result: FilingApiSuccess;
}

export const DEMO_TICKERS = ["AAPL", "NVDA", "TSLA", "AMZN"] as const;
export type DemoTicker = (typeof DEMO_TICKERS)[number];

export const demoSamples: Record<DemoTicker, DemoSample> = {
  AAPL: AAPL as unknown as DemoSample,
  NVDA: NVDA as unknown as DemoSample,
  TSLA: TSLA as unknown as DemoSample,
  AMZN: AMZN as unknown as DemoSample,
};

/** Orin's own ticker check (app/api/filing/[ticker]/route.ts). */
export const TICKER_RE = /^[A-Za-z][A-Za-z.\-]{0,9}$/;
