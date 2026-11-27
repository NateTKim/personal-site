# Nate Kim — personal site

Next.js 16 (App Router, Cache Components), TypeScript, Tailwind v4, shadcn/ui (base-nova),
Motion, cmdk, Recharts, MDX. Every route is static (`ensureStatic = "navigation"` on the root
layout).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Regression checks

From a fresh clone:

```bash
npm ci
npx playwright install chromium firefox webkit   # Linux CI: add --with-deps
npm run build
npm test
```

Before a push, also run `npm run lint`, `npx tsc --noEmit` and `npx prettier --check .`.
Run `tsc` after a build or `next dev`: they generate `next-env.d.ts` and the route types
(`PageProps`, `LayoutProps`) it needs, so in a fresh clone it fails before the first build.

`npm test` runs `npm run test:http`, then `npm run test:browser`, on Node's built-in test
runner. Each suite starts `next start` from the existing build on a free local port and stops
it (with its child processes) when it ends; without a build it stops at once and asks for
`npm run build`. Set `TEST_SITE_URL` to test a server that is already running instead.

- `test:http`: routes, titles and descriptions, canonical links, security headers, sitemap,
  robots, the `/orin` redirect, the 404 page, private paths and public assets.
- `test:browser`: Chromium, Firefox and WebKit through Playwright, with standard and reduced
  motion where it matters. It covers layout at nine widths, the command menu (focus trap and
  restoration, the idle preload, typing straight after the first Ctrl+K), the Orin demo
  (collapsed preview inert, labels, chart data and inputs, all checked against
  `content/orin-demo/*.json`), the hero zoom, the site with JavaScript off, and axe-core on
  every page in Chromium.

Playwright and axe-core are dev dependencies imported only by `tests/`, so nothing from them
reaches the client bundle.

## Where things live

| What                                                               | Where                                                                                        |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Every fact on the site, tagged with its source                     | `content/profile.ts`, `content/work.ts`, `content/stats.ts`, `content/work-pages.ts`         |
| Facts for `/info` (the resume page)                                | `content/info.ts`                                                                            |
| Copy for the five `/work/<slug>` pages                             | `content/work-pages.ts` (template: `components/work/work-page.tsx`)                          |
| The Orin demo's NATE easter egg (a joke built from the master)     | `content/nate-egg.ts`                                                                        |
| Colors: five palette tokens; everything else is mixed from them    | the `PALETTE` block at the top of `app/globals.css`                                          |
| Real Orin output for the demo (`/work/orin`)                       | `content/orin-demo/*.json`                                                                   |
| Orin screenshot on the home page                                   | `public/orin/results.png`                                                                    |
| Photos on `/info` (EXIF-stripped web copies; originals never ship) | `public/info/*.jpg`, listed in `content/info.ts`                                             |
| Public resume (phone and ZIP removed)                              | `public/Nathanael_Kim_Resume.pdf`                                                            |
| Link-preview image (og:image, also used for twitter:image)         | `app/opengraph-image.tsx`; its fonts are static TTFs in `fonts/` (OFL, licences beside them) |
| Page metadata: canonical link, og:url, the image on every page     | `lib/page-metadata.ts`                                                                       |
| Code copied from Orin (keep identical)                             | `lib/orin/*`, `components/ui/*`                                                              |

## Rules for content

- Every number, date, tool and outcome must trace to the master resume, to the public resume
  where Nate asked for it, or to Nate. Tag new entries the same way as in `content/work.ts`.
- A fact that is still waiting for Nate is shown with a visible TODO marker
  (`components/site/todo.tsx`).
- The NATE easter egg uses master facts only, from `content/nate-egg.ts`.
- Orin's fonts (Inter, Fraunces) load on `/work/orin` only (`app/work/orin/page.tsx`) and are
  scoped to the demo frame's `.orin-theme` body. Recharts loads there only, and lazily.
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

- The master resume is `content/master-resume.txt`, a text extraction of
  `content/Nathanael Kim — Master Resume.pdf` (2026-11-19; the PDF wins where the text is
  ambiguous). Both are gitignored. Source tags in `content/*.ts` point to it as
  `[M] Section › Entry, bullet n`.
- The Chewy pitch deck is intentionally not linked.
- `content/Nathanael_Kim_Resume_Public.pdf` is gitignored: it still contains an unused PDF object
  with the old header (phone, ZIP). Only the rebuilt copy in `public/` ships.
- Live at https://nathanaelkim.com (Vercel; every push to `main` deploys). It is the only
  production URL. Canonical links, og:url and the preview image use `profile.siteHost`.
  Vercel handles hostname redirects in the project's Domains settings: www.nathanaelkim.com
  and natekim-three.vercel.app redirect to https://nathanaelkim.com with the path and query
  kept, and http redirects to https. One certificate covers nathanaelkim.com and
  \*.nathanaelkim.com. Checked 2026-11-27: the Vercel URL answers 308 (permanent), www
  still answers 307 (temporary) and should be switched to 308 in the Domains settings.
