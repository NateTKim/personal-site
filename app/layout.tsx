import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealObserver } from "@/components/reveal-observer";
import { heroIntro, person } from "@/content/site";
import "./globals.css";

// Every route on this site must be fully static.
export const ensureStatic = "navigation";

// Same pairing as Orin: Inter for UI/body, Fraunces for display.
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-serif", subsets: ["latin"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${person.name} (${person.legalName})`, template: `%s · ${person.name}` },
  description: heroIntro,
  openGraph: {
    title: person.name,
    description: heroIntro,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfaf6",
  colorScheme: "light",
};

// Runs before first paint: marks motion as allowed so the demo frame can
// start in its zoomed-out pose without a visible snap. With JS off (or
// reduced motion) the class is never added and everything renders flat.
const motionFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

// With JS off: hide controls that only work with JS, and turn screen-reader
// text fallbacks (chart data tables) into visible content.
const noJsCss = `.js-only{display:none!important}.nojs-visible{position:static!important;width:auto!important;height:auto!important;clip:auto!important;clip-path:none!important;overflow:visible!important;white-space:normal!important;margin:0!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <noscript>
          <style>{noJsCss}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-card-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
