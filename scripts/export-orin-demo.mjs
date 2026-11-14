// Export real Orin analyses from Orin's Supabase cache (table `cached_filings`)
// into content/orin-demo/<TICKER>.json for the homepage demo.
//
// Read-only: one SELECT through Supabase's REST API. Nothing is written to the
// database, and no key is ever printed.
//
// Usage (env file is Orin's, not this repo's):
//   node --env-file=<path-to-Orin>/.env.local scripts/export-orin-demo.mjs AAPL NVDA TSLA AMZN

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the env file.");
  process.exit(1);
}

const tickers = process.argv.slice(2).map((t) => t.toUpperCase());
if (tickers.length === 0) {
  console.error("Pass at least one ticker, e.g. AAPL NVDA TSLA AMZN");
  process.exit(1);
}

const headers = { apikey: key, Accept: "application/json" };
// Legacy JWT service keys also want a Bearer header; new sb_secret_ keys don't.
if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`;

const query = new URLSearchParams({
  select: "accession_number,ticker,form,period_end,cached_at,result",
  ticker: `in.(${tickers.join(",")})`,
  order: "period_end.desc,cached_at.desc",
});

const res = await fetch(`${url}/rest/v1/cached_filings?${query}`, { headers });
if (!res.ok) {
  console.error(`Supabase returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const rows = await res.json();

const outDir = path.join(process.cwd(), "content", "orin-demo");
await mkdir(outDir, { recursive: true });

for (const ticker of tickers) {
  // Latest filing for this ticker (rows are ordered newest period first).
  const row = rows.find((r) => r.ticker === ticker);
  if (!row) {
    console.log(`${ticker}: not in Orin's cache`);
    continue;
  }
  const others = rows.filter((r) => r.ticker === ticker).length - 1;
  const file = {
    exportedAt: new Date().toISOString(),
    source: {
      table: "cached_filings",
      accessionNumber: row.accession_number,
      form: row.form,
      periodEnd: row.period_end,
      cachedAt: row.cached_at,
    },
    result: row.result,
  };
  await writeFile(path.join(outDir, `${ticker}.json`), JSON.stringify(file, null, 2) + "\n");
  const s = row.result?.summary;
  console.log(
    `${ticker}: ${row.form} period ${row.period_end}, accession ${row.accession_number}, ` +
      `cached ${row.cached_at}, summary ${s ? `${s.length} chars` : "MISSING"}` +
      (others > 0 ? ` (${others} older filing(s) skipped)` : ""),
  );
}
