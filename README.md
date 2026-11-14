# Nate Kim — personal site

Next.js 16 (App Router, Cache Components), TypeScript, Tailwind v4, shadcn/ui (base-nova),
Motion, cmdk, Recharts, MDX. Every route is static (`ensureStatic = "navigation"` on the root
layout).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | Where |
| --- | --- |
| Every fact on the site, with its source | `content/site.ts` |
| Real Orin output for the demo | `content/orin-demo/*.json` |
| Public resume (phone and ZIP removed) | `public/Nathanael_Kim_Resume.pdf` |
| Orin case study | `app/orin/page.mdx` |
| Code copied from Orin (keep identical) | `lib/orin/*`, `components/ui/*` |

## Rules for content

- Every number, date, tool and outcome must trace to the resume, the build brief, or Nate.
  Tag new entries in `content/site.ts` the same way.
- The NATE easter egg (`components/orin/nate-result.tsx`) uses resume facts only.
- Never hand-write financial figures in the demo. Refresh them with the export script.

## Refreshing the Orin demo data

The four samples are exported from Orin's Supabase cache (`cached_filings`). The script is
read-only and never prints a key.

1. Look up AAPL, NVDA, TSLA and AMZN on readorin.com so the cache holds their latest filings.
2. Run, pointing at Orin's env file:

```bash
node --env-file=<path-to-Orin>/.env.local scripts/export-orin-demo.mjs AAPL NVDA TSLA AMZN
```

## Open items

- Screenshots for `/orin`: add `public/orin/results.png` and `public/orin/health.png`. Until
  then the page shows visible TODO boxes.
- The Chewy pitch deck is intentionally not linked. To link it, add `href` and `linkLabel` to
  its entry in `content/site.ts`.
- `content/Nathanael_Kim_Resume_Public.pdf` is gitignored: it still contains an unused PDF object
  with the old header (phone, ZIP). Only the rebuilt copy in `public/` ships.
- Not deployed. No domain yet; `metadataBase` falls back to Vercel's production URL.
